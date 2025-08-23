
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { saveResumeData, loadResumeData } from '../services/firestore';
import { createCertificationItem, createAdditionalInfoItem } from '../utils/helpers';

const ResumeContext = createContext();

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

const initialState = {
  id: null, // Will be set when saving
  personalInfo: {
    fullName: '',
    jobRole: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    portfolio: '',
    photoURL: '',
    customLinks: [] // { name: '', url: '' }
  },
  summary: '',
  jobDescription: '', // Job description for AI generation (not included in resume)
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  additionalInfo: [],
  template: 'corporate',
  loading: false,
  error: null
};

const resumeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_RESUME_DATA':
      const resumeData = { ...action.payload };
      // Initialize technologiesInput for existing projects
      if (resumeData.projects) {
        resumeData.projects = resumeData.projects.map(project => ({
          ...project,
          technologiesInput: project.technologiesInput || (project.technologies ? project.technologies.join(', ') : '')
        }));
      }
      return { ...state, ...resumeData };
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, personalInfo: { ...state.personalInfo, ...action.payload } };
    case 'ADD_CUSTOM_LINK':
      return {
        ...state,
        personalInfo: {
          ...state.personalInfo,
          customLinks: [...(state.personalInfo.customLinks || []), action.payload]
        }
      };
    case 'REMOVE_CUSTOM_LINK':
      return {
        ...state,
        personalInfo: {
          ...state.personalInfo,
          customLinks: state.personalInfo.customLinks.filter((_, idx) => idx !== action.payload)
        }
      };
    case 'UPDATE_SUMMARY':
      return { ...state, summary: action.payload };
    case 'UPDATE_JOB_DESCRIPTION':
      return { ...state, jobDescription: action.payload };
    case 'UPDATE_TEMPLATE':
      return { ...state, template: action.payload };
    case 'ADD_EXPERIENCE':
      return { ...state, experience: [...state.experience, action.payload] };
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.map(exp =>
          exp.id === action.payload.id ? action.payload : exp
        )
      };
    case 'DELETE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.filter(exp => exp.id !== action.payload)
      };
    case 'ADD_EDUCATION':
      return { ...state, education: [...state.education, action.payload] };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map(edu =>
          edu.id === action.payload.id ? action.payload : edu
        )
      };
    case 'DELETE_EDUCATION':
      return {
        ...state,
        education: state.education.filter(edu => edu.id !== action.payload)
      };
    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, action.payload] };
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map(skill =>
          skill.id === action.payload.id ? action.payload : skill
        )
      };
    case 'DELETE_SKILL':
      return {
        ...state,
        skills: state.skills.filter(skill => skill.id !== action.payload)
      };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        )
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload)
      };
    case 'ADD_CERTIFICATION':
      return { ...state, certifications: [...state.certifications, action.payload] };
    case 'UPDATE_CERTIFICATION':
      return {
        ...state,
        certifications: state.certifications.map(cert =>
          cert.id === action.payload.id ? action.payload : cert
        )
      };
    case 'DELETE_CERTIFICATION':
      return {
        ...state,
        certifications: state.certifications.filter(cert => cert.id !== action.payload)
      };
    case 'ADD_ADDITIONAL_INFO':
      return { ...state, additionalInfo: [...state.additionalInfo, action.payload] };
    case 'UPDATE_ADDITIONAL_INFO':
      return {
        ...state,
        additionalInfo: state.additionalInfo.map(info =>
          info.id === action.payload.id ? action.payload : info
        )
      };
    case 'DELETE_ADDITIONAL_INFO':
      return {
        ...state,
        additionalInfo: state.additionalInfo.filter(info => info.id !== action.payload)
      };
    case 'SET_RESUME_ID':
      console.log('ResumeReducer: SET_RESUME_ID action triggered with ID:', action.payload); // Debug log
      return { ...state, id: action.payload };
    case 'RESET_RESUME':
      console.log('ResumeReducer: RESET_RESUME action triggered'); // Debug log
      console.log('ResumeReducer: Returning initial state:', initialState); // Debug log
      return initialState;
    default:
      return state;
  }
};

export const ResumeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialState);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      // Check URL parameters using React Router location
      const urlParams = new URLSearchParams(location.search);
      const isNewResume = urlParams.get('new') === 'true';
      const resumeId = urlParams.get('id');

      if (isNewResume) {
        // Reset to blank state for new resume
        dispatch({ type: 'RESET_RESUME' });
      } else if (resumeId) {
        // Load specific resume by ID
        loadSpecificResume(resumeId);
      } else {
        // Load default resume
        loadResume();
      }
    }
  }, [user, location]);

  const loadResume = async () => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await loadResumeData(user.uid);
      if (result.success) {
        dispatch({ type: 'SET_RESUME_DATA', payload: result.data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadSpecificResume = async (resumeId) => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await loadResumeData(user.uid, resumeId);
      if (result.success) {
        dispatch({ type: 'SET_RESUME_DATA', payload: result.data });
      } else {
        dispatch({ type: 'RESET_RESUME' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveResume = async () => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      // Create clean resume data without undefined values and exclude jobDescription
      const { loading, error, jobDescription, ...cleanState } = state;

      // Generate unique ID for new resumes or use existing ID for updates
      const urlParams = new URLSearchParams(window.location.search);
      const existingResumeId = urlParams.get('id');
      const isNewResume = urlParams.get('new') === 'true';

      let resumeId;

      // Simplified logic: Always generate new ID unless we have a specific existing ID
      if (existingResumeId && existingResumeId !== 'default' && !isNewResume) {
        // Editing existing resume with specific ID
        resumeId = existingResumeId;
      } else if (state.id && state.id !== null && state.id !== 'default' && !isNewResume) {
        // Resume already has a valid ID in state
        resumeId = state.id;
      } else {
        // Generate new unique ID (for new resumes or if no valid ID exists)
        resumeId = `resume_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

        // Update the state with the new ID immediately
        dispatch({ type: 'SET_RESUME_ID', payload: resumeId });
      }

      // Generate a title for the resume based on personal info
      const resumeTitle = cleanState.personalInfo?.fullName ||
                         cleanState.personalInfo?.email?.split('@')[0] ||
                         'Untitled Resume';

      const resumeData = {
        id: resumeId,
        title: resumeTitle,
        ...cleanState,
        // Ensure no undefined values are included
        personalInfo: cleanState.personalInfo || {},
        summary: cleanState.summary || '',
        experience: cleanState.experience || [],
        education: cleanState.education || [],
        skills: cleanState.skills || [],
        projects: cleanState.projects || [],
        certifications: cleanState.certifications || [],
        additionalInfo: cleanState.additionalInfo || [],
        template: cleanState.template || 'modern'
      };

      // Final validation before saving
      if (!resumeData.id || resumeData.id === 'default' || resumeData.id === null) {
        const error = 'Resume ID is invalid before save. Cannot proceed.';
        dispatch({ type: 'SET_ERROR', payload: error });
        return { success: false, error };
      }

      const result = await saveResumeData(user.uid, resumeData);

      if (!result.success) {
        dispatch({ type: 'SET_ERROR', payload: result.error });
      } else {
        dispatch({ type: 'SET_ERROR', payload: null }); // Clear any previous errors

        // Update URL to include the resume ID for future saves
        if (isNewResume) {
          const newUrl = `/resume-builder?id=${resumeId}`;
          window.history.replaceState({}, '', newUrl);
        }
      }

      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Certification functions
  const addCertification = () => {
    const newCertification = createCertificationItem();
    dispatch({
      type: 'ADD_CERTIFICATION',
      payload: newCertification
    });
  };

  const updateCertification = (id, updates) => {
    const certification = state.certifications.find(cert => cert.id === id);
    if (certification) {
      dispatch({
        type: 'UPDATE_CERTIFICATION',
        payload: {
          ...certification,
          ...updates
        }
      });
    }
  };

  const removeCertification = (id) => {
    dispatch({
      type: 'DELETE_CERTIFICATION',
      payload: id
    });
  };

  // Additional Information functions
  const addAdditionalInfo = () => {
    const newAdditionalInfo = createAdditionalInfoItem();
    dispatch({
      type: 'ADD_ADDITIONAL_INFO',
      payload: newAdditionalInfo
    });
  };

  const updateAdditionalInfo = (id, updates) => {
    const additionalInfo = state.additionalInfo.find(info => info.id === id);
    if (additionalInfo) {
      dispatch({
        type: 'UPDATE_ADDITIONAL_INFO',
        payload: {
          ...additionalInfo,
          ...updates
        }
      });
    }
  };

  const removeAdditionalInfo = (id) => {
    dispatch({
      type: 'DELETE_ADDITIONAL_INFO',
      payload: id
    });
  };

  const resetResume = () => {
    dispatch({ type: 'RESET_RESUME' });
  };

  const value = {
    ...state,
    dispatch,
    saveResume,
    loadResume,
    resetResume,
    addCertification,
    updateCertification,
    removeCertification,
    addAdditionalInfo,
    updateAdditionalInfo,
    removeAdditionalInfo
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};
