export interface WinnerInfo {
  num: number
  userId: string
}

export interface Lobby {
  lobbyId: string
  expireTime: number
  ownerUserId: string
  currentPrize: string
  isRolling: boolean
  currentWinner: WinnerInfo | null
  joinedUsers: Map<string, number>
  onlineUsers: Map<string, number>
}
