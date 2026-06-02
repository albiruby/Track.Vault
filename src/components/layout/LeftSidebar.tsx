/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Workout } from "../../types/workout";
import { trackVaultNavigation } from "../../data/workouts/trackVaultNavigation.v1.2";
import { matchSidebarDistance } from "../../lib/workouts";
import { WORKOUT_DISTANCE_NAV } from "../../lib/workouts";
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
 Gauge,
 X
} from "lucide-react";
import { TrackVaultIcon } from "../icons/trackVaultIcons";

interface LeftSidebarProps {
 selectedDistance: string;
 onSelectDistance: (dist: string) => void;
 workouts: Workout[];
 isOpen: boolean;
 onClose: () => void;
 onNavigateHome: () => void;
 onNavigateTo: (route: string) => void;
}

export function LeftSidebar({
 selectedDistance,
 onSelectDistance,
 workouts,
 isOpen,
 onClose,
 onNavigateHome,
 onNavigateTo,
}: LeftSidebarProps) {

 // Minimal and distinct Lucide Icons matching the dashboard screenshot
 const getIcon = (id: string, active: boolean) => {
    const cls = `w-4 h-4 transition-colors ${active ? "text-white" : "text-slate-500 group-hover:text-blue-600"}`;
    const lookupId = id === "all" ? "all-running" : id === "base-recovery" ? "base" : id;
    return <TrackVaultIcon id={lookupId} className={cls} />;
  };

  const menuContent = (
 <div className="flex flex-col h-full bg-[#F8FAFC] border-r border-[#E2E8F0] select-none">
 {/* Sidebar Top: Branding Logo Block */}
 <div 
 onClick={() => {
 onNavigateHome();
 onClose();
 }}
 className="h-18 px-6 flex items-center justify-between border-b border-[#E2E8F0] cursor-pointer hover:bg-slate-50 transition-colors"
 >
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
 <span className="font-display font-black text-sm">TV</span>
 </div>
 <div>
 <span className="text-md font-black tracking-tight uppercase text-slate-900 font-display">
 TRACK.VAULT
 </span>
 </div>
 </div>
 
 {/* Mobile close button */}
 <button 
 onClick={(e) => {
 e.stopPropagation();
 onClose();
 }}
 className="lg:hidden p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-slate-500 cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Sidebar Middle Section: Filter Title and Distance Options Scrollbox */}
 <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
 <div>
          <h3 className="px-3 text-xs font-black uppercase tracking-wider text-slate-900 font-display">
            A. Running Workouts
          </h3>
          <p className="px-3 text-[10px] text-slate-400 font-mono tracking-normal mb-3 leading-none">
            Track & Field Events
          </p>
          <div className="space-y-1">
            <button
              onClick={() => {
                onSelectDistance("All Running");
                onNavigateTo("library");
                onClose();
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer group ${
                selectedDistance === "All Running" || selectedDistance === "All Workouts"
                  ? "bg-blue-600 text-white font-bold shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="shrink-0 font-bold"><TrackVaultIcon id="all-running" className="w-4 h-4" /></span>
                <span className="truncate tracking-tight font-medium">All Running</span>
              </div>
              <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-500`}>
                {workouts.filter(w => w.entryType !== "support-routine").length}
              </span>
            </button>
            {trackVaultNavigation.runningNavigation.map((item) => {
              const count = workouts.filter(w => w.entryType !== "support-routine" && w.distanceNavId?.toLowerCase() === item.id.toLowerCase()).length;
              const isActive = selectedDistance.toLowerCase() === item.id.toLowerCase() || 
                               selectedDistance.toLowerCase() === item.label.toLowerCase();
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectDistance(item.label);
                    onNavigateTo("library");
                    onClose();
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer group ${
                    isActive
                      ? "bg-blue-600 text-white font-bold shadow-sm"
                      : count === 0
                      ? "text-slate-400 line-through opacity-50 cursor-not-allowed"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  disabled={count === 0}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0 font-bold">
                      {getIcon(item.id, isActive)}
                    </span>
                    <span className="truncate tracking-tight font-medium">{item.label}</span>
                  </div>
                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="px-3 text-xs font-black uppercase tracking-wider text-slate-900 font-display mt-6">
            B. Support Training
          </h3>
          <p className="px-3 text-[10px] text-slate-400 font-mono tracking-normal mb-3 leading-none">
            Routines & Drills
          </p>
          <div className="space-y-1">
            <button
              onClick={() => {
                onSelectDistance("All Support");
                onNavigateTo("library");
                onClose();
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer group ${
                selectedDistance === "All Support"
                  ? "bg-blue-600 text-white font-bold shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="shrink-0 font-bold"><TrackVaultIcon id="all-support" className="w-4 h-4" /></span>
                <span className="truncate tracking-tight font-medium">All Support</span>
              </div>
              <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-500`}>
                {workouts.filter(w => w.entryType === "support-routine").length}
              </span>
            </button>
            {trackVaultNavigation.supportNavigation.map((item) => {
              const count = workouts.filter(w => w.entryType === "support-routine" && w.supportCategoryId?.toLowerCase() === item.id.toLowerCase()).length;
              const isActive = selectedDistance.toLowerCase() === item.id.toLowerCase() || 
                               selectedDistance.toLowerCase() === item.label.toLowerCase();
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectDistance(item.label);
                    onNavigateTo("library");
                    onClose();
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer group ${
                    isActive
                      ? "bg-blue-600 text-white font-bold shadow-sm"
                      : count === 0
                      ? "text-slate-400 line-through opacity-50 cursor-not-allowed"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  disabled={count === 0}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0 font-bold">
                      {getIcon(item.id, isActive)}
                    </span>
                    <span className="truncate tracking-tight font-medium">{item.label}</span>
                  </div>
                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
 </div>

 {/* Sidebar Footer Stamp */}
 <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/50 text-center">
 <span className="font-mono text-[9px] font-semibold text-slate-400 tracking-wider block uppercase">
 TRACK.VAULT WORKOUTS v1.2
 </span>
 </div>
 </div>
 );

 return (
 <>
 {/* Desktop Sidebar Layout Frame (Left fixed) */}
 <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 bg-[#F8FAFC] border-r border-[#E2E8F0] z-30">
 {menuContent}
 </aside>

 {/* Mobile Drawer Slide-out Container */}
 {isOpen && (
 <div className="lg:hidden fixed inset-0 z-50 flex">
 {/* Backdrop Overlay */}
 <div 
 onClick={onClose}
 className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
 />

 {/* Left Menu Drawer */}
 <div className="relative flex flex-col w-64 h-full max-w-xs animate-slide-right shadow-2xl">
 {menuContent}
 </div>
 </div>
 )}
 </>
 );
}
