# Registro de mudanças

Segue [versionamento semântico](https://semver.org/lang/pt-BR/): **maior** quando a estrutura ou uma regra do núcleo muda de forma incompatível, **menor** quando entra conteúdo novo (cenário, lição, modelo), **correção** para ajustes de texto. Cada versão grande ou média ganha uma tag Git (`v2.0.0`).

## 2.4.1 (2026-10-21)

- **Modo Orca:** a coordenadora e os agentes são sempre agentes Claude. O [prompt da coordenadora](modelos/prompt-coordenadora-orca.md) manda abrir cada agente com `worker-start --agent claude`, e o [02](nucleo/02-sessoes-e-papeis.md) e o `CLAUDE.md` dos projetos gerados explicam o motivo: os outros agentes que o Orca abre (Codex, Cursor e outros) não leem o `CLAUDE.md` do projeto nem os plugins `metodo` e Superpowers, e trabalhariam sem o método.
- `scripts/verificar.mjs` confere o `--agent claude` nos três lugares.

## 2.4.0 (2026-10-21)

Modo de execução com o Orca, aprovado pela pessoa **sem caso real** (exceção à regra de ouro; tudo em `rascunho` até o primeiro projeto com o Orca). Ver [decisão 006](decisoes/006-desenvolvimento-orquestrado-com-o-orca.md).

- **Núcleo:** o `02` ganha a seção "Com o Orca": a coordenadora é a integradora e cada agente supervisionado é uma trabalhadora; dúvidas por `orca orchestration ask`; merge e deploy passam por um portão (`gate-create`) que só a pessoa resolve; limite inicial de 1 coordenadora e até 3 agentes. O `01` oferece o Orca no portão da Fase 3 e consulta as conversas com `orca search` na Fase 9; o `05` cria as worktrees pelo Orca.
- **Modelo novo:** `modelos/prompt-coordenadora-orca.md`, com o prompt da coordenadora e a especificação padrão de cada tarefa.
- **Skill nova `/metodo:atualizar-projeto`** (rascunho): traz um projeto que já existe para a versão atual do método, só acrescentando, com uma confirmação e um PR.
- **Projetos gerados:** o `CLAUDE.md` e o `DESENVOLVIMENTO.md` explicam o modo Orca e a atualização; a skill `novo-projeto` oferece registrar o projeto no Orca e o modo Orca na Fase 3; a `consultar` aponta para os dois.
- **README:** o Orca nos pré-requisitos e a seção "Atualizar um projeto que já usa o método".
- Plano em [planos/2026-10-21-orquestracao-orca.md](planos/2026-10-21-orquestracao-orca.md).

## 2.3.2 (2026-10-15)

- README, "Antes de começar": cada ferramenta que o método usa aponta para o seu repositório oficial (Superpowers, engineering e design, REA), para consultar requisitos, uso e atualização. `scripts/verificar.mjs` confere os links.

## 2.3.1 (2026-10-15)

- README, "Adotar em um projeto novo": seção **Antes de começar** com tudo o que um computador precisa para usar o método, em ordem: programas (Claude Code, `git`, Node.js, `gh`), acesso ao repositório privado, plugins Superpowers, engineering e design, o REA (`npx rea-agents setup`), o plugin `metodo` e como conferir a instalação.
- `scripts/verificar.mjs` confere que o README instala todo plugin cujas skills o método cita, o REA e a conferência final.

## 2.3.0 (2026-10-15)

- **Plugin `metodo`:** este repositório passa a ser também um plugin do Claude Code (`.claude-plugin/marketplace.json`). Em qualquer computador com acesso a ele: `/plugin install metodo --marketplace ivygabriell/AI-Development` ([decisão 005](decisoes/005-iniciar-projeto-com-uma-skill.md)).
- **Skill `/metodo:novo-projeto`** (`skills/novo-projeto/`, maturidade `rascunho`): inicia um projeto com um comando, com uma confirmação antes de criar o repositório no GitHub e parando nos portões das fases.
- **Skill `metodo:consultar`** (`skills/consultar/`): diz às sessões do projeto onde está a cópia do método e o que ler em cada situação.
- `scripts/novo-projeto.sh` gera o `CLAUDE.md` do projeto (`modelos/CLAUDE-projeto.md`), que importa o `DESENVOLVIMENTO.md` e a memória; se já existir um, só avisa.
- `modelos/ci-node.yml` passa com o aviso "stack ainda não definida" enquanto não há `package.json`.
- Pasta nova `planos/`, com o [plano desta mudança](planos/2026-10-15-skill-novo-projeto.md).
- README: "Adotar em um projeto novo" passa a ter o caminho pelo plugin e o caminho manual.

## 2.2.0 (2026-10-14)

- **Caso novo:** [Repositório do método (2026-10)](casos/2026-10-repositorio-do-metodo.md), marco da publicação no GitHub e do primeiro PR.
- **Lição 019:** [proteção da `main` indisponível em repositório privado](licoes/019-protecao-da-main-indisponivel-em-repositorio-privado.md) (HTTP 403 numa conta gratuita).
- [05 · Git, GitHub e CI](nucleo/05-git-github-e-ci.md) e o README avisam que a proteção da `main` depende do plano e dizem o que fazer sem ela.
- `CLAUDE.md`: a `main` deste repositório fica sem proteção no GitHub, por decisão da pessoa; a regra vale pela disciplina da sessão.

## 2.1.0 (2026-10-14)

- `scripts/novo-projeto.sh` avisa no stderr quando um cenário escolhido tem maturidade `rascunho` (sem interromper o script) e o `docs/DESENVOLVIMENTO.md` gerado marca a maturidade de cada cenário. Assim um rascunho não é tratado como regra comprovada ([decisão 004](decisoes/004-repositorio-do-metodo-em-camadas.md), caso do [portfólio pessoal](casos/2026-10-portfolio-pessoal.md)).
- `scripts/verificar.mjs` cobre o aviso e a marcação de maturidade.

## 2.0.0 (2026-10-14)

Reorganização em camadas, para o método crescer com novos cenários e casos de uso.

- **Estrutura nova:** `nucleo/` (método base), `cenarios/`, `casos/`, `licoes/`, `decisoes/`, `modelos/` e `scripts/`.
- **Cenários:** o antigo documento "Adaptando para outros projetos" virou um arquivo por tipo de projeto (8 cenários), com selo de maturidade, skills úteis e checklist. Sem cenário de ERP por enquanto.
- **Lições:** o antigo documento de erros virou um arquivo por lição (18), com índice gerado por `scripts/gerar-indice-licoes.mjs`.
- **Casos e decisões:** primeiro caso (portfólio pessoal) e quatro decisões registradas.
- **Fase 9 de fechamento:** cada projeto termina alimentando o método. Regra: nada entra sem um caso real.
- **Novos scripts:** `scripts/novo-projeto.sh` (prepara um projeto novo com os modelos e carimba a versão do método) e o verificador movido para `scripts/verificar.mjs`, agora também no CI.
- **Sessão do método:** `CLAUDE.md` e `modelos/prompt-sessao-do-metodo.md` para uma sessão dedicada a manter este repositório.
- **Quebra:** os arquivos `01` a `05` foram movidos para `nucleo/`; `06` e `07` deixaram de existir (substituídos por `licoes/` e `cenarios/`).

## 1.1.0 (2026-10-14)

- Regra nova: as branches integradas ficam no GitHub (nunca apagar a remota). Lições 17 (apagar a branch remota por hábito) e 18 (pasta que sobra depois de remover uma worktree).

## 1.0.0 (2026-10-14)

- Primeira versão: princípios, fluxo (fases 0 a 8), sessões e papéis, skills e testes, referências e engenharia reversa, Git, GitHub e CI, 16 lições, 8 tipos de projeto, modelos e verificador.
