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
                    class="flex gap-4 rounded-2xl border border-gray-100 bg-white p-2 transition-all duration-300 hover:shadow-md hover:border-primary/20 items-center">
                    <div class="w-6 h-6 rounded-xl text-primary flex items-center justify-center shrink-0">
                        <i :class="['pi', slogan.icon, 'text-lg']"></i>
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <p class="text-xs text-gray-500 leading-relaxed">{{ slogan.description }}</p>
                    </div>
                </div>
            </div>

            <div class="relative w-full max-w-4xl mx-auto py-10 md:py-20">

                <div class="hidden md:flex relative w-full justify-center py-20">
                    <svg class="absolute top-0 w-full max-w-[800px] mx-auto left-1/2 -translate-x-1/2" height="200" viewBox="0 0 800 200" preserveAspectRatio="none">
                        <path d="M50 175 Q400 -50 750 175" stroke="#d1d5db" stroke-width="2" fill="none"
                            stroke-dasharray="6 6" />
                    </svg>
                </div>

                <div class="flex flex-col md:flex-row justify-between items-center relative gap-8 md:gap-0">

                    <div class="flex flex-col items-center w-52 gap-2 ">
                        <div
                            class="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-green-400">
                            🚢
                        </div>
                        <p class="font-semibold text-lg md:text-xl">İlan Oluştur</p>
                    </div>

                    <div class="flex flex-col items-center gap-2 md:-mt-68 w-52 ">
                        <div
                            class="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-green-400">
                            ⏱
                        </div>
                        <p class="font-semibold text-lg md:text-xl text-center">Size En Yakın Sürücüleri Gösterelim</p>
                    </div>

                    <div class="flex flex-col items-center w-52 gap-2 ">
                        <div
                            class="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-green-400">
                            📍
                        </div>
                        <p class="font-semibold text-lg md:text-xl text-center">En Uygun Sürücüyü Seç</p>
                    </div>

                </div>

            </div>



        </div>
    </Content>
</template>
