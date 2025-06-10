<template>
  <div class="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
    <h1 class="text-2xl font-bold mb-6">Personal Preferences</h1>

    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block mb-1">Hobbies and interests</label>
        <input
          v-model="form.hobbies"
          type="text"
          class="border [' p-2 w-full rounded', errors.hobbies ? 'border-red-500' : 'border-gray-300']"
        />
        <p v-if="errors.hobbies" class="text-red-500 text-sm mt-1">
          {{ errors.hobbies }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block mb-1"> Favorite sport(s)</label>
        <input
          v-model="form.favorite" type="text"
          :class="[
            'border p-2 w-full rounded',
            errors.favorite ? 'border-red-500' : 'border-gray-300',
          ]"
        />

        <p v-if="errors.favorite" class="text-red-500 text-sm mt-1">
          {{ errors.favorite }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block mb-1">Preferred music genre(s)</label>
        <input
          v-model="form.music"
          type="text"
          class="border p-2 w-full rounded"
        />
        <p v-if="errors.music" class="text-red-500 text-sm mt-1">
          {{ errors.music }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block mb-1">Preferred movie/TV show(s)</label>
        <input
          v-model="form.movie"
          type="text"
          class="border p-2 w-full rounded"
        />
      </div>
      <button
        class="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700"
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
const currentUserEmail = useCookie("currentUser");
{
  /* const router = useRouter() */
}

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

const message = ref("");

onMounted(async () => {
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

</script>
