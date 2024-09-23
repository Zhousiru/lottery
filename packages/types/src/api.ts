import { z } from 'zod'

export interface ApiResponseOk<T> {
  success: true
  payload: T
}

export interface ApiResponseErr {
  success: false
  msg: string
}

export type ApiResponse<T> = ApiResponseOk<T> | ApiResponseErr

export const schemaCreateLobby = z.object({
  lobbyId: z.string().min(1),
})

export const schemaCheckLobby = z.object({
  lobbyId: z.string().min(1),
})

export const schemaStartRolling = z.object({
  lobbyId: z.string().min(1),
})

export const schemaStopRolling = z.object({
  lobbyId: z.string().min(1),
})

export const schemaClearWinner = z.object({
  lobbyId: z.string().min(1),
})

export const schemaUpdatePrize = z.object({
  lobbyId: z.string().min(1),
  prize: z.string().min(1),
})
