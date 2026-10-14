# Instruções para a sessão do método

Este arquivo é lido automaticamente por qualquer sessão do Claude Code aberta nesta pasta. Ele diz o que este repositório é, como trabalhar nele e o que nunca fazer.

## Objetivo deste repositório

É o **guia de desenvolvimento** da pessoa dona do repositório: um método para construir sites, aplicações e soluções tecnológicas com o Claude Code, que **cresce a cada projeto**. Ele é independente de qualquer projeto: aqui não se escreve código de produto, só o método (documentos, modelos e scripts de apoio).

## Como esta sessão trabalha

- **Responda em português.** Nomes de Skills, comandos e código ficam como são. Pronomes não declarados: use o neutro.
- **Uma sessão só mexe aqui.** Não toque em nenhum projeto de produto (por exemplo, o portfólio) nem na memória dele. Para estudar um projeto, só leia (arquivos, issues e PRs com `gh`), sem alterar nada.
- **Use a Skill certa e diga qual está em uso.** `superpowers:brainstorming` antes de mudar a estrutura ou criar algo novo, `engineering:documentation` para escrever, `superpowers:test-driven-development` para scripts e para o verificador (escreva a verificação, veja falhar, depois ajuste), `superpowers:verification-before-completion` antes de dizer "pronto" e `superpowers:finishing-a-development-branch` ao terminar.
- **Uma branch por mudança, nunca commit direto na `main`** (a única exceção é o primeiro commit de um repositório vazio). Mudanças entram por Pull Request com o CI verde ("Verificar o método") e só integram com a aprovação da pessoa, a cada mudança. Integre com `gh pr merge N --merge`, **sem apagar a branch** ([decisão 003](decisoes/003-branches-integradas-ficam-no-github.md)).
- **A `main` deste repositório não tem proteção no GitHub** (repositório privado em conta gratuita; decisão da pessoa, só para este repositório, registrada no [caso do repositório do método](casos/2026-10-repositorio-do-metodo.md)). A regra acima vale só pela disciplina desta sessão: o GitHub não impede um commit direto na `main` nem um `push --force`.
- **Peça confirmação antes de ações externas ou irreversíveis:** criar repositório, `git push`, abrir ou integrar PR, apagar qualquer coisa, reescrever histórico. Nunca use `push --force` sem confirmação explícita.
- **Nada entra sem um caso real.** Não acrescente regra, cenário ou lição por opinião ou teoria. Cada mudança no núcleo ou em cenário cita o caso em `casos/` que a justifica; sem caso, vira `rascunho` ou fica de fora.
- **Zero dado pessoal.** Nada de e-mail, telefone, token, senha ou nome de terceiros nos arquivos, nos exemplos e nas mensagens de commit. O verificador confere, mas a revisão é sua. Antes do primeiro push, confira o e-mail do Git deste repositório (`git config user.email`): prefira o endereço `noreply` do GitHub.
- **Meça antes de afirmar.** Rode `node scripts/verificar.mjs` e leia o resultado antes de dizer que algo está pronto.
- **Sem cenário de ERP por enquanto.** É uma decisão da pessoa; só entra se ela pedir.

## Estrutura

```text
nucleo/      o método base (fluxo, sessões, skills e testes, referências, git/CI); muda raramente
cenarios/    um arquivo por tipo de projeto, com selo de maturidade (rascunho, testado em 1 projeto, estável)
casos/       um arquivo por projeto realizado (a retrospectiva); a matéria-prima das mudanças
licoes/      uma lição por arquivo (NNN-slug.md); o índice é gerado
decisoes/    por que uma regra do método mudou (NNN-slug.md)
modelos/     o que se copia para um projeto: issue, PR, CI, scripts de worktree, prompts, gabaritos
scripts/     verificar.mjs, gerar-indice-licoes.mjs, novo-projeto.sh
CHANGELOG.md e VERSION   versão do método (semver)
```

## Como acrescentar

- **Um projeto terminou ou chegou a um marco (Fase 9):** a pessoa passa o caminho ou o repositório do projeto. Leia só em modo leitura, preencha `casos/AAAA-MM-slug.md` a partir de `casos/_modelo-caso.md`, extraia as lições, proponha ajustes em cenários e no núcleo, e abra **um** PR com tudo.
- **Lição nova:** crie `licoes/NNN-slug.md` (próximo número, mesmo formato das existentes, com o link para o caso) e rode `node scripts/gerar-indice-licoes.mjs`.
- **Cenário novo ou ajuste:** copie `cenarios/_modelo-cenario.md`, comece como `rascunho`, liste em `cenarios/README.md`. O selo só sobe com um caso real.
- **Decisão (uma regra mudou):** crie `decisoes/NNN-slug.md` a partir do modelo, atualize os arquivos afetados e o `CHANGELOG.md`; mexeu na estrutura ou numa regra do núcleo: suba a versão maior; conteúdo novo: versão menor.
- **Modelo ou script novo:** cubra com uma verificação em `scripts/verificar.mjs` (veja a existente para os scripts de worktree) antes de escrever o script.
- Antes de abrir o PR: `node scripts/verificar.mjs` verde e o modelo de PR (`.github/pull_request_template.md`) preenchido.

## Comandos

```bash
node scripts/verificar.mjs                  # confere estrutura, links, lições, cenários, scripts
node scripts/gerar-indice-licoes.mjs        # regenera licoes/_indice.md
scripts/novo-projeto.sh <pasta> [cenario]   # prepara um projeto novo com os modelos
```
