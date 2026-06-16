<template>
    <div
        v-if="request && Object.keys(request).length > 0"
        class="w-full rounded-xl border p-5 shadow-sm transition-shadow"
        :class="cardClass"
    >
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-medium text-gray-500">{{ request.created_at }}</span>
                <span
                    v-if="statusLabel"
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    :class="statusBadgeClass"
                >
                    {{ statusLabel }}
                </span>
            </div>
            <span class="text-lg font-bold" :class="isDeactivated ? 'text-gray-400' : 'text-primary'">{{ request.price }}</span>
        </div>
        <p v-if="request.message" class="mt-4 text-sm leading-relaxed" :class="isDeactivated ? 'text-gray-400' : 'text-gray-600'">
            {{ request.message }}
        </p>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
            <div class="flex items-center gap-3">
                <span class="relative shrink-0">
                    <span
                        class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
                        :class="isDeactivated ? 'bg-gray-100 text-gray-400' : 'bg-primary/15 text-primary'"
                    >
                        {{ (request.user?.full_name || request.user?.first_name || '?')[0] }}
                    </span>
                    <span
                        v-if="request.user?.verified == 1"
                        class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white"
                    >
                        <i class="pi pi-verified text-blue-500"></i>
                    </span>
                </span>
                <div>
                    <p class="text-sm font-semibold" :class="isDeactivated ? 'text-gray-400' : 'text-gray-900'">
                        {{ request.user?.full_name ?? '—' }}
                    </p>
                    <p class="text-xs flex items-center gap-1" :class="isDeactivated ? 'text-gray-300' : 'text-gray-500'">
                        <i class="pi pi-star-fill text-amber-400 text-[10px]"></i>
                        {{ request.user?.comments_avg_score ?? 0 }} puan
                    </p>
                </div>
            </div>
            <div v-if="!isAccepted" class="flex items-center gap-2">
                <button
                    type="button"
                    :disabled="actionsDisabled"
                    class="rounded-xl border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                    :class="isDeactivated ? 'border-gray-200 text-gray-400' : ''"
                    @click="$emit('message-click', request)"
                >
                    Mesaj
                </button>
                <button
                    v-if="showAcceptButton"
                    type="button"
                    class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    :disabled="actionsDisabled || acceptLoading"
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
import { computed } from 'vue';

const props = defineProps({
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
    },
    /** İlan kabul edildi / yayında değil */
    shipmentInactive: {
        type: Boolean,
        default: false
    }
});

defineEmits(['message-click', 'accept-click']);

const requestStatus = computed(() => String(props.request?.status ?? '').toLowerCase());

const isAccepted = computed(() => requestStatus.value === 'accepted');

const isDeactivated = computed(() => {
    if (isAccepted.value) return false;
    if (requestStatus.value === 'rejected' || requestStatus.value === 'cancelled') return true;
    return props.shipmentInactive || props.messagingDisabled;
});

const actionsDisabled = computed(() => isDeactivated.value || props.messagingDisabled || props.acceptLoading);

const statusLabel = computed(() => {
    if (requestStatus.value === 'accepted') return 'Kabul edildi';
    if (requestStatus.value === 'rejected') return 'Devre dışı';
    if (requestStatus.value === 'cancelled') return 'İptal edildi';
    if (isDeactivated.value) return 'Devre dışı';
    return null;
});

const statusBadgeClass = computed(() => {
    if (requestStatus.value === 'accepted') return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
    if (isDeactivated.value) return 'bg-gray-100 text-gray-500 ring-1 ring-gray-200';
    return 'bg-primary/10 text-primary ring-1 ring-primary/20';
});

const cardClass = computed(() => {
    if (isAccepted.value) {
        return 'border-emerald-200 bg-emerald-50/40 hover:shadow-md';
    }
    if (isDeactivated.value) {
        return 'border-gray-200 bg-gray-50 opacity-75 hover:shadow-none';
    }
    return 'border-gray-200 bg-white hover:shadow-md';
});
</script>

<style scoped></style>
