---
name: necessidades-e-riscos
description: Use quando um pedido de produto chega como solução ("um app que manda lembretes", "um botão de exportar"), antes de escrever a spec, ou ao avaliar se uma funcionalidade vale ser construída.
---

# Necessidades e riscos

**Maturidade:** rascunho (sem caso real ainda). **Quem usa:** o Produto, antes da spec e dos critérios de aceite. A prioridade final é da pessoa.

A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/produto.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/produto.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Troque a solução pelo problema.** Reescreva o pedido como necessidade, do ponto de vista e com as palavras do usuário: "Preciso / quero… para que…" (com quem é, o que dispara e as restrições, se ajudar). "Receber lembrete no WhatsApp" é solução; "não esquecer de voltar a treinar" é necessidade. A reescrita é hipótese até a evidência do passo 2 chegar; se ainda não houve conversa com usuários, comece pela `metodo:descoberta-continua`. Fonte: [GOV.UK, necessidades do usuário](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs).
2. **Marque a evidência de cada necessidade:** dado de uso, atendimento, entrevista, observação. Sem evidência, é suposição, e fica marcada assim na spec. Diga o tamanho da evidência (quatro conversas mostram um sinal, não um padrão). Inclua quem tem dificuldade e quem atende o usuário (a recepção, o suporte). Fonte: [GOV.UK, necessidades do usuário](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs).
3. **Avalie os quatro riscos** da funcionalidade, cada um com o que se sabe e o que falta saber:
   - **valor:** vão usar ou pagar?
   - **usabilidade:** conseguem usar? (com Design e Front)
   - **viabilidade técnica:** dá para construir com o que se tem? (com a Arquitetura)
   - **viabilidade de negócio:** custo, contrato, lei (LGPD), marca, canal; o que o negócio aguenta?

   Fonte: [SVPG, os quatro grandes riscos](https://www.svpg.com/four-big-risks/).
4. **Comece pelo risco maior, antes de construir** (quase sempre valor ou negócio): uma conversa, um protótipo ou um teste pequeno que responda à pergunta, pela `metodo:descoberta-continua`. Fonte: [SVPG, os quatro grandes riscos](https://www.svpg.com/four-big-risks/).
5. **Entregue à pessoa** as necessidades com evidência, os quatro riscos, o que testar primeiro e uma recomendação; a decisão é dela. Só então a spec, com critérios de aceite verificáveis (`modelos/modelo-criterios-de-aceite.md` do método).

## Checklist

- [ ] Pedido reescrito como necessidade, sem solução dentro.
- [ ] Evidência marcada; suposições assumidas como suposições.
- [ ] Os quatro riscos avaliados, com quem ajuda em cada um.
- [ ] O risco maior testado antes de construir.
- [ ] Recomendação entregue; a decisão ficou com a pessoa.

## Adaptar ao tamanho do projeto

- Projeto pessoal em que a pessoa é o usuário: o passo 2 é a própria experiência dela, escrita; os riscos de valor e negócio pesam menos, os de usabilidade e técnica continuam.
- Mudança pequena numa funcionalidade que já existe: os passos 1 e 3 em poucas linhas.
