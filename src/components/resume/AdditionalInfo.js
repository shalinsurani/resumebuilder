import React from 'react';
import { useResume } from '../../contexts/ResumeContext';
import Button from '../common/Button';
import { createAdditionalInfoItem } from '../../utils/helpers';

const AdditionalInfo = () => {
  const { 
    additionalInfo, 
    addAdditionalInfo, 
    updateAdditionalInfo, 
    removeAdditionalInfo 
  } = useResume();

  const handleAddAdditionalInfo = () => {
    addAdditionalInfo();
  };

  const handleUpdateAdditionalInfo = (id, field, value) => {
    updateAdditionalInfo(id, { [field]: value });
  };

  const handleRemoveAdditionalInfo = (id) => {
    if (window.confirm('Are you sure you want to remove this additional information?')) {
      removeAdditionalInfo(id);
    }
  };

  const additionalInfoTypes = [
    'Workshop/Seminar',
    'Volunteering',
    'Awards',
    'Industry Visit'
  ];

  return (
    <div className="form-section">
      {/* <h2 className="section-title">Additional Information</h2> */}


      <div className="section-header" style={{marginBottom:"10px"}}>
        <h3>Additional Information</h3>
        <Button
          variant="secondary"
          size="small"
          onClick={handleAddAdditionalInfo}
        >
          <i className="fas fa-plus"></i> Additional Information
        </Button>
      </div>


      <p className="section-description">
        Add additional information such as workshops, volunteering experience, awards, or industry visits.
      </p>

      <div className="dynamic-list">
        {additionalInfo.map((info, index) => (
          <div key={info.id} className="dynamic-list-item">
            <div className="dynamic-list-item-header">
              <h4 className="dynamic-list-item-title">
                Additional Information {index + 1}
              </h4>
              <div className="dynamic-list-item-actions">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveAdditionalInfo(info.id)}
                >
                  <i className="fas fa-trash"></i>
                  Remove
                </Button>
              </div>
            </div>

            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select
                    value={info.type}
                    onChange={(e) => handleUpdateAdditionalInfo(info.id, 'type', e.target.value)}
                    className="form-control"
                  >
                    {additionalInfoTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  value={info.description}
                  onChange={(e) => handleUpdateAdditionalInfo(info.id, 'description', e.target.value)}
                  className="form-control"
                  placeholder="Describe your workshop/seminar, volunteering experience, award, or industry visit..."
                  rows="4"
                />
                <div className="form-help">
                  Provide details about your experience, achievement, or participation
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* <Button
          variant="secondary"
          size="small"
          onClick={handleAddAdditionalInfo}
        >
          <i className="fas fa-plus"></i> Add Additional Information
        </Button> */}
      </div>
    </div>
  );
};

export default AdditionalInfo;
