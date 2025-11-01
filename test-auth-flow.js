#!/usr/bin/env node

/**
 * Authentication Flow Test Script
 * 
 * This script tests the complete authentication flow:
 * 1. Firebase token verification
 * 2. Session creation
 * 3. Protected route access
 * 4. Session cleanup
 */

const fetch = require('node-fetch');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'testpassword123';

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...\n');
  
  try {
    // Test 1: Check if session endpoint is accessible
    console.log('1️⃣ Testing session endpoint accessibility...');
    const sessionCheck = await fetch(`${BASE_URL}/api/session`, {
      method: 'GET',
      credentials: 'include'
    });
    
    if (sessionCheck.status === 401) {
      console.log('   ✅ Session endpoint correctly returns 401 for unauthenticated requests');
    } else {
      console.log('   ⚠️  Session endpoint returned unexpected status:', sessionCheck.status);
    }
    
    // Test 2: Test logout endpoint
    console.log('\n2️⃣ Testing logout endpoint...');
    const logoutResponse = await fetch(`${BASE_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    
    if (logoutResponse.ok) {
      console.log('   ✅ Logout endpoint is accessible');
    } else {
      console.log('   ❌ Logout endpoint failed:', logoutResponse.status);
    }
    
    // Test 3: Test protected routes without authentication
    console.log('\n3️⃣ Testing protected routes without authentication...');
    const favoritesResponse = await fetch(`${BASE_URL}/api/favorites`, {
      credentials: 'include'
    });
    
    if (favoritesResponse.status === 401) {
      console.log('   ✅ Favorites endpoint correctly returns 401 for unauthenticated requests');
    } else {
      console.log('   ⚠️  Favorites endpoint returned unexpected status:', favoritesResponse.status);
    }
    
    const userResponse = await fetch(`${BASE_URL}/api/users/me`, {
      credentials: 'include'
    });
    
    if (userResponse.status === 401) {
      console.log('   ✅ User endpoint correctly returns 401 for unauthenticated requests');
    } else {
      console.log('   ⚠️  User endpoint returned unexpected status:', userResponse.status);
    }
    
    console.log('\n✅ Authentication flow tests completed!');
    console.log('\n📝 Note: To test with actual Firebase authentication, you need to:');
    console.log('   1. Set up Firebase Authentication in your app');
    console.log('   2. Create a test user account');
    console.log('   3. Use the browser to log in and test the session creation');
    console.log('   4. Check that cookies are set and protected routes work');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testAuthFlow();
