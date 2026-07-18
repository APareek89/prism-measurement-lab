import test from 'node:test';
import assert from 'node:assert/strict';
import { recommendNextAction } from '../src/recommend.js';

test('prioritizes evidence collection when the score is unavailable', () => {
  assert.match(recommendNextAction({ score: null, risk: 'clear' }), /Connect enough/);
});

test('does not invent a risk when health is low but observed risk is clear', () => {
  assert.match(recommendNextAction({ score: 45, risk: 'clear' }), /Inspect which health input/);
});

test('returns a concrete critical-risk action', () => {
  assert.match(recommendNextAction({ score: 72, risk: 'critical' }), /Stop the line/);
});

test('rejects an unknown classification', () => {
  assert.throws(() => recommendNextAction({ score: 72, risk: 'mystery' }), /Unknown risk/);
});

