# Solução com IA (modelos de linguagem)

**Maturidade:** rascunho

## Quando usar

Produtos que usam modelos de linguagem: assistentes, extração, classificação, agentes.

## O que muda no fluxo

O método base ([nucleo/](../nucleo/01-fluxo-de-ponta-a-ponta.md)) continua valendo. O que muda é o que significa testar e explorar neste tipo de projeto:

- **Micro:** testes das partes determinísticas (montagem do prompt, análise da resposta, ferramentas) com respostas simuladas.
- **Macro:** conjunto de avaliação com casos reais e critérios de nota; teste de regressão a cada mudança de prompt ou de modelo; testes de custo e de latência.
- **Explorar:** casos adversariais, entradas longas, idiomas diferentes, dados sensíveis; ler as respostas, não só a nota.
- **Aceite típico:** taxa de acerto mínima no conjunto de avaliação, limites de custo, comportamento seguro para entradas hostis, registro das decisões do modelo.
- **CI:** avaliação automática em amostra; avaliação completa antes de publicar.
- **Riscos:** alucinação, vazamento de dados, custo imprevisível, dependência de um provedor.

## Skills úteis

- `engineering:testing-strategy`
- `engineering:system-design`
- `superpowers:systematic-debugging`
- `metodo:entrada-nao-confiavel`
- `metodo:analise-de-falhas`
- `metodo:trabalho-em-segundo-plano`
- `metodo:auditoria-de-seguranca`
- Na auditoria de segurança, a `security-audit` escolhe as classes de ataque de IA e agentes (injeção de prompt, ferramentas, memória)

## Checklist

- [ ] Conjunto de avaliação com casos reais e critérios de nota
- [ ] Regressão a cada mudança de prompt ou de modelo
- [ ] Custo e latência medidos
- [ ] Casos adversariais e dados sensíveis explorados
- [ ] Decisões do modelo registradas

## Caso de referência

Ainda sem caso. Quando houver, registre em `casos/` e troque a maturidade.
