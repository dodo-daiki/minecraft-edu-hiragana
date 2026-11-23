# ひらがなブロック（MakeCode for Minecraft Education）

MakeCode for Minecraft のブロックに表示される漢字を、ひらがなで表示する拡張機能です。
ひらがなが続いても読みやすいように、文節のあいだにスペースを入れています（分かち書き）。
ブロックそのもの（プログラムの動き）は変わりません。表示する文字だけが変わります。

| もとの表示 | この拡張機能を入れたとき |
|---|---|
| メッセージ ○ を 送信する | メッセージ ○ を そうしんする |
| チャットコマンド ○ を入力した時 | チャットコマンド ○ を にゅうりょくしたとき |
| エージェントを ○ に ○ ブロック移動させる | エージェントを ○ に ○ ブロック いどうさせる |
| 石の感圧板 | いしの かんあつばん |

## つかいかた

1. エディターの言語を「日本語」にします（Minecraft Education の言語設定が日本語であれば OK）。
2. MakeCode のツールボックスの「拡張機能」を開きます。
3. 検索欄にこのリポジトリの URL を貼り付けます。

   ```
   https://github.com/dodo-daiki/minecraft-edu-hiragana
   ```

4. 表示されたカードをクリックします。ブロックの表示がひらがなに変わります。

拡張機能はプロジェクトごとに追加します。この拡張機能を入れたプロジェクトを配布して、それを使ってもらうと便利です。

## 注意

- エディターの言語が日本語のときだけ効果があります。
- 「もし」「くりかえし」「変数」など、MakeCode のエディター本体が持っているブロックの文字は変わりません。
- MakeCode の公式機能として説明されている使い方ではありません（拡張機能の翻訳ファイルで、標準のブロックの翻訳を上書きしています）。MakeCode が更新されると効果がなくなる可能性があります。

## しくみ（開発者向け）

- `_locales/ja/minecraft-edu-hiragana-strings.json` に、標準ブロックの翻訳キー（例: `player.say|block`）とひらがなの文字列を入れています。
- 元の文字列は MakeCode 公式の日本語翻訳（`minecraft/core-strings.json` など）です。
- `tools/convert.js` が形態素解析（kuromoji）で漢字を読みに変換します。`%message` や `|` などのブロック記法は変更しないように保護し、変換後に元と一致するか検査しています。
- 形態素解析の結果から文節の区切りを判断し、スペースを入れます（`いどう` + `させる` のような「名詞 + する」は 1 つの文節として扱います）。
- 読みの誤りや分かち書きの設定は `tools/overrides.json` で直します。
  - `spacing`: 文節のあいだにスペースを入れるか（`true` / `false`）
  - `separator`: 区切りに使う文字（標準は半角スペース）
  - `phrases`: ひとまとまりで読む語句（例: `感圧板` → `かんあつばん`）
  - `words`: 1 語の読み（例: `値` → `あたい`）
  - `keys`: 文字列キー単位での置き換え
- `tools/review.tsv` に、使われたすべての漢字語と読みの一覧が出力されます。
- `tools/preview.tsv` に、変換前と変換後の文字列が出力されます（校正用。リポジトリには含めません）。

### 再生成

```sh
cd tools
npm install
sh fetch-source.sh   # 公式の日本語翻訳を取り直す（任意）
node convert.js
```

## ライセンス

[MIT License](LICENSE)

## English

**Hiragana Blocks** is an extension for MakeCode for Minecraft (Minecraft Education).
It shows the kanji in the Japanese block text as hiragana, with spaces between phrases (wakachi-gaki) for readability.
Only the displayed text changes; the blocks and the programs behave the same.

- It works only when the editor language is Japanese.
- To use it, open **Extensions** in the toolbox and paste the repository URL `https://github.com/dodo-daiki/minecraft-edu-hiragana` into the search box.
- It overrides the official Japanese translations of the standard blocks through the extension's `_locales/ja` file. MakeCode does not document this as a supported feature, so it may stop working after a MakeCode update.
- Built-in editor blocks such as "if", "repeat" and "variables" are not changed.

Licensed under the [MIT License](LICENSE).
