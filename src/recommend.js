import { healthBand } from './health-score.js';

const ACTIONS = Object.freeze({
  critical: 'Stop the line: assign an owner and verify the highest-severity failure.',
  elevated: 'Schedule a focused fix and define the evidence that will close the risk.',
  observed: 'Monitor the next delivery and confirm the mitigation is working.',
  clear: 'Keep the current safeguards and review the trend after the next delivery.',
});

/** Return one course-correction action grounded in the supplied health and risk result. */
export function recommendNextAction({ score, risk }) {
  if (!(risk in ACTIONS)) throw new TypeError('Unknown risk classification.');

  const band = healthBand(score);
  if (band === 'insufficient') {
    return 'Connect enough delivery evidence before drawing a performance conclusion.';
  }
  if (band === 'at risk' && risk === 'clear') {
    return 'Inspect which health input is pulling the score down before changing the process.';
  }
  return ACTIONS[risk];
}

