<template>
    <router-link to="/cargo-owner"
        class="w-full h-auto rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-50 transition-colors cursor-pointer">
        <div class="flex flex-row gap-2 items-start">
            <div class="w-14 h-14 rounded-full overflow-hidden object-cover">
                <img :src="userImage" :alt="user.full_name" />
            </div>
            <div class="flex flex-col items-start gap-2">
                <div>
                    <h1 class="text-sm font-semibold">{{ user.full_name }}</h1>
                    <p class="text-xs text-gray-500">{{ user.email }}</p>
                </div>
                <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">{{ useStatusValue }}</span>
            </div>
        </div>
    </router-link>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';

const authStore = useAuthStore();
const {user} = storeToRefs(authStore);
const useStatusValue = ref(null);
const userImage = ref(null);

onMounted(() => {    
    switch (user.value.status) {
        case 'pending':
            useStatusValue.value = 'Beklemede';
            break;
        case 'active':
            useStatusValue.value = 'Aktif';
            break;
        case 'inactive':
            useStatusValue.value = 'Kapatıldı';
            break;
        default:
            break;
    }
});

onMounted(() => {
    if (user.value.image) {
        userImage.value = user.value.image;
    } else {
        userImage.value = 'https://ui-avatars.com/api/?name=' + user.value.full_name + '&background=39838C&color=fff';
    }
});

</script>

<style scoped></style>