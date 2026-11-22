// Converts the official Japanese MakeCode for Minecraft strings into hiragana.
//
//   node convert.js          -> writes ../_locales/ja/minecraft-edu-hiragana-strings.json
//                               and review.tsv (every kanji word + the reading used)
//
// Inputs:
//   source/*-strings.json  official ja translations (see fetch-source.sh)
//   overrides.json         { "words": { "<kanji word>": "<hiragana>" },
//                            "keys":  { "<string key>": "<full replacement>" } }
"use strict";
const fs = require("fs");
const path = require("path");
const kuromoji = require("kuromoji");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "_locales", "ja", "minecraft-edu-hiragana-strings.json");
const SOURCE_DIR = path.join(__dirname, "source");
const PACKAGES = ["core", "builder", "shapes", "events", "nether"];

const KANJI = /[々㐀-䶿一-鿿豈-﫿]/;
// Parts of a block string that MakeCode parses and must never change:
// %param, %param=shadowBlockId, $param, and the "|" separators.
const PROTECTED = /(%[A-Za-z_][A-Za-z0-9_]*(?:=[A-Za-z0-9_.]+)?|\$[A-Za-z_][A-Za-z0-9_]*|\|)/;

const kata2hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));

const overrides = fs.existsSync(path.join(__dirname, "overrides.json"))
    ? JSON.parse(fs.readFileSync(path.join(__dirname, "overrides.json"), "utf8"))
    : {};
const wordOverrides = overrides.words || {};
const keyOverrides = overrides.keys || {};
const phrases = Object.entries(overrides.phrases || {}).sort((a, b) => b[0].length - a[0].length);
const applyPhrases = text => phrases.reduce((t, [from, to]) => t.split(from).join(to), text);

kuromoji.builder({ dicPath: path.join(__dirname, "node_modules", "kuromoji", "dict") }).build((err, tokenizer) => {
    if (err) throw err;

    const review = new Map(); // surface -> { reading, count, example }
    const unresolved = [];

    function convertText(text, key) {
        text = applyPhrases(text);
        if (!KANJI.test(text)) return text;
        return tokenizer.tokenize(text).map(t => {
            const s = t.surface_form;
            if (!KANJI.test(s)) return s;
            let reading = wordOverrides[s];
            if (!reading) {
                if (!t.reading || t.reading === "*") {
                    unresolved.push(`${key}\t${s}`);
                    return s;
                }
                reading = kata2hira(t.reading);
            }
            const r = review.get(s) || { reading, count: 0, example: key };
            r.count++;
            review.set(s, r);
            return reading;
        }).join("");
    }

    function convert(value, key) {
        return value.split(PROTECTED).map((part, i) => (i % 2 ? part : convertText(part, key))).join("");
    }

    const out = {};
    for (const pkg of PACKAGES) {
        const src = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, `${pkg}-strings.json`), "utf8"));
        for (const key of Object.keys(src)) {
            const value = src[key];
            if (!value || !KANJI.test(value)) continue; // nothing to change, keep official string
            out[key] = keyOverrides[key] !== undefined ? keyOverrides[key] : convert(value, key);
        }
    }

    // Safety check: the parameter markup must be identical to the original.
    let broken = 0;
    for (const pkg of PACKAGES) {
        const src = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, `${pkg}-strings.json`), "utf8"));
        for (const key of Object.keys(out)) {
            if (src[key] === undefined) continue;
            const markup = s => (s.match(new RegExp(PROTECTED, "g")) || []).join(" ");
            if (markup(src[key]) !== markup(out[key])) {
                console.error(`markup changed: ${key}\n  ${src[key]}\n  ${out[key]}`);
                broken++;
            }
        }
    }
    if (broken) process.exit(1);

    const sorted = {};
    Object.keys(out).sort().forEach(k => (sorted[k] = out[k]));
    fs.writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");

    const rows = [...review.entries()]
        .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
        .map(([s, r]) => `${s}\t${r.reading}\t${r.count}\t${r.example}`);
    fs.writeFileSync(path.join(__dirname, "review.tsv"), "kanji\treading\tcount\texample_key\n" + rows.join("\n") + "\n");

    console.log(`strings written: ${Object.keys(sorted).length}`);
    console.log(`distinct kanji words: ${review.size}`);
    if (unresolved.length) console.log(`no reading found (left as-is):\n  ${unresolved.join("\n  ")}`);
});
