/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrackVaultEntry } from "../types/workout";

export function getBaseEntryType(et: string): "running" | "support" {
  if (!et) return "running";
  const lower = et.toLowerCase();
  if (lower.includes("support")) return "support";
  return "running";
}

/**
 * Normalizes difficulty value of a workout/routine into a deterministic numerical scale (1-10).
 */
export function getDifficultyNumber(entry: any): number {
  if (!entry) return 0;
  if (typeof entry.difficulty === "number") return entry.difficulty;
  const diff = entry.difficulty || entry.rawDifficulty;
  if (typeof diff === "number") return diff;
  if (typeof diff === "string") {
    const dLower = diff.toLowerCase();
    if (dLower === "easy" || dLower === "beginner") return 2;
    if (dLower === "moderate" || dLower === "intermediate") return 5;
    if (dLower === "moderate-hard") return 7;
    if (dLower === "hard" || dLower === "advanced") return 8;
    if (dLower === "very-hard" || dLower === "elite") return 10;
  }
  return 5;
}

/**
 * Normalizes and extracts comparable duration in minutes.
 */
export function getDurationComparable(entry: any): number {
  if (!entry) return 0;
  if (typeof entry.estimatedDurationMin === "number") return entry.estimatedDurationMin;
  if (typeof entry.durationMin === "number") return entry.durationMin;
  const rawDur = entry.estimatedDurationMin !== undefined ? entry.estimatedDurationMin : entry.durationMin;
  if (rawDur && typeof rawDur === "object") {
    return Math.round(((rawDur.min + rawDur.max) / 2));
  }
  return 0;
}

/**
 * Matches overlapping search keywords and tags, outputting lowercased intersections.
 */
export function getSharedTags(a: any, b: any): string[] {
  const listA = [
    ...(Array.isArray(a.tags) ? a.tags : []),
    ...(Array.isArray(a.searchKeywords) ? a.searchKeywords : [])
  ].map(t => String(t).toLowerCase().trim());
  
  const listB = [
    ...(Array.isArray(b.tags) ? b.tags : []),
    ...(Array.isArray(b.searchKeywords) ? b.searchKeywords : [])
  ].map(t => String(t).toLowerCase().trim());

  return Array.from(new Set(listA.filter(t => listB.includes(t))));
}

/**
 * Scores candidate running workouts against the current running workout.
 * High-weight (+10), Medium-weight (+5), Low-weight (+2, +1).
 */
export function scoreRunningSimilarity(current: any, candidate: any): number {
  if (candidate.id === current.id || candidate.slug === current.slug) return -1;
  if (!candidate.slug || !candidate.title || candidate.title.trim() === "") return -1;
  if (getBaseEntryType(candidate.entryType) !== getBaseEntryType(current.entryType)) return -1;

  let score = 0;

  // High-weight signals (+10 pts each)
  if (current.distanceNavId && candidate.distanceNavId === current.distanceNavId) score += 10;
  if (current.workoutType && candidate.workoutType === current.workoutType) score += 10;
  if (current.phase && candidate.phase === current.phase) score += 10;
  if (current.level && candidate.level === current.level) score += 10;

  // Medium-weight signals
  const currentDiff = getDifficultyNumber(current);
  const candidateDiff = getDifficultyNumber(candidate);
  if (currentDiff === candidateDiff) {
    score += 5;
  } else if (Math.abs(currentDiff - candidateDiff) <= 1) {
    score += 3;
  } else if (Math.abs(currentDiff - candidateDiff) <= 2) {
    score += 1;
  }

  if (current.risk && candidate.risk === current.risk) score += 5;

  const currentSurface = Array.isArray(current.surface) ? current.surface[0] : current.surface;
  const candidateSurface = Array.isArray(candidate.surface) ? candidate.surface[0] : candidate.surface;
  if (currentSurface && candidateSurface && currentSurface === candidateSurface) score += 5;

  // Overlapping training goals (e.g. from workout trainingGoals or keyword pools)
  const currentGoals = current.trainingGoals || [];
  const candidateGoals = candidate.trainingGoals || [];
  const sharedGoals = currentGoals.filter((g: string) => candidateGoals.includes(g));
  if (sharedGoals.length > 0) {
    score += 5 * sharedGoals.length;
  }

  // Intersections of key tags
  const sharedTags = getSharedTags(current, candidate);
  if (sharedTags.length > 0) {
    score += 2 * sharedTags.length;
  }

  // Low-weight signals
  const currentDur = getDurationComparable(current);
  const candidateDur = getDurationComparable(candidate);
  if (currentDur > 0 && candidateDur > 0) {
    const durDiff = Math.abs(currentDur - candidateDur);
    if (durDiff <= 5) score += 2;
    else if (durDiff <= 15) score += 1;
  }

  const currentDist = current.estimatedDistanceKm || 0;
  const candidateDist = candidate.estimatedDistanceKm || 0;
  if (currentDist > 0 && candidateDist > 0) {
    const distDiff = Math.abs(currentDist - candidateDist);
    if (distDiff <= 1) score += 2;
    else if (distDiff <= 3) score += 1;
  }

  const currentIG = current.intensityGuide;
  const candidateIG = candidate.intensityGuide;
  if (currentIG && candidateIG) {
    if (currentIG.general && candidateIG.general && currentIG.general === candidateIG.general) score += 1;
    if (currentIG.mainSet && candidateIG.mainSet && currentIG.mainSet === candidateIG.mainSet) score += 1;
  }

  return score;
}

/**
 * Scores candidate support-routines against the current support routine.
 * High-weight (+10), Medium-weight (+5), Low-weight (+2).
 */
export function scoreSupportSimilarity(current: any, candidate: any): number {
  if (candidate.id === current.id || candidate.slug === current.slug) return -1;
  if (!candidate.slug || !candidate.title || candidate.title.trim() === "") return -1;
  if (getBaseEntryType(candidate.entryType) !== getBaseEntryType(current.entryType)) return -1;

  let score = 0;

  // High-weight signals (+10 pts each)
  if (current.supportCategoryId && candidate.supportCategoryId === current.supportCategoryId) score += 10;
  if (current.routineType && candidate.routineType === current.routineType) score += 10;
  
  const currentBodyFocus = current.bodyFocus || [];
  const candidateBodyFocus = candidate.bodyFocus || [];
  const sharedBodyFocus = currentBodyFocus.filter((bf: string) => candidateBodyFocus.includes(bf));
  if (sharedBodyFocus.length > 0) {
    score += 10 * sharedBodyFocus.length;
  }

  // Medium-weight signals
  const currentMovementGoals = current.movementGoals || [];
  const candidateMovementGoals = candidate.movementGoals || [];
  const sharedMovementGoals = currentMovementGoals.filter((mg: string) => candidateMovementGoals.includes(mg));
  if (sharedMovementGoals.length > 0) {
    score += 5 * sharedMovementGoals.length;
  }

  const currentEquipment = current.equipment || [];
  const candidateEquipment = candidate.equipment || [];
  const sharedEquipment = currentEquipment.filter((eq: string) => candidateEquipment.includes(eq));
  if (sharedEquipment.length > 0) {
    score += 5 * sharedEquipment.length;
  }

  if (current.level && candidate.level === current.level) score += 5;
  if (current.risk && candidate.risk === current.risk) score += 5;

  const currentDur = getDurationComparable(current);
  const candidateDur = getDurationComparable(candidate);
  if (currentDur > 0 && candidateDur > 0) {
    const durDiff = Math.abs(currentDur - candidateDur);
    if (durDiff <= 5) score += 5;
    else if (durDiff <= 10) score += 3;
    else if (durDiff <= 20) score += 1;
  }

  // Low-weight signals
  const sharedTags = getSharedTags(current, candidate);
  if (sharedTags.length > 0) {
    score += 2 * sharedTags.length;
  }

  if (current.phase && candidate.phase === current.phase) score += 2;

  return score;
}

/**
 * Matches comparable categories, goals, muscles, difficulties & risk to build reason chips.
 */
export function getRelatedReasonLabels(currentEntry: any, candidate: any): string[] {
  const reasons: string[] = [];
  if (!currentEntry || !candidate) return reasons;

  const isRunning = currentEntry.entryType === "running-workout";

  // Category Matching
  if (isRunning) {
    if (currentEntry.distanceNavId && candidate.distanceNavId === currentEntry.distanceNavId) {
      reasons.push("Same distance");
    }
  } else {
    if (currentEntry.supportCategoryId && candidate.supportCategoryId === currentEntry.supportCategoryId) {
      reasons.push("Same category");
    }
  }

  // Goal & Focus Matching
  if (isRunning) {
    const currentGoals = currentEntry.trainingGoals || [];
    const candidateGoals = candidate.trainingGoals || [];
    if (currentGoals.some((g: string) => candidateGoals.includes(g))) {
      reasons.push("Same goal");
    } else if (currentEntry.workoutType && candidate.workoutType === currentEntry.workoutType) {
      reasons.push("Same goal");
    }
  } else {
    const currentMovementGoals = currentEntry.movementGoals || [];
    const candidateMovementGoals = candidate.movementGoals || [];
    if (currentMovementGoals.some((g: string) => candidateMovementGoals.includes(g))) {
      reasons.push("Same goal");
    }
  }

  // Anatomy Body Focus (Support)
  if (!isRunning) {
    const currentBodyFocus = currentEntry.bodyFocus || [];
    const candidateBodyFocus = candidate.bodyFocus || [];
    if (currentBodyFocus.some((bf: string) => candidateBodyFocus.includes(bf))) {
      reasons.push("Same body focus");
    }
  }

  // Difficulty & Progression Matching
  const currentDiff = getDifficultyNumber(currentEntry);
  const candidateDiff = getDifficultyNumber(candidate);
  if (candidateDiff < currentDiff) {
    reasons.push("Lower difficulty");
  } else if (candidateDiff > currentDiff) {
    reasons.push("Higher difficulty");
  } else if (currentDiff > 0 && candidateDiff === currentDiff) {
    reasons.push("Same level");
  }

  // Risk Variance
  const riskOrder: Record<string, number> = { "low": 1, "medium": 2, "high": 3, "very-high": 4 };
  const currRisk = riskOrder[(currentEntry.risk || "").toLowerCase()] || 0;
  const candRisk = riskOrder[(candidate.risk || "").toLowerCase()] || 0;
  if (candRisk < currRisk) {
    reasons.push("Lower risk");
  }

  // Duration variance
  const currentDur = getDurationComparable(currentEntry);
  const candidateDur = getDurationComparable(candidate);
  if (currentDur > 0 && candidateDur > 0) {
    if (candidateDur < currentDur && (currentDur - candidateDur) >= 10) {
      reasons.push("Shorter duration");
    } else if (candidateDur > currentDur && (candidateDur - currentDur) >= 10) {
      reasons.push("Longer structure");
    } else if (Math.abs(currentDur - candidateDur) <= 5) {
      reasons.push("Similar duration");
    }
  }

  if (reasons.length === 0) {
    reasons.push("Related structure");
  }

  return Array.from(new Set(reasons)).slice(0, 3);
}

/**
 * Returns similar library entries sorted by overall score.
 */
export function getSimilarEntries(currentEntry: TrackVaultEntry, allEntries: TrackVaultEntry[], limit = 6): TrackVaultEntry[] {
  if (!currentEntry) return [];
  const candidates = allEntries.filter(candidate => {
    if (candidate.id === currentEntry.id || candidate.slug === currentEntry.slug) return false;
    if (!candidate.slug || !candidate.title || candidate.title.trim() === "") return false;
    if (getBaseEntryType(candidate.entryType) !== getBaseEntryType(currentEntry.entryType)) return false;
    return true;
  });

  const isRunning = currentEntry.entryType === "running-workout";
  const scored = candidates.map(candidate => {
    const score = isRunning
      ? scoreRunningSimilarity(currentEntry, candidate)
      : scoreSupportSimilarity(currentEntry, candidate);
    return { candidate, score };
  });

  const sorted = scored
    .filter(item => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.candidate.title.localeCompare(b.candidate.title);
    });

  return sorted.map(item => item.candidate).slice(0, limit);
}

/**
 * Returns easier alternative entries of the same type.
 * Ensures the candidate is strictly easier in numerical difficulty, same/lower risk, and similar/lower duration.
 */
export function getEasierEntries(currentEntry: TrackVaultEntry, allEntries: TrackVaultEntry[], limit = 4): TrackVaultEntry[] {
  if (!currentEntry) return [];
  const currentDiff = getDifficultyNumber(currentEntry);
  const currentDur = getDurationComparable(currentEntry);

  const riskOrder: Record<string, number> = { "low": 1, "medium": 2, "high": 3, "very-high": 4 };
  const currentRiskNum = riskOrder[(currentEntry.risk || "").toLowerCase()] || 0;

  const candidates = allEntries.filter(candidate => {
    if (candidate.id === currentEntry.id || candidate.slug === currentEntry.slug) return false;
    if (!candidate.slug || !candidate.title || candidate.title.trim() === "") return false;
    if (getBaseEntryType(candidate.entryType) !== getBaseEntryType(currentEntry.entryType)) return false;

    const candDiff = getDifficultyNumber(candidate);
    if (candDiff >= currentDiff) return false;

    const candRiskNum = riskOrder[(candidate.risk || "").toLowerCase()] || 0;
    if (candRiskNum > currentRiskNum) return false;

    const candDur = getDurationComparable(candidate);
    if (currentDur > 0 && candDur > currentDur + 10) return false;

    return true;
  });

  const isRunning = currentEntry.entryType === "running-workout";
  const scored = candidates.map(candidate => {
    let score = 0;
    const candDiff = getDifficultyNumber(candidate);
    const candDur = getDurationComparable(candidate);

    if (isRunning) {
      if ((candidate as any).distanceNavId && (candidate as any).distanceNavId === (currentEntry as any).distanceNavId) score += 10;
      if ((candidate as any).workoutType && (candidate as any).workoutType === (currentEntry as any).workoutType) score += 8;
    } else {
      if ((candidate as any).supportCategoryId && (candidate as any).supportCategoryId === (currentEntry as any).supportCategoryId) score += 10;
      if ((candidate as any).routineType && (candidate as any).routineType === (currentEntry as any).routineType) score += 8;
    }

    const diffGap = currentDiff - candDiff;
    score += (10 - diffGap);

    if (currentDur > 0 && candDur > 0) {
      if (candDur < currentDur) score += 5;
      else if (Math.abs(candDur - currentDur) <= 5) score += 3;
    }

    return { candidate, score };
  });

  const sorted = scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.candidate.title.localeCompare(b.candidate.title);
    });

  return sorted.map(item => item.candidate).slice(0, limit);
}

/**
 * Returns harder alternative entries of the same type.
 * Restricts huge beginner-to-hard hops and manages risk progression safely.
 */
export function getHarderEntries(currentEntry: TrackVaultEntry, allEntries: TrackVaultEntry[], limit = 4): TrackVaultEntry[] {
  if (!currentEntry) return [];
  const currentDiff = getDifficultyNumber(currentEntry);
  const currentDur = getDurationComparable(currentEntry);

  const riskOrder: Record<string, number> = { "low": 1, "medium": 2, "high": 3, "very-high": 4 };
  const currentRiskNum = riskOrder[(currentEntry.risk || "").toLowerCase()] || 0;

  const candidates = allEntries.filter(candidate => {
    if (candidate.id === currentEntry.id || candidate.slug === currentEntry.slug) return false;
    if (!candidate.slug || !candidate.title || candidate.title.trim() === "") return false;
    if (getBaseEntryType(candidate.entryType) !== getBaseEntryType(currentEntry.entryType)) return false;

    const candDiff = getDifficultyNumber(candidate);
    if (candDiff <= currentDiff) return false;

    // Beginner difficulty (<= 4) cannot hop straight to Advanced/Elite (>= 8)
    if (currentDiff <= 4 && candDiff >= 8) return false;

    // Safety: only allow +1 risk segment jump max
    const candRiskNum = riskOrder[(candidate.risk || "").toLowerCase()] || 0;
    if (candRiskNum > currentRiskNum + 1) return false;

    return true;
  });

  const isRunning = currentEntry.entryType === "running-workout";
  const scored = candidates.map(candidate => {
    let score = 0;
    const candDiff = getDifficultyNumber(candidate);
    const candDur = getDurationComparable(candidate);

    if (isRunning) {
      if ((candidate as any).distanceNavId && (candidate as any).distanceNavId === (currentEntry as any).distanceNavId) score += 10;
      if ((candidate as any).workoutType && (candidate as any).workoutType === (currentEntry as any).workoutType) score += 8;
    } else {
      if ((candidate as any).supportCategoryId && (candidate as any).supportCategoryId === (currentEntry as any).supportCategoryId) score += 10;
      if ((candidate as any).routineType && (candidate as any).routineType === (currentEntry as any).routineType) score += 8;
    }

    const diffGap = candDiff - currentDiff;
    score += (10 - diffGap);

    const candRiskNum = riskOrder[(candidate.risk || "").toLowerCase()] || 0;
    if (candRiskNum === currentRiskNum) {
      score += 5;
    } else if (candRiskNum === currentRiskNum + 1) {
      score += 2;
    }

    if (currentDur > 0 && candDur > 0) {
      if (candDur > currentDur) score += 3;
    }

    return { candidate, score };
  });

  const sorted = scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.candidate.title.localeCompare(b.candidate.title);
    });

  return sorted.map(item => item.candidate).slice(0, limit);
}

/**
 * Returns options with overlapping coaching goals, movement goals, or muscle groups.
 */
export function getSameGoalEntries(currentEntry: TrackVaultEntry, allEntries: TrackVaultEntry[], limit = 6): TrackVaultEntry[] {
  if (!currentEntry) return [];
  const candidates = allEntries.filter(candidate => {
    if (candidate.id === currentEntry.id || candidate.slug === currentEntry.slug) return false;
    if (!candidate.slug || !candidate.title || candidate.title.trim() === "") return false;
    if (getBaseEntryType(candidate.entryType) !== getBaseEntryType(currentEntry.entryType)) return false;
    return true;
  });

  const isRunning = currentEntry.entryType === "running-workout";
  const scored = candidates.map(candidate => {
    let score = 0;

    if (isRunning) {
      const currentGoals = (currentEntry as any).trainingGoals || [];
      const candidateGoals = (candidate as any).trainingGoals || [];
      const sharedGoals = currentGoals.filter((g: string) => candidateGoals.includes(g));
      if (sharedGoals.length > 0) {
        score += 15 * sharedGoals.length;
      }
      
      if ((currentEntry as any).workoutType && (candidate as any).workoutType === (currentEntry as any).workoutType) {
        score += 10;
      }

      if ((currentEntry as any).distanceNavId && (candidate as any).distanceNavId === (currentEntry as any).distanceNavId) {
        score += 5;
      }
    } else {
      const currentMovementGoals = (currentEntry as any).movementGoals || [];
      const candidateMovementGoals = (candidate as any).movementGoals || [];
      const sharedMovement = currentMovementGoals.filter((mg: string) => candidateMovementGoals.includes(mg));
      if (sharedMovement.length > 0) {
        score += 15 * sharedMovement.length;
      }

      const currentBodyFocus = (currentEntry as any).bodyFocus || [];
      const candidateBodyFocus = (candidate as any).bodyFocus || [];
      const sharedBody = currentBodyFocus.filter((bf: string) => candidateBodyFocus.includes(bf));
      if (sharedBody.length > 0) {
        score += 10 * sharedBody.length;
      }

      if ((currentEntry as any).supportCategoryId && (candidate as any).supportCategoryId === (currentEntry as any).supportCategoryId) {
        score += 5;
      }
    }

    return { candidate, score };
  });

  const sorted = scored
    .filter(item => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.candidate.title.localeCompare(b.candidate.title);
    });

  return sorted.map(item => item.candidate).slice(0, limit);
}
