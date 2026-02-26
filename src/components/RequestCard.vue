<template>
    <div class="w-full h-auto bg-white border border-gray-200 rounded-lg" v-if="request && Object.keys(request).length > 0">
        <div class="w-full h-10 bg-gray-900 rounded-t-lg flex justify-between items-center px-4 text-white text-sm">
            <div>{{ request.created_at }}</div>
            <div>{{ request.price }}</div>
        </div>
        <div class="p-4 text-sm text-gray-600">
            {{ request.message }}
        </div>
        <div class="flex items-center justify-between px-4 pb-4 mt-2 border-t border-gray-200 py-3">
            <div class="flex items-center gap-2">
                <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-gray-900">{{ request.user.full_name }}</span>
                    <span class="text-xs text-gray-500">Puan: {{ request.user.comments_avg_score }} <i class="pi pi-star text-yellow-500"></i></span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button
                    type="button"
                    class="text-primary bg-transparent border border-primary cursor-pointer px-4 py-2 rounded-lg text-sm"
                    @click="$emit('message-click', request)"
                >Mesaj Gönder</button>
                <button class="bg-primary text-white px-4 py-2 cursor-pointer rounded-lg text-sm">Hemen Al</button>
            </div>
        </div>
    </div>
    <div v-else class="text-gray-500 py-2">Henüz teklif verilmemiş</div>
</template>

<script setup>
defineProps({
    request: {
        type: Object,
        default: () => ({})
    }
});
</script>

<style scoped></style>