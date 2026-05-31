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
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/35";
    }
    if (lLower.includes("advanced") || lLower.includes("competitive")) {
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/35";
    }
    if (lLower.includes("intermediate") || lLower.includes("developing")) {
      return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/10 dark:text-sky-400 dark:border-sky-900/25";
    }
    return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700";
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono leading-none border font-semibold tracking-wide uppercase ${getStyles()}`}>
      Level: {level}
    </span>
  );
}
