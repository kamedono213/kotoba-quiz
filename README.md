# ことばの由来クイズ

企業名・マンション名・街で見かけるもの・もとは商品名だった言葉・アルファベットの言葉・外来語の語源・日本語の語源。
身近な言葉の意味と由来を4択で当てるPWA。カテゴリー別/全カテゴリーで、ランダム10問か全問。

公開: https://kamedono213.github.io/kotoba-quiz/

## 問題を足す
1. `data/words-*.txt` に `ことば|正解(意味・由来)|解説` を1行で足す(選択肢は同じカテゴリーのほかの正解から自動で選ばれる)
2. `node tools/build-data.js`(言葉の重複・正解の文の重複・正解に言葉そのものが入っていないかを確認)
3. `node tools/build-pages.js` で `docs/` を作り直してpush

確認用: `node serve.js docs` → http://localhost:5397
