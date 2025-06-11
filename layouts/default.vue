<template>
  <div
    class="min-h-screen bg-background dark:bg-dark.background"
    id="div-116-194"
  >
    <div class="lg:flex" id="div-117-193">
      <div
        class="lg:hidden bg-card dark:bg-dark.card p-4 flex justify-between items-center"
        id="div-119-131"
      >
        <div class="flex items-center gap-2" id="div-120-123">
          <span class="text-foreground dark:text-dark.foreground font-heading"
        >LOGO</span
      >
        </div>
        <button
        @click="isMobile && (sidebarOpen = !sidebarOpen)"
          class="text-foreground dark:text-dark.foreground p-2 hover:bg-primary hover:text-white dark:hover:bg-dark.secondary rounded-md transition-all"
          aria-label="Toggle mobile menu"
          id="button-124-130"
        >
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="0"
            viewBox="0 0 15 15"
            id="RxHamburgerMenu-129-129"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </div>
      <!-- nav sidebar -->
       
       <Sidebar v-if="isMobile" :show="sidebarOpen" @close="sidebarOpen = false" />
      <Sidebar v-else />



      <main class="flex-1 p-4" id="main-185-192">
        <div class="max-w-5xl mx-auto mx-auto" id="div-186-191">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
<script setup>
const sidebarOpen = ref(false)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 992
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
watch(isMobile, (value) => {
  if (!value) sidebarOpen.value = false
})
</script>


