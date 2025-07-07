#!/usr/bin/env node

/**
 * Docker Setup Script
 * 
 * This script helps set up the Docker environment for the Color-Tech application.
 * It creates the necessary .env file from .env.example.docker if it doesn't exist
 * and generates random values for security keys.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// Function to generate a random string
function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, length);
}

// Function to generate app keys (comma-separated random strings)
function generateAppKeys(count = 4, length = 16) {
  return Array.from({ length: count }, () => generateRandomString(length)).join(',');
}

// Main function
async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const envFile = path.join(rootDir, '.env');
  const envExampleFile = path.join(rootDir, '.env.example.docker');

  console.log('🐳 Setting up Docker environment for Color-Tech...');

  // Check if .env file already exists
  if (fs.existsSync(envFile)) {
    console.log('⚠️ .env file already exists. Do you want to overwrite it? (y/N)');
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      readline.question('', resolve);
    });
    readline.close();

    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Setup aborted. Existing .env file was not modified.');
      return;
    }
  }

  // Read the example file
  if (!fs.existsSync(envExampleFile)) {
    console.error(`❌ Error: ${envExampleFile} not found.`);
    return;
  }

  let envContent = fs.readFileSync(envExampleFile, 'utf8');

  // Replace placeholders with random values
  envContent = envContent.replace('your-jwt-secret-here', generateRandomString(64));
  envContent = envContent.replace('your-admin-jwt-secret-here', generateRandomString(64));
  envContent = envContent.replace('your-api-token-salt-here', generateRandomString(32));
  envContent = envContent.replace('your-transfer-token-salt-here', generateRandomString(32));
  envContent = envContent.replace('key1,key2,key3,key4', generateAppKeys(4, 16));

  // Write the .env file
  fs.writeFileSync(envFile, envContent);
  console.log('✅ Created .env file with secure random values');

  // Check if Docker is installed
  try {
    execSync('docker --version', { stdio: 'ignore' });
    execSync('docker-compose --version', { stdio: 'ignore' });
    console.log('✅ Docker and Docker Compose are installed');
  } catch (error) {
    console.error('❌ Error: Docker or Docker Compose is not installed. Please install them first.');
    return;
  }

  console.log('\n🚀 Docker environment setup complete!');
  console.log('\nTo start the application:');
  console.log('  docker-compose up -d --build');
  console.log('\nTo access the applications:');
  console.log('  - Frontend: http://localhost:3000');
  console.log('  - Strapi Admin: http://localhost:1337/admin');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});