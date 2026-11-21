---
name: consultar
description: Use quando uma sessão de projeto precisar das regras do método de desenvolvimento (fases, portões, sessões, Skills, testes, Git e CI, cenários, lições ou modelos de spec, critérios de aceite, issue e PR), ou quando o CLAUDE.md do projeto mandar consultar o método.
---

# Consultar o método

A cópia do método fica em `${CLAUDE_PLUGIN_ROOT}` e é **só leitura**: leia, nunca altere. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`: use esse caminho no lugar dele. A versão está em `${CLAUDE_PLUGIN_ROOT}/VERSION`; compare com a "Versão do método" do `CLAUDE.md` do projeto e, se forem diferentes, avise a pessoa antes de aplicar uma regra nova.

| Preciso de | Leia |
|---|---|
| As fases, os portões e a classificação do pedido | `${CLAUDE_PLUGIN_ROOT}/nucleo/01-fluxo-de-ponta-a-ponta.md` |
| Uma sessão ou várias (Lead e Builders) | `${CLAUDE_PLUGIN_ROOT}/nucleo/02-sessoes-e-papeis.md` |
| Qual Skill usar; testes micro e macro; navegador | `${CLAUDE_PLUGIN_ROOT}/nucleo/03-skills-e-testes.md` |
| Estudar uma referência externa | `${CLAUDE_PLUGIN_ROOT}/nucleo/04-referencias-e-engenharia-reversa.md` |
| Branches, PR, CI, proteção da `main`, worktrees | `${CLAUDE_PLUGIN_ROOT}/nucleo/05-git-github-e-ci.md` |
| O cenário do projeto (checklist e skills úteis) | `${CLAUDE_PLUGIN_ROOT}/cenarios/README.md` e o arquivo do cenário ao lado dele |
| Erros já cometidos e a regra de cada um | `${CLAUDE_PLUGIN_ROOT}/licoes/_indice.md` |
| Descrever os requisitos (fichas R-xx com o peso) | `${CLAUDE_PLUGIN_ROOT}/modelos/modelo-requisitos.md` e a Fase 2 de `${CLAUDE_PLUGIN_ROOT}/nucleo/01-fluxo-de-ponta-a-ponta.md` |
| A identidade e as telas no Figma, o registro em `processo/telas/` | A Fase 2 de `${CLAUDE_PLUGIN_ROOT}/nucleo/01-fluxo-de-ponta-a-ponta.md` e `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/designer.md` (quem desenha) e `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/frontend.md` (quem constrói) |
| Escrever a spec e os critérios de aceite | `${CLAUDE_PLUGIN_ROOT}/modelos/modelo-spec.md` e `${CLAUDE_PLUGIN_ROOT}/modelos/modelo-criterios-de-aceite.md` |
| Abrir sessões paralelas | `${CLAUDE_PLUGIN_ROOT}/modelos/prompt-lead.md` e `${CLAUDE_PLUGIN_ROOT}/modelos/prompt-builder.md` |
| Orquestrar com o Orca (Lead e agentes) | `${CLAUDE_PLUGIN_ROOT}/nucleo/02-sessoes-e-papeis.md` (seção "Com o Orca") e `${CLAUDE_PLUGIN_ROOT}/modelos/prompt-lead-orca.md` |
| Qual ferramenta usar (Claude Code e Codex por papel, passagem por cota, revisão cruzada; `AGENTS.md`, contrato da API) | `${CLAUDE_PLUGIN_ROOT}/nucleo/02-sessoes-e-papeis.md` (seção "Lead e ferramenta por papel") e a tabela Ferramenta por papel do `processo/DESENVOLVIMENTO.md` do projeto |
| Com agentes especialistas (harness de cada agente) | `${CLAUDE_PLUGIN_ROOT}/nucleo/02-sessoes-e-papeis.md` (seção "Com agentes especialistas") e `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/` |
| O que a leitura das referências de um agente já ensinou (base de conhecimento por agente) | `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/backend.md`, `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/frontend.md`, `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/designer.md`, `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/ops.md`, `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/security.md`, `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/architect.md`, `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/product.md` e `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/lead.md`; as skills do tema estão no harness do agente, parte 5 |
| Trazer o projeto para a versão mais nova do método | `${CLAUDE_PLUGIN_ROOT}/CHANGELOG.md` e a skill `/metodo:atualizar-projeto` |
| O que guardar na memória do projeto | `${CLAUDE_PLUGIN_ROOT}/modelos/memoria-do-projeto.md` |

Leia só o arquivo que a situação pede. Uma lição nova do projeto não entra no método por esta sessão: anote em `processo/memoria-do-projeto.md` e ela vai para o método na Fase 9.
