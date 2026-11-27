# 01 · Fluxo de ponta a ponta

Da ideia à manutenção, em dez fases (0 a 9). Cada fase tem uma **entrada**, um **resultado**, quem a executa e o **portão** que a fecha. O princípio que organiza tudo: nunca construa antes de o alvo estar definido e aprovado, e nunca diga que terminou sem evidência.

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
- **Resultado:** um entendimento que a pessoa reconhece e corrige.
- **Portão:** a pessoa confirma o entendimento.

## Fase 1 · Referências e contexto

- **Entrada:** o entendimento da Fase 0.
- **Passos:** leia o que já existe (código, documentos, histórico). Se há uma referência externa (um site, um app), estude-a de verdade, com medições, e não de memória: veja [04](04-referencias-e-engenharia-reversa.md). Ache a referência pelo **título exato** que a pessoa citou.
- **Resultado:** um registro dos achados (o quê, como, valor, fonte).
- **Portão:** se o que você achou não bate com o que foi pedido, **pare e pergunte**.

## Fase 2 · Desenho e spec

- **Entrada:** entendimento e achados.
- **Ordem** ([decisão 015](../decisoes/015-requisitos-e-telas-antes-do-codigo.md)): **requisitos → identidade → telas → spec**, cada um com o seu portão; sem interface, **requisitos → spec**. Tudo é aprovado antes do plano, e portanto antes de qualquer código, inclusive do back.
- **Requisitos:** o Product (sem o modo com especialistas, a Lead), no papel de engenheiro de requisitos ou PO, descreve cada requisito numa ficha de `processo/requisitos.md`, pelo [modelo de requisitos](../modelos/modelo-requisitos.md): história, regras de negócio, casos de erro, critérios de aceite, dependências, telas e o peso (valor, esforço, risco), com a prioridade proposta. A pessoa aprova a lista, os pesos e a ordem.
- **Identidade e todas as telas, no Figma** (com interface): o Designer ([decisão 017](../decisoes/017-agente-designer.md); sem o modo com especialistas, a Lead) começa **pedindo as referências da pessoa** (sites, apps, marcas de que ela gosta, e os formatos desejados: celular, tablet, desktop), sem as quais não cria nada, e segue a ordem **referências → identidade → telas nos formatos desejados**. Cria no Figma, pelo servidor MCP oficial, seguindo o padrão **do token à tela**: 1) tokens (cores, tipografia, espaçamentos, em duas camadas), 2) componentes base com variantes e estados, 3) padrões (formulário, lista, vazio, erro), 4) todas as telas de cada requisito, com os estados (vazio, carregando, erro, sucesso), celular e desktop, e 5) o fluxo navegável. Com celular entre os formatos, vale o **mobile-first**: o celular é desenhado e construído primeiro, e tablet e desktop acrescentam. A identidade (etapas 1 a 3, com logo, ícones e tom de voz) tem o seu portão antes das telas (etapas 4 e 5). A cada aprovação da pessoa, o registro entra no repositório por PR: `processo/telas/` com uma captura por tela e estado, a data e o link do frame, e `processo/telas/tokens.json` com os tokens do Figma, e o catálogo `processo/telas/design-system.md`, que o Frontend transforma no design system do código. O link do arquivo fica na linha `Telas:` do `processo/DESENVOLVIMENTO.md`. Toda mudança de tela começa no Figma; o código segue só a versão registrada. Escrever no Figma exige assento Full: ligar é decisão da pessoa (gatilho de custo); sem ele, a pessoa desenha no Figma e os agentes só leem.
- **Passos da spec:** proponha 2 ou 3 abordagens com a sua recomendação; apresente o desenho em partes e peça aprovação a cada parte; escreva a spec (objetivo, restrições, estrutura, dados, critérios de aceite, o que fica de fora) e faça uma autorrevisão (pendências, contradições, ambiguidade, escopo).
- **Mapa de riscos de segurança**, junto da spec: o primeiro uso da `security-audit`, no modo de orientação (sem código ainda), pelo [roteiro de segurança](03-skills-e-testes.md#security-audit): quem usa e quem tem menos confiança, as fronteiras de confiança, as superfícies de entrada e os domínios de ataque que se aplicam. Fica em `processo/seguranca.md` e vira critério de aceite nas issues. No modo com especialistas, quem faz é o Security; nos outros, a Lead.
- **Resultado:** `processo/requisitos.md`, a identidade e as telas no Figma registradas em `processo/telas/` (com interface) e a spec versionada, com o mapa de riscos.
- **Portão:** a pessoa aprova, nesta ordem, os requisitos (com os pesos e a ordem), a identidade e todas as telas (com interface) e a spec escrita.

## Fase 3 · Plano

- **Entrada:** spec aprovada.
- **Passos:** quebre em tarefas pequenas (2 a 5 minutos por passo), cada uma com os arquivos exatos, o teste primeiro, o comando e o resultado esperado. Liste as restrições globais e o que a revisão final precisa olhar.
- **Resultado:** plano versionado.
- **Portão:** a pessoa aprova o plano e escolhe o modo de execução (inline, subagentes, sessões divididas ou orquestração com o Orca, inclusive com agentes especialistas por tema; veja [02](02-sessoes-e-papeis.md)). Em qualquer modo, a Lead fica, por padrão, no Claude Code (a linha `Lead:` do `processo/DESENVOLVIMENTO.md` diz qual) e cada papel usa a ferramenta padrão dele (tabela Ferramenta por papel, no [02](02-sessoes-e-papeis.md)); a Builder vai para a outra ferramenta quando a cota aperta.

## Fase 4 · Construir com TDD

- **Entrada:** plano aprovado e uma branch própria a partir da `main` atualizada.
- **Passos:** para cada tarefa, escreva o teste, **veja-o falhar pelo motivo certo**, escreva o mínimo para passar, rode a suíte inteira e faça commits pequenos. Registre cada decisão que desviou do plano (o que, por quê, quanto custa se estiver errada).
- **Resultado:** commits na branch, suíte verde, ledger de decisões.
- **Portão:** os testes macro verdes (veja [03](03-skills-e-testes.md)).

## Fase 5 · Validar

- **Entrada:** branch com testes macro verdes.
- **Passos:** revisão com contexto limpo (outra sessão ou subagente na versão mais capaz), conferência contra os critérios de aceite e a referência, exploração no navegador ou no ambiente real, micro e macro.
- **Resultado:** lista de achados classificados (crítico, importante, menor). Críticos e importantes são corrigidos com teste que falha antes; menores viram pendências registradas.
- **Portão:** nenhum crítico ou importante em aberto.

## Fase 6 · Integrar

- **Entrada:** validação concluída.
- **Passos:** envie a branch, deixe o CI rodar, abra o Pull Request com o modelo, traga a `main` para a branch se ela estiver desatualizada, integre (sem apagar a branch remota), confira a `main` e o CI dela.
- **Resultado:** a `main` com a mudança, suítes e CI verdes.
- **Portão:** os gatilhos de aprovação (abaixo): sem gatilho, a Lead integra e registra; com gatilho, só com o "pode integrar" da pessoa.

## Fase 7 · Publicar

- **Entrada:** `main` verde.
- **Passos:** lista de verificação de publicação (variáveis de ambiente, endereço público, indexação, dados de exemplo, desempenho, acessibilidade, monitoramento, plano de reversão). Se houver dados fictícios de exemplo, **uma trava automática** impede a publicação enquanto eles existirem.
- **Auditoria de segurança, antes da primeira publicação** e depois de cada mudança grande (login novo, API pública nova, troca de infraestrutura): a auditoria completa do código com a `security-audit` da Cloudflare, pelo [roteiro de segurança](03-skills-e-testes.md#security-audit). Vale em qualquer modo: no modo com especialistas, o Security propõe e roda; nos outros, a Lead (ou a Lead do Orca). Sempre por um portão, porque gasta cota: a pessoa aprova o tamanho da auditoria ou a dispensa (por exemplo, um site estático sem login nem formulário), e a dispensa fica anotada na memória do projeto. Achado confirmado crítico ou alto segura a publicação até ser corrigido.
- **Resultado:** o produto no ar.
- **Portão:** a pessoa autoriza a publicação.

## Fase 8 · Manter

- **Passos:** registre pendências e decisões, atualize a memória do projeto, faça uma retrospectiva curta dos erros e transforme cada erro em uma regra ou em um teste. Em incidentes, registre o impacto e escale para a pessoa. Priorize a dívida técnica por impacto, risco e esforço.
- **Resultado:** pendências visíveis (issues) e a memória em dia.

## Fase 9 · Fechamento (retrospectiva)

Ao fim de um projeto, ou de um marco grande, o método aprende com ele. É o que mantém este repositório vivo.

- **Passos:**
  1. A Lead lê as issues, os PRs e as lições do projeto e preenche um [caso](../casos/_modelo-caso.md): contexto, o que funcionou, o que falhou, medidas. Se o projeto rodou no Orca, consulte também as conversas dos agentes com `orca search` (só leitura, com a autorização da pessoa): elas guardam as correções que não viraram commit.
  2. Cada erro vira uma **lição** em [licoes](../licoes/_indice.md) (o que aconteceu, a causa, a regra) e, quando couber, um teste ou um passo do fluxo.
  3. Se o projeto é de um tipo que ainda não tem [cenário](../cenarios/README.md), crie um como `rascunho`; se já tem, ajuste-o e, com o caso registrado, suba o selo de maturidade.
  4. Se uma regra do método mudou, registre uma [decisão](../decisoes/_modelo-decisao.md).
  5. Leve tudo ao repositório do método por Pull Request, com `node scripts/verificar.mjs` verde.
- **Regra de ouro:** **nada entra no método sem um caso real que o justifique.** Opinião sem evidência fica de fora.
- **Resultado:** um caso registrado, lições novas (se houve erros) e o método atualizado e versionado.
- **Portão:** a pessoa aprova o Pull Request do método.

## Portões de aprovação

A pessoa participa só das aprovações com **impacto potencialmente grande**; as demais, a Lead aprova ([decisão 013](../decisoes/013-lead-e-builders-com-codex-e-claude.md)). Uma decisão é **da pessoa** quando aciona **pelo menos um gatilho**:

1. Muda **o que** será construído (escopo, critérios de aceite, prioridade).
2. É **difícil ou impossível de desfazer** (apaga dados, reescreve histórico, configuração de conta).
3. Atinge **usuários reais** (produção, publicação, dados de quem usa).
4. Custa **dinheiro ou muita cota** (serviço pago, nuvem, auditoria completa).
5. **Aceita um risco** de segurança ou de dados pessoais.
6. Muda **as regras do jogo** (harness, método, a Lead, a tabela Ferramenta por papel).

Sem gatilho, decide a Lead e registra na issue ou na memória do projeto. **Na dúvida, sobe para a pessoa** (a classe mais pesada, como na classificação do pedido).

| Fica com a pessoa | Passa para a Lead |
|---|---|
| Entendimento, requisitos (com os pesos e a ordem), spec e plano | Integrar um PR na `main` quando **tudo** vale: dentro do plano aprovado, CI verde, validação sem achado crítico nem importante, só arquivos permitidos e nenhum gatilho |
| A identidade e todas as telas (Figma e `processo/telas/`); tela ou requisito novo no meio do projeto | Ajuste pequeno numa tela aprovada, que não muda fluxo, conteúdo nem identidade (espaço, alinhamento, quebra de texto), feito no Figma primeiro e registrado |
| Mudança de escopo ou de critério de aceite | Desenho curto de tarefa delimitada, dentro do escopo |
| Contrato da API que **quebra** quem usa; migração que apaga ou transforma dados | Mudança **aditiva** no contrato (um campo novo opcional) |
| Serviço ou plano pago, recurso de nuvem, auditoria completa de segurança | Dependência gratuita e comum, refatoração interna, testes, documentação, correção de bug que não muda o comportamento combinado |
| Aceitar um risco; deixar aberto um achado crítico ou alto; mudar login, permissões, pagamento ou dados pessoais; incidente | Achados menores (viram pendências) |
| Publicar, mudar um ambiente publicado, reverter a produção | Abrir e fechar Builders, escolher a ferramenta, fazer as passagens por cota |
| Apagar dados, sessões ou branches não integradas (depois de ver o que será apagado); reescrever histórico, `push --force`, proteção, segredos, configuração de conta | Spikes e as dúvidas dos especialistas |

- **Resumo por marco:** a Lead lista o que aprovou sozinha, com os links para as issues e os PRs. A pessoa lê quando quiser e pode reverter qualquer item.
- **Parâmetros por projeto:** a tabela vai para a seção "Aprovações" do `processo/DESENVOLVIMENTO.md`. Quando a pessoa disser "isso a Lead pode decidir daqui para frente" (ou o contrário), a mudança fica anotada ali e na memória.
- O pedido da pessoa é sempre por escrito e **antes** da ação. Uma aprovação vale **para aquela mudança**; aprovar uma coisa não autoriza a seguinte.
- **No repositório do método** nada disso muda: a pessoa aprova cada PR, como manda o `CLAUDE.md` dele.
