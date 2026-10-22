import { z } from 'zod';

export const ETH_AMOUNT_PATTERN = /^\d+(\.\d{1,6})?$/;

export const ethAmountSchema = z
  .string()
  .regex(ETH_AMOUNT_PATTERN, 'Valor em ETH inválido (até 6 casas decimais)');

export type EthAmount = z.infer<typeof ethAmountSchema>;
