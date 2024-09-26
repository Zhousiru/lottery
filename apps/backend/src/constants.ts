import { config } from 'dotenv'
import path from 'node:path'

config({ path: path.resolve(import.meta.dirname, '../../../.env.backend') })

export const maxLobbyUsers = parseInt(process.env.MAX_LOBBY_USERS) || 2000
export const lobbyLifespan =
  parseInt(process.env.LOBBY_LIFESPAN) || 6 * 60 * 60 * 1000 // 6h
