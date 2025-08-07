
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadResumePhoto, validateImageFile } from '../../services/storage';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { showSuccess, showError } from '../../services/notifications';

const PhotoUpload = ({ currentPhoto, onPhotoUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      showError('Invalid File', validation.error);
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Try Firebase Storage first
      if (user) {
        try {
          const result = await uploadResumePhoto(user.uid, 'default', file);
          if (result.success) {
            onPhotoUpload(result.url);
            showSuccess('Photo Uploaded', 'Your profile photo has been uploaded successfully!');
            setUploading(false);
            return;
          }
        } catch (firebaseError) {
          console.warn('Firebase Storage upload failed, falling back to base64:', firebaseError);
        }
      }

      // Fallback to base64 encoding for local storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target.result;
        onPhotoUpload(base64Url);
        showSuccess('Photo Uploaded', 'Your profile photo has been uploaded successfully!');
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to process image file');
        showError('Upload Failed', 'Failed to process the image file. Please try again.');
        setUploading(false);
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Photo upload error:', error);
      setError('Failed to upload photo. Please try again.');
      showError('Upload Failed', 'Failed to upload photo. Please try again.');
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    onPhotoUpload('');
    showSuccess('Photo Removed', 'Your profile photo has been removed.');
  };

  return (
    <div className="photo-upload">
      <div className="photo-preview">
        {currentPhoto ? (
          <img src={currentPhoto} alt="Profile" className="photo-img" />
        ) : (
          <div className="photo-placeholder">
            <i className="fas fa-user"></i>
          </div>
        )}

        {uploading && (
          <div className="photo-overlay">
            <LoadingSpinner size="small" />
          </div>
        )}
      </div>

      <div className="photo-controls">
        <input
          type="file"
          id="photo-input"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <Button
          variant="secondary"
          size="small"
          onClick={() => document.getElementById('photo-input').click()}
          disabled={uploading}
        >
          <i className="fas fa-camera"></i>
          {currentPhoto ? 'Change Photo' : 'Upload Photo'}
        </Button>

        {currentPhoto && (
          <Button
            variant="danger"
            size="small"
            onClick={handleRemovePhoto}
            disabled={uploading}
          >
            <i className="fas fa-trash"></i>
            Remove
          </Button>
        )}
      </div>

      {error && (
        <div className="error-message photo-error">
          {error}
        </div>
      )}

      <div className="photo-info">
        <p>Recommended: 300x300px, max 5MB</p>
        <p>Supported formats: JPG, PNG, WebP</p>
      </div>
    </div>
  );
};

export default PhotoUpload;
