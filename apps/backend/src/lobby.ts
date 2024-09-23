import { Lobby } from '@lottery/types'
import { Server as SocketIoServer } from 'socket.io'

export const lobbyData = new Map<string, Lobby>()

export function triggerUpdateCurrentPrize(io: SocketIoServer, lobbyId: string) {
  const lobby = lobbyData.get(lobbyId)!

  io.of('/lobby').to(lobbyId).emit('update', {
    currentPrize: lobby.currentPrize,
  })

  io.of('/control').to(lobbyId).emit('update', {
    currentPrize: lobby.currentPrize,
  })
}

export function triggerUpdateIsRolling(io: SocketIoServer, lobbyId: string) {
  const lobby = lobbyData.get(lobbyId)!

  io.of('/lobby').to(lobbyId).emit('update', {
    isRolling: lobby.isRolling,
  })

  io.of('/screen').to(lobbyId).emit('update', {
    isRolling: lobby.isRolling,
  })

  io.of('/control').to(lobbyId).emit('update', {
    isRolling: lobby.isRolling,
  })
}

export function triggerUpdateCurrentWinner(
  io: SocketIoServer,
  lobbyId: string,
) {
  const lobby = lobbyData.get(lobbyId)!

  io.of('/lobby')
    .to(lobbyId)
    .emit('update', {
      currentWinnerNum: lobby.currentWinner?.num ?? null,
    })

  io.of('/screen')
    .to(lobbyId)
    .emit('update', {
      currentWinnerNum: lobby.currentWinner?.num ?? null,
    })

  io.of('/control').to(lobbyId).emit('update', {
    currentWinner: lobby.currentWinner,
  })
}

export function triggerUpdateOnlineCount(io: SocketIoServer, lobbyId: string) {
  const lobby = lobbyData.get(lobbyId)!

  io.of('/screen').to(lobbyId).emit('update', {
    onlineCount: lobby.onlineUsers.size,
  })

  io.of('/control').to(lobbyId).emit('update', {
    onlineCount: lobby.onlineUsers.size,
  })
}

export function triggerUpdateJoinedCount(io: SocketIoServer, lobbyId: string) {
  const lobby = lobbyData.get(lobbyId)!

  io.of('/control').to(lobbyId).emit('update', {
    joinedCount: lobby.joinedUsers.size,
  })
  io.of('/screen').to(lobbyId).emit('update', {
    joinedCount: lobby.joinedUsers.size,
  })
}
