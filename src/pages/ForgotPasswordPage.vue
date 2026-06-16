<template>
    <div class="flex flex-col min-h-screen bg-gray-50/50">
        <Header />
        <Content class="flex-1 py-10 md:py-14">
            <div class="max-w-lg mx-auto px-1">
                <div class="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                    <div class="text-center mb-8">
                        <span class="text-xs font-bold uppercase tracking-wider text-primary">Şifremi Unuttum</span>
                        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Şifre Sıfırlama</h1>
                        <p class="text-sm text-gray-500 mt-2">{{ stepSubtitle }}</p>
                    </div>

                    <div class="flex items-center justify-center gap-2 mb-8">
                        <div
                            v-for="n in 3"
                            :key="n"
                            class="flex items-center gap-2"
                        >
                            <div
                                :class="[
                                    'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                                    currentStep === n
                                        ? 'bg-primary text-white'
                                        : currentStep > n
                                            ? 'bg-primary/15 text-primary'
                                            : 'bg-gray-100 text-gray-400'
                                ]"
                            >
                                <i v-if="currentStep > n" class="pi pi-check text-xs"></i>
                                <span v-else>{{ n }}</span>
                            </div>
                            <div
                                v-if="n < 3"
                                :class="[
                                    'h-0.5 w-10 sm:w-14 rounded-full transition-colors',
                                    currentStep > n ? 'bg-primary/40' : 'bg-gray-200'
                                ]"
                            ></div>
                        </div>
                    </div>

                    <!-- Adım 1: Telefon -->
                    <form v-if="currentStep === 1" @submit.prevent="submitPhoneStep" class="flex flex-col gap-5">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-gray-700">Telefon Numarası</label>
                            <div class="relative">
                                <InputMask
                                    type="tel"
                                    mask="999 999 99 99"
                                    placeholder="5XX XXX XX XX"
                                    v-model="phoneInput"
                                    :class="[
                                        'w-full h-12 px-4 !pl-12 text-left border-2 rounded-lg placeholder:!text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                                        phoneError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                                    ]"
                                    :disabled="loading"
                                    :pt="{ pcInputText: { root: { inputmode: 'text', enterkeyhint: 'done' } } }"
                                />
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <i class="pi pi-phone text-base"></i>
                                </span>
                            </div>
                            <span v-if="phoneError" class="text-xs text-red-500">{{ phoneError }}</span>
                            <p class="text-xs text-gray-500">Kayıtlı telefon numaranıza SMS ile doğrulama kodu gönderilecektir.</p>
                        </div>

                        <button
                            type="submit"
                            :disabled="loading"
                            :class="[
                                'w-full h-12 rounded-xl font-semibold text-white shadow-lg transition-all',
                                loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:shadow-xl'
                            ]"
                        >
                            <span v-if="loading" class="inline-flex items-center gap-2">
                                <i class="pi pi-spin pi-spinner"></i>
                                Kod gönderiliyor...
                            </span>
                            <span v-else>İleri</span>
                        </button>
                    </form>

                    <!-- Adım 2: SMS doğrulama -->
                    <form v-else-if="currentStep === 2" @submit.prevent="submitOtpStep" class="flex flex-col gap-5">
                        
                        <p v-if="phoneMasked" class="text-xs text-gray-500 text-center">
                            Kod <strong>{{ phoneMasked }}</strong> numarasına iletildi.
                        </p>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-gray-700">Doğrulama Kodu</label>
                            <OtpAutofillInput
                                v-model="otpCode"
                                :disabled="loading"
                                :invalid="!!otpError"
                            />
                            <span v-if="otpError" class="text-xs text-red-500 text-center">{{ otpError }}</span>
                        </div>

                        <div class="flex justify-center">
                            <button
                                type="button"
                                class="text-sm font-medium text-primary hover:underline disabled:opacity-50"
                                :disabled="resendLoading"
                                @click="resendCode"
                            >
                                <span v-if="resendLoading" class="inline-flex items-center gap-1">
                                    <i class="pi pi-spin pi-spinner text-xs"></i>
                                    Gönderiliyor...
                                </span>
                                <span v-else>Kodu tekrar gönder</span>
                            </button>
                        </div>

                        <div class="flex flex-col-reverse sm:flex-row gap-3">
                            <button
                                type="button"
                                class="flex-1 h-12 rounded-xl font-semibold text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition-colors"
                                :disabled="loading"
                                @click="goBack"
                            >
                                Geri
                            </button>
                            <button
                                type="submit"
                                :disabled="loading || String(otpCode || '').length !== 6"
                                :class="[
                                    'flex-1 h-12 rounded-xl font-semibold text-white shadow-lg transition-all',
                                    loading || String(otpCode || '').length !== 6
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-primary hover:bg-primary/90'
                                ]"
                            >
                                <span v-if="loading" class="inline-flex items-center gap-2">
                                    <i class="pi pi-spin pi-spinner"></i>
                                    Doğrulanıyor...
                                </span>
                                <span v-else>İleri</span>
                            </button>
                        </div>
                    </form>

                    <!-- Adım 3: Yeni şifre -->
                    <form v-else @submit.prevent="submitPasswordStep" class="flex flex-col gap-5">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-gray-700">Yeni Şifre</label>
                            <div class="relative">
                                <input
                                    :type="showNew ? 'text' : 'password'"
                                    v-model="passwordForm.newPassword"
                                    :class="[
                                        'w-full h-12 px-4 pl-12 pr-12 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                                        passwordErrors.newPassword ? 'border-red-400' : 'border-gray-200 focus:border-primary'
                                    ]"
                                    placeholder="En az 6 karakter"
                                    :disabled="loading"
                                />
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <i class="pi pi-key text-base"></i>
                                </span>
                                <button
                                    type="button"
                                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    @click="showNew = !showNew"
                                >
                                    <i :class="showNew ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                                </button>
                            </div>
                            <span v-if="passwordErrors.newPassword" class="text-xs text-red-500">{{ passwordErrors.newPassword }}</span>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-gray-700">Yeni Şifre (Tekrar)</label>
                            <div class="relative">
                                <input
                                    :type="showConfirm ? 'text' : 'password'"
                                    v-model="passwordForm.confirmPassword"
                                    :class="[
                                        'w-full h-12 px-4 pl-12 pr-12 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                                        passwordErrors.confirmPassword ? 'border-red-400' : 'border-gray-200 focus:border-primary'
                                    ]"
                                    placeholder="Yeni şifrenizi tekrar girin"
                                    :disabled="loading"
                                />
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <i class="pi pi-key text-base"></i>
                                </span>
                                <button
                                    type="button"
                                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    @click="showConfirm = !showConfirm"
                                >
                                    <i :class="showConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                                </button>
                            </div>
                            <span v-if="passwordErrors.confirmPassword" class="text-xs text-red-500">{{ passwordErrors.confirmPassword }}</span>
                        </div>

                        <button
                            type="submit"
                            :disabled="loading"
                            :class="[
                                'w-full h-12 rounded-xl font-semibold text-white shadow-lg transition-all',
                                loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'
                            ]"
                        >
                            <span v-if="loading" class="inline-flex items-center gap-2">
                                <i class="pi pi-spin pi-spinner"></i>
                                Güncelleniyor...
                            </span>
                            <span v-else>Güncelle</span>
                        </button>
                    </form>

                    <div class="mt-6 text-center">
                        <button
                            type="button"
                            class="text-sm font-medium text-primary hover:underline"
                            @click="goToLogin"
                        >
                            Giriş ekranına dön
                        </button>
                    </div>
                </div>
            </div>
        </Content>
        <Footer />
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { InputMask } from 'primevue';
import OtpAutofillInput from '@/components/OtpAutofillInput.vue';
import { toast } from 'vue-sonner';
import api from '@/api';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Content from '@/components/Content.vue';
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
const showNew = ref(false);
const showConfirm = ref(false);

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

const stepSubtitle = computed(() => {
    if (currentStep.value === 1) return 'Telefon numaranızı girin, size SMS ile kod gönderelim.';
    if (currentStep.value === 2) return 'Telefonunuza gelen doğrulama kodunu girin.';
    return 'Yeni şifrenizi belirleyin.';
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
        router.push('/');
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

function goToLogin() {
    authStore.requestShowLoginModal = true;
    router.push('/');
}

onMounted(() => {
    currentStep.value = 1;
});
</script>
