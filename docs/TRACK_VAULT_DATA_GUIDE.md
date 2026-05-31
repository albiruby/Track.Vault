# Track.Vault Data Guide

Track.Vault is a specialized, zero-database static running workout library and workout builder application. This document describes the data schema, folder structures, static compilation routines, and the local state engine.

## Data Folder Structure

All data files reside under `src/data/workouts/`:

```
src/data/workouts/
├── workoutLibrary.index.json      # Central manifesto listing category metadata
├── categories/                    # Individual category workout lists
│   ├── beginner-return.v1.json
│   ├── easy-recovery-base.v1.json
│   ├── long-run-progression.v1.json
│   ├── fartlek-mixed.v1.json
│   ├── hill-trail.v1.json
│   ├── treadmill.v1.json
│   ├── sprint-100m-400m.v1.json
│   ├── middle-distance-800m-mile.v1.json
│   ├── three-k-five-k.v1.json
│   ├── ten-k.v1.json
│   ├── half-marathon.v1.json
│   ├── marathon.v1.json
│   └── race-week-taper.v1.json
├── schemas/
│   └── workout.schema.json        # Standard JSON validation schema
└── generated/
    └── workoutLibrary.all.v1.json # Combined cache used in client static loading
```

---

## 1. Central Manifesto (`workoutLibrary.index.json`)
The index file describes the system metadata. It maps the supported category identifiers, their display names, detailed human explanation summaries, targeted workout volume size limits, tags, and icon pointers.

## 2. Populating Categories
Each `.v1.json` file in categories contains a simple structure holding the workout objects:
```json
{
  "id": "three-k-five-k",
  "workouts": [
    // Populate workout objects matching workout.schema.json
  ]
}
```

## 3. Compiled Static Cache (`generated/workoutLibrary.all.v1.json`)
To avoid executing multiple async HTTP calls in the client, the application parses and imports the single bundle `workoutLibrary.all.v1.json` statically. When workouts are written inside the `categories/` folder, run a compiling command (or combine manually) to populate the `workoutLibrary.all.v1.json` file:
```json
[
  {
    "id": "tv001",
    "slug": "lactate-cruise-intervals",
    "title": "Cruise Intervals (Classic 5x1000m)",
    ...
  }
]
```

---

## 4. Local Workouts State
User-defined or manually built workouts do *not* require a server, cloud service, or external SQL database. 
- All client sessions build custom sessions that are stored strictly in `localStorage` under the key `track_vault_saved_workouts`.
- These are managed securely by the `/src/lib/localWorkouts.ts` module.
- Workouts created locally have `isCustom: true` and are fully operational within the browser.

---

## 5. Running Validation
To verify index matching, parseability, uniqueness of slugs & ids, and completeness of main sets, run the pre-configured TypeScript validation script:
```bash
npx tsx scripts/validateWorkoutLibrary.ts
```
Ensure all checks pass green before executing production builds!
