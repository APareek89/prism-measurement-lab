import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHealthScore, healthBand } from '../src/health-score.js';

test('calculates a weighted score when all evidence is present', () => {
  assert.equal(calculateHealthScore({ delivery: 90, quality: 70, collaboration: 80 }), 81);
});

test('renormalizes weights when one evidence source is unavailable', () => {
  assert.equal(calculateHealthScore({ delivery: 80, collaboration: 60 }), 73.85);
});

test('returns insufficient when no metric can vote', () => {
  assert.equal(calculateHealthScore({}), null);
  assert.equal(healthBand(null), 'insufficient');
});

test('assigns human-readable bands at the boundaries', () => {
  assert.equal(healthBand(80), 'healthy');
  assert.equal(healthBand(60), 'watch');
  assert.equal(healthBand(59.99), 'at risk');
});

