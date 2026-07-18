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
    calculation: {
      availableWeight: 1,
      terms: [
        { metric: 'delivery', raw: 90, configuredWeight: 0.45, effectiveWeight: 0.45, contribution: 40.5 },
        { metric: 'quality', raw: 70, configuredWeight: 0.35, effectiveWeight: 0.35, contribution: 24.5 },
        { metric: 'collaboration', raw: 80, configuredWeight: 0.2, effectiveWeight: 0.2, contribution: 16 },
      ],
      score: 81,
      equation: '(90 × 0.45 + 70 × 0.35 + 80 × 0.2) ÷ 1 = 81',
    },
    evidence: {
      availableMetrics: ['delivery', 'quality', 'collaboration'],
      occurrences: 2,
      mitigationRecorded: false,
    },
  });
});

test('does not claim an unsupported metric contributed evidence', () => {
  const report = buildHealthReport({
    metrics: { delivery: 75, queueLatency: 99 },
    riskEvidence: { severity: 'low', occurrences: 0, hasMitigation: false },
    measuredAt: '2026-07-18T11:00:00.000Z',
  });

  assert.deepEqual(report.evidence.availableMetrics, ['delivery']);
});
