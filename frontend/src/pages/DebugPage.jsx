import React, { useState } from 'react';
import { checkBackendHealth, testAuthEndpoints } from '../services/debugAPI';

const DebugPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message, type = 'info') => {
    setResults(prev => [...prev, { 
      message, 
      type, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const runHealthCheck = async () => {
    setLoading(true);
    addResult('🔍 Starting backend health check...', 'info');
    
    try {
      const isHealthy = await checkBackendHealth();
      if (isHealthy) {
        addResult('✅ Backend is healthy!', 'success');
      } else {
        addResult('❌ Backend health check failed', 'error');
      }
    } catch (error) {
      addResult(`❌ Health check error: ${error.message}`, 'error');
    }
    
    setLoading(false);
  };

  const runAuthTests = async () => {
    setLoading(true);
    addResult('🔍 Starting auth endpoints test...', 'info');
    
    try {
      await testAuthEndpoints();
      addResult('✅ Auth endpoints test completed (check console for details)', 'success');
    } catch (error) {
      addResult(`❌ Auth test error: ${error.message}`, 'error');
    }
    
    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔧 Debug Dashboard</h1>
      <p>Backend & Auth System Debug Tools</p>
      
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <button 
          onClick={runHealthCheck} 
          disabled={loading}
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Testing...' : '🏥 Health Check'}
        </button>
        
        <button 
          onClick={runAuthTests} 
          disabled={loading}
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Testing...' : '🔐 Auth Test'}
        </button>
        
        <button 
          onClick={clearResults}
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🗑️ Clear
        </button>
      </div>

      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '4px', 
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        <h3>📊 Debug Results:</h3>
        {results.length === 0 ? (
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
            No results yet. Run a test to see debug output.
          </p>
        ) : (
          results.map((result, index) => (
            <div 
              key={index}
              style={{
                padding: '0.5rem',
                margin: '0.5rem 0',
                borderRadius: '4px',
                backgroundColor: 
                  result.type === 'success' ? '#d4edda' :
                  result.type === 'error' ? '#f8d7da' :
                  '#d1ecf1',
                borderLeft: `4px solid ${
                  result.type === 'success' ? '#28a745' :
                  result.type === 'error' ? '#dc3545' :
                  '#007bff'
                }`
              }}
            >
              <small style={{ color: '#6c757d' }}>[{result.timestamp}]</small>
              <br />
              {result.message}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <h4>🧰 Debug Instructions:</h4>
        <ol>
          <li>First, run <strong>Health Check</strong> to verify backend is running</li>
          <li>Then run <strong>Auth Test</strong> to check authentication endpoints</li>
          <li>Open browser console (F12) to see detailed debug logs</li>
          <li>If JSON errors occur, check the console for exact error position</li>
        </ol>
        
        <h4>📍 Expected Backend URLs:</h4>
        <ul>
          <li>Health: <code>http://localhost:8080/actuator/health</code></li>
          <li>Register: <code>http://localhost:8080/api/auth/register</code></li>
          <li>Login: <code>http://localhost:8080/api/auth/login</code></li>
          <li>Tasks: <code>http://localhost:8080/api/tasks</code></li>
        </ul>
      </div>
    </div>
  );
};

export default DebugPage;