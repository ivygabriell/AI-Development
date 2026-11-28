# 03 · Testes e auditoria de segurança

Escolha a [trilha por impacto](01-fluxo-de-ponta-a-ponta.md#impacto-da-tarefa) antes de escolher as skills e o alcance da verificação. Quando o [Agent Skills do Addy Osmani](https://github.com/addyosmani/agent-skills) estiver disponível, use as skills aplicáveis ao trabalho daquela etapa. A trilha Básico usa evidência focada. Revisão em cinco eixos, especialistas e auditoria entram conforme os riscos e os portões do método.

## Revisão de segurança

`security-and-hardening` orienta o mapa de riscos e a revisão. No Claude Code, a Lead pode pedir um parecer independente à persona `security-auditor`. No Codex, uma sessão de revisão recebe o mesmo recorte e usa a skill. O Security conduz o trabalho quando o projeto usa especialistas. [Skill de segurança do Addy](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/skills/security-and-hardening/SKILL.md)

| Momento | Uso | Resultado |
|---|---|---|
| Fase 2, primeiro mapa de riscos | Modele quem usa, os dados, as fronteiras de confiança e os controles. | Mapa em `processo/seguranca.md` e critérios de aceite das tarefas. |
| Revisão de PR sensível ou correção de vulnerabilidade | Revisão focada nas fronteiras e nos controles afetados. | Veredito da revisão e achados que precisam de correção. |
| Fase 7, antes da primeira publicação e após mudança relevante de exposição ou controles | Revisão de segurança abrangente, com escopo e custo aprovados ou dispensa registrada. | Parecer privado, cobertura declarada e triagem no mapa de riscos. |

Na revisão abrangente, a Lead leva motivo, escopo e limite ao portão da pessoa. Registre o commit, a cobertura efetiva, o que ficou pendente e as verificações feitas. Achados confirmados críticos ou altos bloqueiam a publicação até correção. Resultados que dependem de evidência adicional entram como `needs_validation`. Guarde o parecer e evidências sensíveis fora do repositório, em canal privado.

Na auditoria, limite-se ao código autorizado. Qualquer execução de código do projeto exige sandbox sem rede, ambiente sem segredos e limites de recursos. Registre como `needs_validation` o que depender de execução quando essa sandbox estiver indisponível.

## Testes: micro e macro

Duas camadas de verificação, dimensionadas pela trilha. O CI obrigatório do projeto continua valendo em todas elas.

- **Micro** verifica o menor ponto alterado. Faça TDD quando mudar comportamento ou corrigir um bug. Num ajuste básico exclusivamente visual, de texto ou documentação, verifique diretamente o antes e o depois.
- **Macro** verifica regressões através da suíte, do build, da checagem de tipos e da exploração do que o ajuste pode afetar.

| Trilha | Quem executa | Lead |
|---|---|---|
| Básico | Verifica o aceite e os efeitos imediatos. Registra evidência e confere o CI. | Confere o diff, a evidência e os estados afetados. |
| Padrão | TDD conforme a mudança, suíte e verificações aplicáveis do projeto. | Valida com contexto independente, confere o teste e explora as regressões plausíveis. |
| Profundo | Verifica caminhos normais e de falha, com cobertura dos riscos registrados. | Valida com revisão independente e especialistas pertinentes. Em publicação de alto impacto, confere a recuperação e o resultado após publicar. |

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

Quando a mudança aparece no navegador, a Lead confere o resultado de verdade. No Básico, veja o elemento e seus estados afetados. No Padrão e no Profundo, amplie a exploração conforme o alcance. Use os itens pertinentes:

- **Servidor local ou build de produção** (o build mostra o que vai ao ar; use `npm run build` e `npm run preview`).
- **Medir com um navegador automatizado**, não só olhar: com `puppeteer-core` e o Chrome instalado dá para emular o celular, rolar a página, passar o mouse, ler estilos calculados e amostrar valores ao longo do tempo (por exemplo, a opacidade de um elemento a cada 200 ms para provar uma animação).
- **Capturas de tela** nos estados que importam (repouso, hover, rolagem, celular).
- **Lighthouse** (`npx lighthouse URL --only-categories=performance,accessibility --chrome-flags="--headless=new"`); fixe metas, por exemplo desempenho ≥ 95 e acessibilidade ≥ 98.
- **Matriz de verificação:** inclua os tamanhos de tela, idiomas, estados e preferências que podem sofrer regressão. Em mudança que atravessa a interface, cubra desktop, tablet, celular, idiomas e movimento reduzido, quando oferecidos pelo produto.

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

Uma tarefa está pronta quando o aceite tem evidência, a Lead fez a validação da trilha e o CI obrigatório está verde. Registre o resultado na issue ou no PR.

1. **Básico:** o antes e o depois comprovam o ajuste e foram conferidos nos estados afetados.
2. **Padrão:** os testes novos de comportamento ou de bug falham antes e passam depois. As verificações do projeto e a revisão independente cobrem o alcance.
3. **Profundo:** as evidências cobrem os riscos levantados e os portões da ação foram atendidos. Para publicação de alto impacto, a validação inclui os sinais combinados após publicar.

Atualize a documentação afetada e registre os desvios relevantes. Achados críticos ou importantes bloqueiam a integração. Achados de segurança confirmados críticos ou altos bloqueiam a publicação.
