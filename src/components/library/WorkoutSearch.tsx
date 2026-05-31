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
        className="block w-full pl-10 pr-10 py-3 text-sm bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 text-[#0F172A] dark:text-[#F8FAFC] transition-all font-sans placeholder-[#94A3B8] dark:placeholder-[#64748B]"
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
