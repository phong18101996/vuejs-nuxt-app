<template>
  <div class="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
    <h1 class="text-2xl font-bold mb-6">Additional Details</h1>

    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block mb-1">Home Address*</label>
        <input
          v-model="form.address"
          type="text"
          class="border [' p-2 w-full rounded', errors.address ? 'border-red-500' : 'border-gray-300']"
        />
        <p v-if="errors.address" class="text-red-500 text-sm mt-1">
          {{ errors.address }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block mb-1">Country*</label>
        <input
          v-model="form.country" type="text"
          :class="[
            'border p-2 w-full rounded',
            errors.country ? 'border-red-500' : 'border-gray-300',
          ]"
        />

        <p v-if="errors.country" class="text-red-500 text-sm mt-1">
          {{ errors.country }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block mb-1">Postal Code*</label>
        <input
          v-model="form.postalCode"
          type="text"
          class="border p-2 w-full rounded"
        />
        <p v-if="errors.postalCode" class="text-red-500 text-sm mt-1">
          {{ errors.postalCode }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block mb-1">Date of Birth</label>
        <input
          v-model="form.dob"
          type="date"
          class="border p-2 w-full rounded"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Gender</label>
        <select v-model="form.gender" class="border p-2 w-full rounded">
          <option disabled value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block mb-1">Marital Status</label>
        <select v-model="form.maritalStatus" class="border p-2 w-full rounded">
          <option disabled value="">Select Status</option>
          <option>Single</option>
          <option>Married</option>
        </select>
      </div>

      <button
        class="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700"
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
const currentUserEmail = useCookie("currentUser");
{
  /* const router = useRouter() */
}

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
    window.dispatchEvent(new CustomEvent('maritalStatusChanged', {
    detail: form.maritalStatus
  }));

  } else {
    message.value = data.value?.message || "Update failed.";
  }
};

</script>
