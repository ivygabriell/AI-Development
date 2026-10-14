# Repositório do método (2026-10)

**Cenário:** nenhum dos cenários (repositório privado de documentação com scripts de apoio)
**Versão do método usada:** 2.0.0 a 2.1.0
**Período:** 2026-10 (marco: publicação no GitHub e primeiro PR)
**Resultado em uma frase:** o próprio método publicado num repositório privado, com CI, tags de versão e o primeiro ajuste entrando por Pull Request.

## Contexto

O repositório do método é mantido por uma sessão dedicada do Claude Code (veja o [CLAUDE.md](../CLAUDE.md)) e por uma pessoa só, numa conta gratuita do GitHub. O repositório é **privado** por decisão da pessoa. O marco registrado aqui vai do primeiro commit à versão 2.1.0.

## O que funcionou

- **TDD no verificador.** No PR que fez o `novo-projeto.sh` avisar sobre cenários rascunho, as verificações novas foram escritas antes: 3 de 835 falharam pelo motivo esperado e passaram depois do ajuste no script.
- **PR com CI verde e merge sem apagar a branch.** O PR #1 entrou com `gh pr merge 1 --merge`, a branch ficou no GitHub e o CI da `main` passou depois do merge.
- **Tags de versão.** `v2.0.0` e `v2.1.0` criadas e enviadas, como pede o `CHANGELOG.md`.

## O que falhou

- **A proteção da `main` não pôde ser ativada.** O passo do [05](../nucleo/05-git-github-e-ci.md) foi seguido depois do primeiro CI verde, e o GitHub respondeu HTTP 403: *"Upgrade to GitHub Pro or make this repository public to enable this feature."* O método mandava ativar a proteção, mas não avisava que um repositório privado numa conta gratuita não aceita (lição 019).

## Medidas

| Medida | Valor |
|---|---|
| Verificações de `scripts/verificar.mjs` | 830 no primeiro commit; 837 na versão 2.1.0 |
| Pull Requests integrados | 1 |
| Execuções do CI | 3, todas verdes (`main` inicial, PR #1, `main` depois do merge) |
| Proteção da `main` | indisponível (HTTP 403, plano gratuito e repositório privado) |

## Lições geradas

- [019 · Proteção da `main` indisponível em repositório privado](../licoes/019-protecao-da-main-indisponivel-em-repositorio-privado.md)

## Mudanças propostas no método

- [05 · Git, GitHub e CI](../nucleo/05-git-github-e-ci.md): avisar que a proteção da `main` exige repositório público ou plano pago, e dizer o que fazer quando ela não está disponível.
- [README](../README.md), passo 3 de "Adotar em um projeto novo": a mesma ressalva, com link para o 05.
- Decisão da pessoa, **só para este repositório**: a `main` do método fica sem proteção no GitHub; a regra "nunca commit direto na `main`" vale pela sessão do método. Registrado no [CLAUDE.md](../CLAUDE.md).
