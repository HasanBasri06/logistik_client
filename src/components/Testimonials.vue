<script setup>
/** Örnek: Ahmet Kaya → Ahmet K. (soyad yalnızca baş harf) */
function commentDisplayName(firstName, lastName) {
    const f = (firstName || '').trim();
    const l = (lastName || '').trim();
    if (!f) return '—';
    if (!l) return f;
    const initial = l.charAt(0).toLocaleUpperCase('tr-TR');
    return `${f} ${initial}.`;
}

function commentInitials(firstName, lastName) {
    const f = (firstName || '').trim();
    const l = (lastName || '').trim();
    if (!f && !l) return '?';
    const a = (f.charAt(0) || l.charAt(0) || '').toLocaleUpperCase('tr-TR');
    const b = (l.charAt(0) || f.charAt(1) || '').toLocaleUpperCase('tr-TR');
    return a + b;
}

const topRow = [
    {
        firstName: 'Ahmet',
        lastName: 'Kaya',
        color: 'bg-primary',
        role: 'Yük Sahibi',
        rating: 5,
        text: 'Yükümü oluşturdum, 30 dakika içinde 4 farklı teklif aldım. En uygun taşıyıcıyı seçtim ve yüküm zamanında teslim edildi. Kesinlikle tavsiye ederim.',
    },
    {
        firstName: 'Ayşe',
        lastName: 'Demir',
        color: 'bg-emerald-600',
        role: 'Yük Sahibi',
        rating: 5,
        text: 'Daha önce nakliye için saatlerce telefon açıyordum. Şimdi tek platformdan her şeyi hallediyorum. Fiyatlar da çok daha uygun.',
    },
    {
        firstName: 'Mustafa',
        lastName: 'Arslan',
        color: 'bg-primary',
        role: 'Yük Sahibi',
        rating: 5,
        text: 'Canlı destek ekibi çok ilgili. Sevkiyatımda bir sorun olduğunda anında müdahale ettiler. Profesyonel bir platform.',
    },
    {
        firstName: 'Emre',
        lastName: 'Şahin',
        color: 'bg-emerald-600',
        role: 'Yük Sahibi',
        rating: 5,
        text: 'Teklif karşılaştırma özelliği süper. Fiyat, puan ve sefer sayısına göre en doğru kararı verebiliyorum.',
    },
    {
        firstName: 'Can',
        lastName: 'Özdemir',
        color: 'bg-primary',
        role: 'Yük Sahibi',
        rating: 4,
        text: 'İlan vermek çok kolay. Birkaç tıkla yükümü girdim, taşıyıcılar hızlıca teklif verdi. Zamanımdan tasarruf ettim.',
    },
    {
        firstName: 'Barış',
        lastName: 'Aydın',
        color: 'bg-emerald-600',
        role: 'Yük Sahibi',
        rating: 5,
        text: 'Düzenli sevkiyat yapıyoruz. TaşıBul sayesinde sabit taşıyıcılarımızı bulduk, artık her seferinde aramıyoruz.',
    },
    {
        firstName: 'Kerem',
        lastName: 'Polat',
        color: 'bg-primary',
        role: 'Yük Sahibi',
        rating: 5,
        text: 'Güvenilir ve şeffaf bir platform. Ödeme takibi ve teslimat onayı sistemi işimi kolaylaştırdı.',
    },
];

const bottomRow = [
    {
        firstName: 'Mehmet',
        lastName: 'Çelik',
        color: 'bg-teal-700',
        role: 'Araç Sahibi',
        rating: 5,
        text: 'Boş dönüş yapıyordum, platform sayesinde güzergahıma uygun yük buldum ve ekstra gelir elde ettim. Araç sahipleri için harika bir sistem.',
    },
    {
        firstName: 'Burak',
        lastName: 'Yılmaz',
        color: 'bg-teal-500',
        role: 'Araç Sahibi',
        rating: 5,
        text: 'Onaylı hesap sistemi güven veriyor. Yük sahipleriyle sorunsuz anlaşıyoruz, ödemeler de zamanında geliyor.',
    },
    {
        firstName: 'Serkan',
        lastName: 'Öztürk',
        color: 'bg-teal-700',
        role: 'Araç Sahibi',
        rating: 4,
        text: 'Uygulamayı kullanmaya başladığımdan beri boş sefer oranım neredeyse sıfıra düştü. Kazancımı ciddi oranda artırdım.',
    },
    {
        firstName: 'Oğuz',
        lastName: 'Koç',
        color: 'bg-teal-500',
        role: 'Araç Sahibi',
        rating: 5,
        text: 'Kayıt süreci çok kolaydı. Belgelerimi yükledim, hesabım hızlıca onaylandı. İlk haftada 3 sefer aldım.',
    },
    {
        firstName: 'Volkan',
        lastName: 'Kılıç',
        color: 'bg-teal-700',
        role: 'Araç Sahibi',
        rating: 5,
        text: 'Yük listesi her gün güncelleniyor. Rotama uygun ilanları filtreleyip hemen teklif verebiliyorum.',
    },
    {
        firstName: 'Tolga',
        lastName: 'Yıldız',
        color: 'bg-teal-500',
        role: 'Araç Sahibi',
        rating: 4,
        text: 'Mesajlaşma özelliği sayesinde yük sahipleriyle anında iletişim kuruyorum. İş takibi çok pratik.',
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
                            {{ commentInitials(review.firstName, review.lastName) }}
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-900">{{ commentDisplayName(review.firstName, review.lastName) }}</h4>
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
                            {{ commentInitials(review.firstName, review.lastName) }}
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-900">{{ commentDisplayName(review.firstName, review.lastName) }}</h4>
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
