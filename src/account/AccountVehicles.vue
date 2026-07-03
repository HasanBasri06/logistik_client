<template>
    <div class="flex flex-col h-full overflow-y-auto px-1">
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Araçlarım</h1>
            <p class="text-gray-500 mt-1 text-sm">Eklediğiniz araçları yönetin ve yeni araç ekleyin.</p>
        </div>

        <template v-if="myCarsLoading && !myCars.length">
            <div class="flex flex-col items-center justify-center py-16 rounded-2xl bg-gray-50/80 border border-gray-100">
                <i class="pi pi-spin pi-spinner text-3xl text-primary mb-4"></i>
                <span class="text-gray-500">Araçlarınız yükleniyor...</span>
            </div>
        </template>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <!-- Yeni araç ekle kartı -->
            <button
                type="button"
                @click="openAddVehicleModal"
                class="vehicle-card add-card group flex flex-col items-center justify-center min-h-[320px] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
            >
                <div class="w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
                    <i class="pi pi-plus text-3xl text-primary"></i>
                </div>
                <span class="text-base font-semibold text-gray-600 group-hover:text-primary transition-colors">Yeni araç ekle</span>
                <span class="text-sm text-gray-400 mt-1">Tıklayarak araç ekleyin</span>
            </button>

            <!-- Araç kartları -->
            <div
                v-for="userCar in myCars"
                :key="userCar.id"
                class="vehicle-card group relative flex flex-col min-h-[320px] rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300"
            >
                <!-- Üst: araç adı + detay -->
                <div class="px-5 pt-5 pb-2">
                    <h3 class="text-lg font-semibold text-gray-900 truncate">{{ userCar.car?.name || 'Araç' }}</h3>
                    <p v-if="userCar.carDetail" class="text-sm text-gray-500 mt-0.5 truncate">{{ userCar.carDetail.value || userCar.carDetail.name }}</p>
                </div>

                <!-- Orta: resim -->
                <div class="flex-1 flex items-center justify-center px-4 py-4 min-h-[140px] bg-gray-50/50">
                    <img
                        :src="getUserCarCardImageUrl(userCar)"
                        :alt="userCar.car?.name"
                        class="max-h-[140px] w-full object-contain"
                    />
                </div>

                <!-- Alt: plaka (TR plakası stili) + düzenle (API: plate veya plaka) -->
                <div class="px-5 py-4 flex items-center justify-between gap-2 bg-gray-50/30 border-t border-gray-100 min-w-0">
                    <div v-if="userCar.plate" class="inline-flex items-stretch max-w-full h-[30px] min-w-0 border-2 border-slate-900 rounded overflow-hidden bg-white shadow shrink">
                        <span class="flex items-center justify-center w-6 min-w-[24px] bg-[#003399] text-white text-[10px] font-extrabold tracking-tight">TR</span>
                        <span class="flex items-center px-1.5 text-[11px] font-black text-slate-900 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis min-w-0">{{ userCar.plate || userCar.plaka }}</span>
                    </div>
                    <span v-else class="text-sm text-gray-400">—</span>
                    <button
                        type="button"
                        @click.stop="editVehicle(userCar)"
                        class="edit-vehicle-btn ml-auto shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 border border-primary shadow-sm hover:shadow transition-all"
                    >
                        <i class="pi pi-pencil text-sm"></i>
                        Düzenle
                    </button>
                </div>
            </div>
        </div>

        <!-- Araç Düzenleme Modal -->
        <div
            v-if="showEditVehicleModal"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            @click.self="closeEditVehicleModal"
        >
            <div class="bg-white shadow-xl overflow-hidden flex flex-col rounded-lg w-full max-w-md max-h-[90vh]">
                <div class="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
                    <h3 class="text-xl font-semibold text-gray-900">Araç Düzenle</h3>
                    <button type="button" @click="closeEditVehicleModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <i class="pi pi-times" style="font-size: 20px;"></i>
                    </button>
                </div>
                <div class="p-6 flex-1 min-h-0 overflow-y-auto">
                    <p class="text-sm text-gray-500 mb-1">Araç</p>
                    <p class="text-lg font-semibold text-gray-900 mb-4">{{ editingUserCar?.car?.name || 'Araç' }} <span v-if="editingUserCar?.carDetail" class="text-sm font-normal text-gray-500">({{ editingUserCar.carDetail.value || editingUserCar.carDetail.name }})</span></p>

                    <p class="text-sm font-medium text-gray-700 mb-1">Araç Fotoğrafları</p>
                    <p class="text-xs text-gray-500 mb-3">İsteğe bağlı — en fazla 2 adet (JPG, PNG, WEBP · max 5MB)</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                        <div
                            v-for="slot in editVehicleImageSlots"
                            :key="slot.key"
                            class="rounded-xl border border-dashed border-gray-300 bg-gray-50 overflow-hidden min-h-[120px] flex flex-col"
                        >
                            <img
                                v-if="slot.preview"
                                :src="slot.preview"
                                :alt="`Araç fotoğrafı ${slot.index}`"
                                class="w-full h-28 object-cover"
                            />
                            <div v-else class="flex-1 flex flex-col items-center justify-center gap-1 p-3 text-center">
                                <i class="pi pi-camera text-xl text-gray-400"></i>
                                <span class="text-xs text-gray-500">Fotoğraf {{ slot.index }}</span>
                            </div>
                            <div class="flex border-t border-gray-200 bg-white">
                                <label class="flex-1 py-2 text-center text-sm font-medium text-primary cursor-pointer hover:bg-primary/5">
                                    {{ slot.preview ? 'Değiştir' : 'Yükle' }}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        class="hidden"
                                        @change="(e) => handleEditVehicleImageSelect(slot.key, e)"
                                    />
                                </label>
                                <button
                                    v-if="slot.preview"
                                    type="button"
                                    class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 border-l border-gray-200"
                                    @click="clearEditVehicleImage(slot.key)"
                                >
                                    Kaldır
                                </button>
                            </div>
                        </div>
                    </div>

                    <label for="edit-plaka-input" class="block text-sm font-medium text-gray-700 mb-1">Plaka <span class="text-red-500">*</span></label>
                    <input
                        id="edit-plaka-input"
                        :value="editPlate"
                        type="text"
                        placeholder="34 ABC 1234"
                        maxlength="13"
                        autocomplete="off"
                        :class="['w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary uppercase', editPlakaError ? 'border-red-400 bg-red-50/50' : 'border-gray-300']"
                        @input="onEditPlakaInput"
                    />
                    <p v-if="editPlakaError" class="text-xs text-red-500 mt-1">{{ editPlakaError }}</p>
                </div>
                <div class="flex justify-between items-center gap-3 p-6 border-t border-gray-200">
                    <div class="flex-1 min-w-0"></div>
                    <div class="flex items-center gap-3 shrink-0">
                        <button type="button" @click="closeEditVehicleModal" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">İptal</button>
                        <button type="button" @click="deleteVehicle" class="px-6 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 border border-red-600 transition-colors">Araç Sil</button>
                        <button type="button" @click="saveEditVehicle" :disabled="editVehicleLoading || !editPlate.trim()" :class="['px-6 py-2 rounded-lg font-medium transition-colors', editVehicleLoading || !editPlate.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90']">
                            <i v-if="editVehicleLoading" class="pi pi-spin pi-spinner mr-2"></i>
                            Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Yeni Araç Ekleme Modal -->
        <div 
            v-if="showAddVehicleModal"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            @click.self="closeAddVehicleModal"
        >
            <div class="bg-white shadow-xl overflow-hidden flex flex-col rounded-lg transition-all duration-300 md:w-[60vw] md:max-w-[40vw] md:h-[70vh] md:max-h-[70vh] w-full h-full">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
                    <h3 class="text-xl font-semibold text-gray-900">Yeni Araç Ekle</h3>
                    <button
                        @click="closeAddVehicleModal"
                        class="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <i class="pi pi-times" style="font-size: 20px;"></i>
                    </button>
                </div>
                
                <!-- Modal Content - Tek sayfa: araç seçimi -->
                <div class="flex-1 min-h-0 flex flex-col overflow-hidden p-0">
                    <div class="vehicle-carousel-fullscreen">
                        <template v-if="carsLoading">
                            <div class="flex flex-1 items-center justify-center">
                                <i class="pi pi-spin pi-spinner text-3xl text-primary"></i>
                                <span class="ml-3 text-gray-500">Araçlar yükleniyor...</span>
                            </div>
                        </template>
                        <template v-else-if="!carsFromApi.length">
                            <div class="flex flex-1 items-center justify-center text-gray-500">
                                <span>Araç listesi bulunamadı.</span>
                            </div>
                        </template>
                        <template v-else>
                            <!-- Tek araç: carousel yok, tek kart + beyaz alan -->
                            <div v-if="carsFromApi.length === 1" class="flex flex-col flex-1 min-h-0">
                                <div class="vehicle-slide single-vehicle-slide flex flex-col items-center justify-center flex-1 bg-white">
                                    <div class="vehicle-slide cursor-pointer" @click="selectVehicleFromSlide(carsFromApi[0])">
                                        <img :src="getDisplayImage(carsFromApi[0])" :alt="carsFromApi[0].name" class="vehicle-slide-image" />
                                        <span class="vehicle-slide-label">{{ carsFromApi[0].name }}</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Birden fazla araç: carousel -->
                            <template v-else>
                                <Carousel
                                    v-model:page="carouselPage"
                                    :value="carsFromApi"
                                    :num-visible="1"
                                    :num-scroll="1"
                                    circular
                                    :show-indicators="true"
                                    :show-navigators="true"
                                    class="vehicle-select-carousel"
                                >
                                    <template #item="{ data }">
                                        <div class="vehicle-slide" @click="selectVehicleFromSlide(data)">
                                            <img :src="getDisplayImage(data)" :alt="data.name" class="vehicle-slide-image" />
                                            <span class="vehicle-slide-label">{{ data.name }}</span>
                                        </div>
                                    </template>
                                </Carousel>
                            </template>
                            <!-- Detay seçimi: araçta detay varsa butonlar -->
                            <div
                                v-if="selectedCar && selectedCar.details && selectedCar.details.length"
                                class="mt-4 px-4 pb-2 shrink-0"
                            >
                                <p class="text-sm font-medium text-gray-700 mb-2">Detay seçin</p>
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        v-for="d in selectedCar.details"
                                        :key="d.id"
                                        type="button"
                                        @click="selectDetail(d)"
                                        class="px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all"
                                        :class="selectedDetailId === d.id
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-primary/5'"
                                    >
                                        {{ d.value || d.name }}
                                    </button>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- İsteğe bağlı araç fotoğrafları -->
                <div class="px-6 pb-2 shrink-0">
                    <p class="text-sm font-medium text-gray-700 mb-1">Araç Fotoğrafları</p>
                    <p class="text-xs text-gray-500 mb-3">İsteğe bağlı — en fazla 2 adet (JPG, PNG, WEBP · max 5MB)</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                            v-for="slot in vehicleImageSlots"
                            :key="slot.key"
                            class="rounded-xl border border-dashed border-gray-300 bg-gray-50 overflow-hidden min-h-[120px] flex flex-col"
                        >
                            <img
                                v-if="slot.preview"
                                :src="slot.preview"
                                :alt="`Araç fotoğrafı ${slot.index}`"
                                class="w-full h-28 object-cover"
                            />
                            <div v-else class="flex-1 flex flex-col items-center justify-center gap-1 p-3 text-center">
                                <i class="pi pi-camera text-xl text-gray-400"></i>
                                <span class="text-xs text-gray-500">Fotoğraf {{ slot.index }}</span>
                            </div>
                            <div class="flex border-t border-gray-200 bg-white">
                                <label class="flex-1 py-2 text-center text-sm font-medium text-primary cursor-pointer hover:bg-primary/5">
                                    {{ slot.preview ? 'Değiştir' : 'Yükle' }}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        class="hidden"
                                        @change="(e) => handleVehicleImageSelect(slot.key, e)"
                                    />
                                </label>
                                <button
                                    v-if="slot.preview"
                                    type="button"
                                    class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 border-l border-gray-200"
                                    @click="clearVehicleImage(slot.key)"
                                >
                                    Kaldır
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Modal Footer - Plaka (sol) | İptal + Ekle (sağ) -->
                <div class="flex justify-between items-center gap-4 p-6 border-t border-gray-200">
                    <div class="flex-1 min-w-0 max-w-xs">
                        <label for="plaka-input" class="block text-sm font-medium text-gray-700 mb-1">Plaka <span class="text-red-500">*</span></label>
                        <input
                            id="plaka-input"
                            :value="plaka"
                            type="text"
                            placeholder="34 ABC 1234"
                            maxlength="13"
                            autocomplete="off"
                            :class="['w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary uppercase', plakaError ? 'border-red-400 bg-red-50/50' : 'border-gray-300']"
                            @input="onPlakaInput"
                        />
                        <p v-if="plakaError" class="text-xs text-red-500 mt-1">{{ plakaError }}</p>
                    </div>
                    <div class="flex items-center gap-3 shrink-0 mt-5">
                        <button
                            type="button"
                            @click="closeAddVehicleModal"
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            İptal
                        </button>
                        <button
                            type="button"
                            @click="saveVehicle"
                            :disabled="!selectedCar || addVehicleLoading || !plaka.trim()"
                            :class="[
                                'px-6 py-2 rounded-lg font-medium transition-colors',
                                !selectedCar || addVehicleLoading || !plaka.trim()
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-primary text-white hover:bg-primary/90'
                            ]"
                        >
                            <i v-if="addVehicleLoading" class="pi pi-spin pi-spinner mr-2"></i>
                            Ekle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import Carousel from 'primevue/carousel';
import api from '@/api';
import { createUserCar, updateUserCar, userCarImageUrl } from '@/lib/userCarApi';

const showEditVehicleModal = ref(false);
const editingUserCar = ref(null);
const editPlate = ref('');
const editPlakaError = ref('');
const editVehicleLoading = ref(false);

const MAX_VEHICLE_IMAGE_MB = 5;

const editVehicleImage1File = ref(null);
const editVehicleImage2File = ref(null);
const editVehicleImage1Preview = ref('');
const editVehicleImage2Preview = ref('');
const editRemoveImage1 = ref(false);
const editRemoveImage2 = ref(false);

const editVehicleImageSlots = computed(() => [
    { key: 1, index: 1, preview: editRemoveImage1.value ? '' : editVehicleImage1Preview.value },
    { key: 2, index: 2, preview: editRemoveImage2.value ? '' : editVehicleImage2Preview.value },
]);

function revokeEditVehiclePreview(url) {
    if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
}

function resetEditVehicleImages() {
    revokeEditVehiclePreview(editVehicleImage1Preview.value);
    revokeEditVehiclePreview(editVehicleImage2Preview.value);
    editVehicleImage1File.value = null;
    editVehicleImage2File.value = null;
    editVehicleImage1Preview.value = '';
    editVehicleImage2Preview.value = '';
    editRemoveImage1.value = false;
    editRemoveImage2.value = false;
}

function clearEditVehicleImage(slot) {
    if (slot === 1) {
        if (editVehicleImage1File.value) {
            revokeEditVehiclePreview(editVehicleImage1Preview.value);
            editVehicleImage1File.value = null;
            editVehicleImage1Preview.value = editingUserCar.value ? (userCarImageUrl(editingUserCar.value, 1) ?? '') : '';
            editRemoveImage1.value = !editVehicleImage1Preview.value;
        } else {
            revokeEditVehiclePreview(editVehicleImage1Preview.value);
            editVehicleImage1Preview.value = '';
            editRemoveImage1.value = true;
        }
        return;
    }
    if (editVehicleImage2File.value) {
        revokeEditVehiclePreview(editVehicleImage2Preview.value);
        editVehicleImage2File.value = null;
        editVehicleImage2Preview.value = editingUserCar.value ? (userCarImageUrl(editingUserCar.value, 2) ?? '') : '';
        editRemoveImage2.value = !editVehicleImage2Preview.value;
    } else {
        revokeEditVehiclePreview(editVehicleImage2Preview.value);
        editVehicleImage2Preview.value = '';
        editRemoveImage2.value = true;
    }
}

function handleEditVehicleImageSelect(slot, event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) return;
    if (file.size > MAX_VEHICLE_IMAGE_MB * 1024 * 1024) return;
    if (slot === 1) {
        revokeEditVehiclePreview(editVehicleImage1Preview.value);
        editVehicleImage1File.value = file;
        editVehicleImage1Preview.value = URL.createObjectURL(file);
        editRemoveImage1.value = false;
        return;
    }
    revokeEditVehiclePreview(editVehicleImage2Preview.value);
    editVehicleImage2File.value = file;
    editVehicleImage2Preview.value = URL.createObjectURL(file);
    editRemoveImage2.value = false;
}

function editVehicle(userCar) {
    editingUserCar.value = userCar;
    editPlate.value = userCar.plate ?? userCar.plaka ?? '';
    editPlakaError.value = '';
    resetEditVehicleImages();
    editVehicleImage1Preview.value = userCarImageUrl(userCar, 1) ?? '';
    editVehicleImage2Preview.value = userCarImageUrl(userCar, 2) ?? '';
    showEditVehicleModal.value = true;
}

function closeEditVehicleModal() {
    showEditVehicleModal.value = false;
    editingUserCar.value = null;
    editPlate.value = '';
    editPlakaError.value = '';
    resetEditVehicleImages();
}

function onEditPlakaInput(e) {
    editPlate.value = formatPlaka(e.target.value);
    editPlakaError.value = '';
}

async function saveEditVehicle() {
    const uc = editingUserCar.value;
    if (!uc?.id || !editPlate.value?.trim()) {
        editPlakaError.value = 'Plaka zorunludur.';
        return;
    }
    editPlakaError.value = '';
    editVehicleLoading.value = true;
    try {
        await updateUserCar(uc.id, editPlate.value.trim(), {
            vehicleImages: [editVehicleImage1File.value, editVehicleImage2File.value],
            removeImages: [editRemoveImage1.value, editRemoveImage2.value],
        });
        closeEditVehicleModal();
        await fetchMyCars();
    } catch (err) {
        editPlakaError.value = err.response?.data?.message || 'Güncellenirken hata oluştu.';
        console.error(err);
    } finally {
        editVehicleLoading.value = false;
    }
}

async function deleteVehicle() {
    const uc = editingUserCar.value;
    if (!uc?.id) return;
    if (!confirm('Bu aracı silmek istediğinize emin misiniz?')) return;
    editVehicleLoading.value = true;
    try {
        await api.delete(`/cars/my/${uc.id}`);
        closeEditVehicleModal();
        await fetchMyCars();
    } catch (err) {
        editPlakaError.value = err.response?.data?.message || 'Silinirken hata oluştu.';
        console.error(err);
    } finally {
        editVehicleLoading.value = false;
    }
}

// Benim araçlarım (sayfa listesi) - GET /cars/my
const myCars = ref([]);
const myCarsLoading = ref(false);

// Modal: tüm araçlar (ekleme seçenekleri) - GET /cars
const carsFromApi = ref([]);
const carsLoading = ref(false);
const showAddVehicleModal = ref(false);
const addVehicleLoading = ref(false);
const carouselPage = ref(0);
const selectedCar = ref(null);
const selectedDetailId = ref(null);
const plaka = ref('');
const plakaError = ref('');

const vehicleImage1File = ref(null);
const vehicleImage2File = ref(null);
const vehicleImage1Preview = ref('');
const vehicleImage2Preview = ref('');

const vehicleImageSlots = computed(() => [
    { key: 1, index: 1, preview: vehicleImage1Preview.value },
    { key: 2, index: 2, preview: vehicleImage2Preview.value },
]);

function revokeVehiclePreview(url) {
    if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
}

function clearVehicleImage(slot) {
    if (slot === 1) {
        revokeVehiclePreview(vehicleImage1Preview.value);
        vehicleImage1File.value = null;
        vehicleImage1Preview.value = '';
        return;
    }
    revokeVehiclePreview(vehicleImage2Preview.value);
    vehicleImage2File.value = null;
    vehicleImage2Preview.value = '';
}

function handleVehicleImageSelect(slot, event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) return;
    if (file.size > MAX_VEHICLE_IMAGE_MB * 1024 * 1024) return;
    if (slot === 1) {
        revokeVehiclePreview(vehicleImage1Preview.value);
        vehicleImage1File.value = file;
        vehicleImage1Preview.value = URL.createObjectURL(file);
        return;
    }
    revokeVehiclePreview(vehicleImage2Preview.value);
    vehicleImage2File.value = file;
    vehicleImage2Preview.value = URL.createObjectURL(file);
}

function getUserCarCardImageUrl(userCar) {
    return getCarImageUrl(userCar.carDetail?.image || userCar.car?.image);
}

/**
 * Plaka maskeleme: 2 rakam (01-81 il kodu, sadece sayı) + boşluk + 1-3 harf (A-Z) + boşluk + 1-4 rakam
 */
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

function onPlakaInput(e) {
    plaka.value = formatPlaka(e.target.value);
    plakaError.value = '';
}

function getCarImageUrl(image) {
    if (!image) return '';
    if (typeof image === 'string' && image.startsWith('http')) return image;
    try {
        return new URL(`../assets/images/vehicles/${image}`, import.meta.url).href;
    } catch {
        return '';
    }
}

/** Seçili araç bu kart ise ve detay seçiliyse detay resmini, yoksa aracın resmini döner */
function getDisplayImage(car) {
    if (!car) return '';
    const isSelectedCar = selectedCar.value?.id === car.id;
    if (isSelectedCar && selectedDetailId.value && car.details?.length) {
        const detail = car.details.find((d) => d.id === selectedDetailId.value);
        if (detail?.image) return getCarImageUrl(detail.image);
    }
    return getCarImageUrl(car.image);
}

async function fetchMyCars() {
    myCarsLoading.value = true;
    try {
        const res = await api.get('/cars/my');
        const content = res.data?.content ?? res.data;
        myCars.value = Array.isArray(content?.cars) ? content.cars : [];
    } catch (err) {
        console.error(err);
        myCars.value = [];
    } finally {
        myCarsLoading.value = false;
    }
}

async function fetchCars() {
    carsLoading.value = true;
    try {
        const res = await api.get('/cars');
        const content = res.data?.content ?? res.data;
        carsFromApi.value = Array.isArray(content?.cars) ? content.cars : [];
    } catch (err) {
        console.error(err);
        carsFromApi.value = [];
    } finally {
        carsLoading.value = false;
        if (carsFromApi.value.length) {
            selectedCar.value = carsFromApi.value[0];
            if (carsFromApi.value.length === 1) carouselPage.value = 0;
        }
    }
}

watch(carouselPage, (page) => {
    const list = carsFromApi.value;
    if (list.length && page >= 0 && page < list.length) {
        selectedCar.value = list[page];
        selectedDetailId.value = null;
    }
});

const selectVehicleFromSlide = (data) => {
    selectedCar.value = data;
    selectedDetailId.value = null;
    const idx = carsFromApi.value.findIndex((c) => c.id === data.id);
    if (idx >= 0) carouselPage.value = idx;
};

const selectDetail = (d) => {
    selectedDetailId.value = d.id;
};

const openAddVehicleModal = () => {
    showAddVehicleModal.value = true;
    carouselPage.value = 0;
    selectedCar.value = null;
    selectedDetailId.value = null;
    fetchCars();
};

const closeAddVehicleModal = () => {
    showAddVehicleModal.value = false;
    selectedCar.value = null;
    selectedDetailId.value = null;
    plaka.value = '';
    plakaError.value = '';
    carouselPage.value = 0;
    clearVehicleImage(1);
    clearVehicleImage(2);
};

async function saveVehicle() {
    const car = selectedCar.value;
    if (!car?.id) return;
    if (!plaka.value?.trim()) {
        plakaError.value = 'Plaka zorunludur.';
        return;
    }
    plakaError.value = '';
    addVehicleLoading.value = true;
    try {
        await createUserCar(
            {
                car_id: car.id,
                car_detail_id: selectedDetailId.value || null,
                plaka: plaka.value.trim(),
            },
            [vehicleImage1File.value, vehicleImage2File.value]
        );
        closeAddVehicleModal();
        await fetchMyCars();
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error?.plaka?.[0] || 'Araç eklenirken hata oluştu.';
        plakaError.value = typeof msg === 'string' ? msg : 'Plaka zorunludur.';
        console.error(err);
    } finally {
        addVehicleLoading.value = false;
    }
}

// Sayfa açıldığında benim araçlarımı getir (UserCar listesi)
onMounted(fetchMyCars);
</script>

<style scoped>
/* Araç seçim - PrimeVue Carousel */
.vehicle-carousel-fullscreen {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    margin: 1rem 1.5rem;
}

.single-vehicle-slide {
    background: #fff;
}

.vehicle-select-carousel {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.vehicle-select-carousel :deep(.p-carousel-content-container) {
    flex: 1;
    position: relative;
    min-height: 0;
}

.vehicle-select-carousel :deep(.p-carousel-content) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    position: relative;
}

.vehicle-select-carousel :deep(.p-carousel-prev-button),
.vehicle-select-carousel :deep(.p-carousel-next-button) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    background-color: color-mix(in srgb, var(--p-primary-color, #6366f1) 25%, transparent);
    color: var(--p-primary-color, #6366f1);
    transition: all 0.2s;
}



.vehicle-select-carousel :deep(.p-carousel-prev-button) {
    left: 0.5rem;
}

.vehicle-select-carousel :deep(.p-carousel-next-button) {
    right: 0.5rem;
}

.vehicle-select-carousel :deep(.p-carousel-viewport) {
    flex: 1;
    min-height: 0;
}

.vehicle-select-carousel :deep(.p-carousel-item-list) {
    height: 100%;
}

.vehicle-select-carousel :deep(.p-carousel-item) {
    height: 100%;
}

.vehicle-slide {
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: #f9fafb;
    position: relative;
    padding: 25px;
}

.vehicle-slide-image {
    width: 100%;
    height: 100%;
    min-height: 180px;
    object-fit: contain;
}

.vehicle-slide-label {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    background: rgba(255,255,255,0.9);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
}
</style>
