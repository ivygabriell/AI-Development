# 013 · Lead e Builders, com Codex e Claude no mesmo projeto e aprovações por gatilho

**Data:** 2026-11-17
**Status:** aceita pela pessoa **sem caso real** (exceção à regra de ouro, pedida por ela, como nas decisões [007](007-back-com-codex-e-front-com-claude.md), [008](008-agentes-especialistas.md) e [010](010-um-agente-principal-por-projeto.md)). Substitui os itens 1 e 2 da [decisão 010](010-um-agente-principal-por-projeto.md) e os nomes dos papéis das decisões [001](001-sessoes-divididas-integradora-e-trabalhadoras.md) e [008](008-agentes-especialistas.md).
**Caso de origem:** nenhum ainda. O primeiro projeto feito assim vira o caso que confirma ou corrige esta decisão.

## Contexto

Na 3.0.0 ([decisão 010](010-um-agente-principal-por-projeto.md)), cada projeto passou a usar uma ferramenta só, o Claude Code ou o Codex. A pessoa precisou voltar a usar as duas no mesmo projeto: o consumo de tokens de um projeto inteiro não cabe numa assinatura só.

Na mesma conversa ela pediu outras três mudanças:

- **Nomes dos papéis em inglês, diretos e com autoridade.** "Integradora", "trabalhadora", "coordenadora", "Back e Dados" e "Design e Front" eram longos, e as trabalhadoras não se distinguiam umas das outras no Orca.
- **Nome de cada Builder.** No Orca, a pessoa precisa saber de relance quem é cada Builder, o que faz e que cota gasta.
- **Aprovações só do que tem impacto grande.** As demais, a Lead aprova.

Ela confirmou também o planejamento de hoje (classificar o pedido; intenção, referências, spec e plano, cada um com o seu portão; só então a execução).

Desenho: [planos/2026-11-17-lead-e-builders-com-codex-e-claude-desenho.md](../planos/2026-11-17-lead-e-builders-com-codex-e-claude-desenho.md). Plano: [planos/2026-11-17-lead-e-builders-com-codex-e-claude.md](../planos/2026-11-17-lead-e-builders-com-codex-e-claude.md).

## Decisão

Decidido pela pessoa em 2026-11-17:

1. **Nomes:** Lead (a antiga integradora e a coordenadora do Orca), Product, Architect, Backend, Frontend, Security, Ops e Builders (as antigas trabalhadoras). Os harnesses, as referências e os prompts têm os nomes novos (`modelos/agentes/lead.md`, `modelos/prompt-lead.md`, `modelos/prompt-builder.md`, `modelos/prompt-lead-orca.md`...).
2. **Nome de cada Builder:** `<Papel> Builder #<issue> · <resumo> · <ferramenta>` (por exemplo, `Backend Builder #12 · login · Codex`), no `--display-name` do Orca, no título do PR e nos comentários da issue; a worktree e a branch ficam curtas (`backend-12-login`, `backend/12-login`).
3. **Lead fixo no Claude Code** e **ferramenta padrão por papel**: Claude Code para a Lead, Product, Architect e Frontend; Codex para Backend, Security e Ops. A Builder vai para a outra ferramenta quando a cota da padrão aperta.
4. **Aprovações por gatilho:** uma decisão é da pessoa quando muda o que será construído; é difícil ou impossível de desfazer; atinge usuários reais; custa dinheiro ou muita cota; aceita um risco de segurança ou de dados pessoais; ou muda as regras do jogo. Sem gatilho, decide a Lead, e na dúvida sobe para a pessoa. Um PR dentro do plano aprovado, com CI verde, validação sem achado crítico nem importante, só nos arquivos permitidos e sem gatilho, a Lead integra sozinha. Não vale para o repositório do método, onde a pessoa continua aprovando cada PR.

**Escolhas da sessão do método** (a pessoa confere ao ler o PR):

- Uma ferramenta só continua possível sem modo novo: `novo-projeto.sh --agente <claude|codex>` põe todos os papéis, inclusive a Lead, na mesma ferramenta.
- **Passagem por cota:** a Builder faz commit, envia a branch e comenta na issue onde parou; outra Builder, na outra ferramenta, continua na mesma branch. A issue ganha os campos "Plano e passo" e "Ferramenta" para bastar sozinha.
- **Revisão cruzada:** todo PR recebe ao menos uma revisão da outra ferramenta (o PR feito no Claude, de um agente Codex: o Security nos sensíveis, uma sessão Codex de revisão nos outros).
- **Resumo por marco:** a Lead lista o que aprovou sozinha, com os links, e a pessoa pode reverter qualquer item. Os parâmetros ficam na seção "Aprovações" do `docs/DESENVOLVIMENTO.md` de cada projeto.
- Mudança **aditiva** no contrato da API passa para a Lead; a que **quebra** quem usa continua com a pessoa.
- No Codex, o ponytail continua só sob demanda ([decisão 012](012-revalidacao-de-lacunas-e-ponytail.md)).
- O histórico (casos, planos antigos, lições, decisões, CHANGELOG) não é reescrito; só os caminhos dos arquivos renomeados foram atualizados, para os links continuarem válidos.
- O `/metodo:atualizar-projeto` ganha duas exceções à regra "só acrescentar": renomear os harnesses de `docs/agentes/` e trocar a linha `Agente principal:` pela linha `Lead:` e a tabela.
- Versão maior (4.0.0): muda regras do núcleo e renomeia arquivos que os projetos copiam.

## Consequências

- O projeto usa a cota das duas assinaturas, e uma cota esgotada não para mais o trabalho.
- A pessoa aprova menos coisas, e a Lead carrega a responsabilidade de reconhecer os gatilhos; o resumo por marco é a rede de segurança.
- As duas ferramentas precisam dos mesmos plugins em cada computador (o Codex também com o engineering e o design).
- A passagem entre ferramentas depende de a issue e a branch bastarem; o que ficar só na conversa se perde.
- Projetos 3.x precisam do `/metodo:atualizar-projeto` para renomear os harnesses e trocar a linha do agente principal.
- O que observar no primeiro projeto: quantas passagens houve e se alguma perdeu trabalho; se a revisão cruzada achou algo; se a cota deixou de parar o projeto; se todos os agentes usaram os nomes novos; quantas decisões da Lead a pessoa reverteu.
- Arquivos que mudam: `nucleo/01`, `02`, `03`, `05`; `modelos/agentes/` (renomeados), `modelos/referencias/` (renomeados), os prompts (renomeados), `modelos/CLAUDE-projeto.md`, `modelos/AGENTS-projeto.md`, `modelos/memoria-do-projeto.md`, `modelos/issue-tarefa.yml`, `modelos/pull_request_template.md`, `scripts/novo-projeto.sh`, `scripts/verificar.mjs`, `skills/`, `README.md`, `CHANGELOG.md`, `VERSION` (4.0.0).
