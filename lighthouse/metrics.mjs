const categories = {
  performance: 'performance',
  accessibility: 'accessibility',
  'best-practices': 'bestPractices',
  seo: 'seo',
};
function median(values) {
  if (values.length !== 3 || values.some((value) => !Number.isFinite(value) || value < 0))
    throw new Error('Esperadas três métricas válidas.');
  return values.toSorted((first, second) => first - second)[1];
}
export function summarize(profile, page, reports) {
  if (reports.length !== 3 || reports.some((report) => report.runtimeError))
    throw new Error(`Coleta incompleta ou erro em ${profile}/${page}.`);
  const category = (name) => median(reports.map((report) => report.categories[name].score * 100));
  const metric = (name) => median(reports.map((report) => report.audits[name].numericValue));
  return {
    profile,
    page,
    runs: reports.length,
    ...Object.fromEntries(Object.entries(categories).map(([name, key]) => [key, category(name)])),
    lcpMs: metric('largest-contentful-paint'),
    cls: metric('cumulative-layout-shift'),
    tbtMs: metric('total-blocking-time'),
    browser: reports[0].environment.hostUserAgent,
  };
}
export function assertThresholds(rows, assertions) {
  const failures = [];
  for (const [name, [level, rule]] of Object.entries(assertions)) {
    const category = name.replace('categories:', '');
    const key = categories[category];
    if (!key || level !== 'error' || rule.aggregationMethod !== 'median')
      throw new Error(`Assertion não suportada: ${name}`);
    for (const row of rows)
      if (!Number.isFinite(row[key]) || row[key] < rule.minScore * 100)
        failures.push(
          `${row.profile}/${row.page}: ${category} ${row[key]} < ${rule.minScore * 100}`,
        );
  }
  return failures;
}
