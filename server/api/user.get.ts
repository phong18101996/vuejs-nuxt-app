// server/api/user.get.ts
export default defineEventHandler(async (event) => {
  const email = getCookie(event, 'currentUser')

  if (!email) {
    return { success: false, message: 'User not logged in.' }
  }

  const storage = useStorage() 
  const users: any[] = (await storage.getItem('users')) || []
  const user = users.find(u => u.email === email)

  if (!user) {
    return { success: false, message: 'User not found.' }
  }

  return { success: true, user }
})
