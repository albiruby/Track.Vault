import fs from 'fs';
import path from 'path';

function deepSearch(dir: string, depth = 0) {
  if (depth > 6) return;
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
         if (!['node_modules', 'dist', '.next', '.git', 'cache'].includes(entry)) {
           deepSearch(full, depth + 1);
         }
      } else {
        if (entry.includes('final') || entry.includes('v1.2') || entry.includes('running_') || entry.includes('support_')) {
          console.log(`FOUND: ${full} (${stat.size} bytes)`);
        }
      }
    }
  } catch (e) {}
}

const targetDirs = ['/app', '/workspace', '/tmp', '/home'];
for (const td of targetDirs) {
  console.log(`Scanning target directory: ${td}`);
  deepSearch(td);
}
console.log('Finished deep scan.');
