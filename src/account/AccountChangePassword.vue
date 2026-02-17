<template>
    <div class="flex flex-col h-full overflow-y-auto">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Şifre Değiştir</h2>
        
        <form @submit.prevent="handlePasswordChange" class="flex flex-col gap-6 max-w-md">
            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">Eski Şifre</label>
                <input
                    type="password"
                    v-model="passwordForm.currentPassword"
                    :class="['input', passwordErrors.currentPassword ? 'border-red-400' : '']"
                    placeholder="Mevcut şifrenizi girin"
                />
                <span v-if="passwordErrors.currentPassword" class="text-xs text-red-500 mt-0.5">
                    {{ passwordErrors.currentPassword }}
                </span>
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">Yeni Şifre</label>
                <input
                    type="password"
                    v-model="passwordForm.newPassword"
                    :class="['input', passwordErrors.newPassword ? 'border-red-400' : '']"
                    placeholder="Yeni şifrenizi girin"
                />
                <span v-if="passwordErrors.newPassword" class="text-xs text-red-500 mt-0.5">
                    {{ passwordErrors.newPassword }}
                </span>
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">Yeni Şifre Tekrar</label>
                <input
                    type="password"
                    v-model="passwordForm.confirmPassword"
                    :class="['input', passwordErrors.confirmPassword ? 'border-red-400' : '']"
                    placeholder="Yeni şifrenizi tekrar girin"
                />
                <span v-if="passwordErrors.confirmPassword" class="text-xs text-red-500 mt-0.5">
                    {{ passwordErrors.confirmPassword }}
                </span>
            </div>

            <button
                type="submit"
                class="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors mt-2"
            >
                Şifreyi Değiştir
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import * as yup from 'yup';

const passwordForm = ref({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
});

const passwordErrors = ref({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
});

const passwordSchema = yup.object({
    currentPassword: yup
        .string()
        .required("Eski şifre zorunludur."),
    newPassword: yup
        .string()
        .min(6, "Yeni şifre en az 6 karakter olmalıdır.")
        .required("Yeni şifre zorunludur."),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "Şifreler eşleşmiyor.")
        .required("Şifre tekrar zorunludur.")
});

const handlePasswordChange = async () => {
    passwordErrors.value = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    };
    try {
        await passwordSchema.validate(passwordForm.value, { abortEarly: false });
        console.log('Şifre değiştirildi');
        passwordForm.value = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        };
    } catch (err) {
        if (err.inner) {
            err.inner.forEach((e) => {
                if (e.path && passwordErrors.value[e.path] !== undefined) {
                    passwordErrors.value[e.path] = e.message;
                }
            });
        }
    }
};
</script>
