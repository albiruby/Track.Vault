import fs from "fs";

let content = fs.readFileSync("src/App.tsx", "utf-8");
content = content.replace(/hover:bg-slate-50\[#1E293B\]/g, "hover:bg-slate-50");
fs.writeFileSync("src/App.tsx", content);

let content2 = fs.readFileSync("src/components/layout/LeftSidebar.tsx", "utf-8");
content2 = content2.replace(/hover:bg-slate-100\[#1E293B\]/g, "hover:bg-slate-100");
fs.writeFileSync("src/components/layout/LeftSidebar.tsx", content2);
console.log("Done");
