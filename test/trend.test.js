import test from 'node:test';
import assert from 'node:assert/strict';
import { compareHealthReports, formatTrendMarkdown } from '../src/trend.js';

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

test('renders a scored comparison with direction, delta, and evidence changes', () => {
  const comparison = compareHealthReports(
    { score: 74.5, evidence: { availableMetrics: ['delivery', 'collaboration'] } },
    { score: 68, evidence: { availableMetrics: ['delivery', 'quality'] } },
  );

  assert.equal(
    formatTrendMarkdown(comparison),
    [
      '### Health trend',
      '',
      '- Direction: improved',
      '- Score delta: +6.5 points',
      '- Evidence added: collaboration',
      '- Evidence removed: quality',
    ].join('\n'),
  );
});

test('omits an unavailable score delta and names empty evidence changes', () => {
  const comparison = compareHealthReports(
    { score: null, evidence: { availableMetrics: ['delivery'] } },
    { score: 68, evidence: { availableMetrics: ['delivery'] } },
  );
  const markdown = formatTrendMarkdown(comparison);

  assert.equal(
    markdown,
    [
      '### Health trend',
      '',
      '- Direction: insufficient',
      '- Evidence added: none',
      '- Evidence removed: none',
    ].join('\n'),
  );
  assert.doesNotMatch(markdown, /score delta/i);
});

test('renders a zero score delta when the trend is stable', () => {
  const comparison = compareHealthReports(
    { score: 70, evidence: { availableMetrics: [] } },
    { score: 70, evidence: { availableMetrics: [] } },
  );

  assert.match(formatTrendMarkdown(comparison), /- Score delta: 0 points/);
});
