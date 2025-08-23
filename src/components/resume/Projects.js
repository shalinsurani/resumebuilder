
import React, { useState, useRef } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import Button from '../common/Button';
import { createProjectItem } from '../../utils/helpers';
import { generateProjectDescription, isAIConfigured } from '../../services/aiService';
import { humanizeContent } from '../../services/humanizeService';

const Projects = () => {
  const { projects, dispatch } = useResume();
  const [aiLoadingId, setAiLoadingId] = useState(null);
  const [humanizeLoadingId, setHumanizeLoadingId] = useState(null);
  const [aiErrorId, setAiErrorId] = useState(null);
  const inputRefs = useRef({});

  // Humanize the description
  const handleHumanizeDescription = async (project) => {
    if (!project.description) return;
    setHumanizeLoadingId(project.id);
    setAiErrorId(null);

    try {
      if (!isAIConfigured()) {
        setAiErrorId(project.id);
        return;
      }

      const humanizedDesc = await humanizeContent(project.description);

      if (humanizedDesc) {
        updateProject(project.id, 'description', humanizedDesc);
      } else {
        setAiErrorId(project.id);
      }
    } catch (err) {
      console.error('Humanize description error:', err);
      setAiErrorId(project.id);
    } finally {
      setHumanizeLoadingId(null);
    }
  };

  // AI description generation
  const handleGenerateDescription = async (project) => {
    setAiLoadingId(project.id);
    setAiErrorId(null);

    try {
      // Check if AI is configured
      if (!isAIConfigured()) {
        setAiErrorId(project.id);
        return;
      }

      // Generate description using the OpenAI service
      const aiDesc = await generateProjectDescription(project);

      if (aiDesc) {
        updateProject(project.id, 'description', aiDesc);
      } else {
        setAiErrorId(project.id);
      }
    } catch (err) {
      console.error('AI project description generation error:', err);
      setAiErrorId(project.id);
    } finally {
      setAiLoadingId(null);
    }
  };

  const addProject = () => {
    const newProject = createProjectItem();
    dispatch({
      type: 'ADD_PROJECT',
      payload: newProject
    });
  };

  const updateProject = (id, field, value) => {
    const updatedProject = projects.find(project => project.id === id);
    if (updatedProject) {
      dispatch({
        type: 'UPDATE_PROJECT',
        payload: {
          ...updatedProject,
          [field]: value
        }
      });
    }
  };

  const deleteProject = (id) => {
    dispatch({
      type: 'DELETE_PROJECT',
      payload: id
    });
  };

  // Use a timeout to debounce updates and prevent interference
  const timeoutRefs = useRef({});

  const handleTechnologiesChange = (id) => {
    const inputElement = inputRefs.current[id];
    if (!inputElement) return;

    const value = inputElement.value;

    // Clear any existing timeout for this project
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
    }

    // Debounce the project updates to avoid interference with typing
    timeoutRefs.current[id] = setTimeout(() => {
      // Update the project with the raw input value
      updateProject(id, 'technologiesInput', value);

      // Parse technologies
      if (value.trim()) {
        let technologies = [];
        if (value.includes(',')) {
          technologies = value.split(',').map(tech => tech.trim()).filter(tech => tech);
        } else {
          technologies = value.split(/\s+/).map(tech => tech.trim()).filter(tech => tech);
        }
        updateProject(id, 'technologies', technologies);
      } else {
        updateProject(id, 'technologies', []);
      }
    }, 300); // Wait 300ms after user stops typing
  };

  return (
    <div className="form-section">
      <div className="section-header">
        <h3>Projects</h3>
        <Button
          variant="secondary"
          size="small"
          onClick={addProject}
        >
          <i className="fas fa-plus"></i> Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-project-diagram"></i>
          <p>No projects added yet</p>
          <Button variant="primary" onClick={addProject}>
            Add Your Projects
          </Button>
        </div>
      ) : (
        <div className="projects-list">
          {projects.map((project, index) => (
            <div key={project.id} className="project-item">
              <div className="item-header">
                <h4>Project {index + 1}</h4>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => deleteProject(project.id)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Project Name *</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    placeholder="e.g., E-commerce Website"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Project URL</label>
                  <input
                    type="url"
                    value={project.url}
                    onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                    placeholder="https://github.com/username/project"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Technologies Used</label>
                  <textarea
                    rows="1"
                    style={{ resize: 'none', overflow: 'hidden', minHeight: '40px' }}
                    ref={(el) => {
                      if (el) {
                        inputRefs.current[project.id] = el;
                      }
                    }}
                    defaultValue={project.technologiesInput || project.technologies.join(', ')}
                    onInput={() => handleTechnologiesChange(project.id)}
                    placeholder="React Node.js MongoDB (separate with spaces or commas)"
                  />
                </div>

                <div className="form-group full-width">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label>Project Description</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        style={{ minWidth: 48, height: 32 }}
                        onClick={() => handleGenerateDescription(project)}
                        disabled={aiLoadingId === project.id || humanizeLoadingId === project.id}
                      >
                        {aiLoadingId === project.id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>} AI
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        style={{ minWidth: 48, height: 32 }}
                        onClick={() => handleHumanizeDescription(project)}
                        disabled={aiLoadingId === project.id || humanizeLoadingId === project.id || !project.description}
                      >
                        {humanizeLoadingId === project.id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-user"></i>} Humanize
                      </Button>
                    </div>
                  </div>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    placeholder="Describe your project, your role, and key achievements..."
                    rows="4"
                  />
                  {aiErrorId === project.id && <div style={{ color: 'red', marginTop: 4 }}>AI generation failed. Try again.</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
