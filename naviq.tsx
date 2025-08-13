import { useEffect, useState } from 'react';
import ResumeImport from '@/components/career/resume-import';
import ProfileManager from '@/components/career/profile-manager';
import PlanGenerator from '@/components/career/plan-generator';
import JobTailor from '@/components/career/job-tailor';
import ATSChecker from '@/components/career/ats-checker';
import OutreachGenerator from '@/components/career/outreach-generator';
import ProofPortfolio from '@/components/career/proof-portfolio';
import PDFGenerator from '@/components/career/pdf-generator';
import { useLocalStorage } from '@/lib/storage';
import naviqLogo from "@assets/ChatGPT Image Aug 14, 2025, 01_33_28 AM_1755120898488.png";

export default function NavIQ() {
  const [theme, setTheme] = useLocalStorage('naviq-theme', 'theme-glass');
  const [currentRole, setCurrentRole] = useState('VC Intern');

  // Role rotation effect
  useEffect(() => {
    const roles = ['VC Intern', 'IB Analyst', 'Product Manager', 'Data Analyst', 'SWE', 'Consultant'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      const roleElement = document.querySelector('.h-roles') as HTMLElement;
      if (roleElement) {
        roleElement.style.opacity = '0';
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % roles.length;
          setCurrentRole(roles[currentIndex]);
          roleElement.style.opacity = '1';
        }, 180);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // Theme effect
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const toggleSection = (element: HTMLElement) => {
    element.classList.toggle('collapsed');
  };

  const loadDemo = () => {
    // Dispatch custom event to load demo data
    window.dispatchEvent(new CustomEvent('load-demo'));
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <div className="nav">
        <div className="container nav-inner">
          <div className="brand">
            <img src={naviqLogo} alt="NavIQ Logo" className="logo-img" style={{height: '40px', width: 'auto'}} />
            <h1>NavIQ</h1>
          </div>
          <div className="nav-actions">
            <select 
              className="btn career-select" 
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              data-testid="theme-selector"
            >
              <option value="theme-glass">Glass (Dark)</option>
              <option value="theme-light">Light</option>
              <option value="">Classic Dark</option>
            </select>
            <button 
              className="btn" 
              onClick={loadDemo}
              data-testid="btn-load-demo"
            >
              Load Demo
            </button>
            <button 
              className="btn" 
              onClick={() => window.print()}
              data-testid="btn-print"
            >
              Export / Print
            </button>
            <button 
              className="btn primary" 
              onClick={() => {
                localStorage.clear();
                alert('Cleared saved fields');
                location.reload();
              }}
              data-testid="btn-reset"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="glow"></div>
        <div className="container">
          <div className="eyebrow">NavIQ - Student Edition v3</div>
          <div className="h-headline">
            Navigate your career—<br />
            intelligently, efficiently.
          </div>
          <p className="h-sub">
            Your smart career navigation platform to craft a{' '}
            <span className="h-roles">{currentRole}</span> plan, optimize{' '}
            <b>ATS-friendly</b> resumes, tailor to any job description, generate networking outreach, and build your professional portfolio. Fully client-side, zero login.
          </p>
          <div className="hero-cta">
            <button 
              className="btn primary" 
              onClick={() => window.dispatchEvent(new CustomEvent('generate-plan'))}
              data-testid="btn-generate-plan"
            >
              Generate 7-day plan
            </button>
            <span className="pill">No login</span>
            <span className="pill">Works offline</span>
            <span className="pill">Resume import</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container" style={{ padding: '28px 0 40px' }}>
        <div className="grid two">
          {/* Left Column */}
          <div className="fade-in">
            <ResumeImport />
            <ProfileManager />
            <PlanGenerator />
            <JobTailor />
          </div>

          {/* Right Column */}
          <div className="fade-in" style={{ animationDelay: '0.1s' }}>
            <ATSChecker />
            <OutreachGenerator />
            <ProofPortfolio />
            <PDFGenerator />
          </div>
        </div>
      </main>
    </div>
  );
}