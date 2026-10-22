import { z } from 'zod';

export const errorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    fields: z.record(z.string(), z.string()).optional(),
  }),
});

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly fields: Record<string, string> | undefined;
  constructor(code: string, status: number, fields?: Record<string, string>) {
    super(code);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}
const messages: Record<string, string> = {
  INVALID_CREDENTIALS: 'E-mail ou senha incorretos.',
  TOO_MANY_ATTEMPTS: 'Muitas tentativas. Aguarde cinco minutos.',
  EMAIL_TAKEN: 'Este e-mail já está cadastrado.',
  USERNAME_TAKEN: 'Este nome de usuário já está em uso.',
  UNAUTHENTICATED: 'Entre na sua conta para continuar.',
  SESSION_EXPIRED: 'Sua sessão expirou. Entre novamente.',
  FORBIDDEN: 'Você não tem permissão para acessar este recurso.',
  NOT_FOUND: 'Não encontramos este recurso.',
  UNAVAILABLE: 'A quantidade solicitada não está disponível. Atualize seu carrinho.',
  COUPON_INVALID: 'Cupom inválido.',
  COUPON_EXPIRED: 'Este cupom expirou.',
  QUOTE_STALE: 'Os valores mudaram. Revise a nova cotação antes de confirmar.',
  WALLET_REJECTED: 'Conexão recusada. Tente conectar sua carteira novamente.',
  WALLET_DISCONNECTED: 'A carteira foi desconectada. Conecte novamente.',
  IDEMPOTENCY_CONFLICT: 'Esta tentativa já foi usada com outros dados. Revise o pedido.',
  WRONG_PASSWORD: 'Senha atual incorreta.',
  INVALID_IMAGE: 'Escolha uma imagem PNG, JPEG ou WebP válida de até 2 MB.',
  NETWORK: 'Falha de conexão. Verifique sua rede e tente novamente.',
  TIMEOUT: 'A resposta demorou. Tente novamente para recuperar a mesma compra.',
  VALIDATION: 'Confira os campos e tente novamente.',
  TRANSIENT: 'O serviço está indisponível. Tente novamente.',
};
export function errorMessage(error: unknown): string {
  return error instanceof ApiError
    ? (messages[error.code] ?? 'Não foi possível concluir. Tente novamente.')
    : 'Não foi possível concluir. Tente novamente.';
}
