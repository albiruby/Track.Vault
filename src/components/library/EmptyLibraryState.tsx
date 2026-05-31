/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HardHat, Compass } from "lucide-react";

interface EmptyLibraryStateProps {
  onNavigateToBuilder: () => void;
}

export function EmptyLibraryState({ onNavigateToBuilder }: EmptyLibraryStateProps) {
  return (
    <div className="flex flex-col items-center text-center p-10 max-w-xl mx-auto my-12 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl shadow-sm">
      <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/20 flex items-center justify-center text-sky-500 dark:text-sky-400 mb-5 border border-sky-100 dark:border-sky-900/40">
        <HardHat className="w-5 h-5" />
      </div>

      <h3 className="text-base font-bold tracking-tight text-[#0F172A] dark:text-white uppercase font-display">
        Workout Library Empty
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-md">
         No workouts match your current filter parameters. Expand criteria or program a fresh custom session in the Builder.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full justify-center">
        <button
          onClick={onNavigateToBuilder}
          className="px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide bg-sky-500 hover:bg-sky-600 text-white shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans"
        >
          <Compass className="w-4 h-4" />
          <span>Open Custom Builder</span>
        </button>
      </div>
    </div>
  );
}
