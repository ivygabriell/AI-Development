# Instruções para a sessão do método

Este arquivo é lido automaticamente por qualquer sessão do Claude Code aberta nesta pasta. Ele diz o que este repositório é, como trabalhar nele e o que nunca fazer.

## Objetivo deste repositório

Este repositório mantém o fluxo de desenvolvimento do AI Development para Claude Code e Codex. O Agent Skills do Addy Osmani fornece as práticas de execução. O núcleo define as trilhas, os responsáveis e os portões. Aqui mantemos apenas o método, os modelos e os scripts de apoio.

## Como esta sessão trabalha

- **Responda em português.** Nomes de comandos e código ficam como são. Pronomes não declarados: use o neutro.
- **Uma sessão só mexe aqui.** Não toque em nenhum projeto de produto (por exemplo, o portfólio) nem na memória dele. Para estudar um projeto, só leia (arquivos, issues e PRs com `gh`), sem alterar nada.
- **Siga o fluxo do método.** Defina o alvo antes de mudar a estrutura, veja o teste falhar antes de alterar scripts ou o verificador e rode a verificação completa antes de concluir.
- **Trabalhe em tarefas pequenas.** Registre o resultado verificável de cada tarefa, suas dependências e a evidência esperada. Use o ciclo do Agent Skills definido no núcleo 01.
- **Uma branch por mudança, nunca commit direto na `main`** (a única exceção é o primeiro commit de um repositório vazio). Mudanças entram por Pull Request com o CI verde ("Verificar o método") e só integram com a aprovação da pessoa, a cada mudança. Integre com `gh pr merge N --merge`, **sem apagar a branch** ([decisão 003](decisoes/003-branches-integradas-ficam-no-github.md)).
- **A `main` deste repositório não tem proteção no GitHub.** A pessoa decidiu seguir assim neste repositório privado. A proteção depende da disciplina desta sessão.
- **Peça confirmação antes de ações externas ou irreversíveis:** criar repositório, `git push`, abrir ou integrar PR, apagar qualquer coisa, reescrever histórico. Nunca use `push --force` sem confirmação explícita.
- **Justifique cada mudança.** Registre no PR o problema, o resultado esperado e como conferiu a alteração. Cite issues, decisões, evidências ou aprendizados quando disponíveis.
- **Zero dado pessoal.** Nada de e-mail, telefone, token, senha ou nome de terceiros nos arquivos, nos exemplos e nas mensagens de commit. O verificador confere, mas a revisão é sua. Antes do primeiro push, confira o e-mail do Git deste repositório (`git config user.email`): prefira o endereço `noreply` do GitHub.
- **Meça antes de afirmar.** Rode `node scripts/verificar.mjs` e leia o resultado antes de dizer que algo está pronto.

## Estrutura

```text
nucleo/      o método base (fluxo, sessões, testes, referências, Git e CI); muda raramente
decisoes/    por que uma regra do método mudou (NNN-slug.md)
modelos/     o que se copia para um projeto: issue, PR, CI, CLAUDE.md e AGENTS.md do projeto, scripts de worktree, prompts, gabaritos
planos/      os planos de implementação das mudanças do método (AAAA-MM-DD-slug.md)
scripts/     verificar.mjs, novo-projeto.sh
CHANGELOG.md e VERSION   versão do método (semver)
```

## Como acrescentar

- **Retrospectiva (Fase 9):** se a pessoa passar o caminho de um projeto, consulte-o em modo leitura. Quando houver aprendizado reutilizável, proponha um ajuste verificável no núcleo, em um PR.
- **Decisão (uma regra mudou):** crie `decisoes/NNN-slug.md` a partir do modelo, atualize os arquivos afetados e o `CHANGELOG.md`; mexeu na estrutura ou numa regra do núcleo: suba a versão maior; conteúdo novo: versão menor.
- **Modelo ou script novo:** cubra com uma verificação em `scripts/verificar.mjs` (veja a existente para os scripts de worktree) antes de escrever o script.
- Antes de abrir o PR: `node scripts/verificar.mjs` verde e o modelo de PR (`.github/pull_request_template.md`) preenchido.

## Comandos

```bash
node scripts/verificar.mjs                  # confere estrutura, links, modelos e scripts
scripts/novo-projeto.sh <pasta>             # prepara um projeto novo com os modelos
```
