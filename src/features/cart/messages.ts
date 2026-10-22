export const cartMessages = {
  added: 'NFT adicionado ao carrinho.',
  unavailable: (available: number) =>
    available === 0
      ? 'Esta edição está esgotada.'
      : `Apenas ${available} unidade(s) disponível(is) desta edição.`,
  title: 'Carrinho de NFTs',
  empty: 'Seu carrinho está vazio',
  emptyDescription: 'Explore o catálogo e adicione NFTs para montar sua coleção.',
} as const;
