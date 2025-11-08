import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const normalizeRomaji = (r) => r.trim().toLowerCase();
const deriveType = (opts = {}, char) => {
  if (opts.combo) return "combo";
  if (opts.dakuten) return "dakuten";
  if (opts.handakuten) return "handakuten";
  if (char === "っ" || char === "ッ" || char === "ぃ" || char === "ゃ" || char === "ゅ" || char === "ょ") return "small";
  return "basic";
};
const make = (char, romaji, script, opts = {}) => {
  const normalizedRomaji = normalizeRomaji(romaji);
  const group = opts.group ?? (opts.combo ? `Combo` : opts.dakuten ? `Dakuten` : opts.handakuten ? `Handakuten` : "misc");
  const entry2 = {
    char,
    romaji: normalizedRomaji,
    script,
    group,
    combo: !!opts.combo,
    dakuten: !!opts.dakuten,
    handakuten: !!opts.handakuten,
    note: opts.note,
    type: deriveType(opts, char)
  };
  return entry2;
};
const hiragana = [
  make("あ", "a", "hiragana", { group: "A-row" }),
  make("い", "i", "hiragana", { group: "A-row" }),
  make("う", "u", "hiragana", { group: "A-row" }),
  make("え", "e", "hiragana", { group: "A-row" }),
  make("お", "o", "hiragana", { group: "A-row" }),
  make("か", "ka", "hiragana", { group: "K-row" }),
  make("き", "ki", "hiragana", { group: "K-row" }),
  make("く", "ku", "hiragana", { group: "K-row" }),
  make("け", "ke", "hiragana", { group: "K-row" }),
  make("こ", "ko", "hiragana", { group: "K-row" }),
  make("さ", "sa", "hiragana", { group: "S-row" }),
  make("し", "shi", "hiragana", { group: "S-row" }),
  make("す", "su", "hiragana", { group: "S-row" }),
  make("せ", "se", "hiragana", { group: "S-row" }),
  make("そ", "so", "hiragana", { group: "S-row" }),
  make("た", "ta", "hiragana", { group: "T-row" }),
  make("ち", "chi", "hiragana", { group: "T-row" }),
  make("つ", "tsu", "hiragana", { group: "T-row" }),
  make("て", "te", "hiragana", { group: "T-row" }),
  make("と", "to", "hiragana", { group: "T-row" }),
  make("な", "na", "hiragana", { group: "N-row" }),
  make("に", "ni", "hiragana", { group: "N-row" }),
  make("ぬ", "nu", "hiragana", { group: "N-row" }),
  make("ね", "ne", "hiragana", { group: "N-row" }),
  make("の", "no", "hiragana", { group: "N-row" }),
  make("は", "ha", "hiragana", { group: "H-row" }),
  make("ひ", "hi", "hiragana", { group: "H-row" }),
  make("ふ", "fu", "hiragana", { group: "H-row" }),
  make("へ", "he", "hiragana", { group: "H-row" }),
  make("ほ", "ho", "hiragana", { group: "H-row" }),
  make("ま", "ma", "hiragana", { group: "M-row" }),
  make("み", "mi", "hiragana", { group: "M-row" }),
  make("む", "mu", "hiragana", { group: "M-row" }),
  make("め", "me", "hiragana", { group: "M-row" }),
  make("も", "mo", "hiragana", { group: "M-row" }),
  make("や", "ya", "hiragana", { group: "Y-row" }),
  make("ゆ", "yu", "hiragana", { group: "Y-row" }),
  make("よ", "yo", "hiragana", { group: "Y-row" }),
  make("ら", "ra", "hiragana", { group: "R-row" }),
  make("り", "ri", "hiragana", { group: "R-row" }),
  make("る", "ru", "hiragana", { group: "R-row" }),
  make("れ", "re", "hiragana", { group: "R-row" }),
  make("ろ", "ro", "hiragana", { group: "R-row" }),
  make("わ", "wa", "hiragana", { group: "W-row" }),
  make("を", "o", "hiragana", { group: "W-row", note: 'object particle often pronounced "o"' }),
  make("ん", "n", "hiragana", { group: "misc" }),
  // small tsu (sokuon)
  make("っ", "(sokuon)", "hiragana", { group: "misc", note: "not pronounced alone; doubles following consonant" })
];
const hiraganaDakuten = [
  make("が", "ga", "hiragana", { group: "G-dakuten", dakuten: true }),
  make("ぎ", "gi", "hiragana", { group: "G-dakuten", dakuten: true }),
  make("ぐ", "gu", "hiragana", { group: "G-dakuten", dakuten: true }),
  make("げ", "ge", "hiragana", { group: "G-dakuten", dakuten: true }),
  make("ご", "go", "hiragana", { group: "G-dakuten", dakuten: true }),
  make("ざ", "za", "hiragana", { group: "Z-dakuten", dakuten: true }),
  make("じ", "ji", "hiragana", { group: "Z-dakuten", dakuten: true }),
  make("ず", "zu", "hiragana", { group: "Z-dakuten", dakuten: true }),
  make("ぜ", "ze", "hiragana", { group: "Z-dakuten", dakuten: true }),
  make("ぞ", "zo", "hiragana", { group: "Z-dakuten", dakuten: true }),
  make("だ", "da", "hiragana", { group: "D-dakuten", dakuten: true }),
  make("ぢ", "ji", "hiragana", { group: "D-dakuten", dakuten: true, note: 'rare, maps to "ji"' }),
  make("づ", "zu", "hiragana", { group: "D-dakuten", dakuten: true, note: 'rare, maps to "zu"' }),
  make("で", "de", "hiragana", { group: "D-dakuten", dakuten: true }),
  make("ど", "do", "hiragana", { group: "D-dakuten", dakuten: true }),
  make("ば", "ba", "hiragana", { group: "B-dakuten", dakuten: true }),
  make("び", "bi", "hiragana", { group: "B-dakuten", dakuten: true }),
  make("ぶ", "bu", "hiragana", { group: "B-dakuten", dakuten: true }),
  make("べ", "be", "hiragana", { group: "B-dakuten", dakuten: true }),
  make("ぼ", "bo", "hiragana", { group: "B-dakuten", dakuten: true }),
  make("ぱ", "pa", "hiragana", { group: "P-handakuten", handakuten: true }),
  make("ぴ", "pi", "hiragana", { group: "P-handakuten", handakuten: true }),
  make("ぷ", "pu", "hiragana", { group: "P-handakuten", handakuten: true }),
  make("ぺ", "pe", "hiragana", { group: "P-handakuten", handakuten: true }),
  make("ぽ", "po", "hiragana", { group: "P-handakuten", handakuten: true })
];
const hiraganaCombos = [
  // K
  make("きゃ", "kya", "hiragana", { combo: true, group: "Combo-K" }),
  make("きゅ", "kyu", "hiragana", { combo: true, group: "Combo-K" }),
  make("きょ", "kyo", "hiragana", { combo: true, group: "Combo-K" }),
  // S
  make("しゃ", "sha", "hiragana", { combo: true, group: "Combo-S" }),
  make("しゅ", "shu", "hiragana", { combo: true, group: "Combo-S" }),
  make("しょ", "sho", "hiragana", { combo: true, group: "Combo-S" }),
  // T
  make("ちゃ", "cha", "hiragana", { combo: true, group: "Combo-T" }),
  make("ちゅ", "chu", "hiragana", { combo: true, group: "Combo-T" }),
  make("ちょ", "cho", "hiragana", { combo: true, group: "Combo-T" }),
  // N
  make("にゃ", "nya", "hiragana", { combo: true, group: "Combo-N" }),
  make("にゅ", "nyu", "hiragana", { combo: true, group: "Combo-N" }),
  make("にょ", "nyo", "hiragana", { combo: true, group: "Combo-N" }),
  // H
  make("ひゃ", "hya", "hiragana", { combo: true, group: "Combo-H" }),
  make("ひゅ", "hyu", "hiragana", { combo: true, group: "Combo-H" }),
  make("ひょ", "hyo", "hiragana", { combo: true, group: "Combo-H" }),
  // M
  make("みゃ", "mya", "hiragana", { combo: true, group: "Combo-M" }),
  make("みゅ", "myu", "hiragana", { combo: true, group: "Combo-M" }),
  make("みょ", "myo", "hiragana", { combo: true, group: "Combo-M" }),
  // R
  make("りゃ", "rya", "hiragana", { combo: true, group: "Combo-R" }),
  make("りゅ", "ryu", "hiragana", { combo: true, group: "Combo-R" }),
  make("りょ", "ryo", "hiragana", { combo: true, group: "Combo-R" }),
  // G (dakuten combos)
  make("ぎゃ", "gya", "hiragana", { combo: true, dakuten: true, group: "Combo-G" }),
  make("ぎゅ", "gyu", "hiragana", { combo: true, dakuten: true, group: "Combo-G" }),
  make("ぎょ", "gyo", "hiragana", { combo: true, dakuten: true, group: "Combo-G" }),
  // J (from じ / ぢ)
  make("じゃ", "ja", "hiragana", { combo: true, dakuten: true, group: "Combo-J" }),
  make("じゅ", "ju", "hiragana", { combo: true, dakuten: true, group: "Combo-J" }),
  make("じょ", "jo", "hiragana", { combo: true, dakuten: true, group: "Combo-J" }),
  // Rare: ぢゃ/ぢゅ/ぢょ (maps to same romanization)
  make("ぢゃ", "ja", "hiragana", { combo: true, dakuten: true, group: "Combo-J-rare", note: "rare form" }),
  make("ぢゅ", "ju", "hiragana", { combo: true, dakuten: true, group: "Combo-J-rare", note: "rare form" }),
  make("ぢょ", "jo", "hiragana", { combo: true, dakuten: true, group: "Combo-J-rare", note: "rare form" }),
  // B / P
  make("びゃ", "bya", "hiragana", { combo: true, dakuten: true, group: "Combo-B" }),
  make("びゅ", "byu", "hiragana", { combo: true, dakuten: true, group: "Combo-B" }),
  make("びょ", "byo", "hiragana", { combo: true, dakuten: true, group: "Combo-B" }),
  make("ぴゃ", "pya", "hiragana", { combo: true, handakuten: true, group: "Combo-P" }),
  make("ぴゅ", "pyu", "hiragana", { combo: true, handakuten: true, group: "Combo-P" }),
  make("ぴょ", "pyo", "hiragana", { combo: true, handakuten: true, group: "Combo-P" })
];
const katakana = [
  make("ア", "a", "katakana", { group: "A-row" }),
  make("イ", "i", "katakana", { group: "A-row" }),
  make("ウ", "u", "katakana", { group: "A-row" }),
  make("エ", "e", "katakana", { group: "A-row" }),
  make("オ", "o", "katakana", { group: "A-row" }),
  make("カ", "ka", "katakana", { group: "K-row" }),
  make("キ", "ki", "katakana", { group: "K-row" }),
  make("ク", "ku", "katakana", { group: "K-row" }),
  make("ケ", "ke", "katakana", { group: "K-row" }),
  make("コ", "ko", "katakana", { group: "K-row" }),
  make("サ", "sa", "katakana", { group: "S-row" }),
  make("シ", "shi", "katakana", { group: "S-row" }),
  make("ス", "su", "katakana", { group: "S-row" }),
  make("セ", "se", "katakana", { group: "S-row" }),
  make("ソ", "so", "katakana", { group: "S-row" }),
  make("タ", "ta", "katakana", { group: "T-row" }),
  make("チ", "chi", "katakana", { group: "T-row" }),
  make("ツ", "tsu", "katakana", { group: "T-row" }),
  make("テ", "te", "katakana", { group: "T-row" }),
  make("ト", "to", "katakana", { group: "T-row" }),
  make("ナ", "na", "katakana", { group: "N-row" }),
  make("ニ", "ni", "katakana", { group: "N-row" }),
  make("ヌ", "nu", "katakana", { group: "N-row" }),
  make("ネ", "ne", "katakana", { group: "N-row" }),
  make("ノ", "no", "katakana", { group: "N-row" }),
  make("ハ", "ha", "katakana", { group: "H-row" }),
  make("ヒ", "hi", "katakana", { group: "H-row" }),
  make("フ", "fu", "katakana", { group: "H-row" }),
  make("ヘ", "he", "katakana", { group: "H-row" }),
  make("ホ", "ho", "katakana", { group: "H-row" }),
  make("マ", "ma", "katakana", { group: "M-row" }),
  make("ミ", "mi", "katakana", { group: "M-row" }),
  make("ム", "mu", "katakana", { group: "M-row" }),
  make("メ", "me", "katakana", { group: "M-row" }),
  make("モ", "mo", "katakana", { group: "M-row" }),
  make("ヤ", "ya", "katakana", { group: "Y-row" }),
  make("ユ", "yu", "katakana", { group: "Y-row" }),
  make("ヨ", "yo", "katakana", { group: "Y-row" }),
  make("ラ", "ra", "katakana", { group: "R-row" }),
  make("リ", "ri", "katakana", { group: "R-row" }),
  make("ル", "ru", "katakana", { group: "R-row" }),
  make("レ", "re", "katakana", { group: "R-row" }),
  make("ロ", "ro", "katakana", { group: "R-row" }),
  make("ワ", "wa", "katakana", { group: "W-row" }),
  make("ヲ", "o", "katakana", { group: "W-row", note: 'often pronounced "o" (particle)' }),
  make("ン", "n", "katakana", { group: "misc" }),
  // small tsu
  make("ッ", "(sokuon)", "katakana", { group: "misc", note: "not pronounced alone; doubles following consonant" })
];
const katakanaDakuten = [
  make("ガ", "ga", "katakana", { group: "G-dakuten", dakuten: true }),
  make("ギ", "gi", "katakana", { group: "G-dakuten", dakuten: true }),
  make("グ", "gu", "katakana", { group: "G-dakuten", dakuten: true }),
  make("ゲ", "ge", "katakana", { group: "G-dakuten", dakuten: true }),
  make("ゴ", "go", "katakana", { group: "G-dakuten", dakuten: true }),
  make("ザ", "za", "katakana", { group: "Z-dakuten", dakuten: true }),
  make("ジ", "ji", "katakana", { group: "Z-dakuten", dakuten: true }),
  make("ズ", "zu", "katakana", { group: "Z-dakuten", dakuten: true }),
  make("ゼ", "ze", "katakana", { group: "Z-dakuten", dakuten: true }),
  make("ゾ", "zo", "katakana", { group: "Z-dakuten", dakuten: true }),
  make("ダ", "da", "katakana", { group: "D-dakuten", dakuten: true }),
  make("ヂ", "ji", "katakana", { group: "D-dakuten", dakuten: true }),
  make("ヅ", "zu", "katakana", { group: "D-dakuten", dakuten: true }),
  make("デ", "de", "katakana", { group: "D-dakuten", dakuten: true }),
  make("ド", "do", "katakana", { group: "D-dakuten", dakuten: true }),
  make("バ", "ba", "katakana", { group: "B-dakuten", dakuten: true }),
  make("ビ", "bi", "katakana", { group: "B-dakuten", dakuten: true }),
  make("ブ", "bu", "katakana", { group: "B-dakuten", dakuten: true }),
  make("ベ", "be", "katakana", { group: "B-dakuten", dakuten: true }),
  make("ボ", "bo", "katakana", { group: "B-dakuten", dakuten: true }),
  make("パ", "pa", "katakana", { group: "P-handakuten", handakuten: true }),
  make("ピ", "pi", "katakana", { group: "P-handakuten", handakuten: true }),
  make("プ", "pu", "katakana", { group: "P-handakuten", handakuten: true }),
  make("ペ", "pe", "katakana", { group: "P-handakuten", handakuten: true }),
  make("ポ", "po", "katakana", { group: "P-handakuten", handakuten: true })
];
const katakanaCombos = [
  make("キャ", "kya", "katakana", { combo: true, group: "Combo-K" }),
  make("キュ", "kyu", "katakana", { combo: true, group: "Combo-K" }),
  make("キョ", "kyo", "katakana", { combo: true, group: "Combo-K" }),
  make("シャ", "sha", "katakana", { combo: true, group: "Combo-S" }),
  make("シュ", "shu", "katakana", { combo: true, group: "Combo-S" }),
  make("ショ", "sho", "katakana", { combo: true, group: "Combo-S" }),
  make("チャ", "cha", "katakana", { combo: true, group: "Combo-T" }),
  make("チュ", "chu", "katakana", { combo: true, group: "Combo-T" }),
  make("チョ", "cho", "katakana", { combo: true, group: "Combo-T" }),
  make("ニャ", "nya", "katakana", { combo: true, group: "Combo-N" }),
  make("ニュ", "nyu", "katakana", { combo: true, group: "Combo-N" }),
  make("ニョ", "nyo", "katakana", { combo: true, group: "Combo-N" }),
  make("ヒャ", "hya", "katakana", { combo: true, group: "Combo-H" }),
  make("ヒュ", "hyu", "katakana", { combo: true, group: "Combo-H" }),
  make("ヒョ", "hyo", "katakana", { combo: true, group: "Combo-H" }),
  make("ミャ", "mya", "katakana", { combo: true, group: "Combo-M" }),
  make("ミュ", "myu", "katakana", { combo: true, group: "Combo-M" }),
  make("ミョ", "myo", "katakana", { combo: true, group: "Combo-M" }),
  make("リャ", "rya", "katakana", { combo: true, group: "Combo-R" }),
  make("リュ", "ryu", "katakana", { combo: true, group: "Combo-R" }),
  make("リョ", "ryo", "katakana", { combo: true, group: "Combo-R" }),
  make("ギャ", "gya", "katakana", { combo: true, dakuten: true, group: "Combo-G" }),
  make("ギュ", "gyu", "katakana", { combo: true, dakuten: true, group: "Combo-G" }),
  make("ギョ", "gyo", "katakana", { combo: true, dakuten: true, group: "Combo-G" }),
  make("ジャ", "ja", "katakana", { combo: true, dakuten: true, group: "Combo-J" }),
  make("ジュ", "ju", "katakana", { combo: true, dakuten: true, group: "Combo-J" }),
  make("ジョ", "jo", "katakana", { combo: true, dakuten: true, group: "Combo-J" }),
  make("ビャ", "bya", "katakana", { combo: true, dakuten: true, group: "Combo-B" }),
  make("ビュ", "byu", "katakana", { combo: true, dakuten: true, group: "Combo-B" }),
  make("ビョ", "byo", "katakana", { combo: true, dakuten: true, group: "Combo-B" }),
  make("ピャ", "pya", "katakana", { combo: true, handakuten: true, group: "Combo-P" }),
  make("ピュ", "pyu", "katakana", { combo: true, handakuten: true, group: "Combo-P" }),
  make("ピョ", "pyo", "katakana", { combo: true, handakuten: true, group: "Combo-P" }),
  // Rare: ヂャ/ヂュ/ヂョ
  make("ヂャ", "ja", "katakana", { combo: true, dakuten: true, group: "Combo-J-rare", note: "rare" }),
  make("ヂュ", "ju", "katakana", { combo: true, dakuten: true, group: "Combo-J-rare", note: "rare" }),
  make("ヂョ", "jo", "katakana", { combo: true, dakuten: true, group: "Combo-J-rare", note: "rare" })
];
const allKana = [
  ...hiragana,
  ...hiraganaDakuten,
  ...hiraganaCombos,
  ...katakana,
  ...katakanaDakuten,
  ...katakanaCombos
];
new Map(allKana.map((k) => [k.char, k]));
const byRomaji = /* @__PURE__ */ new Map();
allKana.forEach((k) => {
  const key = normalizeRomaji(k.romaji);
  const list = byRomaji.get(key) ?? [];
  list.push(k);
  byRomaji.set(key, list);
});
function findByGroup(group) {
  return allKana.filter((k) => (k.group ?? "misc") === group);
}
function getKanaGroups() {
  const all = allKana;
  const map = /* @__PURE__ */ new Map();
  for (const k of all) {
    if (!map.has(k.script)) map.set(k.script, /* @__PURE__ */ new Map());
    const scriptMap = map.get(k.script);
    const group = k.group ?? "misc";
    if (!scriptMap.has(group)) scriptMap.set(group, []);
    scriptMap.get(group).push(k);
  }
  const out = [];
  for (const [script, groups] of map) {
    for (const [group, items] of groups) {
      out.push({
        script,
        group,
        items: items.map((i) => ({ char: i.char, romaji: i.romaji })),
        count: items.length
      });
    }
  }
  return out;
}
if (process.env.NODE_ENV !== "production") {
  const seen = /* @__PURE__ */ new Set();
  for (const k of allKana) {
    if (!k.romaji) console.warn("missing romaji for", k.char);
    if (seen.has(k.char)) console.warn("duplicate char", k.char);
    seen.add(k.char);
  }
}
const MOD = ["Dakuten", "Combos"];
const TYPE = ["Hiragana", "Katakana"];
function useNavbar({
  row,
  setRow,
  mod,
  setMod,
  scriptType,
  setScriptType
}) {
  const [openRow, setOpenRow] = useState(false);
  const rootRef = useRef(null);
  const kanaGroups = useMemo(() => getKanaGroups(), []);
  const scriptKey = (scriptType || "Hiragana").toLowerCase();
  const groupsForScript = useMemo(() => {
    const base = kanaGroups.filter((s) => s.script === scriptKey);
    if (mod === "Dakuten") {
      return base.slice().sort((a, b) => {
        const aMatch = /dakuten|handakuten/i.test(a.group) ? 0 : 1;
        const bMatch = /dakuten|handakuten/i.test(b.group) ? 0 : 1;
        return aMatch - bMatch;
      });
    }
    if (mod === "Combos") {
      return base.slice().sort((a, b) => {
        const aMatch = /combo/i.test(a.group) ? 0 : 1;
        const bMatch = /combo/i.test(b.group) ? 0 : 1;
        return aMatch - bMatch;
      });
    }
    return base;
  }, [kanaGroups, scriptKey, mod]);
  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpenRow(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpenRow(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  const toggleRow = useCallback(() => setOpenRow((v) => !v), []);
  const nextMod = useCallback(() => {
    const i = MOD.indexOf(mod);
    const newMod = MOD[(i + 1) % MOD.length];
    setMod(newMod);
    const groups = getKanaGroups().filter((g) => g.script === scriptKey);
    let filtered = groups;
    if (newMod === "Dakuten") filtered = groups.filter((g) => /dakuten|handakuten/i.test(g.group));
    else if (newMod === "Combos") filtered = groups.filter((g) => /combo/i.test(g.group));
    if (filtered.length) setRow(filtered[0].group);
  }, [mod, setMod, setRow, scriptKey]);
  const nextType = useCallback(() => {
    const i = TYPE.indexOf(scriptType);
    setScriptType(TYPE[(i + 1) % TYPE.length]);
  }, [scriptType, setScriptType]);
  return {
    openRow,
    setOpenRow,
    rootRef,
    groupsForScript,
    toggleRow,
    nextMod,
    nextType
  };
}
function IconButton({
  label,
  pressed,
  onClick,
  className,
  ariaHasPopup,
  ariaExpanded
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      "aria-pressed": !!pressed,
      "aria-haspopup": ariaHasPopup ? "menu" : void 0,
      "aria-expanded": ariaExpanded,
      onClick,
      className: cn(
        "relative flex items-center text-sm transition active:scale-105 py-1 px-4 rounded-full backdrop-blur-2xl",
        "bg-zinc-300/10 text-zinc-200 not-hover:text-zinc-100/45 border border-transparent active:border-zinc-300/45",
        className
      ),
      children: label
    }
  );
}
function NavBar({ row, setRow, mod, setMod, scriptType, setScriptType }) {
  const {
    openRow,
    setOpenRow,
    rootRef,
    groupsForScript,
    toggleRow,
    nextMod,
    nextType
  } = useNavbar({
    row,
    setRow,
    mod,
    setMod,
    scriptType,
    setScriptType
  });
  return /* @__PURE__ */ jsx("nav", { ref: rootRef, className: "w-screen max-w-md flex items-start relative -mx-3 -mt-3 px-3 pt-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row justify-between gap-2 w-full", children: [
    openRow && /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": !openRow,
        className: cn(
          "fixed inset-0 z-40 duration-200 transition ease-in-out",
          openRow ? "pointer-events-auto backdrop-blur-sm" : "opacity-0 pointer-events-none"
        ),
        style: { background: "rgba(0,0,0,0.35)" },
        onClick: () => setOpenRow(false)
      }
    ),
    /* @__PURE__ */ jsx(
      IconButton,
      {
        label: `${row.replace("-row", "")} Row`,
        pressed: openRow,
        onClick: toggleRow,
        ariaHasPopup: true,
        ariaExpanded: openRow,
        className: openRow ? "z-50" : void 0
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": !openRow,
        className: cn(
          "absolute top-0 left-0 min-h-svh h-full w-full z-40 pointer-events-none px-2 transition-all duration-300",
          openRow ? "opacity-100 pointer-events-auto" : "opacity-0"
        ),
        children: /* @__PURE__ */ jsx(
          "div",
          {
            role: "menu",
            "aria-hidden": !openRow,
            className: cn(
              "mx-auto mt-14 max-w-4xl min-w-3xs rounded-xl shadow-lg overflow-hidden transform transition-all duration-300",
              openRow ? "opacity-100 translate-y-0 backdrop-blur-xl" : "opacity-0 -translate-y-6"
            ),
            style: { background: "rgba(28,28,30,0.55)" },
            children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 p-3 py-4 w-full max-h-[65vh] overflow-y-auto", children: groupsForScript.map(({ count, group, items }, idx) => /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setRow(group);
                  setOpenRow(false);
                },
                className: cn(
                  "relative flex flex-col items-start justify-start gap-0.5 rounded-lg py-2 px-2 transition duration-200",
                  "bg-zinc-500/6 border border-zinc-500/10 hover:border-zinc-500/45 hover:scale-[1.01] cursor-pointer",
                  "hover:bg-zinc-500/18 active:bg-zinc-500/30",
                  openRow ? "opacity-100 translate-y-0" : "opacity-80 -translate-y-1"
                ),
                style: { transitionDelay: `${Math.min(120, idx * 12)}ms` },
                children: [
                  /* @__PURE__ */ jsx("span", { className: "absolute top-2 right-2 aspect-square py-1 px-2 text-xs opacity-45 border border-zinc-200 rounded-full", children: count }),
                  /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
                    group.replace("-row", ""),
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "opacity-45", children: "Row" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm opacity-75", children: items.slice(0, 5).map(({ char, romaji }) => `${char} (${romaji}), `).join(" ") })
                ]
              },
              group
            )) })
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(IconButton, { label: mod, onClick: nextMod }),
    /* @__PURE__ */ jsx(IconButton, { label: scriptType, pressed: scriptType === TYPE[1], onClick: nextType })
  ] }) });
}
const levels$1 = [
  { label: "Excellent", rate: 90, emoji: "🤩" },
  { label: "Good", rate: 75, emoji: "😊" },
  { label: "Average", rate: 50, emoji: "🙂" },
  { label: "Needs Work", rate: 25, emoji: "😕" },
  { label: "Poor", rate: 0, emoji: "😞" }
];
function KanaStats({
  correctCount,
  wrongCount,
  displayRate,
  canEvaluate
}) {
  const match = levels$1.find((lvl) => displayRate >= lvl.rate);
  return /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 flex items-center justify-between gap-4 w-full p-4", children: /* @__PURE__ */ jsxs("div", { className: "text-sm flex flex-row items-center justify-between w-full", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center size-9 p-2 aspect-square! bg-green-300/25 border border-green-300/25 rounded-full", children: /* @__PURE__ */ jsx("strong", { className: "text-green-300", children: correctCount }) }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-center", children: match && canEvaluate && /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
      match.emoji,
      " ",
      match.label
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center size-9 p-2 aspect-square! bg-red-300/25 border border-red-300/25 rounded-full", children: /* @__PURE__ */ jsx("strong", { className: "text-red-300", children: wrongCount }) })
  ] }) });
}
function KanaDisplay({
  current,
  showRomaji,
  setShowRomaji,
  correctCount,
  wrongCount,
  displayRate,
  rawRate,
  canEvaluate,
  onShuffle,
  onReset,
  groupKana
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "relative w-full aspect-square rounded-xl transition-[background]",
      style: {
        background: `conic-gradient(#3b82f6 ${displayRate}% , transparent 0)`
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "relative flex flex-col items-center justify-center w-full aspect-square text-zinc-200 border border-zinc-500/25 py-3 px-3 rounded-xl backdrop-blur-2xl",
          role: "region",
          "aria-label": "Kana display",
          children: [
            /* @__PURE__ */ jsx("p", { className: "absolute top-3 text-xs text-center leading-tight opacity-45", children: "Tap / hover the kana to reveal the romanization. Pick the matching romaji button." }),
            groupKana.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full w-full text-red-300 text-center px-4", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-semibold", children: "No kana found" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm opacity-60", children: "Pick another row or script." })
            ] }) }) : /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowRomaji(!showRomaji),
                className: "group relative flex items-center justify-center h-4/6 w-11/12 md:w-3/4 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500/40",
                "aria-pressed": showRomaji,
                children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: cn(
                        "absolute inset-0 flex items-center justify-center text-[6rem] md:text-[9rem] transition-all duration-300",
                        showRomaji ? "opacity-0 scale-75" : "opacity-100 scale-100",
                        "md:group-hover:opacity-0 md:group-hover:scale-75"
                      ),
                      "aria-hidden": showRomaji,
                      children: current?.char ?? "—"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: cn(
                        "absolute inset-0 flex items-center justify-center text-4xl md:text-6xl transition-all duration-300",
                        showRomaji ? "opacity-100 scale-100" : "opacity-0 scale-75",
                        "md:group-hover:opacity-100 md:group-hover:scale-100"
                      ),
                      "aria-hidden": !showRomaji,
                      children: current?.romaji ?? ""
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              KanaStats,
              {
                correctCount,
                wrongCount,
                displayRate,
                rawRate,
                canEvaluate,
                onShuffle,
                onReset
              }
            )
          ]
        }
      )
    }
  );
}
function OptionsGrid({ groupKana, current, onOptionClick }) {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 w-full", children: groupKana.length > 0 ? groupKana.map((k) => {
    const isActive = k.char === current?.char;
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onOptionClick(k.romaji),
        className: cn(
          "px-4 py-3 text-xl text-zinc-200 rounded-full border border-dashed border-zinc-200/25 transition duration-200",
          "hover:bg-zinc-200/5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-zinc-500/30",
          isActive ? "active:bg-green-500/5 active:border-green-500/25 active:text-green-300" : "bg-transparent"
        ),
        "aria-pressed": isActive,
        "aria-label": `Answer ${k.romaji}`,
        children: k.romaji
      },
      k.char
    );
  }) : /* @__PURE__ */ jsx("div", { className: "col-span-2 text-center text-sm text-zinc-400", children: "No options" }) });
}
function InfoSection() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-sm leading-relaxed text-zinc-300/45 my-18", children: [
    /* @__PURE__ */ jsx("h4", { className: "text-base font-semibold", children: "How it works" }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Master one row at a time. When you can answer without mistakes, move to the next row. Use ",
      /* @__PURE__ */ jsx("strong", { children: "Play Sound" }),
      " to check pronunciation, and",
      /* @__PURE__ */ jsx("strong", { children: " Stroke Order" }),
      " if you're practicing handwriting."
    ] }),
    /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("strong", { children: "Dakuten ( ゛ )" }),
      ' adds "voicing" to consonants:'
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: "ml-5 list-disc space-y-1", children: [
      /* @__PURE__ */ jsx("li", { children: "か → が (k → g)" }),
      /* @__PURE__ */ jsx("li", { children: "た → だ (t → d)" }),
      /* @__PURE__ */ jsx("li", { children: "さ → ざ (s / ts → z)" }),
      /* @__PURE__ */ jsx("li", { children: "は → ば (h / f → b)" }),
      /* @__PURE__ */ jsx("li", { children: "し / ち → じ (sh / ch → j)" })
    ] }),
    /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("strong", { children: "Handakuten ( ゜ )" }),
      " turns ",
      /* @__PURE__ */ jsx("code", { children: "h / f" }),
      " into ",
      /* @__PURE__ */ jsx("code", { children: "p" }),
      ": ほ → ぽ (ho → po)"
    ] }),
    /* @__PURE__ */ jsx("p", { children: "Small kana combine sounds:" }),
    /* @__PURE__ */ jsxs("ul", { className: "ml-5 list-disc space-y-1", children: [
      /* @__PURE__ */ jsx("li", { children: "ぎ + ゃ → ぎゃ (gya)" }),
      /* @__PURE__ */ jsx("li", { children: "ゅ / ょ / ゃ modify the consonant before them" })
    ] }),
    /* @__PURE__ */ jsx("p", { children: "The small っ is a pause — it doubles the next consonant: にっぽん (nippon) vs がこう (gakou)" })
  ] });
}
const PRIOR_CORRECT = 0;
const PRIOR_TOTAL = 1;
const MIN_ATTEMPTS_FOR_100 = 20;
const levels = [
  { label: "Excellent", rate: 90, emoji: "🤩" },
  { label: "Good", rate: 75, emoji: "😊" },
  { label: "Average", rate: 50, emoji: "🙂" },
  { label: "Needs Work", rate: 25, emoji: "😕" },
  { label: "Poor", rate: 0, emoji: "😞" }
];
function useKanaGame({
  initialRow = "A-row",
  initialMod = "Dakuten",
  initialScriptType = "Hiragana"
} = {}) {
  const [row, setRow] = useState(initialRow);
  const [mod, setMod] = useState(initialMod);
  const [scriptType, setScriptType] = useState(initialScriptType);
  const [groupKana, setGroupKana] = useState(
    () => findByGroup(initialRow).filter((k) => k.script === initialScriptType.toLowerCase())
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [displayRate, setDisplayRate] = useState(0);
  const prevRowRef = useRef(row);
  const prevScriptRef = useRef(scriptType);
  const current = groupKana[currentIndex];
  const total = correctCount + wrongCount;
  const trueRate = useMemo(() => {
    if (total + PRIOR_TOTAL === 0) return 0;
    return (correctCount + PRIOR_CORRECT) / (total + PRIOR_TOTAL) * 100;
  }, [correctCount, total]);
  const targetRate = useMemo(() => {
    const capped = total + PRIOR_TOTAL >= MIN_ATTEMPTS_FOR_100 ? Math.min(trueRate, 100) : Math.min(trueRate, 99);
    return Math.max(0, Math.min(100, capped));
  }, [trueRate, total]);
  const rawRate = total === 0 ? 0 : Math.round(correctCount / total * 100);
  const canEvaluate = correctCount + wrongCount >= groupKana.length * 2 / 3;
  const match = levels.find((lvl) => displayRate >= lvl.rate);
  const normalizeRomaji2 = useCallback((r) => r.trim().toLowerCase(), []);
  const shuffleIndex = useCallback(() => {
    if (!groupKana || groupKana.length <= 1) {
      setCurrentIndex(0);
      return;
    }
    const max = groupKana.length;
    let next = Math.floor(Math.random() * max);
    if (next === currentIndex) next = (next + 1) % max;
    setCurrentIndex(next);
    setShowRomaji(false);
    setShowHint(false);
  }, [groupKana, currentIndex]);
  const handleOptionClick = useCallback((selectedRomaji) => {
    if (!current) return;
    const correct = normalizeRomaji2(selectedRomaji) === normalizeRomaji2(current.romaji);
    if (correct) {
      setCorrectCount((c) => c + 1);
      shuffleIndex();
    } else {
      setWrongCount((w) => w + 1);
      setShowHint(true);
      setShowRomaji(true);
    }
  }, [current, normalizeRomaji2, shuffleIndex]);
  const resetStats = useCallback(() => {
    setCorrectCount(0);
    setWrongCount(0);
    setShowHint(false);
    setShowRomaji(false);
    setDisplayRate(0);
  }, []);
  useEffect(() => {
    let raf = 0;
    const step = () => {
      setDisplayRate((prev) => {
        const diff = targetRate - prev;
        if (Math.abs(diff) < 0.25) {
          cancelAnimationFrame(raf);
          return targetRate;
        }
        const stepVal = diff * 0.12;
        const minStep = Math.sign(diff) * 0.35;
        return prev + (Math.abs(stepVal) > Math.abs(minStep) ? stepVal : minStep);
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [targetRate]);
  useEffect(() => {
    const scriptKey = scriptType.toLowerCase();
    const list = findByGroup(row).filter((k) => k.script === scriptKey) ?? [];
    setGroupKana(list);
    setCurrentIndex((ci) => list.length === 0 ? 0 : Math.min(ci, list.length - 1));
    setShowRomaji(false);
    setShowHint(false);
    if (prevRowRef.current !== row) {
      resetStats();
      prevRowRef.current = row;
    }
    prevScriptRef.current = scriptType;
  }, [row, scriptType, resetStats]);
  useEffect(() => {
    if (prevScriptRef.current !== scriptType) {
      setRow("");
    }
    prevScriptRef.current = scriptType;
  }, [scriptType]);
  return {
    // Navigation state
    row,
    setRow,
    mod,
    setMod,
    scriptType,
    setScriptType,
    // Game state
    current,
    groupKana,
    showRomaji,
    setShowRomaji,
    showHint,
    correctCount,
    wrongCount,
    displayRate,
    rawRate,
    canEvaluate,
    match,
    // Actions
    handleOptionClick,
    shuffleIndex,
    resetStats
  };
}
function meta(_) {
  return [{
    title: "LazyKana"
  }, {
    name: "description",
    content: "Practice Hiragana & Katakana by Spamming."
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  const {
    // Navigation state
    row,
    setRow,
    mod,
    setMod,
    scriptType,
    setScriptType,
    // Game state
    current,
    groupKana,
    showRomaji,
    setShowRomaji,
    correctCount,
    wrongCount,
    displayRate,
    rawRate,
    canEvaluate,
    // Actions
    handleOptionClick,
    shuffleIndex,
    resetStats
  } = useKanaGame({
    initialRow: "A-row",
    initialMod: MOD[0],
    initialScriptType: TYPE[0]
  });
  return /* @__PURE__ */ jsxs("div", {
    className: "container m-auto max-md:h-screen w-screen max-w-md overflow-x-hidden overflow-y-auto flex flex-col gap-3 p-3",
    children: [/* @__PURE__ */ jsx(NavBar, {
      row,
      setRow,
      mod,
      setMod,
      scriptType,
      setScriptType
    }), /* @__PURE__ */ jsx(KanaDisplay, {
      current,
      showRomaji,
      setShowRomaji,
      correctCount,
      wrongCount,
      displayRate,
      rawRate,
      canEvaluate,
      onShuffle: shuffleIndex,
      onReset: resetStats,
      groupKana
    }), /* @__PURE__ */ jsx(OptionsGrid, {
      groupKana,
      current,
      onOptionClick: handleOptionClick
    }), /* @__PURE__ */ jsx(InfoSection, {})]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BwnEa42h.js", "imports": ["/assets/chunk-UIGDSWPH-BjI8LrHh.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-DH0AC8-V.js", "imports": ["/assets/chunk-UIGDSWPH-BjI8LrHh.js"], "css": ["/assets/root-Da_ATplB.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-eKm4Z6mp.js", "imports": ["/assets/chunk-UIGDSWPH-BjI8LrHh.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-03b38056.js", "version": "03b38056", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
