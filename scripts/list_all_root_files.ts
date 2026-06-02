import fs from 'fs';

console.log('Listing every single file in the root directory:');
const files = fs.readdirSync('.');
for (const file of files) {
  console.log(`- "${file}"`);
}
