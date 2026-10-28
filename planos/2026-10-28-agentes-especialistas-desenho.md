# Agentes especialistas ao lado da integradora: desenho

**Data:** 2026-10-28
**Status:** desenho para aprovação da pessoa; depois dele vem o plano de implementação
**Caso de origem:** nenhum. Como as decisões 006 e 007, entra **aprovado pela pessoa sem caso real** e tudo fica como `rascunho` até o primeiro projeto feito assim virar caso.

## Intenção

Hoje, no modo Orca, tudo passa por uma sessão só: a integradora (a coordenadora). Ela planeja, responde todas as dúvidas das trabalhadoras, revisa o back e o front, cuida do contrato e integra. A pessoa quer tirar esse peso dela com **agentes especialistas por tema**, cada um com um **harness** próprio, escrito por nós: o contexto, as regras e os limites que fazem dele um especialista de verdade, e não um agente genérico.

O modelo continua o mesmo (integradora e trabalhadoras), com uma camada no meio:

```text
Pessoa
 └─ Integradora (Claude): a Run principal; a única que fala com a pessoa e a única que integra
     ├─ Arquitetura (Claude)
     ├─ Back e Dados (Codex) ── trabalhadoras Codex
     ├─ Design e Front (Claude) ── trabalhadoras Claude
     ├─ Segurança (Codex)
     ├─ Produto (Claude), sob demanda
     └─ DevOps (Codex), sob demanda
```

**Critério de sucesso** (herdado da 007 e do pedido): a integradora gasta menos contexto e cota, as dúvidas de tema são respondidas por quem entende do tema, e não há mais retrabalho do que hoje.

## Objetivos

1. Um **modelo comum de harness** (9 partes, abaixo) e um harness escrito para **cada um dos 7 papéis**, a integradora inclusive.
2. Os especialistas **coordenam as próprias trabalhadoras** no Orca (Run filha), em vez de a integradora distribuir tudo.
3. **Rastro completo** de cada item do projeto: issue, tarefa no Orca, worktree, branch e PR ligados pelo tema e pelo número da issue.
4. O tema decide a ferramenta, para o especialista e para as trabalhadoras dele.

## Fora do escopo

- **QA como agente:** fica com a integradora, como hoje. Volta se um caso mostrar a integradora sobrecarregada na validação.
- **Manutenção como agente:** é a Fase 8. Um bug vai para o especialista dono do tema dele.
- Cenário de ERP (decisão da pessoa).
- Mudar o modo sem Orca (sessões abertas à mão): continua como está.

## Não pode acontecer (anti-objetivos)

- Um especialista ou uma trabalhadora **integrar** na `main`, ou falar direto com a pessoa.
- Duas tarefas abertas tocarem o mesmo arquivo porque dois especialistas não se enxergam.
- O ida e volta entre agentes custar mais do que a integradora responder sozinha.
- Um agente Codex trabalhar sem as regras do método (sem `AGENTS.md` ou sem o harness).

## Os agentes

| Agente | Áreas | Ferramenta | Trabalhadoras | Presença |
|---|---|---|---|---|
| **Integradora** | coordenação, validação final (o QA), integração | Claude | — | sempre |
| **Arquitetura** | estrutura técnica, integração entre componentes, escalabilidade, **contrato da API** | Claude | não | sempre |
| **Back e Dados** | regras de negócio, APIs, autenticação, processamento, banco de dados | Codex | Codex | sempre |
| **Design e Front** | UX/UI, protótipos, design system, interface | Claude | Claude | sempre |
| **Segurança** | AppSec: aplicação, dados, APIs, infraestrutura | Codex | não | sempre |
| **Produto** | product management e UX research | Claude | não | sob demanda (Fases 0 a 2) |
| **DevOps** | servidores, cloud, deploy, CI/CD, monitoramento | Codex | Codex | sob demanda |

Decidido pela pessoa: os agrupamentos (Design com Front, Back com Banco de Dados, Segurança separada, QA fora), a ferramenta de cada um, os quatro fixos (Arquitetura, Back, Front, Segurança), que cada especialista pode ter as suas trabalhadoras e que a Segurança **entrega a correção** ao especialista dono da pasta e só confere depois.

## O modelo comum do harness

Todo harness tem estas 9 partes, nesta ordem:

1. **Missão:** o tema, o que é dele e o que não é.
2. **Quando é chamado:** os gatilhos (fase do fluxo, tipo de PR, tipo de dúvida).
3. **O que lê:** o contexto fixo do projeto (`CLAUDE.md` ou `AGENTS.md`, `docs/DESENVOLVIMENTO.md`, `docs/memoria-do-projeto.md`, contrato) e o do tema; referências oficiais do tema.
4. **O que pode e o que não pode:** permissões, pastas, comandos; o que nunca faz.
5. **Skills:** as que usa e quando.
6. **Checklist do tema:** como trabalha e como revisa.
7. **Formato da resposta:** o que devolve a quem chamou. Resumo curto com um veredito e os achados por gravidade; o detalhe vai no comentário do PR ou na issue, para não encher o contexto da integradora.
8. **Quando sobe a decisão:** o que não decide sozinho e para quem sobe.
9. **Memória do tema:** um arquivo do projeto com as decisões do tema (por exemplo, os riscos aceitos na Segurança).

## Como o fluxo funciona no Orca

Conferido no Orca 1.4.241 da pessoa (ajuda do CLI, só leitura): `worker-start --parent <tarefa>`, `--worktree new-child`, `--agent claude|codex`, coordenadoras aninhadas com caixa de mensagens própria (Run filha) e grupos de mensagem (`@codex`, `@worktree:<id>`).

1. A integradora cria a Run do projeto e inicia os especialistas fixos com `worker-start`, cada um com o seu agente e o harness.
2. O especialista que constrói (Back e Dados, Design e Front, DevOps) abre as **suas** trabalhadoras com `worker-start --parent <tarefa dele> --worktree new-child`, uma por issue.
3. A trabalhadora pergunta com `ask`; a pergunta chega ao **especialista** que a iniciou. Ele responde com `reply`. Só sobe para a integradora o que ele não pode decidir (item 8 do harness).
4. A trabalhadora termina com o PR aberto e o CI verde. O especialista revisa o tema e avisa a integradora (`worker_done` ou `merge_ready`).
5. A Segurança também atua **no começo**: nas Fases 2 e 3 mapeia os riscos do projeto (o que proteger, de quem, por onde), para evitar falhas futuras; o mapa vai para a memória do tema e vira critérios de aceite nas issues (decidido pela pessoa).
6. Se o PR toca o tema da Segurança, a integradora (ou o especialista) chama a Segurança. Achou falha: ela registra na issue ou no PR e **entrega a correção** ao especialista dono da pasta; depois confere a correção.
7. A integradora faz a validação final (testes, navegador, critérios de aceite), cria o portão do merge e integra com o "pode integrar" da pessoa.

**Quem abre a issue:** a integradora, como hoje (a issue é a fila e o registro), com a etiqueta do tema; o especialista decide como executar e, se precisar dividir, pede à integradora as issues filhas.

**Portões:** só a integradora cria e resolve portões, porque só ela fala com a pessoa. O especialista que precisa de uma decisão da pessoa sobe a pergunta para ela.

**A conferir antes de escrever os harnesses (primeira tarefa do plano):** se um agente iniciado por `worker-start` consegue, ele mesmo, iniciar as suas trabalhadoras (Run filha). A ajuda do CLI cita coordenadoras aninhadas, mas não testamos. Se não conseguir, o especialista pede à integradora que inicie a trabalhadora com `--parent` dele, e as dúvidas continuam indo para ele por `send --to`.

**Requisito: toda sessão visível e correlacionada no Orca** (decidido pela pessoa). Cada sessão, especialista ou trabalhadora, é um agente do Orca, nunca um subagente interno do Claude Code ou do Codex (esses não aparecem no painel). No Orca, cada uma fica pendurada em quem a iniciou (integradora → especialista → trabalhadora, por `--parent`) e ligada à issue do trabalho.

**Worktrees separadas onde faz sentido** (proposta da sessão do método, dentro do requisito): a worktree acompanha a **unidade de trabalho** (uma issue, uma branch), não a sessão. Quem só coordena ou revisa entra na worktree do trabalho que está olhando (`worker-start --worktree issue:<N>` ou `branch:<branch>`, que abre um terminal novo numa worktree que já existe).

| Sessão | Onde trabalha |
|---|---|
| Integradora | a pasta principal do projeto, na `main` |
| Trabalhadora | a worktree da issue dela, com a branch criada a partir da `origin/main` (`--base-branch`); a única que escreve ali |
| Especialista que coordena (Back e Dados, Design e Front, DevOps) | sem worktree própria: coordena da pasta principal, só lendo, e entra na worktree da trabalhadora para revisar o PR |
| Segurança | entra na worktree do PR que revisa, só para ler e rodar verificações |
| Arquitetura e Produto | uma worktree por documento que mudam (contrato, spec), como qualquer tarefa |

**Regra:** numa mesma worktree, só a dona da tarefa escreve; as outras sessões só leem. Assim cada worktree reúne, no Orca, quem construiu, quem revisou e quem conferiu aquele item.

**Rastro de cada item:** issue `#N` → tarefa no Orca (`--parent` do especialista, `--display-name` com o tema) → worktree `<tema>-<N>-<slug>` → branch `<tema>/<N>-<slug>` → PR com `Closes #N`. A memória do projeto anota, por tarefa, o especialista, o agente, se houve retrabalho e por quê.

## Propriedade de arquivos

- Cada especialista que constrói tem as **suas pastas** (decididas na Fase 2 e registradas no `docs/DESENVOLVIMENTO.md`). As trabalhadoras dele só tocam essas pastas.
- **Arquitetura** passa a ser dona do contrato da API e dos documentos de arquitetura (antes eram arquivos comuns da coordenadora). Mudar o contrato continua exigindo um portão da pessoa.
- **Integradora** fica com os arquivos comuns que sobram: CI, dependências da raiz, memória do projeto.
- **Segurança, Arquitetura e Produto** não mexem em código de produto.

## Limite de sessões

Proposta inicial (escolha da sessão do método, a medir no primeiro caso): a integradora, os 4 fixos e até 2 trabalhadoras de Back e Dados e até 2 de Design e Front ao mesmo tempo (pico de 9 sessões). Produto e DevOps abrem e fecham com a fase deles. Isso substitui, no modo com especialistas, o limite de "1 coordenadora e até 3 agentes".

## Onde ficam os harnesses

- No método: `modelos/agentes/<agente>.md`, um por papel, mais `modelos/agentes/_modelo-harness.md` com as 9 partes.
- No projeto: copiados para `docs/agentes/` pelo `novo-projeto.sh` e pela skill `atualizar-projeto`, só quando o projeto escolhe o modo com especialistas na Fase 3.
- O harness da integradora substitui o prompt da coordenadora no modo com especialistas; o prompt atual continua valendo para o modo Orca sem especialistas.
- Como o agente carrega o harness: o `--spec` do `worker-start` manda ler `docs/agentes/<agente>.md` antes de tudo. **A conferir no plano:** se o Codex 0.164 tem um jeito próprio de carregar um perfil de agente (não achei no `codex --help`) e se vale um `AGENTS.md` aninhado na pasta do back.

## Ordem de criação

Um harness por vez, nesta ordem, cada um aprovado pela pessoa antes do próximo:

1. Modelo comum e **Integradora** (todo o fluxo passa por ela e o harness dela define como os outros são chamados).
2. **Arquitetura**.
3. **Back e Dados**.
4. **Design e Front**.
5. **Segurança**.
6. **Produto** e **DevOps**.

Depois: núcleo `02` (subseção nova em "Com o Orca"), decisão 008, `novo-projeto.sh`, skills `novo-projeto`, `atualizar-projeto` e `consultar`, verificações em `scripts/verificar.mjs` (escritas antes e vistas falhar), caso do repositório do método, `CHANGELOG.md` e `VERSION`.

## Escolhas da sessão do método (a pessoa confere ao aprovar)

- Produto e DevOps sob demanda; os demais sempre ativos.
- A Arquitetura não tem trabalhadoras: o contrato e os documentos dela são escritos por ela mesma, numa branch e num PR próprios.
- O limite de 9 sessões no pico.
- Os nomes de worktree e branch com o tema (`<tema>-<N>-<slug>`, `<tema>/<N>-<slug>`).
- Versão **2.6.0** (menor): é um modo novo em `rascunho`, ao lado dos que existem, sem quebrar quem usa o modo Orca da 2.5.0.
- O checklist de cada tema parte de conhecimento geral (por exemplo, OWASP para a Segurança) e é corrigido pelo primeiro caso.

## Em aberto até o harness de cada agente

- **Arquitetura:** o escopo vai além de arquitetura de software (pedido da pessoa); o que mais entra é decidido ao escrever o harness dela.
- **Segurança e Produto com trabalhadoras:** proposta da sessão do método, a decidir no harness de cada um. Segurança com uma pasta própria de testes de segurança (que não toca o código do back nem do front); Produto com trabalhadoras de pesquisa (auditoria de referências, com o `modelos/prompt-auditoria-de-referencia.md`).
- **CI com o DevOps ativo:** proposta da sessão do método: o CI passa para o DevOps quando ele está ativo e fica com a integradora quando não está; a decidir no harness do DevOps.

## O que fica para quem constrói

- O texto de cada harness, seguindo as 9 partes, revisado com a pessoa um a um.
- As verificações exatas do verificador.
- Um PR por harness ou um PR só: a combinar com a pessoa no plano.

## O que observar no primeiro projeto

Se as dúvidas pararam de fato no especialista; quantas sessões a cota aguentou; se dois especialistas cruzaram arquivos; se a Segurança achou algo que a integradora não acharia; se o ida e volta custou mais do que economizou; se o harness foi lido pelo Codex.
