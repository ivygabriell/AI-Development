# Registro de mudanças

Segue [versionamento semântico](https://semver.org/lang/pt-BR/): **maior** quando a estrutura ou uma regra do núcleo muda de forma incompatível, **menor** quando entra conteúdo novo (cenário, lição, modelo), **correção** para ajustes de texto. Cada versão grande ou média ganha uma tag Git (`v2.0.0`).

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
