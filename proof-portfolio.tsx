import { useState } from 'react';
import { useLocalStorage } from '@/lib/storage';

interface PortfolioItem {
  id: string;
  title: string;
  link: string;
  highlights: string;
  timestamp: string;
}

export default function ProofPortfolio() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [ptitle, setPtitle] = useLocalStorage('career-copilot-ptitle', '');
  const [plink, setPlink] = useLocalStorage('career-copilot-plink', '');
  const [phigh, setPhigh] = useLocalStorage('career-copilot-phigh', '');
  const [proofOut, setProofOut] = useLocalStorage('career-copilot-proofOut', '');
  const [portfolioItems, setPortfolioItems] = useLocalStorage('career-copilot-portfolio', '[]');

  const generateProofPortfolio = () => {
    const title = ptitle || 'Project Title';
    const link = plink || 'Project Link';
    const highlight = phigh || 'Project highlights';

    const portfolio = `📊 ${title}

🔗 ${link}

💡 Key Impact:
${highlight}

🛠️ Technical Skills: Python, SQL, Tableau, Excel
📈 Business Impact: Quantified results with clear metrics
🎯 Relevance: Directly applicable to target role requirements

This project demonstrates my ability to translate complex data into actionable business insights, a core skill for modern analysts.`;

    setProofOut(portfolio);
  };

  const addToPortfolio = () => {
    if (!ptitle.trim()) {
      alert('Please enter a project title first.');
      return;
    }

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: ptitle,
      link: plink,
      highlights: phigh,
      timestamp: new Date().toISOString()
    };

    const currentItems = JSON.parse(portfolioItems || '[]');
    const updatedItems = [...currentItems, newItem];
    setPortfolioItems(JSON.stringify(updatedItems));

    // Clear form
    setPtitle('');
    setPlink('');
    setPhigh('');
    setProofOut('');

    alert('Project added to portfolio!');
  };

  const removePortfolioItem = (id: string) => {
    const currentItems = JSON.parse(portfolioItems || '[]');
    const updatedItems = currentItems.filter((item: PortfolioItem) => item.id !== id);
    setPortfolioItems(JSON.stringify(updatedItems));
  };

  const copyToClipboard = () => {
    if (proofOut) {
      navigator.clipboard.writeText(proofOut).then(() => {
        alert('Portfolio entry copied to clipboard!');
      });
    }
  };

  const parsedItems: PortfolioItem[] = JSON.parse(portfolioItems || '[]');

  return (
    <section className="card" style={{ marginTop: '20px' }}>
      <div 
        className="row section-toggle" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        data-testid="section-proof-portfolio"
      >
        <h3 style={{ flex: 1 }}>5) Proof Projects</h3>
        <span className={`chev ${isCollapsed ? 'collapsed' : ''}`}>▾</span>
      </div>
      
      {!isCollapsed && (
        <div className="collapsible">
          <div className="row">
            <div style={{ flex: 1 }}>
              <label>Project title</label>
              <input
                className="career-input"
                placeholder="e.g., Fintech Market Analysis Dashboard"
                value={ptitle}
                onChange={(e) => setPtitle(e.target.value)}
                data-testid="input-project-title"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Link (GitHub, portfolio, etc.)</label>
              <input
                className="career-input"
                placeholder="https://..."
                value={plink}
                onChange={(e) => setPlink(e.target.value)}
                data-testid="input-project-link"
              />
            </div>
          </div>
          
          <label>Key highlights</label>
          <textarea
            className="career-textarea"
            placeholder="Example: Used Python + Tableau to analyze $2M+ transaction data, identified 15% cost reduction opportunity"
            value={phigh}
            onChange={(e) => setPhigh(e.target.value)}
            data-testid="textarea-project-highlights"
          />
          
          <div className="row" style={{ marginTop: '8px' }}>
            <button 
              className="btn" 
              onClick={generateProofPortfolio}
              data-testid="btn-generate-portfolio"
            >
              Generate portfolio entry
            </button>
            {proofOut && (
              <>
                <button 
                  className="btn ghost" 
                  onClick={copyToClipboard}
                  data-testid="btn-copy-portfolio"
                >
                  Copy
                </button>
                <button 
                  className="btn" 
                  onClick={addToPortfolio}
                  data-testid="btn-add-to-portfolio"
                >
                  Add to Portfolio
                </button>
              </>
            )}
            <span className="subtle">Impact + technical details</span>
          </div>
          
          {proofOut && (
            <div className="out" data-testid="output-portfolio-entry">
              {proofOut}
            </div>
          )}

          {/* Portfolio List */}
          <div style={{ marginTop: '16px' }}>
            <div className="subtle">Your Proof Portfolio</div>
            <div className="portfolio-list" data-testid="portfolio-list">
              {parsedItems.length === 0 ? (
                <div className="portfolio-item">
                  <p className="subtle">No projects added yet. Create your first portfolio entry above.</p>
                </div>
              ) : (
                parsedItems.map((item) => (
                  <div key={item.id} className="portfolio-item" data-testid={`portfolio-item-${item.id}`}>
                    <h4>{item.title}</h4>
                    <div className="subtle">{item.link}</div>
                    <div style={{ marginTop: '6px', fontSize: '14px' }}>
                      {item.highlights}
                    </div>
                    <div className="actions" style={{ marginTop: '8px' }}>
                      <button 
                        className="btn ghost" 
                        onClick={() => removePortfolioItem(item.id)}
                        data-testid={`btn-remove-${item.id}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
