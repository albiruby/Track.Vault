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

export interface Workout {
 id: string;
 slug: string;
 title: string;
 shortTitle: string;
 summary: string;
 targetDistances: string[]; // e.g. ["5K", "10K"]
 primaryDistance: string; // e.g. "5K"
 category: string; // e.g. "beginner-return-to-running", "three-k-five-k"
 trainingGoals: string[]; // e.g. ["Aerobic capacity", "Speed endurance"]
 level: "beginner" | "intermediate" | "advanced" | "elite";
 phase: string; // e.g. "Base", "Build", "Peak", "Taper", "Race"
 surface: string; // e.g. "Track", "Road", "Trail", "Treadmill", "Any"
 equipment: string[]; // e.g. ["None", "Spikes", "GPS Watch"]
 estimatedDurationMin: number;
 estimatedDistanceKm: number;
 qualityDistanceKm?: number;
 difficulty: number; // 1-10
 risk: "low" | "medium" | "high" | "very-high";
 riskReason?: string;
 intensityGuide?: IntensityGuide;
 warmup: WorkoutBlock[];
 mainSet: WorkoutBlock[];
 cooldown: WorkoutBlock[];
 easierVariant?: string | WorkoutVariant;
 harderVariant?: string | WorkoutVariant;
 coachingNotes?: string[];
 commonMistakes?: string[];
 safetyNotes?: string[];
 tags?: string[];
 searchKeywords?: string[];
 shareCard?: ShareCard;
 isCustom?: boolean; // True if locally designed by user
 libraryCategoryId?: string;
 libraryCategoryLabel?: string;
 workoutType?: string;
 distanceNavId?: string;
 distanceNavLabel?: string;
 distanceSortOrder?: number;
 createdAt?: string;
}

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
