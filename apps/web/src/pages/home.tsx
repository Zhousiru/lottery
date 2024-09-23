import { Button } from '@/components/button'
import { Logo } from '@/components/logo'
import { cn } from '@/libs/utils/cn'
import { $fetch } from '@/libs/utils/fetch'
import { schemaCheckLobby, schemaCreateLobby } from '@lottery/types'
import { IconChevronRight } from '@tabler/icons-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

export function HomePage() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

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

  async function handleJoinLobby(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const lobbyId = inputRef.current!.value

    setLoading(true)
    const resp = await $fetch<z.infer<typeof schemaCheckLobby>, boolean>(
      '/check-lobby',
      {
        lobbyId,
      },
    )
    setLoading(false)

    if (!resp.success) {
      alert(resp.msg)
      return
    }

    if (resp.payload) {
      navigate('/lobby/' + lobbyId)
    } else {
      alert('大厅号无效')
    }
  }

  function createNavigateHandler(to: string) {
    return () => {
      const lobbyId = prompt('请输入大厅号')
      if (!lobbyId) {
        return
      }

      navigate('/' + to + '/' + lobbyId)
    }
  }

  return (
    <div className="mx-auto mt-[10vh] max-w-screen-sm p-8">
      <Logo />

      <form
        className={cn(
          'mt-[100px] flex flex-row justify-center gap-2 transition',
          loading && 'opacity-50',
        )}
        onSubmit={handleJoinLobby}
      >
        <input
          ref={inputRef}
          className="h-[50px] w-[300px] rounded border border-black p-2 text-center text-2xl shadow outline-none"
          placeholder="大厅号"
          required
          disabled={loading}
        />
        <Button
          className="h-[50px] w-[50px] p-0"
          type="submit"
          disabled={loading}
        >
          <IconChevronRight />
        </Button>
      </form>

      <div className="mt-4 flex justify-center gap-2 text-sm">
        <button
          className="opacity-25 outline-none transition hover:opacity-50"
          onClick={handleNewLobby}
        >
          创建新大厅
        </button>
        <div className="select-none opacity-25">/</div>
        <button
          className="opacity-25 outline-none transition hover:opacity-50"
          onClick={createNavigateHandler('control')}
        >
          控制台
        </button>
        <div className="select-none opacity-25">/</div>
        <button
          className="opacity-25 outline-none transition hover:opacity-50"
          onClick={createNavigateHandler('screen')}
        >
          大屏
        </button>
      </div>
    </div>
  )
}
