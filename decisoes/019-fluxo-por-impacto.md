# 019 · Fluxo por impacto

**Data:** 2026-11-26
**Status:** aceita pela pessoa

## Contexto

A pessoa pediu que um ajuste de baixo impacto, como trocar a cor de um botão, seguisse um fluxo curto. Também pediu mais profundidade para vulnerabilidades, ações irreversíveis e mudanças que podem causar impacto alto em produção. Na mesma revisão, pediu a remoção das pastas de casos e cenários.

## Decisão

A Lead classifica a tarefa em Básico, Padrão ou Profundo antes de construir. A classificação dimensiona artefatos, testes, revisão e especialistas. Os portões existentes definem quem autoriza cada ação. O [núcleo 01](../nucleo/01-fluxo-de-ponta-a-ponta.md#impacto-da-tarefa) documenta os critérios e quando reclassificar.

O fechamento registra a retrospectiva na memória do projeto. Lições e decisões reutilizáveis entram no método por PR com justificativa e evidência. A preparação de projetos usa somente a pasta de destino e as opções de ferramenta e de agentes especialistas.

## Consequências

- Um ajuste básico tem aceite e evidência no PR. A Lead pode executá-lo em uma sessão.
- Mudança de comportamento e correção de bug usam TDD. No Padrão e no Profundo, a revisão é independente e cruza ferramentas quando o projeto usa as duas.
- O Agent Skills do Addy pode apoiar o trabalho pertinente. A Cloudflare segue sendo a referência para auditoria de segurança. O portão de publicação considera também o deploy disparado pelo merge.
- Na primeira aplicação, registre se a trilha precisou mudar, que verificações encontraram regressões e quanto trabalho de coordenação foi necessário.
