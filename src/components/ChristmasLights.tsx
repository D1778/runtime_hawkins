import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { useMorseEncoder } from '../hooks/useMorseEncoder'

// Joyce's Wall Reference:
// Row 1: A B C D E F G H (8)
// Row 2: I J K L M N O P Q (9)
// Row 3: R S T U V W X Y Z (9) Total 26

const LETTER_ROWS = [
  { letters: 'ABCDEFGH'.split(''), startIndex: 0 },
  { letters: 'IJKLMNOPQ'.split(''), startIndex: 8 },
  { letters: 'RSTUVWXYZ'.split(''), startIndex: 17 }
]

const BULB_COLORS = [
  '#cc0000', // Red
  '#ff6600', // Orange
  '#ffcc00', // Yellow
  '#00aa00', // Green
  '#3366ff', // Blue
  '#ff0099', // Pink
]

// Assign specific colors to letters to match reference loosely or just distribute evenly
// A=Red, B=Blue, C=Yellow...
const getBulbColor = (index: number) => BULB_COLORS[index % BULB_COLORS.length]

// Helper: Calculate Y offset for a bulb hanging on the wire
// Wire path is: M 0 10 Q 50 80 100 10
// Quadratic bezier: y(t) = (1-t)²*y0 + 2(1-t)*t*y1 + t²*y2
const getWireSagOffset = (index: number, totalCount: number): number => {
  const t = index / (totalCount - 1) // Position along wire (0 to 1)
  const y0 = 65, y1 = 150, y2 = 65 // Control points from SVG path

  // Calculate Y in viewBox coordinates (0-100)
  const yViewBox = Math.pow(1 - t, 2) * y0 + 2 * (1 - t) * t * y1 + Math.pow(t, 2) * y2

  // Convert to pixel offset (SVG height is h-16 = 64px, viewBox is 100 units)
  // Subtract baseline of 10 to get offset from top
  const yPixels = ((yViewBox - 10) / 100) * 64

  return yPixels
}

export function ChristmasLights() {
  const { message, setMessage, currentLetter, isEncoding } = useStore()
  const { encodeMessage, stopEncoding } = useMorseEncoder()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!message.trim() || isEncoding) return
    encodeMessage(message)
  }

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [isEncoding])

  return (
    <div className="w-full h-full flex flex-col items-center justify-between py-4">

      {/* Input Display - Big & Retro */}
      <div className="w-full max-w-4xl text-center mb-6">
        <label className="block text-amber font-vt323 text-xl mb-1 opacity-70 tracking-widest">
          // SIGNAL TRANSMISSION //
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isEncoding}
            placeholder="TYPE MESSAGE..."
            className="w-full bg-black/40 border-b-2 border-dashed border-phosphor/50 text-center font-vt323 text-4xl md:text-5xl lg:text-6xl text-phosphor placeholder-phosphor/20 focus:outline-none focus:border-phosphor transition-all px-4 py-2 uppercase tracking-[0.2em]"
            style={{ textShadow: '0 0 10px rgba(51, 255, 51, 0.4)' }}
          />
          {/* Scanline overlay for input */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] opacity-30" />
        </div>
      </div>

      {/* THE WALL */}
      <div className="relative w-full max-w-[90vw] flex-1 flex flex-col justify-center gap-2 md:gap-6 perspective-1000 min-h-0">

        {/* Global Wires Removed - Using Per-Row Wires for alignment */}

        {LETTER_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-between items-start px-4 md:px-12 relative z-10">

            {/* Per-Row Sagging Wire */}
            <svg
              className="absolute top-4 left-0 w-full h-16 -z-10 pointer-events-none overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 10 Q 50 80 100 10"
                fill="none"
                stroke="#000000"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
                className="opacity-90 drop-shadow-sm"
              />
            </svg>

            {row.letters.map((letter, i) => {
              const globalIndex = row.startIndex + i
              const color = getBulbColor(globalIndex)
              const isActive = currentLetter === letter
              const rotation = (globalIndex * 1337) % 15 - 8.5

              // Calculate wire sag offset for this bulb's position
              const wireSagY = getWireSagOffset(i, row.letters.length)

              return (
                <div
                  key={letter}
                  className="relative group flex flex-col items-center"
                  style={{ transform: `rotate(${rotation}deg) translateY(${wireSagY}px)` }}
                >

                  {/* C9 Bulb */}
                  <div className="relative">
                    {/* Wire connector */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-black" />

                    {/* Socket Base */}
                    <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-3 h-2.5 bg-[#222] rounded-sm z-10 box-border border-b border-black/50" style={{ imageRendering: 'pixelated' }} />

                    {/* Glass Bulb Body - Compact Size with Pixelation */}
                    <div
                      className="relative w-5 h-8 md:w-7 md:h-10 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] z-20 overflow-hidden transition-all duration-200"
                      style={{
                        backgroundColor: isActive ? '#fff' : color,
                        boxShadow: isActive
                          ? `0 0 20px 5px ${color}, inset 0 0 10px #fff`
                          : `inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 3px rgba(255,255,255,0.3)`,
                        opacity: isActive ? 1 : 0.6,
                        filter: isActive ? 'brightness(1.5) saturate(1.2)' : 'brightness(0.8)',
                        imageRendering: 'pixelated'
                      }}
                    >
                      {/* Filament/Internal Reflection */}
                      <div className="absolute top-[15%] left-[25%] w-[15%] h-[20%] bg-white/70 rounded-full blur-[1px] rotate-[-20deg]" style={{ imageRendering: 'pixelated' }} />
                    </div>
                  </div>

                  {/* Hand-Painted Letter - Compact with Pixelation */}
                  <span
                    className="mt-1 font-press-start text-xl md:text-3xl text-black font-extrabold select-none opacity-90 uppercase"
                    style={{
                      textShadow: '2px 2px 0 rgba(0,0,0,0.5), -1px -1px 0 rgba(255,255,255,0.3)',
                      transform: `rotate(${rotation * -1.5}deg)`,
                      imageRendering: 'pixelated',
                      WebkitFontSmoothing: 'none',
                      MozOsxFontSmoothing: 'grayscale',
                      filter: 'contrast(1.2)',
                      fontStyle: 'normal',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {letter}
                  </span>

                </div>
              )
            })}
          </div>
        ))}

      </div>

      {/* Control Footer */}
      <div className="flex gap-6 mt-4 z-20">
        <button
          onClick={handleSend}
          disabled={isEncoding || !message.trim()}
          className="group px-8 py-2 bg-black/60 border-2 border-phosphor text-phosphor font-vt323 text-xl tracking-widest hover:bg-phosphor hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="group-hover:animate-pulse">{isEncoding ? 'SENDING...' : 'TRANSMIT'}</span>
        </button>

        {isEncoding && (
          <button
            onClick={stopEncoding}
            className="px-8 py-2 bg-critical/20 border-2 border-critical text-critical font-vt323 text-xl tracking-widest hover:bg-critical hover:text-black transition-all"
          >
            ABORT
          </button>
        )}
      </div>

    </div>
  )
}
