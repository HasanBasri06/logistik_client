<template>
    <Header />
    <div class="h-[calc(100vh-64px)]">
        <Content>
            <div class="flex flex-row gap-3 w-full h-[calc(100vh-64px)]">
                <CargoOwner />
                <div class="bg-white mt-3 border border-gray-200 rounded-md flex flex-col overflow-y-auto p-6">
                    <h1 class="text-xl font-bold text-gray-900">Cüzdan</h1>
                    <p class="text-sm text-gray-500 mt-1">Bakiye ve işlemler burada listelenecek.</p>
                </div>
            </div>
        </Content>
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import CargoOwner from '@/components/CargoOwner.vue';
</script>
