import type { ReactNode } from 'react'
import { useStore } from '../store'

interface CRTMonitorProps {
  children: ReactNode
}

export function CRTMonitor({ children }: CRTMonitorProps) {
  const { isPossessed, introComplete } = useStore()

  return (
    <div
      className="arcade-cabinet w-full h-full flex items-center justify-center bg-black transition-colors duration-1000"
      style={{
        background: isPossessed
          ? 'radial-gradient(ellipse at center, #2a0a0f 0%, #0a0208 70%)'
          : 'radial-gradient(ellipse at center, #1a1a1a 0%, #000 70%)'
      }}
    >
      <div
        className={`relative transition-all duration-500 rounded-[20px_20px_30px_30px] overflow-hidden ${isPossessed ? 'animate-shake' : ''
          }`}
        style={{
          width: '98vw',
          height: '96vh',
          transform: 'perspective(1000px) rotateX(0deg)',
          border: '20px solid #1a1a1a',
          boxShadow: `
            inset 0 0 100px rgba(0, 0, 0, 0.9),
            0 0 50px ${isPossessed ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 0, 0.1)'}
          `,
          filter: isPossessed ? 'contrast(1.2) brightness(0.8)' : undefined
        }}
      >
        {/* Screen bulge effect */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
          }}
        />

        {/* Reflection glare */}
        <div
          className="absolute -top-[5%] -left-[5%] w-[30%] h-[40%] bg-gradient-to-br from-white/5 to-transparent rounded-full pointer-events-none z-30 blur-xl"
        />

        {/* Screen content area */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            background: introComplete ? (isPossessed ? '#0a0208' : '#0a0e0a') : 'transparent',
            transform: 'scale(0.98) perspective(1000px) rotateX(1deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Scanlines - thicker */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10 z-10"
            style={{
              background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
              backgroundSize: '100% 4px, 6px 100%'
            }}
          />

          {/* Flicker overlay */}
          <div
            className={`absolute inset-0 pointer-events-none z-10 ${introComplete ? 'animate-flicker' : ''}`}
            style={{ opacity: 0.98, background: 'rgba(255,255,255,0.02)' }}
          />

          {/* Main content */}
          <div className="relative z-0 h-full overflow-y-auto p-8 custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
