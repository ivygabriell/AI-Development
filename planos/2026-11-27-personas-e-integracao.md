# Auditoria das personas e integração por impacto

## O que foi conferido

Foram lidos os cinco arquivos de agente do Agent Skills 0.6.18, além do guia de composição. Cada persona revisa uma dimensão, delimita o que verificou e devolve um parecer. A Lead compõe os pareceres e decide a integração. [Guia de composição do Addy](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/docs/agents.md)

| Persona auditada | Regra trazida para o método | Harness |
|---|---|---|
| [code-reviewer](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/agents/code-reviewer.md) | Leia aceite e testes antes do diff. Entregue veredito, severidade, localização, correção e verificação real. | Lead e Architect |
| [test-engineer](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/agents/test-engineer.md) | Escolha a camada do teste pelo comportamento. Registre o teste de regressão e as lacunas por risco. | Backend, Frontend e Lead |
| [security-auditor](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/agents/security-auditor.md) | Revise fronteiras e controles do escopo. Separe gravidade, certeza, cobertura e correção verificável. | Security e Lead |
| [accessibility-auditor](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/agents/accessibility-auditor.md) | Relacione violações ao critério aplicável. Registre teste manual pendente quando a automação só indicar um possível problema. | Designer e Frontend |
| [web-performance-auditor](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/agents/web-performance-auditor.md) | Separe análise estática, laboratório, rastreio e dados de campo. Declare o que ficou sem medição. | Frontend e Ops |

Product e Designer continuam donos do requisito e do desenho. Architect continua dono do contrato. As personas do Addy são pareceristas acionados pela Lead no Claude Code. No Codex, uma sessão independente usa o mesmo roteiro com as skills pertinentes.

## Tarefas

- [x] Aplicar o formato de evidência e parecer aos oito harnesses.
- [x] Documentar os três resultados de integração e alinhar os modelos e o gerador.
- [x] Acrescentar o fluxograma e a simulação ao guia HTML. Conferir as trilhas, os portões e a navegação.

## Evidência

O verificador do método passou em 1.236 verificações. No guia HTML, a simulação distinguiu os resultados por trilha e conferiu as transições de CI, revisão cruzada, recuperação e autorização de publicação.
