/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CompareTrayItem } from "../../lib/compareEntries";
import CompareTable from "./CompareTable";
import { X, GitCompare, ZoomIn, Footprints, Clipboard } from "lucide-react";

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CompareTrayItem[];
  onRemove: (localCompareId: string) => void;
  onInspect: (slug: string) => void;
  onUseDraft: (workout: any) => void;
}

export default function CompareDrawer({
  isOpen,
  onClose,
  items,
  onRemove,
  onInspect,
  onUseDraft,
}: CompareDrawerProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 pr-0 select-none">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Main Container */}
      <div className="relative bg-white w-full h-full md:h-[90vh] md:max-w-[1200px] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
              <GitCompare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-md font-black tracking-tight uppercase text-slate-900 font-display">
                Universal Workout Comparison Matrix
              </h2>
              <p className="text-[10px] text-slate-500 font-mono tracking-normal leading-none mt-0.5">
                Side-by-side spec alignment & parameters benchmarking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-400" />
              <span>Dismiss</span>
            </button>
          </div>
        </div>

        {/* Modal Content Scrollbox */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24 bg-slate-50/20 select-text">
          <CompareTable
            items={items}
            onRemove={onRemove}
            onInspect={(slug) => {
              onInspect(slug);
              onClose();
            }}
            onUseDraft={(draft) => {
              onUseDraft(draft);
              onClose();
            }}
          />
        </div>

        {/* Modal Footer Bar */}
        <div className="absolute bottom-0 inset-x-0 h-16 border-t border-slate-200 px-6 flex items-center justify-between bg-white text-slate-500">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-tight uppercase">
            <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
            <span>Mouse hover fields for granular tooltips</span>
          </div>
          <p className="text-[10px] font-mono font-semibold tracking-wider uppercase text-slate-400">
            Track.Vault Compare v1.2
          </p>
        </div>
      </div>
    </div>
  );
}
