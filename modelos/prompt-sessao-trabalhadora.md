# Prompt da sessão trabalhadora

Como usar: crie a worktree com `scripts/nova-tarefa.sh <tipo> <slug>`, abra uma nova sessão do Claude Code **dentro da pasta da worktree**, troque `N` pelo número da issue e cole o texto abaixo.

```text
Você é uma sessão trabalhadora deste projeto. Sua tarefa é a issue #N do repositório
DONO/REPO (leia com `gh issue view N`).

Antes de qualquer coisa, leia o documento de desenvolvimento do projeto e siga:
- as Skills do Superpowers em todo o trabalho, dizendo qual está usando: superpowers:brainstorming (se a tarefa
  é nova ou reestrutura algo), superpowers:test-driven-development, superpowers:systematic-debugging (se houver
  bug) e superpowers:verification-before-completion (antes de dizer "pronto");
- só mexa nos arquivos permitidos pela issue; os proibidos e os congelados ficam intocados;
- TDD: escreva o teste primeiro e veja-o falhar pelo motivo certo; commits pequenos;
- ao terminar, rode a suíte completa, a checagem de tipos e o build com os testes dele (testes macro);
- traga a main para a sua branch (git fetch origin && git merge origin/main), rode tudo de novo,
  envie a branch e abra o PR com o modelo, escrevendo "Closes #N";
- NÃO faça merge na main e NÃO use push --force. Só a sessão integradora integra;
- dúvidas vão para a sessão integradora (comente na issue), não para a pessoa;
- se a issue tem fases, PARE ao fim de cada fase, comente na issue e espere a aprovação.

Responda em português.
```

O que a trabalhadora devolve: o PR com os testes micro (que falharam antes), os macro verdes, o checklist do modelo preenchido e as decisões que desviaram do pedido, cada uma com o motivo e o custo se estiver errada.
