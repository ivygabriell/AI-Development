---
name: atualizar-projeto
description: Use quando a pessoa quer trazer um projeto que já existe (preparado ou não pelo método) para a versão atual do método de desenvolvimento, quando o CLAUDE.md do projeto mostra uma Versão do método mais antiga que a instalada, ou quando ela digitar /metodo:atualizar-projeto.
---

# Atualizar um projeto para a versão atual do método

Responda em português. Pronomes não declarados: use o neutro. Diga qual Skill está usando a cada passo. A cópia do método fica em `${CLAUDE_PLUGIN_ROOT}` e é **só leitura**. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`: use esse caminho no lugar dele. No projeto, a regra é **só acrescentar**: nunca apague nem sobrescreva conteúdo do projeto (comandos, decisões, regras próprias, CI).

## Passo 1 · Conferências (só leitura)

Pare e explique o que falta se:

- a pasta atual não é um repositório Git, ou é o próprio repositório do método (tem `.claude-plugin/marketplace.json` com o marketplace `metodo-de-desenvolvimento`);
- há mudanças não salvas (`git status --porcelain` não está vazio) ou a `main` local não está em dia com a remota;
- `gh auth status` não mostra uma conta autenticada.

Leia a versão instalada em `${CLAUDE_PLUGIN_ROOT}/VERSION`. Lembre à pessoa que, se o método mudou há pouco, o plugin precisa estar atualizado neste computador (`/plugin marketplace update metodo-de-desenvolvimento`).

Leia a versão do projeto na linha `Versão do método:` do `CLAUDE.md` ou do `docs/DESENVOLVIMENTO.md`. Se nenhuma existir, o projeto nunca foi preparado pelo método: trate a versão como "nenhuma" e diga isso à pessoa.

## Passo 2 · O que mudou

Leia, em `${CLAUDE_PLUGIN_ROOT}/CHANGELOG.md`, as seções das versões mais novas que a do projeto e resuma para a pessoa, em poucas linhas, só o que afeta este projeto (por exemplo, o modo Orca da 2.4.0: `${CLAUDE_PLUGIN_ROOT}/nucleo/02-sessoes-e-papeis.md`, seção "Com o Orca").

## Passo 3 · Referência e plano

Gere uma referência numa pasta temporária, com o cenário do projeto (da linha "Cenários aplicados" do `docs/DESENVOLVIMENTO.md`; se não houver, pergunte à pessoa ou rode sem cenário):

```bash
ref="$(mktemp -d)"
bash "${CLAUDE_PLUGIN_ROOT}/scripts/novo-projeto.sh" "$ref" [--agente <claude|codex>] <cenário>
```

Sem `--agente`, a referência traz a Lead e a tabela **Ferramenta por papel** do método 4.0.0 (as duas ferramentas: a Lead, Product, Architect e Frontend no Claude Code; Backend, Security e Ops no Codex). Use `--agente <claude|codex>` só se a pessoa quiser uma ferramenta só (veja a tabela abaixo).

Se o projeto usa o modo com agentes especialistas (tem `docs/agentes/`, ou a pessoa disse que sim), gere a referência com `--especialistas` depois de `"$ref"`, para ela trazer os harnesses e a linha do modo no `DESENVOLVIMENTO.md`.

Compare cada arquivo da referência com o do projeto e monte o plano, arquivo por arquivo:

| Situação | O que fazer |
|---|---|
| O arquivo falta no projeto | Copiar da referência (`CLAUDE.md`, `AGENTS.md`, `docs/DESENVOLVIMENTO.md`, `docs/memoria-do-projeto.md`, `.github/ISSUE_TEMPLATE/tarefa.yml`, `.github/ISSUE_TEMPLATE/bug.yml`, `.github/pull_request_template.md`, `scripts/nova-tarefa.sh`, `scripts/remover-tarefa.sh`) |
| O projeto não tem nenhum CI em `.github/workflows/` | Copiar o `ci.yml` da referência |
| O projeto já tem CI | Não mexer |
| `CLAUDE.md` existe | Atualizar só a linha `Versão do método:` (ou acrescentá-la); acrescentar `@docs/DESENVOLVIMENTO.md` e `@docs/memoria-do-projeto.md` se faltarem; acrescentar, numa seção `## Método de desenvolvimento`, as regras da referência que o arquivo ainda não tem |
| `AGENTS.md` existe | Atualizar só a linha `Versão do método:` (ou acrescentá-la) e acrescentar, numa seção `## Método de desenvolvimento`, a leitura do `CLAUDE.md`, do `docs/DESENVOLVIMENTO.md` e da memória e as regras da referência que faltarem |
| `docs/DESENVOLVIMENTO.md` existe | Atualizar a versão e acrescentar as regras e as linhas de "Tarefas e sessões" que faltarem, mantendo os comandos e as decisões do projeto |
| `docs/memoria-do-projeto.md` existe | Acrescentar uma entrada: "Atualizado para o método `<versão>` em `<data>`: `<o que mudou>`" |
| O `docs/DESENVOLVIMENTO.md` tem a linha `Agente principal:` (método 3.x) ou não tem a linha `Lead:` | Explique que a 4.0.0 (decisão 013 do método) usa o Claude Code e o Codex juntos, com a Lead no Claude Code e uma ferramenta padrão por papel, e pergunte se a pessoa quer as duas (o padrão) ou uma só. Troque a linha `Agente principal:` (ou, de antes da 3.0.0, a linha "Back com o Codex e front com o Claude" de "Tarefas e sessões") pela linha `Lead:` da referência, logo depois de `Versão do método:`, e acrescente a seção `## Ferramenta por papel` da referência. **Exceção 1** à regra "só acrescentar": é a única linha de regra que sai |
| O `CLAUDE.md`, o `AGENTS.md` ou o `docs/DESENVOLVIMENTO.md` ainda têm a regra herdada de uma ferramenta só ("nunca as duas", "um agente principal", "todas as sessões usam a mesma", "Se diz Claude Code, você não deveria estar trabalhando aqui") | Não basta acrescentar: liste cada cláusula à pessoa ao lado da regra da referência que a substitui (a linha `Lead:` e a tabela Ferramenta por papel) e, com o "sim" dela, troque só essas frases, mantendo o resto do arquivo e as personalizações. Sem a troca, o projeto continuaria proibindo as duas ferramentas |
| Falta a seção `## Aprovações` no `docs/DESENVOLVIMENTO.md` | Acrescentar a seção `## Aprovações` da referência (os seis gatilhos; sem gatilho, a Lead decide e registra) e avisar a pessoa que os merges sem gatilho passam a ser integrados pela Lead |
| Falta `docs/requisitos.md`, `docs/telas/` ou a linha `Telas:` (método anterior à 5.0.0) | Copiar da referência `docs/requisitos.md` e `docs/telas/README.md`, cada um só se faltar (o que já existe não é tocado), e acrescentar a linha `Telas:` logo depois da linha `Lead:` do `docs/DESENVOLVIMENTO.md`, se faltar. Nos formulários e no modelo de PR que o projeto já tem, acrescentar o que falta da referência: o campo `id: requisitos` em `.github/ISSUE_TEMPLATE/tarefa.yml` e `bug.yml` e, no `.github/pull_request_template.md`, a linha "Requisitos atendidos" e a conferência com `docs/telas/`, sem mexer nos campos do projeto. Explique que a 5.0.0 (decisão 015 do método) exige os requisitos descritos e, com interface, a identidade e todas as telas aprovadas no Figma antes do código; num projeto já construído, pergunte se a pessoa quer descrever os requisitos e registrar as telas que já existem agora ou a partir da próxima funcionalidade. Nunca apague telas, specs ou critérios que o projeto já tem |
| `docs/agentes/` tem harnesses com os nomes de antes da 4.0.0 | **Exceção 2** à regra "só acrescentar": renomear cada um com `git mv`, mantendo o conteúdo (e qualquer personalização do projeto), pela tabela abaixo. Depois, listar a diferença entre o harness renomeado e o modelo novo da referência para a pessoa decidir se troca; nunca sobrescrever |
| O projeto não tem `docs/agentes/` e a memória não diz o modo de execução | Pergunte se o projeto usa o modo com especialistas; só com o "sim", siga a linha abaixo |
| O projeto usa o modo com especialistas e falta a linha dele em `docs/DESENVOLVIMENTO.md` | Acrescentar em "Tarefas e sessões" a linha da referência gerada com `--especialistas` (cada agente lê o seu harness em `docs/agentes/`; exige no Orca Settings → Orchestration → Nested worker depth = 2) |
| O projeto escolheu o modo com especialistas e falta `docs/agentes/` ou um harness | Copiar de `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/` os harnesses que faltam, sem o `_modelo-harness.md`; um harness que o projeto já tem não é trocado: listar a diferença para a pessoa decidir |
| Uma regra da referência contradiz uma decisão do projeto | Não trocar: listar para a pessoa decidir |

Nomes dos harnesses (decisão 013 do método):

| Antes | Depois |
|---|---|
| `integradora.md` | `lead.md` |
| `arquitetura.md` | `architect.md` |
| `back-e-dados.md` | `backend.md` |
| `design-e-front.md` | `frontend.md` |
| `seguranca.md` | `security.md` |
| `produto.md` | `product.md` |
| `devops.md` | `ops.md` |

O mesmo vale para `docs/referencias/<tema>.md`, se o projeto tiver: renomeie pela mesma tabela. O `docs/seguranca.md` (o mapa de riscos do projeto) **não** muda de nome.

Se o Orca estiver instalado (`orca status` responde) e o projeto não aparecer em `orca repo list`, inclua no plano registrar o projeto com `orca repo add --path .` (muda a configuração do Orca, não o repositório).

Mostre o plano e espere a resposta:

> Vou atualizar este projeto do método `<versão do projeto>` para o `<versão instalada>`, numa branch `chore/metodo-<versão instalada>`, com estas mudanças: `<lista>`. Nada do projeto é apagado nem sobrescrito. Pode atualizar?

Sem um "pode" (ou equivalente claro), não siga.

## Passo 4 · Atualizar

1. `git switch -c chore/metodo-<versão instalada>` a partir da `main` atualizada.
2. Aplique o plano. Antes do commit, mostre `git diff --stat` e confira que nenhuma linha do projeto foi removida (`git diff` sem linhas começando com `-` além da linha da versão, da linha `Agente principal:` (ou "Back com o Codex e front com o Claude") trocada pela linha `Lead:`, dos harnesses renomeados com `git mv` (o `git diff -M` os mostra como renomeados, sem conteúdo removido) e dos harnesses que a pessoa mandou trocar).
3. `git commit -m "chore: atualiza para o método <versão instalada>"`.
4. Com a confirmação da pessoa: envie a branch e abra o PR com o modelo do projeto, listando o que mudou e o que ficou para ela decidir.
5. Integre só com o "pode integrar" (`gh pr merge N --merge`, sem apagar a branch) e confira o CI da `main`.
6. Se o plano incluía o Orca e a pessoa confirmou, rode `orca repo add --path .`.
7. Apague só a pasta temporária `"$ref"` que você criou.

Qualquer falha: **pare**, mostre a saída e explique. Nunca force nem contorne nada.
