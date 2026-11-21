---
name: design-system-do-projeto
description: Use quando for criar a identidade de um projeto com interface (Fase 2), montar ou ampliar o design system no Figma (tokens, componentes, padrões), decidir se uma peça nova vira componente, ou transformar os tokens do Figma no design system do código.
---

# Design system do projeto

**Quem usa:** o Designer ao criar a identidade e o sistema; o Frontend e as Builders dele ao montar o design system do código a partir do que o Designer registrou.

O padrão de criação do método é **do token à tela**: tokens, componentes, padrões, telas, fluxo; cada etapa só começa com a anterior pronta. Esta skill cobre as três primeiras (a identidade); as telas e o fluxo são de `metodo:telas-e-fluxos`. A base de conhecimento fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/designer.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/designer.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Peça as referências antes de criar qualquer coisa**, à pessoa, pela Lead: sites, apps, marcas ou telas de que ela gosta (e de que não gosta), com o que ela quer tirar de cada uma, e os formatos desejados (celular, tablet, desktop). Sem referências a identidade não começa: se ela não tem, proponha 2 ou 3 direções ilustradas para ela escolher. Estude o que ela mandar (observe o que funciona e recrie com os seus tokens, sem copiar). Depois, parta dos requisitos aprovados: leia `processo/requisitos.md` e liste o que as telas vão precisar (formulário, lista, tabela, aviso, navegação); o que nenhum requisito usa não entra no sistema. Fonte: [NN/g, design systems 101](https://www.nngroup.com/articles/design-systems-101/).
2. **Tokens em duas camadas, no Figma, como variáveis.** Primitivos (a paleta, a escala de tamanhos e de espaços: `azul-600`, `espaco-4`) e semânticos que apontam para eles (`cor-acao-fundo`, `cor-texto-erro`, `espaco-entre-campos`). Componente e tela só usam os semânticos. Modo claro e escuro = valores diferentes do mesmo semântico, quando o projeto tem os dois. Fontes: [Ajuda do Figma, variáveis](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma) e [Design Tokens Community Group](https://www.designtokens.org/).
3. **Confira o contraste na hora de escolher a cor**, não depois: texto 4,5:1 (3:1 em texto grande) e bordas e ícones que carregam sentido 3:1, nos dois modos. Fontes: [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) e [WCAG 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
4. **Componentes base, com variantes e estados.** Um componente por necessidade da lista do passo 1; as formas são variantes com propriedades (tamanho, tipo, estado), não peças soltas; cada um nasce com padrão, foco (desenhado), desativado, erro e carregando, quando fizerem sentido; Auto Layout, com o espaçamento vindo de token. Fontes: [Ajuda do Figma, componentes](https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma) e [Auto Layout](https://help.figma.com/hc/en-us/articles/360040451373-Explore-auto-layout-properties).
5. **Padrões a partir dos componentes:** formulário (com resumo de erros, `metodo:formularios-e-erros`), lista com vazio e carregando (`metodo:estados-da-tela`), confirmação, erro de página. Padrão novo não cria componente novo: se faltou peça, volte ao passo 4. Fonte: [GOV.UK, padrões](https://design-system.service.gov.uk/patterns/).
6. **Escreva o catálogo** `processo/telas/design-system.md`: para cada componente, o que é, quando usar, quando não usar, as variantes, os estados e os tokens que usa. É o que o Frontend e as Builders leem. Fonte: [GOV.UK, componentes](https://design-system.service.gov.uk/components/).
7. **Peça a aprovação da identidade** (tokens, componentes e padrões, com o logo, os ícones e o tom de voz) antes de desenhar uma tela: é um portão da pessoa. Depois dela, componente novo só entra no catálogo antes de entrar numa tela, e mudar um token aprovado volta à pessoa.
8. **No código** (Frontend): o `processo/telas/tokens.json` vira os tokens do projeto (variáveis CSS, tema ou o que o projeto usa), com os mesmos nomes; os componentes do catálogo viram componentes do código, e a cor ou o tamanho solto no código é defeito. Antes de criar um componente, confira se o projeto já tem um que serve. Fonte: [Design Tokens Community Group](https://www.designtokens.org/).

## O teste que prova

| Regra | Como se confere |
|---|---|
| Referências | o PR da identidade cita as referências da pessoa (ou a direção que ela escolheu) e os formatos |
| Só tokens | no Figma, nenhum preenchimento, texto ou espaço sem variável ligada; no código, nenhuma cor ou tamanho fora dos tokens (busca no código e na revisão) |
| Duas camadas | todo componente usa um token semântico, e todo semântico aponta para um primitivo |
| Contraste | cada par de texto e fundo e cada borda passam nos dois modos |
| Catálogo | todo componente do Figma está em `design-system.md`, com as variantes e os estados |
| Código igual ao Figma | os nomes e os valores do `tokens.json` aparecem iguais no código |

## Checklist

- [ ] Referências e formatos pedidos à pessoa e guardados; lista de necessidades tirada dos requisitos.
- [ ] Tokens primitivos e semânticos, com os modos, e contraste conferido.
- [ ] Componentes com variantes, estados, Auto Layout e só tokens.
- [ ] Padrões montados só com componentes.
- [ ] `design-system.md` completo, e a identidade aprovada pela pessoa antes das telas.
- [ ] No código: tokens com os mesmos nomes, sem valor solto.

## Adaptar ao tamanho do projeto

- Projeto pequeno (uma página, poucas telas): um conjunto enxuto de tokens (cores, tipografia, espaços), os poucos componentes que as telas usam e o catálogo numa página; as duas camadas de token continuam, porque custam pouco e evitam retrabalho.
- Projeto com biblioteca de componentes pronta (GOV.UK, Material, shadcn): parta dela, registre o que mudou nos tokens e documente só a diferença, com o motivo.
- Sem identidade própria pedida pela pessoa: proponha uma neutra e acessível e leve à aprovação; não invente marca.
