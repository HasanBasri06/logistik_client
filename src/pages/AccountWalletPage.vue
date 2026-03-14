<template>
    <Header />
    <div class="h-[calc(100vh-64px)]">
        <Content>
            <div class="flex flex-row gap-3 w-full h-[calc(100vh-64px)]">
                <AccountSidebar />
                <div class="flex-1 p-3 h-auto">
                    <div class="w-full h-auto p-3 rounded-md border border-gray-200 flex justify-between items-center">
                        <div class="py-3 px-5 gap-3 items-center text-primary rounded-2xl font-semibold bg-primary/10 inline-flex">
                            <i class="pi pi-wallet"></i>
                            <span>12.500₺</span>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900">Kazançlarım</h3>
                    </div>

                    <div class="flex flex-col flex-1 p-3 h-[calc(100vh-170px)] rounded-xl border border-gray-200 mt-3 space-y-3 overflow-y-auto">
                        <div
                            v-for="(item, i) in liste"
                            :key="i"
                            class="group flex justify-between items-center gap-4 py-4 px-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
                        >
                            <div class="flex items-center gap-4 min-w-0 flex-1">
                                <div class="shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                                    <i class="pi pi-map-marker text-lg"></i>
                                </div>
                                <div class="flex flex-col gap-1 min-w-0">
                                    <span class="text-gray-900 font-semibold truncate">{{ item.nereden }} → {{ item.nereye }}</span>
                                    <span class="text-sm text-gray-500 flex items-center gap-1.5">
                                        <i class="pi pi-user text-[10px] opacity-70"></i>
                                        {{ item.ilanSahibi }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex flex-col gap-1 text-right shrink-0">
                                <span class="text-primary font-bold text-lg tabular-nums">{{ item.fiyat }}₺</span>
                                <span class="text-xs text-gray-500 flex items-center justify-end gap-1">
                                    <i class="pi pi-calendar text-[10px] opacity-70"></i>
                                    {{ item.tarih }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import AccountSidebar from '@/components/AccountSidebar.vue';

const liste = ref([
    { nereden: 'İstanbul', nereye: 'Ankara', fiyat: '1.250', ilanSahibi: 'Ahmet Yılmaz', tarih: '12.03.2025' },
    { nereden: 'İzmir', nereye: 'Antalya', fiyat: '2.100', ilanSahibi: 'Mehmet Kaya', tarih: '10.03.2025' },
    { nereden: 'Bursa', nereye: 'Konya', fiyat: '850', ilanSahibi: 'Ayşe Demir', tarih: '08.03.2025' },
    { nereden: 'Ankara', nereye: 'İzmir', fiyat: '1.800', ilanSahibi: 'Fatma Öz', tarih: '05.03.2025' },
]);
</script>
