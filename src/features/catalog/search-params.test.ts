import { describe, expect, it } from 'vitest';

import { catalogSearchSchema } from './search-params';

const parse = (params: Record<string, unknown>) => catalogSearchSchema.parse(params);
describe('parâmetros do catálogo', () => {
  it('page inválida e sort desconhecido usam defaults', () => {
    expect(parse({ page: 'abc', sort: 'desconhecido' })).toMatchObject({ page: 1, sort: 'recent' });
    expect(parse({ page: '-1' }).page).toBe(1);
  });
  it('preços negativos são descartados', () => {
    expect(parse({ minPrice: '-1' }).minPrice).toBeUndefined();
  });
  it('múltiplas categorias e redes são preservadas e desconhecidas descartadas', () => {
    expect(
      parse({ category: ['musica', 'arte-3d'], network: ['ethereum', 'polygon'] }),
    ).toMatchObject({ category: ['musica', 'arte-3d'], network: ['ethereum', 'polygon'] });
    expect(parse({ category: 'musica' }).category).toEqual(['musica']);
    expect(parse({ category: ['desconhecida'] }).category).toEqual([]);
  });
});
