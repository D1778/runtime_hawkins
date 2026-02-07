import { useEffect } from 'react'
import { useStore } from '../store'

export function SanityMeter() {
  const { sanity, drainSanity, lastRiftTime, setLastRiftTime, isPossessed } = useStore()

  useEffect(() => {
    if (isPossessed) return
    const id = window.setInterval(() => drainSanity(1), 1000)
    return () => clearInterval(id)
  }, [isPossessed, drainSanity])

  useEffect(() => {
    if (isPossessed) return
    const checkRift = () => {
      const now = Date.now()
      if (now - lastRiftTime >= 20000) {
        drainSanity(5)
        setLastRiftTime(now)
      }
    }
    const id = window.setInterval(checkRift, 1000)
    return () => clearInterval(id)
  }, [isPossessed, lastRiftTime, setLastRiftTime, drainSanity])

  const getLabel = () => {
    if (sanity >= 70) return 'STABLE'
    if (sanity >= 40) return 'UNSTABLE'
    if (sanity >= 1) return 'CRITICAL - DEMOGORGON PROXIMITY'
    return 'POSSESSED'
  }

  const getColor = () => {
    if (sanity >= 70) return '#33ff33'
    if (sanity >= 40) return '#ffb000'
    if (sanity >= 1) return '#cc0000'
    return '#cc0000'
  }

  const showWarning = sanity > 0 && sanity < 30

  useEffect(() => {
    if (!showWarning || sanity <= 0) return
    const beep = () => {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 400
      osc.type = 'sine'
      gain.gain.value = 0.1
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.15)
    }
    beep()
    const interval = setInterval(beep, 1500)
    return () => clearInterval(interval)
  }, [showWarning, sanity])

  return (
    <div className="space-y-2">
      <div className="font-press-start text-xs text-phosphor tracking-wider flex justify-between">
        <span>[DIMENSIONAL STABILITY]</span>
        <span style={{ color: getColor() }}>{getLabel()}</span>
      </div>

      <div className="relative h-10 bg-black/90 border-2 border-phosphor/50 rounded overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 transition-all duration-300"
          style={{
            width: `${sanity}%`,
            backgroundColor: getColor(),
            boxShadow: `0 0 10px ${getColor()}, 0 0 20px ${getColor()}80`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-vt323 text-lg text-black font-bold drop-shadow-lg">
            {Math.round(sanity)}%
          </span>
        </div>
        {/* Needle/gauge lines */}
        <div className="absolute inset-0 flex justify-between px-2 pointer-events-none">
          {[0, 25, 50, 75, 100].map((p) => (
            <div
              key={p}
              className="w-px h-full bg-phosphor/30"
              style={{ left: `${p}%` }}
            />
          ))}
        </div>
      </div>

      {showWarning && !isPossessed && (
        <div className="flex items-center gap-2 text-critical font-vt323 text-sm animate-pulse">
          <span>⚠</span>
          <span>DIMENSIONAL RIFT DETECTED</span>
        </div>
      )}
    </div>
  )
}
