import Tin from './dist/tin.js';
import fs from 'fs';

async function updateTestCases() {
  const datasets = [
    ['naramachi_yasui_bunko', 'Nara'],
    ['fushimijo_maplat', 'Fushimi'],
    ['uno_bus_gtfs_loose', 'Uno Loose'],
    ['uno_bus_gtfs_error', 'Uno Error']
  ];

  for (const [filename, label] of datasets) {
    console.log(`Processing ${label}...`);
    
    // Load map data
    const mapData = JSON.parse(fs.readFileSync(`./tests/maps/${filename}.json`, 'utf8'));
    
    // Handle old format (width/height) vs new format (wh)
    const wh = mapData.wh || [mapData.width, mapData.height];
    
    // Create Tin instance
    console.log('Map data:', {
      wh: wh,
      width: mapData.width,
      height: mapData.height,
      yaxisMode: mapData.yaxisMode,
      vertexMode: mapData.vertexMode,
      strictMode: mapData.strictMode
    });
    
    const tin = new Tin({
      wh: wh,
      yaxisMode: mapData.yaxisMode,
      vertexMode: mapData.vertexMode,
      strictMode: mapData.strictMode,
      stateFull: false
    });
    
    // Check if xy is set after constructor
    console.log('Tin xy:', tin.xy);
    console.log('Tin wh:', tin.wh);

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
      `./tests/compiled/${filename}.new.json`,
      JSON.stringify(compiled, null, 2)
    );
    
    console.log(`Created ${filename}.new.json`);
  }
  
  console.log('\nTo apply changes, run:');
  console.log('mv ./tests/compiled/naramachi_yasui_bunko.new.json ./tests/compiled/naramachi_yasui_bunko.json');
  console.log('mv ./tests/compiled/fushimijo_maplat.new.json ./tests/compiled/fushimijo_maplat.json');
  console.log('mv ./tests/compiled/uno_bus_gtfs_loose.new.json ./tests/compiled/uno_bus_gtfs_loose.json');
  console.log('mv ./tests/compiled/uno_bus_gtfs_error.new.json ./tests/compiled/uno_bus_gtfs_error.json');
}

updateTestCases().catch(console.error);