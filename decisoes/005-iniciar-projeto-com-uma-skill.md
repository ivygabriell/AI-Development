# 005 · Iniciar um projeto novo com uma skill

**Data:** 2026-10-15
**Status:** proposta
**Caso de origem:** [Repositório do método (2026-10)](../casos/2026-10-repositorio-do-metodo.md)

## Contexto

Para começar um projeto novo, o caminho era manual: criar a pasta e o repositório, rodar o `novo-projeto.sh`, dar o primeiro push e então **colar um prompt** no Claude Code para a sessão conhecer o método. O projeto gerado não tinha `CLAUDE.md`, então cada sessão nova dependia de um prompt colado de novo. Ao descrever esse passo a passo, apareceu também uma falha do modelo de CI: ele roda `npm ci`, e num projeto recém-criado ainda não há `package.json`, então o primeiro CI da `main` sairia vermelho.

A pessoa pediu um jeito simples de iniciar: um comando só, com o contexto do método já carregado, e o processo seguindo pelas fases com os portões humanos de sempre. Pediu também que um agente em **outro computador**, sem cópia local do método, consiga fazer o mesmo a partir deste repositório.

## Decisão

Este repositório passa a ser também um **plugin do Claude Code** (um *marketplace* com um plugin, `metodo`, cuja raiz é o próprio repositório). Em qualquer computador com acesso ao repositório, o agente instala o plugin uma vez e começa um projeto com **`/metodo:novo-projeto`**: a skill prepara o projeto, cria o repositório no GitHub depois de uma confirmação e conduz a Fase 0 em diante, parando nos portões. O `novo-projeto.sh` passa a gerar um `CLAUDE.md` para o projeto, e o modelo de CI passa verde com aviso enquanto a stack não existe. Decidido pela pessoa em 2026-10-15.

### As peças

| Peça | Onde | O que faz |
|---|---|---|
| Catálogo do plugin | `.claude-plugin/marketplace.json` | Marketplace `metodo-de-desenvolvimento` com o plugin `metodo`, `source: "./"` (o repositório inteiro). Sem `version`: quem instala acompanha os commits da `main` |
| Skill de início | `skills/novo-projeto/SKILL.md` | O roteiro do início do projeto (abaixo). Maturidade: `rascunho` até ser usada num projeto real |
| Skill de consulta | `skills/consultar/SKILL.md` | Diz a qualquer sessão onde está a cópia do método (`${CLAUDE_PLUGIN_ROOT}`) e o que ler em cada situação: fases, cenários, lições, modelos |
| `CLAUDE.md` do projeto | `modelos/CLAUDE-projeto.md` | Copiado pelo `novo-projeto.sh` para a raiz do projeto, com a versão do método. Importa `@docs/DESENVOLVIMENTO.md` e `@docs/memoria-do-projeto.md` e manda consultar o método pela skill `metodo:consultar`, sem caminho de pasta (o caminho da cópia do plugin muda a cada atualização) |
| CI com aviso | `modelos/ci-node.yml` | Um passo inicial confere se há `package.json`. Sem ele, os passos de Node são pulados e o CI termina verde com o aviso "stack ainda não definida". O primeiro PR depois da spec ajusta o CI à stack |
| Plano | `planos/2026-10-15-skill-novo-projeto.md` | O plano de implementação desta decisão. A pasta `planos/` guarda os planos das mudanças do método |
| Passo a passo | `README.md`, seção "Adotar em um projeto novo" | Caminho principal: instalar o plugin uma vez e digitar `/metodo:novo-projeto`. Caminho manual (o script sozinho) como alternativa |

### Instalação (uma vez por computador)

Requisitos: Claude Code, `git`, `gh` autenticado com acesso ao repositório (`gh auth login` e `gh auth setup-git`, porque o repositório é privado) e o plugin Superpowers. Dentro do Claude Code:

```text
/plugin marketplace add ivygabriell/AI-Development
/plugin install metodo@metodo-de-desenvolvimento
```

Atualizar o método naquele computador: `/plugin marketplace update metodo-de-desenvolvimento` (ou ligar a atualização automática em `/plugin`, na aba de marketplaces).

### O fluxo de `/metodo:novo-projeto <o que você quer> [cenário]`

1. **Conferências, só leitura.** Para e explica se: a pasta atual não está vazia (ignora `.DS_Store` e uma pasta `.git` sem commits), o `git` não roda, o `gh` não está autenticado ou as skills do Superpowers não estão disponíveis. Lê a `VERSION`, o [01](../nucleo/01-fluxo-de-ponta-a-ponta.md) e o [índice de cenários](../cenarios/README.md) na cópia do método.
2. **Entender o mínimo.** Classifica o pedido em voz alta (projeto novo é *arquitetural*), propõe o cenário com o selo de maturidade e pergunta, uma coisa por vez, só o que faltar: nome do repositório e visibilidade (padrão: privado).
3. **Uma confirmação para as ações externas.** Mostra o plano (pasta, nome, visibilidade, cenário, versão do método) e espera o "pode".
4. **Preparação mecânica.** `git init -b main`, `README.md` e `.gitignore`; `novo-projeto.sh . <cenário>`; confere o e-mail do Git e só avisa se não for `noreply`; se o repositório for privado, registra no `CLAUDE.md` que a `main` fica sem proteção ([lição 019](../licoes/019-protecao-da-main-indisponivel-em-repositorio-privado.md)); primeiro commit; `gh repo create --source . --push`; espera o primeiro CI; se for público, ativa a proteção da `main`. Qualquer falha para a skill com a explicação; ela nunca apaga, força ou contorna nada.
5. **Fase 0 em diante.** Invoca `superpowers:brainstorming` com a descrição e segue o [01](../nucleo/01-fluxo-de-ponta-a-ponta.md), parando em cada portão (spec, plano e modo de execução, cada merge, deploy). O primeiro PR depois da spec ajusta o CI à stack. Ao fim de cada fase, atualiza `docs/memoria-do-projeto.md`.

A skill e as sessões do projeto só **leem** a cópia do método; nunca a alteram.

### Comportamento do `novo-projeto.sh`

- Copia `modelos/CLAUDE-projeto.md` para `CLAUDE.md` trocando `{{VERSAO}}` pela versão.
- Se o projeto **já tem** um `CLAUDE.md`, não o toca: avisa no stderr para acrescentar as duas importações à mão e segue. Os outros arquivos continuam com a regra atual (qualquer conflito interrompe sem alterar nada).

### Verificações (escritas antes, em `scripts/verificar.mjs`)

- O `marketplace.json` é JSON válido, com o marketplace `metodo-de-desenvolvimento`, um dono, e o plugin `metodo` com `source: "./"` e sem `version`.
- Cada skill em `skills/` tem `name` igual ao nome da pasta e `description` no cabeçalho; todo caminho do método que ela cita a partir de `${CLAUDE_PLUGIN_ROOT}/` existe; a de início declara a maturidade `rascunho`.
- O `novo-projeto.sh` cria o `CLAUDE.md` com a versão, as duas importações, a menção a `metodo:consultar` e nenhum `{{` sobrando.
- Com um `CLAUDE.md` já existente, o script conclui, avisa e não altera o arquivo.
- O `ci-node.yml` tem o passo de conferência da stack e todos os passos de Node dependem dele.
- Antes do PR, `claude plugin validate .` passa (só lê os arquivos; não instala nada).

O comportamento das skills numa conversa real não tem teste automático: a primeira instalação e o primeiro projeto iniciados com elas, em outro computador, são o caso que as confirma (a maturidade sobe) ou as corrige.

### Fora do escopo

- Declarar o Superpowers como dependência do plugin: só depois de uma instalação real mostrar que funciona sem travar.
- Hook `SessionStart` com o estado do projeto: só quando houver várias sessões em paralelo num caso real.
- Modelos de CI para outras stacks além do aviso no de Node.

## Consequências

- Começar um projeto, em qualquer computador com acesso ao repositório, vira: instalar o plugin uma vez e digitar `/metodo:novo-projeto` numa pasta vazia.
- Toda sessão do projeto já nasce com o contexto (o `CLAUDE.md` gerado e a skill `metodo:consultar`), não só a primeira.
- O primeiro CI deixa de nascer vermelho; em troca, até o primeiro PR da stack ele só confere a estrutura (com aviso visível).
- Mais peças para manter (o catálogo e duas skills), que dependem do Superpowers instalado e de acesso ao repositório privado.
- O `CLAUDE.md` da raiz deste repositório continua sendo da sessão do método; o Claude Code não o carrega como contexto do plugin.
- Arquivos alterados: `.claude-plugin/marketplace.json`, `skills/novo-projeto/SKILL.md`, `skills/consultar/SKILL.md`, `modelos/CLAUDE-projeto.md`, `modelos/ci-node.yml`, `scripts/novo-projeto.sh`, `scripts/verificar.mjs`, `planos/2026-10-15-skill-novo-projeto.md`, `README.md`, `CLAUDE.md`, `casos/2026-10-repositorio-do-metodo.md`, `CHANGELOG.md`, `VERSION` (2.3.0).
