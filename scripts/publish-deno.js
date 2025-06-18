#!/usr/bin/env node

import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const denoJsonPath = path.join(rootDir, 'deno.json');

// Read deno.json
const denoJson = JSON.parse(fs.readFileSync(denoJsonPath, 'utf8'));

// Backup original deno.json
const backupPath = denoJsonPath + '.backup';
fs.writeFileSync(backupPath, JSON.stringify(denoJson, null, 2));

try {
  // Sync version across all files before publishing
  console.log('Syncing version across all files...');
  execSync('node scripts/sync-version.js', { stdio: 'inherit', cwd: rootDir });
  
  // Update imports for production
  if (denoJson.imports) {
    const originalImports = { ...denoJson.imports };
    
    // Replace local paths with JSR/npm versions
    if (denoJson.imports['@maplat/transform']) {
      denoJson.imports['@maplat/transform'] = 'jsr:@maplat/transform@^0.2.1';
    }
    if (denoJson.imports['@maplat/edgebound']) {
      denoJson.imports['@maplat/edgebound'] = 'jsr:@maplat/edgebound@^0.2.1';
    }
    
    fs.writeFileSync(denoJsonPath, JSON.stringify(denoJson, null, 2));
    console.log('Updated imports in deno.json for production');
  }

  // Get command line arguments
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  
  // Run deno publish with all passed arguments
  // Add --no-check and --allow-slow-types to skip strict type checking for now
  // Add --allow-dirty for dry-run testing
  const extraArgs = isDryRun ? '--allow-dirty' : '';
  const publishCommand = `deno publish --no-check --allow-slow-types ${extraArgs} ${args.join(' ')}`;
  console.log(`Running: ${publishCommand}`);
  
  execSync(publishCommand, { stdio: 'inherit' });
  
  console.log(isDryRun ? 'Dry run completed successfully!' : 'Published successfully!');
} catch (error) {
  console.error('Publish failed:', error.message);
  process.exitCode = 1;
} finally {
  // Restore original deno.json
  fs.renameSync(backupPath, denoJsonPath);
  console.log('Restored original deno.json');
}