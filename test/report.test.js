import test from 'node:test';
import assert from 'node:assert/strict';
import { buildHealthReport } from '../src/report.js';

test('builds a report with an auditable evidence summary', () => {
  const report = buildHealthReport({
    metrics: { delivery: 90, quality: 70, collaboration: 80 },
    riskEvidence: { severity: 'medium', occurrences: 2, hasMitigation: false },
    measuredAt: '2026-07-18T10:00:00.000Z',
  });

  assert.deepEqual(report, {
    measuredAt: '2026-07-18T10:00:00.000Z',
    score: 81,
    band: 'healthy',
    risk: 'observed',
    nextAction: 'Monitor the next delivery and confirm the mitigation is working.',
    evidence: {
      availableMetrics: ['delivery', 'quality', 'collaboration'],
      occurrences: 2,
      mitigationRecorded: false,
    },
  });
});

