import { useScreenWs } from '@/hooks/use-screen-ws'
import { cn } from '@/libs/utils/cn'
import { useParams } from 'react-router-dom'

export function ScreenPage() {
  const { id: lobbyId } = useParams()
  if (!lobbyId) {
    throw new Error('Invalid lobby ID')
  }

  const wsData = useScreenWs(lobbyId)

  return (
    <>
      <div className="m-8 mx-auto mt-[10vh] max-w-screen-lg p-8">
        <div className="text-3xl italic opacity-50">参与人数</div>
        <div className="mt-2 pl-4 text-6xl font-bold italic [text-shadow:8px_8px_white]">
          {wsData.onlineCount}
        </div>

        <div
          className={cn(
            'mx-auto mt-24 flex h-[400px] w-[400px] items-center justify-center rounded-lg bg-white shadow-lg',
            wsData.isRolling && 'animate-pulse',
          )}
        >
          <div className="text-9xl font-light">{wsData.num ?? '?'}</div>
        </div>
      </div>
    </>
  )
}
