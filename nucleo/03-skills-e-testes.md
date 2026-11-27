# 03 · Testes e auditoria de segurança

## security-audit

A [security-audit da Cloudflare](https://github.com/cloudflare/security-audit-skill) é a única skill usada pelo método. O Security conduz o trabalho no modo com especialistas. Nos outros modos, a Lead assume esse papel.

| Momento | Uso | Resultado |
|---|---|---|
| Fase 2, primeiro mapa de riscos | Modo de orientação. Identifique quem usa, as fronteiras de confiança, as superfícies de entrada e os controles. | Mapa em `processo/seguranca.md` e critérios de aceite das tarefas. |
| Revisão de PR sensível | Modo de orientação. Avalie fronteira, impacto demonstrado e a correção necessária. | Veredito da revisão e achados que precisam de correção. |
| Fase 7, antes da primeira publicação e após mudança grande | Auditoria completa após a aprovação do perfil, do escopo e do orçamento, ou dispensa registrada. | Relatório fora do repositório e triagem no mapa de riscos. |

Para a auditoria completa, use o [procedimento oficial da Cloudflare](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/SKILL.md). A Lead submete motivo, perfil, escopo e limite ao portão da pessoa. Registre o commit auditado, valide o relatório e a cobertura e guarde a saída fora do repositório. Achados confirmados críticos ou altos bloqueiam a publicação. Resultados que dependem de evidência adicional entram como `needs_validation` no mapa de riscos. Registre achados e evidências sensíveis em canais privados, sem incluir o valor de segredos.

Na auditoria, limite-se ao código autorizado. Qualquer execução de código do projeto exige sandbox sem rede, ambiente sem segredos e limites de recursos. Registre como `needs_validation` o que depender de execução quando essa sandbox estiver indisponível.

## Testes: micro e macro

Duas camadas com responsabilidades diferentes. Nenhuma sessão pula testes.

- **micro** = o menor pedaço que mudou: uma função, um componente, um estado (hover, foco, erro), uma regra de CSS. O teste é escrito **antes** do código.
- **macro** = o projeto e a página inteiros: a suíte completa, o build, a checagem de tipos, o desempenho e as outras seções (regressão).

| Camada | Builder | Lead |
|---|---|---|
| micro | TDD: escreve o teste, vê falhar, faz passar | Relê os testes novos (eles falhariam sem o código?) e **explora** cada elemento alterado no navegador, em todos os estados |
| macro | Antes do PR: suíte completa, tipos, build e testes do build, tudo verde | Refaz tudo na branch **e na `main`**; confere o CI; **explora** a página inteira, as outras seções, idiomas, telas e acessibilidade |

A Builder entrega com os macro verdes, e a Lead não confia nisso: refaz.

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

Testes verdes não substituem **olhar**. A Lead abre o resultado de verdade:

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
