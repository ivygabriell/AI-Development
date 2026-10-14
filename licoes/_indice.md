# Índice de lições

<!-- Gerado por scripts/gerar-indice-licoes.mjs. Não edite à mão: edite a lição e rode o script. -->

Cada lição é um arquivo `NNN-slug.md` com **o que aconteceu**, **a causa** e **a regra**. Para acrescentar uma, copie o formato de qualquer lição existente, use o próximo número e rode `node scripts/gerar-indice-licoes.mjs`.

| # | Lição | Regra que ficou |
|---|---|---|
| 001 | [Implementar a seção errada](001-implementar-a-secao-errada.md) | achar a seção pelo título exato; se não bater, parar e perguntar com uma captura da referência antes de construir (Fase 1 do fluxo). |
| 002 | [Dizer "pronto" olhando só os testes](002-dizer-pronto-olhando-so-os-testes.md) | critérios de aceite escritos a partir da referência; a integradora explora no navegador e compara com o pedido (princípio 2). |
| 003 | [Premissa errada dentro de um teste](003-premissa-errada-dentro-de-um-teste.md) | meça antes de fixar um limiar e registre a decisão ("o limiar é 200 porque o valor real é 214 e o antigo era 150"). |
| 004 | [Mídia pesada derrubou o desempenho](004-midia-pesada-derrubou-o-desempenho.md) | capa como <picture> leve no HTML (com prioridade alta); vídeo só depois do carregamento ou da primeira interação; capas pequenas; medir o Lighthous... |
| 005 | [Efeito de mola expôs o fundo do botão](005-efeito-de-mola-expos-fundo-do-botao.md) | conferir quadro a quadro (capturas em sequência) qualquer animação de preenchimento; no estado final o elemento precisa cobrir tudo. |
| 006 | [Expressão regular que travou](006-expressao-regular-que-travou.md) | para CSS, percorra o texto contando { e } e separe as regras; use regex só em trechos pequenos. |
| 007 | [Servidor de desenvolvimento em erro 500 depois de apagar componentes](007-servidor-dev-erro-500-apos-apagar-componentes.md) | depois de apagar ou renomear arquivos, reinicie o servidor (astro dev stop e subir de novo) antes de concluir que o código está errado. |
| 008 | [Diferenças do macOS no terminal](008-diferencas-do-macos-no-terminal.md) | sed -i '' no macOS; sem timeout, use um laço com sleep; prefira Python ou Node para edições de texto precisas. |
| 009 | [Ferramenta temporária desapareceu](009-ferramenta-temporaria-desapareceu.md) | guarde scripts de verificação em uma pasta própria e reinstalável; reinstalar leva um minuto. |
| 010 | [Subcomando inexistente tratado como pergunta](010-subcomando-inexistente-tratado-como-pergunta.md) | na dúvida, --help primeiro; nunca invente um subcomando. |
| 011 | [Comando de leitura que alterou o estado](011-comando-de-leitura-que-alterou-o-estado.md) | comandos de inspeção são só de leitura (git status, git diff, git log). |
| 012 | [Dado pessoal em repositório público](012-dado-pessoal-em-repositorio-publico.md) | higiene de dados antes do primeiro push (veja [05](../nucleo/05-git-github-e-ci.md)); testes-guarda procuram no resultado gerado; documentos usam e... |
| 013 | [Limpeza que poderia apagar trabalho em andamento](013-limpeza-que-poderia-apagar-trabalho-em-andamento.md) | listar primeiro o que existe e o que será perdido, dar as opções (com backup, sem as ativas, tudo) e só apagar depois da escolha; nunca encerrar pr... |
| 014 | [Ordem das seções versus "não altere a estrutura"](014-ordem-das-secoes-versus-nao-alterar-estrutura.md) | toda decisão que desvia do pedido ou do plano é registrada como ruling (o que decidi, por quê, quanto custa se estiver errada) e aparece na mensage... |
| 015 | [Pedido ambíguo respondido com um palpite](015-pedido-ambiguo-respondido-com-um-palpite.md) | quando há duas leituras plausíveis, mostre as duas (um croqui em texto) e peça a escolha antes de mexer; se a pessoa mandar uma imagem com marcaçõe... |
| 016 | [Não reproduzir e mexer mesmo assim](016-nao-reproduzir-e-mexer-mesmo-assim.md) | (depuração sistemática) sem reproduzir, não há correção. |
| 017 | [Apagar a branch remota por hábito](017-apagar-a-branch-remota-por-habito.md) | as branches integradas ficam no GitHub; integre com gh pr merge N --merge, sem --delete-branch. |
| 018 | [Worktree removida, pasta que sobra](018-worktree-removida-pasta-que-sobra.md) | depois do worktree remove, confira git worktree list e olhe o que sobrou na pasta antes de apagá-la (só depois de a branch estar integrada e enviad... |
