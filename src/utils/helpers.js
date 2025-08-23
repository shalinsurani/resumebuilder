
import { v4 as uuidv4 } from 'uuid';

// Form validation helpers
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Data formatting helpers
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
};

export const formatDateForInput = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

export const generateId = () => {
  return uuidv4();
};

// Resume data helpers
export const createExperienceItem = () => ({
  id: generateId(),
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  description: '',
  jobDescriptionForAI: '', // Job description for AI generation (not included in resume)
  current: false
});

export const createEducationItem = () => ({
  id: generateId(),
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  gpa: ''
});

export const createSkillItem = () => ({
  id: generateId(),
  name: '',
  level: 'Beginner',
  category: 'Technical'
});

export const createProjectItem = () => ({
  id: generateId(),
  name: '',
  description: '',
  technologies: [],
  technologiesInput: '',
  url: ''
});

export const createCertificationItem = () => ({
  id: generateId(),
  name: '',
  issuer: '',
  date: '',
  credentialId: '',
  url: ''
});

export const createAdditionalInfoItem = () => ({
  id: generateId(),
  type: 'Workshop/Seminar',
  description: ''
});

// Text formatting helpers
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Skills categorization helpers
export const groupSkillsByCategory = (skills) => {
  if (!skills || skills.length === 0) return {};

  return skills.reduce((acc, skill) => {
    const category = skill.category || 'Technical';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});
};

export const formatSkillsForDisplay = (skills, showLevels = false) => {
  if (!skills || skills.length === 0) return '';

  return skills.map(skill => {
    if (showLevels && skill.level && skill.level !== 'Beginner') {
      return `${skill.name} (${skill.level})`;
    }
    return skill.name;
  }).join(', ');
};

export const getCategoryDisplayName = (category) => {
  const categoryMap = {
    'Technical': 'Technical Skills',
    'Tools': 'Tools',
    'Frameworks': 'Frameworks & Libraries',
    'Languages': 'Languages',
    'Soft Skills': 'Soft Skills'
  };
  return categoryMap[category] || category;
};

// File handling helpers
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Local storage helpers
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// Error handling helpers
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'permission-denied':
        return 'You do not have permission to perform this action.';
      case 'unavailable':
        return 'Service temporarily unavailable. Please try again.';
      default:
        return error.code;
    }
  }
  return 'An unexpected error occurred.';
};

// Debounce function for auto-save
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
