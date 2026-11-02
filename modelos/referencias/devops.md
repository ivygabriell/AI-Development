# Base de conhecimento: DevOps

**Leitura feita em:** 2026-10-29
**Agente:** DevOps (harness em `modelos/agentes/devops.md`)
**Skills que saem daqui:** `metodo:publicacao-gradual`, `metodo:metas-e-alertas` e `metodo:ci-seguro`

O que a leitura das referências escolhidas pela pessoa ensinou, com palavras próprias: a regra concreta, o porquê e o link. É o segundo lugar onde o agente procura, depois do `docs/referencias/devops.md` do projeto e antes dos sites. O checklist antes de publicar continua com `engineering:deploy-checklist`, e a condução do incidente com `engineering:incident-response`.

## Publicar com segurança (Google SRE e Cloudflare)

| Regra | Por quê | Fonte |
|---|---|---|
| Toda mudança passa primeiro por uma fatia pequena e limitada no tempo (canário), comparada com o resto ao mesmo tempo | o "antes e depois" mistura hora do dia e dia da semana | [SRE, canário](https://sre.google/workbook/canarying-releases/) |
| Ampliar por etapas; nas primeiras, os sinais mais claros (falhas e erros de pedido) | a confiança cresce com a população | [SRE, canário](https://sre.google/workbook/canarying-releases/) |
| Um canário por vez; métricas separadas do canário e do resto; uma dúzia ou menos, de erro e tempo de resposta, sem erros do cliente (404) | o agregado esconde o canário quebrado | [SRE, canário](https://sre.google/workbook/canarying-releases/) |
| Além da comparação, a meta absoluta (SLO): canário e resto podem piorar juntos | a comparação sozinha não vê | [SRE, canário](https://sre.google/workbook/canarying-releases/) |
| Voltar rápido e treinado; lotes pequenos; função nova atrás de chave liga/desliga | desligar sem esperar um build novo | [SRE, canário](https://sre.google/workbook/canarying-releases/) |
| Configuração com o mesmo rigor do código: versionada, revisada, publicada aos poucos | três quedas globais da Cloudflare em 2025 vieram de configuração empurrada para tudo de uma vez | [Cloudflare, 18/11/2025](https://blog.cloudflare.com/18-november-2025-outage/), [05/12/2025](https://blog.cloudflare.com/5-december-2025-outage) e [Fail Small](https://blog.cloudflare.com/fail-small-resilience-plan/) |

## Metas e alertas (Google SRE)

| Regra | Por quê | Fonte |
|---|---|---|
| Começar por um serviço, pelas tarefas que o usuário mais faz, com até cinco indicadores (SLI) | o que não se mede não se protege | [SRE, implementar SLOs](https://sre.google/workbook/implementing-slos/) |
| Indicador = eventos bons ÷ total (disponibilidade: respostas sem 5xx; tempo: pedidos abaixo de um limite) | escala de 0 a 100%, comparável | [SRE, implementar SLOs](https://sre.google/workbook/implementing-slos/) |
| Meta (SLO) a partir do que o sistema já entrega, arredondada para baixo, nunca 100%; dois limites de tempo (o típico e a cauda) | 100% não deixa espaço para mudar | [SRE, implementar SLOs](https://sre.google/workbook/implementing-slos/) |
| Janela móvel de 4 semanas | o mesmo número de fins de semana em toda janela | [SRE, implementar SLOs](https://sre.google/workbook/implementing-slos/) |
| Margem de erro = 100% − meta, com uma política escrita e aceita pelo produto e pelo desenvolvimento: acabou a margem, congela mudança arriscada e prioriza confiabilidade | a meta sem consequência é enfeite | [SRE, implementar SLOs](https://sre.google/workbook/implementing-slos/) |
| Alertas pela velocidade de gasto da margem, com janela longa e curta: 2% em 1 h (e 5 min) e 5% em 6 h (e 30 min) chamam alguém; 10% em 3 dias (e 6 h) abre chamado | pega queda rápida e lenta, para de tocar logo depois de resolver | [SRE, alertas por SLO](https://sre.google/workbook/alerting-on-slos/) |
| Rejeitados: taxa de erro instantânea, "por N minutos", janela única | muitos falsos alarmes ou quedas lentas sem alerta | [SRE, alertas por SLO](https://sre.google/workbook/alerting-on-slos/) |
| Pouco tráfego: tráfego sintético, juntar serviços parecidos, novas tentativas no cliente, ou janela maior | um erro em dez pedidos estoura qualquer taxa | [SRE, alertas por SLO](https://sre.google/workbook/alerting-on-slos/) |
| Análise depois do incidente, sem culpados, com gatilhos combinados antes (queda visível, perda de dado, intervenção manual, demora, monitoramento que falhou); ações com dono; revisada e guardada | o sistema deixou alguém com informação errada; não a pessoa | [SRE, cultura de análise](https://sre.google/sre-book/postmortem-culture/) |

## CI seguro (GitHub Security Lab e documentação do GitHub)

| Regra | Por quê | Fonte |
|---|---|---|
| `pull_request` por padrão; `pull_request_target` só se precisa escrever ou de segredo, e nunca com o código do PR em execução | o código de fora rodaria com permissão de escrita | [GitHub Security Lab, pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/) |
| Separar: construir o PR sem permissão; comentar ou publicar num `workflow_run` que trata o artefato como não confiável | o artefato também vem de fora | [GitHub Security Lab, pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/) |
| `persist-credentials: false` no checkout; rótulo "seguro para testar" é só paliativo | o token fica no disco; o rótulo se contorna com commit novo | [GitHub Security Lab, pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/) |
| Token com leitura por padrão e permissão por job | o estrago fica do tamanho da permissão | [GitHub, segurança do Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions) |
| Ação de terceiro fixada pelo SHA completo do repositório original; atualizada pelo Dependabot | etiqueta pode ser movida | [GitHub, segurança do Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions) |
| Texto do PR (título, branch, corpo) passa por variável de ambiente, entre aspas, nunca direto no `run` | injeção de comando | [GitHub, segurança do Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions) |
| OIDC para a nuvem no lugar de chave fixa; cada segredo separado; trocar e apagar os sem uso; `CODEOWNERS` em `.github/workflows` | credencial curta vaza menos | [GitHub, segurança do Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions) |

## Custo (FinOps Foundation)

O site da FinOps Foundation (https://www.finops.org/) bloqueou a leitura automática em 2026-10-29; o que segue veio de resumos de terceiros e **precisa ser conferido no site antes de usar**: o trabalho de custo é um ciclo de três fases (informar: ver e dividir o gasto; otimizar: achar onde gastar menos; operar: tornar isso rotina), feito junto por engenharia, produto e finanças, o tempo todo e não em reunião de orçamento.

## Kubernetes

Só quando o projeto usa Kubernetes: o blog oficial (https://kubernetes.io/blog/) diz o que muda em cada versão e quando ela perde suporte. Não foi lido a fundo nesta rodada.
