# 010 · Subcomando inexistente tratado como pergunta

- **O que aconteceu:** `claude ps` (que não existe) foi interpretado como uma pergunta e gerou uma resposta.
- **Causa:** a CLI trata o que não reconhece como prompt.
- **Regra:** na dúvida, `--help` primeiro; nunca invente um subcomando.

**Origem:** Portfólio pessoal (2026-10)
