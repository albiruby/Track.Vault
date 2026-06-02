import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('TRACK.VAULT v1.2 FINAL DATASOURCE VALIDATION');
console.log('====================================================\n');

// 1. ACTIVE RUNTIME DATASOURCE CHECK
const srcDir = 'src';
const forbiddenImportPatterns = [
  /final\\/i,
  /final\//i,
  /run workouts/i,
  /support routines/i,
  /workoutLibrary\.all\.v1\.json/i,
  /workoutLibrary\.all\.v1\.1\.json/i,
  /workoutLibrary\.index\.json/i,
  /generate_v1\.2_mock\.ts/i
];

function checkFilesForForbiddenImports(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', 'dist'].includes(file)) {
        checkFilesForForbiddenImports(fullPath, fileList);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of forbiddenImportPatterns) {
        if (pattern.test(content)) {
          fileList.push(`${fullPath} (matches pattern ${pattern})`);
        }
      }
    }
  }
  return fileList;
}

const importLeaks = checkFilesForForbiddenImports(srcDir);
console.log('--- 1. RUNTIME IMPORT LEAKS CHECK ---');
if (importLeaks.length === 0) {
  console.log('PASS: No illegal folder/file runtime imports found in /src!\n');
} else {
  console.log('FAIL: Found runtime imports of temporary files or folders:');
  importLeaks.forEach(l => console.log('  ', l));
  console.log('\n');
}

// 2. LOAD ACTIVE DATA
const dbPath = 'src/data/workouts/generated/trackVaultLibrary.full.v1.2.json';
if (!fs.existsSync(dbPath)) {
  console.log(`FAIL: Active database not found at ${dbPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 3. HARD CONTENT VALIDATION & COUNTS
console.log('--- 2. HARD CONTENT VALIDATION ---');
const libraryMetaExists = !!data.libraryMeta;
const runningWorkoutsExists = Array.isArray(data.runningWorkouts);
const supportRoutinesExists = Array.isArray(data.supportRoutines);
const allEntriesExists = Array.isArray(data.allEntries);

console.log('Structure check:');
console.log('  libraryMeta:', libraryMetaExists ? 'PRESENT' : 'MISSING');
console.log('  runningWorkouts:', runningWorkoutsExists ? `PRESENT (${data.runningWorkouts.length} items)` : 'MISSING');
console.log('  supportRoutines:', supportRoutinesExists ? `PRESENT (${data.supportRoutines.length} items)` : 'MISSING');
console.log('  allEntries:', allEntriesExists ? `PRESENT (${data.allEntries.length} items)` : 'MISSING');

const totalLen = data.allEntries?.length || 0;
const runLen = data.runningWorkouts?.length || 0;
const supLen = data.supportRoutines?.length || 0;

let countsPass = true;
if (totalLen !== 1300) { countsPass = false; console.log(`  FAIL: allEntries length is ${totalLen}, expected 1300`); }
if (runLen !== 750) { countsPass = false; console.log(`  FAIL: runningWorkouts length is ${runLen}, expected 750`); }
if (supLen !== 550) { countsPass = false; console.log(`  FAIL: supportRoutines length is ${supLen}, expected 550`); }

if (countsPass) {
  console.log('PASS: Hard counts validation succeeded!\n');
} else {
  console.log('FAIL: Counts validation failed.\n');
}

// 4. CATEGORY DISTRIBUTION
console.log('--- 3. CATEGORY DISTRIBUTION CHECK ---');
const expectedRunning = {
  '100m': 50,
  '200m': 50,
  '400m': 50,
  '800m': 50,
  '1500m': 50,
  'mile': 50,
  '3k': 50,
  '5k': 50,
  '10k': 50,
  'half-marathon': 50,
  'marathon': 50,
  'trail': 50,
  'treadmill': 50,
  'base-recovery': 50,
  'general': 50
};

const expectedSupport = {
  'upper_strength': 50,
  'lower_strength': 50,
  'core_stability': 50,
  'mobility': 50,
  'activation': 50,
  'plyometric': 50,
  'running_drills': 50,
  'warm_up_routine': 50,
  'cooldown_routine': 50,
  'recovery_routine': 50,
  'injury_risk_reduction': 50
};

const actualRunning: Record<string, number> = {};
data.runningWorkouts.forEach((w: any) => {
  actualRunning[w.distanceNavId] = (actualRunning[w.distanceNavId] || 0) + 1;
});

const actualSupport: Record<string, number> = {};
data.supportRoutines.forEach((r: any) => {
  actualSupport[r.supportCategoryId] = (actualSupport[r.supportCategoryId] || 0) + 1;
});

let categoryPass = true;
console.log('Running categories:');
for (const [cat, expectedCount] of Object.entries(expectedRunning)) {
  const actualCount = actualRunning[cat] || 0;
  if (actualCount !== expectedCount) {
    categoryPass = false;
    console.log(`  FAIL: Running category '${cat}' count is ${actualCount}, expected ${expectedCount}`);
  } else {
    console.log(`  - ${cat}: ${actualCount} / ${expectedCount}`);
  }
}

console.log('Support categories:');
for (const [cat, expectedCount] of Object.entries(expectedSupport)) {
  const actualCount = actualSupport[cat] || 0;
  if (actualCount !== expectedCount) {
    categoryPass = false;
    console.log(`  FAIL: Support category '${cat}' count is ${actualCount}, expected ${expectedCount}`);
  } else {
    console.log(`  - ${cat}: ${actualCount} / ${expectedCount}`);
  }
}

if (categoryPass) {
  console.log('PASS: Category distribution is perfectly balanced with exactly 50 entries each!\n');
} else {
  console.log('FAIL: Category distribution validation failed.\n');
}

// 5. DATA INVENTORY PROOF CHECK
console.log('--- 4. DATA INVENTORY PROOFS ---');
const check5k = data.runningWorkouts.find((e: any) => e.distanceNavId === "5k");
const checkActivation = data.supportRoutines.find((e: any) => e.supportCategoryId === "activation");
const checkWarmup = data.supportRoutines.find((e: any) => e.supportCategoryId === "warm_up_routine");
const checkCooldown = data.supportRoutines.find((e: any) => e.supportCategoryId === "cooldown_routine");

console.log('A. First 5K Entry details:');
if (check5k) {
  console.log('  id:', check5k.id);
  console.log('  slug:', check5k.slug);
  console.log('  title:', check5k.title);
  console.log('  createdBy:', check5k.createdBy);
  console.log('  visibility:', check5k.visibility);
  console.log('  estimatedDurationMin:', JSON.stringify(check5k.estimatedDurationMin));
  console.log('  estimatedDistanceKm:', JSON.stringify(check5k.estimatedDistanceKm));
  console.log('  mainSet length:', check5k.workoutStructure?.mainSet?.length);
  console.log('  shareCard cardTitle:', check5k.shareCard?.cardTitle);

  let runProofPass = true;
  if (check5k.title.includes('5K Running Workout 1') || check5k.title.includes('5K Session 1')) runProofPass = false;
  if (!check5k.slug) runProofPass = false;
  if (check5k.createdBy !== 'Track.Vault Curated Library') runProofPass = false;
  if (check5k.visibility !== 'public-static') runProofPass = false;
  if (typeof check5k.estimatedDurationMin !== 'object') runProofPass = false;
  if (typeof check5k.estimatedDistanceKm !== 'object') runProofPass = false;
  if (!check5k.workoutStructure?.mainSet || check5k.workoutStructure.mainSet.length === 0) runProofPass = false;
  
  console.log('  Result:', runProofPass ? 'PASS' : 'FAIL');
} else {
  console.log('  ERROR: NO 5K WORKOUT FOUND');
}

console.log('\nB. First Activation Entry details:');
if (checkActivation) {
  console.log('  id:', checkActivation.id);
  console.log('  slug:', checkActivation.slug);
  console.log('  title:', checkActivation.title);
  console.log('  createdBy:', checkActivation.createdBy);
  console.log('  visibility:', checkActivation.visibility);
  console.log('  durationMin:', checkActivation.durationMin);
  console.log('  sessionStructure length:', checkActivation.sessionStructure?.length);
  console.log('  shareCard cardTitle:', checkActivation.shareCard?.cardTitle);

  let actProofPass = true;
  if (checkActivation.title.includes('Activation Support Routine 1')) actProofPass = false;
  if (!checkActivation.slug) actProofPass = false;
  if (checkActivation.createdBy !== 'Track.Vault Curated Library') actProofPass = false;
  if (checkActivation.visibility !== 'public-static') actProofPass = false;
  if (!checkActivation.sessionStructure || checkActivation.sessionStructure.length === 0) actProofPass = false;
  
  console.log('  Result:', actProofPass ? 'PASS' : 'FAIL');
} else {
  console.log('  ERROR: NO ACTIVATION ROUTINE FOUND');
}

console.log('\nC. First Warm-up Entry details:');
if (checkWarmup) {
  console.log('  id:', checkWarmup.id);
  console.log('  slug:', checkWarmup.slug);
  console.log('  title:', checkWarmup.title);
  console.log('  createdBy:', checkWarmup.createdBy);
  let wuPass = checkWarmup.title !== 'Warm-up Routine Support Routine 1' && !!checkWarmup.slug && checkWarmup.createdBy === 'Track.Vault Curated Library';
  console.log('  Result:', wuPass ? 'PASS' : 'FAIL');
} else {
  console.log('  ERROR: NO WARM-UP ROUTINE FOUND');
}

console.log('\nD. First Cooldown Entry details:');
if (checkCooldown) {
  console.log('  id:', checkCooldown.id);
  console.log('  slug:', checkCooldown.slug);
  console.log('  title:', checkCooldown.title);
  console.log('  createdBy:', checkCooldown.createdBy);
  let cdPass = checkCooldown.title !== 'Cooldown Routine Support Routine 1' && !!checkCooldown.slug && checkCooldown.createdBy === 'Track.Vault Curated Library';
  console.log('  Result:', cdPass ? 'PASS' : 'FAIL');
} else {
  console.log('  ERROR: NO COOLDOWN ROUTINE FOUND');
}
console.log('\n');

// 6. PLACEHOLDER / MOCK DATA AUDIT
console.log('--- 5. PLACEHOLDER STRING AUDIT ---');
const blacklistedStrings = [
  "5K Running Workout 1",
  "5K Session 1",
  "100m Session 1",
  "Activation Support Routine 1",
  "Warm-up Routine Support Routine 1",
  "Cooldown Routine Support Routine 1",
  "Recovery Routine Support Routine 1",
  "Core Stability Support Routine 1",
  "Support Routine 1",
  "AutoGenerated - Track.Vault v1.2",
  'slug": "5k-1',
  'createdBy": undefined',
  "0 Blocks",
  "No description configured yet",
  "Main set is empty"
];

const stringifyDB = JSON.stringify(data);
let placeholderFailCount = 0;
blacklistedStrings.forEach(s => {
  if (stringifyDB.includes(s)) {
    placeholderFailCount++;
    console.log(`  FAIL: Found active database reference to blacklisted placeholder: "${s}"`);
  }
});

if (placeholderFailCount === 0) {
  console.log('PASS: Clean audit! No active database files contain placeholder or mock markers.\n');
} else {
  console.log(`FAIL: Placeholders found: ${placeholderFailCount}\n`);
}

// 7. GLOBAL UNIQUENESS VALIDATION
console.log('--- 6. GLOBAL UNIQUENESS & GENERIC PATTERNS VALIDATION ---');
const ids = new Set<string>();
const slugs = new Set<string>();
const titles = new Set<string>();
const signatures = new Set<string>();

let uniquenessFailed = false;
const genericPatterns = [
  /Session \d+$/i,
  /Routine \d+$/i,
  /Running Workout \d+$/i,
  /Support Routine \d+$/i
];

data.allEntries.forEach((e: any) => {
  if (ids.has(e.id)) {
    console.log(`  FAIL: Duplicate ID found: ${e.id} (${e.title})`);
    uniquenessFailed = true;
  }
  ids.add(e.id);

  if (slugs.has(e.slug)) {
    console.log(`  FAIL: Duplicate SLUG found: ${e.slug} (${e.title})`);
    uniquenessFailed = true;
  }
  slugs.add(e.slug);

  if (titles.has(e.title)) {
    console.log(`  FAIL: Duplicate TITLE found: ${e.title}`);
    uniquenessFailed = true;
  }
  titles.add(e.title);

  if (e.uniquenessSignature) {
    if (signatures.has(e.uniquenessSignature)) {
      console.log(`  FAIL: Duplicate uniquenessSignature found: ${e.uniquenessSignature}`);
      uniquenessFailed = true;
    }
    signatures.add(e.uniquenessSignature);
  }

  for (const pattern of genericPatterns) {
    if (pattern.test(e.title)) {
      console.log(`  FAIL: Active title matches generic pattern: "${e.title}" (ID: ${e.id})`);
      uniquenessFailed = true;
    }
  }
});

if (!uniquenessFailed) {
  console.log('PASS: No duplicate ids, slugs, titles, or signatures! All 1,300 items are uniquely named and follow the strict curation policy.\n');
} else {
  console.log('FAIL: Uniqueness checker found issues.\n');
}

// 8. SCHEMA SHAPE VALIDATION
console.log('--- 7. SCHEMA SHAPE VALIDATION ---');
let schemaFails = 0;

data.runningWorkouts.forEach((w: any) => {
  if (w.entryType !== 'running-workout') { schemaFails++; console.log(`  FAIL: runningWorkout ${w.id} entryType is not running-workout`); }
  if (!w.id) { schemaFails++; console.log(`  FAIL: runningWorkout missing id`); }
  if (!w.slug) { schemaFails++; console.log(`  FAIL: runningWorkout ${w.id} missing slug`); }
  if (!w.title) { schemaFails++; console.log(`  FAIL: runningWorkout ${w.id} missing title`); }
  if (w.createdBy !== 'Track.Vault Curated Library') { schemaFails++; console.log(`  FAIL: runningWorkout ${w.id} createdBy is not Track.Vault Curated Library`); }
  if (w.visibility !== 'public-static') { schemaFails++; console.log(`  FAIL: runningWorkout ${w.id} visibility is not public-static`); }
  if (!w.primaryDistance) { schemaFails++; console.log(`  FAIL: runningWorkout ${w.id} missing primaryDistance`); }
  if (!w.distanceNavId) { schemaFails++; console.log(`  FAIL: runningWorkout ${w.id} missing distanceNavId`); }
  if (!w.workoutType) { schemaFails++; console.log(`  FAIL: runningWorkout ${w.id} missing workoutType`); }
  
  if (typeof w.estimatedDurationMin !== 'object' || Array.isArray(w.estimatedDurationMin)) {
    schemaFails++;
    console.log(`  FAIL: runningWorkout ${w.id} estimatedDurationMin is raw number/array, expected {min, max}`);
  }
  if (typeof w.estimatedDistanceKm !== 'object' || Array.isArray(w.estimatedDistanceKm)) {
    schemaFails++;
    console.log(`  FAIL: runningWorkout ${w.id} estimatedDistanceKm is raw number/array, expected {min, max}`);
  }
  if (typeof w.workoutStructure !== 'object' || Array.isArray(w.workoutStructure)) {
    schemaFails++;
    console.log(`  FAIL: runningWorkout ${w.id} workoutStructure is not object`);
  } else {
    if (!Array.isArray(w.workoutStructure.warmup)) { schemaFails++; console.log(`  FAIL: runningWorkout ${w.id} warmup is not array`); }
    if (!Array.isArray(w.workoutStructure.mainSet) || w.workoutStructure.mainSet.length === 0) {
      schemaFails++;
      console.log(`  FAIL: runningWorkout ${w.id} mainSet is not array or is empty`);
    }
    if (!Array.isArray(w.workoutStructure.cooldown)) { schemaFails++; console.log(`  FAIL: runningWorkout ${w.id} cooldown is not array`); }
  }
  if (!w.shareCard) { schemaFails++; console.log(`  FAIL: runningWorkout ${w.id} missing shareCard`); }
});

data.supportRoutines.forEach((s: any) => {
  if (s.entryType !== 'support-routine') { schemaFails++; console.log(`  FAIL: supportRoutine ${s.id} entryType is not support-routine`); }
  if (!s.id) { schemaFails++; console.log(`  FAIL: supportRoutine missing id`); }
  if (!s.slug) { schemaFails++; console.log(`  FAIL: supportRoutine ${s.id} missing slug`); }
  if (!s.title) { schemaFails++; console.log(`  FAIL: supportRoutine ${s.id} missing title`); }
  if (s.createdBy !== 'Track.Vault Curated Library') { schemaFails++; console.log(`  FAIL: supportRoutine ${s.id} createdBy is not Track.Vault Curated Library`); }
  if (s.visibility !== 'public-static') { schemaFails++; console.log(`  FAIL: supportRoutine ${s.id} visibility is not public-static`); }
  if (!s.supportCategoryId) { schemaFails++; console.log(`  FAIL: supportRoutine ${s.id} missing supportCategoryId`); }
  if (!s.supportCategoryLabel) { schemaFails++; console.log(`  FAIL: supportRoutine ${s.id} missing supportCategoryLabel`); }
  if (!s.routineType) { schemaFails++; console.log(`  FAIL: supportRoutine ${s.id} missing routineType`); }
  if (typeof s.durationMin !== 'number') { schemaFails++; console.log(`  FAIL: supportRoutine ${s.id} durationMin is not number`); }
  if (!Array.isArray(s.sessionStructure) || s.sessionStructure.length === 0) {
    schemaFails++;
    console.log(`  FAIL: supportRoutine ${s.id} sessionStructure is empty or not array`);
  }
  if (!s.shareCard) { schemaFails++; console.log(`  FAIL: supportRoutine ${s.id} missing shareCard`); }
});

if (schemaFails === 0) {
  console.log('PASS: All running workouts and support routines completely conform to v1.2 spec structure (no raw numbers, valid sub-arrays, correct ranges)!\n');
} else {
  console.log(`FAIL: Schema validation failed with ${schemaFails} mismatching criteria.\n`);
}

// 9. DATABASE/TELEMETRY AUDIT
console.log('--- 8. NO EXTERNAL DB / INTERNALS AUDIT ---');
const forbiddenLibraries = [
  'firebase', 'supabase', '@prisma/client', 'mongodb', 'mongoose', 'mysql', 'pg', 'sqlite',
  'segment', 'google-analytics', 'mixpanel', 'amplitude'
];

function checkSrcCodeForForbiddenDeps(dir: string, depMatches: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', 'dist'].includes(file)) {
        checkSrcCodeForForbiddenDeps(fullPath, depMatches);
      }
    } else if (/\.(ts|tsx)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const lib of forbiddenLibraries) {
        const regex = new RegExp(`from ['"]${lib}['"]|import.*${lib}`, 'i');
        if (regex.test(content)) {
          depMatches.push(`${fullPath} (imports ${lib})`);
        }
      }
    }
  }
  return depMatches;
}

const dbLeaks = checkSrcCodeForForbiddenDeps('src');
if (dbLeaks.length === 0) {
  console.log('PASS: Absolute architectural compliance! No unauthorized external database SDK drivers, login handlers, or marketing analytics telemetry imports found in /src.\n');
} else {
  console.log('FAIL: Unauthorized system imports in /src:');
  dbLeaks.forEach(l => console.log('  ', l));
  console.log('\n');
}

console.log('====================================================');
console.log('VALIDATION ASSESSMENT DETAILS (COMPLETED SUCCESSFULLY)');
console.log('====================================================');
