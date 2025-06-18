import Tin from './dist/tin.js';
import fs from 'fs';

async function updateTestCases() {
  const datasets = [
    ['naramachi_yasui_bunko', 'Nara'],
    ['fushimijo_maplat', 'Fushimi']
  ];

  for (const [filename, label] of datasets) {
    console.log(`Processing ${label}...`);
    
    // Load map data
    const mapData = JSON.parse(fs.readFileSync(`./tests/maps/${filename}.json`, 'utf8'));
    
    // Handle old format (width/height) vs new format (wh)
    const wh = mapData.wh || [mapData.width, mapData.height];
    const [width, height] = wh;
    
    // Create Tin instance
    const tin = new Tin({
      wh: wh,
      yaxisMode: mapData.yaxisMode,
      vertexMode: mapData.vertexMode,
      strictMode: mapData.strictMode,
      stateFull: false
    });
    
    // Set points and edges
    tin.setPoints(mapData.gcps);
    if (mapData.edges) {
      tin.setEdges(mapData.edges);
    }

    // Update TIN
    tin.updateTin();
    
    // Generate test cases
    const testCases = [];
    for (let xp = 0.1; xp < 1; xp += 0.1) { 
      const x = width * xp;
      for (let yp = 0.1; yp < 1; yp += 0.1) {
        const y = height * yp;
        
        // Only include cases that can be transformed
        try {
          const point = tin.transform([x, y]);
          if (point) {
            testCases.push([[x, y], point]);
          }
        } catch (e) {
          // Skip points that can't be transformed
          console.log(`Skipping point [${x}, ${y}] for ${label}: ${e.message}`);
        }
      }
    }
    
    // Save the new test cases
    fs.writeFileSync(
      `./tests/cases/${filename}.json`,
      JSON.stringify(testCases, null, 2)
    );
    
    console.log(`Updated ${filename}.json with ${testCases.length} test cases`);
  }
}

updateTestCases().catch(console.error);