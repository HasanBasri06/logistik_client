<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/api';
import HeroSectionBackground from '@/assets/images/kare4.jpg';

const router = useRouter();
const authStore = useAuthStore();

const fromQuery = ref('');
const toQuery = ref('');
const fromResults = ref([]);
const toResults = ref([]);
const showFromDropdown = ref(false);
const showToDropdown = ref(false);
const fromLoading = ref(false);
const toLoading = ref(false);

const fromRef = ref(null);
const toRef = ref(null);
const carRef = ref(null);

const closeAllDropdowns = (e) => {
    if (fromRef.value && !fromRef.value.contains(e.target)) showFromDropdown.value = false;
    if (toRef.value && !toRef.value.contains(e.target)) showToDropdown.value = false;
    if (carRef.value && !carRef.value.contains(e.target)) showCarDropdown.value = false;
};

const onEscape = (e) => {
    if (e.key === 'Escape') {
        showFromDropdown.value = false;
        showToDropdown.value = false;
        showCarDropdown.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', closeAllDropdowns);
    document.addEventListener('keydown', onEscape);
});
onUnmounted(() => {
    document.removeEventListener('click', closeAllDropdowns);
    document.removeEventListener('keydown', onEscape);
});

let fromTimer = null;
let toTimer = null;

const searchCities = async (query, results, loading) => {
    if (query.length < 3) {
        results.value = [];
        return;
    }
    loading.value = true;
    try {
        const res = await api.get('/locations/cities', { params: { search: query } });
        results.value = res.data?.content ?? [];
    } catch {
        results.value = [];
    } finally {
        loading.value = false;
    }
};

watch(fromQuery, (val) => {
    clearTimeout(fromTimer);
    if (val.length < 3) { fromResults.value = []; showFromDropdown.value = false; return; }
    fromTimer = setTimeout(() => {
        searchCities(val, fromResults, fromLoading);
        showFromDropdown.value = true;
    }, 300);
});

watch(toQuery, (val) => {
    clearTimeout(toTimer);
    if (val.length < 3) { toResults.value = []; showToDropdown.value = false; return; }
    toTimer = setTimeout(() => {
        searchCities(val, toResults, toLoading);
        showToDropdown.value = true;
    }, 300);
});

const selectFrom = (city) => {
    fromQuery.value = city.name;
    showFromDropdown.value = false;
};

const selectTo = (city) => {
    toQuery.value = city.name;
    showToDropdown.value = false;
};

const swap = () => {
    const temp = fromQuery.value;
    fromQuery.value = toQuery.value;
    toQuery.value = temp;
};

const cars = ref([]);
const carsLoading = ref(false);
const selectedCar = ref(null);
const showCarDropdown = ref(false);

const getCarImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    return new URL(`../assets/images/vehicles/${image}`, import.meta.url).href;
};

const toggleCarDropdown = async () => {
    showCarDropdown.value = !showCarDropdown.value;
    if (!showCarDropdown.value || cars.value.length) return;
    carsLoading.value = true;
    try {
        const res = await api.get('/cars');
        cars.value = res.data?.content?.cars ?? [];
    } catch {
        cars.value = [];
    } finally {
        carsLoading.value = false;
    }
};

const selectCar = (car) => {
    selectedCar.value = car;
    showCarDropdown.value = false;
};

const handleSearch = () => {
    const query = {};
    if (fromQuery.value) query.from = fromQuery.value;
    if (toQuery.value) query.to = toQuery.value;
    if (selectedCar.value) query.car = selectedCar.value.id;

    if (!authStore.isAuthenticated) {
        sessionStorage.setItem('pendingSearch', JSON.stringify(query));
        window.dispatchEvent(new Event('open-login'));
        return;
    }

    router.push({ path: '/panel', query });
};
</script>

<template>
    <div class="w-full min-h-[500px] md:h-[700px] relative -mt-16 pt-16 px-4 lg:px-0">
        <img :src="HeroSectionBackground" alt="Hero Section Background" class="w-full h-full object-cover absolute z-0 top-0 left-0" style="mask-image: linear-gradient(to bottom, black 50%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);">
        <div class="w-full h-full flex justify-center items-center flex-col gap-8 md:gap-14 py-10 md:py-0 z-10 relative">
            <div class="flex flex-col w-full max-w-[700px] text-center gap-4">
                <h1 class="text-3xl md:text-5xl lg:text-6xl font-black leading-tight md:leading-normal">Yüklerinizi kolayca yönetin ve takip edin</h1>
                <p class="text-sm md:text-lg">Yüklerinizi tek platform üzerinden oluşturun, taşıyıcılarla eşleşin ve sevkiyat sürecini kolayca yönetin.</p>
            </div>

            <form @submit.prevent="handleSearch" class="flex flex-col md:flex-row items-stretch md:items-center relative bg-transparent md:bg-white rounded-xl w-full max-w-[700px] md:w-auto">

                <div ref="fromRef" class="relative">
                    <input
                        v-model="fromQuery"
                        type="text"
                        placeholder="Nereden"
                        autocomplete="off"
                        @focus="fromQuery.length >= 3 && (showFromDropdown = true)"
                        class="w-full md:w-auto border border-gray-300 md:border-l md:border-t md:border-b md:border-r-0 rounded-t-none md:rounded-t-none md:rounded-l-xl px-4 py-4 outline-none bg-white"
                    />
                    <div v-if="showFromDropdown" class="absolute top-full left-0 mt-2 w-full md:w-72 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
                        <div v-if="fromLoading" class="flex items-center justify-center py-4">
                            <i class="pi pi-spin pi-spinner text-primary"></i>
                        </div>
                        <div v-else-if="fromResults.length" class="max-h-56 overflow-y-auto">
                            <div class="px-3 py-2">
                                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Bunu mu arattınız?</span>
                            </div>
                            <button
                                v-for="city in fromResults"
                                :key="city.id"
                                type="button"
                                @mousedown.prevent="selectFrom(city)"
                                class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary flex items-center gap-2.5 transition-colors cursor-pointer"
                            >
                                <i class="pi pi-map-marker text-xs text-gray-400"></i>
                                {{ city.name }}
                            </button>
                        </div>
                        <div v-else class="px-4 py-4 text-sm text-gray-400 text-center">Sonuç bulunamadı</div>
                    </div>
                </div>

                <div class="hidden md:block h-px w-60 bg-gray-300 absolute top-0 left-2/4 -translate-x-3/4"></div>
                <div class="hidden md:block h-px w-72 bg-gray-300 absolute bottom-0 left-6"></div>

                <div @click="swap" class="w-10 h-10 rounded-full cursor-pointer bg-primary/30 text-primary flex items-center justify-center mx-auto md:mx-0 -my-3 md:my-0 z-10 md:z-auto shrink-0">
                    <i class="pi pi-arrow-right-arrow-left md:pi-arrow-right-arrow-left rotate-90 md:rotate-0"></i>
                </div>

                <div ref="toRef" class="relative">
                    <input
                        v-model="toQuery"
                        type="text"
                        placeholder="Nereye"
                        autocomplete="off"
                        @focus="toQuery.length >= 3 && (showToDropdown = true)"
                        class="w-full md:w-auto border border-gray-300 md:border-r md:border-t md:border-b md:border-l-0 px-4 py-4 outline-none bg-white"
                    />
                    <div v-if="showToDropdown" class="absolute top-full left-0 mt-2 w-full md:w-72 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
                        <div v-if="toLoading" class="flex items-center justify-center py-4">
                            <i class="pi pi-spin pi-spinner text-primary"></i>
                        </div>
                        <div v-else-if="toResults.length" class="max-h-56 overflow-y-auto">
                            <div class="px-3 py-2">
                                <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Bunu mu arattınız?</span>
                            </div>
                            <button
                                v-for="city in toResults"
                                :key="city.id"
                                type="button"
                                @mousedown.prevent="selectTo(city)"
                                class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary flex items-center gap-2.5 transition-colors cursor-pointer"
                            >
                                <i class="pi pi-map-marker text-xs text-gray-400"></i>
                                {{ city.name }}
                            </button>
                        </div>
                        <div v-else class="px-4 py-4 text-sm text-gray-400 text-center">Sonuç bulunamadı</div>
                    </div>
                </div>

                <div class="flex-col md:flex-row md:contents ">
                    <div ref="carRef" class="relative flex-1 md:flex-none mt-4 md:mt-0">
                        <div
                            @click="toggleCarDropdown"
                            class="border border-gray-300 md:border-r md:border-t md:border-b md:border-l-0 w-full md:w-28 px-4 py-[19px] bg-white cursor-pointer flex items-center gap-2 select-none"
                        >
                            <span :class="selectedCar ? 'text-gray-900' : 'text-gray-400'" class="text-sm truncate">
                                {{ selectedCar ? selectedCar.name : 'Taşıt' }}
                            </span>
                            <i class="pi pi-chevron-down text-xs text-gray-400 ml-auto transition-transform" :class="showCarDropdown && 'rotate-180'"></i>
                        </div>
                        <div v-if="showCarDropdown" class="absolute top-full right-0 mt-2 w-full md:w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
                            <div v-if="carsLoading" class="flex items-center justify-center py-6">
                                <i class="pi pi-spin pi-spinner text-primary"></i>
                            </div>
                            <div v-else-if="cars.length" class="max-h-72 overflow-y-auto">
                                <div class="px-3 py-2">
                                    <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Araç seçin</span>
                                </div>
                                <button
                                    v-for="car in cars"
                                    :key="car.id"
                                    type="button"
                                    @mousedown.prevent="selectCar(car)"
                                    class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary flex items-center gap-3 transition-colors cursor-pointer"
                                    :class="selectedCar?.id === car.id && 'bg-primary/5 text-primary font-semibold'"
                                >
                                    <img :src="getCarImageUrl(car.image)" :alt="car.name" class="w-10 h-7 object-contain" />
                                    {{ car.name }}
                                    <i v-if="selectedCar?.id === car.id" class="pi pi-check text-xs text-primary ml-auto"></i>
                                </button>
                            </div>
                            <div v-else class="px-4 py-4 text-sm text-gray-400 text-center">Araç bulunamadı</div>
                        </div>
                    </div>
                    <button type="submit" class="bg-primary w-full md:w-auto mt-4 md:mt-0 text-white cursor-pointer px-4 py-4 rounded-none md:rounded-bl-none md:rounded-r-xl border border-primary shrink-0">Taşıt Ara</button>
                </div>
            </form>

            <div class="flex gap-6 md:gap-10">
                <div class="flex flex-col gap-2 text-center">
                    <h3 class="text-2xl md:text-4xl font-bold">30%</h3>
                    <p class="text-xs md:text-sm text-gray-600">Daha ucuz</p>
                </div>
                <div class="flex flex-col gap-2 text-center">
                    <h3 class="text-2xl md:text-4xl font-bold">2.5X</h3>
                    <p class="text-xs md:text-sm text-gray-600">Fazla sonuç alma</p>
                </div>
                <div class="flex flex-col gap-2 text-center">
                    <h3 class="text-2xl md:text-4xl font-bold">99+</h3>
                    <p class="text-xs md:text-sm text-gray-600">Pozitif yorum</p>
                </div>
            </div>
        </div>
    </div>
</template>