import {
  schemaCheckLobby,
  schemaCreateLobby,
  schemaStartRolling,
  schemaUpdatePrize,
} from '@lottery/types'
import express from 'express'
import { createServer } from 'node:http'
import { Server as SocketIoServer } from 'socket.io'
import { maxLobbyUsers } from './constants'
import {
  lobbyData,
  triggerUpdateCurrentPrize,
  triggerUpdateCurrentWinner,
  triggerUpdateIsRolling,
  triggerUpdateJoinedCount,
  triggerUpdateOnlineCount,
} from './lobby'
import { checkAuthHeader } from './middlewares'
import {
  $getUserId,
  $getWsLobby,
  $getWsUserId,
  $parseBody,
  $respondWith,
  decreaseOnlineUser,
  increaseOnlineUser,
} from './utils'

const app = express()
const server = createServer(app)
const socketIo = new SocketIoServer(server)

app.use(checkAuthHeader)
app.use(express.json())

app.post('/create-lobby', (req, res) => {
  const userId = $getUserId(req)
  const body = $parseBody(req, res, schemaCreateLobby)
  if (!body) {
    return
  }

  if (lobbyData.has(body.lobbyId)) {
    return $respondWith(res, {
      success: false,
      msg: 'Lobby ID already exists',
    })
  }

  lobbyData.set(body.lobbyId, {
    lobbyId: body.lobbyId,
    createTime: Date.now(),
    ownerUserId: userId,
    currentPrize: '',
    isRolling: false,
    currentWinner: null,
    joinedUsers: new Map<string, number>(),
    onlineUsers: new Map<string, number>(),
  })

  return $respondWith(res, {
    success: true,
    payload: null,
  })
})

app.post('/check-lobby', (req, res) => {
  const body = $parseBody(req, res, schemaCheckLobby)
  if (!body) {
    return
  }

  if (lobbyData.has(body.lobbyId)) {
    return $respondWith(res, {
      success: true,
      payload: true,
    })
  }

  return $respondWith(res, {
    success: true,
    payload: false,
  })
})

app.post('/update-prize', (req, res) => {
  const userId = $getUserId(req)
  const body = $parseBody(req, res, schemaUpdatePrize)
  if (!body) {
    return
  }

  const lobby = lobbyData.get(body.lobbyId)

  if (!lobby) {
    return $respondWith(res, {
      success: false,
      msg: 'Lobby ID does not exist',
    })
  }

  if (lobby.ownerUserId !== userId) {
    return $respondWith(res, {
      success: false,
      msg: 'Permission denied',
    })
  }

  lobby.currentPrize = body.prize
  triggerUpdateCurrentPrize(socketIo, body.lobbyId)

  return $respondWith(res, {
    success: true,
    payload: null,
  })
})

app.post('/start-rolling', (req, res) => {
  const userId = $getUserId(req)
  const body = $parseBody(req, res, schemaStartRolling)
  if (!body) {
    return
  }

  const lobby = lobbyData.get(body.lobbyId)

  if (!lobby) {
    return $respondWith(res, {
      success: false,
      msg: 'Lobby ID does not exist',
    })
  }

  if (lobby.ownerUserId !== userId) {
    return $respondWith(res, {
      success: false,
      msg: 'Permission denied',
    })
  }

  if (lobby.currentWinner) {
    return $respondWith(res, {
      success: false,
      msg: 'Winner not cleared',
    })
  }

  lobby.isRolling = true
  triggerUpdateIsRolling(socketIo, body.lobbyId)

  return $respondWith(res, {
    success: true,
    payload: null,
  })
})

app.post('/stop-rolling', (req, res) => {
  const userId = $getUserId(req)
  const body = $parseBody(req, res, schemaStartRolling)
  if (!body) {
    return
  }

  const lobby = lobbyData.get(body.lobbyId)

  if (!lobby) {
    return $respondWith(res, {
      success: false,
      msg: 'Lobby ID does not exist',
    })
  }

  if (lobby.ownerUserId !== userId) {
    return $respondWith(res, {
      success: false,
      msg: 'Permission denied',
    })
  }

  if (lobby.onlineUsers.size === 0) {
    return $respondWith(res, {
      success: false,
      msg: 'Nobody online',
    })
  }

  const randomIndex = Math.floor(Math.random() * lobby.onlineUsers.size)
  const winnerUserId = [...lobby.onlineUsers][randomIndex][0]
  const winnerUserNum = lobby.joinedUsers.get(winnerUserId)!

  lobby.isRolling = false
  lobby.currentWinner = {
    userId: winnerUserId,
    num: winnerUserNum,
  }
  triggerUpdateIsRolling(socketIo, body.lobbyId)
  triggerUpdateCurrentWinner(socketIo, body.lobbyId)

  return $respondWith(res, {
    success: true,
    payload: null,
  })
})

app.post('/clear-winner', (req, res) => {
  const userId = $getUserId(req)
  const body = $parseBody(req, res, schemaStartRolling)
  if (!body) {
    return
  }

  const lobby = lobbyData.get(body.lobbyId)

  if (!lobby) {
    return $respondWith(res, {
      success: false,
      msg: 'Lobby ID does not exist',
    })
  }

  if (lobby.ownerUserId !== userId) {
    return $respondWith(res, {
      success: false,
      msg: 'Permission denied',
    })
  }

  lobby.currentWinner = null
  triggerUpdateCurrentWinner(socketIo, body.lobbyId)

  return $respondWith(res, {
    success: true,
    payload: null,
  })
})

socketIo.of('/lobby').on('connection', (socket) => {
  const userId = $getWsUserId(socket)
  if (!userId) {
    return
  }
  const [lobbyId, lobby] = $getWsLobby(socket, lobbyData)
  if (!lobby) {
    return
  }

  const users = lobby.joinedUsers
  if (users.size >= maxLobbyUsers) {
    socket.emit('error', 'Lobby is full')
    socket.disconnect()
    return
  }
  let userNum = users.get(userId)
  if (!userNum) {
    userNum = users.size + 1
    users.set(userId, userNum)
    triggerUpdateJoinedCount(socketIo, lobbyId)
  }

  if (increaseOnlineUser(userId, lobby.onlineUsers)) {
    triggerUpdateOnlineCount(socketIo, lobbyId)
  }

  socket.emit('update', {
    currentPrize: lobby.currentPrize,
    currentWinnerNum: lobby.currentWinner?.num ?? null,
    isRolling: lobby.isRolling,
    userNum,
  })

  socket.join(lobbyId)

  socket.on('disconnect', () => {
    if (decreaseOnlineUser(userId, lobby.onlineUsers)) {
      triggerUpdateOnlineCount(socketIo, lobbyId)
    }
  })
})

socketIo.of('/screen').on('connection', (socket) => {
  const [lobbyId, lobby] = $getWsLobby(socket, lobbyData)
  if (!lobby) {
    return
  }

  socket.emit('update', {
    currentWinnerNum: lobby.currentWinner?.num ?? null,
    onlineCount: lobby.onlineUsers.size,
    isRolling: lobby.isRolling,
  })

  socket.join(lobbyId)
})

socketIo.of('/control').on('connection', (socket) => {
  const userId = $getWsUserId(socket)
  if (!userId) {
    return
  }
  const [lobbyId, lobby] = $getWsLobby(socket, lobbyData)
  if (!lobby) {
    return
  }

  if (lobby.ownerUserId !== userId) {
    socket.emit('error', 'Permission denied')
    socket.disconnect()
    return
  }

  socket.emit('update', {
    currentPrize: lobby.currentPrize,
    currentWinner: lobby.currentWinner,
    isRolling: lobby.isRolling,
    onlineCount: lobby.onlineUsers.size,
    joinedCount: lobby.joinedUsers.size,
  })

  socket.join(lobbyId)
})

server.listen(3001, '0.0.0.0', () => {
  console.log('Server running at 0.0.0.0:3001')
})
