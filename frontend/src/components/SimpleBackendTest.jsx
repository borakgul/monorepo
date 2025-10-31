import React, { useState } from 'react';
import './SimpleTest.css';

const SimpleBackendTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testHealthCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/actuator/health');
      const data = await response.json();
      setResult(`✅ Health Check SUCCESS: ${JSON.stringify(data)}`);
    } catch (error) {
      setResult(`❌ Health Check ERROR: ${error.message}`);
    }
    setLoading(false);
  };

  const testTasksEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Tasks SUCCESS: Found ${data.length} tasks`);
      } else {
        setResult(`❌ Tasks ERROR: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      setResult(`❌ Tasks NETWORK ERROR: ${error.message}`);
    }
    setLoading(false);
  };

  const testAuthEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Auth SUCCESS: ${JSON.stringify(data)}`);
      } else {
        setResult(`❌ Auth ERROR: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      setResult(`❌ Auth NETWORK ERROR: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="test-container">
      <h2>🧪 Backend Connection Test</h2>
      
      <div className="test-buttons">
        <button onClick={testHealthCheck} disabled={loading}>
          Test Health Check
        </button>
        <button onClick={testTasksEndpoint} disabled={loading}>
          Test Tasks Endpoint
        </button>
        <button onClick={testAuthEndpoint} disabled={loading}>
          Test Auth Endpoint
        </button>
      </div>

      {loading && <div className="loading">Testing...</div>}
      
      {result && (
        <div className="result">
          <h3>Result:</h3>
          <pre>{result}</pre>
        </div>
      )}

      <div className="info">
        <h4>Backend Info:</h4>
        <ul>
          <li>Backend URL: http://localhost:8080</li>
          <li>Frontend URL: http://localhost:5174</li>
          <li>Expected Endpoints:
            <ul>
              <li>GET /actuator/health</li>
              <li>GET /api/tasks</li>
              <li>POST /api/auth/login</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleBackendTest;