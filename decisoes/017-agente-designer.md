# 017 · Agente Designer: UI e UX saem do Frontend

**Data:** 2026-11-20
**Status:** aceita pela pessoa **sem caso real** (exceção à regra de ouro, pedida por ela, como nas decisões [013](013-lead-e-builders-com-codex-e-claude.md) e [015](015-requisitos-e-telas-antes-do-codigo.md)); o que entra aqui vale como proposta até o primeiro projeto com interface feito assim virar caso. Substitui, na [decisão 015](015-requisitos-e-telas-antes-do-codigo.md), a frase "o Frontend cria a identidade e todas as telas": quem cria passa a ser o Designer.
**Caso de origem:** nenhum ainda.

## Contexto

Pela decisão 015, o Frontend desenhava a identidade e todas as telas no Figma e também coordenava as Builders que constroem a interface. Desenhar e construir são trabalhos diferentes, com leituras, skills e checklists diferentes, e o mesmo agente revisava o próprio desenho. A pessoa pediu um agente próprio para UI e UX, que, depois dos requisitos, cria as interfaces e as telas seguindo um padrão com Design System, com harness, skills e contexto, pelo mesmo processo dos outros agentes.

## Decisão

1. **Novo agente, Designer**, na ferramenta Claude Code por padrão, `claude-opus-5-5`, esforço médio (alto na identidade), **sob demanda** (Fases 1 e 2, tela nova ou mudança de tela). **Não tem Builders e nunca escreve código.**
2. **Sempre pede referências antes de criar** (pedido da pessoa em 2026-11-21): o Designer pede, pela Lead, as referências visuais e os formatos desejados (celular, tablet, desktop) e não começa a identidade sem elas; se a pessoa não tem, propõe 2 ou 3 direções para ela escolher. **Ordem: referências → identidade → telas nos formatos desejados**, e **mobile-first** quando há celular (o Frontend também constrói assim).
3. **Padrão de criação "do token à tela"**, em ordem e com a etapa anterior pronta: tokens (duas camadas, variáveis do Figma) → componentes base com variantes e estados → padrões → telas por requisito (com estados, celular e desktop) → fluxo navegável. A identidade (tokens, componentes e padrões) e as telas têm cada uma o seu portão da pessoa (decisão 015, mantida).
4. **O Designer é dono** da identidade, do design system no Figma, do catálogo `processo/telas/design-system.md`, das telas e do registro em `processo/telas/` (capturas e `tokens.json`), por PR numa issue `design`.
5. **O Frontend passa a só construir:** monta o design system do código a partir do `tokens.json` e do catálogo, constrói a interface igual à tela registrada, coordena as suas Builders; lê o Figma, não escreve nele. Dúvida de desenho vai ao Designer pela Lead.
6. **Três skills novas** no plugin `metodo`: `design-system-do-projeto`, `telas-e-fluxos` e `registro-das-telas`; base de conhecimento em `modelos/referencias/designer.md`; harness em `modelos/agentes/designer.md`.
7. **A escrita no Figma continua gatilho de custo** (assento Full); agora é o Designer quem pede.
8. **Limite:** o Designer conta dentro das 9 sessões, como Product e Ops.

**Escolhas da sessão do método** (a pessoa confere ao ler o PR): o nome Designer; a presença sob demanda; o padrão "do token à tela", porque a pessoa pediu "um padrão com design system" sem descrevê-lo (se ela tiver um próprio, ele o substitui); as referências do harness (GOV.UK, NN/g e WCAG, já escolhidas por ela para o Frontend, mais os Design Tokens Community Group e a ajuda do Figma, com os links conferidos); versão maior (7.0.0), porque muda a divisão de papéis do núcleo.

## Consequências

- Quem desenha não é quem constrói nem quem revisa o código; a revisão compara o código com a captura registrada.
- Mais um agente no modo com especialistas, sob demanda (as 9 sessões continuam o teto), e mais uma passagem de mão (Designer → Frontend), que a tabela de `processo/telas/` e o catálogo existem para tornar explícita.
- Projetos que já usam o modo precisam do `designer.md`: o `/metodo:atualizar-projeto` o copia e acrescenta a linha na tabela Ferramenta por papel; o `frontend.md` do projeto não é trocado, e a diferença é listada para a pessoa.
- As skills novas não passaram por teste de pressão com agentes (como as das decisões 009 a 011 fizeram com trabalhadoras); isso fica para o primeiro projeto com interface.
- O que observar no primeiro projeto: se a passagem Designer → Frontend deixou algo por adivinhar; se o Figma e `processo/telas/` divergiram; se os tokens em duas camadas chegaram iguais ao código; quanto a escrita no Figma custou; se o padrão "do token à tela" serviu ou precisa mudar.
- Arquivos que mudam: `modelos/agentes/designer.md`, `modelos/referencias/designer.md` (novos), `modelos/agentes/frontend.md`, `lead.md`, `product.md`; `nucleo/01`, `02`, `03`; as três skills novas; `skills/consultar`, `skills/atualizar-projeto`; `scripts/novo-projeto.sh`, `scripts/verificar.mjs`; `README.md`, `CHANGELOG.md`, `VERSION` (7.0.0).
