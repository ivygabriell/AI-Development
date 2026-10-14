# 005 · Efeito de mola expôs o fundo do botão

- **O que aconteceu:** no hover, o preenchimento do botão passava do topo e voltava (curva com *overshoot*), deixando o fundo aparecer e o texto ficar ilegível por um instante. No fim, o preenchimento em forma de cúpula deixava "orelhas" nos cantos.
- **Causa:** a curva de animação copiada da referência, aplicada num elemento do tamanho exato do botão.
- **Regra:** conferir **quadro a quadro** (capturas em sequência) qualquer animação de preenchimento; no estado final o elemento precisa cobrir tudo.

**Caso de origem:** [Portfólio pessoal (2026-10)](../casos/2026-10-portfolio-pessoal.md)
