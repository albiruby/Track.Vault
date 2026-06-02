import fs from 'fs';
import path from 'path';

function search(dir: string, depth = 0) {
  if (depth > 5) return;
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const full = path.join(dir, entry);
      let stat;
      try {
        stat = fs.statSync(full);
      } catch (e) {
        continue;
      }
      if (stat.isDirectory()) {
        if (!['node_modules', 'dist', '.next', '.git'].includes(entry)) {
          search(full, depth + 1);
        }
      } else {
        if (entry.includes('final') || entry.includes('v1.2.json') || entry.includes('running_') || entry.includes('support_')) {
          console.log(`FOUND: ${full} (${stat.size} bytes)`);
        }
      }
    }
  } catch (e) {}
}

console.log('Searching parent directory:');
search('..');
console.log('Searching current directory:');
search('.');
console.log('Searching root directory /:');
try {
  const rootDirFiles = fs.readdirSync('/');
  console.log('Files in root /:', rootDirFiles);
} catch (e) {}
