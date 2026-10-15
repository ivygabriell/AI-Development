# 005 · Iniciar um projeto novo com uma skill

**Data:** 2026-10-15
**Status:** proposta
**Caso de origem:** [Repositório do método (2026-10)](../casos/2026-10-repositorio-do-metodo.md)

## Contexto

Para começar um projeto novo, o caminho era manual: criar a pasta e o repositório, rodar o `novo-projeto.sh`, dar o primeiro push e então **colar um prompt** no Claude Code para a sessão conhecer o método. O projeto gerado não tinha `CLAUDE.md`, então cada sessão nova dependia de um prompt colado de novo. Ao descrever esse passo a passo, apareceu também uma falha do modelo de CI: ele roda `npm ci`, e num projeto recém-criado ainda não há `package.json`, então o primeiro CI da `main` sairia vermelho.

A pessoa pediu um jeito simples de iniciar: um comando só, com o contexto do método já carregado, e o processo seguindo pelas fases com os portões humanos de sempre.

## Decisão

Um projeto novo começa com a skill **`/novo-projeto`**, guardada neste repositório e instalada uma vez por link em `~/.claude/skills/`. Ela prepara o projeto, cria o repositório no GitHub depois de uma confirmação e conduz a Fase 0 em diante, parando nos portões. O `novo-projeto.sh` passa a gerar um `CLAUDE.md` para o projeto, e o modelo de CI passa verde com aviso enquanto a stack não existe. Decidido pela pessoa em 2026-10-15.

### As peças

| Peça | Onde | O que faz |
|---|---|---|
| Skill | `modelos/skills/novo-projeto/SKILL.md` | Roteiro do início do projeto (abaixo). Maturidade: `rascunho` até ser usada num projeto real |
| `CLAUDE.md` do projeto | `modelos/CLAUDE-projeto.md` | Copiado pelo `novo-projeto.sh` para a raiz do projeto, com a versão e o caminho do método preenchidos. Importa `@docs/DESENVOLVIMENTO.md` e `@docs/memoria-do-projeto.md`, para toda sessão futura já ter o contexto |
| CI com aviso | `modelos/ci-node.yml` | Um passo inicial confere se há `package.json`. Sem ele, os passos de Node são pulados e o CI termina verde com o aviso "stack ainda não definida". O primeiro PR depois da spec ajusta o CI à stack |
| Passo a passo | `README.md`, seção "Adotar em um projeto novo" | Caminho principal: instalar a skill uma vez e digitar `/novo-projeto`. Caminho manual (o script sozinho) como alternativa |

**Instalação (uma vez por máquina):**

```bash
ln -s ~/Documents/metodo-de-desenvolvimento/modelos/skills/novo-projeto ~/.claude/skills/novo-projeto
```

O link faz cada melhoria da skill valer na hora. A skill acha o método resolvendo o link (`pwd -P` na pasta dela, três níveis acima) e só **lê** o método; nunca o altera.

### O fluxo de `/novo-projeto <o que você quer> [cenário]`

1. **Conferências, só leitura.** Para e explica se: a pasta atual não está vazia (aceita só `.git` vazio), o `git` não roda, o `gh` não está autenticado, o método não é encontrado ou as skills do Superpowers não estão disponíveis. Lê a `VERSION` e o [01](../nucleo/01-fluxo-de-ponta-a-ponta.md).
2. **Entender o mínimo.** Classifica o pedido em voz alta (projeto novo é *arquitetural*), propõe o cenário com o selo de maturidade e pergunta, uma coisa por vez, só o que faltar: nome do repositório e visibilidade (padrão: privado).
3. **Uma confirmação para as ações externas.** Mostra o plano (pasta, nome, visibilidade, cenário, versão do método) e espera o "pode".
4. **Preparação mecânica.** `git init -b main`, `README.md` e `.gitignore`; `novo-projeto.sh . <cenário>`; confere o e-mail do Git e só avisa se não for `noreply`; primeiro commit; `gh repo create --source . --push`; espera o primeiro CI. Se o repositório for público, ativa a proteção da `main`; se for privado, registra no `CLAUDE.md` do projeto que a regra vale pela disciplina das sessões ([lição 019](../licoes/019-protecao-da-main-indisponivel-em-repositorio-privado.md)). Qualquer falha para a skill com a explicação; ela nunca apaga, força ou contorna nada.
5. **Fase 0 em diante.** Invoca `superpowers:brainstorming` com a descrição e segue o [01](../nucleo/01-fluxo-de-ponta-a-ponta.md), parando em cada portão (spec, plano e modo de execução, cada merge, deploy). Ao fim de cada fase, atualiza `docs/memoria-do-projeto.md`.

### Comportamento do `novo-projeto.sh`

- Copia `modelos/CLAUDE-projeto.md` para `CLAUDE.md` trocando `{{VERSAO}}` pela versão e `{{METODO}}` pelo caminho do método, com a pasta pessoal escrita como `~` (nada de nome de usuário no arquivo).
- Se o projeto **já tem** um `CLAUDE.md`, não o toca: avisa no stderr para acrescentar as duas importações à mão e segue. Os outros arquivos continuam com a regra atual (qualquer conflito interrompe sem alterar nada).

### Verificações (escritas antes, em `scripts/verificar.mjs`)

- A skill existe, tem `name: novo-projeto` e `description` no cabeçalho, declara a maturidade `rascunho` e todo caminho do método que ela cita existe.
- O `novo-projeto.sh` cria o `CLAUDE.md` com a versão, as duas importações, o caminho do método com `~` e nenhum `{{` sobrando.
- Com um `CLAUDE.md` já existente, o script conclui, avisa e não altera o arquivo.
- O `ci-node.yml` tem o passo de conferência da stack e todos os passos de Node dependem dele.

O comportamento da skill numa conversa real não tem teste automático: o primeiro projeto iniciado com ela é o caso que a confirma (a maturidade sobe) ou a corrige.

### Fora do escopo

- Plugin do Claude Code (empacotar o método inteiro): só se um caso pedir.
- Hook `SessionStart` com o estado do projeto: só quando houver várias sessões em paralelo num caso real.
- Script de terminal alternativo à skill.
- Modelos de CI para outras stacks além do aviso no de Node.

## Consequências

- Começar um projeto vira: instalar a skill uma vez, abrir o `claude` numa pasta vazia e digitar `/novo-projeto`.
- Toda sessão do projeto já nasce com o contexto (o `CLAUDE.md` gerado), não só a primeira.
- O primeiro CI deixa de nascer vermelho; em troca, até o primeiro PR da stack ele só confere a estrutura (com aviso visível).
- Mais uma peça para manter (a skill), que depende do Superpowers instalado.
- Arquivos alterados: `modelos/skills/novo-projeto/SKILL.md`, `modelos/CLAUDE-projeto.md`, `modelos/ci-node.yml`, `scripts/novo-projeto.sh`, `scripts/verificar.mjs`, `README.md`, `casos/2026-10-repositorio-do-metodo.md`, `CHANGELOG.md`, `VERSION` (2.3.0).
