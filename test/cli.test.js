import test from 'node:test';
import assert from 'node:assert/strict';
import { parseInput, run } from '../bin/health-report.js';

test('parses explicit JSON input without adding hidden evidence', () => {
  const input = parseInput(JSON.stringify({
    metrics: { delivery: 82 },
    riskEvidence: { severity: 'low', occurrences: 1, hasMitigation: true },
    measuredAt: '2026-07-18T12:00:00.000Z',
  }));

  assert.deepEqual(input.metrics, { delivery: 82 });
  assert.equal(input.measuredAt, '2026-07-18T12:00:00.000Z');
});

test('runs the same report pipeline exposed by the library', () => {
  const report = run([JSON.stringify({
    metrics: { delivery: 82 },
    riskEvidence: { severity: 'low', occurrences: 1, hasMitigation: true },
    measuredAt: '2026-07-18T12:00:00.000Z',
  })]);

  assert.equal(report.score, 82);
  assert.equal(report.band, 'healthy');
  assert.deepEqual(report.evidence.availableMetrics, ['delivery']);
});

