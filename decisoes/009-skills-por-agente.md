# 009 · Skills por agente, tiradas das referências de cada harness

**Data:** 2026-10-29
**Status:** aceita pela pessoa **sem caso real** (exceção à regra de ouro, pedida por ela, como na [decisão 008](008-agentes-especialistas.md)); tudo o que esta decisão acrescenta fica como `rascunho` até o primeiro projeto que usar as skills virar caso
**Caso de origem:** nenhum ainda. O primeiro projeto com agentes especialistas confirma ou corrige esta decisão.

## Contexto

Na 2.6.0, cada harness passou a listar as referências que a pessoa escolheu, mas o agente só as lia quando uma decisão não estava respondida pelo contrato e pela arquitetura. A pessoa quis que a qualidade de cada agente viesse de aplicar essas fontes sempre, e não só na hora de pesquisar.

A sessão do método leu a fundo as referências de Back e Dados (Zalando, Google AIP, documentação do PostgreSQL, PlanetScale, Shopify Engineering) e propôs quatro skills; a pessoa aprovou as quatro. Um teste com uma trabalhadora sem as skills mostrou que ela já sabia boa parte das regras, mas falhou onde as skills miram: divergiu do contrato "para registrar depois", fez um cursor legível e sem desempate, devolveu lista solta, escreveu migração sem volta, afirmou que um índice cobria uma chave estrangeira sem cobrir e não escreveu nenhum teste de repetição, concorrência ou versão da tarefa. O plano está em [planos/2026-10-29-skills-back-e-dados.md](../planos/2026-10-29-skills-back-e-dados.md).

## Decisão

1. **Cada agente especialista pode ter skills próprias** no plugin `metodo`, tiradas da leitura das referências do seu harness, de 2 a 4 por agente, só onde as fontes dão orientação concreta. Cada skill traz passo a passo com a fonte de cada passo, o teste que prova cada regra, um checklist e "Adaptar ao tamanho do projeto".
2. **As trabalhadoras usam as skills do especialista pai** (decidido pela pessoa): a trabalhadora aplica ao construir a skill que a tarefa toca, e a especificação do `worker-start` diz qual; o especialista usa as mesmas ao revisar, como checklist.
3. **Uma base de conhecimento por agente** em `modelos/referencias/<agente>.md`, com o que a leitura ensinou (regra, porquê, link). No "Como pesquisa" do harness, ela vem logo depois do `docs/referencias/<agente>.md` do projeto e antes dos sites.
4. **Um agente por vez**, com a aprovação da pessoa. Começa por Back e Dados; os outros seguem em mudanças próprias.
5. **Sem duplicar** skills que já existem (`engineering:system-design`, `engineering:architecture`, `design:accessibility-review`, `security-review`): as do agente são regras concretas com fonte, não o assunto em geral.

## Consequências

- A trabalhadora recebe as regras do tema já resumidas e com fonte, sem precisar pesquisar a cada tarefa; o especialista revisa pelo mesmo checklist que ela seguiu.
- As skills precisam funcionar no Codex, que roda o back: usam a mesma alternativa de caminho das outras skills do plugin ("dois níveis acima").
- O texto das skills é resumo próprio das fontes; quando uma fonte mudar, a skill e a base precisam ser relidas.
- O que observar no primeiro projeto: se a trabalhadora abriu a skill que a especificação pediu, se o teste de cada regra foi escrito antes, se as lacunas do contrato subiram em vez de virar divergência e se a skill pesou no consumo por tarefa.
- Arquivos que mudam: `skills/api-conforme-contrato/`, `skills/migracao-sem-parada/`, `skills/transacoes-e-consultas/` e `skills/trabalho-em-segundo-plano/` (novos), `modelos/referencias/back-e-dados.md` (novo), `modelos/agentes/back-e-dados.md`, `skills/consultar/SKILL.md`, `nucleo/03-skills-e-testes.md`, `scripts/verificar.mjs`, `README.md`, `casos/2026-10-repositorio-do-metodo.md`, `planos/2026-10-29-skills-back-e-dados.md`, `CHANGELOG.md`, `VERSION` (2.7.0).
