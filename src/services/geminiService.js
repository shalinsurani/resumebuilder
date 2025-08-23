/**
 * Google Gemini AI Service
 * Enhanced with advanced prompting for highly relevant, ATS-optimized content generation
 */

import atsOptimizationService from './atsOptimizationService';
import industryTemplatesService from './industryTemplatesService';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// Get API key from environment variables
const getApiKey = () => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY in your environment variables.');
  }
  return apiKey;
};

/**
 * Make a request to Gemini API
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<string>} - The generated text
 */
const makeGeminiRequest = async (prompt, options = {}) => {
  try {
    const apiKey = getApiKey();
    
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a professional resume writer. Generate concise, professional, and achievement-oriented content for resumes. Focus on action verbs and quantifiable results when possible.\n\n${prompt}`
          }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.8,
          topK: options.topK || 40,
          topP: options.topP || 0.95,
          maxOutputTokens: options.maxOutputTokens || 500,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

/**
 * Generic content generation method for grammar analysis and other uses
 * @param {string} prompt - The prompt to send
 * @param {Object} options - Optional generation parameters
 * @returns {Promise<string>} - Generated content
 */
export const generateContent = async (prompt, options = {}) => {
  return await makeGeminiRequest(prompt, {
    temperature: options.temperature || 0.7,
    maxOutputTokens: options.maxOutputTokens || 300,
    ...options
  });
};

/**
 * Generate a professional summary based on resume data
 * @param {Object} resumeData - The resume data object
 * @returns {Promise<string>} - Generated professional summary
 */
export const generateProfessionalSummary = async (resumeData) => {
  const { personalInfo, experience, education, skills, jobDescription } = resumeData;

  // Extract relevant information
  const jobTitle = personalInfo?.jobTitle || personalInfo?.jobRole || 'Professional';
  const yearsExp = experience?.length || 0;
  const topSkills = skills?.technical?.slice(0, 4)?.join(', ') || 'Various skills';
  const latestRole = experience?.[0]?.position || 'Professional';
  const degree = education?.[0]?.degree || '';

  // Build prompt with job description if provided
  let prompt = `Write a concise professional summary for a ${jobTitle} resume. Maximum 4 lines only.

Target Role: ${jobTitle}
Experience: ${yearsExp}+ years as ${latestRole}
Key Skills: ${topSkills}
Education: ${degree}`;

  // Add job description context if provided
  if (jobDescription && jobDescription.trim()) {
    prompt += `

TARGET JOB DESCRIPTION:
${jobDescription.trim()}

Use the job description above to tailor the summary and include relevant keywords and requirements.`;
  }

  prompt += `

STRICT REQUIREMENTS:
- EXACTLY 40-45 words total (count carefully)
- Start with "${jobTitle} with ${yearsExp}+ years of experience"
- Include 3-4 ATS keywords from: ${topSkills}
- Mention one quantifiable achievement
- Professional tone, action-oriented
- Focus on value to employers
- Use keywords from job description if provided
- COMPLETE the summary - no truncation

Write only the summary, no extra text. Count words to ensure 40-45 words exactly.`;

  return await makeGeminiRequest(prompt, {
    temperature: 0.7,
    maxOutputTokens: 150,
    topP: 0.9
  });
};

/**
 * Generate experience description
 * @param {Object} experienceData - Experience entry data
 * @returns {Promise<string>} - Generated experience description
 */
export const generateExperienceDescription = async (experienceData) => {
  const { position, company, responsibilities, startDate, endDate, industry, skills, jobDescriptionForAI } = experienceData;

  // Detect industry and get relevant context
  const detectedIndustry = atsOptimizationService.detectIndustry(position, skills || []);
  const industryKeywords = atsOptimizationService.getIndustryKeywords(detectedIndustry);
  const relevantKeywords = industryKeywords.slice(0, 10).join(', ');

  // Add advanced randomization for unique content every time
  const randomSeed = Math.floor(Math.random() * 50000);
  const focusAreas = [
    'leadership and team management with quantifiable team growth',
    'technical innovation and system optimization with performance metrics',
    'cost reduction and process improvement with financial impact',
    'client relationship management and business development',
    'strategic planning and cross-functional collaboration'
  ];
  const selectedFocus = focusAreas[randomSeed % focusAreas.length];

  // Generate dynamic metrics based on role and industry
  const metrics = industryTemplatesService.generateDynamicMetrics(detectedIndustry);

  let prompt = `You are an expert ATS resume writer. Create highly relevant, ATS-optimized experience bullets for this EXACT position.

ROLE ANALYSIS:
- Job Title: ${position || 'Professional'}
- Company: ${company || 'Leading Organization'}
- Industry: ${detectedIndustry}
- Responsibilities: ${responsibilities || 'Professional duties'}
- Duration: ${startDate || 'Recent'} to ${endDate || 'Present'}
- Skills: ${Array.isArray(skills) ? skills.join(', ') : skills || 'Professional skills'}
- ATS Keywords: ${relevantKeywords}
- Focus: ${selectedFocus}
- Seed: ${randomSeed}`;

  // Add job description context if provided
  if (jobDescriptionForAI && jobDescriptionForAI.trim()) {
    prompt += `

ORIGINAL JOB DESCRIPTION FOR REFERENCE:
${jobDescriptionForAI.trim()}

IMPORTANT: Use the job description above to understand the role requirements and tailor the experience bullets accordingly. Include relevant keywords and responsibilities mentioned in the job posting.`;
  }

  prompt += `

STRICT ATS REQUIREMENTS:
1. Generate EXACTLY 40-45 words total (count carefully)
2. Include 4-5 ATS keywords from: ${relevantKeywords}
3. Use exact job title: ${position}
4. Reference company: ${company}
5. Start with power verbs: Led, Spearheaded, Implemented, Optimized, Delivered, Managed, Achieved
6. Include ONE realistic metric:
   - Team sizes: ${metrics.teamSize}-${metrics.teamSize + 5} members OR
   - Improvements: ${metrics.improvement}-${metrics.improvement + 15}% OR
   - Budget/revenue: $${metrics.costSaving}K-$${metrics.revenue}K
7. Focus on ${selectedFocus}
8. Professional, action-oriented language
${jobDescriptionForAI ? '9. Align with job description requirements and include relevant keywords from the posting' : ''}

Create ONE paragraph (40-45 words exactly) for ${position} at ${company}${jobDescriptionForAI ? ' that aligns with the provided job description' : ''}. Count words to ensure exactly 40-45 words. COMPLETE the description - no truncation.`;

  try {
    const description = await makeGeminiRequest(prompt, {
      temperature: 0.7,
      maxOutputTokens: 120,
      topP: 0.9
    });

    // Clean and format the response
    let cleanDescription = description
      .replace(/^(Experience:|Job Description:|Responsibilities:|Bullet Points:|Description:)/i, '')
      .trim()
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ');

    // Ensure it's within word limit (40-45 words)
    const words = cleanDescription.split(/\s+/).filter(word => word.length > 0);
    if (words.length > 45) {
      cleanDescription = words.slice(0, 45).join(' ') + '.';
    } else if (words.length < 40) {
      // If too short, try to enhance with ATS optimization
      cleanDescription = atsOptimizationService.enhanceContentForATS(cleanDescription, detectedIndustry, 'experience');
    }

    // Apply final ATS optimization
    cleanDescription = atsOptimizationService.enhanceContentForATS(cleanDescription, detectedIndustry, 'experience');

    return cleanDescription;
  } catch (error) {
    console.error('Error generating experience description:', error);

    // Enhanced fallback
    const specificKeywords = relevantKeywords.split(', ').slice(0, 3);
    const fallbackBullets = [
      `• Led ${position || 'professional'} initiatives at ${company || 'the organization'}, managing ${metrics.teamSize}+ team members and achieving ${metrics.improvement}% improvement`,
      `• Implemented ${specificKeywords[0] || 'strategic'} solutions utilizing ${specificKeywords.join(', ')}, resulting in $${metrics.costSaving}K annual cost savings`,
      `• Collaborated with stakeholders to deliver high-impact ${position || 'professional'} projects ${metrics.timeReduction}% ahead of schedule`,
      `• Achieved ${95 + Math.floor(Math.random() * 5)}% satisfaction rating and contributed to ${company || 'organizational'} revenue growth of $${metrics.revenue}K`
    ];

    return fallbackBullets.join('\n');
  }
};

/**
 * Generate project description
 * @param {Object} projectData - Project data
 * @returns {Promise<string>} - Generated project description
 */
export const generateProjectDescription = async (projectData) => {
  const { name, role, technologies, description, duration, teamSize, industry } = projectData;
  const techText = Array.isArray(technologies) ? technologies.join(', ') : technologies;

  // Detect project type and industry context
  const detectedIndustry = atsOptimizationService.detectIndustry(role, technologies || []);
  const industryKeywords = atsOptimizationService.getIndustryKeywords(detectedIndustry);

  // Advanced randomization for unique project descriptions
  const randomSeed = Math.floor(Math.random() * 75000);
  const projectTypes = [
    'full-stack web application with real-time features',
    'mobile application with cross-platform compatibility',
    'enterprise software solution with microservices architecture',
    'e-commerce platform with payment processing',
    'data analytics dashboard with visualization',
    'automation tool with workflow optimization',
    'cloud-based system with scalable infrastructure'
  ];

  const selectedProjectType = projectTypes[randomSeed % projectTypes.length];

  // Generate technology-specific metrics
  const techMetrics = {
    performance: `${60 + Math.floor(Math.random() * 40)}%`,
    loadTime: `${0.5 + Math.random() * 2}s`,
    uptime: `${99.5 + Math.random() * 0.5}%`,
    users: `${1000 + Math.floor(Math.random() * 9000)}+`,
    coverage: `${85 + Math.floor(Math.random() * 15)}%`
  };

  const prompt = `You are an expert technical resume writer. Create a highly technical, ATS-optimized project description for this SPECIFIC project.

PROJECT ANALYSIS:
- Project Name: ${name || 'Professional Development Project'}
- Your Role: ${role || 'Developer'}
- Technology Stack: ${techText || 'Modern development tools'}
- Project Type: ${selectedProjectType}
- Project Scope: ${description || 'Comprehensive technical solution'}
- Duration: ${duration || '4-6 months'}
- Team Size: ${teamSize || '4-6'} members
- Industry: ${detectedIndustry}
- Seed: ${randomSeed}

TECHNOLOGY REQUIREMENTS:
1. Reference EXACT project name: ${name}
2. Use ALL technologies: ${techText}
3. Include technology-specific terminology
4. Mention frameworks and tools from the stack
5. Include realistic technical metrics:
   - Performance improvement: ${techMetrics.performance}
   - Load time optimization: ${techMetrics.loadTime}
   - System uptime: ${techMetrics.uptime}
   - User capacity: ${techMetrics.users}
   - Test coverage: ${techMetrics.coverage}

STRICT REQUIREMENTS:
- EXACTLY 40-45 words total (count carefully)
- Include project name "${name}" and role "${role}"
- Mention 3-4 key technologies from: ${techText}
- Include ONE quantifiable achievement
- Use industry terminology for ${detectedIndustry}
- Professional, technical language
- COMPLETE the description - no truncation

Create ONE paragraph (40-45 words exactly) for ${techText} project. Count words to ensure exactly 40-45 words.`;

  try {
    const projectDesc = await makeGeminiRequest(prompt, {
      temperature: 0.7,
      maxOutputTokens: 120,
      topP: 0.9
    });

    // Clean up and format the response
    let cleanDesc = projectDesc
      .replace(/^(Project:|Description:|Overview:|Summary:)/i, '')
      .trim()
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ');

    // Ensure it's within word limit (40-45 words)
    const words = cleanDesc.split(/\s+/).filter(word => word.length > 0);
    if (words.length > 45) {
      cleanDesc = words.slice(0, 45).join(' ') + '.';
    } else if (words.length < 40) {
      // If too short, try to enhance with ATS optimization
      cleanDesc = atsOptimizationService.enhanceContentForATS(cleanDesc, detectedIndustry, 'project');
    }

    // Apply final ATS optimization
    cleanDesc = atsOptimizationService.enhanceContentForATS(cleanDesc, detectedIndustry, 'project');

    return cleanDesc;
  } catch (error) {
    console.error('Error generating project description:', error);

    // Enhanced fallback with technology specificity
    const techArray = techText ? techText.split(',').map(t => t.trim()).slice(0, 4) : ['modern technologies'];
    const fallbackDesc = `Architected and developed ${name || 'comprehensive software solution'} using ${techArray.join(', ')}, serving as lead ${role || 'developer'} in ${teamSize || '5'}-member agile team. Implemented ${selectedProjectType} with ${techArray[0]} and ${techArray[1] || 'supporting technologies'}, resulting in ${techMetrics.performance} performance improvement and ${techMetrics.loadTime} load time optimization. Integrated advanced features including real-time processing and automated testing, achieving ${techMetrics.uptime} system uptime and supporting ${techMetrics.users} concurrent users. Successfully delivered project 2 weeks ahead of schedule with ${techMetrics.coverage} test coverage, meeting all technical requirements.`;

    return atsOptimizationService.enhanceContentForATS(fallbackDesc, detectedIndustry, 'project');
  }
};



/**
 * Check if Gemini API is properly configured
 * @returns {boolean} - True if API key is available
 */
export const isGeminiConfigured = () => {
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
  generateContent,
  isGeminiConfigured
};
