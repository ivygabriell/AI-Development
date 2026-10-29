---
name: migracao-sem-parada
description: Use quando for escrever ou revisar uma migração de banco (PostgreSQL) numa tabela que já está em uso, acrescentar ou mudar coluna, criar índice ou constraint, renomear, trocar tipo, ou quando uma migração travou o banco, deixou um índice INVALID ou não tem como ser desfeita.
---

# Migração sem parar o sistema

**Maturidade:** rascunho (sem caso real ainda). **Quem usa:** as trabalhadoras do back ao construir e o especialista de Back e Dados ao revisar.

Uma migração é segura quando o código antigo e o novo funcionam durante toda a mudança, quando nenhuma trava fica na fila bloqueando o resto e quando dá para voltar. A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/back-e-dados.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/back-e-dados.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Toda migração tem volta.** Escreva a descida junto com a subida e teste as duas. A descida de algo que a própria subida criou (coluna ou índice novos) pode apagá-lo; diga no PR que ela só é segura antes de o código gravar ali. Remover algo que já existia (coluna antiga, texto encurtado) perde dado: vai numa migração separada, depois que o código parou de usar. Fonte: [PlanetScale, mudanças compatíveis](https://planetscale.com/blog/backward-compatible-databases-changes).
2. **Renomear, trocar tipo ou dividir coluna = três etapas, em PRs separados.** Acrescentar (coluna nova, o código grava nas duas); migrar (copiar os dados antigos em lotes e passar a ler da nova); remover (parar de gravar na antiga e apagá-la). Nunca renomeie no lugar. Fonte: [PlanetScale, mudanças compatíveis](https://planetscale.com/blog/backward-compatible-databases-changes).
3. **Limite de espera por trava, com nova tentativa.** Uma mudança de esquema que espera uma trava entra na fila e bloqueia até as leituras que chegam depois. Comece cada migração com `SET lock_timeout` curto (por exemplo, `'3s'`). A nova tentativa, com espera crescente, fica em quem roda as migrações (o script de migração ou do deploy), não no SQL; ele trata o erro `55P03` e usa a conexão direta ao banco, não a do pool. Não aumente o limite para "passar". Fonte: [PostgreSQL, travas explícitas](https://www.postgresql.org/docs/current/explicit-locking.html).
4. **Índice em tabela com uso: `CREATE INDEX CONCURRENTLY`**, num arquivo de migração sem transação (o comando recusa rodar dentro de uma). Ele não bloqueia leituras nem escritas, mas espera as transações antigas terminarem: neste arquivo, não use o `lock_timeout` curto do passo 3, que o abortaria no meio. Se falhar, ele deixa um índice `INVALID`: confira com `SELECT indexrelid::regclass FROM pg_index WHERE NOT indisvalid;` e apague com `DROP INDEX CONCURRENTLY` antes de tentar de novo. A descida usa `DROP INDEX CONCURRENTLY`. Fonte: [PostgreSQL, CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html).
5. **Coluna nova:** com valor padrão constante, é só metadado (sem regravar a tabela), inclusive com `NOT NULL` junto, que aí dispensa o passo 6; com padrão que muda a cada linha (`clock_timestamp()`, identidade, coluna gerada armazenada), regrava a tabela inteira. Se o padrão servia só para as linhas antigas, pergunte se ele fica; tirá-lo é outra migração, depois que o código grava a coluna. Fonte: [PostgreSQL, ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html).
6. **Constraint e `NOT NULL` em coluna com dados:** acrescente com `NOT VALID` (não varre) e depois rode `VALIDATE CONSTRAINT` (varre sem bloquear as escritas). Para `SET NOT NULL`, crie antes um `CHECK (coluna IS NOT NULL) NOT VALID`, valide, rode o `SET NOT NULL` (que pula a varredura) e apague o `CHECK`. Fonte: [PostgreSQL, ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html).
7. **Trocar o tipo regrava a tabela e os índices**, a não ser em casos como `text` para `varchar` sem limite menor; numa tabela grande, use as três etapas do passo 2. Fonte: [PostgreSQL, ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html).
8. **Cópia de dados em lotes**, cada lote na sua transação curta (milhares de linhas, não milhões), retomável se parar no meio. Fonte: [PlanetScale, ON DELETE CASCADE](https://planetscale.com/blog/i-dont-like-delete-cascade).
9. **Ordem do deploy:** a migração que acrescenta vai antes do código que usa; a que remove vai depois do código que parou de usar. Escreva a ordem no PR.

## O teste que prova (escreva antes, veja falhar)

| Regra | Teste |
|---|---|
| Volta | subir, descer e subir de novo num banco de teste, sem erro e sem perder o que deveria ficar |
| Código antigo | a suíte da versão anterior passa com o esquema novo |
| Cópia em lotes | rodar a cópia duas vezes dá o mesmo resultado |

## Checklist

- [ ] Subida e descida escritas e testadas; perda de dado avisada no PR.
- [ ] `lock_timeout` curto no começo, com nova tentativa no script de migração.
- [ ] Índice com `CONCURRENTLY`, sem transação e sem o `lock_timeout` curto, com o plano para `INVALID`.
- [ ] Constraint com `NOT VALID` e `VALIDATE`; nada que regrave tabela grande sem as três etapas.
- [ ] Ordem do deploy escrita no PR.

## Adaptar ao tamanho do projeto

- Antes do primeiro deploy (banco sem dados reais): pode mudar o esquema direto; os passos 1 e 9 continuam valendo.
- Tabela pequena (milhares de linhas): o índice comum leva segundos, mas o `lock_timeout` continua, porque a fila de travas não depende do tamanho.
- Banco que não é PostgreSQL: o raciocínio vale; os comandos mudam e a documentação do banco do projeto manda.
