# ひらがなブロック の おためし

## ひらがなブロック を ためしてみよう @showdialog

この プロジェクトには、拡張機能「ひらがなブロック」が はいっています。
ブロックの 漢字が ひらがなで ひょうじされます。

## ブロックを みてみよう

ツールボックスの「プレイヤー」「エージェント」「計算」などを ひらいて、
ブロックが ひらがなで ひょうじされているか たしかめてみましょう。

ワークスペースには、ためしの ブロックが おいてあります。
おわったら「完了」を おすと、そのまま じゆうに つかえます。

```template
player.onChat("run", function () {
    agent.teleportToPlayer()
    agent.move(SixDirection.Forward, 2)
    agent.turn(TurnDirection.Left)
    blocks.place(STONE_PRESSURE_PLATE, pos(0, 0, 1))
    player.say(hiragana.mod(7, 3))
    player.say(hiragana.max(3, 5))
})
```

```package
minecraft-edu-hiragana=github:dodo-daiki/minecraft-edu-hiragana
```
