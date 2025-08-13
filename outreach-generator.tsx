import { useState } from 'react';
import { useLocalStorage } from '@/lib/storage';

export default function OutreachGenerator() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [rname, setRname] = useLocalStorage('career-copilot-rname', '');
  const [company, setCompany] = useLocalStorage('career-copilot-company', '');
  const [yname, setYname] = useLocalStorage('career-copilot-yname', '');
  const [channel, setChannel] = useLocalStorage('career-copilot-channel', 'LinkedIn');
  const [outreachOut, setOutreachOut] = useLocalStorage('career-copilot-outreachOut', '');

  const generateOutreach = () => {
    const recipientName = rname || 'Hiring Manager';
    const companyName = company || 'your company';
    const yourName = yname || 'Your name';
    
    const templates = {
      'LinkedIn': generateLinkedInMessage,
      'Email': generateEmailMessage,
      'Coffee chat': generateCoffeeChatMessage,
      'Networking event': generateNetworkingMessage
    };

    const generator = templates[channel as keyof typeof templates] || generateLinkedInMessage;
    const message = generator(recipientName, companyName, yourName);
    setOutreachOut(message);
  };

  const generateLinkedInMessage = (recipient: string, company: string, sender: string): string => {
    return `Hi ${recipient},

I hope this message finds you well. I'm ${sender}, a final-year student with a strong passion for ${company}'s mission and the innovative work your team is doing.

I've been following ${company}'s recent initiatives and am particularly impressed by your approach to solving complex challenges. My background in data analysis and project management, combined with hands-on experience in analytics tools, aligns well with the skills your team values.

I'd love to learn more about the team dynamics and growth opportunities at ${company}. Would you be open to a brief 15-minute conversation about your experience and advice for someone starting their career in this field?

Thank you for your time, and I look forward to hearing from you.

Best regards,
${sender}`;
  };

  const generateEmailMessage = (recipient: string, company: string, sender: string): string => {
    return `Subject: Aspiring ${company} Team Member - Seeking Career Guidance

Dear ${recipient},

I hope this email finds you well. My name is ${sender}, and I'm a final-year student with a keen interest in joining ${company}'s dynamic team.

After researching ${company}'s impact in the industry and following your recent projects, I'm particularly drawn to the innovative solutions your team develops. My academic background and practical experience in data analysis, project management, and analytics tools have prepared me well for contributing to such meaningful work.

I would greatly appreciate the opportunity to learn from your experience and gain insights into:
• The skills and qualities that make someone successful at ${company}
• Career development opportunities within your organization
• Any advice you might have for someone starting their career

Would you be available for a brief 20-minute phone call or coffee chat in the coming weeks? I'm happy to work around your schedule.

Thank you very much for considering my request. I look forward to the possibility of connecting with you.

Best regards,
${sender}
[Your Phone Number]
[Your Email Address]`;
  };

  const generateCoffeeChatMessage = (recipient: string, company: string, sender: string): string => {
    return `Hi ${recipient},

I'm ${sender}, a final-year student who's been following ${company}'s incredible work in the industry. I'm particularly inspired by the innovative approach your team takes to solving complex challenges.

I'd love to learn from your experience and understand more about what makes ${company} such a great place to build a career. Would you be interested in grabbing coffee sometime? I'd be happy to meet at a location convenient for you.

I'm especially curious about:
• Your journey to ${company} and what drew you there
• The skills that are most valuable in your role
• Any advice for someone starting their career

I completely understand if you're too busy, but I'd really appreciate even 20-30 minutes of your time.

Thank you for considering!

Best,
${sender}`;
  };

  const generateNetworkingMessage = (recipient: string, company: string, sender: string): string => {
    return `Hi ${recipient},

It was great meeting you at [Event Name] yesterday! I really enjoyed our brief conversation about ${company}'s innovative approach to [relevant topic].

As I mentioned, I'm ${sender}, a final-year student passionate about starting my career in this field. Your insights about the industry were incredibly valuable, and I'd love to continue our conversation.

Would you be interested in connecting over LinkedIn? I'd also be grateful for any advice you might have about breaking into the industry and what skills are most important to develop.

Thank you again for taking the time to chat yesterday. I hope we can stay in touch!

Best regards,
${sender}`;
  };

  const copyToClipboard = () => {
    if (outreachOut) {
      navigator.clipboard.writeText(outreachOut).then(() => {
        alert('Message copied to clipboard!');
      });
    }
  };

  return (
    <section className="card" style={{ marginTop: '20px' }}>
      <div 
        className="row section-toggle" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        data-testid="section-outreach-generator"
      >
        <h3 style={{ flex: 1 }}>4) Warm outreach</h3>
        <span className={`chev ${isCollapsed ? 'collapsed' : ''}`}>▾</span>
      </div>
      
      {!isCollapsed && (
        <div className="collapsible">
          <div className="row">
            <div style={{ flex: 1 }}>
              <label>Recruiter / Contact name</label>
              <input
                className="career-input"
                placeholder="e.g., Priya Sharma"
                value={rname}
                onChange={(e) => setRname(e.target.value)}
                data-testid="input-recipient-name"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Company</label>
              <input
                className="career-input"
                placeholder="e.g., Goldman Sachs"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                data-testid="input-company-name"
              />
            </div>
          </div>
          
          <div className="row">
            <div style={{ flex: 1 }}>
              <label>Your name</label>
              <input
                className="career-input"
                placeholder="e.g., Rahul"
                value={yname}
                onChange={(e) => setYname(e.target.value)}
                data-testid="input-your-name"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Channel</label>
              <select
                className="career-select"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                data-testid="select-channel"
              >
                <option>LinkedIn</option>
                <option>Email</option>
                <option>Coffee chat</option>
                <option>Networking event</option>
              </select>
            </div>
          </div>
          
          <div className="row" style={{ marginTop: '8px' }}>
            <button 
              className="btn" 
              onClick={generateOutreach}
              data-testid="btn-generate-outreach"
            >
              Generate message
            </button>
            {outreachOut && (
              <button 
                className="btn ghost" 
                onClick={copyToClipboard}
                data-testid="btn-copy-outreach"
              >
                Copy
              </button>
            )}
            <span className="subtle">Professional + personalized</span>
          </div>
          
          {outreachOut && (
            <div className="out" data-testid="output-outreach-message">
              {outreachOut}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
