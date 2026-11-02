# 007 · Back com o Codex e front com o Claude, no Orca

**Data:** 2026-10-22
**Status:** substituída por [010](010-um-agente-principal-por-projeto.md) em 2026-11-02 (um agente principal por projeto, Claude Code ou Codex, nunca os dois). Antes: aceita pela pessoa **sem caso real** (exceção à regra de ouro, pedida por ela, como na [decisão 006](006-desenvolvimento-orquestrado-com-o-orca.md)); tudo o que esta decisão acrescenta fica como `rascunho` até o primeiro projeto feito assim virar caso
**Caso de origem:** nenhum ainda. O primeiro projeto com o back no Codex e o front no Claude será registrado em `casos/` e confirma ou corrige esta decisão.

## Contexto

A pessoa paga as assinaturas do Codex e do Claude e recebeu a recomendação de que o Codex rende mais no back e o Claude no front. Quer usar as duas cotas no mesmo projeto, no Orca, para render mais pelo mesmo custo. **Vale a pena se sair conforme o esperado e sem retrabalho.**

O back e o front ficam sempre no **mesmo repositório**, com uma só `main`.

Até a versão 2.4.1, o modo Orca exigia agentes Claude (`--agent claude`), porque só o Claude Code lia o `CLAUDE.md` do projeto e os plugins do método. Um reconhecimento no computador da pessoa (Codex 0.163, Orca 1.4.237) mostrou o que existe e o que falta para o Codex trabalhar com as mesmas regras:

| Para o Codex | Situação |
|---|---|
| Plugins `superpowers` e `metodo` | Instalados, pelos mesmos marketplaces do GitHub (`codex plugin list`); o `metodo` estava na 2.4.0 |
| Skills `orca-cli` e `orchestration` | Instaladas em `~/.agents/skills`, a pasta que o Codex lê |
| Skill e MCP do REA | Instalados (`codex mcp list` mostra `rea`) |
| Plugins `engineering` e `design` | **Faltam** (o marketplace `knowledge-work-plugins` não está no Codex) |
| Regras do projeto | **Faltam**: o Codex lê o `AGENTS.md`, não o `CLAUDE.md`; os projetos do método não têm `AGENTS.md` |
| Caminho da cópia do método nas skills | **A conferir**: as skills usam `${CLAUDE_PLUGIN_ROOT}`; o Codex conhece essa variável nos hooks, e não está confirmado que a substitua no texto da skill |
| Avisos de status no Orca | Instalados para o Claude e o Codex (`orca agent hooks status`) |

## Decisão

1. **Uma coordenadora só, sempre Claude Code.** É a integradora: planeja, valida no navegador e é a **única que integra** na `main`, com o "pode integrar" da pessoa. Ela inicia os agentes do front com `worker-start --agent claude` e os do back com `worker-start --agent codex`. Uma coordenadora do back (Codex) por baixo da principal só entra se um caso mostrar que a principal gasta tokens demais revisando o back.
2. **Os mesmos princípios para os dois.** O agente Codex segue as mesmas regras e Skills que o Claude: TDD visto falhar, testes micro e macro, `superpowers:verification-before-completion`, uma tarefa por branch e por PR, nunca integra, pergunta à coordenadora com `ask`. Para isso, o Codex tem instalado tudo o que o Claude tem: `superpowers`, `metodo`, `engineering`, `design`, REA e as skills do Orca.
3. **`AGENTS.md` em todo projeto.** O projeto ganha um `AGENTS.md` que manda ler, no início, o `CLAUDE.md`, o `docs/DESENVOLVIMENTO.md` e a `docs/memoria-do-projeto.md`, e repete as regras que não podem faltar. O `novo-projeto.sh` e a skill `atualizar-projeto` passam a criá-lo.
4. **Contrato primeiro.** Antes de qualquer tarefa do back ou do front, uma tarefa fecha o **contrato da API** num arquivo do repositório, e a pessoa aprova num portão. Mudar o contrato depois só por uma tarefa própria, com um portão da pessoa; o lado que depende dele se ajusta na tarefa seguinte.
5. **Pastas separadas e arquivos comuns com a coordenadora.** Cada lado tem a sua pasta, e as tarefas listam só as pastas do seu lado como permitidas. Os arquivos comuns (CI, dependências da raiz, contrato, memória do projeto) mudam só em tarefas da coordenadora, nunca em duas tarefas ao mesmo tempo.
6. **Regra do agente (substitui a da 2.4.1).** A coordenadora é sempre Claude. Os agentes podem ser Claude ou Codex; o Codex só entra em projeto que tem `AGENTS.md`.
7. **Medição para a Fase 9.** A memória do projeto anota, por tarefa, qual agente fez, se houve retrabalho e por quê.
8. **Skills do plugin no Codex.** O texto das skills do `metodo` diz onde achar a cópia do método quando `${CLAUDE_PLUGIN_ROOT}` não for substituído: a pasta dois níveis acima do `SKILL.md`.
9. **README.** A instalação, em "Antes de começar", passa a ter também o Codex: marketplaces e plugins (`codex plugin marketplace add`, `codex plugin add`), a atualização (`codex plugin marketplace upgrade`) e a conferência (`codex plugin list`, `codex mcp list`).

Decidido pela pessoa em 2026-10-22: o motivo, o critério de sucesso, o mesmo repositório, uma coordenadora principal (opção 1), o uso dentro do Orca e os mesmos princípios e Skills para o Codex.

**Escolhas da sessão do método** (a pessoa confere ao aprovar):

- O contrato fica em `docs/contrato-api.md`, ou no formato que a stack pedir (por exemplo, OpenAPI), decidido na Fase 2.
- Os nomes das pastas de cada lado (por exemplo, `back/` e `front/`) também são decididos na Fase 2 e registrados no `docs/DESENVOLVIMENTO.md`.
- A coordenadora valida os PRs do back pelos testes e pelo contrato; abre o navegador quando o back e o front se encontram.
- O modelo e o esforço de cada agente (`--model`, `--effort`) ficam no padrão do Orca, salvo pedido da pessoa.
- O modo é uma escolha da Fase 3: um projeto sem essa divisão continua como antes.
- Versão menor (2.5.0): o modo é conteúdo novo em `rascunho`; a regra do agente da 2.4.1 se amplia, sem quebrar quem só usa agentes Claude.

## Consequências

- O código do back passa a gastar a cota do Codex, e a coordenadora Claude, que quase não escreve código, gasta pouco.
- O contrato primeiro e uma única integradora protegem contra o retrabalho, que é o critério de sucesso. Em troca, o início fica um pouco mais lento: nenhuma tarefa de construção começa antes do contrato aprovado.
- Mais uma ferramenta a manter atualizada em cada computador (os plugins também no Codex).
- O `AGENTS.md` repete regras do `CLAUDE.md`; quem mudar um precisa conferir o outro.
- O que observar no primeiro projeto: se algum agente Codex pulou o TDD ou a verificação; se os caminhos das skills funcionaram no Codex; quantas tarefas voltaram por causa do contrato; quanto cada cota rendeu.
- Arquivos que mudam: `nucleo/02-sessoes-e-papeis.md`, `modelos/prompt-coordenadora-orca.md`, `modelos/CLAUDE-projeto.md`, `modelos/AGENTS-projeto.md` (novo), `modelos/memoria-do-projeto.md`, `scripts/novo-projeto.sh`, `skills/novo-projeto/SKILL.md`, `skills/atualizar-projeto/SKILL.md`, `skills/consultar/SKILL.md`, `scripts/verificar.mjs`, `README.md`, `casos/2026-10-repositorio-do-metodo.md`, `CHANGELOG.md`, `VERSION` (2.5.0).
