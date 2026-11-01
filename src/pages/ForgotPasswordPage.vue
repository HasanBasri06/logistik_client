<template>
    <AuthShell
        :title="stepTitle"
        :description="stepSubtitle"
        :back="currentStep === 2"
        @back="goBack"
    >
        <!-- Adım göstergesi -->
        <div class="mb-6 flex items-center justify-center gap-2" aria-hidden="true">
            <span
                v-for="n in 3"
                :key="n"
                class="h-1.5 rounded-full transition-all"
                :class="currentStep === n ? 'w-8 bg-secondary' : currentStep > n ? 'w-5 bg-primary' : 'w-5 bg-slate-200'"
            ></span>
        </div>

        <!-- Adım 1: Telefon -->
        <form v-if="currentStep === 1" class="flex flex-col gap-4" novalidate @submit.prevent="submitPhoneStep">
            <AuthInput
                v-model="phoneInput"
                label="Telefon Numarası"
                icon="pi pi-phone"
                prefix="+90"
                type="tel"
                inputmode="tel"
                autocomplete="tel-national"
                placeholder="5XX XXX XX XX"
                maxlength="13"
                :format="formatTrPhoneInput"
                :disabled="loading"
                :error="phoneError"
            />
            <button
                type="submit"
                class="flex h-[52px] items-center justify-center rounded-[14px] bg-primary text-base font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
                :disabled="loading"
            >
                <i v-if="loading" class="pi pi-spin pi-spinner"></i>
                <span v-else>Kod Gönder</span>
            </button>
        </form>

        <!-- Adım 2: SMS doğrulama -->
        <form v-else-if="currentStep === 2" class="flex flex-col gap-4" novalidate @submit.prevent="submitOtpStep">
            <div class="flex flex-col gap-2">
                <span class="text-[13px] font-semibold text-slate-700">Doğrulama Kodu</span>
                <OtpAutofillInput v-model="otpCode" :disabled="loading" :invalid="!!otpError" />
                <span v-if="otpError" class="text-center text-xs font-medium text-red-600">{{ otpError }}</span>
            </div>
            <div class="flex justify-center">
                <button
                    type="button"
                    class="text-sm font-semibold text-primary hover:underline disabled:opacity-50"
                    :disabled="resendLoading"
                    @click="resendCode"
                >
                    <i v-if="resendLoading" class="pi pi-spin pi-spinner text-xs"></i>
                    <span v-else>Kodu tekrar gönder</span>
                </button>
            </div>
            <button
                type="submit"
                class="flex h-[52px] items-center justify-center rounded-[14px] bg-primary text-base font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
                :disabled="loading || String(otpCode || '').length !== 6"
            >
                <i v-if="loading" class="pi pi-spin pi-spinner"></i>
                <span v-else>İleri</span>
            </button>
        </form>

        <!-- Adım 3: Yeni şifre -->
        <form v-else class="flex flex-col gap-4" novalidate @submit.prevent="submitPasswordStep">
            <AuthInput
                v-model="passwordForm.newPassword"
                label="Yeni Şifre"
                icon="pi pi-lock"
                placeholder="En az 6 karakter"
                autocomplete="new-password"
                password-toggle
                :disabled="loading"
                :error="passwordErrors.newPassword"
            />
            <AuthInput
                v-model="passwordForm.confirmPassword"
                label="Yeni Şifre Tekrar"
                icon="pi pi-shield"
                placeholder="Yeni şifrenizi tekrar girin"
                autocomplete="new-password"
                password-toggle
                :disabled="loading"
                :error="passwordErrors.confirmPassword"
            />
            <button
                type="submit"
                class="flex h-[52px] items-center justify-center rounded-[14px] bg-primary text-base font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
                :disabled="loading"
            >
                <i v-if="loading" class="pi pi-spin pi-spinner"></i>
                <span v-else>Şifreyi Güncelle</span>
            </button>
        </form>

        <p class="mt-5 text-center text-sm text-slate-500">
            Şifreni hatırladın mı?
            <RouterLink to="/giris" class="font-bold text-primary hover:underline">Giriş Yap</RouterLink>
        </p>
    </AuthShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import OtpAutofillInput from '@/components/OtpAutofillInput.vue';
import { toast } from 'vue-sonner';
import api from '@/api';
import AuthShell from '@/components/auth/AuthShell.vue';
import AuthInput from '@/components/auth/AuthInput.vue';
import { formatTrPhoneInput } from '@/lib/auth-ui';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const currentStep = ref(1);
const phoneInput = ref('');
const storedPhone = ref('');
const phoneMasked = ref('');
const otpCode = ref('');
const verifiedCode = ref('');
const phoneError = ref('');
const otpError = ref('');
const loading = ref(false);
const resendLoading = ref(false);

const passwordForm = ref({
    newPassword: '',
    confirmPassword: '',
});

const passwordErrors = ref({
    newPassword: '',
    confirmPassword: '',
});

const phoneSchema = yup.object({
    phone: yup
        .string()
        .required('Telefon numarası zorunludur.')
        .test('phone-length', 'Geçerli bir telefon numarası giriniz.', (value) => {
            const digits = String(value || '').replace(/\D/g, '');
            return digits.length === 10;
        }),
});

const otpSchema = yup.object({
    code: yup
        .string()
        .required('Doğrulama kodu zorunludur.')
        .length(6, 'Doğrulama kodu 6 haneli olmalıdır.'),
});

const passwordSchema = yup.object({
    newPassword: yup
        .string()
        .min(6, 'Yeni şifre en az 6 karakter olmalıdır.')
        .required('Yeni şifre zorunludur.'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Şifreler eşleşmiyor.')
        .required('Şifre tekrar zorunludur.'),
});

const stepTitle = computed(() => {
    if (currentStep.value === 1) return 'Şifremi Unuttum';
    if (currentStep.value === 2) return 'Doğrulama Kodu';
    return 'Yeni Şifre';
});

const stepSubtitle = computed(() => {
    if (currentStep.value === 1) return 'Kayıtlı telefon numaranı gir, şifreni yenilemen için SMS ile doğrulama kodu gönderelim.';
    if (currentStep.value === 2) {
        return phoneMasked.value
            ? `${phoneMasked.value} numarasına gönderilen 6 haneli kodu gir.`
            : 'Telefonuna gelen 6 haneli kodu gir.';
    }
    return 'Yeni şifreni belirle ve onayla. En az 6 karakter olmalı.';
});

function formatPhoneDisplay(phone) {
    if (!phone) return '';
    const d = String(phone).replace(/\D/g, '');
    if (d.length !== 10) return phone;
    return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)}`;
}

function normalizePhone(value) {
    return String(value || '').replace(/\s/g, '');
}

function apiErrorMessage(err, fallback = 'Bir hata oluştu.') {
    const data = err.response?.data;
    const errs = data?.errors || data?.content?.errors;
    if (errs && typeof errs === 'object') {
        const first = Object.values(errs)
            .flatMap((v) => (Array.isArray(v) ? v : [v]))
            .find(Boolean);
        if (first) return String(first);
    }
    return data?.message || data?.error || fallback;
}

async function sendSmsCode() {
    const res = await api.post('/auth/forgot-password/send-code', {
        phone: storedPhone.value,
    });
    const content = res.data?.content ?? res.data;
    phoneMasked.value = content?.phone_masked ?? '';
}

async function submitPhoneStep() {
    phoneError.value = '';
    try {
        await phoneSchema.validate({ phone: phoneInput.value }, { abortEarly: false });
    } catch (err) {
        if (err.inner?.[0]) {
            phoneError.value = err.inner[0].message;
        }
        return;
    }

    storedPhone.value = normalizePhone(phoneInput.value);
    loading.value = true;
    try {
        await sendSmsCode();
        currentStep.value = 2;
        otpCode.value = '';
        otpError.value = '';
        toast.success('Doğrulama kodu gönderildi.', { description: 'SMS kutunuzu kontrol edin.' });
    } catch (err) {
        const msg = apiErrorMessage(err, 'Kod gönderilemedi.');
        phoneError.value = msg;
        toast.error('Kod gönderilemedi', { description: msg });
    } finally {
        loading.value = false;
    }
}

async function submitOtpStep() {
    otpError.value = '';
    const code = String(otpCode.value || '').replace(/\D/g, '');
    try {
        await otpSchema.validate({ code }, { abortEarly: false });
    } catch (err) {
        if (err.inner?.[0]) {
            otpError.value = err.inner[0].message;
        }
        return;
    }

    loading.value = true;
    try {
        await api.post('/auth/forgot-password/verify-code', {
            phone: storedPhone.value,
            code,
        });
        verifiedCode.value = code;
        currentStep.value = 3;
        passwordErrors.value = { newPassword: '', confirmPassword: '' };
        toast.success('Kod doğrulandı.', { description: 'Yeni şifrenizi belirleyebilirsiniz.' });
    } catch (err) {
        const msg = apiErrorMessage(err, 'Doğrulama kodu hatalı.');
        otpError.value = msg;
        toast.error('Doğrulama başarısız', { description: msg });
    } finally {
        loading.value = false;
    }
}

async function resendCode() {
    if (!storedPhone.value) return;
    resendLoading.value = true;
    otpError.value = '';
    try {
        await sendSmsCode();
        toast.success('Kod tekrar gönderildi.');
    } catch (err) {
        const msg = apiErrorMessage(err, 'Kod gönderilemedi.');
        otpError.value = msg;
        toast.error('Kod gönderilemedi', { description: msg });
    } finally {
        resendLoading.value = false;
    }
}

async function submitPasswordStep() {
    passwordErrors.value = { newPassword: '', confirmPassword: '' };
    try {
        await passwordSchema.validate(passwordForm.value, { abortEarly: false });
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

    loading.value = true;
    try {
        await api.post('/auth/forgot-password/reset', {
            phone: storedPhone.value,
            code: verifiedCode.value,
            new_password: passwordForm.value.newPassword,
            new_password_confirmation: passwordForm.value.confirmPassword,
        });
        authStore.setToken(null);
        authStore.setUser(null);
        delete api.defaults.headers.common['Authorization'];
        toast.success('Şifreniz başarılı bir şekilde güncellendi.');
        router.push('/giris');
    } catch (err) {
        const msg = apiErrorMessage(err, 'Şifre güncellenemedi.');
        toast.error('Hata', { description: msg });
        const data = err.response?.data;
        const errs = data?.errors || data?.content?.errors;
        if (errs?.code) {
            otpError.value = Array.isArray(errs.code) ? errs.code[0] : errs.code;
            currentStep.value = 2;
            verifiedCode.value = '';
            otpCode.value = '';
        }
    } finally {
        loading.value = false;
    }
}

function goBack() {
    if (currentStep.value === 2) {
        currentStep.value = 1;
        otpCode.value = '';
        otpError.value = '';
        verifiedCode.value = '';
    }
}

onMounted(() => {
    currentStep.value = 1;
});
</script>
