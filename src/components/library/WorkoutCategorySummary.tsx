/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Workout } from "../../types/workout";
import { matchSidebarDistance } from "../../lib/workouts";
import { WORKOUT_DISTANCE_NAV, DistanceNavItem } from "../../data/workouts/workoutDistanceNav";
import { 
 Compass, 
 Flame, 
 MapPin, 
 Activity, 
 Zap, 
 Footprints, 
 Mountain, 
 Heart, 
 Smartphone,
 Gauge
} from "lucide-react";

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
 const getIcon = (id: string) => {
 switch (id) {
 case "all":
 return <Activity className="w-3.5 h-3.5" />;
 case "100m":
 case "200m":
 case "400m":
 return <Zap className="w-3.5 h-3.5 text-amber-500" />;
 case "800m":
 case "1500m":
 case "mile":
 return <Flame className="w-3.5 h-3.5 text-orange-500" />;
 case "3k":
 case "5k":
 case "10k":
 return <Gauge className="w-3.5 h-3.5 text-[#FF4E00]" />;
 case "half-marathon":
 case "marathon":
 return <Compass className="w-3.5 h-3.5 text-blue-500" />;
 case "trail":
 return <Mountain className="w-3.5 h-3.5 text-emerald-600 " />;
 case "treadmill":
 return <Smartphone className="w-3.5 h-3.5 text-indigo-500" />;
 case "base-recovery":
 return <Heart className="w-3.5 h-3.5 text-rose-500" />;
 case "general":
 default:
 return <MapPin className="w-3.5 h-3.5 text-slate-400" />;
 }
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
 <span className={`transition-transform group-hover:scale-105 duration-200 ${isActive ? "text-[#FF4E00]" : "text-slate-400 "}`}>
 {getIcon(item.id)}
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
