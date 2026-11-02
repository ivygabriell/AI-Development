# Aplicativo mobile

**Maturidade:** rascunho

## Quando usar

Aplicativos para celular, nativos ou multiplataforma, distribuídos por lojas ou de forma interna.

## O que muda no fluxo

O método base ([nucleo/](../nucleo/01-fluxo-de-ponta-a-ponta.md)) continua valendo. O que muda é o que significa testar e explorar neste tipo de projeto:

- **Micro:** testes unitários de lógica e de componentes de tela.
- **Macro:** testes de interface em emulador e em aparelho real, em mais de um tamanho e versão do sistema; teste de instalação e de atualização.
- **Explorar:** uso real com rede lenta ou ausente, rotação, interrupções (ligação, notificação), permissões negadas, modo escuro e acessibilidade do sistema.
- **Aceite típico:** fluxos principais funcionando offline quando aplicável, tempo de abertura, consumo de bateria, regras das lojas.
- **CI:** build do app assinado, testes em emulador; distribuição interna a cada PR integrado.
- **Riscos:** revisão das lojas, versões antigas do sistema, dados locais sem criptografia.

## Skills úteis

- `engineering:testing-strategy`
- `design:accessibility-review`
- `engineering:deploy-checklist`
- `metodo:estados-da-tela`
- `metodo:formularios-e-erros`
- `metodo:autenticacao-e-sessao`
- `metodo:auditoria-de-seguranca`
- `reverse-engineer-anything`

## Checklist

- [ ] Matriz de aparelhos e versões do sistema definida
- [ ] Rede lenta, offline, interrupções e permissões negadas exploradas
- [ ] Build assinado no CI
- [ ] Regras das lojas conferidas antes de publicar
- [ ] Dados locais protegidos

## Caso de referência

Ainda sem caso. Quando houver, registre em `casos/` e troque a maturidade.
