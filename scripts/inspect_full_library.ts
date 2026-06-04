import fs from 'fs';

const content = fs.readFileSync('src/components/library/WorkoutCard.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 60; i <= 75; i++) {
  console.log(`Index ${i} (Line ${i+1}): ${JSON.stringify(lines[i])}`);
}
