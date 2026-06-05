import * as fs from 'fs';
import * as path from 'path';

const WORKSPACE_DIR = path.join(process.cwd(), 'TRACK.VAULT');
const RUN_DIR = path.join(WORKSPACE_DIR, 'final', 'run workouts');
const SUP_DIR = path.join(WORKSPACE_DIR, 'final', 'support routines');

const telemetryGimmicks = [
  'calories', 'vo2max score', 'readiness', 'strain', 'telemetry',
  'medical rehab', 'elite intelligence', 'system optimal', 'tss score'
];

function checkTelemetry() {
  const runFiles = fs.readdirSync(RUN_DIR).filter(f => f.endsWith('.json'));
  const supFiles = fs.readdirSync(SUP_DIR).filter(f => f.endsWith('.json'));

  const matches: Record<string, number> = {};

  function scan(entry: any) {
    const jsonStr = JSON.stringify(entry).toLowerCase();
    telemetryGimmicks.forEach(word => {
      if (jsonStr.includes(word)) {
        matches[word] = (matches[word] || 0) + 1;
      }
    });
  }

  for (const file of runFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(RUN_DIR, file), 'utf8'));
    data.forEach(scan);
  }
  for (const file of supFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(SUP_DIR, file), 'utf8'));
    data.forEach(scan);
  }

  console.log('--- TELEMETRY WORD MATCHES ---');
  console.log(matches);
}

checkTelemetry();
