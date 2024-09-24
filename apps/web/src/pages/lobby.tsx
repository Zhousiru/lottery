import { Confetti, ConfettiRef } from '@/components/confetti'
import { Logo } from '@/components/logo'
import { useLobbyWs } from '@/hooks/use-lobby-ws'
import { cn } from '@/libs/utils/cn'
import { IconGift, IconHourglass, IconMoodSad } from '@tabler/icons-react'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'

export function LobbyPage() {
  const { id: lobbyId } = useParams()
  if (!lobbyId) {
    throw new Error('Invalid lobby ID')
  }

  const wsData = useLobbyWs(lobbyId)
  const confettiRef = useRef<ConfettiRef>(null)

  const isWinner =
    wsData.userNum && wsData.winnerNum && wsData.userNum === wsData.winnerNum

  if (isWinner) {
    confettiRef.current!.trigger()
  }

  return (
    <div className="mx-auto mt-[5vh] max-w-screen-sm p-8">
      <Logo />

      <div>
        <div className="mt-12 flex justify-between gap-2 rounded-full bg-black/5 px-4 py-2 text-sm">
          <span className="flex-shrink-0 text-black/75">当前正在抽：</span>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-black/50">
            {wsData.prize || '?'}
          </span>
        </div>
      </div>

      <div className="relative mx-auto mt-12 h-[250px] max-w-[250px]">
        <div
          className={cn(
            'pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-0 blur-xl transition duration-500',
            isWinner && 'pointer-events-auto opacity-100',
          )}
        >
          <div className="animate-spin-slow aspect-square h-[350px] flex-shrink-0 bg-gradient-to-r from-yellow-300 via-red-300 to-purple-300"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white p-8 shadow-lg">
          {wsData.userNum ? (
            <div className="text-6xl font-light">{wsData.userNum}</div>
          ) : (
            <div className="text-3xl font-light">取号中</div>
          )}

          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-8 flex justify-center opacity-0 transition',
              isWinner && 'pointer-events-auto opacity-100',
            )}
          >
            <div className="flex items-center gap-2 rounded-full border border-amber-500 px-4 py-2 text-sm text-amber-500">
              <IconGift size={18} />
              中奖啦
            </div>
          </div>

          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-8 flex justify-center opacity-0 transition',
              wsData.isRolling && 'pointer-events-auto opacity-100',
            )}
          >
            <div className="flex animate-bounce items-center gap-2 rounded-full border border-gray-500 px-4 py-2 text-sm text-gray-500">
              <IconHourglass size={18} />
              正在抽奖
            </div>
          </div>

          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-8 flex justify-center opacity-0 transition',
              wsData.winnerNum &&
                !isWinner &&
                'pointer-events-auto opacity-100',
            )}
          >
            <div className="flex items-center gap-2 rounded-full border border-gray-500 px-4 py-2 text-sm text-gray-500">
              <IconMoodSad size={18} />
              很遗憾，未中奖
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-sm opacity-50">
        当前大厅：{lobbyId}
      </div>

      <Confetti ref={confettiRef} />
    </div>
  )
}
