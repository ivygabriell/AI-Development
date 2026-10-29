# Skills de Design e Front: plano

**Objetivo:** o agente Design e Front ganha três skills no plugin `metodo`, tiradas da leitura das referências do seu harness, e uma base de conhecimento; as trabalhadoras dele usam as skills ao construir. Tudo em `rascunho`, pelo mesmo processo da [decisão 009](../decisoes/009-skills-por-agente.md).

**Combinado com a pessoa (2026-10-29):** as três skills propostas (formulários e erros, desempenho na tela, estados da tela); a revisão geral de acessibilidade continua com `design:accessibility-review` e os textos com `design:ux-copy`; o React Blog só na base. **Quando as fontes discordam sobre a hora do erro de campo, vale o GOV.UK** (ao avançar ou enviar), não o NN/g (ao sair do campo).

## Tarefas

- [x] **Leitura:** WCAG 2.2 (o que há de novo e as páginas de entendimento dos critérios usados), GOV.UK (validação, mensagem de erro, resumo de erros), NN/g (erros em formulários, indicadores de progresso, estados vazios), web.dev (Web Vitals, otimizar LCP, INP e CLS, Baseline), MDN (imagens responsivas) e React Blog (avisos de segurança, fim do Create React App, React Compiler). Resumo com palavras próprias; todos os links conferidos (HTTP 200).
- [x] **Verificações antes (vistas falhar):** o verificador passa a conferir também a base, as três skills, a parte 5 do harness, a `consultar` e a regra do GOV.UK na skill de formulários. 30 falhas antes do conteúdo.
- [x] **Linha de base (RED):** uma trabalhadora sem as skills fez o cadastro em etapas, a página inicial lenta e a tela de pedidos com exportação. Falhas observadas: sem resumo de erros nem "Erro: " no título (só foco no primeiro campo), mensagens com "válido" e uma só mensagem para a data inteira, e-mail sem tirar espaços, prometeu medir o INP no Lighthouse (que não mede INP) e sem dado de campo, `font-display: swap` sem pensar na troca tardia, exportação de 20 a 60 s só com texto, sem porcentagem.
- [x] **Skills e base:** `skills/formularios-e-erros/`, `skills/desempenho-na-tela/`, `skills/estados-da-tela/` e `modelos/referencias/design-e-front.md`.
- [x] **Harness, `consultar`, mapa de skills do `03`, README, caso, `CHANGELOG.md` e `VERSION` (2.8.0).**
- [x] **Teste com as skills (GREEN):** a mesma trabalhadora, com as skills, fez o resumo de erros com foco e "Erro: " no título, mensagens por parte da data, tirou espaços e separadores, mediu o INP no DevTools (não no Lighthouse), deixou a imagem principal no HTML de um app montado no navegador, separou exportação com e sem progresso do back e perguntou ao especialista o que o contrato não dizia.
- [x] **Ajustes (REFACTOR), do que ela apontou:** foco no contêiner do resumo (`tabindex="-1"`) e `role="alert"` dentro dele; erro de data inteira no primeiro campo do grupo; erro de campo desconhecido só no resumo; 422 em várias etapas pela ordem do formulário; `preload` no `index.html` ou pré-renderização em app montado no navegador; a fonte decidida pelo design system; espera variável sem progresso do back (aviso e cancelar depois de 10 s); porcentagem anunciada só em marcos.
- [ ] `node scripts/verificar.mjs` verde; PR com o modelo preenchido, só com a confirmação da pessoa.
