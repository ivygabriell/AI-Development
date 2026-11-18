# 015 · Requisitos descritos e telas no Figma antes do código

**Data:** 2026-11-17
**Status:** aceita pela pessoa **sem caso real** (exceção à regra de ouro, pedida por ela, como nas decisões [013](013-lead-e-builders-com-codex-e-claude.md) e [014](014-fluxo-de-correcao-de-bugs.md)). Substitui, na tabela de aprovações da decisão 013, as linhas "A primeira direção visual" e "Telas seguintes, dentro do design system".
**Caso de origem:** nenhum ainda. O primeiro projeto com interface feito assim confirma ou corrige esta decisão.

## Contexto

O método deixava o design crescer junto com o código: a pessoa aprovava só a primeira direção visual, e as telas seguintes ficavam com a Lead. A spec descrevia o desenho, mas não tinha uma lista de requisitos com o peso de cada um. A pessoa pediu: definir toda a UI e a UX e criar todas as telas e a identidade antes de codar qualquer coisa, com as telas visíveis de fato para se trabalhar em cima delas (de preferência no Figma); e requisitos descritos muito bem, no papel de um engenheiro de requisitos ou PO, com o peso que cada um gera.

Desenho: [planos/2026-11-17-requisitos-e-telas-antes-do-codigo-desenho.md](../planos/2026-11-17-requisitos-e-telas-antes-do-codigo-desenho.md). Plano: [planos/2026-11-17-requisitos-e-telas-antes-do-codigo.md](../planos/2026-11-17-requisitos-e-telas-antes-do-codigo.md).

## Decisão

Decidido pela pessoa em 2026-11-17:

1. **Requisitos:** o Product descreve cada requisito numa ficha de `docs/requisitos.md` ([modelo](../modelos/modelo-requisitos.md)): R-xx, história, regras de negócio, casos de erro, critérios de aceite, dependências, telas e o **peso** (valor, esforço, risco), com a prioridade proposta. A pessoa aprova a lista, os pesos e a ordem.
2. **Identidade e todas as telas no Figma, com registro no repositório** (opção "os dois"): o Frontend cria a identidade e todas as telas no Figma, pelo servidor MCP oficial; a cada aprovação, as capturas e os tokens entram em `docs/telas/` por PR. Toda mudança de tela começa no Figma; o código segue a versão registrada.
3. **Aprovações:** requisitos, identidade, todas as telas e tela nova no meio do projeto ficam com a pessoa; ajuste pequeno numa tela aprovada fica com a Lead.

**Escolhas da sessão do método** (a pessoa confere ao ler o PR):

- Ordem da Fase 2 com interface: requisitos → identidade → telas → spec; sem interface: requisitos → spec. Tudo antes do plano, então nada é codado antes, nem o back.
- Issue de tarefa e de bug com o campo obrigatório "Requisitos (R-xx)"; o PR diz os requisitos atendidos e confere a tela com `docs/telas/`.
- Escrever no Figma exige assento Full (beta gratuito, cobrança por uso prevista): ligar é gatilho de custo. Sem ele, a pessoa desenha e os agentes só leem.
- `novo-projeto.sh` cria `docs/requisitos.md`, `docs/telas/` e a linha `Telas:`; o `/metodo:atualizar-projeto` acrescenta os três sem apagar nada.
- Versão maior (5.0.0): muda a Fase 2 e a tabela de aprovações do núcleo.

## Consequências

- O primeiro código de um projeto com interface demora mais a sair; em troca, as Builders constroem em cima de uma tela aprovada, e a revisão compara com ela.
- Dois lugares para as telas (Figma e `docs/telas/`): a regra "começa no Figma, o código segue o registro" e a revisão contra a captura seguram a divergência.
- A pessoa aprova mais coisas na Fase 2 e menos depois.
- O que observar no primeiro projeto: se alguma tela foi codada antes de aprovada; quantas vezes o Figma e `docs/telas/` divergiram; se os pesos ajudaram a decidir a prioridade; quanto a escrita no Figma custou.
- Arquivos que mudam: `nucleo/01`, `02`, `03`; `modelos/modelo-requisitos.md` (novo), `modelo-spec.md`, `issue-tarefa.yml`, `issue-bug.yml`, `pull_request_template.md`, `CLAUDE-projeto.md`, `AGENTS-projeto.md`, `agentes/product.md`, `agentes/frontend.md`, `agentes/lead.md`; três cenários; `scripts/novo-projeto.sh`, `scripts/verificar.mjs`; skills `atualizar-projeto`, `novo-projeto`, `consultar`; `README.md`, `CHANGELOG.md`, `VERSION`.
