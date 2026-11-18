# Instruções para as sessões deste projeto

Este arquivo é lido automaticamente por qualquer sessão do Claude Code aberta nesta pasta. Ele foi gerado pelo método de desenvolvimento; ajuste-o à medida que o projeto decidir.

Versão do método: {{VERSAO}}

@docs/DESENVOLVIMENTO.md
@docs/memoria-do-projeto.md

## Como as sessões trabalham aqui

- **Responda em português.** Nomes de Skills, comandos e código ficam como são. Pronomes não declarados: use o neutro.
- **Consulte o método pela skill `metodo:consultar`** (plugin `metodo`): ela diz onde está a cópia do método e o que ler para cada fase, cenário ou dúvida. Se o plugin não estiver instalado, peça à pessoa.
- **Siga as fases do método** e diga qual Skill está usando: `superpowers:brainstorming` antes de criar ou reestruturar, `superpowers:test-driven-development` para implementar, `superpowers:systematic-debugging` para bugs e `superpowers:verification-before-completion` antes de dizer "pronto".
- **Comece lendo a memória** (`docs/memoria-do-projeto.md`) e atualize-a ao fim de cada fase, numa branch, junto com o trabalho da fase.
- **O método é só leitura.** Nunca altere a cópia do método. Uma lição nova vira nota na memória e é levada ao método na Fase 9.
- **Ferramenta por papel**: o projeto usa o Claude Code (lê este arquivo) e o Codex (lê o `AGENTS.md`, que manda ler este) juntos. A tabela Ferramenta por papel do `docs/DESENVOLVIMENTO.md` diz a de cada papel; no Orca, `--agent claude` ou `--agent codex`, conforme a tabela. A Builder vai para a outra ferramenta quando a cota aperta, com passagem pela issue (commit, branch enviada, comentário de onde parou). Todo PR recebe ao menos uma revisão da outra ferramenta. Mudar a tabela é uma decisão da pessoa.
- **Orquestração com o Orca**: se este projeto roda no Orca, a Lead coordena e cada agente supervisionado é uma Builder. A Lead usa o prompt `modelos/prompt-lead-orca.md` do método; os agentes nunca integram e perguntam à Lead com `orca orchestration ask`, nunca à pessoa; o que aciona um gatilho de aprovação (deploy, o irreversível, o merge com gatilho) passa por um portão que só a pessoa resolve; o resto a Lead decide e registra (seção Aprovações do `docs/DESENVOLVIMENTO.md`). Quando back e front são construídos em tarefas paralelas, o contrato da API é fechado e aprovado antes de qualquer tarefa de construção.
- **Com agentes especialistas**: se o projeto tem `docs/agentes/`, cada agente (a Lead, os especialistas) lê primeiro o seu harness ali e atua dentro dele: o harness manda; o que se consulta informa. A Lead coordena os especialistas, e cada especialista abre e coordena as suas Builders no Orca.
- **Ponytail** (rascunho, se estiver instalado): ele faz a menor mudança que resolve a tarefa inteira, e isso vale para a solução. **O TDD do método vale sobre o ponytail:** o teste novo é escrito antes e visto falhar, e a suíte, os tipos e o build fecham a tarefa; o "um teste pequeno" dele não basta. Spec, portões, revisão e validação não se cortam. Nível `full`; o `ultra` não é usado. Atalho deliberado leva `shortcut: <o limite>, <quando melhorar>` e vira pendência na memória. O nível vale por pasta: troque só na sessão (`/ponytail off`, `/ponytail full`) e nunca use `/ponytail default`, que muda todas as sessões do computador. Pedido vago passa pelo brainstorming ou por uma pergunta, nunca vira "a menor versão"; e o que os critérios de aceite, o contrato, o harness e as skills do método exigem conta como pedido, e não se corta.
- **Método mais novo:** se a versão do método instalada (skill `metodo:consultar`) for maior que a "Versão do método" acima, sugira à pessoa rodar `/metodo:atualizar-projeto`.
- **Bugs** seguem o "Ciclo de um bug" do método (skill `metodo:consultar`): issue com o formulário de bug, triagem da Lead, teste que falha por causa do bug antes da correção. Bug achado **fora do escopo** da tarefa vira issue nova; não cresça a tarefa.
- **Peça confirmação antes do que aciona um gatilho de aprovação** (seção Aprovações do `docs/DESENVOLVIMENTO.md`): deploy, apagar algo, reescrever histórico, integrar um PR com gatilho. Enviar a branch e abrir o PR fazem parte do fluxo; o PR sem gatilho, a Lead integra e registra. Nunca use `push --force`.
