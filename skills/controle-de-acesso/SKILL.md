---
name: controle-de-acesso
description: Use quando for implementar ou revisar quem pode ver ou mudar o quê (rota por id, painel de administração, papéis, dados de outra pessoa ou de outra empresa, arquivos e links de download), ou quando a proteção de uma ação está só na tela.
---

# Controle de acesso

**Quem usa:** a Segurança ao mapear riscos e revisar, e as trabalhadoras do back e do front quando constroem ou corrigem rotas e telas com permissão.

Estar logado não é ter permissão. A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/seguranca.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/seguranca.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Negar por padrão, num lugar só.** Toda rota passa por uma conferência central de permissão; a rota nova sem regra fica negada, não aberta. Fonte: [OWASP, autorização](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).
2. **Conferir o objeto, não só o tipo.** Rota com id (`/faturas/:id`) confere se aquele objeto é de quem pede, de preferência na própria consulta (`WHERE id = $1 AND dono_id = $2`). Em sistema com várias empresas, toda consulta leva a empresa. Id aleatório ajuda, mas não substitui a conferência. Fonte: [OWASP, autorização](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).
3. **A tela não protege.** Esconder o botão é conforto; a rota confere o papel no servidor, lido da sessão ou do banco, nunca de um campo que o cliente manda. Fonte: [OWASP, autorização](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).
4. **Menor permissão:** cada papel tem só o que precisa; o administrativo é separado e registrado (quem fez o quê, quando). Fonte: [OWASP, autorização](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).
5. **Arquivos também:** armazenamento privado; o download passa pela conferência do passo 2 e entrega um link assinado de curta duração; o nome do arquivo não é previsível. Arquivo que **já** esteve público em produção: confira os registros de acesso; acesso de fora com dado pessoal segue `metodo:incidente-com-dados-pessoais`. Fonte: [OWASP, autorização](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).
6. **Falhar seguro:** a negação não revela detalhe interno nem se o objeto existe; o contrato da API diz se é 403 ou 404 (`metodo:api-conforme-contrato`, passo 6). Fonte: [OWASP, autorização](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).
7. **Na revisão, use os requisitos verificáveis do ASVS 5.0.0** na parte de autorização, no nível que o mapa de riscos definiu para o projeto. Fonte: [OWASP ASVS](https://asvs.owasp.org/).

## O teste que prova (escreva antes, veja falhar)

| Regra | Teste |
|---|---|
| Objeto alheio | o usuário A pede a fatura do usuário B e recebe a negação do contrato |
| Papel | usuário comum chama a rota administrativa direto (sem a tela) e é negado |
| Padrão | uma rota nova sem regra declarada é negada |
| Arquivo | o link antigo expira; o arquivo de outra pessoa não é entregue |

## Checklist

- [ ] Conferência central, negando por padrão.
- [ ] Objeto conferido em toda rota com id (e a empresa, se houver várias).
- [ ] Papel conferido no servidor; nada decidido pela tela.
- [ ] Administração separada e registrada.
- [ ] Arquivos privados, com link assinado curto.
- [ ] Teste de acesso ao objeto alheio e à rota administrativa.

## Adaptar ao tamanho do projeto

- Um só tipo de usuário, sem dados de outros: os passos 2 e 5 continuam (a pessoa só vê o que é dela); os papéis do passo 4 esperam.
- Várias empresas no mesmo banco: o passo 2 vira regra de toda consulta; considere a política de linha do banco como segunda camada (decisão da Arquitetura).
