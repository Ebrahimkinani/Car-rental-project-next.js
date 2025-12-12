#!/usr/bin/env node

/**
 * Enable development mode for Firebase user sync testing
 * This script adds the SKIP_FIREBASE_VERIFICATION flag to .env.local
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

try {
  // Read the current .env.local file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if SKIP_FIREBASE_VERIFICATION is already set
  if (envContent.includes('SKIP_FIREBASE_VERIFICATION')) {
    console.log('✅ SKIP_FIREBASE_VERIFICATION is already set in .env.local');
  } else {
    // Add the development mode flag
    envContent += '\n# Development mode - skip Firebase verification for testing\nSKIP_FIREBASE_VERIFICATION=true\n';
    
    // Write back to file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Added SKIP_FIREBASE_VERIFICATION=true to .env.local');
  }
  
  console.log('🔧 Development mode enabled for Firebase user sync testing');
  console.log('📝 You can now test user sync without Firebase Admin credentials');
  
} catch (error) {
  console.error('❌ Error updating .env.local:', error.message);
  process.exit(1);
}
