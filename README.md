# Método de desenvolvimento com Claude Code

Um método para construir sites, aplicações e soluções tecnológicas com o Claude Code de forma organizada: **alvo definido antes de construir, testes em duas camadas, uma branch por mudança, validação independente e o humano decidindo o que importa**. Ele nasceu de um projeto real (um portfólio com animações, vídeos, CI e várias sessões em paralelo), inclui os erros que cometemos e **cresce a cada projeto**.

Este repositório é **independente de qualquer projeto**. Versão atual: veja [VERSION](VERSION) e o [registro de mudanças](CHANGELOG.md).

## Os 7 princípios

1. **Alvo antes de construir.** Entenda a intenção, escreva de volta o que entendeu e só então desenhe. Se o pedido cita um título, um nome ou uma referência, ache exatamente aquilo; se não bater, pergunte antes de implementar.
2. **Quem constrói não é quem valida.** Quem implementa entrega com os testes verdes. Outra sessão (a integradora) refaz tudo e **explora** o resultado contra o pedido. "CI verde" não prova que a coisa certa foi feita.
3. **Teste primeiro, em duas camadas (micro e macro).** O teste é escrito e visto falhar antes do código (micro). A suíte inteira, o build, os tipos e a exploração da página inteira fecham o trabalho (macro).
4. **Uma mudança, uma branch; a `main` sempre estável.** Toda mudança entra por Pull Request com a verificação automática verde. Nada de commit direto na `main`.
5. **A Skill certa para cada cenário.** Brainstorming antes de criar, TDD para implementar, depuração sistemática para bugs, verificação antes de dizer "pronto". Vale para todas as sessões.
6. **Evidência antes de afirmação.** Rode o comando, leia a saída, meça no navegador. "Deveria funcionar" não é resultado.
7. **O humano decide o que é externo, irreversível ou ambíguo.** Publicar, integrar, apagar, reescrever histórico, mudar contas e interpretar um pedido confuso passam por uma pessoa.

## Como ler

O repositório tem três camadas, com ritmos diferentes:

| Camada | Onde | O que é | Muda quanto |
|---|---|---|---|
| **Núcleo** | `nucleo/` | O método base | Raramente |
| **Cenários** | `cenarios/` | Como o método se adapta a cada tipo de projeto | Cresce: um arquivo por tipo |
| **Casos e lições** | `casos/`, `licoes/`, `decisoes/` | O que aconteceu de verdade e por que as regras mudaram | Sempre |

### Núcleo

| Documento | Para que serve |
|---|---|
| [01 · Fluxo de ponta a ponta](nucleo/01-fluxo-de-ponta-a-ponta.md) | As fases da ideia à manutenção e ao fechamento, com portões de aprovação |
| [02 · Sessões e papéis](nucleo/02-sessoes-e-papeis.md) | Uma sessão ou várias; integradora e trabalhadoras |
| [03 · Skills e testes](nucleo/03-skills-e-testes.md) | Qual Skill usar em cada cenário; testes micro e macro; verificação no navegador |
| [04 · Referências e engenharia reversa](nucleo/04-referencias-e-engenharia-reversa.md) | Como estudar um site ou app de referência e quando usar engenharia reversa |
| [05 · Git, GitHub e CI](nucleo/05-git-github-e-ci.md) | Branches, PRs, verificação automática, proteção da `main`, worktrees |

### Camadas que crescem

| Pasta | Conteúdo |
|---|---|
| [cenarios/](cenarios/README.md) | Um arquivo por tipo de projeto (site, aplicação web, API, mobile, automação, infraestrutura, biblioteca, IA), com selo de maturidade, skills úteis e checklist |
| [casos/](casos/_modelo-caso.md) | Uma retrospectiva por projeto realizado: o que funcionou, o que falhou, medidas |
| [licoes/](licoes/_indice.md) | Uma lição por arquivo: o que aconteceu, a causa, a regra |
| [decisoes/](decisoes/_modelo-decisao.md) | Por que uma regra do método mudou |
| [modelos/](modelos/) | O que se copia para um projeto: formulário de tarefa, modelo de PR, CI, scripts de worktree, prompts e gabaritos |
| `scripts/` | `verificar.mjs` (confere o próprio método), `gerar-indice-licoes.mjs` e `novo-projeto.sh` |

## Visão em uma página

```text
Ideia ──► Alvo (Fase 0-2) ──► Plano (3) ──► Construir com TDD (4) ──► Validar (5) ──► Integrar (6) ──► Publicar (7) ──► Manter (8) ──► Fechar (9)
            │  humano aprova      │ humano      │ trabalhadora          │ integradora    │ humano       │ humano                    │ caso + lições
            │  o desenho          │ aprova      │ micro + macro         │ micro + macro  │ autoriza     │ autoriza                  ▼
            ▼                     ▼             ▼                       ▼                ▼              ▼                    o método aprende
        spec / critérios      tarefas       branch + PR + CI        navegador/exploração   merge na main   deploy
```

## Adotar em um projeto novo

Tempo estimado: cerca de 30 minutos.

1. Crie o repositório do projeto e a `main`; faça o primeiro commit com um `README` e o `.gitignore` (veja a higiene de dados em [05](nucleo/05-git-github-e-ci.md)).
2. Rode o script que prepara tudo, escolhendo os cenários que se aplicam:
   ```bash
   scripts/novo-projeto.sh <pasta-do-projeto> site-estatico
   ```
   Ele copia o formulário de tarefa, o modelo de PR, o CI e os scripts de worktree, e cria `docs/DESENVOLVIMENTO.md` e `docs/memoria-do-projeto.md` carimbados com a versão do método. Nunca sobrescreve nada.
   Se um cenário escolhido ainda é `rascunho`, o script avisa (sem interromper) e o `DESENVOLVIMENTO.md` registra a maturidade de cada cenário: trate um rascunho como hipótese, não como regra.
3. Dê o primeiro push da `main`, deixe o CI rodar uma vez e **depois** ative a proteção da `main` e crie as etiquetas (comandos em [05](nucleo/05-git-github-e-ci.md)). Em repositório privado, a proteção exige plano pago; o 05 diz o que fazer sem ela.
4. Preencha os comandos do projeto no `docs/DESENVOLVIMENTO.md` e ajuste o CI para a sua stack.
5. Defina o **alvo** da primeira entrega com [modelo-spec.md](modelos/modelo-spec.md) e [modelo-criterios-de-aceite.md](modelos/modelo-criterios-de-aceite.md).
6. Abra a primeira issue com o formulário de tarefa e comece pela Fase 0 de [01](nucleo/01-fluxo-de-ponta-a-ponta.md).

## Como este repositório cresce

1. **Cada projeto termina com a Fase 9** ([01](nucleo/01-fluxo-de-ponta-a-ponta.md)): um caso registrado, lições novas, ajustes nos cenários e, se uma regra mudou, uma decisão.
2. **Nada entra sem um caso real.** Opinião sem evidência fica de fora.
3. **Toda mudança entra por Pull Request**, com `node scripts/verificar.mjs` verde no CI. O método usa o próprio método.
4. **Cenários têm selo de maturidade** (`rascunho`, `testado em 1 projeto`, `estável`) e só sobem com um caso.
5. **Versionamento:** `VERSION` e [CHANGELOG](CHANGELOG.md); maior quando muda a estrutura ou uma regra do núcleo, menor para conteúdo novo, correção para ajustes de texto.
6. **Uma sessão do Claude Code dedicada** mantém este repositório: o [CLAUDE.md](CLAUDE.md) traz as regras e o [prompt inicial](modelos/prompt-sessao-do-metodo.md) abre a sessão.

## Convenções

- Idioma: português nos documentos e nos commits; nomes de Skills, comandos e código ficam como são.
- Nomes de branch: `feat/`, `fix/`, `chore/`, `docs/` + um *slug* em minúsculas com hifens.
- Commits em Conventional Commits (`feat: ...`, `fix: ...`).
- As branches integradas **ficam** no GitHub ([decisão 003](decisoes/003-branches-integradas-ficam-no-github.md)).
- Verificador: `node scripts/verificar.mjs` confere estrutura, links, lições, cenários, scripts e a ausência de dados pessoais.
