import { Button } from '@/components/button'
import { Logo } from '@/components/logo'
import { $fetch } from '@/libs/utils/fetch'
import { schemaCreateLobby } from '@lottery/types'
import { IconChevronRight } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

export function HomePage() {
  const navigate = useNavigate()

  async function handleNewLobby() {
    const lobbyId = prompt('请输入新大厅号')
    if (!lobbyId) {
      return
    }

    const resp = await $fetch<z.infer<typeof schemaCreateLobby>>(
      '/create-lobby',
      {
        lobbyId,
      },
    )

    if (!resp.success) {
      alert(resp.msg)
    } else {
      navigate('/control/' + lobbyId)
    }
  }

  return (
    <div className="mx-auto mt-[10vh] max-w-screen-sm p-8">
      <Logo />

      <div className="mt-[100px] flex flex-row justify-center gap-2">
        <input
          className="h-[50px] w-[300px] rounded border border-black p-2 text-center text-2xl shadow outline-none"
          placeholder="大厅号"
        />
        <Button className="h-[50px] w-[50px] p-0">
          <IconChevronRight />
        </Button>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          className="text-sm opacity-25 transition hover:opacity-50"
          onClick={handleNewLobby}
        >
          创建新大厅
        </button>
      </div>
    </div>
  )
}
