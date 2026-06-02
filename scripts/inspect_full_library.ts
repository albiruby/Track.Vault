import fs from 'fs';

try {
  const lib = JSON.parse(fs.readFileSync('src/data/workouts/generated/trackVaultLibrary.full.v1.2.json', 'utf8'));
  console.log('--- METADATA ---');
  console.log(JSON.stringify(lib.libraryMeta || lib.meta, null, 2));

  console.log('\n--- FIRST 5K WORKOUT ---');
  const running = lib.runningWorkouts || [];
  const running5k = running.find((e: any) => e.distanceNavId === '5k' || e.category === '5k');
  if (running5k) {
    console.log(JSON.stringify(running5k, null, 2));
  } else {
    console.log('No 5k workout found. Total running workouts count:', running.length);
    if (running.length > 0) {
      console.log('First running workout in list:', JSON.stringify(running[0], null, 2));
    }
  }

  console.log('\n--- FIRST ACTIVATION SUPPORT ROUTINE ---');
  const support = lib.supportRoutines || [];
  const activation = support.find((e: any) => e.supportCategoryId === 'activation' || e.category === 'activation');
  if (activation) {
    console.log(JSON.stringify(activation, null, 2));
  } else {
    console.log('No activation support routine found. Total support routines count:', support.length);
    if (support.length > 0) {
      console.log('First support routine in list:', JSON.stringify(support[0], null, 2));
    }
  }
} catch (e: any) {
  console.error('Error reading/parsing the library file:', e.message);
}
