/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const COMPARE_STORAGE_KEY = "trackvault_compare_tray_v1";

export interface CompareTrayItem {
  localCompareId: string;
  entryId?: string; // Curated entry ID if applicable
  localId?: string;  // Local saved vault item ID if applicable
  slug?: string;     // URL slug
  title: string;
  entryType: string; // 'running-workout', 'support-routine', 'custom-running-workout', 'custom-support-routine'
  data: any;         // Real work payload (RunningWorkout or SupportRoutine)
}

/**
 * Gets all comparison tray entries from localStorage.
 */
export function getCompareTray(): CompareTrayItem[] {
  if (typeof window === "undefined") return [];
  try {
    const val = localStorage.getItem(COMPARE_STORAGE_KEY);
    if (val) {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (err) {
    console.error("Failed to read compare tray from localStorage:", err);
  }
  return [];
}

/**
 * Checks if a given item is already in the comparison tray.
 */
export function isItemInCompareTray(entry: any): boolean {
  if (!entry) return false;
  const list = getCompareTray();
  const targetId = entry.localId || entry.id;
  const targetSlug = entry.slug;

  return list.some(item => {
    if (targetId && (item.entryId === targetId || item.localId === targetId)) {
      return true;
    }
    if (targetSlug && item.slug === targetSlug) {
      return true;
    }
    return false;
  });
}

/**
 * Adds an item to the comparison tray, enforcing a hard limit of 3.
 * Returns results indicating success or failure reasons.
 */
export function addToCompareTray(
  entry: any,
  options: { forceReplaceOldest?: boolean } = {}
): {
  success: boolean;
  error?: "limit_reached" | "already_exists";
  items: CompareTrayItem[];
} {
  const items = getCompareTray();

  // 1. Check duplicate
  if (isItemInCompareTray(entry)) {
    return { success: false, error: "already_exists", items };
  }

  // Determine standard keys
  const id = entry.localId || entry.id || `camp-${Math.random().toString(36).substr(2, 9)}`;
  const isSavedItem = entry.localId !== undefined || id.startsWith("local-");
  const slug = entry.slug || "";
  const title = entry.title || "Untitled Workout";
  
  // Clean type estimation
  let entryType = entry.entryType || "running-workout";
  if (entry.isCustom || entryType.startsWith("custom-")) {
    if (entry.sessionStructure || entry.exercises) {
      entryType = "custom-support-routine";
    } else {
      entryType = "custom-running-workout";
    }
  }

  // Build tray element
  const newItem: CompareTrayItem = {
    localCompareId: `cmp-${Math.random().toString(36).substr(2, 9)}`,
    entryId: !isSavedItem ? id : undefined,
    localId: isSavedItem ? id : undefined,
    slug,
    title,
    entryType,
    data: entry.data ? { ...entry.data } : { ...entry }
  };

  // 2. Enforce limits
  if (items.length >= 3) {
    if (options.forceReplaceOldest) {
      // Remove oldest (first item) and push
      items.shift();
      items.push(newItem);
    } else {
      return { success: false, error: "limit_reached", items };
    }
  } else {
    items.push(newItem);
  }

  try {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to commit compare tray to localStorage:", err);
  }

  return { success: true, items };
}

/**
 * Removes an item by its local compare session ID.
 */
export function removeFromCompareTray(localCompareId: string): CompareTrayItem[] {
  const items = getCompareTray();
  const filtered = items.filter(it => it.localCompareId !== localCompareId);
  try {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to commit compare tray after deletion:", err);
  }
  return filtered;
}

/**
 * Clears comparison tray totally.
 */
export function clearCompareTray(): void {
  try {
    localStorage.removeItem(COMPARE_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear compare tray:", err);
  }
}
