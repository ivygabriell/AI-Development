# Requisitos e telas antes do código: plano de implementação

> **Para agentes:** use `superpowers:executing-plans` (escolhido pela pessoa: execução inline, revisão final por um agente Codex). Passos com `- [ ]`.

**Objetivo:** levar ao método a Fase 2 com requisitos descritos pelo Product (fichas R-xx com peso) e identidade e telas no Figma, registradas em `docs/telas/`, aprovadas pela pessoa antes do plano.

**Arquitetura:** só documentos, modelos e o `novo-projeto.sh`; cada regra nova ganha uma verificação em `scripts/verificar.mjs`, vista falhar antes.

**Desenho:** [2026-11-17-requisitos-e-telas-antes-do-codigo-desenho.md](2026-11-17-requisitos-e-telas-antes-do-codigo-desenho.md)

## Restrições globais

- Ficha de requisito: ID `R-NN`, história, regras de negócio, casos de erro, critérios de aceite, dependências, telas, peso (valor alto/médio/baixo; esforço P/M/G; risco alto/médio/baixo), prioridade proposta; a pessoa decide a ordem.
- Ordem da Fase 2 com interface: requisitos → identidade → telas → spec com mapa de riscos.
- Registro: `docs/telas/` (uma captura por tela e estado, data, link do frame) e `docs/telas/tokens.json` (do `get_variable_defs` do MCP do Figma); linha `Telas:` no `docs/DESENVOLVIMENTO.md`.
- Instalação: Claude Code pelo plugin `design` (autenticar o conector Figma); Codex com `codex mcp add figma --url https://mcp.figma.com/mcp` e `codex mcp login figma`.
- Escrita no Figma exige assento Full; ligar é gatilho de custo.
- Versão 5.0.0, decisão 015, aceita sem caso real.
- Zero dado pessoal; histórico não é reescrito.

## Foco da revisão

1. Restou alguma frase que deixa tela nova com a Lead ("Telas seguintes").
2. Projeto sem interface recebendo exigência de Figma.
3. Divergência Figma × código sem regra de quem vence.
4. `atualizar-projeto` apagando algo do projeto ao acrescentar requisitos e telas.
5. Issue ou PR sem o campo de requisitos.

## Tarefa 1 · Verificações (RED)

- [ ] Acrescentar em `scripts/verificar.mjs`, num bloco "Decisão 015": `modelos/modelo-requisitos.md` e a decisão 015 obrigatórios; a ficha tem os campos das restrições; `nucleo/01` Fase 2 cita requisitos, identidade, telas, Figma e `docs/telas/`; a tabela de aprovações não tem "Telas seguintes" e tem "todas as telas"; harness do Product com `R-` e peso; harness do Frontend com `use_figma`, `docs/telas/` e "antes de qualquer código"; issue de tarefa e de bug com campo obrigatório `requisitos`; PR com "Requisitos atendidos"; `novo-projeto.sh` cria `docs/requisitos.md`, `docs/telas/` e a linha `Telas:`; `atualizar-projeto` cita `docs/requisitos.md` e `docs/telas/`; README com `codex mcp add figma`; os cenários com interface citam `docs/telas/`; VERSION ≥ 5.
- [ ] `node scripts/verificar.mjs` → falha nas verificações novas.

## Tarefa 2 · Modelos

- [ ] `modelos/modelo-requisitos.md` (novo), `modelo-spec.md` (cita requisitos e telas), `issue-tarefa.yml` e `issue-bug.yml` (campo `requisitos`), `pull_request_template.md` (linhas de requisitos e telas), `CLAUDE-projeto.md` e `AGENTS-projeto.md` (nenhum código de tela sem a tela aprovada; mudança de tela começa no Figma).

## Tarefa 3 · Núcleo e harnesses

- [ ] `nucleo/01` (Fase 2 e tabela), `nucleo/02` (Product e Frontend na Fase 2), `nucleo/03` (skills e o MCP do Figma), `modelos/agentes/product.md`, `frontend.md`, `lead.md`.

## Tarefa 4 · Script, skills, cenários e README

- [ ] `scripts/novo-projeto.sh`, `skills/atualizar-projeto`, `skills/novo-projeto`, `skills/consultar`, os três cenários com interface, README (instalação do Figma nas duas ferramentas).

## Tarefa 5 · Decisão e versão

- [ ] `decisoes/015-requisitos-e-telas-antes-do-codigo.md`, `CHANGELOG.md` (5.0.0), `VERSION`, status do desenho.
- [ ] `node scripts/verificar.mjs` → tudo verde. Revisão do Codex; corrigir com verificação vista falhar; PR; integrar (autorizado pela pessoa).
