import axios from 'axios';

import { apiErrorBodySchema, type ApiErrorCode } from '@/contracts';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number | null;
  readonly fields: Record<string, string> | undefined;
  readonly body: unknown;

  constructor(
    code: ApiErrorCode,
    message: string,
    status: number | null,
    fields?: Record<string, string>,
    body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.fields = fields;
    this.body = body;
  }
}

export const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  VALIDATION: 'Verifique os campos informados.',
  EMAIL_TAKEN: 'Este e-mail já está cadastrado.',
  USERNAME_TAKEN: 'Este nome de usuário já existe.',
  INVALID_CREDENTIALS: 'E-mail ou senha incorretos.',
  TOO_MANY_ATTEMPTS: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  SESSION_EXPIRED: 'Sua sessão expirou. Entre novamente para continuar.',
  UNAUTHENTICATED: 'Entre na sua conta para continuar.',
  FORBIDDEN: 'Você não tem acesso a este recurso.',
  NOT_FOUND: 'Não encontramos o que você procura.',
  UNAVAILABLE: 'Quantidade indisponível para este NFT.',
  COUPON_INVALID: 'Cupom inválido.',
  COUPON_EXPIRED: 'Este cupom expirou.',
  QUOTE_STALE: 'A cotação mudou. Revise os valores antes de confirmar.',
  IDEMPOTENCY_CONFLICT: 'Este pedido já foi enviado com outros dados.',
  WALLET_REJECTED: 'A carteira recusou a operação.',
  WALLET_DISCONNECTED: 'A carteira foi desconectada. Conecte novamente.',
  INVALID_IMAGE: 'Envie uma imagem PNG, JPEG ou WebP de até 2 MB.',
  WRONG_PASSWORD: 'Senha atual incorreta.',
  TRANSIENT: 'Falha temporária. Tente novamente.',
  NETWORK_ERROR: 'Sem conexão. Verifique sua internet e tente de novo.',
  TIMEOUT: 'A operação demorou demais. Tente novamente.',
  UNKNOWN: 'Algo deu errado. Tente novamente.',
};

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

const TIMEOUT_CODES = new Set(['ECONNABORTED', 'ETIMEDOUT']);

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;
  if (axios.isAxiosError(error)) {
    const parsed = apiErrorBodySchema.safeParse(error.response?.data);
    if (parsed.success) {
      const { code, message, fields } = parsed.data.error;
      return new ApiError(
        code,
        message,
        error.response?.status ?? null,
        fields,
        error.response?.data,
      );
    }
    if (error.code && TIMEOUT_CODES.has(error.code)) {
      return new ApiError('TIMEOUT', ERROR_MESSAGES.TIMEOUT, null);
    }
    if (!error.response) {
      return new ApiError('NETWORK_ERROR', ERROR_MESSAGES.NETWORK_ERROR, null);
    }
    return new ApiError('UNKNOWN', ERROR_MESSAGES.UNKNOWN, error.response.status);
  }
  return new ApiError('UNKNOWN', ERROR_MESSAGES.UNKNOWN, null);
}

export function errorMessage(error: unknown): string {
  return ERROR_MESSAGES[toApiError(error).code];
}
