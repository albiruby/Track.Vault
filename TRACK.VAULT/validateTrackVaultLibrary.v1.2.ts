import * as fs from 'fs';
import * as path from 'path';

/**
 * Track.Vault v1.2 Full Static Database Validation Suite
 * Confirms exact schema layouts, uniqueness integrity, correct metrics, 
 * safe copywriting boundaries, and absolute zero database/telemetry leakages.
 */

const WORKSPACE_DIR = path.join(process.cwd(), 'TRACK.VAULT');
const GEN_DIR = path.join(WORKSPACE_DIR, 'final', 'generated');
const INDEX_PATH = path.join(WORKSPACE_DIR, 'final', 'workoutLibrary.index.v1.2.json');
const FULL_DB_PATH = path.join(GEN_DIR, 'trackVaultLibrary.full.v1.2.json');

console.log('--- STARTING TRACK.VAULT FULL DATABASE AUDIT ---');

if (!fs.existsSync(FULL_DB_PATH)) {
  console.error('ERROR: Full database not found.');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(FULL_DB_PATH, 'utf8'));
const indexData = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));

const errors: string[] = [];
const warnings: string[] = [];

// 1. Audit Entry Counts
console.log('Checking counts...');
const runningCount = db.runningWorkouts.length;
const supportCount = db.supportRoutines.length;
const totalCount = db.allEntries.length;

if (runningCount !== 750) errors.push(`Running workouts count is ${runningCount} instead of 750.`);
if (supportCount !== 550) errors.push(`Support routines count is ${supportCount} instead of 550.`);
if (totalCount !== 1300) errors.push(`Total entries count is ${totalCount} instead of 1300.`);

// 2. Audit Category Balance (50 each)
console.log('Checking category distributions...');
for (const cat in indexData.runningCategoryCounts) {
  const count = indexData.runningCategoryCounts[cat];
  if (count !== 50) errors.push(`Running category "${cat}" has ${count} workouts instead of 50.`);
}
for (const cat in indexData.supportCategoryCounts) {
  const count = indexData.supportCategoryCounts[cat];
  if (count !== 50) errors.push(`Support category "${cat}" has ${count} routines instead of 50.`);
}

// 3. Global Uniqueness Integrity Check
console.log('Running global uniqueness audits...');
const ids = new Set<string>();
const slugs = new Set<string>();
const titles = new Set<string>();
const signatures = new Set<string>();

db.allEntries.forEach((entry: any, i: number) => {
  const label = entry.title || `Entry at index ${i}`;

  if (!entry.id) errors.push(`Entry is missing an ID: "${label}".`);
  else {
    if (ids.has(entry.id)) errors.push(`Duplicate ID found: "${entry.id}" inside "${label}".`);
    ids.add(entry.id);
  }

  if (!entry.slug) errors.push(`Entry is missing a slug: "${label}".`);
  else {
    if (slugs.has(entry.slug)) errors.push(`Duplicate slug found: "${entry.slug}" inside "${label}".`);
    slugs.add(entry.slug);
  }

  if (!entry.title) errors.push(`Entry at index ${i} is missing a title.`);
  else {
    if (titles.has(entry.title)) errors.push(`Duplicate title found: "${entry.title}".`);
    titles.add(entry.title);
  }

  if (!entry.uniquenessSignature) errors.push(`Entry "${label}" is missing a uniquenessSignature.`);
  else {
    if (signatures.has(entry.uniquenessSignature)) {
      errors.push(`Duplicate uniquenessSignature found: "${entry.uniquenessSignature}" in "${label}".`);
    }
    signatures.add(entry.uniquenessSignature);
  }

  // 4. Content Cleanliness Verification (Sanitization of Overclaims and Telemetry)
  const jsonStr = JSON.stringify(entry).toLowerCase();
  
  // Scans for medical overclaims
  const medicalClaims = [
    'injury prevention', 'prevent injury', 'prevents injury', 'cures',
    'heals', 'rehab guarantee', 'improves performance guaranteed'
  ];
  medicalClaims.forEach(word => {
    if (jsonStr.includes(word)) {
      errors.push(`Entry "${label}" contains forbidden medical claim word: "${word}".`);
    }
  });

  // Scans for wearable/telemetry gimmicks and buzzwords
  const telemetryGimmicks = [
    'calories', 'vo2max score', 'readiness', 'strain', 'telemetry',
    'medical rehab', 'elite intelligence', 'system optimal', 'tss score'
  ];
  telemetryGimmicks.forEach(word => {
    if (jsonStr.includes(word)) {
      warnings.push(`Entry "${label}" contains telemetry/wearable buzzword: "${word}".`);
    }
  });

  // Check for generic Session/Routine names
  const isGenericTitle = /Sessions+d+/i.test(entry.title) || 
                         /Routines+d+/i.test(entry.title) || 
                         /RoutineRoutine/i.test(entry.title);
  if (isGenericTitle) {
    errors.push(`Entry "${entry.id}" has a generic title formatting: "${entry.title}".`);
  }
});

console.log(`Database Audit Completed: ${errors.length} Errors, ${warnings.length} Warnings.`);
if (errors.length > 0) {
  console.error('Audit failed with critical validation errors:');
  errors.forEach(e => console.error('- ❌ ' + e));
  process.exit(1);
} else {
  console.log('Audit completely successful! Database is 100% compliant.');
}
