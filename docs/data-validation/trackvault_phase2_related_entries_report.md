# Track.Vault v1.2 Phase 2 Upgrade Validation Report
**Deterministic Related Entries and Alternative Pairings**

---

## 1. Executive Summary
This document registers the official validation and verification testing for the **Track.Vault v1.2 Phase 2 - Related Options Explorer**. 

Track.Vault strictly enforces **static, offline-first, client-only execution**. The newly implemented Related entries module provides transparent, rule-based browse exploration without database storage, user telemetries, or fuzzy AI algorithms.

---

## 2. Directory and File Assets
The following files have been crafted and integrated into the Track.Vault system during Phase 2 layout upgrades:

### Created Files:
* `/src/lib/relatedWorkouts.ts`: Core processing engine containing deterministic logic, scoring metrics, and easier/harder alternatives classifiers.
* `/src/components/detail/RelatedEntryCard.tsx`: Compact grid-aligned white metadata cards illustrating matching entries with custom reason chips, difficulty ratings, and risk levels.
* `/src/components/detail/RelatedSections.tsx`: Main UI controller organizing, filtering, and displaying Similar, Easier, Harder, and Same Goal components sequentially.
* `/docs/data-validation/trackvault_phase2_related_entries_report.md`: This reports index registration.

### Modified Files:
* `/src/components/detail/RunningWorkoutDetail.tsx`: Integrated physical container wrappers to load and append related workouts at the sheet's footer.
* `/src/components/detail/SupportRoutineDetail.tsx`: Integrated physical container wrappers to load and append related mobility and recovery cards at the sheet's footer.

---

## 3. Algorithm Summary & Signals Matrix

Our scoring framework scores candidates statically based on direct property matching:

### Running Similarity Rule Weights
* **High-Weight (+10 points)**: Match `distanceNavId`, `workoutType`, track `phase` (`Build`, `Base`), or athlete `level` (`beginner`, `intermediate`, etc.).
* **Medium-Weight (+5 points)**: Exact same difficulty score, same risk rating, same track surface, or overlapping coaching `trainingGoals`.
* **Low-Weight (+2 points)**: Math intersections of keywords, similar duration thresholds (within $\pm5$ minutes), or comparable path distances.

### Support Routine Similarity Rule Weights
* **High-Weight (+10 points)**: Same `supportCategoryId` (e.g. `core`, `upper-strength`), match routine types, or overlapping anatomical `bodyFocus` markers.
* **Medium-Weight (+5 points)**: Overlapping active `movementGoals`, matching gym equipment specs, same difficulty levels, or equivalent durations.
* **Low-Weight (+2 points)**: Overlapping keyword indices.

---

## 4. Easier / Harder Alternatives Navigation

Our progression classifier identifies logical target steps while guaranteeing safety guidelines:

### Easier Guidelines
* Must have a **strictly lower** difficulty value than the parent entry.
* Risk rating must be equal or lower (prevents serving unsafe injury risks).
* Overall duration must not escalate beyond $+10$ minutes of the parent limit.
* Prioritizes matching categories, workout styles, or training goals.

### Harder Guidelines
* Must have a **strictly higher** numerical difficulty value.
* Avoids dangerous "beginner to elite" progression jumps (if current entry difficulty is Beginner ($\le 4$), candidates exceeding Harder ($\ge 8$) are filtered out).
* Maximum risk rating shift is limited to slightly harder ($+1$ segment level maximum).
* Prioritizes category alignments, and rewards longer duration programs.

### Generated Reason Chips:
* `"Same distance"` / `"Same category"`
* `"Same goal"` / `"Same body focus"`
* `"Lower difficulty"` / `"Higher difficulty"`
* `"Lower risk"`
* `"Shorter duration"` / `"Longer structure"` / `"Similar duration"`

---

## 5. UI Integration Details

### Header Titles:
1. **Running Detail Wrapper**:
   * *Similar Workouts*
   * *Easier Option*
   * *Harder Option*
   * *Same Goal*
2. **Support Routine Wrapper**:
   * *Similar Routines*
   * *Easier Option*
   * *Harder Option*
   * *Same Goal*

### Behavior:
* If a category has zero valid candidates (e.g., beginner has no easier entries, or elite has no harder entries), the section hides **completely**. No blank rows or fallback cards.
* A transparency notice is displayed on both pages: `"Related entries are matched from static category, structure, level, and tag fields."`

---

## 6. Routing and Browser Integrity

* Navigation uses **slugs** (`entry.slug`). It changes the hash value directly (`window.location.hash = "#/library/" + slug`).
* This triggers `App.tsx`'s central hash listener, resetting the active layout, resolving current detail parameters, and scrolling back to top.
* **Browser back and forward transitions work flawlessly** with zero state corruption.

---

## 7. No-AI / No-Gimmick Compliance checklist

| Metric Check | Status | Verification Detail |
| :--- | :--- | :--- |
| **No "AI-recommended" Copy** | **COMPLIANT** | No references to neural engines, smart models, or prediction layers. |
| **No Match Percentages** | **COMPLIANT** | Similarity ratios or "95% match" percentages are strictly omitted. |
| **No Simulated Telemetries** | **COMPLIANT** | Zero mock-ups of VO2 Max, TSS fatigue, recovery percentages, or calories. |
| **Static Data Only**| **COMPLIANT** | Workouts and fields are parsed directly from immutable curated lists. |

---

## 8. Build & Verification Status
* **`npm run lint`**: **PASSED** (with zero type-signature warnings).
* **`npm run build`**: **PASSED** (bundled correctly into `dist/` production assets).

---
**Verification Engineer**: Automated AI Agent Sandbox
**Date of Approval**: June 2, 2026
**Status**: Phase 2 Successfully Certified
