import { useStore } from '../store'

const KONAMI_LABELS = ['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A']

export function KonamiHint() {
  const { konamiProgress, isPossessed } = useStore()
  if (konamiProgress === 0 && !isPossessed) return null

  return (
    <div className="font-vt323 text-phosphor/80 text-sm" style={{ textShadow: '0 0 5px #33ff33' }}>
      {isPossessed ? (
        <span>GATE CLOSING: [{konamiProgress}/10]</span>
      ) : (
        <span>CODE: {KONAMI_LABELS.slice(0, konamiProgress).join(' ')}</span>
      )}
    </div>
  )
}
