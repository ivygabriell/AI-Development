# 004 · Repositório do método em camadas, com fechamento por projeto

**Data:** 2026-10-14
**Status:** aceita
**Caso de origem:** [Portfólio pessoal (2026-10)](../casos/2026-10-portfolio-pessoal.md)

## Contexto

O método começou como uma pasta de documentos. Para crescer com novos cenários e casos de uso sem virar um arquivo único e bagunçado, precisava de estrutura e de uma regra de atualização.

## Decisão

O guia vira um repositório privado em três camadas: **núcleo** (estável), **cenários** (um arquivo por tipo de projeto, com selo de maturidade) e **casos e lições** (um arquivo cada, vindos de projetos reais). Nada entra sem um caso real. Cada projeto termina com a **Fase 9: fechamento**, que alimenta o método. Mudanças entram por Pull Request com verificador no CI.

## Consequências

- O método cresce de forma organizada e com evidência.
- Exige disciplina de fechamento ao fim de cada projeto.
- Cenário de ERP e sistemas grandes ficou de fora por decisão da pessoa, para um momento futuro.
- Documentado no [README](../README.md) e no [CLAUDE.md](../CLAUDE.md).
