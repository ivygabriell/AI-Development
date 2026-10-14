# 018 · Worktree removida, pasta que sobra

- **O que aconteceu:** `git worktree remove` falhou no fim com "Directory not empty": sobraram arquivos ignorados (dependências, cache, configuração local da sessão) que o Git não gerencia.
- **Causa:** o Git só remove o que conhece; o resto fica.
- **Regra:** depois do `worktree remove`, confira `git worktree list` e olhe o que sobrou na pasta antes de apagá-la (só depois de a branch estar integrada e enviada), e rode `git worktree prune`.

**Caso de origem:** [Portfólio pessoal (2026-10)](../casos/2026-10-portfolio-pessoal.md)
