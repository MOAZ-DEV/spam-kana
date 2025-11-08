export type Script = 'hiragana' | 'katakana';

export type KanaType = 'basic' | 'dakuten' | 'handakuten' | 'combo' | 'small' | 'misc';

export type KanaEntry = {
  char: string;
  romaji: string;
  script: Script;
  group?: string; // e.g., "A-row", "K-row", "G-dakuten", "Combo-K"
  combo?: boolean;
  dakuten?: boolean;
  handakuten?: boolean;
  type?: KanaType; // derived convenience field
  note?: string;
};

const normalizeRomaji = (r: string) => r.trim().toLowerCase();

const deriveType = (opts: Partial<KanaEntry> = {}, char?: string): KanaType => {
  if (opts.combo) return 'combo';
  if (opts.dakuten) return 'dakuten';
  if (opts.handakuten) return 'handakuten';
  if (char === 'っ' || char === 'ッ' || char === 'ぃ' || char === 'ゃ' || char === 'ゅ' || char === 'ょ') return 'small';
  return 'basic';
};

const make = (
  char: string,
  romaji: string,
  script: Script,
  opts: Partial<KanaEntry> = {}
): KanaEntry => {
  const normalizedRomaji = normalizeRomaji(romaji);
  const group = opts.group ?? (opts.combo ? `Combo` : opts.dakuten ? `Dakuten` : opts.handakuten ? `Handakuten` : 'misc');
  const entry: KanaEntry = {
    char,
    romaji: normalizedRomaji,
    script,
    group,
    combo: !!opts.combo,
    dakuten: !!opts.dakuten,
    handakuten: !!opts.handakuten,
    note: opts.note,
    type: deriveType(opts, char),
  };
  return entry;
};

/* ---------------------------
   HIRAGANA - basic rows
   --------------------------- */
export const hiragana: KanaEntry[] = [
  make('あ', 'a', 'hiragana', { group: 'A-row' }),
  make('い', 'i', 'hiragana', { group: 'A-row' }),
  make('う', 'u', 'hiragana', { group: 'A-row' }),
  make('え', 'e', 'hiragana', { group: 'A-row' }),
  make('お', 'o', 'hiragana', { group: 'A-row' }),

  make('か', 'ka', 'hiragana', { group: 'K-row' }),
  make('き', 'ki', 'hiragana', { group: 'K-row' }),
  make('く', 'ku', 'hiragana', { group: 'K-row' }),
  make('け', 'ke', 'hiragana', { group: 'K-row' }),
  make('こ', 'ko', 'hiragana', { group: 'K-row' }),

  make('さ', 'sa', 'hiragana', { group: 'S-row' }),
  make('し', 'shi', 'hiragana', { group: 'S-row' }),
  make('す', 'su', 'hiragana', { group: 'S-row' }),
  make('せ', 'se', 'hiragana', { group: 'S-row' }),
  make('そ', 'so', 'hiragana', { group: 'S-row' }),

  make('た', 'ta', 'hiragana', { group: 'T-row' }),
  make('ち', 'chi', 'hiragana', { group: 'T-row' }),
  make('つ', 'tsu', 'hiragana', { group: 'T-row' }),
  make('て', 'te', 'hiragana', { group: 'T-row' }),
  make('と', 'to', 'hiragana', { group: 'T-row' }),

  make('な', 'na', 'hiragana', { group: 'N-row' }),
  make('に', 'ni', 'hiragana', { group: 'N-row' }),
  make('ぬ', 'nu', 'hiragana', { group: 'N-row' }),
  make('ね', 'ne', 'hiragana', { group: 'N-row' }),
  make('の', 'no', 'hiragana', { group: 'N-row' }),

  make('は', 'ha', 'hiragana', { group: 'H-row' }),
  make('ひ', 'hi', 'hiragana', { group: 'H-row' }),
  make('ふ', 'fu', 'hiragana', { group: 'H-row' }),
  make('へ', 'he', 'hiragana', { group: 'H-row' }),
  make('ほ', 'ho', 'hiragana', { group: 'H-row' }),

  make('ま', 'ma', 'hiragana', { group: 'M-row' }),
  make('み', 'mi', 'hiragana', { group: 'M-row' }),
  make('む', 'mu', 'hiragana', { group: 'M-row' }),
  make('め', 'me', 'hiragana', { group: 'M-row' }),
  make('も', 'mo', 'hiragana', { group: 'M-row' }),

  make('や', 'ya', 'hiragana', { group: 'Y-row' }),
  make('ゆ', 'yu', 'hiragana', { group: 'Y-row' }),
  make('よ', 'yo', 'hiragana', { group: 'Y-row' }),

  make('ら', 'ra', 'hiragana', { group: 'R-row' }),
  make('り', 'ri', 'hiragana', { group: 'R-row' }),
  make('る', 'ru', 'hiragana', { group: 'R-row' }),
  make('れ', 're', 'hiragana', { group: 'R-row' }),
  make('ろ', 'ro', 'hiragana', { group: 'R-row' }),

  make('わ', 'wa', 'hiragana', { group: 'W-row' }),
  make('を', 'o', 'hiragana', { group: 'W-row', note: 'object particle often pronounced "o"' }),
  make('ん', 'n', 'hiragana', { group: 'misc' }),

  // small tsu (sokuon)
  make('っ', '(sokuon)', 'hiragana', { group: 'misc', note: 'not pronounced alone; doubles following consonant' }),
];

/* ---------------------------
   HIRAGANA - dakuten & handakuten
   --------------------------- */
export const hiraganaDakuten: KanaEntry[] = [
  make('が', 'ga', 'hiragana', { group: 'G-dakuten', dakuten: true }),
  make('ぎ', 'gi', 'hiragana', { group: 'G-dakuten', dakuten: true }),
  make('ぐ', 'gu', 'hiragana', { group: 'G-dakuten', dakuten: true }),
  make('げ', 'ge', 'hiragana', { group: 'G-dakuten', dakuten: true }),
  make('ご', 'go', 'hiragana', { group: 'G-dakuten', dakuten: true }),

  make('ざ', 'za', 'hiragana', { group: 'Z-dakuten', dakuten: true }),
  make('じ', 'ji', 'hiragana', { group: 'Z-dakuten', dakuten: true }),
  make('ず', 'zu', 'hiragana', { group: 'Z-dakuten', dakuten: true }),
  make('ぜ', 'ze', 'hiragana', { group: 'Z-dakuten', dakuten: true }),
  make('ぞ', 'zo', 'hiragana', { group: 'Z-dakuten', dakuten: true }),

  make('だ', 'da', 'hiragana', { group: 'D-dakuten', dakuten: true }),
  make('ぢ', 'ji', 'hiragana', { group: 'D-dakuten', dakuten: true, note: 'rare, maps to "ji"' }),
  make('づ', 'zu', 'hiragana', { group: 'D-dakuten', dakuten: true, note: 'rare, maps to "zu"' }),
  make('で', 'de', 'hiragana', { group: 'D-dakuten', dakuten: true }),
  make('ど', 'do', 'hiragana', { group: 'D-dakuten', dakuten: true }),

  make('ば', 'ba', 'hiragana', { group: 'B-dakuten', dakuten: true }),
  make('び', 'bi', 'hiragana', { group: 'B-dakuten', dakuten: true }),
  make('ぶ', 'bu', 'hiragana', { group: 'B-dakuten', dakuten: true }),
  make('べ', 'be', 'hiragana', { group: 'B-dakuten', dakuten: true }),
  make('ぼ', 'bo', 'hiragana', { group: 'B-dakuten', dakuten: true }),

  make('ぱ', 'pa', 'hiragana', { group: 'P-handakuten', handakuten: true }),
  make('ぴ', 'pi', 'hiragana', { group: 'P-handakuten', handakuten: true }),
  make('ぷ', 'pu', 'hiragana', { group: 'P-handakuten', handakuten: true }),
  make('ぺ', 'pe', 'hiragana', { group: 'P-handakuten', handakuten: true }),
  make('ぽ', 'po', 'hiragana', { group: 'P-handakuten', handakuten: true }),
];

/* ---------------------------
   HIRAGANA - combinations (y-row + others)
   --------------------------- */
export const hiraganaCombos: KanaEntry[] = [
  // K
  make('きゃ', 'kya', 'hiragana', { combo: true, group: 'Combo-K' }),
  make('きゅ', 'kyu', 'hiragana', { combo: true, group: 'Combo-K' }),
  make('きょ', 'kyo', 'hiragana', { combo: true, group: 'Combo-K' }),

  // S
  make('しゃ', 'sha', 'hiragana', { combo: true, group: 'Combo-S' }),
  make('しゅ', 'shu', 'hiragana', { combo: true, group: 'Combo-S' }),
  make('しょ', 'sho', 'hiragana', { combo: true, group: 'Combo-S' }),

  // T
  make('ちゃ', 'cha', 'hiragana', { combo: true, group: 'Combo-T' }),
  make('ちゅ', 'chu', 'hiragana', { combo: true, group: 'Combo-T' }),
  make('ちょ', 'cho', 'hiragana', { combo: true, group: 'Combo-T' }),

  // N
  make('にゃ', 'nya', 'hiragana', { combo: true, group: 'Combo-N' }),
  make('にゅ', 'nyu', 'hiragana', { combo: true, group: 'Combo-N' }),
  make('にょ', 'nyo', 'hiragana', { combo: true, group: 'Combo-N' }),

  // H
  make('ひゃ', 'hya', 'hiragana', { combo: true, group: 'Combo-H' }),
  make('ひゅ', 'hyu', 'hiragana', { combo: true, group: 'Combo-H' }),
  make('ひょ', 'hyo', 'hiragana', { combo: true, group: 'Combo-H' }),

  // M
  make('みゃ', 'mya', 'hiragana', { combo: true, group: 'Combo-M' }),
  make('みゅ', 'myu', 'hiragana', { combo: true, group: 'Combo-M' }),
  make('みょ', 'myo', 'hiragana', { combo: true, group: 'Combo-M' }),

  // R
  make('りゃ', 'rya', 'hiragana', { combo: true, group: 'Combo-R' }),
  make('りゅ', 'ryu', 'hiragana', { combo: true, group: 'Combo-R' }),
  make('りょ', 'ryo', 'hiragana', { combo: true, group: 'Combo-R' }),

  // G (dakuten combos)
  make('ぎゃ', 'gya', 'hiragana', { combo: true, dakuten: true, group: 'Combo-G' }),
  make('ぎゅ', 'gyu', 'hiragana', { combo: true, dakuten: true, group: 'Combo-G' }),
  make('ぎょ', 'gyo', 'hiragana', { combo: true, dakuten: true, group: 'Combo-G' }),

  // J (from じ / ぢ)
  make('じゃ', 'ja', 'hiragana', { combo: true, dakuten: true, group: 'Combo-J' }),
  make('じゅ', 'ju', 'hiragana', { combo: true, dakuten: true, group: 'Combo-J' }),
  make('じょ', 'jo', 'hiragana', { combo: true, dakuten: true, group: 'Combo-J' }),

  // Rare: ぢゃ/ぢゅ/ぢょ (maps to same romanization)
  make('ぢゃ', 'ja', 'hiragana', { combo: true, dakuten: true, group: 'Combo-J-rare', note: 'rare form' }),
  make('ぢゅ', 'ju', 'hiragana', { combo: true, dakuten: true, group: 'Combo-J-rare', note: 'rare form' }),
  make('ぢょ', 'jo', 'hiragana', { combo: true, dakuten: true, group: 'Combo-J-rare', note: 'rare form' }),

  // B / P
  make('びゃ', 'bya', 'hiragana', { combo: true, dakuten: true, group: 'Combo-B' }),
  make('びゅ', 'byu', 'hiragana', { combo: true, dakuten: true, group: 'Combo-B' }),
  make('びょ', 'byo', 'hiragana', { combo: true, dakuten: true, group: 'Combo-B' }),

  make('ぴゃ', 'pya', 'hiragana', { combo: true, handakuten: true, group: 'Combo-P' }),
  make('ぴゅ', 'pyu', 'hiragana', { combo: true, handakuten: true, group: 'Combo-P' }),
  make('ぴょ', 'pyo', 'hiragana', { combo: true, handakuten: true, group: 'Combo-P' }),
];

/* ---------------------------
   KATAKANA - basic rows
   --------------------------- */
export const katakana: KanaEntry[] = [
  make('ア', 'a', 'katakana', { group: 'A-row' }),
  make('イ', 'i', 'katakana', { group: 'A-row' }),
  make('ウ', 'u', 'katakana', { group: 'A-row' }),
  make('エ', 'e', 'katakana', { group: 'A-row' }),
  make('オ', 'o', 'katakana', { group: 'A-row' }),

  make('カ', 'ka', 'katakana', { group: 'K-row' }),
  make('キ', 'ki', 'katakana', { group: 'K-row' }),
  make('ク', 'ku', 'katakana', { group: 'K-row' }),
  make('ケ', 'ke', 'katakana', { group: 'K-row' }),
  make('コ', 'ko', 'katakana', { group: 'K-row' }),

  make('サ', 'sa', 'katakana', { group: 'S-row' }),
  make('シ', 'shi', 'katakana', { group: 'S-row' }),
  make('ス', 'su', 'katakana', { group: 'S-row' }),
  make('セ', 'se', 'katakana', { group: 'S-row' }),
  make('ソ', 'so', 'katakana', { group: 'S-row' }),

  make('タ', 'ta', 'katakana', { group: 'T-row' }),
  make('チ', 'chi', 'katakana', { group: 'T-row' }),
  make('ツ', 'tsu', 'katakana', { group: 'T-row' }),
  make('テ', 'te', 'katakana', { group: 'T-row' }),
  make('ト', 'to', 'katakana', { group: 'T-row' }),

  make('ナ', 'na', 'katakana', { group: 'N-row' }),
  make('ニ', 'ni', 'katakana', { group: 'N-row' }),
  make('ヌ', 'nu', 'katakana', { group: 'N-row' }),
  make('ネ', 'ne', 'katakana', { group: 'N-row' }),
  make('ノ', 'no', 'katakana', { group: 'N-row' }),

  make('ハ', 'ha', 'katakana', { group: 'H-row' }),
  make('ヒ', 'hi', 'katakana', { group: 'H-row' }),
  make('フ', 'fu', 'katakana', { group: 'H-row' }),
  make('ヘ', 'he', 'katakana', { group: 'H-row' }),
  make('ホ', 'ho', 'katakana', { group: 'H-row' }),

  make('マ', 'ma', 'katakana', { group: 'M-row' }),
  make('ミ', 'mi', 'katakana', { group: 'M-row' }),
  make('ム', 'mu', 'katakana', { group: 'M-row' }),
  make('メ', 'me', 'katakana', { group: 'M-row' }),
  make('モ', 'mo', 'katakana', { group: 'M-row' }),

  make('ヤ', 'ya', 'katakana', { group: 'Y-row' }),
  make('ユ', 'yu', 'katakana', { group: 'Y-row' }),
  make('ヨ', 'yo', 'katakana', { group: 'Y-row' }),

  make('ラ', 'ra', 'katakana', { group: 'R-row' }),
  make('リ', 'ri', 'katakana', { group: 'R-row' }),
  make('ル', 'ru', 'katakana', { group: 'R-row' }),
  make('レ', 're', 'katakana', { group: 'R-row' }),
  make('ロ', 'ro', 'katakana', { group: 'R-row' }),

  make('ワ', 'wa', 'katakana', { group: 'W-row' }),
  make('ヲ', 'o', 'katakana', { group: 'W-row', note: 'often pronounced "o" (particle)' }),
  make('ン', 'n', 'katakana', { group: 'misc' }),

  // small tsu
  make('ッ', '(sokuon)', 'katakana', { group: 'misc', note: 'not pronounced alone; doubles following consonant' }),
];

/* ---------------------------
   KATAKANA - dakuten / handakuten
   --------------------------- */
export const katakanaDakuten: KanaEntry[] = [
  make('ガ', 'ga', 'katakana', { group: 'G-dakuten', dakuten: true }),
  make('ギ', 'gi', 'katakana', { group: 'G-dakuten', dakuten: true }),
  make('グ', 'gu', 'katakana', { group: 'G-dakuten', dakuten: true }),
  make('ゲ', 'ge', 'katakana', { group: 'G-dakuten', dakuten: true }),
  make('ゴ', 'go', 'katakana', { group: 'G-dakuten', dakuten: true }),

  make('ザ', 'za', 'katakana', { group: 'Z-dakuten', dakuten: true }),
  make('ジ', 'ji', 'katakana', { group: 'Z-dakuten', dakuten: true }),
  make('ズ', 'zu', 'katakana', { group: 'Z-dakuten', dakuten: true }),
  make('ゼ', 'ze', 'katakana', { group: 'Z-dakuten', dakuten: true }),
  make('ゾ', 'zo', 'katakana', { group: 'Z-dakuten', dakuten: true }),

  make('ダ', 'da', 'katakana', { group: 'D-dakuten', dakuten: true }),
  make('ヂ', 'ji', 'katakana', { group: 'D-dakuten', dakuten: true }),
  make('ヅ', 'zu', 'katakana', { group: 'D-dakuten', dakuten: true }),
  make('デ', 'de', 'katakana', { group: 'D-dakuten', dakuten: true }),
  make('ド', 'do', 'katakana', { group: 'D-dakuten', dakuten: true }),

  make('バ', 'ba', 'katakana', { group: 'B-dakuten', dakuten: true }),
  make('ビ', 'bi', 'katakana', { group: 'B-dakuten', dakuten: true }),
  make('ブ', 'bu', 'katakana', { group: 'B-dakuten', dakuten: true }),
  make('ベ', 'be', 'katakana', { group: 'B-dakuten', dakuten: true }),
  make('ボ', 'bo', 'katakana', { group: 'B-dakuten', dakuten: true }),

  make('パ', 'pa', 'katakana', { group: 'P-handakuten', handakuten: true }),
  make('ピ', 'pi', 'katakana', { group: 'P-handakuten', handakuten: true }),
  make('プ', 'pu', 'katakana', { group: 'P-handakuten', handakuten: true }),
  make('ペ', 'pe', 'katakana', { group: 'P-handakuten', handakuten: true }),
  make('ポ', 'po', 'katakana', { group: 'P-handakuten', handakuten: true }),
];

/* ---------------------------
   KATAKANA - combos
   --------------------------- */
export const katakanaCombos: KanaEntry[] = [
  make('キャ', 'kya', 'katakana', { combo: true, group: 'Combo-K' }),
  make('キュ', 'kyu', 'katakana', { combo: true, group: 'Combo-K' }),
  make('キョ', 'kyo', 'katakana', { combo: true, group: 'Combo-K' }),

  make('シャ', 'sha', 'katakana', { combo: true, group: 'Combo-S' }),
  make('シュ', 'shu', 'katakana', { combo: true, group: 'Combo-S' }),
  make('ショ', 'sho', 'katakana', { combo: true, group: 'Combo-S' }),

  make('チャ', 'cha', 'katakana', { combo: true, group: 'Combo-T' }),
  make('チュ', 'chu', 'katakana', { combo: true, group: 'Combo-T' }),
  make('チョ', 'cho', 'katakana', { combo: true, group: 'Combo-T' }),

  make('ニャ', 'nya', 'katakana', { combo: true, group: 'Combo-N' }),
  make('ニュ', 'nyu', 'katakana', { combo: true, group: 'Combo-N' }),
  make('ニョ', 'nyo', 'katakana', { combo: true, group: 'Combo-N' }),

  make('ヒャ', 'hya', 'katakana', { combo: true, group: 'Combo-H' }),
  make('ヒュ', 'hyu', 'katakana', { combo: true, group: 'Combo-H' }),
  make('ヒョ', 'hyo', 'katakana', { combo: true, group: 'Combo-H' }),

  make('ミャ', 'mya', 'katakana', { combo: true, group: 'Combo-M' }),
  make('ミュ', 'myu', 'katakana', { combo: true, group: 'Combo-M' }),
  make('ミョ', 'myo', 'katakana', { combo: true, group: 'Combo-M' }),

  make('リャ', 'rya', 'katakana', { combo: true, group: 'Combo-R' }),
  make('リュ', 'ryu', 'katakana', { combo: true, group: 'Combo-R' }),
  make('リョ', 'ryo', 'katakana', { combo: true, group: 'Combo-R' }),

  make('ギャ', 'gya', 'katakana', { combo: true, dakuten: true, group: 'Combo-G' }),
  make('ギュ', 'gyu', 'katakana', { combo: true, dakuten: true, group: 'Combo-G' }),
  make('ギョ', 'gyo', 'katakana', { combo: true, dakuten: true, group: 'Combo-G' }),

  make('ジャ', 'ja', 'katakana', { combo: true, dakuten: true, group: 'Combo-J' }),
  make('ジュ', 'ju', 'katakana', { combo: true, dakuten: true, group: 'Combo-J' }),
  make('ジョ', 'jo', 'katakana', { combo: true, dakuten: true, group: 'Combo-J' }),

  make('ビャ', 'bya', 'katakana', { combo: true, dakuten: true, group: 'Combo-B' }),
  make('ビュ', 'byu', 'katakana', { combo: true, dakuten: true, group: 'Combo-B' }),
  make('ビョ', 'byo', 'katakana', { combo: true, dakuten: true, group: 'Combo-B' }),

  make('ピャ', 'pya', 'katakana', { combo: true, handakuten: true, group: 'Combo-P' }),
  make('ピュ', 'pyu', 'katakana', { combo: true, handakuten: true, group: 'Combo-P' }),
  make('ピョ', 'pyo', 'katakana', { combo: true, handakuten: true, group: 'Combo-P' }),

  // Rare: ヂャ/ヂュ/ヂョ
  make('ヂャ', 'ja', 'katakana', { combo: true, dakuten: true, group: 'Combo-J-rare', note: 'rare' }),
  make('ヂュ', 'ju', 'katakana', { combo: true, dakuten: true, group: 'Combo-J-rare', note: 'rare' }),
  make('ヂョ', 'jo', 'katakana', { combo: true, dakuten: true, group: 'Combo-J-rare', note: 'rare' }),
];

/* ---------------------------
   Combined exports & helpers
   --------------------------- */
export const allKana = [
  ...hiragana,
  ...hiraganaDakuten,
  ...hiraganaCombos,
  ...katakana,
  ...katakanaDakuten,
  ...katakanaCombos,
];

export const byChar = new Map<string, KanaEntry>(allKana.map(k => [k.char, k]));

export const byRomaji = new Map<string, KanaEntry[]>();
allKana.forEach(k => {
  const key = normalizeRomaji(k.romaji);
  const list = byRomaji.get(key) ?? [];
  list.push(k);
  byRomaji.set(key, list);
});

/** Find by exact character (returns undefined if not found) */
export function findByChar(char: string): KanaEntry | undefined {
  return byChar.get(char);
}

/** Find all kana in a group */
export function findByGroup(group: string): KanaEntry[] {
  // group matching is normalized for safety
  return allKana.filter(k => (k.group ?? 'misc') === group);
}

/** Find all kana matching a romaji (returns array, possibly empty) */
export function findByRomaji(romaji: string): KanaEntry[] {
  return byRomaji.get(normalizeRomaji(romaji)) ?? [];
}

/** Get all kana for a script */
export function getByScript(script: Script): KanaEntry[] {
  return allKana.filter(k => k.script === script);
}

/** Simple quiz source: return n random kana (optionally filter script/combo) */
export function sample(n = 10, opts?: { script?: Script; combo?: boolean }): KanaEntry[] {
  let pool = allKana;
  if (opts?.script) pool = pool.filter(p => p.script === opts.script);
  if (typeof opts?.combo === 'boolean') pool = pool.filter(p => !!p.combo === opts.combo);
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.max(0, Math.min(n, shuffled.length)));
}

export type KanaGroup = {
  script: Script;
  group: string;
  items: { char: string; romaji: string }[];
  count: number;
};

export function getKanaGroups(): KanaGroup[] {
  const all = allKana;
  const map = new Map<Script, Map<string, KanaEntry[]>>();

  for (const k of all) {
    if (!map.has(k.script)) map.set(k.script, new Map());
    const scriptMap = map.get(k.script)!;

    const group = k.group ?? 'misc';
    if (!scriptMap.has(group)) scriptMap.set(group, []);
    scriptMap.get(group)!.push(k);
  }

  const out: KanaGroup[] = [];

  for (const [script, groups] of map) {
    for (const [group, items] of groups) {
      out.push({
        script,
        group,
        items: items.map(i => ({ char: i.char, romaji: i.romaji })),
        count: items.length,
      });
    }
  }

  return out;
}

// Simple validation to catch duplicates/missing romaji at runtime (only in dev)
if (process.env.NODE_ENV !== 'production') {
  const seen = new Set<string>();
  for (const k of allKana) {
    if (!k.romaji) console.warn('missing romaji for', k.char);
    if (seen.has(k.char)) console.warn('duplicate char', k.char);
    seen.add(k.char);
  }
}

export default {
  hiragana,
  hiraganaDakuten,
  hiraganaCombos,
  katakana,
  katakanaDakuten,
  katakanaCombos,
  allKana,
  byChar,
  byRomaji,
  findByChar,
  findByGroup,
  findByRomaji,
  getByScript,
  sample,
  getKanaGroups,
};
