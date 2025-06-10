export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' }
  }

  const storage = useStorage()
  const users: any[] = (await storage.getItem('users')) || []

  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    return { success: false, message: 'Your email or password is incorrect.' }
  }

  return { success: true, message: 'Login successful.' }
})