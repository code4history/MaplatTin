#!/usr/bin/env node

import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Backup original package.json
const backupPath = packageJsonPath + '.backup';
fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2));

try {
  // Sync version across all files before publishing
  console.log('Syncing version across all files...');
  execSync('node scripts/sync-version.js', { stdio: 'inherit', cwd: rootDir });
  
  // Read versions from dependencies
  let edgeboundVersion = '^0.2.2'; // fallback version
  let transformVersion = '^0.2.2'; // fallback version
  
  // First, try to get versions from installed packages
  try {
    const edgeboundPkgPath = require.resolve('@maplat/edgebound/package.json', { paths: [rootDir] });
    const edgeboundPkg = JSON.parse(fs.readFileSync(edgeboundPkgPath, 'utf8'));
    edgeboundVersion = `^${edgeboundPkg.version}`;
    console.log(`Found @maplat/edgebound version from installed package: ${edgeboundPkg.version}`);
  } catch (_e) {
    // If not found in node_modules, try local directory
    try {
      const edgeboundPath = path.join(rootDir, '..', 'MaplatEdgeBound', 'package.json');
      const edgeboundPkg = JSON.parse(fs.readFileSync(edgeboundPath, 'utf8'));
      edgeboundVersion = `^${edgeboundPkg.version}`;
      console.log(`Found @maplat/edgebound version from local directory: ${edgeboundPkg.version}`);
    } catch (_e2) {
      console.warn('Could not read @maplat/edgebound version, using fallback');
    }
  }
  
  try {
    const transformPkgPath = require.resolve('@maplat/transform/package.json', { paths: [rootDir] });
    const transformPkg = JSON.parse(fs.readFileSync(transformPkgPath, 'utf8'));
    transformVersion = `^${transformPkg.version}`;
    console.log(`Found @maplat/transform version from installed package: ${transformPkg.version}`);
  } catch (_e) {
    // If not found in node_modules, try local directory
    try {
      const transformPath = path.join(rootDir, '..', 'MaplatTransform', 'package.json');
      const transformPkg = JSON.parse(fs.readFileSync(transformPath, 'utf8'));
      transformVersion = `^${transformPkg.version}`;
      console.log(`Found @maplat/transform version from local directory: ${transformPkg.version}`);
    } catch (_e2) {
      console.warn('Could not read @maplat/transform version, using fallback');
    }
  }
  
  // Replace file: protocol with actual versions in dependencies
  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }
  
  // Update local file dependencies to version references
  if (packageJson.dependencies['@maplat/edgebound']?.startsWith('file:')) {
    packageJson.dependencies['@maplat/edgebound'] = edgeboundVersion;
    console.log(`Replaced @maplat/edgebound file: with ${edgeboundVersion}`);
  }
  
  if (packageJson.dependencies['@maplat/transform']?.startsWith('file:')) {
    packageJson.dependencies['@maplat/transform'] = transformVersion;
    console.log(`Replaced @maplat/transform file: with ${transformVersion}`);
  }
  
  // Remove overrides if they exist
  if (packageJson.overrides) {
    delete packageJson.overrides;
    console.log('Removed overrides from package.json');
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json for publishing');

  // Get command line arguments
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  
  // Run npm publish with all passed arguments
  const publishCommand = `npm publish ${args.join(' ')}`;
  console.log(`Running: ${publishCommand}`);
  
  execSync(publishCommand, { stdio: 'inherit' });
  
  console.log(isDryRun ? 'Dry run completed successfully!' : 'Published successfully!');
} catch (error) {
  console.error('Publish failed:', error.message);
  process.exitCode = 1;
} finally {
  // Restore original package.json
  fs.renameSync(backupPath, packageJsonPath);
  console.log('Restored original package.json');
}