<template>
    <div class="flex flex-col h-full overflow-y-auto">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Tüm Araçlarım</h2>
        
        <div class="grid grid-cols-2 gap-4">
            <div 
                @click="openAddVehicleModal"
                class="col-span-1 bg-primary/10 hover:bg-primary/20 transition-all duration-300 rounded-2xl border-primary flex justify-center items-center cursor-pointer"
            >
                <i class="pi pi-plus mr-2 text-primary" style="font-size: 60px;"></i>
            </div>
            <div 
                v-for="vehicle in vehicles" 
                :key="vehicle.id"
                class="vehicle-row"
            >
                <!-- Sol Üst: Taşıt İsmi -->
                <div class="absolute top-4 left-4">
                    <h3 class="text-lg font-semibold text-gray-900">{{ vehicle.name }}</h3>
                </div>
                
                <!-- Orta: Araç Resmi -->
                <div class="flex items-center justify-center flex-1">
                    <div class="vehicle-image-container">
                        <img :src="vehicle.image" :alt="vehicle.name" />
                    </div>
                </div>
                
                <!-- Sağ Alt: Düzenle Butonu -->
                <div class="absolute bottom-4 right-4">
                    <button
                        type="button"
                        @click="editVehicle(vehicle)"
                        class="edit-vehicle-btn"
                    >
                        <i class="pi pi-pencil mr-2"></i>
                        Düzenle
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Yeni Araç Ekleme Modal -->
        <div 
            v-if="showAddVehicleModal"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            @click.self="closeAddVehicleModal"
        >
            <div class="bg-white shadow-xl overflow-hidden flex flex-col rounded-lg transition-all duration-300 w-[60vw] max-w-[40vw] h-[70vh] max-h-[70vh]">
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
                
                <!-- Modal Content -->
                <div :class="['flex-1 min-h-0 flex flex-col', currentStep === 1 ? 'overflow-hidden p-0' : 'overflow-y-auto p-6']">
                    <!-- Sayfa 1: Araç Türü Seçimi - PrimeVue Carousel, tam ekran -->
                    <div v-if="currentStep === 1" class="vehicle-carousel-fullscreen">
                        <Carousel
                            v-model:page="carouselPage"
                            :value="vehicleTypes"
                            :num-visible="1"
                            :num-scroll="1"
                            circular
                            :show-indicators="true"
                            :show-navigators="true"
                            class="vehicle-select-carousel"
                        >
                            <template #item="{ data }">
                                <div class="vehicle-slide" @click="selectVehicleFromSlide(data)">
                                    <img :src="data.image" :alt="data.label" class="vehicle-slide-image" />
                                    <span class="vehicle-slide-label">{{ data.label }}</span>
                                </div>
                            </template>
                        </Carousel>
                    </div>
                    
                    <!-- Sayfa 2: (Gelecek içerik) -->
                    <div v-if="currentStep === 2" class="space-y-6">
                        <h4 class="text-lg font-semibold text-gray-900 mb-4">Sayfa 2</h4>
                        <p class="text-gray-600">İçerik yakında eklenecek</p>
                    </div>
                    
                    <!-- Sayfa 3: (Gelecek içerik) -->
                    <div v-if="currentStep === 3" class="space-y-6">
                        <h4 class="text-lg font-semibold text-gray-900 mb-4">Sayfa 3</h4>
                        <p class="text-gray-600">İçerik yakında eklenecek</p>
                    </div>
                </div>
                
                <!-- Modal Footer -->
                <div class="flex items-center justify-between p-6 border-t border-gray-200">
                    <button
                        
                        @click="previousStep"
                        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        <i class="pi pi-arrow-left mr-2"></i>
                        Geri
                    </button>
                    
                    <div class="flex items-center gap-2">
                        <div 
                            v-for="step in 3" 
                            :key="step"
                            :class="[
                                'w-2 h-2 rounded-full',
                                step === currentStep ? 'bg-primary' : step < currentStep ? 'bg-primary/50' : 'bg-gray-300'
                            ]"
                        ></div>
                    </div>
                    
                    <button
                        v-if="currentStep < 3"
                        @click="nextStep"
                        :disabled="currentStep === 1 && !selectedVehicleType"
                        :class="[
                            'px-6 py-2 rounded-lg font-medium transition-colors',
                            currentStep === 1 && !selectedVehicleType
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary/90'
                        ]"
                    >
                        İleri
                        <i class="pi pi-arrow-right ml-2"></i>
                    </button>
                    <button
                        v-else
                        @click="saveVehicle"
                        class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        Kaydet
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Carousel from 'primevue/carousel';
import truckImage from '@/assets/images/truck.png';

const vehicles = ref([
    {
        id: 1,
        name: 'Kamyon',
        image: truckImage
    },
    {
        id: 2,
        name: 'Tır',
        image: truckImage
    },
    {
        id: 3,
        name: 'Panelvan',
        image: truckImage
    }
]);

const editVehicle = (vehicle) => {
    console.log('Düzenle:', vehicle);
};

// Modal State
const showAddVehicleModal = ref(false);
const currentStep = ref(1);
const selectedVehicleType = ref(null);
const carouselPage = ref(0);

watch(carouselPage, (page) => {
    if (vehicleTypes[page]) {
        selectedVehicleType.value = vehicleTypes[page].value;
    }
});

const selectVehicleFromSlide = (data) => {
    selectedVehicleType.value = data.value;
};

const vehicleTypes = [
    { value: 'motor', label: 'Motor', image: motorImg },
    { value: 'minivan', label: 'Minivan', image: minivanImg },
    { value: 'panelvan', label: 'Panelvan', image: panelvanImg },
    { value: 'kamyon', label: 'Kamyon', image: kamyonImg },
    { value: 'tir', label: 'Tır', image: tirImg }
];

const openAddVehicleModal = () => {
    showAddVehicleModal.value = true;
    currentStep.value = 1;
    carouselPage.value = 0;
    selectedVehicleType.value = vehicleTypes[0]?.value ?? null;
};

const closeAddVehicleModal = () => {
    showAddVehicleModal.value = false;
    currentStep.value = 1;
    selectedVehicleType.value = null;
    carouselPage.value = 0;
};

const nextStep = () => {
    if (currentStep.value < 3) {
        currentStep.value++;
    }
};

const previousStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
};

const saveVehicle = () => {
    console.log('Araç kaydediliyor:', selectedVehicleType.value);
    // TODO: API'ye araç kaydetme
    closeAddVehicleModal();
};
</script>

<style scoped>
.vehicle-row {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    padding: 1.5rem;
    border-radius: 0.75rem;
    background-color: rgba(57, 131, 140, 0.1);
    border: 1px solid rgba(57, 131, 140, 0.2);
    transition: all 0.2s;
}

.vehicle-row:hover {
    background-color: rgba(57, 131, 140, 0.15);
    border-color: rgba(57, 131, 140, 0.3);
}

.vehicle-image-container {
    width: 400px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.vehicle-image-container img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.edit-vehicle-btn {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background-color: #39838C;
    border: 1px solid #39838C;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.edit-vehicle-btn:hover {
    background-color: rgba(57, 131, 140, 0.9);
    border-color: rgba(57, 131, 140, 0.9);
}

/* Araç seçim - PrimeVue Carousel, içeride daha küçük, ok butonları resmin ortasında */
.vehicle-carousel-fullscreen {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    margin: 1rem 1.5rem;
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

.vehicle-select-carousel :deep(.p-carousel-prev-button) {
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
}

.vehicle-select-carousel :deep(.p-carousel-next-button) {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
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
