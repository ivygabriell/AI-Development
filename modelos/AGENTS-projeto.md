# Instruções para os agentes Codex deste projeto

Este arquivo é lido automaticamente pelo Codex. Ele foi gerado pelo método de desenvolvimento e vale junto com o `CLAUDE.md`: as regras são as mesmas para o Codex e para o Claude. Quem mudar um dos dois confere o outro.

O projeto usa o Claude Code e o Codex juntos: cada papel tem a sua ferramenta na tabela **Ferramenta por papel** do `processo/DESENVOLVIMENTO.md` (a Lead fica no Claude Code; Backend, Security e Ops costumam ficar no Codex). Uma Builder Codex pode também ter sido aberta por um papel do Claude, quando a cota dele apertou: a issue diz a ferramenta e, numa passagem, onde a outra parou. Se o seu papel não está no Codex e nada na issue explica, avise quem abriu você e pare.

Versão do método: {{VERSAO}}

## Antes de começar

Leia, nesta ordem: `CLAUDE.md`, `processo/DESENVOLVIMENTO.md` e `processo/memoria-do-projeto.md`. As regras do `CLAUDE.md` valem para você como se estivessem aqui.

## Como você trabalha aqui

- **Responda em português.** Nomes de comandos e código ficam como são. Pronomes não declarados: use o neutro.
- **Consulte o método na cópia local de AI Development.** O núcleo está em `nucleo/` e os exemplos estão em `modelos/`. Se a localização não estiver registrada em `processo/DESENVOLVIMENTO.md`, peça à Lead.
- **Siga o fluxo do método.** Defina o alvo, escreva o teste antes do código, investigue a causa dos bugs e verifique o resultado antes de concluir.
- **Se você é a Lead** (aberta pela pessoa na pasta principal): siga o prompt `modelos/prompt-lead-orca.md` do método ou, no modo com especialistas, o harness `processo/agentes/lead.md`. Você é a única que integra: sem gatilho de aprovação, sozinha; com gatilho, só com o "pode integrar" da pessoa. Abre cada agente na ferramenta do papel dele (tabela Ferramenta por papel).
- **Se você é uma Builder**, faça só a tarefa recebida, nos arquivos permitidos dela. Dúvidas vão para a Lead com `orca orchestration ask`, nunca para a pessoa.
- **Com agentes especialistas**: se você foi aberto como especialista, leia primeiro o seu harness em `processo/agentes/` e atue dentro dele; se é uma Builder, siga a tarefa e as regras do harness de quem a abriu. Dúvidas vão para quem a abriu, com `orca orchestration ask`.
- **Requisitos e telas antes do código**: toda tarefa atende requisitos de `processo/requisitos.md` (R-xx). Com interface, nenhuma tela é codada sem estar aprovada pela pessoa e registrada em `processo/telas/` (captura, link do frame do Figma e `tokens.json`); o código segue a versão registrada. Mudança de tela começa no Figma, é aprovada e registrada, e só então vai para o código. Requisito ou tela nova passa pela pessoa.
- **Contrato da API.** Se o projeto tem um contrato (por exemplo, `processo/contrato-api.md`), siga-o. Se a tarefa pedir algo que o contrato não prevê, pare e pergunte à Lead; não mude o contrato numa tarefa de construção.
- **Uma tarefa, uma branch, um PR.** Ao terminar: traga a `main` (`git fetch origin && git merge origin/main`), rode a suíte completa, os tipos e o build, envie a branch e abra o PR com o modelo, escrevendo `Closes #<N>`.
- **Se você não é a Lead, nunca integre** na `main`. Ninguém usa `push --force` nem reescreve histórico sem a pessoa.
- **O método é só leitura.** Uma lição nova vira nota para a Lead e vai para a memória do projeto.
