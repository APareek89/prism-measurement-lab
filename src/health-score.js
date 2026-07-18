const METRIC_WEIGHTS = Object.freeze({
  delivery: 0.45,
  quality: 0.35,
  collaboration: 0.2,
});

function clamp(value) {
  return Math.max(0, Math.min(100, Number(value)));
}

/**
 * Combine available delivery-health metrics without penalizing a missing source.
 * The remaining weights are renormalized, mirroring a common evidence-product pattern.
 */
export function calculateHealthScore(metrics) {
  const available = Object.entries(METRIC_WEIGHTS)
    .filter(([key]) => Number.isFinite(metrics[key]));

  if (available.length === 0) return null;

  const availableWeight = available.reduce((total, [, weight]) => total + weight, 0);
  const score = available.reduce(
    (total, [key, weight]) => total + clamp(metrics[key]) * (weight / availableWeight),
    0,
  );

  return Math.round(score * 100) / 100;
}

export function healthBand(score) {
  if (score === null) return 'insufficient';
  if (score >= 80) return 'healthy';
  if (score >= 60) return 'watch';
  return 'at risk';
}

