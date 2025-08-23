
import React, { useState } from 'react';
import Button from '../common/Button';
import { useResume } from '../../contexts/ResumeContext';
import PhotoUpload from './PhotoUpload';
import { validateEmail, validatePhone, validateUrl } from '../../utils/helpers';

const PersonalInfo = () => {
  const { personalInfo, dispatch } = useResume();
  const [validationErrors, setValidationErrors] = useState({});
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkError, setLinkError] = useState('');
  const handleAddLink = () => {
    if (!linkName.trim() || !linkUrl.trim()) {
      setLinkError('Both fields are required');
      return;
    }
    if (!/^https?:\/\//.test(linkUrl.trim())) {
      setLinkError('URL must start with http:// or https://');
      return;
    }
    dispatch({ type: 'ADD_CUSTOM_LINK', payload: { name: linkName.trim(), url: linkUrl.trim() } });
    setLinkName('');
    setLinkUrl('');
    setLinkError('');
    setShowLinkInput(false);
  };

  const handleRemoveLink = (idx) => {
    dispatch({ type: 'REMOVE_CUSTOM_LINK', payload: idx });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch({
      type: 'UPDATE_PERSONAL_INFO',
      payload: { [name]: value }
    });

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (value && !validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (value && !validatePhone(value)) {
          error = 'Please enter a valid phone number';
        }
        break;
      case 'linkedin':
        if (value && !validateUrl(value)) {
          error = 'Please enter a valid URL';
        }
        break;
      case 'portfolio':
        if (value && !validateUrl(value)) {
          error = 'Please enter a valid URL';
        }
        break;
      default:
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // Handle photo upload - persist all URLs including Firebase URLs
  const handlePhotoUpload = (photoURL, options = {}) => {
    if (options.localOnly) {
      // For local preview only, do not persist to Firestore
      dispatch({
        type: 'UPDATE_PERSONAL_INFO',
        payload: { photoURL } // This will be in-memory only
      });
    } else {
      // Persist all URLs including Firebase URLs (both http and https)
      dispatch({
        type: 'UPDATE_PERSONAL_INFO',
        payload: { photoURL }
      });
    }
  };

  return (
    <div className="form-section">
      <h3>Personal Information</h3>

      <div className="photo-section">
        <PhotoUpload
          currentPhoto={personalInfo.photoURL}
          onPhotoUpload={handlePhotoUpload}
          resumeId={window.location.search.includes('id=') ? new URLSearchParams(window.location.search).get('id') : undefined}
        />
      </div>

      
        
        <div className="form-group">
          <label htmlFor="fullName">Full Name *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={personalInfo.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="jobRole">Job Role/Title</label>
          <input
            type="text"
            id="jobRole"
            name="jobRole"
            value={personalInfo.jobRole}
            onChange={handleChange}
            placeholder="e.g., Software Engineer, Marketing Manager, UX Designer"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={personalInfo.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="your.email@example.com"
            className={validationErrors.email ? 'error' : ''}
            required
          />
          {validationErrors.email && (
            <span className="error-message">{validationErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={personalInfo.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="+1 (555) 123-4567"
            className={validationErrors.phone ? 'error' : ''}
          />
          {validationErrors.phone && (
            <span className="error-message">{validationErrors.phone}</span>
          )}
        </div>

        <div className="form-group full-width">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={personalInfo.address}
            onChange={handleChange}
            placeholder="City, State, Country"
          />
        </div>

        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn Profile</label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={personalInfo.linkedin}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://linkedin.com/in/yourprofile"
            className={validationErrors.linkedin ? 'error' : ''}
          />
          {validationErrors.linkedin && (
            <span className="error-message">{validationErrors.linkedin}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="portfolio">Portfolio/Website</label>
          <input
            type="url"
            id="portfolio"
            name="portfolio"
            value={personalInfo.portfolio}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://yourportfolio.com"
            className={validationErrors.portfolio ? 'error' : ''}
          />
          {validationErrors.portfolio && (
            <span className="error-message">{validationErrors.portfolio}</span>
          )}
        </div>
        <div className="form-grid">
        <div className="form-group full-width">
          <label>Custom Links</label>
          {personalInfo.customLinks && personalInfo.customLinks.length > 0 && (
            <ul style={{ paddingLeft: 0, marginBottom: 8 }}>
              {personalInfo.customLinks.map((link, idx) => (
                <li key={idx} style={{ listStyle: 'none', marginBottom: 2 }}>
                  <span style={{ fontWeight: 500 }}>{link.name}:</span> <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                  <Button variant="danger" size="small" style={{ marginLeft: 8 }} onClick={() => handleRemoveLink(idx)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}

          {showLinkInput ? (
            <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              <input type="text" placeholder="Name" value={linkName} onChange={e => setLinkName(e.target.value)} style={{ flex: 1 }} />
              <input type="url" placeholder="Hyperlink" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} style={{ flex: 2 }} />
              <Button variant="secondary" size="small" onClick={handleAddLink}>
                <i className="fas fa-plus"></i> Add
              </Button>
              <Button variant="secondary" size="small" onClick={() => { setShowLinkInput(false); setLinkError(''); }}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="small" onClick={() => setShowLinkInput(true)} style={{ marginTop: 4 }}>
              <i className="fas fa-plus"></i> Add Link
            </Button>
          )}
          {linkError && <div style={{ color: 'red', fontSize: '0.8em' }}>{linkError}</div>}
        </div>

      </div>
    </div>
  );
};

export default PersonalInfo;
