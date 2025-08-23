
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadResumePhoto, validateImageFile, fileToBase64 } from '../../services/storage';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { showSuccess, showError } from '../../services/notifications';

const PhotoUpload = ({ currentPhoto, onPhotoUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
    setUploadProgress(0);

    try {
      // Try Firebase Storage first
      if (user) {
        try {
          // Add progress tracking for Firebase upload
          setUploadProgress(20);
          const result = await uploadResumePhoto(user.uid, 'default', file);
          setUploadProgress(80);
          
          if (result.success) {
            // Pass the Firebase URL with a flag indicating it should be persisted
            onPhotoUpload(result.url, { shouldPersist: true });
            setUploadProgress(100);
            showSuccess('Photo Uploaded', 'Your profile photo has been uploaded successfully!');
            setUploading(false);
            setTimeout(() => setUploadProgress(0), 1000); // Reset progress after 1 second
            return;
          }
        } catch (firebaseError) {
          console.warn('Firebase Storage upload failed, falling back to base64:', firebaseError);
          setUploadProgress(0);
        }
      }

      // Fallback to base64 encoding for local storage with optimization
      setUploadProgress(30);
      fileToBase64(file)
        .then(base64Url => {
          setUploadProgress(95);
          // Pass base64 URL with flag indicating it's for local preview only
          onPhotoUpload(base64Url, { localOnly: true });
          setUploadProgress(100);
          showSuccess('Photo Uploaded', 'Your profile photo has been uploaded successfully!');
          setUploading(false);
          setTimeout(() => setUploadProgress(0), 1000); // Reset progress after 1 second
        })
        .catch(error => {
          console.error('Base64 conversion error:', error);
          setError('Failed to process image file');
          showError('Upload Failed', 'Failed to process the image file. Please try again.');
          setUploading(false);
          setUploadProgress(0);
        });

    } catch (error) {
      console.error('Photo upload error:', error);
      setError('Failed to upload photo. Please try again.');
      showError('Upload Failed', 'Failed to upload photo. Please try again.');
      setUploading(false);
      setUploadProgress(0);
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

        {(uploading || uploadProgress > 0) && (
          <div className="photo-overlay">
            {uploadProgress > 0 && uploadProgress < 100 ? (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{uploadProgress}%</span>
              </div>
            ) : (
              <LoadingSpinner size="small" />
            )}
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
