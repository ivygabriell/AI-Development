---
name: transacoes-e-consultas
description: Use quando for implementar ou revisar código que grava em mais de uma linha ou tabela, pode rodar ao mesmo tempo que outra chamada (saldo, estoque, reserva, contador), apaga muitas linhas, usa ON DELETE CASCADE, configura o pool de conexões, ou quando aparecer deadlock, erro 40001 ou 40P01, consulta lenta ou conexões esgotadas.
---

# Transações, consultas e conexões

**Maturidade:** rascunho (sem caso real ainda). **Quem usa:** as trabalhadoras do back ao construir e o especialista de Back e Dados ao revisar.

A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/back-e-dados.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/back-e-dados.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Saiba o nível de isolamento.** O padrão do PostgreSQL é Read Committed: cada comando vê os dados do seu início, e duas leituras na mesma transação podem divergir. Ler, decidir e gravar em comandos separados precisa de trava (`SELECT ... FOR UPDATE`) ou de uma gravação condicional (`UPDATE ... SET saldo = saldo - $1 WHERE id = $2 AND saldo >= $1`). Fonte: [PostgreSQL, isolamento](https://www.postgresql.org/docs/current/transaction-iso.html).
2. **Repita a transação inteira quando o banco pedir:** `40P01` (deadlock) em qualquer nível; `40001` (conflito de serialização) também, se o projeto usa Repeatable Read ou Serializable. Repita do começo, com limite de tentativas, e não use o que foi lido na tentativa que falhou. Fontes: [PostgreSQL, isolamento](https://www.postgresql.org/docs/current/transaction-iso.html) e [travas explícitas](https://www.postgresql.org/docs/current/explicit-locking.html).
3. **Trave sempre na mesma ordem** (por exemplo, por `id` crescente, num só `SELECT ... ORDER BY id FOR UPDATE`) e pegue a trava mais forte primeiro. Fonte: [PostgreSQL, travas explícitas](https://www.postgresql.org/docs/current/explicit-locking.html).
4. **Transação curta.** Nada de chamada HTTP, e-mail ou espera pelo usuário com a transação aberta; grave a intenção, faça o commit e chame o serviço externo fora dela. Configure `idle_in_transaction_session_timeout`. Fonte: [PostgreSQL, isolamento](https://www.postgresql.org/docs/current/transaction-iso.html).
5. **Índice em toda chave estrangeira**, no lado que aponta (por exemplo, `itens(pedido_id)`). Confira pelo esquema que ele existe; um índice composto só serve se a chave for a primeira coluna. Fonte: [PlanetScale, ON DELETE CASCADE](https://planetscale.com/blog/i-dont-like-delete-cascade).
6. **Sem excesso de chamadas ao banco:** uma consulta por item numa lista (o "N+1") vira uma consulta com `JOIN` ou `WHERE id = ANY($1)`. Confira o plano com `EXPLAIN` nas consultas novas que leem muitas linhas. Fonte: [PostgreSQL, EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html).
7. **Apagar muito não é um `DELETE` só, nem `ON DELETE CASCADE` grande.** Marque como apagado (`apagado_em`), filtre nas leituras e apague depois em lotes pequenos, cada um na sua transação, numa tarefa em segundo plano (`metodo:trabalho-em-segundo-plano`). A cascata limitada a um lote pequeno pode ficar. Prazo legal de exclusão, dado pessoal e chave única que precisa ser liberada na hora são regra de negócio: suba ao especialista. Fontes: [PlanetScale, ON DELETE CASCADE](https://planetscale.com/blog/i-dont-like-delete-cascade) e [o único delete que escala](https://planetscale.com/blog/the-only-scalable-delete).
8. **Pool de conexões:** em produção com PgBouncer, use o modo transação para o app e a conexão direta para migrações (elas usam travas de sessão). Nunca deixe estado de sessão (`SET` sem `LOCAL`, tabela temporária) numa conexão que volta ao pool. Fontes: [PlanetScale, PgBouncer](https://planetscale.com/blog/scaling-postgres-connections-with-pgbouncer) e [pools envenenados](https://planetscale.com/blog/postgres-poisoned-connection-pools).
9. **Prazo em toda consulta e chamada externa** (`statement_timeout` e o prazo do cliente HTTP), para uma dependência lenta não segurar conexões. Fonte: [Shopify, pagamentos resilientes](https://shopify.engineering/building-resilient-payment-systems).

## O teste que prova (escreva antes, veja falhar)

| Regra | Teste |
|---|---|
| Concorrência | duas chamadas ao mesmo tempo (por exemplo, transferências A→B e B→A em paralelo, em laço) terminam sem deadlock e com o total certo |
| Repetição | um erro `40001`/`40P01` simulado faz a transação rodar de novo e acertar |
| N+1 | contar as consultas de uma listagem: o número não cresce com o tamanho da lista |
| Exclusão | a exclusão grande roda em lotes e pode ser retomada do meio |

## Checklist

- [ ] Ler-decidir-gravar protegido por trava ou gravação condicional.
- [ ] Repetição em `40001` e `40P01`, com limite.
- [ ] Travas em ordem fixa; transações curtas, sem chamada externa dentro.
- [ ] Índice em cada chave estrangeira, conferido no esquema.
- [ ] Sem N+1; `EXPLAIN` nas consultas novas pesadas.
- [ ] Exclusão em massa em lotes, sem cascata grande.
- [ ] Pool sem estado de sessão; prazo em consulta e chamada externa.

## Adaptar ao tamanho do projeto

- Um usuário por vez e poucos dados: os passos 1 a 5 continuam (a concorrência aparece com dois cliques); os lotes do passo 7 podem ser grandes.
- Sem PgBouncer: o passo 8 vira só "não deixar estado de sessão" e o tamanho do pool do driver.
- Banco que não é PostgreSQL: os códigos de erro mudam; o raciocínio fica.
