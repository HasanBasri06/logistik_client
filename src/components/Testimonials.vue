<script setup>
const topRow = [
    {
        name: 'Ahmet Kaya',
        initials: 'AK',
        color: 'bg-primary',
        role: 'Yük Sahibi',
        rating: 5,
        text: 'Yükümü oluşturdum, 30 dakika içinde 4 farklı teklif aldım. En uygun taşıyıcıyı seçtim ve yüküm zamanında teslim edildi. Kesinlikle tavsiye ederim.',
    },
    {
        name: 'Ayşe Demir',
        initials: 'AD',
        color: 'bg-emerald-600',
        role: 'Yük Sahibi',
        rating: 4,
        text: 'Daha önce nakliye için saatlerce telefon açıyordum. Şimdi tek platformdan her şeyi hallediyorum. Fiyatlar da çok daha uygun.',
    },
    {
        name: 'Fatma Arslan',
        initials: 'FA',
        color: 'bg-primary',
        role: 'Yük Sahibi',
        rating: 5,
        text: 'Canlı destek ekibi çok ilgili. Sevkiyatımda bir sorun olduğunda anında müdahale ettiler. Profesyonel bir platform.',
    },
    {
        name: 'Elif Şahin',
        initials: 'EŞ',
        color: 'bg-emerald-600',
        role: 'Yük Sahibi',
        rating: 5,
        text: 'Teklif karşılaştırma özelliği süper. Fiyat, puan ve sefer sayısına göre en doğru kararı verebiliyorum.',
    },
];

const bottomRow = [
    {
        name: 'Mehmet Çelik',
        initials: 'MC',
        color: 'bg-teal-700',
        role: 'Araç Sahibi',
        rating: 5,
        text: 'Boş dönüş yapıyordum, platform sayesinde güzergahıma uygun yük buldum ve ekstra gelir elde ettim. Araç sahipleri için harika bir sistem.',
    },
    {
        name: 'Burak Yılmaz',
        initials: 'BY',
        color: 'bg-teal-500',
        role: 'Araç Sahibi',
        rating: 5,
        text: 'Onaylı hesap sistemi güven veriyor. Yük sahipleriyle sorunsuz anlaşıyoruz, ödemeler de zamanında geliyor.',
    },
    {
        name: 'Serkan Öztürk',
        initials: 'SÖ',
        color: 'bg-teal-700',
        role: 'Araç Sahibi',
        rating: 4,
        text: 'Uygulamayı kullanmaya başladığımdan beri boş sefer oranım neredeyse sıfıra düştü. Kazancımı ciddi oranda artırdım.',
    },
    {
        name: 'Oğuz Koç',
        initials: 'OK',
        color: 'bg-teal-500',
        role: 'Araç Sahibi',
        rating: 5,
        text: 'Kayıt süreci çok kolaydı. Belgelerimi yükledim, hesabım hızlıca onaylandı. İlk haftada 3 sefer aldım.',
    },
];
</script>

<template>
    <div class="mt-12 md:mt-24 flex flex-col items-center gap-8 md:gap-12 overflow-hidden mb-12 md:mb-24">

        <div class="flex flex-col items-center gap-4 text-center max-w-xl">
            <span class="text-sm font-semibold text-primary tracking-wide uppercase">Yorumlar</span>
            <h2 class="text-2xl md:text-4xl font-bold tracking-tight">Kullanıcılarımız Ne Diyor?</h2>
            <p class="text-gray-500 text-base leading-relaxed">
                Binlerce yük sahibi ve araç sahibi platformumuzu kullanıyor. İşte deneyimlerinden bazıları.
            </p>
        </div>

        <div class="w-full relative flex flex-col gap-5">
            <div class="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div class="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div class="carousel-track-left flex gap-6 w-max">
                <div
                    v-for="(review, i) in [...topRow, ...topRow, ...topRow]"
                    :key="'top-' + i"
                    class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 w-[280px] md:w-[380px] shrink-0 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                    <div class="flex items-center gap-1">
                        <i
                            v-for="n in 5"
                            :key="n"
                            class="pi pi-star-fill text-xs"
                            :class="n <= review.rating ? 'text-amber-400' : 'text-gray-200'"
                        ></i>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed">{{ review.text }}</p>
                    <div class="flex items-center gap-3 mt-auto pt-3 border-t border-gray-50">
                        <div :class="review.color" class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                            {{ review.initials }}
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-900">{{ review.name }}</h4>
                            <p class="text-xs text-gray-400">{{ review.role }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="carousel-track-right flex gap-6 w-max">
                <div
                    v-for="(review, i) in [...bottomRow, ...bottomRow, ...bottomRow]"
                    :key="'bottom-' + i"
                    class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 w-[280px] md:w-[380px] shrink-0 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                    <div class="flex items-center gap-1">
                        <i
                            v-for="n in 5"
                            :key="n"
                            class="pi pi-star-fill text-xs"
                            :class="n <= review.rating ? 'text-amber-400' : 'text-gray-200'"
                        ></i>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed">{{ review.text }}</p>
                    <div class="flex items-center gap-3 mt-auto pt-3 border-t border-gray-50">
                        <div :class="review.color" class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                            {{ review.initials }}
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-900">{{ review.name }}</h4>
                            <p class="text-xs text-gray-400">{{ review.role }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.carousel-track-left {
    animation: scroll-left 35s linear infinite;
}

.carousel-track-right {
    animation: scroll-right 35s linear infinite;
    transform: translateX(-33.33%);
}

.carousel-track-left:hover,
.carousel-track-right:hover {
    animation-play-state: paused;
}

@keyframes scroll-left {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-33.33%);
    }
}

@keyframes scroll-right {
    0% {
        transform: translateX(-33.33%);
    }
    100% {
        transform: translateX(0);
    }
}
</style>
