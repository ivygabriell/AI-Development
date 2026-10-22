# Back com o Codex e front com o Claude: plano de implementação

> **Para quem executa:** use `superpowers:executing-plans` para seguir este plano tarefa por tarefa. Os passos usam caixas (`- [ ]`) para acompanhar.

**Objetivo:** no modo Orca, a coordenadora Claude passa a iniciar agentes Claude no front e agentes Codex no back, e o Codex trabalha com as mesmas regras e Skills que o Claude.

**Spec:** [decisão 007](../decisoes/007-back-com-codex-e-front-com-claude.md).

## Restrições globais

- Branch `feat/back-codex-front-claude`. Nunca commit na `main`, nunca `push --force`. PR com o CI verde; integra só com o "pode integrar".
- Nada é executado em projetos de produto nem na configuração do Codex da pessoa: a instalação no Codex fica documentada no README, e a pessoa roda.
- Tudo o que vem da decisão 007 é `rascunho`.
- Comandos do Codex conferidos no próprio CLI (0.163): `codex plugin marketplace add <owner/repo>`, `codex plugin add <plugin>@<marketplace>`, `codex plugin marketplace upgrade`, `codex plugin list`, `codex mcp list`.
- Toda verificação nova em `scripts/verificar.mjs` é escrita antes e vista falhar.
- Versão final `2.5.0`.

## Foco da revisão

1. **Codex sem regras:** um projeto com agente Codex e sem `AGENTS.md` nunca deve ser possível pelo texto do método (regra do agente).
2. **Nada sobrescrito:** um `AGENTS.md` que o projeto já tem nunca é alterado pelo `novo-projeto.sh`; só gera um aviso.
3. **Contrato:** nenhuma tarefa de construção começa antes do contrato aprovado num portão.
4. **Arquivos comuns:** CI, dependências da raiz, contrato e memória só em tarefas da coordenadora.
5. **Dados pessoais:** caminhos de pasta e nomes de usuário não entram no `AGENTS.md` gerado.

---

### Tarefa 1: verificações (vistas falhar)

- [ ] `OBRIGATORIOS`: `modelos/AGENTS-projeto.md` e `decisoes/007-back-com-codex-e-front-com-claude.md`.
- [ ] Núcleo `02`: `### Back e front com agentes diferentes`, `--agent codex`, `AGENTS.md`, `contrato da API`.
- [ ] Prompt da coordenadora: `--agent codex`, `contrato da API`, `AGENTS.md`, `retrabalho`.
- [ ] Projeto gerado: o `novo-projeto.sh` cria o `AGENTS.md` carimbado com a versão, que manda ler `CLAUDE.md`, `docs/DESENVOLVIMENTO.md` e `docs/memoria-do-projeto.md`, cita `superpowers:test-driven-development`, `superpowers:verification-before-completion` e `orca orchestration ask`, sem marcadores nem caminhos de pasta; com um `AGENTS.md` existente, conclui, avisa e não o altera. O `CLAUDE.md` gerado cita `--agent codex` e `AGENTS.md`; o `DESENVOLVIMENTO.md` cita o `AGENTS.md`; a memória cita `retrabalho`.
- [ ] Skills: as três dizem onde achar a cópia do método sem `${CLAUDE_PLUGIN_ROOT}` (`dois níveis acima`); `atualizar-projeto` cita `AGENTS.md`; `consultar` aponta para a subseção nova.
- [ ] README: `codex plugin marketplace add`, `codex plugin add`, `codex plugin marketplace upgrade`, `codex mcp list` e `AGENTS.md`.
- [ ] Rodar `node scripts/verificar.mjs` e ver as falhas.

### Tarefa 2: núcleo e modelos

- [ ] `nucleo/02`: subseção `### Back e front com agentes diferentes` dentro de "Com o Orca": a coordenadora Claude, `--agent claude` no front e `--agent codex` no back, contrato primeiro, pastas e arquivos comuns, regra do agente, o que observar.
- [ ] `modelos/prompt-coordenadora-orca.md`: escolha do agente por lado, contrato primeiro com portão, arquivos comuns só com ela, anotar agente e retrabalho por tarefa.
- [ ] `modelos/AGENTS-projeto.md` (novo, com `{{VERSAO}}`): o que ler no início e as regras da trabalhadora.
- [ ] `modelos/CLAUDE-projeto.md`: a regra do agente ampliada.
- [ ] `modelos/memoria-do-projeto.md`: agente e retrabalho por tarefa.

### Tarefa 3: script e skills

- [ ] `scripts/novo-projeto.sh`: gera o `AGENTS.md` como o `CLAUDE.md` (avisa e não toca se já existir); linha do `AGENTS.md` no `DESENVOLVIMENTO.md`.
- [ ] `skills/*/SKILL.md`: a alternativa de caminho para o Codex; `atualizar-projeto` inclui o `AGENTS.md` na tabela; `novo-projeto` oferece o modo na Fase 3; `consultar` ganha a linha.
- [ ] `claude plugin validate .` passa.

### Tarefa 4: documentação e versão

- [ ] README: o Codex em "Antes de começar" e o modo em "Iniciar um projeto".
- [ ] Decisão 007 aceita; caso do repositório do método com a decisão 007 aprovada sem caso.
- [ ] `CHANGELOG.md` e `VERSION` 2.5.0.

### Tarefa 5: fechamento

- [ ] `node scripts/verificar.mjs` e `claude plugin validate .` verdes; push e PR; integrar só com o "pode integrar".
- [ ] Depois do merge: no Claude Code, `/plugin marketplace update metodo-de-desenvolvimento`; no Codex, `codex plugin marketplace upgrade`; em cada projeto, `/metodo:atualizar-projeto`.
- [ ] O primeiro projeto feito assim vira caso e confirma ou corrige a decisão 007.
