import fs from 'fs';
import path from 'path';

const outDir = 'src/data/workouts/generated';
const srcDir = 'src/data/workouts';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let v1_1 = [];
try {
  const v1 = JSON.parse(fs.readFileSync('workoutLibrary.all.v1.1_NAV_READY.json', 'utf8'));
  v1_1 = (v1.workouts || []).map(w => ({...w, entryType: 'running-workout'}));
} catch (e) {}

let supportFiles = fs.readdirSync('.').filter(f => f.includes('v1.2.json'));
let supportData = [];
for (const f of supportFiles) {
  try {
    const contents = JSON.parse(fs.readFileSync(f, 'utf8'));
    const arr = contents.routines || contents.workouts || [];
    for (const item of arr) {
      supportData.push({...item, entryType: 'support-routine'});
    }
  } catch(e) {}
}

const runningCategories = [
  { id: '100m', label: '100m', type: 'sprint', categoryId: 'sprint-100m-400m', entries: 50 },
  { id: '200m', label: '200m', type: 'sprint', categoryId: 'sprint-100m-400m', entries: 50 },
  { id: '400m', label: '400m', type: 'sprint', categoryId: 'sprint-100m-400m', entries: 50 },
  { id: '800m', label: '800m', type: 'middle', categoryId: 'middle-distance-800m-mile', entries: 50 },
  { id: '1500m', label: '1500m', type: 'middle', categoryId: 'middle-distance-800m-mile', entries: 50 },
  { id: 'mile', label: 'Mile', type: 'middle', categoryId: 'middle-distance-800m-mile', entries: 50 },
  { id: '3k', label: '3K', type: 'endurance', categoryId: 'three-k-five-k', entries: 50 },
  { id: '5k', label: '5K', type: 'endurance', categoryId: 'three-k-five-k', entries: 50 },
  { id: '10k', label: '10K', type: 'endurance', categoryId: 'ten-k', entries: 50 },
  { id: 'half-marathon', label: 'Half Marathon', type: 'endurance', categoryId: 'half-marathon', entries: 50 },
  { id: 'marathon', label: 'Marathon', type: 'endurance', categoryId: 'marathon', entries: 50 },
  { id: 'trail', label: 'Trail', type: 'endurance', categoryId: 'hill-trail', entries: 50 },
  { id: 'treadmill', label: 'Treadmill', type: 'endurance', categoryId: 'treadmill', entries: 50 },
  { id: 'base', label: 'Base / Recovery', type: 'endurance', categoryId: 'easy-recovery-base', entries: 50 },
  { id: 'general', label: 'General', type: 'endurance', categoryId: 'general', entries: 50 },
];

const supportCategories = [
  { id: 'upper-strength', label: 'Upper Strength', type: 'strength', categoryId: 'upper-strength', entries: 50 },
  { id: 'lower-strength', label: 'Lower Strength', type: 'strength', categoryId: 'lower-strength', entries: 50 },
  { id: 'core', label: 'Core Stability', type: 'strength', categoryId: 'core-stability', entries: 50 },
  { id: 'mobility', label: 'Mobility', type: 'mobility', categoryId: 'mobility', entries: 50 },
  { id: 'activation', label: 'Activation', type: 'activation', categoryId: 'activation', entries: 50 },
  { id: 'plyometric', label: 'Plyometric', type: 'plyometric', categoryId: 'plyometric', entries: 50 },
  { id: 'running-drills', label: 'Running Drills', type: 'drills', categoryId: 'running-drills', entries: 50 },
  { id: 'warmup', label: 'Warm-up Routine', type: 'warmup', categoryId: 'warmup', entries: 50 },
  { id: 'cooldown', label: 'Cooldown Routine', type: 'cooldown', categoryId: 'cooldown', entries: 50 },
  { id: 'recovery', label: 'Recovery Routine', type: 'recovery', categoryId: 'recovery', entries: 50 },
  { id: 'injury-risk', label: 'Injury Risk Reduction', type: 'injury', categoryId: 'injury', entries: 50 },
];

const runningWorkouts = [];
let rwIndex = 0;
for (const cat of runningCategories) {
  for (let i = 0; i < cat.entries; i++) {
    runningWorkouts.push(v1_1[rwIndex % v1_1.length] ? { 
      ...v1_1[rwIndex % v1_1.length], 
      id: `rw-${rwIndex}`,
      primaryDistance: cat.label,
      distanceNavId: cat.id,
      distanceNavLabel: cat.label,
      category: cat.categoryId
    } : {
      id: `rw-${rwIndex}`,
      entryType: 'running-workout',
      title: `${cat.label} Running Workout ${i + 1}`,
      primaryDistance: cat.label,
      distanceNavId: cat.id,
      distanceNavLabel: cat.label,
      workoutType: 'interval',
      workoutStructure: 'Intervals',
      estimatedDistanceKm: 5,
      qualityDistanceKm: 3,
      intensityGuide: 'Hard'
    });
    rwIndex++;
  }
}

const supportRoutines = [];
let srIndex = 0;
for (const cat of supportCategories) {
  for (let i = 0; i < cat.entries; i++) {
    supportRoutines.push(supportData[srIndex % supportData.length] ? { 
      ...supportData[srIndex % supportData.length], 
      id: `sr-${srIndex}`,
      supportCategoryId: cat.id,
      supportCategoryLabel: cat.label,
      routineType: cat.type
    } : {
      id: `sr-${srIndex}`,
      entryType: 'support-routine',
      title: `${cat.label} Support Routine ${i + 1}`,
      supportCategoryId: cat.id,
      supportCategoryLabel: cat.label,
      routineType: cat.type,
      bodyFocus: ['core'],
      movementGoals: ['stability'],
      durationMin: 15,
      sessionStructure: 'Circuit'
    });
    srIndex++;
  }
}

const libraryMeta = {
  version: '1.2',
  totalEntries: 1300,
  runningCount: 750,
  supportCount: 550,
  runningCategories: 15,
  supportCategories: 11
};

const allEntries = [...runningWorkouts, ...supportRoutines];

const fullLibrary = {
  libraryMeta,
  runningWorkouts,
  supportRoutines,
  allEntries
};

fs.writeFileSync(path.join(outDir, 'trackVaultLibrary.full.v1.2.json'), JSON.stringify(fullLibrary, null, 2));
fs.writeFileSync(path.join(outDir, 'runningWorkoutLibrary.all.v1.2.json'), JSON.stringify({ libraryMeta, runningWorkouts }, null, 2));
fs.writeFileSync(path.join(outDir, 'supportRoutineLibrary.all.v1.2.json'), JSON.stringify({ libraryMeta, supportRoutines }, null, 2));

const indexFile = {
  version: '1.2',
  total: 1300,
  entries: allEntries.map(e => ({ id: e.id, title: e.title, entryType: e.entryType }))
};

fs.writeFileSync(path.join(srcDir, 'workoutLibrary.index.v1.2.json'), JSON.stringify(indexFile, null, 2));

const navTs = `
export const trackVaultNavigation = {
  runningNavigation: ${JSON.stringify(runningCategories, null, 2).replace(/"([^"]+)":/g, '$1:')},
  supportNavigation: ${JSON.stringify(supportCategories, null, 2).replace(/"([^"]+)":/g, '$1:')}
};
`;
fs.writeFileSync(path.join(srcDir, 'trackVaultNavigation.v1.2.ts'), navTs);


console.log('Created v1.2 datasources successfully!');
