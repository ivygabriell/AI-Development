# 04 · Referências e engenharia reversa

Muitos projetos começam com "quero algo como aquilo": uma seção de um site, um comportamento de um app. Este documento ensina a **estudar a referência com evidência** (medindo, não lembrando), a **replicar o comportamento sem copiar o que não é seu** e a decidir **quando a engenharia reversa de verdade se justifica**.

## O princípio

Você replica **comportamento e estrutura**, com código, textos, imagens e dados **seus**. O estudo da referência produz um registro de achados (o que anima, como dispara, com que valores) e esse registro vira critério de aceite.

> **Não copie** código, imagens, vídeos, fontes, logos ou textos da referência. Estude, meça e reescreva.

## Limites legais e éticos

- **Direitos autorais:** código, marcas, logos, fontes comerciais, fotos e textos pertencem a quem os fez. Use fontes livres, ilustrações e dados **fictícios** (nomes de empresas inventados, nunca logos reais de terceiros).
- **Termos de uso e licenças (EULA):** muitos proíbem engenharia reversa de software. Analisar **software seu**, **licenciado para você** ou, onde a lei permitir, **para interoperar** é uma coisa; contornar proteção, licença ou autenticação é outra, e não se faz.
- **Páginas públicas:** ler o HTML, o CSS e o JavaScript que o navegador recebe de qualquer visitante é estudo; raspar em massa, burlar limites ou ignorar `robots.txt` e termos, não.
- **Dados pessoais** de terceiros que apareçam durante a análise não entram em nenhum arquivo do projeto.
- **Uso comercial** de algo muito parecido com um produto alheio: consulte um profissional de propriedade intelectual do seu país.

## Passo a passo para um site público

Para sites abertos, `curl` e um navegador automatizado bastam. Siga a ordem.

### 1. Ache o alvo pelo título exato

A pessoa citou "Trusted by our clients"? Procure **essa frase** na página. Se achar outra parecida ("Trusted by remarkable global brands"), **é outra seção**: não implemente; mostre o que encontrou e pergunte.

```bash
curl -sL -A "Mozilla/5.0" https://exemplo.com/ -o home.html
python3 - <<'EOF'
html = open('home.html', encoding='utf8').read()
i = html.find('Trusted by our clients')            # o título exato
inicio = html.rfind('<section', 0, i)
print(html[inicio:inicio + 400])                    # a marcação em volta
EOF
```

### 2. Isole a marcação da seção

Recorte do `<section>` até o fechamento. Para ler, troque os `<svg>` por um marcador. Conte os itens (quantidade faz parte da estrutura), anote classes, atributos de dados e o texto.

### 3. Ache o CSS

O CSS pode estar em `<style>` na própria página e em arquivos `link rel="stylesheet"` separados por componente. Baixe todos e procure pelo nome da classe da seção. **Não use expressões regulares complexas sobre CSS grande** (podem travar por retrocesso); percorra o texto contando `{` e `}` e separe as regras uma a uma.

### 4. Ache o JavaScript

Liste as tags `<script src>`, baixe as que importam e procure o nome da classe ou do componente. Em bundles modernos o código é minificado, mas as **primitivas de animação** aparecem: duração, atraso entre itens (*stagger*), curva (*ease*), gatilhos de rolagem (`scrub`, `start`, `once`). Ache também os **ajudantes compartilhados** (por exemplo, a função de revelar texto) e leia a definição deles, não só a chamada.

### 5. Meça no navegador

O que o código diz e o que o navegador mostra podem divergir. Com um navegador automatizado:

- **Estilos calculados** dos elementos nos vários estados (repouso, hover, rolagem).
- **Amostragem no tempo** (valor a cada 200 ms) para provar a duração e a curva de uma animação.
- **Largura do celular** (por exemplo 390 por 844, com toque): a estrutura e as animações mudam, e o que é desligado em toque (cursor, rolagem suave, hover) precisa estar no seu registro.

### 6. Registre os achados

Uma tabela por seção, com a fonte de cada linha:

| Item | Como funciona | Valor | Fonte |
|---|---|---|---|
| Entrada do título | Palavra por palavra, de baixo para cima, uma vez | 1,7 s, curva exponencial de saída | Script do componente |
| Leque dos cartões | Cartões sobrepostos e inclinados; com o mouse na área, alinham | 5 cartões, giros de −9° a 20°, 1 s | CSS do componente |
| Largura do cartão | Fixa no desktop | 40rem | CSS do componente |

### 7. Mapeie para o seu projeto

Troque cores, espaçamentos e tipografia pelos **seus** tokens; mantenha a estrutura, a quantidade e o comportamento. Registre as decisões ("usei o tom X porque a paleta do projeto é Y").

### 8. Feche o ciclo

Compare capturas lado a lado e **confirme com a pessoa** que a seção é a certa (mostre uma captura da referência). Só então implemente.

## Quando usar a engenharia reversa

A Skill `reverse-engineer-anything` (REA) analisa **artefatos fechados**: binários nativos, aplicativos empacotados, código sem fonte, firmware, comportamento em execução. Use quando uma afirmação depende de algo **entregue ao usuário** (um pacote, um executável) e a fonte não está disponível.

| Situação | Ferramenta |
|---|---|
| Site público com HTML, CSS e JS legíveis | `curl` e navegador automatizado (REA não é necessário) |
| Repositório com o código-fonte completo | Ferramentas normais de código; **não** use REA |
| App Electron ou JavaScript empacotado (ASAR) | REA (análise de aplicação JavaScript) |
| APK Android (classes, métodos, declarações) | REA (inspeção do pacote Android) |
| Executável ou biblioteca nativa | REA (abrir o binário, pseudocódigo, referências cruzadas) |
| Assembly .NET | REA (inspeção de artefato gerenciado) |
| Firmware | REA (regiões e extração, com ferramentas de terceiros) |
| Comparar duas versões de um app | REA (diferenças entre versões) |
| Entender o que um app faz em execução (rede, eventos) | REA (observação passiva do navegador ou do Electron já aberto) |

### Como trabalhar com ela

1. **Roteie pelo alvo:** a primeira ferramenta depende do que você tem em mãos (binário, pacote, aplicação aberta). Se a pessoa disser só "meu app", **pergunte qual**.
2. **Comece pelo resumo:** peça a visão geral e use as referências de evidência para ir aos detalhes, em vez de repetir a análise inteira.
3. **Separe observação, inferência e incógnita.** Observação é o que a ferramenta mostrou; inferência é o que você concluiu; incógnita é o que ficou sem resposta. Cite a evidência de cada conclusão e nunca diga que a análise estática "observou a execução".
4. **Mantenha um registro dos achados** ligando cada conclusão à sua evidência, ao limite da busca e ao que sobrou em aberto.
5. **Para investigações grandes:** transforme o pedido em uma lista de perguntas, responda uma de cada vez e, antes de encerrar, revisite a lista marcando cada pergunta como respondida, parcial ou em aberto.
6. **Conexão:** instalar a Skill não registra o servidor da ferramenta. Se as ferramentas não estiverem disponíveis, diagnostique o bloqueio (registro, aprovação do cliente, motor ausente) e **continue com o que for possível** em vez de parar o projeto.

### O que aprendemos

No projeto de origem, a referência era um site público. `curl` mais um navegador automatizado deram tudo (marcação, CSS, scripts e medições), e a engenharia reversa **não acrescentou nada** a isso. Ela é a ferramenta certa para o caso fechado: quando não há fonte para ler.

## Registro final

Entregue o resultado como um documento de auditoria: a tabela de achados, o inventário de animações (incluindo o que desliga em toque), as diferenças em relação ao seu projeto priorizadas e os **critérios de aceite propostos**. É o modelo em [prompt-auditoria-de-referencia.md](../modelos/prompt-auditoria-de-referencia.md). A pessoa aprova os critérios **antes** de qualquer construção.
