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
