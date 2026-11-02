# 03 · Skills e testes

Duas regras valem para **todas as sessões**, integradora ou trabalhadora: usar a Skill certa para cada cenário e provar com testes e com evidência. Dizer qual Skill está em uso faz parte do trabalho.

## Mapa de skills

| Cenário | Skill |
|---|---|
| Funcionalidade nova, mudança de comportamento ou pedido ambíguo | `superpowers:brainstorming` (antes de mexer em qualquer arquivo) |
| Decisão de arquitetura, escolha entre tecnologias | `engineering:architecture` |
| Desenho de sistema, serviços, APIs, modelagem de dados | `engineering:system-design` |
| Back: rota de API conforme o contrato (paginação, erros, pedido repetido) | `metodo:api-conforme-contrato` |
| Back: migração de banco em tabela com uso | `metodo:migracao-sem-parada` |
| Back: concorrência, travas, exclusão em massa, conexões | `metodo:transacoes-e-consultas` |
| Back: fila, tarefa em segundo plano, chamada externa depois de gravar | `metodo:trabalho-em-segundo-plano` |
| Front: formulário, validação e mensagens de erro | `metodo:formularios-e-erros` |
| Front: tela lenta ou que pula (LCP, INP, CLS, imagens, fontes) | `metodo:desempenho-na-tela` |
| Front: carregando, vazio, erro do serviço, ação demorada | `metodo:estados-da-tela` |
| DevOps: como publicar código e configuração (canário, reversão) | `metodo:publicacao-gradual` |
| DevOps: metas de confiabilidade e alertas | `metodo:metas-e-alertas` |
| DevOps: workflows do GitHub Actions, segredos, PRs de fora | `metodo:ci-seguro` |
| Segurança: login, senha, sessão | `metodo:autenticacao-e-sessao` |
| Segurança: quem pode ver ou mudar o quê | `metodo:controle-de-acesso` |
| Segurança: SQL, HTML, links e URL buscada pelo servidor | `metodo:entrada-nao-confiavel` |
| Segurança: vazamento de dados pessoais (LGPD, ANPD) | `metodo:incidente-com-dados-pessoais` |
| Segurança: auditoria completa do código antes da primeira publicação ou depois de mudança grande (só com o portão da pessoa) | `metodo:auditoria-de-seguranca`, que roda a `security-audit` (da Cloudflare; instalação no README) |
| Arquitetura: escrever ou mudar o contrato da API | `metodo:contrato-de-api` |
| Arquitetura: o que acontece quando uma parte falha | `metodo:analise-de-falhas` |
| Arquitetura: mudança grande com o sistema no ar | `metodo:migracao-de-sistema` |
| Produto: pedido que chega como solução; os quatro riscos | `metodo:necessidades-e-riscos` |
| Produto: entrevistas, oportunidades e escolha da solução | `metodo:descoberta-continua` |
| Integradora: validação final do PR (os testes provam?) | `metodo:validacao-final` |
| Integradora: "estamos entregando bem?" | `metodo:metricas-de-entrega` |
| Plano com vários passos a partir de uma spec | `superpowers:writing-plans` |
| Executar um plano na sessão atual | `superpowers:executing-plans` |
| Plano com tarefas independentes, com uma revisão a cada tarefa | `superpowers:subagent-driven-development` |
| Duas ou mais tarefas independentes dentro de uma sessão | `superpowers:dispatching-parallel-agents` |
| Implementar qualquer coisa | `superpowers:test-driven-development` (RED antes de GREEN) |
| Estratégia de testes de um projeto ou funcionalidade | `engineering:testing-strategy` |
| Bug, teste que falha ou comportamento inesperado | `superpowers:systematic-debugging` |
| Antes de dizer "pronto", "passou" ou abrir o PR | `superpowers:verification-before-completion` |
| Mudança grande ou arriscada | `/ponytail-review` (rascunho); sem o ponytail, `superpowers:requesting-code-review` |
| Receber comentários de revisão | `superpowers:receiving-code-review` |
| Interface: acessibilidade, contraste, teclado | `design:accessibility-review` |
| Interface: crítica de design e usabilidade | `design:design-critique` |
| Entregar um design para o desenvolvimento | `design:design-handoff` |
| Textos de interface (botões, erros, estados vazios) | `design:ux-copy` |
| Criar ou manter o design system (cores, tipografia, componentes) | `design:design-system` |
| Planejar uma pesquisa com usuários (entrevistas, testes de usabilidade) | `design:user-research` |
| Juntar o que a pesquisa trouxe (temas, achados, oportunidades) | `design:research-synthesis` |
| Mudança grande, revisão enxuta: o que sobra, o que quebra, o que falta testar (rascunho) | `/ponytail-review` (no Codex, `$ponytail:ponytail-review`) |
| Repositório inteiro: o que corrigir primeiro e o que apagar (rascunho) | `/ponytail-audit` |
| Atalhos deixados para depois (`shortcut:`) | `/ponytail-debt` |
| Isolar o trabalho numa worktree | `superpowers:using-git-worktrees` |
| Fim de uma branch (integrar ou manter) | `superpowers:finishing-a-development-branch` |
| Antes de publicar | `engineering:deploy-checklist` |
| Incidente em produção | `engineering:incident-response` |
| Dívida técnica | `/ponytail-audit` e `/ponytail-debt` (rascunho), e a ordem por impacto, risco e esforço do harness da integradora |
| Documentação, README, runbook | `engineering:documentation` |
| Analisar um artefato fechado (binário, app empacotado) | `reverse-engineer-anything` |
| Uma sessão deu errado e você quer entender por quê | `superpowers:diagnosing-superpowers` |

Se nenhuma Skill cobrir o cenário, diga isso em uma linha e siga o fluxo normal.

## Skills fora dos agentes

No modo com agentes especialistas, cada agente usa as skills da parte 5 do seu harness. As skills abaixo ficam de fora dos harnesses de propósito, e cada uma tem o motivo:

| Skill | Por que fica fora dos agentes |
|---|---|
| `superpowers:executing-plans`, `superpowers:subagent-driven-development`, `superpowers:dispatching-parallel-agents` | Servem aos modos sem o Orca (uma sessão executando o plano, ou subagentes dentro de uma sessão). No Orca, quem distribui o trabalho é a integradora e o especialista, com `worker-start` |
| `superpowers:using-git-worktrees` | Serve às sessões abertas à mão (`scripts/nova-tarefa.sh`). No Orca, a worktree é criada por ele |
| `superpowers:writing-skills` | É da sessão do método, ao criar ou mudar uma skill do plugin `metodo` ([CLAUDE.md](../CLAUDE.md)); os projetos não criam skills do método |
| `superpowers:using-superpowers` | Carrega sozinha em toda sessão; ninguém precisa chamar |

## Ponytail (rascunho)

O [ponytail](https://github.com/DietrichGebert/ponytail) é um plugin que fica ativo em toda sessão. Ele faz o agente escrever **a menor mudança que resolve a tarefa inteira**. Antes de escrever, sobe uma escada: precisa existir? já existe no projeto? a linguagem ou a plataforma já fazem? uma dependência instalada faz? cabe numa linha legível? Só então escreve o mínimo. Nunca corta validação nas fronteiras de confiança, tratamento de erro que evita perda de dados, segurança nem acessibilidade. Entrou pela [decisão 012](../decisoes/012-revalidacao-de-lacunas-e-ponytail.md), **sem caso real**: é `rascunho` até o primeiro projeto que o usar.

**Para que o método o usa: economia de tokens no Claude.** O ganho vem de escrever menos código e respostas mais curtas, e não de cortar o processo. Na medição do próprio repositório, com o Claude Code e o Opus 5.5, em 39 tarefas e 5 rodadas cada ([resultado de 2026-10-07](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-10-07-agentic.md)), comparado com o mesmo agente sem o plugin:

| Medida | Ponytail 5 contra o mesmo agente sem ele |
|---|---|
| Linhas de código entregues | -53% |
| Tokens de saída | -45% |
| Tempo | -41% |
| Idas e voltas (turnos) | -22% |
| Custo por tarefa | -26% (US$ 0,200 para 0,142 por sessão, a preço de tabela) |
| Respostas | 30% mais curtas, terminando com o que não foi conferido e os riscos |
| Correção e segurança | iguais (testes escondidos e as seis tarefas de segurança) |
| Lógica arriscada com teste | 98% (sem ele, 68%) |

**No Codex, pode sair mais caro.** A conferência de custo do repositório ([resultado de 2026-06-17](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-06-17-cost-verification.md)) achou o contrário nos modelos de raciocínio da OpenAI: o gpt-5.5 ficou 39% mais caro e o gpt-5.4-mini, 26%. O motivo: as regras do ponytail são reenviadas como entrada a cada chamada, e esses modelos já escrevem pouco. O modelo do Codex no método (`gpt-6.1-sol`) não foi medido. Por isso:

- **No Claude Code:** o ponytail fica ligado em toda sessão, no nível `full`.
- **No Codex:** só **sob demanda** até medir. Não confie nos dois ganchos dele em `/hooks`: sem eles, as regras não são reenviadas a cada chamada, e o `$ponytail:ponytail-review`, o `$ponytail:ponytail-audit` e o `$ponytail:ponytail-debt` continuam disponíveis. Ligar de vez é uma decisão da pessoa, depois de comparar o consumo de tarefas parecidas com e sem ele, anotado na memória.
- **Subagentes:** no Claude Code, o gancho `SubagentStart` do ponytail injeta as regras em **cada subagente**. Num trabalho que abre muitos subagentes e não escreve código, como a auditoria completa de segurança, isso é só custo: desligue com `/ponytail off` antes (`metodo:auditoria-de-seguranca`). Para limitar sempre a injeção a alguns tipos de subagente, existe a variável `PONYTAIL_SUBAGENT_MATCHER`.

**Medir o consumo (só no Claude Code).** A faixa do ponytail acima do prompt mostra, por tarefa, o custo, os tokens, as idas e voltas, o tempo, quanto foi reaproveitado e se os testes passaram. Cada tarefa vira uma linha em `~/.config/ponytail/band/<projeto>.csv`, só no computador (o webhook fica vazio). É a fonte do consumo por tarefa na memória do projeto e da medida de custo na Fase 9. `/ponytail band import` traz as sessões antigas para o quadro.

**Regras de convivência com o método** (o `CLAUDE.md` e o `AGENTS.md` do projeto repetem, e o ponytail segue o que o projeto declara):

1. **O TDD do método vale sobre o ponytail.** O teste novo é escrito antes e visto falhar (micro), e a suíte, os tipos e o build fecham a tarefa (macro). O "um teste pequeno, se houver lógica" do ponytail é o mínimo dele, não o do método.
2. **A escada vale para a solução, não para o processo.** Spec, critérios de aceite, portões, revisão do especialista e validação da integradora não são "código a cortar".
3. **Nível `full`** (o padrão) para quem constrói. O `lite` serve quando a pessoa quer ver a opção menor e escolher. O **`ultra` não é usado**: questionar o pedido é do Produto e da pessoa, nos portões.
4. **Atalho deliberado** leva o comentário `shortcut: <o limite>, <quando melhorar>` e entra como pendência na memória do projeto; a lista sai com `/ponytail-debt` na Fase 8.
5. **Revisão:** o especialista revisa os PRs das trabalhadoras com `/ponytail-review` (ele lê o código ligado à mudança, não só o diff, e cada achado traz um caso concreto); sem o ponytail, com `superpowers:requesting-code-review`. A validação final continua da integradora (`metodo:validacao-final`).
6. **Auditoria de qualidade** do repositório inteiro, na Fase 8, com `/ponytail-audit`; a integradora completa com o que ele não olha (dependências, infraestrutura, documentação). Ela não substitui a auditoria de segurança (`metodo:auditoria-de-seguranca`).

## Testes: micro e macro

Duas camadas com responsabilidades diferentes. Nenhuma sessão pula testes.

- **micro** = o menor pedaço que mudou: uma função, um componente, um estado (hover, foco, erro), uma regra de CSS. O teste é escrito **antes** do código.
- **macro** = o projeto e a página inteiros: a suíte completa, o build, a checagem de tipos, o desempenho e as outras seções (regressão).

| Camada | Trabalhadora | Integradora |
|---|---|---|
| micro | TDD: escreve o teste, vê falhar, faz passar | Relê os testes novos (eles falhariam sem o código?) e **explora** cada elemento alterado no navegador, em todos os estados |
| macro | Antes do PR: suíte completa, tipos, build e testes do build, tudo verde | Refaz tudo na branch **e na `main`**; confere o CI; **explora** a página inteira, as outras seções, idiomas, telas e acessibilidade |

A trabalhadora entrega com os macro verdes, e a integradora não confia nisso: refaz.

## TDD na prática

1. Escreva **um** teste que descreve o comportamento desejado, com um nome claro.
2. Rode e **veja-o falhar pelo motivo certo** (a funcionalidade não existe, e não um erro de digitação). Um teste que passa de primeira não prova nada.
3. Escreva o **mínimo** de código para passar. Nada de "já que estou aqui".
4. Rode a **suíte inteira**, não só o arquivo novo.
5. Refatore só com tudo verde. Commit pequeno.
6. Antes de escrever o teste, diga qual mudança no código o faria falhar. Se não souber, o teste está fraco.

Testes que valem para configuração e documentação também: dá para testar com leitura de texto que o CI roda os comandos certos, que o modelo de PR tem as seções combinadas e que os links do README existem.

## Testes-guarda

Testes que não verificam uma funcionalidade, mas **protegem uma decisão**:

- **Congelamento:** um hash dos arquivos que não podem mudar (por exemplo, os scripts de animação aprovados). Mudar um deles exige atualizar o teste de propósito.
- **Ordem e estrutura:** a ordem das seções ou dos módulos não muda sem decisão.
- **Trava de dados fictícios:** se o projeto ainda tem exemplos inventados (clientes, depoimentos, textos), o teste **falha** quando o modo "exemplo" for desligado. Assim ninguém publica conteúdo falso por engano.
- **Privacidade:** nenhum dado pessoal (e-mail da conta, telefone) fora dos arquivos de conteúdo.
- **Contraste e desempenho:** valores mínimos fixados em teste ou em verificação de publicação.

## Verificação no navegador

Testes verdes não substituem **olhar**. A integradora abre o resultado de verdade:

- **Servidor local ou build de produção** (o build mostra o que vai ao ar; use `npm run build` e `npm run preview`).
- **Medir com um navegador automatizado**, não só olhar: com `puppeteer-core` e o Chrome instalado dá para emular o celular, rolar a página, passar o mouse, ler estilos calculados e amostrar valores ao longo do tempo (por exemplo, a opacidade de um elemento a cada 200 ms para provar uma animação).
- **Capturas de tela** nos estados que importam (repouso, hover, rolagem, celular).
- **Lighthouse** (`npx lighthouse URL --only-categories=performance,accessibility --chrome-flags="--headless=new"`); fixe metas, por exemplo desempenho ≥ 95 e acessibilidade ≥ 98.
- **Matriz mínima:** desktop, tablet e celular; todos os idiomas; **movimento reduzido** ligado (tudo continua visível, nada anima); sem erros no console; sem rolagem horizontal.

Exemplo de amostragem de uma animação:

```js
// Dentro de page.evaluate: leia a opacidade do elemento a cada 200 ms
const valores = [];
for (let i = 0; i < 10; i++) {
  valores.push(+getComputedStyle(document.querySelector('.cartao')).opacity);
  await new Promise((r) => setTimeout(r, 200));
}
// esperado: valores crescendo de 0 até 1, sem pular
```

## Definição de pronto

Uma tarefa está pronta quando **todas** estas afirmações forem verdadeiras, cada uma com evidência na tela:

1. Os critérios de aceite da issue estão atendidos e conferidos contra a referência.
2. Os testes micro existem, falharam antes e passam agora.
3. A suíte completa, os tipos e o build estão verdes; o CI do GitHub está verde.
4. A página foi explorada no navegador na matriz mínima.
5. Não há regressão nas outras áreas.
6. A documentação afetada foi atualizada.
7. Cada decisão que desviou do plano está registrada.
