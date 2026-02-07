import { useCallback, useRef } from 'react'
import { useStore, MORSE_CODE } from '../store'
import { useMorseBeep } from './useMorseBeep'

const DOT_MS = 200
const DASH_MS = 600
const GAP_MS = 200

export function useMorseEncoder() {
  const { beep } = useMorseBeep()
  const abortRef = useRef(false)

  const encodeMessage = useCallback(async (text: string) => {
    const upper = text.toUpperCase()

    abortRef.current = false
    useStore.getState().setIsEncoding(true)
    useStore.getState().sendMessage()

    for (let i = 0; i < upper.length && !abortRef.current; i++) {
      const char = upper[i]
      const letter = char in MORSE_CODE ? char : (char === ' ' ? ' ' : '')
      if (letter === ' ') {
        useStore.getState().setCurrentLetter(null)
        await sleep(700)
        continue
      }
      if (!letter) continue

      useStore.getState().setCurrentLetter(letter)
      const morse = MORSE_CODE[letter]
      if (morse) {
        for (const sym of morse) {
          if (abortRef.current) break
          if (sym === '.') {
            beep(DOT_MS)
            await sleep(DOT_MS)
          } else if (sym === '-') {
            beep(DASH_MS)
            await sleep(DASH_MS)
          }
          await sleep(GAP_MS)
        }
      }
      await sleep(300)
    }

    useStore.getState().setCurrentLetter(null)
    useStore.getState().setIsEncoding(false)
  }, [beep])

  const stopEncoding = useCallback(() => {
    abortRef.current = true
  }, [])

  return { encodeMessage, stopEncoding }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
