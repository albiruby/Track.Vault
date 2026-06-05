/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Legendary event-specific workouts and support routines based on actual athletics science and coaching lineages.
export const legendaryRunningWorkouts = [
  {
    id: "legend-running-01",
    slug: "usain-bolt-max-velocity-acceleration",
    entryType: "running-workout",
    title: "Bolt Max Velocity Acceleration Drills",
    shortTitle: "Velocity & Accel",
    summary: "Elite sprint training focusing on early acceleration mechanics, drive phase, and maximum velocity flying sprinters. Designed to spark fast-twitch motor unit recruitment and maximize neuromuscular stride neural pathways.",
    level: "advanced",
    difficulty: 9,
    phase: ["build"],
    phases: ["build", "specific"],
    surface: ["track"],
    surfaces: ["track"],
    estimatedDurationMin: 60,
    estimatedDistanceKm: 2.5,
    distanceNavId: "100m",
    primaryDistance: "100m",
    workoutType: "speed",
    targetRunnerType: "competitive sprinters",
    risk: "high",
    riskReason: "Maximum neural output and peak skeletal loads; strict warm-up and exhaustive recoveries are mandatory.",
    physiologicalPurpose: "Maximize motor unit recruitment of fast-twitch Type IIx muscle fibers, improve raw acceleration rates, and optimize hip-extensor force production at high velocity.",
    bestUsedWhen: "Early part of the weekly cycle when the central nervous system is fully refreshed.",
    avoidWhen: "Experiencing hamstring soreness, sciatic nerve irritation, or restricted ankle mobility.",
    sourceInspiration: "USATF Sprint Coaching Manual & Oregon Sprint Mechanics Model",
    coachingNotes: [
      "Keep head down for the initial 15 meters of acceleration to extend the drive phase projection.",
      "Maintain a tall, columnar posture once maximum velocity is achieved; relax the shoulders and facial muscles.",
      "Every rep must be 100% effort. If velocity drops by more than 5%, terminate the active speed sets."
    ],
    commonMistakes: [
      "Popping tall on the very first step, which forces heel striking and cuts short the power projection.",
      "Rushing recoveries. True speed development requires complete neural replenishment (at least 1 min of rest per 10m sprinted)."
    ],
    safetyNotes: [
      "Strictly do not attempt these sessions if ambient temperature is under 12°C without heavily extending the warm-up jog and drills.",
      "Stop immediately if you feel a tight 'tug' or sharp point in the hamstring, quadriceps, or Achilles tendon."
    ],
    intensityGuide: {
      primaryTarget: "Maximum Neuromuscular Stride Velocity Development",
      paceGuide: "100% maximum effort for sprints, comfortable walk for rest",
      hrGuide: "N/A (Sprints are purely alactic/anaerobic; HR is not a reliable gauge)",
      rpeGuide: "RPE 9.5-10 out of 10 during active strides",
      warmup: "Progressive active drill ramp up; dynamic activation",
      mainSet: "Absolute maximum speed sprint intervals",
      cooldown: "Very slow shuffle jog and leg swings"
    },
    workoutStructure: {
      warmup: [
        {
          id: "bolt-wu-1",
          blockType: "warmup",
          name: "Aerobic Warmup Jog",
          description: "Very easy jogging to elevate muscle temperature.",
          repetitions: 1,
          work: { durationSeconds: 600, intensity: "Slow recovery pace", targetType: "duration" },
          notes: "Very light, focus on loose shoulder circles."
        },
        {
          id: "bolt-wu-2",
          blockType: "drill",
          name: "Sprint Mechanics Drills",
          description: "Perform A-skips, B-skips, high knees, ankle bounds, and high-cadence quick strides.",
          repetitions: 1,
          work: { durationSeconds: 300, intensity: "Technical control effort", targetType: "duration" },
          notes: "Focus on crisp foot strikes beneath the hips and robust ankle dorsiflexion."
        }
      ],
      mainSet: [
        {
          id: "bolt-ms-1",
          blockType: "interval",
          name: "Acceleration Block Starts",
          description: "Explosive acceleration reps from blocks or a three-point stance.",
          repetitions: 4,
          work: { distanceMeters: 30, intensity: "95-100% maximal effort", targetType: "distance" },
          recovery: { type: "walk", durationSeconds: 180, intensity: "Complete slow walk back" },
          notes: "Project forward, pushing hard against the blocks. Maintain a low angle of release."
        },
        {
          id: "bolt-ms-2",
          blockType: "interval",
          name: "Flying 30m Speed Sprints",
          description: "Accelerate smoothly over 30m, then maintain peak speed over a 30m timed segment, followed by a controlled deceleration.",
          repetitions: 3,
          work: { distanceMeters: 60, intensity: "100% maximal effort (Peak Velocity)", targetType: "distance" },
          recovery: { type: "walk", durationSeconds: 300, intensity: "Ultra-rest passive walking" },
          notes: "Focus on bouncy elastic rebounds, minimal ground contact time, and high fluid cadence."
        }
      ],
      cooldown: [
        {
          id: "bolt-cd-1",
          blockType: "cooldown",
          name: "Active Post-Run Cooldown",
          description: "Slow shuffle recovery walking and dynamic light hamstring stretches.",
          repetitions: 1,
          work: { durationSeconds: 300, intensity: "Active decompression speed", targetType: "duration" },
          notes: "Focus on slow breathing, bringing heart and neurological systems back to resting state."
        }
      ]
    },
    variants: {
      easier: {
        description: "Reduce peak velocity flying intervals to 2 reps, and increase rest to 6 minutes between sets to avoid excessive fatigue accumulation.",
        mainSet: []
      },
      harder: {
        description: "Increase acceleration reps to 6, and add a final 80m speed-endurance sprint at 95% effort to push bounds.",
        mainSet: []
      }
    }
  },
  {
    id: "legend-running-02",
    slug: "clyde-hart-special-endurance-400m",
    entryType: "running-workout",
    title: "Clyde Hart 400m Specific Lactate Buffer",
    shortTitle: "Hart 400m Specific",
    summary: "Renowned 400m coaching strategy utilizing 'split 400s' and Extensive Tempo repeats. Builds intense lactic acid tolerance, anaerobic capacity, and race pace modeling for long sprints.",
    level: "advanced",
    difficulty: 8,
    phase: ["build"],
    phases: ["build", "specific"],
    surface: ["track"],
    surfaces: ["track"],
    estimatedDurationMin: 50,
    estimatedDistanceKm: 4.5,
    distanceNavId: "400m",
    primaryDistance: "400m",
    workoutType: "speed-endurance",
    targetRunnerType: "competitive 400m/800m runners",
    risk: "high",
    riskReason: "High lactic acid accumulation can lead to temporary muscle rigidity, severe nausea, and coordinator fatigue.",
    physiologicalPurpose: "Enhance anaerobic glycolytic capacity, desensitize muscular receptors to hydrogen ion build-up, and train motor coordination under severe muscular fatigue.",
    bestUsedWhen: "Mid-to-late build phase, with a minimum of 48 hours separating this from any major lower-body lifting.",
    avoidWhen: "Experiencing symptoms of overtraining, underlying respiratory infections, or severe hamstring tightness.",
    sourceInspiration: "Clyde Hart's Baylor University 400m Training Manual",
    coachingNotes: [
      "Commit to the target tempo percentages. Going too fast on the first rep destroys the physiological intent.",
      "Keep arms pumping in a relaxed, rhythmic line; as fatigue climbs, avoid crossing hands over the torso midline.",
      "Focus on dynamic hip-height maintenance even as the legs feel heavy and full of lactate."
    ],
    commonMistakes: [
      "Going out too fast in the first 200m of the split interval, resulting in severe early mechanical failure.",
      "Sitting down immediately after an interval rep. Dynamic walking/shuffling is necessary to process the lactic surge."
    ],
    safetyNotes: [
      "Keep dynamic walking/pacing during recovery blocks to facilitate active blood cycle cleanup.",
      "Strictly check lower back and groin muscles during the warm-up drills before starting the high speed sets."
    ],
    intensityGuide: {
      primaryTarget: "Lactate Tolerance and Anaerobic Glycolytic Buffering",
      paceGuide: "90% of current 400m race pace effort during intensive split blocks",
      hrGuide: "92-98% maximal HR at the termination of sets",
      rpeGuide: "RPE 9 out of 10",
      warmup: "Thorough progressive jog and dynamic mobility drills with strides",
      mainSet: "Extensive tempo and split endurance sets with incomplete rest",
      cooldown: "Light recovery check-jog and thoracic breathing exercises"
    },
    workoutStructure: {
      warmup: [
        {
          id: "hart-wu-1",
          blockType: "warmup",
          name: "Standard Active Warmup",
          description: "Warming muscles and expanding cardiovascular stroke depth.",
          repetitions: 1,
          work: { durationSeconds: 800, intensity: "Easy aerobic pace", targetType: "duration" }
        },
        {
          id: "hart-wu-2",
          blockType: "drill",
          name: "A-skips, Carioca, & Glute Kicks",
          description: "General sprint mechanics preparation.",
          repetitions: 1,
          work: { durationSeconds: 240, intensity: "Aesthetic technical control", targetType: "duration" }
        }
      ],
      mainSet: [
        {
          id: "hart-ms-1",
          blockType: "interval",
          name: "Extensive Tempo Runs",
          description: "Rhythmic stride-outs focused on high posture maintenance and elastic stride extension.",
          repetitions: 3,
          work: { distanceMeters: 200, intensity: "85% effort (Rhythmic speed)", targetType: "distance" },
          recovery: { type: "jog", durationSeconds: 120, intensity: "Slow relaxation shuffle" },
          notes: "Focus on breathing rhythmically, and landing lightly on the metatarsal area."
        },
        {
          id: "hart-ms-2",
          blockType: "interval",
          name: "Split 400m Burner (300m + 100m)",
          description: "Run 300m at race pace effort, rest for exactly 45 seconds, then perform a maximal 100m speed finish.",
          repetitions: 2,
          work: { distanceMeters: 400, intensity: "Specific 400m race simulation", targetType: "distance" },
          recovery: { type: "walk", durationSeconds: 480, intensity: "Sustained passive walking rest" },
          notes: "This produces an intense lactate dump. Stay upright, step tall, and breathe fully."
        }
      ],
      cooldown: [
        {
          id: "hart-cd-1",
          blockType: "cooldown",
          name: "Post-Lactate Active Walk/Jog",
          description: "10 minutes of walking and very easy jogging to settle muscles.",
          repetitions: 1,
          work: { durationSeconds: 600, intensity: "Very slow shuffle", targetType: "duration" }
        }
      ]
    },
    variants: {
      easier: {
        description: "Scale back by substituting the 300m+100m split sets with straight, isolated 250m tempo efforts at a relaxed 80-82% effort.",
        mainSet: []
      },
      harder: {
        description: "Add a third 'split 400m' rep, and tighten the split recovery from 45 seconds down to 35 seconds to build extreme anaerobic resilience.",
        mainSet: []
      }
    }
  },
  {
    id: "legend-running-03",
    slug: "steve-magness-broken-800m-race-pace",
    entryType: "running-workout",
    title: "Steve Magness Broken 800m Pace Specific",
    shortTitle: "Magness Broken 800m",
    summary: "Championship 800m race simulation using broken reps (500m + 300m) to accumulate volume at target pace without early central nervous grid fatigue. Highly specific middle-distance prep.",
    level: "advanced",
    difficulty: 9,
    phase: ["specific"],
    phases: ["specific", "peak"],
    surface: ["track"],
    surfaces: ["track"],
    estimatedDurationMin: 45,
    estimatedDistanceKm: 6.0,
    distanceNavId: "800m",
    primaryDistance: "800m",
    workoutType: "intervals",
    targetRunnerType: "competitive mid-distance athletes",
    risk: "high",
    riskReason: "Extremely high neurological and cardiovascular demand at peak anaerobic speeds.",
    physiologicalPurpose: "Maximize glycolytic capacity, neuromuscular timing at 800m race cadence, and mental resilience under high pressure.",
    bestUsedWhen: "In specific peak phase, 10-14 days out from key competition.",
    avoidWhen: "Suffering from shin splints, plantar fasciitis, or respiratory restriction.",
    sourceInspiration: "Steve Magness Science of Running Middle Distance Frameworks",
    coachingNotes: [
      "First 200m of the 500m rep should feel floating and controlled. Do not strain for the time—let the stride flow.",
      "The 300m rep mimics the final backstretch of an 800m race. Focus on knee drive and relax your neck/jaw.",
      "Walk the recovery. Keep chest wide open to maximize VO2 exchange."
    ],
    commonMistakes: [
      "Treating the 500m as an all-out sprint, which leaves the athlete empty for the critical 300m race finishing block.",
      "Allowing arms to cross the chest during the last 100m under high lactate fatigue."
    ],
    safetyNotes: [
      "Keep feet dry and spikes securely screwed. Fast 800m track corners put high lateral load on critical ankle complexes."
    ],
    intensityGuide: {
      primaryTarget: "800m Competition Pace Specific Lactate Endurance",
      paceGuide: "Target 800m speed during broken segments, walk for recover",
      hrGuide: "95-100% maximal HR at peak rep output",
      rpeGuide: "RPE 9.5 out of 10",
      warmup: "Aerobic activation, active dynamic drills, and 3 progressive speed strides",
      mainSet: "Elite broken 800m blocks with brief rest",
      cooldown: "Gentle recovery walk followed by slow jog"
    },
    workoutStructure: {
      warmup: [
        {
          id: "mgn-wu-1",
          blockType: "warmup",
          name: "Aerobic Ramp & Joint Activation",
          description: "Jog and rotational mobility.",
          repetitions: 1,
          work: { durationSeconds: 900, intensity: "Gradually climbing pace", targetType: "duration" }
        },
        {
          id: "mgn-wu-2",
          blockType: "drill",
          name: "High Cadence strides",
          description: "Accelerate smoothly over 100m to target race pace.",
          repetitions: 3,
          work: { distanceMeters: 100, intensity: "Goal 800m speed", targetType: "distance" },
          recovery: { type: "walk", durationSeconds: 60, intensity: "Walk rest" }
        }
      ],
      mainSet: [
        {
          id: "mgn-ms-1",
          blockType: "interval",
          name: "Broken set 1: 500m Rep",
          description: "Run 500m at target 800m racing speed, keeping efforts smooth and rhythmic.",
          repetitions: 1,
          work: { distanceMeters: 500, intensity: "Target 800m racing pace", targetType: "distance" },
          recovery: { type: "walk", durationSeconds: 90, intensity: "Incomplete recovery walking" },
          notes: "Stay relaxed, float through the curves, and focus on clean posture."
        },
        {
          id: "mgn-ms-2",
          blockType: "interval",
          name: "Broken set 1: 300m Finisher",
          description: "Explosive 300m at goal 800m racing pace to simulate the race finishing envelope.",
          repetitions: 1,
          work: { distanceMeters: 300, intensity: "Target 800m finish velocity", targetType: "distance" },
          recovery: { type: "walk", durationSeconds: 600, intensity: "Exhaustive set rest walking" },
          notes: "A major lactate builder. Focus on arm drive and high hip position."
        },
        {
          id: "mgn-ms-3",
          blockType: "interval",
          name: "Broken set 2: 500m + 300m Reps",
          description: "Repetition of the broken set after a full 10-minute cardiovascular and mental reset.",
          repetitions: 1,
          work: { distanceMeters: 800, intensity: "Goal 800m specific racing speed", targetType: "distance" },
          notes: "Maintain focus. Keep strides wide, flat, and elastic."
        }
      ],
      cooldown: [
        {
          id: "mgn-cd-1",
          blockType: "cooldown",
          name: "Active Cooldown Jog & Decompression",
          description: "Light, barefoot grass jogging when available to soothe feet muscles.",
          repetitions: 1,
          work: { durationSeconds: 600, intensity: "Extremely easy speed", targetType: "duration" }
        }
      ]
    },
    variants: {
      easier: {
        description: "Increase the split rest between the 500m and 300m reps from 90 seconds to 3 minutes, or decrease the pace effort to 1500m target speeds.",
        mainSet: []
      },
      harder: {
        description: "Decrease the split recovery rest to 60 seconds, or execute a third broken block reps sequence.",
        mainSet: []
      }
    }
  },
  {
    id: "legend-running-04",
    slug: "sebastian-coe-mile-race-pace-ladder",
    entryType: "running-workout",
    title: "Sebastian Coe Mile Pace Specific Ladder",
    shortTitle: "Coe Mile Ladder",
    summary: "Elite middle-distance program featuring a highly specific ladder structure (300m-500m-700m-500m-300m) at target Mile race pace efforts. Promotes outstanding economy and stride efficiency.",
    level: "advanced",
    difficulty: 9,
    phase: ["specific"],
    phases: ["specific", "peak"],
    surface: ["track"],
    surfaces: ["track"],
    estimatedDurationMin: 50,
    estimatedDistanceKm: 7.5,
    distanceNavId: "mile",
    primaryDistance: "mile",
    workoutType: "intervals",
    targetRunnerType: "competitive milers and 1500m athletes",
    risk: "high",
    riskReason: "High cardiovascular velocity is demanding on posterior musculature and metabolic systems.",
    physiologicalPurpose: "Enhance aerobic power at high running speeds, optimize lactic clearance, and train pacing discipline over varying track distance steps.",
    bestUsedWhen: "Late build and specific prep phase, on a premium synthetic running track.",
    avoidWhen: "Experiencing calf architecture tightness, plantar fascia pain, or severe knee stiffness.",
    sourceInspiration: "Peter Coe & Seb Coe Multi-Tier Middle-Distance Training Principles",
    coachingNotes: [
      "The 300m efforts are sharpening steps; do not overshoot. Lock immediately into your current 1500m / Mile target speed.",
      "The 700m effort is the critical 'third lap' simulation. Push through the 400-600m transition with focused steady breathing.",
      "Ensure foot strikes remain soft and under your center of mass."
    ],
    commonMistakes: [
      "Over-running the first 300m, leaving excessive metabolic accumulation for the 500m and 700m peaks.",
      "Heel striking heavily under fatigue on the downhill curves of the track."
    ],
    safetyNotes: [
      "Maintain active recovery pacing—never sit down or lay flat on your back after finishing key segments."
    ],
    intensityGuide: {
      primaryTarget: "Aerobic Power and Specific 1500m / Mile Stride Economy",
      paceGuide: "Lock exactly into current Mile / 1505m target race pace",
      hrGuide: "90-96% maximal HR during longer steps",
      rpeGuide: "RPE 8.5-9 out of 10",
      warmup: "12-min progressive warmup jog, athletic leg swings, and dynamic drills",
      mainSet: "Aesthetic race pace ladder with structured jog rest",
      cooldown: "Slow recovery jog down and dynamic lower extremity stretches"
    },
    workoutStructure: {
      warmup: [
        {
          id: "coe-wu-1",
          blockType: "warmup",
          name: "Coe Team Base warmup",
          description: "Controlled jogging with easy wind-ups.",
          repetitions: 1,
          work: { durationSeconds: 720, intensity: "Aerobic entry pace", targetType: "duration" }
        }
      ],
      mainSet: [
        {
          id: "coe-ms-1",
          blockType: "interval",
          name: "Ladder Run: 300m Rep",
          description: "Establish rhythm and lock target Mile pace immediately.",
          repetitions: 1,
          work: { distanceMeters: 300, intensity: "Mile race pace", targetType: "distance" },
          recovery: { type: "jog", durationSeconds: 120, intensity: "Slow relaxation shuffle" }
        },
        {
          id: "coe-ms-2",
          blockType: "interval",
          name: "Ladder Run: 500m Rep",
          description: "Maintain the exact same mile speed for a longer, taxing duration.",
          repetitions: 1,
          work: { distanceMeters: 500, intensity: "Mile race pace", targetType: "distance" },
          recovery: { type: "jog", durationSeconds: 180, intensity: "Float recovery shuffle" }
        },
        {
          id: "coe-ms-3",
          blockType: "interval",
          name: "Ladder Run: 700m Rep (Peak Segment)",
          description: "Tests race endurance and breathing control at goal pace.",
          repetitions: 1,
          work: { distanceMeters: 700, intensity: "Mile race pace", targetType: "distance" },
          recovery: { type: "jog", durationSeconds: 240, intensity: "Extended float recovery jog" }
        },
        {
          id: "coe-ms-4",
          blockType: "interval",
          name: "Ladder Run: 500m Rep (Down step)",
          description: "Work on posture maintenance as fatigue accumulates.",
          repetitions: 1,
          work: { distanceMeters: 500, intensity: "Mile race pace", targetType: "distance" },
          recovery: { type: "jog", durationSeconds: 180, intensity: "Float recovery shuffle" }
        },
        {
          id: "coe-ms-5",
          blockType: "interval",
          name: "Ladder Run: 300m Rep (sharpening finish)",
          description: "Fast, crisp stride-outs with focus on absolute relaxed sprint mechanics.",
          repetitions: 1,
          work: { distanceMeters: 300, intensity: "Mile race pace (light finish)", targetType: "distance" }
        }
      ],
      cooldown: [
        {
          id: "coe-cd-1",
          blockType: "cooldown",
          name: "Thorough Decompressing Jog",
          description: "Warm-down jog to settle muscles and return to base state.",
          repetitions: 1,
          work: { durationSeconds: 480, intensity: "Extremely easy shuffle speed", targetType: "duration" }
        }
      ]
    },
    variants: {
      easier: {
        description: "Scale back by omitting the 700m peak step entirely, yielding a 300-500-500-300 pyramid with generous 3-min recoveries.",
        mainSet: []
      },
      harder: {
        description: "Increase the tempo by adding a second 700m rep at peak level and shrinking recovery by 30 seconds on each step.",
        mainSet: []
      }
    }
  },
  {
    id: "legend-running-05",
    slug: "billat-30-30-vo2max-intervals",
    entryType: "running-workout",
    title: "Veronique Billat VO2Max 30-30",
    shortTitle: "Billat 30-30 VO2Max",
    summary: "Classic, scientifically validated interval configuration targeting maximum time accumulated at VO2max. Features rapid alternation of 30-second strides at vVO2max and 30-second easy float jogs.",
    level: "intermediate",
    difficulty: 7,
    phase: ["build"],
    phases: ["build", "specific"],
    surface: ["road", "track"],
    surfaces: ["road", "track", "trail"],
    estimatedDurationMin: 40,
    estimatedDistanceKm: 8.0,
    distanceNavId: "5k",
    primaryDistance: "5K",
    workoutType: "intervals",
    targetRunnerType: "intermediate & advanced distance athletes",
    risk: "medium",
    riskReason: "High target speeds run close to vVO2max, but managed with high frequency, brief active recovery blocks.",
    physiologicalPurpose: "Maximize cardiac stroke depth and total duration spent at maximal oxygen uptake (VO2max) while producing minimal raw blood acidosis.",
    bestUsedWhen: "Early to mid build phase to boost aerobic engine capacity and raw speed efficiency.",
    avoidWhen: "Experiencing minor hamstring strains, Achilles issues, or severe fatigue.",
    sourceInspiration: "Dr. Veronique Billat's Academic VO2max Interval Research Studies",
    coachingNotes: [
      "Do not sprint the 30-second on-segments. The speed should match current 1500m/3K effort (approximately vVO2max).",
      "Crucially, the 30-second off-segments must be an active easy float jog, NOT an absolute walking rest.",
      "Lock into a high, clean stride turnover during the active intervals."
    ],
    commonMistakes: [
      "Running the active 30s as an all-out sprint, which causes rapid lactate buildup and forces walking during the recovery.",
      "Allowing the float recovery jog to become too fast and competitive, which fails to settle cardiorespiratory levels."
    ],
    safetyNotes: [
      "Keep breathing cycles fluid; avoid breath-holding during the quick transitions."
    ],
    intensityGuide: {
      primaryTarget: "Maximum Cardio-Respiratory Stroke Power and VO2Max Expansion",
      paceGuide: "On-blocks at vVO2max (~Mile/3K speed), off-blocks at relaxed recovery jog",
      hrGuide: "Climbs to 90-95% maximal HR and stays sustained there due to short rest",
      rpeGuide: "RPE 8-8.5 out of 10 during hard elements",
      warmup: "10-minute cardiovascular ramp up, followed by 3 strides",
      mainSet: "Two complete clusters of 30-30 alternations with an active set recovery",
      cooldown: "Light, low-impact barefoot grass recovery jog"
    },
    workoutStructure: {
      warmup: [
        {
          id: "bil-wu-1",
          blockType: "warmup",
          name: "Thorough Multi-stage Warmup",
          description: "Elevating core temperature and lubricating joint systems.",
          repetitions: 1,
          work: { durationSeconds: 600, intensity: "Easy aerobic pace", targetType: "duration" }
        }
      ],
      mainSet: [
        {
          id: "bil-ms-1",
          blockType: "interval",
          name: "30-30 Alternations Set 1",
          description: "Perform 30 seconds at vVO2max speed, immediately followed by 30 seconds at easy recovery jog.",
          repetitions: 10,
          work: { durationSeconds: 30, intensity: "vVO2max (Mile racing speed)", targetType: "duration" },
          recovery: { type: "jog", durationSeconds: 30, intensity: "Active float jog speed" },
          notes: "Focus on rapid neuromuscular transition and maintain clean vertical posture."
        },
        {
          id: "bil-ms-2",
          blockType: "recovery",
          name: "Active Cluster Recovery Rest",
          description: "Sustained very easy walking and shaking legs to process metabolic buildup before Set 2.",
          repetitions: 1,
          work: { durationSeconds: 240, intensity: "Slow relaxation walk", targetType: "duration" }
        },
        {
          id: "bil-ms-3",
          blockType: "interval",
          name: "30-30 Alternations Set 2",
          description: "Repeat the high-frequency 30-30 cycle for a second comprehensive block.",
          repetitions: 10,
          work: { durationSeconds: 30, intensity: "vVO2max (Mile racing speed)", targetType: "duration" },
          recovery: { type: "jog", durationSeconds: 30, intensity: "Active float jog speed" },
          notes: "Focus on relaxed arm patterns and steady, strong turnover."
        }
      ],
      cooldown: [
        {
          id: "bil-cd-1",
          blockType: "cooldown",
          name: "Decompression Active Cooldown",
          description: "Light walking and very slow jog to settle blood distribution.",
          repetitions: 1,
          work: { durationSeconds: 300, intensity: "Very easy recovery jog", targetType: "duration" }
        }
      ]
    },
    variants: {
      easier: {
        description: "Decrease the cluster volume to 8 repetitions per set, and allow the off-segment to be a walks-rest if float jogging feels too taxing.",
        mainSet: []
      },
      harder: {
        description: "Increase repetition volume to 15 reps inside each block, maintaining a strict 70% aerobic float speed during all off-segments.",
        mainSet: []
      }
    }
  },
  {
    id: "legend-running-06",
    slug: "ingebrigtsen-double-threshold-reps",
    entryType: "running-workout",
    title: "Ingebrigtsen Norwegian Threshold Model",
    shortTitle: "Norwegian Threshold",
    summary: "Modern elite double-threshold interval setup utilizing controlled, sub-maximal cruise intervals to maximize weekly aerobic volume. Regulates fatigue with precise lactate target pacing.",
    level: "advanced",
    difficulty: 8,
    phase: ["build"],
    phases: ["build", "specific"],
    surface: ["track", "road"],
    surfaces: ["track", "road", "treadmill"],
    estimatedDurationMin: 55,
    estimatedDistanceKm: 13.5,
    distanceNavId: "5k",
    primaryDistance: "5K",
    workoutType: "threshold",
    targetRunnerType: "competitive half-marathon, 5K and 10K athletes",
    risk: "medium",
    riskReason: "High overall training volume, but individual intervals are kept strictly sub-maximal to preserve physiological reserves.",
    physiologicalPurpose: "Raise the lactate threshold velocity (maximal aerobic steady state) while keeping neuromuscular fatigue low to allow for high weekly frequency.",
    bestUsedWhen: "Early, mid, or late build phase, performed with strict heart rate or blood lactate monitoring.",
    avoidWhen: "Suffering from mechanical structural tendon damage, joint soreness, or mental lethargy.",
    sourceInspiration: "Norwegian Training Model & Marius Bakken Threshold Manuals",
    coachingNotes: [
      "This session is NOT a race. Every rep must be strictly controlled, keeping blood lactate under 3.5 mM (Comfortably hard, around half-marathon/10K speed).",
      "Do not push the final intervals. Consistency of effort across all reps is the core goal.",
      "Recoveries are short but active jogs to maintain central blood volume."
    ],
    commonMistakes: [
      "Running the first reps too fast, which elevates heart rate above the anaerobic limit and converts this into a standard VO2Max burnout session.",
      "Skipping core nutrition and hydration after the session, which hinders recoveries."
    ],
    safetyNotes: [
      "Regulate your pace by heart rate caps (never allow heart rate to exceed 88% of HRmax during active threshold intervals)."
    ],
    intensityGuide: {
      primaryTarget: "Lactate Threshold Steady State Acceleration",
      paceGuide: "Sub-maximal threshold pacing (~Half Marathon to 15K effort)",
      hrGuide: "85-88% maximal HR (Stays strictly within Zone 4)",
      rpeGuide: "RPE 7.5 out of 10",
      warmup: "Light progressive jog, strides, and active joint sweeps",
      mainSet: "Sustained sub-maximal threshold cruise sets with brief float rest",
      cooldown: "Thorough active recovery jog"
    },
    workoutStructure: {
      warmup: [
        {
          id: "ing-wu-1",
          blockType: "warmup",
          name: "Steady Aerobic Prep",
          description: "Elevating temperature and respiratory rate.",
          repetitions: 1,
          work: { durationSeconds: 600, intensity: "Easy aerobic speed", targetType: "duration" }
        }
      ],
      mainSet: [
        {
          id: "ing-ms-1",
          blockType: "interval",
          name: "Threshold Cruise Reps",
          description: "Run controlled sub-threshold cruise repetitions with brief recovery.",
          repetitions: 5,
          work: { distanceMeters: 2000, intensity: "Controlled threshold pace", targetType: "distance" },
          recovery: { type: "jog", durationSeconds: 120, intensity: "Very easy recovery shuffle" },
          notes: "Focus on highly fluid, economical breathing. Effort should feel completely sustainable."
        }
      ],
      cooldown: [
        {
          id: "ing-cd-1",
          blockType: "cooldown",
          name: "Gentle recovery jog",
          description: "To return circulatory levels back to baseline.",
          repetitions: 1,
          work: { durationSeconds: 600, intensity: "Light warmdown speed", targetType: "duration" }
        }
      ]
    },
    variants: {
      easier: {
        description: "Scale back by reducing reps from 5 to 3 (6,000m total threshold work) or shortening the interval distance to 1000m.",
        mainSet: []
      },
      harder: {
        description: "Add a 6th repetition of 2000m (12,000m total work), maintaining strict lactate caps under 4.0 mM.",
        mainSet: []
      }
    }
  },
  {
    id: "legend-running-07",
    slug: "jack-daniels-cruise-intervals-10k",
    entryType: "running-workout",
    title: "Jack Daniels 10K Speed Cruise Intervals",
    shortTitle: "JD Cruise Mile",
    summary: "The definitive Jack Daniels' Running Formula cruise intervals setup. Features mile repetitions at lactate threshold pace with precisely prescribed recovery ratios. Excellent aerobic threshold baseline.",
    level: "intermediate",
    difficulty: 7,
    phase: ["build"],
    phases: ["build", "specific"],
    surface: ["road", "track"],
    surfaces: ["road", "track", "treadmill"],
    estimatedDurationMin: 50,
    estimatedDistanceKm: 11.5,
    distanceNavId: "10k",
    primaryDistance: "10K",
    workoutType: "tempo",
    targetRunnerType: "competitive and recreational distance runners",
    risk: "low",
    riskReason: "Controlled intensity cap preserves orthopedic stability and minimizes structural risk.",
    physiologicalPurpose: "Increase the speed at which lactate begins to accumulate in the bloodstream (elevating lactate threshold), boosting running economy.",
    bestUsedWhen: "As a primary weekly quality workout during any segment of the build phase.",
    avoidWhen: "Dealing with acute knee pain, lower back discomfort, or respiratory difficulty.",
    sourceInspiration: "Jack Daniels' Running Formula (Daniels' VDOT Tables)",
    coachingNotes: [
      "Check your personal VDOT tables to find your exact T-Pace (Threshold Pace). Do not guess this intensity.",
      "The recovery interval is exactly 1 minute of rest for every 5 minutes of threshold work (ratio of 5:1). Scale down accordingly.",
      "Focus on stable chest posture and loose arm swing mechanics."
    ],
    commonMistakes: [
      "Running the threshold reps at 5K or 10K race pace instead of the slower, physiologically correct T-Pace.",
      "Taking standing recoveries instead of a light active shuffle-walk."
    ],
    safetyNotes: [
      "Ensure proper hydration prior to this session, as threshold sustain requires ample carbohydrate stores."
    ],
    intensityGuide: {
      primaryTarget: "Lactate Threshold Accumulation Delay and Running Economy",
      paceGuide: "Sustained Daniels' T-Pace effort (~10K race pace + 15-20s per mile)",
      hrGuide: "86-88% maximal HR",
      rpeGuide: "RPE 8 out of 10 ('comfortably hard')",
      warmup: "Light 10-minute aerobic jog, followed by active sweeps",
      mainSet: "Daniels' mile-reps with precise incomplete rest segments",
      cooldown: "Light active shuffle jog to return posture to base"
    },
    workoutStructure: {
      warmup: [
        {
          id: "jd-wu-1",
          blockType: "warmup",
          name: "Aerobic Preparation",
          description: "Elevating temperature.",
          repetitions: 1,
          work: { durationSeconds: 600, intensity: "Easy aerobic pace", targetType: "duration" }
        }
      ],
      mainSet: [
        {
          id: "jd-ms-1",
          blockType: "interval",
          name: "Daniels' T-Pace Mile Reps",
          description: "Run controlled mile repetitions exactly at your formula-calculated T-Pace.",
          repetitions: 5,
          work: { distanceMeters: 1609, intensity: "Jack Daniels' Threshold Pace (T-Pace)", targetType: "distance" },
          recovery: { type: "walk", durationSeconds: 60, intensity: "Slow relaxation walk" },
          notes: "Focus on rhythmic breathing, stepping tall, and keeping facial muscles relaxed."
        }
      ],
      cooldown: [
        {
          id: "jd-cd-1",
          blockType: "cooldown",
          name: "Decompression Warmdown",
          description: "Slow shuffle recovery walk and light jog.",
          repetitions: 1,
          work: { durationSeconds: 400, intensity: "Very easy recovery jog", targetType: "duration" }
        }
      ]
    },
    variants: {
      easier: {
        description: "Decrease volume to 3-4 repetitions of Daniels' mile-reps, and extend the recovery rest period to 90 seconds.",
        mainSet: []
      },
      harder: {
        description: "Increase volume to 6 repetitions of T-Pace miles, or reduce the recovery rest period down to 45 seconds.",
        mainSet: []
      }
    }
  },
  {
    id: "legend-running-08",
    slug: "renato-canova-specific-marathon-block",
    entryType: "running-workout",
    title: "Renato Canova specific marathon Block",
    shortTitle: "Canova specific Block",
    summary: "High-yield marathon-specific workout inspired by Renato Canova. Incorporates long, structured progression reps of alternating paces (Marathon Pace vs. Moderate Base Pace) to train glycogen fat adaptation under high pressure.",
    level: "advanced",
    difficulty: 9,
    phase: ["specific"],
    phases: ["specific", "peak"],
    surface: ["road"],
    surfaces: ["road"],
    estimatedDurationMin: 110,
    estimatedDistanceKm: 26.0,
    distanceNavId: "marathon",
    primaryDistance: "marathon",
    workoutType: "tempo",
    targetRunnerType: "marathoners & ultra athletes",
    risk: "high",
    riskReason: "High overall physical volume and intense orthopedic impact loads; demands outstanding baseline base fitness.",
    physiologicalPurpose: "Train the metabolic system of the body to process fats at marathon speeds, preserving skeletal muscle glycogen for the final miles of competition.",
    bestUsedWhen: "Mid to late specific marathon preparation phases, on a paved surface mimicking the target race course.",
    avoidWhen: "Experiencing acute shin irritation, calf soreness, or early plantar pain.",
    sourceInspiration: "Renato Canova Marathon Specific Endurance Coaching Lectures",
    coachingNotes: [
      "The recovery segments of 2km are NOT slow recovery runs. They must be run at your moderate marathon base pace (about 10-15% slower than marathon pace).",
      "Focus deeply on mental stamina and physical poise in the final 5km blocks.",
      "Take small sips of water or electrolyte mix every 5km during the active simulation."
    ],
    commonMistakes: [
      "Treating the recovery segments as a slow shuffle, which fails to trigger the specific carbohydrate clearance mechanisms.",
      "Starting the marathon pace blocks at half-marathon speed, causing rapid metabolic depletion."
    ],
    safetyNotes: [
      "Maintain strict pacing. Overuse of glycogen in the first half of this run will lead to hitting the wall prematurely."
    ],
    intensityGuide: {
      primaryTarget: "Marathon Pace Glycogen Retention and Neuromuscular Resilience",
      paceGuide: "Active blocks at specific marathon race pace, recovery blocks at moderate progression base pace",
      hrGuide: "80-85% maximal HR, sustained over a long duration",
      rpeGuide: "RPE 8 out of 10",
      warmup: "Light 10-minute progressive run",
      mainSet: "Alternating multi-kilometer marathon speed blocks",
      cooldown: "Slow walking and electrolyte replenishment"
    },
    workoutStructure: {
      warmup: [
        {
          id: "canova-wu-1",
          blockType: "warmup",
          name: "Entry Progressive Warmup Run",
          description: "Gradually increasing running speed to find baseline stride cadence.",
          repetitions: 1,
          work: { durationSeconds: 600, intensity: "Easy base pace", targetType: "duration" }
        }
      ],
      mainSet: [
        {
          id: "canova-ms-1",
          blockType: "interval",
          name: "Canova Alternating block series",
          description: "Perform 5km at Target Marathon Pace, immediately followed by 2km at Moderate Base Progression Pace.",
          repetitions: 3,
          work: { distanceMeters: 5000, intensity: "Target Marathon Race Pace effort", targetType: "distance" },
          recovery: { type: "jog", distanceMeters: 2000, intensity: "Moderate base pace effort" },
          notes: "Do not let the moderate 2km recovery block drop below your aerobic base velocity."
        },
        {
          id: "canova-ms-2",
          blockType: "tempo",
          name: "Final Marathon Pace Hammer rep",
          description: "Final 3km sustained effort at Marathon Pace to build late-session mental resilience under heavy muscle fatigue.",
          repetitions: 1,
          work: { distanceMeters: 3000, intensity: "Goal Marathon Race Pace", targetType: "distance" }
        }
      ],
      cooldown: [
        {
          id: "canova-cd-1",
          blockType: "cooldown",
          name: "System realign walk",
          description: "Decompression walking.",
          repetitions: 1,
          work: { durationSeconds: 600, intensity: "Active recovery walking", targetType: "duration" }
        }
      ]
    },
    variants: {
      easier: {
        description: "Reduce the alternating repetitions count to two (14km of total specific work) and slow the recovery blocks speed.",
        mainSet: []
      },
      harder: {
        description: "Increase the alternating repetitions count to four, resulting in 28km of specific, highly demanding effort.",
        mainSet: []
      }
    }
  },
  {
    id: "legend-running-09",
    slug: "lydiard-aerobic-hill-bounding",
    entryType: "running-workout",
    title: "Arthur Lydiard Aerobic Hill bounding Circuit",
    shortTitle: "Lydiard Hill Circuit",
    summary: "Classic, structured hill circuit inspired by Lydiard principles. Combines progressive uphill bounding, downhill relaxation stride mechanics, and quick sprint accelerations to build massive calf/Achilles power and stride leverage.",
    level: "intermediate",
    difficulty: 6,
    phase: ["base"],
    phases: ["base", "build"],
    surface: ["road", "trail"],
    surfaces: ["road", "trail"],
    estimatedDurationMin: 45,
    estimatedDistanceKm: 7.0,
    distanceNavId: "trail",
    primaryDistance: "trail",
    workoutType: "hill",
    targetRunnerType: "all endurance athletes",
    risk: "low",
    riskReason: "Uphill running has low impact, but requires focus on clean ankle alignment during downhill segments.",
    physiologicalPurpose: "Enhance stroke volume, build eccentric strength in the quadriceps/calf complexes, and develop explosive knee-drive biomechanics.",
    bestUsedWhen: "Late base phase transitioning into the build phase.",
    avoidWhen: "Dealing with knee cap shear issues or Achilles heel tendonitis.",
    sourceInspiration: "Arthur Lydiard Athletic Base & Specific Hill Resistance Formulations",
    coachingNotes: [
      "The uphill bounding movement focuses on vertical projection and high knee drive—bounce, don't just run up.",
      "The downhill run should feel like complete relaxation; float down with short, quick steps. Avoid braking with your heels.",
      "Perform the quick sprints on a flat area immediately after descending."
    ],
    commonMistakes: [
      "Slamming of heels during the downhill descent, causing major eccentric shock through knee cap cartilage.",
      "Leaning backward on the uphill bounding blocks."
    ],
    safetyNotes: [
      "Perform an outstanding ankle and calves dynamic activation warm-up before targeting the steep slopes."
    ],
    intensityGuide: {
      primaryTarget: "Neuromuscular Stride Power and Capillary Density Expansion",
      paceGuide: "Bounding with high dynamic power up, dynamic relaxation down, fast flat accelerations",
      hrGuide: "80-92% maximal HR on uphill sections, decreases on downhill floats",
      rpeGuide: "RPE 8 out of 10 during active bounding climb",
      warmup: "Light 15-minute continuous run, followed by active dynamic drills",
      mainSet: "Lydiard specific hill repetitions with float recovery down",
      cooldown: "Light cooldown jog on grass surfaces"
    },
    workoutStructure: {
      warmup: [
        {
          id: "lyd-wu-1",
          blockType: "warmup",
          name: "Lydiard Base warmup jog",
          description: "Elevating core temperature smoothly.",
          repetitions: 1,
          work: { durationSeconds: 900, intensity: "Easy aerobic pace", targetType: "duration" }
        }
      ],
      mainSet: [
        {
          id: "lyd-ms-1",
          blockType: "interval",
          name: "Explosive Uphill bounding",
          description: "Sustained powerful hill bounding reps up a moderate 4-6% grade hill, focusing on maximal knee extension.",
          repetitions: 6,
          work: { distanceMeters: 200, intensity: "Explosive dynamic effort", targetType: "distance" },
          recovery: { type: "jog", distanceMeters: 200, intensity: "Very simple down-float flat recovery jog" },
          notes: "Focus on driving arms in sync with knee extension. Land softly on the balls of your feet."
        },
        {
          id: "lyd-ms-2",
          blockType: "interval",
          name: "Post-Hill neuromuscular strides",
          description: "Flat, high-cadence strides to convert hill power into horizontal speed mechanics.",
          repetitions: 4,
          work: { distanceMeters: 100, intensity: "Progressive stride velocity (90% effort)", targetType: "distance" },
          recovery: { type: "walk", durationSeconds: 60, intensity: "Recovery walk back rest" },
          notes: "Keep shoulders light and turnover bouncy."
        }
      ],
      cooldown: [
        {
          id: "lyd-cd-1",
          blockType: "cooldown",
          name: "Lydiard classic Grass jog",
          description: "Slow jogging on soft surface to stretch feet complexes.",
          repetitions: 1,
          work: { durationSeconds: 400, intensity: "Easy shake speed", targetType: "duration" }
        }
      ]
    },
    variants: {
      easier: {
        description: "Scale back by substituting explosive uphill bounding with standard aerobic uphill running, and reducing reps to 4.",
        mainSet: []
      },
      harder: {
        description: "Increase bounding repetitions to 10 and add a flat 2,000m steady-state tempo run immediately after finishing.",
        mainSet: []
      }
    }
  }
];

export const legendarySupportRoutines = [
  {
    id: "legend-support-01",
    slug: "achilles-calf-capacity-loading-routine",
    entryType: "support-routine",
    title: "Achilles & Soleus Tendon Loading Protocol",
    shortTitle: "Achilles & Calf Capacity",
    summary: "Clinical-grade sports medicine support routine designed to maximize soleus load endurance capacity and strengthen the Achilles tendon's elastic storage properties. Critical for reducing Achilles strain risks.",
    level: "intermediate",
    difficulty: 5,
    supportCategoryId: "injury-risk",
    supportCategoryLabel: "Injury Risk Reduction",
    routineType: "strength",
    bodyFocus: ["calf / achilles", "ankle mobility", "foot intrinsic"],
    movementGoals: ["Achilles load capacity", "soleus strength acceleration", "lower leg stiffness"],
    equipment: ["stairs or step", "yoga block", "kettlebell / weight (optional)"],
    durationMin: 20,
    sessionStructure: [
      {
        name: "Straight-Leg Calf Raise on Step Edge",
        sets: 3,
        reps: 15,
        restSeconds: 60,
        intensity: "Controlled tempo (3s down, 2s hold, 1s up)",
        side: "both",
        description: "Rise up on both feet, hold on top, then slowly lower heels below step edge to recruit gastroc tendon networks."
      },
      {
        name: "Bent-Knee Soleus Heel Drop",
        sets: 3,
        reps: 12,
        restSeconds: 60,
        intensity: "Moderate controlled",
        side: "both",
        description: "Keep knees bent at a constant 30-degree angle while performing heel raises and drops on step. Directly isolates the deep soleus muscle, which bears up to 8x bodyweight during running."
      },
      {
        name: "Single-Leg Tibialis Posterior Rise",
        sets: 2,
        reps: 15,
        restSeconds: 45,
        intensity: "Controlled light",
        side: "each",
        description: "Step raise while sweeping the ankle inward, strengthening the deep tibialis posterior stabilizing architecture."
      }
    ],
    physiologicalPurpose: "Increase the cross-sectional area of the Achilles tendon, enhance calf muscle-tendon unit stiffness, and build tolerance to high ground-reaction force peaks.",
    placementRule: "Perform immediately after easy run sessions, twice a week. Do NOT execute immediately preceding vital speed/acceleration sessions.",
    bestUsedWhen: "During all phases of running block builds to maintain lower-leg structural integrity.",
    avoidWhen: "Dealing with acute, red-hot Achilles tendonitis flare-ups (use passive isometric holds instead).",
    sourceInspiration: "Alfredson Eccentric Heel Drop Protocol & Modern Sports Physio Tendon Research",
    coachingNotes: [
      "Never push through a sharp, pinching tendon pain. Sensation should be muscular fatigue, not tendon strain.",
      "The slow eccentric (lowering) phase is critical—take a full 3 to 4 seconds to reach maximum stretch depth."
    ],
    commonMistakes: [
      "Bouncing rapidly at the bottom of the heel drop, which transfers the load off the muscle fibers and shocks the tendon insertion point.",
      "Failing to bend the knee during soleus raises, which delegates the work back to the gastrocnemius."
    ],
    safetyNotes: [
      "Do not perform these exercises with heavy added weights if you are recovering from a recent acute calf tear."
    ],
    easierVariant: {
      description: "Perform calf raises flat on the ground instead of on a step edge, eliminating the deep heel drop segment to protect the joint.",
      adjustments: ["No step edge", "Bodyweight only"]
    },
    harderVariant: {
      description: "Perform single-leg heel drops on step edge while holding a 12-16kg kettlebell on the active side.",
      adjustments: ["Single-leg loading", "Add external weight load"]
    }
  },
  {
    id: "legend-support-02",
    slug: "glute-hip-medius-stability-routine",
    entryType: "support-routine",
    title: "Glute Medius & Hip Pelvic Stability Circuit",
    shortTitle: "Glute & Hip Pelvic Stability",
    summary: "Targeted resistance band and isometric circuit centered on optimizing the gluteus medius and lateral rotators. Prevents hip drop, knee valgus collapse, and IT band friction strain symptoms.",
    level: "intermediate",
    difficulty: 4,
    supportCategoryId: "mobility",
    supportCategoryLabel: "Mobility & Balance",
    routineType: "stability",
    bodyFocus: ["hip stability", "glutes", "core stability"],
    movementGoals: ["pelvic alignment", "knee tracking control", "glute medius activation"],
    equipment: ["looped resistance band", "mat"],
    durationMin: 15,
    sessionStructure: [
      {
        name: "Looped Band Lateral Monster Walks",
        sets: 3,
        reps: 20,
        restSeconds: 45,
        intensity: "Controlled tension",
        side: "both",
        description: "Place resistance band above ankles, micro-squat, and step laterally while keeping your toes pointing straight forward."
      },
      {
        name: "Single-Leg Glute Bridge with Hip Hold",
        sets: 3,
        reps: 10,
        restSeconds: 60,
        intensity: "Peak isometric contraction",
        side: "each",
        description: "Raise hips on one leg, squeezing active glutes, and hold the opposite knee high at 90-degrees."
      },
      {
        name: "Clamshells with Band Resistance",
        sets: 2,
        reps: 15,
        restSeconds: 30,
        intensity: "Slow burning",
        side: "each",
        description: "Laying on side, lift top knee open while keeping heels glued. Directly activates gluteus medius."
      }
    ],
    physiologicalPurpose: "Strengthen the hip abductors to maintain horizontal pelvis alignment in the single-leg stance phase, reducing lateral hip sway.",
    placementRule: "Perfect as a pre-run neuromuscular activator (1 set) or as a structured post-run strengthening block (3 full sets).",
    bestUsedWhen: "Twice a week during base and build phases to lock in running form.",
    avoidWhen: "Dealing with acute bursitis or severe hip joint popping.",
    sourceInspiration: "NCAA Athletic Training Hip Stabilization Guidelines",
    coachingNotes: [
      "Ensure you feel the burn directly in the side-pocket of the glutes, not the front hip flexor (TFL).",
      "During Single-Leg bridges, avoid arching your lower back—think of keeping a flat stomach and a neutral spine."
    ],
    commonMistakes: [
      "Letting the torso twist open during clamshells—keep your hip bones completely vertical throughout the movement.",
      "Stepping too wide during monster walks, which unloads the lateral stabilizing muscles."
    ],
    safetyNotes: [
      "Keep core brace solid. If back fatigue starts, lower the reps scale immediately."
    ],
    easierVariant: {
      description: "Remove the resistance band and focus purely on slow bodyweight movements with isometric squeezes at the top of each rep.",
      adjustments: ["Bodyweight only", "Slightly shorter ranges"]
    },
    harderVariant: {
      description: "Elevate the foot of the active leg during single-leg bridges, or use a heavy resistance band and hold each open rep of clamshells for 5 seconds.",
      adjustments: ["Elevate heel", "Add 5-sec top isometric hold"]
    }
  },
  {
    id: "legend-support-03",
    slug: "plyometric-calf-athletic-mechanics-progression",
    entryType: "support-routine",
    title: "Calf Bounding & Neuromuscular Ankling Protocol",
    shortTitle: "Athletic Neuromuscular Drills",
    summary: "Elite dryland running mechanics and low-impact plyometrics circuit. Designed to reduce ground contact times, raise leg spring stiffness, and maximize elastic energy reuse.",
    level: "advanced",
    difficulty: 6,
    supportCategoryId: "plyometric",
    supportCategoryLabel: "Plyometrics",
    routineType: "coordination",
    bodyFocus: ["running mechanics", "calf / achilles", "posterior chain"],
    movementGoals: ["ground contact reduction", "tendon elasticity", "stride frequency"],
    equipment: ["flat track or turf yard"],
    durationMin: 18,
    sessionStructure: [
      {
        name: "Elastic Ankle Pogo Hops",
        sets: 3,
        reps: 30,
        restSeconds: 60,
        intensity: "Fast rebound effort (short touch)",
        side: "both",
        description: "Jump up and down in place with legs straight, using only foot leverage and ankle pop. Landing should be soft, bouncy, and click quick."
      },
      {
        name: "Continuous A-Skip Strides",
        sets: 3,
        reps: 30,
        restSeconds: 45,
        intensity: "Sub-maximal dynamic",
        side: "both",
        description: "Standard skip drill focusing on explosive knee lift and quick ground rebounds. Keep your elbows bent at exactly 90 degrees."
      },
      {
        name: "Ankling Drill Progression",
        sets: 2,
        reps: 40,
        restSeconds: 30,
        intensity: "Intense rapid foot strikes",
        side: "both",
        description: "A fast metatarsal step roll-through, driving heel recovery up quickly to stimulate calf elastic firing rates."
      }
    ],
    physiologicalPurpose: "Increase structural stiffness of the lower leg's musculo-tendon complex, improving running economy via passive elastic energy return.",
    placementRule: "Perform immediately before speed track intervals as the final phase of your running warm-up.",
    bestUsedWhen: "Build and specific phases to sharpen sprinting/running economy.",
    avoidWhen: "Suffering from acute shin splints, plantar pain, or heel bruises.",
    sourceInspiration: "USATF Coaching Education Level 2 Biomechanics & IAAF Jumps Manuals",
    coachingNotes: [
      "The floor is lava! Minimize your heel ground-contact time during the ankle pogo hops.",
      "Stay tall throughout the drills. Keep your abdominal wall engaged and your hips locked forward."
    ],
    commonMistakes: [
      "Letting knees bend excessively during pogo hops, which shifts the loading off the elastic calf tendons and onto the quadriceps.",
      "Hunching the back and shoulders while executing fast skippings."
    ],
    safetyNotes: [
      "Always perform these drills on a soft, supportive surface like turf, grass, or a synthetic track. Avoid concrete."
    ],
    easierVariant: {
      description: "Substitute jumps with rhythmic heel pops (raising heels rapidly without letting toes leave the ground) and slow marching skips.",
      adjustments: ["No takeoff hops", "Slow marching stride-offs"]
    },
    harderVariant: {
      description: "Transition pogo hops to single-leg ankle pogos, and add lateral bounds (ice skaters) to promote multi-planar motor recruitment.",
      adjustments: ["Single-leg pogos", "Add lateral bounds"]
    }
  }
];
