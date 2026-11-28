# Registro de mudanças

Segue [versionamento semântico](https://semver.org/lang/pt-BR/): **maior** quando a estrutura ou uma regra do núcleo muda de forma incompatível, **menor** quando entra conteúdo novo (cenário, lição, modelo), **correção** para ajustes de texto. Cada versão grande ou média ganha uma tag Git (`v2.0.0`).

## 10.0.0 (2026-11-27)

- O Agent Skills do Addy é a base das práticas em todas as fases. As trilhas de impacto e os portões do AI Development definem a profundidade e a autorização da tarefa.
- O Security usa `security-and-hardening` e o formato de parecer de `security-auditor`. A revisão abrangente mantém aprovação de escopo e bloqueio de publicação por achados graves confirmados.
- Saem as lições e a pasta do Superpowers. A retrospectiva continua na memória do projeto. Os casos e cenários continuam fora da estrutura.
- As issues registram dependências, aceite e resultados de verificação por incremento. [Decisão 021](decisoes/021-agent-skills-como-base.md)
- Os harnesses registram pareceres e evidências no formato das personas do Addy. A Lead integra direto quando a trilha, o CI no commit e as autorizações permitem. [Decisão 022](decisoes/022-integracao-direta-por-impacto.md)

## 9.0.0 (2026-11-26)

O fluxo passa a ter três trilhas por impacto, com a profundidade da validação definida antes de construir. [Decisão 019](decisoes/019-fluxo-por-impacto.md)

- Básico usa aceite curto e evidência focada. Padrão usa testes e revisão independente. Profundo acrescenta análise de risco, especialistas pertinentes e contenção ou recuperação.
- A pessoa continua autorizando publicações. Se o merge publica automaticamente, a autorização vem antes do merge.
- O Agent Skills do Addy apoia as etapas pertinentes. A `security-audit` da Cloudflare segue o portão de auditoria.
- Os oito harnesses adotam o formato de persona do Addy. O README mostra o fluxo de impacto e a passagem entre os papéis em Mermaid. [Decisão 020](decisoes/020-harnesses-agent-skills.md)
- As pastas de casos e cenários saem do método. A retrospectiva fica na memória do projeto. O gerador recebe a pasta de destino e as opções de agente e especialistas.

## 8.0.0 (2026-11-26)

Primeira etapa da reformulação do método. A [decisão 018](decisoes/018-reduzir-skills-e-plugins.md) mantém a `security-audit` da Cloudflare como única skill do fluxo ativo.

- Sai a distribuição do plugin `metodo`, incluindo as 28 skills locais. O núcleo, os harnesses, os cenários e os modelos orientam o trabalho diretamente.
- Projetos novos continuam a ser preparados com `scripts/novo-projeto.sh`. Para atualizar um projeto existente, compare os modelos numa pasta temporária e aplique as mudanças aprovadas numa branch.
- A auditoria usa a skill da Cloudflare diretamente. O portão, o registro do escopo e a triagem continuam no núcleo.

## 7.0.0 (2026-11-20)

Agente Designer: UI e UX saem do Frontend. Ver a [decisão 017](decisoes/017-agente-designer.md).

- **Designer** (`modelos/agentes/designer.md`): sob demanda nas Fases 1 e 2 e em tela nova; cria a identidade, o design system e todas as telas no Figma pelo padrão **do token à tela** (tokens em duas camadas, componentes, padrões, telas, fluxo) e registra cada aprovação em `processo/telas/` (capturas, `tokens.json` e o catálogo `design-system.md`). Não tem Builders e não escreve código.
- **Sempre pede referências antes de criar:** à pessoa, pela Lead, com os formatos desejados; a ordem é **referências → identidade → telas nos formatos desejados**, e **mobile-first** quando há celular (também no Frontend).
- **Frontend** passa a só construir a partir das telas registradas; lê o Figma, não escreve nele.
- **Skills novas:** `metodo:design-system-do-projeto`, `metodo:telas-e-fluxos` e `metodo:registro-das-telas`; base em `modelos/referencias/designer.md`.
- `novo-projeto.sh` põe o Designer na tabela Ferramenta por papel (Claude Code por padrão); `/metodo:atualizar-projeto` copia o `designer.md` para os projetos que usam o modo com especialistas.
- A Lead abre o Designer na worktree `designer`; ele conta dentro das 9 sessões.

## 6.0.0 (2026-11-18)

O processo do projeto numa pasta só. Ver a [decisão 016](decisoes/016-processo-fora-da-raiz.md), o [desenho](planos/2026-11-18-processo-fora-da-raiz-desenho.md) e o [plano](planos/2026-11-18-processo-fora-da-raiz.md).

- **`processo/`** reúne o que o método cria no projeto: `DESENVOLVIMENTO.md`, `memoria-do-projeto.md`, `requisitos.md`, `telas/`, `agentes/`, `referencias/` e o resto de `docs/`, mais `processo/scripts/` com `nova-tarefa.sh` e `remover-tarefa.sh`. A raiz fica com `README.md`, `CLAUDE.md`, `AGENTS.md`, `.github/`, `processo/` e o código; `docs/` fica livre para o produto.
- `novo-projeto.sh` cria a estrutura nova; modelos, núcleo, skills e cenários usam os caminhos `processo/`.
- **`metodo:atualizar-projeto`** ganha a migração (Exceção 3): `git mv` só dos itens do método, com PR e a aprovação da pessoa.
- `verificar.mjs` falha se um caminho antigo voltar fora do histórico.

## 5.0.0 (2026-11-17)

Requisitos descritos e telas no Figma antes do código. Ver a [decisão 015](decisoes/015-requisitos-e-telas-antes-do-codigo.md), o [desenho](planos/2026-11-17-requisitos-e-telas-antes-do-codigo-desenho.md) e o [plano](planos/2026-11-17-requisitos-e-telas-antes-do-codigo.md).

- **Fase 2 em ordem:** requisitos → identidade → telas → spec (sem interface: requisitos → spec), cada um com o seu portão, tudo antes do plano.
- **Requisitos:** o Product, no papel de engenheiro de requisitos ou PO, descreve cada requisito numa ficha de `docs/requisitos.md` (modelo novo `modelos/modelo-requisitos.md`), com o peso (valor, esforço, risco) e a prioridade proposta; a pessoa decide a ordem.
- **Identidade e todas as telas no Figma**, pelo servidor MCP oficial, registradas em `docs/telas/` (capturas e `tokens.json`) a cada aprovação; toda mudança de tela começa no Figma e o código segue o registro.
- **Aprovações:** requisitos, identidade, todas as telas e tela nova são da pessoa; ajuste pequeno numa tela aprovada fica com a Lead.
- Issue de tarefa e de bug com o campo obrigatório "Requisitos (R-xx)"; o PR diz os requisitos atendidos e confere a tela.
- `novo-projeto.sh` cria `docs/requisitos.md`, `docs/telas/` e a linha `Telas:`; o README ensina a ligar o Figma no Claude Code e no Codex.

## 4.1.0 (2026-11-17)

Fluxo de correção de bugs. Ver a [decisão 014](decisoes/014-fluxo-de-correcao-de-bugs.md).

- **Ciclo de um bug** no `nucleo/02`: registro com o formulário de bug, triagem da Lead pelos gatilhos (incidente vai para a pessoa na hora), dono pelo tema, correção com `superpowers:systematic-debugging` e teste que falha por causa do bug antes da correção, revisão cruzada, merge pela Lead quando o comportamento combinado não muda, e lição quando a causa é de processo.
- **Formulário de bug** (`modelos/issue-bug.yml`), copiado para `.github/ISSUE_TEMPLATE/bug.yml` pelo `novo-projeto.sh` e pelo `/metodo:atualizar-projeto`.
- **Bug fora do escopo** de uma tarefa vira issue nova (prompt da Builder e `CLAUDE.md` do projeto).
- **Correção urgente:** a pessoa escolhe entre reverter e corrigir à frente; o teste que reproduz continua vindo antes.

## 4.0.0 (2026-11-17)

Lead e Builders, Claude Code e Codex no mesmo projeto e aprovações por gatilho. Ver a [decisão 013](decisoes/013-lead-e-builders-com-codex-e-claude.md), o [desenho](planos/2026-11-17-lead-e-builders-com-codex-e-claude-desenho.md) e o [plano](planos/2026-11-17-lead-e-builders-com-codex-e-claude.md).

- **Nomes em inglês:** a integradora (e a coordenadora do Orca) passa a ser a **Lead**, as trabalhadoras são as **Builders**, e os especialistas são **Product, Architect, Backend, Frontend, Security e Ops**. Os harnesses, as referências e os prompts foram renomeados (`modelos/agentes/lead.md`, `modelos/prompt-lead.md`, `modelos/prompt-builder.md`, `modelos/prompt-lead-orca.md`...).
- **Nome de cada Builder:** `<Papel> Builder #<issue> · <resumo> · <ferramenta>` no `--display-name` do Orca, no título do PR e na issue; a worktree e a branch ficam curtas (`backend-12-login`).
- **Claude Code e Codex juntos:** a Lead fica no Claude Code; Product, Architect e Frontend também; Backend, Security e Ops no Codex. A Builder vai para a outra ferramenta quando a cota aperta, com **passagem** pela issue (commit, branch enviada, comentário de onde parou), e todo PR recebe **ao menos uma revisão da outra ferramenta**. O `DESENVOLVIMENTO.md` gerado traz a linha `Lead:` e a tabela **Ferramenta por papel** no lugar da linha `Agente principal:`; `--agente <claude|codex>` põe todos os papéis numa ferramenta só.
- **Aprovações por gatilho:** a pessoa decide só o que muda o que será construído, é difícil de desfazer, atinge usuários reais, custa dinheiro ou muita cota, aceita um risco ou muda as regras do jogo. O resto a Lead decide e registra, inclusive os merges sem gatilho, e escreve um **resumo por marco**. Os projetos ganham a seção `## Aprovações` no `DESENVOLVIMENTO.md`. Não vale para o repositório do método.
- **Issue:** campos "Plano e passo" e "Ferramenta". **PR:** campo "Gatilhos de aprovação". **Memória:** ferramenta e passagens por tarefa.
- **`/metodo:atualizar-projeto`:** renomeia os harnesses de `docs/agentes/` com `git mv` (sem perder a personalização) e troca a linha `Agente principal:` pela linha `Lead:` e a tabela.
- **Verificador:** acusa nome antigo de papel fora do histórico, a regra de uma ferramenta só, um harness sem a ferramenta por papel, uma Builder sem o nome completo e um portão sem os gatilhos.

## 3.1.0 (2026-11-02)

Revalidação completa das lacunas do método e o ponytail. Ver a [decisão 012](decisoes/012-revalidacao-de-lacunas-e-ponytail.md).

- **Nada solto:** cada skill do mapa do `03` tem um agente que a usa, ou está na nova seção "Skills fora dos agentes", com o motivo.
  - A integradora ganha `engineering:testing-strategy`, `engineering:tech-debt`, `engineering:documentation`, `superpowers:diagnosing-superpowers` e `metodo:auditoria-de-seguranca`.
  - Design e Front ganha `design:design-handoff`.
  - As trabalhadoras ganham `superpowers:receiving-code-review`.
  - O mapa e o README passam a citar `design:design-system`, `design:user-research` e `design:research-synthesis`.
- **REA com dono:** Design e Front (referência fechada), Arquitetura (sistema sem código-fonte) e Segurança (o artefato publicado do projeto, um passo novo de `metodo:auditoria-de-seguranca`).
- **Segurança ligada ponta a ponta:** a integradora tem a skill da auditoria, e o DevOps recebe os `needs_validation` de infraestrutura.
- **Lições:** todo harness manda ler as lições do método que tocam o tema.
- **Cenários:** "Skills úteis" aponta para as skills dos agentes.
- **Prompts manuais:** valem para o Claude Code e o Codex.
- **Sessão do método:** usa `superpowers:writing-skills` ao criar ou mudar uma skill do plugin.
- **Ponytail pelo custo:** no Claude Code, menos tokens e menos custo por tarefa (medição do próprio repositório: -45% de tokens de saída, -26% de custo), e o quadro local dele vira a fonte do consumo por tarefa. No Codex, fica só sob demanda até medir, porque nos modelos de raciocínio da OpenAI ele encareceu. Desligado durante a auditoria completa de segurança, que abre muitos subagentes.
- **Ponytail sem surpresa no tempo:** versão conferida (5.3.3); nível por pasta, com a auditoria de segurança numa worktree própria; nunca `/ponytail default`; no Codex, o `AGENTS.md` proíbe carregar a skill sozinho; atualização deliberada, relendo os ganchos; sinais para desligar.
- **Ponytail e as outras skills:** pedido vago passa pelo brainstorming (não vira "a menor versão"); o que os critérios de aceite, o contrato, o harness e as skills do método exigem conta como pedido e não se corta; o veredito de segurança é da Segurança.
- **Ponytail (rascunho):** instalação no README (passo 10) e regras de convivência no `03` e no `CLAUDE.md` e no `AGENTS.md` do projeto. O TDD do método vale por cima; nível `full`, sem o `ultra`; atalhos `shortcut:` viram pendência. Os especialistas revisam com `/ponytail-review`, e a integradora usa `/ponytail-audit` e `/ponytail-debt` na Fase 8.
- **Saem do método quatro skills do engineering**, por decisão da pessoa: `engineering:debug` (repete o `superpowers:systematic-debugging`), `engineering:code-review` (repete o `/ponytail-review`; sem o ponytail, a revisão é o `superpowers:requesting-code-review`), `engineering:tech-debt` (o que só ela cobria foi para a Fase 8 da integradora) e `engineering:standup` (sem papel). Continuam instaladas no plugin engineering; o método só deixa de citá-las.
- **README:** a arquitetura e os conceitos passam a mostrar as lições, a segurança desde o começo, o ponytail e o consumo por tarefa; a lista de skills diz o que saiu do método e por quê; a instalação do ponytail traz as regras de uso seguro.
- **Verificador:** passa a acusar uma skill do mapa sem agente, um harness sem as lições, um cenário sem skill de agente e um prompt preso a uma ferramenta.

## 3.0.1 (2026-11-02)

README reescrito no começo, a pedido da pessoa: o repositório se apresenta como uma **arquitetura de agentes para desenvolvimento** (integradora, especialistas, trabalhadoras e a pessoa nos portões, em Claude Code ou Codex), e não mais como "método com Claude Code". Entra a seção "A arquitetura", com o desenho dos agentes e uma tabela de onde está cada peça. Entra também a seção "Conceitos, harnesses, skills e ferramentas": o glossário (agente principal, integradora, especialista, trabalhadora, harness, skill, base de referências, fases e portões, testes micro e macro, worktree, Orca, contrato da API, mapa de riscos, memória, cenário, caso, lição, decisão), os sete harnesses, todas as skills por origem e as ferramentas. As instruções de atualização e de início citam as duas ferramentas. Nenhuma regra muda.

## 3.0.0 (2026-11-02)

Um agente principal por projeto, a auditoria de segurança dentro da Segurança e o fim do selo de rascunho fora dos cenários, aprovados pela pessoa **sem caso real**. Ver as decisões [010](decisoes/010-um-agente-principal-por-projeto.md) e [011](decisoes/011-sem-rascunho-fora-dos-cenarios.md). Versão maior porque muda uma regra do núcleo: a coordenadora deixa de ser sempre Claude, e a ferramenta deixa de ser escolhida pelo tema.

- **Um agente principal por projeto:** Claude Code (padrão) ou Codex, nunca os dois. A integradora, os especialistas e as trabalhadoras usam a mesma ferramenta. A escolha fica na linha `Agente principal:` do `docs/DESENVOLVIMENTO.md`; o `/metodo:novo-projeto` pergunta, e o `novo-projeto.sh` ganha `--agente <claude|codex>`.
- **Sai** o modo "back com o Codex e front com o Claude" (decisão 007, substituída). O contrato da API primeiro continua, agora para quando back e front são construídos em tarefas paralelas.
- **O Codex pode ser a coordenadora:** o `AGENTS.md` do projeto diz como, e o prompt da coordenadora serve às duas ferramentas.
- **Harnesses neutros:** os sete harnesses e o modelo dizem que a ferramenta é a do projeto, com o modelo de cada uma (`claude-opus-5-5` ou `gpt-6.1-sol`), e os comandos usam `--agent <agente> --model <modelo>`. A cópia em `docs/agentes/` continua igual ao modelo.
- **Skill `security-audit`** ([cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)): instalação no README (passo 9); a Segurança a usa na auditoria completa antes da primeira publicação e depois de mudança grande, só com o portão da pessoa, com os relatórios fora do repositório. Está no mapa de skills do `03`.
- **Sem selo de rascunho fora dos cenários** (decisão 011): o modo Orca, o agente principal, os especialistas e os harnesses, as skills dos agentes, as bases de referências e as skills `novo-projeto` e `atualizar-projeto` passam a valer como regra. As listas "O que observar no primeiro projeto" continuam, como roteiro da Fase 9. Os cenários mantêm o selo de maturidade.
- **Skill nova `metodo:auditoria-de-seguranca`** e a seção "Auditoria completa" na base da Segurança, da leitura do repositório inteiro da `security-audit`: o portão, o perfil e o escopo, a saída fora do repositório, os validadores, a triagem de cada veredito e o cuidado com falha aberta em repositório público. Nas revisões de PR, a Segurança usa o modo de orientação da skill e as âncoras de gravidade dela. A skill entra desde a primeira análise de segurança: o mapa de riscos da Fase 2 segue o roteiro do reconhecimento dela, no modo de orientação, e a auditoria completa vira um passo da Fase 7 em qualquer modo (antes da primeira publicação, sempre se pergunta à pessoa).
- **Ficaram de fora**, por decisão da pessoa: o ponytail (conflita com o TDD do método) e o claude-mem (repete a memória do projeto e aumenta o consumo de tokens). Os motivos estão na decisão 010.
- **Projetos existentes:** o `/metodo:atualizar-projeto` pergunta o agente principal, acrescenta a linha no `DESENVOLVIMENTO.md` e recomenda trocar os harnesses de antes da 3.0.0.

## 2.12.0 (2026-10-30)

Skills do Produto e da Integradora, pelo mesmo processo da [decisão 009](decisoes/009-skills-por-agente.md), aprovadas pela pessoa **sem caso real** (tudo em `rascunho`). Com elas, todos os sete agentes têm skills próprias.

- **Produto:** `necessidades-e-riscos` e `descoberta-continua`, tiradas do GOV.UK Service Manual (necessidades e pesquisa), do SVPG (os quatro riscos) e do Product Talk (árvore de oportunidades, entrevistas por história). O planejamento e a síntese de pesquisa continuam com `design:user-research` e `design:research-synthesis`.
- **Integradora:** `validacao-final` e `metricas-de-entrega`, tiradas de martinfowler.com (pirâmide de testes na prática), do Google Testing Blog (detectores de mudança, mocks, interface pública, testes de ponta a ponta) e da DORA (as cinco métricas).
- **Bases** em `modelos/referencias/product.md` e `modelos/referencias/lead.md`. Os harnesses, a `consultar`, o mapa do `03` e o README apontam para elas.
- Plano em [planos/2026-10-30-skills-produto-e-integradora.md](planos/2026-10-30-skills-produto-e-integradora.md).

## 2.11.0 (2026-10-30)

Skills da Arquitetura, pelo mesmo processo da [decisão 009](decisoes/009-skills-por-agente.md), aprovadas pela pessoa **sem caso real** (tudo em `rascunho`).

- **Skills novas no plugin `metodo`:** `contrato-de-api`, `analise-de-falhas` e `migracao-de-sistema`, tiradas da leitura das referências do harness da Arquitetura (Stripe, Netflix, Slack, Azure Well-Architected), com as regras de API do Zalando e do Google AIP que já estavam na base do back.
- **Base de conhecimento** em `modelos/referencias/architect.md`. O harness, a `consultar`, o mapa de skills do `03` e o README apontam para elas.
- Plano em [planos/2026-10-30-skills-arquitetura.md](planos/2026-10-30-skills-arquitetura.md).

## 2.10.0 (2026-10-30)

Skills da Segurança, pelo mesmo processo da [decisão 009](decisoes/009-skills-por-agente.md), aprovadas pela pessoa **sem caso real** (tudo em `rascunho`).

- **Skills novas no plugin `metodo`:** `autenticacao-e-sessao`, `controle-de-acesso`, `entrada-nao-confiavel` e `incidente-com-dados-pessoais`, tiradas da leitura a fundo das referências do harness da Segurança (NIST SP 800-63B-4, OWASP Cheat Sheets e ASVS 5.0.0, Resolução CD/ANPD nº 15/2024).
- **Quem corrige também usa:** a Segurança não tem trabalhadoras; as trabalhadoras do back e do front usam estas skills quando corrigem o que ela entrega, e os harnesses do back e do front apontam para elas. A decisão sobre comunicar um incidente continua da pessoa.
- **Base de conhecimento** em `modelos/referencias/security.md`. O mapa de skills do `03` e a `consultar` apontam para ela.
- Plano em [planos/2026-10-30-skills-seguranca.md](planos/2026-10-30-skills-seguranca.md).

## 2.9.0 (2026-10-29)

Skills do DevOps, pelo mesmo processo da [decisão 009](decisoes/009-skills-por-agente.md), aprovadas pela pessoa **sem caso real** (tudo em `rascunho`).

- **Skills novas no plugin `metodo`:** `publicacao-gradual`, `metas-e-alertas` e `ci-seguro`, tiradas da leitura a fundo das referências do harness do DevOps (Google SRE, incidentes da Cloudflare) e das que o harness empresta da Segurança (GitHub Security Lab), com a documentação de segurança do GitHub Actions.
- **Base de conhecimento** em `modelos/referencias/ops.md`. O site da FinOps Foundation bloqueou a leitura automática: o resumo de custo ficou marcado para conferir no site; o Kubernetes, só apontado.
- **Harness do DevOps:** a trabalhadora usa as skills do especialista; a especificação do `worker-start` diz quais; a pesquisa passa pela base do método. O mapa de skills do `03` e a `consultar` apontam para elas.
- Plano em [planos/2026-10-29-skills-devops.md](planos/2026-10-29-skills-devops.md).

## 2.8.0 (2026-10-29)

Skills de Design e Front, pelo mesmo processo da [decisão 009](decisoes/009-skills-por-agente.md), aprovadas pela pessoa **sem caso real** (tudo em `rascunho`).

- **Skills novas no plugin `metodo`:** `formularios-e-erros`, `desempenho-na-tela` e `estados-da-tela`, tiradas da leitura a fundo das referências do harness de Design e Front (WCAG 2.2, GOV.UK, NN/g, web.dev, MDN).
- **Decisão da pessoa:** o erro de campo aparece ao avançar ou enviar, como no GOV.UK, e não ao sair do campo (NN/g).
- **Base de conhecimento** em `modelos/referencias/frontend.md`, com os critérios novos da WCAG 2.2 para quem constrói e, só para projetos React, os avisos do React Blog.
- **Harness de Design e Front:** as trabalhadoras usam as skills do especialista; a especificação do `worker-start` diz quais; a pesquisa passa pela base do método. O mapa de skills do `03` e a `consultar` apontam para elas.
- Plano em [planos/2026-10-29-skills-design-e-front.md](planos/2026-10-29-skills-design-e-front.md).

## 2.7.0 (2026-10-29)

Skills por agente, começando por Back e Dados, aprovado pela pessoa **sem caso real** (tudo em `rascunho`). Ver [decisão 009](decisoes/009-skills-por-agente.md).

- **Skills novas no plugin `metodo`:** `api-conforme-contrato`, `migracao-sem-parada`, `transacoes-e-consultas` e `trabalho-em-segundo-plano`, tiradas da leitura a fundo das referências do harness de Back e Dados (Zalando, Google AIP, PostgreSQL, PlanetScale, Shopify). Cada uma traz passo a passo com a fonte de cada passo, o teste que prova cada regra, checklist e "Adaptar ao tamanho do projeto".
- **As trabalhadoras usam as skills do especialista pai** (decidido pela pessoa): a especificação do `worker-start` diz quais skills a tarefa toca, e o especialista revisa pelas mesmas.
- **Base de conhecimento** em `modelos/referencias/backend.md`; o "Como pesquisa" do harness passa por ela depois do `docs/referencias/` do projeto.
- **Núcleo e skills:** o mapa de skills do `03` e a `consultar` apontam para as skills e a base. O verificador confere toda citação `metodo:<nome>` contra as pastas de `skills/`.
- Plano em [planos/2026-10-29-skills-back-e-dados.md](planos/2026-10-29-skills-back-e-dados.md).

## 2.6.1 (2026-10-28)

Correções dos pontos pequenos da revisão final da 2.6.0 (agentes especialistas, rascunho).

- **Visibilidade no Orca (decidido pela pessoa):** cada agente aparece no Orca na sua worktree. A integradora abre cada especialista com `worker-start --worktree new-child --name <tema>`, da pasta principal, e a worktree dele fica filha da principal; cada trabalhadora fica filha da do especialista. Testado no Orca 1.4.241. O harness da integradora traz o comando de cada especialista com os valores concretos, e o cabeçalho de cada harness diz a worktree dele.
- **Limite:** Produto e DevOps contam dentro das 9 sessões, também no `02`.
- **Harnesses:** a Segurança diz que o REA é o MCP `rea`, também no Codex; o DevOps muda o CI pela trabalhadora dele e avisa com `merge_ready`; o modelo diz as duas diferenças do bloco "O harness manda".
- **`AGENTS.md` dos projetos:** sem o plugin, o Codex avisa a coordenadora com `orca orchestration ask`, em vez de pedir à pessoa.
- **`novo-projeto.sh`:** `--especialistas` vale em qualquer posição, também antes da pasta.
- `scripts/verificar.mjs` confere cada ponto (verificações novas, vistas falhar antes).

## 2.6.0 (2026-10-28)

Agentes especialistas ao lado da integradora, no Orca, aprovado pela pessoa **sem caso real** (tudo em `rascunho` até o primeiro projeto feito assim). Ver [decisão 008](decisoes/008-agentes-especialistas.md).

- **Harnesses novos** em `modelos/agentes/`: o modelo comum (10 partes, "O harness manda", "Como pesquisa") e os sete papéis: Integradora, Arquitetura, Back e Dados, Design e Front, Segurança, Produto e DevOps, cada um com as referências escolhidas pela pessoa e validadas.
- **Núcleo:** o `02` ganha a subseção "Com agentes especialistas": quem faz o quê, a ferramenta e o modelo de cada papel, os especialistas abrindo as próprias trabalhadoras (Nested worker depth = 2 no Orca), worktrees por issue com o tema no nome, o limite de 9 sessões. O `01` oferece o modo na Fase 3.
- **Projetos:** `novo-projeto.sh --especialistas` copia os harnesses para `docs/agentes/`; o `CLAUDE.md` e o `AGENTS.md` gerados mandam cada agente ler o seu harness; a memória anota especialista e consumo por tarefa.
- **Skills:** a `novo-projeto` oferece o modo, a `atualizar-projeto` acrescenta os harnesses que faltam, a `consultar` aponta para ele. O prompt da coordenadora avisa que, nesse modo, vale o harness da integradora.
- **README:** o modo em "Iniciar um projeto".
- Desenho em [planos/2026-10-28-agentes-especialistas-desenho.md](planos/2026-10-28-agentes-especialistas-desenho.md) e plano em [planos/2026-10-28-agentes-especialistas.md](planos/2026-10-28-agentes-especialistas.md).

## 2.5.0 (2026-10-22)

Back com agentes Codex e front com agentes Claude, no Orca, aprovado pela pessoa **sem caso real** (tudo em `rascunho` até o primeiro projeto feito assim). Ver [decisão 007](decisoes/007-back-com-codex-e-front-com-claude.md).

- **Núcleo:** o `02` ganha a subseção "Back e front com agentes diferentes": uma só coordenadora, sempre Claude, que inicia o back com `--agent codex` e o front com `--agent claude`; o contrato da API aprovado antes de qualquer tarefa de construção; pastas separadas e arquivos comuns só com a coordenadora; a memória anota o agente e o retrabalho de cada tarefa.
- **Regra do agente (amplia a da 2.4.1):** a coordenadora é sempre Claude; os agentes podem ser Claude ou Codex, e o Codex só entra em projeto que tem `AGENTS.md`.
- **Modelo novo:** `modelos/AGENTS-projeto.md`. O `novo-projeto.sh` gera o `AGENTS.md` do projeto (se já existir, só avisa) e a skill `atualizar-projeto` o acrescenta.
- **Skills:** as três dizem onde achar a cópia do método quando o Codex não troca `${CLAUDE_PLUGIN_ROOT}`; a `novo-projeto` oferece o modo na Fase 3 e a `consultar` aponta para ele.
- **README:** o Codex em "Antes de começar" (plugins, REA, conferência e atualização) e o modo em "Iniciar um projeto".
- Plano em [planos/2026-10-22-back-codex-front-claude.md](planos/2026-10-22-back-codex-front-claude.md).

## 2.4.1 (2026-10-21)

- **Modo Orca:** a coordenadora e os agentes são sempre agentes Claude. O [prompt da coordenadora](modelos/prompt-lead-orca.md) manda abrir cada agente com `worker-start --agent claude`, e o [02](nucleo/02-sessoes-e-papeis.md) e o `CLAUDE.md` dos projetos gerados explicam o motivo: os outros agentes que o Orca abre (Codex, Cursor e outros) não leem o `CLAUDE.md` do projeto nem os plugins `metodo` e Superpowers, e trabalhariam sem o método.
- `scripts/verificar.mjs` confere o `--agent claude` nos três lugares.

## 2.4.0 (2026-10-21)

Modo de execução com o Orca, aprovado pela pessoa **sem caso real** (exceção à regra de ouro; tudo em `rascunho` até o primeiro projeto com o Orca). Ver [decisão 006](decisoes/006-desenvolvimento-orquestrado-com-o-orca.md).

- **Núcleo:** o `02` ganha a seção "Com o Orca": a coordenadora é a integradora e cada agente supervisionado é uma trabalhadora; dúvidas por `orca orchestration ask`; merge e deploy passam por um portão (`gate-create`) que só a pessoa resolve; limite inicial de 1 coordenadora e até 3 agentes. O `01` oferece o Orca no portão da Fase 3 e consulta as conversas com `orca search` na Fase 9; o `05` cria as worktrees pelo Orca.
- **Modelo novo:** `modelos/prompt-lead-orca.md`, com o prompt da coordenadora e a especificação padrão de cada tarefa.
- **Skill nova `/metodo:atualizar-projeto`** (rascunho): traz um projeto que já existe para a versão atual do método, só acrescentando, com uma confirmação e um PR.
- **Projetos gerados:** o `CLAUDE.md` e o `DESENVOLVIMENTO.md` explicam o modo Orca e a atualização; a skill `novo-projeto` oferece registrar o projeto no Orca e o modo Orca na Fase 3; a `consultar` aponta para os dois.
- **README:** o Orca nos pré-requisitos e a seção "Atualizar um projeto que já usa o método".
- Plano em [planos/2026-10-21-orquestracao-orca.md](planos/2026-10-21-orquestracao-orca.md).

## 2.3.2 (2026-10-15)

- README, "Antes de começar": cada ferramenta que o método usa aponta para o seu repositório oficial (Superpowers, engineering e design, REA), para consultar requisitos, uso e atualização. `scripts/verificar.mjs` confere os links.

## 2.3.1 (2026-10-15)

- README, "Adotar em um projeto novo": seção **Antes de começar** com tudo o que um computador precisa para usar o método, em ordem: programas (Claude Code, `git`, Node.js, `gh`), acesso ao repositório privado, plugins Superpowers, engineering e design, o REA (`npx rea-agents setup`), o plugin `metodo` e como conferir a instalação.
- `scripts/verificar.mjs` confere que o README instala todo plugin cujas skills o método cita, o REA e a conferência final.

## 2.3.0 (2026-10-15)

- **Plugin `metodo`:** este repositório passa a ser também um plugin do Claude Code (`.claude-plugin/marketplace.json`). Em qualquer computador com acesso a ele: `/plugin install metodo --marketplace ivygabriell/AI-Development` ([decisão 005](decisoes/005-iniciar-projeto-com-uma-skill.md)).
- **Skill `/metodo:novo-projeto`** (`skills/novo-projeto/`, maturidade `rascunho`): inicia um projeto com um comando, com uma confirmação antes de criar o repositório no GitHub e parando nos portões das fases.
- **Skill `metodo:consultar`** (`skills/consultar/`): diz às sessões do projeto onde está a cópia do método e o que ler em cada situação.
- `scripts/novo-projeto.sh` gera o `CLAUDE.md` do projeto (`modelos/CLAUDE-projeto.md`), que importa o `DESENVOLVIMENTO.md` e a memória; se já existir um, só avisa.
- `modelos/ci-node.yml` passa com o aviso "stack ainda não definida" enquanto não há `package.json`.
- Pasta nova `planos/`, com o [plano desta mudança](planos/2026-10-15-skill-novo-projeto.md).
- README: "Adotar em um projeto novo" passa a ter o caminho pelo plugin e o caminho manual.

## 2.2.0 (2026-10-14)

- **Caso novo:** Repositório do método (2026-10), marco da publicação no GitHub e do primeiro PR.
- **Lição 019:** proteção da `main` indisponível em repositório privado (HTTP 403 numa conta gratuita).
- [05 · Git, GitHub e CI](nucleo/05-git-github-e-ci.md) e o README avisam que a proteção da `main` depende do plano e dizem o que fazer sem ela.
- `CLAUDE.md`: a `main` deste repositório fica sem proteção no GitHub, por decisão da pessoa; a regra vale pela disciplina da sessão.

## 2.1.0 (2026-10-14)

- `scripts/novo-projeto.sh` avisa no stderr quando um cenário escolhido tem maturidade `rascunho` (sem interromper o script) e o `docs/DESENVOLVIMENTO.md` gerado marca a maturidade de cada cenário. Assim um rascunho não é tratado como regra comprovada ([decisão 004](decisoes/004-repositorio-do-metodo-em-camadas.md), caso do portfólio pessoal).
- `scripts/verificar.mjs` cobre o aviso e a marcação de maturidade.

## 2.0.0 (2026-10-14)

Reorganização em camadas, para o método crescer com novos cenários e casos de uso.

- **Estrutura nova:** `nucleo/` (método base), `cenarios/`, `casos/`, `licoes/`, `decisoes/`, `modelos/` e `scripts/`.
- **Cenários:** o antigo documento "Adaptando para outros projetos" virou um arquivo por tipo de projeto (8 cenários), com selo de maturidade, skills úteis e checklist. Sem cenário de ERP por enquanto.
- **Lições:** o antigo documento de erros virou um arquivo por lição (18), com índice gerado por `scripts/gerar-indice-licoes.mjs`.
- **Casos e decisões:** primeiro caso (portfólio pessoal) e quatro decisões registradas.
- **Fase 9 de fechamento:** cada projeto termina alimentando o método. Regra: nada entra sem um caso real.
- **Novos scripts:** `scripts/novo-projeto.sh` (prepara um projeto novo com os modelos e carimba a versão do método) e o verificador movido para `scripts/verificar.mjs`, agora também no CI.
- **Sessão do método:** `CLAUDE.md` e `modelos/prompt-sessao-do-metodo.md` para uma sessão dedicada a manter este repositório.
- **Quebra:** os arquivos `01` a `05` foram movidos para `nucleo/`; `06` e `07` deixaram de existir (substituídos por `licoes/` e `cenarios/`).

## 1.1.0 (2026-10-14)

- Regra nova: as branches integradas ficam no GitHub (nunca apagar a remota). Lições 17 (apagar a branch remota por hábito) e 18 (pasta que sobra depois de remover uma worktree).

## 1.0.0 (2026-10-14)

- Primeira versão: princípios, fluxo (fases 0 a 8), sessões e papéis, skills e testes, referências e engenharia reversa, Git, GitHub e CI, 16 lições, 8 tipos de projeto, modelos e verificador.
