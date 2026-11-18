---
name: novo-projeto
description: Use quando a pessoa quer começar um projeto novo do zero com o método de desenvolvimento dela (um site, app, API, automação ou solução com IA) numa pasta vazia, ou quando ela digitar /metodo:novo-projeto seguido do que quer construir.
---

# Novo projeto com o método

Responda em português. Pronomes não declarados: use o neutro. Diga qual Skill está usando a cada passo. A cópia do método fica em `${CLAUDE_PLUGIN_ROOT}` e é **só leitura**: nunca altere nada nela. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`: use esse caminho no lugar dele.

## Passo 1 · Conferências (só leitura)

Pare e explique o que falta se:

- a pasta atual não está vazia (ignore `.DS_Store` e uma pasta `.git` sem commits);
- `git --version` falha (no macOS, pode ser a licença do Xcode: `sudo xcodebuild -license`);
- `gh auth status` não mostra uma conta autenticada;
- as skills do Superpowers não estão disponíveis (`/plugin install superpowers@claude-plugins-official`).

Leia a versão em `${CLAUDE_PLUGIN_ROOT}/VERSION`, as fases em `${CLAUDE_PLUGIN_ROOT}/nucleo/01-fluxo-de-ponta-a-ponta.md` e os cenários em `${CLAUDE_PLUGIN_ROOT}/cenarios/README.md`.

## Passo 2 · Entender o mínimo

- Classifique o pedido em voz alta: um projeto novo é **arquitetural**.
- Proponha o cenário (um arquivo de `${CLAUDE_PLUGIN_ROOT}/cenarios/`) com o selo de maturidade. Se for `rascunho`, diga que ele é hipótese, não regra.
- Pergunte **uma coisa por vez**, só o que faltar: o nome do repositório (minúsculas e hífens), a visibilidade (padrão: privado) e a **Ferramenta por papel**: o padrão usa as duas (a Lead, Product, Architect e Frontend no Claude Code; Backend, Security e Ops no Codex), ou uma só, se a pessoa preferir (`--agente claude` ou `--agente codex`). Explique em uma linha que a Builder vai para a outra ferramenta quando a cota aperta (`${CLAUDE_PLUGIN_ROOT}/nucleo/02-sessoes-e-papeis.md`, "Lead e ferramenta por papel").

## Passo 3 · Uma confirmação para as ações externas

Mostre o plano e espere a resposta:

> Vou criar `<nome>`, `<privado|público>`, no GitHub, com o cenário `<cenário>` (`<maturidade>`), ferramentas `<Claude Code e Codex por papel|só Claude Code|só Codex>`, método `<versão>`, nesta pasta. Pode criar?

Sem um "pode" (ou equivalente claro), não siga.

## Passo 4 · Preparação

```bash
git init -b main                                   # se ainda não houver .git
printf '# %s\n' "<nome>" > README.md
printf '.DS_Store\nnode_modules/\n.env\n.env.*\n' > .gitignore
bash "${CLAUDE_PLUGIN_ROOT}/scripts/novo-projeto.sh" . [--agente <claude|codex>] <cenário>
git config user.email                              # se não terminar em users.noreply.github.com, avise e sugira o noreply; só troque com um "sim"
```

Se o repositório for **privado**, acrescente ao `CLAUDE.md` gerado, antes do primeiro commit:

```markdown
- **A `main` não tem proteção no GitHub** (repositório privado em conta gratuita; lição 019 do método). A regra "nunca commit direto na `main`" vale pela disciplina das sessões.
```

Depois:

```bash
git add -A && git commit -m "chore: estrutura inicial com o método <versão>"
gh repo create <nome> --private --source . --push  # --public se a pessoa escolheu
gh run list --limit 1 --json databaseId --jq '.[0].databaseId'   # repita até aparecer; então:
gh run watch <id> --exit-status
```

O primeiro CI passa com o aviso "stack ainda não definida": é o esperado. Se o repositório for **público**, ative a proteção da `main` como em `${CLAUDE_PLUGIN_ROOT}/nucleo/05-git-github-e-ci.md` (o check se chama "Testes, tipos e build") e leia de volta para confirmar.

Se o Orca estiver instalado (`orca status` responde), pergunte se a pessoa quer registrar o projeto nele e, com o "sim", rode `orca repo add --path .`.

Qualquer falha: **pare**, mostre a saída e explique. Nunca apague, force ou contorne nada.

## Passo 5 · Fase 0 em diante

- Invoque `superpowers:brainstorming` com a descrição da pessoa e siga as fases de `${CLAUDE_PLUGIN_ROOT}/nucleo/01-fluxo-de-ponta-a-ponta.md`.
- Pare em cada portão: os requisitos (com `${CLAUDE_PLUGIN_ROOT}/modelos/modelo-requisitos.md`, em `docs/requisitos.md`), com interface a identidade e todas as telas no Figma registradas em `docs/telas/` (Fase 2 do núcleo 01), a spec (com `${CLAUDE_PLUGIN_ROOT}/modelos/modelo-spec.md` e `${CLAUDE_PLUGIN_ROOT}/modelos/modelo-criterios-de-aceite.md`), o plano e o modo de execução, o deploy e o que aciona um gatilho de aprovação (núcleo 01, "Portões de aprovação").
- No portão do modo de execução, ofereça também a orquestração com o Orca: a Lead coordena e os agentes são as Builders, com o prompt `${CLAUDE_PLUGIN_ROOT}/modelos/prompt-lead-orca.md`. Cada agente usa a ferramenta do seu papel (Passo 2). Se o projeto tem back e front em tarefas paralelas, o contrato da API é aprovado antes (`${CLAUDE_PLUGIN_ROOT}/nucleo/02-sessoes-e-papeis.md`, "Lead e ferramenta por papel").
- Ofereça também o modo com agentes especialistas: a Lead coordena especialistas por tema, cada um com o seu harness (`${CLAUDE_PLUGIN_ROOT}/nucleo/02-sessoes-e-papeis.md`, "Com agentes especialistas"). Se a pessoa escolher (o projeto já foi preparado no Passo 3, então não rode o `novo-projeto.sh` de novo: ele recusaria, porque os arquivos já existem), numa branch: crie `docs/agentes/` (só se ainda não existir) e copie para lá cada arquivo de `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/`, menos o `_modelo-harness.md`; acrescente em `docs/DESENVOLVIMENTO.md`, em "Tarefas e sessões", a linha "Com agentes especialistas: cada agente lê primeiro o seu harness em `docs/agentes/` e atua dentro dele. A Lead coordena os especialistas, e cada especialista abre as suas Builders. Exige no Orca: Settings → Orchestration → Nested worker depth = 2."; peça à pessoa que faça esse ajuste no Orca. Num projeto novo que já sabe que vai usar o modo desde o início, o Passo 3 pode rodar `novo-projeto.sh` com `--especialistas`.
- O **primeiro PR depois da spec** ajusta `.github/workflows/ci.yml` à stack escolhida (exemplos no `05`), para o CI rodar testes de verdade.
- A partir do primeiro commit, toda mudança vai numa branch, com PR e CI verde; integre pelos gatilhos de aprovação (núcleo 01, "Portões de aprovação"): sem gatilho, a Lead integra; com gatilho, só com o "pode integrar" da pessoa. Sempre com `gh pr merge N --merge`, sem apagar a branch.
- Ao fim de cada fase, registre em `docs/memoria-do-projeto.md` onde o trabalho parou e o que foi decidido.
- Para consultar o método depois, nesta ou em outra sessão, use a skill `metodo:consultar`.
