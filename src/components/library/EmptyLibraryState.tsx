/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HardHat, Compass, FileCode } from "lucide-react";

interface EmptyLibraryStateProps {
  onNavigateToBuilder: () => void;
}

export function EmptyLibraryState({ onNavigateToBuilder }: EmptyLibraryStateProps) {
  return (
    <div className="flex flex-col items-center text-center p-10 max-w-xl mx-auto my-12 bg-white dark:bg-[#151A23] border border-[#D8DEE8] dark:border-[#2A3445] rounded-sm shadow-sm">
      <div className="w-12 h-12 rounded-sm bg-[#FFF1EA] dark:bg-[rgba(255,78,0,12)] flex items-center justify-center text-[#FF4E00] mb-5 border border-orange-100 dark:border-orange-950/40">
        <HardHat className="w-5 h-5" />
      </div>

      <h3 className="text-base font-bold tracking-tight text-[#111827] dark:text-white uppercase">
        Workout Library Empty
      </h3>

      <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-2 leading-relaxed max-w-md">
         No workouts match your current filter parameters. Expand criteria or program a fresh custom session in the Builder.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full justify-center">
        <button
          onClick={onNavigateToBuilder}
          className="px-5 py-2.5 rounded-sm font-bold text-xs tracking-wide bg-[#FF4E00] hover:bg-[#E64600] text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans"
        >
          <Compass className="w-4 h-4" />
          <span>Open Custom Builder</span>
        </button>
      </div>


    </div>
  );
}
