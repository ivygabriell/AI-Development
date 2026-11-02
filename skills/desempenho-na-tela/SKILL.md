---
name: desempenho-na-tela
description: Use quando for implementar ou revisar uma página ou tela que pode ficar lenta (imagem grande, fonte personalizada, conteúdo que chega depois, lista grande, busca a cada tecla, script de terceiros), quando a tela "pula" ou demora no celular, ou quando for falar de LCP, INP, CLS, Lighthouse ou PageSpeed.
---

# Desempenho na tela

**Quem usa:** as trabalhadoras do front ao construir e o especialista de Design e Front ao revisar.

A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/design-e-front.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/design-e-front.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Meça antes e depois, do jeito certo.** Metas no percentil 75, celular e computador separados: LCP até 2,5 s, INP até 200 ms, CLS até 0,1. Com usuários reais, use o dado de campo (PageSpeed Insights, CrUX ou a biblioteca `web-vitals`). No laboratório (Lighthouse, DevTools), LCP e CLS se medem, mas o **INP não**: lá o substituto é o TBT, e o INP se mede no DevTools fazendo a interação. Não prometa número sem medir; o PR traz o antes e o depois. Fonte: [web.dev, Web Vitals](https://web.dev/articles/vitals).
2. **A imagem principal (quase sempre o LCP)** fica no HTML, com `src` ou `srcset` no `<img>`, `fetchpriority="high"` (em uma ou duas imagens, não mais) e nunca `loading="lazy"`. Imagem de fundo por CSS ou por script precisa de `<link rel="preload">`. Nada de script síncrono no `<head>`. Em app que monta a tela no navegador (React com Vite, por exemplo), a imagem só existe depois do JavaScript: ponha o `preload` (com `imagesrcset` e `imagesizes`) no `index.html` ou pré-renderize a página; a escolha entre os dois é da Arquitetura. Fonte: [web.dev, otimizar LCP](https://web.dev/articles/optimize-lcp).
3. **Imagem no tamanho e no formato certos:** várias larguras com `srcset` e `sizes` (o `sizes` diz a largura na tela, não a do arquivo), AVIF ou WebP com `<picture>` e o JPEG por último, `width` e `height` com a proporção real e `img { max-width: 100%; height: auto; }`. Imagens abaixo da dobra com `loading="lazy"`. Fontes: [MDN, imagens responsivas](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images) e [web.dev, otimizar LCP](https://web.dev/articles/optimize-lcp).
4. **Nada empurra o layout:** espaço reservado (`min-height`, `aspect-ratio`) para o que chega depois (carrossel, anúncio, embed, banner), no tamanho menor esperado; o espaço fica mesmo se nada chegar; conteúdo novo entra abaixo do que a pessoa está vendo ou num botão "ver mais"; animação só com `transform`. Fonte: [web.dev, otimizar CLS](https://web.dev/articles/optimize-cls).
5. **Fonte personalizada:** arquivo pequeno (WOFF2, só os caracteres usados), `preload` da fonte do texto principal e `font-display: optional` para não trocar a fonte depois de a página aparecer; se a marca exige a fonte sempre, `swap` com uma fonte reserva de medidas parecidas (`size-adjust`). O design system diz qual; se não diz, pergunte ao especialista. Fonte: [web.dev, otimizar CLS](https://web.dev/articles/optimize-cls).
6. **O clique responde rápido:** no evento, atualize a tela primeiro e adie o resto; divida tarefas longas cedendo a vez ao navegador; não leia medidas de layout logo depois de mudar estilo; mantenha o DOM pequeno (lista grande em janela ou paginada) e use `content-visibility` no que está fora da tela. Fonte: [web.dev, otimizar INP](https://web.dev/articles/optimize-inp).
7. **Recurso da web novo só com o selo Baseline** ("amplamente disponível", ou "recém-disponível" com alternativa), conferido no MDN. Fonte: [web.dev, Baseline](https://web.dev/baseline).

## O teste que prova (escreva antes, veja falhar)

| Regra | Teste |
|---|---|
| Imagem principal | teste de componente: a imagem principal não tem `loading="lazy"`, tem `fetchpriority="high"`, `width` e `height` |
| Espaço reservado | o contêiner do conteúdo que chega depois tem altura mínima antes e depois de carregar |
| Metas | Lighthouse no perfil celular com orçamento de LCP, CLS, TBT e peso das imagens, no CI quando o projeto tiver |
| Clique | a lista grande monta só os itens visíveis; a digitação na busca não espera o filtro |

## Checklist

- [ ] Medido antes e depois, com a ferramenta certa para cada métrica; números no PR.
- [ ] Imagem principal no HTML, com prioridade alta e sem `lazy`.
- [ ] Imagens com `srcset`, `sizes`, formato leve, `width` e `height`.
- [ ] Espaço reservado para tudo o que chega depois; animação com `transform`.
- [ ] Fonte pequena, com `preload` e `font-display` escolhido.
- [ ] Clique leve; lista grande em janela; recurso novo com selo Baseline.

## Adaptar ao tamanho do projeto

- Site estático pequeno: os passos 2 a 5 resolvem quase tudo; o passo 6 só entra com interação pesada.
- Sem usuários reais ainda: meça no laboratório e diga no PR que o INP e o dado de campo ficam para depois do lançamento.
- Painel interno no computador: o perfil de celular pesa menos, mas o CLS e o INP continuam.
