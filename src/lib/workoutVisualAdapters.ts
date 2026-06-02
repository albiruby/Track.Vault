/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrackVaultEntry, RunningWorkout, SupportRoutine } from "../types/workout";

export interface NormalizedRunningWorkout {
  title: string;
  summary: string;
  estimatedDurationMin: number;
  estimatedDurationStr: string;
  estimatedDistanceKm: number;
  estimatedDistanceStr: string;
  qualityDistanceKm: number;
  warmup: any[];
  mainSet: any[];
  cooldown: any[];
  level: string;
  difficulty: number;
  category: string;
  risk: string;
  surface: string;
  phase: string;
  workoutType: string;
  intensityGuide: {
    primaryTarget?: string;
    paceGuide?: string;
    hrGuide?: string;
    rpeGuide?: string;
    warmup?: string;
    mainSet?: string;
    cooldown?: string;
    general?: string;
  };
  variants: {
    easier?: {
      description: string;
      mainSet?: any[];
    };
    harder?: {
      description: string;
      mainSet?: any[];
    };
  };
  coachingNotes: string[];
  commonMistakes: string[];
  safetyNotes: string[];
  shareCard?: {
    title?: string;
    primaryDistance?: string;
    category?: string;
    difficulty?: string;
    risk?: string;
    mainPrescription?: string;
    coachingCue?: string;
  };
}

export interface NormalizedSupportRoutine {
  title: string;
  summary: string;
  durationMin: number;
  sessionStructure: any[] | string;
  bodyFocus: string[];
  movementGoals: string[];
  equipment: string[];
  level: string;
  difficulty: number;
  risk: string;
  routineType: string;
  supportCategoryLabel: string;
  easierVariant?: {
    description?: string;
    adjustments?: string[];
  } | string;
  harderVariant?: {
    description?: string;
    adjustments?: string[];
  } | string;
  coachingNotes: string[];
  commonMistakes: string[];
  safetyNotes: string[];
  shareCard?: {
    title?: string;
    category?: string;
    difficulty?: string;
    risk?: string;
    mainPrescription?: string;
    coachingCue?: string;
  };
}

/**
 * Normalizes a running workout entry into a clean, safe structure.
 */
export function normalizeRunningWorkout(entry: any): NormalizedRunningWorkout {
  const isSupport = entry?.entryType === "support-routine";
  if (isSupport) {
    throw new Error("Cannot normalize support-routine as a running-workout");
  }

  // Safe duration range extractor
  let durationVal = 0;
  let durationStr = "N/A";
  const rawDur = entry?.rawDuration || entry?.estimatedDurationMin;
  if (rawDur && typeof rawDur === "object") {
    durationVal = Math.round(((rawDur.min || 0) + (rawDur.max || 0)) / 2);
    durationStr = `${rawDur.min}-${rawDur.max} min`;
  } else if (typeof rawDur === "number") {
    durationVal = rawDur;
    durationStr = `${rawDur} min`;
  } else if (typeof entry?.estimatedDurationMin === "number") {
    durationVal = entry.estimatedDurationMin;
    durationStr = `${entry.estimatedDurationMin} min`;
  }

  // Safe distance range extractor
  let distanceVal = 0;
  let distanceStr = "N/A";
  const rawDist = entry?.rawDistance || entry?.estimatedDistanceKm;
  if (rawDist && typeof rawDist === "object") {
    distanceVal = Math.round(((rawDist.min || 0) + (rawDist.max || 0)) / 2 * 10) / 10;
    distanceStr = `${rawDist.min}-${rawDist.max} km`;
  } else if (typeof rawDist === "number") {
    distanceVal = rawDist;
    distanceStr = `${rawDist} km`;
  } else if (typeof entry?.estimatedDistanceKm === "number") {
    distanceVal = entry.estimatedDistanceKm;
    distanceStr = `${entry.estimatedDistanceKm} km`;
  }

  // Safe array extractors
  const wStructure = entry?.workoutStructure || {};
  const warmup = Array.isArray(entry?.warmup) 
    ? entry.warmup 
    : (Array.isArray(wStructure.warmup) ? wStructure.warmup : []);
  const mainSet = Array.isArray(entry?.mainSet) 
    ? entry.mainSet 
    : (Array.isArray(wStructure.mainSet) ? wStructure.mainSet : []);
  const cooldown = Array.isArray(entry?.cooldown) 
    ? entry.cooldown 
    : (Array.isArray(wStructure.cooldown) ? wStructure.cooldown : []);

  // Intensity guide mapper
  const rawIntensity = entry?.intensityGuide || {};
  const intensityGuide = {
    primaryTarget: rawIntensity.primaryTarget || rawIntensity.general || "",
    paceGuide: rawIntensity.paceGuide || rawIntensity.mainSet || "",
    hrGuide: rawIntensity.hrGuide || "",
    rpeGuide: rawIntensity.rpeGuide || "",
    warmup: rawIntensity.warmup || "",
    mainSet: rawIntensity.mainSet || "",
    cooldown: rawIntensity.cooldown || "",
    general: rawIntensity.general || "",
  };

  // Safe difficulties
  let diffNum = 5;
  if (typeof entry?.difficulty === "number") {
    diffNum = entry.difficulty;
  } else if (typeof entry?.difficulty === "string") {
    const diffLower = entry.difficulty.toLowerCase();
    if (diffLower.includes("easy") || diffLower === "beginner") diffNum = 2;
    else if (diffLower.includes("mod") || diffLower === "intermediate") diffNum = 5;
    else if (diffLower.includes("hard") || diffLower === "advanced") diffNum = 8;
    else if (diffLower.includes("elite") || diffLower.includes("very-hard")) diffNum = 10;
  }

  // Variants mapper
  const rawVariants = entry?.variants || {};
  const variants: any = {};
  if (rawVariants.easier) {
    variants.easier = {
      description: typeof rawVariants.easier === "string" ? rawVariants.easier : (rawVariants.easier.description || "Reduced load scaling"),
      mainSet: Array.isArray(rawVariants.easier.mainSet) ? rawVariants.easier.mainSet : undefined,
    };
  } else if (entry?.easierVariant) {
    variants.easier = {
      description: typeof entry.easierVariant === "string" ? entry.easierVariant : (entry.easierVariant.description || "Reduced load scaling"),
    };
  }

  if (rawVariants.harder) {
    variants.harder = {
      description: typeof rawVariants.harder === "string" ? rawVariants.harder : (rawVariants.harder.description || "Increased load scaling"),
      mainSet: Array.isArray(rawVariants.harder.mainSet) ? rawVariants.harder.mainSet : undefined,
    };
  } else if (entry?.harderVariant) {
    variants.harder = {
      description: typeof entry.harderVariant === "string" ? entry.harderVariant : (entry.harderVariant.description || "Increased load scaling"),
    };
  }

  return {
    title: entry?.title || "Untitled Performance Workout",
    summary: entry?.summary || "No coaching outline has been provided yet.",
    estimatedDurationMin: durationVal,
    estimatedDurationStr: durationStr,
    estimatedDistanceKm: distanceVal,
    estimatedDistanceStr: distanceStr,
    qualityDistanceKm: typeof entry?.qualityDistanceKm === "number" ? entry.qualityDistanceKm : 0,
    warmup,
    mainSet,
    cooldown,
    level: entry?.level || "intermediate",
    difficulty: diffNum,
    category: entry?.category || entry?.primaryDistance || "general",
    risk: entry?.risk || "medium",
    surface: Array.isArray(entry?.surface) ? entry.surface[0] : (entry?.surface || "track"),
    phase: Array.isArray(entry?.phase) ? entry.phase[0] : (entry?.phase || "build"),
    workoutType: entry?.workoutType || "repeat",
    intensityGuide,
    variants,
    coachingNotes: Array.isArray(entry?.coachingNotes) ? entry.coachingNotes : [],
    commonMistakes: Array.isArray(entry?.commonMistakes) ? entry.commonMistakes : [],
    safetyNotes: Array.isArray(entry?.safetyNotes) ? entry.safetyNotes : [],
    shareCard: entry?.shareCard || null,
  };
}

/**
 * Normalizes a support routine entry into a clean, safe structure.
 */
export function normalizeSupportRoutine(entry: any): NormalizedSupportRoutine {
  const isSupport = entry?.entryType === "support-routine" || entry?.supportCategoryId !== undefined;
  if (!isSupport) {
    throw new Error("Cannot normalize running-workout as a support-routine");
  }

  // Safe duration min
  const rawDur = entry?.durationMin || entry?.estimatedDurationMin || 0;
  let durationVal = 0;
  if (typeof rawDur === "number") {
    durationVal = rawDur;
  } else if (rawDur && typeof rawDur === "object") {
    durationVal = Math.round(((rawDur.min || 0) + (rawDur.max || 0)) / 2);
  }

  // Safe string or array map for sessionStructure
  const sessionStructure = entry?.sessionStructure || [];

  // Safe tags & chips arrays
  const bodyFocus = Array.isArray(entry?.bodyFocus) 
    ? entry.bodyFocus 
    : (entry?.bodyFocus ? [entry.bodyFocus] : []);
  const movementGoals = Array.isArray(entry?.movementGoals) 
    ? entry.movementGoals 
    : (entry?.movementGoals ? [entry.movementGoals] : []);
  const equipment = Array.isArray(entry?.equipment) 
    ? entry.equipment 
    : (entry?.equipment ? [entry.equipment] : []);

  // Safe difficulties
  let diffNum = 5;
  if (typeof entry?.difficulty === "number") {
    diffNum = entry.difficulty;
  } else if (typeof entry?.difficulty === "string") {
    const diffLower = entry.difficulty.toLowerCase();
    if (diffLower.includes("easy") || diffLower === "beginner") diffNum = 2;
    else if (diffLower.includes("mod") || diffLower === "intermediate") diffNum = 5;
    else if (diffLower.includes("hard") || diffLower === "advanced") diffNum = 8;
    else if (diffLower.includes("elite") || diffLower.includes("very-hard")) diffNum = 10;
  }

  // Format easy/hard variant
  let easierVariant = entry?.easierVariant || "";
  let harderVariant = entry?.harderVariant || "";

  return {
    title: entry?.title || "Untitled Athlete Support Routine",
    summary: entry?.summary || "No routine outline has been provided yet.",
    durationMin: durationVal,
    sessionStructure,
    bodyFocus,
    movementGoals,
    equipment,
    level: entry?.level || "intermediate",
    difficulty: diffNum,
    risk: entry?.risk || "low",
    routineType: entry?.routineType || "stability",
    supportCategoryLabel: entry?.supportCategoryLabel || entry?.category || "Support",
    easierVariant,
    harderVariant,
    coachingNotes: Array.isArray(entry?.coachingNotes) ? entry.coachingNotes : [],
    commonMistakes: Array.isArray(entry?.commonMistakes) ? entry.commonMistakes : [],
    safetyNotes: Array.isArray(entry?.safetyNotes) ? entry.safetyNotes : [],
    shareCard: entry?.shareCard || null,
  };
}
