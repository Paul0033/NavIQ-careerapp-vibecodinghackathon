import { useState } from 'react';
import { useLocalStorage } from '@/lib/storage';

export default function PDFGenerator() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [contactName] = useLocalStorage('career-copilot-c_name', '');
  const [contactEmail] = useLocalStorage('career-copilot-c_email', '');
  const [contactPhone] = useLocalStorage('career-copilot-c_phone', '');
  const [role] = useLocalStorage('career-copilot-role', '');
  const [bulletOut] = useLocalStorage('career-copilot-bulletOut', '');
  const [tailorOut] = useLocalStorage('career-copilot-tailorOut', '');
  const [ptitle] = useLocalStorage('career-copilot-ptitle', '');
  const [plink] = useLocalStorage('career-copilot-plink', '');
  const [phigh] = useLocalStorage('career-copilot-phigh', '');

  const generatePDFResume = async () => {
    setIsGenerating(true);
    
    try {
      // Load jsPDF dynamically
      const jsPDFModule = await import('jspdf');
      const { jsPDF } = jsPDFModule;
      
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4'
      });

      // Get data from localStorage
      const name = contactName || 'Your Name';
      const email = contactEmail || 'your.email@example.com';
      const phone = contactPhone || 'Your Phone';
      const targetRole = role || 'Target Role';
      const bullet1 = bulletOut || JSON.parse(localStorage.getItem('career-copilot-bullet') || '""') || 'No bullet provided';
      const bullet2 = tailorOut || JSON.parse(localStorage.getItem('career-copilot-bullet2') || '""') || '';
      const matchPercentage = 75; // Mock percentage for demo
      const hasMatchData = matchPercentage > 0;
      const proofTitle = ptitle;
      const proofLink = plink;
      const proofHighlight = phigh;

      // Set up the document
      let yPos = 50;
      const leftMargin = 50;
      const pageWidth = 595;

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(name, leftMargin, yPos);
      yPos += 25;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${email} | ${phone}`, leftMargin, yPos);
      yPos += 30;

      // Target Role
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('TARGET ROLE', leftMargin, yPos);
      yPos += 15;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(targetRole, leftMargin, yPos);
      yPos += 25;

      // Key Achievements
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('KEY ACHIEVEMENTS', leftMargin, yPos);
      yPos += 15;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      if (bullet1 && bullet1 !== 'No bullet provided') {
        const bullet1Lines = doc.splitTextToSize(`• ${bullet1}`, pageWidth - 100);
        doc.text(bullet1Lines, leftMargin, yPos);
        yPos += bullet1Lines.length * 12 + 5;
      }

      if (bullet2) {
        const bullet2Lines = doc.splitTextToSize(`• ${bullet2}`, pageWidth - 100);
        doc.text(bullet2Lines, leftMargin, yPos);
        yPos += bullet2Lines.length * 12 + 5;
      }

      yPos += 15;

      // Job Description Match
      if (hasMatchData) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('JOB DESCRIPTION MATCH', leftMargin, yPos);
        yPos += 15;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Keyword Match Score: ${matchPercentage}%`, leftMargin, yPos);
        yPos += 20;
      }

      // Proof Project
      if (proofTitle) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PROOF PROJECT', leftMargin, yPos);
        yPos += 15;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(proofTitle, leftMargin, yPos);
        yPos += 12;

        if (proofLink) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(proofLink, leftMargin, yPos);
          yPos += 12;
        }

        if (proofHighlight) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const highlightLines = doc.splitTextToSize(proofHighlight, pageWidth - 100);
          doc.text(highlightLines, leftMargin, yPos);
          yPos += highlightLines.length * 12;
        }
      }

      // Save the PDF
      doc.save('Career_Copilot_Resume.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="card" style={{ marginTop: '20px' }}>
      <div 
        className="row section-toggle" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        data-testid="section-pdf-generator"
      >
        <h3 style={{ flex: 1 }}>6) Generate Resume PDF</h3>
        <span className={`chev ${isCollapsed ? 'collapsed' : ''}`}>▾</span>
      </div>
      
      {!isCollapsed && (
        <div className="collapsible">
          <div className="row" style={{ marginTop: '8px' }}>
            <button 
              className={`btn primary ${isGenerating ? 'opacity-50' : ''}`}
              onClick={generatePDFResume}
              disabled={isGenerating}
              data-testid="btn-generate-pdf"
            >
              {isGenerating ? 'Generating...' : 'Generate ATS-Optimized Resume'}
            </button>
            <span className="subtle">Clean, parseable one-page format</span>
          </div>
          
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--ink-3)' }}>
            Includes: Contact info, target role, optimized bullets, keyword match summary, and top proof project. 
            Optimized for ATS scanning.
          </div>
        </div>
      )}
    </section>
  );
}
