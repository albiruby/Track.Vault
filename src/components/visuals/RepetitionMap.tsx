/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface RepetitionMapProps {
  workout: {
    entryType?: string;
    mainSet?: any[];
  };
}

export function RepetitionMap({ workout }: RepetitionMapProps) {
  const isSupport = workout.entryType === "support-routine";
  if (isSupport) return null;

  const mainSets = workout.mainSet || [];
  if (mainSets.length === 0) return null;

  return (
    <div className="space-y-3.5 w-full font-mono">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#475569] block">
        Main Set Repetition Map
      </span>

      <div className="space-y-4.5 bg-slate-50/50 p-4.5 border border-[#E2E8F0] rounded-2xl">
        {mainSets.map((block: any, bIdx: number) => {
          const reps = Math.min(block.repetitions || 1, 16); // cap visual items to prevent page overflow
          const isInterval = reps > 1;
          const targetText = block.work?.distanceMeters 
            ? `${block.work.distanceMeters}m`
            : block.work?.durationSeconds 
            ? `${block.work.durationSeconds}s`
            : "Work";

          const recText = block.recovery?.durationSeconds 
            ? `${block.recovery.durationSeconds}s`
            : block.recovery?.distanceMeters 
            ? `${block.recovery.distanceMeters}m`
            : "";

          return (
            <div key={block.id || bIdx} className="space-y-2 border-b border-slate-100 last:border-none pb-3 first:pt-0 last:pb-0">
              <div className="flex justify-between text-xs text-[#1E293B] font-semibold items-center">
                <span>
                  {block.name || `Interval Series ${bIdx + 1}`}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">
                  {block.repetitions || 1} iterations • {targetText} {block.work?.intensity ? `@ ${block.work.intensity}` : ""}
                </span>
              </div>

              {isInterval ? (
                /* Grouped intervals tiles flow */
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {Array.from({ length: block.repetitions || 1 }).map((_, repIdx) => (
                    <React.Fragment key={repIdx}>
                      <div className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 border border-sky-600 rounded-lg text-white font-bold text-[10px] text-center shadow-sm select-none shrink-0 cursor-default transition-colors">
                        {targetText}
                      </div>
                      {recText && repIdx < (block.repetitions || 1) - 1 && (
                        <div 
                          className="text-[9px] text-[#A1A1AA] italic shrink-0 font-bold px-1.5 border-b border-dashed border-[#D4D4D8] leading-none"
                          title="Recovery time gap"
                        >
                          {recText}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                /* Single structural tempo box block */
                <div className="pt-0.5">
                  <div className="w-full bg-sky-50 border border-sky-200 text-sky-800 py-3.5 px-4 rounded-xl text-center font-bold text-xs shadow-sm cursor-default">
                    Steady State Block ➡️ {targetText} {block.work?.intensity ? `[Target: ${block.work.intensity}]` : ""}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
