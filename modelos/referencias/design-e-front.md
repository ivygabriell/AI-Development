# Base de conhecimento: Design e Front

**Maturidade:** rascunho (leitura feita em 2026-10-29, sem caso real ainda)
**Agente:** Design e Front (harness em `modelos/agentes/design-e-front.md`)
**Skills que saem daqui:** `metodo:formularios-e-erros`, `metodo:desempenho-na-tela` e `metodo:estados-da-tela`

O que a leitura das referências escolhidas pela pessoa ensinou, com palavras próprias: a regra concreta, o porquê e o link. É o segundo lugar onde o agente procura, depois do `docs/referencias/design-e-front.md` do projeto e antes dos sites. A revisão geral de acessibilidade continua com `design:accessibility-review`, e os textos de interface com `design:ux-copy`.

**Decisão da pessoa (2026-10-29):** quando as fontes discordam sobre a hora de mostrar o erro de um campo, vale o GOV.UK (ao avançar ou enviar), não o NN/g (ao sair do campo).

## Acessibilidade (WCAG 2.2): o que quem constrói precisa saber

| Regra | Por quê | Fonte |
|---|---|---|
| Alvo de toque ou clique com pelo menos 24 por 24 px, ou com espaço livre equivalente em volta (nível AA) | dedo e mão trêmula erram alvo pequeno | [2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) |
| O elemento com foco não fica escondido por cabeçalho fixo, aviso de cookies ou janela (AA) | quem usa teclado precisa ver onde está | [2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) |
| Tudo o que se faz arrastando também se faz com cliques (AA) | nem todo mundo consegue arrastar | [2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) |
| Não pedir de novo, no mesmo processo, o que a pessoa já informou: preencher ou deixar escolher (A) | repetir cansa e gera erro | [3.3.7](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html) |
| Login sem teste de memória ou de raciocínio: permitir colar a senha e o gerenciador de senhas (AA) | decorar e transcrever exclui pessoas | [3.3.8](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html) |
| A ajuda que se repete entre páginas fica sempre no mesmo lugar (A) | quem precisa de ajuda a acha sem procurar | [3.2.6](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html) |
| O erro é identificado em texto e, quando dá, com a sugestão de correção | cor sozinha não chega a todos | [3.3.1](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) e [3.3.3](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html) |
| Novidades da 2.2 em uma página | ponto de partida para conferir | [O que há de novo na WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) |

## Formulários e erros (GOV.UK e NN/g)

| Regra | Por quê | Fonte |
|---|---|---|
| Validar ao avançar ou enviar, não ao sair do campo nem enquanto a pessoa digita | erro antes da hora atrapalha, e o leitor de tela anuncia fora de contexto | [GOV.UK, validação](https://design-system.service.gov.uk/patterns/validation/) |
| Validar sempre no servidor; no navegador, só se ajudar, e com as mesmas regras | o navegador pode falhar ou ser contornado | [GOV.UK, validação](https://design-system.service.gov.uk/patterns/validation/) |
| Ignorar espaços, hífens, pontos e parênteses em números e códigos; aparar espaços nas pontas | a pessoa cola e digita do jeito dela | [GOV.UK, validação](https://design-system.service.gov.uk/patterns/validation/) |
| Desligar a validação nativa do navegador (`novalidate`) e não usar o atributo `required` | as mensagens nativas não seguem o padrão do serviço | [GOV.UK, validação](https://design-system.service.gov.uk/patterns/validation/) |
| Com erro: manter tudo o que foi digitado, "Erro: " no início do título, resumo no topo com foco e mensagem ao lado de cada campo | a pessoa vê o que errou sem perder o que fez | [GOV.UK, validação](https://design-system.service.gov.uk/patterns/validation/) |
| Resumo sempre que houver erro, mesmo um só, com um link para cada campo; o mesmo texto no resumo e no campo | o resumo leva direto ao campo | [GOV.UK, resumo de erros](https://design-system.service.gov.uk/components/error-summary/) |
| Mensagem que diz o que deu errado e como corrigir, com as palavras da pergunta; sem "inválido", "obrigatório", "por favor", "ops" | específico ajuda, genérico não | [GOV.UK, mensagem de erro](https://design-system.service.gov.uk/components/error-message/) |
| Campo vazio: instrução ("Digite seu nome"); campo errado: descrição ("O nome deve ter até 35 caracteres") | consistência entre todos os campos | [GOV.UK, mensagem de erro](https://design-system.service.gov.uk/components/error-message/) |
| Mensagem ligada ao campo por `aria-describedby`, com o prefixo "Erro:" para o leitor de tela | o leitor de tela anuncia o erro junto do campo | [GOV.UK, mensagem de erro](https://design-system.service.gov.uk/components/error-message/) |
| Elegibilidade, permissão e falha do serviço não são erro de campo: vão para uma página própria | a pessoa não tem como corrigir | [GOV.UK, mensagem de erro](https://design-system.service.gov.uk/components/error-message/) |
| Erro com cor, ícone e texto; nunca só em dica que aparece ao passar o mouse; o mesmo erro três vezes pede ajuda extra | daltonismo, toque e erro repetido apontam o design | [NN/g, erros em formulários](https://www.nngroup.com/articles/errors-forms-design-guidelines/) |

## Estados da tela (NN/g)

| Regra | Por quê | Fonte |
|---|---|---|
| Resposta visual imediata a toda ação; indicador a partir de cerca de 1 s | a pessoa sabe que o clique valeu | [NN/g, indicadores de progresso](https://www.nngroup.com/articles/progress-indicators/) |
| 2 a 10 s: animação em laço com texto do que está acontecendo; 10 s ou mais: porcentagem e, se longo, tempo restante e como cancelar | sem noção de tempo, a pessoa acha que travou | [NN/g, indicadores de progresso](https://www.nngroup.com/articles/progress-indicators/) |
| Nunca só "Carregando…" estático; nunca "não clique de novo" | mostrar que o primeiro clique valeu resolve | [NN/g, indicadores de progresso](https://www.nngroup.com/articles/progress-indicators/) |
| Área nunca em branco; "nenhum item" só depois de carregar; o vazio ensina e oferece a ação | branco não diz se carregou, falhou ou está vazio | [NN/g, estados vazios](https://www.nngroup.com/articles/empty-state-interface-design/) |

## Desempenho (web.dev e MDN)

| Regra | Por quê | Fonte |
|---|---|---|
| Metas no percentil 75, celular e computador separados: LCP até 2,5 s, INP até 200 ms, CLS até 0,1 | são as que medem a experiência real | [web.dev, Web Vitals](https://web.dev/articles/vitals) |
| Dado de campo (usuários reais) primeiro; no laboratório, o INP não se mede, e o TBT é o substituto | o laboratório não clica | [web.dev, Web Vitals](https://web.dev/articles/vitals) |
| Imagem principal no HTML, com `fetchpriority="high"` e sem `loading="lazy"`; sem script síncrono no `<head>` | ela é quase sempre o LCP | [web.dev, otimizar LCP](https://web.dev/articles/optimize-lcp) |
| Imagens no tamanho certo, em AVIF ou WebP, com `srcset` e `sizes`; `<picture>` para recorte diferente por tela | arquivo grande é o atraso mais comum | [web.dev, otimizar LCP](https://web.dev/articles/optimize-lcp) e [MDN, imagens responsivas](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images) |
| Fonte: arquivo menor, `font-display` diferente de `auto` e `block` (`optional` evita a troca tardia) | fonte atrasa o texto e empurra o layout | [web.dev, otimizar LCP](https://web.dev/articles/optimize-lcp) e [otimizar CLS](https://web.dev/articles/optimize-cls) |
| Largura e altura em imagens e vídeos; espaço reservado (`min-height`, `aspect-ratio`) para o que chega depois; animar só `transform` | o que entra sem espaço empurra o resto | [web.dev, otimizar CLS](https://web.dev/articles/optimize-cls) |
| Pouco trabalho no clique: atualizar a tela primeiro e adiar o resto; dividir tarefas longas; DOM pequeno; `content-visibility` fora da tela | o clique espera a tarefa em curso terminar | [web.dev, otimizar INP](https://web.dev/articles/optimize-inp) |
| Usar recurso da web pelo selo Baseline (amplamente disponível = 30 meses em todos os navegadores principais) | compatibilidade sem adivinhar | [web.dev, Baseline](https://web.dev/baseline) |

## React (só quando o projeto usa React)

| Regra | Por quê | Fonte |
|---|---|---|
| Server Components: versão com a correção crítica de segurança (19.0.1, 19.1.2, 19.2.1 ou mais nova) e as correções seguintes | execução remota sem login | [Aviso de 2025-12-03](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components) e [aviso de 2025-12-11](https://react.dev/blog/2025/12/11/denial-of-service-and-source-code-exposure-in-react-server-components) |
| Projeto novo sem Create React App: um framework ou Vite | o CRA foi encerrado | [Encerrando o Create React App](https://react.dev/blog/2025/02/14/sunsetting-create-react-app) |
| React Compiler estável (1.0) e as regras de lint que vêm com ele | menos memorização manual | [React Compiler 1.0](https://react.dev/blog/2025/10/07/react-compiler-1) |
