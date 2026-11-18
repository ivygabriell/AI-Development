# Processo fora da raiz do projeto: desenho

**Data:** 2026-11-18
**Status:** aprovado pela pessoa em 2026-11-18 ("aprovado, pode seguir para o plano")
**Caso de origem:** nenhum. Como as decisões 013, 014 e 015, entra aprovado pela pessoa sem caso real, por pedido explícito dela; o primeiro projeto criado assim vira o caso que confirma ou corrige.

## Intenção

Pedido da pessoa, em 2026-11-18: no GitHub deve ficar o projeto inteiro (código e processo), mas o processo reunido numa pasta própria, porque **a raiz do projeto fica poluída**.

**Por quê** (do que ela disse): a raiz de um projeto criado pelo método mistura o código com `docs/`, `scripts/`, `CLAUDE.md`, `AGENTS.md`, `README.md` e `.github/`; ela quer abrir o repositório e ver o produto, não o processo.

**Critério de sucesso:** num projeto novo, a raiz tem só `README.md`, `CLAUDE.md`, `AGENTS.md`, `.github/`, `processo/` e o código; tudo o que o método cria fica em `processo/`, menos o que a plataforma exige na raiz; agentes e worktrees seguem funcionando, porque tudo continua versionado.

**Fora do escopo:** esconder a pasta do GitHub (`.gitignore`, repositório separado); mover `CLAUDE.md` para `.claude/`; reorganizar o repositório do próprio método; mexer em projetos de produto já existentes.

**Antiobjetivos:** link quebrado; projeto meio migrado (parte dos caminhos em `docs/`, parte em `processo/`); agente lendo o caminho antigo sem avisar.

## Abordagens consideradas

| Abordagem | Troca | Escolha |
|---|---|---|
| **1. `processo/` leva o `docs/` e o `scripts/`** | A raiz passa de 6 para 5 itens do método. Mexe em modelos, script e skills (versão maior) | **Escolhida pela pessoa** |
| 2. Igual ao 1, com o `CLAUDE.md` em `.claude/` | Raiz um arquivo menor; esconde o arquivo mais importante e depende de confirmar a leitura em worktrees | — |
| 3. Só renomear `docs/` para `processo/` | Mudança mínima; a raiz quase não muda | — |

## O que a pessoa decidiu

- Abordagem 1. `docs/` vira `processo/` e os scripts de worktree vão para `processo/scripts/`.
- `CLAUDE.md`, `AGENTS.md` e `.github/` ficam na raiz, porque o Claude Code, o Codex e o GitHub só os procuram ali; `README.md` também.

## Escolhas da sessão do método (a pessoa confere ao ler)

1. **Troca um por um.** `docs/X` vira `processo/X`, sem subpastas novas (`regras/`, `produto/`...). Mantém os mesmos nomes e deixa a verificação mecânica. Subpastas ficam para depois, se um caso pedir.
2. **`scripts/nova-tarefa.sh` e `remover-tarefa.sh` viram `processo/scripts/`.** `scripts/` volta a ser do código do projeto.
3. **`CLAUDE.md` e `AGENTS.md` ficam curtos** e apontam para `processo/` (o modelo já importa `@docs/...`, vira `@processo/...`).
4. **Projeto que precisar de `docs/` para a documentação do produto** cria a sua; a pasta deixa de ser do método.
5. **Histórico não é reescrito.** `casos/`, `licoes/`, `CHANGELOG.md`, planos e decisões antigas continuam com `docs/`; a decisão 016 avisa que o nome antigo vale nelas.
6. **Referências externas com `docs/` no caminho** (páginas do PostgreSQL e da MDN citadas nas skills) não mudam.
7. **Versão 6.0.0**, por mexer na estrutura dos projetos; decisão 016.

## O que muda

- `modelos/` (CLAUDE e AGENTS do projeto, harnesses, referências, prompts, issue, PR, modelo de spec e de requisitos): caminhos `docs/` para `processo/`; os scripts de worktree passam a ser criados em `processo/scripts/`.
- `scripts/novo-projeto.sh`: copia para `processo/` e `processo/scripts/`; a ajuda e os avisos mudam.
- `skills/novo-projeto`, `consultar`, as demais skills que citam `docs/` do projeto e `nucleo/01`, `02`, `03` e `05`; `README.md` e `cenarios/` que citam o caminho.
- `skills/atualizar-projeto`: ganha o passo de **migração** de um projeto com `docs/` e `scripts/` do método para `processo/`, por `git mv` numa branch, ajustando os caminhos em `CLAUDE.md`, `AGENTS.md` e `.github/`, com PR e portão da pessoa. Projeto não migrado continua funcionando na versão antiga (a versão do método fica carimbada).
- `CHANGELOG.md`, `VERSION` (6.0.0), `decisoes/016-processo-fora-da-raiz.md`.

## Como se verifica

Pelo `superpowers:test-driven-development`, as verificações são escritas antes e vistas falhar:

1. `scripts/verificar.mjs` falha se `modelos/`, `nucleo/`, `skills/` ou `scripts/` citarem `docs/` ou `scripts/nova-tarefa` como caminho do projeto (com a lista das referências externas permitidas).
2. Um teste roda `novo-projeto.sh` numa pasta temporária e confere que a raiz resultante só tem os itens do critério de sucesso e que os scripts de worktree funcionam a partir de `processo/scripts/`.
3. O verificador existente (estrutura, links, lições, cenários) segue verde.

## Deixado para quem for executar

A ordem dos arquivos, o texto exato do passo de migração e a redação da decisão 016.
