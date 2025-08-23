/**
 * Advanced ATS (Applicant Tracking System) Service
 * Enterprise-grade resume analysis and scoring system
 */

import { isAIConfigured } from './aiService';
import geminiService from './geminiService';

// Industry-specific keywords database
const INDUSTRY_KEYWORDS = {
  technology: [
    'javascript', 'python', 'java', 'react', 'node.js', 'aws', 'docker', 'kubernetes',
    'microservices', 'api', 'database', 'sql', 'nosql', 'git', 'agile', 'scrum',
    'devops', 'ci/cd', 'cloud', 'machine learning', 'ai', 'data science', 'frontend',
    'backend', 'full-stack', 'mobile', 'ios', 'android', 'web development'
  ],
  marketing: [
    'digital marketing', 'seo', 'sem', 'social media', 'content marketing', 'email marketing',
    'analytics', 'google analytics', 'facebook ads', 'google ads', 'conversion optimization',
    'brand management', 'campaign management', 'lead generation', 'crm', 'marketing automation'
  ],
  finance: [
    'financial analysis', 'accounting', 'budgeting', 'forecasting', 'excel', 'financial modeling',
    'risk management', 'compliance', 'audit', 'gaap', 'ifrs', 'tax', 'investment', 'portfolio',
    'derivatives', 'banking', 'insurance', 'financial planning', 'treasury'
  ],
  sales: [
    'sales', 'business development', 'lead generation', 'crm', 'salesforce', 'pipeline management',
    'account management', 'client relations', 'negotiation', 'closing', 'prospecting',
    'cold calling', 'relationship building', 'quota achievement', 'revenue growth'
  ],
  healthcare: [
    'patient care', 'medical', 'clinical', 'healthcare', 'nursing', 'diagnosis', 'treatment',
    'medical records', 'hipaa', 'pharmaceutical', 'medical devices', 'surgery', 'therapy',
    'rehabilitation', 'emergency medicine', 'preventive care', 'health informatics'
  ]
};

// Action verbs that indicate strong performance
const STRONG_ACTION_VERBS = [
  'achieved', 'accelerated', 'accomplished', 'advanced', 'analyzed', 'built', 'created',
  'delivered', 'developed', 'directed', 'drove', 'enhanced', 'established', 'executed',
  'generated', 'implemented', 'improved', 'increased', 'initiated', 'launched', 'led',
  'managed', 'optimized', 'organized', 'pioneered', 'reduced', 'resolved', 'streamlined',
  'strengthened', 'supervised', 'transformed', 'upgraded'
];

// Quantifiable metrics indicators
const METRICS_INDICATORS = [
  '%', 'percent', 'million', 'thousand', 'billion', '$', 'revenue', 'sales', 'growth',
  'increase', 'decrease', 'reduction', 'improvement', 'efficiency', 'productivity',
  'roi', 'kpi', 'metric', 'target', 'goal', 'benchmark', 'performance'
];

// Education quality indicators
const EDUCATION_QUALITY = {
  degrees: {
    'phd': 100, 'doctorate': 100, 'ph.d': 100,
    'master': 85, 'mba': 90, 'ms': 85, 'ma': 85, 'm.s': 85, 'm.a': 85,
    'bachelor': 70, 'bs': 70, 'ba': 70, 'b.s': 70, 'b.a': 70,
    'associate': 50, 'diploma': 40, 'certificate': 30
  },
  institutions: {
    // Top tier universities (examples)
    'harvard': 100, 'stanford': 100, 'mit': 100, 'yale': 100, 'princeton': 100,
    'columbia': 95, 'university of chicago': 95, 'caltech': 95, 'cornell': 95,
    'duke': 90, 'northwestern': 90, 'johns hopkins': 90, 'vanderbilt': 90
  }
};

// Professional certifications value
const CERTIFICATIONS_VALUE = {
  technology: {
    'aws certified': 90, 'google cloud': 85, 'azure certified': 85, 'cissp': 95,
    'pmp': 80, 'scrum master': 70, 'kubernetes': 75, 'docker certified': 70
  },
  marketing: {
    'google ads certified': 80, 'facebook blueprint': 75, 'hubspot certified': 70,
    'google analytics': 75, 'hootsuite certified': 65
  },
  finance: {
    'cpa': 95, 'cfa': 90, 'frm': 85, 'cma': 80, 'cia': 85
  }
};

/**
 * Extract text content from resume data
 */
const extractResumeText = (resumeData) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resumeData;
  
  let text = '';
  
  // Personal info
  if (personalInfo) {
    text += `${personalInfo.fullName || ''} ${personalInfo.email || ''} ${personalInfo.phone || ''} `;
    text += `${personalInfo.location || ''} ${personalInfo.jobTitle || ''} `;
  }
  
  // Summary
  if (summary) {
    text += `${summary} `;
  }
  
  // Experience
  if (experience && experience.length > 0) {
    experience.forEach(exp => {
      text += `${exp.position || ''} ${exp.company || ''} ${exp.description || ''} `;
      text += `${exp.responsibilities || ''} `;
    });
  }
  
  // Education
  if (education && education.length > 0) {
    education.forEach(edu => {
      text += `${edu.degree || ''} ${edu.field || ''} ${edu.institution || ''} `;
    });
  }
  
  // Skills
  if (skills) {
    if (skills.technical) text += skills.technical.join(' ') + ' ';
    if (skills.soft) text += skills.soft.join(' ') + ' ';
    if (skills.languages) text += skills.languages.join(' ') + ' ';
  }
  
  // Projects
  if (projects && projects.length > 0) {
    projects.forEach(proj => {
      text += `${proj.name || ''} ${proj.description || ''} `;
      if (proj.technologies) text += proj.technologies.join(' ') + ' ';
    });
  }
  
  // Certifications
  if (certifications && certifications.length > 0) {
    certifications.forEach(cert => {
      text += `${cert.name || ''} ${cert.issuer || ''} `;
    });
  }
  
  return text.toLowerCase();
};

/**
 * Analyze keyword density and relevance
 */
const analyzeKeywords = (text, jobDescription = '') => {
  const analysis = {
    industryMatch: 0,
    actionVerbs: 0,
    quantifiableMetrics: 0,
    keywordDensity: 0,
    relevantKeywords: [],
    missingKeywords: []
  };
  
  // Detect industry based on keywords
  let detectedIndustry = 'general';
  let maxMatches = 0;
  
  Object.keys(INDUSTRY_KEYWORDS).forEach(industry => {
    const matches = INDUSTRY_KEYWORDS[industry].filter(keyword => 
      text.includes(keyword.toLowerCase())
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedIndustry = industry;
    }
  });
  
  // Calculate industry keyword match percentage
  const industryKeywords = INDUSTRY_KEYWORDS[detectedIndustry] || [];
  const matchedKeywords = industryKeywords.filter(keyword => 
    text.includes(keyword.toLowerCase())
  );
  
  analysis.industryMatch = Math.min((matchedKeywords.length / industryKeywords.length) * 100, 100);
  analysis.relevantKeywords = matchedKeywords;
  analysis.missingKeywords = industryKeywords.filter(keyword => 
    !text.includes(keyword.toLowerCase())
  ).slice(0, 10); // Top 10 missing keywords
  
  // Count action verbs
  const actionVerbCount = STRONG_ACTION_VERBS.filter(verb => 
    text.includes(verb.toLowerCase())
  ).length;
  analysis.actionVerbs = Math.min((actionVerbCount / 10) * 100, 100); // Max score at 10 verbs
  
  // Count quantifiable metrics
  const metricsCount = METRICS_INDICATORS.filter(metric => 
    text.includes(metric.toLowerCase())
  ).length;
  analysis.quantifiableMetrics = Math.min((metricsCount / 5) * 100, 100); // Max score at 5 metrics
  
  // Calculate keyword density
  const words = text.split(/\s+/).length;
  const relevantWords = matchedKeywords.length + actionVerbCount;
  analysis.keywordDensity = words > 0 ? (relevantWords / words) * 100 : 0;
  
  return { analysis, detectedIndustry };
};

/**
 * Analyze education quality and relevance
 */
const analyzeEducation = (education) => {
  if (!education || education.length === 0) {
    return { score: 0, feedback: ['Add education details to improve your score'] };
  }
  
  let totalScore = 0;
  let maxScore = 0;
  const feedback = [];
  
  education.forEach(edu => {
    let eduScore = 0;
    
    // Degree level scoring
    const degree = (edu.degree || '').toLowerCase();
    const degreeScore = Object.keys(EDUCATION_QUALITY.degrees).find(d => 
      degree.includes(d)
    );
    if (degreeScore) {
      eduScore += EDUCATION_QUALITY.degrees[degreeScore];
    } else {
      feedback.push(`Specify your degree type more clearly: "${edu.degree}"`);
    }
    
    // Institution prestige scoring
    const institution = (edu.institution || '').toLowerCase();
    const institutionScore = Object.keys(EDUCATION_QUALITY.institutions).find(inst => 
      institution.includes(inst)
    );
    if (institutionScore) {
      eduScore += EDUCATION_QUALITY.institutions[institutionScore] * 0.3; // 30% weight
    }
    
    // GPA scoring (if provided)
    if (edu.gpa && parseFloat(edu.gpa) >= 3.5) {
      eduScore += 20;
    }
    
    // Graduation year relevance
    if (edu.graduationYear) {
      const currentYear = new Date().getFullYear();
      const yearsDiff = currentYear - parseInt(edu.graduationYear);
      if (yearsDiff <= 5) eduScore += 10; // Recent graduate bonus
    }
    
    totalScore += eduScore;
    maxScore += 130; // Max possible score per education entry
  });
  
  const finalScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  
  if (finalScore < 50) {
    feedback.push('Consider adding more prestigious institutions or higher degrees');
  }
  
  return { score: Math.min(finalScore, 100), feedback };
};

/**
 * Analyze work experience quality
 */
const analyzeExperience = (experience, text) => {
  if (!experience || experience.length === 0) {
    return { score: 0, feedback: ['Add work experience to improve your score'] };
  }
  
  let score = 0;
  const feedback = [];
  
  // Experience quantity scoring
  const experienceYears = experience.length;
  score += Math.min(experienceYears * 15, 60); // Max 60 points for 4+ experiences
  
  // Experience quality scoring
  let qualityScore = 0;
  experience.forEach(exp => {
    // Job title progression
    const title = (exp.position || '').toLowerCase();
    if (title.includes('senior') || title.includes('lead') || title.includes('manager')) {
      qualityScore += 20;
    } else if (title.includes('junior') || title.includes('intern')) {
      qualityScore += 5;
    } else {
      qualityScore += 10;
    }
    
    // Description quality
    const description = (exp.description || '').toLowerCase();
    if (description.length > 100) qualityScore += 10;
    if (description.length > 200) qualityScore += 10;
    
    // Company size indicators
    const company = (exp.company || '').toLowerCase();
    if (company.includes('inc') || company.includes('corp') || company.includes('ltd')) {
      qualityScore += 5;
    }
  });
  
  score += Math.min(qualityScore, 40); // Max 40 points for quality
  
  // Feedback generation
  if (experienceYears < 2) {
    feedback.push('Add more work experience entries to strengthen your profile');
  }
  
  const avgDescLength = experience.reduce((sum, exp) => 
    sum + (exp.description || '').length, 0) / experience.length;
  
  if (avgDescLength < 100) {
    feedback.push('Expand your job descriptions with more details and achievements');
  }
  
  return { score: Math.min(score, 100), feedback };
};

/**
 * Analyze formatting and structure
 */
const analyzeFormatting = (resumeData) => {
  const { personalInfo, summary, experience, education, skills } = resumeData;
  let score = 0;
  const feedback = [];

  // Contact information completeness
  if (personalInfo) {
    if (personalInfo.fullName && personalInfo.fullName.split(' ').length >= 2) score += 10;
    else feedback.push('Use your full name (first and last name)');

    if (personalInfo.email && personalInfo.email.includes('@')) score += 10;
    else feedback.push('Add a valid email address');

    if (personalInfo.phone) score += 5;
    else feedback.push('Add your phone number');

    if (personalInfo.location) score += 5;
    else feedback.push('Add your location/city');

    if (personalInfo.jobTitle) score += 10;
    else feedback.push('Add a professional job title');
  } else {
    feedback.push('Complete your personal information section');
  }

  // Section completeness
  if (summary && summary.length >= 50) score += 15;
  else feedback.push('Add a professional summary (at least 50 characters)');

  if (experience && experience.length > 0) score += 20;
  else feedback.push('Add work experience entries');

  if (education && education.length > 0) score += 15;
  else feedback.push('Add education details');

  if (skills && (skills.technical?.length > 0 || skills.soft?.length > 0)) score += 10;
  else feedback.push('Add relevant skills');

  // Length and detail checks
  if (experience && experience.length > 0) {
    const hasDetailedDescriptions = experience.some(exp =>
      (exp.description || '').length > 100
    );
    if (hasDetailedDescriptions) score += 15;
    else feedback.push('Add more detailed job descriptions');
  }

  return { score: Math.min(score, 100), feedback };
};

/**
 * AI-powered content analysis
 */
const analyzeContentWithAI = async (resumeData, jobDescription = '') => {
  if (!isAIConfigured()) {
    return {
      score: 50,
      feedback: ['AI analysis unavailable - configure Gemini API for advanced analysis'],
      aiAnalysis: null
    };
  }

  try {
    const resumeText = extractResumeText(resumeData);

    const prompt = `Analyze this resume for ATS compatibility and professional quality. Provide a score (0-100) and specific feedback.

Resume Content:
${resumeText.substring(0, 2000)} ${resumeText.length > 2000 ? '...' : ''}

${jobDescription ? `Job Description: ${jobDescription.substring(0, 500)}` : ''}

Analyze for:
1. Professional language and tone
2. Achievement-oriented content
3. Industry relevance
4. Quantifiable results
5. ATS keyword optimization
6. Content structure and flow

Provide response in this format:
SCORE: [0-100]
STRENGTHS: [2-3 key strengths]
IMPROVEMENTS: [3-4 specific improvements]
KEYWORDS: [5-8 missing important keywords]`;

    // Use the Gemini service to make the request
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 200,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Analysis completed';

    // Parse AI response
    const scoreMatch = aiResponse.match(/SCORE:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;

    const strengthsMatch = aiResponse.match(/STRENGTHS:\s*(.*?)(?=IMPROVEMENTS:|$)/is);
    const strengths = strengthsMatch ? strengthsMatch[1].trim().split('\n').filter(s => s.trim()) : [];

    const improvementsMatch = aiResponse.match(/IMPROVEMENTS:\s*(.*?)(?=KEYWORDS:|$)/is);
    const improvements = improvementsMatch ? improvementsMatch[1].trim().split('\n').filter(s => s.trim()) : [];

    const keywordsMatch = aiResponse.match(/KEYWORDS:\s*(.*?)$/is);
    const keywords = keywordsMatch ? keywordsMatch[1].trim().split('\n').filter(s => s.trim()) : [];

    return {
      score: Math.min(Math.max(score, 0), 100),
      feedback: [...improvements.slice(0, 4)],
      aiAnalysis: {
        strengths: strengths.slice(0, 3),
        improvements: improvements.slice(0, 4),
        missingKeywords: keywords.slice(0, 8),
        fullResponse: aiResponse
      }
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      score: 60,
      feedback: ['AI analysis failed - using basic analysis'],
      aiAnalysis: null
    };
  }
};

/**
 * Main ATS analysis function
 */
export const performAdvancedATSAnalysis = async (resumeData, jobDescription = '') => {
  const startTime = Date.now();

  // Extract resume text
  const resumeText = extractResumeText(resumeData);

  // Perform all analyses
  const [
    keywordAnalysis,
    educationAnalysis,
    experienceAnalysis,
    formattingAnalysis,
    aiAnalysis
  ] = await Promise.all([
    Promise.resolve(analyzeKeywords(resumeText, jobDescription)),
    Promise.resolve(analyzeEducation(resumeData.education)),
    Promise.resolve(analyzeExperience(resumeData.experience, resumeText)),
    Promise.resolve(analyzeFormatting(resumeData)),
    analyzeContentWithAI(resumeData, jobDescription)
  ]);

  // Calculate weighted scores
  const weights = {
    keywords: 0.25,      // 25% - Keyword relevance
    experience: 0.25,    // 25% - Work experience quality
    education: 0.15,     // 15% - Education background
    formatting: 0.15,    // 15% - Structure and completeness
    aiAnalysis: 0.20     // 20% - AI content analysis
  };

  const finalScore = Math.round(
    (keywordAnalysis.analysis.industryMatch * weights.keywords) +
    (experienceAnalysis.score * weights.experience) +
    (educationAnalysis.score * weights.education) +
    (formattingAnalysis.score * weights.formatting) +
    (aiAnalysis.score * weights.aiAnalysis)
  );

  // Compile comprehensive feedback
  const allFeedback = [
    ...formattingAnalysis.feedback,
    ...experienceAnalysis.feedback,
    ...educationAnalysis.feedback,
    ...aiAnalysis.feedback
  ];

  // Generate priority suggestions
  const prioritySuggestions = [];
  if (finalScore < 60) {
    prioritySuggestions.push('🚨 Critical: Your resume needs significant improvements for ATS compatibility');
  } else if (finalScore < 80) {
    prioritySuggestions.push('⚠️ Good: Your resume is decent but has room for improvement');
  } else {
    prioritySuggestions.push('✅ Excellent: Your resume is well-optimized for ATS systems');
  }

  // Add keyword suggestions
  if (keywordAnalysis.analysis.missingKeywords.length > 0) {
    prioritySuggestions.push(
      `🔑 Add these ${keywordAnalysis.detectedIndustry} keywords: ${keywordAnalysis.analysis.missingKeywords.slice(0, 5).join(', ')}`
    );
  }

  const analysisTime = Date.now() - startTime;

  return {
    overallScore: finalScore,
    detailedScores: {
      keywordRelevance: Math.round(keywordAnalysis.analysis.industryMatch),
      experienceQuality: experienceAnalysis.score,
      educationBackground: educationAnalysis.score,
      formattingStructure: formattingAnalysis.score,
      contentQuality: aiAnalysis.score
    },
    industryDetected: keywordAnalysis.detectedIndustry,
    keywordAnalysis: keywordAnalysis.analysis,
    suggestions: allFeedback.slice(0, 8), // Top 8 suggestions
    prioritySuggestions,
    aiInsights: aiAnalysis.aiAnalysis,
    analysisMetrics: {
      processingTime: `${analysisTime}ms`,
      wordsAnalyzed: resumeText.split(/\s+/).length,
      sectionsAnalyzed: 5,
      aiPowered: isAIConfigured()
    }
  };
};

export { analyzeKeywords, analyzeEducation, analyzeExperience, extractResumeText, INDUSTRY_KEYWORDS };
