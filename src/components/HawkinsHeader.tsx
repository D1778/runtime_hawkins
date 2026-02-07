import { useStore } from '../store'

export function HawkinsHeader() {
    const { isPossessed } = useStore()

    return (
        <div className={`text-center border-b-4 pb-6 mb-8 transition-colors duration-500 ${isPossessed ? 'border-red-900' : 'border-[#33ff33]'
            }`}>
            <div className={`font-press-start text-xl sm:text-2xl mb-3 tracking-widest ${isPossessed ? 'text-red-600 animate-pulse' : 'text-[#ffb000]'
                }`}
                style={{
                    textShadow: isPossessed ? '0 0 10px #cc0000' : '0 0 10px #ffb000, 2px 2px 0 rgba(0,0,0,0.5)'
                }}>
                {isPossessed ? '⚠️ DANGER: CONTAINMENT BREACH ⚠️' : '⚠️ HAWKINS NATIONAL LABORATORY ⚠️'}
            </div>

            <div className={`font-vt323 text-lg tracking-wider ${isPossessed ? 'text-red-500' : 'text-[#cc0000]'
                } animate-pulse`}>
                CLASSIFIED // LEVEL 5 CLEARANCE REQUIRED
            </div>

            <div className={`font-vt323 text-sm mt-2 opacity-70 ${isPossessed ? 'text-purple-500' : 'text-[#cc0000]'
                }`}>
                PROJECT: RAINBOW ROOM // MK-ULTRA PHASE II
            </div>
        </div>
    )
}
