# 004 · Mídia pesada derrubou o desempenho

- **O que aconteceu:** ao incluir vídeos, o Lighthouse caiu de 99 para 88 (o vídeo de 3 MB virou o maior elemento da página).
- **Causa:** o vídeo começava a baixar com a página e as capas estavam em resolução cheia.
- **Regra:** capa como `<picture>` leve no HTML (com prioridade alta); vídeo só **depois do carregamento ou da primeira interação**; capas pequenas; medir o Lighthouse a cada mudança de mídia. Nada de vídeo com som ou autoplay no carregamento.

**Caso de origem:** [Portfólio pessoal (2026-10)](../casos/2026-10-portfolio-pessoal.md)
