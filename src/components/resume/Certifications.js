import React from 'react';
import { useResume } from '../../contexts/ResumeContext';
import Button from '../common/Button';

const Certifications = () => {
  const { 
    certifications, 
    addCertification, 
    updateCertification, 
    removeCertification 
  } = useResume();

  const handleAddCertification = () => {
    addCertification();
  };

  const handleUpdateCertification = (id, field, value) => {
    updateCertification(id, { [field]: value });
  };

  const handleRemoveCertification = (id) => {
    if (window.confirm('Are you sure you want to remove this certification?')) {
      removeCertification(id);
    }
  };

  return (
    <div className="section-form">
      <h2 className="section-title">Certifications</h2>
      <p className="section-description">
        Add your professional certifications, licenses, and credentials.
      </p>

      <div className="dynamic-list">
        {certifications.map((cert, index) => (
          <div key={cert.id} className="dynamic-list-item">
            <div className="dynamic-list-item-header">
              <h3 className="dynamic-list-item-title">
                Certification {index + 1}
              </h3>
              <div className="dynamic-list-item-actions">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveCertification(cert.id)}
                >
                  <i className="fas fa-trash"></i>
                  Remove
                </Button>
              </div>
            </div>

            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Certification Name *</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleUpdateCertification(cert.id, 'name', e.target.value)}
                    className="form-control"
                    placeholder="e.g., AWS Certified Developer"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Issuing Organization *</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => handleUpdateCertification(cert.id, 'issuer', e.target.value)}
                    className="form-control"
                    placeholder="e.g., Amazon Web Services"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date Obtained</label>
                  <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => handleUpdateCertification(cert.id, 'date', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Credential ID</label>
                  <input
                    type="text"
                    value={cert.credentialId}
                    onChange={(e) => handleUpdateCertification(cert.id, 'credentialId', e.target.value)}
                    className="form-control"
                    placeholder="Certificate ID or Badge Number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Verification URL</label>
                <input
                  type="url"
                  value={cert.url}
                  onChange={(e) => handleUpdateCertification(cert.id, 'url', e.target.value)}
                  className="form-control"
                  placeholder="https://certification-verification-url.com"
                />
                <div className="form-help">
                  Link to verify the certification online
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="dynamic-list-add-btn"
          onClick={handleAddCertification}
        >
          <i className="fas fa-plus"></i>
          Add Certification
        </button>
      </div>
    </div>
  );
};

export default Certifications;
