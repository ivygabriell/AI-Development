#!/usr/bin/env node
// Verificador do próprio método: confere se a documentação está completa e consistente.
// Uso: node scripts/verificar.mjs   (sem dependências; roda em qualquer pasta, sem tocar em nenhum projeto)
import { execFileSync, spawnSync } from 'node:child_process';
import { accessSync, constants, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const falhas = [];
let total = 0;
const checar = (nome, ok, detalhe = '') => {
  total += 1;
  if (!ok) falhas.push(`${nome}${detalhe ? ` — ${detalhe}` : ''}`);
};
const ler = (arquivo) => (existsSync(join(RAIZ, arquivo)) ? readFileSync(join(RAIZ, arquivo), 'utf8') : '');
const todosMd = (dir = RAIZ) =>
  readdirSync(dir).flatMap((nome) => {
    if (nome === '.git' || nome === 'node_modules') return [];
    const caminho = join(dir, nome);
    return statSync(caminho).isDirectory() ? todosMd(caminho) : caminho.endsWith('.md') ? [caminho] : [];
  });
const listar = (pasta) =>
  existsSync(join(RAIZ, pasta))
    ? readdirSync(join(RAIZ, pasta)).filter((n) => n.endsWith('.md') && !n.startsWith('_') && n !== 'README.md').sort()
    : [];

// 1) Arquivos obrigatórios
const NUCLEO = [
  'nucleo/01-fluxo-de-ponta-a-ponta.md',
  'nucleo/02-sessoes-e-papeis.md',
  'nucleo/03-skills-e-testes.md',
  'nucleo/04-referencias-e-engenharia-reversa.md',
  'nucleo/05-git-github-e-ci.md',
];
const OBRIGATORIOS = [
  'README.md',
  'VERSION',
  'CHANGELOG.md',
  'CLAUDE.md',
  '.gitignore',
  '.github/workflows/verificar.yml',
  '.github/pull_request_template.md',
  ...NUCLEO,
  'cenarios/README.md',
  'cenarios/_modelo-cenario.md',
  'casos/_modelo-caso.md',
  'casos/2026-10-portfolio-pessoal.md',
  'licoes/_indice.md',
  'decisoes/_modelo-decisao.md',
  'scripts/verificar.mjs',
  'scripts/gerar-indice-licoes.mjs',
  'scripts/novo-projeto.sh',
  'modelos/issue-tarefa.yml',
  'modelos/pull_request_template.md',
  'modelos/ci-node.yml',
  'modelos/nova-tarefa.sh',
  'modelos/remover-tarefa.sh',
  'modelos/prompt-sessao-trabalhadora.md',
  'modelos/prompt-sessao-integradora.md',
  'modelos/prompt-sessao-do-metodo.md',
  'modelos/prompt-auditoria-de-referencia.md',
  'modelos/modelo-criterios-de-aceite.md',
  'modelos/modelo-spec.md',
  'modelos/memoria-do-projeto.md',
];
for (const arquivo of OBRIGATORIOS) checar(`existe ${arquivo}`, existsSync(join(RAIZ, arquivo)));

// 2) Conteúdo mínimo de cada documento
const readme = ler('README.md');
checar('README: seção dos 7 princípios', readme.includes('## Os 7 princípios'));
const trechoPrincipios = readme.slice(readme.indexOf('## Os 7 princípios')).split(/\n## (?!Os 7)/)[0];
const principios = trechoPrincipios.split('\n').filter((l) => /^[1-7]\.\s+\*\*/.test(l));
checar('README: 7 princípios numerados', principios.length === 7, `achei ${principios.length}`);
checar('README: adoção em um projeto novo', readme.includes('## Adotar em um projeto novo'));
checar('README: como o repositório cresce', readme.includes('## Como este repositório cresce'));
for (const arquivo of NUCLEO) checar(`README aponta para ${arquivo}`, readme.includes(arquivo));
for (const pasta of ['nucleo/', 'cenarios/', 'casos/', 'licoes/', 'decisoes/', 'modelos/', 'scripts/']) checar(`README cita ${pasta}`, readme.includes(pasta));

const fluxo = ler('nucleo/01-fluxo-de-ponta-a-ponta.md');
for (let fase = 0; fase <= 9; fase += 1) checar(`fluxo: Fase ${fase}`, new RegExp(`^## Fase ${fase}\\b`, 'm').test(fluxo));
checar('fluxo: Fase 9 é o fechamento (retrospectiva)', /^## Fase 9 · Fechamento/m.test(fluxo));
checar('fluxo: classificação spike/delimitada/arquitetural', /spike/i.test(fluxo) && /delimitada/i.test(fluxo) && /arquitetural/i.test(fluxo));
checar('fluxo: portões de aprovação humana', fluxo.includes('## Portões de aprovação'));

const sessoes = ler('nucleo/02-sessoes-e-papeis.md');
for (const termo of ['## Quando dividir', '## Quando NÃO dividir', 'integradora', 'trabalhadora', '## Modos de falha'])
  checar(`sessões: ${termo}`, sessoes.includes(termo));
checar('sessões: limite de sessões em paralelo (no máximo 1 integradora e 2 trabalhadoras)', /no máximo\s+\*{0,2}1 integradora e 2 trabalhadoras/i.test(sessoes));

const skills = ler('nucleo/03-skills-e-testes.md');
for (const termo of ['## Mapa de skills', '## Testes: micro e macro', 'micro', 'macro', 'RED', 'verification-before-completion', '## Verificação no navegador'])
  checar(`skills e testes: ${termo}`, skills.includes(termo));

const refs = ler('nucleo/04-referencias-e-engenharia-reversa.md');
for (const termo of ['## Quando usar a engenharia reversa', 'reverse-engineer-anything', 'Não copie', 'título exato', 'curl', '## Passo a passo para um site público', '## Limites legais e éticos', 'observação', 'inferência'])
  checar(`referências: ${termo}`, refs.includes(termo));

const git = ler('nucleo/05-git-github-e-ci.md');
for (const termo of ['Conventional Commits', 'gh api -X PUT', 'required_status_checks', '## Proteção da main', '## Worktrees', '## Higiene de dados pessoais'])
  checar(`git/GitHub/CI: ${termo}`, git.includes(termo));

for (const arquivo of NUCLEO) {
  const palavras = ler(arquivo).split(/\s+/).filter(Boolean).length;
  checar(`${arquivo}: tem corpo suficiente`, palavras >= 350, `${palavras} palavras`);
}

// 2b) Camadas: lições, cenários, casos e decisões
const arquivosLicao = listar('licoes');
checar('lições: pelo menos 12 arquivos', arquivosLicao.length >= 12, `achei ${arquivosLicao.length}`);
arquivosLicao.forEach((nome, i) => {
  const t = ler(`licoes/${nome}`);
  checar(`licoes/${nome}: nome NNN-slug`, /^\d{3}-[a-z0-9-]+\.md$/.test(nome));
  checar(`licoes/${nome}: numeração sequencial`, nome.startsWith(String(i + 1).padStart(3, '0')));
  checar(`licoes/${nome}: título "# NNN · ..."`, new RegExp(`^# ${nome.slice(0, 3)} · .+`, 'm').test(t));
  for (const campo of ['**O que aconteceu:**', '**Causa:**', '**Regra:**']) checar(`licoes/${nome}: tem ${campo}`, t.includes(campo));
  checar(`licoes/${nome}: aponta para o caso de origem`, /\]\(\.\.\/casos\/[\w.-]+\.md\)/.test(t));
});
const indiceLicoes = spawnSync('node', [join(RAIZ, 'scripts/gerar-indice-licoes.mjs'), '--check'], { encoding: 'utf8' });
checar('licoes/_indice.md está atualizado (gerar-indice-licoes.mjs --check)', indiceLicoes.status === 0, (indiceLicoes.stdout + indiceLicoes.stderr).trim().slice(0, 140));

const MATURIDADES = ['rascunho', 'testado em 1 projeto', 'estável'];
const SECOES_CENARIO = ['## Quando usar', '## O que muda no fluxo', '## Skills úteis', '## Checklist', '## Caso de referência'];
const CAMPOS_CENARIO = ['**Micro:**', '**Macro:**', '**Explorar:**', '**Aceite típico:**', '**CI:**', '**Riscos:**'];
const arquivosCenario = listar('cenarios');
checar('cenários: pelo menos 8', arquivosCenario.length >= 8, `achei ${arquivosCenario.length}`);
checar('cenários: sem ERP por enquanto (decisão da pessoa)', !arquivosCenario.some((n) => /erp/i.test(n)));
const indiceCenarios = ler('cenarios/README.md');
const modeloCenario = ler('cenarios/_modelo-cenario.md');
for (const h of SECOES_CENARIO) checar(`cenarios/_modelo-cenario.md: ${h}`, modeloCenario.includes(h));
checar('cenarios/_modelo-cenario.md: campo de maturidade', modeloCenario.includes('**Maturidade:**'));
checar('cenarios/README.md: explica como criar um cenário novo', indiceCenarios.includes('## Como criar um cenário novo'));
checar('cenarios/README.md: explica os selos de maturidade', indiceCenarios.includes('## Maturidade'));
for (const nome of arquivosCenario) {
  const t = ler(`cenarios/${nome}`);
  checar(`cenarios/${nome}: listado no índice`, indiceCenarios.includes(`(${nome})`));
  const m = t.match(/^\*\*Maturidade:\*\*\s*(.+)$/m);
  checar(`cenarios/${nome}: maturidade válida`, !!m && MATURIDADES.includes(m[1].trim()), m ? m[1] : 'sem maturidade');
  for (const h of SECOES_CENARIO) checar(`cenarios/${nome}: ${h}`, t.includes(h));
  for (const campo of CAMPOS_CENARIO) checar(`cenarios/${nome}: ${campo}`, t.includes(campo));
}

const arquivosCaso = listar('casos');
checar('casos: pelo menos 1 caso real', arquivosCaso.length >= 1);
const SECOES_CASO = ['## Contexto', '## O que funcionou', '## O que falhou', '## Medidas', '## Lições geradas', '## Mudanças propostas no método'];
const modeloCaso = ler('casos/_modelo-caso.md');
for (const h of SECOES_CASO) checar(`casos/_modelo-caso.md: ${h}`, modeloCaso.includes(h));
for (const nome of arquivosCaso) {
  const t = ler(`casos/${nome}`);
  checar(`casos/${nome}: nome AAAA-MM-slug`, /^\d{4}-\d{2}-[a-z0-9-]+\.md$/.test(nome));
  for (const h of SECOES_CASO) checar(`casos/${nome}: ${h}`, t.includes(h));
}

const arquivosDecisao = listar('decisoes');
checar('decisões: pelo menos 4 registradas', arquivosDecisao.length >= 4, `achei ${arquivosDecisao.length}`);
for (const h of ['**Data:**', '## Contexto', '## Decisão', '## Consequências']) checar(`decisoes/_modelo-decisao.md: ${h}`, ler('decisoes/_modelo-decisao.md').includes(h));
arquivosDecisao.forEach((nome, i) => {
  const t = ler(`decisoes/${nome}`);
  checar(`decisoes/${nome}: nome NNN-slug`, /^\d{3}-[a-z0-9-]+\.md$/.test(nome));
  checar(`decisoes/${nome}: numeração sequencial`, nome.startsWith(String(i + 1).padStart(3, '0')));
  for (const h of ['**Data:**', '## Contexto', '## Decisão', '## Consequências']) checar(`decisoes/${nome}: ${h}`, t.includes(h));
});

const versao = ler('VERSION').trim();
checar('VERSION: semver X.Y.Z', /^\d+\.\d+\.\d+$/.test(versao), versao);
checar('CHANGELOG: tem a versão atual', ler('CHANGELOG.md').includes(`## ${versao}`));

const claude = ler('CLAUDE.md').toLowerCase();
for (const termo of ['## Objetivo deste repositório', '## Como esta sessão trabalha', '## Estrutura', '## Como acrescentar', 'nada entra sem um caso real', 'scripts/verificar.mjs', 'não toque', 'responda em português'])
  checar(`CLAUDE.md: ${termo}`, claude.includes(termo.toLowerCase()));
checar('prompt da sessão do método aponta para o CLAUDE.md', ler('modelos/prompt-sessao-do-metodo.md').includes('CLAUDE.md'));
const workflow = ler('.github/workflows/verificar.yml');
for (const termo of ['actions/checkout@v4', 'actions/setup-node@v4', 'node scripts/verificar.mjs', 'permissions:'])
  checar(`workflow verificar.yml: ${termo}`, workflow.includes(termo));

// 3) Modelos e scripts
for (const script of ['modelos/nova-tarefa.sh', 'modelos/remover-tarefa.sh', 'scripts/novo-projeto.sh']) {
  const caminho = join(RAIZ, script);
  if (!existsSync(caminho)) continue;
  try {
    accessSync(caminho, constants.X_OK);
    checar(`${script} é executável`, true);
  } catch {
    checar(`${script} é executável`, false);
  }
  try {
    execFileSync('bash', ['-n', caminho]);
    checar(`${script} tem sintaxe válida`, true);
  } catch {
    checar(`${script} tem sintaxe válida`, false);
  }
}
const form = ler('modelos/issue-tarefa.yml');
for (const id of ['objetivo', 'criterios', 'arquivos_permitidos', 'arquivos_proibidos', 'skills', 'testes_micro', 'testes_macro'])
  checar(`formulário de tarefa tem ${id}`, new RegExp(`id:\\s*${id}\\b`).test(form));
const ci = ler('modelos/ci-node.yml');
for (const termo of ['actions/checkout@v4', 'actions/setup-node@v4', 'npm ci', 'permissions:', 'concurrency:'])
  checar(`ci-node.yml: ${termo}`, ci.includes(termo));
const prTemplate = ler('modelos/pull_request_template.md');
for (const termo of ['## Testes macro executados', '## Validação da integradora'])
  checar(`modelo de PR: ${termo}`, prTemplate.includes(termo));
const promptTrab = ler('modelos/prompt-sessao-trabalhadora.md');
checar('prompt da trabalhadora exige skills (nomes exatos) e proíbe merge', promptTrab.includes('superpowers:test-driven-development') && promptTrab.includes('superpowers:verification-before-completion') && /NÃO faça merge/.test(promptTrab));
const promptInt = ler('modelos/prompt-sessao-integradora.md');
checar('prompt da integradora exige o navegador', /navegador/i.test(promptInt));
checar('prompt da integradora cita as skills pelo nome exato', promptInt.includes('superpowers:verification-before-completion') && promptInt.includes('superpowers:finishing-a-development-branch'));

// 3b) Os scripts funcionam de verdade (em repositórios temporários)
{
  const nova = join(RAIZ, 'modelos/nova-tarefa.sh');
  const remover = join(RAIZ, 'modelos/remover-tarefa.sh');
  const base = mkdtempSync(join(tmpdir(), 'metodo-'));
  const ident = { GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@exemplo.com', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@exemplo.com' };
  const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', env: { ...process.env, ...ident } }).trim();
  try {
    const origem = join(base, 'origem.git');
    const repo = join(base, 'projeto');
    const tarefas = join(base, 'tarefas');
    git(base, 'init', '--bare', '-b', 'main', origem);
    git(base, 'clone', origem, repo);
    git(repo, 'switch', '-c', 'main');
    writeFileSync(join(repo, 'README.md'), 'teste\n');
    git(repo, 'add', '.');
    git(repo, 'commit', '-m', 'init');
    git(repo, 'push', '-u', 'origin', 'main');
    const rodar = (script, args) => spawnSync('bash', [script, ...args], { cwd: repo, encoding: 'utf8', env: { ...process.env, ...ident, SKIP_INSTALL: '1', WORKTREES_DIR: tarefas } });

    const invalido = rodar(nova, ['coisa', 'menu']);
    checar('nova-tarefa.sh recusa tipo inválido', invalido.status !== 0 && /feat, fix, chore/.test(invalido.stderr));
    const criada = rodar(nova, ['fix', 'menu-mobile', '3019']);
    const pasta = join(tarefas, 'fix-menu-mobile');
    checar('nova-tarefa.sh cria a worktree', criada.status === 0 && existsSync(pasta), criada.stderr);
    if (existsSync(pasta)) {
      checar('nova-tarefa.sh cria a branch certa', git(pasta, 'rev-parse', '--abbrev-ref', 'HEAD') === 'fix/menu-mobile');
      checar('nova-tarefa.sh parte da main do remoto', git(pasta, 'rev-parse', 'HEAD') === git(repo, 'rev-parse', 'origin/main'));
      checar('nova-tarefa.sh informa a pasta e a porta', criada.stdout.includes(pasta) && criada.stdout.includes('3019'));
    }
    checar('nova-tarefa.sh não sobrescreve tarefa existente', rodar(nova, ['fix', 'menu-mobile']).status !== 0);
    if (existsSync(pasta)) {
      writeFileSync(join(pasta, 'sujeira.txt'), 'x');
      checar('remover-tarefa.sh recusa worktree suja', rodar(remover, ['fix', 'menu-mobile']).status !== 0 && existsSync(pasta));
      rmSync(join(pasta, 'sujeira.txt'));
      checar('remover-tarefa.sh remove worktree limpa', rodar(remover, ['fix', 'menu-mobile']).status === 0 && !existsSync(pasta));
    }
  } catch (erro) {
    checar('scripts de worktree: teste funcional rodou até o fim', false, String(erro).slice(0, 160));
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

{
  // novo-projeto.sh: copia os modelos, carimba a versão do método e nunca sobrescreve
  const novo = join(RAIZ, 'scripts/novo-projeto.sh');
  const base = mkdtempSync(join(tmpdir(), 'metodo-np-'));
  try {
    const alvo = join(base, 'meu-projeto');
    mkdirSync(alvo);
    const rodar = (...args) => spawnSync('bash', [novo, ...args], { encoding: 'utf8' });
    checar('novo-projeto.sh sem argumentos mostra o uso e falha', rodar().status !== 0);
    checar('novo-projeto.sh recusa pasta que não existe', rodar(join(base, 'nao-existe')).status !== 0);
    checar('novo-projeto.sh recusa cenário inexistente', rodar(alvo, 'cenario-que-nao-existe').status !== 0);
    const ok = rodar(alvo, 'site-estatico', 'api-backend');
    checar('novo-projeto.sh conclui com cenários válidos', ok.status === 0, ok.stderr);
    for (const arq of ['.github/ISSUE_TEMPLATE/tarefa.yml', '.github/pull_request_template.md', '.github/workflows/ci.yml', 'scripts/nova-tarefa.sh', 'scripts/remover-tarefa.sh', 'docs/DESENVOLVIMENTO.md', 'docs/memoria-do-projeto.md'])
      checar(`novo-projeto.sh cria ${arq}`, existsSync(join(alvo, arq)));
    const dev = existsSync(join(alvo, 'docs/DESENVOLVIMENTO.md')) ? readFileSync(join(alvo, 'docs/DESENVOLVIMENTO.md'), 'utf8') : '';
    checar('novo-projeto.sh carimba a versão do método', dev.includes(`Versão do método: ${versao}`));
    checar('novo-projeto.sh registra os cenários escolhidos', dev.includes('site-estatico') && dev.includes('api-backend'));
    // Cenário rascunho gera aviso (sem travar); a maturidade de cada cenário vai para o DESENVOLVIMENTO.md
    const maturidade = (nome) => (readFileSync(join(RAIZ, 'cenarios', `${nome}.md`), 'utf8').match(/^\*\*Maturidade:\*\*\s*(.+)$/m) || [])[1]?.trim();
    checar('novo-projeto.sh avisa no stderr quando o cenário é rascunho (api-backend)', ok.stderr.includes('AVISO: o cenário api-backend é rascunho'), ok.stderr);
    checar('novo-projeto.sh não avisa para cenário testado (site-estatico)', !ok.stderr.includes('o cenário site-estatico é'), ok.stderr);
    checar('novo-projeto.sh marca a maturidade do cenário testado no DESENVOLVIMENTO.md', dev.includes(`- site-estatico (${maturidade('site-estatico')})`));
    checar('novo-projeto.sh marca o cenário rascunho no DESENVOLVIMENTO.md', dev.includes('- api-backend (rascunho: ainda não testado)'));
    const alvo_testado = join(base, 'projeto-testado');
    mkdirSync(alvo_testado);
    const so_testado = rodar(alvo_testado, 'site-estatico');
    checar('novo-projeto.sh só com cenário testado conclui sem aviso', so_testado.status === 0 && !so_testado.stderr.includes('AVISO'), so_testado.stderr);
    try {
      accessSync(join(alvo, 'scripts/nova-tarefa.sh'), constants.X_OK);
      checar('novo-projeto.sh mantém os scripts executáveis', true);
    } catch {
      checar('novo-projeto.sh mantém os scripts executáveis', false);
    }
    const antes = existsSync(join(alvo, 'docs/DESENVOLVIMENTO.md')) ? readFileSync(join(alvo, 'docs/DESENVOLVIMENTO.md'), 'utf8') : '';
    writeFileSync(join(alvo, 'docs/DESENVOLVIMENTO.md'), `${antes}\nminha edição\n`);
    const de_novo = rodar(alvo, 'site-estatico');
    checar('novo-projeto.sh não sobrescreve arquivos que já existem', de_novo.status !== 0 && readFileSync(join(alvo, 'docs/DESENVOLVIMENTO.md'), 'utf8').includes('minha edição'));
  } catch (erro) {
    checar('novo-projeto.sh: teste funcional rodou até o fim', false, String(erro).slice(0, 160));
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

// 4) Consistência geral
const SKILLS_VALIDAS = new Set([
  ...['brainstorming', 'writing-plans', 'executing-plans', 'subagent-driven-development', 'test-driven-development', 'systematic-debugging', 'verification-before-completion', 'requesting-code-review', 'receiving-code-review', 'finishing-a-development-branch', 'using-git-worktrees', 'dispatching-parallel-agents', 'writing-skills', 'using-superpowers', 'diagnosing-superpowers'].map((n) => `superpowers:${n}`),
  ...['architecture', 'code-review', 'debug', 'deploy-checklist', 'documentation', 'incident-response', 'standup', 'system-design', 'tech-debt', 'testing-strategy'].map((n) => `engineering:${n}`),
  ...['accessibility-review', 'design-critique', 'design-handoff', 'design-system', 'research-synthesis', 'user-research', 'ux-copy'].map((n) => `design:${n}`),
]);
const arquivosTexto = [...todosMd(), ...['modelos/issue-tarefa.yml', 'modelos/ci-node.yml', '.github/workflows/verificar.yml'].map((a) => join(RAIZ, a))].filter(existsSync);
for (const arquivo of arquivosTexto) {
  const texto = readFileSync(arquivo, 'utf8');
  const nome = relative(RAIZ, arquivo);

  for (const [, skill] of texto.matchAll(/`?((?:superpowers|engineering|design):[a-z-]+)`?/g))
    checar(`${nome}: skill existente (${skill})`, SKILLS_VALIDAS.has(skill));

  checar(`${nome}: sem pendências (TODO, TBD, XXX)`, !/(?<![\p{L}\p{N}_])(TODO|TBD|XXX|FIXME)(?![\p{L}\p{N}_])/u.test(texto));

  const emails = [...texto.matchAll(/[\w.+-]+@[\w-]+\.[\w.-]+/g)].map((m) => m[0]).filter((e) => !e.endsWith('@exemplo.com') && !e.startsWith('noreply@') && !e.includes('users.noreply.github.com'));
  checar(`${nome}: sem e-mails pessoais`, emails.length === 0, emails.join(', '));
  checar(`${nome}: sem telefones`, !/\+?55\s?\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}/.test(texto));

  if (arquivo.endsWith('.md')) {
    for (const [, alvo] of texto.matchAll(/\[[^\]]*\]\(([^)\s#]+)(?:#[^)]*)?\)/g)) {
      if (/^(https?:|mailto:)/.test(alvo)) continue;
      checar(`${nome}: link relativo existe (${alvo})`, existsSync(resolve(dirname(arquivo), alvo)));
    }
  }
}

// Resultado
if (falhas.length) {
  console.log(`✗ ${falhas.length} de ${total} verificações falharam:\n`);
  for (const f of falhas.slice(0, 40)) console.log(`  - ${f}`);
  if (falhas.length > 40) console.log(`  ... e mais ${falhas.length - 40}`);
  process.exit(1);
}
console.log(`✓ ${total} verificações passaram.`);
