# 014 · Fluxo de correção de bugs

**Data:** 2026-11-17
**Status:** aceita pela pessoa **sem caso real** (exceção à regra de ouro, pedida por ela, como na [decisão 013](013-lead-e-builders-com-codex-e-claude.md)).
**Caso de origem:** nenhum ainda. O primeiro bug corrigido num projeto com este fluxo confirma ou corrige esta decisão.

## Contexto

A pessoa perguntou como seria o fluxo de correção de bugs. O método tinha as peças, mas não o fluxo escrito de ponta a ponta:

- `superpowers:systematic-debugging` para bug ou teste que falha (`nucleo/03`);
- a skill citada no formulário de tarefa "se houver bug";
- o Backend respondendo por bug de API ou de dados na Fase 8;
- `engineering:incident-response` e `metodo:incidente-com-dados-pessoais` para incidentes;
- na tabela de aprovações da 4.0.0, a "correção de bug que não muda o comportamento combinado" já com a Lead.

Faltavam um formulário de bug, a regra para o bug achado no meio de outra tarefa e o caminho da correção urgente em produção.

## Decisão

Aprovado pela pessoa em 2026-11-17: o "Ciclo de um bug" em `nucleo/02-sessoes-e-papeis.md`.

1. **Registro:** issue com o formulário de bug (`modelos/issue-bug.yml`): o que aconteceu, o esperado, os passos para reproduzir, onde e a evidência.
2. **Triagem pela Lead, pelos gatilhos:** incidente vai para a pessoa na hora; bug comum, a Lead encaixa na prioridade já aprovada pela pessoa (passar à frente dela é gatilho), completa a issue como numa tarefa (arquivos permitidos e proibidos, plano e passo, ferramenta) e entrega ao especialista do tema; o que não é bug vira tarefa.
3. **Dono:** o especialista do tema abre a Builder na ferramenta do papel.
4. **Correção:** `superpowers:systematic-debugging`, causa raiz, teste que falha por causa do bug antes da correção, suíte inteira.
5. **Bug fora do escopo** de outra tarefa vira issue nova; a tarefa não cresce.
6. **Validação e merge:** revisão cruzada; a Lead confere que o bug sumiu; sem mudança do comportamento combinado, a Lead integra; com mudança, dados ou produção, a pessoa.
7. **Aprendizado:** causa de processo vira lição do método.

**Escolhas da sessão do método** (a pessoa confere ao ler o PR):

- Correção urgente: a pessoa escolhe entre **reverter** a última publicação e corrigir à frente; o teste que reproduz o bug continua vindo antes, e a publicação continua sendo um portão dela.
- O formulário de bug tem um campo de triagem que a Lead preenche (incidente, bug comum, não é bug).
- Versão menor (4.1.0): conteúdo novo, sem mudar uma regra do núcleo.

## Consequências

- Todo bug deixa um teste permanente, e o mesmo bug não volta sem o CI acusar.
- A Lead carrega a triagem; a pessoa só vê o incidente e o que aciona um gatilho.
- Tarefas não crescem com bugs achados no caminho; o custo é ter mais issues abertas.
- O que observar no primeiro projeto: quantos bugs chegaram à pessoa; se a triagem acertou o que era incidente; se algum bug voltou; se o teste que reproduz veio mesmo antes da correção.
- Arquivos que mudam: `nucleo/02-sessoes-e-papeis.md`, `nucleo/05-git-github-e-ci.md`, `modelos/issue-bug.yml` (novo), `modelos/prompt-builder.md`, `modelos/CLAUDE-projeto.md`, `modelos/agentes/lead.md`, `scripts/novo-projeto.sh`, `scripts/verificar.mjs`, `skills/atualizar-projeto/SKILL.md`, `CHANGELOG.md`, `VERSION`.
