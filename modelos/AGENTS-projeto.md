# Instruções para os agentes Codex deste projeto

Este arquivo é lido automaticamente pelo Codex. Ele foi gerado pelo método de desenvolvimento e vale junto com o `CLAUDE.md`: as regras são as mesmas para o Codex e para o Claude. Quem mudar um dos dois confere o outro.

O projeto usa **um agente principal só**, o da linha `Agente principal:` do `docs/DESENVOLVIMENTO.md`. Se ela diz Codex, todas as sessões são Codex: a coordenadora (a integradora), os especialistas e as trabalhadoras. Se diz Claude Code, você não deveria estar trabalhando aqui: avise a pessoa e pare.

Versão do método: {{VERSAO}}

## Antes de começar

Leia, nesta ordem: `CLAUDE.md`, `docs/DESENVOLVIMENTO.md` e `docs/memoria-do-projeto.md`. As regras do `CLAUDE.md` valem para você como se estivessem aqui.

## Como você trabalha aqui

- **Responda em português.** Nomes de Skills, comandos e código ficam como são. Pronomes não declarados: use o neutro.
- **Consulte o método pela skill `metodo:consultar`** (plugin `metodo`). Se o plugin não estiver instalado no Codex, avise quem abriu você com `orca orchestration ask` (a coordenadora leva à pessoa; se você é a coordenadora, avise a pessoa). Não instale nada.
- **Use as Skills e diga qual está em uso:** `superpowers:test-driven-development` para implementar (o teste novo é escrito primeiro e visto falhar pelo motivo certo), `superpowers:systematic-debugging` para bugs e `superpowers:verification-before-completion` antes de dizer "pronto".
- **Se você é a coordenadora** (a integradora do projeto, aberta pela pessoa na pasta principal): siga o prompt `modelos/prompt-coordenadora-orca.md` do método (pela skill `metodo:consultar`) ou, no modo com especialistas, o harness `docs/agentes/integradora.md`. Você é a única que integra, só com o "pode integrar" da pessoa, e abre todos os agentes com `--agent codex --model gpt-6.1-sol`.
- **Se você é uma trabalhadora**, faça só a tarefa recebida, nos arquivos permitidos dela. Dúvidas vão para a coordenadora com `orca orchestration ask`, nunca para a pessoa.
- **Com agentes especialistas**: se você foi aberto como especialista, leia primeiro o seu harness em `docs/agentes/` e atue dentro dele; se é uma trabalhadora, siga a tarefa e as regras do harness de quem a abriu. Dúvidas vão para quem a abriu, com `orca orchestration ask`.
- **Contrato da API.** Se o projeto tem um contrato (por exemplo, `docs/contrato-api.md`), siga-o. Se a tarefa pedir algo que o contrato não prevê, pare e pergunte à coordenadora; não mude o contrato numa tarefa de construção.
- **Ponytail** (rascunho, se estiver instalado): a menor mudança que resolve a tarefa inteira vale para a solução. **O TDD do método vale sobre o ponytail:** o teste novo é escrito antes e visto falhar; o "um teste pequeno" dele não basta. Spec, portões, revisão e validação não se cortam. Nível `full`; o `ultra` não é usado. Atalho deliberado leva `shortcut: <o limite>, <quando melhorar>`. **No Codex, o ponytail fica só sob demanda** (`$ponytail:ponytail-review`, `$ponytail:ponytail-audit`, `$ponytail:ponytail-debt`), sem os ganchos que o deixam sempre ligado: nos modelos de raciocínio ele pode encarecer em vez de economizar. Ligar de vez é decisão da pessoa, depois de medir. No Codex, **não carregue a skill `ponytail` por conta própria**: use só os comandos de revisão, auditoria e dívida quando o harness ou a coordenadora pedirem. Nunca use `/ponytail default`, que muda todas as sessões do computador. Pedido vago passa pelo brainstorming ou por uma pergunta, nunca vira "a menor versão"; e o que os critérios de aceite, o contrato, o harness e as skills do método exigem conta como pedido, e não se corta.
- **Uma tarefa, uma branch, um PR.** Ao terminar: traga a `main` (`git fetch origin && git merge origin/main`), rode a suíte completa, os tipos e o build, envie a branch e abra o PR com o modelo, escrevendo `Closes #<N>`.
- **Nunca integre** na `main`, nunca use `push --force` e nunca reescreva histórico.
- **O método é só leitura.** Uma lição nova vira nota para a coordenadora e vai para a memória do projeto.
