/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CompareTrayItem } from "../../lib/compareEntries";
import { Zap, X, GitCompare, Sparkles, Scale } from "lucide-react";

interface CompareBarProps {
  items: CompareTrayItem[];
  onRemove: (localCompareId: string) => void;
  onClear: () => void;
  onOpenCompare: () => void;
}

export default function CompareBar({ items, onRemove, onClear, onOpenCompare }: CompareBarProps) {
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[480px] z-[40] animate-slide-up select-none">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 text-white rounded-2xl shadow-xl shadow-slate-950/25 p-4 flex flex-col gap-3">
        {/* Header line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center">
              <Scale className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider font-mono">
              Workout Compare Tray
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="text-[10px] uppercase font-mono font-black text-rose-400 hover:text-rose-300 transition-colors cursor-pointer bg-transparent border-0 px-1"
            >
              Clear All
            </button>
            <span className="text-[11px] font-bold text-slate-400 font-mono">
              ({items.length}/3 Selected)
            </span>
          </div>
        </div>

        {/* Selected Items Lists */}
        <div className="flex gap-2 w-full overflow-x-auto py-1 scrollbar-hide">
          {items.map((item) => {
            const isRun = item.entryType.includes("running-workout") || item.entryType === "running-workout";
            const accentBg = isRun ? "border-l-blue-500" : "border-l-teal-500";
            return (
              <div
                key={item.localCompareId}
                className={`bg-slate-800/60 border border-slate-700 border-l-3 ${accentBg} rounded-xl p-2 flex items-center justify-between gap-2 shrink-0 w-[136px] max-w-[136px] min-w-[136px] transition-all`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-slate-150 truncate leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[8px] font-mono text-slate-450 uppercase tracking-wider font-extrabold truncate">
                    {isRun ? "RUN" : "SUPPORT"}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(item.localCompareId)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          {/* Placeholders */}
          {Array.from({ length: 3 - items.length }).map((_, i) => (
            <div
              key={i}
              className="border border-dashed border-slate-800 bg-slate-900/30 rounded-xl p-2 flex items-center justify-center shrink-0 w-[136px] max-w-[136px]"
            >
              <span className="text-[9px] font-medium text-slate-600 font-mono uppercase tracking-wide">
                + Slot Open
              </span>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <button
          onClick={onOpenCompare}
          disabled={items.length < 2}
          className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider font-mono text-center flex items-center justify-center gap-2 transition-all shadow-md active:scale-[98%] ${
            items.length >= 2
              ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-750"
          }`}
        >
          <GitCompare className="w-4 h-4" />
          {items.length >= 2 ? `Compare Side-by-Side` : `Select min. 2 items`}
        </button>
      </div>
    </div>
  );
}
