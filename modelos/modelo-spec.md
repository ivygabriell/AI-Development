# Modelo de spec

Gabarito para o documento de desenho (Fase 2). Vem **depois** dos requisitos (`docs/requisitos.md`, pelo [modelo de requisitos](modelo-requisitos.md)) e, com interface, da identidade e de todas as telas aprovadas no Figma e registradas em `docs/telas/`: a spec cita os R-xx e os frames em vez de repetir. Salve em `docs/specs/AAAA-MM-DD-tema.md` e faça a pessoa aprovar **o arquivo escrito**. Seja objetivo: uma seção que não se aplica pode dizer "não se aplica".

```markdown
# Título da mudança

## 1. Objetivo e restrições
- Objetivo: o que muda e para quem (uma ou duas frases).
- Restrições decididas pela pessoa (o que não pode mudar, prazos, tecnologias, dados proibidos).
- Fora de escopo.

## 2. Entendimento
- O que a pessoa disse (citações curtas) e o que eu supus (para ela corrigir).

## 3. Referências
- Qual referência e onde (título exato, link) e o resumo dos achados medidos.

## 4. Desenho
- Requisitos cobertos (R-xx) e, com interface, as telas (frames do Figma e `docs/telas/`).
- Estrutura e componentes, com a responsabilidade de cada um.
- Dados e onde moram (arquivos de conteúdo, configuração, banco).
- Fluxos e estados (vazio, erro, carregando).
- Abordagem escolhida e as alternativas descartadas, com o motivo.

## 5. Conteúdo
- Textos nos idiomas combinados; dados fictícios e como são marcados.

## 6. Critérios de aceite
- Checklist mensurável (use o modelo de critérios).

## 7. Testes
- micro: o que o TDD cobre. macro: o que a suíte, o build, o desempenho e a exploração cobrem.

## 8. Riscos e pendências
- O que pode dar errado e o que fica para depois.

## 9. Aprovações
- Quem aprovou o quê e quando.
```

Depois da spec aprovada, o plano de implementação (`superpowers:writing-plans`) quebra o trabalho em tarefas pequenas, cada uma com os arquivos exatos, o teste primeiro, o comando e o resultado esperado.
