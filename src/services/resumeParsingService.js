/**
 * Resume Parsing Service
 * Handles text extraction from uploaded resume files (PDF, TXT)
 * Uses free APIs and browser-based parsing
 */

/**
 * Dynamically load PDF.js if not available
 * @returns {Promise<void>}
 */
const loadPDFJSDynamically = async () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      if (typeof window.pdfjsLib !== 'undefined') {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        window.pdfJSReady = true;
        console.log('PDF.js loaded dynamically');
        resolve();
      } else {
        reject(new Error('Failed to load PDF.js dynamically'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load PDF.js script'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Extract text from uploaded file
 * @param {File} file - The uploaded file
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromFile = async (file) => {
  console.log('Extracting text from file:', file.name, 'Type:', file.type, 'Size:', file.size);

  const fileName = file.name.toLowerCase();
  const fileType = file.type;

  if (fileName.endsWith('.txt') || fileType === 'text/plain') {
    console.log('Processing as text file');
    return await extractTextFromTxtFile(file);
  } else if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
    console.log('Processing as PDF file');

    // Check PDF.js availability before attempting extraction
    if (typeof window.pdfjsLib === 'undefined' || !window.pdfJSReady) {
      console.error('PDF.js is not loaded. Please refresh the page and try again.');
      throw new Error('PDF processing library is not available. Please refresh the page and try again, or save your resume as a TXT file for immediate processing.');
    }

    return await extractTextFromPdfFile(file);
  } else {
    console.error('Unsupported file type:', { fileName, fileType });
    throw new Error(`Unsupported file type: ${fileName}. Please upload a TXT or PDF file.`);
  }
};

/**
 * Extract text from TXT file
 * @param {File} file - The TXT file
 * @returns {Promise<string>} - Text content
 */
const extractTextFromTxtFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target.result;
        console.log('Successfully extracted text from TXT file');
        console.log('Text length:', text.length);
        console.log('First 200 characters:', text.substring(0, 200));

        if (!text || text.trim().length === 0) {
          reject(new Error('The text file appears to be empty. Please upload a file with content.'));
          return;
        }

        resolve(text);
      } catch (error) {
        console.error('Error processing text file content:', error);
        reject(new Error('Failed to process text file content'));
      }
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(new Error('Failed to read the file. Please try again with a different file.'));
    };

    reader.readAsText(file);
  });
};

/**
 * Extract text from PDF file using PDF.js (free, browser-based)
 * @param {File} file - The PDF file
 * @returns {Promise<string>} - Extracted text content
 */
const extractTextFromPdfFile = async (file) => {
  try {
    // Check if PDF.js is available
    if (typeof window.pdfjsLib === 'undefined') {
      console.warn('PDF.js not available, attempting to load dynamically...');
      await loadPDFJSDynamically();
    }

    if (typeof window.pdfjsLib === 'undefined') {
      throw new Error('PDF parsing library could not be loaded. Please refresh the page and try again, or use a TXT file for best results.');
    }

    console.log('PDF.js is available, processing PDF file...');
    const pdfjsLib = window.pdfjsLib;

    // Configure PDF.js worker if not already set
    if (pdfjsLib && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    const arrayBuffer = await file.arrayBuffer();
    console.log('PDF file size:', arrayBuffer.byteLength, 'bytes');

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0 // Reduce console output
    }).promise;
    
    console.log('PDF loaded successfully. Pages:', pdf.numPages);
    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map(item => item.str)
          .join(' ');

        fullText += pageText + '\n';
        console.log(`Extracted text from page ${pageNum}, length: ${pageText.length}`);
      } catch (pageError) {
        console.warn(`Failed to extract text from page ${pageNum}:`, pageError);
        // Continue with other pages
      }
    }

    const extractedText = fullText.trim();
    console.log('Total extracted text length:', extractedText.length);

    if (extractedText.length < 50) {
      throw new Error('PDF appears to contain mostly images or unreadable text. Please save as TXT file for better results.');
    }

    return extractedText;
  } catch (error) {
    console.error('PDF.js extraction failed:', error);
    // Fallback to API-based extraction
    return await extractTextFromPdfWithAPI(file);
  }
};

/**
 * Extract text from PDF using a free API service
 * @param {File} file - The PDF file
 * @returns {Promise<string>} - Extracted text content
 */
const extractTextFromPdfWithAPI = async (file) => {
  try {
    console.log('Attempting PDF extraction with API fallback...');

    // For now, provide a helpful error message
    // In the future, this could integrate with a PDF parsing API like pdf-parse or similar
    throw new Error('PDF text extraction requires additional setup. For the best experience, please save your resume as a TXT file and upload that instead. TXT files provide more accurate text extraction and better ATS analysis results.');

  } catch (error) {
    console.warn('API PDF extraction failed:', error.message);
    // Final fallback - basic text extraction attempt
    return await basicPdfTextExtraction(file);
  }
};

/**
 * Basic PDF text extraction fallback
 * @param {File} file - The PDF file
 * @returns {Promise<string>} - Basic extracted content
 */
const basicPdfTextExtraction = async (file) => {
  // For PDF files without proper parsing, suggest alternative
  throw new Error(
    'PDF files require additional setup that is not currently available. ' +
    'For the best experience, please save your resume as a TXT file and upload that instead. ' +
    'TXT files provide more accurate text extraction and better ATS analysis results.'
  );
};

/**
 * Convert file to base64
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 encoded file
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Parse extracted text into resume data structure
 * @param {string} text - Raw text content
 * @returns {Object} - Structured resume data
 */
export const parseResumeText = (text) => {
  const resumeData = {
    personalInfo: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  };

  // Basic text parsing - extract common resume sections
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    resumeData.personalInfo.email = emailMatch[0];
  }

  // Extract phone number
  const phoneMatch = text.match(/[\+]?[1-9]?[\-\.\s]?\(?[0-9]{3}\)?[\-\.\s]?[0-9]{3}[\-\.\s]?[0-9]{4}/);
  if (phoneMatch) {
    resumeData.personalInfo.phone = phoneMatch[0];
  }

  // Extract name (usually first line or line before email)
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length < 50 && !firstLine.includes('@') && !firstLine.match(/\d{3}/)) {
      resumeData.personalInfo.fullName = firstLine;
    }
  }

  // Extract summary/objective (look for common keywords)
  const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (summaryKeywords.some(keyword => line.includes(keyword))) {
      // Take next few lines as summary
      const summaryLines = lines.slice(i + 1, i + 4).filter(l => l.length > 20);
      if (summaryLines.length > 0) {
        resumeData.summary = summaryLines.join(' ');
        break;
      }
    }
  }

  // Extract skills (look for skills section)
  const skillsKeywords = ['skills', 'technologies', 'technical skills', 'competencies'];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (skillsKeywords.some(keyword => line.includes(keyword))) {
      // Take next few lines as skills
      const skillLines = lines.slice(i + 1, i + 5);
      const skills = skillLines.join(' ').split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 1);
      resumeData.skills = skills.slice(0, 20); // Limit to 20 skills
      break;
    }
  }

  // If no structured data found, use the full text as summary
  if (!resumeData.summary && text.length > 100) {
    resumeData.summary = text.substring(0, 500) + (text.length > 500 ? '...' : '');
  }

  return resumeData;
};

/**
 * Validate extracted resume data
 * @param {Object} resumeData - Parsed resume data
 * @returns {boolean} - Whether the data is valid for ATS analysis
 */
export const validateResumeData = (resumeData) => {
  const hasPersonalInfo = resumeData.personalInfo && 
    (resumeData.personalInfo.fullName || resumeData.personalInfo.email);
  
  const hasContent = resumeData.summary || 
    (resumeData.experience && resumeData.experience.length > 0) ||
    (resumeData.skills && resumeData.skills.length > 0);

  return hasPersonalInfo || hasContent;
};

export default {
  extractTextFromFile,
  parseResumeText,
  validateResumeData
};
