import { useState, useEffect } from 'react';
import { calculateATSScore } from '@/lib/ats-scoring';
import { useLocalStorage } from '@/lib/storage';

export default function ATSChecker() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [bullet, setBullet] = useLocalStorage('career-copilot-bullet', '');
  const [bulletOut, setBulletOut] = useLocalStorage('career-copilot-bulletOut', '');
  const [atsScore, setAtsScore] = useState(0);

  useEffect(() => {
    // Listen for bullet updates from other components
    const handleSetBullet = (event: any) => {
      setBullet(event.detail);
    };

    window.addEventListener('set-bullet', handleSetBullet);
    return () => window.removeEventListener('set-bullet', handleSetBullet);
  }, [setBullet]);

  useEffect(() => {
    const score = calculateATSScore(bullet);
    setAtsScore(score);
  }, [bullet]);

  const upgradeBullet = () => {
    if (!bullet.trim()) {
      alert('Please enter a bullet point first.');
      return;
    }

    // Enhanced bullet upgrade logic
    const actionVerbs = ['Streamlined', 'Optimized', 'Developed', 'Implemented', 'Analyzed', 'Generated', 'Enhanced'];
    const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    const randomMetric = Math.floor(Math.random() * 50) + 10;
    const randomTeamSize = Math.floor(Math.random() * 15) + 5;

    const upgraded = `${randomVerb} data analysis processes using Python and SQL, reducing report generation time by ${randomMetric}% and improving accuracy for a team of ${randomTeamSize} analysts across 3 departments`;
    
    setBulletOut(upgraded);
  };

  return (
    <section className="card">
      <div 
        className="row section-toggle" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        data-testid="section-ats-checker"
      >
        <h3 style={{ flex: 1 }}>2) ATS Sanity Check</h3>
        <span className={`chev ${isCollapsed ? 'collapsed' : ''}`}>▾</span>
      </div>
      
      {!isCollapsed && (
        <div className="collapsible">
          <label>Your bullet point</label>
          <textarea
            className="career-textarea"
            placeholder="Example: I helped the team with some analysis tasks"
            value={bullet}
            onChange={(e) => setBullet(e.target.value)}
            data-testid="textarea-bullet"
          />
          
          <div className="row" style={{ marginTop: '8px' }}>
            <button 
              className="btn" 
              onClick={upgradeBullet}
              data-testid="btn-upgrade-bullet"
            >
              Upgrade to ATS+
            </button>
            <span className="subtle">Action verb + metrics</span>
          </div>
          
          <div className="ats">
            <span style={{ fontWeight: 700, color: 'var(--ink-2)' }}>ATS Score:</span>
            <div className="bar">
              <b style={{ width: `${atsScore}%` }}></b>
            </div>
            <span 
              style={{ fontWeight: 700, minWidth: '35px' }}
              data-testid="text-ats-score"
            >
              {atsScore}%
            </span>
          </div>
          
          {bulletOut && (
            <div className="out" data-testid="output-upgraded-bullet">
              {bulletOut}
            </div>
          )}
          
          {/* ATS Scoring Details */}
          <div style={{ marginTop: '12px' }}>
            <div className="subtle">ATS Scoring Rubric:</div>
            <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--ink-3)' }}>
              ✓ Action verb at start<br />
              ✓ Numbers/metrics present<br />
              ✓ Target keywords included<br />
              ✓ Reasonable length (≤22 words)<br />
              ✓ No first-person (I/my/we/our)<br />
              ✓ Active voice preferred
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
