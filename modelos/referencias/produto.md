# Base de conhecimento: Produto

**Maturidade:** rascunho (leitura feita em 2026-10-30, sem caso real ainda)
**Agente:** Produto (harness em `modelos/agentes/produto.md`)
**Skills que saem daqui:** `metodo:necessidades-e-riscos` e `metodo:descoberta-continua`

O que a leitura das referências escolhidas pela pessoa ensinou, com palavras próprias: a regra concreta, o porquê e o link. É o segundo lugar onde o agente procura, depois do `docs/referencias/produto.md` do projeto e antes dos sites. O planejamento de uma pesquisa continua com `design:user-research`, e a síntese com `design:research-synthesis`.

## Necessidades (GOV.UK Service Manual)

| Regra | Por quê | Fonte |
|---|---|---|
| Necessidade no formato "Preciso / quero / espero… para que…", do ponto de vista e com as palavras do usuário; opcionalmente quem é, o que dispara e as restrições | o porquê guia a solução | [GOV.UK, necessidades do usuário](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs) |
| Toda necessidade com evidência (dados de uso, buscas, atendimento, pesquisas, entrevistas, observação); opinião sem usuário é suposição a testar | o que não foi visto pode não existir | [GOV.UK, necessidades do usuário](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs) |
| Necessidade descreve o problema, não a solução ("lembrar do prazo", não "receber um e-mail") | o pedido do usuário é uma solução entre várias | [GOV.UK, necessidades do usuário](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs) |
| Pesquisar todo tipo de usuário, inclusive quem tem dificuldade e quem atende os usuários | o usuário típico esconde quem fica de fora | [GOV.UK, necessidades do usuário](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs) |
| Cada rodada de pesquisa com objetivos claros: o problema, as suposições testadas, o que é preciso saber para decidir; 1 hora de análise para cada 2 de pesquisa, no mesmo dia | pesquisa sem pergunta não decide nada | [GOV.UK, planejar uma rodada](https://www.gov.uk/service-manual/user-research/plan-round-of-user-research) |

## Riscos (SVPG)

| Regra | Por quê | Fonte |
|---|---|---|
| Toda funcionalidade tem quatro riscos: valor (vão usar ou comprar?), usabilidade (conseguem usar?), viabilidade técnica (dá para construir com o que se tem?) e viabilidade de negócio (funciona para o negócio: custo, contrato, lei, marca?) | construir o que ninguém usa é o desperdício maior | [SVPG, os quatro grandes riscos](https://www.svpg.com/four-big-risks/) |
| Atacar os riscos cedo, antes de construir, principalmente valor e negócio; valor costuma ser o mais difícil | descobrir depois sai caro | [SVPG, os quatro grandes riscos](https://www.svpg.com/four-big-risks/) |
| Produto responde por valor e negócio; design por usabilidade; engenharia por viabilidade técnica; a solução sai do trabalho junto | cada risco tem quem saiba avaliá-lo | [SVPG, os quatro grandes riscos](https://www.svpg.com/four-big-risks/) |

## Descoberta contínua (Product Talk)

| Regra | Por quê | Fonte |
|---|---|---|
| Árvore de oportunidades: no topo, um resultado de produto (comportamento do usuário no produto, não uma métrica de negócio nem de uma funcionalidade); embaixo, oportunidades (necessidades, dores, desejos) tiradas de entrevistas; embaixo de cada uma, soluções; embaixo de cada solução, as suposições a testar | liga o que se constrói ao resultado | [Product Talk, árvore de oportunidades](https://www.producttalk.org/opportunity-solution-trees/) |
| Oportunidade verdadeira pode ser resolvida de mais de um jeito; se só tem um, é solução | não confundir pedido com problema | [Product Talk, árvore de oportunidades](https://www.producttalk.org/opportunity-solution-trees/) |
| Escolher uma oportunidade-alvo, pensar soluções só para ela, comparar pelo menos três e testar primeiro a suposição mais arriscada de cada | comparar evita apaixonar pela primeira ideia | [Product Talk, árvore de oportunidades](https://www.producttalk.org/opportunity-solution-trees/) |
| Atualizar a árvore a cada 3 ou 4 entrevistas; não reagir a uma entrevista, um chamado ou uma venda isolados; não descartar oportunidade por parecer difícil | o padrão aparece em várias histórias | [Product Talk, árvore de oportunidades](https://www.producttalk.org/opportunity-solution-trees/) |
| Entrevista por história: "me conta da última vez que você…", puxando os detalhes daquela vez e perguntando se foi típica; a resposta geral ("normalmente eu…") é opinião | o que a pessoa fez difere do que ela diz que faz | [Product Talk, entrevistas por história](https://www.producttalk.org/story-based-customer-interviews/) |
