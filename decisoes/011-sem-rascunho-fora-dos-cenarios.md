# 011 · Sem selo de rascunho fora dos cenários, e a auditoria de segurança dentro da Segurança

**Data:** 2026-11-02
**Status:** aceita pela pessoa **sem caso real** (exceção à regra de ouro, pedida por ela)
**Caso de origem:** nenhum. O primeiro projeto que usar o que está aqui confirma ou corrige cada parte na Fase 9.

## Contexto

Até a 3.0.0, quase tudo o que entrou depois da 2.3 estava marcado como `rascunho`: o modo Orca, o agente principal, os agentes especialistas e os harnesses, as 23 skills dos agentes, as bases de referências, as skills `novo-projeto` e `atualizar-projeto` e a `security-audit`. O selo dizia "hipótese, não regra", porque nada disso tinha passado por um projeto real.

A pessoa pediu para retirar o selo: o que está no método passa a valer como regra. Perguntada se era para apagar o conteúdo ou só o selo, ela escolheu **só o selo**; os cenários continuam com o selo de maturidade deles (`rascunho`, `testado em 1 projeto`, `estável`), que é o que o `novo-projeto.sh` usa para avisar.

Na mesma conversa, ela pediu que o repositório da [security-audit](https://github.com/cloudflare/security-audit-skill) fosse analisado a fundo e acrescentado dentro do agente de Segurança, e que a skill fosse instalada.

## Decisão

1. **Fora dos cenários, nada do método leva o selo de rascunho.** Saem a linha `**Maturidade:** rascunho` dos harnesses, das skills e das bases de referências (que passam a dizer só a data da leitura) e as marcas "(rascunho)" e "modo em rascunho" do núcleo, dos modelos, das skills, do README e do `novo-projeto.sh`.
2. **O que continua:** as decisões que aprovaram cada parte sem caso real (006 a 010) continuam registrando isso, e as listas "O que observar no primeiro projeto" continuam: são o roteiro da Fase 9. Os cenários mantêm o selo e o aviso.
3. **A regra de ouro continua para o que vier** ([CLAUDE.md](../CLAUDE.md)): uma mudança nova sem caso real ainda entra como `rascunho` ou fica de fora, a menos que a pessoa decida outra coisa.
4. **A auditoria de segurança dentro da Segurança.** A leitura do repositório inteiro da `security-audit` virou uma seção da base `modelos/referencias/seguranca.md` e uma skill do método, `metodo:auditoria-de-seguranca`. A skill diz quando rodar, o portão, o perfil e o escopo, onde guardar, os validadores, a triagem de cada veredito (`confirmed` crítico ou alto bloqueia; médio é ressalva; `needs_validation` vira pergunta sem gravidade; `rejected` fica no relatório) e o cuidado com falha aberta em repositório público. Nas revisões de PR, a Segurança usa só o modo de orientação da skill (fronteira e resultado, gravidade pelo impacto demonstrado, a menor correção).
5. **Passo da Fase 7, em qualquer modo.** Antes da primeira publicação e depois de cada mudança grande, a auditoria é perguntada à pessoa num portão: no modo com especialistas, a Segurança propõe e roda; nos outros, a integradora ou a coordenadora. A pessoa aprova o tamanho ou dispensa (a dispensa fica na memória do projeto), e um achado confirmado crítico ou alto segura a publicação. Sem isso, a auditoria só aconteceria no modo com especialistas.
6. **Instalação feita neste computador**, em 2026-11-02: `npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit --global --agent claude-code codex -y`, em `~/.agents/skills/security-audit` (o Codex lê dali; o Claude Code, por um atalho em `~/.claude/skills/`). A cópia instalada é igual à revisada (commit `c1c8a8c`), e os testes dos validadores passaram (65 de 65).

Decidido pela pessoa em 2026-11-02: retirar só o selo, fora dos cenários; analisar a fundo e acrescentar a `security-audit` dentro do agente de Segurança; instalar a skill.

**Escolhas da sessão do método** (a pessoa confere ao aprovar o PR):

- A análise virou uma skill do método, e não só um parágrafo no harness, pelo mesmo padrão da [decisão 009](009-skills-por-agente.md): passo a passo com fonte, o teste que prova, checklist e "Adaptar ao tamanho do projeto".
- A gravidade da Segurança passa a usar as âncoras da `security-audit`, e o "a validar" sem gravidade vale também fora da auditoria completa.
- A instalação é global e para as duas ferramentas, porque cada projeto escolhe a sua (decisão 010).
- Entra na mesma 3.0.0, que ainda não foi integrada.

## Consequências

- As sessões dos projetos deixam de tratar os modos e as skills como hipótese: aplicam como regra. Se algo estiver errado, o erro aparece no primeiro projeto, e não antes. Por isso a Fase 9 desse projeto precisa conferir as listas "O que observar".
- Um projeto que achar uma regra errada sobe a questão como sempre (o harness manda; a pessoa decide), e a correção volta ao método por um caso.
- A auditoria completa ganha um caminho claro no fluxo, mas segue cara: só roda com o portão.
- Arquivos que mudam: `skills/auditoria-de-seguranca/` (novo), `modelos/referencias/seguranca.md`, `modelos/agentes/seguranca.md`, os demais harnesses, bases e skills (sem o selo), `nucleo/01-fluxo-de-ponta-a-ponta.md`, `nucleo/02-sessoes-e-papeis.md`, `nucleo/03-skills-e-testes.md`, `nucleo/05-git-github-e-ci.md`, `modelos/CLAUDE-projeto.md`, `modelos/AGENTS-projeto.md`, `modelos/prompt-coordenadora-orca.md`, `scripts/novo-projeto.sh`, `scripts/verificar.mjs`, `README.md`, `decisoes/010-um-agente-principal-por-projeto.md`, `casos/2026-10-repositorio-do-metodo.md`, `CHANGELOG.md`.
