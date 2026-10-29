---
name: formularios-e-erros
description: Use quando for implementar ou revisar um formulário (cadastro, login, checkout, busca com filtros, formulário em etapas), a validação dos campos, as mensagens de erro, o resumo de erros, ou a resposta de erro de validação do back (422) na tela.
---

# Formulários e erros

**Maturidade:** rascunho (sem caso real ainda). **Quem usa:** as trabalhadoras do front ao construir e o especialista de Design e Front ao revisar.

Padrão do método, decidido pela pessoa: **o erro de campo aparece ao avançar ou enviar**, como no GOV.UK, não ao sair do campo nem enquanto a pessoa digita. A base de conhecimento do tema fica em `${CLAUDE_PLUGIN_ROOT}/modelos/referencias/design-e-front.md`, e o harness, em `${CLAUDE_PLUGIN_ROOT}/modelos/agentes/design-e-front.md`. No Codex, se `${CLAUDE_PLUGIN_ROOT}` aparecer sem ser trocado por um caminho, a cópia do método é a pasta dois níveis acima deste `SKILL.md`.

## Passo a passo

1. **Valide ao avançar ou enviar.** A exceção é um campo complexo em que a resposta na hora ajuda (força da senha, nome de usuário disponível), e ela não bloqueia o envio. O back valida sempre; a validação na tela usa as mesmas regras e só poupa uma ida ao servidor. Fonte: [GOV.UK, validação](https://design-system.service.gov.uk/patterns/validation/).
2. **Aceite o jeito da pessoa.** Antes de validar, tire espaços nas pontas de todo campo e espaços, pontos, hífens e parênteses de números e códigos (CPF, CEP, telefone, cartão). Recuse só o que não pode estar certo, o ambíguo e o obrigatório vazio. Fonte: [GOV.UK, validação](https://design-system.service.gov.uk/patterns/validation/).
3. **Com erro, nesta ordem:** mantenha tudo o que foi digitado; ponha "Erro: " no início do título da página (`document.title`); mostre o resumo de erros no topo do formulário e mova o foco para ele; mostre a mensagem ao lado de cada campo com erro. Use `novalidate` no formulário e não use o atributo `required`. Fonte: [GOV.UK, validação](https://design-system.service.gov.uk/patterns/validation/).
4. **Resumo de erros sempre, mesmo com um erro só:** título ("Há um problema"), um link por erro que leva ao campo (no grupo de campos, ao primeiro com erro; em opções, à primeira opção) e o mesmo texto da mensagem do campo. O contêiner do resumo recebe o foco (`tabindex="-1"`), e o `role="alert"` fica num elemento de dentro dele (por exemplo, o título), não na raiz. Erro de data inteira (31/02) liga-se ao primeiro campo do grupo; erro do back para um campo que a tela não tem aparece só no resumo. Fonte: [GOV.UK, resumo de erros](https://design-system.service.gov.uk/components/error-summary/).
5. **Mensagem do campo:** depois do rótulo e da dica, ligada ao campo por `aria-describedby`, com o prefixo "Erro:" visível só para o leitor de tela e `aria-invalid` no campo. Erro com cor, ícone e texto, nunca só cor nem só uma dica ao passar o mouse. Fontes: [GOV.UK, mensagem de erro](https://design-system.service.gov.uk/components/error-message/) e [NN/g, erros em formulários](https://www.nngroup.com/articles/errors-forms-design-guidelines/).
6. **O texto diz o que deu errado e como corrigir, com as palavras da pergunta.** Campo vazio: instrução ("Digite seu CPF"). Campo errado: o que está errado ("O CPF deve ter 11 números", "A data de nascimento deve estar no passado", "Digite o mês entre 1 e 12"). Sem "válido", "inválido", "obrigatório", "por favor", "ops". Num grupo (dia, mês, ano), diga qual parte falta ou está errada. Mensagens que vêm do back seguem a mesma regra; se não seguem, avise o especialista. Fonte: [GOV.UK, mensagem de erro](https://design-system.service.gov.uk/components/error-message/).
7. **Erro de validação do back (422):** cada erro vai para o seu campo e para o resumo, pelos passos 3 a 5; num formulário em etapas, volte à etapa do primeiro campo com erro na ordem do formulário (não na ordem em que o back listou) e mostre ali só os erros daquela etapa. Elegibilidade, permissão e falha do serviço (403, 5xx, rede) não são erro de campo: mensagem do problema do serviço, sem apagar o que foi digitado (`metodo:estados-da-tela`). Fonte: [GOV.UK, mensagem de erro](https://design-system.service.gov.uk/components/error-message/).
8. **Não peça de novo o que a pessoa já deu** no mesmo processo (preencha ou mostre para escolher), e no login deixe colar a senha e usar o gerenciador de senhas (`autocomplete` certo, sem bloquear colar). Fontes: [WCAG 3.3.7](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html) e [WCAG 3.3.8](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html).

## O teste que prova (escreva antes, veja falhar)

| Regra | Teste |
|---|---|
| Hora da validação | sair de um campo vazio não mostra erro; enviar mostra |
| Resumo e foco | ao enviar com erro, o foco está no resumo, o título começa com "Erro: " e cada link leva ao campo |
| Mesmo texto | a mensagem do campo e a do resumo são iguais |
| Leitor de tela | o campo com erro tem `aria-invalid` e `aria-describedby` apontando para a mensagem com "Erro:" |
| Jeito da pessoa | CPF com pontos e hífen e e-mail com espaço no fim passam |
| 422 do back | cada erro aparece no campo certo e no resumo, na etapa certa, sem perder o digitado |

## Checklist

- [ ] Validação ao avançar ou enviar; o back sempre valida.
- [ ] Espaços e separadores tirados antes de validar.
- [ ] "Erro: " no título, resumo com foco e links, mensagem em cada campo, digitado mantido.
- [ ] Mensagens específicas, sem "válido", "inválido" e "obrigatório".
- [ ] `aria-invalid`, `aria-describedby` e "Erro:" para o leitor de tela; erro não só por cor.
- [ ] 422 no campo certo; falha do serviço fora do campo.
- [ ] Nada pedido duas vezes; senha pode ser colada.

## Adaptar ao tamanho do projeto

- Formulário de um campo só (busca, newsletter): o resumo pode ser a própria mensagem do campo com o foco nele; o "Erro: " no título continua.
- Projeto com biblioteca de formulários: ela pode fazer o trabalho, desde que a validação ao sair do campo esteja desligada e os passos 3 a 6 continuem valendo.
- Interface em outra língua: traduza o prefixo "Erro:" e o título do resumo.
