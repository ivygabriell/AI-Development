# Cenários

O método é o mesmo em qualquer projeto; o que muda é **o que significa testar e explorar** em cada tipo. Cada cenário é um arquivo curto, no mesmo formato, que diz o que muda no fluxo base e dá um checklist de início e de entrega.

Em qualquer cenário valem: alvo definido antes de construir ([fluxo](../nucleo/01-fluxo-de-ponta-a-ponta.md)), TDD, uma branch por mudança, a `main` protegida e as Skills do cenário ([skills e testes](../nucleo/03-skills-e-testes.md)).

## Cenários disponíveis

| Cenário | Maturidade | Para quê |
|---|---|---|
| [Site estático ou portfólio](site-estatico.md) | testado em 1 projeto | Sites sem back-end próprio: portfólio, página de apresentação, site institucional, landing page. |
| [Aplicação web full stack](aplicacao-web-full-stack.md) | rascunho | Sistemas com interface, back-end e banco de dados, com login, permissões e dados de usuários. |
| [API ou back-end](api-backend.md) | rascunho | Serviços consumidos por outros sistemas ou aplicativos, em que o contrato importa mais do que a tela. |
| [Aplicativo mobile](aplicativo-mobile.md) | rascunho | Aplicativos para celular, nativos ou multiplataforma, distribuídos por lojas ou de forma interna. |
| [Automação, integração ou pipeline de dados](automacao-e-dados.md) | rascunho | Rotinas que movem ou transformam dados entre sistemas, integrações e automações agendadas. |
| [Infraestrutura e DevOps](infraestrutura-e-devops.md) | rascunho | Infraestrutura como código, pipelines de entrega, ambientes e observabilidade. |
| [Biblioteca ou SDK](biblioteca-e-sdk.md) | rascunho | Código feito para ser usado por outras pessoas desenvolvedoras, publicado como pacote. |
| [Solução com IA (modelos de linguagem)](solucao-com-ia.md) | rascunho | Produtos que usam modelos de linguagem: assistentes, extração, classificação, agentes. |

## Maturidade

Cada cenário tem um selo no topo, para você saber quanto confiar nele:

| Selo | Significa |
|---|---|
| `rascunho` | Escrito a partir da teoria e da experiência de outros contextos; nunca aplicado de ponta a ponta |
| `testado em 1 projeto` | Aplicado em um projeto real, com um caso registrado em [casos](../casos/) |
| `estável` | Aplicado em três ou mais projetos, com ajustes já incorporados |

Um cenário só sobe de selo com um **caso real** que o comprove e que cite o que foi ajustado.

## Como criar um cenário novo

1. Copie [_modelo-cenario.md](_modelo-cenario.md) para `cenarios/<nome-em-minusculas-com-hifens>.md` e comece como `rascunho`.
2. Responda: o que é **micro** aqui (o menor teste que prova uma regra) e o que é **macro** (o sistema inteiro funcionando)?
3. Defina como a integradora **explora**: o equivalente do navegador (cliente HTTP, emulador, ambiente de homologação, painel de métricas).
4. Escreva os critérios de aceite típicos como checklist mensurável (use o [modelo de critérios](../modelos/modelo-criterios-de-aceite.md)).
5. Ajuste o [CI](../modelos/ci-node.yml) para a stack e o nome do job exigido pela proteção da `main`.
6. Liste os pontos quentes e os riscos próprios do tipo e escreva testes-guarda para os piores.
7. Liste o novo cenário na tabela acima e rode `node scripts/verificar.mjs`.
8. Depois do primeiro projeto real, registre um [caso](../casos/_modelo-caso.md), preencha o "Caso de referência" e suba o selo.
