---
name: metas-e-alertas
description: Use quando for montar ou revisar monitoramento, metas de confiabilidade (SLI, SLO, margem de erro) ou alertas de um serviço, quando um alerta toca à toa (de madrugada, com pouco tráfego) ou não toca numa queda lenta, ou ao decidir o que fazer quando o serviço ficou abaixo da meta.
---

# Metas e alertas

**Quem usa:** a trabalhadora do DevOps ao construir e o especialista de DevOps ao revisar. A condução de um incidente continua com `engineering:incident-response`.

A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/devops.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/devops.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Comece por uma jornada do usuário** (por exemplo, o checkout) e por até cinco indicadores. Cada indicador é "eventos bons ÷ total": disponibilidade (respostas sem 5xx nem estouro de prazo; erros do cliente não contam) e tempo (pedidos abaixo de um limite). Comece pelo que já dá para medir, como os registros do servidor. Fonte: [SRE, implementar SLOs](https://sre.google/workbook/implementing-slos/).
2. **A meta sai do que o sistema já entrega**, medido nas últimas semanas e arredondado para baixo, nunca 100% nem um número escolhido de cabeça. Para o tempo, dois limites: o típico e a cauda (por exemplo, 90% abaixo de 450 ms e 99% abaixo de 900 ms). Sem dados ainda, meça primeiro e marque a meta como provisória. Fonte: [SRE, implementar SLOs](https://sre.google/workbook/implementing-slos/).
3. **Janela móvel de 4 semanas** (um número inteiro de semanas, para cada janela ter os mesmos fins de semana). Fonte: [SRE, implementar SLOs](https://sre.google/workbook/implementing-slos/).
4. **Margem de erro com política escrita:** margem = 100% − meta. A política diz o que acontece quando ela acaba (congelar mudança arriscada e passar a confiabilidade na frente até voltar à meta) e é aceita pela pessoa dona do produto, pelo especialista do tema e por você; quem não aceitar faz a meta mudar, não a política sumir. Suba à integradora para o aceite. Fonte: [SRE, implementar SLOs](https://sre.google/workbook/implementing-slos/).
5. **Alerta pela velocidade de gasto da margem, com duas janelas** (a longa e uma curta, de 1/12 dela, que confirma que ainda está acontecendo), para uma meta de 99,9% em 30 dias:

   | Gravidade | Janela longa | Janela curta | Velocidade | Margem gasta |
   |---|---|---|---|---|
   | Chama alguém | 1 h | 5 min | 14,4 | 2% |
   | Chama alguém | 6 h | 30 min | 6 | 5% |
   | Abre chamado | 3 dias | 6 h | 1 | 10% |

   Suprima os mais lentos quando o mais rápido tocar. Não use taxa de erro instantânea nem condição "acima de X **por** N minutos" (inclusive para o tempo de resposta): uma melhora breve zera a contagem e a queda intermitente nunca alerta. Com outra meta ou outra janela (4 semanas são 28 dias), recalcule: velocidade = margem gasta × período da meta ÷ janela longa. O tempo de resposta entra do mesmo jeito, como a proporção de pedidos acima do limite. A sonda sintética é um indicador à parte, não somado ao tráfego real. Fonte: [SRE, alertas por SLO](https://sre.google/workbook/alerting-on-slos/).
6. **Pouco tráfego** (madrugada, serviço pequeno): um erro em poucos pedidos estoura qualquer velocidade. Use tráfego sintético (uma sonda que faz a jornada a cada minuto), junte serviços parecidos ou alongue a janela; um volume mínimo na janela é paliativo. Fonte: [SRE, alertas por SLO](https://sre.google/workbook/alerting-on-slos/).
7. **Cada alerta que chama alguém tem um runbook curto**, e o primeiro passo é ver se houve publicação ou mudança de configuração recente para voltar (`metodo:publicacao-gradual`). Depois do incidente, a análise sem culpados segue os gatilhos combinados antes (queda visível, perda de dado, intervenção manual, monitoramento que falhou), com ações com dono. Fonte: [SRE, cultura de análise](https://sre.google/sre-book/postmortem-culture/).

## O teste que prova (ensaie antes, veja falhar)

| Regra | Ensaio |
|---|---|
| Alertas | reaplicar as regras aos dados de incidentes passados: pegam as quedas lentas e não tocam nas madrugadas calmas |
| Queda rápida | injetar erro em homologação e medir o tempo até o alerta chegar |
| Pouco tráfego | a sonda sintética detecta o serviço fora do ar sem nenhum usuário |
| Política | a política da margem tem o aceite registrado e um dono |

## Checklist

- [ ] Até cinco indicadores "bons ÷ total", da jornada do usuário.
- [ ] Meta tirada da medição atual, com dois limites de tempo; janela de 4 semanas.
- [ ] Política da margem escrita e aceita.
- [ ] Alertas por velocidade de gasto com duas janelas; nenhum "por N minutos".
- [ ] Pouco tráfego coberto por sonda sintética.
- [ ] Runbook em cada alerta que chama alguém; gatilhos da análise combinados.

## Adaptar ao tamanho do projeto

- Projeto pessoal ou sem plantão: só a linha "abre chamado" e uma sonda sintética que avisa por e-mail; a política da margem vira "parar de publicar novidades até voltar à meta".
- Sem ferramenta de métricas: comece pelos registros do servidor e por uma sonda externa gratuita; os alertas por velocidade vêm quando houver onde calcular.
- Vários serviços: agrupe por necessidade (crítico, alto, baixo) e use os mesmos parâmetros em cada grupo.
