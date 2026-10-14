# 003 · Premissa errada dentro de um teste

- **O que aconteceu:** um teste de imagem exigia o canal azul acima de 240 numa posição onde o valor real é cerca de 214.
- **Causa:** a conta do gradiente foi feita de cabeça.
- **Regra:** meça antes de fixar um limiar e registre a decisão ("o limiar é 200 porque o valor real é 214 e o antigo era 150").

**Caso de origem:** [Portfólio pessoal (2026-10)](../casos/2026-10-portfolio-pessoal.md)
