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
            <div class="p-6 shrink-0 relative">
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
                        <div
                            v-if="(teklifCurrentCar?.details?.length ?? 0) > 1"
                            class="px-3 pt-1 pb-2"
                        >
                            <p class="text-xs font-medium text-gray-600 mb-2 text-center">Detay seçin</p>
                            <div class="flex flex-wrap gap-2 justify-center">
                                <button
                                    v-for="d in teklifCurrentCar.details"
                                    :key="d.id"
                                    type="button"
                                    class="px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all"
                                    :class="Number(teklifSelectedDetailIdForCurrentCar) === Number(d.id)
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-primary/5'"
                                    @click="selectTeklifDetail(d)"
                                >
                                    {{ d.value || d.name }}
                                </button>
                            </div>
                        </div>
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
                        <div
                            v-if="teklifCars.length && !teklifAracIlanUyumlu"
                            class="mx-3 mb-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2"
                        >
                            <p class="text-xs font-medium leading-5 text-amber-800">
                                Seçtiğiniz araç ilanla tam eşleşmiyor. Yük için uygun olduğunu düşünüyorsanız devam edebilirsiniz.
                            </p>
                        </div>
                    </div>
                    <div v-else class="px-4 py-6">
                        <div class="rounded-xl border-2 border-dashed border-gray-200 bg-white p-5 text-center">
                            <div class="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <i class="pi pi-credit-card text-2xl text-primary" />
                            </div>
                            <div class="text-sm font-semibold text-gray-900">Araçlarımda araç yok</div>
                            <div class="text-xs text-gray-500 mt-1">Araç ekleyin, ardından teklif verebilirsiniz.</div>
                            <button
                                type="button"
                                class="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                                @click="openAddVehicleModal"
                            >
                                <i class="pi pi-plus" />
                                Araç Ekle
                            </button>
                        </div>
                    </div>
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
                        :disabled="teklifSubmitLoading"
                        @click="onTeklifVerClick"
                    >
                        {{ teklifSubmitLoading ? 'Gönderiliyor...' : 'Teklif Ver' }}
                    </button>
                </div>

                <!-- Araç Ekleme (ilan detayında inline modal) -->
                <div
                    v-if="showAddVehicleModal"
                    class="absolute inset-0 bg-white overflow-y-auto p-6"
                    @click.stop
                >
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-900">Araç Ekle</h2>
                        <button
                            type="button"
                            class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                            aria-label="Kapat"
                            @click="closeAddVehicleModal"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="rounded-xl bg-gray-50 overflow-hidden mb-5">
                        <p v-if="addVehiclesError" class="px-4 py-3 text-sm text-red-600">{{ addVehiclesError }}</p>
                        <div v-else-if="addVehiclesLoading" class="flex items-center justify-center py-10">
                            <i class="pi pi-spin pi-spinner text-xl text-primary"></i>
                            <span class="ml-2 text-sm text-gray-500">Araçlar yükleniyor...</span>
                        </div>

                        <div v-else-if="addVehicles.length" class="rounded-lg m-1 border border-primary bg-white">
                            <Carousel
                                v-model="addActiveCarIndex"
                                :items-to-show="1"
                                :wrap-around="true"
                                :transition="400"
                                :mouse-drag="true"
                                :touch-drag="true"
                                @slide-end="onAddCarouselSlideEnd"
                            >
                                <Slide v-for="car in addVehicles" :key="car.id">
                                    <div
                                        class="flex flex-col items-center p-3 cursor-pointer"
                                        @click="selectAddCar(car)"
                                    >
                                        <img
                                            :src="getAddCarImageUrl(car)"
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
                                    v-for="(car, idx) in addVehicles"
                                    :key="car.id"
                                    type="button"
                                    class="w-2.5 h-2.5 rounded-full transition-all shrink-0"
                                    :class="idx === addActiveCarIndex ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'"
                                    :aria-label="`Araç ${idx + 1}`"
                                    @click="goToAddCarSlide(idx)"
                                />
                            </div>
                            <p class="text-center text-sm text-gray-700 pb-3">
                                Seçili araç: <span class="font-medium text-gray-900">{{ addSelectedCarLabel }}</span>
                            </p>
                        </div>

                        <p v-else class="px-4 py-5 text-sm text-gray-500 text-center">Araç listesi bulunamadı.</p>
                    </div>

                    <!-- Detay seçimi -->
                    <div v-if="addSelectedCar?.details?.length" class="rounded-xl border border-gray-200 bg-white p-4 mb-4">
                        <p class="text-sm font-medium text-gray-700 mb-2">Detay seçin</p>
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="d in addSelectedCar.details"
                                :key="d.id"
                                type="button"
                                class="px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all"
                                :class="Number(addSelectedDetailId) === Number(d.id)
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-primary/5'"
                                @click="selectAddDetail(d)"
                            >
                                {{ d.value || d.name }}
                            </button>
                        </div>
                    </div>

                    <!-- Plaka -->
                    <div class="rounded-xl border border-gray-200 bg-white p-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Plaka</label>
                        <input
                            v-model="addPlaka"
                            type="text"
                            placeholder="34 ABC 1234"
                            class="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase"
                            @input="onAddPlakaInput"
                        />
                        <p v-if="addPlakaError" class="text-xs text-red-600 mt-1">{{ addPlakaError }}</p>

                        <div class="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                class="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                @click="closeAddVehicleModal"
                                :disabled="addVehicleLoading"
                            >
                                İptal
                            </button>
                            <button
                                type="button"
                                class="px-4 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                :disabled="!addSelectedCar || addVehicleLoading || !addPlaka.trim()"
                                @click="saveAddVehicle"
                            >
                                <i v-if="addVehicleLoading" class="pi pi-spin pi-spinner mr-2" />
                                Ekle
                            </button>
                        </div>
                    </div>
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
import { useMessageStore } from '@/stores/message';
import { toast } from 'vue-sonner';

const props = defineProps({
    slug: { type: String, default: '' },
    shipment: { type: Object, default: null },
});

const emit = defineEmits(['close', 'success']);

const authStore = useAuthStore();
const messageStore = useMessageStore();
const teklifCars = ref([]);
const teklifCarsLoading = ref(false);
const teklifCarsError = ref(null);
const teklifActiveCarIndex = ref(0);
const teklifCarouselRef = ref(null);
const teklifMessage = ref('');
const teklifFiyatRaw = ref('');
const teklifSubmitLoading = ref(false);
const teklifSubmitError = ref(null);
/** Her araç id → seçilen car_detail id (ilk detay varsayılan) */
const teklifSelectedDetailIdByCarId = ref({});

const teklifCurrentCar = computed(() => {
    const list = teklifCars.value;
    const idx = teklifActiveCarIndex.value;
    return list[idx] ?? null;
});

const teklifSelectedDetailIdForCurrentCar = computed(() => {
    const car = teklifCurrentCar.value;
    if (!car?.id) return null;
    return teklifSelectedDetailIdByCarId.value[car.id] ?? null;
});

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
    const details = car.details ?? [];
    const selId = teklifSelectedDetailIdByCarId.value[car.id];
    let row = selId ? details.find((x) => Number(x.id) === Number(selId)) : null;
    if (!row) row = details[0] ?? car.carDetail ?? car.car_detail;
    const detailVal = row?.value ?? row?.name ?? '';
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
    const details = car.details ?? [];
    const selId = teklifSelectedDetailIdByCarId.value[car.id];
    const fromDetail = selId ? details.find((x) => Number(x.id) === Number(selId)) : null;
    const secilenCarDetailId =
        fromDetail?.id ?? car.carDetail?.id ?? car.car_detail?.id ?? details[0]?.id;
    if (ilanCarId != null && Number(secilenCarId) !== Number(ilanCarId)) return false;
    if (ilanCarDetailId != null && Number(secilenCarDetailId) !== Number(ilanCarDetailId)) return false;
    return true;
});

function toVehicleImageUrl(img) {
    if (!img || typeof img !== 'string') return '';
    if (img.startsWith('http')) return img;
    try {
        return new URL(`../assets/images/vehicles/${img}`, import.meta.url).href;
    } catch {
        return '';
    }
}

function getTeklifCarImageUrl(car) {
    if (!car?.id) return '';
    const details = car.details ?? [];
    const selId = teklifSelectedDetailIdByCarId.value[car.id];
    let detail = selId ? details.find((x) => Number(x.id) === Number(selId)) : null;
    if (!detail) detail = details[0] ?? car.carDetail ?? car.car_detail;
    if (detail?.image) return toVehicleImageUrl(detail.image);
    return toVehicleImageUrl(car?.image);
}

function initTeklifDetailDefaultsForAllCars() {
    const next = {};
    for (const car of teklifCars.value) {
        if (!car?.id) continue;
        const details = car.details ?? [];
        const first = details[0];
        next[car.id] = first?.id ?? car.carDetail?.id ?? car.car_detail?.id ?? null;
    }
    teklifSelectedDetailIdByCarId.value = next;
}

function selectTeklifDetail(d) {
    const car = teklifCurrentCar.value;
    if (!car?.id || d?.id == null) return;
    teklifSelectedDetailIdByCarId.value = {
        ...teklifSelectedDetailIdByCarId.value,
        [car.id]: d.id,
    };
}

// ===== Araç ekleme (ilan detayında inline modal) =====
const showAddVehicleModal = ref(false);
const addVehicles = ref([]);
const addVehiclesLoading = ref(false);
const addVehiclesError = ref(null);
const addActiveCarIndex = ref(0);
const addSelectedCar = ref(null);
const addSelectedDetailId = ref(null);
const addPlaka = ref('');
const addPlakaError = ref('');
const addVehicleLoading = ref(false);

const addSelectedCarLabel = computed(() => addSelectedCar.value?.name ?? '—');

function getAddCarImageUrl(car) {
    if (!car) return '';
    const details = car.details ?? [];
    const isSelected = addSelectedCar.value?.id === car.id;
    if (isSelected && details.length) {
        const sid = addSelectedDetailId.value;
        const picked = sid ? details.find((x) => Number(x.id) === Number(sid)) : details[0];
        if (picked?.image) return toVehicleImageUrl(picked.image);
        if (details[0]?.image) return toVehicleImageUrl(details[0].image);
    }
    return toVehicleImageUrl(car?.image);
}

function selectAddCar(car) {
    addSelectedCar.value = car;
    const details = car?.details ?? [];
    const first = details[0];
    addSelectedDetailId.value = first?.id ?? null;
}

function selectAddDetail(d) {
    addSelectedDetailId.value = d.id;
}

function goToAddCarSlide(idx) {
    addActiveCarIndex.value = idx;
}

function onAddCarouselSlideEnd(e) {
    const idx = e?.currentSlideIndex ?? addActiveCarIndex.value;
    addActiveCarIndex.value = idx;
    const car = addVehicles.value[idx];
    if (car) selectAddCar(car);
}

function formatPlaka(raw) {
    const s = String(raw || '');
    const digits = s.replace(/\D/g, '');
    const letters = s.replace(/[^A-Za-z]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
    const rawFirst = digits.slice(0, 2);
    const num = parseInt(rawFirst, 10) || 0;
    const clamped = Math.min(81, Math.max(1, num));
    const p1 = rawFirst.length >= 2 ? String(clamped).padStart(2, '0') : rawFirst;
    const p2 = letters.slice(0, 3);
    const p3 = digits.slice(2, 6);
    if (!p2.length && !p3.length) return p1;
    if (!p3.length) return p1 + (p1.length ? ' ' : '') + p2;
    return p1 + (p1.length ? ' ' : '') + p2 + (p2.length ? ' ' : '') + p3;
}

function onAddPlakaInput(e) {
    addPlaka.value = formatPlaka(e.target.value);
    addPlakaError.value = '';
}

async function fetchAddVehicles() {
    addVehiclesLoading.value = true;
    addVehiclesError.value = null;
    try {
        const res = await api.get('/cars');
        const content = res.data?.content ?? res.data;
        addVehicles.value = Array.isArray(content?.cars) ? content.cars : [];
        addActiveCarIndex.value = 0;
        const firstCar = addVehicles.value[0] ?? null;
        addSelectedCar.value = firstCar;
        const d0 = firstCar?.details?.[0];
        addSelectedDetailId.value = d0?.id ?? null;
    } catch (err) {
        addVehiclesError.value = err?.response?.data?.message ?? err?.message ?? 'Araçlar yüklenemedi';
        addVehicles.value = [];
        addSelectedCar.value = null;
    } finally {
        addVehiclesLoading.value = false;
    }
}

function openAddVehicleModal() {
    showAddVehicleModal.value = true;
    addPlaka.value = '';
    addPlakaError.value = '';
    addSelectedCar.value = null;
    addSelectedDetailId.value = null;
    addActiveCarIndex.value = 0;
    fetchAddVehicles();
}

function closeAddVehicleModal() {
    showAddVehicleModal.value = false;
}

async function saveAddVehicle() {
    if (!addSelectedCar.value?.id) return;
    if (!addPlaka.value?.trim()) {
        addPlakaError.value = 'Plaka zorunludur.';
        return;
    }
    addPlakaError.value = '';
    addVehicleLoading.value = true;
    try {
        await api.post('/auth/create-car-by-user', {
            car_id: addSelectedCar.value.id,
            car_detail_id: addSelectedDetailId.value || null,
            plaka: addPlaka.value.trim(),
        });
        toast.success('Araç eklendi.', { duration: 5000 });
        closeAddVehicleModal();
        await fetchTeklifCars();
    } catch (err) {
        addPlakaError.value =
            err?.response?.data?.message ||
            err?.response?.data?.error?.plaka?.[0] ||
            'Araç eklenirken hata oluştu.';
    } finally {
        addVehicleLoading.value = false;
    }
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
        toast.success('Teklifiniz başarıyla gönderildi.', { description: 'Teklif Verildi', duration: 5000 });
        const receiverId = props.shipment?.creater_id ?? props.shipment?.creator?.id;

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
        initTeklifDetailDefaultsForAllCars();
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
