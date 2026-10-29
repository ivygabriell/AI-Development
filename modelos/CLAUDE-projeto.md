# Instruções para as sessões deste projeto

Este arquivo é lido automaticamente por qualquer sessão do Claude Code aberta nesta pasta. Ele foi gerado pelo método de desenvolvimento; ajuste-o à medida que o projeto decidir.

Versão do método: {{VERSAO}}

@docs/DESENVOLVIMENTO.md
@docs/memoria-do-projeto.md

## Como as sessões trabalham aqui

- **Responda em português.** Nomes de Skills, comandos e código ficam como são. Pronomes não declarados: use o neutro.
- **Consulte o método pela skill `metodo:consultar`** (plugin `metodo`): ela diz onde está a cópia do método e o que ler para cada fase, cenário ou dúvida. Se o plugin não estiver instalado, peça à pessoa.
- **Siga as fases do método** e diga qual Skill está usando: `superpowers:brainstorming` antes de criar ou reestruturar, `superpowers:test-driven-development` para implementar, `superpowers:systematic-debugging` para bugs e `superpowers:verification-before-completion` antes de dizer "pronto".
- **Comece lendo a memória** (`docs/memoria-do-projeto.md`) e atualize-a ao fim de cada fase, numa branch, junto com o trabalho da fase.
- **O método é só leitura.** Nunca altere a cópia do método. Uma lição nova vira nota na memória e é levada ao método na Fase 9.
- **Orquestração com o Orca** (modo em rascunho): se este projeto roda no Orca, a coordenadora é a integradora e cada agente supervisionado é uma trabalhadora. A coordenadora é sempre Claude. Os agentes são Claude (`--agent claude`); no back, podem ser Codex (`--agent codex`) se o projeto tiver o `AGENTS.md`, que é o arquivo que o Codex lê. Com o back no Codex, o contrato da API é fechado e aprovado antes de qualquer tarefa de construção. A coordenadora usa o prompt `modelos/prompt-coordenadora-orca.md` do método; os agentes nunca integram e perguntam à coordenadora com `orca orchestration ask`, nunca à pessoa; merge e deploy passam por um portão que só a pessoa resolve.
- **Com agentes especialistas** (modo em rascunho): se o projeto tem `docs/agentes/`, cada agente (a integradora, os especialistas) lê primeiro o seu harness ali e atua dentro dele: o harness manda; o que se consulta informa. A integradora coordena os especialistas, e cada especialista abre e coordena as suas trabalhadoras no Orca.
- **Método mais novo:** se a versão do método instalada (skill `metodo:consultar`) for maior que a "Versão do método" acima, sugira à pessoa rodar `/metodo:atualizar-projeto`.
- **Peça confirmação antes de ações externas ou irreversíveis:** push, abrir ou integrar PR, deploy, apagar algo, reescrever histórico. Nunca use `push --force`.
