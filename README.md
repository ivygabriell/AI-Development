# Arquitetura de agentes para desenvolvimento

Uma arquitetura de agentes de IA para construir sites, aplicações e soluções tecnológicas de forma organizada: **uma integradora que coordena, especialistas por tema que decidem e revisam, trabalhadoras que constroem e uma pessoa que aprova o que importa**. Os agentes rodam em **uma ferramenta por projeto, Claude Code ou Codex** ([decisão 010](decisoes/010-um-agente-principal-por-projeto.md)), orquestrados no [Orca](https://github.com/stablyai/orca), e seguem o mesmo método: alvo definido antes de construir, testes em duas camadas, uma branch por mudança e validação independente.

A arquitetura nasceu de um projeto real (um portfólio com animações, vídeos, CI e várias sessões em paralelo), inclui os erros que cometemos e **cresce a cada projeto**. Este repositório é **independente de qualquer projeto**. Versão atual: veja [VERSION](VERSION) e o [registro de mudanças](CHANGELOG.md).

## A arquitetura

```text
                              Pessoa
               aprova a spec, o plano, cada merge e o deploy
                                 │ portões
                                 ▼
                            Integradora
          coordena, faz a validação final (QA) e é a única que integra
                                 │
     ┌──────────────┬────────────┼─────────────┬──────────────┬─────────────┐
     ▼              ▼            ▼             ▼              ▼             ▼
 Arquitetura   Back e Dados  Design e Front  Segurança     Produto       DevOps
 contrato,     regras, APIs, experiência,    mapa de       necessidade,  deploy, CI,
 dados,        banco         interface       riscos,       critérios     nuvem
 falhas                                      auditoria     (Fases 0-2)   (quando preciso)
                    │            │
                    ▼            ▼                                          ▼
              trabalhadoras  trabalhadoras                            trabalhadora
              (até 2)        (até 2)                                  (1 por vez)
```

| Peça | O que é | Onde está |
|---|---|---|
| **Agente principal** | A ferramenta do projeto: Claude Code ou Codex, a mesma para todos os agentes, nunca as duas | [02, "Um agente principal por projeto"](nucleo/02-sessoes-e-papeis.md) |
| **Integradora** | A coordenadora: abre as issues, distribui aos especialistas, valida e integra com a sua aprovação | [harness da integradora](modelos/agentes/integradora.md) |
| **Especialistas** | Um agente por tema, cada um com um **harness**: missão, o que pode e o que não pode, Skills, checklist, quando sobe a decisão | [`modelos/agentes/`](modelos/agentes/) |
| **Trabalhadoras** | Constroem uma tarefa por vez, numa worktree e numa branch próprias, com TDD; nunca integram | [02, "Com agentes especialistas"](nucleo/02-sessoes-e-papeis.md) |
| **Skills por agente** | Regras concretas tiradas das referências de cada tema, com fonte, teste e checklist (plugin `metodo`) | [`skills/`](skills/) e [03, "Mapa de skills"](nucleo/03-skills-e-testes.md) |
| **Bases de referências** | O que a leitura das referências de cada agente ensinou, com o link | [`modelos/referencias/`](modelos/referencias/) |
| **Lições** | Os erros que já aconteceram e a regra que ficou; todo agente lê as do seu tema | [`licoes/`](licoes/_indice.md) |
| **Segurança desde o começo** | A `security-audit` no primeiro mapa de riscos (Fase 2), nas revisões de PR sensíveis e na auditoria completa antes da primeira publicação (Fase 7), sempre com a sua aprovação | [`metodo:auditoria-de-seguranca`](skills/auditoria-de-seguranca/SKILL.md) |
| **Custo sob controle** (rascunho) | O ponytail: menos tokens no Claude Code (a menor mudança que resolve a tarefa, respostas curtas) e o consumo medido por tarefa; no Codex, só sob demanda | [03, "Ponytail"](nucleo/03-skills-e-testes.md) |
| **Método** | As fases, os portões, os testes, o Git e o CI que todos os agentes seguem | [`nucleo/`](nucleo/) |

A arquitetura escala para baixo: um projeto pequeno roda com **uma sessão**, ou com a integradora e poucas trabalhadoras no Orca, sem os especialistas. O método é o mesmo em todos os tamanhos ([02](nucleo/02-sessoes-e-papeis.md)).

## Conceitos, harnesses, skills e ferramentas

Tudo o que a arquitetura usa, com o link de onde cada coisa é explicada.

### Conceitos

| Conceito | O que é | Onde está |
|---|---|---|
| **Agente principal** | A ferramenta do projeto: Claude Code ou Codex, a mesma para todas as sessões, registrada na linha `Agente principal:` do `docs/DESENVOLVIMENTO.md` | [02](nucleo/02-sessoes-e-papeis.md), [decisão 010](decisoes/010-um-agente-principal-por-projeto.md) |
| **Integradora** | A sessão que coordena, valida com olhar independente e é a única que integra na `main`. No Orca, é a coordenadora | [02](nucleo/02-sessoes-e-papeis.md) |
| **Trabalhadora** | A sessão que constrói uma tarefa isolada, numa worktree e numa branch próprias, e termina com o PR aberto | [02](nucleo/02-sessoes-e-papeis.md) |
| **Especialista** | O agente de um tema (Arquitetura, Back e Dados, Design e Front, Segurança, Produto, DevOps), que decide e revisa o tema e coordena as próprias trabalhadoras | [02, "Com agentes especialistas"](nucleo/02-sessoes-e-papeis.md), [decisão 008](decisoes/008-agentes-especialistas.md) |
| **Harness** | As regras de atuação de um agente, em 10 partes: missão, quando é chamado, o que lê, o que pode e o que não pode, Skills, checklist, formato da resposta, quando sobe a decisão, memória e economia. O harness manda; o que se consulta só informa | [modelo do harness](modelos/agentes/_modelo-harness.md) |
| **Skill** | Um passo a passo que o agente carrega para um tipo de trabalho (planejar, testar, revisar, um tema). Dizer qual Skill está em uso faz parte do trabalho | [03, "Mapa de skills"](nucleo/03-skills-e-testes.md) |
| **Skill por agente** | Uma skill do plugin `metodo` tirada da leitura das referências de um especialista: passo a passo com a fonte, o teste que prova, checklist e como adaptar ao tamanho do projeto | [decisão 009](decisoes/009-skills-por-agente.md) |
| **Base de referências** | O que a leitura das referências de cada agente ensinou (regra, porquê, link). O agente procura nela antes de ir aos sites | [`modelos/referencias/`](modelos/referencias/) |
| **Plugin `metodo`** | Este repositório empacotado para o Claude Code e o Codex: as skills de início, atualização e consulta, e as skills dos agentes | [`.claude-plugin/`](.claude-plugin/marketplace.json) |
| **Fases e portões** | O caminho da ideia ao fechamento (Fases 0 a 9). Em cada portão, a pessoa aprova: spec, plano, cada merge e o deploy | [01](nucleo/01-fluxo-de-ponta-a-ponta.md) |
| **Spec e critérios de aceite** | O alvo escrito antes de construir e a lista verificável do que "pronto" quer dizer | [modelo de spec](modelos/modelo-spec.md), [critérios de aceite](modelos/modelo-criterios-de-aceite.md) |
| **Testes micro e macro** | Micro: TDD, com o teste escrito e visto falhar antes do código. Macro: a suíte inteira, os tipos, o build e a exploração no navegador | [03](nucleo/03-skills-e-testes.md) |
| **Issue, branch e PR** | Uma tarefa, uma branch, um PR, com o CI verde. As branches integradas ficam no GitHub | [05](nucleo/05-git-github-e-ci.md) |
| **Worktree** | Uma cópia de trabalho por tarefa, para várias sessões trabalharem ao mesmo tempo sem se cruzar | [05, "Worktrees"](nucleo/05-git-github-e-ci.md) |
| **Orca** | O aplicativo que abre os agentes, cada um na sua worktree, e leva as dúvidas e os portões para a integradora (`worker-start`, `ask`, `gate-create`) | [02, "Com o Orca"](nucleo/02-sessoes-e-papeis.md) |
| **Contrato da API** | O acordo entre o back e o front, fechado e aprovado antes de construir quando os dois andam em paralelo. É da Arquitetura | [02](nucleo/02-sessoes-e-papeis.md) |
| **Mapa de riscos** | O que proteger, de quem e por onde, feito na Fase 2 com o roteiro da `security-audit`. Cada risco vira critério de aceite | [harness da Segurança](modelos/agentes/seguranca.md) |
| **`CLAUDE.md` e `AGENTS.md` do projeto** | As instruções que cada ferramenta lê ao abrir o projeto: o Claude Code lê o `CLAUDE.md`, e o Codex lê o `AGENTS.md`, que manda ler o `CLAUDE.md` | [modelo do `CLAUDE.md`](modelos/CLAUDE-projeto.md), [modelo do `AGENTS.md`](modelos/AGENTS-projeto.md) |
| **Memória do projeto** | O que a próxima sessão precisa saber: estado, decisões, pendências e, por tarefa, retrabalho e consumo | [modelo da memória](modelos/memoria-do-projeto.md) |
| **Ponytail** (rascunho) | Plugin que faz o agente escrever a menor mudança que resolve a tarefa inteira. No Claude Code reduz tokens e custo; no Codex fica só sob demanda. O TDD, a spec e o que as skills do método exigem valem por cima dele | [03, "Ponytail"](nucleo/03-skills-e-testes.md) |
| **Consumo por tarefa** | Custo, tokens, idas e voltas e tempo de cada tarefa, anotados na memória e comparados na Fase 9. No Claude Code, vêm do quadro local do ponytail | [harness da integradora](modelos/agentes/integradora.md) |
| **Cenário** | Como o método se adapta a um tipo de projeto, com selo de maturidade (`rascunho`, `testado em 1 projeto`, `estável`) | [`cenarios/`](cenarios/README.md) |
| **Caso, lição e decisão** | Caso: a retrospectiva de um projeto. Lição: um erro e a regra que veio dele. Decisão: por que uma regra mudou | [`casos/`](casos/_modelo-caso.md), [`licoes/`](licoes/_indice.md), [`decisoes/`](decisoes/_modelo-decisao.md) |

### Harnesses

| Agente | Harness | Presença |
|---|---|---|
| Integradora | [integradora.md](modelos/agentes/integradora.md) | sempre |
| Arquitetura | [arquitetura.md](modelos/agentes/arquitetura.md) | sempre |
| Back e Dados | [back-e-dados.md](modelos/agentes/back-e-dados.md) | sempre |
| Design e Front | [design-e-front.md](modelos/agentes/design-e-front.md) | sempre |
| Segurança | [seguranca.md](modelos/agentes/seguranca.md) | sempre |
| Produto | [produto.md](modelos/agentes/produto.md) | sob demanda (Fases 0 a 2) |
| DevOps | [devops.md](modelos/agentes/devops.md) | sob demanda |

### Skills

Quando usar cada uma está no [mapa de skills do 03](nucleo/03-skills-e-testes.md). Toda skill do mapa tem um agente que a usa, ou está em "Skills fora dos agentes", no mesmo arquivo, com o motivo; o verificador acusa se alguma ficar solta. Saíram do método, por repetir outra skill ou não ter papel: `engineering:debug` (fica o `superpowers:systematic-debugging`), `engineering:code-review` (fica o `/ponytail-review`), `engineering:tech-debt` (a Fase 8 da integradora cobre) e `engineering:standup`.

| De onde | Skills |
|---|---|
| Plugin `metodo`: início e consulta | `metodo:novo-projeto`, `metodo:atualizar-projeto`, `metodo:consultar` |
| Plugin `metodo`: Integradora | `metodo:validacao-final`, `metodo:metricas-de-entrega` |
| Plugin `metodo`: Arquitetura | `metodo:contrato-de-api`, `metodo:analise-de-falhas`, `metodo:migracao-de-sistema` |
| Plugin `metodo`: Back e Dados | `metodo:api-conforme-contrato`, `metodo:migracao-sem-parada`, `metodo:transacoes-e-consultas`, `metodo:trabalho-em-segundo-plano` |
| Plugin `metodo`: Design e Front | `metodo:formularios-e-erros`, `metodo:desempenho-na-tela`, `metodo:estados-da-tela` |
| Plugin `metodo`: Segurança | `metodo:autenticacao-e-sessao`, `metodo:controle-de-acesso`, `metodo:entrada-nao-confiavel`, `metodo:incidente-com-dados-pessoais`, `metodo:auditoria-de-seguranca` |
| Plugin `metodo`: Produto | `metodo:necessidades-e-riscos`, `metodo:descoberta-continua` |
| Plugin `metodo`: DevOps | `metodo:publicacao-gradual`, `metodo:metas-e-alertas`, `metodo:ci-seguro` |
| Superpowers (o fluxo) | `superpowers:brainstorming`, `superpowers:writing-plans`, `superpowers:executing-plans`, `superpowers:subagent-driven-development`, `superpowers:dispatching-parallel-agents`, `superpowers:test-driven-development`, `superpowers:systematic-debugging`, `superpowers:verification-before-completion`, `superpowers:requesting-code-review`, `superpowers:receiving-code-review`, `superpowers:using-git-worktrees`, `superpowers:finishing-a-development-branch`, `superpowers:diagnosing-superpowers`; e `superpowers:writing-skills`, só na sessão que mantém este repositório |
| engineering | `engineering:architecture`, `engineering:system-design`, `engineering:testing-strategy`, `engineering:deploy-checklist`, `engineering:incident-response`, `engineering:documentation` |
| design | `design:accessibility-review`, `design:design-critique`, `design:design-handoff`, `design:ux-copy`, `design:design-system`, `design:user-research`, `design:research-synthesis` |
| Ponytail (rascunho) | o modo ponytail (a menor mudança que resolve a tarefa inteira), `/ponytail-review`, `/ponytail-audit` e `/ponytail-debt` |
| De fora | `security-audit` (auditoria de segurança da Cloudflare, usada pela Segurança) e `reverse-engineer-anything` (engenharia reversa, do REA) |

### Ferramentas

Claude Code ou Codex (o agente principal), Orca (orquestração), GitHub e GitHub CLI (`gh`), Git, Node.js, os plugins Superpowers, engineering, design, `metodo` e ponytail (rascunho), o REA e a skill `security-audit`. A instalação de cada uma, com o link oficial, está em [Antes de começar](#antes-de-começar-uma-vez-por-computador).

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
| [02 · Sessões e papéis](nucleo/02-sessoes-e-papeis.md) | A arquitetura de agentes: uma sessão ou várias, integradora, especialistas e trabalhadoras, o Orca e o agente principal |
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
| [modelos/](modelos/) | O que se copia para um projeto: os harnesses dos agentes, as bases de referências, o formulário de tarefa, o modelo de PR, o CI, o `CLAUDE.md` e o `AGENTS.md` do projeto, os scripts de worktree, os prompts e os gabaritos |
| `skills/` | As skills do plugin `metodo`: `novo-projeto` (inicia um projeto), `atualizar-projeto` (traz um projeto existente para a versão atual), `consultar` (dá às sessões do projeto acesso ao método) e as skills de cada agente especialista; o catálogo do plugin fica em `.claude-plugin/` |
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

O caminho principal é o plugin `metodo`: este repositório também é um plugin do Claude Code e do Codex, e o agente de qualquer computador com acesso a ele baixa a arquitetura inteira e começa um projeto com um comando ([decisão 005](decisoes/005-iniciar-projeto-com-uma-skill.md)).

### Antes de começar (uma vez por computador)

O método usa, além do plugin `metodo`, três plugins, uma ferramenta de engenharia reversa, o Orca, para orquestrar os agentes, e uma skill de auditoria de segurança. Instale tudo nesta ordem:

| O quê | Para que o método usa | Repositório oficial (instalação, uso e atualização) |
|---|---|---|
| Plugin **Superpowers** | O fluxo inteiro: brainstorming, TDD, depuração, planos, revisão e verificação antes de dizer "pronto" | [obra/superpowers](https://github.com/obra/superpowers) |
| Plugin **engineering** | Documentação, arquitetura, desenho de sistemas, estratégia de testes, checklist de deploy, incidentes | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins/tree/main/engineering) |
| Plugin **design** | Revisão de acessibilidade, crítica de design, entrega para desenvolvimento e textos de interface | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins/tree/main/design) |
| **REA** (skill `reverse-engineer-anything` e servidor `rea`) | Engenharia reversa de artefatos fechados, quando uma referência não tem código-fonte ([04](nucleo/04-referencias-e-engenharia-reversa.md)) | [morluto/rea](https://github.com/morluto/rea) |
| **Orca** (aplicativo e as skills `orca-cli` e `orchestration`) | Orquestração dos agentes: a coordenadora faz o papel da integradora e os agentes, das trabalhadoras ([02](nucleo/02-sessoes-e-papeis.md)) | [stablyai/orca](https://github.com/stablyai/orca) |
| **Codex** (opcional) | O agente principal dos projetos que escolhem o Codex no lugar do Claude Code: todas as sessões do projeto usam a mesma ferramenta, com as mesmas regras e Skills ([02](nucleo/02-sessoes-e-papeis.md), "Um agente principal por projeto") | [openai/codex](https://github.com/openai/codex) |
| Plugin **ponytail** (rascunho) | Menos tokens e menos custo no Claude Code (a menor mudança que resolve a tarefa inteira, respostas curtas) e a medida do consumo por tarefa; a revisão `/ponytail-review` dos especialistas e a auditoria de qualidade da Fase 8. No Codex, só sob demanda. O TDD do método vale por cima | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) |
| Skill **security-audit** | Auditoria completa de segurança do código, feita pelo agente de Segurança antes da primeira publicação, com a sua aprovação | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) |
| Plugin **metodo** | Este repositório: `/metodo:novo-projeto`, `/metodo:atualizar-projeto`, a consulta ao método nas sessões do projeto e as skills dos agentes especialistas (as de cada especialista) | este repositório |

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

**8. Codex (opcional, só para projetos com o Codex como agente principal).** O Codex segue as mesmas regras e Skills que o Claude, então precisa das mesmas ferramentas. No terminal:

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

**9. Skill security-audit, no terminal** (instala para o Claude Code e para o Codex de uma vez, em `~/.agents/skills/security-audit`):

```bash
npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit --global --agent claude-code codex -y
```

Ela roda auditorias que gastam bastante cota (vários subagentes), por isso o agente de Segurança só a usa com a sua aprovação (skill `metodo:auditoria-de-seguranca`). Para atualizar: `npx skills update security-audit --global`; para conferir: `npx skills ls --global`. Os relatórios ficam fora do projeto, em `~/security-audit-skill/`. Requisitos e opções: [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill).

**10. Ponytail (rascunho).** Reduz o custo em tokens no Claude Code: cada agente escreve a menor mudança que resolve a tarefa inteira, com respostas mais curtas, sem cortar validação, segurança nem acessibilidade. Na medição do próprio repositório, foram 45% menos tokens de saída e 26% menos custo por tarefa. O TDD do método vale por cima dele ([03, "Ponytail"](nucleo/03-skills-e-testes.md)). Dentro do Claude Code, em dois comandos:

```text
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

No Codex, no terminal. Ali ele fica **só sob demanda**: não confie nos dois ganchos dele em `/hooks`, porque nos modelos de raciocínio da OpenAI as regras sempre ligadas encareceram em vez de economizar (veja o `03`):

```bash
codex plugin marketplace add DietrichGebert/ponytail
codex plugin add ponytail@ponytail
```

No Claude Code, ele fica ligado em toda sessão, no nível `full`, e a faixa acima do prompt mostra o custo de cada tarefa. Instale só pelo repositório oficial, [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail). Para usar sem surpresa ([03, "Uso seguro no tempo"](nucleo/03-skills-e-testes.md)):

- troque o nível só na sessão (`/ponytail off`, `/ponytail full`); **nunca** use `/ponytail default`, que muda todas as sessões do computador;
- o nível vale por pasta: duas sessões na mesma pasta dividem o nível;
- deixe a atualização automática desligada para o marketplace `ponytail`; a versão conferida pelo método é a 5.3.3, e cada atualização passa antes por uma releitura dos ganchos.

Os conectores que os plugins engineering e design trazem (Slack, Figma, Linear e outros) podem ficar sem autenticação; o método não depende deles.

### Iniciar um projeto

**A cada projeto**, abra o Claude Code (ou o Codex) numa pasta vazia e descreva o que quer:

```bash
mkdir ~/Projetos/meu-site && cd ~/Projetos/meu-site && claude
```

```text
/metodo:novo-projeto Quero um portfólio bilíngue para mostrar meus trabalhos de vídeo. site-estatico
```

**Agente principal:** a skill pergunta qual ferramenta o projeto vai usar, Claude Code (padrão) ou Codex. Todas as sessões do projeto (a integradora, os especialistas e as trabalhadoras) usam a mesma, nunca as duas. No caminho manual, passe `--agente codex` ao `novo-projeto.sh` para escolher o Codex ([decisão 010](decisoes/010-um-agente-principal-por-projeto.md)).

A skill confere o ambiente, propõe o cenário (e avisa se ele é `rascunho`), pede **uma** confirmação antes de criar o repositório no GitHub, prepara tudo com o `novo-projeto.sh` (inclusive o `CLAUDE.md` do projeto, que dá o contexto a toda sessão futura), espera o primeiro CI e começa a Fase 0. Daí em diante, ela para em cada portão: spec, plano, cada merge e deploy. Qualquer sessão do projeto consulta o método pela skill `metodo:consultar`.

**Para trabalhar com vários agentes no Orca**, abra o projeto no Orca e use o [prompt da coordenadora](modelos/prompt-coordenadora-orca.md) no agente principal: ela distribui as tarefas aos agentes, valida e só integra com a sua aprovação ([02](nucleo/02-sessoes-e-papeis.md), seção "Com o Orca").

**Num projeto Codex**, abra a coordenadora como um agente Codex no Orca: ela lê o `AGENTS.md`, usa o mesmo prompt e abre todos os agentes com `--agent codex`. Quando back e front são construídos em paralelo, o contrato da API é aprovado por você antes de qualquer tarefa de construção ([02](nucleo/02-sessoes-e-papeis.md), "Um agente principal por projeto").

**Para trabalhar com agentes especialistas**, a integradora coordena um especialista por tema (Arquitetura, Back e Dados, Design e Front, Segurança e, quando preciso, Produto e DevOps), e cada especialista abre as próprias trabalhadoras. Cada agente atua dentro de um harness escrito com você, em [`modelos/agentes/`](modelos/agentes/), que vai para o projeto com `scripts/novo-projeto.sh <pasta> --especialistas`. No Orca, ajuste antes **Settings → Orchestration → Nested worker depth = 2** ([02](nucleo/02-sessoes-e-papeis.md), "Com agentes especialistas").

### Atualizar um projeto que já usa o método

Quando o método muda, os projetos que você já tinha não mudam sozinhos. Primeiro atualize o plugin naquele computador (`/plugin marketplace update metodo-de-desenvolvimento` no Claude Code; `codex plugin marketplace upgrade metodo-de-desenvolvimento` no Codex) e reinicie a ferramenta; depois, dentro de cada projeto, abra a ferramenta do projeto e digite:

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
