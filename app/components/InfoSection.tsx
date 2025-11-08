export function InfoSection() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-zinc-300/45 my-18">
      <h4 className="text-base font-semibold">How it works</h4>

      <p>
        Master one row at a time. When you can answer without mistakes, move to the
        next row. Use <strong>Play Sound</strong> to check pronunciation, and
        <strong> Stroke Order</strong> if you're practicing handwriting.
      </p>

      <p>
        <strong>Dakuten ( ゛ )</strong> adds "voicing" to consonants:
      </p>

      <ul className="ml-5 list-disc space-y-1">
        <li>か → が (k → g)</li>
        <li>た → だ (t → d)</li>
        <li>さ → ざ (s / ts → z)</li>
        <li>は → ば (h / f → b)</li>
        <li>し / ち → じ (sh / ch → j)</li>
      </ul>

      <p>
        <strong>Handakuten ( ゜ )</strong> turns <code>h / f</code> into <code>p</code>:
        ほ → ぽ (ho → po)
      </p>

      <p>
        Small kana combine sounds:
      </p>

      <ul className="ml-5 list-disc space-y-1">
        <li>ぎ + ゃ → ぎゃ (gya)</li>
        <li>ゅ / ょ / ゃ modify the consonant before them</li>
      </ul>

      <p>
        The small っ is a pause — it doubles the next consonant:
        にっぽん (nippon) vs がこう (gakou)
      </p>
    </div>
  );
}