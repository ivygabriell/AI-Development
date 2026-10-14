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

## Como iniciar

Use o [prompt da sessão trabalhadora](../modelos/prompt-sessao-trabalhadora.md) e o [prompt da integradora](../modelos/prompt-sessao-integradora.md). Um bom primeiro passo é um **piloto pequeno**: 1 integradora e 1 trabalhadora numa tarefa quase só de estilo ou de conteúdo, enquanto a integradora não muda código.
