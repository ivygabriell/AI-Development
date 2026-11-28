# Instruções para as sessões deste projeto

Este arquivo é lido automaticamente por qualquer sessão do Claude Code aberta nesta pasta. Ele foi gerado pelo método de desenvolvimento; ajuste-o à medida que o projeto decidir.

Versão do método: {{VERSAO}}

@processo/DESENVOLVIMENTO.md
@processo/memoria-do-projeto.md

Tudo o que é do processo (regras, requisitos, telas, harnesses, memória, scripts de worktree) fica em `processo/`: a raiz é do código. A documentação do produto usa a própria pasta (`docs/`), que não é do método.

## Como as sessões trabalham aqui

- **Responda em português.** Nomes de comandos e código ficam como são. Pronomes não declarados: use o neutro.
- **Consulte o método na cópia local de AI Development.** O núcleo está em `nucleo/` e os exemplos estão em `modelos/`. Se a localização não estiver registrada em `processo/DESENVOLVIMENTO.md`, peça à Lead.
- **Siga a trilha de impacto da tarefa.** A Lead classifica pelo núcleo 01. Defina o alvo, escreva o teste antes do código quando mudar comportamento ou corrigir bug e registre a evidência prevista.
- **Use o Agent Skills.** Aplique as skills do ciclo do núcleo 01 nos caminhos e portões deste projeto. Use as personas do Claude Code quando a Lead pedir parecer especializado.
- **Comece lendo a memória** (`processo/memoria-do-projeto.md`) e atualize-a ao fim de cada fase, numa branch, junto com o trabalho da fase.
- **O método é só leitura.** Nunca altere a cópia do método. Registre aprendizados na memória do projeto e proponha ajustes de processo na Fase 9.
- **Ferramenta por papel.** Use a tabela do `processo/DESENVOLVIMENTO.md`. O Codex lê o `AGENTS.md` e segue este arquivo. No Orca, use `--agent claude` ou `--agent codex` conforme a tabela. Em projetos com duas ferramentas, a revisão cruzada se aplica ao Padrão e ao Profundo. Em passagem por cota, registre commit, branch e ponto de retomada na issue. Mudar a tabela é decisão da pessoa.
- **Orquestração com o Orca**: se este projeto roda no Orca, a Lead coordena e cada agente supervisionado é uma Builder. A Lead usa o prompt `modelos/prompt-lead-orca.md` do método; os agentes nunca integram e perguntam à Lead com `orca orchestration ask`, nunca à pessoa; o que aciona um gatilho de aprovação (deploy, o irreversível, o merge com gatilho) passa por um portão que só a pessoa resolve; o resto a Lead decide e registra (seção Aprovações do `processo/DESENVOLVIMENTO.md`). Quando back e front são construídos em tarefas paralelas, o contrato da API é fechado e aprovado antes de qualquer tarefa de construção.
- **Com agentes especialistas**: se o projeto tem `processo/agentes/`, cada agente (a Lead, os especialistas) lê primeiro o seu harness ali e atua dentro dele: o harness manda; o que se consulta informa. A Lead coordena os especialistas, e cada especialista abre e coordena as suas Builders no Orca.
- **Método mais novo:** compare a versão deste projeto com o arquivo `VERSION` do método e consulte o `CHANGELOG.md` antes de propor a atualização.
- **Requisitos e telas.** Cite os R-xx de `processo/requisitos.md` quando aplicáveis. Implemente as telas aprovadas no Figma e registradas em `processo/telas/`. A Lead aprova ajustes básicos dentro da identidade e do fluxo aprovados. Se o desenho mudar, atualize o frame e seu registro antes do código. Requisito ou tela nova passa pela pessoa.
- **Bugs** seguem o "Ciclo de um bug" do método: issue com o formulário de bug, triagem da Lead, teste que falha por causa do bug antes da correção. Bug achado **fora do escopo** da tarefa vira issue nova; não cresça a tarefa.
- **Integração direta.** Use os critérios do núcleo 01 e os gatilhos em `processo/DESENVOLVIMENTO.md`. A Lead integra e registra quando aceite, CI, revisão e autorizações estão completos. Se houver gatilho pendente para merge ou deploy, obtenha a autorização antes. Nunca use `push --force`.
