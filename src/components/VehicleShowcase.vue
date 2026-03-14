<script setup>
import { ref, computed, onMounted } from 'vue';
import Content from './Content.vue';
import api from '@/api';

const cars = ref([]);
const loading = ref(true);
const scrollContainer = ref(null);

const scrollBy = (direction) => {
    if (!scrollContainer.value) return;
    const isMobile = window.innerWidth < 768;
    const amount = isMobile ? Math.max(280, window.innerWidth - 32) : 284 * 2;
    scrollContainer.value.scrollBy({ left: direction * amount, behavior: 'smooth' });
};

const getCarImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    return new URL(`../assets/images/vehicles/${image}`, import.meta.url).href;
};

const getCars = async () => {
    loading.value = true;
    try {
        const res = await api.get('/cars');
        cars.value = res.data?.content?.cars ?? [];
    } catch {
        cars.value = [];
    } finally {
        loading.value = false;
    }
};

onMounted(getCars);
</script>

<template>
    <Content class="mt-12 md:mt-24">
        <div class="flex flex-col items-center gap-8 md:gap-12">

            <div class="flex flex-col items-center gap-4 text-center max-w-xl">
                <span class="text-sm font-semibold text-primary tracking-wide uppercase">Araç Filomuz</span>
                <h2 class="text-2xl md:text-4xl font-bold tracking-tight">Her Yük İçin Doğru Araç</h2>
                <p class="text-gray-500 text-base leading-relaxed">
                    Küçük paketlerden ağır tonajlı yüklere kadar, ihtiyacınıza uygun araç seçenekleriyle hizmetinizdeyiz.
                </p>
            </div>

            <div v-if="loading" class="flex items-center justify-center py-16 w-full">
                <i class="pi pi-spin pi-spinner text-3xl text-primary"></i>
            </div>

            <div v-else-if="cars.length" class="w-full relative">
                <button
                    @click="scrollBy(-1)"
                    class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-lg items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 cursor-pointer"
                >
                    <i class="pi pi-arrow-left text-sm"></i>
                </button>

                <button
                    @click="scrollBy(1)"
                    class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-lg items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 cursor-pointer"
                >
                    <i class="pi pi-arrow-right text-sm"></i>
                </button>

                <div
                    ref="scrollContainer"
                    class="flex gap-4 md:gap-6 overflow-x-auto no_scrool scroll-smooth py-4 px-1"
                >
                    <div
                        v-for="car in cars"
                        :key="car.id"
                        class="vehicle-card group flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 w-[calc(100vw-2rem)] min-w-0 md:w-[260px] shrink-0 transition-all duration-300 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1"
                    >
                        <div class="w-full h-36 flex items-center justify-center p-2 rounded-xl overflow-hidden">
                            <img
                                :src="getCarImageUrl(car.image)"
                                :alt="car.name"
                                class="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <h3 class="text-sm font-semibold text-gray-900">{{ car.name }}</h3>
                    </div>
                </div>
            </div>

            <div v-else class="flex flex-col items-center gap-3 py-12 text-gray-400">
                <i class="pi pi-car text-4xl"></i>
                <p class="text-sm">Araç bulunamadı.</p>
            </div>

        </div>
    </Content>
</template>
