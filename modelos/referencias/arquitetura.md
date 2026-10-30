# Base de conhecimento: Arquitetura

**Maturidade:** rascunho (leitura feita em 2026-10-30, sem caso real ainda)
**Agente:** Arquitetura (harness em `modelos/agentes/arquitetura.md`)
**Skills que saem daqui:** `metodo:contrato-de-api`, `metodo:analise-de-falhas` e `metodo:migracao-de-sistema`

O que a leitura das referências escolhidas pela pessoa ensinou, com palavras próprias: a regra concreta, o porquê e o link. É o segundo lugar onde o agente procura, depois do `docs/referencias/arquitetura.md` do projeto e antes dos sites. O registro de cada decisão continua com `engineering:architecture`, e o desenho geral com `engineering:system-design`. As regras de API do Zalando e do Google AIP estão em `modelos/referencias/back-e-dados.md`, que a Arquitetura também usa ao escrever o contrato.

**Proporcionalidade:** as referências descrevem sistemas enormes; daqui sai o raciocínio, nunca o tamanho.

## Contrato e evolução da API (Stripe)

| Regra | Por quê | Fonte |
|---|---|---|
| A API é um contrato: quem usa constrói em cima dela, e estabilidade vale mais que conveniência de quem a mantém | quebrar o cliente custa caro e tarde | [Stripe, versões da API](https://stripe.com/blog/api-versioning) |
| Compatível: rota nova e campo novo. Incompatível: remover ou renomear campo, mudar o tipo (booleano virar texto de status), mudar a estrutura (texto virar objeto) | o cliente antigo continua funcionando | [Stripe, versões da API](https://stripe.com/blog/api-versioning) |
| Versões pequenas e frequentes, cada cliente preso à versão que usou primeiro; o código central só conhece a forma atual, e cada mudança incompatível vira um módulo que converte a resposta para a versão antiga | saltos grandes prendem o cliente na versão velha; o custo das versões antigas fica fixo | [Stripe, versões da API](https://stripe.com/blog/api-versioning) |
| Acertar o desenho cedo, com uma revisão leve antes de publicar | errar depois sai mais caro | [Stripe, versões da API](https://stripe.com/blog/api-versioning) |
| Pedido que muda algo leva a chave de repetição (`Idempotency-Key`); o servidor guarda o resultado pela chave e devolve o mesmo na repetição | a rede cai no meio e o cliente não sabe se deu certo | [Stripe, repetição segura](https://stripe.com/blog/idempotency) |
| O cliente repete com a mesma chave, com espera exponencial e variação aleatória | repetições sincronizadas derrubam o servidor que se recupera | [Stripe, repetição segura](https://stripe.com/blog/idempotency) |

## Confiabilidade e falhas (Azure Well-Architected e Netflix)

| Regra | Por quê | Fonte |
|---|---|---|
| Simplicidade primeiro; cada peça nova precisa de motivo | complexidade é mais lugar para falhar | [Azure, checklist de confiabilidade](https://learn.microsoft.com/en-us/azure/well-architected/reliability/checklist) |
| Listar os fluxos do usuário e classificá-los por criticidade | proteger primeiro o que importa | [Azure, checklist de confiabilidade](https://learn.microsoft.com/en-us/azure/well-architected/reliability/checklist) |
| Análise de modos de falha: decompor o fluxo, listar dependências (internas e externas), separar fortes (sem elas o fluxo para) de fracas (só um recurso some), avaliar cada modo de falha (fora do ar, lento, mal configurado, erro de operação, sobrecarga, ataque), leitura e escrita separadas, probabilidade, mitigação e detecção, tudo num quadro revisado | a falha acontece de qualquer jeito; o que muda é o estrago | [Azure, análise de modos de falha](https://learn.microsoft.com/en-us/azure/well-architected/reliability/failure-mode-analysis) |
| Mitigar de dois jeitos: redundância ou funcionamento degradado (o fluxo segue sem a parte que falhou) | nem tudo precisa ficar de pé, mas o essencial sim | [Azure, análise de modos de falha](https://learn.microsoft.com/en-us/azure/well-architected/reliability/failure-mode-analysis) |
| Dependência forte tem meta de disponibilidade alinhada à do sistema; quanto menos dependências fortes, melhor | o sistema não fica mais disponível que a dependência forte | [Azure, análise de modos de falha](https://learn.microsoft.com/en-us/azure/well-architected/reliability/failure-mode-analysis) |
| Cada chamada a outro serviço com prazo e disjuntor; ao falhar, uma alternativa: resposta guardada, resposta genérica, resposta vazia ou falhar rápido | o usuário vê algo útil em vez de esperar | [Netflix, API mais resiliente](https://netflixtechblog.com/making-the-netflix-api-more-resilient-a8ec62159c2d) e [Netflix, descoberta de conteúdo](https://netflixtechblog.com/from-chaos-to-control-testing-the-resiliency-of-netflixs-content-discovery-platform-ce5566aef0a4) |
| Sob sobrecarga, descartar primeiro o tráfego menos importante, e dizer ao cliente quando e quanto repetir | evita que as repetições piorem a sobrecarga | [Netflix, descarte priorizado](https://netflixtechblog.com/keeping-netflix-reliable-using-prioritized-load-shedding-6cc827b02f94) |
| Testar a resistência (injetar falha) e ter um plano de recuperação testado | o plano que nunca rodou não funciona | [Azure, checklist de confiabilidade](https://learn.microsoft.com/en-us/azure/well-architected/reliability/checklist) |

## Mudança grande sem parar (Slack)

| Regra | Por quê | Fonte |
|---|---|---|
| Gravar nos dois caminhos (o antigo e o novo) ao mesmo tempo | o novo caminho é testado com tráfego real | [Slack, fila de tarefas](https://slack.engineering/scaling-slacks-job-queue/) |
| Modo sombra: o caminho novo lê e processa, mas o resultado dele é descartado ou só comparado | testa sem efeito duplicado | [Slack, fila de tarefas](https://slack.engineering/scaling-slacks-job-queue/) |
| Comparar contagens e resultados entre os caminhos (leitura dupla com diferença), com uma sonda de ponta a ponta | a diferença aparece antes do usuário | [Slack, fila de tarefas](https://slack.engineering/scaling-slacks-job-queue/) e [Slack, Vitess](https://slack.engineering/scaling-datastores-at-slack-with-vitess/) |
| Passar aos poucos: primeiro uso interno, depois um tipo por vez, com chave liga/desliga e volta rápida; o caminho antigo fica de pé até o fim | voltar é só virar a chave | [Slack, fila de tarefas](https://slack.engineering/scaling-slacks-job-queue/) e [Slack, Envoy](https://slack.engineering/migrating-millions-of-concurrent-websockets-to-envoy/) |

## Outras referências do harness

GitHub, Meta e o blog de desenvolvedores do Google Cloud servem a casos específicos (escala de dados, desempenho, um serviço de nuvem) e não foram resumidos aqui.
