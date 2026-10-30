---
name: analise-de-falhas
description: Use quando for decidir o que acontece quando uma parte do sistema ou um serviço externo cai ou fica lento (pagamento, frete, e-mail, busca, recomendações, banco), definir prazos, novas tentativas e alternativas, ou revisar a confiabilidade antes da primeira publicação.
---

# Análise de falhas

**Maturidade:** rascunho (sem caso real ainda). **Quem usa:** a Arquitetura, que registra o comportamento em falha; o back implementa (`metodo:transacoes-e-consultas` e `metodo:trabalho-em-segundo-plano`) e o DevOps mede (`metodo:metas-e-alertas`).

A falha vai acontecer; a análise decide o tamanho do estrago. A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/arquitetura.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/arquitetura.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Liste os fluxos do usuário e dê a cada um uma criticidade** (por exemplo, fechar a compra é crítico; ver recomendações, não). Fonte: [Azure, checklist de confiabilidade](https://learn.microsoft.com/en-us/azure/well-architected/reliability/checklist).
2. **Para cada fluxo crítico, as dependências**, internas e externas, separadas em **fortes** (sem elas o fluxo para) e **fracas** (só um recurso some). Menos dependências fortes é melhor; cada uma precisa de disponibilidade à altura da do sistema. Uma dependência é fraca só se houver alternativa (por exemplo, o frete externo é fraco se existe uma tabela de reserva; sem ela, é forte): escreva a condição no quadro. Probabilidade em três níveis (alta, média, baixa), com o motivo. Fonte: [Azure, análise de modos de falha](https://learn.microsoft.com/en-us/azure/well-architected/reliability/failure-mode-analysis).
3. **Quadro de modos de falha**, uma linha por dependência e modo: fora do ar, lenta, mal configurada, erro de operação, sobrecarga, ataque; leitura e escrita separadas. Colunas: probabilidade, efeito no usuário, mitigação, detecção. Modo raro e caro de mitigar fica anotado, sem mitigação. Fonte: [Azure, análise de modos de falha](https://learn.microsoft.com/en-us/azure/well-architected/reliability/failure-mode-analysis).
4. **Mitigação: redundância ou funcionamento degradado.** Toda chamada a outro serviço tem prazo; repete só se for seguro (com a chave de repetição do contrato, `metodo:contrato-de-api` passo 4, e espera crescente); depois de falhas seguidas, para de chamar por um tempo (disjuntor) e entrega uma alternativa escolhida para aquele fluxo: resposta guardada, resposta genérica, vazio ou falhar rápido com uma mensagem clara. Dependência fraca nunca fica no caminho de uma forte. Fontes: [Netflix, API mais resiliente](https://netflixtechblog.com/making-the-netflix-api-more-resilient-a8ec62159c2d) e [Azure, análise de modos de falha](https://learn.microsoft.com/en-us/azure/well-architected/reliability/failure-mode-analysis).
5. **Resultado desconhecido não é falha:** estourou o prazo numa cobrança ou reserva, o estado fica "a confirmar" e uma conferência posterior resolve; o usuário não vê "falhou, tente de novo". Diga quem confere (uma tarefa em segundo plano), com que frequência, e o prazo máximo em "a confirmar" antes de alertar alguém. Fonte: [Stripe, repetição segura](https://stripe.com/blog/idempotency).
6. **Sobrecarga:** quando há volume para isso, descarte primeiro o tráfego menos importante e diga ao cliente quando repetir. Fonte: [Netflix, descarte priorizado](https://netflixtechblog.com/keeping-netflix-reliable-using-prioritized-load-shedding-6cc827b02f94).
7. **Detecção e ensaio:** cada linha do quadro diz como a falha aparece (métrica, alerta, registro); antes da primeira publicação, simule cada dependência fora do ar e lenta e confira o comportamento; o quadro é revisto quando o sistema muda. Fonte: [Azure, checklist de confiabilidade](https://learn.microsoft.com/en-us/azure/well-architected/reliability/checklist).
8. **Registre** o quadro e as decisões (prazos, alternativas, o porquê) com `engineering:architecture`.

## O teste que prova

| Regra | Ensaio |
|---|---|
| Degradado | com a dependência fraca fora do ar, o fluxo crítico termina |
| Prazo | com a dependência lenta, a resposta chega dentro do prazo, com a alternativa |
| Desconhecido | prazo estourado na cobrança deixa o pedido "a confirmar", e a conferência resolve sem cobrar duas vezes |

## Checklist

- [ ] Fluxos com criticidade.
- [ ] Dependências fortes e fracas de cada fluxo crítico.
- [ ] Quadro com modo, probabilidade, efeito, mitigação e detecção.
- [ ] Prazo, repetição segura, disjuntor e alternativa por dependência.
- [ ] Resultado desconhecido tratado.
- [ ] Ensaio de cada falha antes de publicar; registro feito.

## Adaptar ao tamanho do projeto

- Site sem serviços externos: o quadro tem poucas linhas (hospedagem, banco); o passo 6 não se aplica.
- Projeto pequeno: disjuntor só onde a dependência externa é chamada com frequência; prazo e alternativa sempre.
