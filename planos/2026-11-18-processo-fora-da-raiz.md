# Processo fora da raiz do projeto: plano de implementação

> **Para quem executa:** use `superpowers:subagent-driven-development` (recomendado) ou `superpowers:executing-plans`, tarefa por tarefa. Os passos usam caixas `- [ ]`.

**Objetivo:** um projeto criado pelo método passa a ter o processo (antes em `docs/` e `scripts/`) reunido em `processo/`, e a raiz fica só com `README.md`, `CLAUDE.md`, `AGENTS.md`, `.github/`, `processo/` e o código.

**Arquitetura:** troca de caminho um por um (`docs/X` → `processo/X`; `scripts/nova-tarefa.sh` e `remover-tarefa.sh` → `processo/scripts/`), feita por regra fechada de substituição e conferida pelo `scripts/verificar.mjs`, que falha antes e passa depois. Projetos já criados migram pela skill `atualizar-projeto`.

**Tecnologia:** bash, Node (sem dependências), `perl -pi` para a substituição.

**Desenho:** [2026-11-18-processo-fora-da-raiz-desenho.md](2026-11-18-processo-fora-da-raiz-desenho.md) (aprovado em 2026-11-18).

## Restrições globais

- Branch `feat/processo-fora-da-raiz`; nunca commit na `main`. Commits terminam com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; o PR termina com `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
- Substituição só pela **lista fechada**: `docs/(DESENVOLVIMENTO|memoria-do-projeto|requisitos|telas|agentes|referencias|seguranca|contrato-api|arquitetura|specs?)` e `scripts/(nova|remover)-tarefa`. Nunca troque `docs/` solto: ele também é o prefixo de branch de documentação (`feat|fix|chore|docs`) e aparece em links externos (`docs/current/`, `docs/Web/`).
- Histórico não muda: `casos/`, `licoes/`, `planos/`, `decisoes/` (menos a 016) e `CHANGELOG.md` (menos a entrada nova).
- `skills/atualizar-projeto/SKILL.md` fica **fora** da substituição: ele precisa citar os dois caminhos (o antigo, de projetos 5.x, e o novo).
- Zero dado pessoal em arquivos e mensagens. Versão nova: **6.0.0**; decisão **016**.
- Não integre o PR: a pessoa aprova a cada mudança.

## Foco da revisão

1. Projeto antigo com `docs/` do **produto** (por exemplo `docs/api.md` próprio): a migração só move os itens listados, nunca a pasta inteira. Teste: a skill diz "só os itens listados" e manda manter o resto.
2. Prefixo de branch `docs/` e tipo `docs` do `nova-tarefa.sh`: continuam como estão. Teste: `nucleo/05` ainda tem "`docs/` (documentação)" e o script ainda aceita `docs`.
3. Projeto 5.x que roda `/metodo:atualizar-projeto`: a skill acha a versão em `docs/DESENVOLVIMENTO.md` **ou** em `processo/DESENVOLVIMENTO.md`.
4. Rodar a substituição duas vezes gera `processo/processo/`. Teste: nenhum `processo/processo` no repositório.
5. `novo-projeto.sh` numa pasta que já tem `processo/`: recusa e lista os conflitos, sem sobrescrever. Teste: segunda execução falha e cita `processo/DESENVOLVIMENTO.md`.

---

### Tarefa 1: Verificações que falham primeiro

**Arquivos:**
- Modificar: `scripts/verificar.mjs` (bloco `novo-projeto.sh` perto da linha 560 e um bloco novo antes de `// Resultado`)
- Commitar junto: `planos/2026-11-18-processo-fora-da-raiz-desenho.md` e este plano

**Interfaces:**
- Produz: os checks `016:` que as tarefas 2 a 4 deixam verdes.

- [ ] **Passo 1: atualizar a lista de arquivos esperados do `novo-projeto.sh`** (linha da lista que vai de `'CLAUDE.md'` a `'docs/memoria-do-projeto.md'`): trocar `scripts/nova-tarefa.sh`, `scripts/remover-tarefa.sh`, `docs/DESENVOLVIMENTO.md` e `docs/memoria-do-projeto.md` por `processo/scripts/nova-tarefa.sh`, `processo/scripts/remover-tarefa.sh`, `processo/DESENVOLVIMENTO.md` e `processo/memoria-do-projeto.md`; acrescentar `processo/requisitos.md` e `processo/telas/README.md`. Não use a substituição em massa aqui: a tarefa 2 cuida do resto do arquivo.
- [ ] **Passo 2: dentro do bloco `novo-projeto.sh`, depois da lista, acrescentar:**
  - `checar('016: a raiz do projeto novo só tem .github, AGENTS.md, CLAUDE.md e processo', JSON.stringify(readdirSync(alvo).sort()) === JSON.stringify(['.github', 'AGENTS.md', 'CLAUDE.md', 'processo']), readdirSync(alvo).join(','))`
  - `checar('016: o CLAUDE.md do projeto importa @processo/DESENVOLVIMENTO.md e @processo/memoria-do-projeto.md e diz que a raiz é do código', ...)`, lendo o `CLAUDE.md` gerado e exigindo as duas importações e a frase `a raiz é do código`.
  - `checar('016: segunda execução recusa e cita processo/DESENVOLVIMENTO.md sem sobrescrever', ...)`: rodar `novo-projeto.sh` de novo na mesma pasta; esperar `status !== 0` e `stderr` com `processo/DESENVOLVIMENTO.md`.
  - Um check com `--especialistas` numa pasta nova: existe `processo/agentes/lead.md`.
- [ ] **Passo 3: bloco novo antes de `// Resultado`**, começando com `// Decisão 016: o processo mora em processo/; a raiz do projeto é do código`:
  - Regex `/\bdocs\/(DESENVOLVIMENTO|memoria-do-projeto|requisitos|telas|agentes|referencias|seguranca|contrato-api|arquitetura|specs?)\b|\bscripts\/(nova|remover)-tarefa/` (escrita com `\/`, para a substituição da tarefa 2 não a reescrever). `checar('016: nenhum caminho antigo fora do histórico', ...)` sobre `ARQUIVOS_VIVOS`, ignorando só as linhas de `skills/atualizar-projeto/SKILL.md` que também contêm `processo/`.
  - `checar('016: nenhum processo/processo', ...)` sobre `ARQUIVOS_VIVOS`.
  - `checar('016: o prefixo de branch docs/ continua em nucleo/05', ler('nucleo/05-git-github-e-ci.md').includes('`docs/` (documentação)'))` e `checar('016: nova-tarefa.sh ainda aceita o tipo docs', ler('modelos/nova-tarefa.sh').includes('feat|fix|chore|docs'))`.
  - `checar('016: VERSION é 6.0.0', versao === '6.0.0')` (usar a variável `versao` já lida pelo arquivo; se não existir no escopo, `ler('VERSION').trim()`).
  - `checar('016: decisão 016 existe e o CHANGELOG tem a 6.0.0', existsSync(...'decisoes/016-processo-fora-da-raiz.md') && ler('CHANGELOG.md').includes('## 6.0.0'))`.
  - `skills/atualizar-projeto`: `checar('016: a skill migra docs/ e scripts/ para processo/', ...)` exigindo `git mv`, `processo/scripts/`, `só os itens listados`, `processo/DESENVOLVIMENTO.md` e `docs/DESENVOLVIMENTO.md` (os dois, para ler a versão de projetos 5.x).
- [ ] **Passo 4: rodar e ver falhar.** `node scripts/verificar.mjs 2>&1 | tail -30`. Esperado: vários `✗` com `016:` e os arquivos novos faltando; o resto continua verde. Se algum check `016:` passar agora, ele não testa nada: corrija.
- [ ] **Passo 5: commit.** `git add scripts/verificar.mjs planos/2026-11-18-processo-fora-da-raiz*.md && git commit -m "test: verificações da mudança do processo para processo/ (decisão 016, vistas falhar)"` (com a linha `Co-Authored-By`).

### Tarefa 2: Trocar os caminhos nos modelos, no script, no núcleo, nas skills e no README

**Arquivos:**
- Modificar (por substituição): `modelos/**`, `nucleo/*.md`, `skills/**/SKILL.md` **menos** `skills/atualizar-projeto/SKILL.md`, `cenarios/*.md`, `README.md`, `CLAUDE.md`, `scripts/novo-projeto.sh`, `scripts/verificar.mjs`
- Modificar à mão: `modelos/CLAUDE-projeto.md` (a frase nova) e `scripts/novo-projeto.sh` (aviso de conflito e ajuda)

**Interfaces:**
- Consome: os checks da tarefa 1.
- Produz: caminhos `processo/...` em todo arquivo vivo; o `novo-projeto.sh` gera a estrutura nova.

- [ ] **Passo 1: substituição, uma única vez** (rodar duas vezes gera `processo/processo`):

```bash
arqs=$(git ls-files modelos nucleo skills cenarios README.md CLAUDE.md scripts/novo-projeto.sh scripts/verificar.mjs | grep -v '^skills/atualizar-projeto/SKILL.md$')
perl -pi -e 's{\bdocs/(DESENVOLVIMENTO|memoria-do-projeto|requisitos|telas|agentes|referencias|seguranca|contrato-api|arquitetura|specs?)\b}{processo/$1}g; s{\bscripts/(nova|remover)-tarefa}{processo/scripts/$1-tarefa}g' $arqs
```

- [ ] **Passo 2: conferir o que sobrou.** `grep -rn 'docs/' $arqs` e ler cada linha: só podem restar o prefixo de branch (`nucleo/05`, `nova-tarefa.sh`), os links externos e menções à **pasta** `docs/` solta ("a pasta `docs/`", "docs/ do projeto"). Reescreva as menções soltas para `processo/` à mão. Confirme `grep -rn 'processo/processo' .` vazio.
- [ ] **Passo 3: texto novo à mão.**
  - `modelos/CLAUDE-projeto.md`: acrescentar, junto das importações, uma linha: tudo do processo fica em `processo/`; **a raiz é do código**, e quem cria documentação do produto usa a própria pasta (`docs/`), que não é do método.
  - `scripts/novo-projeto.sh`: o `AVISO` do `CLAUDE.md` existente cita `@processo/DESENVOLVIMENTO.md` e `@processo/memoria-do-projeto.md`; o cabeçalho de ajuda diz "cria `processo/`".
- [ ] **Passo 4: rodar.** `node scripts/verificar.mjs 2>&1 | tail -30`. Esperado: todos os `016:` verdes **menos** os da skill `atualizar-projeto`, de `VERSION` e de decisão/CHANGELOG (tarefas 3 e 4). Nenhum `✗` fora dessa lista.
- [ ] **Passo 5: commit.** `git add -A && git commit -m "feat: o processo do projeto mora em processo/ (modelos, script, núcleo, skills e README)"`.

### Tarefa 3: Migração na skill `atualizar-projeto`

**Arquivos:**
- Modificar: `skills/atualizar-projeto/SKILL.md` (Passo 1, Passo 3 e a tabela do Passo 4)

**Interfaces:**
- Consome: a lista fechada de itens do método (restrições globais).
- Produz: o passo de migração que os checks `016:` da skill procuram.

- [ ] **Passo 1: Passo 1 e Passo 3 leem os dois caminhos.** Onde a skill lê `docs/DESENVOLVIMENTO.md` (versão, cenários, `docs/agentes/`), passar a ler `processo/DESENVOLVIMENTO.md` e, se não existir, `docs/DESENVOLVIMENTO.md` (projeto 5.x).
- [ ] **Passo 2: nova linha na tabela do Passo 4**, para projeto cuja versão é anterior à 6.0.0 e que tem `docs/DESENVOLVIMENTO.md`: explicar à pessoa a mudança (a raiz do projeto fica só com o código e os arquivos que as ferramentas exigem) e, com o "sim" dela, numa branch, rodar `git mv` **só dos itens listados**: `docs/DESENVOLVIMENTO.md`, `docs/memoria-do-projeto.md`, `docs/requisitos.md`, `docs/telas`, `docs/agentes`, `docs/referencias`, `docs/seguranca.md`, `docs/contrato-api.md`, `docs/arquitetura.md`, `docs/specs` para `processo/`, e `scripts/nova-tarefa.sh` e `scripts/remover-tarefa.sh` para `processo/scripts/`. Tudo o mais em `docs/` e `scripts/` é do produto e fica onde está. Depois trocar os caminhos antigos em `CLAUDE.md`, `AGENTS.md`, `.github/` e nos próprios arquivos movidos, conferir com `grep`, abrir PR e esperar o portão da pessoa. Se `processo/` já existir, parar e perguntar.
- [ ] **Passo 3: rodar** `node scripts/verificar.mjs 2>&1 | tail -20`. Esperado: os checks `016:` da skill verdes; a "regra fechada" continua verde (as linhas que citam o caminho antigo também têm `processo/`).
- [ ] **Passo 4: commit.** `git add skills/atualizar-projeto/SKILL.md && git commit -m "feat: atualizar-projeto migra docs/ e scripts/ para processo/"`.

### Tarefa 4: Decisão, versão, changelog e núcleo

**Arquivos:**
- Criar: `decisoes/016-processo-fora-da-raiz.md` (a partir de `decisoes/_modelo-decisao.md`, se existir; senão, no formato da 015)
- Modificar: `VERSION` (`6.0.0`), `CHANGELOG.md` (entrada `## 6.0.0` no topo), `scripts/verificar.mjs` (`OBRIGATORIOS` ganha a decisão 016), `nucleo/01-fluxo-de-ponta-a-ponta.md` ou `nucleo/05-git-github-e-ci.md` (uma seção curta "Estrutura do projeto": a raiz e `processo/`)

- [ ] **Passo 1: a decisão 016** diz: o quê (o processo em `processo/`), por quê (a raiz poluída, pedido da pessoa de 2026-11-18), as três abordagens, que entra sem caso real por pedido explícito (como 013 a 015), que as decisões e os casos anteriores mantêm `docs/` por serem histórico, e como projetos antigos migram.
- [ ] **Passo 2: `VERSION` e `CHANGELOG.md`.** A entrada 6.0.0 lista: nova estrutura, scripts em `processo/scripts/`, migração na `atualizar-projeto` e a decisão 016.
- [ ] **Passo 3: seção "Estrutura do projeto" no núcleo**, com a árvore da raiz (`README.md`, `CLAUDE.md`, `AGENTS.md`, `.github/`, `processo/`, código) e a frase de que a pasta `docs/` fica livre para a documentação do produto.
- [ ] **Passo 4: gerar o índice e rodar.** `node scripts/gerar-indice-licoes.mjs && node scripts/verificar.mjs 2>&1 | tail -8`. Esperado: `✓ N verificações passaram.` sem nenhum `✗`.
- [ ] **Passo 5: commit.** `git add -A && git commit -m "feat: decisão 016 e versão 6.0.0 (processo fora da raiz do projeto)"`.

### Tarefa 5: Verificação final e PR

- [ ] **Passo 1: `superpowers:verification-before-completion`.** Rodar `node scripts/verificar.mjs` e `grep -rn 'processo/processo' .` (vazio); gerar um projeto de teste numa pasta temporária (`scripts/novo-projeto.sh <pasta> site-estatico --especialistas`) e listar a raiz: só `.github`, `AGENTS.md`, `CLAUDE.md`, `processo`.
- [ ] **Passo 2: revisão do Codex**, como nas versões 4.0.0 e 5.0.0: `codex exec -s read-only "<revise o diff de main..HEAD contra o desenho em planos/2026-11-18-processo-fora-da-raiz-desenho.md e aponte caminho antigo, link quebrado e a migração>" < /dev/null`. Corrigir o que for achado e repetir o passo 1.
- [ ] **Passo 3: PR.** Confirmar com a pessoa antes do `git push`; preencher `.github/pull_request_template.md`; esperar o CI "Verificar o método" verde; integrar **só** com a aprovação dela (`gh pr merge N --merge`, sem apagar a branch). Depois, `superpowers:finishing-a-development-branch`.
