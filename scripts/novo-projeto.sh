#!/usr/bin/env bash
# Prepara um projeto novo com os modelos do método.
# Uso: scripts/novo-projeto.sh <pasta-do-projeto> [--agente claude|codex] [--especialistas] [cenario ...]
#   <pasta-do-projeto>  pasta que já existe (de preferência um repositório Git novo)
#   --agente            o agente principal do projeto (decisão 010): claude (padrão) ou codex; todas as sessões usam o mesmo
#   --especialistas     modo com agentes especialistas (rascunho): copia os harnesses para docs/agentes/
#   cenario             um ou mais nomes de arquivos em cenarios/ (sem .md), por exemplo: site-estatico api-backend
# Copia: formulário de tarefa, modelo de PR, CI, scripts de worktree, e cria CLAUDE.md, AGENTS.md (para o Codex),
# docs/DESENVOLVIMENTO.md e docs/memoria-do-projeto.md carimbados com a versão do método. Nunca sobrescreve arquivos existentes.
# Avisa no stderr (sem interromper) quando um cenário escolhido é rascunho.
# Se o projeto já tem CLAUDE.md ou AGENTS.md, não os toca: só avisa.
set -euo pipefail

raiz="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
uso="Uso: scripts/novo-projeto.sh <pasta-do-projeto> [--agente claude|codex] [--especialistas] [cenario ...]"

if [[ $# -lt 1 ]]; then
  echo "$uso" >&2
  echo "Cenários disponíveis: $(cd "$raiz/cenarios" && ls *.md | grep -v -E '^(README|_modelo-cenario)\.md$' | sed 's/\.md$//' | tr '\n' ' ')" >&2
  exit 1
fi

# As opções podem vir em qualquer posição; o primeiro argumento que sobra é a pasta, os outros são cenários
especialistas=0
agente="claude"
restantes=()
args=("$@")
i=0
while [[ $i -lt ${#args[@]} ]]; do
  arg="${args[$i]}"
  if [[ "$arg" == "--especialistas" ]]; then
    especialistas=1
  elif [[ "$arg" == "--agente" ]]; then
    i=$((i + 1))
    agente="${args[$i]:-}"
  elif [[ "$arg" == --agente=* ]]; then
    agente="${arg#--agente=}"
  else
    restantes+=("$arg")
  fi
  i=$((i + 1))
done
case "$agente" in
  claude) nome_agente="Claude Code" ;;
  codex) nome_agente="Codex" ;;
  *)
    echo "Agente principal inválido: '$agente'. Use --agente claude ou --agente codex (um só por projeto)." >&2
    exit 1
    ;;
esac
if [[ ${#restantes[@]} -lt 1 ]]; then
  echo "$uso" >&2
  exit 1
fi
alvo="${restantes[0]}"
cenarios=("${restantes[@]:1}")

if [[ ! -d "$alvo" ]]; then
  echo "A pasta $alvo não existe. Crie o repositório do projeto primeiro." >&2
  exit 1
fi
alvo="$(cd "$alvo" && pwd)"

for c in "${cenarios[@]+"${cenarios[@]}"}"; do
  if [[ ! -f "$raiz/cenarios/$c.md" ]]; then
    echo "Cenário inexistente: $c (veja a pasta cenarios/)." >&2
    exit 1
  fi
done

versao="$(tr -d '[:space:]' < "$raiz/VERSION")"

# origem|destino (relativo ao projeto)
copias=(
  "modelos/issue-tarefa.yml|.github/ISSUE_TEMPLATE/tarefa.yml"
  "modelos/pull_request_template.md|.github/pull_request_template.md"
  "modelos/ci-node.yml|.github/workflows/ci.yml"
  "modelos/nova-tarefa.sh|scripts/nova-tarefa.sh"
  "modelos/remover-tarefa.sh|scripts/remover-tarefa.sh"
  "modelos/memoria-do-projeto.md|docs/memoria-do-projeto.md"
)
gerados=("docs/DESENVOLVIMENTO.md")
[[ $especialistas -eq 1 ]] && gerados+=("docs/agentes")

# Antes de escrever qualquer coisa, garante que nada será sobrescrito
conflitos=()
for item in "${copias[@]}"; do
  destino="${item#*|}"
  [[ -e "$alvo/$destino" ]] && conflitos+=("$destino")
done
for destino in "${gerados[@]}"; do
  [[ -e "$alvo/$destino" ]] && conflitos+=("$destino")
done
if [[ ${#conflitos[@]} -gt 0 ]]; then
  echo "Nada foi alterado. Estes arquivos já existem em $alvo:" >&2
  printf '  - %s\n' "${conflitos[@]}" >&2
  exit 1
fi

for item in "${copias[@]}"; do
  origem="${item%%|*}"
  destino="${item#*|}"
  mkdir -p "$alvo/$(dirname "$destino")"
  cp "$raiz/$origem" "$alvo/$destino"
done
chmod +x "$alvo/scripts/nova-tarefa.sh" "$alvo/scripts/remover-tarefa.sh"

# Modo com agentes especialistas (decisão 008): os harnesses vão para docs/agentes/, sem o modelo
if [[ $especialistas -eq 1 ]]; then
  mkdir -p "$alvo/docs/agentes"
  for h in "$raiz"/modelos/agentes/*.md; do
    [[ "$(basename "$h")" == _* ]] && continue
    cp "$h" "$alvo/docs/agentes/"
  done
fi

# CLAUDE.md do projeto: toda sessão já nasce com o contexto
if [[ -e "$alvo/CLAUDE.md" ]]; then
  echo "AVISO: o CLAUDE.md já existe e não foi alterado; acrescente a ele as linhas @docs/DESENVOLVIMENTO.md e @docs/memoria-do-projeto.md." >&2
else
  sed -e "s|{{VERSAO}}|$versao|g" "$raiz/modelos/CLAUDE-projeto.md" > "$alvo/CLAUDE.md"
fi

# AGENTS.md do projeto: o Codex lê este arquivo, não o CLAUDE.md (decisão 007)
if [[ -e "$alvo/AGENTS.md" ]]; then
  echo "AVISO: o AGENTS.md já existe e não foi alterado; acrescente a ele a leitura do CLAUDE.md, do docs/DESENVOLVIMENTO.md e da memória (modelo: modelos/AGENTS-projeto.md do método)." >&2
else
  sed -e "s|{{VERSAO}}|$versao|g" "$raiz/modelos/AGENTS-projeto.md" > "$alvo/AGENTS.md"
fi

# Cada cenário leva a sua maturidade; rascunho gera aviso, mas não interrompe
lista_cenarios="Nenhum cenário escolhido ainda (veja a pasta cenarios/ do repositório do método)."
if [[ ${#cenarios[@]} -gt 0 ]]; then
  linhas=()
  for c in "${cenarios[@]}"; do
    maturidade="$(sed -n 's/^\*\*Maturidade:\*\*[[:space:]]*//p' "$raiz/cenarios/$c.md" | head -n 1)"
    if [[ "$maturidade" == "rascunho" ]]; then
      echo "AVISO: o cenário $c é rascunho (nunca testado em projeto real); trate como hipótese, não como regra." >&2
      linhas+=("- $c (rascunho: ainda não testado)")
    else
      linhas+=("- $c ($maturidade)")
    fi
  done
  lista_cenarios="$(printf -- '%s\n' "${linhas[@]}")"
fi

linha_especialistas=""
if [[ $especialistas -eq 1 ]]; then
  linha_especialistas="- Com agentes especialistas (modo em rascunho): cada agente lê primeiro o seu harness em \`docs/agentes/\` e atua dentro dele. A integradora coordena os especialistas, e cada especialista abre as suas trabalhadoras. Exige no Orca: Settings → Orchestration → Nested worker depth = 2."
fi

mkdir -p "$alvo/docs"
cat > "$alvo/docs/DESENVOLVIMENTO.md" <<DOC
# Como desenvolvemos este projeto

Versão do método: $versao
Agente principal: $nome_agente
Cenários aplicados:
$lista_cenarios

Os detalhes de cada fase, os cenários, os casos e as lições ficam no repositório do método (privado). Este documento registra só o que vale **neste projeto**: ajuste-o à medida que decidir.

## Regras que valem aqui

1. **Alvo antes de construir.** Entender, escrever de volta, desenhar e só então construir.
2. **Uma mudança, uma branch.** Nunca commit direto na \`main\`; tudo entra por Pull Request com o CI verde.
3. **Teste primeiro, em duas camadas.** Micro (TDD, visto falhar antes do código) e macro (suíte completa, build, exploração).
4. **Quem constrói não valida.** A sessão integradora refaz os testes e explora o resultado antes de integrar.
5. **As branches integradas ficam no GitHub.** Integre com \`gh pr merge N --merge\`, sem \`--delete-branch\`.
6. **O humano decide o que é externo ou irreversível:** publicar, integrar, apagar, reescrever histórico.

## Comandos do projeto

- Testes: (preencha)
- Tipos / lint: (preencha)
- Build: (preencha)
- Servidor local: (preencha)

## Tarefas e sessões

- Tarefas: issues com o formulário de tarefa (\`.github/ISSUE_TEMPLATE/tarefa.yml\`).
- Worktrees: \`scripts/nova-tarefa.sh <tipo> <slug>\` e \`scripts/remover-tarefa.sh <tipo> <slug>\`.
- Com o Orca (modo em rascunho): a coordenadora é a integradora e distribui as tarefas aos agentes (\`orca orchestration worker-start\`); o Orca cria e remove as worktrees, e os scripts acima ficam para quem trabalha sem ele. Prompt: \`modelos/prompt-coordenadora-orca.md\` do método.
- Agente principal (modo em rascunho): todas as sessões deste projeto usam $nome_agente, nunca as duas ferramentas; no Orca, todo agente abre com \`--agent $agente\`. O Claude Code lê o \`CLAUDE.md\`; o Codex lê o \`AGENTS.md\`, que manda ler o \`CLAUDE.md\`. Trocar de ferramenta é uma decisão da pessoa, registrada na memória. Com back e front em tarefas paralelas, o contrato da API é aprovado antes de qualquer tarefa de construção.
${linha_especialistas:+$linha_especialistas
}- Para trazer este projeto à versão mais nova do método: \`/metodo:atualizar-projeto\`.
- Memória do projeto: \`docs/memoria-do-projeto.md\`.

## Antes do primeiro push para um repositório público

Rode a higiene de dados do método: nada de e-mail pessoal, telefone ou token em documentos, testes e commits.
DOC

echo "Projeto preparado em: $alvo (método $versao, agente principal: $nome_agente)"
echo "Próximos passos:"
echo "  1. Faça o primeiro push da main, deixe o CI rodar e só depois ative a proteção da main."
echo "  2. Preencha docs/DESENVOLVIMENTO.md (comandos) e docs/memoria-do-projeto.md."
echo "  3. Defina o alvo da primeira entrega e abra a primeira issue com o formulário de tarefa."
