import { Button } from '@/components/button'
import { Label } from '@/components/label'
import { Logo } from '@/components/logo'
import { useControlWs } from '@/hooks/use-control-ws'
import { $fetch } from '@/libs/utils/fetch'
import {
  schemaClearWinner,
  schemaStartRolling,
  schemaStopRolling,
  schemaUpdatePrize,
} from '@lottery/types'
import {
  IconEdit,
  IconPlayerPlay,
  IconPlayerStop,
  IconRestore,
} from '@tabler/icons-react'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

export function ControlPage() {
  const { id: lobbyId } = useParams()
  if (!lobbyId) {
    throw new Error('Invalid lobby ID')
  }

  const wsData = useControlWs(lobbyId)

  async function handleUpdatePrize() {
    const prize = prompt('请输入新奖品')
    if (!prize) {
      return
    }

    const resp = await $fetch<z.infer<typeof schemaUpdatePrize>>(
      '/update-prize',
      {
        lobbyId: lobbyId!,
        prize,
      },
    )

    if (!resp.success) {
      alert(resp.msg)
    }
  }

  async function handleUpdateRolling() {
    if (wsData.winner) {
      const resp = await $fetch<z.infer<typeof schemaClearWinner>>(
        '/clear-winner',
        {
          lobbyId: lobbyId!,
        },
      )

      if (!resp.success) {
        alert(resp.msg)
      }
      return
    }

    if (wsData.isRolling) {
      const resp = await $fetch<z.infer<typeof schemaStopRolling>>(
        '/stop-rolling',
        {
          lobbyId: lobbyId!,
        },
      )

      if (!resp.success) {
        alert(resp.msg)
      }

      return
    }

    const resp = await $fetch<z.infer<typeof schemaStartRolling>>(
      '/start-rolling',
      {
        lobbyId: lobbyId!,
      },
    )

    if (!resp.success) {
      alert(resp.msg)
    }
  }

  return (
    <div className="mx-auto mt-[5vh] max-w-screen-sm p-8">
      <Logo />

      <div className="mt-12 flex flex-col gap-2">
        <Label text="抽取奖品">{wsData.prize || '未设置'}</Label>
        <Label text="当前中奖号码">{wsData.winner?.num ?? '无'}</Label>
        <Label text="当前中奖用户 ID">{wsData.winner?.userId ?? '无'}</Label>
        <Label text="在线人数">{wsData.onlineCount}</Label>
        <Label text="参加人数">{wsData.joinedCount}</Label>
        <Label text="大厅过期时间">{wsData.expireTime}</Label>
      </div>

      <div className="mx-auto mt-12 flex max-w-[250px] flex-col gap-2">
        <Button onClick={handleUpdatePrize}>
          <IconEdit size={18} />
          修改奖品
        </Button>
        <Button onClick={handleUpdateRolling}>
          {wsData.isRolling ? (
            <>
              <IconPlayerStop size={18} />
              停止摇号
            </>
          ) : wsData.winner ? (
            <>
              <IconRestore size={18} />
              重置摇号
            </>
          ) : (
            <>
              <IconPlayerPlay size={18} />
              开始摇号
            </>
          )}
        </Button>
      </div>

      <div className="mt-12 text-center text-sm opacity-50">
        当前大厅：{lobbyId}
      </div>
    </div>
  )
}
