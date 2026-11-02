---
name: novo-projeto
description: Use quando a pessoa quer começar um projeto novo do zero com o método de desenvolvimento dela (um site, app, API, automação ou solução com IA) numa pasta vazia, ou quando ela digitar /metodo:novo-projeto seguido do que quer construir.
---

# Novo projeto com o método

**Maturidade:** rascunho (ainda não usada num projeto real; o primeiro uso vira caso no repositório do método)

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
- Pergunte **uma coisa por vez**, só o que faltar: o nome do repositório (minúsculas e hífens), a visibilidade (padrão: privado) e o **Agente principal**: Claude Code (padrão) ou Codex. Explique em uma linha que todas as sessões do projeto (a integradora, os especialistas e as trabalhadoras) vão usar essa ferramenta, nunca as duas (`${CLAUDE_PLUGIN_ROOT}/nucleo/02-sessoes-e-papeis.md`, "Um agente principal por projeto").

## Passo 3 · Uma confirmação para as ações externas

Mostre o plano e espere a resposta:

> Vou criar `<nome>`, `<privado|público>`, no GitHub, com o cenário `<cenário>` (`<maturidade>`), agente principal `<Claude Code|Codex>`, método `<versão>`, nesta pasta. Pode criar?

Sem um "pode" (ou equivalente claro), não siga.

## Passo 4 · Preparação

```bash
git init -b main                                   # se ainda não houver .git
printf '# %s\n' "<nome>" > README.md
printf '.DS_Store\nnode_modules/\n.env\n.env.*\n' > .gitignore
bash "${CLAUDE_PLUGIN_ROOT}/scripts/novo-projeto.sh" . --agente <claude|codex> <cenário>
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
- Pare em cada portão: a spec (com `${CLAUDE_PLUGIN_ROOT}/modelos/modelo-spec.md` e `${CLAUDE_PLUGIN_ROOT}/modelos/modelo-criterios-de-aceite.md`), o plano e o modo de execução, cada merge e o deploy.
- No portão do modo de execução, ofereça também a orquestração com o Orca (modo em rascunho): a coordenadora é a integradora e os agentes são as trabalhadoras, com o prompt `${CLAUDE_PLUGIN_ROOT}/modelos/prompt-coordenadora-orca.md`. Todos os agentes usam o agente principal escolhido no Passo 2. Se o projeto tem back e front em tarefas paralelas, o contrato da API é aprovado antes (`${CLAUDE_PLUGIN_ROOT}/nucleo/02-sessoes-e-papeis.md`, "Um agente principal por projeto").
- Ofereça também o modo com agentes especialistas (rascunho): a integradora coordena especialistas por tema, cada um com o seu harness (`${CLAUDE_PLUGIN_ROOT}/nucleo/02-sessoes-e-papeis.md`, "Com agentes especialistas"). Se a pessoa escolher (o projeto já foi preparado no Passo 3, então não rode o `novo-projeto.sh` de novo: ele recusaria, porque os arquivos já existem), numa branch: crie `docs/agentes/` (só se ainda não existir) e copie para lá cada arquivo de `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/`, menos o `_modelo-harness.md`; acrescente em `docs/DESENVOLVIMENTO.md`, em "Tarefas e sessões", a linha "Com agentes especialistas (modo em rascunho): cada agente lê primeiro o seu harness em `docs/agentes/` e atua dentro dele. A integradora coordena os especialistas, e cada especialista abre as suas trabalhadoras. Exige no Orca: Settings → Orchestration → Nested worker depth = 2."; peça à pessoa que faça esse ajuste no Orca. Num projeto novo que já sabe que vai usar o modo desde o início, o Passo 3 pode rodar `novo-projeto.sh` com `--especialistas`.
- O **primeiro PR depois da spec** ajusta `.github/workflows/ci.yml` à stack escolhida (exemplos no `05`), para o CI rodar testes de verdade.
- A partir do primeiro commit, toda mudança vai numa branch, com PR e CI verde; integre só com a aprovação da pessoa, com `gh pr merge N --merge`, sem apagar a branch.
- Ao fim de cada fase, registre em `docs/memoria-do-projeto.md` onde o trabalho parou e o que foi decidido.
- Para consultar o método depois, nesta ou em outra sessão, use a skill `metodo:consultar`.
