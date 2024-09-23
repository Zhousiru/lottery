import { ApiResponse, Lobby } from '@lottery/types'
import { Request, Response } from 'express'
import { Socket } from 'socket.io'
import { ZodSchema } from 'zod'
import { fromError } from 'zod-validation-error'

export function $respondWith<T>(res: Response, body: ApiResponse<T>) {
  res.status(200).json(body)
}

export function $getUserId(req: Request) {
  const authorization = req.headers['authorization']
  if (!authorization) {
    throw new Error('Invalid authorization header')
  }

  return authorization.replace(/^Bearer /i, '')
}

export function $getWsUserId(socket: Socket) {
  const userId = socket.handshake.query.userId
  if (typeof userId !== 'string') {
    socket.emit('error', 'Invalid user ID')
    socket.disconnect()
    return null
  }
  return userId
}

export function $parseBody<T>(
  req: Request,
  res: Response,
  schema: ZodSchema<T>,
) {
  const result = schema.safeParse(req.body)

  if (result.success) {
    return result.data
  }

  $respondWith(res, {
    success: false,
    msg: fromError(result.error).message,
  })

  return null
}

export function $getWsLobby(
  socket: Socket,
  lobbyData: Map<string, Lobby>,
): [string, Lobby | null] {
  const { lobbyId } = socket.handshake.query
  if (typeof lobbyId !== 'string') {
    socket.emit('error', 'Invalid lobby ID')
    socket.disconnect()
    return ['', null]
  }

  const lobby = lobbyData.get(lobbyId)
  if (!lobby) {
    socket.emit('error', 'Invalid lobby ID')
    socket.disconnect()
    return [lobbyId, null]
  }

  return [lobbyId, lobby]
}

export function increaseOnlineUser(
  userId: string,
  onlineUsers: Map<string, number>,
) {
  const prevSize = onlineUsers.size

  const connCount = (onlineUsers.get(userId) ?? 0) + 1
  onlineUsers.set(userId, connCount)

  const size = onlineUsers.size

  return size > prevSize
}

export function decreaseOnlineUser(
  userId: string,
  onlineUsers: Map<string, number>,
) {
  const prevSize = onlineUsers.size

  const connCount = (onlineUsers.get(userId) ?? 0) - 1
  if (connCount <= 0) {
    onlineUsers.delete(userId)
  } else {
    onlineUsers.set(userId, connCount)
  }

  const size = onlineUsers.size

  return prevSize > size
}
