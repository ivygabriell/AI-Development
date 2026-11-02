# 012 · Revalidação das lacunas e o ponytail

**Data:** 2026-11-02
**Status:** aceita pela pessoa. A revalidação liga ao método o que já estava nele e não cria regra nova. O ponytail entra **sem caso real** e fica `rascunho` até o primeiro projeto que o usar.
**Caso de origem:** nenhum. O primeiro projeto feito na 3.1.0 confirma ou corrige cada parte na Fase 9.

## Contexto

A pessoa notou que as skills dos repositórios que o método instala não estavam sendo usadas e pediu uma revalidação completa: tudo o que está solto ou sem uso dentro do método. Na mesma conversa, pediu para usar o [ponytail](https://github.com/DietrichGebert/ponytail), que tinha ficado de fora na [decisão 010](010-um-agente-principal-por-projeto.md).

A revalidação cruzou cada skill dos plugins instalados (Superpowers, engineering, design), a `security-audit` e o REA com o README, o núcleo, os harnesses, os modelos, as skills do método e os cenários. Ela achou:

| Lacuna | Por que importava |
|---|---|
| Skills no mapa do `03` que nenhum harness citava: `engineering:code-review`, `engineering:debug`, `engineering:testing-strategy`, `engineering:tech-debt`, `engineering:documentation`, `design:design-handoff`, `superpowers:receiving-code-review`, `superpowers:diagnosing-superpowers`, `reverse-engineer-anything` | No modo com especialistas, o agente atua dentro do harness: skill fora do harness não é usada |
| Skills que um harness usava, mas faltavam no mapa do `03` e no README: `design:design-system`, `design:user-research`, `design:research-synthesis` | O mapa não dizia quando usar |
| Skills sem lugar nenhum: `superpowers:writing-skills`, `engineering:standup`, `superpowers:using-superpowers` | Ninguém sabia se eram para usar |
| O REA estava no harness da Segurança só como servidor, com uma frase genérica, e em mais nenhum agente | A Fase 1 pedia o REA, mas nenhum agente o tinha |
| A integradora criava o portão da auditoria de segurança sem a skill `metodo:auditoria-de-seguranca` no harness; o DevOps não sabia que recebe os `needs_validation` de infraestrutura | A triagem e a validação ficavam sem dono |
| Os especialistas não liam as lições do método (só a integradora) | Os erros que já aconteceram voltariam a acontecer |
| Os cenários não apontavam para nenhuma skill dos agentes | Quem parte de um cenário não chegava às skills do tema |
| Os prompts das sessões abertas à mão diziam só "Claude Code" | Contradiziam a decisão 010 |

## Decisão

1. **Cada skill do mapa do `03` tem um agente que a usa, ou está na nova seção "Skills fora dos agentes", com o motivo.** Integradora: `engineering:testing-strategy`, `engineering:documentation`, `superpowers:diagnosing-superpowers` e `metodo:auditoria-de-seguranca`. Back e Dados, Design e Front e DevOps: o `/ponytail-review` na revisão (item 6). Design e Front: `design:design-handoff`. DevOps: `engineering:documentation`. As trabalhadoras: `superpowers:receiving-code-review`. Ficam fora dos agentes, com o motivo escrito: `executing-plans`, `subagent-driven-development`, `dispatching-parallel-agents` e `using-git-worktrees` (modos sem o Orca), `writing-skills` (sessão do método, agora no `CLAUDE.md` deste repositório), `using-superpowers` (carrega sozinha).
2. **O REA ganha dono em três agentes:** Design e Front (referência fechada nas Fases 1 e 2, com o `nucleo/04` e o prompt de auditoria de referência), Arquitetura (sistema sem código-fonte antes de uma migração) e Segurança (o artefato publicado do próprio projeto, um passo novo de `metodo:auditoria-de-seguranca`, porque a `security-audit` lê só o código-fonte).
3. **Todo harness manda ler as lições do método** que tocam o tema (`licoes/_indice.md`).
4. **Os cenários apontam para as skills dos agentes** em "Skills úteis". Só a lista de skills muda; o selo de maturidade de cada cenário fica como está.
5. **Os prompts das sessões abertas à mão** valem para o agente principal, Claude Code ou Codex.
6. **Ponytail (rascunho).** Instalado no Claude Code e no Codex, pelo repositório oficial. Regras de convivência, no `03` e no `CLAUDE.md` e no `AGENTS.md` do projeto:
   - o TDD do método vale sobre o ponytail;
   - a escada do ponytail vale para a solução, não para o processo;
   - o nível é `full`, e o `ultra` não é usado;
   - atalho deliberado leva o comentário `shortcut:` e vira pendência;
   - os especialistas revisam os PRs das trabalhadoras com `/ponytail-review` (sem o ponytail, `superpowers:requesting-code-review`);
   - a integradora usa `/ponytail-audit` e `/ponytail-debt` na Fase 8;
   - a faixa do ponytail serve de fonte para o consumo por tarefa.

   **O principal é o custo** (pedido da pessoa, depois de reler o repositório): no Claude Code, a medição do próprio ponytail deu 45% menos tokens de saída, 26% menos custo e 41% menos tempo por tarefa, com correção igual. No Codex, a conferência de custo do repositório mostrou o contrário nos modelos de raciocínio da OpenAI (até 39% mais caro), porque as regras são reenviadas a cada chamada. Por isso, no Codex ele fica só sob demanda (sem confiar nos ganchos) até a pessoa medir. Ele é desligado durante a auditoria completa de segurança, porque se injeta em cada subagente. O quadro local dele (`~/.config/ponytail/band/<projeto>.csv`) é a fonte do consumo por tarefa.
7. **Quatro skills do engineering saem do método** (decisão da pessoa, depois de ver a comparação de cada uma): `engineering:debug` repete o `superpowers:systematic-debugging`, que é mais rígido (causa antes da correção, teste que falha antes); `engineering:code-review` repete o `/ponytail-review`, e a alternativa sem o ponytail passa a ser o `superpowers:requesting-code-review`; `engineering:tech-debt` sai, e o que só ela cobria (dependências desatualizadas, deploy à mão, falta de monitoramento, documentação velha, e a ordem por impacto, risco e esforço) passa para o harness da integradora, na Fase 8, ao lado do `/ponytail-audit` e do `/ponytail-debt`; `engineering:standup` não tinha papel na arquitetura. Continuam instaladas, porque fazem parte do plugin engineering, que o método usa; o método só deixa de citá-las.
8. **O verificador passa a acusar lacunas:** uma skill do mapa sem agente e fora da lista, um harness sem as lições, um cenário sem skill de agente e um prompt preso a uma ferramenta.

Decidido pela pessoa em 2026-11-02: fazer a revalidação completa do que está solto ou sem uso; usar o ponytail.

**Escolhas da sessão do método** (a pessoa confere ao aprovar o PR):

- A revalidação não leva o selo de `rascunho`, porque só liga ao método o que já estava nele. O ponytail leva, porque é novo e não tem caso, como manda a regra de ouro, que continua.
- O `/ponytail-review` é a revisão do especialista, e o `superpowers:requesting-code-review` fica como alternativa quando o ponytail está desligado, para não haver duas revisões do mesmo PR.
- O ponytail fica instalado para o usuário inteiro (todas as sessões), no nível `full`, com o quadro de tarefas local e sem webhook: nada sai do computador.
- Versão menor (3.1.0): conteúdo novo e ligações, sem mudar uma regra do núcleo.

## Consequências

- Cada skill que o método instala tem um momento e um dono, e o verificador impede que alguma volte a ficar solta.
- O ponytail muda o jeito de escrever código em todas as sessões deste computador, inclusive em projetos fora do método. Para desligar numa sessão: `/ponytail off`.
- No Codex, o ponytail fica sem os dois ganchos (só sob demanda) até a pessoa medir; ligar de vez é confiar neles em `/hooks`.
- O que observar no primeiro projeto: se o ponytail respeitou o TDD do método e o harness; se o `/ponytail-review` achou o que a revisão do especialista acharia; quantos atalhos `shortcut:` ficaram; se o consumo por tarefa caiu.
- Arquivos que mudam: `nucleo/03-skills-e-testes.md`, os sete harnesses e o modelo em `modelos/agentes/`, `skills/auditoria-de-seguranca/SKILL.md`, os oito cenários, `modelos/prompt-sessao-integradora.md`, `modelos/prompt-sessao-trabalhadora.md`, `modelos/CLAUDE-projeto.md`, `modelos/AGENTS-projeto.md`, `CLAUDE.md`, `README.md`, `scripts/verificar.mjs`, `decisoes/010-um-agente-principal-por-projeto.md`, `casos/2026-10-repositorio-do-metodo.md`, `CHANGELOG.md`, `VERSION` (3.1.0).
