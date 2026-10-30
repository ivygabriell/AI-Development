---
name: migracao-de-sistema
description: Use quando for planejar uma mudança grande com o sistema no ar (novo modelo de dados, troca de banco, de fila, de provedor de e-mail ou pagamento, de serviço interno), decidir a ordem de duas mudanças de risco, ou escrever como voltar atrás no meio dela.
---

# Migração de sistema

**Maturidade:** rascunho (sem caso real ainda). **Quem usa:** a Arquitetura, que desenha e registra a migração; o back executa a parte de banco por `metodo:migracao-sem-parada` e o DevOps publica por `metodo:publicacao-gradual`.

O caminho antigo fica de pé até o novo provar, com tráfego real, que faz o mesmo. A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/arquitetura.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/arquitetura.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Isole o que vai trocar** atrás de uma interface no código (por exemplo, `EnviadorDeEmail`), com o caminho antigo como a implementação atual. Fonte: [Slack, fila de tarefas](https://slack.engineering/scaling-slacks-job-queue/).
2. **Grave nos dois caminhos** (o antigo continua mandando) e, quando o novo não pode ter efeito de verdade ainda, rode-o em **modo sombra**: processa e descarta, ou só compara. Numa mudança de modelo de dados, os dois caminhos são a estrutura antiga e a nova: acrescente, grave nas duas, preencha o histórico em lotes (`metodo:migracao-sem-parada`) e marque para revisão o que não converte com segurança, sem inventar dado. Se a API expõe o dado, o formato antigo continua saindo para os clientes antigos (`metodo:contrato-de-api`). Fonte: [Slack, fila de tarefas](https://slack.engineering/scaling-slacks-job-queue/).
3. **Compare antes de confiar:** contagens em cada etapa, leitura dupla com a diferença registrada e uma sonda de ponta a ponta com alerta. A meta é diferença zero, ou toda diferença explicada. Fontes: [Slack, fila de tarefas](https://slack.engineering/scaling-slacks-job-queue/) e [Slack, Vitess](https://slack.engineering/scaling-datastores-at-slack-with-vitess/).
4. **Passe aos poucos, com chave liga/desliga:** primeiro o uso interno, depois um tipo de tráfego por vez (ou uma fração), com critério de parada escrito antes; o mais crítico passa por último. Fontes: [Slack, fila de tarefas](https://slack.engineering/scaling-slacks-job-queue/) e [Slack, Envoy](https://slack.engineering/migrating-millions-of-concurrent-websockets-to-envoy/).
5. **Voltar é virar a chave:** o caminho antigo fica ativo (e pago, se for um provedor) até um período estável depois de 100%. O ponto sem volta (apagar o antigo, remover a coluna) é uma etapa própria, por último, com cópia de segurança testada. Aceite o custo de rodar os dois durante a transição. Fonte: [Slack, Envoy](https://slack.engineering/migrating-millions-of-concurrent-websockets-to-envoy/).
6. **Uma mudança de risco por vez:** duas migrações no mesmo período entram em sequência, com folga entre elas, para um problema ter uma causa só; nada de migração em época de pico. Vai primeiro a mais fácil de voltar, salvo prazo de negócio; a folga dura até as métricas da primeira ficarem estáveis por um ciclo inteiro de uso (pelo menos uma semana, com o fim de semana). Fonte: [Azure, checklist de confiabilidade](https://learn.microsoft.com/en-us/azure/well-architected/reliability/checklist).
7. **Registre** o plano, a ordem, o critério de parada e o ponto sem volta com `engineering:architecture`, **antes** de começar.

## O teste que prova

| Regra | Ensaio |
|---|---|
| Comparação | a leitura dupla em homologação mostra diferença zero (ou explicada) |
| Volta | virar a chave para o caminho antigo no meio da passagem não perde dado nem duplica efeito |
| Ponto sem volta | a cópia de segurança é restaurada num ensaio antes de apagar o antigo |

## Checklist

- [ ] Interface isolando o que troca.
- [ ] Gravação nos dois caminhos ou modo sombra.
- [ ] Comparação com contagens, leitura dupla e sonda.
- [ ] Passagem gradual com chave e critério de parada.
- [ ] Caminho antigo ativo até estabilizar; ponto sem volta por último, com cópia testada.
- [ ] Uma mudança de risco por vez; plano registrado antes.

## Adaptar ao tamanho do projeto

- Mudança pequena e sem dados de produção ainda: a interface do passo 1 e a volta do passo 5 bastam.
- Troca de provedor externo (e-mail, pagamento): o passo 2 vira enviar pelos dois só para a equipe ou para os casos de baixo risco; confira as exigências do novo provedor (domínio, reputação, credenciais) antes de passar tráfego.
