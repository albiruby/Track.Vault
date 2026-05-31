/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Workout } from "../../types/workout";
import { matchSidebarDistance } from "../../lib/workouts";
import { WORKOUT_DISTANCE_NAV } from "../../data/workouts/workoutDistanceNav";
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
    const cls = `w-4 h-4 transition-colors ${active ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-sky-500"}`;
    switch (id) {
      case "all":
        return <Activity className={cls} />;
      case "100m":
      case "200m":
      case "400m":
        return <Zap className={cls} />;
      case "800m":
      case "1500m":
      case "mile":
        return <Flame className={cls} />;
      case "3k":
      case "5k":
      case "10k":
        return <Gauge className={cls} />;
      case "half-marathon":
      case "marathon":
        return <Compass className={cls} />;
      case "trail":
        return <Mountain className={cls} />;
      case "treadmill":
        return <Smartphone className={cls} />;
      case "base-recovery":
        return <Heart className={cls} />;
      case "general":
      default:
        return <MapPin className={cls} />;
    }
  };

  const menuContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#111827] border-r border-[#E2E8F0] dark:border-[#334155] select-none">
      {/* Sidebar Top: Branding Logo Block */}
      <div 
        onClick={() => {
          onNavigateHome();
          onClose();
        }}
        className="h-18 px-6 flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#334155] cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white shadow-md shadow-sky-500/20">
            <span className="font-display font-black text-sm">TV</span>
          </div>
          <div>
            <span className="text-md font-black tracking-tight uppercase text-slate-900 dark:text-white font-display">
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
          className="lg:hidden p-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 hover:bg-slate-50 text-slate-500 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sidebar Middle Section: Filter Title and Distance Options Scrollbox */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div>
          <h3 className="px-3 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-display">
            Categories
          </h3>
          <p className="px-3 text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-normal mb-3 leading-none">
            Filter Workouts
          </p>

          <div className="space-y-1">
            {WORKOUT_DISTANCE_NAV.map((item) => {
              const count = workouts.filter((w) => matchSidebarDistance(w, item.id)).length;
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
                      ? "bg-sky-500 text-white font-bold shadow-md shadow-sky-500/10"
                      : count === 0
                      ? "text-slate-350 dark:text-slate-600 line-through opacity-50 cursor-not-allowed"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:text-slate-900 dark:hover:text-white"
                  }`}
                  disabled={count === 0}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0">
                      {getIcon(item.id, isActive)}
                    </span>
                    <span className="truncate tracking-tight font-medium">{item.label}</span>
                  </div>
                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-50 dark:bg-[#1E293B] text-slate-500 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-[#334155]"
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
      <div className="p-4 border-t border-[#E2E8F0] dark:border-[#334155] bg-slate-50/50 dark:bg-slate-900/40 text-center">
        <span className="font-mono text-[9px] font-semibold text-slate-400 tracking-wider block uppercase">
          PERFORMANCE PACER v1.1
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Layout Frame (Left fixed) */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 bg-white dark:bg-[#111827] border-r border-[#E2E8F0] dark:border-[#334155] z-30">
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
