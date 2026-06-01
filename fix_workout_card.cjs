const fs = require('fs');
let code = fs.readFileSync('src/components/library/WorkoutCard.tsx', 'utf8');

const regex = /<span className=\"text-xs font-bold text-\\[#0F172A\\] font-mono\">[\s\S]*?<\/span>/m;

const replacement = `<span className="text-xs font-bold text-[#0F172A] font-mono">
  {workout.entryType === "support-routine"
    ? ((workout as any).supportCategoryLabel || (workout as any).routineType || "Routine")
    : ((workout as any).rawDistance && typeof (workout as any).rawDistance === "object"
      ? \`\${(workout as any).rawDistance.min}-\${(workout as any).rawDistance.max} KM\`
      : \`~\${workout.estimatedDistanceKm} KM\`)}
  </span>`;

code = code.replace(regex, replacement);

const regexMainSet = /\{workout\.mainSet\.slice\(0, 2\)\.map\(\(block, i\) => \(/m;
const replMainSet = `{(workout.entryType === "support-routine" ? (Array.isArray((workout as any).sessionStructure) ? (workout as any).sessionStructure : [(workout as any).sessionStructure || ""]) : (workout.mainSet || [])).slice(0, 2).map((block, i) => (`

code = code.replace(regexMainSet, replMainSet);

const regexFormat = /<span className=\"font-semibold\">\{formatWorkoutBlock\(block\)\}<\/span>/m;
const replFormat = `<span className="font-semibold">{workout.entryType === "support-routine" ? String(block) : formatWorkoutBlock(block as any)}</span>`

code = code.replace(regexFormat, replFormat);

const regexLen = /\{workout\.mainSet\.length > 2 && \(/m;
const replLen = `{(workout.entryType === "support-routine" ? (Array.isArray((workout as any).sessionStructure) ? (workout as any).sessionStructure : [(workout as any).sessionStructure || ""]) : (workout.mainSet || [])).length > 2 && (`

code = code.replace(regexLen, replLen);

const regexSteps = /\+ \{workout\.mainSet\.length \- 2\} more prescription steps/m;
const replSteps = `+ {(workout.entryType === "support-routine" ? (Array.isArray((workout as any).sessionStructure) ? (workout as any).sessionStructure : [(workout as any).sessionStructure || ""]) : (workout.mainSet || [])).length - 2} more steps`

code = code.replace(regexSteps, replSteps);


fs.writeFileSync('src/components/library/WorkoutCard.tsx', code);
