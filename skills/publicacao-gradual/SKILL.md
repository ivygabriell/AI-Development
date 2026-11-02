---
name: publicacao-gradual
description: Use quando for desenhar, mudar ou revisar como o projeto publica código ou configuração em produção (deploy, troca de versão, canário, reversão, chave liga/desliga, mudança feita direto no painel do provedor), ou depois de um incidente causado por uma publicação.
---

# Publicação gradual

**Quem usa:** a trabalhadora do DevOps ao construir e o especialista de DevOps ao revisar. O checklist antes de publicar continua com `engineering:deploy-checklist`.

Toda mudança, de código ou de configuração, chega primeiro a uma parte pequena do tráfego e só avança se os sinais do usuário estiverem bons. A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/devops.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/devops.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Lotes pequenos.** Uma publicação leva poucas mudanças independentes; é mais fácil avaliar, isolar e reverter. Fonte: [SRE, canário](https://sre.google/workbook/canarying-releases/).
2. **Canário primeiro, ampliando por etapas**, com um canário por vez. Compare o canário com o resto **no mesmo período**, nunca com o "antes" (hora do dia e dia da semana enganam), com as métricas separadas por população. Fonte: [SRE, canário](https://sre.google/workbook/canarying-releases/).
3. **Poucas métricas, as que o usuário sente:** taxa de erro (sem os erros do cliente, como 404 e 422) e tempo de resposta, uma dúzia ou menos, com a janela da métrica do tamanho da etapa. Canário com pouca amostra (pouco tráfego, 1%) dá comparação fraca: alongue a etapa ou some tráfego sintético antes de decidir. Além da comparação, confira a meta absoluta (`metodo:metas-e-alertas`): canário e resto podem piorar juntos. Fonte: [SRE, canário](https://sre.google/workbook/canarying-releases/).
4. **Voltar é rápido, automático quando der, e ensaiado antes de precisar.** A versão anterior fica pronta para receber o tráfego, sem build novo. Fonte: [SRE, canário](https://sre.google/workbook/canarying-releases/).
5. **Publicar não é ligar:** função nova atrás de uma chave liga/desliga, desligada por padrão, que se desliga sem publicar de novo. Fonte: [SRE, canário](https://sre.google/workbook/canarying-releases/).
6. **Configuração é código.** Limites, regras de bloqueio, chaves liga/desliga e arquivos de funcionalidade ficam no repositório, com PR, revisão, validação no CI e publicação pelas mesmas etapas do passo 2. Mudança direta no painel do provedor vira exceção de emergência, registrada e depois trazida ao repositório. Se o provedor não divide o tráfego para configuração, use o modo "só registrar" quando houver e aplique primeiro em homologação; a validação no CI testa o arquivo contra exemplos de pedidos que devem passar. Fontes: [Cloudflare, 18/11/2025](https://blog.cloudflare.com/18-november-2025-outage/), [Cloudflare, 05/12/2025](https://blog.cloudflare.com/5-december-2025-outage) e [Cloudflare, Fail Small](https://blog.cloudflare.com/fail-small-resilience-plan/).
7. **Banco junto com o código:** a versão nova e a antiga funcionam com o mesmo esquema durante a troca (`metodo:migracao-sem-parada`, passo 9). Fonte: [PlanetScale, mudanças compatíveis](https://planetscale.com/blog/backward-compatible-databases-changes).

## O teste que prova (ensaie antes, veja falhar)

| Regra | Ensaio |
|---|---|
| Canário barra | publicar em homologação uma versão que falha de propósito: ela não passa da primeira etapa e o tráfego volta sozinho |
| Voltar | cronometrar a reversão; o tempo vai para o PR e para o runbook |
| Configuração | um arquivo de configuração errado é barrado pela validação do CI |
| Chave | desligar a função nova sem publicar de novo |

## Checklist

- [ ] Lote pequeno; canário por etapas, um por vez, comparado no mesmo período.
- [ ] Erro (sem 4xx do cliente) e tempo de resposta por população, mais a meta absoluta.
- [ ] Reversão rápida, ensaiada e cronometrada.
- [ ] Função nova atrás de chave desligada.
- [ ] Configuração no repositório, validada e publicada pelas mesmas etapas.
- [ ] Esquema do banco compatível com as duas versões.

## Adaptar ao tamanho do projeto

- Uma instância só, sem divisão de tráfego: publique primeiro numa prévia (ambiente de homologação ou URL de prévia do provedor) com as mesmas métricas, e mantenha a versão anterior pronta para voltar com um comando.
- Site estático: o provedor costuma guardar cada publicação; voltar é apontar para a anterior. O passo 6 continua para redirecionamentos e regras do provedor.
- Sem tráfego real ainda: as etapas do canário esperam; os passos 4 a 7 já valem.
