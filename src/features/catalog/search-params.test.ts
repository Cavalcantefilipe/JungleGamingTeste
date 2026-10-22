import { describe, expect, it } from 'vitest';

import { catalogSearchSchema, stripDefaults } from './search-params';

describe('catalogSearchSchema', () => {
  it('usa página 1 quando page não é número', () => {
    expect(catalogSearchSchema.parse({ page: 'abc' }).page).toBe(1);
    expect(catalogSearchSchema.parse({ page: 0 }).page).toBe(1);
    expect(catalogSearchSchema.parse({ page: 3 }).page).toBe(3);
  });

  it('descarta preço inválido', () => {
    expect(catalogSearchSchema.parse({ minPrice: '-1' }).minPrice).toBeUndefined();
    expect(catalogSearchSchema.parse({ minPrice: '0.5' }).minPrice).toBe('0.5');
  });

  it('aceita categoria única ou lista', () => {
    expect(catalogSearchSchema.parse({ category: 'musica' }).category).toEqual(['musica']);
    expect(catalogSearchSchema.parse({ category: ['musica', 'jogos'] }).category).toEqual([
      'musica',
      'jogos',
    ]);
    expect(catalogSearchSchema.parse({ category: ['invalida'] }).category).toEqual([]);
  });

  it('volta para recent quando a ordenação é desconhecida', () => {
    expect(catalogSearchSchema.parse({ sort: 'xpto' }).sort).toBe('recent');
    expect(catalogSearchSchema.parse({}).tab).toBe('all');
    expect(catalogSearchSchema.parse({}).favorites).toBe(false);
  });

  it('stripDefaults remove valores padrão da URL', () => {
    expect(stripDefaults(catalogSearchSchema.parse({ q: 'ape', page: 1 }))).toEqual({ q: 'ape' });
    expect(stripDefaults(catalogSearchSchema.parse({ page: 2, sort: 'recent' }))).toEqual({
      page: 2,
    });
  });
});
