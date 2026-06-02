import fs from 'fs';
import path from 'path';

function scanDir(dir: string, depth = 0) {
  if (depth > 4) return;
  try {
    const list = fs.readdirSync(dir);
    console.log(`Directory: ${dir}`);
    for (const item of list) {
      const fullPath = path.join(dir, item);
      let isDir = false;
      try {
        isDir = fs.statSync(fullPath).isDirectory();
      } catch (e) {
        continue;
      }
      if (isDir) {
        console.log(`  [DIR] ${item}`);
        if (!['node_modules', '.git', 'dist', '.next'].includes(item)) {
          scanDir(fullPath, depth + 1);
        }
      } else {
        console.log(`  [FILE] ${item} (${fs.statSync(fullPath).size} bytes)`);
      }
    }
  } catch (e: any) {
    console.log(`Error reading ${dir}: ${e.message}`);
  }
}

scanDir(process.cwd());
