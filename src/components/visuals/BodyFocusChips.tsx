/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Shield } from "lucide-react";

interface BodyFocusChipsProps {
  bodyFocus: string[];
}

export function BodyFocusChips({ bodyFocus }: BodyFocusChipsProps) {
  const focusList = Array.isArray(bodyFocus) ? bodyFocus : [];

  if (focusList.length === 0) {
    return (
      <span className="text-xs text-slate-400 italic font-mono">
        Whole-body coordination focus
      </span>
    );
  }

  const getFocusEmoji = (focus: string) => {
    const f = focus.toLowerCase();
    if (f.includes("hip") || f.includes("glute")) return "🍑";
    if (f.includes("core") || f.includes("trunk") || f.includes("abs") || f.includes("pelv")) return "🛡";
    if (f.includes("calf") || f.includes("achilles") || f.includes("soleus")) return "👟";
    if (f.includes("hamstring")) return "💪";
    if (f.includes("ankle") || f.includes("foot") || f.includes("feet")) return "🦶";
    if (f.includes("shoulder") || f.includes("back")) return "👕";
    if (f.includes("quad")) return "🍗";
    return "⚡";
  };

  return (
    <div className="space-y-2.5 font-mono w-full">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block border-b border-slate-100 pb-1">
        Body Focus Regions
      </span>
      <div className="flex flex-wrap gap-2 pt-0.5">
        {focusList.map((focus, index) => {
          const emoji = getFocusEmoji(focus);
          return (
            <div
              key={index}
              className="px-3 py-1.5 bg-blue-50/75 hover:bg-blue-105 border border-blue-100 hover:border-blue-200 text-blue-805 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors select-none"
            >
              <span className="text-sm">{emoji}</span>
              <span className="capitalize">{focus.replace(/-/g, " ")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
