/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 * Track.Vault v1.3 LeftSidebar layout
 */

import React from "react";
import { Workout } from "../../types/workout";
import { trackVaultNavigation } from "../../data/workouts/trackVaultNavigation.v1.2";
import { TrackVaultIcon } from "../icons/trackVaultIcons";
import { matchSidebarDistance } from "../../lib/workouts";
import { 
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2
} from "lucide-react";

interface LeftSidebarProps {
  selectedDistance: string;
  onSelectDistance: (dist: string) => void;
  workouts: Workout[];
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
  onNavigateTo: (route: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function LeftSidebar({
  selectedDistance,
  onSelectDistance,
  workouts,
  isOpen,
  onClose,
  onNavigateHome,
  onNavigateTo,
  isCollapsed,
  onToggleCollapse,
}: LeftSidebarProps) {

  // Minimal and distinct Lucide Icons matching the dashboard layout classes
  const getIcon = (id: string, active: boolean) => {
    const cls = `w-4 h-4 transition-colors ${active ? "text-white" : "text-slate-500 group-hover:text-blue-600"}`;
    const lookupId = id === "all" ? "all-running" : id === "base-recovery" ? "base" : id;
    return <TrackVaultIcon id={lookupId} className={cls} />;
  };

  // Renders the actual sidebar inner structure (logo, menus, categories, version)
  const renderSidebarInner = (collapsed: boolean) => {
    return (
      <div className="flex flex-col h-full bg-[#F8FAFC] select-none">
        
        {/* A. Branding Logo Block */}
        <div 
          onClick={onNavigateHome}
          className={`h-18 flex items-center border-b border-[#E2E8F0] cursor-pointer hover:bg-slate-50 transition-colors ${
            collapsed ? "justify-center px-1" : "justify-between px-6"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
              <span className="font-display font-black text-sm">TV</span>
            </div>
            {!collapsed && (
              <span className="text-md font-black tracking-tight uppercase text-slate-900 font-display truncate">
                TRACK.VAULT
              </span>
            )}
          </div>
          
          {/* Mobile close button (never shown when collapsed because collapse is only desktop) */}
          {!collapsed && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="lg:hidden p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* B. Filter List Scrollbox */}
        <div className={`flex-1 overflow-y-auto py-6 space-y-5 scrollbar-thin ${collapsed ? "px-2" : "px-4"}`}>
          
          {/* Section 1: Running Workouts */}
          <div>
            {collapsed ? (
              <div className="border-t border-slate-200/85 my-3 first:mt-0" title="Running Workouts" />
            ) : (
              <div>
                <h3 className="px-3 text-xs font-black uppercase tracking-wider text-slate-900 font-display">
                  A. Running Workouts
                </h3>
                <p className="px-3 text-[10px] text-slate-400 font-mono tracking-normal mb-3 leading-none animate-fade-in">
                  Track & Field Events
                </p>
              </div>
            )}
            
            <div className="space-y-1">
              <button
                onClick={() => {
                  onSelectDistance("All Running");
                  onNavigateTo("library");
                  onClose();
                }}
                title={`All Running — ${workouts.filter(w => w.entryType !== "support-routine").length}`}
                aria-label={`All Running — ${workouts.filter(w => w.entryType !== "support-routine").length} entries`}
                className={
                  collapsed
                    ? `w-12 h-12 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none ${
                        selectedDistance === "All Running" || selectedDistance === "All Workouts"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    : `w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none ${
                        selectedDistance === "All Running" || selectedDistance === "All Workouts"
                          ? "bg-blue-600 text-white font-bold shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                }
              >
                {collapsed ? (
                  <TrackVaultIcon 
                    id="all-running" 
                    className={`w-4 h-4 transition-colors ${
                      selectedDistance === "All Running" || selectedDistance === "All Workouts" 
                        ? "text-white" 
                        : "text-slate-500 group-hover:text-blue-600"
                    }`} 
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="shrink-0 font-bold">
                        <TrackVaultIcon id="all-running" className="w-4 h-4" />
                      </span>
                      <span className="truncate tracking-tight font-medium">All Running</span>
                    </div>
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-500`}>
                      {workouts.filter(w => w.entryType !== "support-routine").length}
                    </span>
                  </>
                )}
              </button>

              {trackVaultNavigation.runningNavigation.filter(item => item.id !== "all").map((item) => {
                const count = workouts.filter(w => matchSidebarDistance(w, item.label)).length;
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
                    title={`${item.label} — ${count} running workouts`}
                    aria-label={`${item.label} — ${count} running workouts`}
                    disabled={count === 0}
                    className={
                      collapsed
                        ? `w-12 h-12 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none ${
                            isActive
                              ? "bg-blue-600 text-white shadow-sm"
                              : count === 0
                              ? "text-slate-400 line-through opacity-50 cursor-not-allowed"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`
                        : `w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none ${
                            isActive
                              ? "bg-blue-600 text-white font-bold shadow-sm"
                              : count === 0
                              ? "text-slate-400 line-through opacity-50 cursor-not-allowed"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`
                    }
                  >
                    {collapsed ? (
                      getIcon(item.id, isActive)
                    ) : (
                      <>
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
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Support Training */}
          <div>
            {collapsed ? (
              <div className="border-t border-slate-200/85 my-3" title="Support routines" />
            ) : (
              <div>
                <h3 className="px-3 text-xs font-black uppercase tracking-wider text-slate-900 font-display mt-4">
                  B. Support Training
                </h3>
                <p className="px-3 text-[10px] text-slate-400 font-mono tracking-normal mb-3 leading-none animate-fade-in">
                  Routines & Drills
                </p>
              </div>
            )}
            
            <div className="space-y-1">
              <button
                onClick={() => {
                  onSelectDistance("All Support");
                  onNavigateTo("library");
                  onClose();
                }}
                title={`All Support — ${workouts.filter(w => w.entryType === "support-routine").length}`}
                aria-label={`All Support — ${workouts.filter(w => w.entryType === "support-routine").length} entries`}
                className={
                  collapsed
                    ? `w-12 h-12 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none ${
                        selectedDistance === "All Support"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    : `w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none ${
                        selectedDistance === "All Support"
                          ? "bg-blue-600 text-white font-bold shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                }
              >
                {collapsed ? (
                  <TrackVaultIcon 
                    id="all-support" 
                    className={`w-4 h-4 transition-colors ${
                      selectedDistance === "All Support" 
                        ? "text-white" 
                        : "text-slate-500 group-hover:text-blue-600"
                    }`} 
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="shrink-0 font-bold">
                        <TrackVaultIcon id="all-support" className="w-4 h-4" />
                      </span>
                      <span className="truncate tracking-tight font-medium">All Support</span>
                    </div>
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-500`}>
                      {workouts.filter(w => w.entryType === "support-routine").length}
                    </span>
                  </>
                )}
              </button>

              {trackVaultNavigation.supportNavigation.filter(item => item.id !== "all").map((item) => {
                const count = workouts.filter(w => matchSidebarDistance(w, item.label)).length;
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
                    title={`${item.label} — ${count} support routines`}
                    aria-label={`${item.label} — ${count} support routines`}
                    disabled={count === 0}
                    className={
                      collapsed
                        ? `w-12 h-12 mx-auto flex items-center justify-center rounded-xl transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none ${
                            isActive
                              ? "bg-blue-600 text-white shadow-sm"
                              : count === 0
                              ? "text-slate-400 line-through opacity-50 cursor-not-allowed"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`
                        : `w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none ${
                            isActive
                              ? "bg-blue-600 text-white font-bold shadow-sm"
                              : count === 0
                              ? "text-slate-400 line-through opacity-50 cursor-not-allowed"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`
                    }
                  >
                    {collapsed ? (
                      getIcon(item.id, isActive)
                    ) : (
                      <>
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
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* C. Sidebar Footer Stamp */}
        <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/50 text-center flex items-center justify-center min-h-12 overflow-hidden shrink-0">
          {collapsed ? (
            <span className="font-mono text-[9px] font-bold text-slate-400 tracking-wide block leading-none">
              v1.3
            </span>
          ) : (
            <span className="font-mono text-[9px] font-semibold text-slate-400 tracking-wider block uppercase truncate leading-none">
              TRACK.VAULT WORKOUTS v1.3
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. Desktop Sidebar Container Frame (Left fixed, dynamically resizes with smooth transitions) */}
      <aside 
        className={`hidden lg:block h-screen fixed inset-y-0 left-0 bg-[#F8FAFC] border-r border-[#E2E8F0] z-30 transition-all duration-200 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {renderSidebarInner(isCollapsed)}

        {/* Absolute round Toggle arrow button floating perfectly over the right-side border edge of layout */}
        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
          className="absolute top-5 -right-3 w-6 h-6 rounded-full bg-white border border-[#E2E8F0] text-slate-500 hover:text-slate-800 shadow-sm flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors z-45 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </aside>

      {/* 2. Mobile Drawer Slide-out Container Frame (Overlays on small viewport screens) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay with blur-screen fade close trigger */}
          <div 
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Left Menu Drawer Overlay Frame (Force it to be expanded for readable text links) */}
          <div className="relative flex flex-col w-64 h-full max-w-xs animate-slide-right shadow-2xl">
            {renderSidebarInner(false)}
          </div>
        </div>
      )}
    </>
  );
}
