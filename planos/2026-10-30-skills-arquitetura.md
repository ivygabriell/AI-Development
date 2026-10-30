# Skills da Arquitetura: plano

**Objetivo:** o agente Arquitetura ganha três skills no plugin `metodo`, tiradas da leitura das referências do seu harness, e uma base de conhecimento. A Arquitetura não tem trabalhadoras: as skills servem a ela ao decidir e revisar, e apontam para as skills de quem executa (back e DevOps). Tudo em `rascunho`, pelo mesmo processo da [decisão 009](../decisoes/009-skills-por-agente.md).

**Combinado com a pessoa (2026-10-30):** "pode seguir criando as outras". O registro de cada decisão continua com `engineering:architecture`, e o desenho geral com `engineering:system-design`.

## Tarefas

- [x] **Leitura:** Stripe (versões da API, repetição segura), Netflix (API resiliente, descoberta de conteúdo, descarte priorizado), Slack (fila de tarefas, Vitess, Envoy), Azure Well-Architected (checklist de confiabilidade, análise de modos de falha). GitHub, Meta e Google Cloud ficaram apontados na base para casos específicos. O blog da Netflix recusa leitura automática por `curl` (HTTP 403); os artigos foram lidos pela busca. Links conferidos.
- [x] **Verificações antes (vistas falhar):** o verificador confere também a base, as três skills e a parte 5 do harness da Arquitetura. 29 falhas antes do conteúdo.
- [x] **Linha de base (RED):** uma agente de Arquitetura sem as skills escreveu o contrato de pedidos, o comportamento em falha do checkout e duas migrações. O resultado foi bom (chave de repetição atômica, cursor, enumeração aberta, estado "pagamento desconhecido", expandir e contrair, provedor antigo ativo, uma mudança por vez). Falhas observadas: versão na URL sem registrar a divergência entre as referências (o Zalando proíbe), quadro de falhas sem probabilidade, sem detecção e sem separar leitura e escrita, e fontes de memória (livros e RFCs) em vez das referências escolhidas pela pessoa. Como a linha de base já era forte, as skills ficaram curtas: o roteiro, as fontes da pessoa e o checklist de revisão.
- [x] **Skills, base, harness, `consultar`, mapa do `03`, README, caso, `CHANGELOG.md` e `VERSION` (2.11.0).**
- [x] **Teste com as skills (GREEN):** a mesma agente, com as skills, registrou a escolha de versão (sem versão enquanto compatível), exigiu cliente tolerante, montou o quadro com probabilidade, efeito, mitigação e detecção, separou dependências fortes e fracas e citou as fontes da pessoa.
- [x] **Ajustes (REFACTOR), do que ela apontou:** o servidor diz as ações permitidas (estado novo não libera botão no app antigo); janela de repetição fixada no contrato (24 h de referência) e código estável para chave com corpo diferente; dependência fraca só com alternativa, e a condição no quadro; escala de probabilidade; prazo máximo em "a confirmar"; mudança de modelo de dados com preenchimento em lotes e o que não converte marcado; critério de ordem e de folga entre duas migrações.
- [ ] `node scripts/verificar.mjs` verde; PR com o modelo preenchido, só com a confirmação da pessoa.
