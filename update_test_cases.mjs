import fs from 'fs';
import { execSync } from 'child_process';

// Run the test and capture the actual output
console.log('Running tests to capture actual output...');

// Create a temporary test file to output the actual values
const testCode = `
import { describe, it, expect } from 'vitest';
import Tin, { Options } from './src/index.js';
import fs from 'fs';

const loadMap = async (filename) => 
  (await import(\`./tests/maps/\${filename}.json\`, { assert: { type: 'json' } })).default;

const loadCompiled = async (filename) => 
  (await import(\`./tests/compiled/\${filename}.json\`, { assert: { type: 'json' } })).default;

describe('Update test cases', () => {
  const datasets = [
    ['Uno Loose', 'uno_bus_gtfs_loose'],
    ['Uno Error', 'uno_bus_gtfs_error']
  ];

  datasets.forEach(([label, filename]) => {
    it(\`Generate new expected values for \${label}\`, async () => {
      const load_m = await loadMap(filename);
      const load_c = await loadCompiled(filename);

      const tin = new Tin({
        wh: load_m.wh,
        yaxisMode: load_m.yaxisMode,
        vertexMode: load_m.vertexMode,
        strictMode: load_m.strictMode,
        stateFull: false
      });

      tin.setPoints(load_m.gcps);
      if (load_m.edges) {
        tin.setEdges(load_m.edges);
      }

      tin.updateTin();
      const compiled = tin.getCompiled();

      // Save the new compiled result
      fs.writeFileSync(
        \`./tests/compiled/\${filename}.new.json\`,
        JSON.stringify(compiled, null, 2)
      );
      
      console.log(\`Updated test case for \${filename}\`);
    });
  });
});
`;

fs.writeFileSync('./update_test.ts', testCode);

try {
  // Run the update test
  execSync('npx vitest run update_test.ts', { stdio: 'inherit' });
  
  // Replace old compiled files with new ones
  ['uno_bus_gtfs_loose', 'uno_bus_gtfs_error'].forEach(filename => {
    const newFile = `./tests/compiled/${filename}.new.json`;
    const oldFile = `./tests/compiled/${filename}.json`;
    
    if (fs.existsSync(newFile)) {
      // Backup old file
      fs.copyFileSync(oldFile, `${oldFile}.backup`);
      // Replace with new file
      fs.renameSync(newFile, oldFile);
      console.log(`Updated ${oldFile}`);
    }
  });
  
} catch (error) {
  console.error('Error updating test cases:', error.message);
} finally {
  // Clean up
  if (fs.existsSync('./update_test.ts')) {
    fs.unlinkSync('./update_test.ts');
  }
}