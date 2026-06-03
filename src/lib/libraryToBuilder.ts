/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workout } from "../types/workout";

export function createBuilderDraftFromEntry(entry: any): any {
  if (!entry) return null;
  
  let draft: any;
  if (entry.entryType === "support-routine") {
    draft = convertSupportRoutineToBuilderDraft(entry);
  } else {
    // Default to running workout
    draft = convertRunningWorkoutToBuilderDraft(entry);
  }
  
  return normalizeBuilderDraft(draft);
}

export function convertRunningWorkoutToBuilderDraft(entry: any): any {
  const uniq = Math.random().toString(36).substr(2, 9);
  
  // Extract block arrays directly from entry
  const warmup = Array.isArray(entry.warmup) ? entry.warmup : [];
  const mainSet = Array.isArray(entry.mainSet) ? entry.mainSet : [];
  const cooldown = Array.isArray(entry.cooldown) ? entry.cooldown : [];
  
  // Extract intensityGuide fields
  const intensityGuide = entry.intensityGuide || {
    warmup: "Easy jogging below aerobic threshold",
    mainSet: "Target pacing zone based on goal velocity",
    cooldown: "Light active recovery stroll"
  };

  return {
    localDraftId: `draft-run-${uniq}`,
    sourceEntryId: entry.id,
    sourceEntrySlug: entry.slug,
    sourceEntryTitle: entry.title,
    sourceEntryType: "running-workout",
    createdFromLibrary: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    id: `custom-${uniq}`,
    slug: `${entry.slug || "workout"}-custom-${uniq}`,
    title: `${entry.title} (Custom)`,
    shortTitle: entry.shortTitle ? `${entry.shortTitle} Custom` : `${entry.title} Custom`,
    summary: entry.summary || entry.description || "",
    level: entry.level || "intermediate",
    phase: Array.isArray(entry.phase) ? entry.phase[0] : (entry.phase || "Build"),
    difficulty: typeof entry.difficulty === "number" ? entry.difficulty : 5,
    risk: entry.risk || "medium",
    riskReason: entry.riskReason || "Form vigilance required during fast intervals.",
    tags: Array.isArray(entry.tags) ? [...entry.tags] : [],
    coachingNotes: Array.isArray(entry.coachingNotes) ? [...entry.coachingNotes] : [],
    commonMistakes: Array.isArray(entry.commonMistakes) ? [...entry.commonMistakes] : [],
    safetyNotes: Array.isArray(entry.safetyNotes) ? [...entry.safetyNotes] : [],
    shareCard: entry.shareCard ? { ...entry.shareCard } : null,
    
    // Running-specific fields
    entryType: "custom-running-workout", // Mark as custom to differentiate prefix
    primaryDistance: entry.primaryDistance || "5K",
    targetDistances: Array.isArray(entry.targetDistances) ? [...entry.targetDistances] : [entry.primaryDistance || "5K"],
    distanceNavId: entry.distanceNavId || "five-k",
    workoutType: entry.workoutType || "interval",
    trainingGoals: Array.isArray(entry.trainingGoals) ? [...entry.trainingGoals] : [],
    surface: entry.surface || "Track",
    estimatedDurationMin: typeof entry.estimatedDurationMin === "number" ? entry.estimatedDurationMin : 40,
    estimatedDistanceKm: typeof entry.estimatedDistanceKm === "number" ? entry.estimatedDistanceKm : 6.5,
    qualityDistanceKm: typeof entry.qualityDistanceKm === "number" ? entry.qualityDistanceKm : 0,
    intensityGuide: intensityGuide,
    warmup: JSON.parse(JSON.stringify(warmup)),
    mainSet: JSON.parse(JSON.stringify(mainSet)),
    cooldown: JSON.parse(JSON.stringify(cooldown)),
    variants: entry.variants ? JSON.parse(JSON.stringify(entry.variants)) : []
  };
}

export function convertSupportRoutineToBuilderDraft(entry: any): any {
  const uniq = Math.random().toString(36).substr(2, 9);
  
  return {
    localDraftId: `draft-support-${uniq}`,
    sourceEntryId: entry.id,
    sourceEntrySlug: entry.slug,
    sourceEntryTitle: entry.title,
    sourceEntryType: "support-routine",
    createdFromLibrary: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    id: `custom-${uniq}`,
    slug: `${entry.slug || "support"}-custom-${uniq}`,
    title: `${entry.title} (Custom)`,
    shortTitle: entry.shortTitle ? `${entry.shortTitle} Custom` : `${entry.title} Custom`,
    summary: entry.summary || entry.description || "",
    level: entry.level || "intermediate",
    phase: Array.isArray(entry.phase) ? entry.phase[0] : (entry.phase || "Build"),
    difficulty: typeof entry.difficulty === "number" ? entry.difficulty : 4,
    risk: entry.risk || "low",
    riskReason: entry.riskReason || "Control joint alignment during repetitions.",
    tags: Array.isArray(entry.tags) ? [...entry.tags] : [],
    coachingNotes: Array.isArray(entry.coachingNotes) ? [...entry.coachingNotes] : [],
    commonMistakes: Array.isArray(entry.commonMistakes) ? [...entry.commonMistakes] : [],
    safetyNotes: Array.isArray(entry.safetyNotes) ? [...entry.safetyNotes] : [],
    shareCard: entry.shareCard ? { ...entry.shareCard } : null,
    
    // Support-specific fields
    entryType: "custom-support-routine", // Mark as custom to differentiate prefix
    supportCategoryId: entry.supportCategoryId || "mobility",
    supportCategoryLabel: entry.supportCategoryLabel || "Mobility",
    routineType: entry.routineType || "warmup",
    targetRunnerType: entry.targetRunnerType || "All Athletes",
    durationMin: typeof entry.durationMin === "number" ? entry.durationMin : (typeof entry.estimatedDurationMin === "number" ? entry.estimatedDurationMin : 15),
    equipment: Array.isArray(entry.equipment) ? [...entry.equipment] : [],
    bodyFocus: Array.isArray(entry.bodyFocus) ? [...entry.bodyFocus] : [],
    movementGoals: Array.isArray(entry.movementGoals) ? [...entry.movementGoals] : [],
    sessionStructure: typeof entry.sessionStructure === "string" 
      ? entry.sessionStructure 
      : (entry.sessionStructure ? JSON.stringify(entry.sessionStructure, null, 2) : ""),
    easierVariant: entry.easierVariant || "",
    harderVariant: entry.harderVariant || ""
  };
}

export function normalizeBuilderDraft(draft: any): any {
  if (!draft) return null;
  
  // Ensure we have arrays and objects nicely parsed and initialized
  if (!draft.tags) draft.tags = [];
  if (!draft.coachingNotes) draft.coachingNotes = [];
  if (!draft.commonMistakes) draft.commonMistakes = [];
  if (!draft.safetyNotes) draft.safetyNotes = [];
  
  if (draft.sourceEntryType === "running-workout") {
    if (!draft.warmup) draft.warmup = [];
    if (!draft.mainSet) draft.mainSet = [];
    if (!draft.cooldown) draft.cooldown = [];
    if (!draft.intensityGuide) {
      draft.intensityGuide = {
        warmup: "Easy jogging below aerobic threshold",
        mainSet: "Target pacing zone based on goal velocity",
        cooldown: "Light active recovery stroll"
      };
    }
  }
  
  return draft;
}
