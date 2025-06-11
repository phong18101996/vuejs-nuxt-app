<template>
  <div class="max-w-4xl flex items-center justify-center relative w-full">
    <div class="avatar w-[64px] h-[64px] relative group">
      <img
        :src="previewUrl || '/uploads/avatar-default.svg'"
        alt="Avatar"
        class="w-full h-full rounded-full object-cover"
      />
    </div>

    <!-- Drawer -->
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

    <!-- Profile content -->
    <div class="profile-page w-full mt-0 p-6 relative">
      <div class="flex items-center">
        <h1 class="text-2xl font-bold mb-6 text-gray-700">My Profile</h1>
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
      </div>

      <p
        v-if="message"
        :class="[
          'mb-4 text-sm font-medium',
          messageType === 'error' ? 'text-red-600' : 'text-green-600',
        ]"
      >
        {{ message }}
      </p>

      <p v-if="loading">Loading profile...</p>
      <template v-else-if="user">
        <p class="mb-2 font-medium"><strong class="text-gray-800">Salutation:</strong> {{ user.salutation }}</p>
        <p class="mb-2 font-medium"><strong class="text-gray-800">First Name:</strong> {{ user.firstname }}</p>
        <p class="mb-2 font-medium"><strong class="text-gray-800">Last Name:</strong> {{ user.lastname }}</p>
        <p class="mb-4 font-medium"><strong class="text-gray-800">Email Address:</strong> {{ user.email }}</p>
      </template>
      <p v-else class="text-red-600">User not found or not logged in.</p>
    </div>
  </div>
</template>

<script setup>
const message = ref("");
const messageType = ref("");
const user = ref(null);
const loading = ref(true);
const drawerOpen = ref(false);
const router = useRouter();
const previewUrl = ref("");


onMounted(async () => {
  await nextTick();
  const { data, error } = await useFetch("/api/user");

  if (error.value || !data.value?.success) {
    user.value = null;
  } else {
    user.value = data.value.user;
  }

  if (user.value && user.value.avatar_url) {
    previewUrl.value = user.value.avatar_url;
  }
  loading.value = false;
});

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
