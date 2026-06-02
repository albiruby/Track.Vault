/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TrendingUp } from "lucide-react";

interface EffortStripProps {
  workout: {
    entryType?: string;
    warmup?: any[];
    mainSet?: any[];
    cooldown?: any[];
  };
}

export function EffortStrip({ workout }: EffortStripProps) {
  const isSupport = workout.entryType === "support-routine";
  if (isSupport) return null;

  const msBlocks = workout.mainSet || [];

  // Compose sequence of data points representing workout effort levels
  // Pacing is scaled 0 to 100
  const points: { label: string; xPct: number; yEffort: number; isWork: boolean }[] = [];

  // Hardcode warmup ramp config
  points.push({ label: "Start", xPct: 0, yEffort: 10, isWork: false });
  points.push({ label: "WU Easy", xPct: 15, yEffort: 30, isWork: false });

  // Main set details
  if (msBlocks.length > 0) {
    const msStartPct = 25;
    const msEndPct = 85;
    const msSpan = msEndPct - msStartPct;

    msBlocks.forEach((block: any, idx: number) => {
      const startX = msStartPct + (idx / msBlocks.length) * msSpan;
      const endX = msStartPct + ((idx + 1) / msBlocks.length) * msSpan;

      const intens = (block.work?.intensity || "").toLowerCase();
      let effort = 65; // Moderate pace
      if (intens.includes("sprint") || intens.includes("max") || intens.includes("100%")) {
        effort = 100;
      } else if (intens.includes("hard") || intens.includes("5k") || intens.includes("3k") || intens.includes("mile")) {
        effort = 85;
      } else if (intens.includes("threshold") || intens.includes("tempo") || intens.includes("10k")) {
        effort = 75;
      } else if (intens.includes("easy") || intens.includes("recovery")) {
        effort = 35;
      }

      // Add actual interval Work Spike
      points.push({ label: block.name || "Work", xPct: startX + 1, yEffort: effort, isWork: true });
      points.push({ label: block.name || "Work", xPct: startX + (block.recovery ? 4 : 5), yEffort: effort, isWork: true });

      // Add Interval Recovery Valley if recovery block is registered
      if (block.recovery && block.recovery.type !== "none") {
        let recEffort = 25; // Passive/Walk
        if (block.recovery.type.includes("jog") || block.recovery.type.includes("active")) {
          recEffort = 40;
        }
        points.push({ label: "Recovery", xPct: startX + (block.recovery ? 4.5 : 5.5), yEffort: recEffort, isWork: false });
        points.push({ label: "Recovery", xPct: endX - 0.5, yEffort: recEffort, isWork: false });
      }
    });
  } else {
    // Standard flat middle block if no mainset steps
    points.push({ label: "Steady", xPct: 50, yEffort: 40, isWork: true });
  }

  // Cooldown taper
  points.push({ label: "CD Jog", xPct: 90, yEffort: 20, isWork: false });
  points.push({ label: "Finish", xPct: 100, yEffort: 10, isWork: false });

  // Map points to SVG coordinates (Width 500, Height 80, invert Y coordinate for graphics)
  const svgH = 80;
  const mapY = (effortVal: number) => {
    const usableH = svgH - 20; // 60px
    return svgH - 10 - (effortVal / 100) * usableH;
  };

  const linePath = points.map(p => `${(p.xPct / 100) * 500},${mapY(p.yEffort)}`).join(" ");
  // Area path enclosing back to bottom
  const areaPath = `${linePath} 500,${svgH - 5} 0,${svgH - 5} Z`;

  return (
    <div className="space-y-3.5 w-full p-4.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono">
      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <span className="text-[10px] tracking-widest text-[#475569] font-black uppercase flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-sky-505" />
          Workout Intensity Curve
        </span>
        <span className="text-[9px] text-[#94A3B8] font-bold uppercase">
          Scaled Pace Progression
        </span>
      </div>
      
      <div className="relative w-full overflow-hidden pt-1">
        <svg viewBox="0 0 500 80" className="w-full h-auto drop-shadow-sm overflow-visible">
          <defs>
            <linearGradient id="effortGradDetail" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="lineGradDetail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="30%" stopColor="#0EA5E9" />
              <stop offset="85%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
          </defs>

          {/* Guidelines */}
          <line x1="0" y1={mapY(100)} x2="500" y2={mapY(100)} stroke="#E2E8F0" strokeDasharray="3,3" />
          <line x1="0" y1={mapY(50)} x2="500" y2={mapY(50)} stroke="#F1F5F9" strokeDasharray="2,2" />
          <line x1="0" y1={mapY(10)} x2="500" y2={mapY(10)} stroke="#E2E8F0" />

          {/* Legend bounds text */}
          <text x="5" y={mapY(100) - 3} className="text-[8px] fill-slate-400 font-bold tracking-wider">100% INTENT</text>
          <text x="5" y={mapY(50) - 3} className="text-[8px] fill-slate-350 font-semibold tracking-wider">50% MID</text>
          <text x="5" y={mapY(10) + 10} className="text-[8px] fill-slate-400 font-bold tracking-wider">EASY JOG</text>

          {/* Area under the curve */}
          <polygon points={areaPath} fill="url(#effortGradDetail)" />

          {/* Flow path line */}
          <polyline 
            fill="none" 
            stroke="url(#lineGradDetail)" 
            strokeWidth="2.5" 
            points={linePath} 
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Nodes markers for key work blocks */}
          {points.filter(p => p.isWork).slice(0, 12).map((p, i) => (
            <circle 
              key={i} 
              cx={(p.xPct / 100) * 500} 
              cy={mapY(p.yEffort)} 
              r="3.5" 
              fill="#0EA5E9" 
              stroke="#FFF" 
              strokeWidth="1.5" 
            />
          ))}
        </svg>
      </div>

      <div className="flex justify-between items-center text-[9px] text-[#64748B] pt-1">
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-slate-300 rounded" />Warm-up Prep</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-sky-500 rounded" />Main Target Set</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-slate-700 rounded" />Cooldown Taper</span>
      </div>
    </div>
  );
}
