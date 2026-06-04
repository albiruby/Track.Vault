/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ValidationItem {
  id: string; // unique rule slug
  label: string; // High-level title
  status: "pass" | "warning" | "error"; // validation outcome
  message: string; // clear instructions for the runner
  category: "warmup" | "mainset" | "cooldown" | "safety" | "metadata" | "exercises" | "equipment";
}

export type DraftStatus = "Ready to Export" | "Needs Attention" | "Missing Core Structure" | "Safety Notes Recommended" | "Draft In Progress";

export interface ValidationResult {
  isValid: boolean; // meets standard criteria to save/export
  status: DraftStatus; // Non-gimmick status label from deterministic checks
  items: ValidationItem[];
}

/**
 * Validates a running workout draft strictly using deterministic structural logic.
 */
export function validateRunningWorkoutDraft(workout: any, intensityGuide: any): ValidationResult {
  const items: ValidationItem[] = [];

  const warmup = Array.isArray(workout.warmup) ? workout.warmup : [];
  const mainSet = Array.isArray(workout.mainSet) ? workout.mainSet : [];
  const cooldown = Array.isArray(workout.cooldown) ? workout.cooldown : [];
  const title = workout.title || "";
  const summary = workout.summary || "";
  const estimatedDuration = Number(workout.estimatedDurationMin || 0);
  const safetyNotes = Array.isArray(workout.safetyNotes) ? workout.safetyNotes : [];
  const coachingNotes = Array.isArray(workout.coachingNotes) ? workout.coachingNotes : [];

  // Rule 1: Warmup Presence
  if (warmup.length === 0) {
    items.push({
      id: "run-warmup-missing",
      label: "Warmup Structure",
      status: "warning",
      message: "No warmup structure declared. Highly recommended for pacing readiness and standard injury prevention.",
      category: "warmup"
    });
  } else {
    items.push({
      id: "run-warmup-ok",
      label: "Warmup Structure",
      status: "pass",
      message: `Warmup calibrated with ${warmup.length} active drills or light jog sets.`,
      category: "warmup"
    });
  }

  // Rule 2: Main Set Requirements (Blocking constraint)
  if (mainSet.length === 0) {
    items.push({
      id: "run-mainset-empty",
      label: "Main Set Programming",
      status: "error",
      message: "Empty Main Set. Cannot save or export a draft with an unprogrammed training focus.",
      category: "mainset"
    });
  } else {
    items.push({
      id: "run-mainset-ok",
      label: "Main Set Programming",
      status: "pass",
      message: `Interval set targets established with ${mainSet.length} structured blocks.`,
      category: "mainset"
    });
  }

  // Rule 3: Cooldown Verification
  if (cooldown.length === 0) {
    items.push({
      id: "run-cooldown-missing",
      label: "Cooldown Verification",
      status: "warning",
      message: "No cooldown block compiled. Indispensable for optimal muscular recovery and cardiac settle.",
      category: "cooldown"
    });
  } else {
    items.push({
      id: "run-cooldown-ok",
      label: "Cooldown Verification",
      status: "pass",
      message: "Cooldown segment successfully appended.",
      category: "cooldown"
    });
  }

  // Rule 4: Total Duration Summation Comparison
  let calculatedDurationSec = 0;
  
  // Calculate block durations
  const sumBlockDuration = (block: any) => {
    let dur = 0;
    const reps = Number(block.repetitions || 1);
    
    // Work side
    const work = block.work || {};
    if (work.durationSeconds) {
      dur += Number(work.durationSeconds);
    } else if (work.distanceMeters) {
      // Estimate 5 mins / km for simple mathematical validation fallback
      dur += (Number(work.distanceMeters) / 1000) * 300;
    }

    // Recovery side
    const rec = block.recovery || {};
    if (rec.durationSeconds) {
      dur += Number(rec.durationSeconds);
    } else if (rec.distanceMeters) {
      dur += (Number(rec.distanceMeters) / 1000) * 300;
    }

    return dur * reps;
  };

  warmup.forEach(b => { calculatedDurationSec += sumBlockDuration(b); });
  mainSet.forEach(b => { calculatedDurationSec += sumBlockDuration(b); });
  cooldown.forEach(b => { calculatedDurationSec += sumBlockDuration(b); });

  const calculatedDurationMin = Math.round(calculatedDurationSec / 60);

  if (estimatedDuration > 0 && Math.abs(calculatedDurationMin - estimatedDuration) > 15) {
    items.push({
      id: "run-duration-mismatch",
      label: "Duration Calibration",
      status: "warning",
      message: `Duration Mismatch: Estimated total duration (${estimatedDuration} min) does not coordinate with the aggregated intervals duration (~${calculatedDurationMin} min).`,
      category: "metadata"
    });
  }

  // Rule 5: High Intensity Safety Alignment
  // Detect if there are references to intense velocities or pacings
  const intenseWords = ["speed", "sprint", "mile pace", "fast", "vo2max", "v02max", "threshold", "reps", "3000m pace", "1500m pace"];
  const hasIntenseBlocks = mainSet.some(b => {
    const desc = (b.name || "").toLowerCase() + " " + (b.description || "").toLowerCase();
    const targetIntensity = (b.work?.intensity || "").toLowerCase();
    return intenseWords.some(w => desc.includes(w) || targetIntensity.includes(w));
  });

  const safetyJoined = (safetyNotes.join(" ") + " " + coachingNotes.join(" ")).toLowerCase();
  const listsSafetyWarning = ["safety", "hydration", "caution", "activation", "stretch", "warm", "dynamic", "pacing"];
  const hasSafetyPrecautions = listsSafetyWarning.some(w => safetyJoined.includes(w));

  if (hasIntenseBlocks && !hasSafetyPrecautions) {
    items.push({
      id: "run-safety-intense-missing",
      label: "High Intensity Safety Guides",
      status: "warning",
      message: "Draft programs high velocity thresholds but coaching or safety notes lack core guidance on muscle activation triggers.",
      category: "safety"
    });
  } else if (hasIntenseBlocks) {
    items.push({
      id: "run-safety-intense-ok",
      label: "High Intensity Safety Guides",
      status: "pass",
      message: "Safety cautions and physical muscle activation advice included for high velocity runs.",
      category: "safety"
    });
  }

  const errorsCount = items.filter(it => it.status === "error").length;
  const warningsCount = items.filter(it => it.status === "warning").length;
  const isValid = errorsCount === 0;

  // Derive non-gimmick status
  const titleTrimmed = (workout.title || "").trim();
  const isDraftEmpty = (!titleTrimmed && warmup.length === 0 && mainSet.length === 0 && cooldown.length === 0);

  let status: DraftStatus = "Ready to Export";
  if (isDraftEmpty || (!titleTrimmed && mainSet.length === 0)) {
    status = "Draft In Progress";
  } else if (errorsCount > 0) {
    status = "Missing Core Structure";
  } else if (items.some(it => it.id === "run-safety-intense-missing")) {
    status = "Safety Notes Recommended";
  } else if (warningsCount > 0) {
    status = "Needs Attention";
  }

  return { isValid, status, items };
}

/**
 * Validates a support routine draft strictly using deterministic structural logic.
 */
export function validateSupportRoutineDraft(routine: any): ValidationResult {
  const items: ValidationItem[] = [];

  const exercises = Array.isArray(routine.exercises) ? routine.exercises : [];
  const durationMin = Number(routine.durationMin || routine.estimatedDurationMin || 0);
  const bodyFocus = Array.isArray(routine.bodyFocus) ? routine.bodyFocus : [];
  const equipment = Array.isArray(routine.equipment) ? routine.equipment : [];
  const summary = routine.summary || "";
  const structure = routine.sessionStructure || "";

  // Rule 1: Exercise Count Check (Needs at least 3 distinct exercises)
  if (exercises.length < 3) {
    items.push({
      id: "sup-exercise-count-low",
      label: "Exercise Volume",
      status: "warning",
      message: `Insufficient Activity Set (${exercises.length}/3 exercises). Support-routines require at least 3 distinct movement protocols to keep physical balance.`,
      category: "exercises"
    });
  } else {
    items.push({
      id: "sup-exercise-count-ok",
      label: "Exercise Volume",
      status: "pass",
      message: `Calibrated with ${exercises.length} targeting exercise blocks.`,
      category: "exercises"
    });
  }

  // Rule 2: Body Focus Align with Movement Goals / Structured Descriptions
  const focusMatches = bodyFocus.some(focus => {
    const fLower = focus.toLowerCase();
    const sumLower = summary.toLowerCase();
    const strLower = structure.toLowerCase();
    const matchExs = exercises.some(ex => {
      const exTxt = (typeof ex === "string" ? ex : ex.name || "").toLowerCase();
      return exTxt.includes(fLower);
    });
    return sumLower.includes(fLower) || strLower.includes(fLower) || matchExs;
  });

  if (bodyFocus.length > 0 && !focusMatches) {
    items.push({
      id: "sup-body-focus-unaligned",
      label: "Anatomical Target Matching",
      status: "warning",
      message: `Your declared targeted muscles/joints (${bodyFocus.join(", ")}) aren't highlighted in active workout instruction lines.`,
      category: "metadata"
    });
  } else if (bodyFocus.length > 0) {
    items.push({
      id: "sup-body-focus-ok",
      label: "Anatomical Target Matching",
      status: "pass",
      message: `Target anatomical groups aligned with movement protocols description.`,
      category: "metadata"
    });
  }

  // Rule 3: Duration Boundary Check (Limit between 10-60 mins)
  if (durationMin < 10 || durationMin > 60) {
    items.push({
      id: "sup-duration-out-of-bounds",
      label: "Duration Bound",
      status: "warning",
      message: "Routine duration should be 10 to 60 mins. Out-of-bounds loading triggers counterproductive performance outcome.",
      category: "metadata"
    });
  } else {
    items.push({
      id: "sup-duration-ok",
      label: "Duration Bound",
      status: "pass",
      message: `Standard active duration (~${durationMin} min) is aligned for functional training.`,
      category: "metadata"
    });
  }

  // Rule 4: Equipment Synchronization Check
  // Ensure that each declared item (e.g. foam roller, bands) is described in active lists
  const missingEquipments = equipment.filter(eq => {
    const eqLower = eq.toLowerCase().trim();
    if (eqLower === "none" || eqLower === "bodyweight") return false;
    
    // Check exercises text
    const inExercises = exercises.some(ex => {
      const txt = (typeof ex === "string" ? ex : ex.name || "").toLowerCase();
      return txt.includes(eqLower);
    });

    // Check summary & structure
    const inStructure = (summary + " " + structure).toLowerCase().includes(eqLower);
    return !inExercises && !inStructure;
  });

  if (missingEquipments.length > 0) {
    items.push({
      id: "sup-equipment-not-used",
      label: "Hardware Alignment",
      status: "warning",
      message: `Accessories listed as required but omitted in drill instructions: ${missingEquipments.join(", ")}.`,
      category: "equipment"
    });
  } else if (equipment.length > 0) {
    items.push({
      id: "sup-equipment-ok",
      label: "Hardware Alignment",
      status: "pass",
      message: "Hardware items coordinate with active training drills descriptions.",
      category: "equipment"
    });
  }

  const errorsCount = items.filter(it => it.status === "error").length;
  const warningsCount = items.filter(it => it.status === "warning").length;
  const isValid = errorsCount === 0;

  // Derive non-gimmick status
  const titleTrimmed = (routine.title || "").trim();
  const isDraftEmpty = (!titleTrimmed && exercises.length === 0);

  let status: DraftStatus = "Ready to Export";
  if (isDraftEmpty || (!titleTrimmed && exercises.length === 0)) {
    status = "Draft In Progress";
  } else if (errorsCount > 0) {
    status = "Missing Core Structure";
  } else if (warningsCount > 0) {
    status = "Needs Attention";
  }

  return { isValid, status, items };
}
