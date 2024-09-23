import { formatTimestamp } from '@/libs/utils/time'
import { getUserId } from '@/libs/utils/user-id'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

export function useControlWs(lobbyId: string) {
  const [prize, setPrize] = useState<string>('')
  const [winner, setWinner] = useState<{
    userId: string
    num: number
  } | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)
  const [joinedCount, setJoinedCount] = useState(0)

  const [expireTime, setExpireTime] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const socket = io('/control', {
      query: {
        lobbyId,
        userId: getUserId(),
      },
    })

    socket.once('error', (v) => {
      socket.disconnect()
      alert(v)
      navigate('/', { replace: true })
    })
    socket.on('update', (v) => {
      if (v.currentPrize !== undefined) {
        setPrize(v.currentPrize)
      }
      if (v.currentWinner !== undefined) {
        setWinner(v.currentWinner)
      }
      if (v.isRolling !== undefined) {
        setIsRolling(v.isRolling)
      }
      if (v.onlineCount !== undefined) {
        setOnlineCount(v.onlineCount)
      }
      if (v.joinedCount !== undefined) {
        setJoinedCount(v.joinedCount)
      }
      if (v.expireTime !== undefined) {
        setExpireTime(formatTimestamp(v.expireTime))
      }
    })

    return () => {
      socket.offAny()
      socket.disconnect()
    }
  }, [lobbyId, navigate])

  return { prize, winner, isRolling, onlineCount, joinedCount, expireTime }
}
