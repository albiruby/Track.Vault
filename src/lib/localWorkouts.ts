/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workout } from "../types/workout";

const STORAGE_KEY = "track_vault_saved_workouts";

export function getSavedWorkouts(): Workout[] {
 if (typeof window === "undefined") return [];
 try {
 const data = localStorage.getItem(STORAGE_KEY);
 return data ? JSON.parse(data) : [];
 } catch (error) {
 console.error("Error reading saved workouts from localStorage:", error);
 return [];
 }
}

export function saveWorkoutLocally(workout: Workout): Workout[] {
 if (typeof window === "undefined") return [];
 try {
 const workouts = getSavedWorkouts();
 
 // Check if it already exists to overwrite or update
 const existingIndex = workouts.findIndex((w) => w.id === workout.id);
 const updatedWorkout = {
 ...workout,
 isCustom: true,
 createdAt: workout.createdAt || new Date().toISOString(),
 };

 if (existingIndex > -1) {
 workouts[existingIndex] = updatedWorkout;
 } else {
 workouts.push(updatedWorkout);
 }

 localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
 return workouts;
 } catch (error) {
 console.error("Error saving workout to localStorage:", error);
 return getSavedWorkouts();
 }
}

export function updateSavedWorkout(id: string, updatedFields: Partial<Workout>): Workout[] {
 if (typeof window === "undefined") return [];
 try {
 const workouts = getSavedWorkouts();
 const index = workouts.findIndex((w) => w.id === id);
 if (index > -1) {
 workouts[index] = {
 ...workouts[index],
 ...updatedFields,
 id, // Absolute protection
 };
 localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
 }
 return workouts;
 } catch (error) {
 console.error("Error updating saved workout:", error);
 return getSavedWorkouts();
 }
}

export function deleteSavedWorkout(id: string): Workout[] {
 if (typeof window === "undefined") return [];
 try {
 const workouts = getSavedWorkouts();
 const filtered = workouts.filter((w) => w.id !== id);
 localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
 return filtered;
 } catch (error) {
 console.error("Error deleting saved workout:", error);
 return getSavedWorkouts();
 }
}

export function duplicateWorkout(workout: Workout): Workout {
 const uniq = Math.random().toString(36).substr(2, 9);
 const cleanTitle = `${workout.title} (Copy)`;
 const duplicated: Workout = {
 ...workout,
 id: `custom-${uniq}`,
 slug: `${workout.slug || "custom"}-copy-${uniq}`,
 title: cleanTitle,
 shortTitle: `${workout.shortTitle || "Custom"} Copy`,
 isCustom: true,
 createdAt: new Date().toISOString(),
 };
 
 saveWorkoutLocally(duplicated);
 return duplicated;
}

export function clearSavedWorkouts(): void {
 if (typeof window === "undefined") return;
 try {
 localStorage.removeItem(STORAGE_KEY);
 } catch (error) {
 console.error("Error clearing saved workouts:", error);
 }
}
