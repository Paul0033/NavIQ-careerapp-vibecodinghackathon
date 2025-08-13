import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/lib/storage';
import KeywordMatcher from './keyword-matcher';

export default function JobTailor() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [jd, setJd] = useLocalStorage('career-copilot-jd', '');
  const [bullet2, setBullet2] = useLocalStorage('career-copilot-bullet2', '');
  const [tailorOut, setTailorOut] = useLocalStorage('career-copilot-tailorOut', '');

  useEffect(() => {
    // Listen for JD updates from other components
    const handleSetJd = (event: any) => {
      setJd(event.detail);
    };

    window.addEventListener('set-jd', handleSetJd);
    return () => window.removeEventListener('set-jd', handleSetJd);
  }, [setJd]);

  const tailorBullet = () => {
    if (!bullet2.trim() || !jd.trim()) {
      alert('Please provide both a bullet point and job description.');
      return;
    }

    // Extract keywords from JD and enhance bullet
    const jdKeywords = extractKeywordsFromJD(jd);
    const enhancedBullet = enhanceBulletWithKeywords(bullet2, jdKeywords);
    setTailorOut(enhancedBullet);
  };

  const extractKeywordsFromJD = (jdText: string): string[] => {
    const lowerText = jdText.toLowerCase();
    const commonKeywords = [
      'python', 'sql', 'tableau', 'excel', 'powerbi', 'analytics', 'data', 'analysis',
      'react', 'javascript', 'node', 'api', 'aws', 'cloud', 'agile', 'scrum',
      'leadership', 'communication', 'collaboration', 'problem solving', 'strategy'
    ];
    
    return commonKeywords.filter(keyword => lowerText.includes(keyword));
  };

  const enhanceBulletWithKeywords = (originalBullet: string, keywords: string[]): string => {
    const actionVerbs = ['Leveraged', 'Utilized', 'Implemented', 'Developed', 'Optimized', 'Streamlined'];
    const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    const randomMetric = Math.floor(Math.random() * 40) + 15;
    const topKeywords = keywords.slice(0, 3);
    
    if (topKeywords.length === 0) {
      return `${randomVerb} advanced methodologies to enhance ${originalBullet.toLowerCase()}, achieving ${randomMetric}% improvement while collaborating cross-functionally to deliver strategic insights`;
    }
    
    const keywordPhrase = topKeywords.join(' and ');
    return `${randomVerb} ${keywordPhrase} to optimize business processes, achieving ${randomMetric}% efficiency improvement while collaborating cross-functionally to deliver data-driven insights for strategic decision-making`;
  };

  return (
    <section className="card" style={{ marginTop: '20px' }}>
      <div 
        className="row section-toggle" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        data-testid="section-job-tailor"
      >
        <h3 style={{ flex: 1 }}>3) Tailor for a Job</h3>
        <span className={`chev ${isCollapsed ? 'collapsed' : ''}`}>▾</span>
      </div>
      
      {!isCollapsed && (
        <div className="collapsible">
          <label>Job Description</label>
          <textarea
            className="career-textarea"
            placeholder="Paste the full job description here. The system will analyze keywords and match against your resume..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            data-testid="textarea-job-description"
          />

          {/* Keyword Matching Panel */}
          <KeywordMatcher jdText={jd} bulletText={bullet2} />

          <label style={{ marginTop: '12px' }}>Your bullet (original)</label>
          <textarea
            className="career-textarea"
            placeholder="Example: Supported team with data analysis"
            value={bullet2}
            onChange={(e) => setBullet2(e.target.value)}
            data-testid="textarea-original-bullet"
          />
          
          <div className="row" style={{ marginTop: '8px' }}>
            <button 
              className="btn" 
              onClick={tailorBullet}
              data-testid="btn-tailor-bullet"
            >
              Tailor to JD
            </button>
            <span className="subtle">Match keywords + power verbs</span>
          </div>
          
          {tailorOut && (
            <div className="out" data-testid="output-tailored-bullet">
              {tailorOut}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
