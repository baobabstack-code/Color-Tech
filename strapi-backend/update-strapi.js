/**
 * Strapi Update Helper Script
 * 
 * This script helps with updating Strapi to the latest version.
 * It performs the following steps:
 * 1. Backs up the current package.json
 * 2. Runs the Strapi upgrade command
 * 3. Updates all Strapi dependencies to the same version
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Configuration
const BACKUP_DIR = path.join(__dirname, 'backups');
const PACKAGE_JSON_PATH = path.join(__dirname, 'package.json');

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

// Backup package.json
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(BACKUP_DIR, `package.json.${timestamp}`);

console.log('Backing up package.json...');
fs.copyFileSync(PACKAGE_JSON_PATH, backupPath);
console.log(`Backup created at: ${backupPath}`);

// Run Strapi upgrade
console.log('\nRunning Strapi upgrade...');
try {
  execSync('npx @strapi/upgrade latest', { stdio: 'inherit' });
  console.log('Strapi upgrade completed successfully!');
} catch (error) {
  console.error('Error during Strapi upgrade:', error.message);
  process.exit(1);
}

// Read updated package.json
console.log('\nUpdating Strapi dependencies to consistent versions...');
const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));

// Find the version of @strapi/strapi
const strapiVersion = packageJson.dependencies['@strapi/strapi'];
if (!strapiVersion) {
  console.error('Could not find @strapi/strapi in dependencies!');
  process.exit(1);
}

// Update all @strapi/* dependencies to the same version
let updated = false;
Object.keys(packageJson.dependencies).forEach(dep => {
  if (dep.startsWith('@strapi/') && packageJson.dependencies[dep] !== strapiVersion) {
    console.log(`Updating ${dep} from ${packageJson.dependencies[dep]} to ${strapiVersion}`);
    packageJson.dependencies[dep] = strapiVersion;
    updated = true;
  }
});

if (updated) {
  // Write updated package.json
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2));
  console.log('\nPackage.json updated with consistent Strapi versions.');
  
  // Run npm install to update dependencies
  console.log('\nRunning npm install to update dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('Dependencies updated successfully!');
  } catch (error) {
    console.error('Error updating dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('All Strapi dependencies are already at the same version.');
}

console.log('\nStrapi update process completed successfully!');
console.log(`Current Strapi version: ${strapiVersion}`);
console.log('\nNext steps:');
console.log('1. Test your application thoroughly');
console.log('2. Check for any breaking changes in the Strapi release notes');
console.log('3. Update your documentation if needed');