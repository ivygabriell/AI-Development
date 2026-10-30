---
name: descoberta-continua
description: Use quando for conversar com usuários ou clientes, organizar anotações de entrevistas, decidir qual problema atacar primeiro, ou escolher entre soluções antes de escrever a spec.
---

# Descoberta contínua

**Maturidade:** rascunho (sem caso real ainda). **Quem usa:** o Produto. O planejamento formal de uma pesquisa segue `design:user-research`, e a síntese, `design:research-synthesis`. A prioridade final é da pessoa.

A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/produto.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/produto.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Um resultado no topo:** o comportamento do usuário no produto que se quer mudar (por exemplo, "mais alunos treinando toda semana"), com um número de partida e uma meta; não uma métrica de negócio nem "usar a funcionalidade X". Sem número ainda (projeto novo), registre a lacuna e o jeito de medir; a primeira medição vira a partida. Esta skill vem antes da `metodo:necessidades-e-riscos`: aqui se escolhe o problema e a solução; lá se confere o que vai virar spec. Fonte: [Product Talk, árvore de oportunidades](https://www.producttalk.org/opportunity-solution-trees/).
2. **Entrevista por história:** "me conta da última vez que você…", puxando os detalhes daquela vez e perguntando se foi típica. "Normalmente eu…" e "eu faria…" são opinião. Cada rodada tem objetivo claro, e a análise sai no mesmo dia. Fontes: [Product Talk, entrevistas por história](https://www.producttalk.org/story-based-customer-interviews/) e [GOV.UK, planejar uma rodada](https://www.gov.uk/service-manual/user-research/plan-round-of-user-research).
3. **Das anotações para oportunidades:** separe o que a pessoa fez (fato) do que ela acha (opinião) e do pedido (solução). Oportunidade é uma necessidade, dor ou desejo que pode ser resolvido de mais de um jeito; se só tem um jeito, é solução. Agrupe as oportunidades nos momentos da experiência do usuário. Fonte: [Product Talk, árvore de oportunidades](https://www.producttalk.org/opportunity-solution-trees/).
4. **Escolha uma oportunidade-alvo** e pense soluções só para ela; **compare pelo menos três**. Não descarte uma oportunidade por parecer difícil. Fonte: [Product Talk, árvore de oportunidades](https://www.producttalk.org/opportunity-solution-trees/).
5. **Teste a suposição mais arriscada de cada solução** antes de escolher (uma conversa, um protótipo, um dado já existente); só a que sobreviver vira spec. Fonte: [Product Talk, árvore de oportunidades](https://www.producttalk.org/opportunity-solution-trees/).
6. **Atualize a árvore a cada 3 ou 4 entrevistas;** não reaja a uma entrevista, um chamado ou uma venda isolados. Guarde a árvore pelo caminho que o harness do Produto manda para a memória do tema. Fonte: [Product Talk, árvore de oportunidades](https://www.producttalk.org/opportunity-solution-trees/).

## Checklist

- [ ] Resultado de produto no topo, com número de partida.
- [ ] Entrevistas sobre a última vez, não sobre opinião.
- [ ] Fato, opinião e solução separados; oportunidades com mais de uma saída.
- [ ] Uma oportunidade-alvo e pelo menos três soluções comparadas.
- [ ] Suposição mais arriscada testada antes da spec.
- [ ] Árvore atualizada e guardada.

## Adaptar ao tamanho do projeto

- Sem usuários além da pessoa: os passos 1, 3 e 4 continuam com as histórias dela; o passo 2 vira ela contando a última vez.
- Poucas entrevistas possíveis: diga na recomendação o tamanho da amostra e o que ela não permite afirmar.
