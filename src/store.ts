import { create } from 'zustand'

export const MORSE_CODE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
  M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  ' ': ' ', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
}

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']

export interface AppState {
  // Intro
  introComplete: boolean
  setIntroComplete: (v: boolean) => void

  // Message
  message: string
  setMessage: (v: string) => void
  isEncoding: boolean
  setIsEncoding: (v: boolean) => void
  currentLetter: string | null
  setCurrentLetter: (v: string | null) => void

  // Sanity
  sanity: number
  setSanity: (v: number) => void
  lastRiftTime: number
  setLastRiftTime: (v: number) => void

  // Possession
  isPossessed: boolean
  possessionEndsAt: number | null
  startPossession: () => void
  endPossession: () => void

  // Recovery
  konamiProgress: number
  setKonamiProgress: (v: number) => void
  elevenTyped: string
  setElevenTyped: (v: string) => void
  logoClickCount: number
  lastLogoClick: number
  handleLogoClick: () => void
  justRecovered: boolean
  setJustRecovered: (v: boolean) => void

  // Actions
  drainSanity: (amount: number) => void
  sendMessage: () => void
  handleKeyDown: (key: string, code: string) => void
  handleKeyPress: (char: string) => void
}

export const useStore = create<AppState>((set, get) => ({
  introComplete: false,
  setIntroComplete: (v) => set({ introComplete: v }),

  message: '',
  setMessage: (v) => set({ message: v }),
  isEncoding: false,
  setIsEncoding: (v) => set({ isEncoding: v }),
  currentLetter: null,
  setCurrentLetter: (v) => set({ currentLetter: v }),

  sanity: 100,
  setSanity: (v) => set({ sanity: Math.max(0, Math.min(100, v)) }),
  lastRiftTime: 0,
  setLastRiftTime: (v) => set({ lastRiftTime: v }),

  isPossessed: false,
  possessionEndsAt: null,
  startPossession: () => set({
    isPossessed: true,
    possessionEndsAt: Date.now() + 30000,
  }),
  endPossession: () => set({
    isPossessed: false,
    possessionEndsAt: null,
    sanity: 100,
  }),

  konamiProgress: 0,
  setKonamiProgress: (v) => set({ konamiProgress: v }),
  justRecovered: false,
  setJustRecovered: (v) => set({ justRecovered: v }),
  elevenTyped: '',
  setElevenTyped: (v) => set({ elevenTyped: v }),
  logoClickCount: 0,
  lastLogoClick: 0,
  handleLogoClick: () => {
    const now = Date.now()
    const { logoClickCount, lastLogoClick, isPossessed, endPossession, setJustRecovered } = get()
    if (now - lastLogoClick < 500) {
      if (logoClickCount + 1 >= 3) {
        if (isPossessed) {
          endPossession()
          setJustRecovered(true)
          setTimeout(() => get().setJustRecovered(false), 4000)
        }
        set({ logoClickCount: 0 })
      } else {
        set({ logoClickCount: logoClickCount + 1, lastLogoClick: now })
      }
    } else {
      set({ logoClickCount: 1, lastLogoClick: now })
    }
  },

  drainSanity: (amount) => {
    const { sanity, isPossessed } = get()
    if (isPossessed) return
    const newSanity = Math.max(0, sanity - amount)
    set({ sanity: newSanity })
    if (newSanity <= 0) get().startPossession()
  },

  sendMessage: () => {
    const { message, isEncoding, drainSanity } = get()
    if (!message.trim() || isEncoding) return
    drainSanity(10)
  },

  handleKeyDown: (_key, code) => {
    const { konamiProgress, isPossessed, endPossession, setJustRecovered } = get()
    if (KONAMI_CODE[konamiProgress] === code) {
      const next = konamiProgress + 1
      set({ konamiProgress: next })
      if (next === 10) {
        if (isPossessed) {
          endPossession()
          setJustRecovered(true)
          setTimeout(() => set({ konamiProgress: 0, justRecovered: false }), 4000)
        } else {
          set({ konamiProgress: 0 })
        }
      }
    } else if (konamiProgress > 0) {
      set({ konamiProgress: 0 })
    }
  },

  handleKeyPress: (char) => {
    const ELEVEN = 'ELEVEN'
    const { elevenTyped, isPossessed, endPossession } = get()
    const upper = char.toUpperCase()
    const next = (elevenTyped + upper).slice(-ELEVEN.length)
    set({ elevenTyped: next })
    if (next === ELEVEN && isPossessed) {
      endPossession()
      get().setJustRecovered(true)
      setTimeout(() => get().setJustRecovered(false), 4000)
    }
  },
}))
