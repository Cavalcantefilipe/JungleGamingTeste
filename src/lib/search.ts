export function parseSearch(search: string): Record<string, unknown> {
  const params = new URLSearchParams(search);
  return Object.fromEntries(
    [...new Set(params.keys())].map((key) => {
      const values = params.getAll(key);
      return [
        key,
        key === 'category' || key === 'network' || values.length > 1 ? values : values[0],
      ];
    }),
  );
}
export function stringifySearch(search: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (
      value === undefined ||
      value === '' ||
      value === false ||
      (key === 'page' && value === 1) ||
      (key === 'pageSize' && value === 9) ||
      (key === 'sort' && value === 'recent') ||
      (key === 'tab' && value === 'all')
    )
      continue;
    for (const item of Array.isArray(value) ? (value as unknown[]) : [value]) {
      if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean')
        params.append(key, String(item));
    }
  }
  const result = params.toString();
  return result ? `?${result}` : '';
}
