import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export function useScreenWs(lobbyId: string) {
  const [num, setNum] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState<boolean>(false)
  const [onlineCount, setOnlineCount] = useState<number>(0)

  useEffect(() => {
    const socket = io('/screen', {
      query: {
        lobbyId,
      },
    })

    socket.once('error', (v) => {
      alert(v)
      socket.disconnect()
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
    })

    return () => {
      socket.offAny()
      socket.disconnect()
    }
  })

  return { num, isRolling, onlineCount }
}
