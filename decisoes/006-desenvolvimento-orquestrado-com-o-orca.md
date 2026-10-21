# 006 · Desenvolvimento orquestrado com o Orca

**Data:** 2026-10-21
**Status:** aceita pela pessoa **sem caso real** (exceção à regra de ouro, pedida por ela); tudo o que esta decisão acrescenta fica como `rascunho` até o primeiro projeto feito com o Orca virar caso
**Caso de origem:** nenhum ainda. O primeiro projeto orquestrado com o Orca será registrado em `casos/` e confirma ou corrige esta decisão.

## Contexto

O método divide o trabalho entre uma sessão **integradora** e sessões **trabalhadoras** ([02](../nucleo/02-sessoes-e-papeis.md)). Na prática, a pessoa fazia essa orquestração à mão: abria cada sessão, criava a worktree com o script, colava o prompt da trabalhadora e levava as dúvidas de uma sessão para a outra.

A pessoa passou a usar o **Orca** ([stablyai/orca](https://github.com/stablyai/orca)), um aplicativo que coordena vários agentes de código, cada um na sua worktree. O Orca tem uma camada de orquestração (`orca orchestration`): uma coordenadora distribui tarefas a agentes supervisionados, os agentes perguntam à coordenadora e esperam a resposta, e a coordenadora pode bloquear uma tarefa num portão de decisão. A pessoa reconheceu nisso o mesmo modelo do método: **a coordenadora é a integradora e os agentes são as trabalhadoras**. Pediu que o método passe a valer assim desde já, também nos projetos que ela já tinha, mesmo antes de um caso real.

## Decisão

1. **Modo de execução novo, "Orca"** (rascunho), ao lado de inline, subagentes e sessões divididas. A coordenadora do Orca faz o papel da integradora; cada agente supervisionado (`orca orchestration worker-start`) é uma trabalhadora. As regras do método não mudam: quem constrói não valida, os agentes nunca integram, uma tarefa por branch e por PR, e merge, deploy e o que é irreversível só com a aprovação da pessoa. No Orca, cada uma dessas aprovações é um **portão de decisão** (`gate-create`) que a coordenadora só resolve com a resposta da pessoa.
2. **Dúvidas dos agentes** vão para a coordenadora com `orca orchestration ask`; a issue continua sendo o registro da tarefa.
3. **Limite inicial:** 1 coordenadora e até 3 agentes ao mesmo tempo, porque o painel e os avisos do Orca facilitam acompanhar. O número sobe ou desce com o caso. Sem o Orca, o limite continua 1 integradora e 2 trabalhadoras.
4. **Worktrees:** com o Orca, ele cria e remove as worktrees; os scripts `nova-tarefa.sh` e `remover-tarefa.sh` ficam para quem trabalha sem o Orca.
5. **Fase 9:** se o projeto rodou no Orca, a sessão do método pode consultar as conversas dos agentes com `orca search` (só leitura, com a autorização da pessoa), para recuperar as correções feitas durante o trabalho.
6. **Instalação:** o README passa a listar o Orca e as skills dele (`orca skills install --skill orca-cli --skill orchestration`).
7. **Projetos que já existem:** a skill nova **`/metodo:atualizar-projeto`**, usada dentro do projeto, leva o projeto à versão atual do método: mostra o que mudou desde a versão dele (pelo `CHANGELOG.md`), acrescenta o que falta sem apagar nada do projeto, pede uma confirmação e entrega tudo num PR.

Decidido pela pessoa em 2026-10-21.

## Consequências

- O modo integradora e trabalhadoras fica mais barato de operar: criar worktrees, distribuir tarefas e levar dúvidas deixam de ser trabalho manual.
- Os portões humanos passam a ter um mecanismo explícito no Orca, mas continuam dependendo de a coordenadora seguir a regra de só resolvê-los com a resposta da pessoa.
- A Fase 9 ganha uma fonte que antes se perdia: as conversas dos agentes.
- Mais uma ferramenta a instalar e manter, e uma regra que entrou sem caso: o primeiro projeto com o Orca precisa ser registrado para confirmar ou corrigir os pontos 1 a 5.
- Arquivos alterados: `nucleo/01-fluxo-de-ponta-a-ponta.md`, `nucleo/02-sessoes-e-papeis.md`, `nucleo/05-git-github-e-ci.md`, `modelos/prompt-coordenadora-orca.md` (novo), `modelos/CLAUDE-projeto.md`, `scripts/novo-projeto.sh`, `skills/novo-projeto/SKILL.md`, `skills/consultar/SKILL.md`, `skills/atualizar-projeto/SKILL.md` (novo), `scripts/verificar.mjs`, `README.md`, `casos/2026-10-repositorio-do-metodo.md`, `planos/2026-10-21-orquestracao-orca.md`, `CHANGELOG.md`, `VERSION` (2.4.0).
