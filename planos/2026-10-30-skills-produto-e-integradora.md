# Skills do Produto e da Integradora: plano

**Objetivo:** os dois últimos agentes ganham skills no plugin `metodo`, tiradas da leitura das referências dos seus harnesses, e uma base de conhecimento cada. Nenhum dos dois tem trabalhadoras: as skills servem a eles. Tudo em `rascunho`, pelo mesmo processo da [decisão 009](../decisoes/009-skills-por-agente.md). Os dois foram feitos juntos, numa mudança só, por serem os menores.

**Combinado com a pessoa (2026-10-30):** "pode seguir criando as outras".

## Tarefas

- [x] **Leitura:** GOV.UK Service Manual (necessidades do usuário, planejar uma rodada de pesquisa), SVPG (os quatro grandes riscos), Product Talk (árvore de oportunidades, entrevistas por história; parte do conteúdo é paga, usado só o aberto), martinfowler.com (pirâmide de testes na prática), Google Testing Blog (testes detectores de mudança, não abuse de mocks, prefira a interface pública, não faça mock do que não é seu, chega de mais testes de ponta a ponta) e DORA (as cinco métricas). O Thoughtworks Radar ficou apontado na base. Links conferidos.
- [x] **Verificações antes (vistas falhar):** o verificador confere também as duas bases, as quatro skills e a parte 5 dos dois harnesses. 42 falhas antes do conteúdo.
- [x] **Linha de base (RED):** uma agente sem as skills fez as tarefas de Produto (pedido que chega como solução; anotações de quatro entrevistas) e de Integradora (PR com testes presos à implementação, mocks e um teste instável; "estamos entregando bem?"). O resultado foi bom. Falhas observadas: a necessidade não foi escrita no formato com o "para que", os quatro riscos não apareceram como quadro, foi direto para uma solução sem comparar três nem nomear o resultado de produto, aceitou mock da biblioteca do WhatsApp em vez de envolvê-la numa interface do projeto, e mediu "estamos entregando bem?" por PRs por semana, sem as métricas da DORA (publicação, falha de mudança, recuperação, retrabalho).
- [x] **Skills, bases, harnesses, `consultar`, mapa do `03`, README, caso, `CHANGELOG.md` e `VERSION` (2.12.0).**
- [x] **Teste com as skills (GREEN):** a mesma agente, com as skills, escreveu a necessidade com o "para que", fez o quadro dos quatro riscos, nomeou o resultado de produto, comparou três soluções, pediu a interface do projeto em volta da biblioteca do WhatsApp e mediu as cinco métricas da DORA, com "sem dado" onde não havia incidente.
- [x] **Ajustes (REFACTOR), do que ela apontou:** sem número de partida, registrar a lacuna e medir primeiro; a ordem entre as duas skills do Produto; a reescrita como necessidade é hipótese até a evidência; o tamanho da evidência; mutação numa cópia local e só nos critérios de maior risco; a integradora pede a interface, não a faz; o tempo do CI anotado; as cinco métricas em dois grupos.
- [ ] `node scripts/verificar.mjs` verde; PR com o modelo preenchido, só com a confirmação da pessoa.
