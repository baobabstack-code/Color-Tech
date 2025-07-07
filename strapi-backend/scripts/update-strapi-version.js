#!/usr/bin/env node

/**
 * This script updates the Strapi version in package.json to the specified version
 * and ensures all @strapi/* dependencies are updated to the same version.
 * 
 * Usage: node scripts/update-strapi-version.js <version>
 * Example: node scripts/update-strapi-version.js 5.17.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the version from command line arguments
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Please provide a version number.');
  console.error('Usage: node scripts/update-strapi-version.js <version>');
  console.error('Example: node scripts/update-strapi-version.js 5.17.0');
  process.exit(1);
}

// Validate version format
if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error('Invalid version format. Please use semantic versioning (e.g., 5.17.0)');
  process.exit(1);
}

const packageJsonPath = path.join(process.cwd(), 'package.json');

// Create a backup of package.json
const backupPath = path.join(process.cwd(), 'package.json.backup');
fs.copyFileSync(packageJsonPath, backupPath);
console.log(`✅ Created backup of package.json at ${backupPath}`);

try {
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Update all @strapi/* dependencies to the new version
  let updatedDependencies = false;
  
  ['dependencies', 'devDependencies'].forEach(depType => {
    if (!packageJson[depType]) return;
    
    Object.keys(packageJson[depType]).forEach(dep => {
      if (dep.startsWith('@strapi/')) {
        packageJson[depType][dep] = `^${newVersion}`;
        updatedDependencies = true;
      }
    });
  });
  
  if (!updatedDependencies) {
    console.warn('⚠️ No @strapi/* dependencies found in package.json');
  }
  
  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`✅ Updated all @strapi/* dependencies to version ${newVersion}`);
  
  // Run npm install to update the dependencies
  console.log('📦 Running npm install to update dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log(`\n✨ Successfully updated Strapi to version ${newVersion}!`);
  console.log('🔍 Verify that everything works correctly by starting the server:');
  console.log('   npm run develop');
  
} catch (error) {
  console.error('❌ Error updating Strapi version:', error.message);
  
  // Restore backup
  fs.copyFileSync(backupPath, packageJsonPath);
  console.log('⚠️ Restored package.json from backup due to error');
  
  process.exit(1);
} finally {
  // Clean up backup file on success
  if (fs.existsSync(backupPath)) {
    fs.unlinkSync(backupPath);
    console.log('🧹 Removed backup file');
  }
}