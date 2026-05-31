/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface RiskBadgeProps {
 risk: "low" | "medium" | "high" | "very-high";
}

export function RiskBadge({ risk }: RiskBadgeProps) {
 const getStyles = () => {
 switch (risk) {
 case "very-high":
 return "bg-rose-50 text-rose-700 border-rose-200 ";
 case "high":
 return "bg-orange-50 text-orange-700 border-orange-200 ";
 case "medium":
 return "bg-amber-50 text-amber-700 border-amber-200 ";
 case "low":
 default:
 return "bg-emerald-50 text-emerald-700 border-emerald-200 ";
 }
 };

 const getLabel = () => {
 switch (risk) {
 case "very-high":
 return "Very High Risk";
 case "high":
 return "High Risk";
 case "medium":
 return "Moderate Risk";
 case "low":
 default:
 return "Low Risk";
 }
 };

 return (
 <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono leading-none border font-semibold tracking-wide uppercase ${getStyles()}`}>
 {getLabel()}
 </span>
 );
}
