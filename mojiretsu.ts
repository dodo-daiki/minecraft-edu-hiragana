// 「文字列」カテゴリの ひらがな ブロック
//
// MakeCode のエディター本体が持っている文字列ブロック（文字列の長さ、文字列をつなげる）は
// 文字を書き換えられないため、pxt.json の toolboxFilter で隠し、同じ動きをするブロックをここで用意します。

namespace hiragana {
    /**
     * もじれつの もじの かずを かえします
     */
    //% blockId=hiragana_text_length block="もじれつ %text の ながさ"
    //% blockNamespace="text" weight=100
    //% text.defl="Hello"
    export function textLength(text: string): number {
        return text.length;
    }

    /**
     * もじれつを つなげて 1つの もじれつに します
     */
    //% blockId=hiragana_text_join block="もじれつを つなげる %a %b||%c %d %e %f"
    //% blockNamespace="text" weight=99
    //% expandableArgumentMode="enabled"
    //% a.shadow=text a.defl="Hello" b.shadow=text b.defl="World"
    //% c.shadow=text d.shadow=text e.shadow=text f.shadow=text
    export function join(a: any, b: any, c?: any, d?: any, e?: any, f?: any): string {
        let s = "" + a + b;
        const rest = [c, d, e, f];
        for (const item of rest) {
            if (item === undefined) break;
            s += item;
        }
        return s;
    }
}
