# Automação, integração ou pipeline de dados

**Maturidade:** rascunho

## Quando usar

Rotinas que movem ou transformam dados entre sistemas, integrações e automações agendadas.

## O que muda no fluxo

O método base ([nucleo/](../nucleo/01-fluxo-de-ponta-a-ponta.md)) continua valendo. O que muda é o que significa testar e explorar neste tipo de projeto:

- **Micro:** testes de cada transformação com entradas pequenas e conhecidas; testes de idempotência (rodar duas vezes dá o mesmo resultado).
- **Macro:** execução completa em um ambiente de teste com dados reais anonimizados; verificação de contagens, totais e esquemas antes e depois.
- **Explorar:** simular falhas (serviço fora, dado malformado, atraso), repetir execuções, conferir o que acontece com o que já foi processado.
- **Aceite típico:** reprocessável sem duplicar, alerta quando falha, registro de cada execução, nenhuma credencial no código.
- **CI:** testes e validação de esquema; execução de amostra.
- **Riscos:** efeito colateral em sistemas de terceiros, volume, custo, dados pessoais (LGPD).

## Skills úteis

- `engineering:testing-strategy`
- `superpowers:systematic-debugging`
- `engineering:documentation`
- `metodo:trabalho-em-segundo-plano`
- `metodo:transacoes-e-consultas`
- `metodo:analise-de-falhas`
- `metodo:entrada-nao-confiavel`

## Checklist

- [ ] Idempotência testada: rodar duas vezes dá o mesmo resultado
- [ ] Execução completa em ambiente de teste com dados anonimizados
- [ ] Alerta quando falha e registro de cada execução
- [ ] Credenciais fora do código
- [ ] Dados pessoais tratados conforme a LGPD

## Caso de referência

Ainda sem caso. Quando houver, registre em `casos/` e troque a maturidade.
