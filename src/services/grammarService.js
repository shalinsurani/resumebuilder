/**
 * Smart Grammar Check Service
 * Advanced grammar and writing analysis for resumes
 */

import { isAIConfigured } from './aiService';
import geminiService from './geminiService';

// Common grammar patterns and rules
const GRAMMAR_RULES = {
  // Spelling and typos (common resume mistakes)
  spelling: [
    { pattern: /\brecieve\b/gi, correction: 'receive', type: 'spelling' },
    { pattern: /\baccomplishements\b/gi, correction: 'accomplishments', type: 'spelling' },
    { pattern: /\bresponsibilites\b/gi, correction: 'responsibilities', type: 'spelling' },
    { pattern: /\bexperiance\b/gi, correction: 'experience', type: 'spelling' },
    { pattern: /\bmanagment\b/gi, correction: 'management', type: 'spelling' },
    { pattern: /\bdevelopement\b/gi, correction: 'development', type: 'spelling' },
    { pattern: /\borganisation\b/gi, correction: 'organization', type: 'spelling' },
    { pattern: /\bseperate\b/gi, correction: 'separate', type: 'spelling' },
    { pattern: /\boccured\b/gi, correction: 'occurred', type: 'spelling' },
    { pattern: /\bsuccessfull\b/gi, correction: 'successful', type: 'spelling' }
  ],

  // Grammar issues
  grammar: [
    { pattern: /\bi am\b/gi, correction: 'Remove first person (use action verbs)', type: 'grammar' },
    { pattern: /\bmy\b/gi, correction: 'Remove personal pronouns', type: 'grammar' },
    { pattern: /\bwe\b/gi, correction: 'Use "I" or action verbs instead', type: 'grammar' },
    { pattern: /\bthat\s+that\b/gi, correction: 'Remove duplicate "that"', type: 'grammar' },
    { pattern: /\bvery\s+\w+/gi, correction: 'Use stronger adjectives instead of "very"', type: 'grammar' },
    { pattern: /\ba\s+[aeiou]/gi, correction: 'Use "an" before vowel sounds', type: 'grammar' },
    { pattern: /\ban\s+[bcdfghjklmnpqrstvwxyz]/gi, correction: 'Use "a" before consonant sounds', type: 'grammar' }
  ],

  // Punctuation
  punctuation: [
    { pattern: /\s+,/g, correction: 'Remove space before comma', type: 'punctuation' },
    { pattern: /,(?!\s)/g, correction: 'Add space after comma', type: 'punctuation' },
    { pattern: /\s+\./g, correction: 'Remove space before period', type: 'punctuation' },
    { pattern: /\.{2,}/g, correction: 'Use single period or ellipsis (...)', type: 'punctuation' },
    { pattern: /\s+;/g, correction: 'Remove space before semicolon', type: 'punctuation' },
    { pattern: /;(?!\s)/g, correction: 'Add space after semicolon', type: 'punctuation' }
  ],

  // Style and formatting
  style: [
    { pattern: /\b(helped|assisted)\b/gi, correction: 'Use stronger action verbs (led, managed, developed)', type: 'style' },
    { pattern: /\bresponsible for\b/gi, correction: 'Use active voice (managed, oversaw, directed)', type: 'style' },
    { pattern: /\bworked on\b/gi, correction: 'Use specific action verbs (developed, created, implemented)', type: 'style' },
    { pattern: /\bgood\b/gi, correction: 'Use more specific adjectives (excellent, outstanding, proficient)', type: 'style' },
    { pattern: /\bbad\b/gi, correction: 'Use more professional language', type: 'style' },
    { pattern: /\bstuff\b/gi, correction: 'Use specific terms instead of "stuff"', type: 'style' },
    { pattern: /\bthing\b/gi, correction: 'Use specific terms instead of "thing"', type: 'style' }
  ],

  // Resume-specific issues
  resume: [
    { pattern: /\breferences available upon request\b/gi, correction: 'Remove - this is assumed', type: 'resume' },
    { pattern: /\bcurriculum vitae\b/gi, correction: 'Use "resume" for US applications', type: 'resume' },
    { pattern: /\bphone:\s*/gi, correction: 'Remove label, just list number', type: 'resume' },
    { pattern: /\bemail:\s*/gi, correction: 'Remove label, just list email', type: 'resume' },
    { pattern: /\baddress:\s*/gi, correction: 'Remove label, just list address', type: 'resume' }
  ]
};

// Professional action verbs for suggestions
const ACTION_VERBS = [
  'Achieved', 'Accelerated', 'Accomplished', 'Advanced', 'Analyzed', 'Built', 'Created',
  'Delivered', 'Developed', 'Directed', 'Drove', 'Enhanced', 'Established', 'Executed',
  'Generated', 'Implemented', 'Improved', 'Increased', 'Initiated', 'Launched', 'Led',
  'Managed', 'Optimized', 'Organized', 'Pioneered', 'Reduced', 'Resolved', 'Streamlined',
  'Strengthened', 'Supervised', 'Transformed', 'Upgraded'
];

/**
 * Extract all text content from resume data
 */
const extractResumeText = (resumeData) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resumeData;
  
  let sections = [];
  
  // Personal info
  if (personalInfo) {
    if (personalInfo.fullName) sections.push({ text: personalInfo.fullName, section: 'Personal Info', field: 'Name' });
    if (personalInfo.jobTitle) sections.push({ text: personalInfo.jobTitle, section: 'Personal Info', field: 'Job Title' });
  }
  
  // Summary
  if (summary) {
    sections.push({ text: summary, section: 'Professional Summary', field: 'Summary' });
  }
  
  // Experience
  if (experience && experience.length > 0) {
    experience.forEach((exp, index) => {
      if (exp.position) sections.push({ text: exp.position, section: 'Experience', field: `Position ${index + 1}` });
      if (exp.company) sections.push({ text: exp.company, section: 'Experience', field: `Company ${index + 1}` });
      if (exp.description) sections.push({ text: exp.description, section: 'Experience', field: `Description ${index + 1}` });
      if (exp.responsibilities) sections.push({ text: exp.responsibilities, section: 'Experience', field: `Responsibilities ${index + 1}` });
    });
  }
  
  // Education
  if (education && education.length > 0) {
    education.forEach((edu, index) => {
      if (edu.degree) sections.push({ text: edu.degree, section: 'Education', field: `Degree ${index + 1}` });
      if (edu.field) sections.push({ text: edu.field, section: 'Education', field: `Field ${index + 1}` });
      if (edu.institution) sections.push({ text: edu.institution, section: 'Education', field: `Institution ${index + 1}` });
    });
  }
  
  // Skills
  if (skills) {
    if (skills.technical) skills.technical.forEach((skill, index) => {
      sections.push({ text: skill, section: 'Skills', field: `Technical Skill ${index + 1}` });
    });
    if (skills.soft) skills.soft.forEach((skill, index) => {
      sections.push({ text: skill, section: 'Skills', field: `Soft Skill ${index + 1}` });
    });
  }
  
  // Projects
  if (projects && projects.length > 0) {
    projects.forEach((proj, index) => {
      if (proj.name) sections.push({ text: proj.name, section: 'Projects', field: `Project Name ${index + 1}` });
      if (proj.description) sections.push({ text: proj.description, section: 'Projects', field: `Project Description ${index + 1}` });
    });
  }
  
  // Certifications
  if (certifications && certifications.length > 0) {
    certifications.forEach((cert, index) => {
      if (cert.name) sections.push({ text: cert.name, section: 'Certifications', field: `Certification ${index + 1}` });
    });
  }
  
  return sections;
};

/**
 * Check text against grammar rules
 */
const checkGrammarRules = (textSections) => {
  const issues = [];
  
  textSections.forEach(section => {
    const text = section.text;
    if (!text || typeof text !== 'string') return;
    
    // Check all rule categories
    Object.keys(GRAMMAR_RULES).forEach(category => {
      GRAMMAR_RULES[category].forEach(rule => {
        const matches = text.match(rule.pattern);
        if (matches) {
          matches.forEach(match => {
            const index = text.indexOf(match);
            issues.push({
              type: rule.type,
              category: category,
              text: match,
              correction: rule.correction,
              context: text.substring(Math.max(0, index - 20), index + match.length + 20),
              section: section.section,
              field: section.field,
              severity: getSeverity(rule.type),
              position: index
            });
          });
        }
      });
    });
  });
  
  return issues;
};

/**
 * Get severity level for issue type
 */
const getSeverity = (type) => {
  const severityMap = {
    'spelling': 'high',
    'grammar': 'high',
    'punctuation': 'medium',
    'style': 'low',
    'resume': 'medium'
  };
  return severityMap[type] || 'low';
};

/**
 * AI-powered grammar analysis
 */
const analyzeWithAI = async (resumeText) => {
  // Enhanced rule-based spelling and grammar detection
  const detectedIssues = [];

  // Common spelling mistakes in resumes
  const commonMistakes = {
    'recieve': 'receive',
    'seperate': 'separate',
    'occured': 'occurred',
    'managment': 'management',
    'developement': 'development',
    'responsibilty': 'responsibility',
    'experiance': 'experience',
    'sucessful': 'successful',
    'acheivement': 'achievement',
    'maintainance': 'maintenance',
    'colaboration': 'collaboration',
    'analize': 'analyze',
    'efficent': 'efficient',
    'consistant': 'consistent',
    'independant': 'independent',
    'enviroment': 'environment',
    'recomendation': 'recommendation',
    'profesional': 'professional',
    'comunication': 'communication',
    'knowlege': 'knowledge',
    'ther': 'there',
    'thier': 'their',
    'teh': 'the',
    'adn': 'and',
    'taht': 'that',
    'hte': 'the',
    'fo': 'of',
    'tot': 'to',
    'writting': 'writing',
    'begining': 'beginning',
    'reccomend': 'recommend',
    'accomodate': 'accommodate',
    'definately': 'definitely',
    'neccessary': 'necessary',
    'occassion': 'occasion',
    'priviledge': 'privilege',
    'recieve': 'receive',
    'beleive': 'believe',
    'acheive': 'achieve',
    'freind': 'friend',
    'wierd': 'weird',
    'calender': 'calendar',
    'cemetary': 'cemetery',
    'concious': 'conscious',
    'embarass': 'embarrass',
    'existance': 'existence',
    'goverment': 'government',
    'independance': 'independence',
    'judgement': 'judgment',
    'liesure': 'leisure',
    'mispell': 'misspell',
    'noticable': 'noticeable',
    'occurance': 'occurrence',
    'perseverence': 'perseverance',
    'questionaire': 'questionnaire',
    'rythm': 'rhythm',
    'seperation': 'separation',
    'temperture': 'temperature',
    'untill': 'until',
    'vaccuum': 'vacuum',
    'wether': 'whether'
  };

  // Check for spelling mistakes (case-insensitive)
  const wordMatches = resumeText.match(/\b[a-zA-Z]+\b/g) || [];
  wordMatches.forEach(originalWord => {
    const lowerWord = originalWord.toLowerCase();
    if (commonMistakes[lowerWord]) {
      detectedIssues.push({
        type: 'spelling',
        severity: 'high',
        text: originalWord,
        suggestion: commonMistakes[lowerWord],
        message: `Spelling error: "${originalWord}" should be "${commonMistakes[lowerWord]}"`
      });
    }
  });

  // Grammar pattern checks
  const grammarPatterns = [
    {
      pattern: /\bi\s+/gi,
      message: 'Avoid using "I" in resume - use action verbs instead',
      severity: 'medium'
    },
    {
      pattern: /\bresponsible for\b/gi,
      message: 'Replace "responsible for" with stronger action verbs',
      severity: 'low'
    },
    {
      pattern: /\bhelped\b/gi,
      message: 'Replace "helped" with more specific action verbs',
      severity: 'low'
    },
    {
      pattern: /\.\s*[a-z]/g,
      message: 'Capitalize first letter after periods',
      severity: 'medium'
    },
    {
      pattern: /\s{2,}/g,
      message: 'Remove extra spaces',
      severity: 'low'
    }
  ];

  grammarPatterns.forEach(({ pattern, message, severity }) => {
    const matches = resumeText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        detectedIssues.push({
          type: 'grammar',
          severity,
          text: match.trim(),
          message,
          suggestion: severity === 'medium' ? 'Use professional resume language' : 'Review and correct'
        });
      });
    }
  });

  // Calculate score based on issues found
  const highSeverity = detectedIssues.filter(i => i.severity === 'high').length;
  const mediumSeverity = detectedIssues.filter(i => i.severity === 'medium').length;
  const lowSeverity = detectedIssues.filter(i => i.severity === 'low').length;

  let score = 100;
  score -= (highSeverity * 15); // -15 for each spelling error
  score -= (mediumSeverity * 8); // -8 for each grammar issue
  score -= (lowSeverity * 3); // -3 for each style issue
  score = Math.max(score, 20); // Minimum score of 20

  // Try AI analysis as enhancement if available
  if (geminiService.isGeminiConfigured()) {
    try {
      const prompt = `You are a professional proofreader. Carefully examine this resume text and find ALL spelling mistakes, grammar errors, and style issues.

RESUME TEXT TO ANALYZE:
${resumeText.substring(0, 1500)}

INSTRUCTIONS:
1. Check EVERY word for spelling mistakes (including common typos like "experiance", "managment", "recieved", "seperate", "occured", "developement", "responsibilty")
2. Find grammar errors (subject-verb disagreement, wrong tense, missing articles)
3. Identify punctuation problems
4. Look for unprofessional language
5. Check for consistency issues

IMPORTANT: Be very thorough. Even check words that look correct - they might be subtle misspellings.

FORMAT YOUR RESPONSE EXACTLY AS:
SPELLING_ERRORS:
- [wrong word] -> [correct word]

GRAMMAR_ERRORS:
- [error] -> [correction]

STYLE_ISSUES:
- [issue] -> [improvement]

Example:
SPELLING_ERRORS:
- experiance -> experience
- managment -> management

Find ALL errors, no matter how small!`;

      const aiResponse = await geminiService.generateContent(prompt);
      console.log('Gemini AI Response:', aiResponse); // Debug log

      // Parse Gemini response for different types of errors
      const spellingSection = aiResponse.match(/SPELLING_ERRORS:(.*?)(?=GRAMMAR_ERRORS:|STYLE_ISSUES:|$)/is);
      const grammarSection = aiResponse.match(/GRAMMAR_ERRORS:(.*?)(?=STYLE_ISSUES:|$)/is);
      const styleSection = aiResponse.match(/STYLE_ISSUES:(.*?)$/is);

      console.log('Parsed sections:', { spellingSection, grammarSection, styleSection }); // Debug log

      // Process spelling errors
      if (spellingSection) {
        const spellingErrors = spellingSection[1].match(/- ([^-]+) -> ([^\n]+)/g) || [];
        spellingErrors.forEach(error => {
          const match = error.match(/- ([^-]+) -> ([^\n]+)/);
          if (match) {
            detectedIssues.push({
              type: 'ai_spelling',
              severity: 'high',
              text: match[1].trim(),
              suggestion: match[2].trim(),
              message: `Spelling error: "${match[1].trim()}" should be "${match[2].trim()}"`
            });
          }
        });
      }

      // Process grammar errors
      if (grammarSection) {
        const grammarErrors = grammarSection[1].match(/- ([^-]+) -> ([^\n]+)/g) || [];
        grammarErrors.forEach(error => {
          const match = error.match(/- ([^-]+) -> ([^\n]+)/);
          if (match) {
            detectedIssues.push({
              type: 'ai_grammar',
              severity: 'medium',
              text: match[1].trim(),
              suggestion: match[2].trim(),
              message: `Grammar error: "${match[1].trim()}" should be "${match[2].trim()}"`
            });
          }
        });
      }

      // Process style issues
      if (styleSection) {
        const styleErrors = styleSection[1].match(/- ([^-]+) -> ([^\n]+)/g) || [];
        styleErrors.forEach(error => {
          const match = error.match(/- ([^-]+) -> ([^\n]+)/);
          if (match) {
            detectedIssues.push({
              type: 'ai_style',
              severity: 'low',
              text: match[1].trim(),
              suggestion: match[2].trim(),
              message: `Style improvement: "${match[1].trim()}" could be "${match[2].trim()}"`
            });
          }
        });
      }
    } catch (error) {
      console.warn('Gemini analysis failed, using rule-based detection only:', error);
    }
  }

  console.log('Total detected issues:', detectedIssues); // Debug log

  const errors = detectedIssues.filter(i =>
    i.type === 'spelling' ||
    i.type === 'ai_spelling' ||
    i.type === 'ai_grammar' ||
    i.type === 'ai_detected'
  );

  const styleImprovements = detectedIssues.filter(i =>
    i.type === 'grammar' ||
    i.type === 'ai_style'
  );

  console.log('Filtered errors:', errors); // Debug log
  console.log('Style improvements:', styleImprovements); // Debug log

  return {
    score: Math.min(Math.max(score, 0), 100),
    aiAnalysis: {
      errors: errors.map(i => i.message),
      styleImprovements: styleImprovements.map(i => i.message),
      suggestions: [
        'Use strong action verbs to start bullet points',
        'Quantify achievements with specific numbers',
        'Maintain consistent verb tense throughout',
        'Proofread carefully for spelling and grammar'
      ],
      detectedIssues
    }
  };
};

/**
 * Convert AI-detected errors to structured issues
 */
const convertAIErrorsToIssues = (aiAnalysis, textSections) => {
  const aiIssues = [];

  if (aiAnalysis && aiAnalysis.errors) {
    aiAnalysis.errors.forEach((error, index) => {
      // Try to extract specific error details from AI response
      const errorText = error.toLowerCase();

      // Determine category based on error content
      let category = 'grammar';
      let severity = 'high';

      if (errorText.includes('spell') || errorText.includes('misspell')) {
        category = 'spelling';
      } else if (errorText.includes('punctuation') || errorText.includes('comma') || errorText.includes('period')) {
        category = 'punctuation';
        severity = 'medium';
      } else if (errorText.includes('style') || errorText.includes('tone') || errorText.includes('professional')) {
        category = 'style';
        severity = 'low';
      }

      // Try to find the section this error relates to
      let section = 'General';
      let field = 'Content';

      if (errorText.includes('experience') || errorText.includes('years')) {
        section = 'Experience';
        field = 'Description';
      } else if (errorText.includes('education') || errorText.includes('university') || errorText.includes('degree')) {
        section = 'Education';
        field = 'Institution/Degree';
      } else if (errorText.includes('summary') || errorText.includes('objective')) {
        section = 'Professional Summary';
        field = 'Summary';
      }

      aiIssues.push({
        type: category,
        category: category,
        text: error.substring(0, 50) + (error.length > 50 ? '...' : ''), // Truncate long errors
        correction: 'See AI suggestion for correction',
        context: error,
        section: section,
        field: field,
        severity: severity,
        position: index,
        source: 'ai'
      });
    });
  }

  return aiIssues;
};

/**
 * Main grammar check function
 */
export const performGrammarCheck = async (resumeData) => {
  const startTime = Date.now();

  // Extract text sections
  const textSections = extractResumeText(resumeData);
  const fullText = textSections.map(s => s.text).join(' ');

  // Perform rule-based analysis
  const grammarIssues = checkGrammarRules(textSections);

  // Perform AI analysis
  const aiAnalysis = await analyzeWithAI(fullText);

  // Convert AI errors to structured issues
  const aiIssues = convertAIErrorsToIssues(aiAnalysis.aiAnalysis, textSections);

  // Combine rule-based and AI issues
  const allIssues = [...grammarIssues, ...aiIssues];

  // Calculate scores
  const totalIssues = allIssues.length;
  const highSeverityIssues = allIssues.filter(i => i.severity === 'high').length;
  const mediumSeverityIssues = allIssues.filter(i => i.severity === 'medium').length;

  // Grammar score calculation
  let grammarScore = 100;
  grammarScore -= (highSeverityIssues * 10); // -10 for each high severity
  grammarScore -= (mediumSeverityIssues * 5); // -5 for each medium severity
  grammarScore -= ((totalIssues - highSeverityIssues - mediumSeverityIssues) * 2); // -2 for low severity
  grammarScore = Math.max(grammarScore, 0);

  // Combined score (70% rule-based, 30% AI)
  const finalScore = Math.round((grammarScore * 0.7) + (aiAnalysis.score * 0.3));

  // Group issues by category
  const issuesByCategory = allIssues.reduce((acc, issue) => {
    if (!acc[issue.category]) acc[issue.category] = [];
    acc[issue.category].push(issue);
    return acc;
  }, {});

  // Generate improvement suggestions
  const suggestions = [];
  if (highSeverityIssues > 0) {
    suggestions.push(`Fix ${highSeverityIssues} critical grammar/spelling errors`);
  }
  if (allIssues.filter(i => i.type === 'style').length > 0) {
    suggestions.push('Use stronger action verbs and professional language');
  }
  if (allIssues.filter(i => i.type === 'resume').length > 0) {
    suggestions.push('Remove outdated resume conventions');
  }
  if (aiIssues.length > 0) {
    suggestions.push(`Address ${aiIssues.length} AI-detected writing issues`);
  }

  const processingTime = Date.now() - startTime;

  return {
    overallScore: finalScore,
    grammarScore: grammarScore,
    aiScore: aiAnalysis.score,
    totalIssues: totalIssues,
    issuesByCategory,
    issuesBySeverity: {
      high: allIssues.filter(i => i.severity === 'high'),
      medium: allIssues.filter(i => i.severity === 'medium'),
      low: allIssues.filter(i => i.severity === 'low')
    },
    suggestions,
    aiInsights: aiAnalysis.aiAnalysis,
    actionVerbs: ACTION_VERBS,
    statistics: {
      wordsAnalyzed: fullText.split(/\s+/).length,
      sectionsChecked: textSections.length,
      processingTime: `${processingTime}ms`,
      aiPowered: isAIConfigured(),
      ruleBasedIssues: grammarIssues.length,
      aiDetectedIssues: aiIssues.length
    }
  };
};

export default {
  performGrammarCheck
};
