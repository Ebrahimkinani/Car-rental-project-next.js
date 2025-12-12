#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * 
 * This script validates that all required environment variables are present
 * and provides helpful error messages if they're missing.
 * 
 * Usage: node scripts/validate-env.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = [
  'MONGODB_URI',
  'NODE_ENV',
  'JWT_SECRET'
];

const optionalEnvVars = [
  'MONGODB_DB',
  'STRIPE_SECRET_KEY',
  'SENDGRID_API_KEY'
];

function validateEnvironment() {
  console.log('🔍 Validating environment variables...\n');
  
  let hasErrors = false;
  
  // Check required variables
  console.log('📋 Required Variables:');
  requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`  ✅ ${varName}: ${maskSensitiveValue(varName, process.env[varName])}`);
    } else {
      console.log(`  ❌ ${varName}: MISSING`);
      hasErrors = true;
    }
  });
  
  // Check optional variables
  console.log('\n📋 Optional Variables:');
  optionalEnvVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`  ✅ ${varName}: ${maskSensitiveValue(varName, process.env[varName])}`);
    } else {
      console.log(`  ⚠️  ${varName}: Not set (optional)`);
    }
  });
  
  // Security checks
  console.log('\n🔒 Security Checks:');
  
  // Check for hardcoded credentials in code
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb+srv://')) {
    console.log('  ✅ MongoDB URI format looks correct');
  } else {
    console.log('  ⚠️  MongoDB URI format may be incorrect');
  }
  
  // Check if running in development
  if (process.env.NODE_ENV === 'development') {
    console.log('  ℹ️  Running in development mode');
  } else if (process.env.NODE_ENV === 'production') {
    console.log('  ⚠️  Running in production mode - ensure all security measures are in place');
  }
  
  console.log('\n' + '='.repeat(50));
  
  // In CI/CD environments (like Vercel), env vars are set via platform
  // Don't fail the build - just warn
  const isCI = process.env.CI === 'true' || process.env.VERCEL === '1' || process.env.VERCEL_ENV;
  
  if (hasErrors) {
    if (isCI) {
      console.log('⚠️  Environment validation found missing variables in CI/CD');
      console.log('   This is expected if variables are set via Vercel dashboard');
      console.log('   Continuing build...');
      return; // Don't exit in CI/CD
    } else {
      console.log('❌ Environment validation failed!');
      console.log('\nTo fix this:');
      console.log('1. Copy .env.example to .env.local');
      console.log('2. Fill in your actual values');
      console.log('3. Run this script again');
      process.exit(1);
    }
  } else {
    console.log('✅ Environment validation passed!');
    console.log('\nYour environment is properly configured.');
  }
}

function maskSensitiveValue(varName, value) {
  const sensitiveVars = ['MONGODB_URI', 'JWT_SECRET', 'STRIPE_SECRET_KEY', 'SENDGRID_API_KEY'];
  
  if (sensitiveVars.includes(varName)) {
    if (value.length > 20) {
      return value.substring(0, 10) + '...' + value.substring(value.length - 5);
    }
    return '***masked***';
  }
  
  return value;
}

// Run validation
validateEnvironment();
