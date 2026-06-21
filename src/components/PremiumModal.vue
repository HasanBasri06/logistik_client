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
                <form
                    class="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[92vh] overflow-hidden flex flex-col"
                    @submit.prevent="handleSubmit"
                >
                    <div class="p-3 sm:p-6 pb-4 overflow-y-auto">
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
                        <div v-if="step === 1" class="grid grid-cols-2 auto-rows-fr gap-2 sm:gap-3 items-stretch">
                            <button
                                v-for="plan in plans"
                                :key="plan.id"
                                type="button"
                                class="relative min-h-[168px] sm:h-[225px] flex flex-col items-start justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all text-left shadow-sm"
                                :class="selectedPlan?.id === plan.id
                                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                    : 'border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 hover:shadow-md'"
                                @click="selectPlan(plan)"
                            >
                                <div
                                    v-if="plan.badge"
                                    class="absolute -top-2 right-2 sm:right-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider z-10 shadow-sm"
                                    :class="plan.badge === 'Popüler'
                                        ? 'border border-red-200 bg-red-50 text-red-600'
                                        : 'border border-blue-200 bg-blue-50 text-blue-700'"
                                >
                                    <i v-if="plan.badge === 'Önerilen'" class="pi pi-bolt text-[10px] text-blue-600"></i>
                                    <span v-else-if="plan.badge === 'Popüler'" class="text-red-500 text-[11px] leading-none">🔥</span>
                                    {{ plan.badge }}
                                </div>
                                <div class="flex items-start justify-between w-full gap-2 pt-6 sm:pt-7">
                                    <div class="pr-1 sm:pr-6 min-w-0">
                                        <div class="text-sm sm:text-base font-bold leading-tight text-gray-900 wrap-break-word">{{ plan.name }}</div>
                                        <div class="text-xs sm:text-sm font-semibold text-gray-700 mt-1 wrap-break-word">{{ plan.totalPrice }}</div>
                                    </div>
                                    <i v-if="selectedPlan?.id === plan.id" class="pi pi-check-circle text-primary text-xl"></i>
                                </div>
                                <div class="mt-3 sm:mt-4 w-full rounded-lg sm:rounded-xl border border-gray-100 bg-gray-50/80 px-2.5 sm:px-3 py-2">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <p class="text-[11px] sm:text-sm font-semibold text-primary leading-snug">
                                            Aylık maliyet: {{ plan.monthlyCost }}
                                        </p>
                                    </div>
                                    <div v-if="plan.showDiscount" class="text-[11px] sm:text-xs text-emerald-600 font-semibold mt-1 leading-snug">
                                        İndirim: {{ plan.discountAmount }} ({{ plan.discountRate }})
                                    </div>
                                </div>
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
                                            <p class="text-sm font-semibold">{{ selectedPlan?.name || '—' }}</p>
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
                                        <p class="text-sm font-semibold text-gray-900 truncate">{{ selectedPlan?.name || '—' }}</p>
                                        <div
                                            v-if="selectedPlan"
                                            class="mt-2 flex items-center gap-2 flex-wrap"
                                        >
                                            <p class="text-xs font-semibold text-primary whitespace-nowrap">
                                                Aylık maliyet: {{ selectedPlan.monthlyCost }}
                                            </p>
                                        </div>
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

                    <div class="px-4 sm:px-6 py-4 border-t border-gray-100 flex justify-between gap-2">
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
                            type="submit"
                            class="px-4 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                            :disabled="!selectedPlan"
                        >
                            Premium'a geç
                        </button>
                        <button
                            v-else
                            type="submit"
                            class="px-4 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                            :disabled="paymentSubmitting"
                        >
                            {{ paymentSubmitting ? 'İşleniyor...' : 'Ödemeyi tamamla' }}
                        </button>
                    </div>
                </form>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { usePricingPlansStore } from '@/stores/pricingPlans';
import api from '@/api';
import { toast } from 'vue-sonner';

const authStore = useAuthStore();
const { showPremiumModal } = storeToRefs(authStore);

const show = computed(() => !!showPremiumModal.value);
const { plans } = storeToRefs(usePricingPlansStore());

const step = ref(1); // 1: plan seçimi, 2: ödeme bilgileri (UI)
/** Store’daki tam plan nesnesi (servise gönderilecek) */
const selectedPlan = ref(null);

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

function selectPlan(plan) {
    selectedPlan.value = plan;
}

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
    selectedPlan.value = null;
    paymentForm.value = { name: '', number: '', exp: '', cvc: '' };
    paymentErrors.value = { name: '', number: '', exp: '', cvc: '', plan: '' };
    paymentSubmitting.value = false;
}

function goToPayment() {
    if (!selectedPlan.value) return;
    step.value = 2;
}

function handleSubmit() {
    if (step.value === 1) {
        goToPayment();
        return;
    }
    void submitPayment();
}

function validatePaymentForm() {
    const errs = { name: '', number: '', exp: '', cvc: '', plan: '' };

    if (!selectedPlan.value) errs.plan = 'Lütfen paket seçin.';

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
            const currentYear2 = new Date().getFullYear() % 100;
            if (year2 < currentYear2) {
                // errs.exp = 'Kartın son kullanma yılı geçmiş olamaz.';
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
        const p = selectedPlan.value;
        const plan_months = p?.months ?? null;
        const card_number = String(paymentForm.value.number ?? '').replace(/\D/g, '');
        const expDigits = String(paymentForm.value.exp ?? '').replace(/\D/g, '').slice(0, 4);
        const card_cvc = String(paymentForm.value.cvc ?? '').replace(/\D/g, '');

        const planPayload = p
            ? {
                  id: p.id,
                  months: p.months,
                  name: p.name,
                  description: p.description,
                  badge: p.badge,
                  duration_label: p.durationLabel,
                  total_numeric: p.totalNumeric,
                  total_price: p.totalPrice,
                  monthly_cost: p.monthlyCost,
                  discount_amount: p.discountAmount,
                  discount_rate: p.discountRate,
                  show_discount: p.showDiscount,
              }
            : null;

        const mm = expDigits.slice(0, 2).padStart(2, '0');
        const yy = expDigits.slice(2, 4);

        const res = await api.post(
            '/payment/create',
            {
                plan: planPayload,
                plan_months,
                cc_owner: String(paymentForm.value.name ?? '').trim(),
                card_number,
                expiry_month: mm,
                expiry_year: yy,
                cvv: card_cvc,
            },
            { timeout: 120000 }
        );

        if (res.status < 200 || res.status >= 300) {
            toast.error(res.data?.message || 'Ödeme isteği tamamlanamadı.', { description: 'Ödeme', duration: 5000 });
            return;
        }

        const content = res.data?.content;
        const isObj = content !== null && typeof content === 'object';
        const merchantOid =
            isObj && typeof content.merchant_oid === 'string' ? content.merchant_oid.trim() : '';
        if (merchantOid) {
            try {
                sessionStorage.setItem('paytr_pending_merchant_oid', merchantOid);
            } catch {
                /* ignore */
            }
        }
        const redirectUrl = isObj ? content.paytr_redirect_url || content.location : undefined;
        const html =
            isObj && typeof content.paytr_html === 'string'
                ? content.paytr_html
                : typeof content === 'string' && content.trim() !== ''
                  ? content
                  : null;

        if (redirectUrl && typeof redirectUrl === 'string') {
            window.location.assign(redirectUrl);
            return;
        }

        if (html) {
            const w = window.open('', '_self');
            if (w) {
                w.document.open();
                w.document.write(html);
                w.document.close();
                return;
            }
            toast.error('3D doğrulama sayfası açılamadı.', { duration: 6000 });
            return;
        }

        if (isObj && content.status === 'paid') {
            await authStore.checkToken();
            toast.success(res.data?.message || 'Ödeme başarılı.', {
                description: 'Premium hesabınız aktif edildi.',
                duration: 6000,
            });
            try {
                sessionStorage.removeItem('paytr_pending_merchant_oid');
            } catch {
                /* ignore */
            }
            close();
            return;
        }

        const pending =
            isObj && (content.status === 'pending' || content.status === 'wait_callback');
        if (pending) {
            toast.success(res.data?.message || 'Ödeme işlemi devam ediyor.', {
                description: 'Onay sonrası premium aktif olacaktır.',
                duration: 6000,
            });
            close();
            return;
        }

        toast.error(res.data?.message || 'Ödeme adımı başlatılamadı. Lütfen tekrar deneyin.', {
            description: 'Ödeme',
            duration: 6000,
        });
    } catch (err) {
        let msg = err?.response?.data?.message || err?.message || 'Ödeme alınamadı.';
        if (err?.code === 'ECONNABORTED') {
            msg =
                'İstek zaman aşımına uğradı. Sunucunun PayTR ile iletişimi uzun sürdü; tekrar deneyin veya API adresini (VITE_APP_SERVER_URL) kontrol edin.';
        } else if (err?.message === 'Network Error' && !err?.response) {
            msg =
                'Ağ hatası: Laravel API’ye erişilemedi (CORS, yanlış URL, SSL veya sunucu kapalı). VITE_APP_SERVER_URL ve php artisan serve kontrol edin.';
        }
        toast.error(msg, { description: 'Ödeme Hatası', duration: 7000 });
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
