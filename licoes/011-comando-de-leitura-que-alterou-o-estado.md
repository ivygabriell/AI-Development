# 011 · Comando de leitura que alterou o estado

- **O que aconteceu:** um `git stash` rodado "só para olhar" guardou alterações não commitadas.
- **Causa:** misturar inspeção com um comando que muda o repositório.
- **Regra:** comandos de inspeção são só de leitura (`git status`, `git diff`, `git log`). Se algo mudar, desfaça e avise na hora.

**Caso de origem:** [Portfólio pessoal (2026-10)](../casos/2026-10-portfolio-pessoal.md)
