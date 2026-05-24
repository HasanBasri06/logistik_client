<template>
    <div class="flex flex-col h-full overflow-y-auto">
        <div class="flex flex-col gap-1 mb-8">
            <div class="flex items-center gap-3">
                <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <i class="pi pi-lock text-xl"></i>
                </span>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">Şifre Değiştir</h2>
                    <p class="text-sm text-gray-500 mt-0.5">
                        Yeni şifreni belirle; güncelle dediğinde e-postana gelen kodu girmen istenecek.
                    </p>
                </div>
            </div>
        </div>

        <form @submit.prevent="openVerifyModal" class="flex flex-col gap-6 max-w-md">
            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-gray-700">Yeni Şifre</label>
                <div class="relative">
                    <input
                        :type="showNew ? 'text' : 'password'"
                        v-model="passwordForm.newPassword"
                        :class="[
                            'w-full h-12 px-4 pl-12 pr-12 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                            passwordErrors.newPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                        ]"
                        placeholder="En az 6 karakter"
                        :disabled="loading"
                    />
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <i class="pi pi-key text-base"></i>
                    </span>
                    <button
                        type="button"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        @click="showNew = !showNew"
                        :aria-label="showNew ? 'Gizle' : 'Göster'"
                    >
                        <i :class="showNew ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-lg"></i>
                    </button>
                </div>
                <p class="text-xs text-gray-500">En az 6 karakter olmalıdır.</p>
                <span v-if="passwordErrors.newPassword" class="text-xs text-red-500 flex items-center gap-1">
                    <i class="pi pi-exclamation-circle text-[10px]"></i>
                    {{ passwordErrors.newPassword }}
                </span>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-gray-700">Yeni Şifre (Tekrar)</label>
                <div class="relative">
                    <input
                        :type="showConfirm ? 'text' : 'password'"
                        v-model="passwordForm.confirmPassword"
                        :class="[
                            'w-full h-12 px-4 pl-12 pr-12 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                            passwordErrors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                        ]"
                        placeholder="Yeni şifrenizi tekrar girin"
                        :disabled="loading"
                    />
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <i class="pi pi-key text-base"></i>
                    </span>
                    <button
                        type="button"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        @click="showConfirm = !showConfirm"
                        :aria-label="showConfirm ? 'Gizle' : 'Göster'"
                    >
                        <i :class="showConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-lg"></i>
                    </button>
                </div>
                <span v-if="passwordErrors.confirmPassword" class="text-xs text-red-500 flex items-center gap-1">
                    <i class="pi pi-exclamation-circle text-[10px]"></i>
                    {{ passwordErrors.confirmPassword }}
                </span>
            </div>

            <div class="pt-2">
                <button
                    type="submit"
                    :disabled="loading"
                    :class="[
                        'w-full h-12 rounded-xl font-semibold text-white shadow-lg transition-all duration-200',
                        loading
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5'
                    ]"
                >
                    <span v-if="loading" class="inline-flex items-center gap-2">
                        <i class="pi pi-spin pi-spinner"></i>
                        Güncelleniyor...
                    </span>
                    <span v-else>Şifreyi Güncelle</span>
                </button>
            </div>
        </form>

        <Teleport to="body">
            <Transition name="fade">
                <div
                    v-if="verifyModalOpen"
                    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="pwd-verify-title"
                    @click.self="closeVerifyModal"
                >
                    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200">
                        <h2 id="pwd-verify-title" class="text-lg font-semibold text-gray-900">
                            E-posta ile doğrulama
                        </h2>
                        <p class="text-sm text-gray-600 mt-2">
                            Kayıtlı e-posta adresine 6 haneli kod gönderdik. Kodu girerek şifre güncellemesini tamamla.
                        </p>
                        <p v-if="emailMasked" class="text-xs text-gray-500 mt-2">
                            Kod <strong>{{ emailMasked }}</strong> adresine gönderildi.
                        </p>
                        <p v-if="modalSendError" class="text-xs text-red-600 mt-2">{{ modalSendError }}</p>

                        <div class="mt-5 flex flex-col gap-2">
                            <label class="text-sm font-semibold text-gray-700">Doğrulama kodu</label>
                            <InputOtp
                                v-model="modalOtp"
                                :length="6"
                                :integerOnly="true"
                                :disabled="loading"
                                :invalid="!!modalOtpError"
                                :unstyled="true"
                                :pt="{
                                    root: { class: 'flex gap-2 flex-1 flex-wrap justify-center' },
                                    pcInputText: {
                                        root: {
                                            class: modalOtpError
                                                ? 'w-11 h-12 sm:w-12 sm:h-14 rounded-md text-lg text-center tracking-[0.35em] font-semibold border border-red-400 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-red-200'
                                                : 'w-11 h-12 sm:w-12 sm:h-14 rounded-md text-lg text-center tracking-[0.35em] font-semibold border border-gray-200 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-primary/20'
                                        }
                                    }
                                }"
                            />
                            <span v-if="modalOtpError" class="text-xs text-red-500">{{ modalOtpError }}</span>
                        </div>

                        <div class="flex justify-end mt-2">
                            <button
                                type="button"
                                class="text-sm font-medium text-primary hover:underline disabled:opacity-50 disabled:pointer-events-none"
                                :disabled="codeSending"
                                @click="sendCode"
                            >
                                <span v-if="codeSending" class="inline-flex items-center gap-1">
                                    <i class="pi pi-spin pi-spinner text-xs"></i>
                                    Gönderiliyor...
                                </span>
                                <span v-else>{{ codeSent ? 'Kodu tekrar gönder' : 'Kodu gönder' }}</span>
                            </button>
                        </div>

                        <div class="flex flex-col-reverse sm:flex-row gap-3 mt-6 justify-end">
                            <button
                                type="button"
                                class="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                :disabled="loading"
                                @click="closeVerifyModal"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="button"
                                class="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
                                :disabled="loading || !codeSent"
                                @click="submitPasswordWithOtp"
                            >
                                {{ loading ? 'Güncelleniyor…' : 'Kodu doğrula ve şifreyi güncelle' }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import * as yup from 'yup';
import api from '@/api';
import { toast } from 'vue-sonner';
import { InputOtp } from 'primevue';

const passwordForm = ref({
    newPassword: '',
    confirmPassword: '',
});

const passwordErrors = ref({
    newPassword: '',
    confirmPassword: '',
});

const showNew = ref(false);
const showConfirm = ref(false);
const loading = ref(false);
const codeSending = ref(false);
const codeSent = ref(false);
const emailMasked = ref('');

const verifyModalOpen = ref(false);
const modalOtp = ref('');
const modalOtpError = ref('');
const modalSendError = ref('');
const pendingPasswords = ref({ newPassword: '', confirmPassword: '' });

const passwordOnlySchema = yup.object({
    newPassword: yup
        .string()
        .min(6, 'Yeni şifre en az 6 karakter olmalıdır.')
        .required('Yeni şifre zorunludur.'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Şifreler eşleşmiyor.')
        .required('Şifre tekrar zorunludur.'),
});

const otpSchema = yup.object({
    code: yup
        .string()
        .required('Doğrulama kodu zorunludur.')
        .length(6, 'Doğrulama kodu 6 haneli olmalıdır.'),
});

function closeVerifyModal() {
    if (loading.value) return;
    verifyModalOpen.value = false;
    modalOtp.value = '';
    modalOtpError.value = '';
    modalSendError.value = '';
}

async function sendCode() {
    codeSending.value = true;
    modalSendError.value = '';
    modalOtpError.value = '';
    try {
        const res = await api.post('/auth/send-password-change-code');
        const content = res.data?.content ?? res.data;
        emailMasked.value = content?.email_masked ?? '';
        codeSent.value = true;
        toast.success('Doğrulama kodu gönderildi.', { description: 'E-posta kutunu kontrol et.', duration: 5000 });
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || 'Kod gönderilemedi.';
        modalSendError.value = msg;
        toast.error('Kod gönderilemedi', { description: msg, duration: 5000 });
    } finally {
        codeSending.value = false;
    }
}

async function openVerifyModal() {
    passwordErrors.value = { newPassword: '', confirmPassword: '' };
    modalOtpError.value = '';
    modalSendError.value = '';
    try {
        await passwordOnlySchema.validate(passwordForm.value, { abortEarly: false });
    } catch (err) {
        if (err.name === 'ValidationError' && err.inner) {
            err.inner.forEach((e) => {
                if (e.path && passwordErrors.value[e.path] !== undefined) {
                    passwordErrors.value[e.path] = e.message;
                }
            });
        }
        return;
    }

    pendingPasswords.value = {
        newPassword: passwordForm.value.newPassword,
        confirmPassword: passwordForm.value.confirmPassword,
    };

    verifyModalOpen.value = true;
    modalOtp.value = '';
    codeSent.value = false;
    emailMasked.value = '';

    await nextTick();
    await sendCode();
}

async function submitPasswordWithOtp() {
    modalOtpError.value = '';
    try {
        await otpSchema.validate({ code: String(modalOtp.value || '').trim() }, { abortEarly: false });
    } catch (err) {
        if (err.name === 'ValidationError' && err.inner?.[0]) {
            modalOtpError.value = err.inner[0].message;
        } else {
            modalOtpError.value = 'Geçerli bir kod girin.';
        }
        return;
    }

    loading.value = true;
    try {
        await api.put('/auth/change-password', {
            code: String(modalOtp.value || '').trim(),
            new_password: pendingPasswords.value.newPassword,
            new_password_confirmation: pendingPasswords.value.confirmPassword,
        });
        toast.success('Şifreniz güncellendi.', { description: 'Bir sonraki girişte yeni şifrenizi kullanın.', duration: 5000 });
        passwordForm.value = { newPassword: '', confirmPassword: '' };
        pendingPasswords.value = { newPassword: '', confirmPassword: '' };
        codeSent.value = false;
        emailMasked.value = '';
        closeVerifyModal();
    } catch (err) {
        const data = err.response?.data;
        const msg = data?.message || data?.error || 'Şifre güncellenemedi.';
        toast.error('Hata', { description: msg, duration: 5000 });
        const errs = data?.errors || data?.content?.errors;
        if (errs && typeof errs === 'object' && errs.code) {
            modalOtpError.value = Array.isArray(errs.code) ? errs.code[0] : errs.code;
        } else if (data?.error?.code) {
            modalOtpError.value = Array.isArray(data.error.code) ? data.error.code[0] : data.error.code;
        } else {
            modalOtpError.value = '';
        }
    } finally {
        loading.value = false;
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
