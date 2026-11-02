# Aplicação web full stack

**Maturidade:** rascunho

## Quando usar

Sistemas com interface, back-end e banco de dados, com login, permissões e dados de usuários.

## O que muda no fluxo

O método base ([nucleo/](../nucleo/01-fluxo-de-ponta-a-ponta.md)) continua valendo. O que muda é o que significa testar e explorar neste tipo de projeto:

- **Micro:** testes unitários de funções e componentes; testes de repositório/serviço com banco em memória ou contêiner.
- **Macro:** testes de integração com o banco real, testes de ponta a ponta dos fluxos principais (login, criar, editar, apagar), migrações aplicadas do zero e **revertidas**.
- **Explorar:** percorrer os fluxos como usuário, com dados vazios, grandes e inválidos; permissões (quem não pode ver); estados de erro e de carregamento.
- **Aceite típico:** fluxos descritos passo a passo, tempos de resposta, mensagens de erro claras, sem dado de um usuário aparecendo para outro.
- **CI:** serviços auxiliares (banco) como contêineres do próprio CI; migrações no pipeline.
- **Riscos:** segurança (injeção, autenticação, segredos), migrações destrutivas, concorrência. Use `security-review` e `engineering:system-design`.

## Skills úteis

- `engineering:architecture`
- `engineering:system-design`
- `engineering:testing-strategy`
- `engineering:code-review`
- `superpowers:systematic-debugging`
- `metodo:contrato-de-api`
- `metodo:api-conforme-contrato`
- `metodo:formularios-e-erros`
- `metodo:estados-da-tela`
- `metodo:autenticacao-e-sessao`
- `metodo:controle-de-acesso`
- `metodo:auditoria-de-seguranca`

## Checklist

- [ ] Modelo de dados e migrações aplicadas do zero e revertidas
- [ ] Permissões testadas: quem não pode ver não vê
- [ ] Fluxos principais testados de ponta a ponta
- [ ] Segredos fora do código e do histórico
- [ ] Plano de implantação e de volta atrás

## Caso de referência

Ainda sem caso. Quando houver, registre em `casos/` e troque a maturidade.
