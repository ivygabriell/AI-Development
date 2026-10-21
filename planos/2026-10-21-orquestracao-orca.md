# Modo Orca e atualização de projetos: plano de implementação

> **Para quem executa:** use `superpowers:executing-plans` para seguir este plano tarefa por tarefa. Os passos usam caixas (`- [ ]`) para acompanhar.

**Objetivo:** o método passa a ter o modo de execução "Orca" (coordenadora = integradora, agentes = trabalhadoras) e uma skill que atualiza projetos existentes para a versão atual do método.

**Spec:** [decisão 006](../decisoes/006-desenvolvimento-orquestrado-com-o-orca.md).

## Restrições globais

- Branch `feat/orquestracao-orca`. Nunca commit na `main`, nunca `push --force`. PR com o CI verde; integra só com o "pode integrar".
- Nada é executado em projetos de produto: os projetos existentes são atualizados pela pessoa, dentro deles, com `/metodo:atualizar-projeto`.
- Tudo o que vem do Orca é marcado como `rascunho` (aprovado pela pessoa sem caso real).
- Comandos do Orca conferidos no esquema do próprio CLI (`orca agent-context --json`, versão 1.4.237): `orca orchestration run-create`, `worker-start`, `ask`, `reply`, `check`, `gate-create`, `gate-resolve`, `worker-release`; `orca worktree create`; `orca repo add --path`; `orca search`; `orca skills install --skill orca-cli --skill orchestration`.
- Toda verificação nova em `scripts/verificar.mjs` é escrita antes e vista falhar.
- Versão final `2.4.0`.

## Foco da revisão

1. **Portões:** a coordenadora nunca resolve um portão de merge, deploy ou ação irreversível sem a resposta da pessoa.
2. **Projetos existentes:** `/metodo:atualizar-projeto` nunca sobrescreve nem apaga conteúdo do projeto; só acrescenta, e mostra o plano antes.
3. **CI do projeto:** a atualização não troca o CI que o projeto já tem.
4. **Orca ausente:** sem o Orca instalado, nada do fluxo manual quebra.
5. **Dados pessoais:** caminhos de pasta e nomes de usuário não entram nos arquivos gerados.

---

### Tarefa 1: verificações (vistas falhar)

- [ ] `OBRIGATORIOS`: `modelos/prompt-coordenadora-orca.md`, `skills/atualizar-projeto/SKILL.md`, `decisoes/006-desenvolvimento-orquestrado-com-o-orca.md`.
- [ ] Núcleo: o `02` tem `## Com o Orca`, `coordenadora`, `orchestration worker-start` e `gate-create`; o `01` cita o Orca no portão da Fase 3 e `orca search` na Fase 9; o `05` cita `orca worktree create`.
- [ ] Prompt da coordenadora: `orca skills get orchestration`, `gate-create`, `pode integrar`, `superpowers:verification-before-completion` e as partes da tarefa (objetivo, critérios de aceite, arquivos permitidos e proibidos, testes).
- [ ] Projeto gerado: o `CLAUDE.md` cita o Orca e `/metodo:atualizar-projeto`; o `DESENVOLVIMENTO.md` cita o Orca.
- [ ] Plugin: as três skills existem (`novo-projeto`, `consultar`, `atualizar-projeto`); a de atualização cita o `CHANGELOG.md`, `Pode atualizar?`, `orca repo add` e declara a maturidade `rascunho`; a de início cita `orca repo add`.
- [ ] README: o link `github.com/stablyai/orca`, `orca skills install` e `/metodo:atualizar-projeto`.
- [ ] Rodar `node scripts/verificar.mjs` e ver as falhas.

### Tarefa 2: núcleo e modelos

- [ ] `nucleo/02`: seção `## Com o Orca (rascunho)` com o mapa dos papéis, o ciclo de uma tarefa com os comandos do Orca, as regras que não mudam, o limite inicial e os modos de falha a observar.
- [ ] `nucleo/01`: Fase 3 (modo Orca no portão) e Fase 9 (`orca search`).
- [ ] `nucleo/05`: worktrees pelo Orca.
- [ ] `modelos/prompt-coordenadora-orca.md`: o prompt da coordenadora, com o texto padrão da especificação de cada tarefa.
- [ ] `modelos/CLAUDE-projeto.md` e o `DESENVOLVIMENTO.md` gerado pelo `scripts/novo-projeto.sh`: o modo Orca e a atualização do projeto.

### Tarefa 3: skills

- [ ] `skills/atualizar-projeto/SKILL.md`: conferências, o que mudou desde a versão do projeto, uma referência gerada numa pasta temporária pelo `novo-projeto.sh`, o plano com "Pode atualizar?", a atualização numa branch que só acrescenta, o registro no Orca (com confirmação) e o PR.
- [ ] `skills/novo-projeto/SKILL.md`: registrar o projeto no Orca (com confirmação) e o modo Orca na Fase 3.
- [ ] `skills/consultar/SKILL.md`: linhas para o modo Orca e para a atualização.
- [ ] `claude plugin validate .` passa.

### Tarefa 4: documentação e versão

- [ ] README: o Orca na tabela e nos passos de "Antes de começar", e a seção "Atualizar um projeto que já usa o método".
- [ ] Caso do repositório do método: a decisão 006 nas mudanças propostas, aprovada sem caso.
- [ ] `CHANGELOG.md` e `VERSION` 2.4.0.

### Tarefa 5: fechamento

- [ ] `node scripts/verificar.mjs` e `claude plugin validate .` verdes; push e PR; integrar só com o "pode integrar".
- [ ] Depois do merge: em cada computador, `/plugin marketplace update metodo-de-desenvolvimento`; em cada projeto existente, `/metodo:atualizar-projeto`.
- [ ] O primeiro projeto feito com o Orca vira caso e confirma ou corrige a decisão 006.
