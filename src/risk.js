const SEVERITY = Object.freeze({ low: 1, medium: 2, high: 3 });

/** Rank an observable delivery risk without inventing a probability. */
export function classifyRisk({ severity, occurrences, hasMitigation }) {
  const severityValue = SEVERITY[severity];
  if (!severityValue || !Number.isInteger(occurrences) || occurrences < 0) {
    throw new TypeError('Risk needs a valid severity and a non-negative occurrence count.');
  }

  const exposure = severityValue * Math.min(occurrences, 5);
  const adjusted = hasMitigation ? Math.max(0, exposure - 2) : exposure;

  if (adjusted >= 10) return 'critical';
  if (adjusted >= 5) return 'elevated';
  if (adjusted > 0) return 'observed';
  return 'clear';
}

