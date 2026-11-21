---
name: registro-das-telas
description: Use quando a pessoa aprovou a identidade ou as telas no Figma e é hora de registrá-las no repositório (processo/telas/), quando uma tela mudou depois de aprovada, ou quando o Frontend e as Builders precisam ler o registro para construir ou revisar uma tela.
---

# Registro das telas

**Quem usa:** o Designer ao registrar cada aprovação; o Frontend e as Builders dele ao ler o registro para construir e revisar.

O Figma é a fonte das telas; `processo/telas/` é o registro versionado, por PR, do que a pessoa aprovou (decisão 015 do método). O código segue só a versão registrada, e toda mudança de tela começa no Figma. A base de conhecimento fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/designer.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/designer.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Registre só depois da aprovação da pessoa**, uma aprovação por PR: a identidade (tokens, componentes, padrões) num, as telas noutro, ou as duas juntas se a pessoa aprovou juntas. O PR é seu (Designer), numa issue com a etiqueta `design`, e a Lead integra. Fonte: [Ajuda do Figma, componentes](https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma).
2. **Capturas:** uma por tela e por estado (`get_screenshot` do MCP do Figma), na pasta `processo/telas/`, com o nome do frame (`R-03-entrar-erro.png`). A captura mostra o que foi aprovado, no tamanho do celular e do desktop. Fonte: [Ajuda do Figma, protótipos](https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma).
3. **A tabela do `processo/telas/README.md`:** uma linha por tela com o frame, os requisitos, os estados, a data da aprovação e o link do frame no Figma; o link do arquivo também vai na linha `Telas:` do `processo/DESENVOLVIMENTO.md`.
4. **Tokens:** `processo/telas/tokens.json` com as variáveis do Figma (`get_variable_defs`), no formato de tokens da comunidade (nome, valor, tipo, referência entre tokens) ou no que o projeto escolher e disser no README; os nomes são os do Figma, para o código usar os mesmos. Fonte: [Design Tokens Community Group](https://www.designtokens.org/).
5. **Catálogo:** `processo/telas/design-system.md` atualizado (`metodo:design-system-do-projeto`, passo 6), com cada componente, as variantes, os estados e os tokens.
6. **Mudança depois da aprovação:** começa no Figma; o ajuste pequeno que não muda fluxo, conteúdo nem identidade a Lead aprova, e o resto volta à pessoa. Depois, um PR novo substitui as capturas e a linha da tabela, com a data nova e o motivo; o registro antigo fica no histórico do Git. Fonte: [Ajuda do Figma, componentes](https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma).
7. **Quem constrói lê assim:** o Frontend e a Builder abrem a tabela, acham a tela e o requisito, leem o frame pelo MCP do Figma (`get_design_context`) e comparam a tela construída com a captura; divergência é defeito do código, ou uma mudança que ainda não passou pelo Figma. Dúvida sobre o desenho vai ao Designer pela Lead, nunca é decidida na construção. Fonte: [Ajuda do Figma, protótipos](https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma).

## O teste que prova

| Regra | Como se confere |
|---|---|
| Registro completo | toda tela aprovada tem a linha na tabela e uma captura por estado |
| Tokens iguais | os nomes e valores do `tokens.json` são os do Figma (`get_variable_defs` de novo, sem diferença) |
| Sem tela fora do registro | o código só tem tela que está na tabela; a revisão compara com a captura |
| Aprovação | cada linha tem a data em que a pessoa aprovou |

## Checklist

- [ ] Só o que a pessoa aprovou.
- [ ] Uma captura por tela e estado, com o nome do frame.
- [ ] Tabela e linha `Telas:` com os links do Figma.
- [ ] `tokens.json` e `design-system.md` iguais ao Figma.
- [ ] Mudança posterior: Figma primeiro, depois PR com data e motivo.

## Adaptar ao tamanho do projeto

- Projeto sem escrita no Figma (a pessoa desenha): o Designer lê o arquivo e registra as capturas e os tokens do mesmo jeito.
- Muitas telas: um PR por requisito ou por área, para a revisão da pessoa caber.
- Projeto sem interface: não há registro; `processo/telas/` fica só com o README.
