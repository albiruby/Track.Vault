/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 * Display title helper for Track.Vault
 */

export function sanitizeWorkoutTitle(title: string | undefined): string {
  if (!title) return "";
  return title
    .replace(/\s*[\[\(]Set\s*\d+[\]\)]\s*$/i, "")
    .replace(/\s*[-–—]?\s*Set\s*\d+\s*$/i, "")
    .trim();
}

/**
 * Returns a compatible default export template ID based on the entry type and attributes.
 */
export function getDefaultExportTemplateForEntry(workout: any): string {
  if (!workout) return "minimal";
  
  const isSupport = workout.entryType === "support-routine" || 
                    workout.entryType === "custom-support-routine" || 
                    workout.supportCategoryId !== undefined || 
                    !!workout.sessionStructure;
                  
  if (isSupport) {
    const titleLower = (workout.title || "").toLowerCase();
    const catLower = (workout.supportCategoryId || "").toLowerCase();
    
    if (titleLower.includes("warm-up") || titleLower.includes("warmup") || titleLower.includes("activation") || catLower.includes("warm_up") || catLower.includes("activation")) {
      return "warmup";
    }
    if (titleLower.includes("cooldown") || titleLower.includes("cool-down") || titleLower.includes("reset") || catLower.includes("cooldown") || catLower.includes("cool_down")) {
      return "cooldown";
    }
    if (titleLower.includes("mobility") || titleLower.includes("flexibility") || catLower.includes("mobility") || catLower.includes("flexibility")) {
      return "mobility";
    }
    if (titleLower.includes("strength") || titleLower.includes("power") || titleLower.includes("core") || catLower.includes("strength") || catLower.includes("power") || catLower.includes("core")) {
      return "strength";
    }
    return "support"; // Default support template ID
  } else {
    // For running
    const titleLower = (workout.title || "").toLowerCase();
    if (titleLower.includes("interval") || titleLower.includes("tempo") || titleLower.includes("fartlek") || titleLower.includes("speed")) {
      return "interval";
    }
    return "minimal"; // Default running template ID
  }
}
