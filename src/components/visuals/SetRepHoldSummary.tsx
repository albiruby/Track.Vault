/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Dumbbell, Clock, Timer, Layers } from "lucide-react";

interface SetRepHoldSummaryProps {
  routine: {
    sessionStructure?: any[] | string;
    exercises?: any[];
  };
}

export function SetRepHoldSummary({ routine }: SetRepHoldSummaryProps) {
  const structure = routine.sessionStructure;
  const structArr = Array.isArray(structure) ? structure : (Array.isArray(routine.exercises) ? routine.exercises : []);

  if (structArr.length === 0) return null;

  let totalSets = 0;
  let totalRepsCount = 0;
  let holdsCount = 0;
  let holdsSum = 0;

  structArr.forEach((ex: any) => {
    const sets = ex.sets || 1;
    totalSets += sets;

    if (ex.reps) {
      totalRepsCount += (sets * ex.reps);
    }
    
    if (ex.durationSeconds) {
      holdsCount++;
      holdsSum += ex.durationSeconds;
    }
  });

  return (
    <div className="space-y-2 w-full font-mono">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#475569] block">
        Routine Structural Metrics
      </span>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/50 p-4 border border-[#E2E8F0] rounded-2xl">
        <div className="text-center p-2.5 bg-white border border-slate-200/50 rounded-xl flex flex-col items-center justify-center shadow-xs">
          <Dumbbell className="w-4 h-4 text-blue-600 mb-1 shrink-0" />
          <span className="text-[9px] text-slate-400 uppercase font-bold">Total Exercises</span>
          <span className="text-sm font-semibold font-mono text-slate-800 mt-0.5">
            {structArr.length} Stations
          </span>
        </div>

        <div className="text-center p-2.5 bg-white border border-slate-200/50 rounded-xl flex flex-col items-center justify-center shadow-xs">
          <Layers className="w-4 h-4 text-blue-600 mb-1 shrink-0" />
          <span className="text-[9px] text-slate-400 uppercase font-bold">Accumulated Sets</span>
          <span className="text-sm font-semibold font-mono text-slate-800 mt-0.5">
            {totalSets} Sets
          </span>
        </div>

        <div className="text-center p-2.5 bg-white border border-slate-200/50 rounded-xl flex flex-col items-center justify-center shadow-xs">
          <Timer className="w-4 h-4 text-blue-600 mb-1 shrink-0" />
          <span className="text-[9px] text-slate-400 uppercase font-bold">Dynamic Reps</span>
          <span className="text-sm font-semibold font-mono text-slate-800 mt-0.5">
            {totalRepsCount > 0 ? `${totalRepsCount} reps` : "Steady holds"}
          </span>
        </div>

        <div className="text-center p-2.5 bg-white border border-slate-200/50 rounded-xl flex flex-col items-center justify-center shadow-xs">
          <Clock className="w-4 h-4 text-blue-600 mb-1 shrink-0" />
          <span className="text-[9px] text-slate-400 uppercase font-bold">Total Holds Duration</span>
          <span className="text-sm font-semibold font-mono text-slate-800 mt-0.5">
            {holdsCount > 0 ? `${Math.round(holdsSum)}s total` : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
