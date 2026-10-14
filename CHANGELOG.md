# Registro de mudanças

Segue [versionamento semântico](https://semver.org/lang/pt-BR/): **maior** quando a estrutura ou uma regra do núcleo muda de forma incompatível, **menor** quando entra conteúdo novo (cenário, lição, modelo), **correção** para ajustes de texto. Cada versão grande ou média ganha uma tag Git (`v2.0.0`).

## 2.2.0 (2026-10-14)

- **Caso novo:** [Repositório do método (2026-10)](casos/2026-10-repositorio-do-metodo.md), marco da publicação no GitHub e do primeiro PR.
- **Lição 019:** [proteção da `main` indisponível em repositório privado](licoes/019-protecao-da-main-indisponivel-em-repositorio-privado.md) (HTTP 403 numa conta gratuita).
- [05 · Git, GitHub e CI](nucleo/05-git-github-e-ci.md) e o README avisam que a proteção da `main` depende do plano e dizem o que fazer sem ela.
- `CLAUDE.md`: a `main` deste repositório fica sem proteção no GitHub, por decisão da pessoa; a regra vale pela disciplina da sessão.

## 2.1.0 (2026-10-14)

- `scripts/novo-projeto.sh` avisa no stderr quando um cenário escolhido tem maturidade `rascunho` (sem interromper o script) e o `docs/DESENVOLVIMENTO.md` gerado marca a maturidade de cada cenário. Assim um rascunho não é tratado como regra comprovada ([decisão 004](decisoes/004-repositorio-do-metodo-em-camadas.md), caso do [portfólio pessoal](casos/2026-10-portfolio-pessoal.md)).
- `scripts/verificar.mjs` cobre o aviso e a marcação de maturidade.

## 2.0.0 (2026-10-14)

Reorganização em camadas, para o método crescer com novos cenários e casos de uso.

- **Estrutura nova:** `nucleo/` (método base), `cenarios/`, `casos/`, `licoes/`, `decisoes/`, `modelos/` e `scripts/`.
- **Cenários:** o antigo documento "Adaptando para outros projetos" virou um arquivo por tipo de projeto (8 cenários), com selo de maturidade, skills úteis e checklist. Sem cenário de ERP por enquanto.
- **Lições:** o antigo documento de erros virou um arquivo por lição (18), com índice gerado por `scripts/gerar-indice-licoes.mjs`.
- **Casos e decisões:** primeiro caso (portfólio pessoal) e quatro decisões registradas.
- **Fase 9 de fechamento:** cada projeto termina alimentando o método. Regra: nada entra sem um caso real.
- **Novos scripts:** `scripts/novo-projeto.sh` (prepara um projeto novo com os modelos e carimba a versão do método) e o verificador movido para `scripts/verificar.mjs`, agora também no CI.
- **Sessão do método:** `CLAUDE.md` e `modelos/prompt-sessao-do-metodo.md` para uma sessão dedicada a manter este repositório.
- **Quebra:** os arquivos `01` a `05` foram movidos para `nucleo/`; `06` e `07` deixaram de existir (substituídos por `licoes/` e `cenarios/`).

## 1.1.0 (2026-10-14)

- Regra nova: as branches integradas ficam no GitHub (nunca apagar a remota). Lições 17 (apagar a branch remota por hábito) e 18 (pasta que sobra depois de remover uma worktree).

## 1.0.0 (2026-10-14)

- Primeira versão: princípios, fluxo (fases 0 a 8), sessões e papéis, skills e testes, referências e engenharia reversa, Git, GitHub e CI, 16 lições, 8 tipos de projeto, modelos e verificador.
