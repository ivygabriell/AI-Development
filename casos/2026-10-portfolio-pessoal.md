# Portfólio pessoal (2026-10)

**Cenário:** [site-estatico](../cenarios/site-estatico.md)
**Versão do método usada:** 1.0.0 (o método foi escrito durante o projeto)
**Período:** 2026-10
**Resultado em uma frase:** um portfólio bilíngue (PT e EN) com seções animadas, vídeos, depoimentos, serviços e contato, publicado com verificação automática, `main` protegida e mobile refeito contra uma referência.

## Contexto

Projeto de uma pessoa desenvolvedora, feito do zero, com um site de referência para o estilo (Astro, animações com GSAP, rolagem suave, testes com Vitest). O trabalho começou com uma sessão única e passou a usar uma sessão integradora mais sessões trabalhadoras (uma tarefa por worktree) a partir do piloto de mobile. A pessoa decidia os textos, a aprovação e cada integração.

## O que funcionou

- **Testes em duas camadas.** Os testes escritos primeiro (36 de 37 falham contra o código antigo) deram confiança para refatorar o mobile sem mexer no desktop: capturas de página inteira idênticas à `main` a 1440, 1024, 820 e 768 px.
- **Validação independente.** A integradora refez a suíte e abriu o navegador. Pegou diferenças que o CI não vê (por exemplo, a barra do menu que sumia ao rolar).
- **Auditoria antes da refatoração.** A fase só de leitura mediu o site de referência no celular e gerou critérios mensuráveis, aprovados antes de qualquer código.
- **Proteção da `main` e PR para tudo.** Sete Pull Requests integrados sem quebrar a `main`.

## O que falhou

- Seção errada implementada por um título parecido (lição 001).
- "Pronto" declarado com testes verdes que não cobriam o comportamento pedido (lição 002).
- Dado pessoal em documentos e testes, e depois em commits públicos (lição 012).
- Branch remota apagada sem pedido (lição 017).
- Pedido ambíguo respondido com palpite, e problema não reproduzido antes de mexer (lições 015 e 016).

## Medidas

| Medida | Valor |
|---|---|
| Testes unitários | 295 |
| Testes do build | 66 (4 pulados de propósito) |
| Erros de tipo | 0 |
| Lighthouse mobile (desempenho e acessibilidade) | 96 e 100, em PT e EN |
| Pull Requests integrados | 7 |
| Sem rolagem horizontal | 360, 390 e 430 px, PT e EN |

## Lições geradas

Todas as 18 lições de [licoes](../licoes/_indice.md) nasceram deste projeto.

## Mudanças propostas no método

- Criar a Fase 9 de fechamento (retrospectiva) para que cada projeto alimente o método: ver [decisão 004](../decisoes/004-repositorio-do-metodo-em-camadas.md).
- Manter as branches integradas no GitHub: ver [decisão 003](../decisoes/003-branches-integradas-ficam-no-github.md).
