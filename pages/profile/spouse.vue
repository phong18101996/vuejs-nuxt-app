<template>
  <div class="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
    <h1 class="text-2xl font-bold mb-6">Spouse Details</h1>

    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block mb-1">Salutation</label>
        <select v-model="form.salutation" class="border p-2 w-full rounded">
          <option disabled value="">Select</option>
          <option>Mr.</option>
          <option>Ms.</option>
          <option>Mrs.</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block mb-1">First Name</label>
        <input
          v-model="form.firstname"
          type="text"
          class="border p-2 w-full rounded"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Last Name</label>
        <input
          v-model="form.lastname"
          type="text"
          class="border p-2 w-full rounded"
        />
      </div>

      <button
        class="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700"
      >
        Save Spouse Info
      </button>

      <p v-if="message" class="mt-4 text-green-600 text-md text-center">
        {{ message }}
      </p>
    </form>
  </div>
</template>

<script setup>
const currentUserEmail = useCookie("currentUser")
const form = reactive({
  salutation: "",
  firstname: "",
  lastname: "",
})
const message = ref("")

onMounted(async () => {
  const { data } = await useFetch("/api/profile/get", {
    method: "POST",
    body: { email: currentUserEmail.value },
  })

  if (data.value?.spouse) {
    Object.assign(form, {
      salutation: data.value.spouse.salutation || "",
      firstname: data.value.spouse.firstname || "",
      lastname: data.value.spouse.lastname || "",
    })
  }
})

const showSuccessMessage = (text) => {
  message.value = text
  setTimeout(() => {
    message.value = ""
  }, 1000)
}

const submit = async () => {
  const { data, error } = await useFetch("/api/profile/spouse", {
    method: "POST",
    body: {
      email: currentUserEmail.value,
      spouse: {
        salutation: form.salutation,
        firstname: form.firstname,
        lastname: form.lastname,
      },
    },
  })

  if (!error.value && data.value?.success) {
    showSuccessMessage("Spouse information updated successfully!")
  } else {
    message.value = data.value?.message || "Update failed."
  }
}
</script>
