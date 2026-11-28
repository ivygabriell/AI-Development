# Adoção do Agent Skills

## Auditoria

A base verificada foi o [Agent Skills 0.6.18](https://github.com/addyosmani/agent-skills/tree/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74), com 26 skills e cinco personas. A validação de estrutura e referências passou. A avaliação lexical passou em 164 verificações. Ela mede a correspondência de descrições, enquanto a escolha em uso real depende da tarefa e do agente.

| O que foi conferido | Aplicação no método |
|---|---|
| [Adoção em projeto novo e existente](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/docs/adoption-guide.md) | Projeto novo passa por desenho, spec e plano. Projeto existente começa pelo contexto e pelos testes do comportamento atual. Ajuste básico fica com aceite e evidência focados. |
| [Planejamento](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/skills/planning-and-task-breakdown/SKILL.md) e [implementação incremental](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/skills/incremental-implementation/SKILL.md) | Cada Builder recebe um resultado verificável, dependências, limite de arquivos e teste. O progresso fica na issue e nos artefatos do projeto. |
| [Personas](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/docs/agents.md) e [suporte no Codex](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/docs/codex-setup.md) | Skills nas duas ferramentas. A Lead pede pareceres por persona no Claude Code e por sessão de revisão no Codex. |
| [Publicação](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/skills/shipping-and-launch/SKILL.md) e [segurança](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/skills/security-and-hardening/SKILL.md) | Parecer técnico, proteção de dados e recuperação entram no aceite. O escopo da revisão ampla e a publicação seguem os portões humanos do AI Development. |

## Tarefas

- [x] **1. Retirar o legado.** Remover as pastas solicitadas, o gerador de índice e as dependências nas instruções. Verificar ausência de caminhos ativos e funcionamento do verificador.
- [x] **2. Adotar a revisão de segurança do Addy.** Trocar a integração externa no núcleo, nos harnesses e na adoção. Verificar que escopo, evidência privada, aprovação e bloqueios de publicação continuam cobertos.
- [x] **3. Encaixar o ciclo do Addy.** Mapear fases e trilhas para as skills, definir uma tarefa verificável por entrega e diferenciar as ferramentas. Verificar README, modelos gerados e coerência dos portões.
- [x] **4. Consolidar as referências e validar.** Vincular as bases por papel ao Addy, registrar a decisão e conferir o fluxo completo, incluindo os modos do gerador.

## Verificação final

O verificador do método passou em 1.209 verificações, incluindo os modos Claude Code, Codex e especialistas. Os formulários YAML e a sintaxe do gerador passaram. As 26 referências fixadas correspondem a arquivos da versão analisada.
