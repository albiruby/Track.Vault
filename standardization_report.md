# Track.Vault Workout Library Standardization Report

Validation status: **PASS**

Total workouts: **360**

Category files: **13**

Errors: **0**

Warnings: **0**

## Standardization Rules Applied

- Converted imperial/odd long-run distances into clear metric standards such as 20K, 26K, 30K, and 32K.
- Replaced odd prescribed rep distances such as 250m, 450m, 650m, and 740m with clearer track distances.
- Rounded estimatedDistanceKm ranges to 0.5 km increments.
- Rounded estimatedDurationMin ranges to 5-minute increments.
- Rounded qualityDistanceKm display values to 0.1 km increments.
- Ensured every workout block contains a notes array.

## Unique prescribed distanceMeters values after standardization

`10, 20, 30, 40, 50, 60, 80, 100, 120, 150, 200, 300, 400, 500, 600, 800, 900, 1000, 1200, 1600, 2000, 3000, 3200, 4000, 5000, 6000, 9000, 10000, 12000, 14000, 15000, 16000, 20000, 22000, 26000, 28000, 32000`

## Validation Checks

- 360 total workouts
- 13 category files
- Unique id, slug, title, uniquenessSignature
- No duplicate simplified mainSet signature
- Required fields present
- No nonstandard prescribed distanceMeters
- Clean estimated distance/duration ranges

## Key Manual Standardizations

- `tv-br-easy-15m-beginner-007`: estimatedDistanceKm → {'min': 1.8, 'max': 2.6} -> {'min': 1.5, 'max': 3.0}
- `tv-br-easy-20m-beginner-008`: estimatedDistanceKm → {'min': 2.2, 'max': 3.2} -> {'min': 2.0, 'max': 3.5}
- `tv-br-easy-25m-recreational-009`: estimatedDistanceKm → {'min': 2.8, 'max': 4.0} -> {'min': 2.5, 'max': 4.0}
- `tv-br-easy-30m-recreational-010`: estimatedDistanceKm → {'min': 3.5, 'max': 4.8} -> {'min': 3.5, 'max': 5.0}
- `tv-br-aerobic-2x12m-developing-014`: estimatedDistanceKm → {'min': 4.0, 'max': 5.8} -> {'min': 4.0, 'max': 6.0}
- `tv-br-strides-easy-25m-recreational-017`: estimatedDistanceKm → {'min': 3.0, 'max': 4.2} -> {'min': 3.0, 'max': 4.5}
- `tv-br-strides-easy-30m-developing-018`: estimatedDistanceKm → {'min': 3.8, 'max': 5.2} -> {'min': 3.5, 'max': 5.5}
- `tv-br-fartlek-6x30s-recreational-019`: estimatedDistanceKm → {'min': 2.5, 'max': 3.8} -> {'min': 2.5, 'max': 4.0}
- `tv-br-fartlek-8x30s-recreational-020`: estimatedDistanceKm → {'min': 3.0, 'max': 4.2} -> {'min': 3.0, 'max': 4.5}
- `tv-br-fartlek-pyramid-developing-021`: estimatedDistanceKm → {'min': 2.2, 'max': 3.5} -> {'min': 2.0, 'max': 3.5}
- `tv-br-return-10m-beginner-022`: estimatedDistanceKm → {'min': 1.0, 'max': 1.8} -> {'min': 1.0, 'max': 2.0}
- `tv-br-return-25m-developing-025`: estimatedDistanceKm → {'min': 2.5, 'max': 3.8} -> {'min': 2.5, 'max': 4.0}
- `tv-erb-recovery-40m-developing-003`: estimatedDistanceKm → {'min': 4.5, 'max': 5.8} -> {'min': 4.5, 'max': 6.0}
- `tv-erb-recovery-50m-advanced-005`: estimatedDistanceKm → {'min': 6.8, 'max': 8.5} -> {'min': 6.5, 'max': 8.5}
- `tv-erb-easy-30m-recreational-006`: estimatedDistanceKm → {'min': 3.8, 'max': 5.0} -> {'min': 3.5, 'max': 5.0}
- `tv-erb-easy-40m-recreational-007`: estimatedDistanceKm → {'min': 5.0, 'max': 6.8} -> {'min': 5.0, 'max': 7.0}
- `tv-erb-strides-30m-recreational-017`: estimatedDistanceKm → {'min': 3.8, 'max': 5.2} -> {'min': 3.5, 'max': 5.5}
- `tv-erb-strides-40m-developing-018`: estimatedDistanceKm → {'min': 5.0, 'max': 6.8} -> {'min': 5.0, 'max': 7.0}
- `tv-erb-strides-50m-intermediate-019`: estimatedDistanceKm → {'min': 6.8, 'max': 9.2} -> {'min': 6.5, 'max': 9.5}
- `tv-erb-lowhr-45m-developing-022`: estimatedDistanceKm → {'min': 4.5, 'max': 6.8} -> {'min': 4.5, 'max': 7.0}
- `tv-erb-lowhr-60m-intermediate-023`: estimatedDistanceKm → {'min': 7.5, 'max': 10.8} -> {'min': 7.5, 'max': 11.0}
- `tv-erb-maint-35m-developing-025`: estimatedDistanceKm → {'min': 3.8, 'max': 5.0} -> {'min': 3.5, 'max': 5.0}
- `tv-fm-beg-ladder-003`: estimatedDistanceKm → {'min': 3.5, 'max': 5.2} -> {'min': 3.5, 'max': 5.5}
- `tv-fm-aer-monasim-004`: estimatedDistanceKm → {'min': 4.5, 'max': 6.8} -> {'min': 4.5, 'max': 7.0}
- `tv-fm-aer-continuous-005`: estimatedDistanceKm → {'min': 5.0, 'max': 7.2} -> {'min': 5.0, 'max': 7.5}
- `tv-fm-aer-progressive-006`: estimatedDistanceKm → {'min': 6.8, 'max': 9.5} -> {'min': 6.5, 'max': 9.5}
- `tv-fm-spd-classic3030-009`: estimatedDistanceKm → {'min': 3.8, 'max': 5.5} -> {'min': 3.5, 'max': 5.5}
- `tv-fm-spd-minburner-010`: estimatedDistanceKm → {'min': 4.5, 'max': 6.8} -> {'min': 4.5, 'max': 7.0}
- `tv-fm-spd-alternating-011`: estimatedDistanceKm → {'min': 6.2, 'max': 8.5} -> {'min': 6.0, 'max': 8.5}
- `tv-fm-spd-microburst-012`: estimatedDistanceKm → {'min': 4.5, 'max': 6.8} -> {'min': 4.5, 'max': 7.0}
- `tv-fm-spd-hillspeed-013`: estimatedDistanceKm → {'min': 4.5, 'max': 6.8} -> {'min': 4.5, 'max': 7.0}
- `tv-fm-pyr-standard-014`: estimatedDistanceKm → {'min': 3.8, 'max': 5.5} -> {'min': 3.5, 'max': 5.5}
- `tv-fm-pyr-continuous-015`: estimatedDistanceKm → {'min': 4.5, 'max': 6.8} -> {'min': 4.5, 'max': 7.0}
- `tv-fm-pyr-advanced-016`: estimatedDistanceKm → {'min': 6.2, 'max': 8.5} -> {'min': 6.0, 'max': 8.5}
- `tv-fm-rc-5kprep-018`: estimatedDistanceKm → {'min': 4.5, 'max': 6.8} -> {'min': 4.5, 'max': 7.0}
- `tv-fm-rc-10kprog-019`: estimatedDistanceKm → {'min': 6.2, 'max': 8.5} -> {'min': 6.0, 'max': 8.5}
- `tv-fm-rc-3ksharp-020`: estimatedDistanceKm → {'min': 4.5, 'max': 6.8} -> {'min': 4.5, 'max': 7.0}
- `tv-fm-rc-compsim-021`: estimatedDistanceKm → {'min': 6.2, 'max': 8.5} -> {'min': 6.0, 'max': 8.5}
- `tv-fm-mix-321-022`: estimatedDistanceKm → {'min': 3.8, 'max': 5.5} -> {'min': 3.5, 'max': 5.5}
- `tv-fm-mix-wave-023`: estimatedDistanceKm → {'min': 3.8, 'max': 5.5} -> {'min': 3.5, 'max': 5.5}
- `tv-fm-mix-multipace-024`: estimatedDistanceKm → {'min': 6.2, 'max': 8.5} -> {'min': 6.0, 'max': 8.5}
- `tv-fm-mix-compladder-025`: estimatedDistanceKm → {'min': 6.2, 'max': 8.5} -> {'min': 6.0, 'max': 8.5}
- `tv-hm-012`: variantDistanceStandardized → 13000m -> 14000m
- `tv-ht-spr-explosive-003`: estimatedDistanceKm → {'min': 4.5, 'max': 6.8} -> {'min': 4.5, 'max': 7.0}
- `tv-ht-spr-maxvel-004`: estimatedDistanceKm → {'min': 6.2, 'max': 8.5} -> {'min': 6.0, 'max': 8.5}
- `tv-ht-sh-int45s-006`: estimatedDistanceKm → {'min': 3.8, 'max': 5.5} -> {'min': 3.5, 'max': 5.5}
- `tv-ht-sh-adv60s-007`: estimatedDistanceKm → {'min': 4.5, 'max': 6.8} -> {'min': 4.5, 'max': 7.0}
- `tv-ht-sh-comp45s-008`: estimatedDistanceKm → {'min': 6.2, 'max': 8.5} -> {'min': 6.0, 'max': 8.5}
- `tv-ht-lg-int2m-010`: estimatedDistanceKm → {'min': 4.5, 'max': 6.8} -> {'min': 4.5, 'max': 7.0}
- `tv-ht-lg-adv3m-011`: estimatedDistanceKm → {'min': 6.2, 'max': 8.5} -> {'min': 6.0, 'max': 8.5}
- `tv-ht-lg-dev90s-013`: estimatedDistanceKm → {'min': 3.8, 'max': 5.5} -> {'min': 3.5, 'max': 5.5}
- `tv-ht-rol-rec40m-014`: estimatedDistanceKm → {'min': 5.0, 'max': 7.2} -> {'min': 5.0, 'max': 7.5}
- `tv-ht-rol-int50m-015`: estimatedDistanceKm → {'min': 6.8, 'max': 9.5} -> {'min': 6.5, 'max': 9.5}
- `tv-ht-end-rec45m-018`: estimatedDistanceKm → {'min': 4.5, 'max': 6.8} -> {'min': 4.5, 'max': 7.0}
- `tv-ht-end-dev60m-019`: estimatedDistanceKm → {'min': 6.2, 'max': 8.5} -> {'min': 6.0, 'max': 8.5}
- `tv-ht-far-dev30m-022`: estimatedDistanceKm → {'min': 3.8, 'max': 5.5} -> {'min': 3.5, 'max': 5.5}
- `tv-ht-far-int45m-023`: estimatedDistanceKm → {'min': 5.0, 'max': 7.2} -> {'min': 5.0, 'max': 7.5}
- `tv-ht-far-adv60m-024`: estimatedDistanceKm → {'min': 6.8, 'max': 9.5} -> {'min': 6.5, 'max': 9.5}
- `tv-ht-dwn-control-025`: estimatedDistanceKm → {'min': 4.5, 'max': 6.8} -> {'min': 4.5, 'max': 7.0}
- `tv-lrp-support-hm-12mi-intermediate-022`: metricizedWorkout → 12-mile/imperial converted distances -> 20K metric standard
- `tv-lrp-support-m-16mi-advanced-024`: metricizedWorkout → 16-mile/imperial converted distances -> 26K metric standard
- `tv-lrp-support-m-18mi-competitive-025`: metricizedWorkout → 18-mile/imperial converted distances -> 30K metric standard
- `tv-md-800m-rp-001`: estimatedDistanceKm → {'min': 3.5, 'max': 4.8} -> {'min': 3.5, 'max': 5.0}
- `tv-md-800m-rp-004`: estimatedDistanceKm → {'min': 3.8, 'max': 5} -> {'min': 3.5, 'max': 5.0}
- `tv-md-800m-rp-005`: estimatedDistanceKm → {'min': 4.2, 'max': 5.8} -> {'min': 4.0, 'max': 6.0}
- `tv-md-800m-rp-006`: estimatedDistanceKm → {'min': 4.5, 'max': 6.2} -> {'min': 4.5, 'max': 6.5}
- `tv-md-mile-rp-007`: estimatedDistanceKm → {'min': 4.2, 'max': 5.5} -> {'min': 4.0, 'max': 5.5}
- `tv-md-mile-rp-008`: estimatedDistanceKm → {'min': 4.8, 'max': 6.2} -> {'min': 4.5, 'max': 6.5}
- `tv-md-mile-rp-009`: estimatedDistanceKm → {'min': 4.8, 'max': 6.5} -> {'min': 4.5, 'max': 6.5}
- `tv-md-mile-rp-010`: estimatedDistanceKm → {'min': 4.8, 'max': 6.5} -> {'min': 4.5, 'max': 6.5}
- `tv-md-mile-rp-011`: estimatedDistanceKm → {'min': 4.8, 'max': 6.5} -> {'min': 4.5, 'max': 6.5}
- `tv-md-mile-rp-012`: estimatedDistanceKm → {'min': 4.8, 'max': 6.5} -> {'min': 4.5, 'max': 6.5}
- `tv-md-230-rep-013`: estimatedDistanceKm → {'min': 3.8, 'max': 5} -> {'min': 3.5, 'max': 5.0}
- `tv-md-230-rep-014`: estimatedDistanceKm → {'min': 3.5, 'max': 4.8} -> {'min': 3.5, 'max': 5.0}
- `tv-md-230-rep-016`: estimatedDistanceKm → {'min': 4.2, 'max': 5.8} -> {'min': 4.0, 'max': 6.0}
- `tv-md-230-rep-017`: estimatedDistanceKm → {'min': 4.2, 'max': 5.8} -> {'min': 4.0, 'max': 6.0}
- `tv-md-400-rep-018`: estimatedDistanceKm → {'min': 4.5, 'max': 5.8} -> {'min': 4.5, 'max': 6.0}
- `tv-md-400-rep-019`: estimatedDistanceKm → {'min': 4.8, 'max': 6.2} -> {'min': 4.5, 'max': 6.5}
- `tv-md-400-rep-020`: estimatedDistanceKm → {'min': 5.5, 'max': 7.2} -> {'min': 5.5, 'max': 7.5}
- `tv-md-400-rep-021`: estimatedDistanceKm → {'min': 5.8, 'max': 7.5} -> {'min': 5.5, 'max': 7.5}