import fs from 'fs';
import path from 'path';

function findZip(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                findZip(fullPath);
            }
        } else {
            console.log(fullPath);
        }
    }
}

findZip('.');
