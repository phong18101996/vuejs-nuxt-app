// import { useStorage } from 'unstorage'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, ...extraFields } = body

  const storage = useStorage()
  const users: any[] = (await storage.getItem('users')) || []
  const index = users.findIndex(u => u.email === email)

  if (index === -1) {
    return { success: false, message: 'User not found.' }
  }

  for (const key in extraFields) {
    if (extraFields[key]) {
      users[index][key] = extraFields[key]
    }
  }

  await storage.setItem('users', users)
  return { success: true }
})
