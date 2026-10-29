# 01 · Fluxo de ponta a ponta

Da ideia à manutenção, em dez fases (0 a 9). Cada fase tem uma **entrada**, um **resultado**, a **Skill** que a conduz, quem a executa e o **portão** que a fecha. O princípio que organiza tudo: nunca construa antes de o alvo estar definido e aprovado, e nunca diga que terminou sem evidência.

## Classificação do pedido

Antes da primeira pergunta, classifique o pedido em voz alta, para a pessoa poder corrigir. Na dúvida entre duas categorias, escolha a mais pesada; a escalada só vai em uma direção.

| Tipo | O que é | Artefato | Aprovação |
|---|---|---|---|
| **Spike** | Uma pergunta de viabilidade ("dá para...?") cuja saída é uma resposta, não código que fica | Pergunta e plano da sondagem em 2 a 3 frases | Um "pode" |
| **Delimitada** | Mudança bem delimitada em algo que já existe (um botão, um endpoint, um arquivo) | Desenho curto no chat | "Sim" explícito ao desenho |
| **Arquitetural** | Projeto novo, subsistema novo ou mudança que reorganiza como as partes se encaixam | Spec escrita e depois plano escrito | Aprovação da spec, depois do plano |

## Fase 0 · Descobrir a intenção

- **Entrada:** o pedido da pessoa, quase sempre incompleto.
- **Passos:** identifique o resultado esperado, para quem é e como saber que deu certo. Pergunte **uma coisa por vez**, de preferência com opções. Escreva de volta o entendimento em poucas linhas, separando o que a pessoa disse do que você supôs.
- **Skill:** `superpowers:brainstorming`.
- **Resultado:** um entendimento que a pessoa reconhece e corrige.
- **Portão:** a pessoa confirma o entendimento.

## Fase 1 · Referências e contexto

- **Entrada:** o entendimento da Fase 0.
- **Passos:** leia o que já existe (código, documentos, histórico). Se há uma referência externa (um site, um app), estude-a de verdade, com medições, e não de memória: veja [04](04-referencias-e-engenharia-reversa.md). Ache a referência pelo **título exato** que a pessoa citou.
- **Skill:** `reverse-engineer-anything` quando a referência é um artefato fechado; para sites públicos bastam `curl` e o navegador.
- **Resultado:** um registro dos achados (o quê, como, valor, fonte).
- **Portão:** se o que você achou não bate com o que foi pedido, **pare e pergunte**.

## Fase 2 · Desenho e spec

- **Entrada:** entendimento e achados.
- **Passos:** proponha 2 ou 3 abordagens com a sua recomendação; apresente o desenho em partes e peça aprovação a cada parte; escreva a spec (objetivo, restrições, estrutura, dados, critérios de aceite, o que fica de fora) e faça uma autorrevisão (pendências, contradições, ambiguidade, escopo).
- **Skill:** `superpowers:brainstorming`; `engineering:architecture` para decisões de arquitetura; `engineering:system-design` para sistemas e APIs.
- **Resultado:** spec versionada no repositório.
- **Portão:** a pessoa lê e aprova a spec escrita.

## Fase 3 · Plano

- **Entrada:** spec aprovada.
- **Passos:** quebre em tarefas pequenas (2 a 5 minutos por passo), cada uma com os arquivos exatos, o teste primeiro, o comando e o resultado esperado. Liste as restrições globais e o que a revisão final precisa olhar.
- **Skill:** `superpowers:writing-plans`.
- **Resultado:** plano versionado.
- **Portão:** a pessoa aprova o plano e escolhe o modo de execução (inline, subagentes, sessões divididas ou orquestração com o Orca, em rascunho, inclusive com agentes especialistas por tema; veja [02](02-sessoes-e-papeis.md)).

## Fase 4 · Construir com TDD

- **Entrada:** plano aprovado e uma branch própria a partir da `main` atualizada.
- **Passos:** para cada tarefa, escreva o teste, **veja-o falhar pelo motivo certo**, escreva o mínimo para passar, rode a suíte inteira e faça commits pequenos. Registre cada decisão que desviou do plano (o que, por quê, quanto custa se estiver errada).
- **Skill:** `superpowers:test-driven-development`; `superpowers:executing-plans` ou `superpowers:subagent-driven-development`; `superpowers:systematic-debugging` quando algo falhar.
- **Resultado:** commits na branch, suíte verde, ledger de decisões.
- **Portão:** os testes macro verdes (veja [03](03-skills-e-testes.md)).

## Fase 5 · Validar

- **Entrada:** branch com testes macro verdes.
- **Passos:** revisão com contexto limpo (outra sessão ou subagente na versão mais capaz), conferência contra os critérios de aceite e a referência, exploração no navegador ou no ambiente real, micro e macro.
- **Skill:** `superpowers:requesting-code-review`, `superpowers:verification-before-completion`, `engineering:code-review`, `design:accessibility-review` quando houver interface.
- **Resultado:** lista de achados classificados (crítico, importante, menor). Críticos e importantes são corrigidos com teste que falha antes; menores viram pendências registradas.
- **Portão:** nenhum crítico ou importante em aberto.

## Fase 6 · Integrar

- **Entrada:** validação concluída.
- **Passos:** envie a branch, deixe o CI rodar, abra o Pull Request com o modelo, traga a `main` para a branch se ela estiver desatualizada, integre (sem apagar a branch remota), confira a `main` e o CI dela.
- **Skill:** `superpowers:finishing-a-development-branch`.
- **Resultado:** a `main` com a mudança, suítes e CI verdes.
- **Portão:** o "pode integrar" da pessoa (veja os portões abaixo).

## Fase 7 · Publicar

- **Entrada:** `main` verde.
- **Passos:** lista de verificação de publicação (variáveis de ambiente, endereço público, indexação, dados de exemplo, desempenho, acessibilidade, monitoramento, plano de reversão). Se houver dados fictícios de exemplo, **uma trava automática** impede a publicação enquanto eles existirem.
- **Skill:** `engineering:deploy-checklist`.
- **Resultado:** o produto no ar.
- **Portão:** a pessoa autoriza a publicação.

## Fase 8 · Manter

- **Passos:** registre pendências e decisões, atualize a memória do projeto, faça uma retrospectiva curta dos erros e transforme cada erro em uma regra ou em um teste. Para incidentes, use `engineering:incident-response`; para dívida técnica, `engineering:tech-debt`.
- **Resultado:** pendências visíveis (issues) e a memória em dia.

## Fase 9 · Fechamento (retrospectiva)

Ao fim de um projeto, ou de um marco grande, o método aprende com ele. É o que mantém este repositório vivo.

- **Passos:**
  1. A integradora lê as issues, os PRs e as lições do projeto e preenche um [caso](../casos/_modelo-caso.md): contexto, o que funcionou, o que falhou, medidas. Se o projeto rodou no Orca, consulte também as conversas dos agentes com `orca search` (só leitura, com a autorização da pessoa): elas guardam as correções que não viraram commit.
  2. Cada erro vira uma **lição** em [licoes](../licoes/_indice.md) (o que aconteceu, a causa, a regra) e, quando couber, um teste ou um passo do fluxo.
  3. Se o projeto é de um tipo que ainda não tem [cenário](../cenarios/README.md), crie um como `rascunho`; se já tem, ajuste-o e, com o caso registrado, suba o selo de maturidade.
  4. Se uma regra do método mudou, registre uma [decisão](../decisoes/_modelo-decisao.md).
  5. Leve tudo ao repositório do método por Pull Request, com `node scripts/verificar.mjs` verde.
- **Regra de ouro:** **nada entra no método sem um caso real que o justifique.** Opinião sem evidência fica de fora.
- **Resultado:** um caso registrado, lições novas (se houve erros) e o método atualizado e versionado.
- **Portão:** a pessoa aprova o Pull Request do método.

## Portões de aprovação

O humano é quem aprova, **sempre por escrito e antes** da ação:

| Ação | Quem decide |
|---|---|
| Interpretação de um pedido ambíguo | A pessoa |
| Desenho / spec / plano | A pessoa |
| Enviar uma branch ao remoto | Combinado no fluxo (autorizado de uma vez) |
| Integrar na `main` | A pessoa, a cada mudança |
| Publicar em produção | A pessoa |
| Apagar dados, sessões, branches não integradas | A pessoa, depois de ver exatamente o que será apagado |
| Reescrever histórico, `push --force`, mudar configuração de conta | A pessoa, com aviso do que muda e do que não tem volta |

Uma aprovação vale **para aquela mudança**. Aprovar uma coisa não autoriza a seguinte.
