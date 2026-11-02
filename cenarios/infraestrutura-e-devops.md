# Infraestrutura e DevOps

**Maturidade:** rascunho

## Quando usar

Infraestrutura como código, pipelines de entrega, ambientes e observabilidade.

## O que muda no fluxo

O método base ([nucleo/](../nucleo/01-fluxo-de-ponta-a-ponta.md)) continua valendo. O que muda é o que significa testar e explorar neste tipo de projeto:

- **Micro:** validação estática dos arquivos (formato, políticas) e testes de módulos.
- **Macro:** `plan` em ambiente isolado, aplicação em ambiente de homologação, teste de reversão.
- **Explorar:** simular a queda de um componente, restaurar de um backup, verificar permissões mínimas e custos.
- **Aceite típico:** reprodutível a partir do zero, sem alteração manual, com plano de reversão testado.
- **CI:** validar e planejar a cada PR; **aplicar** só depois da aprovação humana e do merge, e nunca direto em produção por uma sessão.
- **Riscos:** apagar recursos, segredos, custos. Aplique `engineering:deploy-checklist` e `engineering:incident-response`.

## Skills úteis

- `engineering:deploy-checklist`
- `engineering:incident-response`
- `engineering:architecture`
- `metodo:publicacao-gradual`
- `metodo:metas-e-alertas`
- `metodo:ci-seguro`
- `metodo:analise-de-falhas`

## Checklist

- [ ] `plan` em ambiente isolado antes de qualquer aplicação
- [ ] Reversão testada
- [ ] Aplicar só depois da aprovação humana e do merge, nunca direto em produção por uma sessão
- [ ] Permissões mínimas e custos estimados
- [ ] Segredos fora do repositório

## Caso de referência

Ainda sem caso. Quando houver, registre em `casos/` e troque a maturidade.
