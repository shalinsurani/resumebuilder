
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

// Helper function to compress image files
const compressImage = (file, quality = 0.5) => {
  return new Promise((resolve, reject) => {
    // If file is not an image or already small, don't compress
    if (!file.type.startsWith('image/') || file.size < 50 * 1024) { // Less than 50KB
      resolve(file);
      return;
    }

    // Create object URL for faster loading
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      // Revoke object URL to free memory
      URL.revokeObjectURL(objectUrl);
      
      // Set max dimensions (smaller for faster processing)
      const maxWidth = 400;
      const maxHeight = 400;
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      // Create canvas with optimized settings
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d', { alpha: false });
      ctx.imageSmoothingEnabled = false;
      ctx.imageSmoothingQuality = 'low';
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create new file with compressed data
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Could not compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => {
      // Revoke object URL to free memory even on error
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image for compression'));
    };
    
    // Load image from object URL
    img.src = objectUrl;
  });
};

// Helper function to convert file to base64 with progress tracking
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // For very small files, skip compression and go straight to base64
    if (file.size < 30 * 1024) { // Less than 30KB
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
      return;
    }
    
    // For larger files, compress then convert
    compressImage(file)
      .then(compressedFile => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Could not read compressed file'));
        reader.readAsDataURL(compressedFile);
      })
      .catch(() => {
        // If compression fails, fall back to original file
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Could not read file'));
        reader.readAsDataURL(file);
      });
  });
};

export const uploadFile = async (file, path) => {
  try {
    // Compress image before upload if it's an image file
    let fileToUpload = file;
    if (file.type.startsWith('image/')) {
      try {
        fileToUpload = await compressImage(file);
      } catch (compressError) {
        console.warn('Image compression failed, uploading original file:', compressError);
      }
    }
    
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, fileToUpload);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const uploadProfilePhoto = async (userId, file) => {
  const path = `users/${userId}/profile/photo.jpg`;
  return await uploadFile(file, path);
};

export const uploadResumePhoto = async (userId, resumeId, file) => {
  const path = `users/${userId}/resumes/${resumeId}/photo.jpg`;
  return await uploadFile(file, path);
};

export const deleteFile = async (path) => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, or WebP)' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  return { valid: true };
};

export { fileToBase64 };
