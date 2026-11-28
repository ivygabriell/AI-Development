# 022 · Integração direta por impacto

**Data:** 2026-11-27
**Status:** proposta

## Contexto

A pessoa solicitou critérios para a Lead integrar mudanças elegíveis sem pedir nova validação. O fluxo já definia impacto e gatilhos. Faltava registrar as evidências por trilha e distinguir uma falha técnica de uma decisão humana pendente.

## Decisão

A Lead classifica o PR em bloqueado, aguarda aprovação ou integração direta. A integração direta exige aceite, revisão e CI no commit verificado, além de autorizações resolvidas. No Profundo, a autorização escrita deve cobrir a integração e seus efeitos. Deploy por merge exige autorização de publicação. [Critérios completos](../nucleo/01-fluxo-de-ponta-a-ponta.md#integração-direta)

A Lead usa pareceres com escopo, evidência, severidade, lacunas e próximos passos, conforme o formato das personas do Addy. [Auditoria e tarefas](../planos/2026-11-27-personas-e-integracao.md)

## Consequências

- A Lead pode integrar ajustes básicos e mudanças padrão elegíveis depois das verificações.
- Mudança de commit ou base pede reavaliação da evidência afetada. Mudança de escopo, risco ou efeito pede reavaliação da autorização.
- O repositório do método conserva a aprovação da pessoa por PR. A execução de merge cabe à Lead, com o SHA verificado.
