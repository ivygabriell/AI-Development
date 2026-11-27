# Base de conhecimento: Designer

**Leitura feita em:** 2026-11-20 (links conferidos um a um, todos abriram; a leitura aprofundada das fontes que o Frontend ainda não tinha, os tokens e o Figma, é a do dia; o resto reaproveita a base de `modelos/referencias/frontend.md`)
**Agente:** Designer (harness em `modelos/agentes/designer.md`)

O que as referências do Designer ensinam, com palavras próprias: a regra, o porquê e o link. É o segundo lugar onde o agente procura, depois do `processo/referencias/designer.md` do projeto e antes dos sites.

**Decisão da sessão do método (a pessoa confere):** o padrão de criação "do token à tela" (tokens, componentes, padrões, telas, fluxo) foi escolhido pela sessão a partir destas fontes, porque a pessoa pediu "um padrão com design system" sem descrevê-lo. Se ela tiver um padrão próprio, ele substitui este.

## Design system: o que é e como se organiza

| Regra | Por quê | Fonte |
|---|---|---|
| O design system é o conjunto de componentes reutilizáveis mais as regras de uso, num lugar só; sem a regra, vira só uma biblioteca de peças | peça sem orientação é usada de cada jeito | [NN/g, design systems 101](https://www.nngroup.com/articles/design-systems-101/) |
| Cada componente é documentado com o que é, quando usar, quando não usar, variantes e estados | quem monta a tela decide sem perguntar | [GOV.UK, componentes](https://design-system.service.gov.uk/components/) |
| Padrões são montagens de componentes para uma tarefa (pedir um dado, confirmar, erro), não componentes novos | evita criar peça para cada tela | [GOV.UK, padrões](https://design-system.service.gov.uk/patterns/) |
| O estilo básico (cor, tipografia, espaçamento) fica separado dos componentes e vem antes deles | o componente herda do estilo, não o contrário | [GOV.UK, estilos](https://design-system.service.gov.uk/styles/) |
| Componentes validados com pesquisa e acessíveis valem mais que desenho novo; a diferença precisa de motivo | economiza teste e evita erro conhecido | [GOV.UK, começando](https://design-system.service.gov.uk/get-started/) |

## Tokens

| Regra | Por quê | Fonte |
|---|---|---|
| Um token tem nome, valor e tipo (cor, dimensão, fonte...); o valor pode apontar para outro token | o mesmo dado serve o Figma e o código | [Design Tokens Community Group](https://www.designtokens.org/) |
| Duas camadas: primitivos (`azul-600`) e semânticos (`cor-acao-fundo`, que aponta para um primitivo); componentes só usam os semânticos | trocar a marca ou o modo escuro mexe só na ligação | [Ajuda do Figma, variáveis](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma) |
| Modos (claro e escuro) são valores diferentes do mesmo token semântico, numa coleção só | a tela não é desenhada duas vezes | [Ajuda do Figma, variáveis](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma) |
| O formato de troca dos tokens ainda está em elaboração pela comunidade; confira a versão antes de depender dele | o `tokens.json` do projeto precisa ser lido pelo código | [Design Tokens Community Group](https://www.designtokens.org/) |

## Componentes e telas no Figma

| Regra | Por quê | Fonte |
|---|---|---|
| Variações de um componente são variantes com propriedades (tamanho, estado), não componentes soltos | uma peça, todas as formas | [Ajuda do Figma, componentes](https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma) |
| Auto Layout nos componentes e nas telas: o espaçamento vem do token, e a peça se ajusta ao texto e à largura | o texto em outra língua ou tamanho não quebra o desenho | [Ajuda do Figma, Auto Layout](https://help.figma.com/hc/en-us/articles/360040451373-Explore-auto-layout-properties) |
| O fluxo é um protótipo navegável que liga os quadros, para a pessoa percorrer a tarefa e não só ver telas soltas | o beco sem saída aparece antes do código | [Ajuda do Figma, protótipos](https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma) |

## Acessibilidade que se decide no desenho (WCAG 2.2)

| Regra | Por quê | Fonte |
|---|---|---|
| Contraste do texto: 4,5:1 (3:1 em texto grande) | leitura com pouca luz ou visão reduzida | [1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) |
| Contraste dos elementos de interface (borda do campo, ícone que carrega sentido): 3:1 | o campo precisa ser visto | [1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) |
| Cor nunca é a única forma de dizer algo (erro, estado, link) | daltonismo e telas ruins | [1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) |
| O foco do teclado é visível e desenhado, não deixado ao navegador | quem usa teclado precisa saber onde está | [2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) |
| Alvo de toque ou clique com pelo menos 24 por 24 px | dedo erra alvo pequeno | [2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) |

## Usabilidade e estados

| Regra | Por quê | Fonte |
|---|---|---|
| Confira cada fluxo pelas dez heurísticas (visibilidade do estado, prevenção de erro, consistência...) antes de pedir a aprovação | achados baratos antes do código | [NN/g, heurísticas](https://www.nngroup.com/articles/ten-usability-heuristics/) |
| O estado vazio explica por que está vazio e oferece a ação seguinte | tela vazia sem saída trava a pessoa | [NN/g, estado vazio](https://www.nngroup.com/articles/empty-state-interface-design/) |
| Erro de campo aparece ao avançar ou enviar, com resumo e mensagem junto do campo (decisão da pessoa, GOV.UK) | a tela já nasce com o comportamento do código | [GOV.UK, validação](https://design-system.service.gov.uk/patterns/validation/) |
