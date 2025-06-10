<template>
  <div class="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
    <h1 class="text-2xl font-bold mb-6">Update Profile</h1>

    <form @submit.prevent="updateProfile">
      <div class="mb-4">
        <label class="block mb-1">Salutation</label>
        <select v-model="form.salutation" class="border p-2 w-full rounded">
          <option disabled value="">Select</option>
          <option>Mr.</option>
          <option>Ms.</option>
          <option>Mrs.</option>
          <option>Dr.</option>
        </select>
      </div>


      <div class="mb-4">
        <label class="block mb-1">First Name</label>
        <input v-model="form.firstname" type="text" class="border p-2 w-full rounded" />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Last Name</label>
        <input v-model="form.lastname" type="text" class="border p-2 w-full rounded" />
      </div>

       <div class="mb-4">
        <label class="block mb-1">Email address</label>
        <input v-model="form.email" type="email" class="border p-2 w-full rounded" />
      </div>

      <p v-if="message" class="text-sm text-red-500 mb-2">{{ message }}</p>

      <button class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 w-full">
        Save Changes
      </button>
    </form>
  </div>
</template>

<script setup>
const router = useRouter()
const currentUserEmail = useCookie('currentUser')
const message = ref('')

const form = reactive({
  salutation: '',
  firstname: '',
  lastname: '',
  email: ''
})

// Load current user data
onMounted(async () => {
  const { data, error } = await useFetch('/api/profile', {
    method: 'GET',
    params: { email: currentUserEmail.value }
  })

  if (error.value || !data.value?.user) {
    message.value = 'Failed to load user data.'
    return
  }

  form.salutation = data.value.user.salutation
  form.firstname = data.value.user.firstname
  form.lastname = data.value.user.lastname
  form.email = data.value.user.email
})

// Update profile
const updateProfile = async () => {
  const { data, error } = await useFetch('/api/profile', {
    method: 'PUT',
    body: {
      email: currentUserEmail.value,
      ...form
    }
  })

  if (error.value || !data.value.success) {
    message.value = data.value?.message || 'Failed to update profile.'
    return
  }

  message.value = ''
  router.push('/profile')
}
</script>
