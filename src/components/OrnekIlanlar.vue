<script setup>
import Content from './Content.vue';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();

const ornekIlanlar = [
    {
        from: 'Ankara / Çankaya',
        to: 'İzmir / Konak',
        pickupTime: 'Yarın 08:00',
        deliveryWindow: '24 saat içinde',
        vehicle: 'Tenteli Kamyon',
        weight: '7.2 ton',
        price: '₺20.000',
        offers: 14,
        distance: '587 km'
    },
    {
        from: 'İstanbul / Kadıköy',
        to: 'Bursa / Osmangazi',
        pickupTime: 'Bugün 19:30',
        deliveryWindow: 'Aynı gün',
        vehicle: 'Panelvan',
        weight: '1.4 ton',
        price: '₺12.000',
        offers: 9,
        distance: '154 km'
    },
    {
        from: 'İzmir / Bornova',
        to: 'Antalya / Muratpaşa',
        pickupTime: 'Yarın 06:00',
        deliveryWindow: '18 saat içinde',
        vehicle: 'Kırkayak',
        weight: '12.8 ton',
        price: '₺22.000',
        offers: 21,
        distance: '462 km'
    },
    {
        from: 'Kocaeli / Gebze',
        to: 'Sakarya / Arifiye',
        pickupTime: 'Bugün 16:00',
        deliveryWindow: '6 saat içinde',
        vehicle: 'Kamyonet',
        weight: '900 kg',
        price: '₺6.500',
        offers: 6,
        distance: '67 km'
    },
    {
        from: 'Konya / Selçuklu',
        to: 'Adana / Seyhan',
        pickupTime: 'Yarın 09:15',
        deliveryWindow: '20 saat içinde',
        vehicle: 'Frigorifik',
        weight: '5.6 ton',
        price: '₺18.750',
        offers: 11,
        distance: '347 km'
    },
    {
        from: 'Gaziantep / Şahinbey',
        to: 'Mersin / Akdeniz',
        pickupTime: 'Bugün 22:00',
        deliveryWindow: '10 saat içinde',
        vehicle: 'Tenteli Tır',
        weight: '9.3 ton',
        price: '₺15.900',
        offers: 17,
        distance: '301 km'
    },
    {
        from: 'Samsun / Atakum',
        to: 'Trabzon / Ortahisar',
        pickupTime: 'Yarın 07:00',
        deliveryWindow: '12 saat içinde',
        vehicle: 'Kamyon',
        weight: '3.8 ton',
        price: '₺11.400',
        offers: 8,
        distance: '333 km'
    },
    {
        from: 'Eskişehir / Tepebaşı',
        to: 'Balıkesir / Karesi',
        pickupTime: 'Bugün 18:45',
        deliveryWindow: '14 saat içinde',
        vehicle: 'Açık Kasa',
        weight: '2.1 ton',
        price: '₺9.850',
        offers: 10,
        distance: '256 km'
    }
];

const carouselItems = computed(() => [...ornekIlanlar, ...ornekIlanlar]);
</script>

<template>
    <Content class="">
        <div class="flex flex-col items-center gap-4 text-center max-w-xl mb-8 mx-auto">
                <span class="text-sm font-semibold text-primary tracking-wide uppercase">Örnek</span>
                <h2 class="text-2xl md:text-4xl font-bold tracking-tight">Örnek İlanlar</h2>
                <p class="text-gray-500 text-base leading-relaxed">
                    Platformumuzda aktif olan ilanları görebilirsiniz.
                </p>
            </div>

        <div class="relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div class="flex w-max gap-5 animate-slow-carousel hover:[animation-play-state:paused]">
            <div
                v-for="(ilan, i) in carouselItems"
                :key="i"
                class="group relative flex w-[310px] shrink-0 flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
                <div class="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary/80 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div class="mb-4 flex items-center justify-between">
                    <span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                        <i class="pi pi-truck text-[10px]"></i>
                        {{ ilan.vehicle }}
                    </span>
                    <span class="inline-flex items-center gap-1 text-xs text-gray-500">
                        <i class="pi pi-map text-[10px]"></i>
                        {{ ilan.distance }}
                    </span>
                </div>

                <div class="flex flex-1 flex-col gap-3.5">
                    <div class="flex items-start gap-2">
                        <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <i class="pi pi-send text-xs"></i>
                        </span>
                        <div class="min-w-0">
                            <p class="text-[11px] uppercase tracking-wide text-gray-400">Nereden</p>
                            <p class="truncate text-sm font-semibold text-gray-800" :title="ilan.from">{{ ilan.from }}</p>
                        </div>
                    </div>
                    <div class="flex justify-center">
                        <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary/90">
                            <i class="pi pi-arrow-down text-[10px] -rotate-90"></i>
                        </span>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                            <i class="pi pi-map-marker text-xs"></i>
                        </span>
                        <div class="min-w-0">
                            <p class="text-[11px] uppercase tracking-wide text-gray-400">Nereye</p>
                            <p class="truncate text-sm font-semibold text-gray-800" :title="ilan.to">{{ ilan.to }}</p>
                        </div>
                    </div>
                </div>

                <div class="mt-4 grid grid-cols-2 gap-2 border-y border-gray-100 py-3">
                    <div class="rounded-lg bg-gray-50 px-2.5 py-2">
                        <p class="text-[11px] text-gray-400">Yükleme</p>
                        <p class="mt-0.5 text-xs font-semibold text-gray-700">{{ ilan.pickupTime }}</p>
                    </div>
                    <div class="rounded-lg bg-gray-50 px-2.5 py-2">
                        <p class="text-[11px] text-gray-400">Teslim</p>
                        <p class="mt-0.5 text-xs font-semibold text-gray-700">{{ ilan.deliveryWindow }}</p>
                    </div>
                </div>

                <div class="mt-3 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                            <i class="pi pi-box text-[10px]"></i>
                            {{ ilan.weight }}
                        </span>
                        <span class="inline-flex items-center gap-1 text-xs text-gray-500">
                            <i class="pi pi-users text-[11px]"></i>
                            {{ ilan.offers }} teklif
                        </span>
                    </div>
                    <span class="text-lg font-bold text-primary">{{ ilan.price }}</span>
                </div>

                <button
                    type="button"
                    class="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
                    @click="authStore.openLoginModal()"
                >
                    Teklifleri Gör
                </button>
            </div>
            </div>
        </div>
    </Content>
</template>

<style scoped>
@keyframes slow-carousel {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(calc(-50% - 0.625rem));
    }
}

.animate-slow-carousel {
    animation: slow-carousel 65s linear infinite;
}
</style>
