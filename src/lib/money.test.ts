import { describe, expect, it } from 'vitest';

import { ethAmountSchema } from '@/contracts/money';

import { addEth, compareEth, formatEth, mulEth, percentOf, subEth } from './money';

describe('aritmética em ETH como string decimal', () => {
  it('soma 26.83 + 0.016 = 26.846', () => {
    expect(addEth('26.83', '0.016')).toBe('26.846');
  });

  it('multiplica 1.19 × 2 = 2.38 sem erro binário', () => {
    expect(mulEth('1.19', 2)).toBe('2.38');
    expect(mulEth('0.1', 3)).toBe('0.3');
  });

  it('subtrai 26.846 − 0.016 = 26.83', () => {
    expect(subEth('26.846', '0.016')).toBe('26.83');
  });

  it('percentOf 10% de 26.83 = 2.683', () => {
    expect(percentOf('26.83', 10)).toBe('2.683');
  });

  it('compara valores numericamente, não lexicograficamente', () => {
    expect(compareEth('9', '10')).toBe(-1);
    expect(compareEth('1.10', '1.1')).toBe(0);
    expect(compareEth('2', '1.999999')).toBe(1);
  });

  it('rejeita número com mais de 6 casas decimais', () => {
    expect(ethAmountSchema.safeParse('1.1234567').success).toBe(false);
    expect(ethAmountSchema.safeParse('1.123456').success).toBe(true);
    expect(() => addEth('abc', '1')).toThrow();
  });
});

describe('formatEth', () => {
  it('mantém precisão e usa no mínimo duas casas', () => {
    expect(formatEth('26.846')).toBe('26.846 ETH');
    expect(formatEth('1.19')).toBe('1.19 ETH');
    expect(formatEth('1.190')).toBe('1.19 ETH');
    expect(formatEth('8')).toBe('8.00 ETH');
    expect(formatEth('0.0005')).toBe('0.0005 ETH');
  });
});
