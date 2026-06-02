/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Workout } from "../../types/workout";
import { matchSidebarDistance } from "../../lib/workouts";
import { WORKOUT_DISTANCE_NAV, DistanceNavItem } from "../../lib/workouts";
import { Footprints } from "lucide-react";
import { TrackVaultIcon } from "../icons/trackVaultIcons";

interface DistanceMenuProps {
 selectedDistance: string; // matches item.id or item.label
 onSelectDistance: (dist: string) => void;
 workouts: Workout[];
}

export function DistanceMenu({
  selectedDistance,
  onSelectDistance,
  workouts
}: DistanceMenuProps) {

  // Map each distance option ID/label to an appropriate minimal lucide icon
  const getIcon = (id: string, active: boolean) => {
    const cls = `w-3.5 h-3.5 transition-colors ${active ? "text-[#FF4E00]" : "text-slate-400 group-hover:text-[#FF4E00]"}`;
    const lookupId = id === "all" ? "all-running" : id === "base-recovery" ? "base" : id;
    return <TrackVaultIcon id={lookupId} className={cls} />;
  };

  return (
 <div className="bg-white border border-[#D8DEE8] rounded-sm p-5 space-y-4 shadow-xs">
 <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
 <Footprints className="w-4 h-4 text-[#FF4E00]" />
 <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] ">
 Workout Distance
 </h4>
 </div>

 <div className="space-y-0.5 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-250">
 {WORKOUT_DISTANCE_NAV.map((item) => {
 const count = workouts.filter((w) => matchSidebarDistance(w, item.id)).length;
 const isActive = selectedDistance.toLowerCase() === item.id.toLowerCase() || 
 selectedDistance.toLowerCase() === item.label.toLowerCase();

 return (
 <button
 key={item.id}
 onClick={() => onSelectDistance(item.label)} // Use standard label to sync back cleanly with app title/filters
 className={`w-full text-left px-3 py-2 rounded-sm text-xs transition-all flex items-center justify-between cursor-pointer group ${
 isActive
 ? "bg-orange-50 text-[#FF4E00] font-bold border-l-2 border-[#FF4E00]"
 : count === 0
 ? "text-slate-400 line-through opacity-60"
 : "text-slate-600 hover:bg-slate-50[#1B2230] hover:text-[#111827]"
 }`}
 >
 <div className="flex items-center gap-2.5 min-w-0">
 <span className="transition-transform group-hover:scale-105 duration-200">
  {getIcon(item.id, isActive)}
  </span>
 <span className="truncate">{item.label}</span>
 </div>
 <span
 className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
 isActive
 ? "bg-[#FF4E00] text-white"
 : count === 0
 ? "bg-slate-100 text-slate-400 "
 : "bg-slate-50 text-slate-500 group-hover:bg-slate-100"
 }`}
 >
 {count}
 </span>
 </button>
 );
 })}
 </div>
 </div>
 );
}
