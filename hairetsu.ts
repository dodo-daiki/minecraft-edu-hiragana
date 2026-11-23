// 「配列」カテゴリの ひらがな ブロック
//
// MakeCode のエディター本体が持っている配列ブロック（配列、空の配列、配列の長さ、○番目の値）は
// 文字を書き換えられないため、pxt.json の toolboxFilter で隠し、同じ動きをするブロックをここで用意します。

namespace hiragana {
    /**
     * あたいを ならべて はいれつを つくります
     */
    //% blockId=hiragana_array_create block="はいれつ %a %b||%c %d %e %f %g %h"
    //% blockNamespace="arrays" group="Create" weight=100
    //% expandableArgumentMode="enabled"
    //% a.shadow=math_number a.defl=0 b.shadow=math_number b.defl=1
    //% c.shadow=math_number d.shadow=math_number e.shadow=math_number
    //% f.shadow=math_number g.shadow=math_number h.shadow=math_number
    export function createArray(a: any, b: any, c?: any, d?: any, e?: any, f?: any, g?: any, h?: any): any[] {
        const list: any[] = [a, b];
        const rest = [c, d, e, f, g, h];
        for (const item of rest) {
            if (item === undefined) break;
            list.push(item);
        }
        return list;
    }

    /**
     * なにも はいっていない はいれつを つくります
     */
    //% blockId=hiragana_array_empty block="からの はいれつ"
    //% blockNamespace="arrays" group="Create" weight=99
    export function emptyArray(): any[] {
        return [];
    }

    /**
     * はいれつに はいっている あたいの かずを かえします
     */
    //% blockId=hiragana_array_length block="%list=variables_get(はいれつ) の ながさ"
    //% blockNamespace="arrays" group="Read" weight=90
    export function arrayLength(list: any[]): number {
        return list.length;
    }

    /**
     * はいれつの ○ばんめの あたいを かえします（さいしょは 0 ばんめ）
     */
    //% blockId=hiragana_array_get block="%list=variables_get(はいれつ) の %index ばんめの あたい"
    //% blockNamespace="arrays" group="Read" weight=89
    //% index.defl=0
    export function getAt(list: any[], index: number): any {
        return list[index];
    }

    /**
     * はいれつの ○ばんめの あたいを かえます（さいしょは 0 ばんめ）
     */
    //% blockId=hiragana_array_set block="%list=variables_get(はいれつ) の %index ばんめの あたいを %value に する"
    //% blockNamespace="arrays" group="Modify" weight=80
    //% index.defl=0
    export function setAt(list: any[], index: number, value: any): void {
        list[index] = value;
    }
}
