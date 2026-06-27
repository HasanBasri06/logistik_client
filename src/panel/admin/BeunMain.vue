<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p v-if="adminStore.admin" class="mt-2 text-sm text-gray-600">
            Hoş geldiniz, {{ adminStore.admin.name }}
        </p>
        <p class="mt-4 text-sm text-gray-500">
            Üst menüden kullanıcı veya ilan ekleyebilirsiniz.
        </p>
    </div>
</template>

<script setup>
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
</script>
