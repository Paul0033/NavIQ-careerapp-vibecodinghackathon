// ATS scoring algorithm for Career Copilot

export function calculateATSScore(text: string): number {
  if (!text || !text.trim()) {
    return 0;
  }

  let score = 0;
  const maxScore = 6;

  // 1. Action verb at start (16.67%)
  if (hasActionVerbAtStart(text)) {
    score++;
  }

  // 2. Numbers present (16.67%)
  if (hasNumbers(text)) {
    score++;
  }

  // 3. Contains target keywords (16.67%)
  if (hasRelevantKeywords(text)) {
    score++;
  }

  // 4. Reasonable length ≤22 words (16.67%)
  if (hasReasonableLength(text)) {
    score++;
  }

  // 5. No first-person (16.67%)
  if (!hasFirstPerson(text)) {
    score++;
  }

  // 6. Active voice (16.67%)
  if (hasActiveVoice(text)) {
    score++;
  }

  return Math.round((score / maxScore) * 100);
}

function hasActionVerbAtStart(text: string): boolean {
  const actionVerbs = [
    'Analyzed', 'Developed', 'Created', 'Led', 'Managed', 'Implemented', 
    'Designed', 'Built', 'Improved', 'Increased', 'Decreased', 'Optimized', 
    'Streamlined', 'Generated', 'Delivered', 'Executed', 'Coordinated', 
    'Established', 'Enhanced', 'Facilitated', 'Supervised', 'Leveraged'
  ];

  const trimmedText = text.trim();
  return actionVerbs.some(verb => 
    trimmedText.toLowerCase().startsWith(verb.toLowerCase())
  );
}

function hasNumbers(text: string): boolean {
  return /\d/.test(text);
}

function hasRelevantKeywords(text: string): boolean {
  const keywords = [
    'python', 'sql', 'tableau', 'excel', 'powerbi', 'analytics', 'data',
    'react', 'javascript', 'api', 'aws', 'cloud', 'agile', 'scrum',
    'leadership', 'communication', 'collaboration', 'strategy', 'analysis',
    'research', 'presentation', 'project management', 'problem solving'
  ];

  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
}

function hasReasonableLength(text: string): boolean {
  const wordCount = text.trim().split(/\s+/).length;
  return wordCount <= 22 && wordCount > 0;
}

function hasFirstPerson(text: string): boolean {
  const firstPersonWords = ['I', 'my', 'we', 'our', 'me', 'myself', 'us', 'ourselves'];
  const words = text.toLowerCase().split(/\W+/);
  return firstPersonWords.some(fp => words.includes(fp));
}

function hasActiveVoice(text: string): boolean {
  // Check for passive voice patterns
  const passivePatterns = [
    /was\s+\w+ed/i,
    /were\s+\w+ed/i,
    /been\s+\w+ed/i,
    /is\s+\w+ed/i,
    /are\s+\w+ed/i
  ];

  return !passivePatterns.some(pattern => pattern.test(text));
}

// Additional function to get detailed scoring breakdown
export function getATSScoreBreakdown(text: string) {
  return {
    actionVerb: hasActionVerbAtStart(text),
    numbers: hasNumbers(text),
    keywords: hasRelevantKeywords(text),
    length: hasReasonableLength(text),
    noFirstPerson: !hasFirstPerson(text),
    activeVoice: hasActiveVoice(text),
    total: calculateATSScore(text)
  };
}
