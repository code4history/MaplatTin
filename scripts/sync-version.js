#!/bin/env node
// MaplatTin/scripts/sync-version.js — M1-T1 修正版
// 設計書: docs/superpowers/specs/2026-09-10-M1-T1-design.md §3.2
// 変更: npm install パターンのオプショナル化、CDN URL パターン追加、Current release パターン追加

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Read package.json
const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

console.log(`Syncing version ${version} across all files...`);

// Files to update
const filesToUpdate = [
  {
    path: path.join(rootDir, 'README.md'),
    type: 'markdown',
    patterns: [
      { regex: /npm install @maplat\/tin(?:@[\d.]+)?/g, replacement: `npm install @maplat/tin@${version}` },
      { regex: /cdn\.jsdelivr\.net\/npm\/@maplat\/tin@[\d.]+/g, replacement: `cdn.jsdelivr.net/npm/@maplat/tin@${version}` },
      { regex: /Current release: `[\d.]+`/g, replacement: `Current release: \`${version}\`` },
      { regex: /現在のリリース: `[\d.]+`/g, replacement: `現在のリリース: \`${version}\`` }
    ]
  },
  {
    path: path.join(rootDir, 'README.ja.md'),
    type: 'markdown',
    patterns: [
      { regex: /npm install @maplat\/tin(?:@[\d.]+)?/g, replacement: `npm install @maplat/tin@${version}` },
      { regex: /cdn\.jsdelivr\.net\/npm\/@maplat\/tin@[\d.]+/g, replacement: `cdn.jsdelivr.net/npm/@maplat/tin@${version}` },
      { regex: /Current release: `[\d.]+`/g, replacement: `Current release: \`${version}\`` },
      { regex: /現在のリリース: `[\d.]+`/g, replacement: `現在のリリース: \`${version}\`` }
    ]
  }
];

// Update files
filesToUpdate.forEach(({ path: filePath, type, field, patterns }) => {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  if (type === 'json') {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    content[field] = version;
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
    console.log(`Updated ${filePath}`);
  } else if (type === 'markdown') {
    let content = fs.readFileSync(filePath, 'utf8');
    patterns.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
});

console.log('Version sync completed!');
