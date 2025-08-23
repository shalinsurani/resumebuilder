/**
 * DeepSeek-R1 AI Service
 * Advanced reasoning model for high-quality content generation and grammar analysis
 * Free API with excellent performance for resume optimization
 */

import atsOptimizationService from './atsOptimizationService';
import industryTemplatesService from './industryTemplatesService';

// DeepSeek API configuration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Get API key from environment variables
const getApiKey = () => {
  const apiKey = process.env.REACT_APP_DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.warn('DeepSeek API key not found. Please set REACT_APP_DEEPSEEK_API_KEY in your environment variables.');
    return null;
  }
  return apiKey;
};

/**
 * Check if DeepSeek API is properly configured
 * @returns {boolean} - True if API key is available
 */
export const isDeepSeekConfigured = () => {
  return !!getApiKey();
};

/**
 * Make a request to DeepSeek API
 * @param {string} prompt - The prompt to send
 * @param {Object} options - Optional generation parameters
 * @returns {Promise<string>} - The generated text
 */
const makeDeepSeekRequest = async (prompt, options = {}) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('DeepSeek API key not configured');
  }

  const requestBody = {
    model: 'deepseek-reasoner',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 500,
    top_p: options.topP || 0.9,
    frequency_penalty: options.frequencyPenalty || 0.1,
    presence_penalty: options.presencePenalty || 0.1
  };

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`DeepSeek API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from DeepSeek API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('DeepSeek API request failed:', error);
    throw error;
  }
};

/**
 * Generate professional summary
 * @param {Object} profileData - Profile data including name, title, experience
 * @returns {Promise<string>} - Generated professional summary
 */
export const generateProfessionalSummary = async (resumeData) => {
  const { personalInfo, experience, education, skills, jobDescription } = resumeData;

  // Extract relevant information
  const title = personalInfo?.jobTitle || personalInfo?.jobRole || 'Professional';
  const yearsExp = experience?.length || 0;
  const latestRole = experience?.[0]?.position || 'Professional';
  const allSkills = skills?.technical || skills || [];

  // Add randomization for different outputs each time
  const randomSeed = Math.floor(Math.random() * 10000);
  const variationStyles = [
    'achievement-focused with quantifiable results',
    'leadership-oriented with team management emphasis',
    'technical expertise with innovation highlights',
    'business impact with strategic thinking focus',
    'growth-oriented with career progression emphasis'
  ];
  const selectedStyle = variationStyles[randomSeed % variationStyles.length];

  // Detect industry for ATS optimization
  const detectedIndustry = atsOptimizationService.detectIndustry(title, allSkills || []);
  const industryKeywords = atsOptimizationService.getIndustryKeywords(detectedIndustry);
  const topKeywords = industryKeywords.slice(0, 8).join(', ');

  let prompt = `You are an expert ATS-optimized resume writer. Create a compelling professional summary that will score 95+ on ATS systems.

CANDIDATE ANALYSIS:
- Target Role: ${title}
- Experience Level: ${yearsExp}+ years as ${latestRole}
- Core Skills: ${Array.isArray(allSkills) ? allSkills.join(', ') : allSkills || 'Professional skills'}
- Target Industry: ${detectedIndustry}
- ATS Keywords to Include: ${topKeywords}
- Writing Style: ${selectedStyle}
- Variation Seed: ${randomSeed}`;

  // Add job description context if provided
  if (jobDescription && jobDescription.trim()) {
    prompt += `

TARGET JOB DESCRIPTION:
${jobDescription.trim()}

IMPORTANT: Use the job description above to identify key requirements and tailor the summary accordingly. Include relevant keywords and skills mentioned in the job posting.`;
  }

  prompt += `

STRICT ATS OPTIMIZATION REQUIREMENTS:
1. EXACTLY 40-45 words total (count carefully)
2. Include 3-4 industry keywords from: ${topKeywords}
3. Use exact job title terminology: ${title}
4. Include ONE quantifiable achievement
5. Start with experience level and current title
6. Professional, action-oriented language
7. Use ${selectedStyle} approach
8. Make each generation unique using seed: ${randomSeed}
${jobDescription ? '9. Align with job description requirements and include relevant keywords' : ''}

CONTENT VARIATION INSTRUCTIONS:
- Generate completely different content each time
- Use different metrics and achievements
- Vary sentence structure and flow
- Change focus areas while maintaining relevance
- Ensure uniqueness with seed: ${randomSeed}
- COMPLETE the summary - no truncation

Create an ATS-optimized summary (40-45 words exactly) that will rank in top 10% of applicants for ${title} positions. Count words to ensure exactly 40-45 words.`;

  try {
    const summary = await makeDeepSeekRequest(prompt, {
      temperature: 0.7,
      maxTokens: 120,
      topP: 0.9,
      frequencyPenalty: 0.3,
      presencePenalty: 0.2
    });

    // Clean and optimize the response
    let cleanSummary = summary
      .replace(/^(Summary:|Professional Summary:|Profile:|ATS Summary:)/i, '')
      .trim()
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ');

    // Ensure it's within word limit (40-45 words)
    const words = cleanSummary.split(/\s+/).filter(word => word.length > 0);
    if (words.length > 45) {
      cleanSummary = words.slice(0, 45).join(' ') + '.';
    } else if (words.length < 40) {
      // If too short, try to enhance with ATS optimization
      cleanSummary = atsOptimizationService.enhanceContentForATS(cleanSummary, detectedIndustry, 'summary');
    }

    // Apply additional ATS optimization
    cleanSummary = atsOptimizationService.enhanceContentForATS(cleanSummary, detectedIndustry, 'summary');

    return cleanSummary;
  } catch (error) {
    console.error('Error generating professional summary:', error);

    // Enhanced fallback with variation
    const metrics = industryTemplatesService.generateDynamicMetrics(detectedIndustry);
    const skillsList = Array.isArray(skills) ? skills.slice(0, 3) : ['professional skills'];
    const fallbackSummary = `${experience || metrics.experience}+ years experienced ${title || 'professional'} with expertise in ${skillsList.join(', ')}. Proven track record of delivering ${metrics.improvement}% improvement in operational efficiency and driving $${metrics.revenue}K+ business growth. Strong background in ${detectedIndustry} with demonstrated ability to lead ${metrics.teamSize}+ member teams and optimize processes. Seeking to leverage technical expertise and leadership skills to contribute to organizational success.`;

    return atsOptimizationService.enhanceContentForATS(fallbackSummary, detectedIndustry, 'summary');
  }
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
    'strategic planning and cross-functional collaboration',
    'data-driven decision making and analytics implementation',
    'quality assurance and operational excellence',
    'project management and delivery optimization'
  ];
  const selectedFocus = focusAreas[randomSeed % focusAreas.length];

  // Generate dynamic metrics based on role and industry
  const metrics = industryTemplatesService.generateDynamicMetrics(detectedIndustry);
  const roleLevel = position?.toLowerCase().includes('senior') || position?.toLowerCase().includes('lead') ? 'senior' :
                   position?.toLowerCase().includes('junior') || position?.toLowerCase().includes('associate') ? 'junior' : 'mid';

  let prompt = `You are an expert ATS resume writer specializing in ${detectedIndustry} roles. Create highly relevant, ATS-optimized experience bullets for this EXACT position.

DETAILED ROLE ANALYSIS:
- Exact Job Title: ${position || 'Professional'}
- Company Name: ${company || 'Leading Organization'}
- Industry Sector: ${detectedIndustry}
- Role Level: ${roleLevel}
- Current Responsibilities: ${responsibilities || 'Professional duties and strategic initiatives'}
- Employment Duration: ${startDate || 'Recent'} to ${endDate || 'Present'}
- Technical Skills: ${Array.isArray(skills) ? skills.join(', ') : skills || 'Professional skills'}
- ATS Keywords: ${relevantKeywords}
- Focus Theme: ${selectedFocus}
- Uniqueness Seed: ${randomSeed}`;

  // Add job description context if provided
  if (jobDescriptionForAI && jobDescriptionForAI.trim()) {
    prompt += `

ORIGINAL JOB DESCRIPTION FOR REFERENCE:
${jobDescriptionForAI.trim()}

CRITICAL: Use the job description above to understand the exact role requirements and tailor the experience bullets accordingly. Include relevant keywords, responsibilities, and qualifications mentioned in the job posting.`;
  }

  prompt += `

COMPANY-SPECIFIC CONTEXT:
- Research ${company} industry position and tailor content accordingly
- Use terminology specific to ${company}'s business model
- Reference ${position} responsibilities typical at ${company}
- Include metrics relevant to ${company}'s scale and industry

STRICT ATS OPTIMIZATION REQUIREMENTS:
1. EXACTLY 40-45 words total (count carefully)
2. Include 3-4 industry keywords from: ${relevantKeywords}
3. Use exact job title terminology: ${position}
4. Reference company name: ${company}
5. Start with power verb: Led, Spearheaded, Architected, Optimized, Delivered, Implemented, Managed, Achieved
6. Include ONE realistic metric for ${roleLevel} level:
   - Team sizes: ${metrics.teamSize}-${metrics.teamSize + 5} members OR
   - Performance improvements: ${metrics.improvement}-${metrics.improvement + 15}% OR
   - Budget/revenue: $${metrics.costSaving}K-$${metrics.revenue}K
7. Focus on ${selectedFocus}
8. Use past tense for completed roles, present tense for current
9. Professional, action-oriented language
10. COMPLETE the description - no truncation

CONTENT VARIATION STRATEGY:
- Generate completely different content each time
- Use different achievement examples and metrics
- Vary sentence structure and action verbs
- Change focus areas while maintaining role relevance
- Ensure no repetition from previous generations

Create ONE paragraph (40-45 words exactly) for ${position} at ${company}${jobDescriptionForAI ? ' that aligns perfectly with the provided job description requirements' : ''}. Count words to ensure exactly 40-45 words.`;

  try {
    const description = await makeDeepSeekRequest(prompt, {
      temperature: 0.7,
      maxTokens: 120,
      topP: 0.9,
      frequencyPenalty: 0.3,
      presencePenalty: 0.2
    });

    // Clean and format the response
    let cleanDescription = description
      .replace(/^(Experience:|Job Description:|Responsibilities:|Bullet Points:|ATS Bullets:|Description:)/i, '')
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

    // Enhanced fallback with 40-45 words
    const specificKeywords = relevantKeywords.split(', ').slice(0, 3);
    const fallbackDesc = `Led ${position || 'professional'} initiatives at ${company || 'the organization'}, managing ${metrics.teamSize}+ team members and implementing ${specificKeywords[0] || 'strategic'} solutions. Achieved ${metrics.improvement}% improvement in operational efficiency and $${metrics.costSaving}K cost savings through innovative ${position || 'professional'} strategies and cross-functional collaboration.`;

    return atsOptimizationService.enhanceContentForATS(fallbackDesc, detectedIndustry, 'experience');
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
    'full-stack web application with real-time features and user authentication',
    'mobile application with cross-platform compatibility and offline functionality',
    'enterprise software solution with microservices architecture and API integration',
    'e-commerce platform with payment processing and inventory management',
    'data analytics dashboard with visualization and reporting capabilities',
    'automation tool with workflow optimization and process streamlining',
    'machine learning model with predictive analytics and data insights',
    'cloud-based system with scalable infrastructure and containerization',
    'IoT solution with sensor integration and real-time monitoring',
    'blockchain application with smart contracts and decentralized features'
  ];

  const architecturePatterns = [
    'microservices architecture with containerized deployment',
    'serverless architecture with event-driven processing',
    'monolithic architecture with modular design patterns',
    'distributed system with load balancing and auto-scaling',
    'progressive web app with service worker implementation',
    'single-page application with component-based architecture',
    'RESTful API with GraphQL integration',
    'event-sourcing architecture with CQRS pattern'
  ];

  const selectedProjectType = projectTypes[randomSeed % projectTypes.length];
  const selectedArchitecture = architecturePatterns[randomSeed % architecturePatterns.length];

  // Generate technology-specific metrics
  const techMetrics = {
    performance: `${60 + Math.floor(Math.random() * 40)}%`,
    loadTime: `${0.5 + Math.random() * 2}s`,
    uptime: `${99.5 + Math.random() * 0.5}%`,
    users: `${1000 + Math.floor(Math.random() * 9000)}+`,
    throughput: `${100 + Math.floor(Math.random() * 900)}`,
    coverage: `${85 + Math.floor(Math.random() * 15)}%`
  };

  const prompt = `You are an expert technical resume writer specializing in ${detectedIndustry} projects. Create a highly technical, ATS-optimized project description for this SPECIFIC project.

DETAILED PROJECT ANALYSIS:
- Project Name: ${name || 'Professional Development Project'}
- Your Exact Role: ${role || 'Developer'}
- Technology Stack: ${techText || 'Modern development tools'}
- Project Type: ${selectedProjectType}
- Architecture: ${selectedArchitecture}
- Project Scope: ${description || 'Comprehensive technical solution'}
- Duration: ${duration || '4-6 months'}
- Team Composition: ${teamSize || '4-6'} member agile team
- Industry Context: ${detectedIndustry}
- Uniqueness Seed: ${randomSeed}

TECHNOLOGY-SPECIFIC REQUIREMENTS:
1. Reference EXACT project name: ${name}
2. Use ALL technologies mentioned: ${techText}
3. Include technology-specific terminology and best practices
4. Mention frameworks, libraries, and tools from the stack
5. Include realistic technical metrics:
   - Performance improvement: ${techMetrics.performance}
   - Load time optimization: ${techMetrics.loadTime}
   - System uptime: ${techMetrics.uptime}
   - User capacity: ${techMetrics.users}
   - Test coverage: ${techMetrics.coverage}

STRICT REQUIREMENTS:
- EXACTLY 40-45 words total (count carefully)
- Include project name "${name}" and your role "${role}"
- Mention 3-4 key technologies from: ${techText}
- Include ONE quantifiable technical achievement
- Use industry-specific terminology for ${detectedIndustry}
- Professional, technical language
- COMPLETE the description - no truncation

CONTENT VARIATION STRATEGY:
- Generate completely different technical focus each time
- Use different architecture patterns and implementation details
- Vary performance metrics and achievement examples
- Change technical emphasis while maintaining technology relevance
- Ensure no repetition from previous generations

Create ONE paragraph (40-45 words exactly) that demonstrates expertise in ${techText} and will score 95+ on ATS for ${role} positions. Count words to ensure exactly 40-45 words.`;

  try {
    const projectDesc = await makeDeepSeekRequest(prompt, {
      temperature: 0.7,
      maxTokens: 120,
      topP: 0.9,
      frequencyPenalty: 0.3,
      presencePenalty: 0.2
    });

    // Clean up and format the response
    let cleanDesc = projectDesc
      .replace(/^(Project:|Description:|Overview:|Summary:|Technical Description:)/i, '')
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

    // Enhanced fallback with 40-45 words
    const techArray = techText ? techText.split(',').map(t => t.trim()).slice(0, 3) : ['modern technologies'];
    const fallbackDesc = `Architected and developed ${name || 'comprehensive software solution'} using ${techArray.join(', ')}, serving as ${role || 'developer'} in ${teamSize || '5'}-member agile team. Implemented ${selectedArchitecture} achieving ${techMetrics.performance} performance improvement and ${techMetrics.loadTime} load time optimization with ${techMetrics.coverage} test coverage.`;

    return atsOptimizationService.enhanceContentForATS(fallbackDesc, detectedIndustry, 'project');
  }
};

/**
 * Generic content generation method for grammar analysis
 * @param {string} prompt - The prompt to send
 * @param {Object} options - Optional generation parameters
 * @returns {Promise<string>} - Generated content
 */
export const generateContent = async (prompt, options = {}) => {
  return await makeDeepSeekRequest(prompt, {
    temperature: options.temperature || 0.3,
    maxTokens: options.maxTokens || 300,
    ...options
  });
};

export default {
  generateProfessionalSummary,
  generateExperienceDescription,
  generateProjectDescription,
  generateContent,
  isDeepSeekConfigured
};
