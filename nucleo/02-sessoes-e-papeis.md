# 02 · Sessões e papéis

Como dividir o trabalho entre sessões do Claude Code e do Codex sem perder qualidade. A ideia central: **separar quem constrói de quem valida**. Uma sessão **Lead** define, valida e integra; uma ou mais sessões **Builders** constroem tarefas isoladas.

## Quando dividir

Divida em várias sessões quando **todas** estas condições forem verdadeiras:

- Há **tarefas independentes**, que não precisam dos mesmos arquivos ao mesmo tempo (por exemplo, uma revisão do mobile e o preparo do deploy).
- Cada tarefa leva **mais de 20 a 30 minutos**, o que paga o custo de coordenar.
- Existe **CI** e um modelo de Pull Request, para a validação não depender da memória de ninguém.
- Você aguenta o consumo: cada sessão gasta o seu próprio limite de uso.

Sinais de que dividir ajuda: a mesma sessão está construindo e conferindo o próprio trabalho; os erros só aparecem quando você abre o resultado; há uma fila de tarefas esperando.

## Quando NÃO dividir

- Tarefas pequenas (um texto, uma cor, uma linha): a Lead faz direto, numa branch, no mesmo fluxo.
- Tarefas que **mexem nos mesmos arquivos**: rode em sequência numa sessão só.
- Projeto sem testes nem CI: monte isso primeiro; dividir sem rede de segurança multiplica os erros.
- Conta com limite apertado de uso: o paralelo esgota o limite mais rápido.
- O alvo ainda não está definido: dividir antes de saber o que construir só espalha a confusão.

## Papéis

| | Lead (principal) | Builder (uma por tarefa) |
|---|---|---|
| Missão | Definir, validar e integrar | Construir uma tarefa |
| Escreve código | Quase nunca (correções pequenas da própria validação) | Sim, só nos arquivos permitidos |
| Cria tarefas e critérios de aceite | Sim | Não: segue a issue |
| Branch e PR | Coordena e mantém | Uma branch e um PR por tarefa |
| Testes | Refaz tudo e **explora** (micro e macro) | TDD (micro) e a suíte completa (macro) antes do PR |
| Merge na `main` | **Só ela integra** | **Nunca** |
| Fala com a pessoa | Sim; reúne todas as dúvidas num lugar só | Não; sobe a dúvida para a Lead |
| Skills | As mesmas, em todos os cenários | As mesmas, em todos os cenários |

## Ciclo de uma tarefa

1. A Lead abre a issue com o formulário de tarefa: objetivo, critérios de aceite, arquivos permitidos e proibidos, skills, testes micro e macro.
2. A Builder cria a worktree com o script (`nova-tarefa.sh`): branch a partir da `main` do remoto e uma porta própria para o servidor.
3. A Builder desenvolve com TDD e commits pequenos.
4. Antes do PR, traz a `main` para a branch, roda os testes macro, envia a branch e abre o PR (`Closes #N`).
5. O CI roda sozinho. A Lead **valida** (checklist em [03](03-skills-e-testes.md) e no [prompt da Lead](../modelos/prompt-lead.md)).
6. A Lead confere os gatilhos de aprovação ([01](01-fluxo-de-ponta-a-ponta.md), "Portões de aprovação"): sem gatilho, integra e registra no resumo por marco; com gatilho, só com o "pode integrar" da pessoa. Depois confere a `main` e o CI. **A branch fica no GitHub** como histórico consultável. A Builder remove a worktree.

## Ciclo de um bug

Um bug é um comportamento que diverge do combinado (critério de aceite, contrato, referência). Ele segue o ciclo da tarefa, com estes passos a mais ([decisão 014](../decisoes/014-fluxo-de-correcao-de-bugs.md)):

1. **Registro.** Quem acha (a pessoa, uma Builder, um especialista, o monitoramento) abre uma **issue de bug** com o [formulário de bug](../modelos/issue-bug.yml): o que aconteceu, o que era esperado, os passos para reproduzir, onde e a evidência, sem dado pessoal de usuário.
2. **Triagem pela Lead**, pelos gatilhos de aprovação ([01](01-fluxo-de-ponta-a-ponta.md), "Portões de aprovação"):
   - **Incidente** (produção fora do ar, dados de usuários, segurança): aciona o gatilho "atinge usuários reais" e vai para a pessoa na hora, com `engineering:incident-response` ou, se há dados pessoais, `metodo:incidente-com-dados-pessoais`.
   - **Bug comum:** a Lead encaixa o bug na fila dentro da **prioridade já aprovada** pela pessoa (o bug do que está sendo construído vem antes do trabalho novo do mesmo tema) e o entrega ao especialista do tema (Backend, Frontend ou Ops). Passar um bug à frente do que a pessoa priorizou é gatilho e vai para ela.
   - **Antes de entregar**, a Lead completa a issue como numa tarefa: arquivos permitidos e proibidos, plano e passo (ou "sem plano" e o motivo) e a ferramenta. Com isso a Builder trabalha sem deduzir permissões, e uma passagem por cota encontra tudo na issue.
   - **Não é bug** (é pedido novo): vira tarefa, e mudar o que será construído é da pessoa.
3. **Dono.** O especialista abre a Builder na ferramenta do seu papel, com o nome de sempre (`Backend Builder #31 · login-expira · Codex`) e a branch `fix/31-login-expira`.
4. **Correção**, com `superpowers:systematic-debugging`: reproduzir; achar a **causa raiz**, não o sintoma; escrever um teste que **falha por causa do bug**; a correção mínima; a suíte inteira. O teste fica para sempre, e o mesmo bug não volta.
5. **Bug achado no meio de outra tarefa:** dentro do escopo da tarefa, a Builder corrige ali; **fora do escopo**, abre uma **issue nova** de bug e segue a tarefa dela, sem crescer.
6. **Validação e merge:** a **revisão cruzada** da outra ferramenta e a Lead conferindo que o bug sumiu (os passos para reproduzir já não reproduzem). A correção que não muda o **comportamento combinado** a Lead integra sozinha e registra; a que muda o comportamento, mexe em dados ou precisa ir à produção é da pessoa.
7. **Aprendizado (Fases 8 e 9):** se a causa foi o processo (uma regra que faltou, uma verificação que não existia), o bug vira **lição** do método.

**Correção urgente** (incidente em produção): a pessoa decide entre **reverter** a última publicação, quase sempre o mais rápido e seguro, e corrigir à frente. A correção à frente segue o mesmo ciclo, só com prioridade: o teste que reproduz o bug continua vindo antes da correção, e a publicação continua sendo um portão da pessoa. Depois, a retrospectiva do incidente vai para a memória do projeto.

## Comunicação

- **Issues** são a fila de tarefas e o registro; **etiquetas** mostram o estado (`tarefa`, `precisa-validação`, `bloqueada`, e uma por área).
- A Builder comenta na issue ao terminar uma fase e quando precisa de decisão; a Lead responde ali.
- **Pontos de controle:** se a tarefa tem fases (por exemplo, auditoria e depois refatoração), a Builder **para** ao fim de cada fase e espera a aprovação.
- A pessoa conversa só com a Lead.

## Propriedade de arquivos e conflitos

- Regra: duas tarefas abertas **não tocam o mesmo arquivo**. Cada issue lista o que **pode** e o que **não pode** ser tocado; se as listas se cruzam, as tarefas rodam em sequência.
- Mantenha uma lista dos **pontos quentes** do projeto (arquivos que mudam o tempo todo: layout principal, arquivos de configuração e de textos, testes-guarda).
- Antes do PR, a Builder traz a `main` para a branch e roda tudo de novo. Branch velha é a causa número um de conflito.

## Worktrees e portas

Uma **worktree** é uma segunda pasta do mesmo repositório, em outra branch, sem clonar de novo. Cada tarefa tem a sua, fora da pasta do projeto, com o seu próprio `node_modules` (ou equivalente) e a sua própria pasta de build. Atribua portas por faixa (por exemplo, a Lead na 3000, o preview na 3001 e as tarefas de 3010 a 3019) para os servidores não colidirem. Os scripts em [modelos](../modelos/) automatizam a criação e a remoção.

## Limites e custo

- No máximo **1 Lead e 2 Builders** ao mesmo tempo, salvo contas com folga de limite.
- A Lead fica **enxuta**: não relê o projeto inteiro, valida o que mudou e o que pode ter quebrado.
- Tarefa pequena não precisa de sessão própria.
- Dentro de **uma** sessão também dá para paralelizar com subagentes (`superpowers:dispatching-parallel-agents`); isso é outra coisa: os subagentes não têm memória da conversa e devolvem um relatório.

## Modos de falha

| Falha | Causa | Como evitar |
|---|---|---|
| Duas tarefas mexeram no mesmo arquivo | Listas de arquivos não conferidas | A Lead confere as listas ao abrir cada issue; tarefas que se cruzam vão em sequência |
| Branch desatualizada gerou conflito | A Builder não trouxe a `main` | Regra do passo 4; a proteção da `main` exige a branch em dia |
| A Builder perguntou à pessoa | Prompt sem a regra | O [prompt](../modelos/prompt-builder.md) manda subir a dúvida para a Lead |
| "CI verde" aceito como prova | Validação superficial | O checklist da Lead exige abrir o navegador e comparar com os critérios |
| A Lead virou gargalo | Valida demais, relê tudo | Foco no que mudou; critérios de aceite objetivos desde a issue |
| Fase B começou sem o alvo aprovado | Faltou o ponto de controle | A issue manda parar ao fim da Fase A |
| Sessão apagada com trabalho dentro | Limpeza sem listar antes | Listar, mostrar o que será apagado e só então confirmar |

## Com o Orca

O [Orca](https://github.com/stablyai/orca) coordena vários agentes de código, cada um na sua worktree, e faz por comando a orquestração que antes era manual. O mapa é direto: **a Lead coordena no Orca e cada agente supervisionado é uma Builder** ([decisão 006](../decisoes/006-desenvolvimento-orquestrado-com-o-orca.md)). Este modo entrou aprovado pela pessoa, **sem caso real**; o primeiro projeto feito com ele confirma ou corrige esta seção.

| Sessões abertas à mão | Com o Orca |
|---|---|
| A pessoa abre uma sessão por tarefa e cola o [prompt da Builder](../modelos/prompt-builder.md) | A Lead abre o agente na worktree com `orca orchestration worker-start --agent <agente>` (a ferramenta do papel, na tabela Ferramenta por papel), passando a especificação da tarefa |
| `nova-tarefa.sh` cria a worktree | O Orca cria a worktree (`worker-start --worktree new-child`, ou `orca worktree create`) |
| A Builder comenta na issue e a pessoa avisa a Lead | O agente pergunta com `orca orchestration ask` e espera; a Lead responde com `orca orchestration reply` |
| A pessoa acompanha cada terminal | A Lead espera com `orca orchestration check --wait` e o painel do Orca avisa quando um agente termina |
| Portão humano: a sessão para e espera no chat | A Lead cria um portão (`orca orchestration gate-create`) e só o resolve (`gate-resolve`) com a resposta da pessoa |
| `remover-tarefa.sh` remove a worktree | A Lead libera o agente (`worker-release`) e o Orca remove a worktree (`orca worktree rm`) |

**O que não muda:** quem constrói não valida (a Lead refaz os testes e abre o navegador); os agentes **nunca** integram e terminam com o PR aberto e o CI verde; uma tarefa, uma branch, um PR; o que aciona um gatilho de aprovação (deploy, o irreversível, o merge com gatilho) só com a aprovação da pessoa; a issue continua sendo o registro da tarefa. A Lead não escreve código.

**Cada agente usa a ferramenta do seu papel** (seção "Lead e ferramenta por papel", abaixo): Claude Code ou Codex. O Orca também abre outros agentes (Cursor e outros), mas eles não leem o `CLAUDE.md` nem o `AGENTS.md` do projeto nem os plugins do método e trabalhariam sem ele.

**Ciclo de uma tarefa:**

1. A Lead abre a issue com o formulário de tarefa e cria a tarefa no Orca com a especificação padrão do [prompt da Lead](../modelos/prompt-lead-orca.md) (objetivo, requisitos (R-xx) e, com interface, as telas aprovadas em `docs/telas/`, critérios de aceite, arquivos permitidos e proibidos, Skills, testes micro e macro, `Closes #N`).
2. O agente constrói com TDD, traz a `main`, roda os testes macro, envia a branch, abre o PR e avisa o fim (`worker_done`). Dúvidas vão para a Lead com `ask`.
3. A Lead valida o PR (checklist do [03](03-skills-e-testes.md)) e confere os gatilhos de aprovação. Sem gatilho, integra com `gh pr merge N --merge` e registra no resumo por marco; com gatilho, cria o portão do merge e pergunta à pessoa.
4. Com o "pode integrar" (quando havia gatilho), resolve o portão e integra; em qualquer caso, confere a `main` e o CI e libera o agente.

**Limite inicial:** 1 Lead e até 3 agentes ao mesmo tempo. O painel e os avisos do Orca facilitam acompanhar; o número sobe ou desce com o caso.

**Na Fase 9:** as conversas dos agentes ficam pesquisáveis com `orca search`; a sessão do método pode consultá-las (só leitura, com a autorização da pessoa) para recuperar correções feitas durante o trabalho.

**O que observar no primeiro projeto:** se algum agente perguntou direto à pessoa em vez de usar `ask`; se os portões seguraram de fato o merge e o deploy; quantos agentes deu para acompanhar; se os scripts de worktree ainda fazem falta.

### Lead e ferramenta por papel

O projeto usa **o Claude Code e o Codex juntos**, para dividir o consumo entre as duas assinaturas ([decisão 013](../decisoes/013-lead-e-builders-com-codex-e-claude.md), aprovada pela pessoa sem caso real; substitui a regra de uma ferramenta só da [decisão 010](../decisoes/010-um-agente-principal-por-projeto.md)). A **Lead fica fixa no Claude Code**; cada outro papel tem uma **ferramenta padrão**, registrada no `docs/DESENVOLVIMENTO.md` na linha `Lead: Claude Code` e na tabela **Ferramenta por papel**:

| Claude Code | Codex |
|---|---|
| Lead, Product, Architect, Frontend | Backend, Security e Ops |

| Ferramenta | No `worker-start` | Lê no início |
|---|---|---|
| Claude Code | `--agent claude --model claude-opus-5-5` | `CLAUDE.md` |
| Codex | `--agent codex --model gpt-6.1-sol` | `AGENTS.md`, que manda ler o `CLAUDE.md`, o `docs/DESENVOLVIMENTO.md` e a memória |

- **Uma ferramenta só continua possível:** `novo-projeto.sh --agente <claude|codex>` põe todos os papéis, inclusive a Lead, na mesma ferramenta. Mudar a tabela depois é uma decisão da pessoa, anotada na memória do projeto.
- **Os mesmos princípios nas duas.** TDD visto falhar, testes micro e macro, verificação antes de dizer "pronto", uma tarefa por branch e por PR, só a Lead integra, dúvidas sobem com `ask`. Por isso as duas ferramentas de cada computador têm os mesmos plugins (README, "Antes de começar"), e todo projeto tem o `CLAUDE.md` e o `AGENTS.md`.
- **A Builder usa a ferramenta padrão do papel de quem a abre.** Se a **cota** dessa ferramenta estiver apertada, o especialista abre a Builder na outra e registra a escolha no campo "Ferramenta" da issue e no nome da Builder (`Backend Builder #12 · login · Claude`).
- **Passagem quando a cota acaba no meio da tarefa:** a Builder faz commit, envia a branch e **comenta na issue onde parou** e qual é o próximo passo. O especialista abre outra Builder, na outra ferramenta, na **mesma branch**, e ela continua a partir do comentário e do campo "Plano e passo" da issue. O estado vive no Git e na issue, nunca só na conversa.
- **Revisão cruzada:** todo PR recebe **ao menos uma revisão da outra ferramenta**. Com uma ferramenta só (`--agente`), a revisão cruzada não se aplica; a revisão independente da Lead continua. O PR feito no Codex já passa pela Lead, no Claude; o PR feito no Claude recebe a revisão de um agente Codex: o Security nos PRs sensíveis e, nos outros, uma sessão Codex de revisão aberta pela Lead.
- **A Lead Codex** (só com `--agente codex`) usa o mesmo [prompt da Lead](../modelos/prompt-lead-orca.md) ou o mesmo harness e valida no navegador com um navegador automatizado ([03](03-skills-e-testes.md)).
- **Contrato primeiro, quando back e front correm em paralelo.** Antes da primeira tarefa de construção, uma tarefa fecha o **contrato da API** num arquivo do repositório (`docs/contrato-api.md`, ou o formato que a stack pedir, como OpenAPI), e a pessoa aprova num portão. Depois, o contrato só muda por uma tarefa própria: a mudança que quebra quem usa passa por um portão da pessoa; a aditiva (um campo novo opcional), pela Lead. Cada lado tem a sua pasta (por exemplo, `back/` e `front/`, decididas na Fase 2), e os **arquivos comuns** (CI, dependências da raiz, contrato, memória do projeto) têm um dono só, nunca duas tarefas ao mesmo tempo, nem de ferramentas diferentes.
- **Medição.** A memória do projeto anota, por tarefa, a ferramenta, as passagens, se houve retrabalho e por quê, e o consumo; a Fase 9 compara as duas ferramentas.

**O que observar no primeiro projeto:** quantas passagens houve e se alguma perdeu trabalho; se a revisão cruzada achou algo; se a cota deixou de parar o projeto; se os agentes Codex seguiram o TDD, a verificação e as skills do método.

### Com agentes especialistas

A Lead deixa de carregar tudo sozinha: ao lado dela trabalham **agentes especialistas por tema**, cada um com um **harness** escrito com a pessoa ([decisão 008](../decisoes/008-agentes-especialistas.md), aprovada sem caso real). O modelo continua o de Lead e Builders, com uma camada no meio: as Builders passam a ser abertas e coordenadas pelo especialista do tema.

Cada agente usa a **ferramenta do seu papel** (Claude Code ou Codex, seção acima).

| Agente | Tema | Builders | Presença |
|---|---|---|---|
| Lead | coordenação, validação final (QA) e integração | não; coordena os especialistas | sempre |
| Architect | estrutura, contrato da API, dados, confiabilidade, observabilidade, custo | não | sempre |
| Backend | regras de negócio, APIs, autenticação, banco de dados | até 2 | sempre |
| Frontend | identidade e todas as telas no Figma (Fase 2, antes do código), registro em `docs/telas/`, design system, interface | até 2 | sempre que há interface |
| Security | mapa de riscos no começo, revisão dos PRs sensíveis e auditoria completa antes da primeira publicação, com a `security-audit` desde o primeiro mapa | não; entrega a correção ao dono da pasta | sempre |
| Product | requisitos (fichas R-xx com o peso, em `docs/requisitos.md`), pesquisa com usuários, critérios de aceite | não | sob demanda (Fases 0 a 2) |
| Ops | deploy, CI/CD, nuvem, monitoramento; dono do CI enquanto ativo | 1 por vez | sob demanda |

- **Harnesses:** os modelos ficam em [`modelos/agentes/`](../modelos/agentes/) e vão para `docs/agentes/` do projeto com `novo-projeto.sh --especialistas`. Cada um tem as mesmas 10 partes (missão, quando é chamado, o que lê, o que pode e o que não pode, Skills, checklist, formato da resposta, quando sobe a decisão, memória, economia), as referências escolhidas pela pessoa e o passo a passo "Como pesquisa".
- **O harness manda:** o agente pode consultar o que precisar (referências, web, Skills, método), mas atua dentro do harness. Ordem de precedência: o harness, o que o projeto decidiu, as Skills e o método, o que foi consultado. Se acha o harness errado ou incompleto, não desvia: para e sobe a questão.
- **Modelos:** os da ferramenta de cada papel (`claude-opus-5-5` no Claude Code, `gpt-6.1-sol` no Codex); o esforço varia por papel e vai em todo `worker-start` (`--agent <agente> --model <modelo> --effort`).
- **No Orca:** a Lead abre os especialistas; cada especialista abre as suas Builders com `worker-start --worktree new-child`, e o Orca as pendura nele (`--parent`). A dúvida da Builder (`ask`) chega ao especialista; só sobe para a Lead o que ele não pode decidir. **Exige o ajuste Settings → Orchestration → Nested worker depth = 2** (o padrão é 1; testado no Orca 1.4.241). Nem mais nem menos: com 2, uma Builder não abre agentes próprios.
- **Worktrees e visibilidade:** a pessoa vê cada agente no Orca, na sua worktree. Cada especialista abre numa worktree com o nome do tema, **filha da worktree principal** (`worker-start --worktree new-child --name <tema>`, da pasta principal); cada Builder, numa worktree por issue, filha da do especialista (`backend-12-login`, branch `backend/12-login`). **Nome da Builder:** `<Papel> Builder #<issue> · <resumo> · <ferramenta>` no `--display-name` (por exemplo, `Backend Builder #12 · login · Codex`): o papel diz quem responde por ela, a issue é a identidade única (leva à issue, à branch e ao PR), o resumo dá o assunto e a ferramenta diz que cota ela gasta. O mesmo nome vai no título do PR e nos comentários da issue; o especialista aparece só com o nome do papel (`--display-name Backend`). Sem o Orca, a branch segue o `nova-tarefa.sh` (`feat/12-login`) e o nome vai na issue e no PR. Quem só coordena ou revisa lê a worktree do trabalho; numa worktree, só a dona da tarefa escreve. Testado no Orca 1.4.241.
- **Limite:** no máximo 9 sessões ao mesmo tempo (a Lead, os 4 fixos e até 2 Builders de Backend e 2 de Frontend); Product e Ops abrem e fecham com a fase deles. Product e Ops (e a Builder do Ops) contam dentro das 9: quando um deles abre, a Lead segura uma Builder até caber. Neste modo, isso substitui o limite de "1 Lead e até 3 agentes" do modo Orca.
- **Arquivos comuns mudam de dono:** o contrato da API passa para o Architect, e o CI passa para o Ops enquanto ele está ativo; a Lead fica com as dependências da raiz, a memória do projeto e o CI quando não há Ops. Os especialistas que só coordenam mandam as notas da memória e das referências à Lead (`orca orchestration send --type status`), e ela grava.
- **O que não muda:** só a Lead integra e só ela fala com a pessoa e resolve os portões; quem constrói não valida; uma tarefa, uma branch, um PR.

**O que observar no primeiro projeto:** se as dúvidas pararam no especialista; quantas sessões a cota aguentou; se dois especialistas cruzaram arquivos; se o Security achou o que a Lead não acharia; se o ida e volta custou mais do que economizou; se cada agente, nas duas ferramentas, leu e seguiu o harness; o consumo por tarefa e por ferramenta.

## Como iniciar

Use o [prompt da sessão Builder](../modelos/prompt-builder.md) e o [prompt da Lead](../modelos/prompt-lead.md). No Orca, use o [prompt da Lead no Orca](../modelos/prompt-lead-orca.md): ele substitui os dois. No modo com especialistas, a Lead usa o [harness dela](../modelos/agentes/lead.md) no lugar do prompt. Um bom primeiro passo é um **piloto pequeno**: 1 Lead e 1 Builder numa tarefa quase só de estilo ou de conteúdo, enquanto a Lead não muda código.
