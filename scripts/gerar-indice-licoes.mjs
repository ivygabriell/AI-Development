#!/usr/bin/env node
// Gera licoes/_indice.md a partir dos arquivos NNN-slug.md da pasta licoes/.
// Uso: node scripts/gerar-indice-licoes.mjs           (escreve o índice)
//      node scripts/gerar-indice-licoes.mjs --check   (falha se o índice estiver desatualizado)
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PASTA = join(RAIZ, 'licoes');
const ALVO = join(PASTA, '_indice.md');

const resumo = (texto) => {
  const m = texto.match(/\*\*Regra:\*\*\s*(.+)/);
  const linha = (m ? m[1] : '').replace(/\*\*/g, '').replace(/`/g, '').replace(/\|/g, '/').trim();
  const frase = linha.split(/(?<=\.)\s/)[0] || linha;
  return frase.length > 150 ? `${frase.slice(0, 147).trimEnd()}...` : frase;
};

const arquivos = readdirSync(PASTA).filter((n) => /^\d{3}-[a-z0-9-]+\.md$/.test(n)).sort();
const linhas = arquivos.map((nome) => {
  const texto = readFileSync(join(PASTA, nome), 'utf8');
  const titulo = (texto.match(/^# \d{3} · (.+)$/m) ?? [])[1] ?? nome;
  return `| ${nome.slice(0, 3)} | [${titulo}](${nome}) | ${resumo(texto)} |`;
});

const conteudo = `# Índice de lições

<!-- Gerado por scripts/gerar-indice-licoes.mjs. Não edite à mão: edite a lição e rode o script. -->

Cada lição é um arquivo \`NNN-slug.md\` com **o que aconteceu**, **a causa** e **a regra**. Para acrescentar uma, copie o formato de qualquer lição existente, use o próximo número e rode \`node scripts/gerar-indice-licoes.mjs\`.

| # | Lição | Regra que ficou |
|---|---|---|
${linhas.join('\n')}
`;

if (process.argv.includes('--check')) {
  const atual = existsSync(ALVO) ? readFileSync(ALVO, 'utf8') : '';
  if (atual !== conteudo) {
    console.error('licoes/_indice.md está desatualizado. Rode: node scripts/gerar-indice-licoes.mjs');
    process.exit(1);
  }
  console.log(`índice de lições atualizado (${arquivos.length} lições)`);
} else {
  writeFileSync(ALVO, conteudo);
  console.log(`licoes/_indice.md gerado com ${arquivos.length} lições`);
}
