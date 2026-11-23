# ひらがなブロック の おためし

## ひらがなブロック を ためしてみよう @showdialog

この プロジェクトには、拡張機能「ひらがなブロック」が はいっています。
ブロックの 漢字が ひらがなで ひょうじされます。

## ブロックを みてみよう

ワークスペースに、ためしの ブロックが おいてあります。
ブロックの もじが ひらがなで ひょうじされているか たしかめてみましょう。

この がめんでは、ツールボックスに ためしの ブロックだけが でています。
「完了」を おすと、すべての カテゴリの ブロックを みることが できます。
そのまま じゆうに プログラムを つくることも できます。

```template
player.onChat("run", function () {
    agent.teleportToPlayer()
    agent.move(SixDirection.Forward, 2)
    agent.turn(TurnDirection.Left)
    blocks.place(STONE_PRESSURE_PLATE, pos(0, 0, 1))
    player.say(hiragana.mod(7, 3))
    player.say(hiragana.max(3, 5))
    let list = hiragana.createArray(3, 1, 4)
    player.say(hiragana.getAt(list, 0))
    player.say(hiragana.join("いし", "の", "ブロック"))
})
```

```package
minecraft-edu-hiragana=github:dodo-daiki/minecraft-edu-hiragana
```
