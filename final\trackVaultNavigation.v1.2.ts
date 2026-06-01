/**
 * Track.Vault v1.2 Navigation Map
 * Exported static TypeScript structure for sidebars, tabs, and routing.
 */

export interface NavigationItem {
  label: string;
  slug: string;
  categoryId: string;
}

export const runningWorkoutNavigation: NavigationItem[] = [
  { label: "All Running", slug: "all-running", categoryId: "all" },
  { label: "100m", slug: "running-100m", categoryId: "100m" },
  { label: "200m", slug: "running-200m", categoryId: "200m" },
  { label: "400m", slug: "running-400m", categoryId: "400m" },
  { label: "800m", slug: "running-800m", categoryId: "800m" },
  { label: "1500m", slug: "running-1500m", categoryId: "1500m" },
  { label: "Mile", slug: "running-mile", categoryId: "mile" },
  { label: "3K", slug: "running-3k", categoryId: "3k" },
  { label: "5K", slug: "running-5k", categoryId: "5k" },
  { label: "10K", slug: "running-10k", categoryId: "10k" },
  { label: "Half Marathon", slug: "running-half-marathon", categoryId: "half-marathon" },
  { label: "Marathon", slug: "running-marathon", categoryId: "marathon" },
  { label: "Trail", slug: "running-trail", categoryId: "trail" },
  { label: "Treadmill", slug: "running-treadmill", categoryId: "treadmill" },
  { label: "Base / Recovery", slug: "running-base-recovery", categoryId: "base-recovery" },
  { label: "General", slug: "running-general", categoryId: "general" }
];

export const supportTrainingNavigation: NavigationItem[] = [
  { label: "All Support", slug: "all-support", categoryId: "all" },
  { label: "Upper Strength", slug: "support-upper-strength", categoryId: "upper_strength" },
  { label: "Lower Strength", slug: "support-lower-strength", categoryId: "lower_strength" },
  { label: "Core Stability", slug: "support-core-stability", categoryId: "core_stability" },
  { label: "Mobility", slug: "support-mobility", categoryId: "mobility" },
  { label: "Activation", slug: "support-activation", categoryId: "activation" },
  { label: "Plyometric", slug: "support-plyometric", categoryId: "plyometric" },
  { label: "Running Drills", slug: "support-running-drills", categoryId: "running_drills" },
  { label: "Warm-up Routine", slug: "support-warm-up-routine", categoryId: "warm_up_routine" },
  { label: "Cooldown Routine", slug: "support-cooldown-routine", categoryId: "cooldown_routine" },
  { label: "Recovery Routine", slug: "support-recovery-routine", categoryId: "recovery_routine" },
  { label: "Injury Risk Reduction", slug: "support-injury-risk-reduction", categoryId: "injury_risk_reduction" }
];
