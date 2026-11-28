# 02 · Sessões e papéis

Uma sessão **Lead** define, valida e integra. Sessões **Builders** constroem tarefas isoladas quando o trabalho pede divisão. A [trilha de impacto](01-fluxo-de-ponta-a-ponta.md#impacto-da-tarefa) determina a profundidade da validação.

## Quando dividir

Divida em várias sessões quando **todas** estas condições forem verdadeiras:

- Há **tarefas independentes**, que não precisam dos mesmos arquivos ao mesmo tempo (por exemplo, uma revisão do mobile e o preparo do deploy).
- Cada tarefa leva **mais de 20 a 30 minutos**, o que paga o custo de coordenar.
- Existe **CI** e um modelo de Pull Request, para a validação não depender da memória de ninguém.
- Você aguenta o consumo: cada sessão gasta o seu próprio limite de uso.

Sinais de que dividir ajuda: a mesma sessão está construindo e conferindo o próprio trabalho; os erros só aparecem quando você abre o resultado; há uma fila de tarefas esperando.

## Quando NÃO dividir

- Tarefa Básico: a Lead pode fazer direto em uma branch e conferir o resultado em uma passagem separada.
- Tarefas que **mexem nos mesmos arquivos**: rode em sequência numa sessão só.
- Projeto sem testes nem CI: monte isso primeiro; dividir sem rede de segurança multiplica os erros.
- Conta com limite apertado de uso: o paralelo esgota o limite mais rápido.
- O alvo ainda não está definido: dividir antes de saber o que construir só espalha a confusão.

## Papéis

| | Lead (principal) | Builder (uma por tarefa) |
|---|---|---|
| Missão | Definir, validar e integrar | Construir uma tarefa |
| Escreve código | Ajustes básicos e correções pequenas da própria validação | Sim, só nos arquivos permitidos |
| Cria tarefas e critérios de aceite | Sim | Não: segue a issue |
| Branch e PR | Coordena e mantém | Uma branch e um PR por tarefa |
| Testes | Valida o aceite e explora conforme a trilha | Executa e registra as verificações da trilha |
| Merge na `main` | **Só ela integra** | **Nunca** |
| Fala com a pessoa | Sim; reúne todas as dúvidas num lugar só | Não; sobe a dúvida para a Lead |

## Ciclo de uma tarefa

1. A Lead classifica o impacto e registra o aceite e a verificação. No Básico, pode usar o próprio PR como registro. Ao delegar, registra a tarefa na issue com os arquivos permitidos e proibidos.
2. A Lead ou a Builder trabalha em branch própria. Quando há Builder em sessão separada, ela cria a worktree com `nova-tarefa.sh`.
3. Quem constrói usa TDD para mudança de comportamento ou correção de bug e registra as verificações da trilha.
4. Antes do PR, atualiza a branch com a `main`, repete as verificações afetadas e abre o PR com `Closes #N` quando houver issue.
5. A Lead valida conforme a trilha e confere o CI. Veja [Testes e auditoria](03-skills-e-testes.md) e o [prompt da Lead](../modelos/prompt-lead.md).
6. A Lead aplica os [critérios de integração direta](01-fluxo-de-ponta-a-ponta.md#integração-direta) e confere os gatilhos pendentes. Quando o merge publica automaticamente, a autorização de publicação vem antes. Registre a decisão e, após integrar, confira a `main` e o CI. Preserve a branch remota e siga a regra de remoção da worktree.

## Ciclo de um bug

Um bug é um comportamento que diverge do combinado (critério de aceite, contrato, referência). Ele segue o ciclo da tarefa, com estes passos a mais ([decisão 014](../decisoes/014-fluxo-de-correcao-de-bugs.md)):

1. **Registro.** Quem acha (a pessoa, uma Builder, um especialista, o monitoramento) abre uma **issue de bug** com o [formulário de bug](../modelos/issue-bug.yml): o que aconteceu, o que era esperado, os passos para reproduzir, onde e a evidência, sem dado pessoal de usuário.
2. **Triagem pela Lead** pelo [impacto e os portões](01-fluxo-de-ponta-a-ponta.md#impacto-da-tarefa):
   - **Incidente** (produção fora do ar, dados de usuários, segurança): segue o Profundo e vai para a pessoa na hora, com o impacto e a contenção.
   - **Bug comum:** use no mínimo o Padrão para regressões de comportamento. A Lead encaixa na prioridade já aprovada e encaminha ao responsável pelo tema. Mudança da prioridade combinada vai à pessoa.
   - **Antes de entregar**, a Lead completa a issue como numa tarefa: arquivos permitidos e proibidos, plano e passo (ou "sem plano" e o motivo) e a ferramenta. Com isso a Builder trabalha sem deduzir permissões, e uma passagem por cota encontra tudo na issue.
   - **Não é bug** (é pedido novo): vira tarefa, e mudar o que será construído é da pessoa.
3. **Dono.** O especialista abre a Builder na ferramenta do seu papel, com o nome de sempre (`Backend Builder #31 · login-expira · Codex`) e a branch `fix/31-login-expira`.
4. **Correção**: reproduzir; achar a **causa raiz**, não o sintoma; escrever um teste que **falha por causa do bug**; a correção mínima; a suíte inteira. O teste fica para sempre, e o mesmo bug não volta.
5. **Bug achado no meio de outra tarefa:** dentro do escopo da tarefa, a Builder corrige ali; **fora do escopo**, abre uma **issue nova** de bug e segue a tarefa dela, sem crescer.
6. **Validação e merge:** a Lead confere o comportamento combinado e repete os passos que reproduziam o bug. A revisão cruzada segue a trilha. A Lead integra sem gatilho. A publicação segue o portão da pessoa.
7. **Aprendizado (Fases 8 e 9):** se a causa foi o processo (uma regra que faltou, uma verificação que não existia), registre a causa na memória do projeto e proponha a verificação que previne a regressão.

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
- Dentro de **uma** sessão também dá para paralelizar com subagentes; isso é outra coisa: os subagentes não têm memória da conversa e devolvem um relatório.

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

**Responsabilidades no Orca:** a Lead classifica o impacto, delega quando necessário, valida a entrega e integra. Builders terminam com PR e CI verde. Uma tarefa delegada tem issue e worktree próprias. Deploy, ação irreversível e merge com gatilho exigem a autorização da pessoa.

**Cada agente usa a ferramenta do seu papel** (seção "Lead e ferramenta por papel", abaixo): Claude Code ou Codex. O Orca também abre outros agentes (Cursor e outros), mas eles não leem o `CLAUDE.md` nem o `AGENTS.md` do projeto.

**Ciclo de uma tarefa:**

1. Para delegar, a Lead abre a issue e cria a tarefa no Orca com a especificação padrão do [prompt da Lead](../modelos/prompt-lead-orca.md) (trilha e motivo, objetivo, requisitos (R-xx), telas em `processo/telas/` quando aplicáveis, aceite, arquivos permitidos e proibidos e verificações, `Closes #N`).
2. O agente constrói, atualiza a branch com a `main`, roda as verificações da trilha, envia a branch, abre o PR e avisa o fim (`worker_done`). Dúvidas ou mudança de alcance vão para a Lead com `ask`.
3. A Lead aplica os critérios de integração direta e verifica os gatilhos. Cria portão para autorização aplicável pendente. Registra decisões diretas no resumo por marco.
4. Com a evidência completa e os portões resolvidos, integra o SHA verificado, confere a `main` e o CI e libera o agente.

**Limite inicial:** 1 Lead e até 3 agentes ao mesmo tempo. O painel e os avisos do Orca facilitam acompanhar; o número sobe ou desce com o caso.

**Na Fase 9:** as conversas dos agentes ficam pesquisáveis com `orca search`; a sessão do método pode consultá-las (só leitura, com a autorização da pessoa) para recuperar correções feitas durante o trabalho.

**O que observar no primeiro projeto:** se algum agente perguntou direto à pessoa em vez de usar `ask`; se os portões seguraram de fato o merge e o deploy; quantos agentes deu para acompanhar; se os scripts de worktree ainda fazem falta.

### Lead e ferramenta por papel

O projeto usa **o Claude Code e o Codex juntos**, para dividir o consumo entre as duas assinaturas ([decisão 013](../decisoes/013-lead-e-builders-com-codex-e-claude.md), aprovada pela pessoa sem caso real; substitui a regra de uma ferramenta só da [decisão 010](../decisoes/010-um-agente-principal-por-projeto.md)). A **Lead fica fixa no Claude Code**; cada outro papel tem uma **ferramenta padrão**, registrada no `processo/DESENVOLVIMENTO.md` na linha `Lead: Claude Code` e na tabela **Ferramenta por papel**:

| Claude Code | Codex |
|---|---|
| Lead, Product, Architect, Frontend, Designer | Backend, Security e Ops |

| Ferramenta | No `worker-start` | Lê no início |
|---|---|---|
| Claude Code | `--agent claude --model claude-opus-5-5` | `CLAUDE.md` |
| Codex | `--agent codex --model gpt-6.1-sol` | `AGENTS.md`, que manda ler o `CLAUDE.md`, o `processo/DESENVOLVIMENTO.md` e a memória |

- **Uma ferramenta só continua possível:** `novo-projeto.sh --agente <claude|codex>` põe todos os papéis, inclusive a Lead, na mesma ferramenta. Mudar a tabela depois é uma decisão da pessoa, anotada na memória do projeto.
- **Os mesmos princípios nas duas.** Use as verificações da trilha, com TDD para mudança de comportamento ou bug. Uma tarefa por branch e PR. Só a Lead integra. Dúvidas sobem com `ask`.
- **A Builder usa a ferramenta padrão do papel de quem a abre.** Se a **cota** dessa ferramenta estiver apertada, o especialista abre a Builder na outra e registra a escolha no campo "Ferramenta" da issue e no nome da Builder (`Backend Builder #12 · login · Claude`).
- **Passagem quando a cota acaba no meio da tarefa:** a Builder faz commit, envia a branch e **comenta na issue onde parou** e qual é o próximo passo. O especialista abre outra Builder, na outra ferramenta, na **mesma branch**, e ela continua a partir do comentário e do campo "Plano e passo" da issue. O estado vive no Git e na issue, nunca só na conversa.
- **Revisão cruzada:** no Padrão e no Profundo, quando o projeto usa as duas ferramentas, o PR recebe **ao menos uma revisão da outra ferramenta**. Com uma ferramenta só, use outra sessão para a revisão independente. No Básico, a revisão focada da Lead basta.
- **A Lead Codex** (só com `--agente codex`) usa o mesmo [prompt da Lead](../modelos/prompt-lead-orca.md) ou o mesmo harness e valida no navegador com um navegador automatizado ([03](03-skills-e-testes.md)).
- **Contrato primeiro, quando back e front correm em paralelo.** Antes da primeira tarefa de construção, uma tarefa fecha o **contrato da API** num arquivo do repositório (`processo/contrato-api.md`, ou o formato que a stack pedir, como OpenAPI), e a pessoa aprova num portão. Depois, o contrato só muda por uma tarefa própria: a mudança que quebra quem usa passa por um portão da pessoa; a aditiva (um campo novo opcional), pela Lead. Cada lado tem a sua pasta (por exemplo, `back/` e `front/`, decididas na Fase 2), e os **arquivos comuns** (CI, dependências da raiz, contrato, memória do projeto) têm um dono só, nunca duas tarefas ao mesmo tempo, nem de ferramentas diferentes.
- **Medição.** A memória do projeto anota, por tarefa, a ferramenta, as passagens, se houve retrabalho e por quê, e o consumo; a Fase 9 compara as duas ferramentas.

**O que observar no primeiro projeto:** quantas passagens houve e se alguma perdeu trabalho; se a revisão cruzada achou algo; se a cota deixou de parar o projeto; se os agentes Codex seguiram o TDD, a verificação e as regras do método.

### Com agentes especialistas

A Lead chama especialistas conforme a tarefa. Cada papel tem um harness que define as entradas, a abordagem, a verificação e a entrega esperada. Backend, Frontend e Ops podem abrir Builders no modo com especialistas. [Decisão sobre os harnesses](../decisoes/020-harnesses-agent-skills.md)

Cada agente usa a **ferramenta do seu papel** (Claude Code ou Codex, seção acima).

| Agente | Tema | Builders | Presença |
|---|---|---|---|
| Lead | coordenação, validação final (QA) e integração | não; coordena os especialistas | sempre |
| Architect | estrutura, contrato da API, dados, confiabilidade, observabilidade, custo | não | quando houver decisão técnica ou mudança de contrato |
| Backend | regras de negócio, APIs, autenticação, banco de dados | até 2 | em tarefa de API, regra de negócio ou dados |
| Frontend | interface construída a partir das telas aprovadas e do design system | até 2 | em tarefa de interface |
| Designer | UI e UX: identidade, design system e todas as telas no Figma (Fase 2, antes do código), registro em `processo/telas/`; não escreve código | não | sob demanda (Fases 1 e 2, tela nova) |
| Security | mapa de riscos e revisão com `security-and-hardening` | não | quando houver desenho inicial, risco sensível ou revisão abrangente autorizada |
| Product | requisitos (fichas R-xx com o peso, em `processo/requisitos.md`), pesquisa com usuários, critérios de aceite | não | sob demanda (Fases 0 a 2) |
| Ops | deploy, CI/CD, nuvem, monitoramento; dono do CI enquanto ativo | 1 por vez | sob demanda |

- **Harnesses:** o gerador com `--especialistas` copia os modelos de [`modelos/agentes/`](../modelos/agentes/) para `processo/agentes/`. O cabeçalho descreve a missão e o gatilho. As seções definem entradas, abordagem, verificação, formato da resposta, regras e composição.
- **Composição:** a Lead aciona as revisões especializadas e reúne pareceres. As personas recomendam outras revisões à Lead. O escopo e os portões do projeto governam o uso de skills e personas.
- **Modelos:** os da ferramenta de cada papel (`claude-opus-5-5` no Claude Code, `gpt-6.1-sol` no Codex); o esforço varia por papel e vai em todo `worker-start` (`--agent <agente> --model <modelo> --effort`).
- **No Orca:** a Lead abre os especialistas; cada especialista abre as suas Builders com `worker-start --worktree new-child`, e o Orca as pendura nele (`--parent`). A dúvida da Builder (`ask`) chega ao especialista; só sobe para a Lead o que ele não pode decidir. **Exige o ajuste Settings → Orchestration → Nested worker depth = 2** (o padrão é 1; testado no Orca 1.4.241). Nem mais nem menos: com 2, uma Builder não abre agentes próprios.
- **Worktrees e visibilidade:** a pessoa vê cada agente no Orca, na sua worktree. Cada especialista abre numa worktree com o nome do tema, **filha da worktree principal** (`worker-start --worktree new-child --name <tema>`, da pasta principal); cada Builder, numa worktree por issue, filha da do especialista (`backend-12-login`, branch `backend/12-login`). **Nome da Builder:** `<Papel> Builder #<issue> · <resumo> · <ferramenta>` no `--display-name` (por exemplo, `Backend Builder #12 · login · Codex`): o papel diz quem responde por ela, a issue é a identidade única (leva à issue, à branch e ao PR), o resumo dá o assunto e a ferramenta diz que cota ela gasta. O mesmo nome vai no título do PR e nos comentários da issue; o especialista aparece só com o nome do papel (`--display-name Backend`). Sem o Orca, a branch segue o `nova-tarefa.sh` (`feat/12-login`) e o nome vai na issue e no PR. Quem só coordena ou revisa lê a worktree do trabalho; numa worktree, só a dona da tarefa escreve. Testado no Orca 1.4.241.
- **Limite:** no máximo 9 sessões ao mesmo tempo. A Lead, especialistas, Builders e revisores contam dentro das 9. Neste modo, isso substitui o limite de "1 Lead e até 3 agentes" do modo Orca.
- **Arquivos comuns mudam de dono:** o contrato da API passa para o Architect, e o CI passa para o Ops enquanto ele está ativo; a Lead fica com as dependências da raiz, a memória do projeto e o CI quando não há Ops. Os especialistas que só coordenam mandam as notas da memória e das referências à Lead (`orca orchestration send --type status`), e ela grava.
- **Integração:** só a Lead integra, fala com a pessoa e resolve portões. Padrão e Profundo têm revisão independente. O Básico tem verificação focada.

**O que observar no primeiro projeto:** se as dúvidas pararam no especialista; quantas sessões a cota aguentou; se dois especialistas cruzaram arquivos; se o Security achou o que a Lead não acharia; se o ida e volta custou mais do que economizou; se cada agente, nas duas ferramentas, leu e seguiu o harness; o consumo por tarefa e por ferramenta.

## Como iniciar

Use o [prompt da sessão Builder](../modelos/prompt-builder.md) e o [prompt da Lead](../modelos/prompt-lead.md). No Orca, use o [prompt da Lead no Orca](../modelos/prompt-lead-orca.md): ele substitui os dois. No modo com especialistas, a Lead usa o [harness dela](../modelos/agentes/lead.md) no lugar do prompt. Um bom primeiro passo é um **piloto pequeno**: 1 Lead e 1 Builder numa tarefa quase só de estilo ou de conteúdo, enquanto a Lead não muda código.
