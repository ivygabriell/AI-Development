---
name: metricas-de-entrega
description: Use quando a pessoa perguntar se o projeto está entregando bem, ao fechar uma fase ou preparar a Fase 9 (caso do projeto), ou ao decidir o que medir sobre o ritmo e a estabilidade das entregas.
---

# Métricas de entrega

**Maturidade:** rascunho (sem caso real ainda). **Quem usa:** a integradora, que mede, anota na memória do projeto e responde à pessoa.

A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/integradora.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/integradora.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **As cinco métricas, por aplicação, em dois grupos (duas de vazão e três de instabilidade):**
   - **vazão:** tempo da mudança (do commit até estar em produção) e frequência de publicação;
   - **instabilidade:** taxa de falha de mudança (publicações que precisaram de intervenção imediata: voltar ou corrigir às pressas), tempo de recuperação de uma publicação com falha e taxa de retrabalho (publicações não planejadas, puxadas por incidente).

   Fonte: [DORA, métricas](https://dora.dev/guides/dora-metrics/).
2. **Com os dados que já existem:** Git, PRs, CI, os registros de publicação e a memória do projeto (o consumo e o retrabalho por tarefa). Sem publicação em produção ainda, diga isso e meça até a integração na `main`, marcando a diferença. Fonte: [DORA, métricas](https://dora.dev/guides/dora-metrics/).
3. **Linha de base e tendência:** a primeira medição é a referência; as seguintes dizem se melhorou. Junte indicadores que explicam o número (tempo de revisão, PRs devolvidos na validação e o motivo, testes instáveis, tempo do CI). Fonte: [DORA, métricas](https://dora.dev/guides/dora-metrics/).
4. **Não vire meta, não compare, não olhe uma só:** nada de "publicar todo dia até o fim do mês"; nada de comparar com outro projeto; vazão e instabilidade sempre juntas. Fonte: [DORA, métricas](https://dora.dev/guides/dora-metrics/).
5. **Responda à pessoa** com os números, a tendência, dois ou três problemas recorrentes, o que a amostra não permite afirmar e uma recomendação; a decisão é dela. Anote na memória do projeto, que alimenta o caso na Fase 9.

## Checklist

- [ ] As cinco métricas, por aplicação.
- [ ] Dados que já existem; limite dito quando não há produção.
- [ ] Linha de base e tendência, com os indicadores que explicam.
- [ ] Nenhuma meta, nenhuma comparação, nenhuma métrica sozinha.
- [ ] Resposta com limites e recomendação; anotado na memória.

## Adaptar ao tamanho do projeto

- Projeto pequeno, poucas publicações: conte uma a uma; percentuais com amostra pequena enganam.
- Sem incidentes registrados: a taxa de retrabalho e a recuperação ficam "sem dado", não zero.
