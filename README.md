# Prism Measurement Lab

A small, real repository used to observe how normal engineering work becomes Prism evidence.
The project will grow through reviewable pull requests so the Admin calculation trace can show
commits, delivery outcomes, AI co-author evidence, and later coding-agent session links.

The lab itself produces a delivery-health report from explicit inputs. It has no seeded users,
generated activity, or synthetic Prism database rows.

Every report includes a calculation ledger: the supported raw metrics, configured and
renormalized weights, per-metric contribution, and the exact weighted-mean equation. A missing
metric is removed from both numerator and denominator instead of silently voting as zero.

`compareHealthReports` reports score movement together with evidence sources added or removed.
If either score is missing, it returns `insufficient` instead of inventing a trend.

`formatTrendMarkdown` renders that comparison for a pull request, issue, or status update:

```js
import { compareHealthReports, formatTrendMarkdown } from './src/trend.js';

const comparison = compareHealthReports(currentReport, previousReport);
const markdown = formatTrendMarkdown(comparison);
```

```md
### Health trend

- Direction: improved
- Score delta: +6.5 points
- Evidence added: collaboration
- Evidence removed: quality
```

When a comparison has no score delta, the renderer omits that line and still reports evidence
changes, using `none` when no sources were added or removed.

`summarizeEvidenceCoverage` checks the three supported metrics against both the report's declared
evidence sources and its calculation terms:

```js
import { summarizeEvidenceCoverage } from './src/report.js';

const coverage = summarizeEvidenceCoverage(report);
// { available: 2, insufficient: 0, missing: 1, readiness: 'partial' }
```

A metric is `available` when its evidence source and a finite calculation term are both present,
`insufficient` when only one is present, and `missing` when neither is present. Readiness is
`ready` when all three metrics are available, `empty` when the report has no supported evidence,
and `partial` otherwise.

## Run

```sh
npm test
```

## Measurement rules

- Work lands through pull requests.
- AI-assisted commits carry a `Co-authored-by` trailer.
- Tests describe the behavior expected from each change.
- Prism ingests the resulting GitHub records through the installed GitHub App.
