import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "src", "data", "workouts");
const indexPath = path.join(root, "workoutLibrary.index.json");

const requiredWorkoutFields = [
  "id","slug","title","shortTitle","summary","targetDistances","primaryDistance","category","trainingGoals",
  "level","phase","surface","equipment","estimatedDurationMin","estimatedDistanceKm","qualityDistanceKm",
  "difficulty","risk","riskReason","intensityGuide","workoutStructure","variants","coachingNotes","commonMistakes",
  "safetyNotes","shareCard","tags","searchKeywords","uniquenessSignature","createdBy","visibility","sourceNote"
];

const allowedLevels = new Set(["beginner","recreational","developing","intermediate","advanced","competitive","elite-reference"]);
const allowedDifficulty = new Set(["easy","moderate","moderate-hard","hard","very-hard"]);
const allowedRisk = new Set(["low","medium","high","very-high"]);

function readJson(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assert(condition: boolean, message: string, errors: string[]) {
  if (!condition) errors.push(message);
}

function main() {
  const errors: string[] = [];
  assert(fs.existsSync(indexPath), `Missing index file: ${indexPath}`, errors);
  if (errors.length) throw new Error(errors.join("\n"));

  const index = readJson(indexPath);
  const seen = {
    id: new Map<string, string>(),
    slug: new Map<string, string>(),
    title: new Map<string, string>(),
    uniquenessSignature: new Map<string, string>()
  };

  let total = 0;

  for (const cat of index.categories) {
    const filePath = path.join(root, cat.file);
    assert(fs.existsSync(filePath), `Missing category file: ${cat.file}`, errors);
    if (!fs.existsSync(filePath)) continue;

    const categoryFile = readJson(filePath);
    const meta = categoryFile.categoryMeta;
    const workouts = categoryFile.workouts ?? [];

    assert(meta.categoryId === cat.categoryId, `categoryId mismatch in ${cat.file}`, errors);
    assert(meta.targetWorkoutCount === cat.targetWorkoutCount, `targetWorkoutCount mismatch in ${cat.file}`, errors);
    assert(meta.actualWorkoutCount === workouts.length, `actualWorkoutCount mismatch in ${cat.file}`, errors);
    assert(workouts.length === cat.targetWorkoutCount, `workout count mismatch in ${cat.file}`, errors);

    for (const workout of workouts) {
      total++;
      for (const field of requiredWorkoutFields) {
        assert(Object.prototype.hasOwnProperty.call(workout, field), `Missing ${field} in ${cat.file} :: ${workout.id ?? "NO_ID"}`, errors);
      }

      assert(allowedLevels.has(workout.level), `Invalid level in ${workout.id}: ${workout.level}`, errors);
      assert(allowedDifficulty.has(workout.difficulty), `Invalid difficulty in ${workout.id}: ${workout.difficulty}`, errors);
      assert(allowedRisk.has(workout.risk), `Invalid risk in ${workout.id}: ${workout.risk}`, errors);

      assert(Array.isArray(workout.workoutStructure?.warmup) && workout.workoutStructure.warmup.length > 0, `Missing warmup in ${workout.id}`, errors);
      assert(Array.isArray(workout.workoutStructure?.mainSet) && workout.workoutStructure.mainSet.length > 0, `Missing mainSet in ${workout.id}`, errors);
      assert(Array.isArray(workout.workoutStructure?.cooldown) && workout.workoutStructure.cooldown.length > 0, `Missing cooldown in ${workout.id}`, errors);
      assert(Array.isArray(workout.variants?.easier?.mainSet) && workout.variants.easier.mainSet.length > 0, `Missing easier variant in ${workout.id}`, errors);
      assert(Array.isArray(workout.variants?.harder?.mainSet) && workout.variants.harder.mainSet.length > 0, `Missing harder variant in ${workout.id}`, errors);
      assert(workout.shareCard?.cardTitle && workout.shareCard?.mainSetText, `Missing shareCard data in ${workout.id}`, errors);

      for (const field of Object.keys(seen) as Array<keyof typeof seen>) {
        const value = String(workout[field] ?? "");
        if (!value) {
          errors.push(`Missing duplicate key ${field} in ${workout.id}`);
          continue;
        }
        if (seen[field].has(value)) {
          errors.push(`Duplicate ${field}: ${value} in ${workout.id}; first seen in ${seen[field].get(value)}`);
        } else {
          seen[field].set(value, workout.id);
        }
      }
    }
  }

  assert(total === index.libraryMeta.actualWorkoutCount, `Index actualWorkoutCount ${index.libraryMeta.actualWorkoutCount} does not match computed total ${total}`, errors);
  assert(total === index.libraryMeta.totalTargetWorkouts, `Total target ${index.libraryMeta.totalTargetWorkouts} does not match computed total ${total}`, errors);

  if (errors.length) {
    console.error("Track.Vault Workout Library validation failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Track.Vault Workout Library validation passed: ${total} workouts across ${index.categories.length} categories.`);
}

main();
