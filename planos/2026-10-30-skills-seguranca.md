# Skills da Segurança: plano

**Objetivo:** o agente Segurança ganha quatro skills no plugin `metodo`, tiradas da leitura das referências do seu harness, e uma base de conhecimento. A Segurança não tem trabalhadoras: as skills servem a ela no mapa de riscos e na revisão, e às trabalhadoras do back e do front quando corrigem o que ela entrega. Tudo em `rascunho`, pelo mesmo processo da [decisão 009](../decisoes/009-skills-por-agente.md).

**Combinado com a pessoa (2026-10-30):** "pode seguir criando as outras" (Segurança, Arquitetura, Produto e Integradora, um por vez). A revisão das mudanças pendentes continua com `security-review`, a segurança do CI com `metodo:ci-seguro`.

## Tarefas

- [x] **Leitura:** NIST SP 800-63B-4 (senhas, tentativas, resistência a phishing, tempos de sessão), OWASP Cheat Sheets (autenticação, armazenamento de senhas, sessão, autorização, injeção de SQL, parametrização, XSS, SSRF), OWASP ASVS (versão 5.0.0) e a Resolução CD/ANPD nº 15/2024 (critérios, prazos, conteúdo do aviso, registro). PortSwigger, GitHub Security Lab e Trail of Bits ficaram apontados na base para casos específicos. Links conferidos.
- [x] **Verificações antes (vistas falhar):** o verificador confere também a base, as quatro skills, a parte 5 do harness da Segurança e que o back e o front apontam para as skills dela. 39 falhas antes do conteúdo.
- [x] **Linha de base (RED):** uma agente de Segurança sem as skills revisou login e cadastro, controle de acesso, entradas de fora e um vazamento de 12 mil clientes. Acertou quase tudo das OWASP. Falhas observadas: mínimo de 8 caracteres (a NIST 800-63B-4 pede 15 quando a senha é o único fator); hash sem os parâmetros do Argon2id; duvidou do prazo em dobro para agente de pequeno porte, que a Resolução nº 15/2024 prevê; não citou o registro de 5 anos nem o critério de dados de idosos; agiu como se decidisse e executasse a comunicação e a troca de senhas, que são da pessoa e de quem corrige.
- [x] **Skills e base:** `skills/autenticacao-e-sessao/`, `skills/controle-de-acesso/`, `skills/entrada-nao-confiavel/`, `skills/incidente-com-dados-pessoais/` e `modelos/referencias/seguranca.md`.
- [x] **Harnesses (Segurança, Back e Dados, Design e Front), `consultar`, mapa do `03`, README, caso, `CHANGELOG.md` e `VERSION` (2.10.0).**
- [x] **Teste com as skills (GREEN):** a mesma agente, com as skills, pediu 15 caracteres, deu os parâmetros do Argon2id, aplicou o prazo em dobro com a ressalva, citou o registro de 5 anos e passou a subir à pessoa as decisões (comunicar, forçar a troca de senhas, confirmar o porte), entregando as correções ao especialista dono da pasta.
- [x] **Ajustes (REFACTOR), do que ela apontou:** senha ou hash vazado vira proposta de invalidar sessões e forçar a troca; procurar o mesmo problema em outros lugares; contagem dos dias úteis e porte confirmados pela pessoa; arquivo que já esteve público passa pela conferência de acesso; limite por IP só como camada extra; proteção CSRF além do `SameSite`; `rel="noopener noreferrer"`; rota de prévia com login e limite, e o agente HTTP próprio no Node.
- [ ] `node scripts/verificar.mjs` verde; PR com o modelo preenchido, só com a confirmação da pessoa.
