<template>
    <div class="flex flex-col h-full overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-gray-900">Adreslerim</h2>
            <button
                type="button"
                class="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                @click="openAddModal"
            >
                <i class="pi pi-plus" style="font-size: 14px;"></i>
                Yeni Adres Ekle
            </button>
        </div>

        <template v-if="loading">
            <div class="flex flex-col items-center justify-center py-12">
                <span class="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin block mb-4" />
                <p class="text-gray-500">Adresler yükleniyor...</p>
            </div>
        </template>
        <template v-else>
            <div v-if="addresses.length === 0" class="border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                <i class="pi pi-map-marker text-4xl text-gray-300 mb-3" />
                <p>Kayıtlı adresiniz bulunmuyor.</p>
                <p class="text-sm mt-1">Yeni adres ekleyerek teslimat adreslerinizi yönetebilirsiniz.</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                    v-for="address in addresses"
                    :key="address.id"
                    class="border border-gray-200 rounded-lg p-4 flex flex-col bg-white hover:shadow-md transition-shadow justify-between"
                >
                <div>
                    <h3 class="text-base font-semibold text-gray-900 mb-2">{{ address.name }}</h3>
                    <p class="text-xs text-gray-500 mb-1">{{ address.city }} / {{ address.district }}</p>
                    <p v-if="address.description" class="text-sm text-gray-600 flex-1 line-clamp-3">{{ address.description }}</p>
                    <span
                        class="inline-flex items-center self-start mt-2 px-2 py-0.5 rounded text-xs font-medium"
                        :class="statusClass(address.status)"
                    >
                        {{ statusLabel(address.status) }}
                    </span>
                </div>
                    <button
                        type="button"
                        class="mt-4 w-full py-2 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                        @click="openEditModal(address)"
                    >
                        <i class="pi pi-pencil" style="font-size: 14px;" />
                        Düzenle
                    </button>
                </div>
            </div>
        </template>

        <!-- Adres düzenleme modalı -->
        <Teleport to="body">
            <Transition name="modal">
                <div
                    v-show="editModalOpen"
                    class="fixed inset-0 z-100 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="edit-address-modal-title"
                >
                    <div class="absolute inset-0 bg-black/50" @click="closeEditModal" />
                    <div
                        class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-5"
                        @click.stop
                    >
                        <div class="flex items-center justify-between mb-4">
                            <h2 id="edit-address-modal-title" class="text-lg font-semibold text-gray-900">
                                Adresi Düzenle
                            </h2>
                            <button
                                type="button"
                                class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                aria-label="Kapat"
                                @click="closeEditModal"
                            >
                                <i class="pi pi-times" style="font-size: 18px;"></i>
                            </button>
                        </div>
                        <form class="flex flex-col gap-4" @submit.prevent="saveAddress">
                            <div>
                                <label for="edit-name" class="block text-sm font-medium text-gray-700 mb-1">Adres adı</label>
                                <input
                                    id="edit-name"
                                    v-model="editForm.name"
                                    type="text"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Örn: Ev Adresim"
                                />
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label for="edit-city" class="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                                    <select
                                        id="edit-city"
                                        v-model="editForm.city_id"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                        @change="onEditCityChange"
                                    >
                                        <option value="">Şehir seçin</option>
                                        <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name }}</option>
                                    </select>
                                    <p v-if="citiesLoading" class="text-xs text-gray-400 mt-0.5">Yükleniyor...</p>
                                </div>
                                <div>
                                    <label for="edit-district" class="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
                                    <select
                                        id="edit-district"
                                        v-model="editForm.district_id"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                        :disabled="!editForm.city_id"
                                    >
                                        <option value="">İlçe seçin</option>
                                        <option v-for="d in editDistricts" :key="d.id" :value="d.id">{{ d.name }}</option>
                                    </select>
                                    <p v-if="editDistrictsLoading" class="text-xs text-gray-400 mt-0.5">Yükleniyor...</p>
                                </div>
                            </div>
                            <div>
                                <label for="edit-desc" class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                <textarea
                                    id="edit-desc"
                                    v-model="editForm.description"
                                    rows="3"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                    placeholder="Mahalle, sokak, bina no vb."
                                />
                            </div>
                            <div>
                                <label for="edit-status" class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                                <select
                                    id="edit-status"
                                    v-model="editForm.status"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Pasif</option>
                                </select>
                            </div>
                            <p v-if="editError" class="text-sm text-red-600">{{ editError }}</p>
                            <div class="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    class="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
                                    @click="closeEditModal"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    class="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    :disabled="editLoading"
                                >
                                    {{ editLoading ? 'Kaydediliyor...' : 'Kaydet' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Yeni adres ekleme modalı -->
        <Teleport to="body">
            <Transition name="modal">
                <div
                    v-show="addModalOpen"
                    class="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="add-address-modal-title"
                >
                    <div class="absolute inset-0 bg-black/50" @click="closeAddModal" />
                    <div
                        class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-5"
                        @click.stop
                    >
                        <div class="flex items-center justify-between mb-4">
                            <h2 id="add-address-modal-title" class="text-lg font-semibold text-gray-900">
                                Yeni Adres Ekle
                            </h2>
                            <button
                                type="button"
                                class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                aria-label="Kapat"
                                @click="closeAddModal"
                            >
                                <i class="pi pi-times" style="font-size: 18px;" />
                            </button>
                        </div>
                        <form class="flex flex-col gap-4" @submit.prevent="createAddress">
                            <div>
                                <label for="add-name" class="block text-sm font-medium text-gray-700 mb-1">Adres adı</label>
                                <input
                                    id="add-name"
                                    v-model="addForm.name"
                                    type="text"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Örn: Ev Adresim"
                                />
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label for="add-city" class="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                                    <select
                                        id="add-city"
                                        v-model="addForm.city_id"
                                        required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                        @change="onAddCityChange"
                                    >
                                        <option value="">Şehir seçin</option>
                                        <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name }}</option>
                                    </select>
                                    <p v-if="citiesLoading" class="text-xs text-gray-400 mt-0.5">Yükleniyor...</p>
                                </div>
                                <div>
                                    <label for="add-district" class="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
                                    <select
                                        id="add-district"
                                        v-model="addForm.district_id"
                                        required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                        :disabled="!addForm.city_id"
                                    >
                                        <option value="">İlçe seçin</option>
                                        <option v-for="d in addDistricts" :key="d.id" :value="d.id">{{ d.name }}</option>
                                    </select>
                                    <p v-if="addDistrictsLoading" class="text-xs text-gray-400 mt-0.5">Yükleniyor...</p>
                                </div>
                            </div>
                            <div>
                                <label for="add-desc" class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                <textarea
                                    id="add-desc"
                                    v-model="addForm.description"
                                    rows="3"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                    placeholder="Mahalle, sokak, bina no vb."
                                />
                            </div>
                            <p v-if="addError" class="text-sm text-red-600">{{ addError }}</p>
                            <div class="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    class="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
                                    @click="closeAddModal"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    class="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    :disabled="addLoading"
                                >
                                    {{ addLoading ? 'Kaydediliyor...' : 'Kaydet' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '@/api';

const loading = ref(true);
const editModalOpen = ref(false);
const editingAddressId = ref(null);
const addModalOpen = ref(false);
const addLoading = ref(false);
const addError = ref('');
const editLoading = ref(false);
const editError = ref('');

const cities = ref([]);
const citiesLoading = ref(false);
const addDistricts = ref([]);
const addDistrictsLoading = ref(false);
const editDistricts = ref([]);
const editDistrictsLoading = ref(false);

const editForm = reactive({
    name: '',
    city_id: '',
    district_id: '',
    description: '',
    status: 'pending'
});

const addForm = reactive({
    name: '',
    city_id: '',
    district_id: '',
    description: '',
    status: 'pending'
});

const addresses = ref([]);

function statusLabel(status) {
    const labels = { active: 'Aktif', inactive: 'Pasif', pending: 'Beklemede' };
    return labels[status] ?? status;
}

function statusClass(status) {
    const classes = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-700',
        pending: 'bg-amber-100 text-amber-800'
    };
    return classes[status] ?? 'bg-gray-100 text-gray-600';
}

async function fetchCities() {
    if (cities.value.length) return;
    citiesLoading.value = true;
    try {
        const res = await api.get('/locations/cities');
        const content = res.data?.content;
        cities.value = Array.isArray(content) ? content : [];
    } catch (err) {
        console.error('Şehirler yüklenemedi:', err);
        cities.value = [];
    } finally {
        citiesLoading.value = false;
    }
}

async function fetchAddDistricts(cityId) {
    addDistricts.value = [];
    if (!cityId) return;
    addDistrictsLoading.value = true;
    try {
        const res = await api.get(`/locations/cities/${cityId}/districts`);
        const content = res.data?.content;
        addDistricts.value = Array.isArray(content) ? content : [];
    } catch (err) {
        console.error('İlçeler yüklenemedi:', err);
        addDistricts.value = [];
    } finally {
        addDistrictsLoading.value = false;
    }
}

async function fetchEditDistricts(cityId) {
    editDistricts.value = [];
    if (!cityId) return;
    editDistrictsLoading.value = true;
    try {
        const res = await api.get(`/locations/cities/${cityId}/districts`);
        const content = res.data?.content;
        editDistricts.value = Array.isArray(content) ? content : [];
    } catch (err) {
        console.error('İlçeler yüklenemedi:', err);
        editDistricts.value = [];
    } finally {
        editDistrictsLoading.value = false;
    }
}

async function fetchAddresses() {
    try {
        loading.value = true;
        const response = await api.get('/addresses');
        const { content } = response.data;
        addresses.value = content?.addresses ?? [];
    } catch (err) {
        console.error('Adresler yüklenemedi:', err);
        addresses.value = [];
    } finally {
        loading.value = false;
    }
}

function onAddCityChange() {
    addForm.district_id = '';
    fetchAddDistricts(addForm.city_id);
}

function onEditCityChange() {
    editForm.district_id = '';
    fetchEditDistricts(editForm.city_id);
}

async function openEditModal(address) {
    editingAddressId.value = address.id;
    editForm.name = address.name ?? '';
    editForm.description = address.description ?? '';
    editForm.status = address.status ?? 'pending';
    editForm.city_id = '';
    editForm.district_id = '';
    editDistricts.value = [];
    await fetchCities();
    const city = cities.value.find((c) => c.name === address.city);
    if (city) {
        editForm.city_id = city.id;
        await fetchEditDistricts(city.id);
        const district = editDistricts.value.find((d) => d.name === address.district);
        if (district) editForm.district_id = district.id;
    }
    editModalOpen.value = true;
}

function closeEditModal() {
    editModalOpen.value = false;
    editingAddressId.value = null;
    editError.value = '';
}

async function saveAddress() {
    const address = addresses.value.find((a) => a.id === editingAddressId.value);
    if (!address) return;
    const city = cities.value.find((c) => c.id === Number(editForm.city_id));
    const district = editDistricts.value.find((d) => d.id === Number(editForm.district_id));
    if (!city || !district) {
        editError.value = 'Şehir ve ilçe seçin.';
        return;
    }
    editError.value = '';
    editLoading.value = true;
    try {
        await api.put(`/addresses/${editingAddressId.value}`, {
            name: editForm.name.trim(),
            city: city.name,
            district: district.name,
            description: (editForm.description || '').trim() || null,
            status: editForm.status
        });
        closeEditModal();
        await fetchAddresses();
    } catch (err) {
        const msg = err?.response?.data?.message ?? err?.response?.data?.errors ?? err?.message ?? 'Adres güncellenirken bir hata oluştu.';
        editError.value = typeof msg === 'object' ? Object.values(msg).flat().join(' ') : msg;
    } finally {
        editLoading.value = false;
    }
}

async function openAddModal() {
    addForm.name = '';
    addForm.city_id = '';
    addForm.district_id = '';
    addForm.description = '';
    addForm.status = 'pending';
    addError.value = '';
    addDistricts.value = [];
    await fetchCities();
    addModalOpen.value = true;
}

function closeAddModal() {
    addModalOpen.value = false;
    addError.value = '';
}

async function createAddress() {
    const city = cities.value.find((c) => c.id === Number(addForm.city_id));
    const district = addDistricts.value.find((d) => d.id === Number(addForm.district_id));
    if (!city || !district) {
        addError.value = 'Şehir ve ilçe seçin.';
        return;
    }
    addError.value = '';
    addLoading.value = true;
    try {
        await api.post('/addresses', {
            name: addForm.name.trim(),
            city: city.name,
            district: district.name,
            description: addForm.description?.trim() || null,
            status: addForm.status
        });
        closeAddModal();
        await fetchAddresses();
    } catch (err) {
        const msg = err?.response?.data?.message ?? err?.response?.data?.errors ?? err?.message ?? 'Adres eklenirken bir hata oluştu.';
        addError.value = typeof msg === 'object' ? Object.values(msg).flat().join(' ') : msg;
    } finally {
        addLoading.value = false;
    }
}

onMounted(() => {
    fetchAddresses();
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
.modal-enter-active .relative.bg-white,
.modal-leave-active .relative.bg-white {
    transition: transform 0.2s ease;
}
.modal-enter-from .relative.bg-white,
.modal-leave-to .relative.bg-white {
    transform: scale(0.95);
}
</style>
