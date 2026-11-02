---
name: estados-da-tela
description: Use quando for implementar ou revisar uma tela que busca dados, uma lista que pode vir vazia, uma ação que demora (envio, exportação, relatório, upload), ou o que a tela mostra quando a API falha, está lenta ou fora do ar.
---

# Estados da tela

**Quem usa:** as trabalhadoras do front ao construir e o especialista de Design e Front ao revisar.

Toda tela que depende de dados tem pelo menos quatro estados: carregando, vazio, erro e com dados. A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/design-e-front.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/design-e-front.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Liste os estados antes de construir**, um teste para cada: carregando, vazio, erro (o que a pessoa corrige e o problema do serviço, separados) e com dados; numa ação, também em andamento, concluída e cancelada. Fonte: [NN/g, estados vazios](https://www.nngroup.com/articles/empty-state-interface-design/).
2. **Resposta imediata a toda ação** (o botão muda na hora), e o indicador escolhido pela espera esperada:
   - até cerca de 1 s: sem animação;
   - de 2 a 10 s: animação em laço com o texto do que acontece ("Carregando seus pedidos");
   - 10 s ou mais: barra com a porcentagem e, se for longo, o tempo restante e um botão para cancelar;
   - espera que varia (de 1 a 15 s, por exemplo) sem progresso do back: animação com texto e, passados 10 s, um aviso de que está demorando e o botão para cancelar.

   Nunca só "Carregando…" estático, nem "não clique de novo". Fonte: [NN/g, indicadores de progresso](https://www.nngroup.com/articles/progress-indicators/).
3. **Ação longa sem porcentagem do back:** se o back não informa o progresso (ou "item 3 de 50"), peça pelo especialista; enquanto isso, mostre as etapas conhecidas e o tempo esperado, nunca uma porcentagem inventada. Fonte: [NN/g, indicadores de progresso](https://www.nngroup.com/articles/progress-indicators/).
4. **Vazio só depois de carregar.** "Nenhum pedido" durante o carregamento faz a pessoa desconfiar da tela. O vazio diz por que está vazio e oferece a ação seguinte com um link ou botão direto ("Ver produtos"), não só uma instrução. Fonte: [NN/g, estados vazios](https://www.nngroup.com/articles/empty-state-interface-design/).
5. **Erro do serviço não é erro da pessoa:** 5xx, 503 e falha de rede mostram o que aconteceu, o que ela pode fazer (tentar de novo, voltar depois) e não apagam o que ela digitou; permissão negada e página inexistente têm tela própria. Erro de campo segue `metodo:formularios-e-erros`. Fontes: [GOV.UK, mensagem de erro](https://design-system.service.gov.uk/components/error-message/) e [NN/g, erros em formulários](https://www.nngroup.com/articles/errors-forms-design-guidelines/).
6. **Avisos para o leitor de tela:** a mudança de estado é anunciada (`role="status"` para progresso e conclusão, `role="alert"` para erro), sem anunciar cada passo da animação; numa porcentagem, anuncie só marcos (por exemplo, a cada 25%) e a conclusão. Fonte: [WCAG 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html).
7. **Nada pula quando o estado muda:** o carregando ocupa o mesmo espaço que o conteúdo (`metodo:desempenho-na-tela`, passo 4). Fonte: [web.dev, otimizar CLS](https://web.dev/articles/optimize-cls).

## O teste que prova (escreva antes, veja falhar)

| Regra | Teste |
|---|---|
| Estados | com o back simulado, cada estado aparece: carregando, vazio, erro de serviço, com dados |
| Vazio | durante o carregamento não aparece "nenhum item"; o vazio tem a ação |
| Espera longa | a ação de mais de 10 s mostra progresso e cancelar; cancelar volta ao estado inicial |
| Erro do serviço | 503 mostra a mensagem e "tentar de novo", que refaz o pedido, sem perder o digitado |
| Leitor de tela | progresso e conclusão em `role="status"`, erro em `role="alert"` |

## Checklist

- [ ] Todos os estados listados e testados, inclusive os da ação.
- [ ] Indicador pela duração: texto até 10 s, porcentagem acima; cancelar nas longas.
- [ ] Vazio só depois de carregar, com a ação seguinte.
- [ ] Erro do serviço separado do erro de campo, sem perder o digitado.
- [ ] Mudanças anunciadas ao leitor de tela; nada pula.

## Adaptar ao tamanho do projeto

- Página estática sem dados de API: a skill não se aplica.
- Ação que sempre leva menos de 2 s: basta a resposta imediata do botão.
- Projeto com biblioteca de dados (cache, novas tentativas): ela pode cuidar do carregamento e do erro, mas os textos e os estados da tela continuam desta skill.
