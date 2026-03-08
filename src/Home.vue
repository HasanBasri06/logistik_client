<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import Navbar from './partials/Navbar.vue';
import Content from '@/components/Content.vue';
import Footer from '@/components/Footer.vue';
import { Search, FileCheck, PackageCheck, Truck, ArrowRight, Shield } from 'lucide-vue-next';
import whyUsImage from '@/assets/images/lojistik_wallpaper.jpg';
import Header from './components/Header.vue';
import HeroSection from './assets/images/hero_section.png';

function openLoginModal() {
    window.dispatchEvent(new CustomEvent('open-login'));
}

const openFaqIndex = ref(null);
function toggleFaq(index) {
    openFaqIndex.value = openFaqIndex.value === index ? null : index;
}

const faqItems = [
    { question: 'TaşıBul nedir?', answer: 'TaşıBul, yük taşımacılığı ilanlarını yük sahipleri ile taşıyıcıları buluşturan bir platformdur. İlan vererek veya ilan bularak kargo taşımacılığınızı kolaylaştırabilirsiniz.' },
    { question: 'İlan vermek ücretli mi?', answer: 'İlan oluşturma ve arama temel kullanımımızda ücretsizdir. Detaylı fiyatlandırma bilgisi için destek ekibimizle iletişime geçebilirsiniz.' },
    { question: 'Nasıl taşıyıcı veya yük sahibi olabilirim?', answer: 'Kayıt olup giriş yaptıktan sonra profil türünüzü seçebilirsiniz. Yük taşımak istiyorsanız araç ilanı, yük taşıtmak istiyorsanız yük ilanı oluşturabilirsiniz.' },
    { question: 'Ödeme nasıl yapılıyor?', answer: 'Ödeme koşulları ilan sahibi ile taşıyıcı arasında mesajlaşma üzerinden belirlenir. Platform üzerinden güvenli iletişim kurarak anlaşmanızı yapabilirsiniz.' },
    { question: 'İlanımı nasıl güncellerim?', answer: 'Giriş yaptıktan sonra hesabınız üzerinden "İlanlarım" bölümüne giderek ilanlarınızı düzenleyebilir, güncelleyebilir veya kapatabilirsiniz.' },
    { question: 'Güvenlik ve doğrulama var mı?', answer: 'Evet. Doğrulanmış profilleri öne çıkarıyoruz ve kullanıcıların iletişim bilgileri platform üzerinden yönetilir. Şüpheli ilanları bildirebilirsiniz.' },
    { question: 'Hangi araç türleri destekleniyor?', answer: 'Kamyon, TIR, panelvan, minivan ve frigofirik gibi yaygın yük taşıma araç türleri desteklenmektedir. İlan verirken araç türünü seçebilirsiniz.' },
    { question: 'Destek nasıl alabilirim?', answer: 'Yardım sayfamızdan ve iletişim formundan bize ulaşabilirsiniz. Müşteri hizmetleri ekibimiz en kısa sürede size dönüş yapacaktır.' }
];

</script>

<template>
    <Header />

    <Content class="flex h-auto flex-col items-center pt-16 gap-10">
        <h1 class="text-6xl text-center font-semibold leading-normal text-gray-900 mb-8">
            <div class="[&>span]:mr-5 text-gray-800">
                <span>Türkiyenin en büyük yük taşımacılığı</span>
                <br />
                <span class="flex flex-row items-center justify-center gap-5">
                    <i class="pi pi-globe ring-12 ring-primary/20 rounded-full text-primary" style="font-size: 2rem;"></i>
                    <span class="text-primary">Platformu</span>
                </span>
            </div>
        </h1>
        

        <form @submit.prevent class="flex flex-row items-center relative">
            <input type="text" placeholder="Nereden" class="border-l border-t border-b border-gray-300 rounded-l-xl px-4 py-4 outline-none" />
            <div class="h-px w-60 bg-gray-300 absolute top-0 left-2/4 -translate-x-3/4"></div>
            <div class="h-px w-72 bg-gray-300 absolute bottom-0 left-6"></div>
            <div class="w-10 h-10 rounded-full cursor-pointer bg-primary/30 text-primary flex items-center justify-center">
                <i class="pi pi-arrow-right-arrow-left"></i>
            </div>
            <input type="text" placeholder="Nereye" class="border-r border-t border-b border-gray-300 px-4 py-4 outline-none" />
            <input type="text" placeholder="Taşıt" class="border-r border-t border-b w-24 border-gray-300 px-4 py-4 outline-none" />
            <button type="submit" class="bg-primary text-white cursor-pointer px-4 py-4 rounded-r-xl border-r border-t border-b border-primary">Taşıt Ara</button>
        </form>

        <img :src="HeroSection" alt="Hero Section" class="w-[45%] mt-10 h-auto object-cover relative z-20" />

    </Content>
    <Content class="bg-stone-900 h-[700px] relative -top-28 z-0 rounded-b-4xl rounded-t-4xl overflow-hidden">
        <div class="w-96 h-96 rounded-full -mt-40 blur-3xl bg-primary/80 left-2/4 -translate-x-2/4 z-10  absolute"></div>
    </Content>
    awdd

    <!-- 
        <Navbar />
        <main class="min-h-screen bg-[#f8f9fa] text-gray-800">
            <section class="relative min-h-[85vh] flex flex-col justify-center overflow-hidden" aria-label="TaşıBul ile yük taşımacılığı">
                <div class="absolute inset-0 bg-[linear-gradient(135deg,#f0f9fa_0%,#e8f4f5_40%,#f8f9fa_100%)]" />
                <div
                    class="absolute inset-0 opacity-100"
                    style="background: radial-gradient(ellipse 80% 60% at 70% 30%, rgba(57, 131, 140, 0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, rgba(57, 131, 140, 0.08) 0%, transparent 45%);"
                />
                <div
                    class="absolute inset-0 opacity-[0.03]"
                    style="background-image: linear-gradient(rgba(57,131,140,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(57,131,140,0.15) 1px, transparent 1px); background-size: 48px 48px;"
                    aria-hidden="true"
                />
                <Content class="relative z-10 py-16 md:py-24">
                    <div class="px-4 md:px-0 flex flex-col md:flex-row md:items-center md:justify-between gap-12 md:gap-16">
                        <div class="max-w-2xl">
                            <p class="inline-flex items-center gap-2 text-primary font-semibold text-sm tracking-wide uppercase mb-6">
                                <Shield class="w-4 h-4" />
                                Güvenilir lojistik platformu
                            </p>
                            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-gray-900 leading-[1.1]">
                                Yükünüzü taşıtın,<br />
                                <span class="text-primary">araçla kazanın.</span>
                            </h1>
                            <p class="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                                Yük sahipleri ile taşıyıcıları bir araya getiriyoruz. İlan verin, teklif alın veya aracınızla yük taşıyın — hepsi tek platformda.
                            </p>
                            <div class="mt-10 flex flex-wrap gap-4">
                                <button
                                    type="button"
                                    class="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-primary text-white text-base font-semibold tracking-tight shadow-[0_4px_14px_rgba(57,131,140,0.4)] hover:bg-[#2d6a72] hover:shadow-[0_6px_20px_rgba(57,131,140,0.45)] hover:-translate-y-px active:translate-y-0 border-0 cursor-pointer transition-all duration-200"
                                    @click="openLoginModal"
                                >
                                    Giriş yap
                                    <ArrowRight class="w-5 h-5 ml-2 shrink-0" />
                                </button>
                                <RouterLink
                                    to="/help"
                                    class="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white text-primary text-base font-semibold border-2 border-primary/30 hover:border-primary hover:bg-primary/5 hover:-translate-y-px no-underline transition-all duration-200"
                                >
                                    Nasıl çalışır?
                                </RouterLink>
                            </div>
                            <div class="mt-12 flex flex-wrap gap-8 text-sm text-gray-500">
                                <span class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-primary" />
                                    Ücretsiz ilan
                                </span>
                                <span class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-primary" />
                                    Anlık eşleşme
                                </span>
                                <span class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-primary" />
                                    Güvenli mesajlaşma
                                </span>
                            </div>
                        </div>
                        <div class="hidden lg:flex flex-1 justify-end items-center max-w-md xl:max-w-lg">
                            <div class="relative w-full aspect-[4/3] rounded-3xl bg-white/95 backdrop-blur border border-white/50 overflow-hidden flex items-center justify-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)]">
                                <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
                                <Truck class="w-32 h-32 md:w-40 md:h-40 text-primary/30 absolute" stroke-width="1" />
                                <div class="relative text-center px-8 py-6">
                                    <p class="text-sm font-semibold text-primary uppercase tracking-wider">TaşıBul</p>
                                    <p class="text-gray-600 text-sm mt-1">Yük & Araç ilanları</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Content>
            </section>
    
            <section id="how-it-works" class="bg-[#f8f9fa] py-20 md:py-28 mt-10" aria-labelledby="how-it-works-title">
                <Content>
                    <div class="px-4 md:px-0">
                        <header class="text-center mb-16">
                            <span class="inline-block text-xs font-semibold tracking-[0.14em] uppercase text-primary">Süreç</span>
                            <h2 id="how-it-works-title" class="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mt-2">
                                Nasıl Çalışır?
                            </h2>
                            <p class="mt-3 text-gray-500 text-sm md:text-base max-w-xl mx-auto">
                                Üç adımda yük taşımacılığı ilanlarınıza ulaşın veya aracınızla taşıma yapın.
                            </p>
                        </header>
                        <div class="flex flex-col md:flex-row md:items-start gap-12 md:gap-0">
                            <article class="flex-1 flex flex-col items-center text-center">
                                <div class="w-14 h-14 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 text-primary">
                                    <Search class="w-7 h-7" stroke-width="2" />
                                </div>
                                <h3 class="mt-5 text-lg font-semibold text-gray-900">İlan ara</h3>
                                <p class="mt-2 text-sm text-gray-600 leading-relaxed max-w-[300px]">
                                    Nereden, nereye ve tarih bilgilerinizi girin; size uygun yük veya araç ilanlarını listeleyin.
                                </p>
                            </article>
                            <div class="hidden md:flex flex-[0_0_2.5rem] items-center pt-7" aria-hidden="true">
                                <span class="block w-full h-0 border-0 border-t-2 border-dotted border-primary/40" />
                            </div>
                            <article class="flex-1 flex flex-col items-center text-center">
                                <div class="w-14 h-14 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 text-primary">
                                    <FileCheck class="w-7 h-7" stroke-width="2" />
                                </div>
                                <h3 class="mt-5 text-lg font-semibold text-gray-900">Teklif al veya ver</h3>
                                <p class="mt-2 text-sm text-gray-600 leading-relaxed max-w-[300px]">
                                    İlan sahibiyle iletişime geçin, fiyat ve detayları netleştirip anlaşın.
                                </p>
                            </article>
                            <div class="hidden md:flex flex-[0_0_2.5rem] items-center pt-7" aria-hidden="true">
                                <span class="block w-full h-0 border-0 border-t-2 border-dotted border-primary/40" />
                            </div>
                            <article class="flex-1 flex flex-col items-center text-center">
                                <div class="w-14 h-14 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 text-primary">
                                    <PackageCheck class="w-7 h-7" stroke-width="2" />
                                </div>
                                <h3 class="mt-5 text-lg font-semibold text-gray-900">Yolculuk tamamla</h3>
                                <p class="mt-2 text-sm text-gray-600 leading-relaxed max-w-[300px]">
                                    Yükü teslim alın veya teslim edin; ödemenizi güvenle tamamlayın.
                                </p>
                            </article>
                        </div>
                    </div>
                </Content>
            </section>
    
            <section class="w-full py-16 md:py-20 relative overflow-hidden" aria-label="Hemen başlayın">
                <div class="absolute inset-0 bg-primary" />
                <div
                    class="absolute inset-0 opacity-[0.07] text-white"
                    style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 28px 28px;"
                    aria-hidden="true"
                />
                <Content>
                    <div class="relative py-4 px-4 md:px-0 text-center">
                        <h2 class="text-xl md:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-white leading-snug">
                            Yükünüzü güvenle taşıtın, aracınızla yük taşıyın.
                        </h2>
                        <p class="mt-3 text-base md:text-lg text-white/90 max-w-3xl mx-auto">
                            TaşıBul ile kargo taşımacılığınızı kolaylaştırın.
                        </p>
                        <div class="mt-8">
                            <button
                                type="button"
                                class="inline-flex items-center justify-center min-w-[11.25rem] py-3.5 px-8 rounded-xl bg-white text-primary text-[0.9375rem] font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.12)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary active:scale-[0.98] transition-all duration-200"
                                @click="openLoginModal"
                            >
                                Giriş yap
                            </button>
                            <p class="mt-4 text-white/70 text-sm font-medium">Hesabınızla ilan verin veya ilan arayın.</p>
                        </div>
                    </div>
                </Content>
            </section>
    
            <section id="why-us" class="bg-white py-20 md:py-28" aria-labelledby="why-us-title">
                <Content>
                    <div class="px-4 md:px-0">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                            <div class="order-2 md:order-1">
                                <img
                                    :src="whyUsImage"
                                    alt="TaşıBul ile güvenli kargo taşımacılığı"
                                    class="w-full h-[300px] md:h-[380px] object-cover rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                                />
                            </div>
                            <div class="order-1 md:order-2">
                                <span class="inline-block text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-primary">Neden biz?</span>
                                <h2 id="why-us-title" class="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mt-2 text-left">
                                    Güvenilir ve hızlı yük taşımacılığı
                                </h2>
                                <p class="mt-5 text-gray-600 leading-relaxed text-[15px]">
                                    TaşıBul, yük sahipleri ile taşıyıcıları bir araya getirerek kargo taşımacılığını kolaylaştırır. İlanlarınızı hızlıca yayınlayın, size uygun teklifleri görün ve güvenle anlaşın.
                                </p>
                                <ul class="mt-8 space-y-4">
                                    <li class="flex items-start gap-3">
                                        <span class="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0" aria-hidden="true">
                                            <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                                        </span>
                                        <span class="text-gray-700 text-[15px] leading-relaxed">Doğrulanmış ilanlar ve kullanıcı profilleri ile güvenli işlem</span>
                                    </li>
                                    <li class="flex items-start gap-3">
                                        <span class="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0" aria-hidden="true">
                                            <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                                        </span>
                                        <span class="text-gray-700 text-[15px] leading-relaxed">Nereden–nereye ve tarihe göre anında ilan eşleştirme</span>
                                    </li>
                                    <li class="flex items-start gap-3">
                                        <span class="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0" aria-hidden="true">
                                            <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                                        </span>
                                        <span class="text-gray-700 text-[15px] leading-relaxed">Şeffaf fiyatlandırma ve mesajlaşma ile kolay iletişim</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Content>
            </section>
    
            <section id="faq" class="bg-[#f8f9fa] py-20 md:py-28" aria-labelledby="faq-title">
                <Content>
                    <div class="px-4 md:px-0">
                        <header class="text-center mb-14">
                            <span class="inline-block text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-primary">SSS</span>
                            <h2 id="faq-title" class="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mt-2">
                                Sıkça Sorulan Sorular
                            </h2>
                            <p class="mt-3 text-sm md:text-[1.0625rem] text-gray-500 max-w-xl mx-auto">
                                Aklınıza takılan soruların yanıtları aşağıda.
                            </p>
                        </header>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                            <article
                                v-for="(item, index) in faqItems"
                                :key="index"
                                class="rounded-xl bg-white border border-gray-200 shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-200"
                            >
                                <button
                                    type="button"
                                    class="w-full flex items-center justify-between gap-3 text-left py-5 px-6 md:py-6 md:px-7 bg-transparent border-0 cursor-pointer font-inherit text-inherit rounded-xl hover:bg-black/5 transition-colors"
                                    :aria-expanded="openFaqIndex === index"
                                    :aria-controls="'faq-answer-' + index"
                                    :id="'faq-question-' + index"
                                    @click="toggleFaq(index)"
                                >
                                    <h3 class="text-[0.9375rem] font-semibold text-gray-900 m-0">{{ item.question }}</h3>
                                    <span
                                        class="shrink-0 transition-transform duration-200"
                                        :class="{ 'rotate-180': openFaqIndex === index }"
                                        aria-hidden="true"
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </button>
                                <div
                                    :id="'faq-answer-' + index"
                                    class="overflow-hidden"
                                    role="region"
                                    :aria-labelledby="'faq-question-' + index"
                                    :aria-hidden="openFaqIndex !== index"
                                >
                                    <Transition name="faq-expand">
                                        <p
                                            v-show="openFaqIndex === index"
                                            class="text-sm text-gray-600 leading-relaxed m-0 pt-0 pr-6 pb-5 pl-6 md:pr-7 md:pb-6 md:pl-7"
                                        >
                                            {{ item.answer }}
                                        </p>
                                    </Transition>
                                </div>
                            </article>
                        </div>
                    </div>
                </Content>
            </section>
            <Footer />
        </main>
     -->
</template>

<style scoped>
/* Vue Transition - Tailwind bu sınıf isimlerini üretemediği için minimal CSS */
.faq-expand-enter-active,
.faq-expand-leave-active {
    transition: opacity 0.2s ease;
}
.faq-expand-enter-from,
.faq-expand-leave-to {
    opacity: 0;
}
</style>
