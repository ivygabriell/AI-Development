# 05 · Git, GitHub e CI

A infraestrutura que sustenta o método: branches, Pull Requests, verificação automática, proteção da `main`, etiquetas e worktrees. Os comandos usam o `git` e o GitHub CLI (`gh`, já autenticado com `gh auth login`).

## Branches e commits

- **Nunca** commite direto na `main`. Uma mudança, uma branch, a partir da `main` atualizada: `git switch main && git pull --ff-only && git switch -c fix/menu-mobile`.
- Nome: `feat/` (funcionalidade), `fix/` (correção), `chore/` (configuração e manutenção) ou `docs/` (documentação) + *slug* em minúsculas com hifens.
- Commits em **Conventional Commits** (`feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`), pequenos, com a mensagem dizendo o porquê. Se o projeto exige atribuição de coautoria, mantenha o trailer padrão em todos.
- Envie a branch **antes** de integrar: `git push -u origin fix/menu-mobile`.

## Fluxo de Pull Request

1. Branch enviada, CI rodando sozinho.
2. `gh pr create --base main --head <branch> --title "..." --body-file corpo.md` (use o modelo em [modelos](../modelos/pull_request_template.md)).
3. Com o CI verde e a validação feita, `gh pr merge N --merge` (sem `--delete-branch`: as branches integradas ficam no GitHub como histórico consultável). Escolhemos o commit de merge porque ele **registra o PR no histórico**.
4. Atualize a `main` local (`git switch main && git pull --ff-only && git fetch --prune`) e rode as suítes de novo **na `main`**.
5. Acompanhe o CI da `main`: `gh run list --branch main --limit 1`.

Antes de integrar, confirme o estado: `gh pr view N --json state,mergeable,mergeStateStatus,statusCheckRollup`. Logo depois de criar um PR o GitHub pode responder `UNKNOWN`; espere alguns segundos.

## Verificação automática (CI)

Um fluxo de trabalho do GitHub Actions que roda em **todo push de qualquer branch**, para a branch ser checada antes de ir para a `main`. Modelo em [ci-node.yml](../modelos/ci-node.yml). Pontos que importam:

- `permissions: contents: read` (privilégio mínimo).
- `concurrency` com `cancel-in-progress` (um push novo cancela a execução antiga da mesma branch).
- Versões fixas das ações (`actions/checkout@v4`, `actions/setup-node@v4`) e do runtime.
- Passos na ordem: instalar com o arquivo de travamento (`npm ci`), testes, tipos, testes de build.
- O **nome do job** vira o nome do check; é ele que a proteção da `main` exige.

Para outras stacks, troque os passos (o resto fica igual):

```yaml
# Python
- uses: actions/setup-python@v5
  with: { python-version: '3.12' }
- run: pip install -r requirements.txt
- run: pytest

# Java (Maven)
- uses: actions/setup-java@v4
  with: { distribution: temurin, java-version: '21' }
- run: mvn -B verify

# .NET
- uses: actions/setup-dotnet@v4
  with: { dotnet-version: '8.0.x' }
- run: dotnet test
```

## Proteção da main

Ative **depois** do primeiro CI verde (o check precisa existir para ser exigido). Exige PR, o check verde e a branch em dia; bloqueia push forçado e exclusão; deixa o administrador contornar numa emergência.

**Disponibilidade:** a proteção depende do plano. Num repositório **privado** de uma conta gratuita, o GitHub recusa o comando abaixo com HTTP 403 (*"Upgrade to GitHub Pro or make this repository public to enable this feature."*). Confira a visibilidade antes (`gh repo view --json visibility`). Se a proteção não estiver disponível, a pessoa escolhe entre plano pago, repositório público ou seguir sem proteção; no último caso, registre no `CLAUDE.md` ou no `docs/DESENVOLVIMENTO.md` que a regra "nunca commit direto na `main`" vale só pela disciplina das sessões ([lição 019](../licoes/019-protecao-da-main-indisponivel-em-repositorio-privado.md)).

```bash
cat > protecao.json <<'EOF'
{
  "required_status_checks": { "strict": true, "contexts": ["Testes, tipos e build"] },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
EOF
gh api -X PUT repos/DONO/REPO/branches/main/protection --input protecao.json
gh api repos/DONO/REPO/branches/main/protection   # leia de volta para confirmar
```

Notas: troque `"Testes, tipos e build"` pelo nome do seu job; `strict: true` obriga a branch a estar atualizada (se não estiver, use `gh pr update-branch N`); não exija aprovações de revisão num repositório de uma pessoa só, porque o autor não aprova o próprio PR.

## Etiquetas e issues

- Crie etiquetas por tipo e por estado: `tarefa`, `precisa-validação`, `bloqueada` e uma por área (`mobile`, `desempenho`, `conteúdo`, `deploy`).
- `gh label create tarefa --color 1f4fff --description "Tarefa para uma sessão trabalhadora" --force`
- O formulário de tarefa ([issue-tarefa.yml](../modelos/issue-tarefa.yml)) vai em `.github/ISSUE_TEMPLATE/`, junto com um `config.yml` que desliga a issue em branco (`blank_issues_enabled: false`).
- Abra tarefas pelo terminal com `gh issue create --label tarefa --body-file corpo.md`.

## Worktrees

Uma worktree é outra pasta do mesmo repositório, em outra branch. É o que permite sessões paralelas sem pisar nos arquivos umas das outras.

```bash
git worktree add -b fix/menu-mobile ../projeto-tarefas/fix-menu-mobile origin/main
git worktree list
git worktree remove ../projeto-tarefas/fix-menu-mobile
```

Remover a worktree **não apaga a branch no GitHub**: ela fica como histórico. Se sobrar uma pasta (arquivos ignorados, como dependências), confira o que é, apague-a só depois de a branch estar integrada e enviada, e rode `git worktree prune`.

Os scripts [nova-tarefa.sh](../modelos/nova-tarefa.sh) e [remover-tarefa.sh](../modelos/remover-tarefa.sh) fazem isso com validação (tipo, *slug*, branch já existente), porta livre e instalação de dependências. O de remoção **recusa** apagar uma worktree com mudanças não salvas.

Com o [Orca](https://github.com/stablyai/orca) (modo em rascunho, veja [02](02-sessoes-e-papeis.md)), as worktrees são criadas e removidas por ele (`orca worktree create --name <slug> --issue <N>`, `orca worktree rm`), inclusive pela coordenadora ao distribuir tarefas; os scripts ficam para quem trabalha sem o Orca. As mesmas regras valem: a branch fica no GitHub depois do merge, e uma worktree com mudanças não salvas não se apaga.

## Higiene de dados pessoais

Antes do primeiro `push` para um repositório **público**:

1. Procure o que não deve sair: e-mail da conta, telefone, tokens, chaves, endereços, caminhos locais (`/Users/seu-nome/...`). Use `git grep -n -i "trecho"` e confira também documentos e testes, não só o código.
2. Mantenha dados pessoais **só** nos arquivos de conteúdo do produto, e escreva um **teste-guarda** que os procure no resultado gerado.
3. `.gitignore` completo desde o início: `.env` e `.env.*` (mantendo `!.env.example`), dependências, pastas de build, `.DS_Store`, `.vercel`, `.netlify`, `*.log`, `coverage`, pastas de editor e configurações locais de ferramentas.
4. Se algo vazou: **chaves e tokens precisam ser revogados e trocados**; apagar do histórico não basta. Remover um dado do histórico exige reescrever commits e `push --force`, uma ação **destrutiva** que muda os códigos de todos os commits e que só se faz com aviso e confirmação. Cópias e caches antigos podem continuar existindo.

## Comandos úteis

```bash
gh run list --branch minha-branch --limit 1                    # estado do CI
gh run view ID --json status,conclusion                        # acompanhar
gh pr view N --json state,mergeable,mergeStateStatus           # estado do PR
gh pr update-branch N                                          # trazer a main para a branch do PR
gh issue view N                                                # ler a tarefa
git fetch --prune                                              # limpar referências antigas
```

Observações de macOS: o `sed -i` exige um argumento vazio (`sed -i '' ...`); o comando `timeout` não existe (use um laço com `sleep`); a pasta `/tmp` é limpa pelo sistema, então mantenha ferramentas temporárias recriáveis.
