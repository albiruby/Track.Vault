/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FILTER_PRESETS, FilterPreset } from "../../lib/filterPresets";
import { Sparkles, Activity, Dumbbell, Shield, BadgeAlert, X } from "lucide-react";

interface FilterPresetBarProps {
  selectedPresetId: string | null;
  onSelectPreset: (presetId: string | null) => void;
  resultsCount: number;
}

export function FilterPresetBar({ selectedPresetId, onSelectPreset, resultsCount }: FilterPresetBarProps) {
  const [activeGroup, setActiveGroup] = useState<"all" | "general" | "running" | "support">("all");

  const activePreset = FILTER_PRESETS.find((p) => p.id === selectedPresetId);

  // Filter presets based on the active tab category
  const visiblePresets = FILTER_PRESETS.filter((preset) => {
    if (activeGroup === "all") return true;
    return preset.group === activeGroup;
  });

  const getGroupIcon = (group: "all" | "general" | "running" | "support") => {
    switch (group) {
      case "general":
        return <Shield className="w-3.5 h-3.5" />;
      case "running":
        return <Activity className="w-3.5 h-3.5" />;
      case "support":
        return <Dumbbell className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-xs space-y-4 font-sans">
      
      {/* Group Toggle Tabs */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
            Quick Discovery Layers
          </span>
          <h3 className="text-sm font-black font-display text-slate-800 uppercase tracking-tight">
            Deterministic Preset Filters
          </h3>
        </div>

        {/* Horizontal Navigation Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-50 border border-slate-100 rounded-2xl">
          {(["all", "general", "running", "support"] as const).map((group) => (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer transition-all ${
                activeGroup === group
                  ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                  : "text-slate-500 hover:text-slate-900 border border-transparent"
              }`}
            >
              {getGroupIcon(group)}
              <span className="text-[10px] sm:text-xs">
                {group === "all" ? "All Presets" : group}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Horizontally Scrollable or Wrapping Chip Matrix */}
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
        {visiblePresets.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(isSelected ? null : preset.id)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer transition-all duration-150 flex items-center gap-2 ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10 scale-95"
                  : "bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-400"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                isSelected 
                  ? "bg-white" 
                  : preset.group === "general" 
                    ? "bg-amber-500" 
                    : preset.group === "running" 
                      ? "bg-cyan-500" 
                      : "bg-rose-500"
              }`} />
              <span className="font-bold">{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Preset Metadata Overlay & Clear Controls */}
      {selectedPresetId && activePreset && (
        <div className="bg-blue-50/50 border border-blue-100/70 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded-md uppercase font-mono">
                Active Preset: {activePreset.label}
              </span>
              <span className="text-slate-400 leading-none">|</span>
              <span className="font-bold text-slate-700 font-mono text-[10px] uppercase">
                {resultsCount} matched results
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-2xl text-[11px] font-medium">
              {activePreset.description || "Deterministic rule-based filter applied safely based on static workout metadata."}
            </p>
          </div>
          
          <button
            onClick={() => onSelectPreset(null)}
            className="px-2.5 py-1.5 bg-white text-rose-600 border border-rose-100 hover:border-rose-200 shadow-xs font-bold tracking-wide rounded-xl cursor-pointer text-[10px] uppercase flex items-center gap-1 transition-all duration-150"
          >
            <X className="w-3.5 h-3.5" /> Clear Preset
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterPresetBar;
