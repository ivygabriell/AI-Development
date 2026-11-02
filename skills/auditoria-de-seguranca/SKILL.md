---
name: auditoria-de-seguranca
description: Use quando for montar o mapa de riscos de segurança do projeto (Fase 2), revisar um PR sensível com os princípios da skill security-audit da Cloudflare, ou rodar ou pedir uma auditoria completa com ela (antes da primeira publicação, depois de uma mudança grande, ou quando a pessoa pedir), ou quando for transformar os achados dela (confirmed, needs_validation, rejected) em correções, perguntas e registros do projeto.
---

# Auditoria de segurança

**Quem usa:** no modo com especialistas, a Segurança, que propõe, roda e tria a auditoria, e a integradora cria o portão e só publica depois da triagem. Nos outros modos (uma sessão, sessões divididas ou o Orca sem especialistas), a integradora ou a coordenadora faz as duas partes. É um passo da Fase 7: antes da primeira publicação, sempre se pergunta à pessoa. As trabalhadoras do back e do front corrigem o que a Segurança entrega, com as skills do tema (`metodo:controle-de-acesso`, `metodo:entrada-nao-confiavel`, `metodo:autenticacao-e-sessao`).

A `security-audit` faz a auditoria. Esta skill diz **como ela entra no fluxo do método**: quando rodar, com que tamanho, onde guardar e o que fazer com cada achado. A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/seguranca.md` (seção "Auditoria completa"), e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/seguranca.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Desde o primeiro mapa de riscos

A `security-audit` entra **na primeira análise de segurança do projeto**, e não só na publicação. Em cada momento, usa um dos dois modos dela:

| Momento | Modo da `security-audit` | O que sai |
|---|---|---|
| **Fase 2**, o primeiro mapa de riscos (antes de existir código) | modo de orientação, com o roteiro do reconhecimento: quem usa e quem tem menos confiança, o que cada um pode fazer, as fronteiras de confiança e o controle de cada uma, as superfícies de entrada (tela, API, arquivos, filas, CI, IA) e os arquivos de domínio que se aplicam (web e identidade, navegador, cadeia de suprimentos, nuvem, IA e agentes, isolamento de dados) | o mapa de riscos em `docs/seguranca.md`, cada risco virando critério de aceite nas issues da Fase 3 |
| **Cada revisão de PR** sensível | modo de orientação: fronteira e resultado concreto, gravidade pelo impacto demonstrado, a menor correção | o veredito da revisão, sem arquivos novos |
| **Fase 7**, antes da primeira publicação, e depois de cada mudança grande | modo de auditoria completa, pelo passo a passo abaixo, com portão | o relatório fora do repositório e a triagem no `docs/seguranca.md` |

O mapa da Fase 2 é a semente das auditorias completas: as fronteiras e superfícies que ele listou são as que a primeira auditoria completa precisa cobrir, e o que ela achar volta para o mapa. Fonte: [RECONNAISSANCE.md, fase 1](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/RECONNAISSANCE.md) e [ATTACK-CLASSES.md, escolha dos domínios](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/ATTACK-CLASSES.md).

## Passo a passo da auditoria completa

1. **Conferir a instalação.** A skill fica em `~/.agents/skills/security-audit` (o Codex lê dali, e o Claude Code por um atalho em `~/.claude/skills/`), instalada uma vez por computador pelo README. Se ela não aparece na sua ferramenta, avise a integradora e pare; não instale nada. Ela precisa do Node.js para os validadores. Fonte: [cloudflare/security-audit-skill, instalação e requisitos](https://github.com/cloudflare/security-audit-skill#installation).
2. **Escolher o modo certo.** A skill tem dois modos. No **modo de orientação** ela só empresta os princípios (fronteira e resultado concreto, gravidade pelo impacto demonstrado, a menor correção) e não cria arquivos nem roda as seis fases: é o modo das revisões de PR. O **modo de auditoria completa** só começa com um pedido explícito de auditoria, e é ele que precisa do portão. Fonte: [SKILL.md, modos de operação](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/SKILL.md).
3. **Subir o portão antes de começar.** Mande à integradora (`orca orchestration send --type escalation`) o motivo (primeira publicação, mudança grande, pedido da pessoa), o perfil, o escopo e o limite de subagentes (`budget`). A auditoria só começa quando a integradora resolve o portão com a resposta da pessoa. Ela abre vários subagentes (reconhecimento, caçadores, críticos de cobertura e verificadores independentes) e gasta bastante cota. Fonte: [SKILL.md, orçamento de custo](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/SKILL.md).
4. **Dimensionar pelo projeto:**
   - perfil `quick` para um projeto pequeno, para uma nova rodada ou para uma primeira olhada: uma onda de caça, um crítico e um verificador por candidato;
   - perfil `standard` antes da primeira publicação de um projeto com login, dados pessoais ou API pública;
   - perfil `deep` só com o pedido da pessoa, para projeto de alto risco;
   - **escopo** reduzido depois da primeira auditoria: só as pastas que mudaram, ou a diferença entre o commit da última auditoria e a `main` atual. Uma rodada com escopo, ou `quick`, é parcial e o relatório diz isso.

   Fonte: [SKILL.md, perfis e escopo](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/SKILL.md).
5. **Rodar na `main` integrada, sem mudanças pendentes.** Audite a `main` atual, numa pasta só de leitura (a sua worktree, atualizada). Anote o commit auditado. A skill não executa código do projeto sem uma **sandbox** do sistema operacional, sem rede, com ambiente vazio e limites de recursos. Sem ela, o que precisaria rodar vira `needs_validation`, e está tudo bem: não contorne a regra. Ela também nunca testa um ambiente publicado. Fonte: [SKILL.md, segurança da execução](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/SKILL.md).
6. **Guardar fora do repositório.** Deixe a saída no padrão da skill, `~/security-audit-skill/<repo>/run-<N>`: o relatório descreve falhas ainda abertas. Rodadas novas leem as anteriores da mesma pasta e somam cobertura. Por isso, nunca apague as rodadas antigas sem a pessoa pedir. Fonte: [SKILL.md, configuração da auditoria completa](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/SKILL.md).
7. **Conferir antes de confiar.** A rodada só termina em dois estados: completa, com os dois validadores passando (`node <pasta-da-skill>/validate-findings.cjs <saída>/findings.json` e `validate-coverage-ledger.cjs` no `coverage-ledger.json`), ou `incomplete`, com o motivo escrito. Rode os validadores você mesma e leia o `REPORT.md` antes de qualquer veredito. Fonte: [VALIDATION-AND-REPORTING.md, fases 4 a 6](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/VALIDATION-AND-REPORTING.md).
8. **Triar cada achado pelo fluxo do método:**

   | Veredito da skill | O que vira no projeto |
   |---|---|
   | `confirmed` `critical` ou `high` | **bloquear** a publicação. Uma correção entregue ao dono da pasta, com a menor mudança que a skill propõe e o teste de regressão escrito antes |
   | `confirmed` `medium` | **aprovar com ressalva**. Correção numa tarefa própria, antes da próxima publicação, ou risco aceito pela pessoa no `docs/seguranca.md` |
   | `confirmed` `low` ou `informational` | nota de endurecimento no `docs/seguranca.md`; vira tarefa só se a pessoa quiser |
   | `needs_validation` | pergunta em aberto no mapa de riscos, **sem gravidade**, com o fato que falta e quem pode observar (o DevOps para infraestrutura; a pessoa para conta ou provedor). Nunca vire um palpite em correção |
   | `rejected` | fica só no relatório: ele evita que a próxima rodada repita a mesma suspeita |

   Fonte: [SKILL.md, prioridade e certeza](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/SKILL.md).
9. **Não espalhar a falha.** Nas issues e nos PRs vai só o necessário para corrigir (onde, qual regra, o teste). Num repositório **público**, uma falha `confirmed` ainda aberta não vira issue pública: use um aviso de segurança privado do GitHub (Security → Advisories) ou fale direto com o dono da pasta pelo Orca. Nenhum segredo encontrado aparece em resposta, comentário ou memória: diga onde está, nunca o valor. Fonte: [GitHub, avisos de segurança privados](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/about-repository-security-advisories).
10. **Registrar.** Em `docs/seguranca.md`, numa seção "Auditorias": a data, o perfil, o escopo, o commit auditado, a contagem por veredito e gravidade, se a rodada ficou completa ou `incomplete`, e onde está o relatório (o caminho fora do repositório). Mande à integradora o consumo da auditoria (`orca orchestration send --type status`) para a memória do projeto: é a medida de custo da Fase 9.

## O teste que prova (escreva antes, veja falhar)

A auditoria não escreve código. Quem prova é a correção: cada `confirmed` corrigido leva um teste de regressão que reproduz a entrada do achado (com dados de mentira) e falha antes da correção.

| Achado | Teste |
|---|---|
| `confirmed` de acesso | o usuário A pede o objeto do usuário B, pela entrada que o relatório aponta, e é negado |
| `confirmed` de injeção | a entrada do relatório chega ao destino tratada (consulta parametrizada, texto escapado) |
| `confirmed` de segredo | o segredo sai do código e do histórico de configuração, e um teste ou verificação do CI acusa se ele voltar |
| Nova rodada | a próxima auditoria lê a anterior e não traz de volta o mesmo achado como aberto |

## Checklist

- [ ] O mapa de riscos da Fase 2 seguiu o roteiro do reconhecimento (quem, o quê, fronteiras, superfícies, domínios).
- [ ] Portão resolvido pela pessoa, com perfil, escopo e `budget`.
- [ ] Auditoria da `main` integrada, com o commit anotado.
- [ ] Saída fora do repositório, em `~/security-audit-skill/<repo>/run-<N>`.
- [ ] Os dois validadores passaram, ou o motivo de `incomplete` está escrito.
- [ ] Cada `confirmed` triado pela tabela; os `critical` e `high` bloqueiam a publicação.
- [ ] Cada `needs_validation` virou pergunta no mapa de riscos, sem gravidade.
- [ ] Nada de falha aberta em issue pública nem de segredo em texto.
- [ ] Registro em `docs/seguranca.md` e consumo enviado à integradora.

## Adaptar ao tamanho do projeto

- Site estático sem login nem formulário: a auditoria completa costuma não compensar. Fique com o checklist do harness e a busca de segredos, e diga isso no portão.
- Projeto pequeno com login ou dados pessoais: perfil `quick` antes da primeira publicação, com `budget` baixo.
- Projeto com API pública, várias empresas no mesmo banco ou pagamentos: perfil `standard` antes da primeira publicação e rodadas com escopo a cada mudança grande.
