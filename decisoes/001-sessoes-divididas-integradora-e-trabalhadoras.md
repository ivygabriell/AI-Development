# 001 · Sessões divididas: uma integradora e até duas trabalhadoras

**Data:** 2026-10-13
**Status:** aceita
**Caso de origem:** [Portfólio pessoal (2026-10)](../casos/2026-10-portfolio-pessoal.md)

## Contexto

Uma sessão só construía e validava a própria obra. O CI verde não provava que a coisa certa havia sido feita, e várias tarefas em paralelo corriam o risco de se atropelar.

## Decisão

Uma sessão **integradora** define tarefas, valida com olhar independente e é a única que integra na `main`, só com a aprovação da pessoa. No máximo **duas trabalhadoras**, uma tarefa e uma worktree cada, nunca fazem merge.

## Consequências

- Mais qualidade: quem constrói não valida.
- Mais custo de coordenação; por isso o limite de duas trabalhadoras e a regra de arquivos exclusivos por tarefa.
- Documentado em [nucleo/02-sessoes-e-papeis.md](../nucleo/02-sessoes-e-papeis.md); scripts e prompts em [modelos](../modelos/).
