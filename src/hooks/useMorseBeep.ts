import { useCallback, useRef } from 'react'

export function useMorseBeep() {
  const audioCtx = useRef<AudioContext | null>(null)

  const initAudio = useCallback(() => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return audioCtx.current
  }, [])

  const beep = useCallback((durationMs: number) => {
    const ctx = initAudio()
    if (ctx.state === 'suspended') ctx.resume()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 800
    osc.type = 'square'
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationMs / 1000)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + durationMs / 1000)
  }, [initAudio])

  return { beep }
}
