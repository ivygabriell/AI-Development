# 01 · Fluxo de ponta a ponta

As dez fases (0 a 9) são a referência da ideia ao fechamento. O impacto da tarefa define a profundidade de cada fase. Antes de construir, defina o alvo e obtenha a aprovação de quem decide. Antes de concluir, mostre a evidência.

## Classificação do pedido

Classifique a natureza do pedido antes de construir. Um spike termina com uma resposta. Uma mudança delimitada altera algo existente dentro de um limite conhecido. Uma mudança arquitetural reorganiza partes do sistema, introduz um subsistema ou começa um produto. Depois avalie as consequências da mudança para escolher a trilha.

## Impacto da tarefa

A Lead classifica antes da implementação e registra na issue ou no PR, em uma linha, **trilha, razão, verificação e portão aplicável**. Considere o que pode mudar ou quebrar, quais usuários e sistemas podem sentir o efeito e como recuperar código, estado e dados. Analise o conjunto quando várias tarefas compõem a mesma entrega. Tamanho do diff e tempo de execução servem para planejar o trabalho.

| Trilha | Quando usar | Como executar | Como validar |
|---|---|---|---|
| **Básico** | Ajuste localizado, reversível e dentro do que já foi aprovado. Sem mudança de comportamento combinado, contrato, fronteira de segurança ou dados. | Registre o objetivo e um aceite verificável. Faça direto em uma branch, com um PR. Para ajuste puramente visual, de texto ou documentação, confira a mudança antes e depois. | Evidência no ponto alterado e nos estados afetados, revisão focada da Lead e CI verde. A própria Lead pode executar e conferir em uma passagem separada. |
| **Padrão** | Comportamento novo ou corrigido, mudança compartilhada ou contrato aditivo com alcance conhecido e volta viável. | Issue com critérios, escopo e passos curtos. Use spec de mudança quando houver uma decisão de desenho que precise ser aprovada. Divida em tarefas quando houver entregas independentes ou dependências a coordenar. | TDD para comportamento, suíte do projeto e revisão independente do que mudou e pode regredir. A revisão cruzada segue a regra dos projetos que usam duas ferramentas. |
| **Profundo** | Vulnerabilidade plausível ou confirmada, incidente, ação difícil de desfazer, quebra de contrato, exposição de dados, mudança em autenticação, permissões ou pagamentos, ou efeito significativo sobre disponibilidade ou usuários de produção. Projeto novo e mudança arquitetural relevante também seguem esta trilha. | Antes da ação de risco, registre desenho ou plano proporcional, quem pode ser afetado, o pior efeito plausível e como conter ou recuperar. Para projeto novo e mudança arquitetural, siga requisitos, spec e plano das fases abaixo. | Revisão independente e especializada nos riscos relevantes. Em produção, valide em ambiente seguro quando possível, prepare a publicação e monitore o resultado. Ensaie a reversão ou confirme a recuperação disponível. A auditoria completa segue o portão da Fase 7. |

- **Spike:** registre a pergunta e como pretende respondê-la. Se a sondagem exigir uma ação externa ou risco relevante, leve essa ação ao portão correspondente. Código destinado a ficar segue a trilha de mudança.
- **Reclassifique antes de avançar.** Se a investigação ampliar o alcance ou revelar um risco, pause a ação afetada, atualize a justificativa e refaça o aceite e as aprovações aplicáveis. Se ainda faltar evidência para descartar um efeito grave, use a trilha mais profunda compatível com o risco.
- **Trilha e autorização são decisões distintas.** A trilha dimensiona o trabalho. Os [portões de aprovação](#portões-de-aprovação) dizem quem autoriza cada ação. Publicar um ajuste básico continua exigindo autorização da pessoa. Se o merge dispara a publicação automática, obtenha a autorização antes do merge.

| Exemplo | Enquadramento |
|---|---|
| Trocar a cor de um botão local, dentro da identidade aprovada | **Básico.** Atualize apenas o frame afetado se o design mudou. Confira a cor, o contraste e os estados afetados no navegador. Aceite curto no PR, sem spec, divisão de tarefas, revisão em cinco eixos ou auditoria de segurança. |
| Alterar uma cor compartilhada em várias telas ou criar um filtro numa listagem | **Padrão** se o alcance for conhecido e a volta for viável. Na cor compartilhada, confira contraste e estados nos usos afetados. No filtro, aprove o comportamento novo e teste resultados, estado vazio e filtros existentes. |
| Permitir exportação de dados de clientes, corrigir falha de autorização ou executar uma migração destrutiva em produção | **Profundo.** Confirme o alcance, envolva Security ou Ops conforme o risco e passe pelo portão antes da ação. Na migração sem volta, registre a recuperação e a contenção possíveis. |

## Fase 0 · Descobrir a intenção

- **Entrada:** o pedido da pessoa, quase sempre incompleto.
- **Passos:** identifique o resultado esperado, para quem é e como saber que deu certo. Pergunte **uma coisa por vez**, de preferência com opções. Escreva de volta o entendimento em poucas linhas, separando o que a pessoa disse do que você supôs.
- **Resultado:** um entendimento que a pessoa reconhece e corrige.
- **Portão:** confirme com a pessoa quando houver ambiguidade relevante ou mudança do combinado. Um pedido explícito dentro do escopo aprovado pode servir de alvo para a Lead.

## Fase 1 · Referências e contexto

- **Entrada:** o entendimento da Fase 0.
- **Passos:** leia o que já existe (código, documentos, histórico). Se há uma referência externa (um site, um app), estude-a de verdade, com medições, e não de memória: veja [04](04-referencias-e-engenharia-reversa.md). Ache a referência pelo **título exato** que a pessoa citou.
- **Resultado:** um registro dos achados (o quê, como, valor, fonte).
- **Portão:** se o que você achou não bate com o que foi pedido, **pare e pergunte**.

## Fase 2 · Desenho e spec

- **Profundidade:** no Básico, o aceite curto fecha o desenho. No Padrão, detalhe só a mudança e escreva uma spec se o desenho exigir decisão formal. A sequência completa abaixo vale para projetos novos e mudanças arquiteturais. Em uma correção sensível, concentre o desenho nos riscos e no plano de verificação.
- **Entrada:** entendimento e achados.
- **Ordem** ([decisão 015](../decisoes/015-requisitos-e-telas-antes-do-codigo.md)): **requisitos → identidade → telas → spec**, cada um com o seu portão; sem interface, **requisitos → spec**. Tudo é aprovado antes do plano, e portanto antes de qualquer código, inclusive do back.
- **Requisitos:** o Product (sem o modo com especialistas, a Lead), no papel de engenheiro de requisitos ou PO, descreve cada requisito numa ficha de `processo/requisitos.md`, pelo [modelo de requisitos](../modelos/modelo-requisitos.md): história, regras de negócio, casos de erro, critérios de aceite, dependências, telas e o peso (valor, esforço, risco), com a prioridade proposta. A pessoa aprova a lista, os pesos e a ordem.
- **Identidade e todas as telas, no Figma** (com interface): o Designer ([decisão 017](../decisoes/017-agente-designer.md); sem o modo com especialistas, a Lead) começa **pedindo as referências da pessoa** (sites, apps, marcas de que ela gosta, e os formatos desejados: celular, tablet, desktop), sem as quais não cria nada, e segue a ordem **referências → identidade → telas nos formatos desejados**. Cria no Figma, pelo servidor MCP oficial, seguindo o padrão **do token à tela**: 1) tokens (cores, tipografia, espaçamentos, em duas camadas), 2) componentes base com variantes e estados, 3) padrões (formulário, lista, vazio, erro), 4) todas as telas de cada requisito, com os estados (vazio, carregando, erro, sucesso), celular e desktop, e 5) o fluxo navegável. Com celular entre os formatos, vale o **mobile-first**: o celular é desenhado e construído primeiro, e tablet e desktop acrescentam. A identidade (etapas 1 a 3, com logo, ícones e tom de voz) tem o seu portão antes das telas (etapas 4 e 5). A cada aprovação da pessoa, o registro entra no repositório por PR: `processo/telas/` com uma captura por tela e estado, a data e o link do frame, e `processo/telas/tokens.json` com os tokens do Figma, e o catálogo `processo/telas/design-system.md`, que o Frontend transforma no design system do código. O link do arquivo fica na linha `Telas:` do `processo/DESENVOLVIMENTO.md`. Toda mudança de tela começa no Figma; o código segue só a versão registrada. Escrever no Figma exige assento Full: ligar é decisão da pessoa (gatilho de custo); sem ele, a pessoa desenha no Figma e os agentes só leem.
- **Passos da spec:** proponha 2 ou 3 abordagens com a sua recomendação; apresente o desenho em partes e peça aprovação a cada parte; escreva a spec (objetivo, restrições, estrutura, dados, critérios de aceite, o que fica de fora) e faça uma autorrevisão (pendências, contradições, ambiguidade, escopo).
- **Mapa de riscos de segurança**, no desenho inicial do projeto e quando uma mudança afeta a exposição ou os controles: use a `security-audit` no modo de orientação, pelo [roteiro de segurança](03-skills-e-testes.md#security-audit). Registre em `processo/seguranca.md` os usuários, as fronteiras de confiança e as superfícies afetadas, com critérios de aceite nas issues. No modo com especialistas, quem faz é o Security. Nos outros, a Lead.
- **Resultado:** `processo/requisitos.md`, a identidade e as telas no Figma registradas em `processo/telas/` (com interface) e a spec versionada, com o mapa de riscos.
- **Portão:** a pessoa aprova, nesta ordem, os requisitos (com os pesos e a ordem), a identidade e todas as telas (com interface) e a spec escrita.

## Fase 3 · Plano

- **Profundidade:** o Básico segue com o aceite registrado. No Padrão, a issue basta quando há um único passo verificável. No Profundo, registre a sequência, dependências, verificações e como parar ou recuperar, conforme a ação.
- **Entrada:** spec aprovada.
- **Passos:** quebre em tarefas pequenas (2 a 5 minutos por passo), cada uma com os arquivos exatos, o teste primeiro, o comando e o resultado esperado. Liste as restrições globais e o que a revisão final precisa olhar.
- **Resultado:** plano versionado.
- **Portão:** a pessoa aprova o plano de projeto novo, mudança arquitetural ou trabalho com gatilho. A Lead decide os passos dentro do que já foi aprovado e escolhe entre execução inline, sessões divididas e Orca, com especialistas quando o projeto tiver esse modo. A Lead fica por padrão no Claude Code. A linha `Lead:` e a tabela Ferramenta por papel em `processo/DESENVOLVIMENTO.md` registram a escolha. Veja [Sessões e papéis](02-sessoes-e-papeis.md).

## Fase 4 · Construir com TDD

- **Entrada:** aceite definido e plano aprovado quando aplicável, em branch própria a partir da `main` atualizada.
- **Passos:** para mudança de comportamento ou correção de bug, escreva o teste, **veja-o falhar pelo motivo certo** e escreva o mínimo para passar. Em ajuste básico sem comportamento ou bug, use a verificação direta do aceite. Rode as verificações da trilha, faça commits pequenos e registre os desvios relevantes.
- **Resultado:** commits na branch, suíte verde, ledger de decisões.
- **Portão:** os testes macro verdes (veja [03](03-skills-e-testes.md)).

## Fase 5 · Validar

- **Entrada:** branch com as verificações previstas para a trilha verdes.
- **Passos:** confira os critérios de aceite, a referência e as evidências da trilha. Use revisão focada no Básico, revisão independente no Padrão e revisão independente com especialistas pertinentes no Profundo. Explore o navegador ou ambiente real nos pontos em que o risco pede.
- **Resultado:** lista de achados classificados (crítico, importante, menor). Críticos e importantes são corrigidos com teste que falha antes; menores viram pendências registradas.
- **Portão:** nenhum crítico ou importante em aberto.

## Fase 6 · Integrar

- **Entrada:** validação concluída.
- **Passos:** envie a branch, deixe o CI rodar, abra o Pull Request com o modelo, traga a `main` para a branch se ela estiver desatualizada, integre (sem apagar a branch remota), confira a `main` e o CI dela.
- **Resultado:** a `main` com a mudança, suítes e CI verdes.
- **Portão:** os gatilhos de aprovação (abaixo): sem gatilho, a Lead integra e registra; com gatilho, só com o "pode integrar" da pessoa.

## Fase 7 · Publicar

- **Entrada:** `main` verde.
- **Passos:** confirme a versão e o alvo da publicação. Para ajuste básico, verifique o ponto alterado após publicar e saiba como voltar. Amplie a verificação conforme o risco: configuração, endereço público, indexação, desempenho, acessibilidade, monitoramento e recuperação. Se houver dados fictícios de exemplo, **uma trava automática** impede a publicação enquanto eles existirem.
- **Auditoria de segurança, antes da primeira publicação** e após mudança relevante de exposição ou controles (login novo, API pública nova, troca de infraestrutura): o Security, ou a Lead, propõe a auditoria completa com a `security-audit` da Cloudflare pelo [roteiro de segurança](03-skills-e-testes.md#security-audit). A pessoa aprova o escopo ou a dispensa, registrada na memória. Achado confirmado crítico ou alto segura a publicação até ser corrigido.
- **Resultado:** o produto no ar.
- **Portão:** a pessoa autoriza a publicação. Se publicar for efeito do merge, esse portão vem antes de integrar. No Profundo, registre também o que observar após publicar e quando interromper ou reverter.

## Fase 8 · Manter

- **Passos:** registre pendências e decisões, atualize a memória do projeto, faça uma retrospectiva curta dos erros e transforme cada erro em uma regra ou em um teste. Em incidentes, registre o impacto e escale para a pessoa. Priorize a dívida técnica por impacto, risco e esforço.
- **Resultado:** pendências visíveis (issues) e a memória em dia.

## Fase 9 · Fechamento (retrospectiva)

Ao fim de um projeto, ou de um marco grande, o método aprende com ele. É o que mantém este repositório vivo.

- **Passos:**
  1. A Lead revê issues e PRs e registra na memória do projeto o que funcionou, o que falhou e as medidas disponíveis. No Orca, pode consultar conversas com `orca search` (só leitura, com a autorização da pessoa).
  2. Transforme aprendizados reutilizáveis em [lições](../licoes/_indice.md) e, quando couber, em teste ou ajuste do fluxo. Registre mudanças de regra em [decisões](../decisoes/_modelo-decisao.md).
  3. Quando houver alteração no método, leve-a por PR com `node scripts/verificar.mjs` verde e a justificativa registrada.
- **Resultado:** memória atualizada. Lições ou mudanças no método entram quando houver algo a aproveitar.
- **Portão:** a pessoa aprova o PR do método, quando houver.

## Portões de aprovação

A pessoa participa só das aprovações com **impacto potencialmente grande**; as demais, a Lead aprova ([decisão 013](../decisoes/013-lead-e-builders-com-codex-e-claude.md)). Uma decisão é **da pessoa** quando aciona **pelo menos um gatilho**:

1. Muda **o que** será construído (escopo, critérios de aceite, prioridade).
2. É **difícil ou impossível de desfazer** (apaga dados, reescreve histórico, configuração de conta).
3. Atinge **usuários reais** (produção, publicação, dados de quem usa).
4. Custa **dinheiro ou muita cota** (serviço pago, nuvem, auditoria completa).
5. **Aceita um risco** de segurança ou de dados pessoais.
6. Muda **as regras do jogo** (harness, método, a Lead, a tabela Ferramenta por papel).

Sem gatilho, decide a Lead e registra na issue, no PR ou na memória do projeto. **Na dúvida, sobe para a pessoa.**

| Fica com a pessoa | Passa para a Lead |
|---|---|
| Entendimento ainda ambíguo, requisitos novos (com pesos e ordem), spec e plano formais | Integrar um PR na `main` com aceite definido, dentro do escopo aprovado, CI verde, validação sem achado crítico nem importante, só arquivos permitidos e nenhum gatilho |
| A identidade e todas as telas (Figma e `processo/telas/`); tela ou requisito novo no meio do projeto | Ajuste pequeno numa tela aprovada, que não muda fluxo, conteúdo nem identidade (espaço, alinhamento, quebra de texto), feito no Figma primeiro e registrado |
| Mudança de escopo ou de critério de aceite já aprovado | Aceite curto e passos da tarefa dentro do escopo |
| Contrato da API que **quebra** quem usa; migração que apaga ou transforma dados | Mudança **aditiva** no contrato (um campo novo opcional) |
| Serviço ou plano pago, recurso de nuvem, auditoria completa de segurança | Dependência gratuita e comum, refatoração interna, testes, documentação, correção de bug que não muda o comportamento combinado |
| Aceitar um risco; deixar aberto um achado crítico ou alto; mudar login, permissões, pagamento ou dados pessoais; incidente | Achados menores (viram pendências) |
| Publicar, mudar um ambiente publicado, reverter a produção | Abrir e fechar Builders, escolher a ferramenta, fazer as passagens por cota |
| Apagar dados, sessões ou branches não integradas (depois de ver o que será apagado); reescrever histórico, `push --force`, proteção, segredos, configuração de conta | Spikes e as dúvidas dos especialistas |

- **Resumo por marco:** a Lead lista o que aprovou sozinha, com os links para as issues e os PRs. A pessoa lê quando quiser e pode reverter qualquer item.
- **Parâmetros por projeto:** a tabela vai para a seção "Aprovações" do `processo/DESENVOLVIMENTO.md`. Quando a pessoa disser "isso a Lead pode decidir daqui para frente" (ou o contrário), a mudança fica anotada ali e na memória.
- O pedido da pessoa é sempre por escrito e **antes** da ação. Uma aprovação vale **para aquela mudança**; aprovar uma coisa não autoriza a seguinte.
- **No repositório do método** nada disso muda: a pessoa aprova cada PR, como manda o `CLAUDE.md` dele.
