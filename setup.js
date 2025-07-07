/**
 * Project Setup Helper Script
 * 
 * This script helps with setting up the development environment for the Color-Tech project.
 * It performs the following steps:
 * 1. Checks if .env files exist and creates them from examples if they don't
 * 2. Installs dependencies for both frontend and backend
 * 3. Provides instructions for starting the application
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ROOT_DIR = __dirname;
const FRONTEND_ENV_EXAMPLE = path.join(ROOT_DIR, '.env.example');
const FRONTEND_ENV = path.join(ROOT_DIR, '.env');
const BACKEND_DIR = path.join(ROOT_DIR, 'strapi-backend');
const BACKEND_ENV_EXAMPLE = path.join(BACKEND_DIR, '.env.example');
const BACKEND_ENV = path.join(BACKEND_DIR, '.env');

console.log('Color-Tech Project Setup Helper');
console.log('==============================\n');

// Function to copy example env file if it doesn't exist
function setupEnvFile(examplePath, targetPath, name) {
  console.log(`Setting up ${name} environment file...`);
  
  if (fs.existsSync(targetPath)) {
    console.log(`✅ ${name} .env file already exists.`);
  } else if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, targetPath);
    console.log(`✅ Created ${name} .env file from example.`);
    console.log(`   ⚠️ Please edit ${targetPath} with your actual configuration values.`);
  } else {
    console.error(`❌ ${name} .env.example file not found!`);
  }
  console.log('');
}

// Function to install dependencies
function installDependencies(directory, name) {
  console.log(`Installing ${name} dependencies...`);
  try {
    execSync('npm install', { cwd: directory, stdio: 'inherit' });
    console.log(`✅ ${name} dependencies installed successfully.`);
  } catch (error) {
    console.error(`❌ Error installing ${name} dependencies:`, error.message);
  }
  console.log('');
}

// Setup environment files
setupEnvFile(FRONTEND_ENV_EXAMPLE, FRONTEND_ENV, 'Frontend');
setupEnvFile(BACKEND_ENV_EXAMPLE, BACKEND_ENV, 'Backend');

// Install dependencies
const installDeps = process.argv.includes('--install');
if (installDeps) {
  installDependencies(ROOT_DIR, 'Frontend');
  installDependencies(BACKEND_DIR, 'Backend');
} else {
  console.log('Skipping dependency installation. Use --install flag to install dependencies.');
  console.log('');
}

// Print final instructions
console.log('Setup Complete!');
console.log('==============');
console.log('\nTo start the application:');
console.log('\n1. Start the Strapi backend:');
console.log('   cd strapi-backend');
console.log('   npm run develop');
console.log('\n2. In a new terminal, start the Next.js frontend:');
console.log('   npm run dev');
console.log('\n3. Access the application:');
console.log('   - Frontend: http://localhost:3000');
console.log('   - Strapi Admin: http://localhost:1337/admin');