<template>
    <!-- Mobile Sidebar -->
  <div
    v-if="show"
    class="fixed inset-0 z-40 flex lg:hidden"
  >
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black opacity-30" @click="emit('close')"></div>

    <!-- Sidebar content -->
    <nav
      class="relative w-64 bg-card dark:bg-dark.card p-4 transition-transform transform"
    >
      <div class="flex items-center justify-between mb-6">
        <span class="text-foreground dark:text-dark.foreground font-heading"
          >LOGO</span
        >
        <button
          class="text-xl"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>
      <div class="space-y-2">
        <NuxtLink
          to="/profile"
          :class="menuClass('/profile')"
          aria-label="Dashboard"
        >
          <span class="font-body">Basic Details</span>
        </NuxtLink>
        <NuxtLink
          to="/profile/additional"
          :class="menuClass('/profile/additional')"
          aria-label="Workout History"
        >
          <span class="font-body">Additional Details</span>
        </NuxtLink>
        <NuxtLink
          v-if="maritalStatus && maritalStatus === 'Married'"
          to="/profile/spouse"
          :class="menuClass('/profile/spouse')"
          aria-label="Spouse Details"
        >
          <span class="font-body">Spouse Details</span>
        </NuxtLink>
        <NuxtLink
          to="/profile/preferences"
          :class="menuClass('/profile/preferences')"
          aria-label="Class Booking"
        >
          <span class="font-body">Personal Preferences</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
  <nav
    class="lg:w-80 bg-card dark:bg-dark.card p-4 lg:h-screen hidden lg:block transition-all duration-300 ease-in-out"
  >
    <div class="hidden lg:flex items-center gap-2 mb-8">
      <span class="text-foreground dark:text-dark.foreground font-heading pl-[12px]"
        >LOGO</span
      >
    </div>
    <div class="space-y-2">
      <NuxtLink
        to="/profile"
        :class="menuClass('/profile')"
        aria-label="Dashboard"
      >
        <span class="font-medium ">Basic Details</span>
      </NuxtLink>

      <NuxtLink
        to="/profile/additional"
        :class="menuClass('/profile/additional')"
        aria-label="Workout History"
      >
        <span class="font-medium ">Additional Details</span>
      </NuxtLink>

      <NuxtLink
        v-if="maritalStatus && maritalStatus === 'Married'"
        to="/profile/spouse"
        :class="menuClass('/profile/spouse')"
        aria-label="Spouse Details"
      >
        <span class="font-medium">Spouse Details</span>
      </NuxtLink>

      <NuxtLink
        to="/profile/preferences"
        :class="menuClass('/profile/preferences')"
        aria-label="Class Booking"
      >
        <span class="font-medium">Personal Preferences</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
    const props = defineProps({
  show: Boolean,
});
const emit = defineEmits(["close"]);
    
const maritalStatus = ref("");

onMounted(() => {
  maritalStatus.value = localStorage.getItem("maritalStatus") || "";
  window.addEventListener("maritalStatusChanged", (e) => {
    maritalStatus.value = e.detail;
    localStorage.setItem("maritalStatus", e.detail);
  });
});

const route = useRoute();

// Function to return active class if route matches
const menuClass = (path) => {
  const baseClass =
    "w-full flex items-center gap-3 p-3 rounded-md transition-all duration-200 ease-in-out focus:outline-none text-gray-600";
const isActive = route.path === path || route.path === `${path}/edit`;

  return isActive
    ? `${baseClass} bg-primary text-white`
    : `${baseClass} text-foreground dark:text-dark.foreground hover:bg-primary hover:text-white dark:hover:bg-dark.secondary`;
};
</script>
