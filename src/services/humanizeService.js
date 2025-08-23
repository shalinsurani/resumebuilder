import { generateContent } from './geminiService';

const humanizePrompt = `
Rewrite the following text so it reads as if crafted by a skilled human resume writer. 
Keep it natural, polished, and engaging while preserving the original meaning. 
Avoid repetitive sentence structures, clichés, and overly formal AI-like tone. 
Ensure the result is exactly 40–45 words in length.  
Each time you generate, rephrase uniquely so no two outputs are the same. 
Vary word choices, sentence flow, and emphasis to keep it fresh. 
Maintain a professional, concise style suitable for a resume.


Here's the text to humanize:
`;

export const humanizeContent = async (content) => {
  try {
    const prompt = `${humanizePrompt}\n\n${content}`;
    const humanizedContent = await generateContent(prompt);
    return humanizedContent;
  } catch (error) {
    console.error('Error humanizing content:', error);
    throw error;
  }
};
