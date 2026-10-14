# 002 · Integrar com commit de merge

**Data:** 2026-10-13
**Status:** aceita
**Caso de origem:** [Portfólio pessoal (2026-10)](../casos/2026-10-portfolio-pessoal.md)

## Contexto

Era preciso escolher entre merge, squash e rebase ao integrar um Pull Request.

## Decisão

Integrar com `gh pr merge N --merge` (commit de merge), porque ele **registra o PR no histórico**.

## Consequências

- O histórico mostra de onde veio cada mudança.
- O histórico fica com mais commits do que no squash.
- Documentado em [nucleo/05-git-github-e-ci.md](../nucleo/05-git-github-e-ci.md).
