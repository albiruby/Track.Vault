/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface DifficultyBadgeProps {
 difficulty: number | string;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
 const getSubtleStyles = () => {
 const dStr = String(difficulty).toLowerCase();
 if (dStr.includes("easy") || dStr === "1" || dStr === "2" || dStr === "3") {
 return "bg-slate-50 text-slate-700 border-slate-200 ";
 } else if (dStr.includes("moderate") || dStr === "4" || dStr === "5" || dStr === "6" || dStr === "7") {
 return "bg-blue-50 text-blue-700 border-blue-200 ";
 } else {
 return "bg-orange-50 text-orange-700 border-orange-200 ";
 }
 };

 const getLabel = () => {
 const isNum = !isNaN(Number(difficulty));
 if (isNum) {
 return `Diff: ${difficulty}/10`;
 }
 return `Diff: ${difficulty}`;
 };

 return (
 <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono leading-none border font-semibold uppercase ${getSubtleStyles()}`}>
 {getLabel()}
 </span>
 );
}
