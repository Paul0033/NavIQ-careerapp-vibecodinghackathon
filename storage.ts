import { useState, useEffect } from 'react';

// Custom hook for localStorage with React state synchronization
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

// Demo data loader
export function loadDemoData() {
  const demoData = {
    'career-copilot-c_name': 'Priya Sharma',
    'career-copilot-c_email': 'priya.sharma@student.edu',
    'career-copilot-c_phone': '+91 98765 43210',
    'career-copilot-role': 'Data Analyst (Intern)',
    'career-copilot-industry': 'fintech',
    'career-copilot-location': 'Bangalore',
    'career-copilot-bullet': 'I helped analyze customer data for the marketing team',
    'career-copilot-jd': 'Looking for a Data Analyst intern with SQL, Python, and Tableau experience. Must have strong analytical skills and ability to work with large datasets. Experience with statistical analysis and data visualization preferred.',
    'career-copilot-bullet2': 'Supported team with data analysis tasks',
    'career-copilot-rname': 'Rajesh Kumar',
    'career-copilot-company': 'Paytm',
    'career-copilot-yname': 'Priya',
    'career-copilot-ptitle': 'Customer Segmentation Analysis',
    'career-copilot-plink': 'https://github.com/priya/customer-analysis',
    'career-copilot-phigh': 'Analyzed 100K+ customer transactions using Python and SQL, identified 5 distinct segments leading to 15% increase in targeted campaign effectiveness'
  };

  // Set demo data in localStorage
  Object.entries(demoData).forEach(([key, value]) => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  // Dispatch event to notify components
  window.dispatchEvent(new CustomEvent('demo-loaded'));
  
  // Reload page to reflect changes
  window.location.reload();
}

// Add event listener for demo loading
if (typeof window !== 'undefined') {
  window.addEventListener('load-demo', loadDemoData);
}
