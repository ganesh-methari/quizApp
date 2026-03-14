/**
 * Test Script to Check Vercel API Health
 * Run this to test your Vercel deployment
 */

const VERCEL_URL = 'https://quiz-42pufnpiv-jackesmail3580-2378s-projects.vercel.app';

async function testVercelAPI() {
  console.log('Testing Vercel API:', VERCEL_URL);
  console.log('='.repeat(60));

  try {
    // Test 1: Health check
    console.log('\n✅ Test 1: Checking /api/health endpoint...');
    const healthResponse = await fetch(`${VERCEL_URL}/api/health`);
    const healthData = await healthResponse.json();

    console.log('Status:', healthResponse.status);
    console.log('Response:', JSON.stringify(healthData, null, 2));

    if (healthData.database === 'connected') {
      console.log('✅ Database is connected!');
    } else {
      console.log('❌ Database is NOT connected');
      console.log('   Make sure MONGODB_URI is set in Vercel environment variables');
    }

    // Test 2: Register endpoint
    console.log('\n✅ Test 2: Testing /api/auth/register endpoint...');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'test123456'
    };

    const registerResponse = await fetch(`${VERCEL_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    console.log('Status:', registerResponse.status);

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful!');
      console.log('Response:', JSON.stringify(registerData, null, 2));
    } else {
      const errorData = await registerResponse.json();
      console.log('❌ Registration failed');
      console.log('Response:', JSON.stringify(errorData, null, 2));
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure you redeployed after adding environment variables');
    console.log('2. Check Vercel deployment logs');
    console.log('3. Verify MONGODB_URI is correct');
  }
}

testVercelAPI();
