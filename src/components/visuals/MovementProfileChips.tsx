/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface MovementProfileChipsProps {
  movementGoals: string[];
  difficulty: number;
  routineType?: string;
}

export function MovementProfileChips({ movementGoals, difficulty, routineType }: MovementProfileChipsProps) {
  const goals = Array.isArray(movementGoals) ? movementGoals : [];
  const type = routineType || "stability";

  // Compute dynamic loading levels for classic training vectors
  const hasMobility = goals.some(g => g.toLowerCase().includes("mobil") || g.toLowerCase().includes("range") || g.toLowerCase().includes("flex"));
  const hasStrength = goals.some(g => g.toLowerCase().includes("strength") || g.toLowerCase().includes("load") || g.toLowerCase().includes("power"));
  const hasActivation = goals.some(g => g.toLowerCase().includes("activ") || g.toLowerCase().includes("warm") || g.toLowerCase().includes("prep"));
  const hasPlyo = goals.some(g => g.toLowerCase().includes("plyo") || g.toLowerCase().includes("impact") || g.toLowerCase().includes("rebound"));

  const vectors = [
    { name: "Neuromuscular Activation", val: hasActivation ? 100 : (hasStrength ? 70 : 50), color: "bg-blue-500" },
    { name: "Joint Mobility Range", val: hasMobility ? 100 : (hasStrength ? 40 : 65), color: "bg-teal-500" },
    { name: "Structural Core Stability", val: type.toLowerCase() === "core" || hasStrength ? 90 : 75, color: "bg-indigo-500" },
    { name: "Elastic Recoil / Impact", val: hasPlyo ? 100 : (difficulty >= 7 ? 45 : 15), color: "bg-amber-500" }
  ];

  return (
    <div className="space-y-3.5 w-full font-mono">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#475569] block border-b border-slate-100 pb-1">
        Routine Movement Goals & Profile
      </span>

      <div className="space-y-2.5 pt-0.5">
        {vectors.map((vector, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase leading-none">
              <span>{vector.name}</span>
              <span className="text-slate-400">
                {vector.val === 100 ? "FULL TARGET" : vector.val >= 70 ? "HIGH EMPHASIS" : "STABILITY BOUND"}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-105 rounded-full overflow-hidden border border-slate-200/40">
              <div 
                style={{ width: `${vector.val}%` }} 
                className={`h-full rounded-full transition-all duration-500 ${vector.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      {goals.length > 0 && (
        <div className="flex flex-wrap gap-1 pb-1">
          {goals.map((g, i) => (
            <span 
              key={i} 
              className="px-2 py-0.5 font-mono text-[9px] text-[#475569] bg-slate-100 border border-slate-200 rounded-md font-bold uppercase"
            >
              🎯 {g}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
