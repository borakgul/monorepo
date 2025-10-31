import React, { useState } from 'react';
import './AuthTest.css';

const AuthTestPage = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const testRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ REGISTER SUCCESS: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`❌ REGISTER ERROR: ${response.status}\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ REGISTER NETWORK ERROR: ${error.message}`);
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ LOGIN SUCCESS: ${JSON.stringify(data, null, 2)}`);
        // Token varsa localStorage'a kaydet
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
      } else {
        setResult(`❌ LOGIN ERROR: ${response.status}\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ LOGIN NETWORK ERROR: ${error.message}`);
    }
    setLoading(false);
  };

  const testProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setResult('❌ NO TOKEN: Önce login olun');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ PROFILE SUCCESS: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`❌ PROFILE ERROR: ${response.status}\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ PROFILE NETWORK ERROR: ${error.message}`);
    }
    setLoading(false);
  };

  const clearToken = () => {
    localStorage.removeItem('authToken');
    setResult('🗑️ Token silindi');
  };

  return (
    <div className="auth-test-container">
      <h2>🔐 Auth System Test</h2>
      
      <div className="form-section">
        <h3>Test Credentials</h3>
        <div className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="test-buttons">
        <button onClick={testRegister} disabled={loading}>
          🆕 Test Register
        </button>
        <button onClick={testLogin} disabled={loading}>
          🔑 Test Login
        </button>
        <button onClick={testProfile} disabled={loading}>
          👤 Test Profile
        </button>
        <button onClick={clearToken} disabled={loading}>
          🗑️ Clear Token
        </button>
      </div>

      {loading && <div className="loading">Testing auth endpoint...</div>}
      
      {result && (
        <div className="result">
          <h3>Result:</h3>
          <pre>{result}</pre>
        </div>
      )}

      <div className="info">
        <h4>Auth Endpoints Test:</h4>
        <ul>
          <li><strong>Register:</strong> POST /api/auth/register</li>
          <li><strong>Login:</strong> POST /api/auth/login</li>
          <li><strong>Profile:</strong> GET /api/auth/profile</li>
        </ul>
        <p><strong>Current Token:</strong> {localStorage.getItem('authToken') ? '✅ Var' : '❌ Yok'}</p>
      </div>
    </div>
  );
};

export default AuthTestPage;