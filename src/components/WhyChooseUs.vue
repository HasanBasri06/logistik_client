<script setup>
import Content from './Content.vue';
import AracYuk from '@/assets/images/yuk_arac.png';

const features = [
    {
        icon: 'pi-sync',
        title: 'Kolay Yük Eşleştirme',
        description: 'Yük ilanı oluşturun, araç sahiplerinden teklifler alın ve en uygun taşıyıcıyı birkaç tıkla seçin.',
    },
    {
        icon: 'pi-verified',
        title: 'Doğrulanmış Taşıyıcılar',
        description: 'Platformdaki tüm araç sahipleri kimlik ve belge doğrulamasından geçer. Yükünüz her zaman güvende.',
    },
    {
        icon: 'pi-headphones',
        title: '7/24 Canlı Destek',
        description: 'Sevkiyat sürecinizde aklınıza takılan her konuda canlı destek ekibimiz her an yanınızda.',
    },
];

const chartBars = [
    { day: 'Pzt', height: 20, active: false },
    { day: 'Sal', height: 55, active: true },
    { day: 'Çar', height: 45, active: true },
    { day: 'Per', height: 70, active: true },
    { day: 'Cum', height: 60, active: true },
    { day: 'Cmt', height: 35, active: false },
    { day: 'Paz', height: 25, active: false },
];
</script>

<template>
    <Content class="mt-12 md:mt-24">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

            <div class="flex flex-col gap-8">
                <div class="flex flex-col gap-5">
                    <span class="text-sm font-semibold text-primary tracking-wide uppercase">Neden Biz?</span>
                    <h2 class="text-2xl md:text-4xl font-bold tracking-tight leading-tight">
                        Yük Sahipleri ve Araç<br class="hidden md:block" />Sahiplerini Buluşturuyoruz
                    </h2>
                    <p class="text-gray-500 text-base leading-relaxed max-w-md">
                        Yükünüzü oluşturun, taşıyıcılarla eşleşin ve sevkiyat sürecini tek platform üzerinden kolayca yönetin.
                    </p>
                </div>

                <div class="flex flex-col gap-6">
                    <div
                        v-for="(feature, i) in features"
                        :key="i"
                        class="group flex items-start gap-4"
                    >
                        <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                            <i :class="['pi', feature.icon, 'text-lg']"></i>
                        </div>
                        <div class="flex flex-col gap-1">
                            <h3 class="text-base font-semibold text-gray-900">{{ feature.title }}</h3>
                            <p class="text-sm text-gray-500 leading-relaxed">{{ feature.description }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="relative flex items-center justify-center order-first md:order-0">
                <div class="w-full h-[280px] md:h-[480px] rounded-3xl overflow-hidden bg-gray-100">
                    <img
                        :src="AracYuk"
                        alt="Lojistik"
                        class="w-full h-full object-cover"
                    />
                </div>

                
            </div>

        </div>
    </Content>
</template>
