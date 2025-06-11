export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/') {
    return navigateTo('/login')
  }
  const currentUser = useCookie('currentUser')

  const publicPages = ['/login', '/register']

  if (!currentUser.value && !publicPages.includes(to.path)) {
    return navigateTo('/login')
  }
})
