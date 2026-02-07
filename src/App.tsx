import { useEffect, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useStore } from './store'
import { IntroSequence } from './components/IntroSequence'
// CRTMonitor removed
// Actually, just removing the unused import line.
import { ChristmasLights } from './components/ChristmasLights'
import { SanityMeter } from './components/SanityMeter'
import { PossessionOverlay } from './components/PossessionOverlay'
import { RecoveryFlash } from './components/RecoveryFlash'
import { KonamiHint } from './components/KonamiHint'

import { HawkinsHeader } from './components/HawkinsHeader'

function App() {
  const {
    isPossessed,
    handleKeyDown,
    handleKeyPress,
    handleLogoClick,
    possessionEndsAt,
  } = useStore()

  // Audio refs
  const kateRushAudioRef = useRef<HTMLAudioElement | null>(null)
  const demogorgonAudioRef = useRef<HTMLAudioElement | null>(null)

  // Audio initialization
  useEffect(() => {
    // ⚠️ REPLACE WITH ACTUAL FILE PATHS
    kateRushAudioRef.current = new Audio('/audio/running-up-that-hill.mp3')
    kateRushAudioRef.current.loop = true
    kateRushAudioRef.current.volume = 0.4

    demogorgonAudioRef.current = new Audio('/audio/demogorgon-ambience.mp3') // or demogorgon-roar.mp3
    demogorgonAudioRef.current.loop = true
    demogorgonAudioRef.current.volume = 0

    // Cleanup
    return () => {
      kateRushAudioRef.current?.pause()
      demogorgonAudioRef.current?.pause()
    }
  }, [])

  // Audio crossfade logic based on sanity
  useEffect(() => {
    const kate = kateRushAudioRef.current
    const demo = demogorgonAudioRef.current
    if (!kate || !demo) return

    // Get sanity from store
    const sanity = useStore.getState().sanity

    if (isPossessed) {
      kate.pause()
      if (demo.paused) demo.play().catch(() => { console.log('Interact to play audio') })
      demo.volume = 0.8
    } else if (sanity <= 30) {
      // Low sanity: Crossfade
      if (kate.paused) kate.play().catch(() => { })
      if (demo.paused) demo.play().catch(() => { })

      const fadeRatio = (30 - sanity) / 30
      kate.volume = Math.max(0, 0.4 * (1 - fadeRatio))
      demo.volume = Math.min(1, 0.6 * fadeRatio)
    } else {
      // Normal state
      demo.pause()
      demo.currentTime = 0
      kate.volume = 0.4
      // Only play Kate if user has interacted (handled in onKeyDown)
    }
  }, [isPossessed, useStore.getState().sanity])

  useEffect(() => {
    if (!isPossessed || !possessionEndsAt) return
    const timer = setInterval(() => {
      if (Date.now() >= possessionEndsAt) {
        useStore.getState().endPossession()
      }
    }, 100)
    return () => clearInterval(timer)
  }, [isPossessed, possessionEndsAt])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    // Start music on first interaction if not playing
    if (kateRushAudioRef.current?.paused && !isPossessed) {
      kateRushAudioRef.current.play().catch(() => { })
    }
    handleKeyDown(e.key, e.code)
  }, [handleKeyDown, isPossessed])

  const onKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key.length === 1) handleKeyPress(e.key)
  }, [handleKeyPress])

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keypress', onKeyPress)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keypress', onKeyPress)
    }
  }, [onKeyDown, onKeyPress])

  // ... existing hooks ...
  const sanity = useStore(state => state.sanity) // Select specific selector for renders

  return (
    // Application Container - Full Screen, No Nested Monitor
    <div className={`font-vt323 fixed inset-0 w-full h-full overflow-hidden flex flex-col ${isPossessed ? 'possessed' : ''}`}>

      {/* Hawkins Lab Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundImage: "url('/images/hawkins.webp')" }}
      />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Creepster&family=Permanent+Marker&display=swap"
        rel="stylesheet"
      />

      <IntroSequence />

      {/* BLOOD OVERLAY - Triggers at <= 15% Sanity AND NOT POSSESSED */}
      {!isPossessed && sanity <= 15 && (
        <>
          <div className="blood-overlay"></div>
          <div className="blood-drops">
            {/* Random drops */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="blood-drop" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}></div>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {/* Main Content Layer - Hidden when Possessed */}
        {!isPossessed && (
          <div className="relative z-10 w-full h-full flex flex-col p-4 md:p-8 normal-ui">

            <HawkinsHeader />

            <div className="flex-1 flex flex-col justify-center items-center w-full max-w-[1400px] mx-auto min-h-0">
              <ChristmasLights />

              <div className="mt-4 w-full max-w-2xl bg-black/60 p-4 border-2 border-phosphor/30 rounded backdrop-blur-sm scale-90 origin-top">
                <SanityMeter />
                <KonamiHint />
              </div>
            </div>

            {/* Hidden logo for 3x click recovery */}
            <button
              onClick={handleLogoClick}
              className="absolute top-4 left-4 w-12 h-12 opacity-0 hover:opacity-10 z-50"
              aria-label="Hawkins Lab logo recovery"
            >
              HL
            </button>
          </div>
        )}
      </AnimatePresence>

      <PossessionOverlay />
      <RecoveryFlash />
    </div>
  )
}

export default App
