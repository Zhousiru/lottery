export function getUserId() {
  const userId = localStorage.getItem('user-id')
  if (!userId) {
    throw new Error('Invalid user ID')
  }

  return userId
}

export function getAuthHeader() {
  return {
    Authorization: 'Bearer ' + getUserId(),
  }
}
