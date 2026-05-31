import fs from "fs";

let content = fs.readFileSync("src/App.tsx", "utf-8");
content = content.replace(/\s*\{\/\*\s*Subtle clean vector bg graphic\s*\*\/\}\s*<div[^>]*>\s*<Activity[^>]*\/>\s*<\/div>/, "");
fs.writeFileSync("src/App.tsx", content);
console.log("Done");
