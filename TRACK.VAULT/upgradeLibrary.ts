import * as fs from 'fs';
import * as path from 'path';

const WORKSPACE_DIR = path.join(process.cwd(), 'TRACK.VAULT');
const RUN_DIR = path.join(WORKSPACE_DIR, 'final', 'run workouts');
const SUP_DIR = path.join(WORKSPACE_DIR, 'final', 'support routines');
const GEN_DIR = path.join(WORKSPACE_DIR, 'final', 'generated');

// Ensure output dir exists
if (!fs.existsSync(GEN_DIR)) {
  fs.mkdirSync(GEN_DIR, { recursive: true });
}

// -------------------------------------------------------------
// HELPER: HASH OR DETERMINISTIC INDEX FOR STABILITY
// -------------------------------------------------------------
function getStableIndex(id: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) % max;
}

// -------------------------------------------------------------
// ENRICHMENT DICTIONARIES & LOGIC FOR RUNNING WORKOUTS
// -------------------------------------------------------------
function enrichRunningWorkout(entry: any): any {
  const id = entry.id;
  const level = entry.level || 'beginner';
  const category = (entry.libraryCategoryId || 'general').toLowerCase();
  const phase = Array.isArray(entry.phase) ? entry.phase[0] : (entry.phase || 'base');
  
  if (entry.title) {
    entry.title = entry.title.replace(/\s*\[?Set\s*\d+\]?/i, '').trim();
  }

  const titleLower = (entry.title || '').toLowerCase();
  const summaryLower = (entry.summary || '').toLowerCase();
  const textCombined = titleLower + ' ' + summaryLower;

  let sessionFamily = 'Easy / Recovery';
  let sessionSubType = 'recovery-jog';

  if (['100m', '200m'].includes(category)) {
    if (textCombined.includes('start') || textCombined.includes('block')) {
      sessionFamily = 'Speed / Strides';
      sessionSubType = 'block-starts-acceleration';
    } else if (textCombined.includes('flying') || textCombined.includes('fly')) {
      sessionFamily = 'Speed / Strides';
      sessionSubType = 'flying-sprints';
    } else if (textCombined.includes('endurance')) {
      sessionFamily = 'Speed Endurance';
      sessionSubType = 'speed-endurance-reps';
    } else if (textCombined.includes('acceleration') || textCombined.includes('accel')) {
      sessionFamily = 'Acceleration Development';
      sessionSubType = 'max-velocity-reps';
    } else {
      sessionFamily = 'Speed Endurance';
      sessionSubType = 'full-recovery-sprints';
    }
  } else if (category === '400m') {
    if (textCombined.includes('special 1') || textCombined.includes('special endurance 1') || textCombined.includes('se1')) {
      sessionFamily = 'Speed Endurance';
      sessionSubType = 'special-endurance-1';
    } else if (textCombined.includes('special 2') || textCombined.includes('special endurance 2') || textCombined.includes('se2')) {
      sessionFamily = 'Specific Endurance';
      sessionSubType = 'special-endurance-2';
    } else if (textCombined.includes('split') || textCombined.includes('broken')) {
      sessionFamily = 'Specific Endurance';
      sessionSubType = 'split-400s';
    } else if (textCombined.includes('lactate') || textCombined.includes('tolerance') || textCombined.includes('clearance')) {
      sessionFamily = 'Lactate Clearance';
      sessionSubType = 'lactate-tolerance-reps';
    } else if (textCombined.includes('tempo') || textCombined.includes('extensive')) {
      sessionFamily = 'Tempo';
      sessionSubType = 'extensive-tempo-blocks';
    } else {
      sessionFamily = 'Speed Endurance';
      sessionSubType = 'special-endurance-1';
    }
  } else if (category === '800m') {
    if (textCombined.includes('broken') || textCombined.includes('split')) {
      sessionFamily = 'Specific Endurance';
      sessionSubType = 'broken-800m';
    } else if (textCombined.includes('race pace') || textCombined.includes('pace reps') || textCombined.includes('specific')) {
      sessionFamily = 'Specific Endurance';
      sessionSubType = 'race-pace-reps';
    } else if (textCombined.includes('speed') || textCombined.includes('strides') || textCombined.includes('velocity')) {
      sessionFamily = 'Speed Endurance';
      sessionSubType = 'speed-endurance-reps';
    } else if (textCombined.includes('threshold') || textCombined.includes('tempo')) {
      sessionFamily = 'Threshold Intervals';
      sessionSubType = 'threshold-plus-speed';
    } else {
      sessionFamily = 'Specific Endurance';
      sessionSubType = 'middle-distance-aerobic-base';
    }
  } else if (['1500m', 'mile'].includes(category)) {
    if (textCombined.includes('race pace') || textCombined.includes('pace reps') || textCombined.includes('specific')) {
      sessionFamily = 'Race Pace Repeats';
      sessionSubType = 'race-pace-reps';
    } else if (textCombined.includes('broken') || textCombined.includes('split')) {
      sessionFamily = 'Race Pace Repeats';
      sessionSubType = 'broken-intervals';
    } else if (textCombined.includes('ladder') || textCombined.includes('pyramid')) {
      sessionFamily = 'Race Pace Repeats';
      sessionSubType = 'ladder-workout';
    } else if (textCombined.includes('threshold') || textCombined.includes('tempo')) {
      sessionFamily = 'Threshold Intervals';
      sessionSubType = 'threshold-plus-strides';
    } else {
      sessionFamily = 'Race Pace Repeats';
      sessionSubType = 'race-pace-sharpening';
    }
  } else if (['3k', '5k'].includes(category)) {
    if (textCombined.includes('vo2') || textCombined.includes('interval') || textCombined.includes('repeat') || textCombined.includes('1k')) {
      sessionFamily = 'VO2-style Intervals';
      sessionSubType = 'vo2max-repeats';
    } else if (textCombined.includes('race pace') || textCombined.includes('pace reps')) {
      sessionFamily = 'VO2-style Intervals';
      sessionSubType = 'race-pace-reps';
    } else if (textCombined.includes('cruise')) {
      sessionFamily = 'Cruise Intervals';
      sessionSubType = 'cruise-repeats';
    } else if (textCombined.includes('threshold') || textCombined.includes('tempo')) {
      sessionFamily = 'Threshold Intervals';
      sessionSubType = 'threshold-blocks';
    } else if (textCombined.includes('fartlek')) {
      sessionFamily = 'Fartlek';
      sessionSubType = 'fartlek-intervals';
    } else {
      sessionFamily = 'VO2-style Intervals';
      sessionSubType = 'race-pace-reps';
    }
  } else if (category === '10k') {
    if (textCombined.includes('tempo') || textCombined.includes('steady')) {
      sessionFamily = 'Tempo';
      sessionSubType = 'tempo-run';
    } else if (textCombined.includes('threshold') || textCombined.includes('cruise') || textCombined.includes('reps')) {
      sessionFamily = 'Threshold Intervals';
      sessionSubType = 'threshold-repeats';
    } else if (textCombined.includes('vo2') || textCombined.includes('interval')) {
      sessionFamily = 'VO2-style Intervals';
      sessionSubType = 'vo2max-repeats';
    } else if (textCombined.includes('steady state') || textCombined.includes('aerobic')) {
      sessionFamily = 'Steady Run';
      sessionSubType = 'steady-state';
    } else {
      sessionFamily = 'Threshold Intervals';
      sessionSubType = 'fast-finish-long-run';
    }
  } else if (category === 'half-marathon') {
    if (textCombined.includes('tempo') || textCombined.includes('blocks')) {
      sessionFamily = 'Tempo';
      sessionSubType = 'tempo-blocks';
    } else if (textCombined.includes('steady') || textCombined.includes('aerobic')) {
      sessionFamily = 'Steady Run';
      sessionSubType = 'steady-state';
    } else if (textCombined.includes('progression') || textCombined.includes('progressive')) {
      sessionFamily = 'Progression Run';
      sessionSubType = 'progressive-long-run';
    } else if (textCombined.includes('cruise') || textCombined.includes('threshold')) {
      sessionFamily = 'Cruise Intervals';
      sessionSubType = 'cruise-repeats';
    } else {
      sessionFamily = 'Tempo';
      sessionSubType = 'tempo-blocks';
    }
  } else if (category === 'marathon') {
    if (textCombined.includes('marathon pace') || textCombined.includes('mp') || textCombined.includes('steady')) {
      sessionFamily = 'Steady Run';
      sessionSubType = 'marathon-pace-run';
    } else if (textCombined.includes('progression') || textCombined.includes('progressive') || textCombined.includes('finish')) {
      sessionFamily = 'Progression Run';
      sessionSubType = 'progressive-long-run';
    } else if (textCombined.includes('alternating') || textCombined.includes('alternation')) {
      sessionFamily = 'Alternation Run';
      sessionSubType = 'alternating-tempo';
    } else {
      sessionFamily = 'Long Run';
      sessionSubType = 'fatigue-resistance-run';
    }
  } else if (category === 'trail') {
    if (textCombined.includes('climb') || textCombined.includes('uphill') || textCombined.includes('hill repeat')) {
      sessionFamily = 'Hill Repeats';
      sessionSubType = 'uphill-repeats';
    } else if (textCombined.includes('downhill') || textCombined.includes('descending')) {
      sessionFamily = 'Hill Repeats';
      sessionSubType = 'downhill-technique';
    } else if (textCombined.includes('fartlek') || textCombined.includes('rolling')) {
      sessionFamily = 'Fartlek';
      sessionSubType = 'rolling-fartlek';
    } else {
      sessionFamily = 'Long Run';
      sessionSubType = 'trail-long-run';
    }
  } else if (category === 'treadmill') {
    if (textCombined.includes('incline tempo') || textCombined.includes('tempo')) {
      sessionFamily = 'Tempo';
      sessionSubType = 'incline-tempo';
    } else if (textCombined.includes('incline interval') || textCombined.includes('interval')) {
      sessionFamily = 'Cruise Intervals';
      sessionSubType = 'incline-intervals';
    } else if (textCombined.includes('hill') || textCombined.includes('climb')) {
      sessionFamily = 'Hill Repeats';
      sessionSubType = 'treadmill-hill-reps';
    } else {
      sessionFamily = 'Steady Run';
      sessionSubType = 'treadmill-steady';
    }
  } else {
    // base-recovery, general
    if (textCombined.includes('recovery') || textCombined.includes('easy') || textCombined.includes('jog')) {
      sessionFamily = 'Easy / Recovery';
      sessionSubType = 'recovery-jog';
    } else if (textCombined.includes('steady') || textCombined.includes('aerobic')) {
      sessionFamily = 'Steady Run';
      sessionSubType = 'steady-aerobic';
    } else if (textCombined.includes('progression') || textCombined.includes('progressive')) {
      sessionFamily = 'Progression Run';
      sessionSubType = 'progressive-jog';
    } else {
      sessionFamily = 'Speed / Strides';
      sessionSubType = 'strides-session';
    }
  }

  // 2. Prescription Style mapping
  let prescriptionStyle = 'distance-based';
  const hasTimeWork = entry.workoutStructure?.mainSet?.some((b: any) => b.work?.durationSeconds !== null || b.work?.targetType === 'time') || false;
  const hasDistWork = entry.workoutStructure?.mainSet?.some((b: any) => b.work?.distanceMeters !== null || b.work?.targetType === 'distance') || false;
  
  if (hasTimeWork && hasDistWork) {
    prescriptionStyle = 'hybrid';
  } else if (hasTimeWork) {
    prescriptionStyle = 'time-based';
  } else if (category === 'trail' || textCombined.includes('effort') || textCombined.includes('rpe')) {
    prescriptionStyle = 'effort-based';
  } else {
    prescriptionStyle = 'distance-based';
  }

  // 3. Structure Pattern mapping
  let structurePattern = 'straight-repeats';
  if (textCombined.includes('ladder')) {
    structurePattern = 'ladder';
  } else if (textCombined.includes('pyramid')) {
    structurePattern = 'pyramid';
  } else if (textCombined.includes('broken') || textCombined.includes('split')) {
    structurePattern = 'broken-reps';
  } else if (textCombined.includes('alternat')) {
    structurePattern = 'alternation';
  } else if (textCombined.includes('float')) {
    structurePattern = 'float-recovery';
  } else if (textCombined.includes('progress')) {
    structurePattern = 'progression';
  } else if (textCombined.includes('fartlek')) {
    structurePattern = 'fartlek';
  } else if (textCombined.includes('circuit') || textCombined.includes('loop')) {
    structurePattern = 'hill-circuit';
  } else if (textCombined.includes('combo') || textCombined.includes('mixed') || textCombined.includes('+') || textCombined.includes('and')) {
    structurePattern = 'race-pace-combo';
  } else if (textCombined.includes('sharpening') || textCombined.includes('taper') || phase === 'race-week' || phase === 'peak') {
    structurePattern = 'sharpening';
  } else {
    structurePattern = 'straight-repeats';
  }

  // 4. programContext mapping
  let bestUsedInPhase = ['base'];
  let sessionRole = 'quality-session';
  let weeklyPlacement = ['tuesday', 'thursday', 'saturday'];
  let recommendedBefore = ['easy-run', 'rest-day'];
  let recommendedAfter = ['easy-run', 'mobility-flow', 'rest-day'];
  let avoidAfter = ['hard-interval', 'long-run'];
  let minimumRecoveryHours = 36;

  if (sessionFamily === 'Easy / Recovery') {
    bestUsedInPhase = ['base', 'build', 'specific', 'race-week', 'recovery'];
    sessionRole = 'recovery-session';
    weeklyPlacement = ['monday', 'wednesday', 'friday'];
    recommendedBefore = ['hard-interval', 'long-run'];
    recommendedAfter = ['easy-run', 'rest-day'];
    avoidAfter = [];
    minimumRecoveryHours = 12;
  } else if (['100m', '200m', '400m'].includes(category)) {
    bestUsedInPhase = ['build', 'specific', 'race-week'];
    sessionRole = 'speed-development';
    weeklyPlacement = ['tuesday', 'saturday'];
    minimumRecoveryHours = 48;
  } else if (['half-marathon', 'marathon'].includes(category)) {
    bestUsedInPhase = ['base', 'build', 'specific'];
    sessionRole = 'aerobic-capacity-builder';
    weeklyPlacement = ['saturday', 'sunday'];
    minimumRecoveryHours = 48;
  }

  if (phase === 'race' || phase === 'race-week' || textCombined.includes('taper') || textCombined.includes('sharpening')) {
    bestUsedInPhase = ['race-week'];
    sessionRole = 'race-week-sharpening';
    weeklyPlacement = ['tuesday', 'thursday'];
    minimumRecoveryHours = 24;
    recommendedBefore = ['rest-day'];
    recommendedAfter = ['rest-day', 'activation-flow'];
  }

  const programContext = {
    bestUsedInPhase,
    sessionRole,
    weeklyPlacement,
    recommendedBefore,
    recommendedAfter,
    avoidAfter,
    minimumRecoveryHours
  };

  // 5. athleteProfile mapping
  let experienceLevel = level;
  let minMil = 15;
  let maxMil = 30;
  let suitableFor = ['5k-builder', 'returning-runner'];
  let notSuitableFor = ['acute-injury-recovery'];
  let prerequisites = ['can-run-30min-continuously'];

  if (['100m', '200m', '400m'].includes(category)) {
    if (level === 'beginner') {
      minMil = 5; maxMil = 15;
      suitableFor = ['sprint-beginner', 'fitness-builder'];
      prerequisites = ['basic-motor-skills'];
    } else if (level === 'intermediate') {
      minMil = 15; maxMil = 30;
      suitableFor = ['club-sprinter', 'middle-distance-athlete'];
      prerequisites = ['completed-sprint-base-6weeks'];
    } else {
      minMil = 30; maxMil = 50;
      suitableFor = ['competitive-sprinter', 'experienced-400m-runner'];
      prerequisites = ['structured-speed-base'];
    }
  } else if (['half-marathon', 'marathon'].includes(category)) {
    if (level === 'beginner') {
      minMil = 30; maxMil = 50;
      suitableFor = ['half-marathon-novice', 'marathon-completer'];
      prerequisites = ['can-run-60min-continuously'];
    } else if (level === 'intermediate') {
      minMil = 50; maxMil = 80;
      suitableFor = ['boston-qualifier-aspirant', 'experienced-road-racer'];
      prerequisites = ['can-run-90min-continuously'];
    } else {
      minMil = 80; maxMil = 140;
      suitableFor = ['competitive-marathoner', 'elite-athlete'];
      prerequisites = ['weekly-mileage-above-60km'];
    }
  } else {
    // 5K, 10K, etc.
    if (level === 'beginner') {
      minMil = 15; maxMil = 30;
      suitableFor = ['5k-builder', 'returning-runner'];
      prerequisites = ['can-run-30min-continuously'];
    } else if (level === 'intermediate') {
      minMil = 30; maxMil = 60;
      suitableFor = ['10k-competitor', 'road-racer'];
      prerequisites = ['can-run-45min-continuously'];
    } else {
      minMil = 60; maxMil = 90;
      suitableFor = ['sub-18-5k-aspirant', 'advanced-distance-runner'];
      prerequisites = ['weekly-mileage-above-50km'];
    }
  }

  const athleteProfile = {
    experienceLevel,
    weeklyMileageRangeKm: { min: minMil, max: maxMil },
    suitableFor,
    notSuitableFor,
    prerequisites
  };

  // 6. trainingPurpose mapping
  let primaryAdaptation = 'aerobic-base-conditioning';
  let secondaryAdaptations = ['capillary-density-development', 'mitochondrial-biogenesis'];
  let practicalUse = 'Promotes blood flow and active tissue recovery without excessive musculoskeletal stress.';
  let notFor = 'Avoid when suffering from acute systemic fatigue or high-grade tendon soreness.';

  if (sessionFamily === 'VO2-style Intervals') {
    primaryAdaptation = 'vo2max-aerobic-power';
    secondaryAdaptations = ['cardiac-stroke-volume', 'running-economy', 'anaerobic-capacity'];
    practicalUse = 'Increases oxygen transport efficiency and raises the physiological ceiling of aerobic contribution.';
    notFor = 'Avoid if recovering from calf tightness, Achilles soreness, or acute tendon loading fatigue.';
  } else if (['Threshold Intervals', 'Cruise Intervals', 'Tempo'].includes(sessionFamily)) {
    primaryAdaptation = 'lactate-threshold-velocity';
    secondaryAdaptations = ['lactate-clearance-capacity', 'aerobic-power-maintenance', 'mental-stamina'];
    practicalUse = 'Delays the accumulation of blood lactate at race velocities, shifting the sustainable running speed.';
    notFor = 'Avoid when dealing with deep glycogen depletion or high neuromuscular fatigue.';
  } else if (['Speed Endurance', 'Speed / Strides', 'Acceleration Development'].includes(sessionFamily)) {
    primaryAdaptation = 'neuromuscular-power-stride-frequency';
    secondaryAdaptations = ['anaerobic-capacity', 'motor-unit-recruitment', 'hamstring-resilience'];
    practicalUse = 'Develops maximum velocity, improves starting acceleration, and optimizes high-speed coordination.';
    notFor = 'Avoid if hamstring tightness or nerve entrapment is present.';
  } else if (sessionFamily === 'Hill Repeats') {
    primaryAdaptation = 'muscular-force-climbing-strength';
    secondaryAdaptations = ['eccentric-downhill-tolerance', 'running-economy', 'stride-power'];
    practicalUse = 'Builds localized muscular strength, improves stride length mechanics, and conditions tendons.';
    notFor = 'Avoid when suffering from active Achilles tendon pain or patellofemoral irritation.';
  }

  const trainingPurpose = {
    primaryAdaptation,
    secondaryAdaptations,
    practicalUse,
    notFor
  };

  // 7. executionCues
  let executionCues = [
    'Keep the effort conversational; you should be able to speak in full sentences.',
    'Focus on a relaxed posture, dropping your shoulders.',
    'Maintain a soft, quick footstrike underneath your center of gravity.'
  ];

  if (sessionFamily === 'VO2-style Intervals') {
    executionCues = [
      'Focus on a strong, upright posture as fatigue increases.',
      'Drive your arms straight forward and backward, not across your chest.',
      'Keep your gaze focused 20-30 meters ahead, not down at your feet.'
    ];
  } else if (['Threshold Intervals', 'Cruise Intervals', 'Tempo'].includes(sessionFamily)) {
    executionCues = [
      'Maintain a controlled, comfortably hard rhythm.',
      'Check your breathing rate; aim for a steady 2:2 pattern (two steps in, two steps out).',
      'Focus on running tall and keeping your pelvis neutral.'
    ];
  } else if (['Speed Endurance', 'Speed / Strides', 'Acceleration Development'].includes(sessionFamily)) {
    executionCues = [
      'Focus on explosive force application during the acceleration phase.',
      'Relax your face, jaw, and hands; tension restricts maximum velocity.',
      'Maintain high knee drive and active hip extension.'
    ];
  } else if (category === 'trail' || sessionFamily === 'Hill Repeats') {
    executionCues = [
      'Shorten your stride and pump your arms dynamically on ascents.',
      'Lean slightly forward from the ankles, not the hips, when climbing.',
      'Look 3-4 steps ahead to anticipate footing changes on descents.'
    ];
  }

  // 8. commonMistakes
  let commonMistakes = [
    'Running recovery runs too fast, which interferes with physiological adaptation.',
    'Straining on hills instead of backing off the effort.'
  ];

  if (sessionFamily === 'VO2-style Intervals') {
    commonMistakes = [
      'Starting the first repetitions too fast, leading to severe form collapse.',
      'Extending the recovery periods or walking completely static instead of active movement.'
    ];
  } else if (['Threshold Intervals', 'Cruise Intervals', 'Tempo'].includes(sessionFamily)) {
    commonMistakes = [
      'Treating threshold runs as a race, pushing into high anaerobic zones.',
      'Allowing the pace to drift too fast or slow instead of maintaining steady state.'
    ];
  } else if (['Speed Endurance', 'Speed / Strides', 'Acceleration Development'].includes(sessionFamily)) {
    commonMistakes = [
      'Neglecting full recoveries, which compromises speed quality and increases risk of hamstring strain.',
      'Overstriding (reaching too far forward with the heel), which acts as a brake.'
    ];
  } else if (category === 'trail' || sessionFamily === 'Hill Repeats') {
    commonMistakes = [
      'Attacking uphill climbs too aggressively, leading to premature muscle exhaustion.',
      'Leaning backward on downhills, increasing eccentric shock loads on knees.'
    ];
  }

  // 9. readinessGate
  const readinessGate = {
    startIf: [
      'No sharp pain in muscles or joints.',
      'Breathing feels normal during the warmup jog.',
      'Legs feel responsive during light stride checks.'
    ],
    modifyIf: [
      'Sleep was poor (under 6 hours) or hydration is low.',
      'Muscles feel unusually stiff but no sharp pain.',
      'Warmup feels sluggish.'
    ],
    skipIf: [
      'Sharp pain that causes limping or gait compensation.',
      'Feeling dizzy, lightheaded, or having systemic symptoms.',
      'Elevated resting heart rate indicating under-recovery.'
    ]
  };

  // 10. environmentAdjustments
  const environmentAdjustments = {
    track: 'Use lanes consistently. Check direction rules to protect hips.',
    road: 'Choose flat, traffic-free paths. Run on soft shoulders if available.',
    treadmill: 'Use 1-2% incline to simulate wind resistance and match road effort.',
    hotWeather: 'Reduce target speed by 5-10%. Extend recovery intervals as needed.',
    hills: 'Maintain steady effort, not pace, when running uphill.'
  };

  // 11. progressionOptions
  let progressionOptions = {
    makeEasier: [
      'Reduce the total count of repetitions by 1-2.',
      'Extend the recovery time by 30-60 seconds.',
      'Run at a slightly more relaxed effort level.'
    ],
    makeHarder: [
      'Add 1-2 repetitions, maintaining the same target pace.',
      'Slightly shorten recoveries or transition to an active float recovery.',
      'Complete the final repeat slightly faster while maintaining form.'
    ],
    doNotProgressIf: [
      'Pace drops by more than 5% across intervals.',
      'Form begins to break down or coordination is lost.',
      'Persistent muscle tightness or sharp pain is felt.'
    ]
  };

  if (category === 'trail' || sessionFamily === 'Hill Repeats') {
    progressionOptions = {
      makeEasier: [
        'Reduce climb repetitions or decrease the slope gradient.',
        'Use walking descents for complete cardiac recovery.'
      ],
      makeHarder: [
        'Increase incline repeats or extend repeat duration.',
        'Maintain a steady run pace immediately off the crest.'
      ],
      doNotProgressIf: [
        'Running technique breaks down or knee valgus occurs.',
        'Calf or Achilles irritation is felt.'
      ]
    };
  } else if (sessionFamily === 'Easy / Recovery') {
    progressionOptions = {
      makeEasier: [
        'Reduce duration by 5-10 minutes.',
        'Walk for 1 minute every 9 minutes of running.'
      ],
      makeHarder: [
        'Add 5-10 minutes of aerobic running.',
        'Integrate 3-4 light strides at the end of the session.'
      ],
      doNotProgressIf: [
        'Systemic fatigue is high.',
        'Mild joint discomfort is felt.'
      ]
    };
  } else if (sessionFamily === 'Threshold Intervals' || sessionFamily === 'Cruise Intervals') {
    progressionOptions = {
      makeEasier: [
        'Reduce repetitions.',
        'Extend recovery intervals.'
      ],
      makeHarder: [
        'Reduce recovery time to 45-60 seconds.',
        'Convert walk recovery into an active aerobic float recovery.'
      ],
      doNotProgressIf: [
        'Pace cannot be held within 5 seconds of threshold target.',
        'Form starts to collapse.'
      ]
    };
  }

  // 12. riskProfile
  let riskLevel = 'medium';
  let riskReasons = [
    'Repetitive pounding over hard surfaces.',
    'Neuromuscular fatigue might impact foot strike landing alignment.'
  ];
  let saferAlternative = 'Move the workout to a track or soft grass surface to reduce joint impact forces.';

  if (['Speed Endurance', 'Speed / Strides', 'Acceleration Development'].includes(sessionFamily)) {
    riskLevel = 'high';
    riskReasons = [
      'Maximal speed reps create high force demands on the hamstrings and Achilles tendon.',
      'Neuromuscular coordination drops rapidly under fatigue, increasing muscle strain risk.'
    ];
    saferAlternative = 'Complete repeats at 90% effort (controlled strides) rather than absolute 100% max velocity.';
  } else if (category === 'trail' || sessionFamily === 'Hill Repeats') {
    riskLevel = 'medium';
    riskReasons = [
      'High eccentric loading on downhill runs increases knee and quadriceps stress.',
      'Uneven trail footing demands high ankle stability.'
    ];
    saferAlternative = 'Perform hill repeats on a smooth dirt road or run hills on a treadmill.';
  } else if (sessionFamily === 'Easy / Recovery') {
    riskLevel = 'low';
    riskReasons = [
      'Minimal cardiovascular stress.',
      'Low joint loading rate.'
    ];
    saferAlternative = 'Replace with cross-training (cycling or swimming) to completely unload joints.';
  }

  const riskProfile = {
    riskLevel,
    riskReasons,
    saferAlternative
  };

  // 13. compatibleWith
  const compatibleWith = {
    goodPairings: sessionFamily === 'Easy / Recovery' ? ['post-run-mobility', 'core-stability-reset', 'light-drills'] : ['pre-run-activation', 'post-run-cooldown', 'post-run-mobility'],
    badPairings: sessionFamily === 'Easy / Recovery' ? ['immediate-high-intensity-interval-session'] : ['heavy-lower-body-strength-before', 'another-high-intensity-interval-next-day'],
    weeklyFrequency: sessionFamily === 'Easy / Recovery' ? '2-3x/week' : '1x/week'
  };

  // 14. scenarioTags
  const scenarioTags = ['outdoor-training'];
  if (category === 'treadmill') {
    scenarioTags.push('treadmill-day', 'weather-safe', 'controlled-pace');
  } else if (category === 'trail') {
    scenarioTags.push('trail-run', 'hilly-route', 'nature-run');
  } else if (sessionFamily === 'Easy / Recovery') {
    scenarioTags.push('beginner-friendly', 'aerobic-base', 'active-recovery');
  } else if (['100m', '200m', '400m'].includes(category)) {
    scenarioTags.push('track-day', 'sprint-focus', 'speed-development');
  } else {
    scenarioTags.push('road-running', 'quality-session', 'performance-focus');
  }

  // 15. visualBlueprint
  const timelineSegments = [];
  if (entry.workoutStructure?.warmup) {
    timelineSegments.push({ label: 'Warm-up', phase: 'warmup', durationMin: 15 });
  }
  let mainSetDur = 20;
  if (entry.estimatedDurationMin && entry.estimatedDurationMin.min) {
    mainSetDur = Math.max(5, entry.estimatedDurationMin.min - 25);
  }
  timelineSegments.push({ label: 'Main Set', phase: 'main', durationMin: mainSetDur });
  if (entry.workoutStructure?.cooldown) {
    timelineSegments.push({ label: 'Cooldown', phase: 'cooldown', durationMin: 10 });
  }

  let intensityCurve = ['easy', 'moderate', 'easy'];
  if (riskLevel === 'high') {
    intensityCurve = ['easy', 'moderate', 'hard', 'maximal', 'hard', 'easy'];
  } else if (riskLevel === 'medium') {
    intensityCurve = ['easy', 'moderate', 'hard', 'moderate', 'easy'];
  }

  const visualBlueprint = {
    timelineSegments,
    intensityCurve,
    primaryStress: sessionFamily.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    repetitionMapType: entry.workoutType || 'interval'
  };

  return {
    ...entry,
    sessionFamily,
    sessionSubType,
    programContext,
    athleteProfile,
    trainingPurpose,
    structurePattern,
    prescriptionStyle,
    executionCues,
    commonMistakes, 
    readinessGate,
    environmentAdjustments,
    progressionOptions,
    riskProfile,
    compatibleWith,
    scenarioTags,
    visualBlueprint
  };
}

function enrichSupportRoutine(entry: any): any {
  const id = entry.id;
  const level = entry.level || 'beginner';
  const category = (entry.supportCategoryId || 'activation').toLowerCase();

  if (entry.title) {
    entry.title = entry.title.replace(/\s*\[?Set\s*\d+\]?/i, '').trim();
  }

  const titleLower = (entry.title || '').toLowerCase();

  let durationMin = 15;
  if (category === 'activation') durationMin = 10;
  else if (category === 'warm_up_routine') durationMin = 15;
  else if (category === 'cooldown_routine') durationMin = 10;
  else if (category === 'mobility') durationMin = 20;
  else if (category === 'recovery_routine') durationMin = 15;
  else if (category === 'core_stability') durationMin = 15;
  else if (category === 'upper_strength') durationMin = 30;
  else if (category === 'lower_strength') durationMin = 40;
  else if (category === 'plyometric') durationMin = 15;
  else if (category === 'running_drills') durationMin = 12;
  else if (category === 'injury_risk_reduction') durationMin = 20;

  entry.durationMin = durationMin;

  let sessionFamily = 'Mobility reset';
  let sessionSubType = 'general-mobility';

  if (category === 'upper_strength') {
    sessionFamily = 'Upper strength';
    sessionSubType = titleLower.includes('power') ? 'upper-body-power' : 'upper-body-base';
  } else if (category === 'lower_strength') {
    sessionFamily = 'Lower strength';
    if (titleLower.includes('split') || titleLower.includes('squat')) {
      sessionSubType = 'split-squat-foundation';
    } else if (titleLower.includes('chain') || titleLower.includes('rdl') || titleLower.includes('deadlift')) {
      sessionSubType = 'posterior-chain-strength';
    } else {
      sessionSubType = 'single-leg-stability';
    }
  } else if (category === 'core_stability') {
    sessionFamily = 'Core stability';
    sessionSubType = titleLower.includes('rotation') ? 'anti-rotation' : 'anti-extension';
  } else if (category === 'mobility') {
    sessionFamily = 'Mobility reset';
    if (titleLower.includes('hip')) {
      sessionSubType = 'hip-mobility';
    } else if (titleLower.includes('ankle') || titleLower.includes('foot')) {
      sessionSubType = 'ankle-mobility';
    } else {
      sessionSubType = 'thoracic-mobility';
    }
  } else if (category === 'activation') {
    sessionFamily = 'Pre-run activation';
    if (titleLower.includes('glute')) {
      sessionSubType = 'glute-activation';
    } else if (titleLower.includes('ankle') || titleLower.includes('foot') || titleLower.includes('pogo')) {
      sessionSubType = 'foot-ankle-capacity';
    } else {
      sessionSubType = 'hip-stability';
    }
  } else if (category === 'plyometric') {
    sessionFamily = 'Plyometric';
    sessionSubType = level === 'beginner' ? 'low-impact-plyo' : 'tendon-stiffness';
  } else if (category === 'running_drills') {
    sessionFamily = 'Running drills';
    sessionSubType = titleLower.includes('cadence') || titleLower.includes('speed') ? 'cadence-drills' : 'coordination-drills';
  } else if (category === 'warm_up_routine') {
    sessionFamily = 'Dynamic warm-up';
    sessionSubType = 'pre-run-warmup';
  } else if (category === 'cooldown_routine') {
    sessionFamily = 'Post-run cooldown';
    sessionSubType = 'post-run-cooldown';
  } else if (category === 'recovery_routine') {
    sessionFamily = 'Recovery routine';
    sessionSubType = 'active-recovery-flow';
  } else {
    sessionFamily = 'Injury risk reduction';
    if (titleLower.includes('calf') || titleLower.includes('achilles')) {
      sessionSubType = 'calf-achilles-capacity';
    } else if (titleLower.includes('tibialis') || titleLower.includes('shin')) {
      sessionSubType = 'tibialis-posterior-capacity';
    } else if (titleLower.includes('glute') || titleLower.includes('hip') || titleLower.includes('abductor')) {
      sessionSubType = 'glute-med-stabilization';
    } else {
      sessionSubType = 'tendon-resilience';
    }
  }

  // Placement mapping
  let bestBefore = ['easy-run', 'quality-session'];
  let bestAfter: string[] = [];
  let avoidBefore = ['race-day'];
  let minFreq = 2;
  let maxFreq = 4;

  if (['upper_strength', 'lower_strength', 'core_stability', 'plyometric'].includes(category)) {
    bestBefore = [];
    bestAfter = ['easy-run', 'rest-day'];
    avoidBefore = ['quality-session', 'race-day'];
    minFreq = 1; maxFreq = 2;
  } else if (['activation', 'warm_up_routine', 'running_drills'].includes(category)) {
    bestBefore = ['easy-run', 'quality-session', 'race-day'];
    bestAfter = [];
    avoidBefore = [];
    minFreq = 2; maxFreq = 5;
  } else if (category === 'cooldown_routine') {
    bestBefore = [];
    bestAfter = ['easy-run', 'quality-session', 'race-day'];
    avoidBefore = [];
    minFreq = 2; maxFreq = 5;
  }

  const placement = {
    bestBefore,
    bestAfter,
    avoidBefore,
    frequencyPerWeek: { min: minFreq, max: maxFreq }
  };

  // Equipment Profile
  let reqEquipment = ['none'];
  let optEquipment = ['yoga-mat'];
  let substitutions = ['Perform on a flat carpeted floor or grass surface.'];

  if (['upper_strength', 'lower_strength'].includes(category)) {
    reqEquipment = ['bodyweight'];
    if (titleLower.includes('dumbbell')) {
      reqEquipment = ['dumbbells'];
      optEquipment = ['kettlebell', 'adjustable-weights'];
      substitutions = ['Substitute dumbbells with kettlebells or weighted water bottles.'];
    } else if (titleLower.includes('band')) {
      reqEquipment = ['resistance-band'];
      optEquipment = ['mini-band'];
      substitutions = ['Substitute resistance bands with towel isometric holds or bodyweight.'];
    } else {
      optEquipment = ['dumbbells', 'mini-band'];
      substitutions = ['Use household weighted items or bands for added resistance.'];
    }
  } else if (category === 'activation') {
    if (titleLower.includes('band')) {
      reqEquipment = ['mini-band'];
      substitutions = ['Perform glute bridge or hip clamshells without a band if not available.'];
    }
  }

  const equipmentProfile = {
    required: reqEquipment,
    optional: optEquipment,
    substitutions
  };

  // Movement quality focus & exercise lists
  let movementQualityFocus = [
    'Control joint range of motion; do not force movement past pain.',
    'Maintain a neutral pelvis and active trunk engagement.'
  ];

  if (category === 'activation' || category === 'warm_up_routine') {
    movementQualityFocus = [
      'Focus on raising muscle temperature and increasing neuromotor excitation without fatigue.',
      'Aktivasi/dynamic warm-up before running sessions: perform knee pull, ankle pull, lunge with reach, and march & reach.',
      'Maintain vertical spine alignment during dynamic walking drills.'
    ];
  } else if (category === 'mobility') {
    movementQualityFocus = [
      'Perform World\'s Greatest Stretch, 90/90 hip rotations, open-book thoracic rotations, and ankle dorsiflexion checks.',
      'Control range of motion dynamically; do not hold stretch statically.',
      'Keep your heel flat on the ground during ankle dorsiflexion drills.'
    ];
  } else if (category === 'lower_strength' || category === 'upper_strength') {
    movementQualityFocus = [
      'Consistent strength training (split squats, calf raises, RDLs, push-ups) improves running economy by 2-8% by optimizing motor unit recruitment.',
      'Maintain strict form control; do not compromise posture under load.',
      'Keep ribs stacked over the pelvis to prevent lower back hyperextension.'
    ];
  } else if (category === 'plyometric') {
    movementQualityFocus = [
      'Focus on rapid, elastic recoil and spring-like ground contact.',
      'Consistent plyometric training (bounding, jumps, hops done 2x/week for 4 weeks) enhances running economy and time-trial performance.',
      'Ensure landing alignment: keep knees tracking in line with toes, preventing valgus collapse.'
    ];
  } else if (category === 'running_drills') {
    movementQualityFocus = [
      'Running drills: A skips, B skips, high knees, carioca, ankling, and progressive strides.',
      'Perform on a flat track or grass surface to optimize landing mechanics and cadence.'
    ];
  } else if (category === 'injury_risk_reduction') {
    movementQualityFocus = [
      'Focus on strengthening calf and Achilles tendon load tolerance (elevated heel raises).',
      'Train tibialis posterior and intrinsic foot muscles for arch stabilization.',
      'Build gluteus medius strength to reduce IT band strain.'
    ];
  }

  const contraindications = [
    'Do not perform if experiencing acute joint swelling or sharp localized pain.',
    'Avoid high-load eccentric movements during active tendon irritation.'
  ];

  const substitutionsList = [
    'Glute bridges can replace single-leg hip lifts.',
    'Bodyweight squats can replace split squats.'
  ];

  const programContext = {
    bestUsedInPhase: ['base', 'build', 'specific'],
    sessionRole: 'supportive-conditioning',
    weeklyPlacement: ['monday', 'wednesday', 'friday'],
    recommendedBefore: ['easy-run'],
    recommendedAfter: ['rest-day'],
    avoidAfter: [],
    minimumRecoveryHours: 12
  };

  const athleteProfile = {
    experienceLevel: level,
    weeklyMileageRangeKm: { min: 15, max: 100 },
    suitableFor: ['all-runners', 'injury-prone-athletes'],
    notSuitableFor: ['acute-injury-recovery'],
    prerequisites: ['basic-bodyweight-squat-control']
  };

  const trainingPurpose = {
    primaryAdaptation: category === 'mobility' ? 'joint-mobility-restoration' : (category.includes('strength') ? 'muscular-strength-endurance' : 'neuromuscular-coordination'),
    secondaryAdaptations: ['muscular-durability', 'tendon-stiffness-support'],
    practicalUse: 'Improves running economy by correcting biomechanical weak links and building tissue capacity.',
    notFor: 'Not a clinical rehabilitation program.'
  };

  const readinessGate = {
    startIf: ['No sharp localized joint pain.', 'Normal joint range of motion.'],
    modifyIf: ['Mild muscle soreness from previous hard run.'],
    skipIf: ['Sharp pain that alters joint movement.', 'Numbness or nerve irritation.']
  };

  const environmentAdjustments = {
    track: 'Can be done on infield grass or track sidelines.',
    road: 'Can be done on flat sidewalk, park grass, or indoor room.',
    treadmill: 'Not applicable for strength, do on flat floor beside treadmill.',
    hotWeather: 'Perform in shade or air-conditioned room to manage sweat.',
    hills: 'Find a flat ground area for stable footing.'
  };

  const progressionOptions = {
    makeEasier: ['Reduce sets from 3 to 2.', 'Increase resting periods between exercises.'],
    makeHarder: ['Add resistance bands or light weights.', 'Increase the eccentric phase duration.'],
    doNotProgressIf: ['Joint pain arises during the exercise.', 'Correct movement control is lost.']
  };

  let riskLevel = 'low';
  let riskReasons = ['Local muscular fatigue.', 'Joint loading under repetitive reps.'];
  let saferAlternative = 'Perform bodyweight range-of-motion movements only.';

  if (category === 'plyometric') {
    riskLevel = level === 'advanced' ? 'high' : 'medium';
    riskReasons = ['High peak impact forces on joints and tendons.', 'Requires landing control.'];
    saferAlternative = 'Perform low-impact ankle pogos on grass instead of bounding or depth jumps.';
  } else if (category.includes('strength')) {
    riskLevel = 'medium';
    riskReasons = ['Muscular overload under resistance.', 'Spinal loading if form breaks down.'];
    saferAlternative = 'Reduce load and focus on strict bodyweight form.';
  }

  const riskProfile = {
    riskLevel,
    riskReasons,
    saferAlternative
  };

  const compatibleWith = {
    goodPairings: ['easy-run', 'post-run-mobility'],
    badPairings: ['hard-interval-session-immediately-after'],
    weeklyFrequency: `${minFreq}-${maxFreq}x/week`
  };

  const scenarioTags = ['no-equipment', 'home-strength', 'masters-runner-friendly'];
  if (category.includes('strength')) {
    scenarioTags.push('gym-available');
  }

  const timelineSegments = [
    { label: 'Work', phase: 'main', durationMin }
  ];

  const visualBlueprint = {
    timelineSegments,
    intensityCurve: ['easy', 'moderate', 'easy'],
    primaryStress: sessionFamily.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    repetitionMapType: 'circuit'
  };

  return {
    ...entry,
    sessionFamily,
    sessionSubType,
    placement,
    equipmentProfile,
    movementQualityFocus,
    contraindications,
    substitutions: substitutionsList,
    frequencyGuidance: `${minFreq}-${maxFreq} times per week`,
    programContext,
    athleteProfile,
    trainingPurpose,
    structurePattern: 'circuit-based',
    prescriptionStyle: 'circuit-based',
    executionCues: movementQualityFocus,
    commonMistakes: entry.commonMistakes || [
      'Rushing through repetitions instead of maintaining tension control.',
      'Holding breath under load.'
    ],
    readinessGate,
    environmentAdjustments,
    progressionOptions,
    riskProfile,
    compatibleWith,
    scenarioTags,
    visualBlueprint
  };
}

// -------------------------------------------------------------
// MAIN MIGRATION LOOP
// -------------------------------------------------------------
function migrate() {
  console.log('--- STARTING TRACK.VAULT UPGRADE ---');
  
  const runFiles = fs.readdirSync(RUN_DIR).filter(f => f.endsWith('.json'));
  const supFiles = fs.readdirSync(SUP_DIR).filter(f => f.endsWith('.json'));

  const allRunningWorkouts: any[] = [];
  const allSupportRoutines: any[] = [];

  // Migrate running workouts
  console.log('Migrating running workouts...');
  for (const file of runFiles) {
    const filePath = path.join(RUN_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const enrichedData = data.map((entry: any) => enrichRunningWorkout(entry));
    
    // Write back in place
    fs.writeFileSync(filePath, JSON.stringify(enrichedData, null, 2), 'utf8');
    allRunningWorkouts.push(...enrichedData);
  }
  console.log(`Running workouts: upgraded in place. Total count: ${allRunningWorkouts.length}`);

  // Migrate support routines
  console.log('Migrating support routines...');
  for (const file of supFiles) {
    const filePath = path.join(SUP_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const enrichedData = data.map((entry: any) => enrichSupportRoutine(entry));
    
    // Write back in place
    fs.writeFileSync(filePath, JSON.stringify(enrichedData, null, 2), 'utf8');
    allSupportRoutines.push(...enrichedData);
  }
  console.log(`Support routines: upgraded in place. Total count: ${allSupportRoutines.length}`);

  // Compile output files
  console.log('Compiling consolidated libraries...');
  
  // Sort entries by ID to ensure consistency and stability
  allRunningWorkouts.sort((a, b) => a.id.localeCompare(b.id));
  allSupportRoutines.sort((a, b) => a.id.localeCompare(b.id));

  // 1. runningWorkoutLibrary.all.v1.2.json
  fs.writeFileSync(
    path.join(GEN_DIR, 'runningWorkoutLibrary.all.v1.2.json'),
    JSON.stringify(allRunningWorkouts, null, 2),
    'utf8'
  );

  // 2. supportRoutineLibrary.all.v1.2.json
  fs.writeFileSync(
    path.join(GEN_DIR, 'supportRoutineLibrary.all.v1.2.json'),
    JSON.stringify(allSupportRoutines, null, 2),
    'utf8'
  );

  // 3. trackVaultLibrary.full.v1.2.json
  const fullLibrary = {
    libraryMeta: {
      version: "1.2",
      releaseDate: new Date().toISOString().split('T')[0],
      license: "Track.Vault Curated Workout static Library",
      totalCuratedEntries: allRunningWorkouts.length + allSupportRoutines.length,
      runningWorkoutsCount: allRunningWorkouts.length,
      supportRoutinesCount: allSupportRoutines.length
    },
    runningWorkouts: allRunningWorkouts,
    supportRoutines: allSupportRoutines,
    allEntries: [...allRunningWorkouts, ...allSupportRoutines]
  };

  fs.writeFileSync(
    path.join(GEN_DIR, 'trackVaultLibrary.full.v1.2.json'),
    JSON.stringify(fullLibrary, null, 2),
    'utf8'
  );
  
  console.log('Upgrade and Compilation Successful!');
}

migrate();
