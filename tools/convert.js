// Converts the official Japanese MakeCode for Minecraft strings into hiragana,
// with spaces between phrases (bunsetsu) for readability.
//
//   node convert.js          -> writes ../_locales/ja/minecraft-edu-hiragana-strings.json
//                               review.tsv  (every kanji word + the reading used)
//                               preview.tsv (original -> converted, for proofreading)
//
// Inputs:
//   source/*-strings.json  official ja translations (see fetch-source.sh)
//   overrides.json         see the $comment in that file
"use strict";
const fs = require("fs");
const path = require("path");
const kuromoji = require("kuromoji");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "_locales", "ja", "minecraft-edu-hiragana-strings.json");
const SOURCE_DIR = path.join(__dirname, "source");
const PACKAGES = ["core", "builder", "shapes", "events", "nether"];

const KANJI = /[々㐀-䶿一-鿿豈-﫿]/;
const SPACE = /^[\s　]+$/;
const PUNCT = /^[\p{P}\p{S}]+$/u;
// Parts of a block string that MakeCode parses and must never change:
// %param, %param=shadowBlockId, %param(defaultVarName), $param, and the "|" separators.
// The default variable name inside (...) is converted to hiragana but never spaced.
const PROTECTED = /(%[A-Za-z_][A-Za-z0-9_]*(?:=[A-Za-z0-9_.]+)?(?:\([^)|%$]*\))?|\$[A-Za-z_][A-Za-z0-9_]*|\|)/;
const markupOf = s => (s.match(new RegExp(PROTECTED, "g")) || []).map(m => m.replace(/\(.*\)$/, "()")).join(" ");

const kata2hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));

const overrides = JSON.parse(fs.readFileSync(path.join(__dirname, "overrides.json"), "utf8"));
const wordOverrides = overrides.words || {};
const keyOverrides = overrides.keys || {};
const phrases = Object.entries(overrides.phrases || {}).sort((a, b) => b[0].length - a[0].length);
const SPACING = overrides.spacing !== false;
const SEP = overrides.separator !== undefined ? overrides.separator : " ";
// Verbs that form one phrase with a preceding サ変 noun: いどう+させる, そうしん+する
const SURU_VERBS = new Set(["する", "できる", "させる", "される"]);

kuromoji.builder({ dicPath: path.join(__dirname, "node_modules", "kuromoji", "dict") }).build((err, tokenizer) => {
    if (err) throw err;

    const review = new Map(); // kanji word -> { reading, count, example }
    const unresolved = [];
    const misaligned = [];

    // Tokenize, then merge tokens that make up a phrase from overrides.json into one token.
    function analyze(text, key) {
        const toks = tokenizer.tokenize(text).map(t => ({
            surface: t.surface_form, reading: t.reading, pos: t.pos, detail: t.pos_detail_1,
            base: t.basic_form, lastPos: t.pos, lastDetail: t.pos_detail_1, start: t.word_position - 1,
        }));
        for (const [from, to] of phrases) {
            let idx = text.indexOf(from);
            while (idx >= 0) {
                const end = idx + from.length;
                const i = toks.findIndex(t => t.start === idx);
                let j = i;
                while (j >= 0 && j < toks.length && toks[j].start + toks[j].surface.length < end) j++;
                const insideMerged = toks.some(t => t.fixed && t.start <= idx && end <= t.start + t.surface.length);
                if (insideMerged) {
                    // already covered by a longer phrase
                } else if (i < 0 || j >= toks.length || toks[j].start + toks[j].surface.length !== end) {
                    misaligned.push(`${key}\t${from}`);
                } else if (!toks[i].fixed) {
                    const merged = {
                        ...toks[i], surface: from, hira: to, fixed: true,
                        lastPos: toks[j].pos, lastDetail: toks[j].detail,
                    };
                    toks.splice(i, j - i + 1, merged);
                }
                idx = text.indexOf(from, end);
            }
        }
        return toks;
    }

    function readingOf(t, key) {
        if (t.hira !== undefined) return t.hira;
        if (!KANJI.test(t.surface)) return t.surface;
        let r = wordOverrides[t.surface];
        if (!r) {
            if (!t.reading || t.reading === "*") {
                unresolved.push(`${key}\t${t.surface}`);
                return t.surface;
            }
            r = kata2hira(t.reading);
        }
        const e = review.get(t.surface) || { reading: r, count: 0, example: key };
        e.count++;
        review.set(t.surface, e);
        return r;
    }

    // Should a space go between prev and cur? (phrase / bunsetsu boundary)
    function boundary(prev, cur) {
        if (!prev) return false;
        if (SPACE.test(prev.surface) || SPACE.test(cur.surface)) return false;
        if (prev.lastPos === "記号" || cur.pos === "記号") return false;
        if (PUNCT.test(prev.surface) || PUNCT.test(cur.surface)) return false; // ":" etc. are not always tagged 記号
        if (prev.lastPos === "接頭詞") return false;
        if (cur.pos === "助詞" || cur.pos === "助動詞") return false;
        if (cur.detail === "非自立" || cur.detail === "接尾") return false;
        if (cur.pos === "動詞" && prev.lastPos === "動詞") return false; // おき+かえる
        if (cur.pos === "動詞" && SURU_VERBS.has(cur.base) && prev.lastPos === "名詞") return false;
        if (cur.pos === "名詞" && prev.lastPos === "名詞") {
            // split compound nouns only between words of 2+ chars where one has kanji
            const hasKanji = KANJI.test(prev.surface) || KANJI.test(cur.surface);
            const long = [...prev.surface].length >= 2 && [...cur.surface].length >= 2;
            const numeric = prev.detail === "数" || cur.detail === "数";
            return hasKanji && long && !numeric;
        }
        return true;
    }

    function convertText(text, key, spacing, sep = SEP) {
        if (!text) return text;
        const toks = analyze(text, key);
        let out = "";
        toks.forEach((t, i) => {
            if (spacing && boundary(toks[i - 1], t)) out += sep;
            out += readingOf(t, key);
        });
        return out;
    }

    // Labels without parameters are mostly dropdown items (enum members). Blockly moves a word
    // that every dropdown item shares (split on " ") out of the dropdown, e.g. "... ほうこう)",
    // so these get a no-break space, which Blockly does not split on and which looks the same.
    const isPlainLabel = (key, value) => /\|block$/.test(key) && !/[%$]/.test(value);

    function convert(value, key) {
        const sep = isPlainLabel(key, value) ? " " : SEP;
        return value.split(PROTECTED).map((part, i) => {
            if (i % 2 === 0) return convertText(part, key, SPACING, sep);
            // protected markup: only convert a default variable name, e.g. %list(配列)
            return part.replace(/\(([^)]*)\)$/, (_, name) => `(${convertText(name, key, false)})`);
        }).join("");
    }

    const src = {};
    for (const pkg of PACKAGES)
        Object.assign(src, JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, `${pkg}-strings.json`), "utf8")));

    const out = {};
    for (const key of Object.keys(src).sort()) {
        const value = src[key];
        if (keyOverrides[key] !== undefined) { out[key] = keyOverrides[key]; continue; }
        if (!value || !KANJI.test(value)) continue; // nothing to change, keep the official string
        out[key] = convert(value, key);
    }
    for (const [key, value] of Object.entries(overrides.extra || {})) out[key] = value;

    // Safety check: the parameter markup must be identical to the original.
    let broken = 0;
    for (const key of Object.keys(out)) {
        if (src[key] === undefined) continue;
        if (markupOf(src[key]) !== markupOf(out[key])) {
            console.error(`markup changed: ${key}\n  ${src[key]}\n  ${out[key]}`);
            broken++;
        }
        if (KANJI.test(out[key]) && !keyOverrides[key]) unresolved.push(`${key}\t(kanji left)`);
    }
    if (broken) process.exit(1);

    fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");

    const rows = [...review.entries()]
        .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
        .map(([s, r]) => `${s}\t${r.reading}\t${r.count}\t${r.example}`);
    fs.writeFileSync(path.join(__dirname, "review.tsv"), "kanji\treading\tcount\texample_key\n" + rows.join("\n") + "\n");
    const oneLine = s => s.replace(/\r?\n/g, "\\n");
    fs.writeFileSync(path.join(__dirname, "preview.tsv"), "key\toriginal\tconverted\n" +
        Object.keys(out).map(k => `${k}\t${oneLine(src[k] || "")}\t${oneLine(out[k])}`).join("\n") + "\n");

    console.log(`strings written: ${Object.keys(out).length} (spacing: ${SPACING ? JSON.stringify(SEP) : "off"})`);
    console.log(`distinct kanji words: ${review.size}`);
    if (misaligned.length) console.log(`phrases not on word boundaries (not applied):\n  ${[...new Set(misaligned)].join("\n  ")}`);
    if (unresolved.length) console.log(`unresolved:\n  ${[...new Set(unresolved)].join("\n  ")}`);
});
