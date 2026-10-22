#!/usr/bin/env node

/**
 * Pre-publish validation script
 * Checks all packages before publishing to npm
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const PACKAGES = ['core', 'ui', 'plugins', 'html', 'react'];
const REQUIRED_FILES = ['package.json', 'README.md', 'dist/index.js', 'dist/index.cjs', 'dist/index.d.ts', 'dist/THIRD-PARTY-NOTICES.txt'];
const REQUIRED_FIELDS = [
  'name',
  'version',
  'description',
  'author',
  'license',
  'repository',
  'homepage',
  'publishConfig'
];

let hasErrors = false;

console.log('🔍 Pre-publish validation...\n');

// 1. Check build exists
console.log('📦 Checking builds...');
PACKAGES.forEach(pkg => {
  const distPath = join('packages', pkg, 'dist');
  if (!existsSync(distPath)) {
    console.error(`❌ ${pkg}: dist/ folder not found. Run: pnpm build`);
    hasErrors = true;
  } else {
    console.log(`✓ ${pkg}: build exists`);
  }
});

console.log('');

// 2. Validate package.json files
console.log('📝 Validating package.json files...');
PACKAGES.forEach(pkg => {
  const pkgJsonPath = join('packages', pkg, 'package.json');
  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
  
  REQUIRED_FIELDS.forEach(field => {
    if (!pkgJson[field]) {
      console.error(`❌ ${pkg}: Missing field "${field}" in package.json`);
      hasErrors = true;
    }
  });
  
  // Check workspace dependencies
  if (pkgJson.dependencies) {
    Object.entries(pkgJson.dependencies).forEach(([dep, version]) => {
      if (version === 'workspace:*') {
        console.error(`❌ ${pkg}: workspace:* dependency "${dep}" should be replaced with actual version`);
        hasErrors = true;
      }
    });
  }
  
  if (!hasErrors) {
    console.log(`✓ ${pkg}: package.json valid`);
  }
});

console.log('');

// 3. Check required files
console.log('📄 Checking required files...');
PACKAGES.forEach(pkg => {
  REQUIRED_FILES.forEach(file => {
    const filePath = join('packages', pkg, file);
    if (!existsSync(filePath)) {
      console.error(`❌ ${pkg}: Missing ${file}`);
      hasErrors = true;
    }
  });
  const manifest = JSON.parse(readFileSync(join('packages', pkg, 'package.json'), 'utf-8'));
  const checkExports = (value) => {
    if (typeof value === 'string' && !existsSync(join('packages', pkg, value))) {
      console.error(`Missing export for ${pkg}: ${value}`);
      hasErrors = true;
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(checkExports);
    }
  };
  checkExports(manifest.exports);
  if (pkg === 'html' && !existsSync(join('packages', pkg, 'dist/likha-editor.umd.js'))) {
    console.error('Missing CDN bundle');
    hasErrors = true;
  }
  
  if (!hasErrors) {
    console.log(`✓ ${pkg}: all files present`);
  }
});

console.log('');

// 4. Run tests
console.log('🧪 Running tests...');
try {
  execSync('pnpm test', { stdio: 'inherit' });
  console.log('✓ All tests passed');
} catch (error) {
  console.error('Tests failed');
  hasErrors = true;
}

console.log('');

// 5. Check TypeScript
console.log('🔤 Type checking...');
try {
  execSync('pnpm typecheck', { stdio: 'inherit' });
  console.log('✓ No TypeScript errors');
} catch (error) {
  console.error('❌ TypeScript errors found');
  hasErrors = true;
}

try {
  execSync('node scripts/smoke-dist.mjs', { stdio: 'inherit' });
} catch {
  console.error('Distribution smoke checks failed');
  hasErrors = true;
}

try {
  execSync('pnpm lint', { stdio: 'inherit' });
} catch {
  console.error('Lint failed');
  hasErrors = true;
}

console.log('');

// Summary
if (hasErrors) {
  console.error('❌ Pre-publish validation FAILED');
  console.error('Fix the errors above before publishing.');
  process.exit(1);
} else {
  console.log('✅ Pre-publish validation PASSED');
  console.log('\nReady to publish! Run:');
  console.log('  npm login');
  console.log('  pnpm publish:all');
}
