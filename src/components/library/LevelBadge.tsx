/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface LevelBadgeProps {
 level: string;
}

export function LevelBadge({ level }: LevelBadgeProps) {
 const getStyles = () => {
 const lLower = level?.toLowerCase() || "";
 if (lLower.includes("elite")) {
 return "bg-purple-50 text-purple-700 border-purple-200 ";
 }
 if (lLower.includes("advanced") || lLower.includes("competitive")) {
 return "bg-indigo-50 text-indigo-700 border-indigo-200 ";
 }
 if (lLower.includes("intermediate") || lLower.includes("developing")) {
 return "bg-blue-50 text-blue-700 border-blue-200 ";
 }
 return "bg-slate-50 text-slate-700 border-slate-200 ";
 };

 return (
 <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono leading-none border font-semibold tracking-wide uppercase ${getStyles()}`}>
 Level: {level}
 </span>
 );
}
