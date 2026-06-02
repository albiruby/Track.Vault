import fs from 'fs';
import path from 'path';

function findFiles(dir: string) {
  try {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        findFiles(full);
      } else {
        if (f.includes('json') || f.includes('v1.2') || f.includes('zip')) {
          console.log(`FOUND IN DOCS: ${full} (${stat.size} bytes)`);
        }
      }
    }
  } catch (e) {}
}

findFiles('docs');
