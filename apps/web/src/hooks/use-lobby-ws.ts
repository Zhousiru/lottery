import { getUserId } from '@/libs/utils/user-id'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

export function useLobbyWs(lobbyId: string) {
  const [userNum, setUserNum] = useState<number | null>(null)
  const [winnerNum, setWinnerNum] = useState<number | null>(null)
  const [prize, setPrize] = useState<string>('')
  const [isRolling, setIsRolling] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const socket = io('/lobby', {
      query: {
        lobbyId,
        userId: getUserId(),
      },
      closeOnBeforeunload: true,
    })

    socket.once('error', (v) => {
      socket.disconnect()
      alert(v)
      navigate('/', { replace: true })
    })
    socket.on('update', (v) => {
      if (v.userNum !== undefined) {
        setUserNum(v.userNum)
      }
      if (v.currentWinnerNum !== undefined) {
        setWinnerNum(v.currentWinnerNum)
      }
      if (v.currentPrize !== undefined) {
        setPrize(v.currentPrize)
      }
      if (v.isRolling !== undefined) {
        setIsRolling(v.isRolling)
      }
    })

    return () => {
      socket.offAny()
      socket.disconnect()
    }
  }, [lobbyId, navigate])

  return { userNum, winnerNum, prize, isRolling }
}
