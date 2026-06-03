/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrackVaultEntry } from "../types/workout";

// Strict Local Storage Keys
export const STORAGE_KEY_V1 = "trackvault_saved_vault_v1";
export const OLD_STORAGE_KEY = "track_vault_saved_workouts";

export interface SavedVaultItem {
  localId: string;
  savedAt: string;
  updatedAt?: string;
  entryType:
    | "running-workout"
    | "support-routine"
    | "custom-running-workout"
    | "custom-support-routine";

  title: string;
  slug?: string;
  sourceEntryId?: string;
  sourceEntrySlug?: string;
  sourceEntryTitle?: string;
  createdFromLibrary?: boolean;

  pinned?: boolean;
  localTags?: string[];
  notes?: string;

  data: any; // TrackVaultEntry (RunningWorkout or SupportRoutine) or draft
}

/**
 * Normalizes any raw saved workout or draft safely into the newest SavedVaultItem representation.
 */
export function normalizeSavedVaultItem(raw: any): SavedVaultItem {
  if (!raw) {
    throw new Error("Cannot normalize null or undefined vault item.");
  }

  // Generate a safe localID if missing
  const localId = raw.localId || raw.id || `local-${Math.random().toString(36).substr(2, 9)}`;
  const savedAt = raw.savedAt || raw.createdAt || new Date().toISOString();

  // Extract raw payload data. Older drafts / saved items saved the whole payload at the root list level.
  const data = raw.data || { ...raw };

  // Remove administrative key overrides from nested payload to remain pristine
  const pruneKeys = ["localId", "savedAt", "updatedAt", "pinned", "localTags", "notes"];
  pruneKeys.forEach((k) => {
    if (data[k] !== undefined) {
      delete data[k];
    }
  });

  // Deduce the type of workout entry strictly
  let entryType: SavedVaultItem["entryType"] = raw.entryType || data.entryType;
  if (!entryType) {
    if (data.sessionStructure || data.exercises || data.supportCategoryId) {
      entryType = data.isCustom || raw.isCustom ? "custom-support-routine" : "support-routine";
    } else {
      entryType = data.isCustom || raw.isCustom ? "custom-running-workout" : "running-workout";
    }
  } else {
    // Standardize Custom types if custom flag is present
    if (data.isCustom || raw.isCustom || entryType.startsWith("custom-")) {
      if (entryType === "running-workout") {
        entryType = "custom-running-workout";
      } else if (entryType === "support-routine") {
        entryType = "custom-support-routine";
      }
    }
  }

  const title = raw.title || data.title || "Untitled Session";
  const slug = raw.slug || data.slug || "";
  
  // Connect library metadata references
  const sourceEntryId = raw.sourceEntryId || data.sourceEntryId || (raw.createdFromLibrary ? data.id : undefined);
  const sourceEntrySlug = raw.sourceEntrySlug || data.sourceEntrySlug || (raw.createdFromLibrary ? data.slug : undefined);
  const sourceEntryTitle = raw.sourceEntryTitle || data.sourceEntryTitle || (raw.createdFromLibrary ? data.title : undefined);
  const createdFromLibrary = raw.createdFromLibrary !== undefined 
    ? raw.createdFromLibrary 
    : (!!sourceEntryId && !(data.isCustom || raw.isCustom));

  const pinned = !!raw.pinned;
  const localTags = Array.isArray(raw.localTags) ? raw.localTags : [];
  const notes = raw.notes || "";

  return {
    localId,
    savedAt,
    updatedAt: raw.updatedAt || undefined,
    entryType,
    title,
    slug,
    sourceEntryId,
    sourceEntrySlug,
    sourceEntryTitle,
    createdFromLibrary,
    pinned,
    localTags,
    notes,
    data
  };
}

/**
 * Gets all saved items from LocalStorage with fallback migration from older storage systems.
 */
export function getSavedVaultItems(): SavedVaultItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY_V1);
    if (data) {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed.map(normalizeSavedVaultItem) : [];
    }

    // Attempt migration from v1.1 storage key
    const oldData = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldData) {
      try {
        const parsedOld = JSON.parse(oldData);
        if (Array.isArray(parsedOld)) {
          const migrated = parsedOld.map((oldItem) => 
            normalizeSavedVaultItem({
              ...oldItem,
              createdFromLibrary: !oldItem.isCustom
            })
          );
          localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(migrated));
          return migrated;
        }
      } catch (err) {
        console.error("Failed to migrate older Saved items key:", err);
      }
    }
    return [];
  } catch (error) {
    console.error("Failed to access saved vault localStorage:", error);
    return [];
  }
}

/**
 * Saves or updates a workout entry or design builder draft to local storage.
 * Safely accepts raw entries or pre-packed structures.
 */
export function saveVaultItem(entryOrDraft: any): SavedVaultItem[] {
  if (typeof window === "undefined") return [];
  try {
    const items = getSavedVaultItems();
    
    let isItemContainer = entryOrDraft && entryOrDraft.localId && entryOrDraft.data;
    let itemToSave: SavedVaultItem;

    if (isItemContainer) {
      itemToSave = normalizeSavedVaultItem(entryOrDraft);
    } else {
      // It's a raw entry
      const localId = entryOrDraft.id && entryOrDraft.id.startsWith("local-") 
        ? entryOrDraft.id 
        : `local-${Math.random().toString(36).substr(2, 9)}`;

      let entryType: SavedVaultItem["entryType"] = "running-workout";
      if (entryOrDraft.entryType === "support-routine" || entryOrDraft.supportCategoryId || entryOrDraft.sessionStructure) {
        entryType = entryOrDraft.isCustom ? "custom-support-routine" : "support-routine";
      } else {
        entryType = entryOrDraft.isCustom ? "custom-running-workout" : "running-workout";
      }

      const createdFromLibrary = entryOrDraft.id && !entryOrDraft.isCustom && !entryOrDraft.id.startsWith("local-");

      itemToSave = {
        localId,
        savedAt: new Date().toISOString(),
        entryType,
        title: entryOrDraft.title || "Untitled Session",
        slug: entryOrDraft.slug || "",
        sourceEntryId: createdFromLibrary ? entryOrDraft.id : (entryOrDraft.sourceEntryId || undefined),
        sourceEntrySlug: createdFromLibrary ? entryOrDraft.slug : (entryOrDraft.sourceEntrySlug || undefined),
        sourceEntryTitle: createdFromLibrary ? entryOrDraft.title : (entryOrDraft.sourceEntryTitle || undefined),
        createdFromLibrary: !!createdFromLibrary || !!entryOrDraft.createdFromLibrary,
        pinned: !!entryOrDraft.pinned,
        localTags: entryOrDraft.localTags || [],
        notes: entryOrDraft.notes || "",
        data: { 
          ...entryOrDraft,
          isCustom: entryType.startsWith("custom-") || !!entryOrDraft.isCustom
        }
      };
    }

    // Prevent duplicate entries
    const existingIndex = items.findIndex((it) => it.localId === itemToSave.localId);
    if (existingIndex > -1) {
      items[existingIndex] = {
        ...items[existingIndex],
        ...itemToSave,
        updatedAt: new Date().toISOString()
      };
    } else {
      items.push(itemToSave);
    }

    localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(items));
    return items;
  } catch (error) {
    console.error("Failed to save entry to vault:", error);
    return getSavedVaultItems();
  }
}

/**
 * Patches a specific saved item's parameters (e.g. localTags, notes).
 * Returns the updated list.
 */
export function updateSavedVaultItem(localId: string, patch: Partial<SavedVaultItem>): SavedVaultItem[] {
  if (typeof window === "undefined") return [];
  try {
    const items = getSavedVaultItems();
    const index = items.findIndex((it) => it.localId === localId);
    if (index > -1) {
      items[index] = {
        ...items[index],
        ...patch,
        localId, // absolute safety guard
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(items));
    }
    return items;
  } catch (error) {
    console.error("Failed to update saved vault item:", error);
    return getSavedVaultItems();
  }
}

/**
 * Removes a saved item from localStorage cache.
 */
export function deleteSavedVaultItem(localId: string): SavedVaultItem[] {
  if (typeof window === "undefined") return [];
  try {
    const items = getSavedVaultItems();
    const filtered = items.filter((it) => it.localId !== localId);
    localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error("Failed to delete saved item:", error);
    return getSavedVaultItems();
  }
}

/**
 * Duplicates a saved item, adding a proper Copy suffix.
 */
export function duplicateSavedVaultItem(localId: string): SavedVaultItem[] {
  if (typeof window === "undefined") return [];
  try {
    const items = getSavedVaultItems();
    const source = items.find((it) => it.localId === localId);
    if (!source) return items;

    const uniqId = Math.random().toString(36).substr(2, 9);
    const newLocalId = `local-${uniqId}`;
    const newTitle = `${source.title} (Copy)`;

    // Deep copy source data
    const duplicatedData = JSON.parse(JSON.stringify(source.data));
    duplicatedData.title = newTitle;
    duplicatedData.id = newLocalId;
    duplicatedData.isCustom = true;
    if (source.slug) {
      duplicatedData.slug = `${source.slug}-copy-${uniqId}`;
    }

    // For duplicating we default type to a custom/draft variant
    let dupeEntryType = source.entryType;
    if (dupeEntryType === "running-workout") {
      dupeEntryType = "custom-running-workout";
    } else if (dupeEntryType === "support-routine") {
      dupeEntryType = "custom-support-routine";
    }

    const duplicatedItem: SavedVaultItem = {
      ...source,
      localId: newLocalId,
      title: newTitle,
      savedAt: new Date().toISOString(),
      updatedAt: undefined,
      pinned: false,
      entryType: dupeEntryType,
      data: duplicatedData
    };

    items.push(duplicatedItem);
    localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(items));
    return items;
  } catch (error) {
    console.error("Failed to duplicate saved vault item:", error);
    return getSavedVaultItems();
  }
}

/**
 * Toggles the pinned state of a saved vault item.
 */
export function togglePinnedSavedItem(localId: string): SavedVaultItem[] {
  if (typeof window === "undefined") return [];
  try {
    const items = getSavedVaultItems();
    const index = items.findIndex((it) => it.localId === localId);
    if (index > -1) {
      items[index].pinned = !items[index].pinned;
      items[index].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(items));
    }
    return items;
  } catch (error) {
    console.error("Failed to toggle pin state:", error);
    return getSavedVaultItems();
  }
}

/**
 * Clears the entire local training vault.
 */
export function clearSavedVault(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_V1);
    localStorage.removeItem(OLD_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear local vault storage keys:", err);
  }
}

/**
 * Searches the list of saved vault items deterministically.
 */
export function searchSavedVaultItems(items: SavedVaultItem[], query: string): SavedVaultItem[] {
  if (!query || !query.trim()) return items;
  const q = query.toLowerCase().trim();

  return items.filter((it) => {
    // 1. Core items search
    if (it.title.toLowerCase().includes(q)) return true;
    if (it.notes && it.notes.toLowerCase().includes(q)) return true;
    if (it.sourceEntryTitle && it.sourceEntryTitle.toLowerCase().includes(q)) return true;
    if (it.entryType.toLowerCase().includes(q)) return true;
    if (it.localTags && it.localTags.some((t) => t.toLowerCase().includes(q))) return true;

    // 2. Nested data details search
    const d = it.data || {};
    if (d.title && d.title.toLowerCase().includes(q)) return true;
    if (d.summary && d.summary.toLowerCase().includes(q)) return true;
    if (d.supportCategoryLabel && d.supportCategoryLabel.toLowerCase().includes(q)) return true;
    if (d.distanceNavLabel && d.distanceNavLabel.toLowerCase().includes(q)) return true;
    if (d.workoutType && d.workoutType.toLowerCase().includes(q)) return true;
    if (d.routineType && d.routineType.toLowerCase().includes(q)) return true;
    if (d.category && d.category.toLowerCase().includes(q)) return true;
    
    // Arrays values search
    if (Array.isArray(d.tags) && d.tags.some((t: string) => t.toLowerCase().includes(q))) return true;
    if (Array.isArray(d.searchKeywords) && d.searchKeywords.some((k: string) => k.toLowerCase().includes(q))) return true;

    return false;
  });
}

/**
 * Filters and sorts saved vault items.
 */
export function filterSavedVaultItems(
  items: SavedVaultItem[],
  filters: {
    categoryType?: "all" | "running-workout" | "support-routine" | "custom-running" | "custom-support" | "pinned" | "recently-saved";
    sortBy?: "recent" | "title-asc" | "type" | "pinned-first";
  }
): SavedVaultItem[] {
  let result = [...items];

  // Apply visual filter
  const cat = filters.categoryType || "all";
  switch (cat) {
    case "running-workout":
      result = result.filter((it) => it.entryType === "running-workout");
      break;
    case "support-routine":
      result = result.filter((it) => it.entryType === "support-routine");
      break;
    case "custom-running":
      result = result.filter((it) => it.entryType === "custom-running-workout");
      break;
    case "custom-support":
      result = result.filter((it) => it.entryType === "custom-support-routine");
      break;
    case "pinned":
      result = result.filter((it) => !!it.pinned);
      break;
    case "recently-saved":
      // Sort recently saved first, usually keep in sync but restrict filtering range
      break;
    case "all":
    default:
      break;
  }

  // Apply sorting
  const sort = filters.sortBy || "recent";
  result.sort((a, b) => {
    switch (sort) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "type":
        return a.entryType.localeCompare(b.entryType);
      case "pinned-first":
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        // Fallback to savedAt sequence
        return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      case "recent":
      default:
        return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    }
  });

  return result;
}
