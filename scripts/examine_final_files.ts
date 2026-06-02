import fs from 'fs';

console.log('Listing all files in root directory containing backslashes or starting with final:');
const files = fs.readdirSync('.');
let count = 0;
for (const file of files) {
  if (file.includes('\\') || file.startsWith('final')) {
    const stats = fs.statSync(file);
    console.log(`- "${file}" (${stats.size} bytes, isFile: ${stats.isFile()})`);
    count++;
  }
}
console.log(`Total matching literal files found: ${count}`);
