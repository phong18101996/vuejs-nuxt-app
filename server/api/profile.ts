import { useStorage } from '#internal/nitro'
import { defineEventHandler, readBody, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const storage = useStorage()
  const method = event.method
  const users: any[] = (await storage.getItem('users')) || []

  if (method === 'GET') {
    const { email } = getQuery(event)
    const user = users.find((u) => u.email === email)
    return user ? { user } : { user: null }
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const { email, salutation, firstname, lastname } = body

    const index = users.findIndex((u) => u.email === email)
    if (index === -1) {
      return { success: false, message: 'User not found.' }
    }

    users[index] = {
      ...users[index],
      salutation,
      firstname,
      lastname
    }

    await storage.setItem('users', users)
    return { success: true }
  }

  return { success: false, message: 'Unsupported method.' }
})
