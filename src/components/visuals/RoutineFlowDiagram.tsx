/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Dumbbell } from "lucide-react";

interface RoutineFlowDiagramProps {
  routine: {
    sessionStructure?: any[] | string;
    exercises?: any[];
  };
}

export function RoutineFlowDiagram({ routine }: RoutineFlowDiagramProps) {
  const structure = routine.sessionStructure;
  
  // Cleanly fall back if string is provided
  const structArr = Array.isArray(structure) ? structure : (Array.isArray(routine.exercises) ? routine.exercises : []);

  if (structArr.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400 italic rounded-2xl font-mono">
        Exercise routine specifications are rendered in structural list layout.
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full font-mono">
      <div className="flex justify-between items-baseline border-b border-slate-205 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#475569] flex items-center gap-1.5">
          <Dumbbell className="w-3.5 h-3.5 text-blue-600" />
          Sequence Station Flow
        </span>
        <span className="text-[9px] text-blue-600 font-bold uppercase">
          {structArr.length} Stations Circuit
        </span>
      </div>

      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {structArr.map((ex: any, idx: number) => {
          const mainSpec = ex.sets 
            ? (ex.reps ? `${ex.sets}x${ex.reps}` : ex.durationSeconds ? `${ex.sets} sets • ${ex.durationSeconds}s` : `${ex.sets} sets`) 
            : (ex.reps ? `${ex.reps} reps` : (ex.durationSeconds ? `${ex.durationSeconds}s hold` : ""));
          
          const sideText = ex.side && ex.side !== "none" && ex.side !== "both" ? `${ex.side} side` : "";
          const restText = ex.restSeconds ? `Rest ${ex.restSeconds}s` : "";

          return (
            <div 
              key={idx} 
              className="group p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-xl flex gap-3 items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-5.5 h-5.5 rounded-full bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center font-bold text-[10px] transition-colors shrink-0">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-800 block truncate group-hover:text-blue-700 transition-colors">
                    {ex.name || "Station"}
                  </span>
                  {ex.notes && (
                    <span className="text-[9px] text-slate-400 italic block truncate mt-0.5 leading-none">
                      ↳ {Array.isArray(ex.notes) ? ex.notes.join(". ") : ex.notes}
                    </span>
                  )}
                </div>
              </div>

              {/* Specs Badge chips */}
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase shrink-0">
                {mainSpec && (
                  <span className="px-2 py-0.5 bg-blue-50/70 text-blue-700 border border-blue-100 rounded">
                    {mainSpec}
                  </span>
                )}
                {sideText && (
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {sideText}
                  </span>
                )}
                {restText && (
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-450 rounded text-center shrink-0">
                    ⏱ {restText}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
