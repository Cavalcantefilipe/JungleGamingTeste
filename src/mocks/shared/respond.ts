import { HttpResponse } from 'msw';

import type { ApiErrorBody, ApiErrorCode } from '@/contracts';
import type { z } from 'zod';

export interface ErrorDetails {
  code: ApiErrorCode;
  message: string;
  fields?: Record<string, string>;
}

export type MockResult<T> =
  { ok: true; value: T } | { ok: false; error: ErrorDetails; status: number };

export type MockFailure = Extract<MockResult<never>, { ok: false }>;

export function failure(status: number, error: ErrorDetails): MockFailure {
  return { ok: false, error, status };
}

export function respondError(
  status: number,
  code: ApiErrorCode,
  message: string,
  fields?: Record<string, string>,
): HttpResponse<ApiErrorBody> {
  return HttpResponse.json<ApiErrorBody>(
    { error: fields ? { code, message, fields } : { code, message } },
    { status },
  );
}

export function respondFailure(result: { error: ErrorDetails; status: number }) {
  return respondError(result.status, result.error.code, result.error.message, result.error.fields);
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  return Object.fromEntries(
    error.issues.map((issue) => [issue.path.join('.') || '_', issue.message]),
  );
}

export async function readJsonBody<TSchema extends z.ZodType>(
  request: Request,
  schema: TSchema,
): Promise<MockResult<z.infer<TSchema>>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return failure(400, { code: 'VALIDATION', message: 'Corpo da requisição inválido' });
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return failure(422, {
      code: 'VALIDATION',
      message: 'Verifique os campos informados',
      fields: fieldErrors(parsed.error),
    });
  }
  return { ok: true, value: parsed.data };
}
