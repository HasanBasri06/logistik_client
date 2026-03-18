<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-show="show"
                class="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/50"
                role="dialog"
                aria-modal="true"
                aria-labelledby="premium-modal-title"
                @click.self="close"
            >
                <div class="relative bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
                    <div class="p-6 pb-4">
                        <div class="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h2 id="premium-modal-title" class="text-xl font-bold text-gray-900">
                                    Premium'a geç
                                </h2>
                                <p v-if="step === 1" class="text-sm text-gray-600 mt-1">
                                    Paket seçin (1 / 3 / 6 / 12 ay). Seçim yaptıktan sonra ödeme adımına geçebilirsiniz.
                                </p>
                                <p v-else class="text-sm text-gray-600 mt-1">
                                    Ödeme bilgilerinizi girin.
                                </p>
                            </div>
                            <button
                                type="button"
                                class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                aria-label="Kapat"
                                @click="close"
                            >
                                <i class="pi pi-times"></i>
                            </button>
                        </div>

                        <!-- Step 1: Plan selection -->
                        <div v-if="step === 1" class="grid grid-cols-2 grid-flow-row gap-3">
                            <button
                                v-for="plan in plans"
                                :key="plan.id"
                                type="button"
                                class="flex flex-col items-start justify-between p-4 rounded-xl border-2 transition-all min-h-[104px] text-left"
                                :class="selectedPlanId === plan.id
                                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                    : 'border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5'"
                                @click="selectedPlanId = plan.id"
                            >
                                <div class="flex items-start justify-between w-full gap-3">
                                    <div>
                                        <div class="text-sm font-semibold text-gray-900">{{ plan.title }}</div>
                                        <div class="text-xs text-gray-600 mt-0.5">{{ plan.subtitle }}</div>
                                    </div>
                                    <i
                                        class="pi text-primary text-lg"
                                        :class="selectedPlanId === plan.id ? 'pi-check-circle' : plan.icon"
                                    ></i>
                                </div>
                                <div class="text-xs text-gray-500 mt-3">{{ plan.detail }}</div>
                            </button>
                        </div>

                        <!-- Step 2: Payment UI -->
                        <div v-else class="space-y-4">
                            <!-- Card preview -->
                            <div class="rounded-2xl overflow-hidden border border-gray-200 bg-white">
                                <div class="p-4 sm:p-5 bg-linear-to-br from-primary to-primary/80 text-white">
                                    <div class="flex items-start justify-between">
                                        <div>
                                            <p class="text-xs/5 text-white/80">TaşıBul Premium</p>
                                            <p class="text-sm font-semibold">{{ selectedPlan?.title || '—' }}</p>
                                        </div>
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-7 h-7 rounded-full bg-white/25"></span>
                                            <span class="w-7 h-7 rounded-full bg-white/15 -ml-3"></span>
                                        </div>
                                    </div>
                                    <div class="mt-5">
                                        <p class="font-mono tracking-widest text-lg sm:text-xl">{{ cardDisplayNumber }}</p>
                                        <div class="mt-4 flex items-end justify-between gap-3">
                                            <div class="min-w-0">
                                                <p class="text-[11px] text-white/80">KART SAHİBİ</p>
                                                <p class="text-sm font-semibold truncate">{{ cardDisplayName }}</p>
                                            </div>
                                            <div class="shrink-0 text-right">
                                                <p class="text-[11px] text-white/80">SKT</p>
                                                <p class="text-sm font-semibold">{{ cardDisplayExp }}</p>
                                            </div>
                                            <div class="shrink-0 text-right">
                                                <p class="text-[11px] text-white/80">CVC</p>
                                                <p class="text-sm font-semibold">{{ cardDisplayCvc }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <div class="flex items-center justify-between gap-3">
                                    <div class="min-w-0">
                                        <p class="text-xs text-gray-500">Seçilen paket</p>
                                        <p class="text-sm font-semibold text-gray-900 truncate">{{ selectedPlan?.title || '—' }}</p>
                                    </div>
                                    <button
                                        type="button"
                                        class="text-sm font-medium text-primary hover:underline shrink-0"
                                        @click="step = 1"
                                    >
                                        Değiştir
                                    </button>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div class="sm:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Kart üzerindeki ad</label>
                                    <input
                                        v-model="paymentForm.name"
                                        type="text"
                                        autocomplete="cc-name"
                                        class="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Ad Soyad"
                                    />
                                    <p v-if="paymentErrors.name" class="mt-1 text-xs text-red-600">{{ paymentErrors.name }}</p>
                                </div>
                                <div class="sm:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Kart numarası</label>
                                    <input
                                        v-model="paymentForm.number"
                                        type="text"
                                        inputmode="numeric"
                                        autocomplete="cc-number"
                                        class="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="0000 0000 0000 0000"
                                        @input="onCardNumberInput"
                                    />
                                    <p v-if="paymentErrors.number" class="mt-1 text-xs text-red-600">{{ paymentErrors.number }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Son kullanma (AA/YY)</label>
                                    <input
                                        v-model="paymentForm.exp"
                                        type="text"
                                        inputmode="numeric"
                                        autocomplete="cc-exp"
                                        class="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="MM/YY"
                                        @input="onCardExpInput"
                                    />
                                    <p v-if="paymentErrors.exp" class="mt-1 text-xs text-red-600">{{ paymentErrors.exp }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                    <input
                                        v-model="paymentForm.cvc"
                                        type="password"
                                        inputmode="numeric"
                                        autocomplete="cc-csc"
                                        class="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="***"
                                        @input="onCvcInput"
                                    />
                                    <p v-if="paymentErrors.cvc" class="mt-1 text-xs text-red-600">{{ paymentErrors.cvc }}</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="px-6 py-4 border-t border-gray-100 flex justify-between gap-2">
                        <button
                            v-if="step === 2"
                            type="button"
                            class="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            @click="step = 1"
                        >
                            Geri
                        </button>
                        <div v-else class="flex-1"></div>

                        <button
                            v-if="step === 1"
                            type="button"
                            class="px-4 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            :disabled="!selectedPlanId"
                            @click="goToPayment"
                        >
                            Premium'a geç
                        </button>
                        <button
                            v-else
                            type="button"
                            class="px-4 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            :disabled="paymentSubmitting"
                            @click="submitPayment"
                        >
                            {{ paymentSubmitting ? 'İşleniyor...' : 'Ödemeyi tamamla' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import api from '@/api';
import { toast } from 'vue-sonner';

const authStore = useAuthStore();
const { showPremiumModal } = storeToRefs(authStore);

const show = computed(() => !!showPremiumModal.value);

const step = ref(1); // 1: plan seçimi, 2: ödeme bilgileri (UI)
const selectedPlanId = ref(null);

const plans = [
    { id: 'm1', months: 1, title: '1 Aylık', subtitle: 'Esnek', icon: 'pi-calendar', detail: 'İstediğin zaman iptal et' },
    { id: 'm3', months: 3, title: '3 Aylık', subtitle: 'Popüler', icon: 'pi-star', detail: 'Daha avantajlı' },
    { id: 'm6', months: 6, title: '6 Aylık', subtitle: 'İndirimli', icon: 'pi-tag', detail: 'Ekstra indirim' },
    { id: 'm12', months: 12, title: '12 Aylık', subtitle: 'En avantajlı', icon: 'pi-check-circle', detail: 'En iyi fiyat' },
];

const selectedPlan = computed(() => plans.find((p) => p.id === selectedPlanId.value) ?? null);

const paymentForm = ref({
    name: '',
    number: '',
    exp: '',
    cvc: '',
});

const paymentErrors = ref({
    name: '',
    number: '',
    exp: '',
    cvc: '',
    plan: '',
});
const paymentSubmitting = ref(false);

const cardDisplayName = computed(() => (paymentForm.value.name || 'AD SOYAD').toUpperCase());
const cardDisplayNumber = computed(() => {
    const digits = String(paymentForm.value.number || '').replace(/\D/g, '');
    const padded = (digits + '0000000000000000').slice(0, 16);
    return padded.replace(/(\d{4})(?=\d)/g, '$1 ');
});
const cardDisplayExp = computed(() => {
    const v = String(paymentForm.value.exp || '').trim();
    if (!v) return 'MM/YY';
    const digits = v.replace(/\D/g, '').slice(0, 4);
    const mm = digits.slice(0, 2);
    const yy = digits.slice(2, 4);
    if (!mm) return 'MM/YY';
    return yy ? `${mm}/${yy}` : mm;
});
const cardDisplayCvc = computed(() => {
    const v = String(paymentForm.value.cvc || '').replace(/\D/g, '').slice(0, 4);
    if (!v) return '***';
    return '*'.repeat(Math.min(v.length, 3));
});

function close() {
    authStore.showPremiumModal = false;
    step.value = 1;
    selectedPlanId.value = null;
    paymentForm.value = { name: '', number: '', exp: '', cvc: '' };
    paymentErrors.value = { name: '', number: '', exp: '', cvc: '', plan: '' };
    paymentSubmitting.value = false;
}

function goToPayment() {
    if (!selectedPlanId.value) return;
    step.value = 2;
}

function validatePaymentForm() {
    const errs = { name: '', number: '', exp: '', cvc: '', plan: '' };

    if (!selectedPlanId.value) errs.plan = 'Lütfen paket seçin.';

    const name = String(paymentForm.value.name ?? '').trim();
    if (!name) errs.name = 'Kart üzerindeki ad zorunludur.';

    const digits = String(paymentForm.value.number ?? '').replace(/\D/g, '');
    if (!digits) errs.number = 'Kart numarası zorunludur.';
    else if (digits.length !== 16) errs.number = 'Kart numarası 16 haneli olmalıdır.';

    const expRaw = String(paymentForm.value.exp ?? '').trim();
    if (!expRaw) errs.exp = 'Son kullanma tarihi zorunludur.';
    else {
        const expDigits = expRaw.replace(/\D/g, '').slice(0, 4);
        const mm = expDigits.slice(0, 2);
        const yy = expDigits.slice(2, 4);
        const month = Number(mm);
        const year2 = Number(yy);
        if (mm.length !== 2 || yy.length !== 2 || Number.isNaN(month) || month < 1 || month > 12 || Number.isNaN(year2)) {
            errs.exp = 'Son kullanma tarihi MM/YY formatında olmalıdır.';
        } else {
            const now = new Date();
            const currentYear2 = now.getFullYear() % 100;
            const currentMonth = now.getMonth() + 1; // 1-12
            // Yıl bugünden küçükse veya aynı yılda ay bugünden küçükse geçersiz
            if (year2 < currentYear2 || (year2 === currentYear2 && month < currentMonth)) {
                errs.exp = 'Kartın son kullanma tarihi geçmiş olamaz.';
            }
        }
    }

    const cvcDigits = String(paymentForm.value.cvc ?? '').replace(/\D/g, '');
    if (!cvcDigits) errs.cvc = 'CVC zorunludur.';
    else if (cvcDigits.length < 3 || cvcDigits.length > 4) errs.cvc = 'CVC 3 veya 4 haneli olmalıdır.';

    paymentErrors.value = errs;
    return !Object.values(errs).some(Boolean);
}

async function submitPayment() {
    if (paymentSubmitting.value) return;
    const ok = validatePaymentForm();
    if (!ok) {
        toast.error('Eksik veya hatalı bilgi var.', { description: 'Ödeme', duration: 5000 });
        return;
    }

    paymentSubmitting.value = true;
    try {
        const plan = selectedPlan.value?.months ?? null;
        const card_number = String(paymentForm.value.number ?? '').replace(/\D/g, '');
        const expDigits = String(paymentForm.value.exp ?? '').replace(/\D/g, '').slice(0, 4);
        const card_exp = `${expDigits.slice(0, 2)}/${expDigits.slice(2, 4)}`;
        const card_cvc = String(paymentForm.value.cvc ?? '').replace(/\D/g, '');

        await api.post('/payment/create', {
            plan_months: plan,
            card_name: String(paymentForm.value.name ?? '').trim(),
            card_number,
            card_exp,
            card_cvc,
        });

        if (authStore.user) {
            authStore.setUser({ ...authStore.user, payment_confirm: true });
        }
        toast.success('Premium üyeliğiniz aktif edildi.', { description: 'Ödeme Başarılı', duration: 5000 });
        close();
    } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Ödeme alınamadı.';
        toast.error(msg, { description: 'Ödeme Hatası', duration: 5000 });
    } finally {
        paymentSubmitting.value = false;
    }
}

function onCardNumberInput(e) {
    const raw = String(e?.target?.value ?? paymentForm.value.number ?? '');
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    const grouped = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    paymentForm.value.number = grouped;
}

function onCardExpInput(e) {
    const raw = String(e?.target?.value ?? paymentForm.value.exp ?? '');
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    const mm = digits.slice(0, 2);
    const yy = digits.slice(2, 4);
    paymentForm.value.exp = yy ? `${mm}/${yy}` : mm;
}

function onCvcInput(e) {
    const raw = String(e?.target?.value ?? paymentForm.value.cvc ?? '');
    paymentForm.value.cvc = raw.replace(/\D/g, '').slice(0, 4);
}
</script>
