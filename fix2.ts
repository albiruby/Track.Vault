import fs from "fs";
import path from "path";

function processDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      const orig = fs.readFileSync(fullPath, "utf-8");
      
      let content = orig;
      // Match ` :[a-zA-Z0-9/-]+`
      content = content.replace(/ :[a-zA-Z0-9#\/-]+/g, '');

      if (content !== orig) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDirectory("src");
console.log("Done");
