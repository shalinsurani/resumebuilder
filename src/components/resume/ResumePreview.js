
import React from 'react';
import { useResume } from '../../contexts/ResumeContext';
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import ExecutiveTemplate from '../templates/ExecutiveTemplate';
import CorporateTemplate from '../templates/CorporateTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import ElegantTemplate from '../templates/ElegantTemplate';
import DanielTemplate from '../templates/DanielTemplate';
import HowardTemplate from '../templates/HowardTemplate';
import { RESUME_TEMPLATES } from '../../utils/constants';
import OverleafTemplate from '../templates/OverleafTemplate';
import Professional2Template from '../templates/Professional2Template';
import Template1 from '../templates/Template1';
import LatexTemplate from '../templates/LatexTemplate';


const ResumePreview = () => {
  const resumeContext = useResume();
  const { template, dispatch, ...resumeData } = resumeContext;

  const renderTemplate = () => {
    switch (template) {
      case RESUME_TEMPLATES.MODERN:
        return <ModernTemplate {...resumeData} />;
      case RESUME_TEMPLATES.CLASSIC:
        return <ClassicTemplate {...resumeData} />;
      case RESUME_TEMPLATES.CREATIVE:
        return <CreativeTemplate {...resumeData} />;
      case RESUME_TEMPLATES.PROFESSIONAL:
        return <ProfessionalTemplate {...resumeData} />;
      case RESUME_TEMPLATES.EXECUTIVE:
        return <ExecutiveTemplate {...resumeData} />;
      case RESUME_TEMPLATES.CORPORATE:
        return <CorporateTemplate {...resumeData} />;
      case RESUME_TEMPLATES.MINIMAL:
        return <MinimalTemplate {...resumeData} />;
      case RESUME_TEMPLATES.ELEGANT:
        return <ElegantTemplate {...resumeData} />;
      case RESUME_TEMPLATES.DANIEL:
        return <DanielTemplate {...resumeData} />;
      case RESUME_TEMPLATES.HOWARD:
        return <HowardTemplate {...resumeData} />;
      case RESUME_TEMPLATES.OVERLEAF:
        return <OverleafTemplate {...resumeData} />;
      case RESUME_TEMPLATES.PROFESSIONAL2:
        return <Professional2Template {...resumeData} />;
      case RESUME_TEMPLATES.TEMPLATE1:
        return <Template1 {...resumeData} />;
      case RESUME_TEMPLATES.LATEX:
        return <LatexTemplate {...resumeData} />;
      default:
        return <CorporateTemplate {...resumeData} />;
    }
  };

  return (
    <div className="resume-preview">
      <div className="preview-header">
        <h3>Resume Preview</h3>
        <div className="template-selector">
          <select
            value={template}
            onChange={(e) => {
              dispatch({
                type: 'UPDATE_TEMPLATE',
                payload: e.target.value
              });
            }}
          >
            <option value={RESUME_TEMPLATES.CORPORATE}>Corporate Professional (with Photo)</option>
            <option value={RESUME_TEMPLATES.MINIMAL}>Minimal Clean</option>
            <option value={RESUME_TEMPLATES.ELEGANT}>Elegant (with Photo)</option>
            <option value={RESUME_TEMPLATES.PROFESSIONAL}>Professional (with Photo)</option>
            <option value={RESUME_TEMPLATES.EXECUTIVE}>Executive</option>
            <option value={RESUME_TEMPLATES.MODERN}>Modern (with Photo)</option>
            <option value={RESUME_TEMPLATES.CLASSIC}>Classic</option>
            <option value={RESUME_TEMPLATES.CREATIVE}>Creative (with Photo)</option>
            <option value={RESUME_TEMPLATES.DANIEL}>Daniel Style - Professional Gray</option>
            <option value={RESUME_TEMPLATES.HOWARD}>Howard Style - Burgundy Sidebar (with Photo)</option>
            <option value={RESUME_TEMPLATES.TEMPLATE1}>Template 1 (Jake Gutierrez LaTeX Style)</option>
            <option value={RESUME_TEMPLATES.OVERLEAF}>Overleaf Style (Clean ATS)</option>
            <option value={RESUME_TEMPLATES.PROFESSIONAL2}>Professional 2 (LaTeX Inspired)</option>
            <option value={RESUME_TEMPLATES.LATEX}>LaTeX Professional (Jake Gutierrez Style)</option>
          </select>
        </div>
      </div>

      <div className="preview-content" id="resume-preview">
        {renderTemplate()}
      </div>
    </div>
  );
};

export default ResumePreview;
