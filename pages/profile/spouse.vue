<template>
  <div class="max-w-4xl mx-auto mt-10 p-6 relative">
    <div
      class="fixed top-0 left-0 h-full w-64 bg-white shadow transform transition-transform z-40"
      :class="{ '-translate-x-full': !drawerOpen, 'translate-x-0': drawerOpen }"
    >
      <div class="p-4 border-b font-bold text-lg">Menu</div>
      <nav class="p-4 space-y-2">
        <NuxtLink to="/profile/edit" class="block hover:underline text-blue-600"
          >Edit Profile</NuxtLink
        >
        <button
          @click="logout"
          class="text-left text-red-600 hover:underline w-full"
        >
          Logout
        </button>
      </nav>
    </div>

    <!-- Overlay -->
    <div
      v-if="drawerOpen"
      @click="drawerOpen = false"
      class="fixed inset-0 bg-gray-800 bg-opacity-20 z-30"
    ></div>
    <div class="flex items-center">
      <button @click="drawerOpen = !drawerOpen" class="absolute right-5 z-50">
        <svg
          class="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 class="text-2xl font-bold mb-6 text-gray-700">Spouse Details</h1>
    </div>

    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block mb-1 text-gray-700">Salutation</label>
        <select v-model="form.salutation" class="border p-2 w-full rounded text-gray-700">
          <option disabled value="">Select</option>
          <option>Mr.</option>
          <option>Ms.</option>
          <option>Mrs.</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-gray-700">First Name</label>
        <input
          v-model="form.firstname"
          type="text"
          class="border p-2 w-full rounded"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-gray-700">Last Name</label>
        <input
          v-model="form.lastname"
          type="text"
          class="border p-2 w-full rounded focus:border focus:border-gray-700"
        />
      </div>

      <button
        class="bg-blue-600 text-white p-2  rounded hover:bg-blue-700"
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
const drawerOpen = ref(false);
const router = useRouter();
const messageType = ref("");
const currentUserEmail = useCookie("currentUser");
const form = reactive({
  salutation: "",
  firstname: "",
  lastname: "",
});
const message = ref("");

onMounted(async () => {
  await nextTick();
  const { data } = await useFetch("/api/profile/get", {
    method: "POST",
    body: { email: currentUserEmail.value },
  });

  if (data.value?.spouse) {
    Object.assign(form, {
      salutation: data.value.spouse.salutation || "",
      firstname: data.value.spouse.firstname || "",
      lastname: data.value.spouse.lastname || "",
    });
  }
});

const showSuccessMessage = (text) => {
  message.value = text;
  setTimeout(() => {
    message.value = "";
  }, 1000);
};

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
  });

  if (!error.value && data.value?.success) {
    showSuccessMessage("Spouse information updated successfully!");
  } else {
    message.value = data.value?.message || "Update failed.";
  }
};
const logout = async () => {
  const { data, error } = await useFetch("/api/logout", {
    method: "POST",
  });

  if (error.value || !data.value?.success) {
    message.value = data.value?.message || "Logout failed. Please try again.";
    messageType.value = "error";
    return;
  }

  message.value = "Logout successful. Redirecting...";
  messageType.value = "success";

  setTimeout(() => {
    router.push("/login");
  }, 1000);
};
</script>
