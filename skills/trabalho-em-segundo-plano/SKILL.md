---
name: trabalho-em-segundo-plano
description: Use quando for implementar ou revisar trabalho fora da requisição (fila de tarefas, job, worker, e-mail, webhook, chamada a API externa depois de gravar, importação, limpeza agendada), ou quando uma tarefa rodou duas vezes, se perdeu, ficou presa ou nunca termina.
---

# Trabalho em segundo plano

**Maturidade:** rascunho (sem caso real ainda). **Quem usa:** as trabalhadoras do back ao construir e o especialista de Back e Dados ao revisar.

Uma tarefa em segundo plano vai rodar duas vezes, fora de ordem e com outra versão do código. Escreva para isso. A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/back-e-dados.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/back-e-dados.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Vai para o segundo plano** o que a resposta não precisa esperar e que é lento, pesado ou depende de terceiros (e-mail, API externa, mídia, importação, limpeza). A resposta diz "recebido" (por exemplo, 202), como o contrato mandar. Fonte: [Shopify, trabalho em segundo plano](https://shopify.engineering/high-availability-background-jobs).
2. **Entrega "pelo menos uma vez", tarefa que pode repetir.** Antes do efeito, a tarefa confere o estado gravado; nas APIs externas, manda a chave de repetição. Marque "feito" na mesma transação do efeito quando ele é no banco; quando é externo, marque depois e aceite o raro duplicado, ou use a chave do serviço. Fontes: [Shopify, trabalho em segundo plano](https://shopify.engineering/high-availability-background-jobs) e [pagamentos resilientes](https://shopify.engineering/building-resilient-payment-systems).
3. **Nada enfileirado dentro da transação.** A fila é outro armazenamento: a tarefa pode rodar antes do commit ou depois de um rollback. Enfileire depois do commit; se perder a tarefa não é aceitável, grave-a numa tabela de saída (outbox) na mesma transação e deixe um processo enfileirar e marcar como enviada. Fonte: [Shopify, trabalho em segundo plano](https://shopify.engineering/high-availability-background-jobs).
4. **Os parâmetros da tarefa são um contrato entre versões.** Durante o deploy, uma versão enfileira e outra executa: acrescentar parâmetro opcional pode; renomear ou remover só depois que as tarefas antigas acabaram. Passe identificadores, não o objeto inteiro. Fonte: [Shopify, trabalho em segundo plano](https://shopify.engineering/high-availability-background-jobs).
5. **Tarefa longa retoma do ponto onde parou.** Processe em blocos e grave o progresso a cada bloco; uma tarefa que recomeça do zero e dura mais que o intervalo entre deploys nunca termina. Fonte: [Shopify, trabalho em segundo plano](https://shopify.engineering/high-availability-background-jobs).
6. **Ordem não é garantida.** Se B depende de A, A enfileira B ao terminar. Fonte: [Shopify, trabalho em segundo plano](https://shopify.engineering/high-availability-background-jobs).
7. **Chamada externa com prazo curto e nova tentativa com espera crescente;** depois de falhas seguidas do mesmo serviço, pare de chamar por um tempo (disjuntor) em vez de encher a fila. Uma tarefa que esgotou as tentativas fica visível para alguém olhar, não some. Prazo estourado numa cobrança ou reserva não quer dizer que ela não aconteceu: confira com o serviço (pela mesma chave) antes de tentar de novo, e compare os registros com os dele de tempos em tempos. Fonte: [Shopify, pagamentos resilientes](https://shopify.engineering/building-resilient-payment-systems).
8. **Registro estruturado com um identificador comum** da requisição até a tarefa, para seguir um pedido de ponta a ponta. Sem dado pessoal no registro. Fonte: [Shopify, pagamentos resilientes](https://shopify.engineering/building-resilient-payment-systems).

## O teste que prova (escreva antes, veja falhar)

| Regra | Teste |
|---|---|
| Repetição | rodar a mesma tarefa duas vezes produz um só efeito |
| Rollback | uma transação que falha não deixa tarefa enfileirada |
| Versões | uma tarefa com os parâmetros da versão anterior ainda roda |
| Retomada | interromper no meio e rodar de novo termina sem refazer o que já foi feito |
| Falha externa | o serviço externo fora do ar leva a novas tentativas e, no fim, à tarefa visível como falha |

## Checklist

- [ ] Tarefa que pode repetir, com o teste de execução dupla.
- [ ] Enfileirada depois do commit, ou pela tabela de saída.
- [ ] Parâmetros compatíveis com a versão anterior; só identificadores.
- [ ] Tarefa longa em blocos, com progresso gravado.
- [ ] Prazo, novas tentativas com espera e falha final visível.
- [ ] Registro com identificador comum e sem dado pessoal.

## Adaptar ao tamanho do projeto

- Sem fila no projeto: esta skill só entra quando a primeira tarefa fora da requisição aparecer. Antes de criar uma fila, suba a escolha à Arquitetura.
- Projeto pequeno: enfileirar depois do commit basta, sem tabela de saída, se perder uma tarefa rara não causa dano (um e-mail de boas-vindas, por exemplo). Cobrança, estoque e dado de terceiros usam a tabela de saída.
- O disjuntor do passo 7 entra quando há volume; com pouco tráfego, prazo e novas tentativas bastam.
