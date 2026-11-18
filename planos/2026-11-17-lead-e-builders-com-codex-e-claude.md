# Lead e Builders, com Codex e Claude no mesmo projeto: plano de implementação

> **Para quem executa:** use `superpowers:executing-plans` (ou `superpowers:subagent-driven-development`) tarefa por tarefa. Os passos usam caixas (`- [ ]`) para acompanhar.

**Objetivo:** levar ao método 4.0.0 os nomes novos dos papéis, o nome de cada Builder, Codex e Claude no mesmo projeto (Lead fixo no Claude, ferramenta padrão por papel) e as aprovações por gatilho.

**Arquitetura:** o "teste" deste repositório é o `scripts/verificar.mjs`. Cada tarefa primeiro muda ou acrescenta as verificações dela, roda e vê falhar, depois muda os documentos, modelos e scripts até ficar verde, e faz um commit.

**Ferramentas:** Markdown, Bash (`scripts/novo-projeto.sh`), Node (`scripts/verificar.mjs`), Orca 1.4.262 (`worker-start --display-name` conferido no `--help`).

**Desenho:** [2026-11-17-lead-e-builders-com-codex-e-claude-desenho.md](2026-11-17-lead-e-builders-com-codex-e-claude-desenho.md)

## Restrições globais

- Nomes exatos: **Lead, Product, Architect, Backend, Frontend, Security, Ops, Builders** (singular: Builder).
- Arquivos novos: `modelos/agentes/{lead,product,architect,backend,frontend,security,ops}.md`, `modelos/referencias/{lead,product,architect,backend,frontend,security,ops}.md` (as que existem hoje), `modelos/prompt-lead.md`, `modelos/prompt-builder.md`, `modelos/prompt-lead-orca.md`.
- Nome da Builder: `<Papel> Builder #<issue> · <resumo> · <ferramenta>`; worktree `<papel>-<issue>-<slug>` e branch `<papel>/<issue>-<slug>`, com `<papel>` em minúsculas (`backend`, `frontend`, `ops`).
- Ferramenta padrão: Claude Code para Lead, Product, Architect, Frontend; Codex para Backend, Security, Ops. `--agente <claude|codex>` põe todos os papéis numa ferramenta só.
- Os seis gatilhos de aprovação da pessoa, com o texto do desenho; "na dúvida, sobe para a pessoa".
- O resto do texto continua em português. "Segurança", "Produto", "Arquitetura" e "DevOps" também são palavras comuns: troque só onde nomeiam o papel, trecho a trecho, nunca por substituição cega.
- Histórico não é reescrito: `casos/`, `planos/` antigos, `licoes/`, `CHANGELOG.md` (exceto a seção nova) e o corpo das decisões 001 a 012.
- O `CLAUDE.md` **do repositório do método** não muda: aqui a pessoa continua aprovando cada PR.
- Zero dado pessoal; `node scripts/verificar.mjs` verde ao fim de cada tarefa.

## Foco da revisão

1. **Nome antigo esquecido num arquivo vivo** (link para `integradora.md`, "a trabalhadora" num harness): a pessoa veria dois nomes para o mesmo papel. Coberto pela verificação de termos antigos da Tarefa 2 e pela checagem de links que já existe.
2. **Projeto 3.x com `docs/agentes/integradora.md` personalizado:** a atualização não pode perder a personalização ao renomear. Coberto na Tarefa 6 (renomear com `git mv` e listar a diferença do conteúdo, sem trocar).
3. **`--agente codex`:** o `DESENVOLVIMENTO.md` gerado precisa pôr todos os papéis, inclusive a Lead, no Codex. Coberto na Tarefa 4.
4. **A Lead integra um PR que aciona um gatilho sem perceber** (uma migração que apaga dados, um login novo): o harness da Lead precisa conferir os seis gatilhos antes de cada merge. Coberto na Tarefa 5.
5. **Passagem entre ferramentas sem contexto:** a Builder da outra ferramenta só tem a issue. Coberto na Tarefa 4 (campos "Plano e passo" e "Ferramenta" na issue e o comentário de passagem).

---

### Tarefa 1: renomear os arquivos (harnesses, referências, prompts)

**Arquivos:**
- Renomear com `git mv`: `modelos/agentes/{integradora→lead, produto→product, arquitetura→architect, back-e-dados→backend, design-e-front→frontend, seguranca→security, devops→ops}.md`; o mesmo em `modelos/referencias/` para os que existem; `modelos/prompt-sessao-integradora.md→prompt-lead.md`, `prompt-sessao-trabalhadora.md→prompt-builder.md`, `prompt-coordenadora-orca.md→prompt-lead-orca.md`.
- Modificar: todo arquivo vivo com link para esses caminhos (`command grep -rl` pelos nomes antigos, fora do histórico), `scripts/verificar.mjs` (listas das linhas 60-61, 77, `HARNESSES` da 148, as chaves de `HARNESS_PROPRIO`, das skills por agente na 226 e da parte 5 na 613, e todo `ler('modelos/...')` com nome antigo), `scripts/novo-projeto.sh` e `skills/*/SKILL.md` onde citam os caminhos.

**Interfaces:**
- Produz: `HARNESSES = ['lead', 'architect', 'backend', 'frontend', 'security', 'product', 'ops']`, usado por todas as tarefas seguintes.

- [ ] **Passo 1:** trocar em `scripts/verificar.mjs` os nomes de arquivo e as chaves (`integradora`→`lead`, etc.) e acrescentar `checar('arquivos antigos não existem', [...antigos].every((f) => !existsSync(f)))`.
- [ ] **Passo 2:** `node scripts/verificar.mjs` → falha em "existe modelos/agentes/lead.md" e afins.
- [ ] **Passo 3:** `git mv` dos arquivos e troca dos links e caminhos citados. A worktree de cada especialista (`--name <tema>`) passa a ser o nome novo do arquivo (`--name architect`), porque a verificação da linha 195 casa os dois.
- [ ] **Passo 4:** `node scripts/verificar.mjs` → verde.
- [ ] **Passo 5:** commit `refactor: renomeia harnesses, referências e prompts para os nomes em inglês`.

### Tarefa 2: os nomes dos papéis no texto

**Arquivos:** `nucleo/01` a `05`, `modelos/` (harnesses, prompts, `CLAUDE-projeto.md`, `AGENTS-projeto.md`, `memoria-do-projeto.md`, `issue-tarefa.yml`, `pull_request_template.md`, `nova-tarefa.sh`), `skills/*/SKILL.md`, `cenarios/README.md`, `cenarios/_modelo-cenario.md`, `README.md`, `scripts/novo-projeto.sh`, `scripts/verificar.mjs`.

**Interfaces:**
- Consome: `HARNESSES` da Tarefa 1.
- Produz: `ARQUIVOS_VIVOS` em `verificar.mjs` (todos os `.md`, `.yml`, `.sh` fora de `casos/`, `planos/`, `licoes/`, `decisoes/` e `CHANGELOG.md`).

- [ ] **Passo 1:** acrescentar `checar('nomes antigos dos papéis fora do histórico', ...)` que falha se algum arquivo de `ARQUIVOS_VIVOS` casa `/\b(integradora|integradoras|trabalhadora|trabalhadoras|coordenadora|Back e Dados|Design e Front)\b/i`, listando o arquivo e a linha na mensagem; ajustar os termos esperados que mudam de nome (linha 122 `'integradora','trabalhadora'`→`'Lead','Builder'`; linha 124 `1 integradora e 2 trabalhadoras`→`1 Lead e 2 Builders`; a tabela de agentes do núcleo 02 tem as sete linhas novas; `## Validação da integradora`→`## Validação da Lead`).
- [ ] **Passo 2:** rodar → falha listando os arquivos.
- [ ] **Passo 3:** trocar os nomes trecho a trecho. Concordância: "a Lead", "a Builder", "as Builders"; os especialistas pelo nome (Architect, Backend...). Onde "Segurança", "Produto", "Arquitetura" ou "DevOps" nomeiam o papel, usar o nome novo; onde são o assunto ("revisão de segurança"), manter.
- [ ] **Passo 4:** rodar → verde.
- [ ] **Passo 5:** commit `docs: papéis com os nomes Lead, Product, Architect, Backend, Frontend, Security, Ops e Builders`.

### Tarefa 3: o nome de cada Builder

**Arquivos:** `modelos/agentes/{lead,backend,frontend,ops}.md`, `nucleo/02-sessoes-e-papeis.md` (seção "Com agentes especialistas", item "Worktrees e visibilidade"), `scripts/verificar.mjs`.

- [ ] **Passo 1:** verificações: todo `worker-start` que abre Builder em `backend`, `frontend` e `ops` tem `--name <papel>-<N>-<slug>` e `--display-name "<Papel> Builder #<N> · <resumo> · <ferramenta>"` (com o papel certo em cada harness); todo `worker-start` da Lead que abre um especialista tem `--display-name <Papel>`; o núcleo 02 cita o padrão `Builder #<issue> · <resumo> · <ferramenta>` e diz que a issue é a identidade única.
- [ ] **Passo 2:** rodar → falha.
- [ ] **Passo 3:** acrescentar `--display-name` aos comandos e o padrão no núcleo 02; a branch da Builder no Orca passa de `back/12-login` para `backend/12-login`. O `nova-tarefa.sh` (modo sem Orca) continua com `<feat|fix|chore|docs>`: o nome da Builder vai na issue e no título do PR.
- [ ] **Passo 4:** rodar → verde.
- [ ] **Passo 5:** commit `feat: nome de cada Builder com papel, issue, resumo e ferramenta`.

### Tarefa 4: Codex e Claude no mesmo projeto

**Arquivos:** `nucleo/02` (a seção "Um agente principal por projeto" vira "Lead e ferramenta por papel"; a tabela de agentes ganha a coluna "Ferramenta padrão"), `nucleo/01` (portão da Fase 3), `nucleo/03` (onde citar o agente principal), os sete harnesses (cabeçalho: "Ferramenta: a do seu papel na tabela do `docs/DESENVOLVIMENTO.md`"), `modelos/prompt-lead-orca.md`, `modelos/CLAUDE-projeto.md`, `modelos/AGENTS-projeto.md`, `modelos/memoria-do-projeto.md`, `modelos/issue-tarefa.yml`, `scripts/novo-projeto.sh`, `skills/novo-projeto/SKILL.md`, `skills/consultar/SKILL.md`, `README.md` (adoção), `scripts/verificar.mjs`.

**Interfaces:**
- Produz, no `docs/DESENVOLVIMENTO.md` gerado: a linha `Lead: Claude Code` (ou `Codex` com `--agente codex`) logo depois de `Versão do método:`, e a tabela `| Papel | Ferramenta padrão |` com as sete linhas. A Tarefa 6 lê esse formato.

- [ ] **Passo 1:** trocar as verificações das linhas 104, 134, 138, 169, 180, 453, 462, 467, 485, 576 e 628 de `verificar.mjs`: sem `--agente`, o `DESENVOLVIMENTO.md` tem `Lead: Claude Code` e a tabela com Backend, Security e Ops em Codex e os outros em Claude Code, e não tem mais `Agente principal:`; com `--agente codex`, `Lead: Codex` e as sete linhas em Codex; com `--agente claude`, as sete em Claude Code; os harnesses dizem que a ferramenta vem da tabela e continuam com `--agent <agente> --model <modelo>`; o núcleo 02 cita a passagem por cota (`commit`, `comenta na issue onde parou`, `mesma branch`) e a revisão cruzada ("ao menos uma revisão da outra ferramenta"); a issue tem os campos "Plano e passo" e "Ferramenta"; a memória do projeto anota a ferramenta e as passagens por tarefa; não sobra "nunca as duas" fora do histórico.
- [ ] **Passo 2:** rodar → falha.
- [ ] **Passo 3:** fazer as mudanças. Mantém: o contrato da API primeiro com back e front em paralelo, um dono por pasta e por arquivo comum, o `AGENTS.md` em todo projeto, o ponytail só sob demanda no Codex. Na revisão cruzada, o PR feito no Claude recebe revisão de um agente Codex (a Security nos sensíveis; nos outros, uma sessão Codex de revisão aberta pela Lead). No README, lembrar que o Codex precisa também do engineering e do design.
- [ ] **Passo 4:** rodar → verde.
- [ ] **Passo 5:** commit `feat: Lead no Claude e ferramenta padrão por papel, com passagem por cota e revisão cruzada`.

### Tarefa 5: aprovações por gatilho

**Arquivos:** `nucleo/01` ("Portões de aprovação", portão da Fase 6), `nucleo/02` (ciclo da tarefa, passo 6; "O que não muda"), `modelos/agentes/lead.md`, `modelos/prompt-lead.md`, `modelos/prompt-lead-orca.md`, `modelos/pull_request_template.md`, `modelos/CLAUDE-projeto.md`, `scripts/novo-projeto.sh` (seção `## Aprovações` no `DESENVOLVIMENTO.md`), `skills/consultar/SKILL.md`, `scripts/verificar.mjs`.

- [ ] **Passo 1:** verificações: o núcleo 01 lista os seis gatilhos (por palavras-chave: "o que será construído", "desfazer", "usuários reais", "dinheiro ou muita cota", "aceita um risco", "regras do jogo"), "na dúvida, sobe para a pessoa" e a tabela das duas colunas do desenho; o `DESENVOLVIMENTO.md` gerado tem `## Aprovações` com os seis gatilhos; o harness da Lead confere os gatilhos antes de cada `gh pr merge`, só integra sozinho quando as cinco condições valem e escreve o "resumo por marco"; o modelo de PR tem `Gatilhos de aprovação:` (nenhum, ou quais); a verificação da linha 131 (`'pode integrar'`) passa a aceitar "pode integrar" só como resposta da pessoa quando há gatilho.
- [ ] **Passo 2:** rodar → falha.
- [ ] **Passo 3:** escrever com o texto do desenho. O `gate-create` do Orca continua para o que tem gatilho; o resto a Lead decide e registra na issue ou na memória.
- [ ] **Passo 4:** rodar → verde.
- [ ] **Passo 5:** commit `feat: aprovações por gatilho, com a Lead decidindo o que não tem impacto grande`.

### Tarefa 6: `/metodo:atualizar-projeto` leva projetos 3.x para a 4.0.0

**Arquivos:** `skills/atualizar-projeto/SKILL.md`, `scripts/verificar.mjs`.

**Interfaces:**
- Consome: o formato `Lead:` e a tabela da Tarefa 4; a seção `## Aprovações` da Tarefa 5; os nomes de arquivo da Tarefa 1.

- [ ] **Passo 1:** verificações: a skill descreve as duas exceções à regra "só acrescentar" (renomear `docs/agentes/<antigo>.md` para o nome novo com `git mv`, mantendo o conteúdo e listando a diferença para o modelo novo para a pessoa decidir; trocar a linha `Agente principal:` pela linha `Lead:` e a tabela); acrescenta `## Aprovações` se faltar; o Passo 4 da skill permite essas remoções no `git diff`; a tabela de mapeamento dos sete nomes antigos para os novos está na skill.
- [ ] **Passo 2:** rodar → falha.
- [ ] **Passo 3:** escrever na skill, seguindo o formato das linhas atuais da tabela do Passo 3.
- [ ] **Passo 4:** rodar → verde.
- [ ] **Passo 5:** commit `feat: atualizar-projeto renomeia os harnesses e troca o agente principal pela Lead`.

### Tarefa 7: decisão 013, versão 4.0.0 e registros

**Arquivos:** criar `decisoes/013-lead-e-builders-com-codex-e-claude.md` (do `_modelo-decisao.md`, com Contexto, Decisão, "Escolhas da sessão do método" e Consequências, como a 010); modificar o **Status** das decisões 001, 007, 008 e 010 (uma linha: "nomes e/ou regra substituídos em parte pela decisão 013, com o link"), `CHANGELOG.md` (seção 4.0.0), `VERSION` (`4.0.0`), `README.md` (quadro dos papéis e o passo a passo), o desenho (Status: implementado, com o link da 013), `scripts/verificar.mjs`.

- [ ] **Passo 1:** verificações: existe a decisão 013 com status aceita e "sem caso real"; as decisões 001, 007, 008 e 010 apontam para a 013; `VERSION` é `4.0.0` e o `CHANGELOG.md` tem `## 4.0.0`.
- [ ] **Passo 2:** rodar → falha.
- [ ] **Passo 3:** escrever. A 013 registra o que a pessoa decidiu (nomes, nome das Builders, Lead no Claude, tabela, planejamento confirmado, aprovações por gatilho) separado das escolhas da sessão, e o que observar no primeiro projeto (passagens, revisão cruzada, cota, uso dos nomes, decisões da Lead revertidas pela pessoa).
- [ ] **Passo 4:** rodar → verde.
- [ ] **Passo 5:** commit `docs: decisão 013 e versão 4.0.0`.

### Tarefa 8: verificação final e PR

- [ ] **Passo 1:** `superpowers:verification-before-completion`: `node scripts/verificar.mjs` verde; `scripts/novo-projeto.sh` numa pasta temporária, sem e com `--agente codex` e com `--especialistas`, e leitura do `DESENVOLVIMENTO.md` e de `docs/agentes/` gerados; `command grep -rn` pelos nomes antigos fora do histórico mostra nada.
- [ ] **Passo 2:** revisão do ramo inteiro com contexto limpo (`superpowers:requesting-code-review`).
- [ ] **Passo 3:** com a confirmação da pessoa, `git push -u origin feat/lead-e-builders-com-codex-e-claude` e o PR com o modelo; integrar só com o "pode integrar" dela (`gh pr merge N --merge`, sem apagar a branch), conferir o CI da `main`, criar a tag `v4.0.0` se ela pedir, como nas versões anteriores.
