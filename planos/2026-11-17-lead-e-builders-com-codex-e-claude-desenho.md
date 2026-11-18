# Lead e Builders, com Codex e Claude no mesmo projeto: desenho

**Data:** 2026-11-17
**Status:** aprovado pela pessoa em 2026-11-17, em partes, na conversa (nomes, nome das Builders, Lead no Claude, tabela de ferramentas, planejamento e aprovações por gatilho)
**Caso de origem:** nenhum. Como as decisões 007, 008 e 010, entra **aprovado pela pessoa sem caso real**, por pedido explícito dela; o primeiro projeto feito assim vira o caso que confirma ou corrige.

## Intenção

Duas mudanças pedidas pela pessoa na mesma conversa:

1. **Nomes dos papéis em inglês, diretos e com autoridade.** Os nomes atuais (integradora, trabalhadora, coordenadora, Back e Dados...) são descritivos, mas longos, e as trabalhadoras não se distinguem umas das outras no Orca.
2. **Codex e Claude Code dentro do mesmo projeto.** O motivo é o consumo de tokens: uma assinatura só não aguenta o projeto inteiro, e a pessoa quer dividir a carga entre as duas. Isso reverte a regra central da [decisão 010](../decisoes/010-um-agente-principal-por-projeto.md) ("um agente principal, nunca os dois").

**Critério de sucesso:** o projeto anda sem parar por falta de cota; as duas ferramentas seguem as mesmas regras; a pessoa sabe, olhando o nome de qualquer sessão, quem ela é, o que faz e que cota gasta; não há mais retrabalho do que no modo de uma ferramenta.

**Fora do escopo:** escolher a ferramenta automaticamente pela cota (não há como ler a cota restante por comando; quem decide é o especialista, com a pessoa); medir o consumo por ferramenta antes do primeiro projeto.

**Antiobjetivo:** duas ferramentas escrevendo no mesmo arquivo, ou uma tarefa que só a sessão que começou consegue terminar.

## Abordagens consideradas

| Abordagem | Como divide | Troca | Escolha |
|---|---|---|---|
| Por papel fixo (como a 007) | Cada papel numa ferramenta, sempre | Simples, mas uma cota acaba antes da outra e o projeto para | — |
| Por cota | Uma ferramenta principal; tarefas vão para a outra quando a cota aperta | Aproveita as duas, mas sem dono claro de cada papel | — |
| **Misto** | Lead fixo; cada papel tem uma ferramenta **padrão**; a Builder pode ir para a outra quando a cota do padrão aperta | Um único ponto de integração e de portões, com folga de cota | **Escolhida pela pessoa** |

## O que a pessoa decidiu

### Nomes dos papéis

| Antes | Agora |
|---|---|
| Integradora (e a coordenadora do Orca) | **Lead** |
| Produto | **Product** |
| Arquitetura | **Architect** |
| Back e Dados | **Backend** |
| Design e Front | **Frontend** |
| Segurança | **Security** |
| DevOps | **Ops** |
| Trabalhadoras | **Builders** |

### Nome de cada Builder

`<Papel> Builder #<issue> · <resumo> · <ferramenta>`, por exemplo `Backend Builder #12 · login · Codex`. O papel diz quem responde por ela; a issue é a identidade única; o resumo dá o assunto; a ferramenta diz que cota está gastando. Worktree e branch continuam curtas e sem espaços: `backend-12-login` e `backend/12-login`.

### Ferramentas

- **Lead fixo no Claude Code.**
- **Ferramenta padrão por papel:**

| Claude Code | Codex |
|---|---|
| Lead, Product, Architect, Frontend | Backend, Security, Ops |

### Planejamento

Continua como hoje (confirmado com a pessoa): classificar o pedido; no caminho arquitetural, intenção, referências, spec com mapa de riscos e plano, cada um com o seu portão; só então a execução. Aprovar o plano não dispensa o "pode integrar" de cada mudança, e qualquer desvio do plano para e sobe à Lead.

### Aprovações: só o que tem impacto grande chega à pessoa

A pessoa quer participar só das aprovações com impacto potencialmente grande; as demais, a Lead aprova. Uma decisão é **da pessoa** quando aciona **pelo menos um gatilho**:

1. Muda **o que** será construído (escopo, critérios de aceite, prioridade).
2. É **difícil ou impossível de desfazer** (apaga dados, reescreve histórico, configuração de conta).
3. Atinge **usuários reais** (produção, publicação, dados de quem usa).
4. Custa **dinheiro ou muita cota** (serviço pago, nuvem, auditoria completa).
5. **Aceita um risco** de segurança ou de dados pessoais.
6. Muda **as regras do jogo** (harness, método, a Lead, a tabela de ferramentas).

Sem gatilho, decide a Lead. **Na dúvida, sobe para a pessoa** (a classe mais pesada, como hoje).

| Fica com a pessoa | Passa para a Lead (decide e registra na issue ou na memória) |
|---|---|
| Entendimento, spec e plano | Integrar um PR na `main` quando **tudo** vale: dentro do plano aprovado, CI verde, validação sem crítico nem importante, só arquivos permitidos, nenhum gatilho |
| A primeira direção visual (referências e identidade) | Telas seguintes dentro do design system |
| Mudança de escopo ou de critério de aceite | Desenho curto de tarefa delimitada dentro do escopo |
| Contrato da API que **quebra** quem usa; migração que apaga ou transforma dados | Mudança **aditiva** no contrato (campo novo opcional) |
| Serviço ou plano pago, recurso de nuvem, auditoria completa de segurança | Dependência gratuita e comum, refatoração interna, testes, documentação, correção de bug que não muda o comportamento combinado |
| Aceitar risco; deixar aberto achado crítico ou alto; mudar login, permissões, pagamento ou dados pessoais; incidente | Achados menores (viram pendências) |
| Publicar, mudar ambiente publicado, reverter produção | Abrir e fechar Builders, escolher a ferramenta, fazer passagens por cota |
| Apagar, reescrever histórico, `push --force`, proteção, segredos, configuração de conta | Spikes e dúvidas dos especialistas |

- **Resumo por marco:** a Lead lista o que aprovou sozinha, com links para as issues e os PRs; a pessoa pode reverter qualquer item.
- **Parâmetros por projeto:** a tabela fica numa seção "Aprovações" do `docs/DESENVOLVIMENTO.md`. Quando a pessoa disser "isso a Lead pode decidir daqui para frente" (ou o contrário), a mudança fica anotada ali e na memória.
- Substitui o "pode integrar" a cada mudança nos projetos (núcleo 01, "Portões de aprovação"; harnesses; prompts). **Não vale para o repositório do método**, cujo `CLAUDE.md` continua pedindo a aprovação da pessoa em cada PR.

## O fluxo com as duas ferramentas

1. **Preparação, uma vez por computador:** as duas ferramentas com os mesmos plugins e ferramentas (README, "Antes de começar"; o Codex precisa também do engineering e do design). O projeto tem o `CLAUDE.md` e o `AGENTS.md`, como hoje.
2. **Começo do projeto:** o `docs/DESENVOLVIMENTO.md` registra a linha `Lead:` e a tabela de ferramenta padrão por papel, no lugar da linha `Agente principal:`.
3. **Cada tarefa:** o especialista abre a Builder na ferramenta padrão do papel. Se a cota dessa ferramenta estiver apertada, abre na outra e registra a escolha na issue e no nome.
4. **Back e front em paralelo:** contrato da API primeiro e um dono por pasta e por arquivo comum (regra de hoje, sem mudança).
5. **A cota acabou no meio da tarefa (passagem):** a Builder faz commit, envia a branch e comenta na issue onde parou e o próximo passo. O especialista abre outra Builder, na outra ferramenta, na mesma branch, que continua a partir do comentário. O estado vive no Git e na issue, nunca só na conversa.
6. **Revisão cruzada:** todo PR recebe ao menos uma revisão da outra ferramenta. PR feito no Codex: a revisão da Lead (Claude) já cobre. PR feito no Claude: uma revisão de um agente Codex (a Security nos PRs sensíveis; nos outros, uma sessão Codex de revisão aberta pela Lead).
7. **Fase 9:** a memória do projeto anota, por tarefa, a ferramenta, as passagens, o retrabalho e o consumo; o caso compara as duas.

## Escolhas da sessão do método (a pessoa confere ao aprovar)

- **Uma ferramenta só continua possível sem modo novo:** é a tabela com todos os papéis na mesma coluna. O `novo-projeto.sh --agente <claude|codex>` passa a significar "todos os papéis nesta ferramenta"; sem o parâmetro, vale a tabela mista acima.
- **A issue ganha o campo "Plano e passo"** (link para o plano e o passo que ela cobre) e o campo "Ferramenta". É o que deixa a issue bastar sozinha numa passagem entre ferramentas (lacuna achada nesta conversa).
- **Ponytail:** segue só sob demanda no Codex (benchmark da decisão 012); Backend, Security e Ops não o carregam por padrão.
- **Arquivos renomeados no método:** os harnesses (`modelos/agentes/lead.md`, `product.md`, `architect.md`, `backend.md`, `frontend.md`, `security.md`, `ops.md`) e os prompts (`prompt-lead.md`, `prompt-builder.md`, `prompt-lead-orca.md`). O que é histórico (casos, decisões antigas, planos, CHANGELOG) **não** é reescrito; uma nota no topo das decisões 001, 007, 008 e 010 aponta os nomes novos.
- **Projetos existentes:** o `/metodo:atualizar-projeto` ganha duas exceções à regra "só acrescentar", sempre com a lista mostrada à pessoa antes: renomear os harnesses de `docs/agentes/` para os nomes novos e trocar a linha `Agente principal:` pela linha `Lead:` e a tabela.
- **Versão maior (4.0.0):** muda uma regra do núcleo (as duas ferramentas no mesmo projeto) e renomeia arquivos que os projetos copiam.
- **Decisão 013** registra tudo e substitui os itens 1 e 2 da 010; os itens 3 a 6 continuam.

## O que fica para o plano

- A lista exata de arquivos e trechos (os nomes aparecem em cerca de 50 arquivos; "Segurança" e "Produto" também são palavras comuns, então a troca é feita trecho a trecho, nunca por substituição cega).
- As verificações novas em `scripts/verificar.mjs`, escritas antes e vistas falhar (TDD): os arquivos com nomes novos existem, os antigos não, o padrão do nome da Builder aparece no núcleo, a tabela de ferramentas aparece no `DESENVOLVIMENTO.md` gerado, o `--agente` continua aceito.
- **Conferir no Orca** se `worker-start` aceita um nome de exibição com espaços separado do nome da worktree. Se não aceitar, o nome completo da Builder vai na primeira mensagem, na issue e no título do PR, e a worktree fica com o nome curto.
- O que observar no primeiro projeto: quantas passagens houve e se alguma perdeu trabalho; se a revisão cruzada achou algo; se a cota deixou de parar o projeto; se os nomes novos foram usados por todos os agentes.
