# Personal Mental OS

AIを使わない、スマホ向けセルフケアWebアプリです。

## v0.2 - RELEASE COMPLETE
PDF企画書「11. ストレス発散エリアの完成形」を実装。

### RELEASE
- SCRIBBLE CANVAS：自由な落書き
- RHYTHM RELEASE：Web Audioによる4パッド
- WORD DROP：書いた言葉を保存せず流して消す
- SHAKE AWAY：DeviceMotion対応 + タップ代替
- PAPER CRUMPLE：書いた内容を丸めて捨てる演出
- SOUND RELEASE：録音せず、マイク入力の声量だけ表示
- MOVEMENT BREAK：30秒の軽い身体ほぐし
- COOL DOWN GATE：発散前後のストレス比較
- RELEASE HISTORY：前後値と使用機能を端末内に保存
- RESET / RESTへの終了導線

### その他
- HOME check-in
- Rule-based CARE router
- 60秒RESET / Grounding
- Brain Dump / Worry Box / Control Circles
- NOTHING MODE
- Mood / Stress / Energy record
- MY MENTAL MANUAL
- SAFE shortcut
- localStorage
- PWA / basic offline cache

## 方針
- 診断・治療をしない
- AIによる感情推定や診断をしない
- RELEASEを「怒りをぶつければ治る」と説明しない
- 発散の後にCOOL DOWNを置く
- マイクは録音・保存を行わず、入力レベルだけをその場で表示
- 記録しない日も許容する
- 主要データはブラウザのlocalStorageに保存
- 強いストレス時は選択肢を減らす

## GitHub Pages
Settings → Pages → Deploy from a branch → `main` / `/ (root)` を選択すると公開できます。

## 注意
このアプリは医療サービスや緊急対応の代替ではありません。公開版では、利用地域に応じた公的な相談・緊急支援への導線を適切に設定してください。