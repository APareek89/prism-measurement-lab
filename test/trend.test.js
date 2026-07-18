import test from 'node:test';
import assert from 'node:assert/strict';
import { compareHealthReports } from '../src/trend.js';

test('reports score movement and evidence coverage changes together', () => {
  const previous = { score: 68, evidence: { availableMetrics: ['delivery', 'quality'] } };
  const current = { score: 74.5, evidence: { availableMetrics: ['delivery', 'collaboration'] } };

  assert.deepEqual(compareHealthReports(current, previous), {
    scoreDelta: 6.5,
    direction: 'improved',
    evidenceChange: { added: ['collaboration'], removed: ['quality'] },
    summary: 'Health improved by 6.5 points.',
  });
});

test('refuses to claim a trend when either report has no score', () => {
  const result = compareHealthReports(
    { score: 70, evidence: { availableMetrics: ['delivery'] } },
    { score: null, evidence: { availableMetrics: [] } },
  );

  assert.equal(result.scoreDelta, null);
  assert.equal(result.direction, 'insufficient');
  assert.match(result.summary, /no performance trend is claimed/i);
});
