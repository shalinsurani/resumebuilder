/**
 * Unified AI Service
 * Automatically switches between Hugging Face, Gemini, and OpenAI based on availability
 */

import openaiService from './openaiService';
import geminiService from './geminiService';

/**
 * Determine which AI service to use
 * Priority: Gemini (primary) > OpenAI (fallback)
 */
const getAvailableService = () => {
  // Check if Gemini is configured first (primary service)
  if (geminiService.isGeminiConfigured()) {
    return {
      service: geminiService,
      provider: 'Gemini'
    };
  }

  // Fallback to OpenAI if configured
  if (openaiService.isOpenAIConfigured()) {
    return {
      service: openaiService,
      provider: 'OpenAI'
    };
  }

  // No service available
  return null;
};

/**
 * Generate a professional summary
 * @param {Object} resumeData - The resume data object
 * @returns {Promise<string>} - Generated professional summary
 */
export const generateProfessionalSummary = async (resumeData) => {
  const availableService = getAvailableService();
  
  if (!availableService) {
    throw new Error('No AI service configured. Please set up one of these API keys in your environment variables:\n• REACT_APP_GEMINI_API_KEY (primary service)\n• REACT_APP_OPENAI_API_KEY (fallback)');
  }
  
  console.log(`Using ${availableService.provider} for AI generation`);
  return await availableService.service.generateProfessionalSummary(resumeData);
};

/**
 * Generate experience description
 * @param {Object} experienceData - Experience entry data
 * @returns {Promise<string>} - Generated experience description
 */
export const generateExperienceDescription = async (experienceData) => {
  const availableService = getAvailableService();
  
  if (!availableService) {
    throw new Error('No AI service configured. Please set up one of these API keys in your environment variables:\n• REACT_APP_GEMINI_API_KEY (primary service)\n• REACT_APP_OPENAI_API_KEY (fallback)');
  }
  
  console.log(`Using ${availableService.provider} for AI generation`);
  return await availableService.service.generateExperienceDescription(experienceData);
};

/**
 * Generate project description
 * @param {Object} projectData - Project data
 * @returns {Promise<string>} - Generated project description
 */
export const generateProjectDescription = async (projectData) => {
  const availableService = getAvailableService();
  
  if (!availableService) {
    throw new Error('No AI service configured. Please set up one of these API keys in your environment variables:\n• REACT_APP_GEMINI_API_KEY (primary service)\n• REACT_APP_OPENAI_API_KEY (fallback)');
  }
  
  console.log(`Using ${availableService.provider} for AI generation`);
  return await availableService.service.generateProjectDescription(projectData);
};

/**
 * Check if any AI service is properly configured
 * @returns {boolean} - True if at least one AI service is available
 */
export const isAIConfigured = () => {
  return geminiService.isGeminiConfigured() || openaiService.isOpenAIConfigured();
};

/**
 * Get the current AI provider being used
 * @returns {string|null} - The name of the current provider or null if none available
 */
export const getCurrentProvider = () => {
  const availableService = getAvailableService();
  return availableService ? availableService.provider : null;
};

export default {
  generateProfessionalSummary,
  generateExperienceDescription,
  generateProjectDescription,
  isAIConfigured,
  getCurrentProvider
};
