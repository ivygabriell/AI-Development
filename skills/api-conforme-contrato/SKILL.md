---
name: api-conforme-contrato
description: Use quando for implementar ou revisar uma rota de API (listagem, leitura, criação, atualização, exclusão, pagamento, chamada que o cliente pode repetir) a partir do contrato da API do projeto, ou quando o contrato não diz como paginar, como responder a um erro ou o que fazer com um pedido repetido.
---

# API conforme o contrato

**Maturidade:** rascunho (sem caso real ainda). **Quem usa:** as trabalhadoras do back ao construir e o especialista de Back e Dados ao revisar.

O contrato da API (`docs/contrato-api.md`) é da Arquitetura. Esta skill diz como cumpri-lo e o que fazer quando ele não responde. A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/back-e-dados.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/back-e-dados.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **O contrato manda, e a lacuna sobe.** Se a rota precisa de algo que o contrato não diz (paginação, um código de resposta a mais, o formato do erro, a chave de repetição), não invente nem divirja "para registrar depois". Pergunte ao especialista; ele sobe à Arquitetura. Enquanto isso, siga com o resto da tarefa. Fonte: [Zalando #151](https://opensource.zalando.com/restful-api-guidelines/#151), que pede sucesso e erros especificados.
2. **Toda listagem nasce paginada.** Acrescentar paginação depois quebra os clientes, que passam a receber só a primeira página. Limite padrão finito; valor acima do máximo é reduzido ao máximo; valor negativo é erro. Fonte: [AIP-158](https://google.aip.dev/158).
3. **Cursor opaco e estável.** O cursor guarda a posição pela ordenação completa, com desempate único (por exemplo, `criado_em` e `id`); só a data repete valores e pula linhas. O cliente não lê nem monta o cursor, e um Base64 legível não conta como opaco. Mudar o filtro com o mesmo cursor é erro. O fim da lista é o cursor seguinte vazio. Fontes: [AIP-158](https://google.aip.dev/158) e [Zalando #160](https://opensource.zalando.com/restful-api-guidelines/#160).
4. **A resposta é um objeto, nunca uma lista solta** (`{ "itens": [...], "proximo": "..." }`), para caber um campo novo sem quebrar ninguém. Fonte: [Zalando #110](https://opensource.zalando.com/restful-api-guidelines/#110).
5. **Erro num formato só**, o que o contrato definir; se ele não definir, proponha o Problem JSON (RFC 9457) pelo passo 1. Nunca rastro de pilha nem SQL na resposta; o código HTTP mais específico. Fontes: [Zalando #176, #177 e #220](https://opensource.zalando.com/restful-api-guidelines/#176) e [AIP-193](https://google.aip.dev/193).
6. **Permissão antes da existência.** Sem permissão, a resposta é a mesma, exista o recurso ou não; quando o recurso é de outro dono, o contrato diz se é 403 ou 404. Fonte: [AIP-193](https://google.aip.dev/193).
7. **Pedido repetido não repete o efeito.** Criação e cobrança que o cliente pode repetir usam a chave que o contrato definir (cabeçalho `Idempotency-Key` ou um identificador do cliente), guardada por cliente e válida pela janela de repetição (24 horas ou menos). A repetição devolve a mesma resposta da primeira. Se o contrato não diz a chave, uma chave natural do negócio (por exemplo, um pagamento por pedido, com `UNIQUE`) pode bastar: pergunte pelo passo 1 se ela vale. Quando a chamada a um serviço externo estoura o prazo, o resultado é desconhecido, não "falhou": o registro fica pendente e a confirmação vem depois, com a mesma chave (`metodo:trabalho-em-segundo-plano`). Fontes: [Zalando #229 e #231](https://opensource.zalando.com/restful-api-guidelines/#229) e [Shopify, pagamentos resilientes](https://shopify.engineering/building-resilient-payment-systems).
8. **Mudança compatível.** Pode acrescentar campo opcional e rota nova. Quebra: renomear ou remover campo, tornar um campo obrigatório, mudar tipo, formato ou valor padrão, aumentar o limite de um texto. O que quebra vai à Arquitetura. Fontes: [AIP-180](https://google.aip.dev/180) e [Zalando #106](https://opensource.zalando.com/restful-api-guidelines/#106).

## O teste que prova (escreva antes, veja falhar)

| Regra | Teste |
|---|---|
| Paginação | lista com mais itens que o limite: as páginas juntas trazem todos, sem repetir nem pular, inclusive com datas iguais |
| Cursor | cursor adulterado ou com filtro trocado devolve erro de validação |
| Erro | erro interno não devolve rastro de pilha; o corpo segue o formato do contrato |
| Permissão | recurso de outro dono e recurso inexistente devolvem o que o contrato manda |
| Repetição | o mesmo pedido duas vezes (e duas ao mesmo tempo) gera um só efeito e a mesma resposta |

## Checklist

- [ ] Nada fora do contrato; cada lacuna foi perguntada, não inventada.
- [ ] Listagens paginadas, com limite finito e cursor opaco com desempate.
- [ ] Respostas em objeto; erros no formato do contrato, sem detalhe interno.
- [ ] Permissão conferida antes da existência.
- [ ] Repetição sem efeito duplicado, com o teste de chamada dupla.
- [ ] Nenhuma mudança que quebra clientes sem a Arquitetura.

## Adaptar ao tamanho do projeto

- API só para o próprio front, sem clientes de fora: a compatibilidade conta entre o deploy do back e o do front; a versão na rota pode esperar.
- Sem cobrança nem criação repetível: a chave de repetição fica de fora; diga isso no PR.
- Lista que nunca passa de algumas dezenas de itens continua paginada (é barato agora e caro depois), com um limite padrão alto.
