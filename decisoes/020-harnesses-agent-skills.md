# 020 · Harnesses inspirados no Agent Skills

**Data:** 2026-11-27
**Status:** aceita pela pessoa

## Contexto

O AI Development adotou o Agent Skills como pacote principal. Seus papéis já distribuem responsabilidades próprias, como aprovar desenhos no Figma, coordenar Builders no Orca e autorizar publicações. Faltava orientar cada papel com a mesma clareza de escopo, procedimento e parecer das personas do Addy.

## Decisão

Reescrever os oito harnesses do método a partir da estrutura das personas do Agent Skills. Cada papel declara a missão, quando é chamado, o que recebe, como verifica e a quem entrega. A Lead seleciona o trabalho pelo impacto e coordena as revisões. As personas especializadas devolvem parecer e recomendações de encaminhamento à Lead. Backend, Frontend e Ops continuam coordenando Builders quando o modo com especialistas estiver em uso. [Personas de referência](https://github.com/addyosmani/agent-skills/tree/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/agents)

As skills podem orientar o trabalho nas duas ferramentas. No Claude Code, a Lead também pode chamar as personas nativas. No Codex, a revisão independente usa outra sessão com o escopo e as skills pertinentes. A Cloudflare continua orientando a auditoria completa, com escopo e autorização próprios.

## Consequências

- O Básico pode rodar só com a Lead. A tarefa guia o acionamento dos especialistas no Padrão e no Profundo.
- Os pareceres identificam o veredito, a evidência coletada e as verificações pendentes. Achados bloqueantes têm localização, efeito e correção verificável.
- Projetos existentes recebem a atualização ao comparar os modelos e revisar o diff de seus harnesses.
