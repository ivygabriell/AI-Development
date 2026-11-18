# Modelo de requisitos

Gabarito para `processo/requisitos.md` (Fase 2, antes da identidade, das telas e da spec). Quem escreve é o Product, no papel de engenheiro de requisitos ou PO; sem o modo com especialistas, a Lead. Um requisito é **descrito**, não desenhado: a tela vem depois, ligada a ele. A pessoa aprova a lista, os pesos e a ordem.

## Como escrever bem

- Um requisito, um comportamento que alguém usa. "Tela de login bonita" não é requisito; "quem tem conta entra com e-mail e senha e cai no painel" é.
- Cada regra e cada erro escritos, sem "tratar os erros": diga qual erro e o que acontece.
- Critérios de aceite pelo modelo de critérios de aceite do método (skill `metodo:consultar`): dois avaliadores chegam ao mesmo "sim" ou "não".
- O peso é uma estimativa com o motivo, não uma promessa. A prioridade proposta é do Product; **a ordem final é da pessoa**.

## Gabarito

```markdown
# Requisitos

| ID | Requisito | Valor | Esforço | Risco | Prioridade proposta |
|---|---|---|---|---|---|
| R-01 | Entrar com e-mail e senha | alto | M | alto | 1 |

## R-01 · Entrar com e-mail e senha

- **História:** como <quem usa>, quero <o quê>, para <por quê>.
- **Regras de negócio:** cada regra numa linha (quem pode, limites, prazos, cálculos).
- **Casos de erro:** cada erro e o que a pessoa vê (dado inválido, sem permissão, serviço fora do ar, lista vazia).
- **Critérios de aceite:**
  - [ ] observável e medível
- **Dependências:** os requisitos que precisam vir antes (R-xx), ou "nenhuma".
- **Telas:** os frames do Figma ligados a ele (o nome do frame e o registro em `processo/telas/`), ou "sem interface".
- **Peso:**
  - Valor (alto, médio, baixo): o quanto importa para quem usa e para o negócio, e por quê.
  - Esforço (P, M, G): o tamanho da construção e a cota de tokens que deve consumir, e por quê.
  - Risco (alto, médio, baixo): segurança, dados pessoais ou incerteza técnica, ligado ao mapa de riscos.
- **Prioridade proposta:** a posição e o motivo (valor alto com esforço pequeno vem primeiro; risco alto cedo, para aprender antes de construir o resto).
- **Fora do escopo:** o que este requisito não cobre.
```

Cada issue cita os requisitos que atende (campo "Requisitos"); cada PR diz quais atendeu. Requisito novo ou mudado no meio do projeto passa pela pessoa (gatilho "muda o que será construído").
