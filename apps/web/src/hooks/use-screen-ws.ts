import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

export function useScreenWs(lobbyId: string) {
  const [num, setNum] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState<boolean>(false)
  const [onlineCount, setOnlineCount] = useState<number>(0)
  const [joinedCount, setJoinedCount] = useState<number>(0)

  const navigate = useNavigate()

  useEffect(() => {
    const socket = io('/screen', {
      query: {
        lobbyId,
      },
    })

    socket.once('error', (v) => {
      socket.disconnect()
      alert(v)
      navigate('/', { replace: true })
    })
    socket.on('update', (v) => {
      if (v.currentWinnerNum !== undefined) {
        setNum(v.currentWinnerNum)
      }
      if (v.isRolling !== undefined) {
        setIsRolling(v.isRolling)
      }
      if (v.onlineCount !== undefined) {
        setOnlineCount(v.onlineCount)
      }
      if (v.onlineCount !== undefined) {
        setOnlineCount(v.onlineCount)
      }
      if (v.joinedCount !== undefined) {
        setJoinedCount(v.joinedCount)
      }
    })

    return () => {
      socket.offAny()
      socket.disconnect()
    }
  }, [lobbyId, navigate])

  return { num, isRolling, onlineCount, joinedCount }
}
