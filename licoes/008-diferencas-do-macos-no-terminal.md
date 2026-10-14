# 008 · Diferenças do macOS no terminal

- **O que aconteceu:** `sed -i` sem argumento falhou, e o comando `timeout` não existia, derrubando encadeamentos com `&&`.
- **Causa:** o `sed` e as ferramentas do macOS diferem das do Linux.
- **Regra:** `sed -i ''` no macOS; sem `timeout`, use um laço com `sleep`; prefira Python ou Node para edições de texto precisas.

**Caso de origem:** [Portfólio pessoal (2026-10)](../casos/2026-10-portfolio-pessoal.md)
