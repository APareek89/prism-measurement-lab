import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeEvidenceCoverage } from '../src/report.js';

test('labels a report ready when every supported evidence source has a metric state', () => {
  const report = {
    evidence: {
      availableMetrics: ['delivery', 'quality', 'collaboration'],
    },
    calculation: {
      terms: [
        { metric: 'delivery', raw: 88 },
        { metric: 'quality', raw: 76 },
        { metric: 'collaboration', raw: 91 },
      ],
    },
  };

  assert.deepEqual(summarizeEvidenceCoverage(report), {
    available: 3,
    insufficient: 0,
    missing: 0,
    readiness: 'ready',
  });
});

test('labels mixed evidence coverage partial', () => {
  const report = {
    evidence: {
      availableMetrics: ['delivery', 'quality'],
    },
    calculation: {
      terms: [{ metric: 'delivery', raw: 72 }],
    },
  };

  assert.deepEqual(summarizeEvidenceCoverage(report), {
    available: 1,
    insufficient: 1,
    missing: 1,
    readiness: 'partial',
  });
});

test('labels a report with no evidence empty', () => {
  assert.deepEqual(summarizeEvidenceCoverage({}), {
    available: 0,
    insufficient: 0,
    missing: 3,
    readiness: 'empty',
  });
});
