export default defineEventHandler((event) => {
  setCookie(event, 'currentUser', '', {
    maxAge: -1
  })

  return { success: true, message: 'Logged out successfully.' }
})
