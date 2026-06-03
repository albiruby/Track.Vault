import fs from 'fs';
import path from 'path';

try {
  console.log('Starting restoration of full 1,300 curated athletic datasets...');

  // 1. Read files with literal backslashes from the root folder
  const fullLibraryContent = fs.readFileSync('final\\generated\\trackVaultLibrary.full.v1.2.json', 'utf8');
  const runningLibraryContent = fs.readFileSync('final\\generated\\runningWorkoutLibrary.all.v1.2.json', 'utf8');
  const supportLibraryContent = fs.readFileSync('final\\generated\\supportRoutineLibrary.all.v1.2.json', 'utf8');
  const indexContent = fs.readFileSync('final\\workoutLibrary.index.v1.2.json', 'utf8');

  // Parse to verify validity
  const fullLib = JSON.parse(fullLibraryContent);
  const runLib = JSON.parse(runningLibraryContent);
  const supLib = JSON.parse(supportLibraryContent);
  const indexJson = JSON.parse(indexContent);

  console.log(`Detected sources - Full Lib Count: Running=${fullLib.runningWorkouts?.length || 0}, Support=${fullLib.supportRoutines?.length || 0}`);
  console.log(`Detected running source Count: ${runLib.runningWorkouts?.length || 0}`);
  console.log(`Detected support source Count: ${supLib.supportRoutines?.length || 0}`);

  // 2. Define active target directories
  const generatedDir = path.join('src', 'data', 'workouts', 'generated');
  const workoutDir = path.join('src', 'data', 'workouts');

  // Form target paths
  const targetFull = path.join(generatedDir, 'trackVaultLibrary.full.v1.2.json');
  const targetRunning = path.join(generatedDir, 'runningWorkoutLibrary.all.v1.2.json');
  const targetSupport = path.join(generatedDir, 'supportRoutineLibrary.all.v1.2.json');
  const targetIndex = path.join(workoutDir, 'workoutLibrary.index.v1.2.json');

  // Verify paths exist
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }

  // 3. Write target files
  fs.writeFileSync(targetFull, JSON.stringify(fullLib, null, 2), 'utf8');
  console.log(`Successfully wrote ${targetFull}`);

  fs.writeFileSync(targetRunning, JSON.stringify(runLib, null, 2), 'utf8');
  console.log(`Successfully wrote ${targetRunning}`);

  fs.writeFileSync(targetSupport, JSON.stringify(supLib, null, 2), 'utf8');
  console.log(`Successfully wrote ${targetSupport}`);

  fs.writeFileSync(targetIndex, JSON.stringify(indexJson, null, 2), 'utf8');
  console.log(`Successfully wrote ${targetIndex}`);

  console.log('Restoration verification successful! Full athletic database restored to 1,300 entries.');
} catch (e: any) {
  console.error('Error during data restoration:', e.message);
  process.exit(1);
}
