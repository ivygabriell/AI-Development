# Base de conhecimento: Integradora

**Maturidade:** rascunho (leitura feita em 2026-10-30, sem caso real ainda)
**Agente:** Integradora (harness em `modelos/agentes/integradora.md`)
**Skills que saem daqui:** `metodo:validacao-final` e `metodo:metricas-de-entrega`

O que a leitura das referências escolhidas pela pessoa ensinou, com palavras próprias: a regra concreta, o porquê e o link. É o segundo lugar onde a integradora procura, depois do `docs/referencias/integradora.md` do projeto e antes dos sites. As regras de testes do método (micro e macro, RED antes de GREEN) estão no `nucleo/03-skills-e-testes.md`.

## Testes que valem a pena (martinfowler.com e Google Testing Blog)

| Regra | Por quê | Fonte |
|---|---|---|
| Muitos testes pequenos e rápidos, menos testes amplos, pouquíssimos de ponta a ponta, só para as jornadas críticas | os amplos são lentos, instáveis e caros de manter | [Fowler, pirâmide de testes na prática](https://martinfowler.com/articles/practical-test-pyramid.html) e [Google, chega de mais testes de ponta a ponta](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html) |
| Testar o comportamento observável pela interface pública, não a implementação; classe que só existe para apoiar outra é testada através dela | teste preso ao detalhe quebra a cada refatoração | [Fowler, pirâmide de testes na prática](https://martinfowler.com/articles/practical-test-pyramid.html) e [Google, prefira testar a interface pública](https://testing.googleblog.com/2015/01/testing-on-toilet-prefer-testing-public.html) |
| Teste que só confere que cada função foi chamada na ordem é um "detector de mudança": passa com código errado e quebra com refatoração certa | não prova comportamento | [Google, testes detectores de mudança](https://testing.googleblog.com/2015/01/testing-on-toilet-change-detector-tests.html) |
| Não abusar de dublês: quando dá, use a implementação real ou um falso simples e confira o resultado | o teste fica mais claro e pega mais erros | [Google, não abuse de mocks](https://testing.googleblog.com/2013/05/testing-on-toilet-dont-overuse-mocks.html) |
| Não fazer mock de tipo que não é seu (biblioteca de terceiros): envolva a biblioteca numa interface sua, ou use o falso que ela oferece | o mock desatualiza quando a biblioteca muda e esconde o erro | [Google, não faça mock do que não é seu](https://testing.googleblog.com/2020/07/testing-on-toilet-dont-mock-types-you.html) |
| Teste de integração estreito, um limite por vez (banco, fila, serviço externo simulado); teste de contrato entre consumidor e fornecedor mantém os dublês fiéis | pega o erro de integração sem o custo do ponta a ponta | [Fowler, pirâmide de testes na prática](https://martinfowler.com/articles/practical-test-pyramid.html) |
| Se um teste amplo falha e nenhum menor falha, escreva o menor; apague o teste amplo que não acrescenta nada | o erro fica fácil de achar | [Fowler, pirâmide de testes na prática](https://martinfowler.com/articles/practical-test-pyramid.html) |
| Teste é código de produção: uma condição por teste, preparar-agir-conferir, legível | teste ilegível é apagado ou ignorado | [Fowler, pirâmide de testes na prática](https://martinfowler.com/articles/practical-test-pyramid.html) |

## Métricas de entrega (DORA)

| Regra | Por quê | Fonte |
|---|---|---|
| Vazão: tempo da mudança (do commit à produção) e frequência de publicação. Instabilidade: taxa de falha de mudança (precisou de intervenção imediata), tempo de recuperação de publicação com falha e taxa de retrabalho (publicações não planejadas, puxadas por incidente) | juntas mostram velocidade e estabilidade | [DORA, métricas](https://dora.dev/guides/dora-metrics/) |
| Medir por aplicação, com os dados que já existem (Git, PRs, CI, conversa), e acompanhar a tendência a partir de uma linha de base | o número sozinho não diz nada; a mudança diz | [DORA, métricas](https://dora.dev/guides/dora-metrics/) |
| Não transformar em meta, não comparar equipes ou aplicações diferentes, não olhar uma métrica só | meta vira trapaça; comparação engana | [DORA, métricas](https://dora.dev/guides/dora-metrics/) |

## Outras referências do harness

O Thoughtworks Technology Radar (https://www.thoughtworks.com/radar) ajuda a decidir se uma técnica ou ferramenta se adota, se testa, se avalia ou se evita, com o motivo; não foi resumido aqui.
