---
name: validacao-final
description: Use quando a integradora for fazer a validação final de um PR antes de integrar (o papel de QA), principalmente para julgar se os testes provam o comportamento pedido, ou quando um teste falha "sem motivo" (instável) ou demora demais.
---

# Validação final

**Quem usa:** a integradora, depois do especialista do tema e da Segurança. Verde não basta: os testes precisam provar os critérios de aceite. As regras de testes do método (micro e macro, RED antes de GREEN) estão no `${CLAUDE_PLUGIN_ROOT}/nucleo/03-skills-e-testes.md`.

A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/integradora.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/integradora.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Cada critério de aceite tem um teste que falharia sem o código,** e você confere isso: quebre a lógica numa linha (uma mutação à mão) e veja o teste falhar, numa cópia local, sem enviar nada. Num PR grande, faça isso nos critérios de maior risco, não em todos. Fonte: [Fowler, pirâmide de testes na prática](https://martinfowler.com/articles/practical-test-pyramid.html).
2. **O teste confere comportamento pela interface pública** (entrada, saída, efeito observável). Teste que só confere que funções internas foram chamadas, ou em que ordem, é detector de mudança: devolva para trocar. Fontes: [Google, testes detectores de mudança](https://testing.googleblog.com/2015/01/testing-on-toilet-change-detector-tests.html) e [Google, prefira testar a interface pública](https://testing.googleblog.com/2015/01/testing-on-toilet-prefer-testing-public.html).
3. **Dublês só nas bordas.** Onde dá, a implementação real ou um falso simples. Biblioteca de terceiros não leva mock direto: o código a envolve numa interface do projeto (você pede a mudança ao especialista do tema; não a faz), e o teste usa um falso dessa interface; um teste de integração estreito confere a borda real (o banco num contêiner, o serviço externo simulado pelo contrato). Fontes: [Google, não abuse de mocks](https://testing.googleblog.com/2013/05/testing-on-toilet-dont-overuse-mocks.html), [Google, não faça mock do que não é seu](https://testing.googleblog.com/2020/07/testing-on-toilet-dont-mock-types-you.html) e [Fowler, pirâmide de testes na prática](https://martinfowler.com/articles/practical-test-pyramid.html).
4. **Forma de pirâmide:** muitos testes pequenos, alguns de integração, pouquíssimos de ponta a ponta, só nas jornadas críticas. Teste de ponta a ponta novo precisa dizer por que um menor não basta, e o tempo do CI é anotado na memória do projeto para se ver quando cresce; se o amplo falha e nenhum menor falha, falta o menor. Fontes: [Google, chega de mais testes de ponta a ponta](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html) e [Fowler, pirâmide de testes na prática](https://martinfowler.com/articles/practical-test-pyramid.html).
5. **Teste instável não entra.** Falhou "sem motivo" uma vez: peça a causa (espera fixa, ordem entre testes, dado compartilhado, rede); repetir até passar não é correção. Fonte: [Google, chega de mais testes de ponta a ponta](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html).
6. **Rode você mesma:** suíte completa, tipos e build, e a verificação no navegador quando há tela (`superpowers:verification-before-completion`). Devolva com a lista objetiva, ao especialista do tema; integre só com o "pode integrar" da pessoa.

## Checklist

- [ ] Cada critério de aceite com teste que falha sem o código (conferido por mutação).
- [ ] Comportamento pela interface pública; nenhum detector de mudança.
- [ ] Dublês só nas bordas; nada de mock de biblioteca de terceiros.
- [ ] Pirâmide respeitada; ponta a ponta só em jornada crítica.
- [ ] Nenhum teste instável.
- [ ] Suíte, tipos, build e navegador rodados por você.

## Adaptar ao tamanho do projeto

- Projeto sem back nem dados: os passos 3 e 4 viram "testes de componente e uma jornada no navegador".
- PR só de texto ou de configuração: o passo 1 vira conferir o resultado na tela ou no CI.
