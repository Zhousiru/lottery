import { ApiResponse } from '@lottery/types'
import { getAuthHeader } from './user-id'

export async function $fetch<Body, Resp = null>(url: string, body: Body) {
  const resp = (await (
    await fetch('/api' + url, {
      method: 'post',
      headers: {
        'Content-Type': ' application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(body),
    })
  ).json()) as ApiResponse<Resp>

  return resp
}
