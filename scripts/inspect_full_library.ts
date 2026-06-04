import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 754; i <= 780; i++) {
  console.log(`Index ${i} (Line ${i+1}): ${JSON.stringify(lines[i])}`);
}
