import fs from "fs";
import path from "path";

function processDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      // Replace instances of dark:xxxx with empty string.
      // E.g. dark:bg-[#1E293B], dark:border-[#334155], dark:text-gray-100, dark:hover:bg-slate-800
      let newContent = content.replace(/\bdark:[A-Za-z0-9/\[\]\#.-]+\b/g, "");
      // Clean up multiple spaces that might have been left behind
      newContent = newContent.replace(/  +/g, " ");
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory("src");
console.log("Done");
