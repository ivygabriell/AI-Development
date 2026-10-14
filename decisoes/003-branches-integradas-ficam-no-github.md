# 003 · Branches integradas ficam no GitHub

**Data:** 2026-10-14
**Status:** aceita
**Caso de origem:** [Portfólio pessoal (2026-10)](../casos/2026-10-portfolio-pessoal.md)

## Contexto

Depois de um merge, a branch remota foi apagada por hábito, sem pedido. A pessoa preferia manter as branches antigas como histórico consultável.

## Decisão

**Nunca apagar a branch remota depois do merge.** Integrar sem `--delete-branch`. Só a worktree local é removida.

## Consequências

- O histórico das tarefas fica consultável.
- A lista de branches cresce; é aceitável e filtrável.
- Lição [017](../licoes/017-apagar-a-branch-remota-por-habito.md); atualizados o fluxo, as sessões, o git, o prompt da integradora e o script de remoção.
