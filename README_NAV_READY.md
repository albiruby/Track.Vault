# Track.Vault Workout Library v1.1 NAV_READY

This package upgrades the standardized Track.Vault JSON library to explicit navigation metadata.

## Use these files

Copy/replace:

- `src/data/workouts/workoutLibrary.index.json`
- `src/data/workouts/generated/workoutLibrary.all.v1.json`
- `src/data/workouts/categories/*.v1.json`
- `src/data/workouts/schemas/workout.schema.json`
- `src/data/workouts/workoutDistanceNav.ts`
- `scripts/validateWorkoutLibrary.ts`

## Remove/avoid old files

- `workoutLibrary.all.v1.standardized.json`
- `workoutLibrary.index.standardized.json`
- old scaffold/empty `marathon.v1.json` or `race-week-taper.v1.json`
- old generated combined JSON before v1.1 patch

## Main app logic

- Distance sidebar: filter by `distanceNavId`.
- Library module: filter by `libraryCategoryId`.
- Workout type: filter by `workoutType`.
- Legacy `category` is preserved for backward compatibility.
