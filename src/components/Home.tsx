'use client';

import React, { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/create-dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subdomain }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(
          `Dashboard created successfully: ${data.name} (${data.subdomain})`
        );
        setName('');
        setSubdomain('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create dashboard');
      }
    } catch (error) {
      console.log('the err', error);
      //   setError("An error occurred while creating the dashboard", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to ObxiaLabs</h1>
      <p className="text-xl mb-8">Create a new dashboard to get started.</p>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dashboard Name"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            placeholder="Subdomain"
            required
          />
        </div>
        <button type="submit" className="w-full">
          Create Dashboard
        </button>
      </form>

      {message && (
        <div className="mt-4">
          <h2>Success</h2>
          <p>{message}</p>
        </div>
      )}

      {error && (
        <div className={`mt-4 ${error ? 'text-red-600' : ''}`}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
