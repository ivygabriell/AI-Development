# Requisitos e telas antes do código: desenho

**Data:** 2026-11-17
**Status:** aprovado pela pessoa em 2026-11-17 (opção C, os dois; "pode aprovar"); implementado na 5.0.0 ([decisão 015](../decisoes/015-requisitos-e-telas-antes-do-codigo.md))
**Caso de origem:** nenhum. Como as decisões 013 e 014, entra **aprovado pela pessoa sem caso real**, por pedido explícito dela; o primeiro projeto com interface feito assim vira o caso que confirma ou corrige.

## Intenção

Pedido da pessoa, em 2026-11-17:

1. "No processo de criação do front, definir toda a UI e UX e criar todas as telas primeiro; toda a identidade deve ser criada antes de codar qualquer coisa", de preferência no Figma, e "as telas devem ficar visíveis de fato para serem trabalhadas em cima delas".
2. "Os requisitos devem ser definidos muito bem e o peso que aquilo vai gerar": não desenhados, mas **descritos** muito bem, no papel de um engenheiro de requisitos ou PO.

**Por quê** (do que ela disse): o front não pode nascer de telas inventadas durante o código; quem constrói e quem revisa precisa ver a tela aprovada e trabalhar em cima dela; cada requisito precisa dizer o que é, as regras e quanto pesa, para a prioridade ser decidida com base.

**Critério de sucesso:** os requisitos, a identidade e todas as telas são aprovados na Fase 2, antes do plano, e portanto antes de qualquer código (inclusive do back); nenhuma tela é codada diferente da versão aprovada no Figma; toda issue e todo PR apontam os requisitos que atendem; a pessoa decide a prioridade olhando valor, esforço e risco de cada requisito.

**Fora do escopo:** sincronizar o Figma com o código automaticamente; projetos sem interface (API, biblioteca, automação, infraestrutura), que só ganham os requisitos; refazer telas de projetos já construídos.

**Antiobjetivos:** tela codada antes de aprovada; o Figma e o código divergindo sem ninguém ver; requisito vago ("tela de login bonita") passando para o plano.

## Abordagens consideradas (onde as telas ficam visíveis)

| Abordagem | Troca | Escolha |
|---|---|---|
| A. Só o Figma | Visual e editável à mão; os agentes leem e escrevem pelo servidor MCP oficial; fora do Git, sem PR | — |
| B. Protótipo HTML no repositório | Versionado e sem conta paga; ninguém edita à mão | — |
| **C. Os dois** | O Figma é a fonte das telas; a cada aprovação, as capturas e os tokens entram no repositório por PR. Custo: dois lugares, com risco de divergência, que a regra abaixo controla | **Escolhida pela pessoa** |

## O que a pessoa decidiu

### 1. Requisitos (Product, no papel de engenheiro de requisitos ou PO)

Cada requisito é uma ficha numerada em `docs/requisitos.md` (modelo novo `modelos/modelo-requisitos.md`):

- **ID:** R-01, R-02...
- **História:** como <quem>, quero <o quê>, para <por quê>.
- **Regras de negócio** e **casos de erro**.
- **Critérios de aceite** medíveis (pelo `modelo-criterios-de-aceite.md`).
- **Dependências** de outros requisitos.
- **Telas** ligadas (o nome do frame no Figma), quando há interface.
- **Peso:** valor (alto, médio, baixo), esforço (P, M, G; tamanho e cota de tokens) e risco (alto, médio, baixo; segurança, dados, incerteza técnica).
- **Prioridade proposta** pelo Product, com o motivo (valor alto e esforço pequeno primeiro); **a pessoa decide** a ordem.

### 2. Identidade e telas no Figma, com registro no repositório (Frontend)

- Antes de qualquer código de tela, o Frontend cria no Figma, pelo servidor MCP oficial (`use_figma`):
  1. **A identidade:** cores, tipografia, espaçamentos, logo, ícones e tom de voz, como variáveis e estilos do Figma, e os componentes base.
  2. **Todas as telas** de cada requisito com interface, com os estados (vazio, carregando, erro, sucesso) e as larguras de celular e desktop; o fluxo entre elas como protótipo navegável no Figma.
- **Registro no repositório**, a cada aprovação, por PR: `docs/telas/` com uma captura por tela e estado, a data e o link do frame; `docs/telas/tokens.json` com os tokens exportados do Figma (cores, tipografia, espaçamentos), que viram o design system do código.
- **Regra contra a divergência:** toda mudança de tela começa no Figma; o código só segue a versão registrada em `docs/telas/`. A Builder lê o frame pelo MCP do Figma ao construir, e a revisão compara a tela construída com a captura registrada.
- O link do arquivo do Figma fica na linha `Telas:` do `docs/DESENVOLVIMENTO.md`.

### 3. Aprovações

- **Fica com a pessoa:** a lista de requisitos com os pesos e a prioridade; a identidade; **todas as telas** (gatilho "muda o que será construído"); tela nova no meio do projeto.
- **Passa para a Lead:** ajuste pequeno numa tela aprovada, que não muda fluxo, conteúdo nem identidade (espaço, alinhamento, quebra de texto), feito no Figma primeiro e registrado.
- Substitui as linhas "A primeira direção visual" e "Telas seguintes, dentro do design system" da tabela de aprovações da 4.0.0.

## Escolhas da sessão do método (a pessoa confere ao ler)

- **Ordem da Fase 2 com interface:** requisitos → identidade → telas → spec com o mapa de riscos. Cada uma com o seu portão; a spec cita os requisitos e as telas em vez de repetir. Sem interface: requisitos → spec.
- **Issue e PR:** o formulário de tarefa e o de bug ganham o campo obrigatório "Requisitos (R-xx)"; o modelo de PR ganha a linha "Requisitos atendidos" e, com interface, "Telas conferidas com `docs/telas/`".
- **Instalação por computador** (README): o servidor MCP do Figma no Claude Code (plugin `design`, já instalado; falta autenticar) e no Codex, e as skills do Figma que a própria Figma recomenda. A escrita no Figma exige **assento Full** e está em beta gratuito, com cobrança por uso prevista: ligar a escrita é gatilho de custo, decisão da pessoa por projeto.
- **Sem assento Full:** a pessoa cria as telas no Figma à mão (ou com quem ela escolher) e os agentes só leem; o resto do fluxo não muda.
- `scripts/novo-projeto.sh` copia `docs/requisitos.md` e cria `docs/telas/` e a linha `Telas:`; o `/metodo:atualizar-projeto` acrescenta os mesmos arquivos e linhas sem apagar nada.
- Cenários com interface (site estático, aplicação web, app mobile) ganham o item "Identidade e todas as telas aprovadas no Figma e registradas em `docs/telas/` antes do código".
- Decisão 015; **versão maior 5.0.0** (muda a Fase 2 e a tabela de aprovações do núcleo).

## Arquivos que mudam

`nucleo/01` (Fase 2 e tabela de aprovações), `nucleo/02` (papéis do Product e do Frontend), `nucleo/03` (skills de requisitos e do Figma), `modelos/modelo-requisitos.md` (novo), `modelos/modelo-spec.md`, `modelos/agentes/product.md`, `modelos/agentes/frontend.md`, `modelos/agentes/lead.md`, `modelos/issue-tarefa.yml`, `modelos/issue-bug.yml`, `modelos/pull_request_template.md`, `modelos/CLAUDE-projeto.md`, `modelos/AGENTS-projeto.md`, `cenarios/` (os três com interface), `scripts/novo-projeto.sh`, `scripts/verificar.mjs`, `skills/atualizar-projeto/SKILL.md`, `skills/consultar/SKILL.md`, `README.md`, `decisoes/015-...`, `CHANGELOG.md`, `VERSION`.

## O que observar no primeiro projeto

Se alguma tela foi codada antes de aprovada; quantas vezes o Figma e `docs/telas/` divergiram; se os pesos ajudaram a pessoa a decidir a prioridade; quanto a escrita no Figma custou.
