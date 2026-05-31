/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, X } from "lucide-react";

interface WorkoutSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export function WorkoutSearch({ value, onChange }: WorkoutSearchProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search workouts by title, target, tags or summary..."
        className="block w-full pl-10 pr-10 py-3 text-sm bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF4E00]/10 focus:border-[#FF4E00] text-[#111827] dark:text-[#F8FAFC] transition-all font-sans placeholder-[#9CA3AF] dark:placeholder-[#6B7280]"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
