// 🔍 Debug API Service - JSON parse hatalarını tespit etmek için

/**
 * 🚨 Safe JSON Parse - Hatalar için detaylı log
 */
export const safeJsonParse = async (response, context = 'API Call') => {
  const responseText = await response.text();
  
  console.log(`🔍 ${context} Response Debug:`, {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    bodyLength: responseText.length,
    bodyPreview: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''),
    fullBody: responseText
  });

  // Boş response kontrolü
  if (!responseText.trim()) {
    throw new Error(`Empty response from ${context}`);
  }

  // HTML response kontrolü (muhtemelen error page)
  if (responseText.trim().startsWith('<')) {
    console.error('❌ HTML Response detected (probably error page):', responseText);
    throw new Error(`Server returned HTML instead of JSON. Check if backend is running on correct port.`);
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error('❌ JSON Parse Error:', {
      error: error.message,
      position: error.message.match(/position (\d+)/)?.[1],
      responseText,
      context
    });
    
    // Hatanın bulunduğu pozisyonu göster
    const position = error.message.match(/position (\d+)/)?.[1];
    if (position) {
      const pos = parseInt(position);
      const start = Math.max(0, pos - 20);
      const end = Math.min(responseText.length, pos + 20);
      console.error('❌ Error Context:', {
        before: responseText.substring(start, pos),
        errorChar: responseText[pos],
        after: responseText.substring(pos + 1, end)
      });
    }
    
    throw new Error(`JSON Parse Error in ${context}: ${error.message}`);
  }
};

/**
 * 🔧 Enhanced Fetch with debugging
 */
export const debugFetch = async (url, options = {}) => {
  console.log(`🔄 API Request:`, {
    url,
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body
  });

  try {
    const response = await fetch(url, options);
    
    console.log(`📡 API Response:`, {
      url,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    return response;
  } catch (error) {
    console.error('❌ Network Error:', {
      url,
      error: error.message
    });
    throw error;
  }
};

/**
 * 🔍 Backend Health Check
 */
export const checkBackendHealth = async () => {
  try {
    console.log('🔍 Checking backend health...');
    
    const response = await debugFetch('http://localhost:8080/actuator/health');
    const data = await safeJsonParse(response, 'Health Check');
    
    console.log('✅ Backend is healthy:', data);
    return true;
  } catch (error) {
    console.error('❌ Backend health check failed:', error);
    return false;
  }
};

/**
 * 🔍 Auth Endpoints Test
 */
export const testAuthEndpoints = async () => {
  console.log('🔍 Testing auth endpoints...');
  
  // First check if debug user already exists
  console.log('🔍 Checking if debug user exists...');
  try {
    const loginResponse = await debugFetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'debug@example.com',
        password: 'debug123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await safeJsonParse(loginResponse, 'Existing User Login');
      console.log('✅ Debug user already exists and can login:', loginData);
    }
  } catch (error) {
    console.log('ℹ️ Debug user doesn\'t exist or login failed, will test registration');
  }
  
  // Test register endpoint with unique user
  try {
    const timestamp = Date.now();
    const response = await debugFetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Debug User ' + timestamp,
        email: `debug_${timestamp}@example.com`,
        password: 'debug123'
      })
    });

    if (response.status === 409 || response.status === 400) {
      console.log('📝 Register endpoint exists (validation or conflict error)');
      const errorData = await safeJsonParse(response, 'Register Conflict');
      console.log('⚠️ Register conflict details:', errorData);
    } else if (response.status === 201 || response.status === 200) {
      const data = await safeJsonParse(response, 'Register Test');
      console.log('✅ Register endpoint working:', data);
    } else {
      const data = await safeJsonParse(response, 'Register Test Error');
      console.log('⚠️ Register endpoint response:', data);
    }
  } catch (error) {
    console.error('❌ Register endpoint test failed:', error);
  }

  // Test login endpoint
  try {
    const response = await debugFetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'debug@example.com',
        password: 'debug123'
      })
    });

    const data = await safeJsonParse(response, 'Login Test');
    console.log('🔐 Login endpoint response:', data);
  } catch (error) {
    console.error('❌ Login endpoint test failed:', error);
  }
};

// Global error handler
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('JSON')) {
    console.error('🚨 Unhandled JSON Error:', event.reason);
  }
});