// server/api/profile/avatar.post.ts
import formidable from 'formidable'
import path from 'path'
import { once } from 'events'

export default defineEventHandler(async (event) => {
  const form = formidable({
    multiples: false,
    uploadDir: 'public/uploads',
    keepExtensions: true,
  })

  // Parse form and wait until it's done
  const [fields, files]: any = await new Promise((resolve, reject) => {
    form.parse(event.node.req, async (err, fields, files) => {
      if (err) reject(err)
      else resolve([fields, files])
    })
  })

  const file = files.avatar?.[0]
  if (!file) {
    return { success: false, message: 'No file uploaded' }
  }

  const avatarUrl = `/uploads/${path.basename(file.filepath)}`

  // ✅ Lấy email từ cookie
  const email = getCookie(event, 'currentUser')
  if (!email) {
    return { success: false, message: 'User not authenticated' }
  }

  // ✅ Lưu avatar_url vào user tương ứng
  const storage = useStorage()
  const users: any[] = (await storage.getItem('users')) || []
  const index = users.findIndex(u => u.email === email)

  if (index === -1) {
    return { success: false, message: 'User not found' }
  }

  users[index].avatar_url = avatarUrl
  await storage.setItem('users', users)

  return {
    success: true,
    avatar_url: avatarUrl,
    message: 'Avatar uploaded and saved successfully'
  }
})
