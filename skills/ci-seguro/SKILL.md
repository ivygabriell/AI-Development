---
name: ci-seguro
description: Use quando for escrever ou revisar um workflow do GitHub Actions (CI, deploy, comentário automático no PR, release), quando o repositório aceita PRs de fora ou vai virar público, quando um workflow usa segredos, pull_request_target ou workflow_run, ou quando o deploy usa uma chave de acesso fixa.
---

# CI seguro no GitHub Actions

**Maturidade:** rascunho (sem caso real ainda). **Quem usa:** a trabalhadora do DevOps ao construir e o especialista de DevOps ao revisar; a Segurança revisa os PRs de CI pelo mapa de riscos.

O CI roda código de quem abriu o PR. Cada workflow recebe só a permissão de que precisa, e o código de fora nunca roda onde há escrita ou segredo. A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/devops.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/devops.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Permissão mínima:** `permissions: contents: read` no topo de todo workflow, e cada job pede só o que usa (`pull-requests: write`, `id-token: write`). No repositório, o token padrão fica em "somente leitura". Fonte: [GitHub, segurança do Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions).
2. **PR de fora roda em `pull_request`**, sem segredo nem escrita. `pull_request_target` só quando precisa de escrita ou segredo, e então **nunca** com checkout e execução do código do PR (build, testes, `npm install`, scripts). Mesmo no `pull_request`, instale as dependências sem rodar os scripts delas (`npm ci --ignore-scripts`, quando o projeto permitir). No repositório público, exija aprovação antes de rodar o workflow de quem contribui pela primeira vez (configuração das Actions). Fonte: [GitHub Security Lab, pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/).
3. **O que precisa de escrita sobre um PR** (comentar, rotular) fica num segundo workflow (`workflow_run`), que só lê o artefato do primeiro como dado: valida cada valor (o número do PR é inteiro), extrai fora da pasta do workspace (por exemplo, em `runner.temp`) e nunca executa nada que veio nele. Ele roda com o workflow da branch padrão: confira `github.event.workflow_run.event == 'pull_request'` e a conclusão antes de agir; o número do PR de um fork vem do artefato validado. Fonte: [GitHub Security Lab, pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/).
4. **`persist-credentials: false` em todo `actions/checkout`**, inclusive no deploy. Rótulo "seguro para testar" é paliativo: um commit novo depois do rótulo passa. Fonte: [GitHub Security Lab, pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/).
5. **Texto vindo de fora** (título, corpo e branch do PR, mensagem de commit, nome de arquivo) entra no `run` por variável de ambiente, entre aspas, nunca como `${{ github.event... }}` dentro do script. Fonte: [GitHub, segurança do Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions).
6. **Ação de terceiro fixada pelo SHA completo** do repositório original (com a versão num comentário), atualizada pelo Dependabot de versões. Fonte: [GitHub, segurança do Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions).
7. **Nuvem por OIDC**, com credencial curta e a confiança limitada ao repositório, à branch e ao ambiente do deploy; o ambiente de produção pede aprovação. Depois de migrar, apague a chave fixa no provedor e no GitHub; se ela pode ter aparecido em log ou histórico, trate-a como vazada. Antes de tornar o repositório público, troque toda chave que já passou por ele e varra o histórico em busca de segredos. Fonte: [GitHub, segurança do Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions).
8. **Quem muda workflow passa por revisão:** `CODEOWNERS` em `.github/workflows`. Nada de runner próprio em repositório público. Fonte: [GitHub, segurança do Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions).

## O teste que prova (ensaie antes, veja falhar)

| Regra | Ensaio |
|---|---|
| PR de fora | um PR de uma conta sem acesso roda o CI sem segredos (um passo que lê o segredo recebe vazio) |
| Injeção | um PR com título `"; echo INJETADO; "` não executa o texto |
| Escrita isolada | o comentário chega ao PR sem que o workflow com escrita rode código do PR |
| OIDC | o log do provedor mostra credencial temporária, e a chave antiga não funciona mais |

## Checklist

- [ ] `contents: read` no topo; permissão extra só no job que usa.
- [ ] PR de fora em `pull_request`; nada do PR executado com escrita ou segredo.
- [ ] Escrita sobre o PR em `workflow_run`, com o artefato validado e fora do workspace.
- [ ] `persist-credentials: false` em todo checkout.
- [ ] Texto de fora só por variável de ambiente.
- [ ] Ações fixadas por SHA, com Dependabot.
- [ ] OIDC no deploy; chave fixa apagada; produção com aprovação.
- [ ] `CODEOWNERS` nos workflows.

## Adaptar ao tamanho do projeto

- Repositório privado, sem PRs de fora: os passos 2 a 4 pesam menos, mas os passos 1, 5, 6 e 7 continuam (uma ação comprometida ou uma chave vazada não dependem de fork).
- Sem deploy pelo CI: o passo 7 não se aplica.
- Provedor sem OIDC: segredo com o menor escopo possível, só no ambiente de produção, com troca periódica; diga isso no PR.
