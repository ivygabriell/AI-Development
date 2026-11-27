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
    if (nome === '.git' || nome === 'node_modules' || nome === '.superpowers') return []; // .superpowers: rascunho local dos planos, fora do Git
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
  'licoes/_indice.md',
  'decisoes/_modelo-decisao.md',
  'scripts/verificar.mjs',
  'scripts/gerar-indice-licoes.mjs',
  'scripts/novo-projeto.sh',
  'modelos/issue-tarefa.yml',
  'modelos/issue-bug.yml',
  'decisoes/014-fluxo-de-correcao-de-bugs.md',
  'modelos/modelo-requisitos.md',
  'decisoes/015-requisitos-e-telas-antes-do-codigo.md',
  'decisoes/016-processo-fora-da-raiz.md',
  'decisoes/017-agente-designer.md',
  'decisoes/018-reduzir-skills-e-plugins.md',
  'decisoes/019-fluxo-por-impacto.md',
  'decisoes/020-harnesses-agent-skills.md',
  'modelos/pull_request_template.md',
  'modelos/ci-node.yml',
  'modelos/nova-tarefa.sh',
  'modelos/remover-tarefa.sh',
  'modelos/prompt-builder.md',
  'modelos/prompt-lead.md',
  'modelos/prompt-sessao-do-metodo.md',
  'modelos/prompt-auditoria-de-referencia.md',
  'modelos/modelo-criterios-de-aceite.md',
  'modelos/modelo-spec.md',
  'modelos/memoria-do-projeto.md',
  'modelos/CLAUDE-projeto.md',
  'modelos/prompt-lead-orca.md',
  'decisoes/006-desenvolvimento-orquestrado-com-o-orca.md',
  'modelos/AGENTS-projeto.md',
  'decisoes/007-back-com-codex-e-front-com-claude.md',
  'decisoes/008-agentes-especialistas.md',
  'modelos/agentes/_modelo-harness.md',
  'decisoes/010-um-agente-principal-por-projeto.md',
  'decisoes/011-sem-rascunho-fora-dos-cenarios.md',
  'decisoes/012-revalidacao-de-lacunas-e-ponytail.md',
];
for (const arquivo of OBRIGATORIOS) checar(`existe ${arquivo}`, existsSync(join(RAIZ, arquivo)));
// Decisão 013: os arquivos dos papéis têm os nomes em inglês; os antigos não voltam
const ANTIGOS = ['integradora', 'arquitetura', 'back-e-dados', 'design-e-front', 'seguranca', 'produto', 'devops'].flatMap((n) => [`modelos/agentes/${n}.md`, `modelos/referencias/${n}.md`]).concat(['modelos/prompt-sessao-integradora.md', 'modelos/prompt-sessao-trabalhadora.md', 'modelos/prompt-coordenadora-orca.md']);
for (const arquivo of ANTIGOS) checar(`nome antigo não existe: ${arquivo}`, !existsSync(join(RAIZ, arquivo)));
// Decisão 013: fora do histórico, os papéis só têm os nomes novos (Lead, Builders, Architect, Backend, Frontend...)
const HISTORICO = /\/(planos|licoes|decisoes|\.superpowers)\/|\/CHANGELOG\.md$/;
const ARQUIVOS_VIVOS = [...todosMd(), ...['scripts/novo-projeto.sh', 'modelos/nova-tarefa.sh', 'modelos/remover-tarefa.sh', 'modelos/issue-tarefa.yml', 'modelos/issue-bug.yml', 'modelos/ci-node.yml', '.github/workflows/verificar.yml'].map((f) => join(RAIZ, f))].filter((f) => existsSync(f) && !HISTORICO.test(f));
const integracoesRemovidas = /\b(?:metodo|engineering|design|figma):[a-z-]+|\b(?:superpowers|ponytail|reverse-engineer-anything|security-review|rea-agents)\b|\borca skills\b|\bfigma-(?:use|generate-[a-z-]+)\b|(?:^|\s)\/?plugin\s+(?:install|marketplace|add)\b/i;
const comDependenciasRemovidas = ARQUIVOS_VIVOS.filter((f) => integracoesRemovidas.test(readFileSync(f, 'utf8')));
checar('018: o fluxo ativo não reintroduz as integrações removidas', comDependenciasRemovidas.length === 0, comDependenciasRemovidas.map((f) => relative(RAIZ, f)).join(', '));
checar('018: o método encerrou a distribuição de skills e do seu plugin', !existsSync(join(RAIZ, 'skills')) && !existsSync(join(RAIZ, '.claude-plugin/marketplace.json')));
checar('018: a Cloudflare mantém uma instalação documentada', [...ler('README.md').matchAll(/^[ \t]*npx skills add (\S+)/gm)].map(([, url]) => url).join() === 'https://github.com/cloudflare/security-audit-skill');
const NOMES_ANTIGOS = /\b(integradoras?|trabalhadoras?|coordenadoras?|Back e Dados|Design e Front)\b/i;
const comNomeAntigo = ARQUIVOS_VIVOS.flatMap((f) => readFileSync(f, 'utf8').split('\n').map((l, i) => (NOMES_ANTIGOS.test(l) ? `${f.slice(RAIZ.length + 1)}:${i + 1}` : null)).filter(Boolean));
checar('nomes antigos dos papéis fora do histórico', comNomeAntigo.length === 0, comNomeAntigo.slice(0, 5).join(', '));

// 2) Conteúdo mínimo de cada documento
const readme = ler('README.md');
const diagramas = [...readme.matchAll(/```mermaid\n([\s\S]+?)\n```/g)].map(([, bloco]) => bloco);
for (const tipo of ['flowchart', 'sequenceDiagram'])
  checar(`README: diagrama Mermaid ${tipo} com descrição acessível`, diagramas.some((bloco) => bloco.startsWith(tipo) && bloco.includes('accTitle:') && bloco.includes('accDescr:')));
checar('README: seção dos 7 princípios', readme.includes('## Os 7 princípios'));
const trechoPrincipios = readme.slice(readme.indexOf('## Os 7 princípios')).split(/\n## (?!Os 7)/)[0];
const principios = trechoPrincipios.split('\n').filter((l) => /^[1-7]\.\s+\*\*/.test(l));
checar('README: 7 princípios numerados', principios.length === 7, `achei ${principios.length}`);
checar('README: adoção em um projeto novo', readme.includes('## Adotar em um projeto novo'));
// Seção inteira até o próximo título de nível 2 (os ### de dentro dela continuam incluídos)
const adocao = readme.slice(readme.indexOf('## Adotar em um projeto novo')).split(/\n## (?!Adotar)/)[0];
checar('README: adoção diz o que o repositório privado exige', adocao.includes('gh auth setup-git'));
checar('README: adoção mantém o caminho manual', adocao.includes('scripts/novo-projeto.sh'));
checar('README: adoção orienta sobre o Orca', adocao.includes('https://github.com/stablyai/orca'));
checar('README: adoção explica como atualizar um projeto existente', adocao.includes('### Atualizar um projeto') && adocao.includes('diff preparado'));
// Decisão 013: Lead no Claude e ferramenta padrão por papel; --agente põe todos numa ferramenta só
checar('README: adoção explica a ferramenta por papel (Lead no Claude, --agente para uma ferramenta só)', adocao.includes('Ferramenta por papel') && adocao.includes('--agente codex'));
checar('README: adoção sem o back no Codex e o front no Claude (substituído pela decisão 010)', !adocao.includes('Para dividir o back (Codex) e o front (Claude)'));
// security-audit da Cloudflare (decisão 010, rascunho): instalada para a ferramenta do projeto, usada pelo Security
checar('README: adoção instala a skill security-audit pelo repositório oficial, para o Claude Code e o Codex', adocao.includes('https://github.com/cloudflare/security-audit-skill') && adocao.includes('npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit --global --agent claude-code codex'));
checar('README: como o repositório cresce', readme.includes('## Como este repositório cresce'));
for (const arquivo of NUCLEO) checar(`README aponta para ${arquivo}`, readme.includes(arquivo));
for (const pasta of ['nucleo/', 'licoes/', 'decisoes/', 'modelos/', 'scripts/', 'planos/']) checar(`README cita ${pasta}`, readme.includes(pasta));

const fluxo = ler('nucleo/01-fluxo-de-ponta-a-ponta.md');
for (let fase = 0; fase <= 9; fase += 1) checar(`fluxo: Fase ${fase}`, new RegExp(`^## Fase ${fase}\\b`, 'm').test(fluxo));
checar('fluxo: Fase 9 é o fechamento (retrospectiva)', /^## Fase 9 · Fechamento/m.test(fluxo));
checar('fluxo: classificação spike/delimitada/arquitetural', /spike/i.test(fluxo) && /delimitada/i.test(fluxo) && /arquitetural/i.test(fluxo));
const impacto = (fluxo.split('## Impacto da tarefa')[1] || '').split('\n## ')[0];
for (const trilha of ['Básico', 'Padrão', 'Profundo'])
  checar(`fluxo: trilha ${trilha} definida`, impacto.includes(`| **${trilha}** |`));
checar('fluxo: reclassifica quando o risco ou alcance muda', impacto.includes('Reclassifique antes de avançar'));
checar('fluxo: publicação automática tem portão antes do merge', /merge dispara a publicação automática.*autorização antes do merge/.test(impacto));
checar('fluxo: portões de aprovação humana', fluxo.includes('## Portões de aprovação'));
// Decisão 013: só o que aciona um gatilho chega à pessoa; o resto a Lead decide e registra
const GATILHOS = ['o que** será construído', 'desfazer', 'usuários reais', 'dinheiro ou muita cota', 'aceita um risco', 'regras do jogo'];
const portoes = (fluxo.split('## Portões de aprovação')[1] || '');
for (const g of GATILHOS) checar(`fluxo: gatilho de aprovação da pessoa (${g})`, portoes.toLowerCase().includes(g.toLowerCase()));
for (const termo of ['na dúvida, sobe para a pessoa', 'Fica com a pessoa', 'Passa para a Lead', 'resumo por marco', 'Aprovações', 'nenhum gatilho'])
  checar(`fluxo: aprovações por gatilho (${termo})`, portoes.toLowerCase().includes(termo.toLowerCase()));
const lead = ler('modelos/agentes/lead.md');
checar('agentes/lead: confere os gatilhos antes de cada merge, integra sozinha só sem gatilho e escreve o resumo por marco', lead.includes('gatilhos') && lead.includes('resumo por marco') && lead.toLowerCase().includes("sem gatilho") && !lead.includes('depois do "pode integrar" da pessoa.'));
for (const p of ['modelos/prompt-lead.md', 'modelos/prompt-lead-orca.md']) checar(`${p}: integra pelos gatilhos (sem gatilho, a Lead integra; com gatilho, só com a pessoa)`, ler(p).includes('gatilho') && ler(p).includes('resumo por marco'));
checar('modelo de PR: campo "Gatilhos de aprovação"', ler('modelos/pull_request_template.md').includes('Gatilhos de aprovação:'));
const sessoesTxt = ler('nucleo/02-sessoes-e-papeis.md');
checar('sessões: o merge segue os gatilhos (Orca e sessões divididas)', ((sessoesTxt.split('## Ciclo de uma tarefa')[1] || '').split('\n## ')[0]).includes('gatilho') && ((sessoesTxt.split('## Com o Orca')[1] || '').split('\n### ')[0]).includes('gatilho'));
checar('fluxo: Fase 7 pede a auditoria de segurança antes da primeira publicação, em qualquer modo', ((fluxo.split('## Fase 7')[1] || '').split('## Fase 8')[0]).includes('security-audit'));
checar('fluxo: Fase 2 já usa a security-audit no primeiro mapa de riscos (modo de orientação)', ((fluxo.split('## Fase 2')[1] || '').split('## Fase 3')[0]).includes('security-audit') && ((fluxo.split('## Fase 2')[1] || '').split('## Fase 3')[0]).includes('mapa de riscos'));
checar('prompt da Lead do Orca: auditoria de segurança antes da primeira publicação', ler('modelos/prompt-lead-orca.md').includes('security-audit'));

const sessoes = ler('nucleo/02-sessoes-e-papeis.md');
for (const termo of ['## Quando dividir', '## Quando NÃO dividir', 'Lead', 'Builder', '## Modos de falha'])
  checar(`sessões: ${termo}`, sessoes.includes(termo));
checar('sessões: limite de sessões em paralelo (no máximo 1 Lead e 2 Builders)', /no máximo\s+\*{0,2}1 Lead e 2 Builders/i.test(sessoes));
for (const termo of ['## Com o Orca', 'Lead', 'orchestration worker-start', 'gate-create', 'orchestration ask'])
  checar(`sessões: modo Orca (${termo})`, sessoes.includes(termo));
checar('fluxo: Orca como modo de execução na Fase 3', (fluxo.split('## Fase 3')[1] || '').split('## Fase 4')[0].includes('Orca'));
checar('fluxo: Fase 9 consulta as conversas do Orca', (fluxo.split('## Fase 9')[1] || '').includes('orca search'));
checar('git/GitHub/CI: worktrees pelo Orca', ler('nucleo/05-git-github-e-ci.md').includes('orca worktree create'));
const promptCoord = ler('modelos/prompt-lead-orca.md');
for (const termo of ['gate-create', 'pode integrar', 'critérios de aceite', 'arquivos permitidos'])
  checar(`prompt da Lead do Orca: ${termo}`, promptCoord.includes(termo));
// Decisão 013: cada agente usa a ferramenta do seu papel (tabela do DESENVOLVIMENTO.md)
for (const termo of ['Ferramenta por papel', '--agent claude', '--agent codex', 'contrato da API', 'AGENTS.md', 'retrabalho', 'passagem'])
  checar(`prompt da Lead do Orca: ferramenta por papel (${termo})`, promptCoord.includes(termo));
checar('prompt da Lead do Orca: não diz que a Lead é sempre Claude', !/sempre Claude/i.test(promptCoord));
const secaoFerramentas = (sessoes.split('### Lead e ferramenta por papel')[1] || '').split('\n### ')[0];
for (const termo of ['Ferramenta por papel', 'Lead: Claude Code', 'Backend, Security e Ops', '--agent claude', '--agent codex', 'AGENTS.md', 'claude-opus-5-5', 'gpt-6.1-sol', 'contrato da API', 'cota', 'comenta na issue onde parou', 'mesma branch', 'ao menos uma revisão da outra ferramenta', '--agente'])
  checar(`sessões: Lead e ferramenta por papel (${termo})`, secaoFerramentas.includes(termo));
const regraAntiga = ARQUIVOS_VIVOS.flatMap((f) => readFileSync(f, 'utf8').split('\n').map((l, i) => (/nunca as duas|nunca os dois|Agente principal:|um agente principal|uma ferramenta por projeto/i.test(l) ? `${f.slice(RAIZ.length + 1)}:${i + 1}` : null)).filter(Boolean));
checar('regra de um agente principal fora do histórico (decisão 013)', regraAntiga.length === 0, regraAntiga.slice(0, 5).join(', '));
const issueModelo = ler('modelos/issue-tarefa.yml');
checar('issue: campos "Plano e passo" e "Ferramenta" (a issue basta numa passagem)', issueModelo.includes('label: Plano e passo') && issueModelo.includes('label: Ferramenta'));
checar('memória do projeto: anota a ferramenta e as passagens por tarefa', ler('modelos/memoria-do-projeto.md').includes('passagens'));
checar('sessões: sem o modo back no Codex e front no Claude (substituído pela decisão 010)', !sessoes.includes('### Back e front com agentes diferentes'));
checar('sessões: não diz que a Lead é sempre Claude', !/sempre Claude/i.test(sessoes) && !sessoes.includes('A Lead e os agentes são Claude Code'));
checar('decisão 007 substituída pela 010', ler('decisoes/007-back-com-codex-e-front-com-claude.md').includes('substituída por [010]'));
checar('decisão 008: a ferramenta por tema substituída pela 010', ler('decisoes/008-agentes-especialistas.md').includes('decisão 010'));

// Cada papel usa a estrutura das personas do Agent Skills e acrescenta os limites do método.
const HARNESS_PARTES = ['## Entradas', '## Abordagem', '## Verificação', '## Formato da resposta', '## Regras', '## Composição'];
const HARNESSES = ['lead', 'architect', 'backend', 'frontend', 'designer', 'security', 'product', 'ops'];
const HARNESS_PROPRIO = {
  architect: ['contrato da API', 'portão'],
  backend: ['worker-start', '--parent', '--worktree new-child', 'contrato da API'],
  frontend: ['worker-start', '--parent', '--worktree new-child', 'design system', 'accessibility-auditor', 'web-performance-auditor'],
  designer: ['processo/telas/', 'tokens.json', 'use_figma', 'design system', 'não tem Builders', 'nunca escreve código', 'do token à tela', 'processo/telas/design-system.md'],
  security: ['mapa de riscos', 'needs_validation', 'modo de orientação', 'security-auditor', '`security-audit`', 'antes da primeira publicação'],
  product: ['critérios de aceite', 'entrevista'],
  ops: ['worker-start', '--parent', 'portão', 'merge_ready', 'recuperação'],
  lead: ['gate-create', 'gate-resolve', 'code-reviewer', 'test-engineer', 'Básico', 'Padrão', 'Profundo'],
};
const partesEmOrdem = (texto) =>
  JSON.stringify(texto.match(/^## .+$/gm)) === JSON.stringify(HARNESS_PARTES);
const modeloHarness = ler('modelos/agentes/_modelo-harness.md');
checar('agentes: modelo segue a estrutura de persona', partesEmOrdem(modeloHarness) && modeloHarness.startsWith('---\nname:'));
checar('agentes: modelo cita as personas de referência', modeloHarness.includes('github.com/addyosmani/agent-skills/'));
function checarHarness(nome) {
  const arquivo = `modelos/agentes/${nome}.md`;
  const texto = ler(arquivo);
  checar(`agentes: existe ${arquivo}`, texto.length > 0);
  checar(`agentes/${nome}: seções de persona em ordem`, partesEmOrdem(texto));
  checar(`agentes/${nome}: frontmatter com nome, descrição e gatilho`, new RegExp(`^---\\nname: ${nome}\\ndescription: [^\\n]+\\n---\\n`).test(texto));
  checar(`agentes/${nome}: sem selo de rascunho (decisão 011)`, !texto.includes('**Maturidade:**'));
  for (const termo of ['**Ferramenta:**', '**Esforço:**', '## Regras', '## Composição', `processo/referencias/${nome}.md`])
    checar(`agentes/${nome}: ${termo}`, texto.includes(termo));
  const cabecalho = texto.split('\n## ')[0];
  checar(`agentes/${nome}: a ferramenta é a do papel (Ferramenta por papel), com o modelo de cada uma`, cabecalho.includes('Ferramenta por papel') && cabecalho.includes('claude-opus-5-5') && cabecalho.includes('gpt-6.1-sol'));
  checar(`agentes/${nome}: lê o arquivo da sua ferramenta (CLAUDE.md ou AGENTS.md)`, texto.includes('CLAUDE.md') && texto.includes('AGENTS.md'));
  const comandos = texto.split('\n').filter((l) => l.includes('worker-start --') || /^\s*\| .* \| `--agent/.test(l));
  checar(`agentes/${nome}: não fixa a ferramenta no worker-start (usa --agent <agente> --model <modelo>)`, comandos.every((l) => l.includes('--agent <agente> --model <modelo>') && !/--agent (claude|codex)\b/.test(l)), comandos.find((l) => !l.includes('--agent <agente>')) || '');
  if (nome === 'lead') checar('agentes/Lead: integra e cria portões (gh pr merge, gate-create)', texto.includes('gh pr merge') && texto.includes('gate-create'));
  else checar(`agentes/${nome}: nunca integra e fala pelo Orca (orca orchestration)`, /nunca integra/i.test(texto) && texto.includes('orca orchestration'));
  checar(`agentes/${nome}: sem links relativos (o harness vai para dentro do projeto)`, !/\]\((?!https?:)/.test(texto));
  for (const termo of HARNESS_PROPRIO[nome] || []) checar(`agentes/${nome}: ${termo}`, texto.includes(termo));
  const regras = (texto.split('## Regras')[1] || '').split('\n## ')[0];
  const composicao = (texto.split('## Composição')[1] || '').split('\n## ')[0];
  if (nome !== 'lead') {
    checar(`agentes/${nome}: nunca integra segundo as regras`, /nunca integra/i.test(regras));
    checar(`agentes/${nome}: aparece no Orca na sua worktree, filha da principal (sem --worktree current nem new-top-level)`, texto.includes(`**Onde trabalha:** na sua worktree \`${nome}\`, filha da worktree principal`) && !texto.includes('--worktree current') && !texto.includes('new-top-level'));
    checar(`agentes/${nome}: sobe a decisão com orca orchestration send --type escalation`, composicao.includes('--type escalation'));
    checar(`agentes/${nome}: manda memória e consumo à Lead (--type status), sem escrever na memória do projeto`, texto.includes('--type status') && !/grava o estado na memória|Anota o consumo/.test(texto));
  } else {
    checar('agentes/Lead: grava as notas que os especialistas mandam', texto.includes('notas que os especialistas mandam'));
    checar('agentes/Lead: abre cada especialista na worktree filha da principal (sem --worktree current nem new-top-level)', !texto.includes('--worktree current') && !texto.includes('new-top-level'));
  }
}
for (const nome of HARNESSES) checarHarness(nome);
// Decisão 013: cada Builder tem nome com papel, issue, resumo e ferramenta; a worktree fica curta
for (const [nome, papel] of [['backend', 'Backend'], ['frontend', 'Frontend'], ['ops', 'Ops']]) {
  const abre = ler(`modelos/agentes/${nome}.md`).split('\n').filter((l) => l.includes('worker-start --'));
  checar(`agentes/${nome}: abre a Builder com --name ${nome}-<N>-<slug> e --display-name "${papel} Builder #<N> · <resumo> · <ferramenta>"`, abre.length > 0 && abre.every((l) => l.includes(`--name ${nome}-<N>-<slug>`) && l.includes(`--display-name "${papel} Builder #<N> · <resumo> · <ferramenta>"`)));
}
const comandoLead = lead.split('\n').find((l) => l.includes('worker-start --')) || '';
checar('agentes/lead: usa worktree filha e nome do papel ao iniciar especialista', ['--worktree new-child', '--display-name <Papel>', 'processo/agentes/<papel>.md'].every((termo) => comandoLead.includes(termo)));
checar('sessões: nome da Builder (Builder #<issue> · <resumo> · <ferramenta>) e a issue como identidade única', sessoes.includes('Builder #<issue> · <resumo> · <ferramenta>') && sessoes.includes('identidade única') && sessoes.includes('`backend-12-login`, branch `backend/12-login`'));
const subsecaoEsp = (sessoes.split('### Com agentes especialistas')[1] || '').split('\n## ')[0];
for (const termo of ['processo/agentes/', '--parent', '9 sessões', 'Nested worker depth', 'substitui o limite', 'contrato da API passa para o Architect', 'contam dentro das 9', 'filha da worktree principal'])
  checar(`sessões: com agentes especialistas (${termo})`, subsecaoEsp.includes(termo));
checar('fluxo: modo com agentes especialistas na Fase 3', (fluxo.split('## Fase 3')[1] || '').split('## Fase 4')[0].includes('especialistas'));
checar('prompt da Lead do Orca: aponta para o harness da Lead no modo com especialistas', promptCoord.includes('lead.md'));
for (const termo of ['modelos/agentes/', '--especialistas', 'Nested worker depth'])
  checar(`README: modo com agentes especialistas (${termo})`, readme.includes(termo));

const testes = ler('nucleo/03-skills-e-testes.md');
for (const termo of ['## security-audit', 'Cloudflare', 'modo de orientação', 'Fase 2', 'Fase 7', 'escopo', 'processo/seguranca.md', '## Testes: micro e macro', '## Verificação no navegador'])
  checar('testes e auditoria: ' + termo, testes.toLowerCase().includes(termo.toLowerCase()));
checar('Security: usa a security-audit desde o primeiro mapa de riscos', ler('modelos/agentes/security.md').includes('desde o primeiro mapa de riscos'));
checar('referências do Security: aprendizados da security-audit', ler('modelos/referencias/security.md').includes('## Auditoria completa (security-audit da Cloudflare)'));

const refs = ler('nucleo/04-referencias-e-engenharia-reversa.md');
for (const termo of ['## Quando usar a engenharia reversa', 'Não copie', 'título exato', 'curl', '## Passo a passo para um site público', '## Limites legais e éticos', 'observação', 'inferência'])
  checar(`referências: ${termo}`, refs.includes(termo));

const git = ler('nucleo/05-git-github-e-ci.md');
for (const termo of ['Conventional Commits', 'gh api -X PUT', 'required_status_checks', '## Proteção da main', '## Worktrees', '## Higiene de dados pessoais'])
  checar(`git/GitHub/CI: ${termo}`, git.includes(termo));

for (const arquivo of NUCLEO) {
  const palavras = ler(arquivo).split(/\s+/).filter(Boolean).length;
  checar(`${arquivo}: tem corpo suficiente`, palavras >= 350, `${palavras} palavras`);
}

// 2b) Lições e decisões
const arquivosLicao = listar('licoes');
checar('lições: pelo menos 12 arquivos', arquivosLicao.length >= 12, `achei ${arquivosLicao.length}`);
arquivosLicao.forEach((nome, i) => {
  const t = ler(`licoes/${nome}`);
  checar(`licoes/${nome}: nome NNN-slug`, /^\d{3}-[a-z0-9-]+\.md$/.test(nome));
  checar(`licoes/${nome}: numeração sequencial`, nome.startsWith(String(i + 1).padStart(3, '0')));
  checar(`licoes/${nome}: título "# NNN · ..."`, new RegExp(`^# ${nome.slice(0, 3)} · .+`, 'm').test(t));
  for (const campo of ['**O que aconteceu:**', '**Causa:**', '**Regra:**']) checar(`licoes/${nome}: tem ${campo}`, t.includes(campo));
});
const indiceLicoes = spawnSync('node', [join(RAIZ, 'scripts/gerar-indice-licoes.mjs'), '--check'], { encoding: 'utf8' });
checar('licoes/_indice.md está atualizado (gerar-indice-licoes.mjs --check)', indiceLicoes.status === 0, (indiceLicoes.stdout + indiceLicoes.stderr).trim().slice(0, 140));

for (const pasta of ['casos', 'cenarios'])
  checar(`estrutura: pasta ${pasta} removida`, !existsSync(join(RAIZ, pasta)));
const referenciasRemovidas = ARQUIVOS_VIVOS.filter((f) => /\b(?:casos|cenarios)\/|nada entra sem um caso real|cenários aplicados/i.test(readFileSync(f, 'utf8')));
checar('estrutura: fluxo ativo sem dependências de casos e cenários', referenciasRemovidas.length === 0, referenciasRemovidas.map((f) => relative(RAIZ, f)).join(', '));

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
// Decisão 013: versão 4.0.0, a decisão registrada e as decisões antigas apontando para ela
const d013 = ler('decisoes/013-lead-e-builders-com-codex-e-claude.md');
checar('decisão 013: existe, aceita sem caso real', d013.includes('**Status:** aceita') && d013.includes('sem caso real'));
for (const n of ['001-sessoes-divididas-integradora-e-trabalhadoras', '007-back-com-codex-e-front-com-claude', '008-agentes-especialistas', '010-um-agente-principal-por-projeto'])
  checar(`decisão ${n.slice(0, 3)}: o status aponta para a decisão 013`, ((ler(`decisoes/${n}.md`).match(/^\*\*Status:\*\*.*$/m) || [''])[0]).includes('013-lead-e-builders-com-codex-e-claude.md'));
checar('VERSION: 4.0.0 ou maior (decisão 013)', Number(versao.split('.')[0]) >= 4, versao);
// Decisão 014: o ciclo de um bug, do registro ao aprendizado
const bugForm = ler('modelos/issue-bug.yml');
for (const id of ['aconteceu', 'esperado', 'reproduzir', 'onde', 'evidencia'])
  checar(`issue de bug: campo obrigatório ${id}`, bugForm.split('  - type:').some((b) => b.includes(`id: ${id}\n`) && b.includes('required: true')));
checar('issue de bug: rótulo bug e a triagem da Lead', bugForm.includes('labels: ["bug"]') && bugForm.includes('Lead'));
const cicloBug = (ler('nucleo/02-sessoes-e-papeis.md').split('## Ciclo de um bug')[1] || '').split('\n## ')[0];
for (const termo of ['issue de bug', 'incidente', 'gatilho', 'causa raiz', 'falha por causa do bug', 'fora do escopo', 'issue nova', 'revisão cruzada', 'comportamento combinado', 'Correção urgente', 'reverter', 'lição'])
  checar(`sessões: ciclo de um bug (${termo})`, cicloBug.includes(termo));
checar('ciclo de um bug: a Lead não passa um bug à frente do que a pessoa priorizou', cicloBug.includes('prioridade já aprovada') && !cicloBug.includes('sem perguntar'));
for (const id of ['impacto', 'arquivos_permitidos', 'arquivos_proibidos', 'ferramenta'])
  checar(`issue de bug: campo ${id} que a Lead preenche antes de entregar`, bugForm.includes(`id: ${id}\n`));
checar('ciclo de um bug: a Lead completa a issue antes de entregar à Builder', cicloBug.includes('arquivos permitidos e proibidos') && cicloBug.toLowerCase().includes('antes de entregar'));
checar('prompt da Builder: bug fora do escopo vira issue nova', ler('modelos/prompt-builder.md').includes('fora do escopo'));
checar('CLAUDE.md do projeto: bug fora do escopo vira issue nova', ler('modelos/CLAUDE-projeto.md').includes('fora do escopo'));
checar('agentes/lead: faz a triagem dos bugs', ler('modelos/agentes/lead.md').includes('triagem dos bugs'));
checar('decisão 014: aceita sem caso real', ler('decisoes/014-fluxo-de-correcao-de-bugs.md').includes('sem caso real'));
// Revisão final (Codex) da 4.0.0: o que ainda contradizia a decisão 013
checar('agentes/lead: merge sem gatilho não vai mais à pessoa (parte 8)', !ler('modelos/agentes/lead.md').includes('sempre por um portão: merge,'));
checar('CLAUDE.md do projeto: integrar PR sem gatilho não pede confirmação', !ler('modelos/CLAUDE-projeto.md').includes('push, abrir ou integrar PR, deploy') && ler('modelos/CLAUDE-projeto.md').includes('gatilho'));
checar('AGENTS.md do projeto: "nunca integre" vale para quem não é a Lead', ler('modelos/AGENTS-projeto.md').includes('**Se você não é a Lead, nunca integre**'));
for (const p of ['modelos/agentes/architect.md', 'modelos/prompt-lead-orca.md'])
  checar(`${p}: mudança aditiva no contrato fica com a Lead; a que quebra, com a pessoa`, ler(p).includes('aditiva') && ler(p).includes('quebra'));
checar('README: a apresentação não fala mais em uma ferramenta por projeto', !ler('README.md').includes('uma ferramenta por projeto') && readme.includes('decisoes/013-lead-e-builders-com-codex-e-claude.md'));
const issueReq = ler('modelos/issue-tarefa.yml').split('  - type:');
for (const id of ['impacto', 'ferramenta'])
  checar(`issue: campo ${id} obrigatório`, issueReq.some((b) => b.includes(`id: ${id}\n`) && b.includes('required: true')));
checar('issue: plano pode ficar em branco', issueReq.some((b) => b.includes('id: plano\n') && !b.includes('required: true')));
checar('prompt da Lead: a issue leva o plano e o passo e a ferramenta', ler('modelos/prompt-lead.md').includes('plano e passo') && ler('modelos/prompt-lead.md').includes('ferramenta'));
checar('fluxo: a Lead fica no Claude Code por padrão (linha Lead: do projeto)', (fluxo.split('## Fase 3')[1] || '').split('## Fase 4')[0].includes('por padrão') && (fluxo.split('## Fase 3')[1] || '').split('## Fase 4')[0].includes('Lead:'));
checar('README: a Lead abre na ferramenta da linha Lead: do projeto', !ler('README.md').includes('num agente Claude Code: ela distribui'));
checar('sessões: com uma ferramenta só, a revisão cruzada não se aplica', sessoes.includes('Com uma ferramenta só'));
const FRASES_RUINS = ['Architect de agentes', '### Security e dados', 'Da Security', 'a Lead ou a Lead', 'o Architect, dona', '**Contrato da API:** dona', '9. **Security:**'];
const ruins = ARQUIVOS_VIVOS.flatMap((f) => { const t = readFileSync(f, 'utf8'); return FRASES_RUINS.filter((x) => t.includes(x)).map((x) => `${f.slice(RAIZ.length + 1)}: ${x}`); });
checar('troca de nomes sem frases quebradas (assunto virou papel, concordância, duplicação)', ruins.length === 0, ruins.join('; '));
// Decisão 015: requisitos descritos pelo Product e identidade e telas no Figma, registradas em processo/telas/, antes do código
const modReq = ler('modelos/modelo-requisitos.md');
for (const termo of ['R-01', 'História', 'Regras de negócio', 'Casos de erro', 'Critérios de aceite', 'Dependências', 'Telas', 'Valor', 'Esforço', 'Risco', 'Prioridade proposta'])
  checar(`modelo de requisitos: ${termo}`, modReq.includes(termo));
const fase2 = (fluxo.split('## Fase 2')[1] || '').split('## Fase 3')[0];
for (const termo of ['requisitos', 'identidade', 'todas as telas', 'Figma', 'processo/telas/', 'antes do plano'])
  checar(`fluxo: a Fase 2 cobre ${termo}`, fase2.includes(termo));
checar('aprovações: tela nova não fica mais com a Lead; todas as telas são da pessoa', !portoes.includes('Telas seguintes') && portoes.includes('todas as telas'));
const harnessProduct = ler('modelos/agentes/product.md');
checar('agentes/product: escreve as fichas R-xx com o peso', harnessProduct.includes('processo/requisitos.md') && harnessProduct.includes('R-') && harnessProduct.includes('peso'));
const harnessFront = ler('modelos/agentes/frontend.md');
checar('agentes/frontend: só constrói a partir das telas do Designer registradas em processo/telas/ (decisão 017)', ['Designer', 'processo/telas/', 'tokens.json', 'get_design_context'].every((t) => harnessFront.includes(t)));
const harnessDes = ler('modelos/agentes/designer.md');
checar('agentes/designer: identidade e todas as telas no Figma antes de qualquer código, registradas em processo/telas/', ['use_figma', 'processo/telas/', 'antes do código', 'get_variable_defs', 'get_screenshot'].every((t) => harnessDes.includes(t)));
for (const form of ['modelos/issue-tarefa.yml', 'modelos/issue-bug.yml'])
  checar(`${form}: campo obrigatório requisitos`, ler(form).split('  - type:').some((b) => b.includes('id: requisitos\n') && b.includes('required: true')));
checar('modelo de PR: requisitos atendidos e telas conferidas', ler('modelos/pull_request_template.md').includes('Requisitos atendidos') && ler('modelos/pull_request_template.md').includes('processo/telas/'));
for (const p of ['modelos/CLAUDE-projeto.md', 'modelos/AGENTS-projeto.md'])
  checar(`${p}: nenhuma tela codada sem estar aprovada em processo/telas/; mudança começa no Figma`, ler(p).includes('processo/telas/') && ler(p).includes('Figma'));
checar('README: instala o MCP do Figma no Codex', ler('README.md').includes('codex mcp add figma --url https://mcp.figma.com/mcp'));
checar('decisão 015: aceita sem caso real', ler('decisoes/015-requisitos-e-telas-antes-do-codigo.md').includes('sem caso real'));
// Revisão do Codex da 5.0.0
for (const p of ['modelos/prompt-lead.md', 'modelos/prompt-lead-orca.md', 'modelos/prompt-builder.md'])
  checar(`${p}: requisitos e telas aprovadas (decisão 015)`, ler(p).includes('processo/requisitos.md') && ler(p).includes('processo/telas/'));
checar('sessões: a especificação da tarefa leva os requisitos e as telas', (sessoes.split('**Ciclo de uma tarefa:**')[1] || '').slice(0, 600).includes('requisitos (R-xx)'));
checar('fluxo: o portão da Fase 2 só exige identidade e telas com interface', /\(com interface\)/.test((fase2.split('- **Portão:**')[1] || '').split('\n')[0]));
checar('sessões: Frontend presente em tarefa de interface', /\| Frontend \|.*\| em tarefa de interface \|/.test(sessoes));
checar('modelo de requisitos: sem link relativo (é copiado para processo/requisitos.md)', !/\]\((?!https?:)[^)]+\)/.test(modReq));
checar('VERSION: 5.0.0 ou maior (decisão 015)', Number(versao.split('.')[0]) >= 5, versao);
checar('VERSION: 7.0.0 ou maior (agente Designer, decisão 017)', Number(versao.split('.')[0]) >= 7, versao);
const designerTxt = ler('modelos/agentes/designer.md');
const frontendTxt = ler('modelos/agentes/frontend.md');
checar('017: o Designer cria identidade e telas; o Frontend só lê o Figma e constrói', designerTxt.includes('identidade') && !frontendTxt.includes('Criar a identidade e as telas no Figma') && frontendTxt.includes('Designer') && !/use_figma/.test(frontendTxt));
checar('017: o Designer não integra, não tem Builders e não codifica', /nunca integra/i.test(designerTxt) && designerTxt.includes('não tem Builders') && designerTxt.includes('nunca escreve código'));
const fluxo01 = ler('nucleo/01-fluxo-de-ponta-a-ponta.md');
checar('017: o Designer sempre pede referências à pessoa (pela Lead) antes de criar, e não cria sem elas', designerTxt.includes('Sempre pede referências antes de criar') && designerTxt.includes('não começa a identidade sem as referências') && fluxo01.includes('referências da pessoa'));
checar('017: ordem referências → identidade → telas nos formatos desejados', designerTxt.includes('referências → identidade → telas') && fluxo01.includes('referências → identidade → telas') && designerTxt.includes('formatos'));
checar('017: mobile-first quando há celular (Designer, skill de telas e núcleo 01)', /mobile-first/i.test(designerTxt) && /mobile-first/i.test(fluxo01) && /mobile-first/i.test(harnessFront));
checar('017: núcleo 02 lista o Designer na tabela dos agentes', ler('nucleo/02-sessoes-e-papeis.md').includes('| Designer |'));
checar('VERSION: 3.0.0 ou maior (um agente principal por projeto, decisão 010)', versao.split('.').map(Number).reduce((acc, n, i) => acc || (n !== [3, 0, 0][i] ? (n > [3, 0, 0][i] ? 'maior' : 'menor') : ''), '') !== 'menor', versao);

const claude = ler('CLAUDE.md').toLowerCase();
for (const termo of ['## Objetivo deste repositório', '## Como esta sessão trabalha', '## Estrutura', '## Como acrescentar', 'scripts/verificar.mjs', 'não toque', 'responda em português'])
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
for (const id of ['objetivo', 'criterios', 'arquivos_permitidos', 'arquivos_proibidos', 'testes_micro', 'testes_macro'])
  checar(`formulário de tarefa tem ${id}`, new RegExp(`id:\\s*${id}\\b`).test(form));
const ci = ler('modelos/ci-node.yml');
for (const termo of ['actions/checkout@v4', 'actions/setup-node@v4', 'npm ci', 'permissions:', 'concurrency:'])
  checar(`ci-node.yml: ${termo}`, ci.includes(termo));
// Sem package.json (projeto recém-criado), o CI pula os passos de Node e avisa
const passosCi = ci.split(/\n(?=      - )/).slice(1);
const passosNode = passosCi.filter((p) => /setup-node|npm /.test(p));
checar('ci-node.yml: confere se a stack já foi definida (package.json) e avisa', /id:\s*stack\b/.test(ci) && ci.includes('-f package.json') && ci.includes('::warning::'));
checar('ci-node.yml: todos os passos de Node dependem da stack definida', passosNode.length >= 5 && passosNode.every((p) => p.includes("if: steps.stack.outputs.definida == 'sim'")), `passos de Node: ${passosNode.length}`);
const prTemplate = ler('modelos/pull_request_template.md');
for (const termo of ['Impacto e motivo:', '## Aceite e evidências', '## Validação da Lead'])
  checar(`modelo de PR: ${termo}`, prTemplate.includes(termo));
const promptTrab = ler('modelos/prompt-builder.md');
checar('prompt da Builder exige TDD e proíbe merge', promptTrab.includes('TDD: escreva o teste primeiro') && /NÃO faça merge/.test(promptTrab));
const promptInt = ler('modelos/prompt-lead.md');
checar('prompt da Lead exige o navegador', /navegador/i.test(promptInt));

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
    const extra = rodar(alvo, 'site-estatico');
    checar('novo-projeto.sh recusa argumento posicional antigo antes de criar arquivos', extra.status !== 0 && extra.stderr.includes('Uso:') && readdirSync(alvo).length === 0, extra.stderr);
    const ok = rodar(alvo);
    checar('novo-projeto.sh conclui com apenas a pasta do projeto', ok.status === 0, ok.stderr);
    for (const arq of ['CLAUDE.md', 'AGENTS.md', '.github/ISSUE_TEMPLATE/tarefa.yml', '.github/ISSUE_TEMPLATE/bug.yml', '.github/pull_request_template.md', '.github/workflows/ci.yml', 'processo/scripts/nova-tarefa.sh', 'processo/scripts/remover-tarefa.sh', 'processo/DESENVOLVIMENTO.md', 'processo/memoria-do-projeto.md'])
      checar(`novo-projeto.sh cria ${arq}`, existsSync(join(alvo, arq)));
    // Decisão 016: o processo mora em processo/; a raiz do projeto é do código
    checar('016: a raiz do projeto novo só tem .github, AGENTS.md, CLAUDE.md e processo', JSON.stringify(readdirSync(alvo).sort()) === JSON.stringify(['.github', 'AGENTS.md', 'CLAUDE.md', 'processo']), readdirSync(alvo).join(','));
    const claude016 = existsSync(join(alvo, 'CLAUDE.md')) ? readFileSync(join(alvo, 'CLAUDE.md'), 'utf8') : '';
    checar('016: o CLAUDE.md do projeto importa @processo/ e diz que a raiz é do código', claude016.includes('@processo/DESENVOLVIMENTO.md') && claude016.includes('@processo/memoria-do-projeto.md') && claude016.includes('a raiz é do código'));
    const segunda = rodar(alvo);
    checar('016: segunda execução recusa e cita processo/DESENVOLVIMENTO.md sem sobrescrever', segunda.status !== 0 && segunda.stderr.includes('processo/DESENVOLVIMENTO.md'), segunda.stderr);
    const alvo_esp016 = join(base, 'projeto-016-especialistas');
    mkdirSync(alvo_esp016);
    rodar(alvo_esp016, '--especialistas');
    checar('016: --especialistas põe os harnesses em processo/agentes/', existsSync(join(alvo_esp016, 'processo/agentes/lead.md')));
    const dev = existsSync(join(alvo, 'processo/DESENVOLVIMENTO.md')) ? readFileSync(join(alvo, 'processo/DESENVOLVIMENTO.md'), 'utf8') : '';
    checar('novo-projeto.sh carimba a versão do método', dev.includes(`Versão do método: ${versao}`));
    checar('novo-projeto.sh ensina o fluxo por impacto no documento gerado', ['## Impacto da tarefa', 'Básico', 'Padrão', 'Profundo'].every((termo) => dev.includes(termo)) && !dev.includes('Cenários aplicados'));
    checar('novo-projeto.sh: DESENVOLVIMENTO.md explica o modo Orca', dev.includes('Orca'));
    checar('novo-projeto.sh: DESENVOLVIMENTO.md cita o AGENTS.md', dev.includes('AGENTS.md'));
    const linhaPapel = (texto, papel) => (texto.match(new RegExp(`^\\| ${papel} \\| ([^|]+) \\|`, 'm')) || [])[1]?.trim();
    const PAPEIS = ['Lead', 'Product', 'Architect', 'Frontend', 'Designer', 'Backend', 'Security', 'Ops'];
    checar('novo-projeto.sh: sem --agente, Lead no Claude Code e a tabela Ferramenta por papel (Backend, Security e Ops no Codex)', dev.includes('Lead: Claude Code') && dev.includes('## Ferramenta por papel') && PAPEIS.every((p) => linhaPapel(dev, p) === (['Backend', 'Security', 'Ops'].includes(p) ? 'Codex' : 'Claude Code')), PAPEIS.map((p) => `${p}=${linhaPapel(dev, p)}`).join(' '));
    checar('novo-projeto.sh: DESENVOLVIMENTO.md sem o back no Codex e o front no Claude', !dev.includes('Back com o Codex e front com o Claude'));
    checar('novo-projeto.sh: DESENVOLVIMENTO.md tem a seção Aprovações com os seis gatilhos', dev.includes('## Aprovações') && ['o que** será construído', 'desfazer', 'usuários reais', 'dinheiro ou muita cota', 'aceita um risco', 'regras do jogo'].every((g) => (dev.split('## Aprovações')[1] || '').includes(g)));
    const memProj = existsSync(join(alvo, 'processo/memoria-do-projeto.md')) ? readFileSync(join(alvo, 'processo/memoria-do-projeto.md'), 'utf8') : '';
    checar('novo-projeto.sh: memória anota agente e retrabalho por tarefa', memProj.includes('retrabalho'));
    // AGENTS.md do projeto: o Codex lê este arquivo, não o CLAUDE.md (decisão 007)
    const agentsProj = existsSync(join(alvo, 'AGENTS.md')) ? readFileSync(join(alvo, 'AGENTS.md'), 'utf8') : '';
    checar('novo-projeto.sh: gera instruções sem as integrações removidas', [dev, agentsProj].every((doc) => !integracoesRemovidas.test(doc)) && !existsSync(join(alvo, '.claude-plugin')));
    checar('novo-projeto.sh: AGENTS.md carimba a versão do método', agentsProj.includes(`Versão do método: ${versao}`));
    for (const termo of ['CLAUDE.md', 'processo/DESENVOLVIMENTO.md', 'processo/memoria-do-projeto.md', 'escreva o teste antes do código', 'orca orchestration ask'])
      checar(`novo-projeto.sh: AGENTS.md cita ${termo}`, agentsProj.includes(termo));
    checar('novo-projeto.sh: cria processo/requisitos.md, processo/telas/ e a linha Telas:', existsSync(join(alvo, 'processo/requisitos.md')) && existsSync(join(alvo, 'processo/telas')) && dev.includes('Telas:'));
    checar('novo-projeto.sh: AGENTS.md diz que a ferramenta vem do papel (Ferramenta por papel, prompt da Lead)', agentsProj.includes('Ferramenta por papel') && agentsProj.includes('prompt-lead-orca.md'));
    const alvo_codex = join(base, 'projeto-codex');
    mkdirSync(alvo_codex);
    const codex = rodar(alvo_codex, '--agente', 'codex');
    const devCodex = existsSync(join(alvo_codex, 'processo/DESENVOLVIMENTO.md')) ? readFileSync(join(alvo_codex, 'processo/DESENVOLVIMENTO.md'), 'utf8') : '';
    checar('novo-projeto.sh --agente codex põe a Lead e todos os papéis no Codex', codex.status === 0 && devCodex.includes('Lead: Codex') && PAPEIS.every((p) => linhaPapel(devCodex, p) === 'Codex') && !devCodex.includes('codex ('), codex.stderr);
    const alvo_claude = join(base, 'projeto-claude');
    mkdirSync(alvo_claude);
    const soClaude = rodar(alvo_claude, '--agente', 'claude');
    const devClaude = existsSync(join(alvo_claude, 'processo/DESENVOLVIMENTO.md')) ? readFileSync(join(alvo_claude, 'processo/DESENVOLVIMENTO.md'), 'utf8') : '';
    checar('novo-projeto.sh --agente claude põe todos os papéis no Claude Code', soClaude.status === 0 && devClaude.includes('Lead: Claude Code') && PAPEIS.every((p) => linhaPapel(devClaude, p) === 'Claude Code'), soClaude.stderr);
    for (const vazio of [['--agente', ''], ['--agente=']]) {
      const alvo_vazio = join(base, `projeto-agente-vazio-${vazio.length}`);
      mkdirSync(alvo_vazio);
      const r = rodar(alvo_vazio, ...vazio);
      checar(`novo-projeto.sh recusa ${vazio.join(' ')} sem valor, sem criar nada`, r.status !== 0 && !existsSync(join(alvo_vazio, 'CLAUDE.md')), r.stderr);
    }
    const alvo_invalido = join(base, 'projeto-agente-invalido');
    mkdirSync(alvo_invalido);
    const invalidoAg = rodar(alvo_invalido, '--agente', 'cursor');
    checar('novo-projeto.sh recusa agente principal que não é claude nem codex, sem criar nada', invalidoAg.status !== 0 && invalidoAg.stderr.includes('claude') && !existsSync(join(alvo_invalido, 'CLAUDE.md')), invalidoAg.stderr);
    checar('novo-projeto.sh: AGENTS.md sem marcadores nem caminhos de pasta', agentsProj.length > 0 && !agentsProj.includes('{{') && !agentsProj.includes(RAIZ));
    // CLAUDE.md do projeto: toda sessão já nasce com o contexto; nunca sobrescreve um que já exista
    const claudeProj = existsSync(join(alvo, 'CLAUDE.md')) ? readFileSync(join(alvo, 'CLAUDE.md'), 'utf8') : '';
    checar('novo-projeto.sh: CLAUDE.md gerado sem as integrações removidas', !integracoesRemovidas.test(claudeProj));
    checar('novo-projeto.sh: CLAUDE.md carimba a versão do método', claudeProj.includes(`Versão do método: ${versao}`));
    checar('novo-projeto.sh: CLAUDE.md importa o DESENVOLVIMENTO.md e a memória', claudeProj.includes('@processo/DESENVOLVIMENTO.md') && claudeProj.includes('@processo/memoria-do-projeto.md'));
    checar('novo-projeto.sh: o projeto consulta a cópia local do método', [claudeProj, agentsProj].every((doc) => doc.includes('cópia local de AI Development')) && dev.includes('Cópia local do método:'));
    checar('novo-projeto.sh: CLAUDE.md explica o modo Orca e a atualização do projeto', claudeProj.includes('Orca') && claudeProj.includes('CHANGELOG.md'));
    checar('novo-projeto.sh: CLAUDE.md diz que a ferramenta vem do papel (--agent claude ou --agent codex)', claudeProj.includes('Ferramenta por papel') && claudeProj.includes('--agent claude') && claudeProj.includes('--agent codex') && claudeProj.includes('AGENTS.md') && !/sempre Claude/i.test(claudeProj));
    checar('novo-projeto.sh: CLAUDE.md sem marcadores nem caminhos de pasta', claudeProj.length > 0 && !claudeProj.includes('{{') && !claudeProj.includes(RAIZ));
    const alvo_com_claude = join(base, 'projeto-com-claude');
    mkdirSync(alvo_com_claude);
    writeFileSync(join(alvo_com_claude, 'CLAUDE.md'), 'meu claude\n');
    const com_claude = rodar(alvo_com_claude);
    checar('novo-projeto.sh com CLAUDE.md existente conclui, avisa e não o altera', com_claude.status === 0 && com_claude.stderr.includes('CLAUDE.md') && readFileSync(join(alvo_com_claude, 'CLAUDE.md'), 'utf8') === 'meu claude\n' && existsSync(join(alvo_com_claude, 'processo/DESENVOLVIMENTO.md')), com_claude.stderr);
    const alvo_com_agents = join(base, 'projeto-com-agents');
    mkdirSync(alvo_com_agents);
    writeFileSync(join(alvo_com_agents, 'AGENTS.md'), 'meu agents\n');
    const com_agents = rodar(alvo_com_agents);
    checar('novo-projeto.sh com AGENTS.md existente conclui, avisa e não o altera', com_agents.status === 0 && com_agents.stderr.includes('AGENTS.md') && readFileSync(join(alvo_com_agents, 'AGENTS.md'), 'utf8') === 'meu agents\n' && existsSync(join(alvo_com_agents, 'CLAUDE.md')), com_agents.stderr);
    // Modo com agentes especialistas (decisão 008): só com --especialistas o projeto recebe os harnesses em processo/agentes/
    checar('novo-projeto.sh sem --especialistas não cria processo/agentes/', !existsSync(join(alvo, 'processo/agentes')));
    checar('novo-projeto.sh: CLAUDE.md cita os harnesses em processo/agentes/', claudeProj.includes('processo/agentes/'));
    checar('novo-projeto.sh: AGENTS.md cita os harnesses em processo/agentes/', agentsProj.includes('processo/agentes/'));
    checar('novo-projeto.sh: memória anota o consumo por tarefa', memProj.includes('consumo'));
    const alvo_esp = join(base, 'projeto-especialistas');
    mkdirSync(alvo_esp);
    const esp = rodar(alvo_esp, '--especialistas');
    checar('novo-projeto.sh com --especialistas conclui', esp.status === 0, esp.stderr);
    const copiados = existsSync(join(alvo_esp, 'processo/agentes')) ? readdirSync(join(alvo_esp, 'processo/agentes')).sort() : [];
    checar('novo-projeto.sh com --especialistas copia os 8 harnesses, sem o modelo', JSON.stringify(copiados) === JSON.stringify(HARNESSES.map((n) => `${n}.md`).sort()), copiados.join(', '));
    for (const nome of HARNESSES)
      checar(`novo-projeto.sh com --especialistas: processo/agentes/${nome}.md igual ao do método`, copiados.includes(`${nome}.md`) && readFileSync(join(alvo_esp, 'processo/agentes', `${nome}.md`), 'utf8') === ler(`modelos/agentes/${nome}.md`));
    const devEsp = existsSync(join(alvo_esp, 'processo/DESENVOLVIMENTO.md')) ? readFileSync(join(alvo_esp, 'processo/DESENVOLVIMENTO.md'), 'utf8') : '';
    checar('novo-projeto.sh com --especialistas: DESENVOLVIMENTO.md cita processo/agentes/ e o Nested worker depth', devEsp.includes('processo/agentes/') && devEsp.includes('Nested worker depth'));
    const alvo_esp_antes = join(base, 'projeto-opcao-antes');
    mkdirSync(alvo_esp_antes);
    const espAntes = rodar('--especialistas', alvo_esp_antes);
    checar('novo-projeto.sh aceita --especialistas antes da pasta', espAntes.status === 0 && existsSync(join(alvo_esp_antes, 'processo/agentes/lead.md')), espAntes.stderr);
    checar('novo-projeto.sh: AGENTS.md não manda o Codex falar com a pessoa (pede pela Lead)', agentsProj.length > 0 && !agentsProj.includes('peça à pessoa'));
    const alvo_com_agentes = join(base, 'projeto-com-docs-agentes');
    mkdirSync(join(alvo_com_agentes, 'processo/agentes'), { recursive: true });
    const conf = rodar(alvo_com_agentes, '--especialistas');
    checar('novo-projeto.sh --especialistas com processo/agentes/ existente recusa sem alterar nada', conf.status !== 0 && conf.stderr.includes('processo/agentes') && !existsSync(join(alvo_com_agentes, 'CLAUDE.md')), conf.stderr);
    try {
      accessSync(join(alvo, 'processo/scripts/nova-tarefa.sh'), constants.X_OK);
      checar('novo-projeto.sh mantém os scripts executáveis', true);
    } catch {
      checar('novo-projeto.sh mantém os scripts executáveis', false);
    }
    const antes = existsSync(join(alvo, 'processo/DESENVOLVIMENTO.md')) ? readFileSync(join(alvo, 'processo/DESENVOLVIMENTO.md'), 'utf8') : '';
    writeFileSync(join(alvo, 'processo/DESENVOLVIMENTO.md'), `${antes}\nminha edição\n`);
    const alvo_telas = join(base, 'projeto-com-telas');
    mkdirSync(join(alvo_telas, 'processo/telas'), { recursive: true });
    writeFileSync(join(alvo_telas, 'processo/telas/README.md'), 'minhas telas\n');
    const comTelas = rodar(alvo_telas);
    checar('novo-projeto.sh recusa processo/telas/ existente e não cria nada', comTelas.status !== 0 && readFileSync(join(alvo_telas, 'processo/telas/README.md'), 'utf8') === 'minhas telas\n' && !existsSync(join(alvo_telas, 'CLAUDE.md')));
    const de_novo = rodar(alvo);
    checar('novo-projeto.sh não sobrescreve arquivos que já existem', de_novo.status !== 0 && readFileSync(join(alvo, 'processo/DESENVOLVIMENTO.md'), 'utf8').includes('minha edição'));
  } catch (erro) {
    checar('novo-projeto.sh: teste funcional rodou até o fim', false, String(erro).slice(0, 160));
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

for (const nome of HARNESSES)
  checar('agentes/' + nome + ': lê as lições do método', ler('modelos/agentes/' + nome + '.md').includes('licoes/_indice.md'));
checar('modelo do harness: lê as lições do método', modeloHarness.includes('licoes/_indice.md'));
checar('Ops: recebe do Security os needs_validation de infraestrutura', ler('modelos/agentes/ops.md').includes('needs_validation'));
checar('Designer: usa o roteiro de estudo de referência', ler('modelos/agentes/designer.md').includes('04-referencias-e-engenharia-reversa.md'));
for (const prompt of ['modelos/prompt-lead.md', 'modelos/prompt-builder.md'])
  checar(prompt + ': vale para as duas ferramentas', ler(prompt).includes('Codex') && ler(prompt).includes('Ferramenta por papel'));

// 4) Consistência geral
const arquivosTexto = [...todosMd(), ...['modelos/issue-tarefa.yml', 'modelos/issue-bug.yml', 'modelos/ci-node.yml', '.github/workflows/verificar.yml'].map((a) => join(RAIZ, a))].filter(existsSync);
for (const arquivo of arquivosTexto) {
  const texto = readFileSync(arquivo, 'utf8');
  const nome = relative(RAIZ, arquivo);


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

// Decisão 016: o processo mora em processo/; fora do histórico, nenhum caminho antigo
const CAMINHO_ANTIGO = /\bdocs\/(DESENVOLVIMENTO|memoria-do-projeto|requisitos|telas|agentes|referencias|seguranca|contrato-api|arquitetura|specs?)\b|(?<!processo\/)\bscripts\/(nova|remover)-tarefa/;
const comCaminhoAntigo = ARQUIVOS_VIVOS.flatMap((f) => readFileSync(f, 'utf8').split('\n').map((l, i) => (CAMINHO_ANTIGO.test(l) ? `${f.slice(RAIZ.length + 1)}:${i + 1}` : null)).filter(Boolean));
checar('016: nenhum caminho antigo (docs/…, scripts/nova-tarefa) fora do histórico', comCaminhoAntigo.length === 0, comCaminhoAntigo.slice(0, 5).join(', '));
const comDuplo = ARQUIVOS_VIVOS.filter((f) => readFileSync(f, 'utf8').includes('processo/processo'));
checar('016: nenhum processo/processo', comDuplo.length === 0, comDuplo.slice(0, 3).join(', '));
checar('016: o prefixo de branch docs/ continua em nucleo/05', ler('nucleo/05-git-github-e-ci.md').includes('`docs/` (documentação)'));
checar('016: nova-tarefa.sh ainda aceita o tipo docs', ler('modelos/nova-tarefa.sh').includes('feat|fix|chore|docs'));
checar('016: VERSION é 6.0.0 ou maior', Number(versao.split('.')[0]) >= 6, versao);
checar('016: decisão 016 existe e o CHANGELOG tem a 6.0.0', existsSync(join(RAIZ, 'decisoes/016-processo-fora-da-raiz.md')) && ler('CHANGELOG.md').includes('## 6.0.0'));
// Resultado
if (falhas.length) {
  console.log(`✗ ${falhas.length} de ${total} verificações falharam:\n`);
  for (const f of falhas.slice(0, 40)) console.log(`  - ${f}`);
  if (falhas.length > 40) console.log(`  ... e mais ${falhas.length - 40}`);
  process.exit(1);
}
console.log(`✓ ${total} verificações passaram.`);
