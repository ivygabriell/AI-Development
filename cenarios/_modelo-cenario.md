# Nome do cenário

**Maturidade:** rascunho

## Quando usar

Em uma ou duas frases: que tipo de projeto é este, e quando o cenário **não** se aplica.

## O que muda no fluxo

O método base continua valendo. O que muda neste tipo de projeto:

- **Micro:** o menor teste que prova uma regra.
- **Macro:** o sistema inteiro funcionando (integração, build, ponta a ponta, desempenho).
- **Explorar:** como a integradora usa o resultado de verdade (navegador, cliente HTTP, emulador, ambiente de homologação).
- **Aceite típico:** critérios mensuráveis que quase todo projeto deste tipo precisa.
- **CI:** o que o pipeline executa a cada PR.
- **Riscos:** o que costuma dar errado e quais testes-guarda valem a pena.

## Skills úteis

- `superpowers:...` (use nomes exatos; o verificador confere)

## Checklist

- [ ] Início: o alvo e os critérios de aceite estão escritos
- [ ] Entrega: tudo que o aceite típico pede foi medido, não suposto

## Caso de referência

Link para o caso em `casos/` que comprova este cenário, ou "Ainda sem caso".
