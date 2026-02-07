import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { useState, useEffect } from 'react'

export function PossessionOverlay() {
  const { isPossessed, message } = useStore()
  const [showImage, setShowImage] = useState(false)

  // Control timing: pitch black for 3 seconds, then show image
  useEffect(() => {
    if (isPossessed) {
      setShowImage(false)
      const timer = setTimeout(() => {
        setShowImage(true)
      }, 3000) // 3 seconds delay

      return () => clearTimeout(timer)
    } else {
      setShowImage(false)
    }
  }, [isPossessed])

  if (!isPossessed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black cursor-none"
      >

        {/* UPSIDE DOWN IMAGE - Appears after 3 seconds */}
        {/* Image located at: /public/images/upsidedown.jpg */}
        <AnimatePresence>
          {showImage && (
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
              style={{
                backgroundImage: "url('/images/upsidedown.jpg')",
                filter: 'grayscale(0.3) sepia(0.2) hue-rotate(270deg)'
              }}
            />
          )}
        </AnimatePresence>

        {/* Minimalistic Red Text */}
        <div className="font-press-start text-center space-y-8 relative z-10">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 0.1 }}
            className="text-[#ff0000] text-2xl md:text-4xl tracking-widest uppercase"
            style={{ textShadow: '0 0 10px #ff0000' }}
          >
            YOU HAVE BEEN<br />POSSESSED
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="text-[#cc0000] text-sm md:text-base font-vt323 tracking-wider"
          >
            <p className="mb-4">ESC = KONAMI CODE</p>
            <div className="text-xs opacity-50">↑ ↑ ↓ ↓ ← → ← → B A</div>
          </motion.div>
        </div>

        {/* Input Echo - show what user is typing blindly */}
        <div className="absolute bottom-20 text-red-900 font-vt323 text-xl opacity-30 z-10">
          {message}
        </div>

      </motion.div>
    </AnimatePresence>
  )
}
