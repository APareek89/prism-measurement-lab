function metricSet(report) {
  return new Set(report?.evidence?.availableMetrics ?? []);
}

function difference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort();
}

/** Compare two completed reports without inferring a trend from missing scores. */
export function compareHealthReports(current, previous) {
  const currentMetrics = metricSet(current);
  const previousMetrics = metricSet(previous);
  const evidenceChange = {
    added: difference(currentMetrics, previousMetrics),
    removed: difference(previousMetrics, currentMetrics),
  };

  if (!Number.isFinite(current?.score) || !Number.isFinite(previous?.score)) {
    return {
      scoreDelta: null,
      direction: 'insufficient',
      evidenceChange,
      summary: 'A score is missing, so no performance trend is claimed.',
    };
  }

  const scoreDelta = Math.round((current.score - previous.score) * 100) / 100;
  const direction = scoreDelta > 0 ? 'improved' : scoreDelta < 0 ? 'declined' : 'stable';
  return {
    scoreDelta,
    direction,
    evidenceChange,
    summary: `Health ${direction} by ${Math.abs(scoreDelta)} points.`,
  };
}
