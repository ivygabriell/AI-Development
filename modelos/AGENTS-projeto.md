# Instruções para os agentes Codex deste projeto

Este arquivo é lido automaticamente pelo Codex. Ele foi gerado pelo método de desenvolvimento e vale junto com o `CLAUDE.md`: as regras são as mesmas para o Codex e para o Claude. Quem mudar um dos dois confere o outro.

O projeto usa o Claude Code e o Codex juntos: cada papel tem a sua ferramenta na tabela **Ferramenta por papel** do `processo/DESENVOLVIMENTO.md` (a Lead fica no Claude Code; Backend, Security e Ops costumam ficar no Codex). Uma Builder Codex pode também ter sido aberta por um papel do Claude, quando a cota dele apertou: a issue diz a ferramenta e, numa passagem, onde a outra parou. Se o seu papel não está no Codex e nada na issue explica, avise quem abriu você e pare.

Versão do método: {{VERSAO}}

## Antes de começar

Leia, nesta ordem: `CLAUDE.md`, `processo/DESENVOLVIMENTO.md` e `processo/memoria-do-projeto.md`. As regras do `CLAUDE.md` valem para você como se estivessem aqui.

## Como você trabalha aqui

- **Responda em português.** Nomes de comandos e código ficam como são. Pronomes não declarados: use o neutro.
- **Consulte o método na cópia local de AI Development.** O núcleo está em `nucleo/` e os exemplos estão em `modelos/`. Se a localização não estiver registrada em `processo/DESENVOLVIMENTO.md`, peça à Lead.
- **Siga a trilha de impacto da tarefa.** Defina o alvo, escreva o teste antes do código quando mudar comportamento ou corrigir bug e registre a evidência prevista. Se surgir risco novo, avise a Lead antes de avançar.
- **Use o Agent Skills.** Leia o ciclo do núcleo 01. Para revisão independente, uma sessão Codex recebe o escopo e usa as skills pertinentes.
- **Se você é a Lead:** siga `modelos/prompt-lead-orca.md` ou `processo/agentes/lead.md` no modo com especialistas. Você integra conforme os critérios do núcleo 01 e as autorizações registradas. Abra cada agente na ferramenta do papel indicada na tabela Ferramenta por papel.
- **Se você é uma Builder**, faça só a tarefa recebida, nos arquivos permitidos dela. Dúvidas vão para a Lead com `orca orchestration ask`, nunca para a pessoa.
- **Com agentes especialistas**: se você foi aberto como especialista, leia primeiro o seu harness em `processo/agentes/` e atue dentro dele; se é uma Builder, siga a tarefa e as regras do harness de quem a abriu. Dúvidas vão para quem a abriu, com `orca orchestration ask`.
- **Requisitos e telas.** Cite os R-xx de `processo/requisitos.md` quando aplicáveis. Implemente as telas aprovadas no Figma e registradas em `processo/telas/`. A Lead aprova ajustes básicos dentro da identidade e do fluxo aprovados. Se o desenho mudar, atualize o frame e seu registro antes do código. Requisito ou tela nova passa pela pessoa.
- **Contrato da API.** Se o projeto tem um contrato (por exemplo, `processo/contrato-api.md`), siga-o. Se a tarefa pedir algo que o contrato não prevê, pare e pergunte à Lead; não mude o contrato numa tarefa de construção.
- **Uma tarefa, uma branch, um PR.** Ao terminar, traga a `main` (`git fetch origin && git merge origin/main`), rode as verificações da trilha e abra o PR com o modelo. Use `Closes #<N>` se houver issue.
- **Se você não é a Lead, nunca integre** na `main`. Ninguém usa `push --force` nem reescreve histórico sem a pessoa.
- **O método é só leitura.** Registre o aprendizado na memória do projeto pela Lead.
