# Agentes especialistas ao lado da integradora: plano de implementação

> **Para quem executa:** use `superpowers:executing-plans` para seguir este plano tarefa por tarefa. Os passos usam caixas (`- [ ]`) para acompanhar.

**Objetivo:** o método ganha um modo novo, em `rascunho`: a integradora trabalha com especialistas por tema, cada um com um harness escrito com a pessoa, coordenando as próprias trabalhadoras no Orca.

**Arquitetura:** os harnesses são documentos em `modelos/agentes/`, copiados para `docs/agentes/` do projeto quando ele escolhe o modo. O `scripts/verificar.mjs` confere a forma de cada harness (as 10 partes, o modelo, as regras fixas) antes de ele ser escrito. O núcleo, as skills e o `novo-projeto.sh` passam a oferecer o modo.

**Ferramentas:** Markdown, Bash (`novo-projeto.sh`), Node sem dependências (`verificar.mjs`), Orca 1.4.241, Codex 0.164.

**Spec:** [desenho](2026-10-28-agentes-especialistas-desenho.md).

## Restrições globais

- Branch `feat/agentes-especialistas` (já existe, com o desenho). Nunca commit na `main`, nunca `push --force`. Push e PR só com a confirmação da pessoa; integra só com o "pode integrar", com `gh pr merge N --merge`, sem apagar a branch.
- Tudo é `rascunho`, aprovado pela pessoa sem caso real. Versão final `2.6.0`.
- **Cada harness só é commitado depois da aprovação da pessoa no chat.** A sessão apresenta o rascunho, ajusta e espera o "aprovado" antes do próximo.
- Toda verificação nova em `scripts/verificar.mjs` é escrita antes e vista falhar.
- Nomes dos arquivos: `modelos/agentes/_modelo-harness.md`, `integradora.md`, `arquitetura.md`, `back-e-dados.md`, `design-e-front.md`, `seguranca.md`, `produto.md`, `devops.md`.
- Modelos: agentes Claude com `--model claude-opus-5-5`; agentes Codex com `--model gpt-6.1-sol`; todo `worker-start` passa `--model` e `--effort`.
- Os harnesses vão para dentro dos projetos: **sem links relativos** para arquivos do método (o caminho vai entre crases), sem caminhos de pasta do computador e sem dado pessoal.
- Nada é executado em projetos de produto. O teste da Tarefa 1 roda num repositório descartável, com a autorização da pessoa.

## Foco da revisão

1. **Harness sem as regras fixas:** um harness de especialista ou trabalhadora que não diga "nunca integra" e não mande subir a decisão é recusado pelo verificador.
2. **Ferramenta trocada:** um harness Codex com `claude-opus-5-5`, ou que mande ler só o `CLAUDE.md`, é recusado; o mesmo para o Claude com `gpt-6.1-sol`.
3. **Projeto sem o modo:** o `novo-projeto.sh` sem `--especialistas` não cria `docs/agentes/` (quem não escolhe o modo continua como antes).
4. **Nada sobrescrito:** com `docs/agentes/` já existente, o `novo-projeto.sh --especialistas` recusa sem alterar nada, como faz com os outros arquivos.
5. **Precedência:** todo harness traz a seção "O harness manda" com a ordem de precedência e a regra de não desviar.

---

### Tarefa 1: testar o aninhamento no Orca

Responde ao item "A conferir" do desenho: um especialista consegue iniciar as próprias trabalhadoras, e elas aparecem penduradas nele no painel?

- [ ] Pedir a autorização da pessoa: o teste registra um repositório descartável no Orca e abre dois agentes Claude com esforço baixo (gasta um pouco de cota).
- [ ] Criar o repositório descartável na pasta temporária da sessão (`git init`, um commit) e registrá-lo com `orca repo add --path <pasta>`.
- [ ] Da sessão atual, como coordenadora: `orca orchestration run-create --objective "teste de aninhamento"` e `worker-start --agent claude --model claude-opus-5-5 --effort low --worktree new-top-level --spec "<pedido: crie uma tarefa filha e inicie uma trabalhadora com worker-start --parent <sua tarefa> --worktree new-child; ela só responde 'ok' com send --type worker_done --outcome succeeded>"`.
- [ ] Conferir com `orca orchestration task-list --json` e `worker-list --json`: a tarefa da trabalhadora tem `parent` igual à do especialista? Pedir à pessoa para olhar o painel e dizer se aparece pendurada.
- [ ] Conferir para onde vai um `ask` da trabalhadora: para o especialista (Run filha) ou para a coordenadora.
- [ ] Liberar os agentes (`worker-release`), remover as worktrees (`orca worktree rm`), tirar o repositório do Orca e apagar a pasta descartável (listar antes de apagar).
- [ ] Registrar o resultado no desenho (seção "A conferir antes de escrever os harnesses"): o que funcionou e o que vale no lugar, se não funcionou (a integradora inicia a trabalhadora com `--parent` do especialista).
- [ ] Commit: `docs: resultado do teste de aninhamento no Orca`.

### Tarefa 2: verificador dos harnesses (visto falhar)

**Arquivos:** modificar `scripts/verificar.mjs` (nova seção depois das verificações do prompt da coordenadora, perto da linha 125).

**Produz:** `const HARNESS_PARTES` (os 10 títulos), `const HARNESSES` (nome → `'claude' | 'codex'`) e `function checarHarness(nome, ferramenta)`, usados pelas Tarefas 3 a 8.

- [ ] Escrever `HARNESS_PARTES = ['## 1. Missão', '## 2. Quando é chamado', '## 3. O que lê', '## 4. O que pode e o que não pode', '## 5. Skills', '## 6. Checklist do tema', '## 7. Formato da resposta', '## 8. Quando sobe a decisão', '## 9. Memória do tema', '## 10. Economia']`.
- [ ] Escrever as verificações do modelo `modelos/agentes/_modelo-harness.md`: existe; tem as 10 partes em ordem; tem a seção `## O harness manda` com as palavras `precedência` e `não desvia`; cita `claude-opus-5-5`, `gpt-6.1-sol` e `--effort`.
- [ ] Escrever `checarHarness(nome, ferramenta)`, que confere em `modelos/agentes/<nome>.md`:
  - existe; as 10 partes em ordem; `**Maturidade:** rascunho`; `**Ferramenta:**`; `**Esforço:**`; `## O harness manda`;
  - `claude` → `claude-opus-5-5` e `CLAUDE.md`; `codex` → `gpt-6.1-sol` e `AGENTS.md`; nunca o modelo da outra ferramenta;
  - `superpowers:verification-before-completion`;
  - `integradora` → `gh pr merge` e `gate-create`; os outros → `/nunca integra/i` e `orca orchestration`;
  - sem links relativos (`](` seguido de algo que não comece com `http`).
- [ ] Começar com `HARNESSES = { integradora: 'claude' }` e chamar `checarHarness` para cada item.
- [ ] Rodar `node scripts/verificar.mjs`. Esperado: falham as verificações do modelo e da integradora (os arquivos não existem); nada mais.
- [ ] Commit: `test: verificações dos harnesses (vistas falhar)`.

### Tarefa 3: modelo comum e harness da integradora

**Arquivos:** criar `modelos/agentes/_modelo-harness.md` e `modelos/agentes/integradora.md`.

- [ ] Escrever o modelo: cabeçalho (Agente, Ferramenta, Modelo, Esforço, Presença, Maturidade), a seção `## O harness manda` (precedência: harness → projeto → Skills e método → o que consultou ou sabe; não desvia, para e sobe; as regras fixas do método) e as 10 partes, cada uma com uma linha do que preencher. A parte 10 traz as 6 regras de economia do desenho.
- [ ] Escrever o rascunho da integradora a partir do desenho: missão (coordenar, abrir issues, validação final, integrar), gatilhos, o que lê, o que pode (portões, `gh pr merge N --merge`, iniciar os especialistas com `worker-start --agent <claude|codex> --model <...> --effort <...>`), o que não pode, Skills, checklist da validação final (o checklist atual do `modelos/prompt-coordenadora-orca.md`, ciclo 3), formato do que pede aos especialistas, quando sobe para a pessoa, memória do projeto, economia. Absorve as regras do prompt da coordenadora que valem no modo com especialistas.
- [ ] Apresentar os dois à pessoa e ajustar até o "aprovado".
- [ ] Rodar `node scripts/verificar.mjs`. Esperado: verde.
- [ ] Commit: `feat: modelo comum do harness e harness da integradora`.

### Tarefas 4 a 8: um harness por vez

Cada tarefa segue os mesmos passos:

- [ ] Acrescentar o agente em `HARNESSES` e as verificações próprias dele (lista abaixo); rodar o verificador e ver falhar só as dele.
- [ ] Decidir com a pessoa o ponto em aberto do agente (lista abaixo).
- [ ] Escrever o rascunho a partir do modelo e do desenho; apresentar; ajustar até o "aprovado".
- [ ] Rodar `node scripts/verificar.mjs`. Esperado: verde.
- [ ] Commit: `feat: harness de <agente>`.

| Tarefa | Agente | Ferramenta | Verificações próprias | Em aberto, decidir com a pessoa |
|---|---|---|---|---|
| 4 | `arquitetura` | claude | `contrato da API`; `portão` | o escopo além de arquitetura de software |
| 5 | `back-e-dados` | codex | `worker-start`, `--parent`, `--worktree new-child`; `contrato da API` | — |
| 6 | `design-e-front` | claude | `worker-start`, `--parent`, `--worktree new-child`; `design system` | — |
| 7 | `seguranca` | codex | `mapa de riscos`; `entrega a correção`; `aprovar com ressalva` | trabalhadoras para uma pasta própria de testes de segurança |
| 8 | `produto` e `devops` | claude e codex | `produto`: `critérios de aceite`; `devops`: `worker-start`, `--parent`, `portão` | `produto`: trabalhadoras de pesquisa; `devops`: dono do CI quando ativo; limite de 1 trabalhadora por vez (proposta da sessão) |

### Tarefa 9: projeto gerado com o modo

**Arquivos:** modificar `scripts/novo-projeto.sh`, `scripts/verificar.mjs` (bloco do `novo-projeto.sh`, perto da linha 290), `modelos/CLAUDE-projeto.md`, `modelos/AGENTS-projeto.md`, `modelos/memoria-do-projeto.md`.

**Interface:** `scripts/novo-projeto.sh <pasta> [--especialistas] [cenario ...]`. A opção pode vir em qualquer posição depois da pasta.

- [ ] Escrever as verificações:
  - sem a opção, `docs/agentes/` não existe;
  - com `--especialistas`, `docs/agentes/` tem os 7 harnesses, sem o `_modelo-harness.md`, iguais aos do método;
  - com `docs/agentes/` já existente, o script falha, avisa e não altera nada;
  - o `DESENVOLVIMENTO.md` gerado com a opção cita `docs/agentes/`;
  - o `CLAUDE.md` e o `AGENTS.md` gerados citam `docs/agentes/`;
  - a memória gerada tem a coluna de consumo (`consumo`).
- [ ] Rodar o verificador e ver falhar só essas.
- [ ] Implementar no script: separar `--especialistas` dos cenários; incluir `docs/agentes` na conferência de conflitos; copiar `modelos/agentes/*.md` sem os que começam com `_`; uma linha a mais no `DESENVOLVIMENTO.md` quando a opção vem.
- [ ] Atualizar os modelos: o `CLAUDE-projeto.md` e o `AGENTS-projeto.md` dizem que, no modo com especialistas, cada agente lê primeiro o seu harness em `docs/agentes/` e atua dentro dele. A memória ganha o consumo por tarefa (`#N · agente · retrabalho · consumo`).
- [ ] Rodar `node scripts/verificar.mjs`. Esperado: verde.
- [ ] Commit: `feat: novo-projeto.sh com o modo de especialistas`.

### Tarefa 10: núcleo, skills e README

**Arquivos:** `nucleo/02-sessoes-e-papeis.md`, `nucleo/01-fluxo-de-ponta-a-ponta.md`, `modelos/prompt-coordenadora-orca.md`, `skills/novo-projeto/SKILL.md`, `skills/atualizar-projeto/SKILL.md`, `skills/consultar/SKILL.md`, `README.md`, `scripts/verificar.mjs`.

- [ ] Escrever as verificações:
  - `02` tem `### Com agentes especialistas` com `docs/agentes/`, `--parent`, `O harness manda` e o limite de 9 sessões;
  - a Fase 3 do `01` oferece o modo com especialistas;
  - o prompt da coordenadora aponta para `integradora.md`;
  - `novo-projeto` oferece `--especialistas`;
  - `atualizar-projeto` copia `docs/agentes/` que falta;
  - `consultar` aponta para a subseção;
  - o README cita o modo e `modelos/agentes/`.
- [ ] Rodar o verificador e ver falhar só essas.
- [ ] Escrever a subseção do `02` (resumo do desenho: papéis, fluxo, worktrees, precedência, limites, o que observar) e ajustar os outros arquivos.
- [ ] Rodar `node scripts/verificar.mjs`. Esperado: verde.
- [ ] Commit: `feat: modo com agentes especialistas no núcleo e nas skills`.

### Tarefa 11: decisão, caso, versão e PR

- [ ] Verificações: `decisoes/008-agentes-especialistas.md` em `OBRIGATORIOS`; `VERSION` igual a `2.6.0` e seção `## 2.6.0` no `CHANGELOG.md`. Ver falhar.
- [ ] Escrever a decisão 008 a partir do modelo, ligando o desenho, este plano e a lista de arquivos alterados. Acrescentar a linha no caso do repositório do método. Escrever a seção 2.6.0 do `CHANGELOG.md`, `VERSION` → `2.6.0`, e passar o status do desenho para "aceito".
- [ ] Rodar `node scripts/verificar.mjs`. Esperado: verde. Ler o resultado inteiro (`superpowers:verification-before-completion`).
- [ ] Commit: `docs: decisão 008, caso e versão 2.6.0`.
- [ ] `superpowers:finishing-a-development-branch`: com a confirmação da pessoa, push e PR com o modelo preenchido; CI "Verificar o método" verde; integrar só com o "pode integrar".
