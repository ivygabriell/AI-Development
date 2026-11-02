# 010 · Um agente principal por projeto: Claude Code ou Codex

**Data:** 2026-11-02
**Status:** aceita pela pessoa **sem caso real** (exceção à regra de ouro, pedida por ela, como nas decisões [007](007-back-com-codex-e-front-com-claude.md) e [008](008-agentes-especialistas.md)); o selo de `rascunho` que ela previa saiu pela [decisão 011](011-sem-rascunho-fora-dos-cenarios.md). Substitui a [decisão 007](007-back-com-codex-e-front-com-claude.md) e o item 2 da [decisão 008](008-agentes-especialistas.md).
**Caso de origem:** nenhum ainda. O primeiro projeto com o Codex como agente principal, e o primeiro com o Claude Code no modo com especialistas, serão registrados em `casos/` e confirmam ou corrigem esta decisão.

## Contexto

Desde a 2.5.0 ([decisão 007](007-back-com-codex-e-front-com-claude.md)), um projeto podia misturar as duas ferramentas: a coordenadora era sempre Claude, o back ficava com agentes Codex e o front com agentes Claude. A 2.6.0 ([decisão 008](008-agentes-especialistas.md)) levou a mistura para os especialistas: Claude na Integradora, na Arquitetura, em Design e Front e no Produto; Codex em Back e Dados, na Segurança e no DevOps.

A pessoa decidiu que, dentro de um projeto, sempre atua **um agente principal só**: ou o Codex com vários agentes, ou o Claude com vários agentes, nunca os dois ao mesmo tempo.

Na mesma conversa, a pessoa pediu para avaliar três repositórios. Ela aprovou só a skill [security-audit](https://github.com/cloudflare/security-audit-skill), da Cloudflare: uma auditoria de segurança em seis fases (reconhecimento, caça guiada por cobertura, validação de cada candidato, saída estruturada, verificação independente e relatório), que funciona no Claude Code e no Codex. Os outros dois ficaram de fora por decisão dela:

- **ponytail** (entrou depois, pela [decisão 012](012-revalidacao-de-lacunas-e-ponytail.md), com regras de convivência): é um prompt sempre ativo que conflita com o TDD do método (ele pede "um teste pequeno, se houver lógica") e repete as revisões que o método já tem.
- **claude-mem:** repete a memória revisada do projeto e o `orca search`; grava saídas de comandos que podem ter dados pessoais; injeta contexto sem portão; e aumenta o consumo de tokens (contexto em cada sessão nova e um modelo que resume cada uso de ferramenta), justamente o que a pessoa quer economizar com várias sessões no Orca. Pode voltar a ser avaliado junto do escopo futuro (contexto gerado a partir dos casos), com uma medição de consumo.

## Decisão

1. **Cada projeto tem um agente principal: Claude Code ou Codex.** Ele é escolhido no começo do projeto (`/metodo:novo-projeto` pergunta; `novo-projeto.sh --agente <claude|codex>`, padrão `claude`) e fica registrado em `docs/DESENVOLVIMENTO.md` na linha `Agente principal:`. Trocar depois exige uma decisão da pessoa, registrada na memória do projeto.
2. **Todas as sessões do projeto usam a mesma ferramenta, nunca as duas:** a integradora (a coordenadora do Orca), os especialistas e as trabalhadoras. No Orca, todo `worker-start` leva `--agent claude --model claude-opus-5-5` ou `--agent codex --model gpt-6.1-sol`, conforme o agente principal; o esforço continua variando por papel.
3. **O Codex pode ser a coordenadora.** Num projeto Codex, a integradora é um agente Codex: lê o `AGENTS.md` (que manda ler o `CLAUDE.md`, o `docs/DESENVOLVIMENTO.md` e a memória), usa o mesmo prompt da coordenadora ou o mesmo harness, valida no navegador com um navegador automatizado ([03](../nucleo/03-skills-e-testes.md)) e é a única que integra, com o "pode integrar" da pessoa.
4. **Os harnesses servem às duas ferramentas.** Cada harness diz que a ferramenta é a do projeto, com o modelo de cada uma, e os comandos usam `--agent <agente> --model <modelo>`. A cópia em `docs/agentes/` continua igual ao modelo do método.
5. **O que continua da decisão 007:** o `AGENTS.md` em todo projeto; os plugins e as ferramentas instalados também no Codex (README); a alternativa de caminho nas skills ("dois níveis acima"); o contrato da API primeiro quando back e front são construídos em tarefas paralelas, com pastas separadas e os arquivos comuns com um dono só; a medição de retrabalho e consumo por tarefa.
6. **Skill `security-audit`.** É instalada uma vez por computador, para a ferramenta do projeto, pelo repositório oficial. Quem a usa é a Segurança, no modo de auditoria completa, **antes da primeira publicação** e depois de uma mudança grande, sempre com a aprovação da pessoa num portão, porque ela abre vários subagentes e gasta cota. Os arquivos da auditoria ficam fora do repositório (padrão da skill: `~/security-audit-skill/<repo>/run-<N>`). Os achados `confirmed` viram correções entregues ao dono da pasta, como qualquer achado da Segurança; os `needs_validation` viram perguntas no mapa de riscos. Em revisões de PR, a Segurança continua com as próprias skills e o checklist dela.

Decidido pela pessoa em 2026-11-02: um agente principal por projeto, Codex ou Claude, nunca os dois; acrescentar só a skill security-audit; deixar o ponytail e o claude-mem de fora.

**Escolhas da sessão do método** (a pessoa confere ao aprovar o PR):

- A escolha acontece no começo do projeto (Passo 2 do `/metodo:novo-projeto`), e o padrão é o Claude Code, que é a ferramenta com que o método foi feito e testado.
- Os harnesses ficam neutros (a ferramenta vem do `docs/DESENVOLVIMENTO.md`) em vez de terem uma versão por ferramenta, para a cópia no projeto continuar idêntica ao modelo e o `/metodo:atualizar-projeto` continuar simples.
- O contrato da API primeiro continua, agora como regra de quando back e front correm em paralelo, e não de quando as ferramentas são diferentes.
- A `security-audit` entra pela Segurança, antes da primeira publicação e depois de mudança grande, com portão; os relatórios ficam fora do repositório, porque descrevem falhas ainda abertas.
- Versão maior (3.0.0): muda uma regra do núcleo (a coordenadora deixa de ser sempre Claude e a ferramenta deixa de ser decidida pelo tema).

## Consequências

- O projeto gasta a cota de uma assinatura só, e a pessoa escolhe qual a cada projeto.
- Some o ida e volta entre duas ferramentas com regras parecidas e não iguais: todas as sessões leem o mesmo arquivo de instruções e as mesmas skills.
- Um projeto Codex depende de o Codex seguir o `AGENTS.md`, os harnesses e as skills do método tão bem quanto o Claude segue o `CLAUDE.md`. Isso ainda não foi medido.
- Um projeto que estava no modo da decisão 007 precisa escolher uma das duas ferramentas ao atualizar para a 3.0.0.
- A auditoria completa da `security-audit` é cara: roda só com o portão da pessoa e conta no limite de consumo da Fase 9.
- O que observar no primeiro projeto: se a coordenadora Codex seguiu os portões e a validação no navegador; se as skills do método funcionaram no Codex; quanto a cota rendeu com uma ferramenta só; quanto custou e o que achou a `security-audit` antes da primeira publicação.
- Arquivos que mudam: `nucleo/02-sessoes-e-papeis.md`, `nucleo/01-fluxo-de-ponta-a-ponta.md`, `nucleo/03-skills-e-testes.md`, `modelos/agentes/` (o modelo e os sete harnesses), `modelos/prompt-coordenadora-orca.md`, `modelos/CLAUDE-projeto.md`, `modelos/AGENTS-projeto.md`, `modelos/memoria-do-projeto.md`, `scripts/novo-projeto.sh`, `scripts/verificar.mjs`, `skills/novo-projeto/SKILL.md`, `skills/atualizar-projeto/SKILL.md`, `skills/consultar/SKILL.md`, `README.md`, `decisoes/007-back-com-codex-e-front-com-claude.md`, `decisoes/008-agentes-especialistas.md`, `casos/2026-10-repositorio-do-metodo.md`, `CHANGELOG.md`, `VERSION` (3.0.0).
