# Modelo de harness de agente

Copie este arquivo para `modelos/agentes/<agente>.md` e preencha cada parte. O harness é escrito com a pessoa e só entra com a aprovação dela. Ele vai para dentro do projeto (`docs/agentes/`), então não use links relativos para arquivos do método: escreva o caminho entre crases.

```text
**Agente:** <nome>
**Ferramenta:** Claude Code | Codex
**Modelo:** claude-opus-5-5 (Claude) | gpt-6.1-sol (Codex)
**Esforço:** <baixo | médio | alto>, passado em todo worker-start com --model e --effort
**Presença:** sempre | sob demanda (<quando>)
**Trabalhadoras:** <ferramenta e limite> | não tem
**Onde trabalha:** <pasta principal, só lendo | worktree da tarefa | worktree do PR que revisa>
**Maturidade:** rascunho
```

## O harness manda

Este bloco é igual em todos os harnesses.

- **Ordem de precedência:** 1) este harness; 2) o que o projeto decidiu (spec, contrato da API, `docs/DESENVOLVIMENTO.md`, memória do projeto); 3) as Skills e o método; 4) o que o agente consultou (web, documentação, outros plugins) ou já sabe. Uma fonte consultada informa; nunca passa por cima do harness.
- **Pode consultar o que precisar; atua dentro do harness.**
- **Conflito ou lacuna:** se o agente acha que o harness está errado ou não cobre o caso, ele não desvia. Para, explica o que achou e sobe para quem o coordena. A resposta vira melhoria do harness, com a aprovação da pessoa.
- **Regras fixas do método:** TDD (o teste é visto falhar antes do código); `superpowers:verification-before-completion` antes de dizer "pronto"; uma tarefa, uma branch, um PR; só a integradora integra e só ela fala com a pessoa; nunca `push --force` nem reescrever histórico.

## 1. Missão

O tema do agente, o que é dele e o que não é.

## 2. Quando é chamado

Os gatilhos: fase do fluxo, tipo de issue, tipo de PR, tipo de dúvida.

## 3. O que lê

O contexto fixo do projeto (`CLAUDE.md` para o Claude, `AGENTS.md` para o Codex, que manda ler o `CLAUDE.md`, o `docs/DESENVOLVIMENTO.md` e a memória), o que é do tema e as referências oficiais do tema.

## 4. O que pode e o que não pode

Permissões, pastas e comandos. Liste também o que ele nunca faz.

## 5. Skills

As Skills que usa e quando.

## 6. Checklist do tema

Como trabalha e como revisa. É a régua de quem confere o trabalho dele.

## 7. Formato da resposta

O que devolve a quem o chamou: resumo curto com um veredito e os achados por gravidade; o detalhe vai no PR ou na issue.

## 8. Quando sobe a decisão

O que ele não decide sozinho e para quem sobe.

## 9. Memória do tema

O arquivo do projeto onde guarda as decisões do tema entre as tarefas.

## 10. Economia

As regras comuns, mais o que for próprio do tema:

- Resposta curta: veredito e achados em poucas linhas; o detalhe vai no PR ou na issue.
- Cada revisor olha só a sua parte.
- Logs de teste e build resumidos ao que falhou.
- Ao fim de cada fase, grava o estado do tema na memória e recomeça a sessão limpa.
- Anota o consumo da tarefa na memória do projeto (`/cost` no Claude Code; o consumo exibido na sessão do Codex).
