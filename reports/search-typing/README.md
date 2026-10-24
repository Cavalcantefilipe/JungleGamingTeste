# Digitação e contagem de resultados

O percurso manual de uma conta criada pela tela revelou dois erros na versão pública `369f9ee`: digitar “Cosmic Bloom” removia o espaço, e consultas substituídas durante a digitação anunciavam uma falha genérica.

A correção `9fd3739` preserva o texto em edição no schema da URL e normaliza apenas no contrato da API. O loader ignora somente `CancelledError`; erros reais continuam sendo anunciados.

| Evidência | Resultado |
| --- | --- |
| [public-red.txt](public-red.txt) e [traces](public-red/) | Quatro falhas reproduzidas antes da correção. |
| [unit-red.txt](unit-red.txt) | Regressão unitária antes da correção. |
| [unit-green.txt](unit-green.txt) | Quatro unitários aprovados. |
| [local-green.txt](local-green.txt) | Arquivo de catálogo completo: 16 aprovações. |
| [final-green.txt](final-green.txt) | Quatro regressões após adotar a classe `CancelledError`. |
| [public-green.txt](public-green.txt) | Railway `9fd3739`: 16 aprovações Chromium desktop/mobile. |
| [compatibility-green.txt](compatibility-green.txt) | Mesmo deploy: 16 aprovações Firefox desktop/WebKit mobile. |
| [count-red.txt](count-red.txt) e [count-green.txt](count-green.txt) | Uma falha de concordância antes; três casos (0/1/2) aprovados depois. |

O ajuste `4185cbb` centraliza a mensagem compartilhada e usa “1 NFT encontrado”. A contagem também foi conferida pela interface pública. [Percurso manual](../ui-account-test/README.md).

[Identificação da publicação da busca](deployment.json). O check consolidado, atualizado após `11f0820`, inclui 138 unitários e 17 testes de ferramentas; a suíte completa anterior (`369f9ee`, 333 aprovações/37 exclusões) permanece identificada separadamente em [screens-completeness](../screens-completeness/README.md).
