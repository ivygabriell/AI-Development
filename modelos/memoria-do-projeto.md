# Memória do projeto

A memória do projeto é o que a próxima sessão precisa saber para não recomeçar do zero. Guarde no mecanismo de memória do Claude Code ou em um `CLAUDE.md` na raiz. **Regra:** guarde o que não dá para descobrir lendo o código ou o histórico (decisões, preferências, pendências, lições), e nunca dados sensíveis.

## O que guardar

| Tipo | Exemplos |
|---|---|
| **Quem é a pessoa e como trabalha** | Idioma das respostas; quer o fluxo Superpowers; corrige por mensagens curtas, então confirme a interpretação com evidência antes de entregar |
| **Fluxo combinado** | Uma branch por mudança; enviar a branch antes de integrar; só a integradora integra; Skills em todo cenário; proteção da `main` ativa |
| **Decisões do projeto** | Público-alvo, estrutura aprovada, paleta, o que não pode mudar, o que ficou de fora e por quê |
| **Estado** | O que está integrado, o que está em andamento, o endereço do repositório, os comandos de teste |
| **Pendências** | Lista curta e viva, com a decisão que cada uma espera |
| **Lições** | Regras que vieram de um erro (por exemplo, "achar a seção pelo título exato") |
| **Referências** | Onde estão a spec, o plano, o painel de tarefas e a referência estudada |

## O que NÃO guardar

- E-mail, telefone, tokens, chaves e senhas.
- O que já está no código ou no histórico do Git (estrutura de arquivos, quem mudou o quê).
- Detalhes que só valem para a conversa de hoje.

## Gabarito

```markdown
---
name: nome-curto-do-projeto
description: uma linha que diga para que serve esta memória
type: project
---

Estado (AAAA-MM-DD): o que está integrado e onde (repositório, branch principal, comandos de teste).

Decisões da pessoa: ...

Pendências (em aberto):
- ...

**Why:** por que esta memória existe.
**How to apply:** como usar nas próximas sessões.
```

Mantenha **uma linha por memória** no índice (`MEMORY.md`), com um gancho que diga quando ela é relevante, e atualize ou apague memórias que ficaram erradas.
