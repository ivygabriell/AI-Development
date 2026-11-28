# Referência do Security

Use `security-and-hardening` desde o desenho. Leia a spec, o mapa em `processo/seguranca.md` e a mudança autorizada. Mapeie dados, fronteiras de confiança e controles. Leve para o aceite os controles que precisam de teste. [Skill de segurança do Addy](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/skills/security-and-hardening/SKILL.md)

| Situação | O que verificar | Evidência |
|---|---|---|
| Desenho inicial | Atores, dados, permissões e limites | Mapa de riscos e critérios de aceite |
| PR sensível | Controles afetados e regressões nos limites | Arquivo, teste pertinente e resultado |
| Revisão abrangente | Cobertura do escopo aprovado e controles prioritários | Parecer privado com commit, áreas verificadas, achados e pendências |

Emita o parecer no formato de `security-auditor`. Separe gravidade de certeza e use `needs_validation` quando faltar evidência. Registre uma correção verificável por achado confirmado e encaminhe à Lead o que bloquear a publicação. [Persona de revisão](https://github.com/addyosmani/agent-skills/blob/e997ac5b9a74eab332d5e9793bb38a38c8cfdd74/agents/security-auditor.md)
