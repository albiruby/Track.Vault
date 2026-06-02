/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workout, WorkoutBlock, WorkoutLibraryIndex, CategoryMeta } from "../types/workout";
import indexJson from "../data/workouts/workoutLibrary.index.v1.2.json";
import fullLibraryJson from "../data/workouts/generated/trackVaultLibrary.full.v1.2.json";
import { trackVaultNavigation } from "../data/workouts/trackVaultNavigation.v1.2";

export const WORKOUT_DISTANCE_NAV = trackVaultNavigation.runningNavigation;
export type DistanceNavItem = any;

const categoriesMapped: CategoryMeta[] = [
  ...trackVaultNavigation.runningNavigation,
  ...trackVaultNavigation.supportNavigation
].map((item: any) => ({
  id: item.id,
  name: item.label,
  description: `${item.label} training and support assets.`,
  targetWorkoutCount: item.entries || 50,
  icon: item.type,
  tags: [item.type]
}));

// Map JSON structures to satisfy the TypeScript interfaces precisely
const workoutIndex: WorkoutLibraryIndex = {
  version: (indexJson as any).version || "1.2",
  lastRegenerated: new Date().toISOString().split('T')[0],
  categories: categoriesMapped
};

const mapRawWorkout = (w: any) => {
  const rawDur = w.estimatedDurationMin !== undefined ? w.estimatedDurationMin : w.durationMin;
  const durationNum = rawDur && typeof rawDur === "object"
    ? Math.round(((rawDur as any).min + (rawDur as any).max) / 2)
    : (typeof rawDur === "number" ? rawDur : 0);

  const distanceNum = w.estimatedDistanceKm && typeof w.estimatedDistanceKm === "object"
    ? Math.round(((w.estimatedDistanceKm.min + w.estimatedDistanceKm.max) / 2) * 10) / 10
    : (typeof w.estimatedDistanceKm === "number" ? w.estimatedDistanceKm : 0);

  let diffNum = typeof w.difficulty === "number" ? w.difficulty : 5;
  if (typeof w.difficulty === "string") {
    const dLower = w.difficulty.toLowerCase();
    if (dLower === "easy") diffNum = 2;
    else if (dLower === "moderate") diffNum = 5;
    else if (dLower === "moderate-hard") diffNum = 7;
    else if (dLower === "hard") diffNum = 8;
    else if (dLower === "very-hard") diffNum = 10;
  }

  const phaseStr = Array.isArray(w.phase) ? w.phase[0] : (w.phase || "Build");
  const phasesArr = Array.isArray(w.phase) ? w.phase : (w.phase ? [w.phase] : []);
  const surfaceStr = Array.isArray(w.surface) ? w.surface[0] : (w.surface || "Track");
  const surfacesArr = Array.isArray(w.surface) ? w.surface : (w.surface ? [w.surface] : []);

  const mapBlock = (b: any) => {
    if (!b) return null;
    return {
      ...b,
      id: b.id || `b-${Math.random().toString(36).substr(2, 9)}`,
      type: b.type || b.blockType || "repeat",
      work: b.work ? {
        ...b.work,
        targetType: b.work.targetType === "time" ? "duration" : b.work.targetType
      } : { targetType: "unlimited" },
      notes: Array.isArray(b.notes) ? b.notes.join(". ") : b.notes
    };
  };

  const warmupMapped = (w.workoutStructure?.warmup || w.warmup || []).map(mapBlock).filter(Boolean);
  const mainSetMapped = (w.workoutStructure?.mainSet || w.mainSet || []).map(mapBlock).filter(Boolean);
  const cooldownMapped = (w.workoutStructure?.cooldown || w.cooldown || []).map(mapBlock).filter(Boolean);

  let supportCatId = w.supportCategoryId;
  if (supportCatId) {
    const norm = supportCatId.toLowerCase();
    if (norm === "upper_strength") supportCatId = "upper-strength";
    else if (norm === "lower_strength") supportCatId = "lower-strength";
    else if (norm === "core_stability") supportCatId = "core";
    else if (norm === "running_drills") supportCatId = "running-drills";
    else if (norm === "warm_up_routine") supportCatId = "warmup";
    else if (norm === "cooldown_routine") supportCatId = "cooldown";
    else if (norm === "recovery_routine") supportCatId = "recovery";
    else if (norm === "injury_risk_reduction") supportCatId = "injury-risk";
  }

  let distNavId = w.distanceNavId;
  if (distNavId === "base-recovery") {
    distNavId = "base";
  }

  const generatedSlug = w.slug || (w.title
    ? `${w.id}-${w.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`
    : `${w.id}`);

  return {
    ...w,
    supportCategoryId: supportCatId,
    distanceNavId: distNavId,
    slug: generatedSlug,
    estimatedDurationMin: durationNum,
    estimatedDistanceKm: distanceNum,
    difficulty: diffNum,
    rawDifficulty: w.difficulty,
    rawDuration: w.estimatedDurationMin,
    rawDistance: w.estimatedDistanceKm,
    phase: phaseStr,
    phases: phasesArr,
    surface: surfaceStr,
    surfaces: surfacesArr,
    warmup: warmupMapped,
    mainSet: mainSetMapped,
    cooldown: cooldownMapped,
  };
};

const allWorkouts: Workout[] = ((fullLibraryJson as any)?.allEntries || []).map(mapRawWorkout);
const mappedRunningWorkouts: Workout[] = ((fullLibraryJson as any)?.runningWorkouts || []).map(mapRawWorkout);
const mappedSupportRoutines: Workout[] = ((fullLibraryJson as any)?.supportRoutines || []).map(mapRawWorkout);

export function getTrackVaultLibrary() {
  return {
    libraryMeta: (fullLibraryJson as any).libraryMeta,
    allEntries: getAllEntries(),
    runningWorkouts: getRunningWorkouts(),
    supportRoutines: getSupportRoutines()
  };
}

export function getAllEntries(): Workout[] {
  return allWorkouts || [];
}

export function getRunningWorkouts(): Workout[] {
  return mappedRunningWorkouts || [];
}

export function getSupportRoutines(): Workout[] {
  return mappedSupportRoutines || [];
}

export function getEntryBySlug(slug: string): Workout | undefined {
  return getAllEntries().find((w) => w.slug === slug);
}

export function getWorkoutIndex(): WorkoutLibraryIndex {
  return workoutIndex;
}

export function getAllWorkouts(): Workout[] {
  return allWorkouts || [];
}

export function getWorkoutBySlug(slug: string): Workout | undefined {
  return getEntryBySlug(slug);
}

export function getWorkoutsByCategory(categoryId: string): Workout[] {
  const normId = categoryId?.trim()?.toLowerCase();
  
  const isSupportCat = [
    "upper-strength", "lower-strength", "core", "mobility", "activation", 
    "plyometric", "running-drills", "warmup", "cooldown", "recovery", "injury-risk"
  ].includes(normId);

  if (isSupportCat) {
    return getSupportRoutines().filter(w => w.supportCategoryId?.toLowerCase() === normId);
  } else {
    return getRunningWorkouts().filter(w => w.distanceNavId?.toLowerCase() === normId);
  }
}

export function formatDistance(metersCount?: number): string {
 if (!metersCount) return "";
 if (metersCount < 1000) {
 return `${metersCount}m`;
 }
 const km = metersCount / 1000;
 // If integer or simple decimal
 return Number.isInteger(km) ? `${km}K` : `${km.toFixed(1)}K`;
}

export function formatDuration(secondsCount?: number): string {
 if (!secondsCount) return "";
 if (secondsCount < 60) {
 return `${secondsCount} sec`;
 }
 const minutes = Math.floor(secondsCount / 60);
 const remainingSeconds = secondsCount % 60;
 
 if (minutes < 60) {
 return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes} min`;
 }
 
 const hours = Math.floor(minutes / 60);
 const remainingMinutes = minutes % 60;
 return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function formatWorkoutBlock(block: WorkoutBlock): string {
 const reps = block.repetitions && block.repetitions > 1 ? `${block.repetitions}x ` : "";
 let targetText = "";
 if (block.work.targetType === "distance" && block.work.distanceMeters) {
 targetText = formatDistance(block.work.distanceMeters);
 } else if (block.work.targetType === "duration" && block.work.durationSeconds) {
 targetText = formatDuration(block.work.durationSeconds);
 } else {
 // Fallback
 if (block.work.distanceMeters) targetText = formatDistance(block.work.distanceMeters);
 else if (block.work.durationSeconds) targetText = formatDuration(block.work.durationSeconds);
 else targetText = "open time";
 }

 const intensity = block.work.intensity ? ` @ ${block.work.intensity}` : "";
 const name = block.name ? `[${block.name}]` : "";
 
 let recoveryText = "";
 if (block.recovery && block.recovery.type !== "none") {
 const recType = block.recovery.type;
 let recTarget = "";
 if (block.recovery.durationSeconds) recTarget = formatDuration(block.recovery.durationSeconds);
 else if (block.recovery.distanceMeters) recTarget = formatDistance(block.recovery.distanceMeters);
 
 const recInt = block.recovery.intensity ? ` ${block.recovery.intensity}` : "";
 recoveryText = ` (w/ ${recTarget} ${recType}${recInt} rec)`;
 }

 return `${reps}${name} ${targetText}${intensity}${recoveryText}`;
}

export function formatExerciseBlock(ex: any): string {
  if (!ex || typeof ex !== "object") return String(ex || "");
  
  const name = ex.name || "Exercise";
  const parts: string[] = [];
  
  if (ex.sets) {
    if (ex.reps) {
      parts.push(`${ex.sets}x${ex.reps}`);
    } else if (ex.durationSeconds) {
      parts.push(`${ex.sets}x ${ex.durationSeconds}s`);
    } else if (ex.distanceMeters) {
      parts.push(`${ex.sets}x ${ex.distanceMeters}m`);
    } else {
      parts.push(`${ex.sets} sets`);
    }
  } else if (ex.reps) {
    parts.push(`${ex.reps} reps`);
  } else if (ex.durationSeconds) {
    parts.push(`${ex.durationSeconds}s`);
  } else if (ex.distanceMeters) {
    parts.push(`${ex.distanceMeters}m`);
  }

  if (ex.side && ex.side !== "both" && ex.side !== "none" && ex.side !== "all") {
    parts.push(`(${ex.side} side)`);
  }
  
  if (ex.intensity && ex.intensity !== "controlled" && ex.intensity !== "easy" && ex.intensity !== "moderate") {
    parts.push(`@ ${ex.intensity}`);
  }

  const specStr = parts.join(" ");
  const restStr = ex.restSeconds ? ` [Rest: ${ex.restSeconds}s]` : "";
  
  return `${name}${specStr ? `: ${specStr}` : ""}${restStr}`;
}

export function normalizeWorkoutForDisplay(workout: Workout) {
 const rawDur = (workout as any).rawDuration;
 const rawDist = (workout as any).rawDistance;

 const durationStr = rawDur && typeof rawDur === "object"
 ? `${rawDur.min}-${rawDur.max} min`
 : `${workout.estimatedDurationMin} min`;

 const distanceStr = rawDist && typeof rawDist === "object"
 ? `${rawDist.min}-${rawDist.max} km`
 : `${workout.estimatedDistanceKm} km`;

 return {
 ...workout,
 formattedDuration: durationStr,
 formattedDistance: distanceStr,
 formattedQualityDistance: workout.qualityDistanceKm ? `${workout.qualityDistanceKm} km` : undefined,
 };
}

export interface WorkoutFiltersState {
 targetDistance: string;
 level: string;
 category: string;
 phase: string;
 surface: string;
 difficulty: string;
 risk: string;
 duration: string;
 workoutType: string;
}

export function getWorkoutFilters(workouts: Workout[]) {
 const targetDistances = new Set<string>();
 const levels = new Set<string>();
 const categories = new Set<string>();
 const phases = new Set<string>();
 const surfaces = new Set<string>();
 const risks = new Set<string>();
 const workoutTypes = new Set<string>();

 workouts.forEach((w) => {
 if (w.targetDistances) {
 w.targetDistances.forEach((d) => {
 if (d) targetDistances.add(d);
 });
 }
 if (w.primaryDistance) {
 targetDistances.add(w.primaryDistance);
 }
 if (w.level) {
 levels.add(w.level);
 }
 const catId = w.libraryCategoryId || w.category;
 if (catId) {
 categories.add(catId);
 }
 const wType = w.workoutType || w.category;
 if (wType) {
 workoutTypes.add(wType);
 }
 
 // Extract phases from either array (phases) or single string (phase)
 const phasesRaw = (w as any).phases || w.phase;
 const pArr = Array.isArray(phasesRaw) ? phasesRaw : (typeof phasesRaw === "string" && phasesRaw ? [phasesRaw] : []);
 pArr.forEach((p: string) => {
 if (p) phases.add(p);
 });

 // Extract surfaces from either array (surfaces) or single string (surface)
 const surfacesRaw = (w as any).surfaces || w.surface;
 const sArr = Array.isArray(surfacesRaw) ? surfacesRaw : (typeof surfacesRaw === "string" && surfacesRaw ? [surfacesRaw] : []);
 sArr.forEach((s: string) => {
 if (s) surfaces.add(s);
 });

 if (w.risk) {
 risks.add(w.risk);
 }
 });

 const DISTANCE_ORDER = [
 "100m",
 "200m",
 "400m",
 "800m",
 "1500m",
 "Mile",
 "3K",
 "5K",
 "10K",
 "15K",
 "Half Marathon",
 "Marathon",
 "Ultra",
 "Trail",
 "Treadmill",
 "General",
 "Base",
 "Recovery"
 ];

 const sortedDistances = Array.from(targetDistances).sort((a, b) => {
 const indexA = DISTANCE_ORDER.findIndex(val => val.toLowerCase() === a.toLowerCase());
 const indexB = DISTANCE_ORDER.findIndex(val => val.toLowerCase() === b.toLowerCase());
 
 if (indexA !== -1 && indexB !== -1) {
 return indexA - indexB;
 }
 if (indexA !== -1) return -1;
 if (indexB !== -1) return 1;
 return a.localeCompare(b);
 });

 return {
 targetDistances: sortedDistances,
 levels: Array.from(levels),
 categories: Array.from(categories),
 phases: Array.from(phases).sort(),
 surfaces: Array.from(surfaces).sort(),
 risks: Array.from(risks),
 workoutTypes: Array.from(workoutTypes).sort(),
 };
}

export function searchWorkouts(workouts: Workout[], query: string): Workout[] {
  if (!query.trim()) return workouts;
  const q = query.toLowerCase();
  return workouts.filter((w) => {
    const title = (w.title || "").toLowerCase();
    const summary = (w.summary || "").toLowerCase();
    const shortTitle = (w.shortTitle || "").toLowerCase();
    const cat = (w.category || "").toLowerCase();
    const lev = (w.level || "").toLowerCase();
    const primDist = (w.primaryDistance || "").toLowerCase();
    
    return (
      title.includes(q) ||
      summary.includes(q) ||
      shortTitle.includes(q) ||
      cat.includes(q) ||
      lev.includes(q) ||
      primDist.includes(q) ||
      (w.targetDistances || []).some((d) => d?.toLowerCase().includes(q)) ||
      (w.tags || []).some((t) => t?.toLowerCase().includes(q)) ||
      ((w as any).searchKeywords || []).some((k: string) => k?.toLowerCase().includes(q))
    );
  });
}

export function filterWorkouts(workouts: Workout[], filters: Partial<WorkoutFiltersState>): Workout[] {
  return workouts.filter((w) => {
    if (filters.targetDistance && filters.targetDistance !== "All") {
      const match = (w.targetDistances || []).some(
        (td) => td?.toLowerCase() === filters.targetDistance?.toLowerCase()
      );
      if (!match) return false;
    }
    if (filters.level && filters.level !== "All") {
      if (w.level?.toLowerCase() !== filters.level?.toLowerCase()) {
        return false;
      }
    }
    if (filters.category && filters.category !== "All") {
      const wCat = w.distanceNavId || (w as any).supportCategoryId || w.category || w.libraryCategoryId || "";
      if (wCat.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }
 if (filters.workoutType && filters.workoutType !== "All") {
 const wType = w.workoutType || w.category;
 if (wType?.toLowerCase() !== filters.workoutType?.toLowerCase()) {
 return false;
 }
 }
 if (filters.phase && filters.phase !== "All") {
 const phasesRaw = (w as any).phases || w.phase;
 const pArr = Array.isArray(phasesRaw) ? phasesRaw : (typeof phasesRaw === "string" && phasesRaw ? [phasesRaw] : []);
 const match = pArr.some(
 (p: string) => p?.toLowerCase() === filters.phase?.toLowerCase()
 );
 if (!match) return false;
 }
 if (filters.surface && filters.surface !== "All") {
 const surfacesRaw = (w as any).surfaces || w.surface;
 const sArr = Array.isArray(surfacesRaw) ? surfacesRaw : (typeof surfacesRaw === "string" && surfacesRaw ? [surfacesRaw] : []);
 const match = sArr.some(
 (s: string) => s?.toLowerCase() === filters.surface?.toLowerCase()
 );
 if (!match) return false;
 }
 if (filters.risk && filters.risk !== "All") {
 if (w.risk?.toLowerCase() !== filters.risk?.toLowerCase()) {
 return false;
 }
 }
 if (filters.difficulty && filters.difficulty !== "All") {
 const diffStr = String((w as any).rawDifficulty || w.difficulty);
 const val = filters.difficulty; // "1", "2", "3"
 const diffLower = diffStr.toLowerCase();
 
 const isEasy = diffLower === "easy" || w.difficulty <= 3;
 const isModerate = diffLower === "moderate" || diffLower === "moderate-hard" || (w.difficulty >= 4 && w.difficulty <= 7);
 const isHard = diffLower === "hard" || diffLower === "very-hard" || w.difficulty >= 8;
 
 if (val === "1" && !isEasy) return false;
 if (val === "2" && !isModerate) return false;
 if (val === "3" && !isHard) return false;
 }
 if (filters.duration && filters.duration !== "All") {
 const duration = w.estimatedDurationMin;
 if (filters.duration === "under-30" && duration >= 30) return false;
 if (filters.duration === "30-60" && (duration < 30 || duration > 60)) return false;
 if (filters.duration === "over-60" && duration <= 60) return false;
 }
 return true;
 });
}

export function sortWorkouts(workouts: Workout[], sortKey: string): Workout[] {
 const result = [...workouts];
 switch (sortKey) {
 case "title":
 return result.sort((a, b) => a.title.localeCompare(b.title));
 case "difficulty-asc":
 return result.sort((a, b) => a.difficulty - b.difficulty);
 case "difficulty-desc":
 return result.sort((a, b) => b.difficulty - a.difficulty);
 case "duration-asc":
 return result.sort((a, b) => a.estimatedDurationMin - b.estimatedDurationMin);
 case "duration-desc":
 return result.sort((a, b) => b.estimatedDurationMin - a.estimatedDurationMin);
 case "distance-asc":
 return result.sort((a, b) => a.estimatedDistanceKm - b.estimatedDistanceKm);
 case "distance-desc":
 return result.sort((a, b) => b.estimatedDistanceKm - a.estimatedDistanceKm);
 case "level":
 const rank = { beginner: 1, intermediate: 2, advanced: 3, elite: 4 };
 return result.sort((a, b) => (rank[a.level] || 0) - (rank[b.level] || 0));
 default:
 return result;
 }
}

export function formatWorkoutForClipboard(workout: any, format: "simple" | "compact" | "structured-markdown" | "coach-notes"): string {
 const formatBlockList = (blocks: WorkoutBlock[]) => {
 if (!blocks || blocks.length === 0) return "None";
 return blocks.map((b) => `- ${formatWorkoutBlock(b)}`).join("\n");
 };

 const getIntensityGuideText = () => {
 if (!workout.intensityGuide) return "Standard pacing chart";
 const { warmup, mainSet, cooldown, general } = workout.intensityGuide;
 const parts = [];
 if (general) parts.push(`General: ${general}`);
 if (warmup) parts.push(`Warmup Pace: ${warmup}`);
 if (mainSet) parts.push(`Main Set intensity: ${mainSet}`);
 if (cooldown) parts.push(`Cooldown pace: ${cooldown}`);
 return parts.join(" | ");
 };

 switch (format) {
 case "simple": {
 return `Track.Vault Workout
------------------------
Title: ${workout.title}
Target: ${workout.primaryDistance} | Level: ${workout.level.toUpperCase()} | Difficulty: Pt ${workout.difficulty}/10

Warm-up:
${workout.warmup.map((b) => ` ${formatWorkoutBlock(b)}`).join("\n")}

Main Set:
${workout.mainSet.map((b) => ` ${formatWorkoutBlock(b)}`).join("\n")}

Cooldown:
${workout.cooldown.map((b) => ` ${formatWorkoutBlock(b)}`).join("\n")}

Notes & Guidance:
${workout.coachingNotes ? workout.coachingNotes.join("\n") : "None provided."}

Disclaimer:
Workouts are general training references, not personalized medical or coaching advice.`;
 }

 case "compact": {
 return `${workout.title} (${workout.primaryDistance} | ${workout.level.toUpperCase()})
WU: ${workout.warmup.map((b) => formatWorkoutBlock(b)).join(" -> ") || "None"}
MAIN: ${workout.mainSet.map((b) => formatWorkoutBlock(b)).join(" -> ")}
CD: ${workout.cooldown.map((b) => formatWorkoutBlock(b)).join(" -> ") || "None"}
Goal: ${workout.summary}`;
 }

 case "structured-markdown": {
 return `# ${workout.title}
> **${workout.summary}**

## Summary & Profile
* **Target Distances**: ${workout.targetDistances.join(", ")}
* **Level**: ${workout.level}
* **Surface**: ${workout.surface} 
* **Duration**: ~${workout.estimatedDurationMin} min (~${workout.estimatedDistanceKm} km)
* **Pacing Focus**: ${getIntensityGuideText()}

## Warm-up
${formatBlockList(workout.warmup)}

## Main Set
${formatBlockList(workout.mainSet)}

## Cooldown
${formatBlockList(workout.cooldown)}

${workout.coachingNotes && workout.coachingNotes.length > 0 ? `## Coaching Notes\n${workout.coachingNotes.map((n) => `* ${n}`).join("\n")}` : ""}

${workout.safetyNotes && workout.safetyNotes.length > 0 ? `## Safety Notes\n${workout.safetyNotes.map((s) => `* ${s}`).join("\n")}` : ""}

---
*Disclaimer: Workouts are general training references, not personalized medical or coaching advice.*`;
 }

 case "coach-notes": {
 return `COACHING SHEET: ${workout.title}
===========================================
Purpose & Objective: ${workout.summary}
Paces / Threshold Guide: ${getIntensityGuideText()}

Execution Cues:
${workout.coachingNotes ? workout.coachingNotes.map((n, i) => `${i + 1}. ${n}`).join("\n") : "Maintain progressive pacing structure."}

Common Mistakes to Correct:
${workout.commonMistakes ? workout.commonMistakes.map((m) => `[X] ${m}`).join("\n") : "Rushing the starting intervals too quickly."}

Safety & Risks (Risk Rating: ${workout.risk.toUpperCase()}):
${workout.riskReason ? `Reason: ${workout.riskReason}\n` : ""}${workout.safetyNotes ? workout.safetyNotes.map((s) => `* ${s}`).join("\n") : "Ensure proper hydration and warm surface check."}
===========================================`;
 }

 default:
 return "";
 }
}

export const SIDEBAR_DISTANCES = WORKOUT_DISTANCE_NAV.map(item => item.label);

export function matchSidebarDistance(w: Workout, distance: string): boolean {
  const normDist = distance.trim().toLowerCase();
  
  if (normDist === "all" || normDist === "all workouts" || normDist === "all workouts & routines") {
    return true;
  }
  
  if (normDist === "all running") {
    return (w as any).entryType !== "support-routine";
  }
  
  if (normDist === "all support") {
    return (w as any).entryType === "support-routine";
  }
  
  // Try to find in runningNavigation first
  const runningItem = trackVaultNavigation.runningNavigation.find(
    nav => nav.id.toLowerCase() === normDist || nav.label.toLowerCase() === normDist
  );
  if (runningItem) {
    if ((w as any).entryType === "support-routine") return false;
    
    if (w.distanceNavId) {
      return w.distanceNavId.toLowerCase() === runningItem.id.toLowerCase();
    }
    
    // Fallback for custom/legacy workouts
    const targetLabel = runningItem.label.toLowerCase();
    if (w.primaryDistance && w.primaryDistance.toLowerCase() === targetLabel) {
      return true;
    }
    if (w.targetDistances && w.targetDistances.some(td => td?.toLowerCase() === targetLabel)) {
      return true;
    }
    if (runningItem.id === "trail" && (Array.isArray(w.surface) ? w.surface[0] : w.surface)?.toLowerCase() === "trail") return true;
    if (runningItem.id === "treadmill" && (Array.isArray(w.surface) ? w.surface[0] : w.surface)?.toLowerCase() === "treadmill") return true;
    return false;
  }
  
  // Try to find in supportNavigation
  const supportItem = trackVaultNavigation.supportNavigation.find(
    nav => nav.id.toLowerCase() === normDist || nav.label.toLowerCase() === normDist
  );
  if (supportItem) {
    if ((w as any).entryType !== "support-routine") return false;
    
    const wSupId = (w as any).supportCategoryId || "";
    const wSupLabel = (w as any).supportCategoryLabel || "";
    
    return wSupId.toLowerCase() === supportItem.id.toLowerCase() || 
           wSupLabel.toLowerCase() === supportItem.label.toLowerCase();
  }
  
  return false;
}

