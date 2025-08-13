import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/lib/storage';

const templates = {
  "Venture Capital (VC) Analyst (Intern)": [
    "Day 1: Choose a sector thesis (e.g., AI x Fintech). Define ICP + problem.",
    "Day 2: Source 10 startups; table with stage, geo, traction, founders.",
    "Day 3: Build a quick market map & 2x2 positioning.",
    "Day 4: Draft 2 investment notes (250 words each) incl. risks.",
    "Day 5: Founders' outreach template + 2 calls scheduled.",
    "Day 6: Synthesize: top 3 picks + why-now.",
    "Day 7: Publish a short thesis PDF + Notion gallery."
  ],
  "Private Equity (PE) Analyst (Intern)": [
    "Day 1: Pick 1 industry; list 10 targets (rev, EBITDA, ownership).",
    "Day 2: Build LBO shell with base assumptions.",
    "Day 3: Screening criteria scorecard; rank top 3.",
    "Day 4: Simple CIM teardown from public data.",
    "Day 5: Draft 1-page investment memo + risks.",
    "Day 6: Outreach template to operators/owners.",
    "Day 7: Publish memo + model summary."
  ],
  "Finance/IB Analyst (Intern)": [
    "Day 1: Pick a listed company; extract 6 key metrics.",
    "Day 2: One-page snapshot (rev, margin, debt, cash, FCF, ROCE).",
    "Day 3: Simple 3-statement link or DCF shell.",
    "Day 4: 3 comps + football field chart.",
    "Day 5: 1-page memo: thesis + 2 risks + catalysts.",
    "Day 6: Clean PNGs for memo.",
    "Day 7: Publish memo + model."
  ],
  "Product Management (Intern)": [
    "Day 1: Pick a student pain; write 1-page PRD.",
    "Day 2: Benchmark 3 apps; 2x2 + feature table.",
    "Day 3: Low-fi wireframe (paper/Figma).",
    "Day 4: MVP scope (3 user stories).",
    "Day 5: Prototype click-through; 1 usability test.",
    "Day 6: Mini post: problem → MVP → metric.",
    "Day 7: Publish PRD + prototype."
  ],
  "Data Analyst (Intern)": [
    "Day 1: Find dataset; define 3 KPIs.",
    "Day 2: Clean data in Excel/SQL; save queries.",
    "Day 3: Build 4-tile dashboard (BI tool).",
    "Day 4: 200-word insight note: 2 findings, 1 action.",
    "Day 5: Add advanced viz (trend/cohort).",
    "Day 6: Publish repo + README.",
    "Day 7: Share with proof link."
  ],
  "Data Science (Intern)": [
    "Day 1: Pick classification problem; set baseline.",
    "Day 2: EDA notebook; visualize distributions.",
    "Day 3: Train/test split; simple models.",
    "Day 4: Feature engineering; compare metrics.",
    "Day 5: Model interpretability summary.",
    "Day 6: Ship notebook + README.",
    "Day 7: Share results; next steps."
  ],
  "Software Engineer (Intern)": [
    "Day 1: Repo + README; tiny app.",
    "Day 2: Core feature; 2 unit tests.",
    "Day 3: Simple API/local storage.",
    "Day 4: Accessibility + keyboard nav.",
    "Day 5: Advanced feature (search/offline).",
    "Day 6: Deploy (Vercel/Netlify).",
    "Day 7: Devlog of trade-offs."
  ],
  "Growth/Marketing (Intern)": [
    "Day 1: Choose a campus brand; define ICP + loops.",
    "Day 2: Audit socials & landing; list 5 fixes.",
    "Day 3: 3 ad/post variations with hooks.",
    "Day 4: Simple landing (Notion/Canva).",
    "Day 5: Tiny experiment (survey or A/B).",
    "Day 6: Analyze CTR/CR.",
    "Day 7: Share a case post."
  ],
  "UI/UX Design (Intern)": [
    "Day 1: Competitive tear-down (3 apps).",
    "Day 2: User stories; success metrics.",
    "Day 3: Wireframes; content hierarchy.",
    "Day 4: Visual design system tokens.",
    "Day 5: Prototype + 2 usability tests.",
    "Day 6: Document decisions.",
    "Day 7: Publish case study."
  ],
  "Consulting (Intern)": [
    "Day 1: Problem definition; MECE tree.",
    "Day 2: Collect quick data (survey/obs).",
    "Day 3: Back-of-envelope sizing.",
    "Day 4: 2 solution options; pros/cons.",
    "Day 5: Impact–effort matrix.",
    "Day 6: 5-slide recommendation.",
    "Day 7: Share and capture feedback."
  ]
};

export default function PlanGenerator() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [role, setRole] = useLocalStorage('career-copilot-role', 'Data Analyst (Intern)');
  const [industry, setIndustry] = useLocalStorage('career-copilot-industry', '');
  const [location, setLocation] = useLocalStorage('career-copilot-location', '');
  const [planOut, setPlanOut] = useLocalStorage('career-copilot-planOut', '');

  useEffect(() => {
    // Listen for role updates from other components
    const handleSetRole = (event: any) => {
      setRole(event.detail);
    };

    const handleGeneratePlan = () => {
      generatePlan();
    };

    window.addEventListener('set-role', handleSetRole);
    window.addEventListener('generate-plan', handleGeneratePlan);
    
    return () => {
      window.removeEventListener('set-role', handleSetRole);
      window.removeEventListener('generate-plan', handleGeneratePlan);
    };
  }, [setRole]);

  const generatePlan = () => {
    const context = [role, industry && (`in ${industry}`), location && (`@${location}`)].filter(Boolean).join(' ');
    const plan = templates[role as keyof typeof templates] || [];
    const header = `Target: ${context || role}\n`;
    const fullPlan = header + plan.map((l) => `${l}`).join('\n');
    setPlanOut(fullPlan);
  };

  const selectTemplate = (templateRole: string) => {
    setRole(templateRole);
    setTimeout(generatePlan, 100); // Small delay to ensure state is updated
  };

  return (
    <section className="card" style={{ marginTop: '20px' }}>
      <div 
        className="row section-toggle" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        data-testid="section-plan-generator"
      >
        <h3 style={{ flex: 1 }}>1) Target & 7‑day plan</h3>
        <span className={`chev ${isCollapsed ? 'collapsed' : ''}`}>▾</span>
      </div>
      
      {!isCollapsed && (
        <div className="collapsible">
          <div className="row">
            <div style={{ flex: 1 }}>
              <label>Target role</label>
              <select
                className="career-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                data-testid="select-role"
              >
                <option>Data Analyst (Intern)</option>
                <option>Product Management (Intern)</option>
                <option>Finance/IB Analyst (Intern)</option>
                <option>Venture Capital (VC) Analyst (Intern)</option>
                <option>Private Equity (PE) Analyst (Intern)</option>
                <option>Consulting (Intern)</option>
                <option>Software Engineer (Intern)</option>
                <option>Data Science (Intern)</option>
                <option>Growth/Marketing (Intern)</option>
                <option>UI/UX Design (Intern)</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Focus industry (optional)</label>
              <input
                className="career-input"
                placeholder="e.g., fintech, e-commerce, healthcare"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                data-testid="input-industry"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Location (optional)</label>
              <input
                className="career-input"
                placeholder="e.g., Bangalore, remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                data-testid="input-location"
              />
            </div>
          </div>
          
          <div className="row" style={{ marginTop: '8px' }}>
            <button 
              className="btn" 
              onClick={generatePlan}
              data-testid="btn-generate-plan"
            >
              Generate 7-day plan
            </button>
            <span className="subtle">Daily tasks + proof-of-work ideas</span>
          </div>
          
          {planOut && (
            <div className="out" data-testid="output-plan">
              {planOut}
            </div>
          )}

          {/* Template library */}
          <div style={{ marginTop: '12px' }}>
            <div className="subtle">Role Template Library</div>
            <div className="library">
              {Object.keys(templates).map(templateRole => (
                <div
                  key={templateRole}
                  className="chip"
                  onClick={() => selectTemplate(templateRole)}
                  data-testid={`chip-template-${templateRole.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  {templateRole}
                </div>
              ))}
            </div>
            
            <div className="template-list" style={{ marginTop: '10px' }}>
              {Object.entries(templates).map(([name, items]) => (
                <div key={name} className="tpl">
                  <h4>{name}</h4>
                  <div className="subtle">{items.slice(0, 3).join(" • ")} …</div>
                  <div className="actions" style={{ marginTop: '6px' }}>
                    <button 
                      className="btn" 
                      onClick={() => selectTemplate(name)}
                      data-testid={`btn-load-template-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      Load
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
