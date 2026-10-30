---
name: autenticacao-e-sessao
description: Use quando for implementar ou revisar login, cadastro, regras de senha, armazenamento de senha (hash), recuperação ou troca de senha, bloqueio por tentativas, segundo fator, passkeys, cookie de sessão, tempo de sessão ou logout.
---

# Autenticação e sessão

**Maturidade:** rascunho (sem caso real ainda). **Quem usa:** a Segurança ao mapear riscos e revisar, e as trabalhadoras do back e do front quando constroem ou corrigem autenticação (a especificação do especialista dono da pasta diz quando).

A régua é a NIST SP 800-63B-4 (2025), que mudou números que muita gente ainda usa. A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/seguranca.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/seguranca.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Comprimento, não composição.** Senha como único fator: **mínimo de 15 caracteres**; só com segundo fator: mínimo de 8. Aceite pelo menos 64, com espaço e Unicode. Nada de exigir maiúscula, número ou símbolo, nada de troca periódica (só quando há sinal de vazamento), nada de dica nem pergunta secreta. Fonte: [NIST 800-63B-4, 3.1.1](https://pages.nist.gov/800-63-4/sp800-63b.html).
2. **Senha vazada é recusada:** confira a senha nova contra uma lista de senhas vazadas, comuns e do contexto (o nome do serviço, o e-mail), e diga o motivo da recusa. Fonte: [NIST 800-63B-4, 3.1.1](https://pages.nist.gov/800-63-4/sp800-63b.html).
3. **Gerenciador de senhas sempre:** colar e preencher automaticamente permitidos (`autocomplete="current-password"` e `"new-password"`), com "mostrar senha". Fonte: [NIST 800-63B-4, 3.1.1](https://pages.nist.gov/800-63-4/sp800-63b.html).
4. **Hash:** Argon2id com no mínimo m=19 MiB, t=2, p=1 (ou uma das combinações equivalentes); scrypt se não houver Argon2id; bcrypt só em sistema legado, com custo 10 ou mais e senha de até 72 bytes. Guarde o algoritmo e os parâmetros com o hash e refaça o hash antigo no próximo login. Fonte: [OWASP, armazenamento de senhas](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
5. **Não entregue quem tem conta:** login, recuperação e cadastro dão a mesma mensagem, o mesmo código e o mesmo tempo de resposta, exista ou não a conta. Fonte: [OWASP, autenticação](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).
6. **Limite de tentativas por conta, não por IP** (o atacante troca de IP; IP bloqueado derruba escritório inteiro), com espera crescente e no máximo 100 erros seguidos antes de bloquear o fator. A recuperação desbloqueia, para o bloqueio não virar arma. Um limite por IP em volume alto (muitas contas tentadas do mesmo IP) pode ser camada extra, com atraso ou desafio, sem bloquear. Fontes: [NIST 800-63B-4, 3.2.2](https://pages.nist.gov/800-63-4/sp800-63b.html) e [OWASP, autenticação](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).
7. **Ação sensível pede de novo a credencial:** trocar senha ou e-mail exige a senha atual (ou passkey); depois da troca, as outras sessões caem. Ofereça pelo menos uma opção resistente a phishing (passkey); código por SMS ou e-mail não é. Fontes: [OWASP, autenticação](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) e [NIST 800-63B-4, 3.2.5](https://pages.nist.gov/800-63-4/sp800-63b.html).
8. **Sessão:** identificador aleatório (64 bits de entropia ou mais), trocado no login e em toda mudança de privilégio, só em cookie; cookie com `Secure`, `HttpOnly`, `SameSite=Lax` ou `Strict`, prefixo `__Host-`, sem `Domain`; tempo sem uso e tempo total conferidos **no servidor** (referência NIST para AAL2: até 1 h sem uso e 24 h no total); sair invalida no servidor. Com cookie, proteja contra CSRF nas ações que mudam algo: o `SameSite` ajuda, mas não basta sozinho; some um token por formulário ou a conferência do cabeçalho `Origin`. Fontes: [OWASP, sessão](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) e [NIST 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html).

## O teste que prova (escreva antes, veja falhar)

| Regra | Teste |
|---|---|
| Comprimento | senha de 14 caracteres sem segundo fator é recusada; de 15 só com letras minúsculas é aceita; de 64 com espaço é aceita |
| Vazada | uma senha da lista é recusada com o motivo |
| Enumeração | e-mail inexistente e senha errada dão a mesma resposta e o mesmo código |
| Tentativas | erros seguidos na mesma conta, de IPs diferentes, ativam o limite |
| Sessão | o identificador muda no login; depois de sair, o cookie antigo não vale; passado o tempo sem uso, o servidor recusa |
| Troca de senha | sem a senha atual é recusada; depois dela, outra sessão aberta cai |

## Checklist

- [ ] 15 caracteres (ou 8 com segundo fator), até 64, sem regra de composição nem troca periódica.
- [ ] Lista de senhas vazadas; colar e gerenciador permitidos.
- [ ] Argon2id com os parâmetros mínimos; algoritmo guardado; atualização no login.
- [ ] Mesma resposta para conta inexistente; limite por conta.
- [ ] Senha atual para trocar senha e e-mail; opção resistente a phishing.
- [ ] Sessão trocada no login, cookie protegido, tempos no servidor, logout no servidor.

## Adaptar ao tamanho do projeto

- Login só por provedor externo (Google, GitHub) ou por link mágico: os passos 1 a 4 saem; os passos 5, 7 e 8 continuam.
- Projeto pequeno sem passkey ainda: diga no mapa de riscos e ofereça segundo fator por aplicativo autenticador como passo seguinte.
- Framework com autenticação pronta: confira a configuração dele contra esta lista, em vez de confiar no padrão.
