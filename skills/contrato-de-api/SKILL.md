---
name: contrato-de-api
description: Use quando for escrever ou mudar o contrato da API do projeto (docs/contrato-api.md), decidir como a API vai mudar sem quebrar clientes (app móvel, integrações), definir versões, formato de erro, paginação ou as garantias para pedido repetido, ou responder a um especialista que pediu algo que o contrato não prevê.
---

# Contrato de API

**Maturidade:** rascunho (sem caso real ainda). **Quem usa:** a Arquitetura, dona do contrato. O back implementa pelo `metodo:api-conforme-contrato`, que segue as mesmas regras; mudar o contrato exige o portão da pessoa.

A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/arquitetura.md` (e as regras do Zalando e do Google AIP em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/back-e-dados.md`); o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/arquitetura.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Escreva para o cliente que não se atualiza.** O contrato é uma promessa: estabilidade vale mais que conveniência de quem mantém. Liste quem consome (o front, o app móvel, integrações) e qual deles fica meses numa versão antiga. Fonte: [Stripe, versões da API](https://stripe.com/blog/api-versioning).
2. **Diga o que é compatível e exija que o cliente tolere:** rota nova, campo novo, parâmetro opcional e valor novo de enumeração não quebram, e o contrato manda o cliente ignorar campo desconhecido e tratar valor de enumeração desconhecido. O cliente não deduz ações a partir do estado: o servidor diz o que é permitido (por exemplo, `pode_cancelar`), e um estado novo não libera botão nenhum no app antigo. Ação sobre um estado (cancelar, devolver) é descrita com quando vale e o erro de quando não vale. Quebra: remover ou renomear, mudar tipo ou estrutura, tornar obrigatório, mudar padrão ou significado. Fontes: [Stripe, versões da API](https://stripe.com/blog/api-versioning) e [AIP-180](https://google.aip.dev/180).
3. **Escolha um jeito de versionar e registre o motivo** (`engineering:architecture`). As referências divergem: o Zalando proíbe versão na URL e usa o tipo de mídia; o Google usa a versão no caminho; a Stripe usa versões por data presas a cada cliente. Para projeto pequeno, o padrão é não ter versão nova enquanto só houver mudança compatível, e marcar o que sai com `Deprecation` e `Sunset`, medindo o uso antes de remover. Fontes: [Zalando #115 e #189](https://opensource.zalando.com/restful-api-guidelines/#115), [Stripe, versões da API](https://stripe.com/blog/api-versioning).
4. **Garantias de repetição no contrato:** toda criação e toda ação que muda algo e pode ser repetida leva `Idempotency-Key` (por intenção, guardada por cliente, por pelo menos a janela de repetição, que o contrato fixa; 24 horas é a referência da base do back); a repetição devolve a mesma resposta; mesma chave com corpo diferente é um erro com código estável, escrito no contrato; o cliente repete com espera exponencial e variação aleatória. Diga o que acontece quando o resultado de uma etapa externa é desconhecido. Fontes: [Stripe, repetição segura](https://stripe.com/blog/idempotency) e [Zalando #229](https://opensource.zalando.com/restful-api-guidelines/#229).
5. **Listagem paginada desde a primeira versão, resposta em objeto, erro num formato só** (código estável para a máquina, mensagem para gente), com o código HTTP mais específico. Fontes: [AIP-158](https://google.aip.dev/158), [Zalando #110 e #176](https://opensource.zalando.com/restful-api-guidelines/#110).
6. **Revisão leve antes de publicar** cada mudança do contrato: o especialista do back, o do front e a Segurança leem; o que quebra vai ao portão da pessoa com o plano de transição. Fonte: [Stripe, versões da API](https://stripe.com/blog/api-versioning).
7. **Proporcionalidade:** cada garantia e cada cabeçalho entra porque um cliente real precisa; o que é para o futuro fica anotado, não implementado.

## O teste que prova

| Regra | Como se confere |
|---|---|
| Compatibilidade | um teste de contrato com as requisições do cliente mais antigo em uso roda a cada mudança |
| Tolerância | o cliente recebe um campo e um valor de enumeração novos sem quebrar |
| Repetição | a mesma chave duas vezes (e ao mesmo tempo) gera um efeito só e a mesma resposta |

## Checklist

- [ ] Clientes listados, com o que fica preso em versão antiga.
- [ ] Compatível e incompatível escritos; cliente tolerante exigido.
- [ ] Versionamento escolhido com registro de decisão; depreciação com data e medição.
- [ ] `Idempotency-Key` nas ações repetíveis; resultado desconhecido descrito.
- [ ] Paginação, objeto na resposta e formato único de erro.
- [ ] Revisão do back, do front e da Segurança; portão da pessoa no que quebra.

## Adaptar ao tamanho do projeto

- Só o próprio front consome e sai junto com o back: o passo 3 vira "sem versão"; os passos 4 e 5 continuam.
- App móvel ou integração de terceiros: o passo 1 manda; tolerância e depreciação medida são obrigatórias, e o padrão "sem versão enquanto só houver mudança compatível" do passo 3 continua valendo.
