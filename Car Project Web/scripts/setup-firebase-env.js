#!/usr/bin/env node

/**
 * Firebase Environment Setup Script
 * 
 * This script helps you set up your Firebase environment variables securely.
 * Run with: node scripts/setup-firebase-env.js
 */

const fs = require('fs');
const path = require('path');

const envTemplate = `# Firebase Configuration (Client-side)
# These are safe to expose in the browser as they are public configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCMY9Pfil9MUnX8dVejCZsB5yeVH4-9PF8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=test1-aa7c3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=test1-aa7c3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=test1-aa7c3.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1002542632519
NEXT_PUBLIC_FIREBASE_APP_ID=1:1002542632519:web:9cdcff301ca464314cab62
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-207PJ9LG89

# Firebase Admin SDK (Server-side)
# These should NEVER be exposed to the client
# Get these from Firebase Console > Project Settings > Service Accounts
FIREBASE_ADMIN_PROJECT_ID=test1-aa7c3
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@test1-aa7c3.iam.gserviceaccount.com

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/cars-project
MONGODB_DB_NAME=cars-project

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Development/Production Environment
NODE_ENV=development
`;

const envExampleTemplate = `# Firebase Configuration (Client-side)
# These are safe to expose in the browser as they are public configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin SDK (Server-side)
# These should NEVER be exposed to the client
# Get these from Firebase Console > Project Settings > Service Accounts
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/cars-project
MONGODB_DB_NAME=cars-project

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Development/Production Environment
NODE_ENV=development
`;

function setupEnvironment() {
  const projectRoot = process.cwd();
  const envLocalPath = path.join(projectRoot, '.env.local');
  const envExamplePath = path.join(projectRoot, '.env.example');

  console.log('🔥 Setting up Firebase environment variables...\n');

  // Check if .env.local already exists
  if (fs.existsSync(envLocalPath)) {
    console.log('⚠️  .env.local already exists!');
    console.log('   If you want to update it, please delete the existing file first.\n');
    return;
  }

  // Create .env.local
  try {
    fs.writeFileSync(envLocalPath, envTemplate);
    console.log('✅ Created .env.local with your Firebase credentials');
  } catch (error) {
    console.error('❌ Error creating .env.local:', error.message);
    return;
  }

  // Create .env.example
  try {
    fs.writeFileSync(envExamplePath, envExampleTemplate);
    console.log('✅ Created .env.example template');
  } catch (error) {
    console.error('❌ Error creating .env.example:', error.message);
  }

  console.log('\n🔐 Security Notes:');
  console.log('   • .env.local is already in .gitignore (secure)');
  console.log('   • Never commit .env.local to version control');
  console.log('   • Update FIREBASE_ADMIN_* variables with your service account credentials');
  console.log('   • Change NEXTAUTH_SECRET to a random string for production');

  console.log('\n📋 Next Steps:');
  console.log('   1. Get Firebase Admin credentials from Firebase Console');
  console.log('   2. Update FIREBASE_ADMIN_PRIVATE_KEY and FIREBASE_ADMIN_CLIENT_EMAIL');
  console.log('   3. Generate a secure NEXTAUTH_SECRET');
  console.log('   4. Run: npm run dev');

  console.log('\n🎉 Firebase environment setup complete!');
}

// Run the setup
setupEnvironment();
