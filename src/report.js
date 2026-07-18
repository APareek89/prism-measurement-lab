import { explainHealthScore, healthBand } from './health-score.js';
import { classifyRisk } from './risk.js';
import { recommendNextAction } from './recommend.js';

const SUPPORTED_METRICS = new Set(['delivery', 'quality', 'collaboration']);

/** Build a serializable report while preserving the evidence supplied by the caller. */
export function buildHealthReport({ metrics, riskEvidence, measuredAt }) {
  const calculation = explainHealthScore(metrics);
  const score = calculation.score;
  const risk = classifyRisk(riskEvidence);

  return {
    measuredAt,
    score,
    band: healthBand(score),
    risk,
    nextAction: recommendNextAction({ score, risk }),
    calculation,
    evidence: {
      availableMetrics: Object.keys(metrics).filter(
        (key) => SUPPORTED_METRICS.has(key) && Number.isFinite(metrics[key]),
      ),
      occurrences: riskEvidence.occurrences,
      mitigationRecorded: Boolean(riskEvidence.hasMitigation),
    },
  };
}
