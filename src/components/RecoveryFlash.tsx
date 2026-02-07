import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

export function RecoveryFlash() {
  const { justRecovered } = useStore()
  const [showFlash, setShowFlash] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    if (justRecovered) {
      setShowFlash(true)
      const t1 = setTimeout(() => setShowFlash(false), 500)
      const t2 = setTimeout(() => setShowMessage(true), 600)
      const t3 = setTimeout(() => setShowMessage(false), 4000)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    }
  }, [justRecovered])

  // Triumphant chord on recovery
  useEffect(() => {
    if (justRecovered) {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const notes = [523.25, 659.25, 783.99]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5)
        osc.start(ctx.currentTime + i * 0.05)
        osc.stop(ctx.currentTime + 1.5)
      })
    }
  }, [justRecovered])

  return (
    <AnimatePresence>
      {showFlash && (
        <motion.div
          className="fixed inset-0 bg-white z-[60] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
      {showMessage && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[61] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="font-press-start text-phosphor text-center text-sm sm:text-base p-4" style={{ textShadow: '0 0 10px #33ff33, 0 0 20px #33ff33' }}>
            GATE CLOSED. HAWKINS IS SAFE.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
