# Prompt de auditoria de referência

Use quando o projeto precisa seguir uma referência (um site, um app, um comportamento). A auditoria é a **Fase A** de uma tarefa; a construção só começa depois que a pessoa aprova os critérios que a auditoria propõe. Método e cuidados em [04](../nucleo/04-referencias-e-engenharia-reversa.md).

```text
Faça uma AUDITORIA SÓ DE LEITURA da referência <URL ou nome> para a tarefa #N. Não altere código do projeto.

1. Ache cada seção pelo TÍTULO EXATO que consta na issue. Se o título não bater com o que encontrou,
   PARE e pergunte, mostrando o que achou. Não implemente nada.
2. Para cada seção que o nosso projeto tem, registre: estrutura, quantidade de itens, ordem, espaçamentos,
   tamanhos de fonte e comportamento. Meça no navegador (estilos calculados e amostras no tempo),
   não de memória.
3. Faça o inventário das ANIMAÇÕES: o que anima, como dispara (entrada na tela, rolagem, hover, toque),
   duração, atraso entre itens e curva, e o que é DESLIGADO em dispositivos de toque.
4. Repita em tela de celular (390 por 844, com toque), pois a estrutura e as animações mudam.
5. Compare com o nosso projeto na mesma largura e liste as diferenças priorizadas (alta, média, baixa),
   cada uma com a evidência.
6. Proponha os CRITÉRIOS DE ACEITE da fase seguinte, mensuráveis, em checklist.
7. Não copie código, imagens, fontes, logos nem textos da referência: estude, meça e descreva.

Entregue um documento (tabela por seção, inventário de animações, diferenças e critérios propostos),
envie na branch, comente na issue e PARE. Responda em português.
```

Ferramentas: para um site público, `curl` e um navegador automatizado. Para um artefato fechado (aplicativo empacotado, binário, Electron, APK), a Skill `reverse-engineer-anything`.
