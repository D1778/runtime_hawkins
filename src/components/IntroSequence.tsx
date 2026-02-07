import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

const BOOT_LINES = [
  'HAWKINS NATIONAL LABORATORY',
  'TERMINAL v1.983',
  'INITIALIZING DIMENSIONAL STABILITY MONITOR...',
  'MORSE ENCODER ONLINE',
  'WARNING: DIMENSIONAL RIFTS DETECTED IN VICINITY',
  'PROCEED WITH CAUTION',
  '> _',
]

const TYPING_DELAY = 60
const LINE_DELAY = 800

export function IntroSequence() {
  const { introComplete, setIntroComplete } = useStore()
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (introComplete) return
    const line = BOOT_LINES[currentLine]
    if (!line) return

    if (line === '> _') {
      setDisplayedText('> ')
      const t = setTimeout(() => setIntroComplete(true), 500)
      return () => clearTimeout(t)
    }

    let i = 0
    setDisplayedText('')
    let nextLineId: ReturnType<typeof setTimeout> | null = null
    const interval = setInterval(() => {
      i++
      setDisplayedText(line.slice(0, i))
      if (i >= line.length) {
        clearInterval(interval)
        nextLineId = setTimeout(() => setCurrentLine((prev) => prev + 1), LINE_DELAY)
      }
    }, TYPING_DELAY)
    return () => {
      clearInterval(interval)
      if (nextLineId) clearTimeout(nextLineId)
    }
  }, [currentLine, introComplete, setIntroComplete])

  useEffect(() => {
    const blink = setInterval(() => setShowCursor((prev) => !prev), 530)
    return () => clearInterval(blink)
  }, [])

  if (introComplete) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-terminal"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-2xl mx-auto p-8 font-vt323 text-phosphor text-xl sm:text-2xl leading-relaxed" style={{ textShadow: '0 0 5px #33ff33, 0 0 10px #33ff33' }}>
          {BOOT_LINES.slice(0, currentLine).map((line, i) => (
            <div key={i} className="mb-1">
              {line === '> _' ? '> ' : line}
            </div>
          ))}
          {currentLine < BOOT_LINES.length && (
            <div className="inline">
              {displayedText}
              <span className={showCursor ? 'opacity-100' : 'opacity-0'}>▮</span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
