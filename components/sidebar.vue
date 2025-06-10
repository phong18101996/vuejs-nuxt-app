<template>
    <nav
        class="lg:w-64 bg-card dark:bg-dark.card p-4 lg:h-screen hidden lg:block transition-all duration-300 ease-in-out">
        <div class="hidden lg:flex items-center gap-2 mb-8">
            <span class="text-foreground dark:text-dark.foreground font-heading">LOGO</span>
        </div>
        <div class="space-y-2">
            <NuxtLink to="/profile" :class="menuClass('/profile')" aria-label="Dashboard">
                <span class="font-body">Basic Details</span>
            </NuxtLink>

            <NuxtLink to="/profile/additional" :class="menuClass('/profile/additional')" aria-label="Workout History">
                <span class="font-body">Additional Details</span>
            </NuxtLink>

            <NuxtLink v-if="maritalStatus && maritalStatus === 'Married'" to="/profile/spouse" :class="menuClass('/profile/spouse')"
                aria-label="Spouse Details">
                <span class="font-body">Spouse Details</span>
            </NuxtLink>


            <NuxtLink to="/profile/preferences" :class="menuClass('/profile/preferences')" aria-label="Class Booking">
                <span class="font-body">Personal Preferences</span>
            </NuxtLink>
        </div>
    </nav>
</template>

<script setup>
    const maritalStatus = ref('')

    onMounted(() => {
        maritalStatus.value = localStorage.getItem('maritalStatus') || ''
    })

    window.addEventListener('maritalStatusChanged', (e) => {
        maritalStatus.value = e.detail
        localStorage.setItem('maritalStatus', e.detail)
    })

    const route = useRoute()
    

    // Function to return active class if route matches
    const menuClass = (path) => {
        const baseClass =
            'w-full flex items-center gap-3 p-3 rounded-md transition-all duration-200 ease-in-out focus:outline-none'
        const isActive = route.path === path

        return isActive
            ? `${baseClass} bg-primary text-white`
            : `${baseClass} text-foreground dark:text-dark.foreground hover:bg-primary hover:text-white dark:hover:bg-dark.secondary`
    }
</script>