/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workout } from "../types/workout";

export interface FilterPreset {
  id: string;
  label: string;
  group: "general" | "running" | "support";
  description?: string;
  entryType?: "running-workout" | "support-routine" | "all";
  apply: (entry: Workout) => boolean;
}

const getDuration = (w: any): number => {
  const rawDur = w.rawDuration || w.estimatedDurationMin;
  if (rawDur && typeof rawDur === "object") {
    return rawDur.max !== undefined ? rawDur.max : (rawDur.min || 0);
  }
  return typeof rawDur === "number" ? rawDur : (typeof w.durationMin === "number" ? w.durationMin : 0);
};

export const FILTER_PRESETS: FilterPreset[] = [
  // ==========================================
  // GENERAL PRESETS
  // ==========================================
  {
    id: "beginner-friendly",
    label: "Beginner Friendly",
    group: "general",
    description: "Introductory workouts with manageable difficulty, low-to-medium risk limits, and focused pacing structures.",
    apply: (entry: Workout) => {
      const level = (entry.level || "").toLowerCase();
      const isBeg = level.includes("beginner") || level.includes("introductory") || level.includes("developing") || level === "beginner";
      const diff = entry.difficulty;
      const risk = (entry.risk || "").toLowerCase();
      const isLowMod = risk === "low" || risk === "medium" || risk === "moderate";
      return isBeg && diff <= 5 && isLowMod && level !== "advanced" && level !== "elite" && risk !== "high";
    }
  },
  {
    id: "low-risk",
    label: "Low Risk",
    group: "general",
    description: "Schedules configured with minimal mechanical overload, long active recoveries, and joint stability priorities.",
    apply: (entry: Workout) => {
      const risk = (entry.risk || "").toLowerCase();
      return risk === "low" || risk.includes("low");
    }
  },
  {
    id: "short-session",
    label: "Short Session",
    group: "general",
    description: "Compact athletic routines running under 40 minutes for running or 20 minutes for support overlays.",
    apply: (entry: Workout) => {
      if (entry.entryType === "running-workout") {
        return getDuration(entry) <= 40;
      } else if (entry.entryType === "support-routine") {
        const dur = typeof (entry as any).durationMin === "number" 
          ? (entry as any).durationMin 
          : (typeof entry.estimatedDurationMin === "number" ? entry.estimatedDurationMin : 0);
        return dur <= 20;
      }
      return false;
    }
  },
  {
    id: "advanced-sessions",
    label: "Advanced Sessions",
    group: "general",
    description: "High-intensity repetitions or advanced training regimes requiring strong biological bases.",
    apply: (entry: Workout) => {
      const level = (entry.level || "").toLowerCase();
      const diff = entry.difficulty || 0;
      const isBeg = level.includes("beginner") || level.includes("introductory") || level.includes("developing");
      if (isBeg) return false;
      return level.includes("advanced") || level.includes("competitive") || level.includes("elite") || diff >= 7;
    }
  },
  {
    id: "race-week",
    label: "Race Week",
    group: "general",
    description: "Tapering programs designed to sharpen reaction velocity and conserve cellular glycogen stores.",
    apply: (entry: Workout) => {
      const phaseStrProxy = entry.phase ? String(entry.phase).toLowerCase() : "";
      const phases = Array.isArray((entry as any).phases) 
        ? (entry as any).phases 
        : (phaseStrProxy ? [phaseStrProxy] : []);
      const tags = entry.tags || [];
      const keywords = (entry as any).searchKeywords || [];
      const titleLower = (entry.title || "").toLowerCase();
      
      const hasPhase = phases.some((p: string) => {
        const pl = String(p).toLowerCase();
        return pl.includes("race") || pl.includes("taper") || pl.includes("sharpening");
      });
      const hasKeyword = [...tags, ...keywords].some((k: string) => {
        const kl = String(k).toLowerCase();
        return kl.includes("race week") || kl.includes("taper") || kl.includes("sharpening") || kl.includes("race-week");
      });
      const hasTitle = titleLower.includes("race week") || titleLower.includes("taper") || titleLower.includes("sharpening");
      return hasPhase || hasKeyword || hasTitle;
    }
  },
  {
    id: "base-building",
    label: "Base Building",
    group: "general",
    description: "Schedules tailored to construct steady cardiovascular capacity and muscle capillary endurance.",
    apply: (entry: Workout) => {
      const type = (entry.workoutType || "").toLowerCase();
      const goals = (entry.trainingGoals || []).map((g: string) => g.toLowerCase());
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const keywords = ((entry as any).searchKeywords || []).map((k: string) => k.toLowerCase());
      const allMeta = [type, ...goals, ...tags, ...keywords, (entry.title || "").toLowerCase()];
      const hasBase = allMeta.some(m => m.includes("base") || m.includes("aerobic") || m.includes("easy") || m.includes("recovery") || m.includes("endurance"));
      const hasSprint = allMeta.some(m => m.includes("sprint") || m.includes("neuromuscular") || m.includes("speed development"));
      const hasRace = allMeta.some(m => m.includes("race week") || m.includes("taper") || m.includes("sharpening"));
      if ((hasSprint || hasRace) && !allMeta.some(m => m.includes("base line") || m.includes("base phase"))) {
        return false;
      }
      return hasBase;
    }
  },

  // ==========================================
  // RUNNING PRESETS
  // ==========================================
  {
    id: "track-intervals",
    label: "Track Intervals",
    group: "running",
    entryType: "running-workout",
    description: "Structured track segments involving physical sprint-jog repetitions and recovery loops.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "running-workout") return false;
      const surfaceStrProxy = entry.surface ? String(entry.surface).toLowerCase() : "";
      const surfaces = Array.isArray((entry as any).surfaces) 
        ? (entry as any).surfaces 
        : (surfaceStrProxy ? [surfaceStrProxy] : []);
      const hasTrack = surfaces.some((s: string) => String(s).toLowerCase().includes("track"));
      const type = (entry.workoutType || "").toLowerCase();
      const hasInterval = type.includes("interval") || type.includes("repeat");
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const keywords = ((entry as any).searchKeywords || []).map((k: string) => k.toLowerCase());
      const hasTrackOrInterv = [...tags, ...keywords].some(k => k.includes("track") || k.includes("interv") || k.includes("repeat"));
      return hasTrack || hasInterval || hasTrackOrInterv;
    }
  },
  {
    id: "threshold-focus",
    label: "Threshold Focus",
    group: "running",
    entryType: "running-workout",
    description: "Runs aimed near lactate clearance thresholds to expand aerobic capacity thresholds cleanly.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "running-workout") return false;
      const type = (entry.workoutType || "").toLowerCase();
      const title = (entry.title || "").toLowerCase();
      const goals = (entry.trainingGoals || []).map((g: string) => g.toLowerCase());
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const keywords = ((entry as any).searchKeywords || []).map((k: string) => k.toLowerCase());
      const allMeta = [type, title, ...goals, ...tags, ...keywords];
      return allMeta.some((m) => m.includes("threshold") || m.includes("tempo") || m.includes("lt") || m.includes("lactate") || m.includes("critical velocity"));
    }
  },
  {
    id: "vo2-style-intervals",
    label: "VO2-Style Intervals",
    group: "running",
    entryType: "running-workout",
    description: "Anaerobic power repetition blocks configured around 3K-5K goal velocities.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "running-workout") return false;
      const type = (entry.workoutType || "").toLowerCase();
      const title = (entry.title || "").toLowerCase();
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const keywords = ((entry as any).searchKeywords || []).map((k: string) => k.toLowerCase());
      const goals = (entry.trainingGoals || []).map((g: string) => g.toLowerCase());
      const allMeta = [type, title, ...tags, ...keywords, ...goals];
      return allMeta.some((m) => m.includes("vo2") || m.includes("aerobic power") || m.includes("3k pace") || m.includes("5k pace") || m.includes("3k-5k") || m.includes("v02"));
    }
  },
  {
    id: "speed-development",
    label: "Speed Development",
    group: "running",
    entryType: "running-workout",
    description: "Neuro-muscular firing speed sprints designed with substantial standing recoveries.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "running-workout") return false;
      const type = (entry.workoutType || "").toLowerCase();
      const title = (entry.title || "").toLowerCase();
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const keywords = ((entry as any).searchKeywords || []).map((k: string) => k.toLowerCase());
      const goals = (entry.trainingGoals || []).map((g: string) => g.toLowerCase());
      const allMeta = [type, title, ...tags, ...keywords, ...goals];
      return allMeta.some((m) => m.includes("speed") || m.includes("sprint") || m.includes("acceleration") || m.includes("neuromuscular") || m.includes("fast relaxed"));
    }
  },
  {
    id: "sprint-mechanics",
    label: "Sprint Mechanics",
    group: "running",
    entryType: "running-workout",
    description: "Short sprint strides (100m, 200m, 400m block) focusing on rapid vertical impulse forces.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "running-workout") return false;
      const dId = (entry.distanceNavId || "").toLowerCase();
      const inSprintDist = dId === "100m" || dId === "200m" || dId === "400m" || dId === "sprint";
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const keywords = ((entry as any).searchKeywords || []).map((k: string) => k.toLowerCase());
      const title = (entry.title || "").toLowerCase();
      const hasSprint = [...tags, ...keywords, title].some((m) => m.includes("sprint") || m.includes("acceleration") || m.includes("mechanics") || m.includes("block start") || m.includes("drill"));
      return inSprintDist || hasSprint;
    }
  },
  {
    id: "long-run-endurance",
    label: "Long Run / Endurance",
    group: "running",
    entryType: "running-workout",
    description: "Continuous aerobic volume workouts designed to expand fatty acid oxidation systems.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "running-workout") return false;
      const dId = (entry.distanceNavId || "").toLowerCase();
      const isLongDist = dId === "half-marathon" || dId === "marathon" || dId === "ultra" || dId === "general" || dId === "base";
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const keywords = ((entry as any).searchKeywords || []).map((k: string) => k.toLowerCase());
      const title = (entry.title || "").toLowerCase();
      const hasLong = [...tags, ...keywords, title].some((m) => m.includes("long run") || m.includes("endurance") || m.includes("durability") || m.includes("stamina") || m.includes("aerobic capacity"));
      return isLongDist || hasLong;
    }
  },
  {
    id: "treadmill-friendly",
    label: "Treadmill Friendly",
    group: "running",
    entryType: "running-workout",
    description: "Controlled incline/pacing programs easily translated onto automated belt structures.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "running-workout") return false;
      const dId = (entry.distanceNavId || "").toLowerCase();
      const surfaceStrProxy = entry.surface ? String(entry.surface).toLowerCase() : "";
      const surfaces = Array.isArray((entry as any).surfaces) 
        ? (entry as any).surfaces 
        : (surfaceStrProxy ? [surfaceStrProxy] : []);
      const hasTreadmill = surfaces.some((s: string) => String(s).toLowerCase().includes("treadmill"));
      return dId === "treadmill" || hasTreadmill;
    }
  },
  {
    id: "trail-terrain",
    label: "Trail / Terrain",
    group: "running",
    entryType: "running-workout",
    description: "Outdoor mountain climb structures, unpaved surfaces, or slope resistance templates.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "running-workout") return false;
      const dId = (entry.distanceNavId || "").toLowerCase();
      const surfaceStrProxy = entry.surface ? String(entry.surface).toLowerCase() : "";
      const surfaces = Array.isArray((entry as any).surfaces) 
        ? (entry as any).surfaces 
        : (surfaceStrProxy ? [surfaceStrProxy] : []);
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const keywords = ((entry as any).searchKeywords || []).map((k: string) => k.toLowerCase());
      const title = (entry.title || "").toLowerCase();
      const hasTrail = dId === "trail" ||
        surfaces.some((s: string) => String(s).toLowerCase().includes("trail") || String(s).toLowerCase().includes("hill")) ||
        [...tags, ...keywords, title].some((m) => m.includes("trail") || m.includes("hill") || m.includes("terrain") || m.includes("mountain"));
      return hasTrail;
    }
  },

  // ==========================================
  // SUPPORT PRESETS
  // ==========================================
  {
    id: "no-equipment",
    label: "No Equipment",
    group: "support",
    entryType: "support-routine",
    description: "100% bodyweight workouts using standard floor surfaces without requiring extra resistance gyms.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "support-routine") return false;
      const equip = (entry.equipment || []).map((e: string) => e.toLowerCase().trim());
      if (equip.length === 0) return true;
      const hasBodyweight = equip.some(e => e.includes("none") || e.includes("bodyweight") || e.includes("no equipment") || e === "body weight");
      const hasRequiredGear = equip.some(e => {
        const val = e.trim();
        return val !== "" && !val.includes("none") && !val.includes("bodyweight") && !val.includes("no equipment") && !val.includes("mat") && !val.includes("towel") && !val.includes("floor");
      });
      return hasBodyweight || !hasRequiredGear;
    }
  },
  {
    id: "pre-run-warmup",
    label: "Pre-Run Warm-up",
    group: "support",
    entryType: "support-routine",
    description: "Active physical activation protocols designed to elevate joint temperature and fluid dynamics.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "support-routine") return false;
      const cat = (entry.supportCategoryId || "").toLowerCase();
      const routineType = (entry as any).routineType ? String((entry as any).routineType).toLowerCase() : "";
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const title = (entry.title || "").toLowerCase();
      const hasWarmup = cat === "warmup" || cat.includes("warm_up") || cat.includes("warm-up") ||
        routineType.includes("warm") ||
        [...tags, title].some(m => m.includes("warm-up") || m.includes("warmup") || m.includes("pre-run") || m.includes("prep") || m.includes("activation"));
      return hasWarmup;
    }
  },
  {
    id: "post-run-cooldown",
    label: "Post-Run Cooldown",
    group: "support",
    entryType: "support-routine",
    description: "Gentle muscular decompression stretching designed to return muscles to initial resting lengths.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "support-routine") return false;
      const cat = (entry.supportCategoryId || "").toLowerCase();
      const routineType = (entry as any).routineType ? String((entry as any).routineType).toLowerCase() : "";
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const title = (entry.title || "").toLowerCase();
      const hasCooldown = cat === "cooldown" || cat.includes("cooldown") ||
        routineType.includes("cool") ||
        [...tags, title].some(m => m.includes("cooldown") || m.includes("cool-down") || m.includes("post-run") || m.includes("downshift"));
      return hasCooldown;
    }
  },
  {
    id: "mobility-focus",
    label: "Mobility Focus",
    group: "support",
    entryType: "support-routine",
    description: "Stretches and dynamic releases highlighting joint range-of-motion metrics.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "support-routine") return false;
      const cat = (entry.supportCategoryId || "").toLowerCase();
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const title = (entry.title || "").toLowerCase();
      const bodyFocus = ((entry as any).bodyFocus || []).map((b: string) => String(b).toLowerCase());
      const movementGoals = ((entry as any).movementGoals || []).map((m: string) => String(m).toLowerCase());
      const allMeta = [cat, title, ...tags, ...bodyFocus, ...movementGoals];
      return allMeta.some(m => m.includes("mobility") || m.includes("range of motion") || m.includes("rom") || m.includes("flexibility") || m.includes("stretch"));
    }
  },
  {
    id: "strength-support",
    label: "Strength Support",
    group: "support",
    entryType: "support-routine",
    description: "Targeted localized force resistance templates to solidify athlete physical armor.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "support-routine") return false;
      const cat = (entry.supportCategoryId || "").toLowerCase();
      const isStrengthCat = cat.includes("strength") || cat === "core" || cat === "upper-strength" || cat === "lower-strength" || cat === "core-stability";
      const routineType = (entry as any).routineType ? String((entry as any).routineType).toLowerCase() : "";
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const title = (entry.title || "").toLowerCase();
      const hasStrength = isStrengthCat ||
        routineType.includes("strength") ||
        [...tags, title].some(m => m.includes("strength") || m.includes("hypertrophy") || m.includes("resistance") || m.includes("weights"));
      return hasStrength;
    }
  },
  {
    id: "core-stability",
    label: "Core Stability",
    group: "support",
    entryType: "support-routine",
    description: "Abdominal/trunk posture isometric drills focusing on spinal anti-rotation mechanics under pace loading.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "support-routine") return false;
      const cat = (entry.supportCategoryId || "").toLowerCase();
      const isCoreCat = cat === "core" || cat === "core_stability" || cat === "core-stability";
      const bodyFocus = ((entry as any).bodyFocus || []).map((b: string) => String(b).toLowerCase());
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const title = (entry.title || "").toLowerCase();
      const hasCore = isCoreCat ||
        bodyFocus.some(b => b.includes("core") || b.includes("trunk") || b.includes("abs") || b.includes("stability") || b.includes("abdominals")) ||
        [...tags, title].some(m => m.includes("core") || m.includes("stability") || m.includes("pilates"));
      return hasCore;
    }
  },
  {
    id: "plyometric-low-impact",
    label: "Plyometric Low Impact",
    group: "support",
    entryType: "support-routine",
    description: "Slight jumping drills structured safely with moderate difficulty scores for tendon elasticity.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "support-routine") return false;
      const cat = (entry.supportCategoryId || "").toLowerCase();
      const isPlyo = cat === "plyometric" || cat.includes("plyo") || (entry.title || "").toLowerCase().includes("plyometric");
      const risk = (entry.risk || "").toLowerCase();
      const isLowMod = risk === "low" || risk === "medium" || risk === "moderate";
      const diff = entry.difficulty || 0;
      const isLowDiff = diff <= 5;
      return isPlyo && isLowMod && isLowDiff;
    }
  },
  {
    id: "recovery-routine",
    label: "Recovery Routine",
    group: "support",
    entryType: "support-routine",
    description: "Restorative tissues compression releases and muscle resetting routines.",
    apply: (entry: Workout) => {
      if (entry.entryType !== "support-routine") return false;
      const cat = (entry.supportCategoryId || "").toLowerCase();
      const tags = (entry.tags || []).map((t: string) => t.toLowerCase());
      const title = (entry.title || "").toLowerCase();
      const hasRecovery = cat === "recovery" || cat === "recovery_routine" || cat === "recovery-routine" ||
        [...tags, title].some(m => m.includes("recovery") || m.includes("reset") || m.includes("restoration") || m.includes("regeneration"));
      return hasRecovery;
    }
  }
];
