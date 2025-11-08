export default function Welcome(
    { onStart }: { onStart: (v: boolean) => void }
) {
    return <div className="flex flex-col gap-1">
        <h1>Spam Kana</h1>
        <p>Hover to reveal romanization. Type the romaji to check.</p>
        
    </div>
}