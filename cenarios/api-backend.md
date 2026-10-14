# API ou back-end

**Maturidade:** rascunho

## Quando usar

Serviços consumidos por outros sistemas ou aplicativos, em que o contrato importa mais do que a tela.

## O que muda no fluxo

O método base ([nucleo/](../nucleo/01-fluxo-de-ponta-a-ponta.md)) continua valendo. O que muda é o que significa testar e explorar neste tipo de projeto:

- **Micro:** testes unitários de regra de negócio e de validação; testes de contrato de cada endpoint (entrada, saída, códigos).
- **Macro:** testes de integração com banco e filas, testes de carga básicos, verificação de compatibilidade de versões.
- **Explorar:** chamar a API de verdade (cliente HTTP, coleção de requisições), com entradas inválidas, limites e falhas de dependências; ler os logs.
- **Aceite típico:** contrato documentado (OpenAPI), erros padronizados, limites de taxa e paginação, idempotência onde precisar.
- **CI:** testes de contrato, análise estática, varredura de dependências.
- **Riscos:** quebrar clientes existentes (mudança incompatível), segredos em log, consultas lentas.

## Skills úteis

- `engineering:system-design`
- `engineering:testing-strategy`
- `engineering:documentation`
- `engineering:code-review`

## Checklist

- [ ] Contrato (OpenAPI) escrito antes do código
- [ ] Erros padronizados, paginação e limites de taxa
- [ ] Compatibilidade com clientes existentes verificada
- [ ] Logs sem segredos e consultas lentas medidas
- [ ] Testes de contrato de cada endpoint

## Caso de referência

Ainda sem caso. Quando houver, registre em `casos/` e troque a maturidade.
