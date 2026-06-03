import fs from 'fs';

try {
  // Read literal root file
  const content = fs.readFileSync('final\\generated\\trackVaultLibrary.full.v1.2.json', 'utf8');
  const lib = JSON.parse(content);
  console.log('--- ROOT BACKSLASH SOURCE METADATA ---');
  console.log('meta:', JSON.stringify(lib.libraryMeta || lib.meta, null, 2));
  console.log('runningWorkouts length:', lib.runningWorkouts ? lib.runningWorkouts.length : 'undefined');
  console.log('supportRoutines length:', lib.supportRoutines ? lib.supportRoutines.length : 'undefined');
  
  if (lib.runningWorkouts && lib.runningWorkouts.length > 0) {
    console.log('First running workout:', lib.runningWorkouts[0].title);
  }
  if (lib.supportRoutines && lib.supportRoutines.length > 0) {
    console.log('First support routine:', lib.supportRoutines[0].title);
  }
} catch (e: any) {
  console.error('Error reading/parsing the root backslash file:', e.message);
}
