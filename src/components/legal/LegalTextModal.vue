<template>
    <Teleport to="body">
        <Transition name="legal-modal">
            <div
                v-if="modelValue"
                class="fixed inset-0 z-[120] flex h-full w-full min-h-0 flex-col p-0 sm:items-center sm:justify-center sm:p-6 sm:overflow-y-auto"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="titleId"
            >
                <div class="absolute inset-0 bg-black/50" aria-hidden="true" @click="close" />
                <div
                    class="relative z-10 flex h-full min-h-0 w-full flex-col overflow-hidden bg-gray-50 max-sm:max-h-[100dvh] sm:my-auto sm:max-h-[min(88vh,820px)] sm:w-full sm:max-w-3xl sm:rounded-2xl sm:border sm:border-gray-200/80 sm:shadow-2xl"
                    @click.stop
                >
                    <div
                        class="flex shrink-0 items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] sm:gap-3 sm:px-5 sm:py-3 sm:pt-3"
                    >
                        <h2 :id="titleId" class="min-w-0 flex-1 text-base font-bold text-gray-900 sm:text-lg truncate pr-1">
                            {{ modalTitle }}
                        </h2>
                        <button
                            type="button"
                            class="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 touch-manipulation"
                            aria-label="Kapat"
                            @click="close"
                        >
                            <i class="pi pi-times text-xl leading-none" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3 sm:px-4 sm:pb-4">
                        <UyelikSozlesmesiArticle v-if="modelValue === 'uyelik'" hide-hero hide-back-link />
                        <KvkkArticle v-else-if="modelValue === 'kvkk'" hide-hero hide-back-link />
                    </div>
                    <div
                        class="shrink-0 border-t border-gray-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5 sm:pb-3"
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
