import fs from "fs";

let content = fs.readFileSync("src/App.tsx", "utf-8");
content = content.replace(
  'bg-[#111827] text-white p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-[#334155]',
  'bg-blue-50/50 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-blue-100'
);
content = content.replace(
  'text-slate-350 leading-relaxed mt-0.5',
  'text-slate-600 leading-relaxed mt-0.5'
);
content = content.replace(
  'text-slate-400 font-bold',
  'text-blue-800 font-bold'
);
fs.writeFileSync("src/App.tsx", content);
console.log("Done");
