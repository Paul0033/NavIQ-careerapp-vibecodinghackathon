import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/lib/storage';

export default function ProfileManager() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profiles, setProfiles] = useState<string[]>(['default']);
  const [selectedProfile, setSelectedProfile] = useState('default');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const savedProfiles = JSON.parse(localStorage.getItem('career-copilot-profiles') || '["default"]');
    setProfiles(savedProfiles);
  };

  const saveProfile = () => {
    const name = profileName.trim();
    if (!name) {
      alert('Enter a profile name');
      return;
    }

    // Save current state to profile
    const currentState = getCurrentState();
    localStorage.setItem(`career-copilot-profile-${name}`, JSON.stringify(currentState));

    // Update profiles list
    const updatedProfiles = profiles.includes(name) ? profiles : [...profiles, name];
    setProfiles(updatedProfiles);
    localStorage.setItem('career-copilot-profiles', JSON.stringify(updatedProfiles));
    
    alert(`Saved profile: ${name}`);
    setProfileName('');
  };

  const loadProfile = () => {
    if (!selectedProfile) {
      alert('No profile selected');
      return;
    }

    const profileData = localStorage.getItem(`career-copilot-profile-${selectedProfile}`);
    if (!profileData) {
      alert('Profile not found');
      return;
    }

    try {
      const data = JSON.parse(profileData);
      restoreState(data);
      alert(`Loaded profile: ${selectedProfile}`);
    } catch (error) {
      alert('Failed to load profile');
    }
  };

  const deleteProfile = () => {
    if (!selectedProfile || selectedProfile === 'default') {
      alert('Cannot delete default profile');
      return;
    }

    localStorage.removeItem(`career-copilot-profile-${selectedProfile}`);
    const updatedProfiles = profiles.filter(p => p !== selectedProfile);
    setProfiles(updatedProfiles);
    localStorage.setItem('career-copilot-profiles', JSON.stringify(updatedProfiles));
    setSelectedProfile('default');
    alert(`Deleted profile: ${selectedProfile}`);
  };

  const renameProfile = () => {
    const oldName = selectedProfile;
    const newName = prompt('Enter new profile name:', oldName);
    
    if (!newName || newName === oldName) return;

    const profileData = localStorage.getItem(`career-copilot-profile-${oldName}`);
    if (profileData) {
      localStorage.setItem(`career-copilot-profile-${newName}`, profileData);
      localStorage.removeItem(`career-copilot-profile-${oldName}`);
      
      const updatedProfiles = profiles.map(p => p === oldName ? newName : p);
      setProfiles(updatedProfiles);
      localStorage.setItem('career-copilot-profiles', JSON.stringify(updatedProfiles));
      setSelectedProfile(newName);
      alert(`Renamed to: ${newName}`);
    }
  };

  const exportJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      profile: selectedProfile,
      state: getCurrentState()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-copilot-${selectedProfile}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.state) {
          restoreState(data.state);
          alert('Data imported successfully!');
        }
      } catch (error) {
        alert('Error importing data: Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const shareLink = () => {
    const state = getCurrentState();
    const encoded = btoa(JSON.stringify(state));
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
    
    navigator.clipboard.writeText(url).then(() => {
      alert('Shareable link copied to clipboard!');
    });
  };

  const getCurrentState = () => {
    const fields = ['c_name', 'c_email', 'c_phone', 'role', 'industry', 'location', 'bullet', 'jd', 'bullet2', 'rname', 'company', 'yname', 'channel', 'ptitle', 'plink', 'phigh'];
    const state: any = {};
    
    fields.forEach(field => {
      const value = localStorage.getItem(`career-copilot-${field}`);
      if (value) state[field] = value;
    });
    
    return state;
  };

  const restoreState = (state: any) => {
    Object.keys(state).forEach(key => {
      localStorage.setItem(`career-copilot-${key}`, state[key]);
    });
    
    // Dispatch event to refresh components
    window.dispatchEvent(new CustomEvent('profile-loaded', { detail: state }));
    window.location.reload();
  };

  return (
    <section className="card" style={{ marginTop: '20px' }}>
      <div 
        className="row section-toggle" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        data-testid="section-profiles"
      >
        <h3 style={{ flex: 1 }}>Profiles & Data</h3>
        <span className={`chev ${isCollapsed ? 'collapsed' : ''}`}>▾</span>
      </div>
      
      {!isCollapsed && (
        <div className="collapsible">
          <div className="row">
            <input
              className="career-input"
              style={{ flex: 2 }}
              placeholder="Profile name (e.g., VC-Intern-Pratham)"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              data-testid="input-profile-name"
            />
            <button 
              className="btn" 
              onClick={saveProfile}
              data-testid="btn-save-profile"
            >
              Save
            </button>
            <button 
              className="btn" 
              onClick={renameProfile}
              data-testid="btn-rename-profile"
            >
              Rename
            </button>
            <button 
              className="btn ghost" 
              onClick={exportJSON}
              data-testid="btn-export-json"
            >
              Export
            </button>
            <label className="btn ghost no-print">
              Import
              <input
                type="file"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={importJSON}
                data-testid="input-import-json"
              />
            </label>
          </div>
          
          <div className="row" style={{ marginTop: '8px' }}>
            <select
              className="career-select"
              style={{ flex: 2 }}
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              data-testid="select-profiles"
            >
              {profiles.map(profile => (
                <option key={profile} value={profile}>
                  {profile}
                </option>
              ))}
            </select>
            <button 
              className="btn" 
              onClick={loadProfile}
              data-testid="btn-load-profile"
            >
              Load
            </button>
            <button 
              className="btn ghost" 
              onClick={deleteProfile}
              data-testid="btn-delete-profile"
            >
              Delete
            </button>
            <button 
              className="btn" 
              onClick={shareLink}
              data-testid="btn-share-link"
            >
              Share Link
            </button>
          </div>
          
          <div className="subtle" style={{ marginTop: '6px' }}>
            Tip: Share Link encodes the full app state in the URL for judges/mentors.
          </div>
        </div>
      )}
    </section>
  );
}
