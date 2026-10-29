# 02 · Sessões e papéis

Como dividir o trabalho entre sessões do Claude Code sem perder qualidade. A ideia central: **separar quem constrói de quem valida**. Uma sessão **integradora** define, valida e integra; uma ou mais sessões **trabalhadoras** constroem tarefas isoladas.

## Quando dividir

Divida em várias sessões quando **todas** estas condições forem verdadeiras:

- Há **tarefas independentes**, que não precisam dos mesmos arquivos ao mesmo tempo (por exemplo, uma revisão do mobile e o preparo do deploy).
- Cada tarefa leva **mais de 20 a 30 minutos**, o que paga o custo de coordenar.
- Existe **CI** e um modelo de Pull Request, para a validação não depender da memória de ninguém.
- Você aguenta o consumo: cada sessão gasta o seu próprio limite de uso.

Sinais de que dividir ajuda: a mesma sessão está construindo e conferindo o próprio trabalho; os erros só aparecem quando você abre o resultado; há uma fila de tarefas esperando.

## Quando NÃO dividir

- Tarefas pequenas (um texto, uma cor, uma linha): a integradora faz direto, numa branch, no mesmo fluxo.
- Tarefas que **mexem nos mesmos arquivos**: rode em sequência numa sessão só.
- Projeto sem testes nem CI: monte isso primeiro; dividir sem rede de segurança multiplica os erros.
- Conta com limite apertado de uso: o paralelo esgota o limite mais rápido.
- O alvo ainda não está definido: dividir antes de saber o que construir só espalha a confusão.

## Papéis

| | Integradora (principal) | Trabalhadora (uma por tarefa) |
|---|---|---|
| Missão | Definir, validar e integrar | Construir uma tarefa |
| Escreve código | Quase nunca (correções pequenas da própria validação) | Sim, só nos arquivos permitidos |
| Cria tarefas e critérios de aceite | Sim | Não: segue a issue |
| Branch e PR | Coordena e mantém | Uma branch e um PR por tarefa |
| Testes | Refaz tudo e **explora** (micro e macro) | TDD (micro) e a suíte completa (macro) antes do PR |
| Merge na `main` | **Só ela integra** | **Nunca** |
| Fala com a pessoa | Sim; reúne todas as dúvidas num lugar só | Não; sobe a dúvida para a integradora |
| Skills | As mesmas, em todos os cenários | As mesmas, em todos os cenários |

## Ciclo de uma tarefa

1. A integradora abre a issue com o formulário de tarefa: objetivo, critérios de aceite, arquivos permitidos e proibidos, skills, testes micro e macro.
2. A trabalhadora cria a worktree com o script (`nova-tarefa.sh`): branch a partir da `main` do remoto e uma porta própria para o servidor.
3. A trabalhadora desenvolve com TDD e commits pequenos.
4. Antes do PR, traz a `main` para a branch, roda os testes macro, envia a branch e abre o PR (`Closes #N`).
5. O CI roda sozinho. A integradora **valida** (checklist em [03](03-skills-e-testes.md) e no [prompt da integradora](../modelos/prompt-sessao-integradora.md)).
6. Com a aprovação da pessoa, a integradora integra, confere a `main` e o CI. **A branch fica no GitHub** como histórico consultável. A trabalhadora remove a worktree.

## Comunicação

- **Issues** são a fila de tarefas e o registro; **etiquetas** mostram o estado (`tarefa`, `precisa-validação`, `bloqueada`, e uma por área).
- A trabalhadora comenta na issue ao terminar uma fase e quando precisa de decisão; a integradora responde ali.
- **Pontos de controle:** se a tarefa tem fases (por exemplo, auditoria e depois refatoração), a trabalhadora **para** ao fim de cada fase e espera a aprovação.
- A pessoa conversa só com a integradora.

## Propriedade de arquivos e conflitos

- Regra: duas tarefas abertas **não tocam o mesmo arquivo**. Cada issue lista o que **pode** e o que **não pode** ser tocado; se as listas se cruzam, as tarefas rodam em sequência.
- Mantenha uma lista dos **pontos quentes** do projeto (arquivos que mudam o tempo todo: layout principal, arquivos de configuração e de textos, testes-guarda).
- Antes do PR, a trabalhadora traz a `main` para a branch e roda tudo de novo. Branch velha é a causa número um de conflito.

## Worktrees e portas

Uma **worktree** é uma segunda pasta do mesmo repositório, em outra branch, sem clonar de novo. Cada tarefa tem a sua, fora da pasta do projeto, com o seu próprio `node_modules` (ou equivalente) e a sua própria pasta de build. Atribua portas por faixa (por exemplo, a integradora na 3000, o preview na 3001 e as tarefas de 3010 a 3019) para os servidores não colidirem. Os scripts em [modelos](../modelos/) automatizam a criação e a remoção.

## Limites e custo

- No máximo **1 integradora e 2 trabalhadoras** ao mesmo tempo, salvo contas com folga de limite.
- A integradora fica **enxuta**: não relê o projeto inteiro, valida o que mudou e o que pode ter quebrado.
- Tarefa pequena não precisa de sessão própria.
- Dentro de **uma** sessão também dá para paralelizar com subagentes (`superpowers:dispatching-parallel-agents`); isso é outra coisa: os subagentes não têm memória da conversa e devolvem um relatório.

## Modos de falha

| Falha | Causa | Como evitar |
|---|---|---|
| Duas tarefas mexeram no mesmo arquivo | Listas de arquivos não conferidas | A integradora confere as listas ao abrir cada issue; tarefas que se cruzam vão em sequência |
| Branch desatualizada gerou conflito | A trabalhadora não trouxe a `main` | Regra do passo 4; a proteção da `main` exige a branch em dia |
| A trabalhadora perguntou à pessoa | Prompt sem a regra | O [prompt](../modelos/prompt-sessao-trabalhadora.md) manda subir a dúvida para a integradora |
| "CI verde" aceito como prova | Validação superficial | O checklist da integradora exige abrir o navegador e comparar com os critérios |
| A integradora virou gargalo | Valida demais, relê tudo | Foco no que mudou; critérios de aceite objetivos desde a issue |
| Fase B começou sem o alvo aprovado | Faltou o ponto de controle | A issue manda parar ao fim da Fase A |
| Sessão apagada com trabalho dentro | Limpeza sem listar antes | Listar, mostrar o que será apagado e só então confirmar |

## Com o Orca (rascunho)

O [Orca](https://github.com/stablyai/orca) coordena vários agentes de código, cada um na sua worktree, e faz por comando a orquestração que antes era manual. O mapa é direto: **a coordenadora do Orca é a integradora e cada agente supervisionado é uma trabalhadora** ([decisão 006](../decisoes/006-desenvolvimento-orquestrado-com-o-orca.md)). Este modo entrou aprovado pela pessoa, **sem caso real**; o primeiro projeto feito com ele confirma ou corrige esta seção.

| Sessões abertas à mão | Com o Orca |
|---|---|
| A pessoa abre uma sessão por tarefa e cola o [prompt da trabalhadora](../modelos/prompt-sessao-trabalhadora.md) | A coordenadora abre o agente na worktree com `orca orchestration worker-start --agent claude`, passando a especificação da tarefa |
| `nova-tarefa.sh` cria a worktree | O Orca cria a worktree (`worker-start --worktree new-child`, ou `orca worktree create`) |
| A trabalhadora comenta na issue e a pessoa avisa a integradora | O agente pergunta com `orca orchestration ask` e espera; a coordenadora responde com `orca orchestration reply` |
| A pessoa acompanha cada terminal | A coordenadora espera com `orca orchestration check --wait` e o painel do Orca avisa quando um agente termina |
| Portão humano: a sessão para e espera no chat | A coordenadora cria um portão (`orca orchestration gate-create`) e só o resolve (`gate-resolve`) com a resposta da pessoa |
| `remover-tarefa.sh` remove a worktree | A coordenadora libera o agente (`worker-release`) e o Orca remove a worktree (`orca worktree rm`) |

**O que não muda:** quem constrói não valida (a coordenadora refaz os testes e abre o navegador); os agentes **nunca** integram e terminam com o PR aberto e o CI verde; uma tarefa, uma branch, um PR; merge, deploy e o que é irreversível só com a aprovação da pessoa; a issue continua sendo o registro da tarefa. A coordenadora não escreve código, como a integradora.

**A coordenadora e os agentes são Claude Code.** A coordenadora é aberta como um agente Claude no Orca e inicia cada agente com `--agent claude`. O Orca também abre outros agentes (Codex, Cursor e outros), mas eles não leem o `CLAUDE.md` do projeto nem os plugins do Claude Code (`metodo`, Superpowers) e trabalhariam sem o método.

**Ciclo de uma tarefa:**

1. A coordenadora abre a issue com o formulário de tarefa e cria a tarefa no Orca com a especificação padrão do [prompt da coordenadora](../modelos/prompt-coordenadora-orca.md) (objetivo, critérios de aceite, arquivos permitidos e proibidos, Skills, testes micro e macro, `Closes #N`).
2. O agente constrói com TDD, traz a `main`, roda os testes macro, envia a branch, abre o PR e avisa o fim (`worker_done`). Dúvidas vão para a coordenadora com `ask`.
3. A coordenadora valida o PR como a integradora (checklist do [03](03-skills-e-testes.md)), cria o portão do merge e pergunta à pessoa.
4. Com o "pode integrar", resolve o portão, integra com `gh pr merge N --merge`, confere a `main` e o CI e libera o agente.

**Limite inicial:** 1 coordenadora e até 3 agentes ao mesmo tempo. O painel e os avisos do Orca facilitam acompanhar; o número sobe ou desce com o caso.

**Na Fase 9:** as conversas dos agentes ficam pesquisáveis com `orca search`; a sessão do método pode consultá-las (só leitura, com a autorização da pessoa) para recuperar correções feitas durante o trabalho.

**O que observar no primeiro projeto:** se algum agente perguntou direto à pessoa em vez de usar `ask`; se os portões seguraram de fato o merge e o deploy; quantos agentes deu para acompanhar; se os scripts de worktree ainda fazem falta.

### Back e front com agentes diferentes (rascunho)

Para usar duas assinaturas no mesmo projeto, o back pode ficar com agentes **Codex** e o front com agentes **Claude**, no mesmo repositório e na mesma `main` ([decisão 007](../decisoes/007-back-com-codex-e-front-com-claude.md), aprovada pela pessoa sem caso real). Vale a pena se sair conforme o esperado e sem retrabalho.

- **Uma coordenadora só, sempre Claude Code.** Ela é a única que integra. Inicia os agentes do front com `worker-start --agent claude` e os do back com `worker-start --agent codex`.
- **Os mesmos princípios para os dois.** O agente Codex segue as mesmas regras e Skills: TDD visto falhar, testes micro e macro, verificação antes de dizer "pronto", uma tarefa por branch e por PR, nunca integra, pergunta à coordenadora com `ask`. Por isso, o Codex de cada computador tem os mesmos plugins e ferramentas que o Claude (README, "Antes de começar").
- **`AGENTS.md`.** O Codex lê o `AGENTS.md` do projeto, não o `CLAUDE.md`. O `AGENTS.md` gerado pelo método manda ler o `CLAUDE.md`, o `docs/DESENVOLVIMENTO.md` e a memória, e repete as regras da trabalhadora. **Regra do agente:** a coordenadora é sempre Claude; os agentes podem ser Claude ou Codex, e o Codex só entra em projeto que tem `AGENTS.md`.
- **Contrato primeiro.** Antes de qualquer tarefa de construção, uma tarefa fecha o **contrato da API** num arquivo do repositório (`docs/contrato-api.md`, ou o formato que a stack pedir, como OpenAPI), e a pessoa aprova num portão. Depois, o contrato só muda por uma tarefa própria, com um portão da pessoa; o lado que depende dele se ajusta na tarefa seguinte.
- **Pastas separadas.** Cada lado tem a sua pasta (por exemplo, `back/` e `front/`, decididas na Fase 2 e registradas no `docs/DESENVOLVIMENTO.md`), e cada tarefa lista só as pastas do seu lado como permitidas. Os **arquivos comuns** (CI, dependências da raiz, contrato, memória do projeto) mudam só em tarefas da coordenadora, nunca em duas tarefas ao mesmo tempo.
- **Validação.** A coordenadora valida os PRs do back pelos testes e pelo contrato, e abre o navegador quando o back e o front se encontram.
- **Medição.** A memória do projeto anota, por tarefa, qual agente fez, se houve retrabalho e por quê.

**O que observar no primeiro projeto:** se algum agente Codex pulou o TDD ou a verificação; se as skills do método funcionaram no Codex; quantas tarefas voltaram por causa do contrato; quanto cada cota rendeu; se a coordenadora gastou tokens demais revisando o back (aí entra uma coordenadora Codex só para o back, por baixo da principal).

### Com agentes especialistas (rascunho)

A integradora deixa de carregar tudo sozinha: ao lado dela trabalham **agentes especialistas por tema**, cada um com um **harness** escrito com a pessoa ([decisão 008](../decisoes/008-agentes-especialistas.md), aprovada sem caso real). O modelo continua o de integradora e trabalhadoras, com uma camada no meio: as trabalhadoras passam a ser abertas e coordenadas pelo especialista do tema.

| Agente | Tema | Ferramenta | Trabalhadoras | Presença |
|---|---|---|---|---|
| Integradora | coordenação, validação final (QA) e integração | Claude | não; coordena os especialistas | sempre |
| Arquitetura | estrutura, contrato da API, dados, confiabilidade, observabilidade, custo | Claude | não | sempre |
| Back e Dados | regras de negócio, APIs, autenticação, banco de dados | Codex | Codex, até 2 | sempre |
| Design e Front | experiência, design system, interface | Claude | Claude, até 2 | sempre |
| Segurança | mapa de riscos no começo e revisão dos PRs sensíveis | Codex | não; entrega a correção ao dono da pasta | sempre |
| Produto | produto, pesquisa com usuários, critérios de aceite | Claude | não | sob demanda (Fases 0 a 2) |
| DevOps | deploy, CI/CD, nuvem, monitoramento; dono do CI enquanto ativo | Codex | Codex, 1 por vez | sob demanda |

- **Harnesses:** os modelos ficam em [`modelos/agentes/`](../modelos/agentes/) e vão para `docs/agentes/` do projeto com `novo-projeto.sh --especialistas`. Cada um tem as mesmas 10 partes (missão, quando é chamado, o que lê, o que pode e o que não pode, Skills, checklist, formato da resposta, quando sobe a decisão, memória, economia), as referências escolhidas pela pessoa e o passo a passo "Como pesquisa".
- **O harness manda:** o agente pode consultar o que precisar (referências, web, Skills, método), mas atua dentro do harness. Ordem de precedência: o harness, o que o projeto decidiu, as Skills e o método, o que foi consultado. Se acha o harness errado ou incompleto, não desvia: para e sobe a questão.
- **Modelos:** Claude com `claude-opus-5-5`, Codex com `gpt-6.1-sol`; o esforço varia por papel e vai em todo `worker-start` (`--model` e `--effort`).
- **No Orca:** a integradora abre os especialistas; cada especialista abre as suas trabalhadoras com `worker-start --worktree new-child`, e o Orca as pendura nele (`--parent`). A dúvida da trabalhadora (`ask`) chega ao especialista; só sobe para a integradora o que ele não pode decidir. **Exige o ajuste Settings → Orchestration → Nested worker depth = 2** (o padrão é 1; testado no Orca 1.4.241). Nem mais nem menos: com 2, uma trabalhadora não abre agentes próprios.
- **Worktrees:** uma por unidade de trabalho (issue e branch), com nomes que levam o tema (`back-12-login`, `back/12-login`). Quem só coordena ou revisa entra na worktree do trabalho, só lendo; numa worktree, só a dona da tarefa escreve.
- **Limite:** no máximo 9 sessões ao mesmo tempo (a integradora, os 4 fixos e até 2 trabalhadoras de Back e Dados e 2 de Design e Front); Produto e DevOps abrem e fecham com a fase deles. Neste modo, isso substitui o limite de "1 coordenadora e até 3 agentes" do modo Orca.
- **Arquivos comuns mudam de dono:** o contrato da API passa para a Arquitetura, e o CI passa para o DevOps enquanto ele está ativo; a integradora fica com as dependências da raiz, a memória do projeto e o CI quando não há DevOps. Os especialistas que só leem a pasta principal mandam as notas da memória e das referências à integradora (`orca orchestration send --type status`), e ela grava.
- **O que não muda:** só a integradora integra e só ela fala com a pessoa e resolve os portões; quem constrói não valida; uma tarefa, uma branch, um PR.

**O que observar no primeiro projeto:** se as dúvidas pararam no especialista; quantas sessões a cota aguentou; se dois especialistas cruzaram arquivos; se a Segurança achou o que a integradora não acharia; se o ida e volta custou mais do que economizou; se o Codex leu e seguiu o harness; o consumo por tarefa.

## Como iniciar

Use o [prompt da sessão trabalhadora](../modelos/prompt-sessao-trabalhadora.md) e o [prompt da integradora](../modelos/prompt-sessao-integradora.md). No Orca, use o [prompt da coordenadora](../modelos/prompt-coordenadora-orca.md): ele substitui os dois. No modo com especialistas, a integradora usa o [harness dela](../modelos/agentes/integradora.md) no lugar do prompt. Um bom primeiro passo é um **piloto pequeno**: 1 integradora e 1 trabalhadora numa tarefa quase só de estilo ou de conteúdo, enquanto a integradora não muda código.
