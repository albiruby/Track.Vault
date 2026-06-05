/**
 * Track.Vault v1.2 Navigation Map
 * Exported static TypeScript structure for sidebars, tabs, and routing.
 */

export interface NavigationItem {
  id: string;
  label: string;
  slug: string;
  type: string;
  entries: number;
}

export const runningWorkoutNavigation: NavigationItem[] = [
  { id: "all", label: "All Running", slug: "all-running", type: "running", entries: 750 },
  { id: "100m", label: "100m", slug: "running-100m", type: "running", entries: 50 },
  { id: "200m", label: "200m", slug: "running-200m", type: "running", entries: 50 },
  { id: "400m", label: "400m", slug: "running-400m", type: "running", entries: 50 },
  { id: "800m", label: "800m", slug: "running-800m", type: "running", entries: 50 },
  { id: "1500m", label: "1500m", slug: "running-1500m", type: "running", entries: 50 },
  { id: "mile", label: "Mile", slug: "running-mile", type: "running", entries: 50 },
  { id: "3k", label: "3K", slug: "running-3k", type: "running", entries: 50 },
  { id: "5k", label: "5K", slug: "running-5k", type: "running", entries: 50 },
  { id: "10k", label: "10K", slug: "running-10k", type: "running", entries: 50 },
  { id: "half-marathon", label: "Half Marathon", slug: "running-half-marathon", type: "running", entries: 50 },
  { id: "marathon", label: "Marathon", slug: "running-marathon", type: "running", entries: 50 },
  { id: "trail", label: "Trail", slug: "running-trail", type: "running", entries: 50 },
  { id: "treadmill", label: "Treadmill", slug: "running-treadmill", type: "running", entries: 50 },
  { id: "base-recovery", label: "Base / Recovery", slug: "running-base-recovery", type: "running", entries: 50 },
  { id: "general", label: "General", slug: "running-general", type: "running", entries: 50 }
];

export const supportTrainingNavigation: NavigationItem[] = [
  { id: "all", label: "All Support", slug: "all-support", type: "support", entries: 550 },
  { id: "upper_strength", label: "Upper Strength", slug: "support-upper-strength", type: "support", entries: 50 },
  { id: "lower_strength", label: "Lower Strength", slug: "support-lower-strength", type: "support", entries: 50 },
  { id: "core_stability", label: "Core Stability", slug: "support-core-stability", type: "support", entries: 50 },
  { id: "mobility", label: "Mobility", slug: "support-mobility", type: "support", entries: 50 },
  { id: "activation", label: "Activation", slug: "support-activation", type: "support", entries: 50 },
  { id: "plyometric", label: "Plyometric", slug: "support-plyometric", type: "support", entries: 50 },
  { id: "running_drills", label: "Running Drills", slug: "support-running-drills", type: "support", entries: 50 },
  { id: "warm_up_routine", label: "Warm-up Routine", slug: "support-warm-up-routine", type: "support", entries: 50 },
  { id: "cooldown_routine", label: "Cooldown Routine", slug: "support-cooldown-routine", type: "support", entries: 50 },
  { id: "recovery_routine", label: "Recovery Routine", slug: "support-recovery-routine", type: "support", entries: 50 },
  { id: "injury_risk_reduction", label: "Injury Risk Reduction", slug: "support-injury-risk-reduction", type: "support", entries: 50 }
];

export const trackVaultNavigation = {
  runningNavigation: runningWorkoutNavigation,
  supportNavigation: supportTrainingNavigation
};
