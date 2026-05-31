# Track.Vault Workout Library v1.1 NAV_READY Validation Report

- Package: `TrackVault_WorkoutLibrary_JSON_FULL_v1.1_NAV_READY.zip`
- Version: `1.1.0`
- Total workouts: **360**
- Category files: **13**
- Metadata patch only: **true**
- Workout prescriptions changed: **false**
- Errors: **0**

## New Navigation Metadata Fields

- `libraryCategoryId`
- `libraryCategoryLabel`
- `workoutType`
- `distanceNavId`
- `distanceNavLabel`
- `distanceSortOrder`

## Category Counts

- `beginner-return`: 25
- `easy-recovery-base`: 25
- `fartlek-mixed`: 25
- `half-marathon`: 25
- `hill-trail`: 25
- `long-run-progression`: 25
- `marathon`: 25
- `middle-distance-800m-mile`: 35
- `race-week-taper`: 30
- `sprint-100m-400m`: 30
- `ten-k`: 30
- `three-k-five-k`: 45
- `treadmill`: 15

## Distance Navigation Counts

- `all` / All Workouts: 360
- `100m` / 100m: 17
- `200m` / 200m: 8
- `400m` / 400m: 8
- `800m` / 800m: 16
- `1500m` / 1500m: 10
- `mile` / Mile: 14
- `3k` / 3K: 6
- `5k` / 5K: 53
- `10k` / 10K: 35
- `half-marathon` / Half Marathon: 31
- `marathon` / Marathon: 31
- `trail` / Trail: 8
- `treadmill` / Treadmill: 15
- `base-recovery` / Base / Recovery: 25
- `general` / General: 83

## Notes

- This v1.1 package is designed for distance-first Track.Vault sidebar navigation.
- Keep `workout.category` as the legacy workout type field.
- Use `workoutType` for explicit workout type filtering.
- Use `libraryCategoryId` for library module filtering.
- Use `distanceNavId` for distance-first menu filtering.
