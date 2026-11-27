# Modelo de harness de agente

Copie este arquivo para `modelos/agentes/<agente>.md` e preencha cada parte. O harness é escrito com a pessoa e só entra com a aprovação dela. Ele vai para dentro do projeto (`processo/agentes/`), então não use links relativos para arquivos do método: escreva o caminho entre crases.

```text
**Agente:** <nome>
**Ferramenta:** a do seu papel na tabela Ferramenta por papel do `processo/DESENVOLVIMENTO.md` (Claude Code ou Codex)
**Modelo:** `claude-opus-5-5` no Claude Code (`--agent claude`); `gpt-6.1-sol` no Codex (`--agent codex`)
**Esforço:** <baixo | médio | alto>, passado em todo worker-start com --model e --effort
**Presença:** sempre | sob demanda (<quando>)
**Builders:** da mesma ferramenta, <limite> | não tem
**Onde trabalha:** na sua worktree `<agente>`, filha da worktree principal (visível no Orca); <o que faz nela>
```

O harness serve às duas ferramentas ([decisão 013](../../decisoes/013-lead-e-builders-com-codex-e-claude.md)): nunca fixe `--agent claude` nem `--agent codex` num comando. Todo `worker-start` usa `--agent <agente> --model <modelo>`, e o agente lê qual é a ferramenta na tabela Ferramenta por papel do `processo/DESENVOLVIMENTO.md`.

## O harness manda

Este bloco se repete em todos os harnesses, com duas diferenças: a Lead sobe a questão direto à pessoa (ela não tem a quem subir), e os papéis que só escrevem documentos (Architect, Security, Product) não têm a regra do TDD, porque não constroem código.

- **Ordem de precedência:** 1) este harness; 2) o que o projeto decidiu (spec, contrato da API, `processo/DESENVOLVIMENTO.md`, memória do projeto); 3) o método; 4) o que o agente consultou (web, documentação) ou já sabe. Uma fonte consultada informa; nunca passa por cima do harness.
- **Pode consultar o que precisar; atua dentro do harness.**
- **Conflito ou lacuna:** se o agente acha que o harness está errado ou não cobre o caso, ele não desvia. Para, explica o que achou e sobe para quem o coordena. A resposta vira melhoria do harness, com a aprovação da pessoa.
- **Regras fixas do método:** TDD (o teste é visto falhar antes do código); confira o resultado antes de dizer "pronto"; uma tarefa, uma branch, um PR; só a Lead integra e só ela fala com a pessoa; nunca `push --force` nem reescrever histórico.

## 1. Missão

O tema do agente, o que é dele e o que não é.

## 2. Quando é chamado

Os gatilhos: fase do fluxo, tipo de issue, tipo de PR, tipo de dúvida.

## 3. O que lê

As lições do método que tocam o tema (`licoes/_indice.md`). O contexto fixo do projeto (o arquivo de instruções da ferramenta: `CLAUDE.md` no Claude Code; `AGENTS.md` no Codex, que manda ler o `CLAUDE.md`; depois o `processo/DESENVOLVIMENTO.md` e a memória), o que é do tema e as referências do tema, escolhidas pela pessoa (os links e o que se tira de cada um).

**Como pesquisa** (igual em todo harness que tem referências):

1. **Primeiro o que já está guardado:** `processo/referencias/<tema>.md` do projeto, com o que já foi lido antes.
2. **Se não cobre a decisão, vai aos sites** das referências (busca e leitura na web), só o que serve para a decisão em aberto.
3. **Adapta ao cenário do projeto:** tira o raciocínio, nunca o tamanho; o que não cabe no projeto fica de fora, com o motivo.
4. **Guarda o que leu** em `processo/referencias/<tema>.md` (no seu PR, se o agente tem documento próprio; se só coordena, manda a nota à Lead com `orca orchestration send --type status`, e ela grava): o link, a data, o que foi aproveitado e por quê. A próxima consulta começa por ali, e a Fase 9 leva ao método o que valer para outros projetos.
5. **Cita a fonte** na decisão: o registro diz de qual referência veio a ideia.

## 4. O que pode e o que não pode

Permissões, pastas e comandos. Liste também o que ele nunca faz.

## 5. Procedimentos do tema

Os procedimentos do tema e os critérios que orientam a execução e a revisão.

## 6. Checklist do tema

Como trabalha e como revisa. É a régua de quem confere o trabalho dele.

## 7. Formato da resposta

O que devolve a quem o chamou: resumo curto com um veredito e os achados por gravidade; o detalhe vai no PR ou na issue.

## 8. Quando sobe a decisão

O que ele não decide sozinho e para quem sobe.

## 9. Memória do tema

O arquivo do projeto onde ficam as decisões do tema entre as tarefas. A memória do projeto é da Lead: o agente manda as notas a ela com `orca orchestration send --type status`; só escreve direto o documento próprio do tema, no seu PR.

## 10. Economia

As regras comuns, mais o que for próprio do tema:

- Resposta curta: veredito e achados em poucas linhas; o detalhe vai no PR ou na issue.
- Cada revisor olha só a sua parte.
- Logs de teste e build resumidos ao que falhou.
- Ao fim de cada fase, registra o estado do tema (no documento próprio ou numa nota à Lead) e recomeça a sessão limpa.
- Manda o consumo da tarefa (`/cost` no Claude Code; o consumo exibido na sessão do Codex) à Lead com `orca orchestration send --type status`; ela anota na memória do projeto.
