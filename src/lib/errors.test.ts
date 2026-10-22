import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { describe, expect, it } from 'vitest';

import { ApiError, errorMessage, isApiError, toApiError } from './errors';

const config = { headers: new AxiosHeaders() } as InternalAxiosRequestConfig;

function axiosError(partial: Partial<AxiosError>): AxiosError {
  const error = new AxiosError('falha', partial.code, config, undefined, partial.response);
  return Object.assign(error, partial);
}

describe('toApiError', () => {
  it('lê o envelope de erro da API', () => {
    const error = toApiError(
      axiosError({
        response: {
          status: 409,
          data: { error: { code: 'EMAIL_TAKEN', message: 'Já existe', fields: { email: 'x' } } },
          statusText: '',
          headers: {},
          config,
        },
      }),
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ code: 'EMAIL_TAKEN', status: 409, fields: { email: 'x' } });
  });

  it('classifica timeout e falha de rede', () => {
    expect(toApiError(axiosError({ code: 'ECONNABORTED' })).code).toBe('TIMEOUT');
    expect(toApiError(axiosError({ code: 'ERR_NETWORK' })).code).toBe('NETWORK_ERROR');
  });

  it('cai em UNKNOWN para erros arbitrários e mantém ApiError intacto', () => {
    const unknown = toApiError(new Error('boom'));
    const existing = new ApiError('FORBIDDEN', 'sem acesso', 403);

    expect(unknown.code).toBe('UNKNOWN');
    expect(toApiError(existing)).toBe(existing);
    expect(isApiError(existing)).toBe(true);
  });

  it('traduz o código para uma mensagem em português', () => {
    expect(errorMessage(new ApiError('SESSION_EXPIRED', 'x', 401))).toBe(
      'Sua sessão expirou. Entre novamente para continuar.',
    );
    expect(errorMessage(new Error('qualquer'))).toBe('Algo deu errado. Tente novamente.');
  });
});
