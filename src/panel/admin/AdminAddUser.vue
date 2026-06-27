<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">Kullanıcı Ekle</h1>
        <p class="mt-2 text-sm text-gray-500">Yeni kullanıcı bilgilerini girin.</p>

        <form class="mt-8 flex max-w-xl flex-col gap-5" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">Kullanıcı Türü</label>
                <div class="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        :disabled="submitting"
                        :class="typeButtonClass('cargo_owner')"
                        @click="form.userType = 'cargo_owner'"
                    >
                        Yük Sahibi
                    </button>
                    <button
                        type="button"
                        :disabled="submitting"
                        :class="typeButtonClass('vehicle_owner')"
                        @click="form.userType = 'vehicle_owner'"
                    >
                        Araç Sahibi
                    </button>
                </div>
                <span v-if="errors.userType" class="text-xs text-red-500">{{ errors.userType }}</span>
            </div>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="firstName">Ad</label>
                    <input
                        id="firstName"
                        v-model="form.firstName"
                        type="text"
                        placeholder="Ad"
                        :disabled="submitting"
                        :class="inputClass('firstName')"
                    />
                    <span v-if="errors.firstName" class="text-xs text-red-500">{{ errors.firstName }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="lastName">Soyad</label>
                    <input
                        id="lastName"
                        v-model="form.lastName"
                        type="text"
                        placeholder="Soyad"
                        :disabled="submitting"
                        :class="inputClass('lastName')"
                    />
                    <span v-if="errors.lastName" class="text-xs text-red-500">{{ errors.lastName }}</span>
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700" for="email">E-posta</label>
                <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="ornek@email.com"
                    :disabled="submitting"
                    :class="inputClass('email')"
                />
                <span v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</span>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700" for="phone">Telefon</label>
                <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    placeholder="5XXXXXXXXX"
                    :disabled="submitting"
                    :class="inputClass('phone')"
                />
                <span v-if="errors.phone" class="text-xs text-red-500">{{ errors.phone }}</span>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700" for="password">Şifre</label>
                <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    placeholder="En az 6 karakter"
                    :disabled="submitting"
                    :class="inputClass('password')"
                />
                <span v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</span>
            </div>

            <button
                type="submit"
                :disabled="submitting"
                :class="[
                    'h-11 w-full max-w-xs rounded-lg text-sm font-semibold text-white transition-colors',
                    submitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90',
                ]"
            >
                <span v-if="submitting" class="inline-flex items-center justify-center gap-2">
                    <i class="pi pi-spin pi-spinner"></i>
                    Kaydediliyor...
                </span>
                <span v-else>Kullanıcı Ekle</span>
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import * as yup from 'yup';
import { toast } from 'vue-sonner';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const submitting = ref(false);

function generateAdminEmail() {
    let digits = '';
    for (let i = 0; i < 10; i++) {
        digits += Math.floor(Math.random() * 10);
    }
    return `tasibul${digits}@gmail.com`;
}

const form = ref({
    userType: 'cargo_owner',
    firstName: '',
    lastName: '',
    email: generateAdminEmail(),
    phone: '',
    password: '',
});

const errors = ref({
    userType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
});

const userSchema = yup.object({
    userType: yup
        .string()
        .oneOf(['cargo_owner', 'vehicle_owner'], 'Kullanıcı türü seçilmelidir.')
        .required('Kullanıcı türü zorunludur.'),
    firstName: yup.string().required('Ad zorunludur.'),
    lastName: yup.string().required('Soyad zorunludur.'),
    email: yup
        .string()
        .email('Geçerli bir e-posta girin.')
        .required('E-posta zorunludur.'),
    phone: yup
        .string()
        .required('Telefon zorunludur.')
        .test('phone-length', 'Geçerli bir telefon numarası giriniz.', (value) => {
            const digits = String(value || '').replace(/\D/g, '');
            return digits.length === 10;
        }),
    password: yup
        .string()
        .min(6, 'Şifre en az 6 karakter olmalıdır.')
        .required('Şifre zorunludur.'),
});

function inputClass(field) {
    return [
        'h-11 w-full rounded-lg border px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed',
        errors.value[field]
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-200 focus:border-primary focus:ring-primary/20',
    ];
}

function typeButtonClass(type) {
    return [
        'h-11 rounded-lg border text-sm font-medium transition-colors',
        form.value.userType === type
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-gray-200 text-gray-600 hover:border-primary/40',
    ];
}

function applyServerErrors(errorDetails) {
    if (!errorDetails || typeof errorDetails !== 'object') return;

    const fieldMap = {
        type: 'userType',
        first_name: 'firstName',
        last_name: 'lastName',
        email: 'email',
        phone: 'phone',
        password: 'password',
    };

    Object.keys(errorDetails).forEach((key) => {
        const formKey = fieldMap[key] || key;
        if (errors.value[formKey] !== undefined) {
            const errorValue = errorDetails[key];
            errors.value[formKey] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        }
    });
}

function resetForm() {
    form.value = {
        userType: 'cargo_owner',
        firstName: '',
        lastName: '',
        email: generateAdminEmail(),
        phone: '',
        password: '',
    };
}

async function handleSubmit() {
    errors.value = {
        userType: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
    };

    try {
        await userSchema.validate(form.value, { abortEarly: false });
    } catch (err) {
        err.inner?.forEach((e) => {
            if (e.path && errors.value[e.path] !== undefined) {
                errors.value[e.path] = e.message;
            }
        });
        return;
    }

    submitting.value = true;
    try {
        const result = await adminStore.createUser({
            type: form.value.userType,
            first_name: form.value.firstName.trim(),
            last_name: form.value.lastName.trim(),
            email: form.value.email.trim(),
            phone: form.value.phone.replace(/\s/g, ''),
            password: form.value.password,
        });

        if (result.success) {
            toast.success(result.data?.message || 'Kullanıcı başarıyla oluşturuldu.', { duration: 5000 });
            resetForm();
            return;
        }

        let errorMessage = result.error || 'Kullanıcı oluşturulamadı.';
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
            description: 'Kayıt Hatası',
            duration: 5000,
        });
    } finally {
        submitting.value = false;
    }
}
</script>
