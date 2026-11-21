---
name: telas-e-fluxos
description: Use quando for desenhar as telas de um requisito com interface (depois da identidade aprovada), definir os estados e as larguras de cada tela, ligar as telas num fluxo navegável, ou revisar um desenho antes de pedir a aprovação da pessoa.
---

# Telas e fluxos

**Quem usa:** o Designer ao desenhar e revisar; o Frontend e as Builders dele ao ler a tela e conferir se nada ficou por adivinhar.

Vem depois das referências e da identidade aprovada, e são as etapas 4 e 5 do padrão "do token à tela": as telas e o fluxo, só com os componentes e os padrões da identidade aprovada (`metodo:design-system-do-projeto`). A base de conhecimento fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/designer.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/designer.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Uma tela por pergunta da ficha, não por palpite.** Releia a ficha R-xx: a história diz quem faz o quê, as regras e os casos de erro dizem o que a tela mostra, os critérios de aceite dizem quando está certa. Liste as telas que o requisito precisa e o caminho entre elas antes de abrir o Figma. Tela que nenhum requisito pede não se desenha. Fonte: [NN/g, heurísticas](https://www.nngroup.com/articles/ten-usability-heuristics/).
2. **Nomeie pelo requisito:** `R-03 · Entrar`, `R-03 · Entrar · erro`. É o que liga o Figma, a issue, o PR e `processo/telas/`. Fonte: [Ajuda do Figma, componentes](https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma).
3. **Desenhe só com o sistema:** componentes do catálogo e tokens semânticos; se faltou uma peça, pare, acrescente-a ao sistema (`metodo:design-system-do-projeto`, passo 4) e só então use. Fonte: [GOV.UK, padrões](https://design-system.service.gov.uk/patterns/).
4. **Todos os estados de dado**, cada um num quadro: com dados, carregando, vazio (com o porquê e a ação seguinte), erro do serviço e erro de campo, sucesso; numa ação longa, também em andamento e cancelada. O que a tela mostra de dado e de erro tem de existir no contrato da API (`processo/contrato-api.md`); se não existe, suba ao Architect pela Lead. Fonte: [NN/g, estado vazio](https://www.nngroup.com/articles/empty-state-interface-design/) e `metodo:estados-da-tela`.
5. **Formulários:** o erro aparece ao avançar ou enviar, com um resumo no topo e a mensagem junto do campo (padrão GOV.UK, decidido pela pessoa); desenhe os dois lugares do erro. Fonte: [GOV.UK, validação](https://design-system.service.gov.uk/patterns/validation/) e `metodo:formularios-e-erros`.
6. **Só os formatos que a pessoa pediu** (celular, tablet, desktop), cada um num quadro com Auto Layout, para o texto maior ou mais longo não quebrar o desenho. **Mobile-first quando há celular:** desenhe o celular primeiro, uma coluna, com o conteúdo e as ações na ordem de importância e tudo o que a tarefa exige; depois amplie para tablet e desktop, acrescentando o que a largura permite (colunas, painéis laterais), sem tirar do celular o que a tarefa pede. Fontes: [MDN, design responsivo](https://developer.mozilla.org/en-US/docs/Glossary/Responsive_web_design), [MDN, media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) e [Ajuda do Figma, Auto Layout](https://help.figma.com/hc/en-us/articles/360040451373-Explore-auto-layout-properties).
7. **Acessibilidade no desenho:** contraste do texto e dos elementos, foco visível desenhado no estado de foco, alvo de pelo menos 24 por 24 px, erro e estado ditos em texto e não só em cor. Fontes: [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), [2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) e [1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).
8. **Textos reais**, no tom aprovado, os mesmos em toda a interface (`design:ux-copy`); nada de "lorem ipsum" nem de botão "OK".
9. **O fluxo navegável:** ligue os quadros num protótipo do Figma, do ponto de entrada de cada requisito até o fim, incluindo o caminho de erro e o de volta; percorra-o inteiro uma vez, procurando beco sem saída e tela órfã. Fonte: [Ajuda do Figma, protótipos](https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma).
10. **Revise antes de pedir a aprovação:** `design:accessibility-review` e `design:design-critique`, e o resultado vai no PR do registro (`metodo:registro-das-telas`). A aprovação é da pessoa, nunca do Designer.

## O teste que prova

| Regra | Como se confere |
|---|---|
| Cobertura | todo requisito com interface tem a sua tela, e toda tela cita um requisito no nome |
| Estados | para cada tela de dado, existem os quadros de carregando, vazio, erro e sucesso |
| Formatos | cada tela existe em todos os formatos pedidos e em nenhum outro, sem corte nem rolagem lateral; com celular, o quadro do celular veio primeiro e tem tudo o que a tarefa exige |
| Fluxo | o protótipo vai do começo ao fim de cada requisito sem tela sem saída |
| Contrato | cada dado e cada erro mostrado existe em `processo/contrato-api.md` |

## Checklist

- [ ] Telas listadas a partir da ficha do requisito, com nome `R-xx · Tela`.
- [ ] Só componentes e tokens do sistema.
- [ ] Todos os estados e todos os formatos pedidos, mobile-first quando há celular.
- [ ] Contraste, foco, alvo e texto no lugar da cor.
- [ ] Textos reais e iguais em toda a interface.
- [ ] Fluxo percorrido inteiro; revisões de acessibilidade e de desenho feitas.

## Adaptar ao tamanho do projeto

- Página única ou site estático: uma tela por seção importante, nos formatos pedidos, sem protótipo de fluxo (o rolar é o fluxo); os estados que não existem (vazio, carregando) ficam de fora, com o motivo.
- Aplicação com várias áreas e perfis: desenhe por perfil, e o fluxo de cada um separado.
- Requisito sem interface: não há tela, e a ficha diz "sem interface".
