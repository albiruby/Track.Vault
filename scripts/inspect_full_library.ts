import fs from 'fs';

const files = [
  'src/data/workouts/generated/trackVaultLibrary.full.v1.2.json',
  'src/data/workouts/generated/runningWorkoutLibrary.all.v1.2.json',
  'src/data/workouts/generated/supportRoutineLibrary.all.v1.2.json',
  'src/data/workouts/workoutLibrary.index.v1.2.json'
];

console.log('=== STEP 1: VALIDATING ACTIVE JSON FILES ===');
let success = true;
for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    JSON.parse(content);
    console.log(`PASS JSON: ${file}`);
  } catch (e: any) {
    console.error(`FAIL JSON: ${file}`);
    console.error(e.message);
    success = false;
  }
}

if (!success) {
  process.exit(1);
}

console.log('\n=== STEP 2: VALIDATING DATA COUNTS ===');
const fullPath = 'src/data/workouts/generated/trackVaultLibrary.full.v1.2.json';
const db = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

const running = Array.isArray(db.runningWorkouts) ? db.runningWorkouts : [];
const support = Array.isArray(db.supportRoutines) ? db.supportRoutines : [];
const all = Array.isArray(db.allEntries) ? db.allEntries : [...running, ...support];

console.log({
  running: running.length,
  support: support.length,
  all: all.length,
  firstRunningId: running[0]?.id,
  firstRunningTitle: running[0]?.title,
  firstSupportId: support[0]?.id,
  firstSupportTitle: support[0]?.title
});

if (running.length !== 750) throw new Error(`runningWorkouts count must be 750 (got ${running.length})`);
if (support.length !== 550) throw new Error(`supportRoutines count must be 550 (got ${support.length})`);
if (all.length !== 1300) throw new Error(`allEntries count must be 1300 (got ${all.length})`);
console.log('PASS: Data counts are correct!');

console.log('\n=== STEP 3: VALIDATING CATEGORY COUNTS ===');
const runningIds = [
  '100m', '200m', '400m', '800m', '1500m', 'mile', '3k', '5k', '10k',
  'half-marathon', 'marathon', 'trail', 'treadmill', 'base-recovery', 'general'
];

const supportIds = [
  'upper_strength', 'lower_strength', 'core_stability', 'mobility', 'activation',
  'plyometric', 'running_drills', 'warm_up_routine', 'cooldown_routine',
  'recovery_routine', 'injury_risk_reduction'
];

console.log('RUNNING COUNTS:');
for (const id of runningIds) {
  const count = running.filter((e: any) => e.distanceNavId === id).length;
  console.log(` - ${id}: ${count}`);
  if (count !== 50) throw new Error(`Running category ${id} must be 50, got ${count}`);
}

console.log('\nSUPPORT COUNTS:');
for (const id of supportIds) {
  const count = support.filter((e: any) => e.supportCategoryId === id).length;
  console.log(` - ${id}: ${count}`);
  if (count !== 50) throw new Error(`Support category ${id} must be 50, got ${count}`);
}

console.log('\nCATEGORY COUNTS OK: All categories have exactly 50 entries!');
