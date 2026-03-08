<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
        aria-labelledby="add-card-modal-title"
    >
        <div
            class="absolute inset-0 bg-black/30 transition-opacity"
            aria-hidden="true"
            @click="$emit('close')"
        />
        <div
            class="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
            <!-- Başlık + kapat -->
            <div class="shrink-0 flex items-center justify-between p-6 pb-4 border-b border-gray-100">
                <h2 id="add-card-modal-title" class="text-lg font-semibold text-gray-900">Yeni Kart Ekle</h2>
                <button
                    type="button"
                    class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Kapat"
                    @click="$emit('close')"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Kredi kartı ikonu + form -->
            <div class="flex-1 overflow-y-auto p-6 pt-4">
                <div class="flex justify-center mb-6">
                    <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <i class="pi pi-credit-card text-3xl text-primary" aria-hidden="true"></i>
                    </div>
                </div>

                <form @submit.prevent="onSubmit" class="space-y-4">
                    <div>
                        <label for="card-number" class="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                        <input
                            id="card-number"
                            v-model="form.cardNumberDisplay"
                            type="text"
                            inputmode="numeric"
                            maxlength="19"
                            placeholder="0000 0000 0000 0000"
                            class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary font-mono tracking-wider"
                            @input="formatCardNumber"
                        />
                        <p v-if="errors.cardNumber" class="mt-1 text-sm text-red-600">{{ errors.cardNumber }}</p>
                    </div>

                    <div>
                        <label for="card-holder" class="block text-sm font-medium text-gray-700 mb-1">Kart Sahibi</label>
                        <input
                            id="card-holder"
                            v-model.trim="form.cardHolderName"
                            type="text"
                            placeholder="Ad Soyad"
                            class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            @input="errors.cardHolderName = ''"
                        />
                        <p v-if="errors.cardHolderName" class="mt-1 text-sm text-red-600">{{ errors.cardHolderName }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="card-expiry" class="block text-sm font-medium text-gray-700 mb-1">Son Kullanma (AA/YY)</label>
                            <input
                                id="card-expiry"
                                v-model="form.expiryDisplay"
                                type="text"
                                inputmode="numeric"
                                maxlength="5"
                                placeholder="MM/YY"
                                class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary font-mono"
                                @input="formatExpiry"
                            />
                            <p v-if="errors.expiry" class="mt-1 text-sm text-red-600">{{ errors.expiry }}</p>
                        </div>
                        <div>
                            <label for="card-cvc" class="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                            <input
                                id="card-cvc"
                                v-model="form.cvc"
                                type="text"
                                inputmode="numeric"
                                maxlength="4"
                                placeholder="•••"
                                class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary font-mono"
                                @input="form.cvc = form.cvc.replace(/\D/g, ''); errors.cvc = ''"
                            />
                            <p v-if="errors.cvc" class="mt-1 text-sm text-red-600">{{ errors.cvc }}</p>
                        </div>
                    </div>

                    <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>

                    <div class="flex gap-3 pt-2">
                        <button
                            type="button"
                            class="flex-1 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                            @click="$emit('close')"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            class="flex-1 py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            :disabled="loading"
                        >
                            {{ loading ? 'Kaydediliyor...' : 'Kartı Ekle' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import api from '@/api';

const emit = defineEmits(['close', 'success']);

const loading = ref(false);
const submitError = ref('');

const form = reactive({
    cardNumberDisplay: '',
    cardHolderName: '',
    expiryDisplay: '',
    cvc: '',
});

const errors = reactive({
    cardNumber: '',
    cardHolderName: '',
    expiry: '',
    cvc: '',
});

function formatCardNumber(e) {
    let v = e.target?.value ?? form.cardNumberDisplay;
    v = v.replace(/\D/g, '').slice(0, 16);
    form.cardNumberDisplay = v.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    errors.cardNumber = '';
}

function formatExpiry(e) {
    let v = e.target?.value ?? form.expiryDisplay;
    v = v.replace(/\D/g, '');
    if (v.length >= 2) {
        v = v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    form.expiryDisplay = v;
    errors.expiry = '';
}

function validate() {
    let ok = true;
    const raw = form.cardNumberDisplay.replace(/\D/g, '');
    if (raw.length < 16) {
        errors.cardNumber = 'Geçerli bir kart numarası girin (16 rakam).';
        ok = false;
    }
    if (!form.cardHolderName.trim()) {
        errors.cardHolderName = 'Kart sahibi adı gerekli.';
        ok = false;
    }
    const [mm, yy] = form.expiryDisplay.split('/');
    if (!mm || !yy || mm.length !== 2 || yy.length !== 2) {
        errors.expiry = 'Son kullanma AA/YY formatında olmalı.';
        ok = false;
    } else {
        const m = parseInt(mm, 10);
        if (m < 1 || m > 12) {
            errors.expiry = 'Geçerli bir ay girin (01-12).';
            ok = false;
        }
    }
    if (!form.cvc || form.cvc.length < 3) {
        errors.cvc = 'CVC en az 3 rakam olmalı.';
        ok = false;
    }
    return ok;
}

async function onSubmit() {
    submitError.value = '';
    if (!validate()) return;

    const rawNumber = form.cardNumberDisplay.replace(/\D/g, '');
    const lastFour = rawNumber.slice(-4);
    const [expMonth, expYear] = form.expiryDisplay.split('/');

    loading.value = true;
    try {
        await api.post('/cards', {
            card_holder_name: form.cardHolderName.trim(),
            last_four: lastFour,
            exp_month: expMonth,
            exp_year: '20' + expYear,
            brand: detectBrand(rawNumber) || null,
        });
        emit('success');
        emit('close');
    } catch (err) {
        const msg = err?.response?.data?.message ?? err?.message ?? 'Kart eklenirken bir hata oluştu.';
        submitError.value = msg;
    } finally {
        loading.value = false;
    }
}

function detectBrand(num) {
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    return null;
}
</script>
