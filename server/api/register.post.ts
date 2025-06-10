export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { salutation, firstname, lastname, email, password, confirmPassword } = body

  if (!email || !password || !firstname || !lastname || !salutation) {
    return { success: false, message: 'All fields are required.' }
  }

  if (password !== confirmPassword) {
    return { success: false, message: 'Passwords do not match.' }
  }

  const storage = useStorage()
  const users: any[] = (await storage.getItem('users')) || []

  if (users.find((u: any) => u.email === email)) {
    return { success: false, message: 'Email already registered.' }
  }

  users.push({ salutation, firstname, lastname, email, password })

  await storage.setItem('users', users)

  return { success: true, message: 'User registered successfully.' }
})
