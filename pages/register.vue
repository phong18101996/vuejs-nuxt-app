<template>
  <div class="register-page max-w-lg mx-auto mt-10 p-6">
    <h1 class="text-2xl font-bold mb-4 text-center text-gray-700">Register</h1>

    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block mb-1 text-gray-700 font-medium">Salutation*</label>
        <select
          v-model="form.salutation"
          required
          class="border border-gray-500 text-gray-700 p-2 w-full rounded focus:border-gray-600 focus-visible:border-gray-600 outline-none"
        >
          <option value="" disabled>Select Salutation</option>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-gray-700 font-medium">First Name*</label>
        <input
          v-model="form.firstname"
          type="text"
          required
          class="border border-gray-500 p-2 w-full rounded focus:border-gray-600 focus-visible:border-gray-600 outline-none"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-gray-700 font-medium">Last Name*</label>
        <input
          v-model="form.lastname"
          type="text"
          required
          class="border border-gray-500 p-2 w-full rounded focus:border-gray-600 focus-visible:border-gray-600 outline-none"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-gray-700 font-medium">Email*</label>
        <input
          v-model="form.email"
          type="email"
          required
          class="border border-gray-500 p-2 w-full rounded focus:border-gray-600 focus-visible:border-gray-600 outline-none"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-gray-700 font-medium">Password*</label>
        <input
          v-model="form.password"
          type="password"
          required
          class="border border-gray-500 p-2 w-full rounded focus:border-gray-600 focus-visible:border-gray-600 outline-none"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-gray-700 font-medium"
          >Confirm Password*</label
        >
        <input
          v-model="form.confirmPassword"
          type="password"
          required
          class="border border-gray-500 p-2 w-full rounded focus:border-gray-600 focus-visible:border-gray-600 outline-none"
        />
      </div>
      <p v-if="errorMessage" class="text-red-500 text-sm mb-4">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="text-green-600 text-md mb-4 text-center">
        {{ successMessage }}
      </p>

      <button
        type="submit"
        class="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700"
      >
        Register
      </button>
      <div class="flex items-center mt-5 justify-center text-gray-700">
        <span>You have an account, go to</span>
        <NuxtLink to="/login" class="text-blue-600 hover:underline ml-2">
          login here.
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({ layout: false });
const router = useRouter();

const form = reactive({
  salutation: "",
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errorMessage = ref("");
const successMessage = ref("");

const submit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  const { data, error } = await useFetch("/api/register", {
    method: "POST",
    body: { ...form },
  });

  if (error.value) {
    errorMessage.value = "Something went wrong. Please try again.";
    return;
  }

  if (!data.value.success) {
    errorMessage.value = data.value.message;
    return;
  }

  successMessage.value = "Registration successful!";
  // useCookie('currentUser').value = form.email
  setTimeout(() => router.push("/login"), 1000);
};
</script>
