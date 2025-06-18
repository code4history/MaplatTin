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

// Check if backup already exists (from a previous failed run)
if (fs.existsSync(backupPath)) {
  console.warn('⚠️  Found existing backup file from a previous run.');
  console.warn('   This might contain the original local dependencies.');
  console.warn('   Restoring from backup before proceeding...');
  fs.copyFileSync(backupPath, denoJsonPath);
  // Re-read the restored deno.json
  const restoredDenoJson = JSON.parse(fs.readFileSync(denoJsonPath, 'utf8'));
  Object.assign(denoJson, restoredDenoJson);
}

fs.writeFileSync(backupPath, JSON.stringify(denoJson, null, 2));

try {
  // Sync version across all files before publishing
  console.log('Syncing version across all files...');
  execSync('node scripts/sync-version.js', { stdio: 'inherit', cwd: rootDir });
  
  // Read versions from local packages
  const edgeboundPath = path.join(rootDir, '..', 'MaplatEdgeBound', 'package.json');
  const transformPath = path.join(rootDir, '..', 'MaplatTransform', 'package.json');
  
  let edgeboundVersion = '0.2.2'; // fallback version
  let transformVersion = '0.2.2'; // fallback version
  
  try {
    const edgeboundPkg = JSON.parse(fs.readFileSync(edgeboundPath, 'utf8'));
    edgeboundVersion = edgeboundPkg.version;
    console.log(`Found @maplat/edgebound version: ${edgeboundVersion}`);
  } catch (e) {
    console.warn('Could not read MaplatEdgeBound version, using fallback');
  }
  
  try {
    const transformPkg = JSON.parse(fs.readFileSync(transformPath, 'utf8'));
    transformVersion = transformPkg.version;
    console.log(`Found @maplat/transform version: ${transformVersion}`);
  } catch (e) {
    console.warn('Could not read MaplatTransform version, using fallback');
  }
  
  // Update imports for production
  if (denoJson.imports) {
    const originalImports = { ...denoJson.imports };
    
    // Replace local paths with JSR/npm versions using dynamic versions
    if (denoJson.imports['@maplat/transform']) {
      denoJson.imports['@maplat/transform'] = `jsr:@maplat/transform@^${transformVersion}`;
    }
    if (denoJson.imports['@maplat/edgebound']) {
      denoJson.imports['@maplat/edgebound'] = `jsr:@maplat/edgebound@^${edgeboundVersion}`;
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