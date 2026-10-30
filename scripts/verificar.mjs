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
  'modelos/CLAUDE-projeto.md',
  '.claude-plugin/marketplace.json',
  'skills/novo-projeto/SKILL.md',
  'skills/consultar/SKILL.md',
  'skills/atualizar-projeto/SKILL.md',
  'modelos/prompt-coordenadora-orca.md',
  'decisoes/006-desenvolvimento-orquestrado-com-o-orca.md',
  'modelos/AGENTS-projeto.md',
  'decisoes/007-back-com-codex-e-front-com-claude.md',
  'decisoes/008-agentes-especialistas.md',
  'modelos/agentes/_modelo-harness.md',
];
for (const arquivo of OBRIGATORIOS) checar(`existe ${arquivo}`, existsSync(join(RAIZ, arquivo)));

// 2) Conteúdo mínimo de cada documento
const readme = ler('README.md');
checar('README: seção dos 7 princípios', readme.includes('## Os 7 princípios'));
const trechoPrincipios = readme.slice(readme.indexOf('## Os 7 princípios')).split(/\n## (?!Os 7)/)[0];
const principios = trechoPrincipios.split('\n').filter((l) => /^[1-7]\.\s+\*\*/.test(l));
checar('README: 7 princípios numerados', principios.length === 7, `achei ${principios.length}`);
checar('README: adoção em um projeto novo', readme.includes('## Adotar em um projeto novo'));
// Seção inteira até o próximo título de nível 2 (os ### de dentro dela continuam incluídos)
const adocao = readme.slice(readme.indexOf('## Adotar em um projeto novo')).split(/\n## (?!Adotar)/)[0];
checar('README: adoção instala o plugin', adocao.includes('/plugin install metodo --marketplace ivygabriell/AI-Development') && adocao.includes('/plugin install metodo@metodo-de-desenvolvimento'));
checar('README: adoção usa /metodo:novo-projeto', adocao.includes('/metodo:novo-projeto'));
checar('README: adoção diz o que o repositório privado exige', adocao.includes('gh auth setup-git'));
checar('README: adoção mantém o caminho manual', adocao.includes('scripts/novo-projeto.sh'));
// Modo Orca (decisão 006, rascunho): instalação e atualização de projetos existentes
checar('README: adoção instala o Orca e as skills dele', adocao.includes('https://github.com/stablyai/orca') && adocao.includes('orca skills install'));
checar('README: adoção explica como atualizar um projeto existente', adocao.includes('/metodo:atualizar-projeto'));
// Back com o Codex e front com o Claude (decisão 007, rascunho): o Codex com as mesmas ferramentas
for (const termo of ['codex plugin marketplace add', 'codex plugin add', 'codex plugin marketplace upgrade', 'codex mcp list', 'AGENTS.md'])
  checar(`README: adoção prepara o Codex (${termo})`, adocao.includes(termo));
checar('README: como o repositório cresce', readme.includes('## Como este repositório cresce'));
for (const arquivo of NUCLEO) checar(`README aponta para ${arquivo}`, readme.includes(arquivo));
for (const pasta of ['nucleo/', 'cenarios/', 'casos/', 'licoes/', 'decisoes/', 'modelos/', 'scripts/', 'skills/', 'planos/']) checar(`README cita ${pasta}`, readme.includes(pasta));

const fluxo = ler('nucleo/01-fluxo-de-ponta-a-ponta.md');
for (let fase = 0; fase <= 9; fase += 1) checar(`fluxo: Fase ${fase}`, new RegExp(`^## Fase ${fase}\\b`, 'm').test(fluxo));
checar('fluxo: Fase 9 é o fechamento (retrospectiva)', /^## Fase 9 · Fechamento/m.test(fluxo));
checar('fluxo: classificação spike/delimitada/arquitetural', /spike/i.test(fluxo) && /delimitada/i.test(fluxo) && /arquitetural/i.test(fluxo));
checar('fluxo: portões de aprovação humana', fluxo.includes('## Portões de aprovação'));

const sessoes = ler('nucleo/02-sessoes-e-papeis.md');
for (const termo of ['## Quando dividir', '## Quando NÃO dividir', 'integradora', 'trabalhadora', '## Modos de falha'])
  checar(`sessões: ${termo}`, sessoes.includes(termo));
checar('sessões: limite de sessões em paralelo (no máximo 1 integradora e 2 trabalhadoras)', /no máximo\s+\*{0,2}1 integradora e 2 trabalhadoras/i.test(sessoes));
for (const termo of ['## Com o Orca', 'coordenadora', 'orchestration worker-start', 'gate-create', 'orchestration ask'])
  checar(`sessões: modo Orca (${termo})`, sessoes.includes(termo));
checar('fluxo: Orca como modo de execução na Fase 3', (fluxo.split('## Fase 3')[1] || '').split('## Fase 4')[0].includes('Orca'));
checar('fluxo: Fase 9 consulta as conversas do Orca', (fluxo.split('## Fase 9')[1] || '').includes('orca search'));
checar('git/GitHub/CI: worktrees pelo Orca', ler('nucleo/05-git-github-e-ci.md').includes('orca worktree create'));
const promptCoord = ler('modelos/prompt-coordenadora-orca.md');
for (const termo of ['orca skills get orchestration', 'gate-create', 'pode integrar', 'superpowers:verification-before-completion', 'critérios de aceite', 'arquivos permitidos'])
  checar(`prompt da coordenadora do Orca: ${termo}`, promptCoord.includes(termo));
checar('prompt da coordenadora do Orca: agentes abertos como Claude Code (--agent claude)', promptCoord.includes('--agent claude'));
checar('sessões: no Orca os agentes são Claude Code (--agent claude)', sessoes.includes('--agent claude'));
for (const termo of ['### Back e front com agentes diferentes', '--agent codex', 'AGENTS.md', 'contrato da API'])
  checar(`sessões: back com o Codex e front com o Claude (${termo})`, sessoes.includes(termo));
for (const termo of ['--agent codex', 'contrato da API', 'AGENTS.md', 'retrabalho'])
  checar(`prompt da coordenadora do Orca: back com o Codex (${termo})`, promptCoord.includes(termo));

// Agentes especialistas (decisão 008, rascunho): cada harness tem as 10 partes, o modelo da sua ferramenta e as regras fixas
const HARNESS_PARTES = ['## 1. Missão', '## 2. Quando é chamado', '## 3. O que lê', '## 4. O que pode e o que não pode', '## 5. Skills', '## 6. Checklist do tema', '## 7. Formato da resposta', '## 8. Quando sobe a decisão', '## 9. Memória do tema', '## 10. Economia'];
const MODELO_DA_FERRAMENTA = { claude: 'claude-opus-5-5', codex: 'gpt-6.1-sol' };
const LEITURA_DA_FERRAMENTA = { claude: 'CLAUDE.md', codex: 'AGENTS.md' };
const HARNESSES = { integradora: 'claude', arquitetura: 'claude', 'back-e-dados': 'codex', 'design-e-front': 'claude', seguranca: 'codex', produto: 'claude', devops: 'codex' };
// O que cada harness precisa dizer, além das regras comuns
const HARNESS_PROPRIO = {
  integradora: ['--model gpt-6.1-sol', '--model claude-opus-5-5', '--worktree new-child --name arquitetura', '--worktree new-child --name back-e-dados', '--worktree new-child --name design-e-front', '--worktree new-child --name seguranca', '--worktree new-child --name produto', '--worktree new-child --name devops', 'contam dentro das 9'],
  arquitetura: ['contrato da API', 'portão', 'docs/referencias/arquitetura.md', '**Onde trabalha:** na sua worktree `arquitetura`, filha da worktree principal'],
  'back-e-dados': ['worker-start', '--parent', '--worktree new-child', 'contrato da API'],
  'design-e-front': ['worker-start', '--parent', '--worktree new-child', 'design system'],
  seguranca: ['mapa de riscos', 'entrega a correção', 'aprovar com ressalva', '**Onde trabalha:** na sua worktree `seguranca`, filha da worktree principal', 'MCP `rea`'],
  produto: ['critérios de aceite'],
  devops: ['worker-start', '--parent', 'portão', 'merge_ready', 'a mudança do CI é uma tarefa da sua trabalhadora'],
};
const partesEmOrdem = (texto) => {
  const posicoes = HARNESS_PARTES.map((parte) => texto.indexOf(`\n${parte}\n`));
  return posicoes.every((p, i) => p >= 0 && (i === 0 || p > posicoes[i - 1]));
};
const modeloHarness = ler('modelos/agentes/_modelo-harness.md');
checar('agentes: existe modelos/agentes/_modelo-harness.md', modeloHarness.length > 0);
checar('agentes: modelo do harness tem as 10 partes em ordem', partesEmOrdem(modeloHarness));
checar('agentes: modelo do harness diz as diferenças do bloco "O harness manda" entre os papéis', modeloHarness.includes('duas diferenças'));
checar('agentes: modelo do harness ensina a pesquisar (guardado primeiro, depois os sites, adaptar, guardar)', modeloHarness.includes('Como pesquisa') && modeloHarness.includes('docs/referencias/'));
checar('agentes: modelo do harness tem "O harness manda" (precedência, não desvia)', modeloHarness.includes('## O harness manda') && modeloHarness.includes('precedência') && modeloHarness.includes('não desvia'));
for (const termo of ['claude-opus-5-5', 'gpt-6.1-sol', '--effort'])
  checar(`agentes: modelo do harness cita ${termo}`, modeloHarness.includes(termo));
function checarHarness(nome, ferramenta) {
  const arquivo = `modelos/agentes/${nome}.md`;
  const texto = ler(arquivo);
  const outra = ferramenta === 'claude' ? 'codex' : 'claude';
  checar(`agentes: existe ${arquivo}`, texto.length > 0);
  checar(`agentes/${nome}: as 10 partes em ordem`, partesEmOrdem(texto));
  for (const termo of ['**Maturidade:** rascunho', '**Ferramenta:**', '**Esforço:**', '## O harness manda', 'superpowers:verification-before-completion', 'Como pesquisa', `docs/referencias/${nome}.md`])
    checar(`agentes/${nome}: ${termo}`, texto.includes(termo));
  checar(`agentes/${nome}: modelo ${MODELO_DA_FERRAMENTA[ferramenta]} e leitura do ${LEITURA_DA_FERRAMENTA[ferramenta]}`, texto.includes(MODELO_DA_FERRAMENTA[ferramenta]) && texto.includes(LEITURA_DA_FERRAMENTA[ferramenta]));
  if (nome !== 'integradora') checar(`agentes/${nome}: não usa o modelo da outra ferramenta (${MODELO_DA_FERRAMENTA[outra]})`, !texto.includes(MODELO_DA_FERRAMENTA[outra]));
  if (nome === 'integradora') checar('agentes/integradora: integra e cria portões (gh pr merge, gate-create)', texto.includes('gh pr merge') && texto.includes('gate-create'));
  else checar(`agentes/${nome}: nunca integra e fala pelo Orca (orca orchestration)`, /nunca integra/i.test(texto) && texto.includes('orca orchestration'));
  checar(`agentes/${nome}: sem links relativos (o harness vai para dentro do projeto)`, !/\]\((?!https?:)/.test(texto));
  for (const termo of HARNESS_PROPRIO[nome] || []) checar(`agentes/${nome}: ${termo}`, texto.includes(termo));
  // Revisão final: as regras precisam estar no lugar certo, não em qualquer parte do texto
  const manda = (texto.split('## O harness manda')[1] || '').split('\n## ')[0];
  checar(`agentes/${nome}: "O harness manda" com precedência e não desvia`, manda.includes('precedência') && manda.includes('não desvia'));
  const sobe = (texto.split('## 8. Quando sobe a decisão')[1] || '').split('\n## ')[0];
  if (nome !== 'integradora') {
    const fixas = manda.split('\n').find((l) => l.startsWith('- **Regras fixas do método:**')) || '';
    checar(`agentes/${nome}: "nunca integra" nas regras fixas`, /nunca integra/i.test(fixas));
    checar(`agentes/${nome}: aparece no Orca na sua worktree, filha da principal (sem --worktree current nem new-top-level)`, texto.includes(`**Onde trabalha:** na sua worktree \`${nome}\`, filha da worktree principal`) && !texto.includes('--worktree current') && !texto.includes('new-top-level'));
    checar(`agentes/${nome}: sobe a decisão com orca orchestration send --type escalation (parte 8)`, sobe.includes('--type escalation'));
    checar(`agentes/${nome}: manda memória e consumo à integradora (--type status), sem escrever na memória do projeto`, texto.includes('--type status') && !/grava o estado na memória|Anota o consumo/.test(texto));
  } else {
    checar('agentes/integradora: grava as notas que os especialistas mandam', texto.includes('notas que os especialistas mandam'));
    checar('agentes/integradora: abre cada especialista na worktree filha da principal (sem --worktree current nem new-top-level)', !texto.includes('--worktree current') && !texto.includes('new-top-level'));
  }
}
for (const [nome, ferramenta] of Object.entries(HARNESSES)) checarHarness(nome, ferramenta);
const subsecaoEsp = (sessoes.split('### Com agentes especialistas')[1] || '').split('\n## ')[0];
for (const termo of ['docs/agentes/', '--parent', 'O harness manda', '9 sessões', 'Nested worker depth', 'substitui o limite', 'contrato da API passa para a Arquitetura', 'contam dentro das 9', 'filha da worktree principal'])
  checar(`sessões: com agentes especialistas (${termo})`, subsecaoEsp.includes(termo));
checar('fluxo: modo com agentes especialistas na Fase 3', (fluxo.split('## Fase 3')[1] || '').split('## Fase 4')[0].includes('especialistas'));
checar('prompt da coordenadora do Orca: aponta para o harness da integradora no modo com especialistas', promptCoord.includes('integradora.md'));
const inicioEsp = ler('skills/novo-projeto/SKILL.md');
checar('skills/novo-projeto: na Fase 3 copia os harnesses sem rodar o novo-projeto.sh de novo (que recusaria)', inicioEsp.includes('modelos/agentes/') && inicioEsp.includes('_modelo-harness.md') && !inicioEsp.includes('novo-projeto.sh" . --especialistas') && inicioEsp.includes('Nested worker depth'));
const atualizarEsp = ler('skills/atualizar-projeto/SKILL.md');
checar('skills/atualizar-projeto: copia os harnesses que faltam (docs/agentes/)', atualizarEsp.includes('docs/agentes/'));
checar('skills/atualizar-projeto: pergunta se o projeto usa o modo e acrescenta a linha do DESENVOLVIMENTO.md (Nested worker depth)', atualizarEsp.includes('Pergunte se o projeto usa o modo com especialistas') && atualizarEsp.includes('Nested worker depth'));
checar('skills/consultar: aponta para o modo com especialistas', ler('skills/consultar/SKILL.md').includes('Com agentes especialistas'));
for (const termo of ['modelos/agentes/', '--especialistas', 'Nested worker depth'])
  checar(`README: modo com agentes especialistas (${termo})`, readme.includes(termo));

// Skills por agente (decisão 009, rascunho): cada especialista que constrói tem as suas, e as trabalhadoras dele as usam
const SKILLS_DO_AGENTE = {
  'back-e-dados': ['api-conforme-contrato', 'migracao-sem-parada', 'transacoes-e-consultas', 'trabalho-em-segundo-plano'],
  'design-e-front': ['formularios-e-erros', 'desempenho-na-tela', 'estados-da-tela'],
  devops: ['publicacao-gradual', 'metas-e-alertas', 'ci-seguro'],
  seguranca: ['autenticacao-e-sessao', 'controle-de-acesso', 'entrada-nao-confiavel', 'incidente-com-dados-pessoais'],
};
for (const [agente, nomes] of Object.entries(SKILLS_DO_AGENTE)) {
  const base = ler(`modelos/referencias/${agente}.md`);
  checar(`referências: existe modelos/referencias/${agente}.md`, base.length > 0);
  checar(`referências/${agente}: maturidade rascunho e fontes com link`, base.includes('**Maturidade:** rascunho') && (base.match(/https:\/\//g) || []).length >= 5);
  const harness = ler(`modelos/agentes/${agente}.md`);
  const parteSkills = (harness.split('## 5. Skills')[1] || '').split('\n## ')[0];
  const parteLe = (harness.split('## 3. O que lê')[1] || '').split('\n## ')[0];
  checar(`agentes/${agente}: a pesquisa passa pela base do método (modelos/referencias/${agente}.md)`, parteLe.includes(`modelos/referencias/${agente}.md`));
  checar(`agentes/${agente}: as trabalhadoras usam as skills do especialista`, parteSkills.includes('trabalhadoras usam'));
  for (const nome of nomes) {
    checar(`agentes/${agente}: parte 5 cita metodo:${nome}`, parteSkills.includes(`metodo:${nome}`));
    const texto = ler(`skills/${nome}/SKILL.md`);
    checar(`skills/${nome}: existe`, texto.length > 0);
    checar(`skills/${nome}: description começa por "Use quando"`, /^description:\s*Use quando/m.test(texto));
    for (const termo of ['**Maturidade:** rascunho', '## Checklist', '## Adaptar ao tamanho do projeto', `modelos/referencias/${agente}.md`])
      checar(`skills/${nome}: ${termo}`, texto.includes(termo));
    checar(`skills/${nome}: cada passo com a fonte (pelo menos 3 links)`, (texto.match(/\]\(https:\/\//g) || []).length >= 3);
  }
}
for (const agente of Object.keys(SKILLS_DO_AGENTE))
  checar(`skills/consultar: aponta para a base de ${agente}`, ler('skills/consultar/SKILL.md').includes(`modelos/referencias/${agente}.md`));
// As skills da Segurança também servem a quem corrige: o back e o front pedem as delas na especificação
for (const agente of ['back-e-dados', 'design-e-front'])
  checar(`agentes/${agente}: parte 5 aponta para as skills da Segurança`, ((ler(`modelos/agentes/${agente}.md`).split('## 5. Skills')[1] || '').split('\n## ')[0]).includes('metodo:entrada-nao-confiavel'));
// Decisão da pessoa (2026-10-29): o erro de campo aparece ao avançar ou enviar, como no GOV.UK
const formularios = ler('skills/formularios-e-erros/SKILL.md');
checar('skills/formularios-e-erros: valida ao avançar ou enviar, não ao sair do campo (GOV.UK)', formularios.includes('ao avançar ou enviar') && formularios.includes('design-system.service.gov.uk/patterns/validation'));

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
checar('VERSION: 2.6.0 ou maior (modo com agentes especialistas, decisão 008)', versao.split('.').map(Number).reduce((acc, n, i) => acc || (n !== [2, 6, 0][i] ? (n > [2, 6, 0][i] ? 'maior' : 'menor') : ''), '') !== 'menor', versao);

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
// Sem package.json (projeto recém-criado), o CI pula os passos de Node e avisa
const passosCi = ci.split(/\n(?=      - )/).slice(1);
const passosNode = passosCi.filter((p) => /setup-node|npm /.test(p));
checar('ci-node.yml: confere se a stack já foi definida (package.json) e avisa', /id:\s*stack\b/.test(ci) && ci.includes('-f package.json') && ci.includes('::warning::'));
checar('ci-node.yml: todos os passos de Node dependem da stack definida', passosNode.length >= 5 && passosNode.every((p) => p.includes("if: steps.stack.outputs.definida == 'sim'")), `passos de Node: ${passosNode.length}`);
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
    for (const arq of ['CLAUDE.md', 'AGENTS.md', '.github/ISSUE_TEMPLATE/tarefa.yml', '.github/pull_request_template.md', '.github/workflows/ci.yml', 'scripts/nova-tarefa.sh', 'scripts/remover-tarefa.sh', 'docs/DESENVOLVIMENTO.md', 'docs/memoria-do-projeto.md'])
      checar(`novo-projeto.sh cria ${arq}`, existsSync(join(alvo, arq)));
    const dev = existsSync(join(alvo, 'docs/DESENVOLVIMENTO.md')) ? readFileSync(join(alvo, 'docs/DESENVOLVIMENTO.md'), 'utf8') : '';
    checar('novo-projeto.sh carimba a versão do método', dev.includes(`Versão do método: ${versao}`));
    checar('novo-projeto.sh registra os cenários escolhidos', dev.includes('site-estatico') && dev.includes('api-backend'));
    checar('novo-projeto.sh: DESENVOLVIMENTO.md explica o modo Orca', dev.includes('Orca'));
    checar('novo-projeto.sh: DESENVOLVIMENTO.md cita o AGENTS.md', dev.includes('AGENTS.md'));
    const memProj = existsSync(join(alvo, 'docs/memoria-do-projeto.md')) ? readFileSync(join(alvo, 'docs/memoria-do-projeto.md'), 'utf8') : '';
    checar('novo-projeto.sh: memória anota agente e retrabalho por tarefa', memProj.includes('retrabalho'));
    // AGENTS.md do projeto: o Codex lê este arquivo, não o CLAUDE.md (decisão 007)
    const agentsProj = existsSync(join(alvo, 'AGENTS.md')) ? readFileSync(join(alvo, 'AGENTS.md'), 'utf8') : '';
    checar('novo-projeto.sh: AGENTS.md carimba a versão do método', agentsProj.includes(`Versão do método: ${versao}`));
    for (const termo of ['CLAUDE.md', 'docs/DESENVOLVIMENTO.md', 'docs/memoria-do-projeto.md', 'superpowers:test-driven-development', 'superpowers:verification-before-completion', 'orca orchestration ask'])
      checar(`novo-projeto.sh: AGENTS.md cita ${termo}`, agentsProj.includes(termo));
    checar('novo-projeto.sh: AGENTS.md sem marcadores nem caminhos de pasta', agentsProj.length > 0 && !agentsProj.includes('{{') && !agentsProj.includes(RAIZ));
    // Cenário rascunho gera aviso (sem travar); a maturidade de cada cenário vai para o DESENVOLVIMENTO.md
    const maturidade = (nome) => (readFileSync(join(RAIZ, 'cenarios', `${nome}.md`), 'utf8').match(/^\*\*Maturidade:\*\*\s*(.+)$/m) || [])[1]?.trim();
    checar('novo-projeto.sh avisa no stderr quando o cenário é rascunho (api-backend)', ok.stderr.includes('AVISO: o cenário api-backend é rascunho'), ok.stderr);
    checar('novo-projeto.sh não avisa para cenário testado (site-estatico)', !ok.stderr.includes('o cenário site-estatico é'), ok.stderr);
    checar('novo-projeto.sh marca a maturidade do cenário testado no DESENVOLVIMENTO.md', dev.includes(`- site-estatico (${maturidade('site-estatico')})`));
    checar('novo-projeto.sh marca o cenário rascunho no DESENVOLVIMENTO.md', dev.includes('- api-backend (rascunho: ainda não testado)'));
    // CLAUDE.md do projeto: toda sessão já nasce com o contexto; nunca sobrescreve um que já exista
    const claudeProj = existsSync(join(alvo, 'CLAUDE.md')) ? readFileSync(join(alvo, 'CLAUDE.md'), 'utf8') : '';
    checar('novo-projeto.sh: CLAUDE.md carimba a versão do método', claudeProj.includes(`Versão do método: ${versao}`));
    checar('novo-projeto.sh: CLAUDE.md importa o DESENVOLVIMENTO.md e a memória', claudeProj.includes('@docs/DESENVOLVIMENTO.md') && claudeProj.includes('@docs/memoria-do-projeto.md'));
    checar('novo-projeto.sh: CLAUDE.md manda consultar o método pela skill metodo:consultar', claudeProj.includes('metodo:consultar'));
    checar('novo-projeto.sh: CLAUDE.md explica o modo Orca e a atualização do projeto', claudeProj.includes('Orca') && claudeProj.includes('/metodo:atualizar-projeto'));
    checar('novo-projeto.sh: CLAUDE.md diz que no Orca os agentes são Claude Code (--agent claude)', claudeProj.includes('--agent claude'));
    checar('novo-projeto.sh: CLAUDE.md diz quando o agente pode ser Codex (--agent codex e AGENTS.md)', claudeProj.includes('--agent codex') && claudeProj.includes('AGENTS.md'));
    checar('novo-projeto.sh: CLAUDE.md sem marcadores nem caminhos de pasta', claudeProj.length > 0 && !claudeProj.includes('{{') && !claudeProj.includes(RAIZ));
    const alvo_com_claude = join(base, 'projeto-com-claude');
    mkdirSync(alvo_com_claude);
    writeFileSync(join(alvo_com_claude, 'CLAUDE.md'), 'meu claude\n');
    const com_claude = rodar(alvo_com_claude, 'site-estatico');
    checar('novo-projeto.sh com CLAUDE.md existente conclui, avisa e não o altera', com_claude.status === 0 && com_claude.stderr.includes('CLAUDE.md') && readFileSync(join(alvo_com_claude, 'CLAUDE.md'), 'utf8') === 'meu claude\n' && existsSync(join(alvo_com_claude, 'docs/DESENVOLVIMENTO.md')), com_claude.stderr);
    const alvo_com_agents = join(base, 'projeto-com-agents');
    mkdirSync(alvo_com_agents);
    writeFileSync(join(alvo_com_agents, 'AGENTS.md'), 'meu agents\n');
    const com_agents = rodar(alvo_com_agents, 'site-estatico');
    checar('novo-projeto.sh com AGENTS.md existente conclui, avisa e não o altera', com_agents.status === 0 && com_agents.stderr.includes('AGENTS.md') && readFileSync(join(alvo_com_agents, 'AGENTS.md'), 'utf8') === 'meu agents\n' && existsSync(join(alvo_com_agents, 'CLAUDE.md')), com_agents.stderr);
    const alvo_testado = join(base, 'projeto-testado');
    mkdirSync(alvo_testado);
    const so_testado = rodar(alvo_testado, 'site-estatico');
    checar('novo-projeto.sh só com cenário testado conclui sem aviso', so_testado.status === 0 && !so_testado.stderr.includes('AVISO'), so_testado.stderr);
    // Modo com agentes especialistas (decisão 008): só com --especialistas o projeto recebe os harnesses em docs/agentes/
    checar('novo-projeto.sh sem --especialistas não cria docs/agentes/', !existsSync(join(alvo, 'docs/agentes')));
    checar('novo-projeto.sh: CLAUDE.md cita os harnesses em docs/agentes/', claudeProj.includes('docs/agentes/'));
    checar('novo-projeto.sh: AGENTS.md cita os harnesses em docs/agentes/', agentsProj.includes('docs/agentes/'));
    checar('novo-projeto.sh: memória anota o consumo por tarefa', memProj.includes('consumo'));
    const alvo_esp = join(base, 'projeto-especialistas');
    mkdirSync(alvo_esp);
    const esp = rodar(alvo_esp, 'site-estatico', '--especialistas');
    checar('novo-projeto.sh com --especialistas conclui', esp.status === 0, esp.stderr);
    const copiados = existsSync(join(alvo_esp, 'docs/agentes')) ? readdirSync(join(alvo_esp, 'docs/agentes')).sort() : [];
    checar('novo-projeto.sh com --especialistas copia os 7 harnesses, sem o modelo', JSON.stringify(copiados) === JSON.stringify(Object.keys(HARNESSES).map((n) => `${n}.md`).sort()), copiados.join(', '));
    for (const nome of Object.keys(HARNESSES))
      checar(`novo-projeto.sh com --especialistas: docs/agentes/${nome}.md igual ao do método`, copiados.includes(`${nome}.md`) && readFileSync(join(alvo_esp, 'docs/agentes', `${nome}.md`), 'utf8') === ler(`modelos/agentes/${nome}.md`));
    const devEsp = existsSync(join(alvo_esp, 'docs/DESENVOLVIMENTO.md')) ? readFileSync(join(alvo_esp, 'docs/DESENVOLVIMENTO.md'), 'utf8') : '';
    checar('novo-projeto.sh com --especialistas: DESENVOLVIMENTO.md cita docs/agentes/ e o Nested worker depth', devEsp.includes('docs/agentes/') && devEsp.includes('Nested worker depth'));
    checar('novo-projeto.sh com --especialistas não confunde a opção com um cenário', devEsp.includes('site-estatico') && !devEsp.includes('--especialistas ('));
    const alvo_esp_antes = join(base, 'projeto-opcao-antes');
    mkdirSync(alvo_esp_antes);
    const espAntes = rodar('--especialistas', alvo_esp_antes, 'site-estatico');
    checar('novo-projeto.sh aceita --especialistas antes da pasta', espAntes.status === 0 && existsSync(join(alvo_esp_antes, 'docs/agentes/integradora.md')), espAntes.stderr);
    checar('novo-projeto.sh: AGENTS.md não manda o Codex falar com a pessoa (pede pela coordenadora)', agentsProj.length > 0 && !agentsProj.includes('peça à pessoa'));
    const alvo_com_agentes = join(base, 'projeto-com-docs-agentes');
    mkdirSync(join(alvo_com_agentes, 'docs/agentes'), { recursive: true });
    const conf = rodar(alvo_com_agentes, '--especialistas');
    checar('novo-projeto.sh --especialistas com docs/agentes/ existente recusa sem alterar nada', conf.status !== 0 && conf.stderr.includes('docs/agentes') && !existsSync(join(alvo_com_agentes, 'CLAUDE.md')), conf.stderr);
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

{
  // Plugin metodo: catálogo e skills (o repositório inteiro é o plugin)
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
  checar('plugin: skills novo-projeto, consultar e atualizar-projeto', ['novo-projeto', 'consultar', 'atualizar-projeto'].every((n) => pastasSkill.includes(n)), pastasSkill.join(', '));
  for (const pasta of pastasSkill) {
    const texto = ler(`skills/${pasta}/SKILL.md`);
    const cabecalho = (texto.match(/^---\n([\s\S]*?)\n---\n/) || [])[1] || '';
    checar(`skills/${pasta}: name igual ao nome da pasta`, new RegExp(`^name:\\s*${pasta}\\s*$`, 'm').test(cabecalho));
    checar(`skills/${pasta}: description no cabeçalho`, /^description:\s*\S.{20,}$/m.test(cabecalho));
    const citados = [...texto.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([^\s`"'<>)*]+)/g)].map((m) => m[1]);
    checar(`skills/${pasta}: cita arquivos do método por \${CLAUDE_PLUGIN_ROOT}`, citados.length >= 2, `citados: ${citados.length}`);
    checar(`skills/${pasta}: diz onde achar o método sem \${CLAUDE_PLUGIN_ROOT} (Codex)`, texto.includes('dois níveis acima'));
    for (const caminho of citados) checar(`skills/${pasta}: caminho citado existe (${caminho})`, existsSync(join(RAIZ, caminho)));
  }
  const inicio = ler('skills/novo-projeto/SKILL.md');
  checar('skills/novo-projeto: maturidade rascunho', inicio.includes('**Maturidade:** rascunho'));
  for (const termo of ['superpowers:brainstorming', 'gh repo create', '.DS_Store', 'Pode criar?', 'bash "${CLAUDE_PLUGIN_ROOT}/scripts/novo-projeto.sh"', 'orca repo add'])
    checar(`skills/novo-projeto: ${termo}`, inicio.includes(termo));
  const atualizar = ler('skills/atualizar-projeto/SKILL.md');
  checar('skills/atualizar-projeto: maturidade rascunho', atualizar.includes('**Maturidade:** rascunho'));
  for (const termo of ['${CLAUDE_PLUGIN_ROOT}/CHANGELOG.md', 'Versão do método', 'Pode atualizar?', 'orca repo add', 'bash "${CLAUDE_PLUGIN_ROOT}/scripts/novo-projeto.sh"', 'nunca apague'])
    checar(`skills/atualizar-projeto: ${termo}`, atualizar.includes(termo));
  checar('skills/atualizar-projeto: cria o AGENTS.md que falta', atualizar.includes('AGENTS.md'));
  checar('skills/novo-projeto: oferece back com o Codex e front com o Claude', inicio.includes('--agent codex'));
  checar('skills/consultar: aponta para o back com o Codex', ler('skills/consultar/SKILL.md').includes('Back e front com agentes diferentes'));
}

// 4) Consistência geral
const SKILLS_VALIDAS = new Set([
  ...['brainstorming', 'writing-plans', 'executing-plans', 'subagent-driven-development', 'test-driven-development', 'systematic-debugging', 'verification-before-completion', 'requesting-code-review', 'receiving-code-review', 'finishing-a-development-branch', 'using-git-worktrees', 'dispatching-parallel-agents', 'writing-skills', 'using-superpowers', 'diagnosing-superpowers'].map((n) => `superpowers:${n}`),
  ...['architecture', 'code-review', 'debug', 'deploy-checklist', 'documentation', 'incident-response', 'standup', 'system-design', 'tech-debt', 'testing-strategy'].map((n) => `engineering:${n}`),
  ...['accessibility-review', 'design-critique', 'design-handoff', 'design-system', 'research-synthesis', 'user-research', 'ux-copy'].map((n) => `design:${n}`),
]);
// As skills do próprio plugin: toda citação metodo:<nome> precisa ter skills/<nome>/SKILL.md
const SKILLS_METODO = new Set(existsSync(join(RAIZ, 'skills')) ? readdirSync(join(RAIZ, 'skills')).filter((n) => existsSync(join(RAIZ, 'skills', n, 'SKILL.md'))) : []);
// Todo plugin cujas skills o método cita, e o REA, precisam estar na instalação do README
for (const prefixo of new Set([...SKILLS_VALIDAS].map((s) => s.split(':')[0])))
  checar(`README: adoção instala o plugin ${prefixo}`, adocao.includes(`${prefixo}@`));
checar('README: adoção instala o REA (reverse-engineer-anything)', adocao.includes('npx rea-agents setup'));
for (const repo of ['https://github.com/obra/superpowers', 'https://github.com/anthropics/knowledge-work-plugins', 'https://github.com/morluto/rea'])
  checar(`README: adoção aponta para o repositório oficial ${repo}`, adocao.includes(repo));
checar('README: adoção ensina a conferir a instalação', adocao.includes('node --version') && adocao.includes('claude mcp list'));
const arquivosTexto = [...todosMd(), ...['modelos/issue-tarefa.yml', 'modelos/ci-node.yml', '.github/workflows/verificar.yml'].map((a) => join(RAIZ, a))].filter(existsSync);
for (const arquivo of arquivosTexto) {
  const texto = readFileSync(arquivo, 'utf8');
  const nome = relative(RAIZ, arquivo);

  for (const [, skill] of texto.matchAll(/`?((?:superpowers|engineering|design):[a-z-]+)`?/g))
    checar(`${nome}: skill existente (${skill})`, SKILLS_VALIDAS.has(skill));
  for (const [, skill] of texto.matchAll(/(?<![\w/.-])metodo:([a-z][a-z-]*[a-z])/g))
    checar(`${nome}: skill do plugin existente (metodo:${skill})`, SKILLS_METODO.has(skill));

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
