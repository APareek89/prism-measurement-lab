const METRIC_WEIGHTS = Object.freeze({
  delivery: 0.45,
  quality: 0.35,
  collaboration: 0.2,
});

function clamp(value) {
  return Math.max(0, Math.min(100, Number(value)));
}

function round(value, places = 4) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

/** Return the operands and weighted contributions behind the health score. */
export function explainHealthScore(metrics) {
  const available = Object.entries(METRIC_WEIGHTS)
    .filter(([key]) => Number.isFinite(metrics[key]));
  const availableWeight = available.reduce((total, [, weight]) => total + weight, 0);

  if (availableWeight === 0) {
    return {
      availableWeight: 0,
      terms: [],
      score: null,
      equation: 'No supported metrics → score = null',
    };
  }

  const terms = available.map(([metric, configuredWeight]) => {
    const raw = clamp(metrics[metric]);
    const effectiveWeight = configuredWeight / availableWeight;
    return {
      metric,
      raw,
      configuredWeight,
      effectiveWeight: round(effectiveWeight),
      contribution: round(raw * effectiveWeight),
    };
  });
  const score = round(terms.reduce((total, term) => total + term.contribution, 0), 2);
  const numerator = terms
    .map((term) => `${term.raw} × ${term.configuredWeight}`)
    .join(' + ');

  return {
    availableWeight: round(availableWeight),
    terms,
    score,
    equation: `(${numerator}) ÷ ${round(availableWeight)} = ${score}`,
  };
}

/**
 * Combine available delivery-health metrics without penalizing a missing source.
 * The remaining weights are renormalized, mirroring a common evidence-product pattern.
 */
export function calculateHealthScore(metrics) {
  return explainHealthScore(metrics).score;
}

export function healthBand(score) {
  if (score === null) return 'insufficient';
  if (score >= 80) return 'healthy';
  if (score >= 60) return 'watch';
  return 'at risk';
}
