# Validation Report: Track.Vault v1.2 Running Workouts

This validation report summarizes the normalization, upgrade, and verification operations performed on the Track.Vault running workout library.

## Executive Summary

* **Timestamp**: 2026-06-01T09:55:49.613Z
* **Raw Files Archived**: 15 files successfully copied
* **Final Files Created**: 15 files successfully written
* **Total Workouts Processed**: **750**
* **Category Target**: 15 categories, exactly 50 workouts per category (100% fulfilled)

---

## Category Counts & Audit

| Category ID | Expected Workouts | Actual Workouts | Status |
| :--- | :---: | :---: | :---: |
| `100m` | 50 | 50 | Passed |
| `200m` | 50 | 50 | Passed |
| `400m` | 50 | 50 | Passed |
| `800m` | 50 | 50 | Passed |
| `1500m` | 50 | 50 | Passed |
| `mile` | 50 | 50 | Passed |
| `3k` | 50 | 50 | Passed |
| `5k` | 50 | 50 | Passed |
| `10k` | 50 | 50 | Passed |
| `half_marathon` | 50 | 50 | Passed |
| `marathon` | 50 | 50 | Passed |
| `trail` | 50 | 50 | Passed |
| `treadmill` | 50 | 50 | Passed |
| `base_recovery` | 50 | 50 | Passed |
| `general` | 50 | 50 | Passed |

---

## Technical Audits

### 1. Title Cleanup
* **Requirement**: Replace all generic titles (e.g. "100m Session 1") with descriptive, professional coaching titles.
* **Status**: **Success**. All 750 workouts have unique, premium-branded titles based on coaching archetypes and progressive training levels.

### 2. Schema Compliance
* **Requirement**: Normalize and structure all properties according to the Track.Vault schema specification.
* **Status**: **Perfect - 100% compliant**.
* **Key transformations**:
  * `phase` and `surface` converted to string arrays.
  * `estimatedDurationMin` and `estimatedDistanceKm` converted to min/max ranges.
  * `workoutStructure` fully parsed into warmup, mainSet, and cooldown blocks.
  * `variants`, `intensityGuide`, and `shareCard` fully normalized into structured sub-objects.

### 3. Metric Calculations (Distance & Duration)
* **Requirement**: Dynamically and mathematically calculate estimated distances and durations based on actual interval work and recovery blocks. Round distances to 0.5 km and durations to 5-minute increments.
* **Status**: **Plausible - mathematically verified and rounded**. All estimated minimum limits are equal to or greater than the main set quality distances.

### 4. Uniqueness Integrity
* **Requirement**: Eliminate duplicated mainSet structures and ensure zero duplicates of ID, title, slug, and uniqueness signatures within a category.
* **Status**: **Perfect - 0 duplicates**.

### 5. Risk & Difficulty Recalibration
* **Requirement**: Recalibrate risks dynamically (sprints and technical trails as higher risk, recoveries as low risk). Ensure beginners never receive high-risk tasks.
* **Status**: **Success**. Dynamic risk bounds applied across all categories with specific risk explanations.

---

## Errors & Warnings Summary

* **Total Validation Errors**: **0**
* **Total Validation Warnings**: **0**

> [!NOTE]
> All automated checks have passed successfully. The static database is ready for production integration.



---
*Report generated automatically by Track.Vault upgrade engine.*
