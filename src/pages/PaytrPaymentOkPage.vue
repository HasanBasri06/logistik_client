<template>
    <div class="max-w-lg mx-auto px-4 py-16 text-center">
        <div class="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-6 py-8">
            <i class="pi pi-check-circle text-4xl text-emerald-600 mb-3"></i>
            <h1 class="text-xl font-bold text-gray-900">Ödeme işlemi tamamlandı</h1>
            <p class="text-sm text-gray-600 mt-2">
                Ödemeniz PayTR üzerinden alındı. Premium durumunuz kısa süre içinde güncellenecektir.
            </p>
            <RouterLink
                to="/panel"
                class="inline-flex mt-6 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90"
            >
                Panele dön
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(async () => {
    await authStore.checkToken();
});
</script>
