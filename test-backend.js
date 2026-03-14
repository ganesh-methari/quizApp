/**
 * Test Script to Check Render Backend Health
 * Run this locally to test your Render backend
 */

const API_BASE_URL = 'https://quizapp-backend-yypu.onrender.com/api';

async function testBackend() {
  console.log('Testing Render backend:', API_BASE_URL);
  console.log('='.repeat(50));

  try {
    // Test health endpoint
    console.log('\n1. Testing /api/health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('Status:', healthResponse.status);
    console.log('Response:', healthData);

    // Test register endpoint
    console.log('\n2. Testing /api/auth/register endpoint...');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'test123456'
    };

    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    console.log('Status:', registerResponse.status);
    const registerData = await registerResponse.json();
    console.log('Response:', registerData);

  } catch (error) {
    console.error('\n❌ Error connecting to backend:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Render service is not running');
    console.log('2. MONGODB_URI environment variable is not set on Render');
    console.log('3. Database connection is failing');
    console.log('\nCheck your Render dashboard:');
    console.log('- Go to your Render service');
    console.log('- Check "Environment" section for MONGODB_URI');
    console.log('- Check "Logs" for error messages');
  }
}

testBackend();
