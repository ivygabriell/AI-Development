# Arquitetura de agentes para desenvolvimento

Uma arquitetura de agentes de IA para construir sites, aplicações e soluções tecnológicas de forma organizada: **uma Lead que coordena, especialistas por tema que decidem e revisam, Builders que constroem e uma pessoa que aprova o que importa**. Os agentes rodam no **Claude Code e no Codex juntos, cada papel na sua ferramenta** ([decisão 013](decisoes/013-lead-e-builders-com-codex-e-claude.md)), orquestrados no [Orca](https://github.com/stablyai/orca), e seguem o mesmo método: alvo definido antes de construir, testes em duas camadas, uma branch por mudança e validação independente.

A arquitetura nasceu de um projeto real (um portfólio com animações, vídeos, CI e várias sessões em paralelo), inclui os erros que cometemos e **cresce a cada projeto**. Este repositório é **independente de qualquer projeto**. Versão atual: veja [VERSION](VERSION) e o [registro de mudanças](CHANGELOG.md).

## A arquitetura

```text
                              Pessoa
      aprova a spec, o plano, o deploy e o que aciona um gatilho
                                 │ portões
                                 ▼
                            Lead
          coordena, faz a validação final (QA) e é a única que integra
                                 │
     ┌──────────────┬────────────┼─────────────┬──────────────┬─────────────┐
     ▼              ▼            ▼             ▼              ▼             ▼
 Architect   Backend  Frontend  Security     Product       Ops
 contrato,     regras, APIs, experiência,    mapa de       necessidade,  deploy, CI,
 dados,        banco         interface       riscos,       critérios     nuvem
 falhas                                      auditoria     (Fases 0-2)   (quando preciso)
                    │            │
                    ▼            ▼                                          ▼
              Builders  Builders                            Builder
              (até 2)        (até 2)                                  (1 por vez)
```

| Peça | O que é | Onde está |
|---|---|---|
| **Ferramenta por papel** | Claude Code e Codex no mesmo projeto: a Lead, Product, Architect, Frontend e Designer no Claude Code; Backend, Security e Ops no Codex; a Builder vai para a outra quando a cota aperta | [02, "Lead e ferramenta por papel"](nucleo/02-sessoes-e-papeis.md) |
| **Lead** | A Lead: abre as issues, distribui aos especialistas, valida e integra (sozinha quando nada aciona um gatilho de aprovação; com gatilho, com a sua aprovação) | [harness da Lead](modelos/agentes/lead.md) |
| **Especialistas** | Um agente por tema, cada um com um **harness**: missão, o que pode e o que não pode, procedimentos, checklist, quando sobe a decisão | [`modelos/agentes/`](modelos/agentes/) |
| **Builders** | Constroem uma tarefa por vez, numa worktree e numa branch próprias, com TDD; nunca integram | [02, "Com agentes especialistas"](nucleo/02-sessoes-e-papeis.md) |
| **Bases de referências** | O que a leitura das referências de cada agente ensinou, com o link | [`modelos/referencias/`](modelos/referencias/) |
| **Lições** | Os erros que já aconteceram e a regra que ficou; todo agente lê as do seu tema | [`licoes/`](licoes/_indice.md) |
| **Security desde o começo** | A `security-audit` orienta o mapa de riscos e a revisão de PRs sensíveis. A auditoria completa passa pela aprovação da pessoa. | [Testes e auditoria](nucleo/03-skills-e-testes.md) |
| **Método** | As fases, os portões, os testes, o Git e o CI que todos os agentes seguem | [`nucleo/`](nucleo/) |

A arquitetura escala para baixo: um projeto pequeno roda com **uma sessão**, ou com a Lead e poucas Builders no Orca, sem os especialistas. O método é o mesmo em todos os tamanhos ([02](nucleo/02-sessoes-e-papeis.md)).

## Conceitos, harnesses, skills e ferramentas

Tudo o que a arquitetura usa, com o link de onde cada coisa é explicada.

### Conceitos

| Conceito | O que é | Onde está |
|---|---|---|
| **Ferramenta por papel** | A ferramenta de cada papel, registrada na linha `Lead:` e na tabela Ferramenta por papel do `processo/DESENVOLVIMENTO.md`; todo PR recebe ao menos uma revisão da outra ferramenta | [02](nucleo/02-sessoes-e-papeis.md), [decisão 013](decisoes/013-lead-e-builders-com-codex-e-claude.md) |
| **Lead** | A sessão que coordena, valida com olhar independente e é a única que integra na `main`. No Orca, é a Lead | [02](nucleo/02-sessoes-e-papeis.md) |
| **Builder** | A sessão que constrói uma tarefa isolada, numa worktree e numa branch próprias, e termina com o PR aberto | [02](nucleo/02-sessoes-e-papeis.md) |
| **Especialista** | O agente de um tema (Architect, Backend, Frontend, Designer, Security, Product, Ops), que decide e revisa o tema e coordena as próprias Builders | [02, "Com agentes especialistas"](nucleo/02-sessoes-e-papeis.md), [decisão 008](decisoes/008-agentes-especialistas.md) |
| **Harness** | As regras de atuação de um agente, em 10 partes: missão, quando é chamado, o que lê, o que pode e o que não pode, procedimentos, checklist, formato da resposta, quando sobe a decisão, memória e economia. O harness manda; o que se consulta só informa | [modelo do harness](modelos/agentes/_modelo-harness.md) |
| **Skill** | O método usa `security-audit`, da Cloudflare, para o trabalho de segurança. | [Testes e auditoria](nucleo/03-skills-e-testes.md) |
| **Base de referências** | O que a leitura das referências de cada agente ensinou (regra, porquê, link). O agente procura nela antes de ir aos sites | [`modelos/referencias/`](modelos/referencias/) |
| **Fases e portões** | O caminho da ideia ao fechamento (Fases 0 a 9). Em cada portão, a pessoa aprova: spec, plano, deploy e o que aciona um dos seis gatilhos de aprovação; o resto a Lead decide e registra | [01](nucleo/01-fluxo-de-ponta-a-ponta.md) |
| **Spec e critérios de aceite** | O alvo escrito antes de construir e a lista verificável do que "pronto" quer dizer | [modelo de spec](modelos/modelo-spec.md), [critérios de aceite](modelos/modelo-criterios-de-aceite.md) |
| **Testes micro e macro** | Micro: TDD, com o teste escrito e visto falhar antes do código. Macro: a suíte inteira, os tipos, o build e a exploração no navegador | [03](nucleo/03-skills-e-testes.md) |
| **Issue, branch e PR** | Uma tarefa, uma branch, um PR, com o CI verde. As branches integradas ficam no GitHub | [05](nucleo/05-git-github-e-ci.md) |
| **Worktree** | Uma cópia de trabalho por tarefa, para várias sessões trabalharem ao mesmo tempo sem se cruzar | [05, "Worktrees"](nucleo/05-git-github-e-ci.md) |
| **Orca** | O aplicativo que abre os agentes, cada um na sua worktree, e leva as dúvidas e os portões para a Lead (`worker-start`, `ask`, `gate-create`) | [02, "Com o Orca"](nucleo/02-sessoes-e-papeis.md) |
| **Contrato da API** | O acordo entre o back e o front, fechado e aprovado antes de construir quando os dois andam em paralelo. É do Architect | [02](nucleo/02-sessoes-e-papeis.md) |
| **Mapa de riscos** | O que proteger, de quem e por onde, feito na Fase 2 com o roteiro da `security-audit`. Cada risco vira critério de aceite | [harness do Security](modelos/agentes/security.md) |
| **`CLAUDE.md` e `AGENTS.md` do projeto** | As instruções que cada ferramenta lê ao abrir o projeto: o Claude Code lê o `CLAUDE.md`, e o Codex lê o `AGENTS.md`, que manda ler o `CLAUDE.md` | [modelo do `CLAUDE.md`](modelos/CLAUDE-projeto.md), [modelo do `AGENTS.md`](modelos/AGENTS-projeto.md) |
| **Memória do projeto** | O que a próxima sessão precisa saber: estado, decisões, pendências e, por tarefa, retrabalho e consumo | [modelo da memória](modelos/memoria-do-projeto.md) |
| **Consumo por tarefa** | Custo, tokens, idas e voltas e tempo de cada tarefa, anotados na memória e comparados na Fase 9 | [harness da Lead](modelos/agentes/lead.md) |
| **Cenário** | Como o método se adapta a um tipo de projeto, com selo de maturidade (`rascunho`, `testado em 1 projeto`, `estável`) | [`cenarios/`](cenarios/README.md) |
| **Caso, lição e decisão** | Caso: a retrospectiva de um projeto. Lição: um erro e a regra que veio dele. Decisão: por que uma regra mudou | [`casos/`](casos/_modelo-caso.md), [`licoes/`](licoes/_indice.md), [`decisoes/`](decisoes/_modelo-decisao.md) |

### Harnesses

| Agente | Harness | Presença |
|---|---|---|
| Lead | [lead.md](modelos/agentes/lead.md) | sempre |
| Architect | [architect.md](modelos/agentes/architect.md) | sempre |
| Backend | [backend.md](modelos/agentes/backend.md) | sempre |
| Frontend | [frontend.md](modelos/agentes/frontend.md) | sempre |
| Designer | [designer.md](modelos/agentes/designer.md) | sob demanda (Fases 1 e 2, tela nova) |
| Security | [security.md](modelos/agentes/security.md) | sempre |
| Product | [product.md](modelos/agentes/product.md) | sob demanda (Fases 0 a 2) |
| Ops | [ops.md](modelos/agentes/ops.md) | sob demanda |

### Skill de segurança

A única skill usada pelo método é a [security-audit da Cloudflare](https://github.com/cloudflare/security-audit-skill). O [núcleo 03](nucleo/03-skills-e-testes.md) explica quando usá-la e como registrar a auditoria.

### Ferramentas

Claude Code, Codex, Git, GitHub, GitHub CLI e Node.js. O Orca coordena sessões quando esse modo é escolhido. Em projetos com interface, o Figma é usado para a identidade e as telas.

## Os 7 princípios

1. **Alvo antes de construir.** Entenda a intenção, escreva de volta o que entendeu e só então desenhe. Se o pedido cita um título, um nome ou uma referência, ache exatamente aquilo; se não bater, pergunte antes de implementar.
2. **Quem constrói não é quem valida.** Quem implementa entrega com os testes verdes. Outra sessão (a Lead) refaz tudo e **explora** o resultado contra o pedido. "CI verde" não prova que a coisa certa foi feita.
3. **Teste primeiro, em duas camadas (micro e macro).** O teste é escrito e visto falhar antes do código (micro). A suíte inteira, o build, os tipos e a exploração da página inteira fecham o trabalho (macro).
4. **Uma mudança, uma branch; a `main` sempre estável.** Toda mudança entra por Pull Request com a verificação automática verde. Nada de commit direto na `main`.
5. **Um procedimento para cada etapa.** Explore alternativas antes de criar, implemente com TDD, investigue a causa dos bugs e verifique o resultado antes de concluir.
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
| [02 · Sessões e papéis](nucleo/02-sessoes-e-papeis.md) | A arquitetura de agentes: uma sessão ou várias, Lead, especialistas e Builders, o Orca e a ferramenta por papel |
| [03 · Testes e auditoria de segurança](nucleo/03-skills-e-testes.md) | Testes micro e macro, verificação no navegador e auditoria de segurança |
| [04 · Referências e engenharia reversa](nucleo/04-referencias-e-engenharia-reversa.md) | Como estudar um site ou app de referência e quando usar engenharia reversa |
| [05 · Git, GitHub e CI](nucleo/05-git-github-e-ci.md) | Branches, PRs, verificação automática, proteção da `main`, worktrees |

### Camadas que crescem

| Pasta | Conteúdo |
|---|---|
| [cenarios/](cenarios/README.md) | Um arquivo por tipo de projeto (site, aplicação web, API, mobile, automação, infraestrutura, biblioteca, IA), com selo de maturidade e checklist |
| [casos/](casos/_modelo-caso.md) | Uma retrospectiva por projeto realizado: o que funcionou, o que falhou, medidas |
| [licoes/](licoes/_indice.md) | Uma lição por arquivo: o que aconteceu, a causa, a regra |
| [decisoes/](decisoes/_modelo-decisao.md) | Por que uma regra do método mudou |
| [modelos/](modelos/) | O que se copia para um projeto: os harnesses dos agentes, as bases de referências, o formulário de tarefa, o modelo de PR, o CI, o `CLAUDE.md` e o `AGENTS.md` do projeto, os scripts de worktree, os prompts e os gabaritos |
| `planos/` | Os planos de implementação das mudanças do método |
| `scripts/` | `verificar.mjs` (confere o próprio método), `gerar-indice-licoes.mjs` e `novo-projeto.sh` |

## Visão em uma página

```text
Ideia ──► Alvo (Fase 0-2) ──► Plano (3) ──► Construir com TDD (4) ──► Validar (5) ──► Integrar (6) ──► Publicar (7) ──► Manter (8) ──► Fechar (9)
            │  humano aprova      │ humano      │ Builder          │ Lead    │ humano       │ humano                    │ caso + lições
            │  o desenho          │ aprova      │ micro + macro         │ micro + macro  │ autoriza     │ autoriza                  ▼
            ▼                     ▼             ▼                       ▼                ▼              ▼                    o método aprende
        spec / critérios      tarefas       branch + PR + CI        navegador/exploração   merge na main   deploy
```

## Adotar em um projeto novo

### Antes de começar (uma vez por computador)

Instale Git, Node.js, GitHub CLI e as ferramentas de agente escolhidas. Para acessar este repositório privado, autentique-se com `gh auth login` e rode `gh auth setup-git`. Confira com `node --version`, `git --version` e `gh auth status`.

**Auditoria de segurança.** Instale a skill da Cloudflare para o Claude Code e o Codex:

```bash
npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit --global --agent claude-code codex -y
```

Confira com `npx skills ls --global`. O portão da auditoria completa está no [núcleo 03](nucleo/03-skills-e-testes.md#security-audit).

**Orca, quando escolhido.** Instale o aplicativo pelo [repositório do Orca](https://github.com/stablyai/orca) e siga [Sessões e papéis](nucleo/02-sessoes-e-papeis.md#com-o-orca).

**Figma, em projetos com interface.** Use o [servidor MCP oficial](https://developers.figma.com/docs/figma-mcp-server/) quando integrado ao ambiente. No Codex:

```bash
codex mcp add figma --url https://mcp.figma.com/mcp
```

A pessoa decide se habilita a escrita no Figma. Sem escrita pelo agente, a pessoa desenha e os agentes consultam as telas.

### Iniciar um projeto

1. Tenha uma cópia local do método e prepare um repositório Git novo na pasta do projeto. Escolha os [cenários aplicáveis](cenarios/README.md).
2. Da cópia local do método, rode:

   ```bash
   scripts/novo-projeto.sh /caminho/do/projeto site-estatico
   ```

   O script gera `CLAUDE.md`, `AGENTS.md`, formulários, o CI inicial e os arquivos em `processo/`. Ele avisa quando o cenário é rascunho. Informe à Lead onde está a cópia local do método para que as sessões possam consultar `nucleo/` e `modelos/`.
3. **Ferramenta por papel.** Por padrão, Lead, Product, Architect, Frontend e Designer usam Claude Code. Backend, Security e Ops usam Codex. Para concentrar os papéis numa ferramenta, passe `--agente claude` ou `--agente codex`.
4. **Especialistas no Orca.** Se esse modo foi definido na preparação, passe `--especialistas` para copiar `modelos/agentes/` para `processo/agentes/`. No Orca, configure **Nested worker depth = 2**. Se escolher o modo depois, copie os harnesses necessários e registre o modo em `processo/DESENVOLVIMENTO.md`.
5. Faça o primeiro commit e push autorizados. O primeiro CI avisa que a stack ainda está indefinida. Confira o CI, configure a proteção da `main` se disponível e siga a [Fase 0](nucleo/01-fluxo-de-ponta-a-ponta.md#fase-0--descobrir-a-intenção). O primeiro PR da stack ajusta o CI e os comandos de `processo/DESENVOLVIMENTO.md`.

### Atualizar um projeto que já usa o método

Compare a versão do projeto com [VERSION](VERSION) e leia o [CHANGELOG](CHANGELOG.md). Use uma branch própria. Para comparar os modelos, rode `scripts/novo-projeto.sh` numa pasta temporária vazia com as mesmas opções do projeto. Aplique somente as mudanças aprovadas, preservando as instruções, decisões e o CI do projeto. Confira o diff preparado antes de fazer o commit e abra um PR pela regra do projeto.

## Como este repositório cresce

1. **Cada projeto termina com a Fase 9** ([01](nucleo/01-fluxo-de-ponta-a-ponta.md)): um caso registrado, lições novas, ajustes nos cenários e, se uma regra mudou, uma decisão.
2. **Nada entra sem um caso real.** Opinião sem evidência fica de fora.
3. **Toda mudança entra por Pull Request**, com `node scripts/verificar.mjs` verde no CI. O método usa o próprio método.
4. **Cenários têm selo de maturidade** (`rascunho`, `testado em 1 projeto`, `estável`) e só sobem com um caso.
5. **Versionamento:** `VERSION` e [CHANGELOG](CHANGELOG.md); maior quando muda a estrutura ou uma regra do núcleo, menor para conteúdo novo, correção para ajustes de texto.
6. **Uma sessão do Claude Code dedicada** mantém este repositório: o [CLAUDE.md](CLAUDE.md) traz as regras e o [prompt inicial](modelos/prompt-sessao-do-metodo.md) abre a sessão.

## Convenções

- Idioma: português nos documentos e nos commits; nomes de comandos e código ficam como são.
- Nomes de branch: `feat/`, `fix/`, `chore/`, `docs/` + um *slug* em minúsculas com hifens.
- Commits em Conventional Commits (`feat: ...`, `fix: ...`).
- As branches integradas **ficam** no GitHub ([decisão 003](decisoes/003-branches-integradas-ficam-no-github.md)).
- Verificador: `node scripts/verificar.mjs` confere estrutura, links, lições, cenários, scripts e a ausência de dados pessoais.
