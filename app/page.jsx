'use client';

import { useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const launchBrowser = async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/run-browser', {
        method: 'POST',
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to connect to the server');
    }
  };

  return (
    <main className="container">
      <h1>AI Automation Hub</h1>
      <p>Click below to launch your Google AI Studio browser session in the background.</p>
      
      <button 
        className="btn-primary" 
        onClick={launchBrowser}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Launching Session...' : 'Launch Browser'}
      </button>

      {status === 'loading' && (
        <div className="status-message status-loading">
          Waking up automation agent...
        </div>
      )}

      {status === 'success' && (
        <div className="status-message status-success">
          Browser launched successfully! You can find the Chrome window open on your machine.
        </div>
      )}

      {status === 'error' && (
        <div className="status-message status-error">
          Error: {errorMessage}
        </div>
      )}
    </main>
  );
}
