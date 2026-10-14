# 007 · Servidor de desenvolvimento em erro 500 depois de apagar componentes

- **O que aconteceu:** após apagar e recriar componentes, a página local devolveu 500.
- **Causa:** o servidor ficou com o grafo de módulos antigo.
- **Regra:** depois de **apagar ou renomear** arquivos, reinicie o servidor (`astro dev stop` e subir de novo) antes de concluir que o código está errado.

**Caso de origem:** [Portfólio pessoal (2026-10)](../casos/2026-10-portfolio-pessoal.md)
