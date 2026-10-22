import { HttpResponse } from 'msw';

export class MockError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields: Record<string, string> | undefined;

  constructor(status: number, code: string, fields?: Record<string, string>) {
    super(code);
    this.name = 'MockError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export function respondError(
  status: number,
  code: string,
  message = code,
  fields?: Record<string, string>,
) {
  return HttpResponse.json({ error: { code, message, ...(fields ? { fields } : {}) } }, { status });
}
