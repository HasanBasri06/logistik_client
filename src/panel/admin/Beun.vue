<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 class="text-center text-2xl font-bold text-gray-900 mb-8">TaşıBul</h1>

            <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="email">E-posta</label>
                    <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        autocomplete="email"
                        placeholder="ornek@email.com"
                        :disabled="loading"
                        :class="[
                            'h-11 w-full rounded-lg border px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed',
                            errors.email
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                        ]"
                    />
                    <span v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</span>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="password">Şifre</label>
                    <input
                        id="password"
                        v-model="form.password"
                        type="password"
                        autocomplete="current-password"
                        placeholder="Şifreniz"
                        :disabled="loading"
                        :class="[
                            'h-11 w-full rounded-lg border px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed',
                            errors.password
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                        ]"
                    />
                    <span v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</span>
                </div>

                <button
                    type="submit"
                    :disabled="loading"
                    :class="[
                        'mt-2 h-11 w-full rounded-lg text-sm font-semibold text-white transition-colors',
                        loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'
                    ]"
                >
                    <span v-if="loading" class="inline-flex items-center justify-center gap-2">
                        <i class="pi pi-spin pi-spinner"></i>
                        Giriş yapılıyor...
                    </span>
                    <span v-else>Giriş Yap</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { toast } from 'vue-sonner';
import { useAdminStore } from '@/stores/admin';

const router = useRouter();
const adminStore = useAdminStore();

const form = ref({
    email: '',
    password: '',
});

const errors = ref({
    email: '',
    password: '',
});

const loading = ref(false);

const loginSchema = yup.object({
    email: yup
        .string()
        .email('Geçerli bir e-posta girin.')
        .required('E-posta zorunludur.'),
    password: yup
        .string()
        .min(6, 'Şifre en az 6 karakter olmalıdır.')
        .required('Şifre zorunludur.'),
});

function applyServerErrors(errorDetails) {
    if (!errorDetails || typeof errorDetails !== 'object') return;

    Object.keys(errorDetails).forEach((key) => {
        if (errors.value[key] !== undefined) {
            const errorValue = errorDetails[key];
            errors.value[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        }
    });
}

async function handleSubmit() {
    errors.value = { email: '', password: '' };

    try {
        await loginSchema.validate(form.value, { abortEarly: false });
    } catch (err) {
        err.inner?.forEach((e) => {
            if (e.path && errors.value[e.path] !== undefined) {
                errors.value[e.path] = e.message;
            }
        });
        return;
    }

    loading.value = true;
    try {
        const result = await adminStore.login({
            email: form.value.email.trim(),
            password: form.value.password,
        });

        if (result.success) {
            toast.success('Admin girişi başarılı!', { duration: 5000 });
            form.value = { email: '', password: '' };
            router.push('/panel/admin/beun/main');
            return;
        }

        let errorMessage = result.error || 'Giriş başarısız!';

        if (result.errorDetails && typeof result.errorDetails === 'object') {
            const firstError = Object.values(result.errorDetails)[0];
            if (Array.isArray(firstError)) {
                errorMessage = firstError[0];
            } else if (typeof firstError === 'string') {
                errorMessage = firstError;
            }
            applyServerErrors(result.errorDetails);
        }

        toast.error(errorMessage, {
            description: 'Giriş Hatası',
            duration: 5000,
        });
    } finally {
        loading.value = false;
    }
}
</script>
