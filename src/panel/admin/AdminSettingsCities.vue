<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">Şehirler</h1>
        <p class="mt-2 text-sm text-gray-500">Şehirleri güncelleyin ve ilçe ekleyin.</p>

        <div class="mt-6">
            <input
                v-model="searchQuery"
                type="search"
                placeholder="Şehir adı ile ara..."
                class="h-11 w-full max-w-md rounded-lg border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                @input="onSearchInput"
            />
        </div>

        <div v-if="loading && !cities.length" class="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
            <i class="pi pi-spin pi-spinner" />
            Yükleniyor...
        </div>

        <div v-else-if="error" class="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ error }}
        </div>

        <div v-else-if="!cities.length" class="mt-10 text-center text-sm text-gray-500">
            Şehir bulunamadı.
        </div>

        <div v-else class="mt-8 overflow-x-auto">
            <table class="w-full min-w-[700px] border-collapse text-left text-sm">
                <thead>
                    <tr class="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <th class="px-3 py-3">Şehir</th>
                        <th class="px-3 py-3">Kod</th>
                        <th class="px-3 py-3">İlçe Sayısı</th>
                        <th class="px-3 py-3 text-right">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="city in cities"
                        :key="city.id"
                        class="border-b border-gray-100 transition-colors hover:bg-gray-50 cursor-pointer"
                        @click="openDistrictsModal(city)"
                    >
                        <td class="px-3 py-3 font-medium text-gray-900">{{ city.name }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ city.code || '—' }}</td>
                        <td class="px-3 py-3 text-gray-600">{{ city.districts_count }}</td>
                        <td class="px-3 py-3 text-right">
                            <button
                                type="button"
                                class="inline-flex h-9 items-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                @click.stop="openEditCityModal(city)"
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
                v-if="districtsModal"
                class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-4"
                @click.self="closeDistrictsModal"
            >
                <div class="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6 max-h-[90vh] flex flex-col">
                    <h3 class="text-lg font-semibold text-gray-900">{{ districtsModal.name }} — İlçeler</h3>
                    <p class="mt-1 text-sm text-gray-500">Yeni ilçe ekleyin veya mevcut ilçeleri düzenleyin.</p>

                    <form class="mt-4 flex gap-2" @submit.prevent="submitAddDistrict">
                        <input
                            v-model="newDistrictName"
                            type="text"
                            required
                            placeholder="Yeni ilçe adı"
                            class="h-11 flex-1 rounded-lg border border-gray-200 px-3 text-sm"
                        />
                        <button
                            type="submit"
                            class="h-11 shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-60"
                            :disabled="districtSubmitting"
                        >
                            Ekle
                        </button>
                    </form>

                    <div v-if="districtsLoading" class="mt-6 flex items-center gap-2 text-sm text-gray-500">
                        <i class="pi pi-spin pi-spinner" />
                        İlçeler yükleniyor...
                    </div>

                    <div v-else-if="districtsError" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {{ districtsError }}
                    </div>

                    <div v-else class="mt-4 flex-1 overflow-y-auto min-h-0">
                        <p v-if="!districts.length" class="py-8 text-center text-sm text-gray-500">Bu şehirde ilçe yok.</p>
                        <ul v-else class="space-y-2">
                            <li
                                v-for="district in districts"
                                :key="district.id"
                                class="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                            >
                                <template v-if="editingDistrictId === district.id">
                                    <input
                                        v-model="editingDistrictName"
                                        type="text"
                                        class="h-9 flex-1 rounded-lg border border-gray-200 px-3 text-sm"
                                        @keyup.enter="submitEditDistrict(district.id)"
                                    />
                                    <button type="button" class="text-sm font-medium text-primary" @click="submitEditDistrict(district.id)">Kaydet</button>
                                    <button type="button" class="text-sm text-gray-500" @click="cancelEditDistrict">Vazgeç</button>
                                </template>
                                <template v-else>
                                    <span class="text-sm text-gray-800">{{ district.name }}</span>
                                    <div class="flex items-center gap-2">
                                        <button type="button" class="text-sm font-medium text-gray-600 hover:text-primary" @click="startEditDistrict(district)">Düzenle</button>
                                        <button type="button" class="text-sm font-medium text-red-600 hover:text-red-700" @click="submitDeleteDistrict(district)">Sil</button>
                                    </div>
                                </template>
                            </li>
                        </ul>
                    </div>

                    <div class="mt-5 flex justify-end">
                        <button type="button" class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" @click="closeDistrictsModal">
                            Kapat
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <Teleport to="body">
            <div
                v-if="editCityModal"
                class="fixed inset-0 z-[10001] flex items-center justify-center bg-black/55 p-4"
                @click.self="closeEditCityModal"
            >
                <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6">
                    <h3 class="text-lg font-semibold text-gray-900">Şehir Düzenle</h3>
                    <form class="mt-5 space-y-4" @submit.prevent="submitEditCity">
                        <div>
                            <label class="text-sm font-medium text-gray-700">Şehir adı</label>
                            <input v-model="cityForm.name" type="text" required class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm" />
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700">Kod</label>
                            <input v-model="cityForm.code" type="text" class="mt-1 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm" />
                        </div>
                        <div class="flex justify-end gap-2">
                            <button type="button" class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" :disabled="citySubmitting" @click="closeEditCityModal">
                                Vazgeç
                            </button>
                            <button type="submit" class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" :disabled="citySubmitting">
                                {{ citySubmitting ? 'Kaydediliyor...' : 'Kaydet' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();

const cities = ref([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
let searchTimer = null;

const districtsModal = ref(null);
const districts = ref([]);
const districtsLoading = ref(false);
const districtsError = ref('');
const newDistrictName = ref('');
const districtSubmitting = ref(false);
const editingDistrictId = ref(null);
const editingDistrictName = ref('');

const editCityModal = ref(null);
const cityForm = ref({ name: '', code: '' });
const citySubmitting = ref(false);

async function fetchCities() {
    loading.value = true;
    error.value = '';
    try {
        const result = await adminStore.fetchAdminCities(searchQuery.value.trim());
        if (!result.success) {
            error.value = result.error || 'Şehirler yüklenemedi.';
            cities.value = [];
            return;
        }
        cities.value = result.cities;
    } finally {
        loading.value = false;
    }
}

async function openDistrictsModal(city) {
    districtsModal.value = city;
    newDistrictName.value = '';
    editingDistrictId.value = null;
    await loadDistricts(city.id);
}

async function loadDistricts(cityId) {
    districtsLoading.value = true;
    districtsError.value = '';
    try {
        const result = await adminStore.fetchAdminCityDistricts(cityId);
        if (!result.success) {
            districtsError.value = result.error || 'İlçeler yüklenemedi.';
            districts.value = [];
            return;
        }
        districts.value = result.districts;
    } finally {
        districtsLoading.value = false;
    }
}

function closeDistrictsModal() {
    districtsModal.value = null;
    districts.value = [];
}

async function submitAddDistrict() {
    if (!districtsModal.value || districtSubmitting.value) return;
    const name = newDistrictName.value.trim();
    if (!name) return;

    districtSubmitting.value = true;
    try {
        const result = await adminStore.createAdminDistrict(districtsModal.value.id, name);
        if (!result.success) {
            toast.error(result.error || 'İlçe eklenemedi.', { duration: 5000 });
            return;
        }
        toast.success('İlçe eklendi.', { duration: 5000 });
        newDistrictName.value = '';
        await loadDistricts(districtsModal.value.id);
        fetchCities();
    } finally {
        districtSubmitting.value = false;
    }
}

function startEditDistrict(district) {
    editingDistrictId.value = district.id;
    editingDistrictName.value = district.name;
}

function cancelEditDistrict() {
    editingDistrictId.value = null;
    editingDistrictName.value = '';
}

async function submitEditDistrict(districtId) {
    const name = editingDistrictName.value.trim();
    if (!name) return;

    const result = await adminStore.updateAdminDistrict(districtId, name);
    if (!result.success) {
        toast.error(result.error || 'İlçe güncellenemedi.', { duration: 5000 });
        return;
    }
    toast.success('İlçe güncellendi.', { duration: 5000 });
    cancelEditDistrict();
    if (districtsModal.value) {
        await loadDistricts(districtsModal.value.id);
    }
}

async function submitDeleteDistrict(district) {
    if (!window.confirm(`"${district.name}" ilçesini silmek istediğinize emin misiniz?`)) return;

    const result = await adminStore.deleteAdminDistrict(district.id);
    if (!result.success) {
        toast.error(result.error || 'İlçe silinemedi.', { duration: 5000 });
        return;
    }
    toast.success('İlçe silindi.', { duration: 5000 });
    if (districtsModal.value) {
        await loadDistricts(districtsModal.value.id);
        fetchCities();
    }
}

function openEditCityModal(city) {
    editCityModal.value = city;
    cityForm.value = { name: city.name ?? '', code: city.code ?? '' };
}

function closeEditCityModal() {
    if (citySubmitting.value) return;
    editCityModal.value = null;
}

async function submitEditCity() {
    if (!editCityModal.value || citySubmitting.value) return;
    citySubmitting.value = true;
    try {
        const result = await adminStore.updateAdminCity(editCityModal.value.id, {
            name: cityForm.value.name.trim(),
            code: cityForm.value.code.trim() || null,
        });
        if (!result.success) {
            toast.error(result.error || 'Şehir güncellenemedi.', { duration: 5000 });
            return;
        }
        toast.success('Şehir güncellendi.', { duration: 5000 });
        editCityModal.value = null;
        fetchCities();
    } finally {
        citySubmitting.value = false;
    }
}

function onSearchInput() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(fetchCities, 300);
}

onMounted(fetchCities);
</script>
