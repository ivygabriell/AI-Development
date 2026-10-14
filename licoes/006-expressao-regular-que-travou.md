# 006 · Expressão regular que travou

- **O que aconteceu:** um comando de análise de CSS ficou rodando até estourar o tempo.
- **Causa:** retrocesso catastrófico de uma regex sobre um arquivo grande.
- **Regra:** para CSS, percorra o texto contando `{` e `}` e separe as regras; use regex só em trechos pequenos.

**Caso de origem:** [Portfólio pessoal (2026-10)](../casos/2026-10-portfolio-pessoal.md)
