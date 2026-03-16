<template>
    <Header />
    <div class="h-[calc(100vh-64px)]">
        <div class="w-full max-w-[1400px] mx-auto px-4 md:px-6">
            <div class="flex flex-row gap-3 w-full h-[calc(100vh-64px)]">
                <CargoOwner />
                <div class="flex-1 min-w-0 bg-white mt-3 border border-gray-200 rounded-md flex flex-col overflow-y-auto p-6">
                    <h1 class="text-xl font-bold text-gray-900">Cüzdan</h1>
                    <p class="text-sm text-gray-500 mt-1">Bakiye ve işlemler burada listelenecek.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import CargoOwner from '@/components/CargoOwner.vue';
</script>
