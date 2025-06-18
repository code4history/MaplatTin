import Tin from './src/index.js';
import fs from 'fs';

async function updateTestCases() {
  const datasets = [
    ['uno_bus_gtfs_loose', 'Uno Loose'],
    ['uno_bus_gtfs_error', 'Uno Error']
  ];

  for (const [filename, label] of datasets) {
    console.log(`Processing ${label}...`);
    
    // Load map data
    const mapData = JSON.parse(fs.readFileSync(`./tests/maps/${filename}.json`, 'utf8'));
    
    // Create Tin instance
    const tin = new Tin({
      wh: mapData.wh,
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
    
    // Get compiled result
    const compiled = tin.getCompiled();
    
    // Save the new compiled result
    fs.writeFileSync(
      `./tests/compiled/${filename}.json`,
      JSON.stringify(compiled, null, 2)
    );
    
    console.log(`Updated ${filename}.json`);
  }
}

updateTestCases().catch(console.error);