---
name: entrada-nao-confiavel
description: Use quando for implementar ou revisar código em que algo vindo de fora (parâmetro, corpo, cabeçalho, campo salvo pelo usuário, resposta de outro serviço) vira consulta SQL, ordenação, HTML, link, comando ou uma URL que o servidor busca (prévia de link, webhook, importação por URL).
---

# Entrada não confiável

**Quem usa:** a Segurança ao mapear riscos e revisar, e as trabalhadoras do back e do front quando constroem ou corrigem esses pontos.

A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/seguranca.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/seguranca.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **SQL sempre com parâmetros.** O que não pode ser parâmetro (tabela, coluna, `ASC`/`DESC`) vem de um mapa fixo no código, escolhido pela entrada e nunca copiado dela (use `Map` ou `Object.hasOwn`, para `__proto__` não passar). Procure `${` e concatenação em toda consulta do PR. A conta do banco do app tem só a permissão de que precisa. Fontes: [OWASP, injeção de SQL](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) e [parametrização](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html).
2. **HTML: o framework escapa; a saída de emergência é exceção.** Prefira texto (`textContent`). `dangerouslySetInnerHTML`, `innerHTML` e equivalentes só com HTML limpo por DOMPurify, com lista curta de marcas, sem mexer depois de limpar e com o DOMPurify atualizado. O que já está salvo também precisa ser limpo. Fonte: [OWASP, XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).
3. **Link e fonte de mídia:** `href` e `src` com valor de fora só com `http:` ou `https:`, conferidos ao salvar e ao mostrar; `javascript:` é recusado. Link externo aberto em outra aba leva `rel="noopener noreferrer"`. Fonte: [OWASP, XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).
4. **CSP como segunda camada**, ajustada ao app, nunca como a única defesa. Fonte: [OWASP, XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).
5. **Servidor que busca URL de fora (SSRF):** se der, não aceite a URL inteira e monte a requisição a partir de uma lista de destinos permitidos. Se precisa aceitar, nesta ordem: só `http`/`https`; resolva o nome e confira **cada IP** contra a faixa permitida, bloqueando loopback, redes privadas, link-local, metadados da nuvem (169.254.169.254) e IPv6 equivalentes; conecte no IP conferido; não siga redirecionamento (ou confira de novo a cada salto); prazo curto e limite de tamanho; e, na rede, só a saída necessária. O que volta da busca também é entrada não confiável. A rota exige login e tem limite de uso. No Node, o `fetch` nativo não conecta num IP conferido por conta própria: é preciso um agente HTTP com resolução de nome própria (ou uma biblioteca feita para isso), conferida pelo teste abaixo. Fonte: [OWASP, SSRF](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).

## O teste que prova (escreva antes, veja falhar)

| Regra | Teste |
|---|---|
| SQL | `ordem=nome;DROP TABLE x` e `ordem=__proto__` caem na ordenação padrão, sem erro de SQL |
| HTML | uma bio com `<img src=x onerror=alert(1)>` é mostrada sem executar |
| Link | `javascript:alert(1)` no campo "site" é recusado ao salvar |
| SSRF | URLs para `127.0.0.1`, `169.254.169.254`, um nome que resolve para IP privado e um redirecionamento para eles são recusadas |

## Checklist

- [ ] Nenhuma concatenação em SQL; identificadores por mapa fixo.
- [ ] HTML de fora como texto ou limpo por DOMPurify, inclusive o já salvo.
- [ ] `href` e `src` só `http`/`https`.
- [ ] CSP como segunda camada.
- [ ] Busca de URL com IP conferido depois de resolver, sem redirecionamento, com prazo e limite.

## Adaptar ao tamanho do projeto

- Sem HTML do usuário: o passo 2 vira "nenhuma saída de emergência no código"; procure-as no PR mesmo assim.
- Sem busca de URL no servidor: o passo 5 não se aplica até a primeira prévia de link, webhook ou importação.
- ORM: as consultas "cruas" dele seguem o passo 1.
