/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import {
  Activity,
  Zap,
  ChevronsRight,
  Gauge,
  Timer,
  Flame,
  Route,
  CircleGauge,
  Footprints,
  Milestone,
  Map,
  MapPinned,
  Mountain,
  Monitor,
  HeartPulse,
  CircleDot,
  Dumbbell,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  MoveUp,
  SunMedium,
  Moon,
  Heart,
  ShieldAlert
} from "lucide-react";

export const TRACK_VAULT_ICON_MAP: Record<string, React.ComponentType<any>> = {
  // Running Categories & Nav IDs
  "all-running": Activity,
  "100m": Zap,
  "200m": ChevronsRight,
  "400m": Gauge,
  "800m": Timer,
  "1500m": Flame,
  "mile": Route,
  "3k": CircleGauge,
  "5k": Footprints,
  "10k": Milestone,
  "half-marathon": Map,
  "marathon": MapPinned,
  "trail": Mountain,
  "treadmill": Monitor,
  "base": HeartPulse,
  "general": CircleDot,

  // Support Categories & Nav IDs
  "all-support": Dumbbell,
  "upper-strength": Dumbbell,
  "lower-strength": Activity,
  "core": ShieldCheck,
  "mobility": RotateCcw,
  "activation": Sparkles,
  "plyometric": MoveUp,
  "running-drills": Footprints,
  "warmup": SunMedium,
  "cooldown": Moon,
  "recovery": Heart,
  "injury-risk": ShieldAlert
};

interface TrackVaultIconProps {
  id: string;
  className?: string;
  strokeWidth?: number;
  "aria-hidden"?: "true" | "false";
}

export function TrackVaultIcon({
  id,
  className = "w-5 h-5",
  strokeWidth = 2,
  "aria-hidden": ariaHidden = "true"
}: TrackVaultIconProps) {
  const normId = id.trim().toLowerCase();
  const IconComponent = TRACK_VAULT_ICON_MAP[normId] || CircleDot;

  return (
    <IconComponent
      className={className}
      strokeWidth={strokeWidth}
      data-testid={`tv-icon-${normId}`}
      aria-hidden={ariaHidden}
    />
  );
}
