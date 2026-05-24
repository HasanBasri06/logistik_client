<template>
    <div>
        <h1 class="text-xl font-bold text-gray-900">Ayarlar</h1>
        <p class="text-sm text-gray-500 mt-1 mb-8">
            Şifreni güncelle veya hesabını kapat.
        </p>

        <div class="flex flex-col sm:flex-row gap-4">
            <RouterLink
                :to="changePasswordPath"
                class="flex-1 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
                <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <i class="pi pi-key text-gray-700" style="font-size: 22px;"></i>
                </div>
                <div class="flex-1 min-w-0 text-left">
                    <h2 class="text-sm font-semibold text-gray-900">Şifre değiştir</h2>
                    <p class="text-xs text-gray-500 mt-0.5">E-posta kodu ile yeni şifre belirle</p>
                </div>
                <i class="pi pi-chevron-right text-gray-300 shrink-0" style="font-size: 14px;"></i>
            </RouterLink>

            <button
                type="button"
                class="flex-1 flex items-center gap-4 rounded-xl border border-red-200 bg-white p-5 hover:bg-red-50 transition-all text-left"
                @click="deleteModalOpen = true"
            >
                <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <i class="pi pi-trash text-red-600" style="font-size: 22px;"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h2 class="text-sm font-semibold text-red-700">Hesabı sil</h2>
                    <p class="text-xs text-red-600/80 mt-0.5">Hesabını pasife al ve oturumu kapat</p>
                </div>
                <i class="pi pi-chevron-right text-red-300 shrink-0" style="font-size: 14px;"></i>
            </button>
        </div>

        <Teleport to="body">
            <Transition name="fade">
                <div
                    v-if="deleteModalOpen"
                    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-account-title"
                    @click.self="closeDeleteModal"
                >
                    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200">
                        <h2 id="delete-account-title" class="text-lg font-semibold text-gray-900">
                            Hesabı silmek istediğine emin misin?
                        </h2>
                        <p class="text-sm text-gray-600 mt-2">
                            Hesabın pasife alınır; tekrar giriş için destek gerekebilir. Bu işlem geri alınamaz.
                        </p>
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                            <input
                                v-model="deletePassword"
                                type="password"
                                autocomplete="current-password"
                                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                placeholder="Hesap şifreniz"
                                :disabled="deleteLoading"
                            />
                            <p v-if="deletePasswordError" class="text-xs text-red-600 mt-1">{{ deletePasswordError }}</p>
                        </div>
                        <div class="flex flex-col-reverse sm:flex-row gap-3 mt-6 justify-end">
                            <button
                                type="button"
                                class="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                :disabled="deleteLoading"
                                @click="closeDeleteModal"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="button"
                                class="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                :disabled="deleteLoading"
                                @click="confirmDeleteAccount"
                            >
                                {{ deleteLoading ? 'İşleniyor…' : 'Evet, hesabımı sil' }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { toast } from 'vue-sonner';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';

defineProps({
    changePasswordPath: {
        type: String,
        required: true,
    },
});

const authStore = useAuthStore();

const deleteModalOpen = ref(false);
const deleteLoading = ref(false);
const deletePassword = ref('');
const deletePasswordError = ref('');

function closeDeleteModal() {
    if (deleteLoading.value) return;
    deleteModalOpen.value = false;
    deletePassword.value = '';
    deletePasswordError.value = '';
}

async function confirmDeleteAccount() {
    deletePasswordError.value = '';
    const pwd = String(deletePassword.value ?? '').trim();
    if (!pwd) {
        deletePasswordError.value = 'Şifrenizi girin.';
        return;
    }
    deleteLoading.value = true;
    try {
        const res = await api.post('/auth/delete', { password: pwd });
        const msg = res.data?.message || 'Hesabın pasife alındı.';
        toast.success(msg);
        deleteModalOpen.value = false;
        deletePassword.value = '';
        authStore.logout();
    } catch (err) {
        const data = err.response?.data;
        const errs = data?.error;
        const pw = errs?.password;
        const fieldMsg = Array.isArray(pw) ? pw[0] : pw;
        deletePasswordError.value = typeof fieldMsg === 'string' ? fieldMsg : '';
        const m = deletePasswordError.value || data?.message || 'İşlem tamamlanamadı.';
        toast.error(m);
    } finally {
        deleteLoading.value = false;
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
