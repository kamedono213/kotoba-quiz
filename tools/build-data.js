// ことばの由来クイズのデータを作る。data/words-*.txt → app/data/words.json
// 確かめること: 列の数、言葉の重複、同じカテゴリーで正解の文が同じでないか、正解の文に言葉そのものが入っていないか
// 実行: node tools/build-data.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const errors = [], notes = [];

const fields = [], items = [];
let field = null;
for (const f of fs.readdirSync(path.join(ROOT, 'data')).filter(f => /^words-\d+\.txt$/.test(f)).sort()) {
  for (const raw of fs.readFileSync(path.join(ROOT, 'data', f), 'utf8').split(/\r?\n/)) {
    const l = raw.trim();
    if (!l || l.startsWith('#')) continue;
    if (l.startsWith('@')) {
      const [key, name, emoji, ask] = l.slice(1).split('|');
      if (!ask) errors.push(`${f}: カテゴリーの問いかけがない: ${l}`);
      field = { key, name, emoji, ask }; fields.push(field); continue;
    }
    const p = l.split('|');
    if (p.length !== 3) { errors.push(`${f}: 列が3つでない: ${l.slice(0, 40)}`); continue; }
    const [word, ans, exp] = p;
    items.push({ id: field.key + '-' + items.length, f: field.key, word, ans, exp });
  }
}
// 言葉の重複
const seen = new Set();
for (const it of items) { if (seen.has(it.word)) errors.push('言葉の重複: ' + it.word); seen.add(it.word); }
// 同じカテゴリーで正解の文が同じ(選択肢に同じ文が2つ並んでしまう)
for (const fl of fields) {
  const s = new Set();
  for (const it of items.filter(i => i.f === fl.key)) { if (s.has(it.ans)) errors.push(`正解の文が同じ: ${it.ans}`); s.add(it.ans); }
}
// 正解の文に、問題の言葉そのもの(かっこの読みを除く)が入っていないか
for (const it of items) {
  const w = it.word.replace(/\(.*?\)/g, '');
  if (w.length >= 2 && it.ans.includes(w)) errors.push(`正解の文に言葉そのものが入っている: ${it.word} → ${it.ans}`);
}
for (const fl of fields) notes.push(`${fl.emoji} ${fl.name}: ${items.filter(i => i.f === fl.key).length}問`);
notes.push('合計: ' + items.length + '問');

fs.mkdirSync(path.join(ROOT, 'app/data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'app/data/words.json'), JSON.stringify({ fields, items }));
console.log(notes.join('\n'));
if (errors.length) { console.log('\nERRORS:\n' + errors.join('\n')); process.exit(1); }
