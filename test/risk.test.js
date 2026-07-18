import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyRisk } from '../src/risk.js';

test('surfaces repeated high-severity evidence as critical', () => {
  assert.equal(classifyRisk({ severity: 'high', occurrences: 4, hasMitigation: false }), 'critical');
});

test('accounts for an existing mitigation without erasing the evidence', () => {
  assert.equal(classifyRisk({ severity: 'medium', occurrences: 3, hasMitigation: true }), 'observed');
});

test('keeps zero occurrences clear', () => {
  assert.equal(classifyRisk({ severity: 'low', occurrences: 0, hasMitigation: false }), 'clear');
});

test('rejects malformed risk evidence', () => {
  assert.throws(
    () => classifyRisk({ severity: 'unknown', occurrences: -1, hasMitigation: false }),
    /valid severity/,
  );
});

