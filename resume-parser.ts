// Resume parsing utilities for Career Copilot

interface ParsedResumeData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  bullets: string[];
  education: string;
  inferredRole: string;
}

// PDF text extraction using PDF.js with worker fallback
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Dynamically import PDF.js
    const pdfjsLib = await import('pdfjs-dist');
    
    // Configure PDF.js to work without external worker
    const originalWorkerSrc = pdfjsLib.GlobalWorkerOptions.workerSrc;
    
    try {
      // First try with a working CDN worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0 // Reduce console output
      }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (workerError) {
      // Fallback: Try without worker by using legacy compatibility mode
      console.log('Worker failed, trying compatibility mode');
      
      // Reset worker configuration
      pdfjsLib.GlobalWorkerOptions.workerSrc = originalWorkerSrc;
      
      // Create a simple text-based extraction as fallback
      const text = await file.text();
      if (text && text.trim().length > 0) {
        return text;
      }
      
      throw new Error('Could not extract text from PDF. Please try converting to a text-based PDF or use DOCX/TXT format instead.');
    }
  } catch (error) {
    throw new Error(`Failed to extract PDF text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// DOCX text extraction using Mammoth.js
export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    // Dynamically import Mammoth.js
    const mammoth = await import('mammoth');
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value) {
      throw new Error('No text found in document');
    }
    
    return result.value;
  } catch (error) {
    throw new Error(`Failed to extract DOCX text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Main resume analysis function
export function analyzeResume(text: string): ParsedResumeData {
  return {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    skills: extractSkills(text),
    bullets: extractBullets(text),
    education: extractEducation(text),
    inferredRole: inferRole(text)
  };
}

// Helper functions for data extraction
function extractName(text: string): string {
  const namePatterns = [
    /(?:name|contact)[\s:]+([a-z]+\s+[a-z]+)/i,
    /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m,
    /([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s|$)/
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].split(' ').length >= 2) {
      return match[1].trim();
    }
  }
  return '';
}

function extractEmail(text: string): string {
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const match = text.match(emailPattern);
  return match ? match[1] : '';
}

function extractPhone(text: string): string {
  const phonePatterns = [
    /(\+?[\d\s\-\(\)]{10,15})/g,
    /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/g
  ];

  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }
  return '';
}

function extractSkills(text: string): string[] {
  const techSkills = [
    'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'Tableau', 'Excel',
    'PowerBI', 'Figma', 'Sketch', 'Adobe', 'AWS', 'Azure', 'Docker', 'Git',
    'Machine Learning', 'Data Analysis', 'Statistics', 'R', 'MATLAB', 'Pandas',
    'NumPy', 'TensorFlow', 'PyTorch', 'Selenium', 'APIs', 'REST', 'GraphQL'
  ];

  const businessSkills = [
    'Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication',
    'Analytics', 'Strategy', 'Consulting', 'Research', 'Presentation',
    'Financial Modeling', 'Valuation', 'Due Diligence', 'Investment Banking',
    'Private Equity', 'Venture Capital', 'Market Research'
  ];

  const allSkills = [...techSkills, ...businessSkills];
  const foundSkills: string[] = [];

  for (const skill of allSkills) {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }

  return foundSkills;
}

function extractBullets(text: string): string[] {
  const lines = text.split('\n');
  const bullets: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Look for bullet points or action verb starts
    if (trimmed.match(/^[•\-\*]/) ||
        trimmed.match(/^(Analyzed|Developed|Created|Led|Managed|Implemented|Designed|Built|Improved|Increased|Decreased)/i)) {
      if (trimmed.length > 20 && trimmed.length < 200) {
        bullets.push(trimmed.replace(/^[•\-\*]\s*/, ''));
      }
    }
  }

  return bullets.slice(0, 5); // Return up to 5 bullets
}

function extractEducation(text: string): string {
  const eduPatterns = [
    /(Bachelor|Master|PhD|B\.?A\.?|B\.?S\.?|M\.?A\.?|M\.?S\.?|MBA).*?(\d{4})/i,
    /(University|College|Institute).*?(\d{4})/i
  ];

  for (const pattern of eduPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }
  return '';
}

function inferRole(text: string): string {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('sql') || lowerText.includes('tableau') || lowerText.includes('powerbi')) {
    return 'Data Analyst (Intern)';
  }
  if (lowerText.includes('figma') || lowerText.includes('design') || lowerText.includes('sketch')) {
    return 'UI/UX Design (Intern)';
  }
  if (lowerText.includes('react') || lowerText.includes('javascript') || lowerText.includes('python')) {
    return 'Software Engineer (Intern)';
  }
  if (lowerText.includes('investment') || lowerText.includes('financial modeling') || lowerText.includes('valuation')) {
    return 'Finance/IB Analyst (Intern)';
  }
  if (lowerText.includes('venture capital') || lowerText.includes('startup') || lowerText.includes('fund')) {
    return 'Venture Capital (VC) Analyst (Intern)';
  }
  if (lowerText.includes('product') && (lowerText.includes('management') || lowerText.includes('manager'))) {
    return 'Product Management (Intern)';
  }
  if (lowerText.includes('consulting') || lowerText.includes('strategy')) {
    return 'Consulting (Intern)';
  }

  return '';
}
