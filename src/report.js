import { explainHealthScore, healthBand } from './health-score.js';
import { classifyRisk } from './risk.js';
import { recommendNextAction } from './recommend.js';

const SUPPORTED_METRICS = new Set(['delivery', 'quality', 'collaboration']);

/** Summarize whether a report has enough consistent evidence to be considered ready. */
export function summarizeEvidenceCoverage(report) {
  const evidenceSources = new Set(
    Array.isArray(report?.evidence?.availableMetrics)
      ? report.evidence.availableMetrics.filter((metric) => SUPPORTED_METRICS.has(metric))
      : [],
  );
  const metricTerms = Array.isArray(report?.calculation?.terms)
    ? report.calculation.terms
    : [];
  const counts = {
    available: 0,
    insufficient: 0,
    missing: 0,
  };

  for (const metric of SUPPORTED_METRICS) {
    const hasEvidenceSource = evidenceSources.has(metric);
    const hasMetricState = metricTerms.some((term) => term?.metric === metric);
    const hasAvailableMetricState = metricTerms.some(
      (term) => term?.metric === metric && Number.isFinite(term.raw),
    );

    if (hasEvidenceSource && hasAvailableMetricState) {
      counts.available += 1;
    } else if (hasEvidenceSource || hasMetricState) {
      counts.insufficient += 1;
    } else {
      counts.missing += 1;
    }
  }

  const readiness = counts.available === SUPPORTED_METRICS.size
    ? 'ready'
    : counts.missing === SUPPORTED_METRICS.size
      ? 'empty'
      : 'partial';

  return { ...counts, readiness };
}

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
