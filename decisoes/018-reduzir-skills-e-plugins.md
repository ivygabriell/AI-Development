# 018 · Reduzir skills e plugins do método

**Data:** 2026-11-26

**Status:** aceita por pedido explícito da pessoa, sem caso real.

**Caso de origem:** nenhum. É a primeira etapa da reformulação do AI Development.

## Contexto

O fluxo distribuía 28 skills próprias e orientava o uso de vários plugins e skills externos. A pessoa pediu uma limpeza no repositório antes de decidir quais novas skills adotar.

## Decisão

A `security-audit` da Cloudflare é a única skill usada pelo método. O repositório deixa de distribuir o plugin `metodo` e suas skills, inclusive a que intermediava a auditoria. O núcleo descreve o portão e a triagem. O Security ou a Lead segue o procedimento da Cloudflare diretamente.

## Consequências

- A preparação e a consulta ao método passam pelo script existente e pelos arquivos da cópia local. A atualização de projetos usa a comparação dos modelos e o fluxo de PR.
- Fases, portões, papéis e práticas de teste seguem documentados. As decisões anteriores continuam como histórico.
- As instalações pessoais e os projetos que já receberam versões do método têm seu próprio ciclo de atualização.
