// 🚀 Quick Auth Test - Manual test for immediate verification
// Browser console'da çalıştırılabilir

// Test 1: Health Check
console.log('🏥 Testing Backend Health...');
fetch('http://localhost:8080/actuator/health')
  .then(response => {
    console.log('Health Status:', response.status);
    return response.json();
  })
  .then(data => console.log('✅ Health Data:', data))
  .catch(error => console.error('❌ Health Error:', error));

// Test 2: Existing User Login
console.log('🔐 Testing Existing User Login...');
fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'debug@example.com',
    password: 'debug123'
  })
})
.then(response => {
  console.log('Login Status:', response.status);
  return response.text();
})
.then(text => {
  console.log('Raw Response:', text);
  try {
    const data = JSON.parse(text);
    console.log('✅ Login Data:', data);
  } catch (e) {
    console.error('❌ JSON Parse Error:', e);
    console.error('Response Text:', text);
  }
})
.catch(error => console.error('❌ Login Error:', error));

// Test 3: New User Registration
const timestamp = Date.now();
console.log('📝 Testing New User Registration...');
fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User ' + timestamp,
    email: `test_${timestamp}@example.com`,
    password: 'test123456'
  })
})
.then(response => {
  console.log('Register Status:', response.status);
  return response.text();
})
.then(text => {
  console.log('Raw Register Response:', text);
  try {
    const data = JSON.parse(text);
    console.log('✅ Register Data:', data);
  } catch (e) {
    console.error('❌ Register JSON Parse Error:', e);
    console.error('Register Response Text:', text);
  }
})
.catch(error => console.error('❌ Register Error:', error));