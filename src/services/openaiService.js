/**
 * OpenAI API Service
 * Handles all AI generation requests for the resume builder
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Get API key from environment variables
const getApiKey = () => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in your environment variables.');
  }
  return apiKey;
};

/**
 * Make a request to OpenAI API
 * @param {string} prompt - The prompt to send to OpenAI
 * @param {number} maxTokens - Maximum tokens for the response
 * @returns {Promise<string>} - The generated text
 */
const makeOpenAIRequest = async (prompt, maxTokens = 150) => {
  try {
    const apiKey = getApiKey();
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer. Generate concise, professional, and achievement-oriented content for resumes. Focus on action verbs and quantifiable results when possible.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

/**
 * Generate a professional summary for a resume
 * @param {Object} resumeData - Resume data including personal info, experience, education, skills
 * @returns {Promise<string>} - Generated professional summary
 */
export const generateProfessionalSummary = async (resumeData) => {
  const { personalInfo, experience, education, skills, jobDescription } = resumeData;

  const experienceText = (experience || [])
    .map(exp => `${exp.position || exp.title} at ${exp.company}`)
    .join(', ');

  const educationText = (education || [])
    .map(edu => `${edu.degree} from ${edu.institution}`)
    .join(', ');

  const skillsText = Array.isArray(skills) ? skills.join(', ') :
                    (skills?.technical || []).join(', ') || 'Multiple skills';

  let prompt = `Write a professional summary for a resume (2-3 sentences, 50-80 words).

Name: ${personalInfo?.fullName || 'Professional'}
Target Role: ${personalInfo?.jobTitle || personalInfo?.jobRole || 'Professional'}
Experience: ${experienceText || 'Various roles'}
Education: ${educationText || 'Relevant education'}
Skills: ${skillsText}`;

  // Add job description context if provided
  if (jobDescription && jobDescription.trim()) {
    prompt += `

Target Job Description:
${jobDescription.trim()}

Use the job description above to tailor the summary and include relevant keywords.`;
  }

  prompt += `

STRICT REQUIREMENTS:
- EXACTLY 40-45 words total (count carefully)
- Include 3-4 ATS keywords
- Mention one quantifiable achievement
- Professional tone, action-oriented
- Focus on value proposition and professional strengths
- COMPLETE the summary - no truncation

Create a compelling summary (40-45 words exactly) that highlights key qualifications and career objectives. Count words to ensure exactly 40-45 words.`;

  return await makeOpenAIRequest(prompt, 120);
};

/**
 * Generate a job description for work experience
 * @param {Object} experienceData - Experience data including position, company, etc.
 * @returns {Promise<string>} - Generated job description
 */
export const generateExperienceDescription = async (experienceData) => {
  const { position, company, startDate, endDate, jobDescriptionForAI } = experienceData;

  let prompt = `Write a concise, achievement-oriented job description for a resume (3-4 bullet points, 60-100 words total).

Position: ${position || 'Professional Role'}
Company: ${company || 'Company'}
Duration: ${startDate || 'Start'} - ${endDate || 'End'}`;

  // Add job description context if provided
  if (jobDescriptionForAI && jobDescriptionForAI.trim()) {
    prompt += `

Original Job Description for Reference:
${jobDescriptionForAI.trim()}

Use the job description above to understand the role requirements and tailor the experience description accordingly.`;
  }

  prompt += `

STRICT REQUIREMENTS:
- EXACTLY 40-45 words total (count carefully)
- Include 3-4 ATS keywords
- Use action verbs (managed, developed, implemented, led, etc.)
- Include ONE quantifiable result
- Professional impact and value delivered
${jobDescriptionForAI ? '- Alignment with job description requirements' : ''}
- COMPLETE the description - no truncation

Format as ONE paragraph (40-45 words exactly), not bullet points. Count words to ensure exactly 40-45 words.`;

  return await makeOpenAIRequest(prompt, 120);
};

/**
 * Generate a project description
 * @param {Object} projectData - Project data including name, role, technologies
 * @returns {Promise<string>} - Generated project description
 */
export const generateProjectDescription = async (projectData) => {
  const { name, role, technologies } = projectData;
  
  const techText = (technologies || []).join(', ');
  
  const prompt = `Write a concise, achievement-oriented project description for a resume (2-3 sentences, 40-80 words).

Project: ${name || 'Project'}
Role: ${role || 'Developer'}
Technologies: ${techText || 'Various technologies'}

STRICT REQUIREMENTS:
- EXACTLY 40-45 words total (count carefully)
- Include project name and your role
- Mention 3-4 key technologies
- Include ONE quantifiable result or impact
- Technical skills demonstrated
- Professional, technical language
- COMPLETE the description - no truncation

Write as ONE professional paragraph (40-45 words exactly) highlighting technical expertise and project outcomes. Count words to ensure exactly 40-45 words.`;

  return await makeOpenAIRequest(prompt, 120);
};

/**
 * Check if OpenAI API is properly configured
 * @returns {boolean} - True if API key is available
 */
export const isOpenAIConfigured = () => {
  try {
    getApiKey();
    return true;
  } catch {
    return false;
  }
};

export default {
  generateProfessionalSummary,
  generateExperienceDescription,
  generateProjectDescription,
  isOpenAIConfigured
};
