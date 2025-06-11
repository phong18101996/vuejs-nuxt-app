<template>
  <div class="max-w-4xl mx-auto mt-0 p-6 relative">
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
      <h1 class="text-2xl font-bold mb-6 text-gray-700">Personal Preferences</h1>
    </div>

    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block mb-1 font-medium text-gray-700">Hobbies and interests</label>
        <input
          v-model="form.hobbies"
          type="text"
          class="border p-2 w-full rounded  border-gray-500"
        />
        <p v-if="errors.hobbies" class="text-red-500 text-sm mt-1">
          {{ errors.hobbies }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-medium text-gray-700"> Favorite sport(s)</label>
        <input
          v-model="form.favorite"
          type="text"
          class="border p-2 w-full rounded  border-gray-500"
        />

        <p v-if="errors.favorite" class="text-red-500 text-sm mt-1">
          {{ errors.favorite }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-medium text-gray-700">Preferred music genre(s)</label>
        <input
          v-model="form.music"
          type="text"
          class="border p-2 w-full rounded  border-gray-500"
        />
        <p v-if="errors.music" class="text-red-500 text-sm mt-1">
          {{ errors.music }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-medium text-gray-700">Preferred movie/TV show(s)</label>
        <input
          v-model="form.movie"
          type="text"
          class="border p-2 w-full rounded  border-gray-500"
        />
      </div>
      <button
        class="bg-blue-600 text-white p-2  rounded hover:bg-blue-700"
      >
        Personal Preferences
      </button>

      <p v-if="message" class="mt-4 text-green-600 text-md text-center">
        {{ message }}
      </p>
    </form>
  </div>
</template>

<script setup>
const message = ref(""); 
const messageType = ref("");
const router = useRouter();
const drawerOpen = ref(false);
const currentUserEmail = useCookie("currentUser");

const form = reactive({
  hobbies: "",
  favorite: "",
  music: "",
  movie: "",
});

const errors = reactive({
  hobbies: "",
  favorite: "",
  music: "",
  movie: "",
});


onMounted(async () => {
  await nextTick();
  const { data } = await useFetch("/api/profile/get", {
    method: "POST",
    body: { email: currentUserEmail.value },
  });
  if (data.value) {
    Object.assign(form, {
      hobbies: data.value.hobbies || "",
      favorite: data.value.favorite || "",
      music: data.value.music || "",
      movie: data.value.movie || "",
    });
  }
});

const validate = () => {
  errors.hobbies = form.hobbies ? "" : "hobbies is required.";
  errors.favorite = form.favorite ? "" : "favourite is required.";
  errors.music = form.music ? "" : "music is required.";

  return !errors.hobbies && !errors.favorite && !errors.music;
};
const showSuccessMessage = (text) => {
  message.value = text;
  setTimeout(() => {
    message.value = "";
  }, 1000);
};
const submit = async () => {
  if (!validate()) return;

  const { data, error } = await useFetch("/api/profile/preferences", {
    method: "POST",
    body: { email: currentUserEmail.value, ...form },
  });

  if (!error.value && data.value?.success) {
    showSuccessMessage("Preferences updated successfully!");
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
