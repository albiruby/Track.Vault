/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface VolumeBreakdownBarProps {
  workout: {
    entryType?: string;
    warmup?: any[];
    mainSet?: any[];
    cooldown?: any[];
  };
}

export function VolumeBreakdownBar({ workout }: VolumeBreakdownBarProps) {
  const isSupport = workout.entryType === "support-routine";
  if (isSupport) return null;

  // Derive logical proportions based on step metrics
  const wuBlocks = workout.warmup?.length || 0;
  const msBlocks = workout.mainSet?.length || 0;
  const cdBlocks = workout.cooldown?.length || 0;

  let totalReps = 0;
  let workReps = 0;

  // Warmup blocks count as light work reps
  totalReps += wuBlocks;

  // Sum main set iterations
  workout.mainSet?.forEach((b: any) => {
    const reps = b.repetitions || 1;
    workReps += reps;
    totalReps += reps; // each interval step counts
  });

  totalReps += cdBlocks;

  if (totalReps === 0) return null;

  const wuShare = Math.round((wuBlocks / totalReps) * 100);
  const workShare = Math.round((workReps / totalReps) * 100);
  const cdShare = Math.max(0, 100 - wuShare - workShare);

  return (
    <div className="space-y-2 w-full font-mono">
      <div className="flex justify-between items-baseline text-[10px] uppercase font-bold tracking-widest text-[#475569]">
        <span>Volume Breakdown</span>
        <span className="text-[#94A3B8]">Steps & Effort Share</span>
      </div>

      <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 shadow-inner">
        {wuShare > 0 && (
          <div style={{ width: `${wuShare}%` }} className="bg-slate-300" title={`Warmup: ${wuShare}%`} />
        )}
        {workShare > 0 && (
          <div style={{ width: `${workShare}%` }} className="bg-sky-550 bg-sky-500" title={`Main Work: ${workShare}%`} />
        )}
        {cdShare > 0 && (
          <div style={{ width: `${cdShare}%` }} className="bg-slate-700" title={`Cooldown/Taper: ${cdShare}%`} />
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-[9px] text-[#475569] font-bold uppercase mt-1 leading-none">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-slate-300 rounded" />
          <span>Prep: {wuShare}%</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-1.5 h-1.5 bg-sky-505 bg-sky-500 rounded" />
          <span>Work: {workShare}%</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <span className="w-1.5 h-1.5 bg-slate-700 rounded" />
          <span>CD: {cdShare}%</span>
        </div>
      </div>
    </div>
  );
}
