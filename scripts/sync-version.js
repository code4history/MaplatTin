#!/bin/env node
// package.json の version を README.md・README.ja.mdへ写す。
// 置き換えるのは、もともと版を書いている箇所だけ。版の無い `npm install @maplat/<名前>` などには版を足さない。
// 版は prerelease（例 1.3.0-rc.1）を含めて 1 つの版として扱う。

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
      { regex: /npm install @maplat\/tin@\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/g, replacement: `npm install @maplat/tin@${version}` },
      { regex: /cdn\.jsdelivr\.net\/npm\/@maplat\/tin@\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/g, replacement: `cdn.jsdelivr.net/npm/@maplat/tin@${version}` },
      { regex: /Current release: `\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?`/g, replacement: `Current release: \`${version}\`` },
      { regex: /現在のリリース: `\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?`/g, replacement: `現在のリリース: \`${version}\`` }
    ]
  },
  {
    path: path.join(rootDir, 'README.ja.md'),
    type: 'markdown',
    patterns: [
      { regex: /npm install @maplat\/tin@\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/g, replacement: `npm install @maplat/tin@${version}` },
      { regex: /cdn\.jsdelivr\.net\/npm\/@maplat\/tin@\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/g, replacement: `cdn.jsdelivr.net/npm/@maplat/tin@${version}` },
      { regex: /Current release: `\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?`/g, replacement: `Current release: \`${version}\`` },
      { regex: /現在のリリース: `\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?`/g, replacement: `現在のリリース: \`${version}\`` }
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
