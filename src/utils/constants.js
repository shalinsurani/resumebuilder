
export const RESUME_TEMPLATES = {
  MODERN: 'modern',
  CLASSIC: 'classic',
  CREATIVE: 'creative',
  PROFESSIONAL: 'professional',
  EXECUTIVE: 'executive',
  CORPORATE: 'corporate',
  MINIMAL: 'minimal',
  ELEGANT: 'elegant',
  DANIEL: 'daniel',
  HOWARD: 'howard',
  OVERLEAF: 'overleaf',
  LATEX: 'latex',
  PROFESSIONAL2: 'professional2',
  TEMPLATE1: 'template1',
  TEMPLATE11: 'template11',
  TEMPLATE12: 'template12',
  TEMPLATE31: 'template31',
  MODERN21: 'modern21',
  MODERN69: 'modern69',
};

export const SKILL_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert'
};

export const SKILL_CATEGORIES = {
  TECHNICAL: 'Technical',
  SOFT_SKILLS: 'Soft Skills',
  LANGUAGES: 'Languages',
  TOOLS: 'Tools',
  FRAMEWORKS: 'Frameworks'
};

export const VALIDATION_RULES = {
  EMAIL: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  PHONE: {
    required: false,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
  },
  REQUIRED: {
    required: true,
    message: 'This field is required'
  },
  URL: {
    required: false,
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL (starting with http:// or https://)'
  }
};

export const FORM_SECTIONS = {
  PERSONAL_INFO: 'personalInfo',
  SUMMARY: 'summary',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  CERTIFICATIONS: 'certifications'
};

export const NAVIGATION_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/resume-builder', label: 'Resume Builder' }
];

export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  RESUMES: 'resumes'
};

export const STORAGE_PATHS = {
  PROFILE_PHOTOS: 'users/{userId}/profile',
  RESUME_PHOTOS: 'users/{userId}/resumes/{resumeId}'
};

export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
};

export const AUTO_SAVE_DELAY = 30000; // 30 seconds

export const PAGINATION_LIMITS = {
  RESUMES_PER_PAGE: 10,
  EXPERIENCES_PER_PAGE: 5
};

export const DEFAULT_RESUME_DATA = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    portfolio: '',
    photoURL: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  template: RESUME_TEMPLATES.CORPORATE
};

export const TEMPLATE_CONFIGS = {
  [RESUME_TEMPLATES.MODERN]: {
    name: 'Modern',
    description: 'Clean, contemporary design with accent colors',
    primaryColor: '#21808d',
    secondaryColor: '#626c71',
    fontFamily: 'Inter, sans-serif',
    hasPhoto: true
  },
  [RESUME_TEMPLATES.CLASSIC]: {
    name: 'Classic',
    description: 'Traditional, formal layout for corporate environments',
    primaryColor: '#134252',
    secondaryColor: '#5e5240',
    fontFamily: 'Georgia, serif',
    hasPhoto: false
  },
  [RESUME_TEMPLATES.CREATIVE]: {
    name: 'Creative',
    description: 'Unique visual elements for creative industries',
    primaryColor: '#a84b2f',
    secondaryColor: '#21808d',
    fontFamily: 'Poppins, sans-serif',
    hasPhoto: true
  },
  [RESUME_TEMPLATES.PROFESSIONAL]: {
    name: 'Professional',
    description: 'Corporate-style layout with photo support',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    fontFamily: 'Inter, sans-serif',
    hasPhoto: true
  },
  [RESUME_TEMPLATES.EXECUTIVE]: {
    name: 'Executive',
    description: 'Premium design for senior-level positions',
    primaryColor: '#1e293b',
    secondaryColor: '#475569',
    fontFamily: 'Inter, sans-serif',
    hasPhoto: false
  },
  [RESUME_TEMPLATES.CORPORATE]: {
    name: 'Corporate',
    description: 'Ultra-professional design for corporate environments',
    primaryColor: '#1f2937',
    secondaryColor: '#6b7280',
    fontFamily: 'Calibri, sans-serif',
    hasPhoto: true
  },
  [RESUME_TEMPLATES.MINIMAL]: {
    name: 'Minimal',
    description: 'Clean, minimal design with maximum content density',
    primaryColor: '#374151',
    secondaryColor: '#9ca3af',
    fontFamily: 'Arial, sans-serif',
    hasPhoto: false
  },
  [RESUME_TEMPLATES.ELEGANT]: {
    name: 'Elegant',
    description: 'Sophisticated design with photo support',
    primaryColor: '#0f172a',
    secondaryColor: '#64748b',
    fontFamily: 'Georgia, serif',
    hasPhoto: true
  },
  [RESUME_TEMPLATES.DANIEL]: {
    name: 'Daniel Style',
    description: 'Professional template with gray section headers and clean layout',
    primaryColor: '#333333',
    secondaryColor: '#d3d3d3',
    fontFamily: 'Arial, sans-serif',
    hasPhoto: false
  },
  [RESUME_TEMPLATES.HOWARD]: {
    name: 'Howard Style',
    description: 'Modern template with burgundy sidebar and photo support',
    primaryColor: '#8B4B5C',
    secondaryColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    hasPhoto: true
  },
  [RESUME_TEMPLATES.LATEX]: {
    name: 'LaTeX Professional',
    description: 'Clean LaTeX-inspired design with professional typography',
    primaryColor: '#000000',
    secondaryColor: '#666666',
    fontFamily: 'Times New Roman, serif',
    hasPhoto: false
  },
  [RESUME_TEMPLATES.TEMPLATE11]: {
    name: 'Template 11',
    description: 'Professional, modern, and highly customizable template',
    primaryColor: '#2563eb',
    secondaryColor: '#374151',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    hasPhoto: false
  },
  [RESUME_TEMPLATES.TEMPLATE12]: {
    name: 'Template 12',
    description: 'Professional template with photo support and balanced typography',
    primaryColor: '#1a1a1a',
    secondaryColor: '#4a4a4a',
    fontFamily: 'Arial, sans-serif',
    hasPhoto: true
  },
  [RESUME_TEMPLATES.TEMPLATE31]: {
    name: 'Template 31',
    description: 'Professional template with photo support and clean design',
    primaryColor: '#2c3e50',
    secondaryColor: '#7f8c8d',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    hasPhoto: true
  },
  [RESUME_TEMPLATES.MODERN21]: {
    name: 'Modern 21',
    description: 'Professional template with category-wise skills display',
    primaryColor: '#2c3e50',
    secondaryColor: '#7f8c8d',
    fontFamily: 'Arial, sans-serif',
    hasPhoto: false
  },
  [RESUME_TEMPLATES.MODERN69]: {
    name: 'Modern 69',
    description: 'Professional two-column template with category-wise skills display',
    primaryColor: '#E10000',
    secondaryColor: '#464646',
    fontFamily: 'Arial, sans-serif',
    hasPhoto: true
  }
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please log in again.',
  PERMISSION_ERROR: 'You do not have permission to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UPLOAD_ERROR: 'File upload failed. Please try again.',
  SAVE_ERROR: 'Failed to save changes. Please try again.',
  LOAD_ERROR: 'Failed to load data. Please refresh the page.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.'
};

export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Changes saved successfully!',
  UPLOAD_SUCCESS: 'File uploaded successfully!',
  DELETE_SUCCESS: 'Item deleted successfully!',
  COPY_SUCCESS: 'Copied to clipboard!',
  EXPORT_SUCCESS: 'Resume exported successfully!'
};
