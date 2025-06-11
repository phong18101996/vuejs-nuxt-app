<template>
  <div class="login-page max-w-lg mx-auto mt-10 p-6 ">
    <h1 class="text-2xl font-bold mb-4 text-center text-gray-700">Welcome to my app</h1>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label class="block mb-1 text-gray-700 font-medium">Email</label>
        <input v-model="email" type="email" class="border p-2 w-full rounded border-gray-500" @input="validateForm" />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-gray-700 font-medium">Password</label>
        <input v-model="password" type="password" class="border p-2 w-full rounded border-gray-500" @input="validateForm" />
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
      </div>

      <div class="mb-4 flex items-center gap-2">
        <input id="remember" type="checkbox" v-model="rememberMe" />
        <label for="remember text-gray-700 font-medium">Keep me logged in</label>
      </div>

      <p v-if="serverMessage" class="text-red-500 text-sm mb-2">{{ serverMessage }}</p>

      <button
        type="submit"
        :disabled="!isFormValid"
        class="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Login
      </button>
    </form>

    <p class="mt-4 text-center text-sm text-gray-600">
      No account?
      <NuxtLink to="/register" class="text-blue-600 hover:underline">
        Register here.
      </NuxtLink>
    </p>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const serverMessage = ref('')

const errors = reactive({
  email: '',
  password: ''
})

const isFormValid = ref(false)
const router = useRouter()

const validateForm = () => {
  errors.email = ''
  errors.password = ''
  serverMessage.value = ''
  isFormValid.value = false

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(email.value)) {
    errors.email = 'Invalid email format.'
  }

  if (!password.value) {
    errors.password = 'Password is required.'
  }

  if (!errors.email && !errors.password) {
    isFormValid.value = true
  }
}

const login = async () => {
  validateForm()
  if (!isFormValid.value) return

  const { data, error } = await useFetch('/api/login', {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value
    }
  })

  if (error.value || !data.value) {
    serverMessage.value = 'An error occurred. Please try again.'
    return
  }

  if (!data.value.success) {
    serverMessage.value = data.value.message
    return
  }

  const cookieOptions = rememberMe.value
    ? { maxAge: 60 * 60 * 24 * 365 * 2 }
    : undefined

  useCookie('currentUser', cookieOptions).value = email.value
  router.push('/profile')
}
</script>
