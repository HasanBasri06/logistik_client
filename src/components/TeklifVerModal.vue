<template>
    <div
        class="fixed inset-0 z-50 flex"
        aria-modal="true"
        role="dialog"
        aria-labelledby="teklif-modal-title"
    >
        <div
            class="absolute inset-0 bg-black/30 transition-opacity"
            aria-hidden="true"
            @click="$emit('close')"
        />
        <div
            class="relative left-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl overflow-y-auto flex flex-col z-10"
        >
            <div class="p-6 shrink-0">
                <div class="flex items-center justify-between mb-4">
                    <h2 id="teklif-modal-title" class="text-lg font-semibold text-gray-900">Teklif Ver</h2>
                    <button
                        type="button"
                        class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="Kapat"
                        @click="$emit('close')"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <h2 class="text-md font-semibold text-gray-800 mb-2">Araçlarım</h2>
                <div class="rounded-xl bg-gray-50 overflow-hidden mb-5">
                    <p v-if="teklifCarsError" class="px-4 py-3 text-sm text-red-600">{{ teklifCarsError }}</p>
                    <div v-else-if="teklifCarsLoading" class="flex items-center justify-center py-10">
                        <i class="pi pi-spin pi-spinner text-xl text-primary"></i>
                        <span class="ml-2 text-sm text-gray-500">Araçlar yükleniyor...</span>
                    </div>
                    <div v-else-if="teklifCars.length" class="rounded-lg m-1 border border-primary bg-white">
                        <Carousel
                            ref="teklifCarouselRef"
                            v-model="teklifActiveCarIndex"
                            :items-to-show="1"
                            :wrap-around="true"
                            :transition="400"
                            :mouse-drag="true"
                            :touch-drag="true"
                            @slide-end="onTeklifCarouselSlideEnd"
                        >
                            <Slide v-for="car in teklifCars" :key="car.id">
                                <div class="flex flex-col items-center p-3">
                                    <img
                                        :src="getTeklifCarImageUrl(car)"
                                        :alt="car.name"
                                        class="h-40 w-full object-contain"
                                        @error="($e) => ($e.target.src = '')"
                                    />
                                    <span class="mt-2 text-sm font-medium text-gray-800">{{ car.name }}</span>
                                </div>
                            </Slide>
                        </Carousel>
                        <div class="flex justify-center gap-2 pb-2">
                            <button
                                v-for="(car, idx) in teklifCars"
                                :key="car.id"
                                type="button"
                                class="w-2.5 h-2.5 rounded-full transition-all shrink-0"
                                :class="idx === teklifActiveCarIndex ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'"
                                :aria-label="`Araç ${idx + 1}`"
                                @click="goToTeklifSlide(idx)"
                            />
                        </div>
                        <p class="text-center text-sm text-gray-700 pb-3">
                            Seçili araç: <span class="font-medium text-gray-900">{{ teklifSeciliAracLabel }}</span>
                        </p>
                        <p
                            v-if="teklifCars.length && !teklifAracIlanUyumlu"
                            class="text-center text-sm font-medium text-red-600 pb-2"
                        >
                            Seçilen araç ilan ile uyumlu değil
                        </p>
                    </div>
                    <p v-else class="px-4 py-5 text-sm text-gray-500 text-center">Araç listesi bulunamadı.</p>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Mesaj (isteğe bağlı)</label>
                        <textarea
                            v-model="teklifMessage"
                            rows="3"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 max-h-32 min-h-32 focus:ring-primary focus:border-primary"
                            placeholder="Teklifinizle birlikte göndermek istediğiniz not..."
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺)</label>
                        <input
                            v-model="teklifFiyatRaw"
                            type="text"
                            inputmode="numeric"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="0"
                            @input="onTeklifFiyatInput"
                        />
                        <p v-if="teklifFiyatFormatted" class="mt-1 text-sm text-gray-500">Tutar: {{ teklifFiyatFormatted }}</p>
                    </div>
                    <p v-if="teklifSubmitError" class="text-sm text-red-600">{{ teklifSubmitError }}</p>
                    <button
                        type="button"
                        class="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        :disabled="teklifSubmitLoading || !teklifAracIlanUyumlu"
                        @click="onTeklifVerClick"
                    >
                        {{ teklifSubmitLoading ? 'Gönderiliyor...' : 'Teklif Ver' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/carousel.css';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
    slug: { type: String, default: '' },
    shipment: { type: Object, default: null },
});

const emit = defineEmits(['close', 'success']);

const authStore = useAuthStore();
const teklifCars = ref([]);
const teklifCarsLoading = ref(false);
const teklifCarsError = ref(null);
const teklifActiveCarIndex = ref(0);
const teklifCarouselRef = ref(null);
const teklifMessage = ref('');
const teklifFiyatRaw = ref('');
const teklifSubmitLoading = ref(false);
const teklifSubmitError = ref(null);

function onTeklifFiyatInput(e) {
    const v = (e.target?.value ?? '').replace(/\D/g, '');
    teklifFiyatRaw.value = v;
    if (e.target) e.target.value = v;
}

const teklifFiyatFormatted = computed(() => {
    const raw = teklifFiyatRaw.value;
    if (!raw) return '';
    const num = parseInt(raw, 10);
    if (Number.isNaN(num)) return '';
    return num.toLocaleString('tr-TR') + ' ₺';
});

const teklifSeciliAracLabel = computed(() => {
    const list = teklifCars.value;
    const idx = teklifActiveCarIndex.value;
    const car = list[idx];
    if (!car) return '—';
    const name = car.name ?? '';
    const detailVal = car.carDetail?.value ?? car.car_detail?.value ?? car.details?.[0]?.value ?? '';
    const d = String(detailVal).trim();
    if (!d) return name || '—';
    return `${name} ${d}`.trim() || '—';
});

const teklifAracIlanUyumlu = computed(() => {
    const s = props.shipment;
    const list = teklifCars.value;
    const idx = teklifActiveCarIndex.value;
    const car = list[idx];
    if (!s || !car) return true;
    const ilanCarId = s.car_id ?? s.car?.id;
    const ilanCarDetailId = s.car_detail_id ?? s.get_car_detail?.id ?? s.getCarDetail?.id;
    const secilenCarId = car.id;
    const secilenCarDetailId = car.carDetail?.id ?? car.car_detail?.id;
    if (ilanCarId != null && Number(secilenCarId) !== Number(ilanCarId)) return false;
    if (ilanCarDetailId != null && Number(secilenCarDetailId) !== Number(ilanCarDetailId)) return false;
    return true;
});

function getTeklifCarImageUrl(car) {
    const toUrl = (img) => {
        if (!img || typeof img !== 'string') return '';
        if (img.startsWith('http')) return img;
        try {
            return new URL(`../assets/images/vehicles/${img}`, import.meta.url).href;
        } catch {
            return '';
        }
    };
    const detail = car?.carDetail ?? car?.car_detail;
    if (detail?.image) return toUrl(detail.image);
    return toUrl(car?.image);
}

function onTeklifCarouselSlideEnd(e) {
    teklifActiveCarIndex.value = e?.currentSlideIndex ?? teklifActiveCarIndex.value;
}

function goToTeklifSlide(idx) {
    teklifActiveCarIndex.value = idx;
    teklifCarouselRef.value?.slideTo?.(idx);
}

async function onTeklifVerClick() {
    const slug = props.slug;
    const shipmentId = props.shipment?.id;
    const userId = authStore.user?.id;
    const selectedCar = teklifCars.value[teklifActiveCarIndex.value];
    const carType = selectedCar?.id;
    const priceRaw = teklifFiyatRaw.value;
    const price = priceRaw ? parseInt(priceRaw, 10) : 0;

    if (!slug || !shipmentId) {
        teklifSubmitError.value = 'İlan bilgisi bulunamadı.';
        return;
    }
    if (!userId) {
        teklifSubmitError.value = 'Giriş yapmanız gerekiyor.';
        return;
    }
    if (!carType) {
        teklifSubmitError.value = 'Lütfen bir araç seçin.';
        return;
    }
    if (!price || price <= 0) {
        teklifSubmitError.value = 'Lütfen geçerli bir fiyat girin.';
        return;
    }

    teklifSubmitError.value = null;
    teklifSubmitLoading.value = true;
    try {
        await api.post(`/shipments/${slug}/requests`, {
            message: teklifMessage.value?.trim() || null,
            shipment_id: shipmentId,
            user_id: userId,
            car_type: carType,
            price,
        });
        teklifMessage.value = '';
        teklifFiyatRaw.value = '';
        emit('close');
        emit('success');
    } catch (err) {
        teklifSubmitError.value = err?.response?.data?.message ?? err?.message ?? 'Teklif gönderilemedi.';
    } finally {
        teklifSubmitLoading.value = false;
    }
}

async function fetchTeklifCars() {
    teklifCarsLoading.value = true;
    teklifCarsError.value = null;
    try {
        const res = await api.get('/cars/my');
        const content = res.data?.content;
        const raw = content?.cars ?? [];
        teklifCars.value = raw.map((uc) => {
            const car = uc?.car ?? uc;
            const carDetail = uc?.carDetail ?? uc?.car_detail;
            if (!car) return null;
            return { ...car, carDetail };
        }).filter(Boolean);
        teklifActiveCarIndex.value = 0;
    } catch (err) {
        teklifCarsError.value = err?.response?.data?.message ?? err?.message ?? 'Araçlar yüklenemedi';
        teklifCars.value = [];
    } finally {
        teklifCarsLoading.value = false;
    }
}

watch(() => props.slug, (slug) => {
    if (slug && !teklifCars.value.length) fetchTeklifCars();
}, { immediate: true });
</script>
