# Site estático ou portfólio

**Maturidade:** testado em 1 projeto

## Quando usar

Sites sem back-end próprio: portfólio, página de apresentação, site institucional, landing page. O conteúdo é conhecido, o risco está no visual, no desempenho e na acessibilidade.

## O que muda no fluxo

O método base ([nucleo/](../nucleo/01-fluxo-de-ponta-a-ponta.md)) continua valendo. O que muda é o que significa testar e explorar neste tipo de projeto:

- **Micro:** testes de HTML e CSS do que mudou (ordem de seções, atributos, regras de mídia), testes de dados e de textos (paridade entre idiomas).
- **Macro:** build completo e testes sobre o HTML gerado, checagem de tipos, Lighthouse (desempenho e acessibilidade), acessibilidade com `design:accessibility-review`.
- **Explorar:** abrir no desktop, tablet e celular, em todos os idiomas, com movimento reduzido; hover e teclado; animações amostradas no tempo; capturas.
- **Aceite típico:** igual à referência (estrutura, quantidade e comportamento), sem rolagem horizontal, metas de Lighthouse.
- **CI:** instalar, testes, tipos, build e testes do build.
- **Riscos:** mídia pesada, dados de exemplo publicados, SEO (`noindex` esquecido ou ligado demais), direitos autorais da referência.

## Skills úteis

- `superpowers:brainstorming`
- `superpowers:test-driven-development`
- `design:accessibility-review`
- `design:design-critique`
- `superpowers:verification-before-completion`

## Checklist

- [ ] Referência estudada pelo título exato e critérios de aceite escritos antes de construir
- [ ] Testes de HTML e CSS do que mudou e paridade entre idiomas
- [ ] Lighthouse (desempenho e acessibilidade) e exploração no desktop, tablet e celular, com movimento reduzido
- [ ] Dados de exemplo marcados e bloqueados por teste; `noindex` tratado antes de publicar
- [ ] Mídia comprimida e dentro do orçamento de peso

## Caso de referência

Portfólio pessoal: [2026-10-portfolio-pessoal](../casos/2026-10-portfolio-pessoal.md).
