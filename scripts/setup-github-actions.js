#!/usr/bin/env node

/**
 * GitHub Actions Setup Script for ColorTech
 * This script helps you set up the required secrets and configuration
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 ColorTech GitHub Actions Setup\n');

// Check if we're in a git repository
try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
} catch (error) {
    console.error('❌ This is not a Git repository. Please run this script from your project root.');
    process.exit(1);
}

// Check if Vercel CLI is installed
try {
    execSync('vercel --version', { stdio: 'ignore' });
    console.log('✅ Vercel CLI is installed');
} catch (error) {
    console.log('📦 Installing Vercel CLI...');
    try {
        execSync('npm install -g vercel', { stdio: 'inherit' });
        console.log('✅ Vercel CLI installed successfully');
    } catch (installError) {
        console.error('❌ Failed to install Vercel CLI. Please install it manually: npm install -g vercel');
        process.exit(1);
    }
}

// Check if project is linked to Vercel
const vercelConfigPath = path.join(process.cwd(), '.vercel', 'project.json');
if (!fs.existsSync(vercelConfigPath)) {
    console.log('🔗 Linking project to Vercel...');
    console.log('Please follow the prompts to link your project:');
    try {
        execSync('vercel link', { stdio: 'inherit' });
        console.log('✅ Project linked to Vercel');
    } catch (error) {
        console.error('❌ Failed to link project to Vercel');
        process.exit(1);
    }
}

// Read Vercel configuration
let vercelConfig;
try {
    vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    console.log('✅ Vercel configuration found');
} catch (error) {
    console.error('❌ Could not read Vercel configuration');
    process.exit(1);
}

// Display required GitHub secrets
console.log('\n📋 Required GitHub Secrets');
console.log('Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions');
console.log('\nAdd these secrets:\n');

console.log('🔧 Vercel Configuration:');
console.log(`VERCEL_ORG_ID=${vercelConfig.orgId}`);
console.log(`VERCEL_PROJECT_ID=${vercelConfig.projectId}`);
console.log('VERCEL_TOKEN=<your_vercel_token>');

console.log('\n🗄️ Database Configuration:');
console.log('DATABASE_URL=<your_production_database_url>');

console.log('\n🔐 Authentication Configuration:');
console.log('NEXTAUTH_URL=https://www.colortech.co.zw');
console.log('NEXTAUTH_URL_PREVIEW=<your_preview_domain>');
console.log('NEXTAUTH_SECRET=<your_nextauth_secret>');

console.log('\n🌐 Google OAuth Configuration:');
console.log('GOOGLE_CLIENT_ID=<your_google_client_id>');
console.log('GOOGLE_CLIENT_SECRET=<your_google_client_secret>');

console.log('\n🗺️ Additional Services:');
console.log('NEXT_PUBLIC_MAPS_PLATFORM_API_KEY=<your_google_maps_api_key>');

// Check if environment variables are set locally
console.log('\n🔍 Checking local environment variables...');

const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.log('⚠️ Missing local environment variables:');
    missingEnvVars.forEach(envVar => console.log(`   - ${envVar}`));
    console.log('\nMake sure these are set in your .env.local file');
} else {
    console.log('✅ All required environment variables are set locally');
}

// Generate Vercel token instructions
console.log('\n🎫 To get your Vercel token:');
console.log('1. Run: vercel whoami');
console.log('2. Go to: https://vercel.com/account/tokens');
console.log('3. Create a new token with appropriate permissions');
console.log('4. Add it as VERCEL_TOKEN in GitHub secrets');

console.log('\n📚 Next Steps:');
console.log('1. Add all the secrets to your GitHub repository');
console.log('2. Update your Google OAuth redirect URIs');
console.log('3. Push to main branch to trigger your first deployment');
console.log('4. Check the Actions tab to monitor the deployment');

console.log('\n📖 For detailed instructions, see: GITHUB_ACTIONS_DEPLOYMENT_GUIDE.md');
console.log('\n🎉 Setup complete! Happy deploying!');