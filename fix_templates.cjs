const fs = require('fs');

const templates = [
  'src/components/export/templates/CoachWorkoutCard.tsx',
  'src/components/export/templates/LongRunCard.tsx',
  'src/components/export/templates/MinimalWorkoutCard.tsx',
  'src/components/export/templates/RaceWeekCard.tsx',
  'src/components/export/templates/TrackSessionCard.tsx'
];

templates.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  // replace type
  code = code.replace(/workout: Workout;/g, 'workout: any/*Workout|SupportRoutine*/;');
  code = code.replace(/import \{ Workout \}/g, 'import { Workout, TrackVaultEntry }');

  // helper replacement for mainSet
  const mainSetLogic = '(workout.entryType === "support-routine" ? (Array.isArray(workout.sessionStructure) ? workout.sessionStructure : [workout.sessionStructure || ""]) : (workout.mainSet || []))';
  
  code = code.replace(/workout\.mainSet/g, mainSetLogic);
  
  // formatting for items
  // <li key={block.id || i} className="truncate"> {i + 1}. {formatWorkoutBlock(block)} </li>
  // might break if block is string and formatWorkoutBlock expects object
  code = code.replace(/formatWorkoutBlock\((b|block)\)/g, '(workout.entryType === "support-routine" ? String($1) : formatWorkoutBlock($1 as any))');
  
  // distance fixes
  code = code.replace(
    /workout\.estimatedDistanceKm/g,
    '(workout.estimatedDistanceKm || 0)'
  );
  
  code = code.replace(
    /workout\.difficulty/g,
    '(workout.difficulty || 0)'
  );

  fs.writeFileSync(file, code);
});
