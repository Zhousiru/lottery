import { Confetti, ConfettiRef } from '@/components/confetti'
import { useScreenWs } from '@/hooks/use-screen-ws'
import { cn } from '@/libs/utils/cn'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useRafLoop } from 'react-use'

export function ScreenPage() {
  const { id: lobbyId } = useParams()
  if (!lobbyId) {
    throw new Error('Invalid lobby ID')
  }

  const wsData = useScreenWs(lobbyId)
  const animationTextRef = useRef<HTMLDivElement>(null)
  const confettiRef = useRef<ConfettiRef>(null)

  const [stopRollingText, startRollingText] = useRafLoop(() => {
    const randomValue = Math.floor(Math.random() * wsData.joinedCount) + 1
    animationTextRef.current!.textContent = randomValue.toString()
  })

  useEffect(() => {
    if (wsData.isRolling) {
      startRollingText()
    } else {
      stopRollingText()
    }
  }, [startRollingText, stopRollingText, wsData.isRolling])

  useEffect(() => {
    if (wsData.num) {
      confettiRef.current!.trigger()
    }
  }, [wsData.num])

  return (
    <>
      <div className="m-8 mx-auto mt-[5vh] max-w-screen-lg p-8">
        <div className="text-3xl italic opacity-50">参与人数</div>
        <div className="mt-2 pl-4 text-6xl font-bold italic [text-shadow:8px_8px_white]">
          {wsData.onlineCount}
        </div>

        <div className="relative mx-auto mt-24 aspect-square h-[40vmin] max-h-[450px] min-h-[280px]">
          <div
            className={cn(
              'pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-0 blur-3xl transition duration-500',
              wsData.num && 'pointer-events-auto opacity-100',
            )}
          >
            <div className="animate-spin-slow aspect-square h-[80vmin] max-h-[800px] min-h-[560px] flex-shrink-0 bg-gradient-to-r from-yellow-300 via-red-300 to-purple-300"></div>
          </div>

          <div className="absolute inset-0 rounded-lg bg-white shadow-lg">
            {wsData.isRolling ? (
              <div
                className="absolute inset-0 grid place-items-center text-9xl font-light"
                ref={animationTextRef}
              ></div>
            ) : wsData.num ? (
              <div className="absolute inset-0 grid place-items-center text-9xl font-light">
                {wsData.num}
              </div>
            ) : (
              <div className="absolute inset-0 grid place-items-center text-6xl font-light">
                未开始
              </div>
            )}
          </div>
        </div>
      </div>
      <Confetti ref={confettiRef} />
    </>
  )
}
