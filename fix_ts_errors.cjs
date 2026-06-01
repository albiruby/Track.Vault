const fs = require('fs');
let code = fs.readFileSync('src/components/library/WorkoutCard.tsx', 'utf8');

code = code.replace(
  /\~\$\{workout\.estimatedDistanceKm\} KM/g,
  '~${(workout as any).estimatedDistanceKm} KM'
);

code = code.replace(
  /\~\$\{workout\.estimatedDurationMin\} MIN/g,
  '~${(workout as any).estimatedDurationMin} MIN'
);

fs.writeFileSync('src/components/library/WorkoutCard.tsx', code);

// In src/lib/clipboard.ts and src/lib/workouts.ts we can update the type
let clip = fs.readFileSync('src/lib/clipboard.ts', 'utf8');
clip = clip.replace(/export function formatWorkoutForClipboard\(workout: Workout/g, 'export function formatWorkoutForClipboard(workout: any');
fs.writeFileSync('src/lib/clipboard.ts', clip);

let works = fs.readFileSync('src/lib/workouts.ts', 'utf8');
works = works.replace(/export function formatWorkoutForClipboard\(workout: Workout/g, 'export function formatWorkoutForClipboard(workout: any');
fs.writeFileSync('src/lib/workouts.ts', works);
