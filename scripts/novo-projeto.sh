#!/usr/bin/env bash
# Prepara um projeto novo com os modelos do método.
# Uso: scripts/novo-projeto.sh <pasta-do-projeto> [--agente claude|codex] [--especialistas] [cenario ...]
#   <pasta-do-projeto>  pasta que já existe (de preferência um repositório Git novo)
#   --agente            põe todos os papéis, inclusive a Lead, numa ferramenta só: claude ou codex (decisão 013);
#                       sem ele, a Lead e Product, Architect, Frontend e Designer ficam no Claude Code, e Backend, Security e Ops no Codex
#   --especialistas     modo com agentes especialistas: copia os harnesses para processo/agentes/
#   cenario             um ou mais nomes de arquivos em cenarios/ (sem .md), por exemplo: site-estatico api-backend
# Copia: formulário de tarefa, modelo de PR, CI, scripts de worktree, e cria CLAUDE.md, AGENTS.md (para o Codex),
# processo/DESENVOLVIMENTO.md e processo/memoria-do-projeto.md carimbados com a versão do método. Nunca sobrescreve arquivos existentes.
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
agente=""
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
    [[ -n "$agente" ]] || { echo "--agente precisa de um valor: claude ou codex." >&2; exit 1; }
  elif [[ "$arg" == --agente=* ]]; then
    agente="${arg#--agente=}"
    [[ -n "$agente" ]] || { echo "--agente precisa de um valor: claude ou codex." >&2; exit 1; }
  else
    restantes+=("$arg")
  fi
  i=$((i + 1))
done
case "$agente" in
  "") nome_agente="" ;;
  claude) nome_agente="Claude Code" ;;
  codex) nome_agente="Codex" ;;
  *)
    echo "Ferramenta inválida: '$agente'. Use --agente claude ou --agente codex (todos os papéis numa ferramenta só)." >&2
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
  "modelos/issue-bug.yml|.github/ISSUE_TEMPLATE/bug.yml"
  "modelos/pull_request_template.md|.github/pull_request_template.md"
  "modelos/ci-node.yml|.github/workflows/ci.yml"
  "modelos/nova-tarefa.sh|processo/scripts/nova-tarefa.sh"
  "modelos/remover-tarefa.sh|processo/scripts/remover-tarefa.sh"
  "modelos/memoria-do-projeto.md|processo/memoria-do-projeto.md"
  "modelos/modelo-requisitos.md|processo/requisitos.md"
)
gerados=("processo/DESENVOLVIMENTO.md" "processo/telas")
[[ $especialistas -eq 1 ]] && gerados+=("processo/agentes")

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
chmod +x "$alvo/processo/scripts/nova-tarefa.sh" "$alvo/processo/scripts/remover-tarefa.sh"

# Modo com agentes especialistas (decisão 008): os harnesses vão para processo/agentes/, sem o modelo
if [[ $especialistas -eq 1 ]]; then
  mkdir -p "$alvo/processo/agentes"
  for h in "$raiz"/modelos/agentes/*.md; do
    [[ "$(basename "$h")" == _* ]] && continue
    cp "$h" "$alvo/processo/agentes/"
  done
fi

# CLAUDE.md do projeto: toda sessão já nasce com o contexto
if [[ -e "$alvo/CLAUDE.md" ]]; then
  echo "AVISO: o CLAUDE.md já existe e não foi alterado; acrescente a ele as linhas @processo/DESENVOLVIMENTO.md e @processo/memoria-do-projeto.md." >&2
else
  sed -e "s|{{VERSAO}}|$versao|g" "$raiz/modelos/CLAUDE-projeto.md" > "$alvo/CLAUDE.md"
fi

# AGENTS.md do projeto: o Codex lê este arquivo, não o CLAUDE.md (decisão 007)
if [[ -e "$alvo/AGENTS.md" ]]; then
  echo "AVISO: o AGENTS.md já existe e não foi alterado; acrescente a ele a leitura do CLAUDE.md, do processo/DESENVOLVIMENTO.md e da memória (modelo: modelos/AGENTS-projeto.md do método)." >&2
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
  linha_especialistas="- Com agentes especialistas: cada agente lê primeiro o seu harness em \`processo/agentes/\` e atua dentro dele. A Lead coordena os especialistas, e cada especialista abre as suas Builders. Exige no Orca: Settings → Orchestration → Nested worker depth = 2."
fi

# Ferramenta padrão de cada papel (decisão 013): a mista, ou uma só com --agente
ferramenta() { if [[ -n "$nome_agente" ]]; then echo "$nome_agente"; else case "$1" in Backend|Security|Ops) echo "Codex" ;; *) echo "Claude Code" ;; esac; fi; }
tabela_papeis=""
for papel in Lead Product Architect Frontend Designer Backend Security Ops; do tabela_papeis+="| $papel | $(ferramenta "$papel") |"$'\n'; done
lead="$(ferramenta Lead)"

mkdir -p "$alvo/processo/telas"
cat > "$alvo/processo/telas/README.md" <<'DOC'
# Telas aprovadas

O registro das telas aprovadas pela pessoa no Figma (decisão 015 do método). A cada aprovação, o Designer (sem o modo com especialistas, a Lead) acrescenta, num PR: uma captura por tela e estado (`R-NN-nome-estado.png`), a data e o link do frame, e atualiza `tokens.json` com os tokens do Figma. O código segue só a versão registrada aqui; toda mudança de tela começa no Figma. Projeto sem interface: escreva "sem interface" nesta linha e deixe a pasta assim.

| Tela (frame) | Requisitos | Estados | Aprovada em | Link do frame |
|---|---|---|---|---|
DOC
cat > "$alvo/processo/DESENVOLVIMENTO.md" <<DOC
# Como desenvolvemos este projeto

Versão do método: $versao
Lead: $lead
Telas: (link do arquivo do Figma; registro em processo/telas/; "sem interface" se não houver)
Cenários aplicados:
$lista_cenarios

Os detalhes de cada fase, os cenários, os casos e as lições ficam no repositório do método (privado). Este documento registra só o que vale **neste projeto**: ajuste-o à medida que decidir.

## Regras que valem aqui

1. **Alvo antes de construir.** Entender, escrever de volta, desenhar e só então construir.
2. **Uma mudança, uma branch.** Nunca commit direto na \`main\`; tudo entra por Pull Request com o CI verde.
3. **Teste primeiro, em duas camadas.** Micro (TDD, visto falhar antes do código) e macro (suíte completa, build, exploração).
4. **Quem constrói não valida.** A sessão Lead refaz os testes e explora o resultado antes de integrar.
5. **As branches integradas ficam no GitHub.** Integre com \`gh pr merge N --merge\`, sem \`--delete-branch\`.
6. **A pessoa decide o que tem impacto grande** (seção Aprovações, abaixo); o resto a Lead decide e registra.

## Ferramenta por papel

Cada sessão usa a ferramenta do seu papel; a Builder usa a do papel de quem a abre e vai para a outra quando a cota aperta (com passagem pela issue). No Orca: \`--agent claude --model claude-opus-5-5\` (Claude Code) ou \`--agent codex --model gpt-6.1-sol\` (Codex). Mudar esta tabela é uma decisão da pessoa, registrada na memória.

| Papel | Ferramenta padrão |
|---|---|
$tabela_papeis
## Aprovações

Uma decisão é da pessoa quando aciona pelo menos um gatilho: muda **o que** será construído; é difícil ou impossível de desfazer; atinge usuários reais; custa dinheiro ou muita cota; aceita um risco de segurança ou de dados pessoais; muda as regras do jogo (harness, método, a Lead, a tabela Ferramenta por papel). Sem gatilho, a Lead decide e registra na issue ou na memória; na dúvida, sobe para a pessoa. Um PR dentro do plano aprovado, com CI verde, validação sem achado crítico nem importante, só nos arquivos permitidos e sem gatilho, a Lead integra sozinha. A Lead escreve um resumo por marco do que aprovou sozinha. A tabela completa está no núcleo 01 do método ("Portões de aprovação"); anote aqui o que a pessoa mudar:

- (nenhum ajuste ainda)

## Comandos do projeto

- Cópia local do método: (preencha o caminho para consultar o núcleo e os modelos)

- Testes: (preencha)
- Tipos / lint: (preencha)
- Build: (preencha)
- Servidor local: (preencha)

## Tarefas e sessões

- Tarefas: issues com o formulário de tarefa (\`.github/ISSUE_TEMPLATE/tarefa.yml\`). Bugs: o formulário de bug (\`.github/ISSUE_TEMPLATE/bug.yml\`) e o "Ciclo de um bug" do método.
- Worktrees: \`processo/scripts/nova-tarefa.sh <tipo> <slug>\` e \`processo/scripts/remover-tarefa.sh <tipo> <slug>\`.
- Com o Orca: a Lead distribui as tarefas aos agentes (\`orca orchestration worker-start\`); o Orca cria e remove as worktrees, e os scripts acima ficam para quem trabalha sem ele. Prompt: \`modelos/prompt-lead-orca.md\` do método.
- Ferramentas: cada papel usa a sua (seção Ferramenta por papel, acima). O Claude Code lê o \`CLAUDE.md\`; o Codex lê o \`AGENTS.md\`, que manda ler o \`CLAUDE.md\`. Todo PR recebe ao menos uma revisão da outra ferramenta. Quando a cota acaba no meio da tarefa, a Builder faz commit, envia a branch e comenta na issue onde parou; outra Builder, na outra ferramenta, continua na mesma branch. Com back e front em tarefas paralelas, o contrato da API é aprovado antes de qualquer tarefa de construção.
${linha_especialistas:+$linha_especialistas
}- Para trazer este projeto à versão mais nova do método: compare a versão com o CHANGELOG.md da cópia local e proponha os ajustes numa branch.
- Requisitos: \`processo/requisitos.md\` (fichas R-xx com o peso). Com interface, a identidade e todas as telas são aprovadas no Figma e registradas em \`processo/telas/\` antes do plano; o código segue a versão registrada.
- Memória do projeto: \`processo/memoria-do-projeto.md\`.

## Antes do primeiro push para um repositório público

Rode a higiene de dados do método: nada de e-mail pessoal, telefone ou token em documentos, testes e commits.
DOC

echo "Projeto preparado em: $alvo (método $versao, Lead: $lead)"
echo "Próximos passos:"
echo "  1. Faça o primeiro push da main, deixe o CI rodar e só depois ative a proteção da main."
echo "  2. Preencha processo/DESENVOLVIMENTO.md (comandos) e processo/memoria-do-projeto.md."
echo "  3. Defina o alvo da primeira entrega e abra a primeira issue com o formulário de tarefa."
