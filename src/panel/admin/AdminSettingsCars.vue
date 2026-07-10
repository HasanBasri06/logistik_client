<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Araçlar</h1>
                <p class="mt-2 text-sm text-gray-500">Katalog araçlarını görüntüleyin, ekleyin ve güncelleyin.</p>
            </div>
            <button
                type="button"
                class="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:brightness-105"
                @click="openCreateModal"
            >
                <i class="pi pi-plus" />
                Yeni Araç Ekle
            </button>
        </div>

        <div class="mt-6">
            <input
                v-model="searchQuery"
                type="search"
                placeholder="Araç adı ile ara..."
                class="h-11 w-full max-w-md rounded-lg border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                @input="onSearchInput"
            />
        </div>

        <div v-if="loading && !cars.length" class="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
            <i class="pi pi-spin pi-spinner" />
            Yükleniyor...
        </div>

        <div v-else-if="error" class="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ error }}
        </div>

        <div v-else-if="!cars.length" class="mt-10 text-center text-sm text-gray-500">
            Araç bulunamadı.
        </div>

        <div v-else class="mt-8 overflow-x-auto">
            <table class="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead>
                    <tr class="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <th class="px-3 py-3">Görsel</th>
                        <th class="px-3 py-3">Ad</th>
                        <th class="px-3 py-3">Fiyat</th>
                        <th class="px-3 py-3">Km Maliyeti</th>
                        <th class="px-3 py-3">Durum</th>
                        <th class="px-3 py-3">Sıra</th>
                        <th class="px-3 py-3">Varyant</th>
                        <th class="px-3 py-3 text-right">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="car in cars"
                        :key="car.id"
                        class="border-b border-gray-100 transition-colors hover:bg-gray-50"
                    >
                        <td class="px-3 py-3">
                            <img
                                v-if="car.image_url"
                                :src="car.image_url"
                                :alt="car.name"
                                class="h-10 w-14 rounded object-contain bg-gray-50"
                            />
                            <span v-else class="text-xs text-gray-400">—</span>
                        </td>
                        <td class="px-3 py-3 font-medium text-gray-900">{{ car.name }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ formatNumber(car.price) }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ formatNumber(car.cost_per_km) }}</td>
                        <td class="px-3 py-3">
                            <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium" :class="statusClass(car.status)">
                                {{ statusLabel(car.status) }}
                            </span>
                        </td>
                        <td class="px-3 py-3 text-gray-600">{{ car.order }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ car.details_count }}</td>
                        <td class="px-3 py-3 text-right">
                            <button
                                type="button"
                                class="inline-flex h-9 items-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                @click="openEditModal(car)"
                            >
                                Düzenle
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Teleport to="body">
            <div
                v-if="formModalOpen"
                class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-4"
                @click.self="closeFormModal"
            >
                <div
                    class="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6 max-h-[90vh] overflow-y-auto transition-all duration-200"
                    :class="detailsExpanded ? 'max-w-3xl' : 'max-w-lg'"
                >
                    <h3 class="text-lg font-semibold text-gray-900">
                        {{ formMode === 'create' ? 'Yeni Araç Ekle' : 'Araç Düzenle' }}
                    </h3>

                    <form class="mt-5 space-y-4" @submit.prevent="submitForm">
                        <div>
                            <label class="text-sm font-medium text-gray-700">Ad</label>
                            <input v-model="form.name" type="text" required class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm" />
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700">Görsel</label>
                            <input
                                type="file"
                                accept="image/*"
                                class="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
                                @change="onImageChange"
                            />
                            <img
                                v-if="imagePreview"
                                :src="imagePreview"
                                alt="Önizleme"
                                class="mt-3 h-20 w-28 rounded-lg border border-gray-200 bg-gray-50 object-contain"
                            />
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-sm font-medium text-gray-700">Fiyat</label>
                                <input v-model="form.price" type="number" min="0" step="0.01" class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm" />
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-700">Km maliyeti</label>
                                <input v-model="form.cost_per_km" type="number" min="0" step="0.01" class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm" />
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-sm font-medium text-gray-700">Genişlik</label>
                                <input v-model="form.width" type="number" min="0" step="0.01" class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm" />
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-700">Yükseklik</label>
                                <input v-model="form.height" type="number" min="0" step="0.01" class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm" />
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-sm font-medium text-gray-700">Durum</label>
                                <select v-model="form.status" class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm">
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Pasif</option>
                                    <option value="pending">Beklemede</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-700">Sıra</label>
                                <input v-model="form.order" type="number" min="0" class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm" />
                            </div>
                        </div>

                        <div class="border-t border-gray-100 pt-4">
                            <button
                                type="button"
                                class="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-100"
                                @click="detailsExpanded = !detailsExpanded"
                            >
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">Ek Seçenekler</p>
                                    <p class="mt-0.5 text-xs text-gray-500">
                                        Detay görselleri ve varyantları yönetin
                                        <span v-if="activeDetailsCount">({{ activeDetailsCount }})</span>
                                    </p>
                                </div>
                                <i
                                    class="pi text-gray-500"
                                    :class="detailsExpanded ? 'pi-chevron-up' : 'pi-chevron-down'"
                                />
                            </button>

                            <div v-show="detailsExpanded" class="mt-4 space-y-4">
                                <p v-if="!visibleCarDetails.length" class="rounded-lg border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
                                    Henüz ek seçenek eklenmedi.
                                </p>

                                <div
                                    v-for="(detail, index) in visibleCarDetails"
                                    :key="detail.key"
                                    class="rounded-xl border border-gray-200 bg-gray-50/70 p-4"
                                >
                                    <div class="mb-3 flex items-center justify-between gap-3">
                                        <p class="text-sm font-semibold text-gray-900">Seçenek {{ index + 1 }}</p>
                                        <button
                                            type="button"
                                            class="inline-flex h-8 items-center rounded-lg border border-red-200 px-3 text-xs font-medium text-red-600 hover:bg-red-50"
                                            @click="removeDetail(detail.key)"
                                        >
                                            Sil
                                        </button>
                                    </div>

                                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div>
                                            <label class="text-sm font-medium text-gray-700">Ad</label>
                                            <input
                                                v-model="detail.name"
                                                type="text"
                                                placeholder="Örn. Dorse Tipi"
                                                class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label class="text-sm font-medium text-gray-700">Değer</label>
                                            <input
                                                v-model="detail.value"
                                                type="text"
                                                placeholder="Örn. Tenteli Dorse"
                                                class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div class="mt-3">
                                        <label class="text-sm font-medium text-gray-700">Detay Görseli</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            class="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
                                            @change="onDetailImageChange(detail, $event)"
                                        />
                                        <img
                                            v-if="detail.imagePreview"
                                            :src="detail.imagePreview"
                                            :alt="detail.value || 'Detay görseli'"
                                            class="mt-3 h-24 w-36 rounded-lg border border-gray-200 bg-white object-contain"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    class="inline-flex h-10 items-center gap-2 rounded-lg border border-dashed border-primary/40 px-4 text-sm font-medium text-primary hover:bg-primary/5"
                                    @click="addDetail"
                                >
                                    <i class="pi pi-plus" />
                                    Yeni Seçenek Ekle
                                </button>
                            </div>
                        </div>

                        <div class="flex justify-end gap-2 pt-2">
                            <button type="button" class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" :disabled="submitting" @click="closeFormModal">
                                Vazgeç
                            </button>
                            <button type="submit" class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-60" :disabled="submitting">
                                {{ submitting ? 'Kaydediliyor...' : (formMode === 'create' ? 'Ekle' : 'Kaydet') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();

const cars = ref([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const formModalOpen = ref(false);
const formMode = ref('create');
const editingCarId = ref(null);
const submitting = ref(false);
const imageFile = ref(null);
const imagePreview = ref('');
const detailsExpanded = ref(false);
const carDetails = ref([]);
const form = ref(emptyForm());
let searchTimer = null;
let detailKeyCounter = 0;

const visibleCarDetails = computed(() => carDetails.value.filter((detail) => !detail._delete));
const activeDetailsCount = computed(() => visibleCarDetails.value.length);

function emptyForm() {
    return {
        name: '',
        price: '',
        cost_per_km: '',
        status: 'active',
        order: 0,
        width: '',
        height: '',
    };
}

function formatNumber(value) {
    if (value == null || value === '') return '—';
    return Number(value).toLocaleString('tr-TR');
}

function statusLabel(status) {
    const labels = { active: 'Aktif', inactive: 'Pasif', pending: 'Beklemede' };
    return labels[status] || status;
}

function statusClass(status) {
    if (status === 'active') return 'bg-green-50 text-green-700';
    if (status === 'pending') return 'bg-amber-50 text-amber-700';
    return 'bg-gray-100 text-gray-600';
}

function emptyDetail() {
    detailKeyCounter += 1;
    return {
        key: `detail-${detailKeyCounter}`,
        id: null,
        name: '',
        value: '',
        imagePreview: '',
        imageFile: null,
        _delete: false,
    };
}

function resetDetailsState(details = []) {
    carDetails.value = details.map((detail) => ({
        key: `detail-${detail.id ?? ++detailKeyCounter}`,
        id: detail.id ?? null,
        name: detail.name ?? '',
        value: detail.value ?? '',
        imagePreview: detail.image_url ?? '',
        imageFile: null,
        _delete: false,
    }));
    detailsExpanded.value = carDetails.value.length > 0;
}

function addDetail() {
    carDetails.value.push(emptyDetail());
    detailsExpanded.value = true;
}

function removeDetail(key) {
    const detail = carDetails.value.find((item) => item.key === key);
    if (!detail) return;
    if (detail.id) {
        detail._delete = true;
        return;
    }
    carDetails.value = carDetails.value.filter((item) => item.key !== key);
}

function onDetailImageChange(detail, event) {
    const file = event.target.files?.[0] ?? null;
    detail.imageFile = file;
    if (!file) return;
    detail.imagePreview = URL.createObjectURL(file);
}

function resetImageState(previewUrl = '') {
    imageFile.value = null;
    imagePreview.value = previewUrl;
}

function openCreateModal() {
    formMode.value = 'create';
    editingCarId.value = null;
    form.value = emptyForm();
    resetImageState();
    resetDetailsState();
    formModalOpen.value = true;
}

function openEditModal(car) {
    formMode.value = 'edit';
    editingCarId.value = car.id;
    form.value = {
        name: car.name ?? '',
        price: car.price ?? '',
        cost_per_km: car.cost_per_km ?? '',
        status: car.status ?? 'active',
        order: car.order ?? 0,
        width: car.width ?? '',
        height: car.height ?? '',
    };
    resetImageState(car.image_url || '');
    resetDetailsState(car.details ?? []);
    formModalOpen.value = true;
}

function closeFormModal() {
    if (submitting.value) return;
    formModalOpen.value = false;
}

function onImageChange(event) {
    const file = event.target.files?.[0] ?? null;
    imageFile.value = file;
    if (!file) {
        return;
    }
    imagePreview.value = URL.createObjectURL(file);
}

function buildFormData() {
    const payload = new FormData();
    payload.append('name', form.value.name.trim());
    payload.append('status', form.value.status);
    payload.append('order', String(Number(form.value.order) || 0));
    if (form.value.price !== '') payload.append('price', String(form.value.price));
    if (form.value.cost_per_km !== '') payload.append('cost_per_km', String(form.value.cost_per_km));
    if (form.value.width !== '') payload.append('width', String(form.value.width));
    if (form.value.height !== '') payload.append('height', String(form.value.height));
    if (imageFile.value) payload.append('image', imageFile.value);

    carDetails.value.forEach((detail, index) => {
        if (detail.id) payload.append(`details[${index}][id]`, String(detail.id));
        payload.append(`details[${index}][name]`, detail.name.trim());
        payload.append(`details[${index}][value]`, detail.value.trim());
        if (detail._delete) {
            payload.append(`details[${index}][_delete]`, '1');
            return;
        }
        if (detail.imageFile) {
            payload.append(`details[${index}][image]`, detail.imageFile);
        }
    });

    return payload;
}

async function fetchCars() {
    loading.value = true;
    error.value = '';
    try {
        const result = await adminStore.fetchAdminCars(searchQuery.value.trim());
        if (!result.success) {
            error.value = result.error || 'Araçlar yüklenemedi.';
            cars.value = [];
            return;
        }
        cars.value = result.cars;
    } finally {
        loading.value = false;
    }
}

async function submitForm() {
    if (submitting.value) return;
    submitting.value = true;
    try {
        const payload = buildFormData();
        const result = formMode.value === 'create'
            ? await adminStore.createAdminCar(payload)
            : await adminStore.updateAdminCar(editingCarId.value, payload);

        if (!result.success) {
            toast.error(result.error || 'İşlem başarısız.', { duration: 5000 });
            return;
        }
        toast.success(formMode.value === 'create' ? 'Araç eklendi.' : 'Araç güncellendi.', { duration: 5000 });
        formModalOpen.value = false;
        fetchCars();
    } finally {
        submitting.value = false;
    }
}

function onSearchInput() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(fetchCars, 300);
}

onMounted(fetchCars);
</script>
