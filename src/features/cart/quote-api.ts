import { quoteSchema, type QuoteInput } from '@/contracts';
import { http, parseWith } from '@/lib/http';

export const quoteApi = {
  create: (input: QuoteInput, signal?: AbortSignal) =>
    http.post('/quote', input, signal ? { signal } : {}).then(parseWith(quoteSchema)),
};
