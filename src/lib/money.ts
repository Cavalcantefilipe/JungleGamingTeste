import Decimal from 'big.js';

import { ethAmountSchema, type EthAmount } from '@/contracts/money';

const ETH_DECIMALS = 6;
const MIN_DISPLAY_DECIMALS = 2;

Decimal.DP = ETH_DECIMALS;
Decimal.RM = Decimal.roundDown;

function toBig(amount: EthAmount): Decimal {
  return new Decimal(ethAmountSchema.parse(amount));
}

function normalize(value: Decimal): EthAmount {
  const fixed = value.round(ETH_DECIMALS, Decimal.roundDown).toFixed(ETH_DECIMALS);
  return fixed.replace(/\.?0+$/, '');
}

export function addEth(a: EthAmount, b: EthAmount): EthAmount {
  return normalize(toBig(a).plus(toBig(b)));
}

export function subEth(a: EthAmount, b: EthAmount): EthAmount {
  return normalize(toBig(a).minus(toBig(b)));
}

export function mulEth(amount: EthAmount, quantity: number): EthAmount {
  return normalize(toBig(amount).times(quantity));
}

export function percentOf(amount: EthAmount, percent: number): EthAmount {
  return normalize(toBig(amount).times(percent).div(100));
}

export function compareEth(a: EthAmount, b: EthAmount): -1 | 0 | 1 {
  const comparison = toBig(a).cmp(toBig(b));
  return comparison < 0 ? -1 : comparison > 0 ? 1 : 0;
}

export function formatEth(amount: EthAmount): string {
  const [integerPart, decimalPart = ''] = normalize(toBig(amount)).split('.');
  const decimals = decimalPart.padEnd(MIN_DISPLAY_DECIMALS, '0');
  return `${integerPart ?? '0'}.${decimals} ETH`;
}
