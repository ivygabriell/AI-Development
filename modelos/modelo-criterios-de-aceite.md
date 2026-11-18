# Modelo de critérios de aceite

Critérios de aceite são o **contrato** entre quem pede, quem constrói e quem valida. Cada um deve ser **observável e mensurável**: dois avaliadores diferentes chegam ao mesmo "sim" ou "não". Copie para a issue e preencha.

## Como escrever bem

- Em vez de "ficar bonito no celular": "sem rolagem horizontal em 360, 390 e 430 px".
- Em vez de "animar suavemente": "a opacidade vai de 0 a 1 em 2 s, com atraso de 0,1 s entre itens".
- Em vez de "rápido": "desempenho do Lighthouse mobile ≥ 95".
- Cite a **referência** (a seção, a captura, o documento) em cada critério que dependa dela.
- Diga o que **não** muda ("o desktop em 1440 px fica idêntico").

## Gabarito

### Funcional
- [ ] O que o usuário consegue fazer (um critério por comportamento)
- [ ] O que acontece nos casos de erro e nos vazios

### Estrutura e conteúdo
- [ ] Quantidade e ordem dos itens
- [ ] Textos nos idiomas combinados (mesmas chaves em todos)

### Visual e movimento
- [ ] Medidas e tokens (cores, espaçamentos, tamanhos) iguais aos do projeto
- [ ] Cada animação: gatilho, duração, curva e o que acontece no celular e com movimento reduzido

### Qualidade
- [ ] Suíte completa, tipos e build verdes; CI verde
- [ ] Desempenho e acessibilidade nas metas combinadas
- [ ] Sem erros no console e sem rolagem horizontal
- [ ] Sem regressão nas outras áreas (liste quais)

### Segurança e dados
- [ ] Nenhum dado pessoal fora dos arquivos de conteúdo
- [ ] Dados fictícios marcados e protegidos por trava de publicação

### Fora de escopo
- Liste o que **não** faz parte desta entrega, para ninguém supor.
