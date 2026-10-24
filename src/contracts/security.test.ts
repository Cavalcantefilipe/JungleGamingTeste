import { expect, it } from 'vitest';

import { orderSchema } from '@/contracts/order';

it('link de recibo só aceita Etherscan HTTPS ou marcador pending', () => {
  const explorer = orderSchema.shape.explorerUrl;
  expect(explorer.safeParse(`https://etherscan.io/tx/0x${'a'.repeat(64)}`).success).toBe(true);
  expect(explorer.safeParse('pending').success).toBe(true);
  for (const url of [
    'javascript:alert(1)',
    'data:text/html,teste',
    '//evil.invalid',
    'https://etherscan.io.evil.invalid/tx/123',
  ])
    expect(explorer.safeParse(url).success, url).toBe(false);
});
