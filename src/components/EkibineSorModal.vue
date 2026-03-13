<template>
    <Teleport to="body">
        <div
            v-if="open"
            class="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
            @click.self="close"
        >
            <div class="w-full max-w-md rounded-xl bg-white shadow-xl">
                <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <h3 class="text-lg font-semibold text-gray-900">TaşıBul Ekibine Sor</h3>
                    <button
                        type="button"
                        class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        @click="close"
                    >
                        <i class="pi pi-times"></i>
                    </button>
                </div>
                <form class="p-5 space-y-4" @submit.prevent="submit">
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">Konu</label>
                        <input
                            v-model="form.konu"
                            type="text"
                            placeholder="Konu girin"
                            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            :disabled="loading"
                        />
                        <p v-if="errors.konu" class="mt-1 text-xs text-red-500">{{ errors.konu }}</p>
                    </div>
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">İçerik</label>
                        <textarea
                            v-model="form.icerik"
                            rows="4"
                            placeholder="Mesajınızı yazın..."
                            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            :disabled="loading"
                        />
                        <p v-if="errors.icerik" class="mt-1 text-xs text-red-500">{{ errors.icerik }}</p>
                    </div>
                    <div class="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            @click="close"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            :disabled="loading"
                            class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            <span v-if="loading" class="inline-flex items-center gap-2">
                                <i class="pi pi-spin pi-spinner"></i>
                                Gönderiliyor...
                            </span>
                            <span v-else>Gönder</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import api from '@/api';
import { toast } from 'vue-sonner';

const props = defineProps({
    open: { type: Boolean, default: false },
});

const emit = defineEmits(['update:open', 'close']);

const form = ref({ konu: '', icerik: '' });
const errors = ref({ konu: '', icerik: '' });
const loading = ref(false);

function close() {
    emit('update:open', false);
    emit('close');
}

watch(() => props.open, (isOpen) => {
    if (!isOpen) {
        form.value = { konu: '', icerik: '' };
        errors.value = { konu: '', icerik: '' };
    }
});

async function submit() {
    errors.value = { konu: '', icerik: '' };
    const konu = (form.value.konu || '').trim();
    const icerik = (form.value.icerik || '').trim();
    if (!konu) errors.value.konu = 'Konu zorunludur.';
    if (!icerik) errors.value.icerik = 'İçerik zorunludur.';
    if (errors.value.konu || errors.value.icerik) return;

    loading.value = true;
    try {
        await api.post('/contact', { konu, icerik });
        toast.success('Mesajınız gönderildi.', { description: 'En kısa sürede size dönüş yapacağız.' });
        close();
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || 'Gönderilemedi.';
        toast.error('Hata', { description: msg });
        const errs = err.response?.data?.errors || err.response?.data?.content?.errors;
        if (errs) {
            if (errs.konu) errors.value.konu = Array.isArray(errs.konu) ? errs.konu[0] : errs.konu;
            if (errs.icerik) errors.value.icerik = Array.isArray(errs.icerik) ? errs.icerik[0] : errs.icerik;
        }
    } finally {
        loading.value = false;
    }
}
</script>
