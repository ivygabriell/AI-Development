# Instruções para as sessões deste projeto

Este arquivo é lido automaticamente por qualquer sessão do Claude Code aberta nesta pasta. Ele foi gerado pelo método de desenvolvimento; ajuste-o à medida que o projeto decidir.

Versão do método: {{VERSAO}}

@processo/DESENVOLVIMENTO.md
@processo/memoria-do-projeto.md

Tudo o que é do processo (regras, requisitos, telas, harnesses, memória, scripts de worktree) fica em `processo/`: a raiz é do código. A documentação do produto usa a própria pasta (`docs/`), que não é do método.

## Como as sessões trabalham aqui

- **Responda em português.** Nomes de comandos e código ficam como são. Pronomes não declarados: use o neutro.
- **Consulte o método na cópia local de AI Development.** O núcleo está em `nucleo/` e os exemplos estão em `modelos/`. Se a localização não estiver registrada em `processo/DESENVOLVIMENTO.md`, peça à Lead.
- **Siga o fluxo do método.** Defina o alvo, escreva o teste antes do código, investigue a causa dos bugs e verifique o resultado antes de concluir.
- **Comece lendo a memória** (`processo/memoria-do-projeto.md`) e atualize-a ao fim de cada fase, numa branch, junto com o trabalho da fase.
- **O método é só leitura.** Nunca altere a cópia do método. Uma lição nova vira nota na memória e é levada ao método na Fase 9.
- **Ferramenta por papel**: o projeto usa o Claude Code (lê este arquivo) e o Codex (lê o `AGENTS.md`, que manda ler este) juntos. A tabela Ferramenta por papel do `processo/DESENVOLVIMENTO.md` diz a de cada papel; no Orca, `--agent claude` ou `--agent codex`, conforme a tabela. A Builder vai para a outra ferramenta quando a cota aperta, com passagem pela issue (commit, branch enviada, comentário de onde parou). Todo PR recebe ao menos uma revisão da outra ferramenta. Mudar a tabela é uma decisão da pessoa.
- **Orquestração com o Orca**: se este projeto roda no Orca, a Lead coordena e cada agente supervisionado é uma Builder. A Lead usa o prompt `modelos/prompt-lead-orca.md` do método; os agentes nunca integram e perguntam à Lead com `orca orchestration ask`, nunca à pessoa; o que aciona um gatilho de aprovação (deploy, o irreversível, o merge com gatilho) passa por um portão que só a pessoa resolve; o resto a Lead decide e registra (seção Aprovações do `processo/DESENVOLVIMENTO.md`). Quando back e front são construídos em tarefas paralelas, o contrato da API é fechado e aprovado antes de qualquer tarefa de construção.
- **Com agentes especialistas**: se o projeto tem `processo/agentes/`, cada agente (a Lead, os especialistas) lê primeiro o seu harness ali e atua dentro dele: o harness manda; o que se consulta informa. A Lead coordena os especialistas, e cada especialista abre e coordena as suas Builders no Orca.
- **Método mais novo:** compare a versão deste projeto com o arquivo `VERSION` do método e consulte o `CHANGELOG.md` antes de propor a atualização.
- **Requisitos e telas antes do código**: toda tarefa atende requisitos de `processo/requisitos.md` (R-xx). Com interface, nenhuma tela é codada sem estar aprovada pela pessoa e registrada em `processo/telas/` (captura, link do frame do Figma e `tokens.json`); o código segue a versão registrada. Mudança de tela começa no Figma, é aprovada e registrada, e só então vai para o código. Requisito ou tela nova passa pela pessoa.
- **Bugs** seguem o "Ciclo de um bug" do método: issue com o formulário de bug, triagem da Lead, teste que falha por causa do bug antes da correção. Bug achado **fora do escopo** da tarefa vira issue nova; não cresça a tarefa.
- **Peça confirmação antes do que aciona um gatilho de aprovação** (seção Aprovações do `processo/DESENVOLVIMENTO.md`): deploy, apagar algo, reescrever histórico, integrar um PR com gatilho. Enviar a branch e abrir o PR fazem parte do fluxo; o PR sem gatilho, a Lead integra e registra. Nunca use `push --force`.
