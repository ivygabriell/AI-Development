# 017 · Apagar a branch remota por hábito

- **O que aconteceu:** depois de integrar um PR, a branch foi apagada no GitHub (`--delete-branch` e `push --delete`) sem que a pessoa tivesse pedido. Ela preferia manter as branches antigas como histórico.
- **Causa:** a prática comum ("apagar a branch integrada") foi aplicada sem checar a preferência, e apagar algo remoto é uma ação externa.
- **Regra:** **as branches integradas ficam no GitHub**; integre com `gh pr merge N --merge`, sem `--delete-branch`. Só a worktree local é removida. Se uma branch foi apagada por engano, ela se recria no mesmo commit (`git push origin <sha>:refs/heads/<nome>`), desde que o commit ainda esteja no histórico. Registre a preferência no documento do projeto e na memória.

**Caso de origem:** [Portfólio pessoal (2026-10)](../casos/2026-10-portfolio-pessoal.md)
