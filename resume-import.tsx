import { useState, useRef } from 'react';
import { extractTextFromPDF, extractTextFromDOCX, analyzeResume } from '@/lib/resume-parser';
import { useLocalStorage } from '@/lib/storage';

interface ParsedResumeData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  bullets: string[];
  education: string;
  inferredRole: string;
}

export default function ResumeImport() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisReport, setAnalysisReport] = useState('Import a resume to see extracted information and analysis here...');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contactName, setContactName] = useLocalStorage('career-copilot-c_name', '');
  const [contactEmail, setContactEmail] = useLocalStorage('career-copilot-c_email', '');
  const [contactPhone, setContactPhone] = useLocalStorage('career-copilot-c_phone', '');

  const handleFileImport = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert('Please choose a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fileName = file.name.toLowerCase();
      let text = '';

      if (fileName.endsWith('.txt')) {
        text = await file.text();
      } else if (fileName.endsWith('.pdf')) {
        try {
          text = await extractTextFromPDF(file);
        } catch (pdfError) {
          // If PDF.js fails, try reading as text directly (works for some text-based PDFs)
          console.log('PDF.js failed, trying direct text extraction');
          text = await file.text();
          if (!text || text.trim().length < 10) {
            throw new Error('Could not extract text from PDF. Please try: 1) Converting to a text-based PDF, 2) Exporting as DOCX, or 3) Copying text to a TXT file');
          }
        }
      } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        text = await extractTextFromDOCX(file);
      } else {
        throw new Error('Unsupported file type. Please use PDF, DOCX, or TXT files.');
      }

      if (!text || text.trim().length < 30) {
        throw new Error('No readable text found. If this is a scanned PDF, please export as text-based PDF or DOCX.');
      }

      const parsedData = analyzeResume(text);
      populateFields(parsedData);
      generateReport(parsedData);

      // Dispatch events to update other components
      window.dispatchEvent(new CustomEvent('resume-imported', { detail: parsedData }));

    } catch (error: any) {
      setError(`Import failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const populateFields = (data: ParsedResumeData) => {
    if (data.name) setContactName(data.name);
    if (data.email) setContactEmail(data.email);
    if (data.phone) setContactPhone(data.phone);

    // Dispatch events to populate other fields
    if (data.bullets.length > 0) {
      window.dispatchEvent(new CustomEvent('set-bullet', { detail: data.bullets[0] }));
    }
    if (data.inferredRole) {
      window.dispatchEvent(new CustomEvent('set-role', { detail: data.inferredRole }));
    }
    if (data.skills.length > 0) {
      window.dispatchEvent(new CustomEvent('set-jd', { detail: `Skills found in resume: ${data.skills.join(', ')}` }));
    }
  };

  const generateReport = (data: ParsedResumeData) => {
    const report = `✅ Resume imported successfully!

📋 Extracted Information:
${data.name ? `• Name: ${data.name}` : '• Name: Not found'}
${data.email ? `• Email: ${data.email}` : '• Email: Not found'}
${data.phone ? `• Phone: ${data.phone}` : '• Phone: Not found'}

🎯 Inferred Role: ${data.inferredRole || 'Not determined'}

💼 Skills Found: ${data.skills.length > 0 ? data.skills.join(', ') : 'None detected'}

📝 Experience Bullets: ${data.bullets.length} bullet points extracted

🎓 Education: ${data.education || 'Not found'}

✨ Fields have been auto-populated. Review and adjust as needed.`;

    setAnalysisReport(report);
  };

  return (
    <>
      {/* Loading Spinner */}
      {isLoading && (
        <div className="spinner-overlay">
          <div className="spinner-content">
            <div className="spinner-icon"></div>
            <div>Processing resume...</div>
          </div>
        </div>
      )}

      <section className="card">
        <div 
          className="row section-toggle" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          data-testid="section-resume-import"
        >
          <h3 style={{ flex: 1 }}>Resume Import & Analysis</h3>
          <span className={`chev ${isCollapsed ? 'collapsed' : ''}`}>▾</span>
        </div>
        
        {!isCollapsed && (
          <div className="collapsible">
            <div className="import-section">
              <div className="row">
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx,.txt"
                    className="file-input-hidden"
                    data-testid="input-resume-file"
                  />
                  <label 
                    className="file-label"
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="label-choose-resume"
                  >
                    📄 Choose Resume File
                  </label>
                </div>
                <button 
                  className="btn primary" 
                  onClick={handleFileImport}
                  disabled={isLoading}
                  data-testid="btn-import-analyze"
                >
                  Import & Analyze
                </button>
              </div>
              <div className="subtle" style={{ marginTop: '8px' }}>
                Supports PDF, DOCX, and TXT files. Processing happens locally in your browser.
              </div>
            </div>

            {/* Contact Information */}
            <div style={{ marginTop: '16px' }}>
              <label>Contact Information</label>
              <div className="contact-grid">
                <input
                  className="career-input"
                  placeholder="Full Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  data-testid="input-contact-name"
                />
                <input
                  className="career-input"
                  placeholder="Email Address"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  data-testid="input-contact-email"
                />
                <input
                  className="career-input"
                  placeholder="Phone Number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  data-testid="input-contact-phone"
                />
              </div>
            </div>

            {/* Analysis Report */}
            <div 
              className={`out ${error ? 'error' : ''}`}
              style={{ minHeight: '60px' }}
              data-testid="analysis-report"
            >
              {error || analysisReport}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
