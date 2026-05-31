/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { getWorkoutIndex, getWorkoutsByCategory } from "../../lib/workouts";
import { FolderHeart, HardHat } from "lucide-react";

export function WorkoutCategorySummary() {
  const indexManifest = getWorkoutIndex();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <FolderHeart className="w-4 h-4 text-orange-500 animate-pulse" />
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
          Library Modules Roadmap
        </h4>
      </div>

      <div className="space-y-3">
        {indexManifest.categories.map((cat) => {
          const currentCount = getWorkoutsByCategory(cat.id).length;
          const pct = Math.min(Math.round((currentCount / cat.targetWorkoutCount) * 100), 100);

          return (
            <div key={cat.id} className="text-xs group">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
                <span className="font-semibold text-[11px] group-hover:text-orange-500 transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {currentCount} / {cat.targetWorkoutCount} target
                </span>
              </div>
              
              {/* Micro visual bar */}
              <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${pct || 4}%` }} // Min 4% for design placeholder trace
                  className={`h-full rounded-full transition-all duration-300 ${
                    pct > 0 ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-700 opacity-40 border-dashed"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <p className="text-[10px] font-medium leading-relaxed text-slate-400 flex items-center gap-1">
          <HardHat className="w-3.5 h-3.5 text-orange-500" />
          <span>Targets indicate upcoming finalized JSON release plans.</span>
        </p>
      </div>
    </div>
  );
}
