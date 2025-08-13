import { useEffect, useState } from 'react';

interface KeywordMatcherProps {
  jdText: string;
  bulletText: string;
}

export default function KeywordMatcher({ jdText, bulletText }: KeywordMatcherProps) {
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);

  useEffect(() => {
    updateKeywordMatching();
  }, [jdText, bulletText]);

  const extractKeywords = (text: string): string[] => {
    const lowerText = text.toLowerCase();
    
    // Common tech and business keywords
    const keywords = [
      'python', 'java', 'javascript', 'react', 'node', 'sql', 'tableau', 'excel',
      'powerbi', 'figma', 'aws', 'azure', 'docker', 'git', 'api', 'rest',
      'machine learning', 'data analysis', 'analytics', 'statistics', 'research',
      'project management', 'agile', 'scrum', 'leadership', 'communication',
      'strategy', 'consulting', 'presentation', 'collaboration', 'problem solving'
    ];

    const found = keywords.filter(keyword => lowerText.includes(keyword));

    // Extract other significant words (3+ chars, not common words)
    const words = lowerText.match(/\b[a-z]{3,}\b/g) || [];
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'];

    const additionalKeywords = words
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .filter((word, index, arr) => arr.indexOf(word) === index)
      .slice(0, 20);

    return [...found, ...additionalKeywords];
  };

  const updateKeywordMatching = () => {
    if (!jdText.trim()) {
      setMatchPercentage(0);
      setMatchedKeywords([]);
      setMissingKeywords([]);
      return;
    }

    const jdKeywords = extractKeywords(jdText);
    const bulletKeywords = extractKeywords(bulletText);

    const matched = jdKeywords.filter(word => bulletKeywords.includes(word));
    const missing = jdKeywords.filter(word => !bulletKeywords.includes(word));

    const percentage = jdKeywords.length > 0 ? Math.round((matched.length / jdKeywords.length) * 100) : 0;

    setMatchPercentage(percentage);
    setMatchedKeywords(matched);
    setMissingKeywords(missing);
  };

  const getMatchPercentageColor = () => {
    if (matchPercentage > 60) return 'var(--good)';
    if (matchPercentage > 30) return 'var(--warn)';
    return 'var(--bad)';
  };

  return (
    <div className="keyword-match">
      <div className="match-score">
        <span>Keyword Match:</span>
        <span 
          className="match-percentage" 
          style={{ color: getMatchPercentageColor() }}
          data-testid="text-match-percentage"
        >
          {matchPercentage}%
        </span>
      </div>
      <div className="keyword-lists">
        <div className="keyword-list">
          <h5>Matched Keywords</h5>
          <div className="keyword-tags" data-testid="matched-keywords">
            {matchedKeywords.length > 0 ? 
              matchedKeywords.map((word, index) => (
                <span key={index} className="keyword-tag matched">{word}</span>
              )) :
              <span className="keyword-tag">No matches found</span>
            }
          </div>
        </div>
        <div className="keyword-list">
          <h5>Missing Keywords</h5>
          <div className="keyword-tags" data-testid="missing-keywords">
            {missingKeywords.length > 0 ?
              missingKeywords.slice(0, 10).map((word, index) => (
                <span key={index} className="keyword-tag missing">{word}</span>
              )) :
              <span className="keyword-tag">All keywords matched!</span>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
