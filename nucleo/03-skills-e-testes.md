# 03 · Skills e testes

Duas regras valem para **todas as sessões**, integradora ou trabalhadora: usar a Skill certa para cada cenário e provar com testes e com evidência. Dizer qual Skill está em uso faz parte do trabalho.

## Mapa de skills

| Cenário | Skill |
|---|---|
| Funcionalidade nova, mudança de comportamento ou pedido ambíguo | `superpowers:brainstorming` (antes de mexer em qualquer arquivo) |
| Decisão de arquitetura, escolha entre tecnologias | `engineering:architecture` |
| Desenho de sistema, serviços, APIs, modelagem de dados | `engineering:system-design` |
| Back: rota de API conforme o contrato (paginação, erros, pedido repetido) | `metodo:api-conforme-contrato` (rascunho) |
| Back: migração de banco em tabela com uso | `metodo:migracao-sem-parada` (rascunho) |
| Back: concorrência, travas, exclusão em massa, conexões | `metodo:transacoes-e-consultas` (rascunho) |
| Back: fila, tarefa em segundo plano, chamada externa depois de gravar | `metodo:trabalho-em-segundo-plano` (rascunho) |
| Front: formulário, validação e mensagens de erro | `metodo:formularios-e-erros` (rascunho) |
| Front: tela lenta ou que pula (LCP, INP, CLS, imagens, fontes) | `metodo:desempenho-na-tela` (rascunho) |
| Front: carregando, vazio, erro do serviço, ação demorada | `metodo:estados-da-tela` (rascunho) |
| Plano com vários passos a partir de uma spec | `superpowers:writing-plans` |
| Executar um plano na sessão atual | `superpowers:executing-plans` |
| Plano com tarefas independentes, com uma revisão a cada tarefa | `superpowers:subagent-driven-development` |
| Duas ou mais tarefas independentes dentro de uma sessão | `superpowers:dispatching-parallel-agents` |
| Implementar qualquer coisa | `superpowers:test-driven-development` (RED antes de GREEN) |
| Estratégia de testes de um projeto ou funcionalidade | `engineering:testing-strategy` |
| Bug, teste que falha ou comportamento inesperado | `superpowers:systematic-debugging` ou `engineering:debug` |
| Antes de dizer "pronto", "passou" ou abrir o PR | `superpowers:verification-before-completion` |
| Mudança grande ou arriscada | `superpowers:requesting-code-review` e `engineering:code-review` |
| Receber comentários de revisão | `superpowers:receiving-code-review` |
| Interface: acessibilidade, contraste, teclado | `design:accessibility-review` |
| Interface: crítica de design e usabilidade | `design:design-critique` |
| Entregar um design para o desenvolvimento | `design:design-handoff` |
| Textos de interface (botões, erros, estados vazios) | `design:ux-copy` |
| Isolar o trabalho numa worktree | `superpowers:using-git-worktrees` |
| Fim de uma branch (integrar ou manter) | `superpowers:finishing-a-development-branch` |
| Antes de publicar | `engineering:deploy-checklist` |
| Incidente em produção | `engineering:incident-response` |
| Dívida técnica | `engineering:tech-debt` |
| Documentação, README, runbook | `engineering:documentation` |
| Analisar um artefato fechado (binário, app empacotado) | `reverse-engineer-anything` |
| Uma sessão deu errado e você quer entender por quê | `superpowers:diagnosing-superpowers` |

Se nenhuma Skill cobrir o cenário, diga isso em uma linha e siga o fluxo normal.

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
