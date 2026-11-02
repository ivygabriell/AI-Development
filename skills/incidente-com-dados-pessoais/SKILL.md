---
name: incidente-com-dados-pessoais
description: Use quando dados pessoais podem ter vazado ou sido acessados sem autorização (arquivo ou bucket público, log com CPF ou e-mail, credencial exposta, acesso indevido), ou ao preparar o registro e a comunicação de um incidente à ANPD e aos titulares (LGPD).
---

# Incidente com dados pessoais

**Quem usa:** a Segurança, que levanta os fatos e prepara a comunicação. **Decidir se comunica e comunicar é da pessoa** (com o encarregado e, se houver, o jurídico): a Segurança sobe tudo à integradora, que leva à pessoa. A condução técnica do incidente segue `engineering:incident-response`.

A régua é a Resolução CD/ANPD nº 15/2024; confira se há norma mais nova antes de usar. A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/seguranca.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/seguranca.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Anote a hora em que soube.** Os prazos contam do momento em que o controlador toma conhecimento de que o incidente afetou dados pessoais. Suba à integradora na hora, com `orca orchestration send --type escalation`. Fonte: [Resolução nº 15/2024, art. 6](https://bibliotecadigital.mj.gov.br/bitstream/1/12879/2/RES_ANPD_2024_15.html).
2. **Conter e preservar:** feche o acesso e guarde a evidência antes de mexer (registros de acesso, o arquivo exposto em local restrito). Procure o mesmo problema em outros lugares (outros registros, outros buckets). As correções no código vão ao especialista dono da pasta, como em qualquer achado; você não edita. Se vazou senha, hash de senha ou token, proponha à pessoa invalidar as sessões, forçar a troca de senha e trocar os tokens; hash fraco (`metodo:autenticacao-e-sessao`, passo 4) conta como senha exposta.
3. **Levante os fatos para a decisão:** que dados, de quantos titulares, por quanto tempo, quem acessou, se continua. Diga se o incidente cai nos critérios de **risco ou dano relevante**: pode afetar significativamente interesses e direitos dos titulares **e** envolve ao menos um destes: dado sensível; de criança, adolescente ou idoso; financeiro; de autenticação (senha, hash de senha, token); protegido por sigilo; ou em larga escala. Fonte: [Resolução nº 15/2024, art. 5](https://bibliotecadigital.mj.gov.br/bitstream/1/12879/2/RES_ANPD_2024_15.html).
4. **Prazos para a pessoa decidir:** comunicação à ANPD e aos titulares em **3 dias úteis** do conhecimento; complemento à ANPD em até 20 dias úteis; **agente de pequeno porte tem os prazos em dobro**. Na dúvida sobre o porte, trabalhe com o prazo curto. A contagem dos dias úteis e o porte são confirmados pela pessoa com o encarregado ou o jurídico; entregue as datas calculadas e diga que precisam dessa confirmação. Fonte: [Resolução nº 15/2024, arts. 6 e 9](https://bibliotecadigital.mj.gov.br/bitstream/1/12879/2/RES_ANPD_2024_15.html).
5. **Rascunho do aviso aos titulares**, em linguagem simples, com o que a norma pede: natureza e categoria dos dados; medidas técnicas e de segurança tomadas; riscos e impactos possíveis; motivo da demora, se houver; o que foi e o que a pessoa pode fazer para reduzir o dano; a data do conhecimento; o contato (do encarregado, quando houver). O aviso não pede senha nem dado nenhum. Sem contato individual possível, a divulgação ampla fica no ar por pelo menos 3 meses. Fonte: [Resolução nº 15/2024, art. 9](https://bibliotecadigital.mj.gov.br/bitstream/1/12879/2/RES_ANPD_2024_15.html).
6. **Registro do incidente, comunicado ou não**, guardado por pelo menos 5 anos: data do conhecimento, dados e titulares afetados, medidas, e o motivo de não comunicar, se for o caso. Fonte: [Resolução nº 15/2024, art. 10](https://bibliotecadigital.mj.gov.br/bitstream/1/12879/2/RES_ANPD_2024_15.html).
7. **Depois:** a causa vira item do mapa de riscos (dado pessoal fora dos registros, armazenamento privado por padrão) e a análise sem culpados segue `metodo:metas-e-alertas`, passo 7. A comunicação oficial usa o canal da ANPD. Fonte: [ANPD, comunicação de incidente](https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis).

## Checklist

- [ ] Hora do conhecimento anotada e escalada na hora.
- [ ] Acesso fechado e evidência preservada.
- [ ] Fatos levantados e os critérios do art. 5 avaliados.
- [ ] Prazos calculados (3 dias úteis, dobro para pequeno porte) e entregues à pessoa.
- [ ] Rascunho do aviso com os itens do art. 9.
- [ ] Registro do incidente aberto, para 5 anos.

## Adaptar ao tamanho do projeto

- Projeto sem dados pessoais de terceiros: a skill só entra se isso mudar; o registro do passo 6 vale mesmo para incidente pequeno.
- Projeto pessoal sem encarregado: o contato do aviso é o de quem responde pelo projeto; a decisão continua da pessoa.
