# Biblioteca ou SDK

**Maturidade:** rascunho

## Quando usar

Código feito para ser usado por outras pessoas desenvolvedoras, publicado como pacote.

## O que muda no fluxo

O método base ([nucleo/](../nucleo/01-fluxo-de-ponta-a-ponta.md)) continua valendo. O que muda é o que significa testar e explorar neste tipo de projeto:

- **Micro:** testes unitários de cada função pública e de casos de borda.
- **Macro:** testes de compatibilidade (versões da linguagem e das dependências), testes de exemplo (o código do README roda), verificação do pacote publicado.
- **Explorar:** usar a biblioteca num projeto de exemplo como um usuário novo; ler a documentação do ponto de vista de quem não conhece o código.
- **Aceite típico:** API pública estável e documentada, versionamento semântico, registro de mudanças.
- **CI:** matriz de versões, publicação só por etiqueta de versão.
- **Riscos:** quebrar quem já usa (mudança incompatível), dependências demais.

## Skills úteis

- `engineering:documentation`
- `engineering:testing-strategy`
- `engineering:code-review`

## Checklist

- [ ] API pública documentada e estável
- [ ] Exemplos do README rodando no CI
- [ ] Matriz de versões da linguagem e das dependências
- [ ] Versionamento semântico e registro de mudanças
- [ ] Publicação só por etiqueta de versão

## Caso de referência

Ainda sem caso. Quando houver, registre em `casos/` e troque a maturidade.
