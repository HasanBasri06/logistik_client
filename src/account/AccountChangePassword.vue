<template>
    <div class="flex flex-col h-full overflow-y-auto">
        <div class="flex flex-col gap-1 mb-8">
            <div class="flex items-center gap-3">
                <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <i class="pi pi-lock text-xl"></i>
                </span>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">Şifre Değiştir</h2>
                    <p class="text-sm text-gray-500 mt-0.5">E-posta adresinize gönderilen doğrulama kodu ile şifrenizi güncelleyin.</p>
                </div>
            </div>
        </div>

        <form @submit.prevent="handlePasswordChange" class="flex flex-col gap-6 max-w-md">
            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-gray-700">E-posta Doğrulama Kodu</label>
                <div class="flex gap-2">
                    <InputOtp
                        v-model="passwordForm.code"
                        :length="6"
                        :integerOnly="true"
                        :disabled="loading"
                        :invalid="!!passwordErrors.code"
                        :unstyled="true"
                        :pt="{
                            root: { class: 'flex gap-2 flex-1 min-w-[200px]' },
                            pcInputText: { root: { class: passwordErrors.code ? 'w-12 h-14 rounded-md text-lg text-center tracking-[0.4em] font-semibold border border-red-400 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-red-200' : 'w-12 h-14 rounded-md text-lg text-center tracking-[0.4em] font-semibold border border-gray-200 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-primary/20' } }
                        }"
                    />
                </div>
                <div class="flex items-center justify-between gap-2 flex-wrap">
                    <span v-if="passwordErrors.code" class="text-xs text-red-500 flex items-center gap-1">
                        <i class="pi pi-exclamation-circle text-[10px]"></i>
                        {{ passwordErrors.code }}
                    </span>
                    <button
                        type="button"
                        class="text-sm font-medium text-primary hover:underline disabled:opacity-50 disabled:pointer-events-none ml-auto"
                        :disabled="codeSending"
                        @click="sendCode"
                    >
                        <span v-if="codeSending" class="inline-flex items-center gap-1">
                            <i class="pi pi-spin pi-spinner text-xs"></i>
                            Gönderiliyor...
                        </span>
                        <span v-else>{{ codeSent ? 'Kodu tekrar gönder' : 'Doğrulama kodu gönder' }}</span>
                    </button>
                </div>
                <p v-if="codeSent && emailMasked" class="text-xs text-gray-500">
                    Kod <strong>{{ emailMasked }}</strong> adresine gönderildi.
                </p>
            </div>

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
    </div>
</template>

<script setup>
import { ref } from 'vue';
import * as yup from 'yup';
import api from '@/api';
import { toast } from 'vue-sonner';
import { InputOtp } from 'primevue';

const passwordForm = ref({
    code: '',
    newPassword: '',
    confirmPassword: '',
});

const passwordErrors = ref({
    code: '',
    newPassword: '',
    confirmPassword: '',
});

const showNew = ref(false);
const showConfirm = ref(false);
const loading = ref(false);
const codeSending = ref(false);
const codeSent = ref(false);
const emailMasked = ref('');

const passwordSchema = yup.object({
    code: yup
        .string()
        .required('Doğrulama kodu zorunludur.')
        .length(6, 'Doğrulama kodu 6 haneli olmalıdır.'),
    newPassword: yup
        .string()
        .min(6, 'Yeni şifre en az 6 karakter olmalıdır.')
        .required('Yeni şifre zorunludur.'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Şifreler eşleşmiyor.')
        .required('Şifre tekrar zorunludur.'),
});

async function sendCode() {
    codeSending.value = true;
    passwordErrors.value.code = '';
    try {
        const res = await api.post('/auth/send-password-change-code');
        const content = res.data?.content ?? res.data;
        emailMasked.value = content?.email_masked ?? '';
        codeSent.value = true;
        toast.success('Doğrulama kodu gönderildi.', { description: 'E-posta adresinizi kontrol edin.', duration: 5000 });
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || 'Kod gönderilemedi.';
        toast.error('Hata', { description: msg, duration: 5000 });
    } finally {
        codeSending.value = false;
    }
}

const handlePasswordChange = async () => {
    passwordErrors.value = { code: '', newPassword: '', confirmPassword: '' };
    try {
        await passwordSchema.validate(passwordForm.value, { abortEarly: false });
        loading.value = true;
        await api.put('/auth/change-password', {
            code: passwordForm.value.code.trim(),
            new_password: passwordForm.value.newPassword,
            new_password_confirmation: passwordForm.value.confirmPassword,
        });
        toast.success('Şifreniz güncellendi.', { description: 'Bir sonraki girişte yeni şifrenizi kullanın.', duration: 5000 });
        passwordForm.value = { code: '', newPassword: '', confirmPassword: '' };
        codeSent.value = false;
        emailMasked.value = '';
    } catch (err) {
        if (err.name === 'ValidationError' && err.inner) {
            err.inner.forEach((e) => {
                if (e.path && passwordErrors.value[e.path] !== undefined) {
                    passwordErrors.value[e.path] = e.message;
                }
            });
        } else {
            const data = err.response?.data;
            const msg = data?.message || data?.error || 'Şifre güncellenemedi.';
            toast.error('Hata', { description: msg, duration: 5000 });
            const errs = data?.errors || data?.content?.errors;
            if (errs && typeof errs === 'object') {
                if (errs.code) passwordErrors.value.code = Array.isArray(errs.code) ? errs.code[0] : errs.code;
                if (errs.new_password) passwordErrors.value.newPassword = Array.isArray(errs.new_password) ? errs.new_password[0] : errs.new_password;
            }
        }
    } finally {
        loading.value = false;
    }
};
</script>
