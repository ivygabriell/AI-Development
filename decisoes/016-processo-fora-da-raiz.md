# 016 · O processo do projeto mora em processo/

**Data:** 2026-11-18
**Status:** aceita
**Caso de origem:** nenhum. Como as decisões 013, 014 e 015, entra aprovada pela pessoa sem caso real, por pedido explícito dela; o primeiro projeto criado assim vira o caso que confirma ou corrige. Desenho: [2026-11-18-processo-fora-da-raiz-desenho.md](../planos/2026-11-18-processo-fora-da-raiz-desenho.md); plano: [2026-11-18-processo-fora-da-raiz.md](../planos/2026-11-18-processo-fora-da-raiz.md).

## Contexto

Um projeto criado pelo método misturava, na raiz, o código com `docs/`, `scripts/`, `CLAUDE.md`, `AGENTS.md`, `README.md` e `.github/`. A pessoa quer o projeto inteiro no GitHub (código e processo), mas o processo reunido numa pasta própria, porque a raiz poluída atrapalha ver o produto. Ficou fora de questão esconder o processo do GitHub (`.gitignore`, repositório separado): as worktrees e os agentes dependem de tudo estar versionado.

## Decisão

O que o método cria num projeto (regras, memória, requisitos, telas, harnesses, referências, mapa de riscos, contrato, arquitetura, specs e os scripts de worktree) fica em `processo/`; `docs/` volta a ser livre para a documentação do produto. Na raiz ficam só `README.md`, `CLAUDE.md`, `AGENTS.md`, `.github/` (as ferramentas e o GitHub só os procuram ali), `processo/` e o código. A troca é um por um (`docs/X` vira `processo/X`; `scripts/nova-tarefa.sh` e `remover-tarefa.sh` vão para `processo/scripts/`), sem subpastas novas. Abordagem 1 das três consideradas; as outras eram `CLAUDE.md` em `.claude/` (esconde o arquivo mais importante) e só renomear `docs/` (a raiz quase não muda). Decidida pela pessoa em 2026-11-18.

## Consequências

- A raiz do projeto fica com 5 itens do método, em vez de 6, e só um deles (`processo/`) é novo.
- Projetos já criados migram pela skill `atualizar-projeto` (`git mv` só dos itens do método, com PR e a aprovação da pessoa); sem migrar, seguem funcionando na versão antiga, com a versão do método carimbada.
- As decisões, os casos, as lições e os planos anteriores mantêm `docs/` e `scripts/` nos textos: são histórico e descrevem o método de então. A partir da 6.0.0 valem os caminhos `processo/`.
- Mudaram: `modelos/`, `scripts/novo-projeto.sh`, `nucleo/`, `skills/`, `cenarios/`, `README.md`, `scripts/verificar.mjs` (que falha se um caminho antigo voltar), `VERSION` e `CHANGELOG.md`.
