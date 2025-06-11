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
      <h1 class="text-2xl font-bold mb-6 text-gray-700">Additional Details</h1>
    </div>

    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block mb-1 font-medium text-gray-700">Home Address*</label>
        <input
          v-model="form.address"
          type="text"
          class="border p-2 w-full rounded  border-gray-500"
        />
        <p v-if="errors.address" class="text-red-500 text-sm mt-1">
          {{ errors.address }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-medium text-gray-700">Country*</label>
        <input
          v-model="form.country"
          type="text"
          class="border p-2 w-full rounded  border-gray-500"
        />

        <p v-if="errors.country" class="text-red-500 text-sm mt-1">
          {{ errors.country }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-medium text-gray-700">Postal Code*</label>
        <input
          v-model="form.postalCode"
          type="text"
          class="border p-2 w-full rounded  border-gray-500"
        />
        <p v-if="errors.postalCode" class="text-red-500 text-sm mt-1">
          {{ errors.postalCode }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-medium text-gray-700">Date of Birth</label>
        <input
          v-model="form.dob"
          type="date"
          class="border p-2 w-full rounded  border-gray-500"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-medium text-gray-700">Gender</label>
        <select v-model="form.gender" class="border p-2 w-full rounded  border-gray-500 text-gray-700">
          <option disabled value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-medium text-gray-700">Marital Status</label>
        <select v-model="form.maritalStatus" class="border p-2 w-full rounded  border-gray-500 text-gray-700">
          <option disabled value="">Select Status</option>
          <option>Single</option>
          <option>Married</option>
        </select>
      </div>

      <button
        class="bg-blue-600 text-white p-2  rounded hover:bg-blue-700"
      >
        Save Additional Info
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
  address: "",
  country: "",
  postalCode: "",
  dob: "",
  gender: "",
  maritalStatus: "",
});

const errors = reactive({
  address: "",
  country: "",
  postalCode: "",
});

const message = ref("");

onMounted(async () => {
  await nextTick();
  const { data } = await useFetch("/api/profile/get", {
    method: "POST",
    body: { email: currentUserEmail.value },
  });
  if (data.value) {
    Object.assign(form, {
      address: data.value.address || "",
      country: data.value.country || "",
      postalCode: data.value.postalCode || "",
      dob: data.value.dob || "",
      gender: data.value.gender || "",
      maritalStatus: data.value.maritalStatus || "",
    });
  }
});

const validate = () => {
  errors.address = form.address ? "" : "Home address is required.";
  errors.country = form.country ? "" : "Country is required.";
  errors.postalCode = form.postalCode ? "" : "Postal code is required.";

  return !errors.address && !errors.country && !errors.postalCode;
};
const showSuccessMessage = (text) => {
  message.value = text;
  setTimeout(() => {
    message.value = "";
  }, 1000);
};
const submit = async () => {
  if (!validate()) return;

  const { data, error } = await useFetch("/api/profile/additional", {
    method: "POST",
    body: { email: currentUserEmail.value, ...form },
  });

  if (!error.value && data.value?.success) {
    showSuccessMessage("Additional information updated successfully!");
    window.dispatchEvent(
      new CustomEvent("maritalStatusChanged", {
        detail: form.maritalStatus,
      })
    );
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
