/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SlidersHorizontal } from "lucide-react";

interface WorkoutSortProps {
  value: string;
  onChange: (v: string) => void;
}

export function WorkoutSort({ value, onChange }: WorkoutSortProps) {
  const options = [
    { value: "title", label: "Sort: Title (A-Z)" },
    { value: "difficulty-asc", label: "Sort: Core Difficulty (Mellow First)" },
    { value: "difficulty-desc", label: "Sort: Core Difficulty (Severe First)" },
    { value: "duration-asc", label: "Sort: Total Duration (Shorter First)" },
    { value: "duration-desc", label: "Sort: Total Duration (Longer First)" },
    { value: "distance-asc", label: "Sort: Estimated Volume (Lower First)" },
    { value: "distance-desc", label: "Sort: Estimated Volume (Higher First)" },
    { value: "level", label: "Sort: Athlete Level" },
  ];

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <SlidersHorizontal className="w-3.5 h-3.5" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-9 pr-10 py-3 text-xs md:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-700 dark:text-slate-300 transition-all font-sans cursor-pointer appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
