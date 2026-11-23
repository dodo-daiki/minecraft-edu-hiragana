// 「けいさん」カテゴリの ひらがな ブロック
//
// MakeCode のエディター本体が持っている計算ブロック（の余り、小さい方、絶対値、平方根、四捨五入）は
// 文字を書き換えられないため、pxt.json の toolboxFilter で隠し、同じ動きをするブロックをここで用意します。

/**
 * へいほうこん などの 計算の しゅるい
 */
enum HiraganaMathFunction {
    //% block="へいほうこん"
    Sqrt,
    //% block="sin"
    Sin,
    //% block="cos"
    Cos,
    //% block="tan"
    Tan,
    //% block="asin"
    Asin,
    //% block="acos"
    Acos
}

/**
 * まるめかたの しゅるい
 */
enum HiraganaRounding {
    //% block="ししゃごにゅう"
    Round,
    //% block="きりあげ"
    Ceil,
    //% block="きりすて"
    Floor,
    //% block="しょうすうてん いかを きりすて"
    Trunc
}

namespace hiragana {
    /**
     * わりざんの あまりを かえします
     */
    //% blockId=hiragana_math_mod block="%a ÷ %b の あまり"
    //% blockNamespace="Math" weight=20
    //% a.defl=0 b.defl=1
    export function mod(a: number, b: number): number {
        return a % b;
    }

    /**
     * 2つの かずの うち ちいさい ほうを かえします
     */
    //% blockId=hiragana_math_min block="%a と %b の うち ちいさい ほう"
    //% blockNamespace="Math" weight=19
    export function min(a: number, b: number): number {
        return Math.min(a, b);
    }

    /**
     * 2つの かずの うち おおきい ほうを かえします
     */
    //% blockId=hiragana_math_max block="%a と %b の うち おおきい ほう"
    //% blockNamespace="Math" weight=18
    export function max(a: number, b: number): number {
        return Math.max(a, b);
    }

    /**
     * ぜったいち（マイナスを とった かず）を かえします
     */
    //% blockId=hiragana_math_abs block="%x の ぜったいち"
    //% blockNamespace="Math" weight=17
    export function abs(x: number): number {
        return Math.abs(x);
    }

    /**
     * へいほうこん や sin などを けいさんします
     */
    //% blockId=hiragana_math_function block="%op %x"
    //% blockNamespace="Math" weight=16
    export function mathFunction(op: HiraganaMathFunction, x: number): number {
        switch (op) {
            case HiraganaMathFunction.Sqrt: return Math.sqrt(x);
            case HiraganaMathFunction.Sin: return Math.sin(x);
            case HiraganaMathFunction.Cos: return Math.cos(x);
            case HiraganaMathFunction.Tan: return Math.tan(x);
            case HiraganaMathFunction.Asin: return Math.asin(x);
            case HiraganaMathFunction.Acos: return Math.acos(x);
        }
        return 0;
    }

    /**
     * かずを まるめます（ししゃごにゅう、きりあげ、きりすて）
     */
    //% blockId=hiragana_math_round block="%op %x"
    //% blockNamespace="Math" weight=15
    export function round(op: HiraganaRounding, x: number): number {
        switch (op) {
            case HiraganaRounding.Round: return Math.round(x);
            case HiraganaRounding.Ceil: return Math.ceil(x);
            case HiraganaRounding.Floor: return Math.floor(x);
            case HiraganaRounding.Trunc: return Math.trunc(x);
        }
        return 0;
    }
}
