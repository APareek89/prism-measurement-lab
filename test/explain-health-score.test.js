import test from 'node:test';
import assert from 'node:assert/strict';
import { explainHealthScore } from '../src/health-score.js';

test('explains the exact renormalized weight arithmetic', () => {
  assert.deepEqual(explainHealthScore({ delivery: 80, quality: 60 }), {
    availableWeight: 0.8,
    terms: [
      { metric: 'delivery', raw: 80, configuredWeight: 0.45, effectiveWeight: 0.5625, contribution: 45 },
      { metric: 'quality', raw: 60, configuredWeight: 0.35, effectiveWeight: 0.4375, contribution: 26.25 },
    ],
    score: 71.25,
    equation: '(80 × 0.45 + 60 × 0.35) ÷ 0.8 = 71.25',
  });
});

test('returns an honest no-signal explanation', () => {
  assert.deepEqual(explainHealthScore({}), {
    availableWeight: 0,
    terms: [],
    score: null,
    equation: 'No supported metrics → score = null',
  });
});
