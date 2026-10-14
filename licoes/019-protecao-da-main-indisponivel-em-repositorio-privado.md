# 019 · Proteção da `main` indisponível em repositório privado

- **O que aconteceu:** depois do primeiro CI verde, o comando de proteção da `main` (do [05](../nucleo/05-git-github-e-ci.md)) foi rodado num repositório privado de uma conta gratuita. O GitHub respondeu HTTP 403: *"Upgrade to GitHub Pro or make this repository public to enable this feature."*
- **Causa:** o método tratava a proteção da `main` como passo garantido. Ela depende do plano: num repositório privado, a conta gratuita não tem esse recurso.
- **Regra:** antes de contar com a proteção da `main`, confira a visibilidade do repositório e o plano da conta. Se a proteção não estiver disponível, a pessoa escolhe: plano pago, repositório público ou seguir sem proteção. Sem proteção, a regra "nunca commit direto na `main`" passa a valer só pela disciplina das sessões: registre isso no `CLAUDE.md` ou no `docs/DESENVOLVIMENTO.md` do projeto.

**Caso de origem:** [Repositório do método (2026-10)](../casos/2026-10-repositorio-do-metodo.md)
