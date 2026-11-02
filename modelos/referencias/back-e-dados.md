# Base de conhecimento: Back e Dados

**Leitura feita em:** 2026-10-29
**Agente:** Back e Dados (harness em `modelos/agentes/back-e-dados.md`)
**Skills que saem daqui:** `metodo:api-conforme-contrato`, `metodo:migracao-sem-parada`, `metodo:transacoes-e-consultas` e `metodo:trabalho-em-segundo-plano`

O que a leitura das referências escolhidas pela pessoa ensinou, com palavras próprias: o princípio, a regra concreta, o porquê e o link. É o segundo lugar onde o agente procura, depois do `docs/referencias/back-e-dados.md` do projeto e antes dos sites. O que já virou passo de uma skill aparece aqui só com a regra curta; o resto fica aqui para consulta.

## APIs (Zalando e Google AIP)

| Regra | Por quê | Fonte |
|---|---|---|
| Não quebrar clientes; o cliente aceita campos novos sem falhar | quem já usa a API continua funcionando | [Zalando #106 e #108](https://opensource.zalando.com/restful-api-guidelines/#106) |
| O que quebra: renomear ou remover, campo obrigatório novo, tipo, formato ou valor padrão diferente, limite de texto maior | código razoável dos clientes depende disso | [AIP-180](https://google.aip.dev/180) |
| Toda listagem paginada desde o início, com limite padrão finito | acrescentar depois faz o cliente antigo ver só a primeira página | [AIP-158](https://google.aip.dev/158) |
| Cursor opaco, que só diz onde continuar e não dá permissão; prefira cursor a deslocamento; evite contar o total | o cliente não monta o cursor, e a contagem pesa no banco | [AIP-158](https://google.aip.dev/158) e [Zalando #160 e #254](https://opensource.zalando.com/restful-api-guidelines/#160) |
| Resposta em objeto, não em lista solta | cabe campo novo sem quebrar | [Zalando #110](https://opensource.zalando.com/restful-api-guidelines/#110) |
| Erro no formato Problem JSON, sem rastro de pilha, com o código HTTP mais específico | o cliente trata o erro pela máquina, e nada interno vaza | [Zalando #176, #177 e #220](https://opensource.zalando.com/restful-api-guidelines/#176) |
| Cada erro com um motivo estável e legível por máquina; o mesmo erro sempre com o mesmo motivo | o cliente não precisa ler a mensagem | [AIP-193](https://google.aip.dev/193) |
| Permissão antes da existência | não revela se o recurso existe | [AIP-193](https://google.aip.dev/193) |
| 429 com cabeçalhos para limite de uso; 207 para lote com sucesso parcial | sinais padrão que o cliente entende | [Zalando #153 e #152](https://opensource.zalando.com/restful-api-guidelines/#153) |
| POST e PATCH que podem repetir sem duplicar, por chave do cliente | a rede cai e o cliente repete | [Zalando #229 e #231](https://opensource.zalando.com/restful-api-guidelines/#229) |
| Depreciação marcada no contrato, com o uso monitorado e o acordo dos clientes antes de desligar; cabeçalhos `Deprecation` e `Sunset` | ninguém é pego de surpresa | [Zalando #187, #188 e #189](https://opensource.zalando.com/restful-api-guidelines/#187) |
| Nomes: recursos no plural, sem verbos na rota, `kebab-case` no caminho e `snake_case` nos campos e parâmetros | a API parece escrita por uma pessoa só | [Zalando #134, #141, #129 e #118](https://opensource.zalando.com/restful-api-guidelines/#134) |
| Eventos são parte da interface: esquema publicado, identificador único, compatibilidade mantida, consumidor resiste a duplicados | quem consome depende deles como de uma rota | [Zalando #194, #211, #209 e #214](https://opensource.zalando.com/restful-api-guidelines/#194) |
| Operação demorada vira um recurso de operação que o cliente consulta | a requisição não fica pendurada | [AIP-151](https://google.aip.dev/151) |

## Banco de dados (documentação do PostgreSQL)

| Regra | Por quê | Fonte |
|---|---|---|
| Só `ACCESS EXCLUSIVE` bloqueia leitura simples; muitas formas de `ALTER TABLE` pegam essa trava | saber o que cada comando trava antes de rodar | [Travas explícitas](https://www.postgresql.org/docs/current/explicit-locking.html) |
| Trava espera para sempre e quem chega depois entra na fila atrás dela; use `lock_timeout` curto e tente de novo | uma migração esperando pode parar o sistema | [Travas explícitas](https://www.postgresql.org/docs/current/explicit-locking.html) |
| Deadlock: travar na mesma ordem, pegar a mais forte primeiro, repetir a transação abortada | o banco escolhe quem abortar, e não dá para prever | [Travas explícitas](https://www.postgresql.org/docs/current/explicit-locking.html) |
| Read Committed é o padrão; em Repeatable Read e Serializable, repetir a transação inteira no erro `40001` | conflito de serialização é esperado, não bug | [Isolamento](https://www.postgresql.org/docs/current/transaction-iso.html) |
| `CREATE INDEX CONCURRENTLY` não roda em transação, faz duas varreduras e pode deixar índice `INVALID` | não bloqueia escritas, mas pede cuidado na falha | [CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html) |
| Índice parcial (`WHERE`) para o subconjunto consultado; `INCLUDE` para ler só do índice | índice menor e consulta sem ir à tabela | [CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html) |
| Coluna nova com padrão constante não regrava; padrão volátil, identidade e coluna gerada armazenada regravam | regravar tabela grande para o sistema | [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html) |
| `NOT VALID` e depois `VALIDATE CONSTRAINT`; `CHECK ... IS NOT NULL` validado antes do `SET NOT NULL` | valida sem bloquear escritas | [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html) |
| Conferir o plano com `EXPLAIN` (e `EXPLAIN ANALYZE` fora da produção) | a consulta lenta aparece antes do usuário | [EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) |

## Banco em produção (PlanetScale)

| Regra | Por quê | Fonte |
|---|---|---|
| Mudança em esquema usado: acrescentar, migrar, remover, com volta possível em cada etapa | o código antigo e o novo funcionam durante a mudança | [Mudanças compatíveis](https://planetscale.com/blog/backward-compatible-databases-changes) e [mudanças seguras](https://planetscale.com/blog/safely-making-database-schema-changes) |
| Desconfiar de `ON DELETE CASCADE` grande: marcar como apagado e apagar depois em lotes; índice em toda chave estrangeira | a cascata segura travas, enche o log e atrasa as réplicas | [ON DELETE CASCADE](https://planetscale.com/blog/i-dont-like-delete-cascade) |
| `DELETE` em massa não libera espaço na hora; em escala, prefira descartar tabela ou partição | o custo cai no log, na réplica e na limpeza | [O único delete que escala](https://planetscale.com/blog/the-only-scalable-delete) |
| PgBouncer em modo transação para o app; conexão direta para migração | migração usa trava de sessão, que o modo transação não guarda | [PgBouncer](https://planetscale.com/blog/scaling-postgres-connections-with-pgbouncer) |
| Estado de sessão deixado numa conexão passa para o próximo cliente do pool | um `SET` esquecido pode deixar o pool inteiro errado | [Pools envenenados](https://planetscale.com/blog/postgres-poisoned-connection-pools) |

## Escalar o back (Shopify): só o raciocínio, nunca o tamanho

| Regra | Por quê | Fonte |
|---|---|---|
| Prazo curto em toda chamada externa e consulta; disjuntor depois de falhas seguidas; registro estruturado com identificador comum | uma dependência lenta não derruba o resto | [Pagamentos resilientes](https://shopify.engineering/building-resilient-payment-systems) |
| Chave de repetição por cliente, válida pela janela de repetição (24 horas ou menos); identificador ordenável (ULID) indexa melhor que UUID aleatório | cobrança repetida é dano real | [Pagamentos resilientes](https://shopify.engineering/building-resilient-payment-systems) |
| Conciliar os registros com o parceiro externo de tempos em tempos | o erro raro acontece todo dia em volume | [Pagamentos resilientes](https://shopify.engineering/building-resilient-payment-systems) |
| Tarefas: pelo menos uma vez, podem repetir, tabela de saída quando perder não é aceitável, parâmetros compatíveis entre versões, tarefa longa retomável | a fila falha de jeitos previsíveis | [Trabalho em segundo plano](https://shopify.engineering/high-availability-background-jobs) |
| Réplica de leitura: leituras ligadas vão para a mesma réplica (consistência monotônica) | o usuário não vê o dado "voltar no tempo" | [Consistência com réplicas](https://shopify.engineering/read-consistency-database-replicas) |
| Monólito com fronteiras por domínio antes de separar serviços | é assunto da Arquitetura; aqui só para reconhecer a fronteira ao escrever código | [Desmontando o monólito](https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity) |
