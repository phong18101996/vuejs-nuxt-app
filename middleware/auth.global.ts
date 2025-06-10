export default defineNuxtRouteMiddleware((to, from) => {
  const currentUser = useCookie('currentUser')

  const publicPages = ['/login', '/register']

  if (!currentUser.value && !publicPages.includes(to.path)) {
    return navigateTo('/login')
  }
})
