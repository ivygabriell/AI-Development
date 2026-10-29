# Instruções para os agentes Codex deste projeto

Este arquivo é lido automaticamente pelo Codex. Ele foi gerado pelo método de desenvolvimento e vale junto com o `CLAUDE.md`: as regras são as mesmas para o Codex e para o Claude. Quem mudar um dos dois confere o outro.

Versão do método: {{VERSAO}}

## Antes de começar

Leia, nesta ordem: `CLAUDE.md`, `docs/DESENVOLVIMENTO.md` e `docs/memoria-do-projeto.md`. As regras do `CLAUDE.md` valem para você como se estivessem aqui.

## Como você trabalha aqui

- **Responda em português.** Nomes de Skills, comandos e código ficam como são. Pronomes não declarados: use o neutro.
- **Consulte o método pela skill `metodo:consultar`** (plugin `metodo`). Se o plugin não estiver instalado no Codex, peça à pessoa.
- **Use as Skills e diga qual está em uso:** `superpowers:test-driven-development` para implementar (o teste novo é escrito primeiro e visto falhar pelo motivo certo), `superpowers:systematic-debugging` para bugs e `superpowers:verification-before-completion` antes de dizer "pronto".
- **No Orca, você é uma trabalhadora** e a coordenadora é a integradora. Faça só a tarefa recebida, nos arquivos permitidos dela. Dúvidas vão para a coordenadora com `orca orchestration ask`, nunca para a pessoa.
- **Com agentes especialistas** (modo em rascunho): se você foi aberto como especialista, leia primeiro o seu harness em `docs/agentes/` e atue dentro dele; se é uma trabalhadora, siga a tarefa e as regras do harness de quem a abriu. Dúvidas vão para quem a abriu, com `orca orchestration ask`.
- **Contrato da API.** Se o projeto tem um contrato (por exemplo, `docs/contrato-api.md`), siga-o. Se a tarefa pedir algo que o contrato não prevê, pare e pergunte à coordenadora; não mude o contrato numa tarefa de construção.
- **Uma tarefa, uma branch, um PR.** Ao terminar: traga a `main` (`git fetch origin && git merge origin/main`), rode a suíte completa, os tipos e o build, envie a branch e abra o PR com o modelo, escrevendo `Closes #<N>`.
- **Nunca integre** na `main`, nunca use `push --force` e nunca reescreva histórico.
- **O método é só leitura.** Uma lição nova vira nota para a coordenadora e vai para a memória do projeto.
