# 008 · Agentes especialistas ao lado da integradora

**Data:** 2026-10-28
**Status:** aceita pela pessoa **sem caso real** (exceção à regra de ouro, pedida por ela, como nas decisões [006](006-desenvolvimento-orquestrado-com-o-orca.md) e [007](007-back-com-codex-e-front-com-claude.md)); tudo o que esta decisão acrescenta fica como `rascunho` até o primeiro projeto feito assim virar caso
**Caso de origem:** nenhum ainda. O primeiro projeto com agentes especialistas será registrado em `casos/` e confirma ou corrige esta decisão.

## Contexto

No modo Orca, tudo passava por uma sessão só: a integradora (a coordenadora). Ela planejava, respondia às dúvidas de todas as trabalhadoras, revisava o back e o front, cuidava do contrato e integrava. A pessoa quis tirar esse peso dela com agentes especialistas por tema, cada um com um harness escrito por ela, para controlar a qualidade de cada agente.

O desenho foi feito com a pessoa ([desenho](../planos/2026-10-28-agentes-especialistas-desenho.md)) e implementado pelo [plano](../planos/2026-10-28-agentes-especialistas.md). Um teste no Orca 1.4.241 (Tarefa 1 do plano) mostrou que um especialista consegue abrir as próprias trabalhadoras e receber as dúvidas delas, desde que o Orca esteja com **Nested worker depth = 2** (o padrão é 1 e recusa com `nested_worker_depth_exceeded`).

## Decisão

1. **Modo novo, "com agentes especialistas"** (rascunho), dentro do modo Orca. Ao lado da integradora trabalham sete papéis: Integradora, Arquitetura, Back e Dados, Design e Front, Segurança (sempre ativos) e Produto e DevOps (sob demanda).
2. *(Substituído pela [decisão 010](010-um-agente-principal-por-projeto.md) em 2026-11-02: a ferramenta passa a ser a do projeto, a mesma para todos os agentes.)* **O tema decide a ferramenta**, para o especialista e para as trabalhadoras dele: Claude na Integradora, na Arquitetura, em Design e Front e no Produto; Codex em Back e Dados, na Segurança e no DevOps. Modelos fixos: `claude-opus-5-5` e `gpt-6.1-sol`; o esforço varia por papel.
3. **Cada agente tem um harness** em `modelos/agentes/`, com as mesmas 10 partes, as referências escolhidas pela pessoa e o passo a passo "Como pesquisa" (primeiro o que está guardado em `docs/referencias/`, depois os sites; adapta ao projeto; guarda o que leu; cita a fonte).
4. **O harness manda:** o agente pode consultar o que precisar, mas atua dentro do harness. Se acha o harness errado ou incompleto, não desvia: para e sobe a questão.
5. **Os especialistas que constroem coordenam as próprias trabalhadoras** no Orca (Back e Dados e Design e Front até 2 cada; DevOps 1 por vez). As dúvidas das trabalhadoras chegam ao especialista; só sobe para a integradora o que ele não pode decidir.
6. **Segurança** mapeia os riscos nas Fases 2 e 3 e revisa os PRs sensíveis; não edita código: entrega a correção ao especialista dono da pasta e confere depois.
7. **Arquitetura** passa a ser dona do contrato da API e dos registros de arquitetura (antes, arquivos comuns da coordenadora). Mudar o contrato continua exigindo um portão da pessoa.
8. **CI:** com o DevOps ativo, o CI é dele; sem ele, volta para a integradora.
9. **Tudo visível e correlacionado no Orca:** cada sessão é um agente do Orca, pendurado em quem o abriu; uma worktree por issue, com o tema no nome.
10. **Limite:** no máximo 9 sessões ao mesmo tempo.
11. **O que não muda:** só a integradora integra, fala com a pessoa e resolve os portões; quem constrói não valida; uma tarefa, uma branch, um PR.
12. **Projetos:** `novo-projeto.sh --especialistas` copia os harnesses para `docs/agentes/`; a skill `atualizar-projeto` acrescenta os que faltam sem trocar os que o projeto já tem.

Decidido pela pessoa em 2026-10-28: os agentes e os agrupamentos, a ferramenta de cada um, os quatro fixos, as trabalhadoras abertas pelos especialistas, a Segurança no começo e entregando a correção, todas as sessões visíveis no Orca, os modelos fixos, o harness como regra de atuação, as referências de cada agente (validadas uma a uma), a ANPD como referência legal, o CI com o DevOps e o ajuste do Nested worker depth.

**Escolhas da sessão do método** (a pessoa conferiu ao aprovar o desenho): Produto e DevOps sob demanda; o limite de 9 sessões; os nomes de worktree e branch com o tema; o esforço inicial de cada papel; o DevOps com 1 trabalhadora por vez; a Segurança e o Produto sem trabalhadoras por enquanto; versão menor (2.6.0), porque é um modo novo em `rascunho` ao lado dos que existem.

## Consequências

- A integradora gasta menos contexto: as dúvidas de tema param no especialista, e ela confere critérios, testes e navegador sem reler o código.
- Em troca, o pico de sessões abertas sobe para 9, e a cota precisa ser medida no primeiro projeto (a memória anota o consumo por tarefa).
- O modo depende de um ajuste do Orca (Nested worker depth = 2) que fica fora do repositório; o harness da integradora manda conferir antes de começar.
- Os harnesses repetem regras do método; quem mudar uma regra fixa confere os sete.
- O que observar no primeiro projeto: se as dúvidas pararam no especialista; quantas sessões a cota aguentou; se dois especialistas cruzaram arquivos; se a Segurança achou o que a integradora não acharia; se o Codex leu e seguiu o harness; o consumo por tarefa.
- Arquivos que mudam: `modelos/agentes/` (novo: o modelo e os sete harnesses), `nucleo/02-sessoes-e-papeis.md`, `nucleo/01-fluxo-de-ponta-a-ponta.md`, `modelos/prompt-coordenadora-orca.md`, `modelos/CLAUDE-projeto.md`, `modelos/AGENTS-projeto.md`, `modelos/memoria-do-projeto.md`, `scripts/novo-projeto.sh`, `scripts/verificar.mjs`, `skills/novo-projeto/SKILL.md`, `skills/atualizar-projeto/SKILL.md`, `skills/consultar/SKILL.md`, `README.md`, `casos/2026-10-repositorio-do-metodo.md`, `planos/2026-10-28-agentes-especialistas-desenho.md`, `planos/2026-10-28-agentes-especialistas.md`, `CHANGELOG.md`, `VERSION` (2.6.0).
