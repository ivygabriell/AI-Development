# Método de desenvolvimento com Claude Code

Um método para construir sites, aplicações e soluções tecnológicas com o Claude Code de forma organizada: **alvo definido antes de construir, testes em duas camadas, uma branch por mudança, validação independente e o humano decidindo o que importa**. Ele nasceu de um projeto real (um portfólio com animações, vídeos, CI e várias sessões em paralelo), inclui os erros que cometemos e **cresce a cada projeto**.

Este repositório é **independente de qualquer projeto**. Versão atual: veja [VERSION](VERSION) e o [registro de mudanças](CHANGELOG.md).

## Os 7 princípios

1. **Alvo antes de construir.** Entenda a intenção, escreva de volta o que entendeu e só então desenhe. Se o pedido cita um título, um nome ou uma referência, ache exatamente aquilo; se não bater, pergunte antes de implementar.
2. **Quem constrói não é quem valida.** Quem implementa entrega com os testes verdes. Outra sessão (a integradora) refaz tudo e **explora** o resultado contra o pedido. "CI verde" não prova que a coisa certa foi feita.
3. **Teste primeiro, em duas camadas (micro e macro).** O teste é escrito e visto falhar antes do código (micro). A suíte inteira, o build, os tipos e a exploração da página inteira fecham o trabalho (macro).
4. **Uma mudança, uma branch; a `main` sempre estável.** Toda mudança entra por Pull Request com a verificação automática verde. Nada de commit direto na `main`.
5. **A Skill certa para cada cenário.** Brainstorming antes de criar, TDD para implementar, depuração sistemática para bugs, verificação antes de dizer "pronto". Vale para todas as sessões.
6. **Evidência antes de afirmação.** Rode o comando, leia a saída, meça no navegador. "Deveria funcionar" não é resultado.
7. **O humano decide o que é externo, irreversível ou ambíguo.** Publicar, integrar, apagar, reescrever histórico, mudar contas e interpretar um pedido confuso passam por uma pessoa.

## Como ler

O repositório tem três camadas, com ritmos diferentes:

| Camada | Onde | O que é | Muda quanto |
|---|---|---|---|
| **Núcleo** | `nucleo/` | O método base | Raramente |
| **Cenários** | `cenarios/` | Como o método se adapta a cada tipo de projeto | Cresce: um arquivo por tipo |
| **Casos e lições** | `casos/`, `licoes/`, `decisoes/` | O que aconteceu de verdade e por que as regras mudaram | Sempre |

### Núcleo

| Documento | Para que serve |
|---|---|
| [01 · Fluxo de ponta a ponta](nucleo/01-fluxo-de-ponta-a-ponta.md) | As fases da ideia à manutenção e ao fechamento, com portões de aprovação |
| [02 · Sessões e papéis](nucleo/02-sessoes-e-papeis.md) | Uma sessão ou várias; integradora e trabalhadoras |
| [03 · Skills e testes](nucleo/03-skills-e-testes.md) | Qual Skill usar em cada cenário; testes micro e macro; verificação no navegador |
| [04 · Referências e engenharia reversa](nucleo/04-referencias-e-engenharia-reversa.md) | Como estudar um site ou app de referência e quando usar engenharia reversa |
| [05 · Git, GitHub e CI](nucleo/05-git-github-e-ci.md) | Branches, PRs, verificação automática, proteção da `main`, worktrees |

### Camadas que crescem

| Pasta | Conteúdo |
|---|---|
| [cenarios/](cenarios/README.md) | Um arquivo por tipo de projeto (site, aplicação web, API, mobile, automação, infraestrutura, biblioteca, IA), com selo de maturidade, skills úteis e checklist |
| [casos/](casos/_modelo-caso.md) | Uma retrospectiva por projeto realizado: o que funcionou, o que falhou, medidas |
| [licoes/](licoes/_indice.md) | Uma lição por arquivo: o que aconteceu, a causa, a regra |
| [decisoes/](decisoes/_modelo-decisao.md) | Por que uma regra do método mudou |
| [modelos/](modelos/) | O que se copia para um projeto: formulário de tarefa, modelo de PR, CI, `CLAUDE.md` do projeto, scripts de worktree, prompts e gabaritos |
| `skills/` | As skills do plugin `metodo`: `novo-projeto` (inicia um projeto), `atualizar-projeto` (traz um projeto existente para a versão atual) e `consultar` (dá às sessões do projeto acesso ao método); o catálogo do plugin fica em `.claude-plugin/` |
| `planos/` | Os planos de implementação das mudanças do método |
| `scripts/` | `verificar.mjs` (confere o próprio método), `gerar-indice-licoes.mjs` e `novo-projeto.sh` |

## Visão em uma página

```text
Ideia ──► Alvo (Fase 0-2) ──► Plano (3) ──► Construir com TDD (4) ──► Validar (5) ──► Integrar (6) ──► Publicar (7) ──► Manter (8) ──► Fechar (9)
            │  humano aprova      │ humano      │ trabalhadora          │ integradora    │ humano       │ humano                    │ caso + lições
            │  o desenho          │ aprova      │ micro + macro         │ micro + macro  │ autoriza     │ autoriza                  ▼
            ▼                     ▼             ▼                       ▼                ▼              ▼                    o método aprende
        spec / critérios      tarefas       branch + PR + CI        navegador/exploração   merge na main   deploy
```

## Adotar em um projeto novo

O caminho principal é o plugin `metodo`: este repositório também é um plugin do Claude Code, e o agente de qualquer computador com acesso a ele baixa o método inteiro e começa um projeto com um comando ([decisão 005](decisoes/005-iniciar-projeto-com-uma-skill.md)).

### Antes de começar (uma vez por computador)

O método usa, além do plugin `metodo`, três plugins, uma ferramenta de engenharia reversa e o Orca, para orquestrar os agentes. Instale tudo nesta ordem:

| O quê | Para que o método usa | Repositório oficial (instalação, uso e atualização) |
|---|---|---|
| Plugin **Superpowers** | O fluxo inteiro: brainstorming, TDD, depuração, planos, revisão e verificação antes de dizer "pronto" | [obra/superpowers](https://github.com/obra/superpowers) |
| Plugin **engineering** | Documentação, arquitetura, desenho de sistemas, revisão de código, estratégia de testes, checklist de deploy, incidentes | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins/tree/main/engineering) |
| Plugin **design** | Revisão de acessibilidade, crítica de design, entrega para desenvolvimento e textos de interface | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins/tree/main/design) |
| **REA** (skill `reverse-engineer-anything` e servidor `rea`) | Engenharia reversa de artefatos fechados, quando uma referência não tem código-fonte ([04](nucleo/04-referencias-e-engenharia-reversa.md)) | [morluto/rea](https://github.com/morluto/rea) |
| **Orca** (aplicativo e as skills `orca-cli` e `orchestration`) | Orquestração dos agentes: a coordenadora faz o papel da integradora e os agentes, das trabalhadoras ([02](nucleo/02-sessoes-e-papeis.md), modo em rascunho) | [stablyai/orca](https://github.com/stablyai/orca) |
| **Codex** (opcional) | Agentes do back quando o projeto divide o back (Codex) e o front (Claude), com as mesmas regras e Skills ([02](nucleo/02-sessoes-e-papeis.md), modo em rascunho) | [openai/codex](https://github.com/openai/codex) |
| Plugin **metodo** | Este repositório: `/metodo:novo-projeto`, `/metodo:atualizar-projeto` e a consulta ao método nas sessões do projeto | este repositório |

Os comandos abaixo são o caminho curto. Para requisitos, opções e problemas de instalação de cada ferramenta, consulte o repositório oficial dela.

**1. Programas, no terminal.** Instale o Claude Code, o `git`, o Node.js (com o `npm`) e o GitHub CLI (`gh`), e confira:

```bash
claude --version
git --version          # no macOS, se pedir a licença do Xcode: sudo xcodebuild -license
node --version
gh --version
```

**2. Acesso a este repositório privado, no terminal:**

```bash
gh auth login
gh auth setup-git
```

**3. Plugins Superpowers, engineering e design, dentro do Claude Code:**

```text
/plugin install superpowers@claude-plugins-official
/plugin marketplace add anthropics/knowledge-work-plugins
/plugin install engineering@knowledge-work-plugins
/plugin install design@knowledge-work-plugins
```

Se o Claude Code disser que o marketplace já está registrado, siga em frente. Se a sua conta do claude.ai já sincroniza o engineering e o design (eles aparecem em `/plugin` sem você ter instalado), não instale de novo.

**4. REA, no terminal:**

```bash
npx rea-agents setup
```

Escolha o Claude Code, revise as mudanças propostas e aprove. Depois, feche e abra o Claude Code de novo. Para atualizar mais tarde: `npx rea-agents@latest setup`. Requisitos, uso e diagnóstico: [morluto/rea](https://github.com/morluto/rea).

**5. Plugin metodo, dentro do Claude Code:**

```text
/plugin install metodo --marketplace ivygabriell/AI-Development
```

Em versões do Claude Code anteriores à 2.1.275, use os dois comandos:

```text
/plugin marketplace add ivygabriell/AI-Development
/plugin install metodo@metodo-de-desenvolvimento
```

**6. Orca.** Instale o aplicativo pelo repositório oficial e, no terminal, as skills dele:

```bash
orca skills install --skill orca-cli --skill orchestration
```

**7. Conferir.** Dentro do Claude Code, `/plugin` lista `superpowers`, `engineering`, `design` e `metodo` ativos, e ao digitar `/metodo:` aparecem `novo-projeto`, `atualizar-projeto` e `consultar`. No terminal:

```bash
claude mcp list        # deve mostrar "rea" com ✔ Connected
orca status            # deve mostrar runtimeState: ready com o Orca aberto
```

**8. Codex (opcional, só para o back com agentes Codex).** O Codex segue as mesmas regras e Skills que o Claude, então precisa das mesmas ferramentas. No terminal:

```bash
codex plugin marketplace add anthropics/claude-plugins-official
codex plugin marketplace add anthropics/knowledge-work-plugins
codex plugin marketplace add ivygabriell/AI-Development
codex plugin add superpowers@claude-plugins-official
codex plugin add engineering@knowledge-work-plugins
codex plugin add design@knowledge-work-plugins
codex plugin add metodo@metodo-de-desenvolvimento
```

Se o Codex disser que um marketplace já está registrado ou que um plugin já está instalado, siga em frente. Para o REA, rode `npx rea-agents setup` de novo e escolha também o Codex. As skills do Orca (passo 6) já ficam na pasta que o Codex lê. Para conferir:

```bash
codex plugin list      # superpowers, engineering, design e metodo instalados e ativos
codex mcp list         # deve mostrar "rea" ativo
```

Para receber as melhorias do método também no Codex: `codex plugin marketplace upgrade`. Nos projetos, o Codex lê o `AGENTS.md` (o `CLAUDE.md` é só do Claude); o `/metodo:novo-projeto` e o `/metodo:atualizar-projeto` criam esse arquivo.

Os conectores que os plugins engineering e design trazem (Slack, Figma, Linear e outros) podem ficar sem autenticação; o método não depende deles.

### Iniciar um projeto

**A cada projeto**, abra o Claude Code numa pasta vazia e descreva o que quer:

```bash
mkdir ~/Projetos/meu-site && cd ~/Projetos/meu-site && claude
```

```text
/metodo:novo-projeto Quero um portfólio bilíngue para mostrar meus trabalhos de vídeo. site-estatico
```

A skill confere o ambiente, propõe o cenário (e avisa se ele é `rascunho`), pede **uma** confirmação antes de criar o repositório no GitHub, prepara tudo com o `novo-projeto.sh` (inclusive o `CLAUDE.md` do projeto, que dá o contexto a toda sessão futura), espera o primeiro CI e começa a Fase 0. Daí em diante, ela para em cada portão: spec, plano, cada merge e deploy. Qualquer sessão do projeto consulta o método pela skill `metodo:consultar`.

**Para trabalhar com vários agentes no Orca**, abra o projeto no Orca e use o [prompt da coordenadora](modelos/prompt-coordenadora-orca.md) no agente principal: ela distribui as tarefas aos agentes, valida e só integra com a sua aprovação ([02](nucleo/02-sessoes-e-papeis.md), seção "Com o Orca").

**Para dividir o back (Codex) e o front (Claude)**, a coordenadora continua sendo um agente Claude e é a única que integra; ela inicia os agentes do back com `--agent codex` e os do front com `--agent claude`, e o contrato da API é aprovado por você antes de qualquer tarefa de construção ([02](nucleo/02-sessoes-e-papeis.md), "Back e front com agentes diferentes", modo em rascunho).

**Para trabalhar com agentes especialistas**, a integradora coordena um especialista por tema (Arquitetura, Back e Dados, Design e Front, Segurança e, quando preciso, Produto e DevOps), e cada especialista abre as próprias trabalhadoras. Cada agente atua dentro de um harness escrito com você, em [`modelos/agentes/`](modelos/agentes/), que vai para o projeto com `scripts/novo-projeto.sh <pasta> --especialistas`. No Orca, ajuste antes **Settings → Orchestration → Nested worker depth = 2** ([02](nucleo/02-sessoes-e-papeis.md), "Com agentes especialistas", modo em rascunho).

### Atualizar um projeto que já usa o método

Quando o método muda, os projetos que você já tinha não mudam sozinhos. Primeiro atualize o plugin naquele computador (`/plugin marketplace update metodo-de-desenvolvimento`); depois, dentro de cada projeto, abra o Claude Code e digite:

```text
/metodo:atualizar-projeto
```

A skill mostra o que mudou desde a versão do projeto, monta um plano que **só acrescenta** (nada do projeto é apagado nem sobrescrito, e o CI que ele já tem fica como está), pede **uma** confirmação e entrega tudo num PR. Ela também serve para um projeto que nunca foi preparado pelo método, e oferece registrar o projeto no Orca.

**Para receber as melhorias do método** naquele computador: `/plugin marketplace update metodo-de-desenvolvimento`, ou ligue a atualização automática em `/plugin`, na aba de marketplaces.

### Caminho manual

Sem o plugin, com uma cópia local deste repositório:

1. Crie o repositório do projeto e a `main`, com um `README` e o `.gitignore` (veja a higiene de dados em [05](nucleo/05-git-github-e-ci.md)).
2. Rode o script, escolhendo os cenários que se aplicam:
   ```bash
   scripts/novo-projeto.sh <pasta-do-projeto> site-estatico
   ```
   Ele copia o formulário de tarefa, o modelo de PR, o CI e os scripts de worktree, e cria o `CLAUDE.md`, o `AGENTS.md` (para o Codex), o `docs/DESENVOLVIMENTO.md` e o `docs/memoria-do-projeto.md` carimbados com a versão do método. Nunca sobrescreve nada; se o projeto já tem um `CLAUDE.md`, só avisa para acrescentar as importações.
   Se um cenário escolhido ainda é `rascunho`, o script avisa (sem interromper) e o `DESENVOLVIMENTO.md` registra a maturidade de cada cenário: trate um rascunho como hipótese, não como regra.
3. Faça o primeiro commit com tudo e dê o primeiro push da `main`. O CI passa com o aviso "stack ainda não definida" até o primeiro PR da stack. **Depois** ative a proteção da `main` e crie as etiquetas (comandos em [05](nucleo/05-git-github-e-ci.md)). Em repositório privado, a proteção exige plano pago; o 05 diz o que fazer sem ela.
4. Preencha os comandos do projeto no `docs/DESENVOLVIMENTO.md` e ajuste o CI para a sua stack.
5. Defina o **alvo** da primeira entrega com [modelo-spec.md](modelos/modelo-spec.md) e [modelo-criterios-de-aceite.md](modelos/modelo-criterios-de-aceite.md).
6. Abra a primeira issue com o formulário de tarefa e comece pela Fase 0 de [01](nucleo/01-fluxo-de-ponta-a-ponta.md).

## Como este repositório cresce

1. **Cada projeto termina com a Fase 9** ([01](nucleo/01-fluxo-de-ponta-a-ponta.md)): um caso registrado, lições novas, ajustes nos cenários e, se uma regra mudou, uma decisão.
2. **Nada entra sem um caso real.** Opinião sem evidência fica de fora.
3. **Toda mudança entra por Pull Request**, com `node scripts/verificar.mjs` verde no CI. O método usa o próprio método.
4. **Cenários têm selo de maturidade** (`rascunho`, `testado em 1 projeto`, `estável`) e só sobem com um caso.
5. **Versionamento:** `VERSION` e [CHANGELOG](CHANGELOG.md); maior quando muda a estrutura ou uma regra do núcleo, menor para conteúdo novo, correção para ajustes de texto.
6. **Uma sessão do Claude Code dedicada** mantém este repositório: o [CLAUDE.md](CLAUDE.md) traz as regras e o [prompt inicial](modelos/prompt-sessao-do-metodo.md) abre a sessão.

## Convenções

- Idioma: português nos documentos e nos commits; nomes de Skills, comandos e código ficam como são.
- Nomes de branch: `feat/`, `fix/`, `chore/`, `docs/` + um *slug* em minúsculas com hifens.
- Commits em Conventional Commits (`feat: ...`, `fix: ...`).
- As branches integradas **ficam** no GitHub ([decisão 003](decisoes/003-branches-integradas-ficam-no-github.md)).
- Verificador: `node scripts/verificar.mjs` confere estrutura, links, lições, cenários, scripts e a ausência de dados pessoais.
