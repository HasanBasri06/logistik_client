<template>
    <Teleport to="body">
        <Transition name="legal-modal">
            <div
                v-if="modelValue"
                class="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="titleId"
            >
                <div class="absolute inset-0 bg-black/50" aria-hidden="true" @click="close" />
                <div
                    class="relative z-10 flex max-h-[min(88vh,820px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-2xl border border-gray-200/80"
                    @click.stop
                >
                    <div class="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-5">
                        <h2 :id="titleId" class="text-base sm:text-lg font-bold text-gray-900 pr-2 truncate">
                            {{ modalTitle }}
                        </h2>
                        <button
                            type="button"
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                            aria-label="Kapat"
                            @click="close"
                        >
                            <i class="pi pi-times text-lg"></i>
                        </button>
                    </div>
                    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3 sm:px-4 sm:pb-4">
                        <UyelikSozlesmesiArticle v-if="modelValue === 'uyelik'" hide-hero hide-back-link />
                        <KvkkArticle v-else-if="modelValue === 'kvkk'" hide-hero hide-back-link />
                    </div>
                    <div
                        class="shrink-0 border-t border-gray-200 bg-white px-4 py-3 sm:px-5"
                    >
                        <button
                            type="button"
                            class="w-full sm:w-auto min-w-[200px] rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            @click="confirmRead"
                        >
                            Okudum, onaylıyorum
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import UyelikSozlesmesiArticle from '@/components/legal/UyelikSozlesmesiArticle.vue';
import KvkkArticle from '@/components/legal/KvkkArticle.vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: null,
        validator: (v) => v === null || v === 'uyelik' || v === 'kvkk',
    },
    /** Metin hangi formdan açıldı: giriş (true) veya kayıt (false) */
    isLogin: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const titleId = 'legal-text-modal-title';

const modalTitle = computed(() => {
    if (props.modelValue === 'kvkk') return 'KVKK Aydınlatma Metni';
    return 'Üyelik Sözleşmesi';
});

function close() {
    emit('update:modelValue', null);
}

function confirmRead() {
    if (!props.modelValue) return;
    emit('confirm', {
        doc: props.modelValue,
        isLogin: props.isLogin,
    });
    close();
}
</script>

<style scoped>
.legal-modal-enter-active,
.legal-modal-leave-active {
    transition: opacity 0.2s ease;
}
.legal-modal-enter-active .relative,
.legal-modal-leave-active .relative {
    transition: transform 0.2s ease, opacity 0.2s ease;
}
.legal-modal-enter-from,
.legal-modal-leave-to {
    opacity: 0;
}
.legal-modal-enter-from .relative,
.legal-modal-leave-to .relative {
    transform: scale(0.98);
    opacity: 0;
}
</style>
