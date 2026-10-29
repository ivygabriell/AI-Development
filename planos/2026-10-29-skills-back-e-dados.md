# Skills de Back e Dados: plano

**Objetivo:** o agente Back e Dados ganha quatro skills no plugin `metodo`, tiradas da leitura das referências do seu harness, e uma base de conhecimento; as trabalhadoras dele usam as skills ao construir. Tudo em `rascunho`, aprovado pela pessoa sem caso real ([decisão 009](../decisoes/009-skills-por-agente.md)).

**Combinado com a pessoa (2026-10-28 e 2026-10-29):** leitura a fundo antes de escrever qualquer arquivo; um agente por vez, começando por Back e Dados; as quatro skills propostas aprovadas ("caso não seja usado, ela só não será ativada"); as trabalhadoras usam as skills do especialista pai.

## Tarefas

- [x] **Leitura:** índice e artigos de mais peso de Zalando, Google AIP (158, 180, 193), PostgreSQL (travas, isolamento, ALTER TABLE, CREATE INDEX), PlanetScale (mudanças compatíveis, ON DELETE CASCADE, PgBouncer) e Shopify (pagamentos resilientes, trabalho em segundo plano, monólito). Resumo com palavras próprias; todos os links conferidos (HTTP 200 e âncoras das regras da Zalando).
- [x] **Verificações antes (vistas falhar):** `scripts/verificar.mjs` confere a base, as quatro skills (cabeçalho, maturidade, checklist, adaptação, links de fonte), a parte 5 do harness e toda citação `metodo:<nome>` contra as pastas de `skills/`. 37 falhas antes do conteúdo.
- [x] **Linha de base (RED):** uma trabalhadora sem as skills resolveu quatro tarefas de back (listagem e pagamento, migração em tabela grande, transferência e exclusão em massa, e-mail e estoque depois do pedido). Falhas observadas: divergiu do contrato sem perguntar, cursor legível e sem desempate, lista solta na resposta, erro em formato próprio, migração sem volta e sem nova tentativa no `lock_timeout`, índice de chave estrangeira dado como coberto sem estar, nenhum teste de repetição, concorrência ou versão de tarefa.
- [x] **Skills e base:** `skills/api-conforme-contrato/`, `skills/migracao-sem-parada/`, `skills/transacoes-e-consultas/`, `skills/trabalho-em-segundo-plano/` e `modelos/referencias/back-e-dados.md`.
- [x] **Harness:** a parte 3 passa pela base do método; a parte 5 lista as skills e diz que as trabalhadoras as usam; a especificação do `worker-start` diz quais skills a tarefa toca.
- [x] **Teste com as skills (GREEN):** as mesmas quatro tarefas, com as skills. A trabalhadora passou a perguntar as lacunas do contrato, fez cursor opaco com desempate, resposta em objeto, Problem JSON, migração com descida e nova tentativa, conferiu o índice da chave estrangeira e listou o teste de cada regra.
- [x] **Ajustes (REFACTOR), do que ela apontou:** `CONCURRENTLY` sem o `lock_timeout` curto; coluna nova com `NOT NULL` e padrão constante dispensa o `CHECK`; nova tentativa no script de migração (erro `55P03`, conexão direta); descida de algo recém-criado; `40001` só em Repeatable Read e Serializable; cascata pequena por lote; exclusão com prazo legal ou chave única sobe; chave natural quando o contrato não diz a chave; prazo estourado em chamada externa é resultado desconhecido.
- [x] **Documentos:** decisão 009, mapa de skills do `03`, `consultar`, README, caso do repositório, `CHANGELOG.md` e `VERSION` (2.7.0).
- [ ] `node scripts/verificar.mjs` verde; PR com o modelo preenchido, só com a confirmação da pessoa.
