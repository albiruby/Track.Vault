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
    <div className="flex flex-col items-center text-center p-12 max-w-xl mx-auto my-12 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-600 mb-5 border border-orange-100 dark:border-orange-900/30">
        <HardHat className="w-6 h-6 animate-pulse" />
      </div>

      <h3 className="text-lg font-bold font-display tracking-tight text-slate-800 dark:text-slate-100">
        Workout Library Initialized
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed max-w-md">
        Workout library structure is ready. Add finalized workout JSON files to populate this vault.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full justify-center">
        <button
          onClick={onNavigateToBuilder}
          className="px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide bg-orange-600 hover:bg-orange-700 text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Open Custom Builder</span>
        </button>

        <a
          href="/docs/TRACK_VAULT_DATA_GUIDE.md"
          className="px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FileCode className="w-4 h-4 text-slate-400" />
          <span>Read Data Schema</span>
        </a>
      </div>


    </div>
  );
}
