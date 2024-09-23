import { useScreenWs } from '@/hooks/use-screen-ws'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

export function ScreenPage() {
  const { id: lobbyId } = useParams()
  if (!lobbyId) {
    throw new Error('Invalid lobby ID')
  }

  const wsData = useScreenWs(lobbyId)
  const animationTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wsData.isRolling) {
      return
    }

    let frameId: number

    function animate() {
      const randomValue = Math.floor(Math.random() * wsData.onlineCount) + 1
      animationTextRef.current!.textContent = randomValue.toString()
      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [wsData.isRolling, wsData.onlineCount])

  return (
    <>
      <div className="m-8 mx-auto mt-[10vh] max-w-screen-lg p-8">
        <div className="text-3xl italic opacity-50">参与人数</div>
        <div className="mt-2 pl-4 text-6xl font-bold italic [text-shadow:8px_8px_white]">
          {wsData.onlineCount}
        </div>

        <div className="relative mx-auto mt-24 flex h-[400px] w-[400px] items-center justify-center rounded-lg bg-white shadow-lg">
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
    </>
  )
}
