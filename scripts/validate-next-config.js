/**
 * Script to validate Next.js image configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function validateNextConfig() {
    try {
        console.log('🔍 Validating Next.js configuration...');

        // Check if next.config.ts exists
        const configPath = path.join(path.dirname(__dirname), 'next.config.ts');
        if (!fs.existsSync(configPath)) {
            throw new Error('next.config.ts not found');
        }

        console.log('✅ next.config.ts file exists');

        // Read the configuration file
        const configContent = fs.readFileSync(configPath, 'utf8');

        // Check for required Cloudinary configuration
        const checks = [
            {
                name: 'Cloudinary domain configuration',
                test: configContent.includes('res.cloudinary.com'),
                required: true
            },
            {
                name: 'Remote patterns configuration',
                test: configContent.includes('remotePatterns'),
                required: true
            },
            {
                name: 'Image formats optimization',
                test: configContent.includes('formats'),
                required: true
            },
            {
                name: 'Device sizes configuration',
                test: configContent.includes('deviceSizes'),
                required: true
            },
            {
                name: 'Image sizes configuration',
                test: configContent.includes('imageSizes'),
                required: true
            },
            {
                name: 'Cache TTL configuration',
                test: configContent.includes('minimumCacheTTL'),
                required: true
            },
            {
                name: 'Security settings (SVG disabled)',
                test: configContent.includes('dangerouslyAllowSVG: false'),
                required: true
            },
            {
                name: 'Content Security Policy',
                test: configContent.includes('contentSecurityPolicy'),
                required: true
            },
            {
                name: 'Image optimization enabled',
                test: configContent.includes('unoptimized: false'),
                required: true
            }
        ];

        let allPassed = true;

        checks.forEach(check => {
            if (check.test) {
                console.log(`✅ ${check.name}`);
            } else {
                console.log(`❌ ${check.name}`);
                if (check.required) {
                    allPassed = false;
                }
            }
        });

        if (allPassed) {
            console.log('\n🎉 All Next.js image configuration checks passed!');

            // Test Cloudinary URL validation
            console.log('\n🔍 Testing Cloudinary URL validation...');

            const testUrls = [
                'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                'https://res.cloudinary.com/mycloud/image/upload/v1234567890/folder/image.png',
                'https://res.cloudinary.com/test/image/upload/w_300,h_200,c_fill/sample.webp'
            ];

            testUrls.forEach(url => {
                try {
                    const urlObj = new URL(url);
                    const isValid =
                        urlObj.hostname === 'res.cloudinary.com' &&
                        urlObj.protocol === 'https:' &&
                        urlObj.pathname.includes('/image/upload/');

                    if (isValid) {
                        console.log(`✅ Valid Cloudinary URL: ${url}`);
                    } else {
                        console.log(`❌ Invalid Cloudinary URL: ${url}`);
                    }
                } catch (error) {
                    console.log(`❌ Malformed URL: ${url}`);
                }
            });

            console.log('\n✅ Next.js image configuration validation completed successfully!');
            return true;
        } else {
            console.log('\n❌ Some required configuration checks failed!');
            return false;
        }

    } catch (error) {
        console.error('❌ Error validating Next.js configuration:', error.message);
        return false;
    }
}

// Run validation
validateNextConfig()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('❌ Validation failed:', error);
        process.exit(1);
    });