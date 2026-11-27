# Instruções para a sessão do método

Este arquivo é lido automaticamente por qualquer sessão do Claude Code aberta nesta pasta. Ele diz o que este repositório é, como trabalhar nele e o que nunca fazer.

## Objetivo deste repositório

É o **guia de desenvolvimento** da pessoa dona do repositório: um método para construir sites, aplicações e soluções tecnológicas com o Claude Code, que **cresce a cada projeto**. Ele é independente de qualquer projeto: aqui não se escreve código de produto, só o método (documentos, modelos e scripts de apoio).

## Como esta sessão trabalha

- **Responda em português.** Nomes de comandos e código ficam como são. Pronomes não declarados: use o neutro.
- **Uma sessão só mexe aqui.** Não toque em nenhum projeto de produto (por exemplo, o portfólio) nem na memória dele. Para estudar um projeto, só leia (arquivos, issues e PRs com `gh`), sem alterar nada.
- **Siga o fluxo do método.** Defina o alvo antes de mudar a estrutura, veja o teste falhar antes de alterar scripts ou o verificador e rode a verificação completa antes de concluir.
- **Uma branch por mudança, nunca commit direto na `main`** (a única exceção é o primeiro commit de um repositório vazio). Mudanças entram por Pull Request com o CI verde ("Verificar o método") e só integram com a aprovação da pessoa, a cada mudança. Integre com `gh pr merge N --merge`, **sem apagar a branch** ([decisão 003](decisoes/003-branches-integradas-ficam-no-github.md)).
- **A `main` deste repositório não tem proteção no GitHub.** A pessoa decidiu seguir assim neste repositório privado. A proteção depende da disciplina desta sessão. Consulte a [lição 019](licoes/019-protecao-da-main-indisponivel-em-repositorio-privado.md).
- **Peça confirmação antes de ações externas ou irreversíveis:** criar repositório, `git push`, abrir ou integrar PR, apagar qualquer coisa, reescrever histórico. Nunca use `push --force` sem confirmação explícita.
- **Justifique cada mudança.** Registre no PR o problema, o resultado esperado e como conferiu a alteração. Cite issues, decisões, evidências ou aprendizados quando disponíveis.
- **Zero dado pessoal.** Nada de e-mail, telefone, token, senha ou nome de terceiros nos arquivos, nos exemplos e nas mensagens de commit. O verificador confere, mas a revisão é sua. Antes do primeiro push, confira o e-mail do Git deste repositório (`git config user.email`): prefira o endereço `noreply` do GitHub.
- **Meça antes de afirmar.** Rode `node scripts/verificar.mjs` e leia o resultado antes de dizer que algo está pronto.

## Estrutura

```text
nucleo/      o método base (fluxo, sessões, testes, referências, Git e CI); muda raramente
licoes/      uma lição por arquivo (NNN-slug.md); o índice é gerado
decisoes/    por que uma regra do método mudou (NNN-slug.md)
modelos/     o que se copia para um projeto: issue, PR, CI, CLAUDE.md e AGENTS.md do projeto, scripts de worktree, prompts, gabaritos
planos/      os planos de implementação das mudanças do método (AAAA-MM-DD-slug.md)
scripts/     verificar.mjs, gerar-indice-licoes.mjs, novo-projeto.sh
CHANGELOG.md e VERSION   versão do método (semver)
```

## Como acrescentar

- **Retrospectiva (Fase 9):** se a pessoa passar o caminho de um projeto, consulte-o em modo leitura. Quando houver aprendizado reutilizável, proponha a lição ou a mudança no núcleo em um PR.
- **Lição nova:** crie `licoes/NNN-slug.md` (próximo número, mesmo formato das existentes, com o link para o caso) e rode `node scripts/gerar-indice-licoes.mjs`.
- **Decisão (uma regra mudou):** crie `decisoes/NNN-slug.md` a partir do modelo, atualize os arquivos afetados e o `CHANGELOG.md`; mexeu na estrutura ou numa regra do núcleo: suba a versão maior; conteúdo novo: versão menor.
- **Modelo ou script novo:** cubra com uma verificação em `scripts/verificar.mjs` (veja a existente para os scripts de worktree) antes de escrever o script.
- Antes de abrir o PR: `node scripts/verificar.mjs` verde e o modelo de PR (`.github/pull_request_template.md`) preenchido.

## Comandos

```bash
node scripts/verificar.mjs                  # confere estrutura, links, modelos e scripts
node scripts/gerar-indice-licoes.mjs        # regenera licoes/_indice.md
scripts/novo-projeto.sh <pasta>             # prepara um projeto novo com os modelos
```
