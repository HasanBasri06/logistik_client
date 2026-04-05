<script setup>
import Content from './Content.vue';

const slogans = [
    {
        icon: 'pi-map-marker',
        description: 'Bulunduğunuz bölgedeki sürücüleri anında görün, bekleme sürelerini minimuma indirin.',
    },
    {
        icon: 'pi-bolt',
        description: 'Akıllı eşleştirme algoritması ile saniyeler içinde en uygun sürücüyle bağlantı kurun.',
    },
    {
        icon: 'pi-shield',
        description: 'Tüm sürücülerimiz kimlik doğrulamasından geçmiş, sigortalı ve yüksek puanlıdır.',
    },
];


</script>

<template>
    <Content class="mt-12 md:mt-24">
        <div class="flex flex-col items-center gap-8">

            <div class="flex flex-col items-center gap-4 text-center max-w-xl">
                <span class="text-sm font-semibold text-primary tracking-wide uppercase">Yakınındaki Sürücüler</span>
                <h2 class="text-2xl md:text-4xl font-bold tracking-tight">Size En Yakın Sürücüleri Keşfedin</h2>
                <p class="text-gray-500 text-base leading-relaxed">
                    Konumunuza en yakın, doğrulanmış ve hazır sürücülerle hızlıca eşleşin. Yükünüz güvende, teslimatınız
                    zamanında.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
                <div v-for="(slogan, i) in slogans" :key="i"
                    class="flex gap-4 rounded-2xl border border-primary/40 ring-1 ring-primary/70 bg-white p-2 transition-all duration-300 hover:shadow-md hover:border-primary/20 items-center">
                    <div class="w-6 h-6 rounded-xl text-primary flex items-center justify-center shrink-0">
                        <i :class="['pi', slogan.icon, 'text-lg text-primary']"></i>
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <p class="text-xs text-primary leading-relaxed">{{ slogan.description }}</p>
                    </div>
                </div>
            </div>

            <div class="relative w-full max-w-4xl mx-auto py-10 md:py-20">

                <img src="../assets/images/close_vehicles.png" alt="Nearby Drivers" class="w-full h-full object-cover">

                

            </div>



        </div>
    </Content>
</template>
