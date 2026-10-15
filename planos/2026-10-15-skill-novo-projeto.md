# Plugin `metodo` e skill `novo-projeto`: plano de implementação

> **Para quem executa:** use `superpowers:executing-plans` (ou `superpowers:subagent-driven-development`) para seguir este plano tarefa por tarefa. Os passos usam caixas (`- [ ]`) para acompanhar.

**Objetivo:** iniciar um projeto novo, em qualquer computador com acesso a este repositório, com um comando só (`/metodo:novo-projeto`), e dar o contexto do método a toda sessão do projeto.

**Arquitetura:** o repositório vira um marketplace do Claude Code com um plugin (`metodo`) cuja raiz é o próprio repositório; as skills ficam em `skills/` e leem o método por `${CLAUDE_PLUGIN_ROOT}`. O `scripts/novo-projeto.sh` gera o `CLAUDE.md` do projeto a partir de `modelos/CLAUDE-projeto.md`; o `modelos/ci-node.yml` passa verde com aviso enquanto não há `package.json`. Tudo coberto por verificações novas em `scripts/verificar.mjs`, escritas antes.

**Stack:** Bash, Node 22+ (verificador sem dependências), Markdown, JSON e YAML do GitHub Actions, CLI do Claude Code (`claude plugin validate`).

**Spec:** [decisão 005](../decisoes/005-iniciar-projeto-com-uma-skill.md).

## Restrições globais

- Branch `feat/skill-novo-projeto`. Nunca commit na `main`, nunca `push --force`. Push, PR e merge só com a confirmação da pessoa.
- Nada é instalado nem executado no computador da pessoa: nem o plugin, nem a skill.
- Português em tudo; nomes de Skills, comandos e código como são.
- Nenhum dado pessoal em arquivo; o `CLAUDE.md` gerado não leva caminho de pasta.
- Toda verificação nova é escrita em `scripts/verificar.mjs` e **vista falhar** antes do código.
- Toda skill citada em Markdown com prefixo `superpowers:`, `engineering:` ou `design:` precisa existir na lista `SKILLS_VALIDAS` do verificador.
- Marketplace `metodo-de-desenvolvimento`; plugin `metodo`, `source: "./"`, sem `version`.
- Versão final: `2.3.0` em `VERSION`, seção `## 2.3.0 (2026-10-15)` no `CHANGELOG.md`.
- O verificador roda com `node scripts/verificar.mjs` (saída `✓ N verificações passaram.` e código 0).

## Foco da revisão

1. **Repositório privado no outro computador:** sem `gh auth setup-git` (ou chave SSH), o `/plugin marketplace add` falha. O README e a decisão dizem o que é preciso; a revisão confere que está escrito antes do comando.
2. **Pasta "vazia" no macOS:** uma pasta recém-criada pode ter `.DS_Store`; a skill deve tratá-la como vazia. Conferido no texto da skill (Tarefa 3).
3. **Stack que não é Node:** sem `package.json`, o CI passa verde para sempre com aviso; a skill manda ajustar o CI no primeiro PR depois da spec. Conferido no aviso (Tarefa 1) e no passo 5 da skill (Tarefa 3).
4. **Cópia do plugin sem permissão de execução:** a skill chama o script com `bash "${CLAUDE_PLUGIN_ROOT}/scripts/novo-projeto.sh"`, sem depender do bit de execução. Conferido na Tarefa 3.
5. **Projeto que já tem `CLAUDE.md`:** o script não pode sobrescrever nem interromper. Coberto na Tarefa 2.

---

### Tarefa 1: CI do modelo passa verde com aviso enquanto a stack não existe

**Arquivos:** modificar `modelos/ci-node.yml`; teste em `scripts/verificar.mjs` (seção 3, depois das checagens de `ci-node.yml`).

- [ ] **Passo 1: escrever as verificações**

```js
const passosCi = ci.split(/\n(?=      - )/).slice(1);
const passosNode = passosCi.filter((p) => /setup-node|npm /.test(p));
checar('ci-node.yml: confere se a stack já foi definida (package.json) e avisa', /id:\s*stack\b/.test(ci) && ci.includes('-f package.json') && ci.includes('::warning::'));
checar('ci-node.yml: todos os passos de Node dependem da stack definida', passosNode.length >= 5 && passosNode.every((p) => p.includes("if: steps.stack.outputs.definida == 'sim'")), `passos de Node: ${passosNode.length}`);
```

- [ ] **Passo 2: ver falhar** (`node scripts/verificar.mjs`: as duas acima falham).
- [ ] **Passo 3: ajustar o modelo.** Depois do `actions/checkout@v4`, um passo `id: stack` que grava `definida=sim` ou `definida=nao` em `$GITHUB_OUTPUT` (com `if [ -f package.json ]`) e, sem `package.json`, imprime `::warning::Stack ainda não definida (sem package.json): este CI ainda não roda testes. Ajuste este arquivo à stack no primeiro PR depois da spec.`; cada passo de Node (`setup-node`, `npm ci`, `npm test`, `npm run check`, `npm run test:build`) ganha `if: steps.stack.outputs.definida == 'sim'`.
- [ ] **Passo 4: ver passar** e **commit** `feat: CI do modelo passa com aviso enquanto a stack não existe`.

### Tarefa 2: `novo-projeto.sh` gera o `CLAUDE.md` do projeto

**Arquivos:** criar `modelos/CLAUDE-projeto.md`; modificar `scripts/novo-projeto.sh`; teste em `scripts/verificar.mjs` (lista `OBRIGATORIOS` e seção do `novo-projeto.sh`).

- [ ] **Passo 1: escrever as verificações.** Acrescentar `'modelos/CLAUDE-projeto.md'` a `OBRIGATORIOS` e `'CLAUDE.md'` à lista de arquivos criados; depois das checagens de maturidade:

```js
    const claudeProj = existsSync(join(alvo, 'CLAUDE.md')) ? readFileSync(join(alvo, 'CLAUDE.md'), 'utf8') : '';
    checar('novo-projeto.sh: CLAUDE.md carimba a versão do método', claudeProj.includes(`Versão do método: ${versao}`));
    checar('novo-projeto.sh: CLAUDE.md importa o DESENVOLVIMENTO.md e a memória', claudeProj.includes('@docs/DESENVOLVIMENTO.md') && claudeProj.includes('@docs/memoria-do-projeto.md'));
    checar('novo-projeto.sh: CLAUDE.md manda consultar o método pela skill metodo:consultar', claudeProj.includes('metodo:consultar'));
    checar('novo-projeto.sh: CLAUDE.md sem marcadores nem caminhos de pasta', claudeProj.length > 0 && !claudeProj.includes('{{') && !claudeProj.includes(RAIZ));
    const alvo_com_claude = join(base, 'projeto-com-claude');
    mkdirSync(alvo_com_claude);
    writeFileSync(join(alvo_com_claude, 'CLAUDE.md'), 'meu claude\n');
    const com_claude = rodar(alvo_com_claude, 'site-estatico');
    checar('novo-projeto.sh com CLAUDE.md existente conclui, avisa e não o altera', com_claude.status === 0 && com_claude.stderr.includes('CLAUDE.md') && readFileSync(join(alvo_com_claude, 'CLAUDE.md'), 'utf8') === 'meu claude\n' && existsSync(join(alvo_com_claude, 'docs/DESENVOLVIMENTO.md')), com_claude.stderr);
```

- [ ] **Passo 2: ver falhar.**
- [ ] **Passo 3: criar o modelo** com `Versão do método: {{VERSAO}}`, as linhas `@docs/DESENVOLVIMENTO.md` e `@docs/memoria-do-projeto.md`, a instrução de consultar o método pela skill `metodo:consultar` e as regras curtas das sessões (português, fases e Skills, memória, método só leitura, confirmação antes de ações externas).
- [ ] **Passo 4: gerar no script.** Depois do `chmod +x` dos scripts de worktree: se `$alvo/CLAUDE.md` existe, avisar no stderr (`AVISO: o CLAUDE.md já existe e não foi alterado; acrescente a ele as linhas @docs/DESENVOLVIMENTO.md e @docs/memoria-do-projeto.md.`); senão, `sed -e "s|{{VERSAO}}|$versao|g" "$raiz/modelos/CLAUDE-projeto.md" > "$alvo/CLAUDE.md"`. Atualizar o cabeçalho do script.
- [ ] **Passo 5: ver passar** e **commit** `feat: novo-projeto.sh gera o CLAUDE.md do projeto`.

### Tarefa 3: plugin `metodo` com as skills `novo-projeto` e `consultar`

**Arquivos:** criar `.claude-plugin/marketplace.json`, `skills/novo-projeto/SKILL.md`, `skills/consultar/SKILL.md`; teste em `scripts/verificar.mjs` (`OBRIGATORIOS` e um bloco novo antes de `// 4) Consistência geral`). Use `superpowers:writing-skills` ao escrever as skills.

- [ ] **Passo 1: escrever as verificações.** Acrescentar os três arquivos a `OBRIGATORIOS` e:

```js
{
  // Plugin metodo: catálogo e skills
  let catalogo = null;
  try {
    catalogo = JSON.parse(ler('.claude-plugin/marketplace.json'));
  } catch {
    catalogo = null;
  }
  checar('plugin: marketplace.json é JSON válido', catalogo !== null);
  const entrada = catalogo?.plugins?.find((p) => p.name === 'metodo');
  checar('plugin: marketplace metodo-de-desenvolvimento com dono', catalogo?.name === 'metodo-de-desenvolvimento' && Boolean(catalogo?.owner?.name));
  checar('plugin: entrada metodo com source "./" e sem version', entrada?.source === './' && entrada?.version === undefined);
  const pastasSkill = existsSync(join(RAIZ, 'skills')) ? readdirSync(join(RAIZ, 'skills')).filter((n) => existsSync(join(RAIZ, 'skills', n, 'SKILL.md'))) : [];
  checar('plugin: skills novo-projeto e consultar', pastasSkill.includes('novo-projeto') && pastasSkill.includes('consultar'), pastasSkill.join(', '));
  for (const pasta of pastasSkill) {
    const texto = ler(`skills/${pasta}/SKILL.md`);
    const cabecalho = (texto.match(/^---\n([\s\S]*?)\n---\n/) || [])[1] || '';
    checar(`skills/${pasta}: name igual ao nome da pasta`, new RegExp(`^name:\\s*${pasta}\\s*$`, 'm').test(cabecalho));
    checar(`skills/${pasta}: description no cabeçalho`, /^description:\s*\S.{20,}$/m.test(cabecalho));
    const citados = [...texto.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([^\s`"'<>)*]+)/g)].map((m) => m[1]);
    checar(`skills/${pasta}: cita arquivos do método por \${CLAUDE_PLUGIN_ROOT}`, citados.length >= 2, `citados: ${citados.length}`);
    for (const caminho of citados) checar(`skills/${pasta}: caminho citado existe (${caminho})`, existsSync(join(RAIZ, caminho)));
  }
  const inicio = ler('skills/novo-projeto/SKILL.md');
  checar('skills/novo-projeto: maturidade rascunho', inicio.includes('**Maturidade:** rascunho'));
  for (const termo of ['superpowers:brainstorming', 'gh repo create', '.DS_Store', 'Pode criar?', 'bash "${CLAUDE_PLUGIN_ROOT}/scripts/novo-projeto.sh"'])
    checar(`skills/novo-projeto: ${termo}`, inicio.includes(termo));
}
```

- [ ] **Passo 2: ver falhar.**
- [ ] **Passo 3: escrever o catálogo** (`name: metodo-de-desenvolvimento`, `owner.name`, `description`, um plugin `metodo` com `source: "./"`, `description` e sem `version`) e **as skills**: `novo-projeto` com os 5 passos da decisão 005 (conferências, entender o mínimo, a confirmação "Pode criar?", a preparação com `bash "${CLAUDE_PLUGIN_ROOT}/scripts/novo-projeto.sh" . <cenário>`, Fase 0 em diante) e `consultar` com o mapa do que ler em cada situação.
- [ ] **Passo 4: ver passar**, rodar `claude plugin validate .` (só leitura) e **commit** `feat: plugin metodo com as skills novo-projeto e consultar`.

### Tarefa 4: passo a passo no README, estrutura, caso, decisão aceita e versão 2.3.0

**Arquivos:** `README.md`, `CLAUDE.md`, `casos/2026-10-repositorio-do-metodo.md`, `decisoes/005-iniciar-projeto-com-uma-skill.md`, `VERSION`, `CHANGELOG.md`; teste em `scripts/verificar.mjs` (seção 2).

- [ ] **Passo 1: escrever as verificações**

```js
const adocao = readme.slice(readme.indexOf('## Adotar em um projeto novo')).split(/\n## (?!Adotar)/)[0];
checar('README: adoção instala o plugin', adocao.includes('/plugin marketplace add') && adocao.includes('/plugin install metodo@metodo-de-desenvolvimento'));
checar('README: adoção usa /metodo:novo-projeto', adocao.includes('/metodo:novo-projeto'));
checar('README: adoção diz o que o repositório privado exige', adocao.includes('gh auth setup-git'));
checar('README: adoção mantém o caminho manual', adocao.includes('scripts/novo-projeto.sh'));
```

e acrescentar `'skills/'` e `'planos/'` à lista de pastas que o README cita.

- [ ] **Passo 2: ver falhar.**
- [ ] **Passo 3:** reescrever "Adotar em um projeto novo" (requisitos, instalação do plugin, uso, atualização e o caminho manual); citar `skills/` e `planos/` na tabela "Camadas que crescem"; no `CLAUDE.md`, acrescentar `.claude-plugin/`, `skills/` e `planos/` à "Estrutura"; no caso do repositório do método, registrar a falha (prompts colados, CI vermelho) e a mudança proposta (decisão 005); decisão 005 para `aceita`; `VERSION` 2.3.0 e a seção do `CHANGELOG.md`.
- [ ] **Passo 4: ver passar** e **commit** `docs: passo a passo com o plugin metodo e versão 2.3.0`.

### Tarefa 5: fechamento

- [ ] `superpowers:verification-before-completion`: `node scripts/verificar.mjs` e `claude plugin validate .`, lendo as saídas inteiras.
- [ ] Com a confirmação da pessoa: `git push -u origin feat/skill-novo-projeto` e o PR com o modelo, citando a decisão 005 e o caso do repositório do método.
- [ ] Esperar o CI do PR; integrar só com o "pode integrar" (`gh pr merge N --merge`, sem apagar a branch), conferir o CI da `main` e, com o "sim", criar a tag `v2.3.0`.
- [ ] O primeiro uso em outro computador vira registro no caso do repositório do método (instalação, primeiro projeto, o que precisou de ajuste).
