# Skills do DevOps: plano

**Objetivo:** o agente DevOps ganha três skills no plugin `metodo`, tiradas da leitura das referências do seu harness, e uma base de conhecimento; a trabalhadora dele usa as skills ao construir. Tudo em `rascunho`, pelo mesmo processo da [decisão 009](../decisoes/009-skills-por-agente.md).

**Combinado com a pessoa (2026-10-29):** as três skills propostas (publicação gradual, metas e alertas, CI seguro); o checklist antes de publicar continua com `engineering:deploy-checklist`, e a condução do incidente com `engineering:incident-response`; FinOps e Kubernetes só na base.

## Tarefas

- [x] **Leitura:** Google SRE (implementar SLOs, alertas por SLO, canário, cultura de análise de incidentes), Cloudflare (incidentes de 18/11/2025 e 05/12/2025 e o plano "Fail Small"), GitHub Security Lab (pwn requests) e a documentação de segurança do GitHub Actions. O site da FinOps Foundation bloqueou a leitura automática (HTTP 403): o resumo ficou marcado para conferir. Links conferidos.
- [x] **Verificações antes (vistas falhar):** o verificador confere também a base, as três skills e a parte 5 do harness do DevOps. 29 falhas antes do conteúdo.
- [x] **Linha de base (RED):** uma trabalhadora sem as skills resolveu CI para repositório público com comentário no PR e deploy, publicação de código e configuração, e metas e alertas do checkout. Ela já sabia muito (separou o comentário em `workflow_run`, OIDC, canário com reversão, alertas por velocidade de gasto). Falhas observadas: meta de 99,9% escolhida sem medir, janela de 30 dias, nenhuma política para quando a margem acaba, alerta de tempo de resposta "acima da meta por 30 min" (a condição que o SRE rejeita), artefato do PR extraído dentro do workspace e checkout do deploy sem `persist-credentials: false`.
- [x] **Skills e base:** `skills/publicacao-gradual/`, `skills/metas-e-alertas/`, `skills/ci-seguro/` e `modelos/referencias/devops.md`.
- [x] **Harness, `consultar`, mapa de skills do `03`, README, caso, `CHANGELOG.md` e `VERSION` (2.9.0).**
- [x] **Teste com as skills (GREEN):** a mesma trabalhadora, com as skills, tirou a meta da medição (marcada como provisória), usou a janela de 4 semanas, escreveu a política da margem com aceite, trocou o "por N minutos" pela proporção de pedidos lentos, extraiu o artefato em `runner.temp` validando cada valor, pôs `persist-credentials: false` no deploy e perguntou ao especialista o que dependia do provedor.
- [x] **Ajustes (REFACTOR), do que ela apontou:** `npm ci --ignore-scripts` e aprovação para quem contribui pela primeira vez; `workflow_run` roda da branch padrão e confere o evento; trocar as chaves e varrer o histórico antes de abrir o repositório; fórmula da velocidade para outra meta ou janela, tempo de resposta como proporção e sonda como indicador à parte; configuração sem divisão de tráfego (modo "só registrar", homologação) e canário com pouca amostra.
- [ ] `node scripts/verificar.mjs` verde; PR com o modelo preenchido, só com a confirmação da pessoa.
