<template>
    <div
        v-if="request && Object.keys(request).length > 0"
        class="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <span class="text-xs font-medium text-gray-500">{{ request.created_at }}</span>
            <span class="text-lg font-bold text-primary">{{ request.price }}</span>
        </div>
        <p v-if="request.message" class="mt-4 text-sm text-gray-600 leading-relaxed">
            {{ request.message }}
        </p>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
            <div class="flex items-center gap-3">
                <span
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
                >
                    {{ (request.user?.full_name || request.user?.first_name || '?')[0] }}
                </span>
                <div>
                    <p class="text-sm font-semibold text-gray-900">{{ request.user?.full_name ?? '—' }}</p>
                    <p class="text-xs text-gray-500 flex items-center gap-1">
                        <i class="pi pi-star-fill text-amber-400 text-[10px]"></i>
                        {{ request.user?.comments_avg_score ?? 0 }} puan
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button
                    type="button"
                    :disabled="messagingDisabled"
                    class="rounded-xl border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                    @click="$emit('message-click', request)"
                >
                    Mesaj
                </button>
                <button
                    v-if="showAcceptButton && request.status !== 'accepted'"
                    type="button"
                    class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    :disabled="acceptLoading"
                    @click="$emit('accept-click', request)"
                >
                    {{ acceptLoading ? 'İşleniyor...' : 'Hemen Al' }}
                </button>
            </div>
        </div>
    </div>
    <div v-else class="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
        Henüz teklif verilmemiş
    </div>
</template>

<script setup>
defineProps({
    request: {
        type: Object,
        default: () => ({})
    },
    /** İlan sahibi: teklifi kabul (Hemen Al) */
    showAcceptButton: {
        type: Boolean,
        default: false
    },
    acceptLoading: {
        type: Boolean,
        default: false
    },
    /** İlan active değilken Mesaj kapalı */
    messagingDisabled: {
        type: Boolean,
        default: false
    }
});

defineEmits(['message-click', 'accept-click']);
</script>

<style scoped></style>