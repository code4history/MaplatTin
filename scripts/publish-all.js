#!/usr/bin/env node

import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Get command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

console.log(`Starting ${isDryRun ? 'dry-run ' : ''}publish to both npm and JSR...`);

try {
  // Step 1: Always run Deno dry-run first to validate
  console.log('\n1. Running Deno publish validation (dry-run)...');
  execSync('node scripts/publish-deno.js --dry-run', { 
    stdio: 'inherit', 
    cwd: rootDir 
  });
  console.log('✓ Deno validation passed');

  if (isDryRun) {
    // Step 2: If this is a dry-run, also do npm dry-run
    console.log('\n2. Running npm publish validation (dry-run)...');
    execSync('node scripts/publish-npm.js --dry-run', { 
      stdio: 'inherit', 
      cwd: rootDir 
    });
    console.log('✓ npm validation passed');
    console.log('\n✓ Both dry-runs completed successfully!');
  } else {
    // Step 2: Publish to npm first (it's more established)
    console.log('\n2. Publishing to npm...');
    execSync('node scripts/publish-npm.js', { 
      stdio: 'inherit', 
      cwd: rootDir 
    });
    console.log('✓ Published to npm successfully');

    // Step 3: Publish to Deno/JSR
    console.log('\n3. Publishing to JSR...');
    execSync('node scripts/publish-deno.js', { 
      stdio: 'inherit', 
      cwd: rootDir 
    });
    console.log('✓ Published to JSR successfully');
    
    console.log('\n✓ Successfully published to both npm and JSR!');
  }
} catch (error) {
  console.error('\n✗ Publish failed:', error.message);
  console.error('Publishing was aborted to maintain consistency between registries.');
  process.exit(1);
}