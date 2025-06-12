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
      <h1 class="text-2xl font-bold mb-6">Update Profile</h1>
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

    <!-- Drawer -->
    <!-- Avatar Upload -->
    <div class="avatar w-[64px] h-[64px] relative group mb-6 flex items-center w-full">
      <img
        :src="previewUrl || '/uploads/avatar-default.svg'"
        alt="Avatar"
        class="w-[64px] h-[64px] rounded-full object-cover"
      />
      <input
        type="file"
        accept="image/*"
        @change="handleFileChange"
        class="absolute inset-0 opacity-0 cursor-pointer"
        title="Change avatar"
      />
      <p class="text-[12px] font-extralight ml-4 text-gray-700">Click on image to upload</p>
    </div>

    <form @submit.prevent="updateProfile">
      <div class="mb-4">
        <label class="block mb-1 text-gray-700">Salutation</label>
        <select v-model="form.salutation" class="text-gray-700 border p-2 w-full rounded border-gray-500 focus:border-gray-600 focus-visible:border-gray-600 outline-none">
          <option value="">Select</option>
          <option value="Mr">Mr.</option>
          <option value="Ms">Ms.</option>
          <option value="Mrs">Mrs.</option>
          <option value="Dr">Dr.</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-gray-700">First Name</label>
        <input
          v-model="form.firstname"
          type="text"
          class="text-gray-700 border p-2 w-full rounded border-gray-500 focus:border-gray-600 focus-visible:border-gray-600 outline-none"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-gray-700">Last Name</label>
        <input
          v-model="form.lastname"
          type="text"
          class="text-gray-700 border p-2 w-full rounded border-gray-500 focus:border-gray-600 focus-visible:border-gray-600 outline-none"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-gray-700">Email address</label>
        <input
          v-model="form.email"
          type="email"
          class="text-gray-700 border p-2 w-full rounded border-gray-500 focus:border-gray-600 focus-visible:border-gray-600 outline-none"
        />
      </div>

      <p v-if="message" class="text-sm text-red-500 mb-2">{{ message }}</p>

      <button
        class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </form>
  </div>
</template>

<script setup>
const router = useRouter();
const currentUserEmail = useCookie("currentUser");
const message = ref("");
const messageType = ref("");
const drawerOpen = ref(false);


const form = reactive({
  salutation: "",
  firstname: "",
  lastname: "",
  email: "",
  avatar_url: "",
});

// Load current user data
onMounted(async () => {
  await nextTick();
  const { data, error } = await useFetch("/api/profile", {
    method: "GET",
    params: { email: currentUserEmail.value },
  });

  if (error.value || !data.value?.user) {
    message.value = "Failed to load user data.";
    return;
  }

  form.salutation = data.value.user.salutation;
  form.firstname = data.value.user.firstname;
  form.lastname = data.value.user.lastname;
  form.email = data.value.user.email;
  form.avatar_url = data.value.user.avatar_url || "";
  previewUrl.value = data.value.user.avatar_url || "";

  if (data.value.user.avatar_url) {
    previewUrl.value = data.value.user.avatar_url;
  }
});

// Update profile
const updateProfile = async () => {
  const { data, error } = await useFetch("/api/profile", {
    method: "PUT",
    body: {
      email: currentUserEmail.value,
      ...form,
    },
  });

  if (error.value || !data.value.success) {
    message.value = data.value?.message || "Failed to update profile.";
    return;
  }

  message.value = "";
  router.push("/profile");
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
{
  /* upload avatar */
}
const selectedFile = ref(null);
const previewUrl = ref("");

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
  uploadAvatar(file);
};

const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data, error } = await useFetch("/api/profile/avatar", {
    method: "POST",
    body: formData,
  });

  if (error.value || !data.value?.success) {
    message.value = data.value?.message || "Upload failed.";
  } else {
    if (data.value.avatar_url) {
      previewUrl.value = data.value.avatar_url;
      // form.avatar_url = data.value.avatar_url;
    }
  }
};
</script>
