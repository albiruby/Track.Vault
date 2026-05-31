import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const WORKOUT_DIR = path.join(ROOT, "src/data/workouts");
const INDEX_PATH = path.join(WORKOUT_DIR, "workoutLibrary.index.json");
const COMBINED_PATH = path.join(WORKOUT_DIR, "generated/workoutLibrary.all.v1.json");

const DISTANCE_NAV = [
  { id: "100m", label: "100m", order: 1, primaryDistances: ["100m"] },
  { id: "200m", label: "200m", order: 2, primaryDistances: ["200m"] },
  { id: "400m", label: "400m", order: 3, primaryDistances: ["400m"] },
  { id: "800m", label: "800m", order: 4, primaryDistances: ["800m"] },
  { id: "1500m", label: "1500m", order: 5, primaryDistances: ["1500m"] },
  { id: "mile", label: "Mile", order: 6, primaryDistances: ["Mile"] },
  { id: "3k", label: "3K", order: 7, primaryDistances: ["3K"] },
  { id: "5k", label: "5K", order: 8, primaryDistances: ["5K"] },
  { id: "10k", label: "10K", order: 9, primaryDistances: ["10K"] },
  { id: "half-marathon", label: "Half Marathon", order: 10, primaryDistances: ["Half Marathon"] },
  { id: "marathon", label: "Marathon", order: 11, primaryDistances: ["Marathon"] },
  { id: "trail", label: "Trail", order: 12, primaryDistances: ["Trail"] },
  { id: "treadmill", label: "Treadmill", order: 13, primaryDistances: ["Treadmill"] },
  { id: "base-recovery", label: "Base / Recovery", order: 14, primaryDistances: ["Base", "Recovery"] },
  { id: "general", label: "General", order: 15, primaryDistances: ["General"] },
];

const navById = new Map(DISTANCE_NAV.map((item) => [item.id, item]));
const requiredFields = [
  "id", "slug", "title", "shortTitle", "summary", "targetDistances", "primaryDistance", "category", "trainingGoals", "level", "phase", "surface", "equipment", "estimatedDurationMin", "estimatedDistanceKm", "qualityDistanceKm", "difficulty", "risk", "riskReason", "intensityGuide", "workoutStructure", "variants", "coachingNotes", "commonMistakes", "safetyNotes", "shareCard", "tags", "searchKeywords", "uniquenessSignature", "createdBy", "visibility", "sourceNote", "libraryCategoryId", "libraryCategoryLabel", "workoutType", "distanceNavId", "distanceNavLabel", "distanceSortOrder"
];

function readJson(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fail(errors: string[], message: string) {
  errors.push(message);
}

function main() {
  const errors: string[] = [];
  const index = readJson(INDEX_PATH);
  const allWorkouts: any[] = [];
  const seen = {
    id: new Map<string, string>(),
    slug: new Map<string, string>(),
    title: new Map<string, string>(),
    uniquenessSignature: new Map<string, string>(),
  };

  for (const category of index.categories) {
    const categoryPath = path.join(WORKOUT_DIR, category.file);
    if (!fs.existsSync(categoryPath)) {
      fail(errors, `Missing category file: ${category.file}`);
      continue;
    }
    const data = readJson(categoryPath);
    const workouts = data.workouts || [];
    if (data.categoryMeta.categoryId !== category.categoryId) fail(errors, `Category id mismatch: ${category.file}`);
    if (data.categoryMeta.targetWorkoutCount !== category.targetWorkoutCount) fail(errors, `Target count mismatch: ${category.file}`);
    if (data.categoryMeta.actualWorkoutCount !== workouts.length) fail(errors, `actualWorkoutCount mismatch: ${category.file}`);

    for (const workout of workouts) {
      allWorkouts.push(workout);
      for (const field of requiredFields) {
        if (!(field in workout)) fail(errors, `Missing ${field}: ${workout.id || workout.title || category.file}`);
      }
      if (!Array.isArray(workout.workoutStructure?.warmup) || !Array.isArray(workout.workoutStructure?.mainSet) || !Array.isArray(workout.workoutStructure?.cooldown)) {
        fail(errors, `Missing warmup/mainSet/cooldown arrays: ${workout.id}`);
      }
      if (!workout.variants?.easier || !workout.variants?.harder) fail(errors, `Missing variants: ${workout.id}`);
      if (workout.libraryCategoryId !== data.categoryMeta.categoryId) fail(errors, `libraryCategoryId mismatch: ${workout.id}`);
      if (workout.libraryCategoryLabel !== data.categoryMeta.categoryLabel) fail(errors, `libraryCategoryLabel mismatch: ${workout.id}`);
      if (workout.workoutType !== workout.category) fail(errors, `workoutType must equal category: ${workout.id}`);
      const nav = navById.get(workout.distanceNavId);
      if (!nav) fail(errors, `Invalid distanceNavId ${workout.distanceNavId}: ${workout.id}`);
      else {
        if (workout.distanceNavLabel !== nav.label) fail(errors, `distanceNavLabel mismatch: ${workout.id}`);
        if (workout.distanceSortOrder !== nav.order) fail(errors, `distanceSortOrder mismatch: ${workout.id}`);
      }

      for (const key of Object.keys(seen) as Array<keyof typeof seen>) {
        const value = workout[key];
        if (seen[key].has(value)) fail(errors, `Duplicate ${key}: ${value}`);
        else seen[key].set(value, workout.id);
      }
    }
  }

  const combined = readJson(COMBINED_PATH);
  if ((combined.workouts || []).length !== allWorkouts.length) fail(errors, `Combined count mismatch: ${combined.workouts?.length} vs ${allWorkouts.length}`);
  if (allWorkouts.length !== 360) fail(errors, `Total workout count must be 360, got ${allWorkouts.length}`);

  const counts = new Map<string, number>();
  for (const workout of allWorkouts) counts.set(workout.distanceNavId, (counts.get(workout.distanceNavId) || 0) + 1);
  const navCounts = new Map((index.distanceNavigation || []).map((item: any) => [item.id, item.actualWorkoutCount]));
  if (navCounts.get("all") !== allWorkouts.length) fail(errors, `distanceNavigation all count mismatch`);
  for (const nav of DISTANCE_NAV) {
    const expected = counts.get(nav.id) || 0;
    if (navCounts.get(nav.id) !== expected) fail(errors, `distanceNavigation count mismatch for ${nav.id}: expected ${expected}, got ${navCounts.get(nav.id)}`);
  }

  if (errors.length) {
    console.error(`Track.Vault validation failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log("Track.Vault workout library v1.1 NAV_READY validation passed.");
  console.log(`Total workouts: ${allWorkouts.length}`);
  console.log("Distance navigation counts:");
  for (const item of index.distanceNavigation || []) console.log(`- ${item.label}: ${item.actualWorkoutCount}`);
}

main();
