#!/usr/bin/env node

import { buildHealthReport } from '../src/report.js';

export function parseInput(raw) {
  if (!raw) throw new TypeError('Pass one JSON object containing metrics and riskEvidence.');
  const input = JSON.parse(raw);
  return {
    metrics: input.metrics ?? {},
    riskEvidence: input.riskEvidence,
    measuredAt: input.measuredAt ?? new Date().toISOString(),
  };
}

export function run(argv = process.argv.slice(2)) {
  return buildHealthReport(parseInput(argv[0]));
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  process.stdout.write(`${JSON.stringify(run(), null, 2)}\n`);
}

