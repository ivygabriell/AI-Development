#!/usr/bin/env bash
# Cria uma worktree (cópia isolada da pasta) e a branch de uma tarefa, a partir da main do GitHub.
# Uso: scripts/nova-tarefa.sh <feat|fix|chore|docs> <slug> [porta]
#   ex.: scripts/nova-tarefa.sh fix menu-mobile 3011
# Variáveis opcionais:
#   WORKTREES_DIR  pasta das tarefas (padrão: ../<nome-do-projeto>-tarefas)
#   PORTA_INICIAL  primeira porta da faixa de 10 portas das tarefas (padrão: 3010)
#   INSTALL_CMD    comando de instalação das dependências (padrão: npm ci --silent); SKIP_INSTALL=1 pula
#   DEV_CMD        comando do servidor, com {porta} no lugar da porta (padrão: npm run dev -- --port {porta})
set -euo pipefail

tipo="${1:-}"
slug="${2:-}"
porta="${3:-}"

if [[ ! "$tipo" =~ ^(feat|fix|chore|docs)$ ]]; then
  echo "Tipo inválido '$tipo': use feat, fix, chore ou docs." >&2
  echo "Uso: scripts/nova-tarefa.sh <feat|fix|chore|docs> <slug> [porta]" >&2
  exit 1
fi
if [[ ! "$slug" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Slug inválido '$slug': use letras minúsculas, números e hífens (ex.: menu-mobile)." >&2
  exit 1
fi

raiz="$(git rev-parse --show-toplevel)"
base="${WORKTREES_DIR:-$(cd "$raiz/.." && pwd)/$(basename "$raiz")-tarefas}"
branch="$tipo/$slug"
dir="$base/$tipo-$slug"

if [[ -e "$dir" ]]; then
  echo "Essa tarefa já existe: $dir" >&2
  exit 1
fi

git -C "$raiz" fetch origin main --quiet
if git -C "$raiz" show-ref --verify --quiet "refs/heads/$branch" || git -C "$raiz" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
  echo "A branch $branch já existe (local ou no GitHub). Escolha outro slug." >&2
  exit 1
fi

porta_livre() { ! (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null; }
if [[ -z "$porta" ]]; then
  inicio="${PORTA_INICIAL:-3010}"
  for ((candidata = inicio; candidata < inicio + 10; candidata++)); do
    if porta_livre "$candidata"; then porta="$candidata"; break; fi
  done
fi
if [[ -z "$porta" ]]; then
  echo "Nenhuma porta livre na faixa das tarefas." >&2
  exit 1
fi

mkdir -p "$base"
git -C "$raiz" worktree add -b "$branch" "$dir" origin/main --quiet

if [[ "${SKIP_INSTALL:-}" != "1" ]]; then
  (cd "$dir" && eval "${INSTALL_CMD:-npm ci --silent}")
fi

dev="${DEV_CMD:-npm run dev -- --port {porta}}"
cat <<MSG
Tarefa criada.
  Pasta:   $dir
  Branch:  $branch (a partir de origin/main)
  Porta:   $porta

Próximos passos:
  cd "$dir"
  ${dev//\{porta\}/$porta}      # servidor local desta tarefa
Leia o documento de desenvolvimento do projeto e use as Skills em todo o trabalho (brainstorming, TDD, verificação).
Ao terminar: rode os testes macro, git push -u origin $branch e abra o PR. Quem integra é a sessão integradora.
MSG
