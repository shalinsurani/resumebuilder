
import React from 'react';
import { useResume } from '../../contexts/ResumeContext';
import Button from '../common/Button';
import { createSkillItem } from '../../utils/helpers';
import { SKILL_LEVELS, SKILL_CATEGORIES } from '../../utils/constants';

const Skills = () => {
  const { skills, dispatch } = useResume();

  const addSkill = () => {
    const newSkill = createSkillItem();
    dispatch({
      type: 'ADD_SKILL',
      payload: newSkill
    });
  };

  const updateSkill = (id, field, value) => {
    const updatedSkill = skills.find(skill => skill.id === id);
    if (updatedSkill) {
      dispatch({
        type: 'UPDATE_SKILL',
        payload: {
          ...updatedSkill,
          [field]: value
        }
      });
    }
  };

  const deleteSkill = (id) => {
    dispatch({
      type: 'DELETE_SKILL',
      payload: id
    });
  };

  return (
    <div className="form-section">
      <div className="section-header">
        <h3>Skills</h3>
        <Button
          variant="secondary"
          size="small"
          onClick={addSkill}
        >
          <i className="fas fa-plus"></i> Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-cogs"></i>
          <p>No skills added yet</p>
          <Button variant="primary" onClick={addSkill}>
            Add Your Skills
          </Button>
        </div>
      ) : (
        <div className="skills-list">
          {skills.map((skill, index) => (
            <div key={skill.id} className="skill-item">
              <div className="item-header">
                <h4>Skill {index + 1}</h4>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => deleteSkill(skill.id)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Skill Name *</label>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                    placeholder="e.g., JavaScript, Leadership, Spanish"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Proficiency Level</label>
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                  >
                    {Object.values(SKILL_LEVELS).map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={skill.category}
                    onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                  >
                    {Object.values(SKILL_CATEGORIES).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Skills;
