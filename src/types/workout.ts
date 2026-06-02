/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WorkoutRecovery {
 type: string; // e.g. "active", "passive", "walk", "jog", "none"
 durationSeconds?: number;
 distanceMeters?: number;
 intensity?: string; // e.g. "easy", "very easy", "walk"
}

export interface WorkoutBlock {
 id: string;
 type: string; // warmup, drill, stride, repeat, interval, tempo, threshold, fartlek, long-run, recovery, cooldown, note
 name: string;
 description?: string;
 repetitions?: number;
 work: {
 durationSeconds?: number;
 distanceMeters?: number;
 intensity?: string; // pace, zone, or descriptive
 targetType?: "duration" | "distance" | "unlimited";
 };
 recovery?: WorkoutRecovery;
 notes?: string;
}

export interface IntensityGuide {
 warmup?: string;
 mainSet?: string;
 cooldown?: string;
 general?: string;
}

export interface WorkoutVariant {
 description: string;
 adjustments: string[];
}

export interface ShareCard {
 title: string;
 primaryDistance: string;
 category: string;
 difficulty: "beginner" | "intermediate" | "advanced" | "elite";
 risk: "low" | "medium" | "high" | "very-high";
 mainPrescription: string; // shorthand text for the card
 coachingCue?: string;
}

export interface BaseTrackVaultEntry {
  id: string;
  slug?: string;
  entryType: "running-workout" | "support-routine";
  title: string;
  shortTitle?: string;
  summary?: string;
  level?: string;
  phase?: string | string[];
  equipment?: string[];
  difficulty?: number;
  rawDifficulty?: string | number;
  risk?: string;
  riskReason?: string;
  commonMistakes?: string[];
  easierVariant?: string | any;
  harderVariant?: string | any;
  shareCard?: any;
  coachingNotes?: string[];
  safetyNotes?: string[];
  tags?: string[];
  searchKeywords?: string[];
  isCustom?: boolean;
  createdAt?: string;

  formattedDuration?: string;
  formattedDistance?: string;
  formattedQualityDistance?: string;
}

export interface RunningWorkout extends BaseTrackVaultEntry {
  entryType: "running-workout";
  targetDistances?: string[];
  primaryDistance?: string;
  distanceNavId?: string;
  workoutType?: string;
  workoutStructure?: any;
  surface?: string | string[];
  estimatedDurationMin?: number;
  estimatedDistanceKm?: number;
  qualityDistanceKm?: number;
  rawDuration?: any;
  rawDistance?: any;
  intensityGuide?: any;
  warmup?: any[];
  mainSet?: any[];
  cooldown?: any[];
  category?: string;
  libraryCategoryId?: string;
}

export interface SupportRoutine extends BaseTrackVaultEntry {
  entryType: "support-routine";
  supportCategoryId?: string;
  supportCategoryLabel?: string;
  routineType?: string;
  bodyFocus?: string[];
  movementGoals?: string[];
  durationMin?: number;
  estimatedDurationMin?: number;
  sessionStructure?: string | any;
  exercises?: any[];
}

export type TrackVaultEntry = RunningWorkout | SupportRoutine;
export type Workout = any;

export interface CategoryMeta {
 id: string;
 name: string;
 description: string;
 targetWorkoutCount: number;
 icon?: string;
 tags?: string[];
}

export interface WorkoutLibraryIndex {
 categories: CategoryMeta[];
 lastRegenerated?: string;
 version: string;
}


export interface TrackVaultLibrary {
  libraryMeta: any;
  runningWorkouts: RunningWorkout[];
  supportRoutines: SupportRoutine[];
  allEntries: TrackVaultEntry[];
}

export interface TrackVaultIndex {
  version: string;
  total: number;
  entries: { id: string; title: string; entryType: string }[];
}

export interface TrackVaultNavigation {
  runningNavigation: any[];
  supportNavigation: any[];
}
