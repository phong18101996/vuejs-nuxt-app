

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const storage = useStorage()
  const users: any[] = (await storage.getItem('users')) || []
  const user = users.find(u => u.email === body.email)

  if (!user) {
    return { success: false, message: 'User not found.' }
  }

  return user
})
