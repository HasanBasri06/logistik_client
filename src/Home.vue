<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import Navbar from './partials/Navbar.vue';
import Content from '@/components/Content.vue';
import Footer from '@/components/Footer.vue';
import { Search, FileCheck, PackageCheck } from 'lucide-vue-next';
import whyUsImage from '@/assets/images/lojistik_wallpaper.jpg';

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
    <Navbar />
    <main class="main-home min-h-screen bg-[#f8f9fa]">
        <!-- Nasıl çalışır (Tailwind) -->
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

        <!-- Slogan + CTA -->
        <section class="slogan-cta w-full py-16 md:py-20 relative overflow-hidden" aria-label="Hemen başlayın">
            <div class="slogan-cta-bg absolute inset-0 bg-primary" />
            <div class="slogan-cta-pattern absolute inset-0 opacity-[0.07]" aria-hidden="true" />
            <Content>
                <div class="relative py-4 px-4 md:px-0 text-center">
                    <h2 class="slogan-title text-white">
                        Yükünüzü güvenle taşıtın, aracınızla yük taşıyın.
                    </h2>
                    <p class="slogan-desc mt-3 text-white/90">
                        TaşıBul ile kargo taşımacılığınızı kolaylaştırın.
                    </p>
                    <div class="mt-8">
                        <button
                            type="button"
                            class="slogan-btn"
                            @click="openLoginModal"
                        >
                            Giriş yap
                        </button>
                        <p class="mt-4 text-white/70 text-sm font-medium">Hesabınızla ilan verin veya ilan arayın.</p>
                    </div>
                </div>
            </Content>
        </section>

        <!-- Neden biz? -->
        <section id="why-us" class="section-home section-home--white py-20 md:py-28" aria-labelledby="why-us-title">
            <Content>
                <div class="px-4 md:px-0">
                    <div class="why-us-grid grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                        <div class="why-us-image order-2 md:order-1">
                            <img
                                :src="whyUsImage"
                                alt="TaşıBul ile güvenli kargo taşımacılığı"
                                class="why-us-img w-full h-[300px] md:h-[380px] object-cover rounded-2xl"
                            />
                        </div>
                        <div class="why-us-content order-1 md:order-2">
                            <span class="section-badge">Neden biz?</span>
                            <h2 id="why-us-title" class="section-title mt-2 text-left">
                                Güvenilir ve hızlı yük taşımacılığı
                            </h2>
                            <p class="mt-5 text-gray-600 leading-relaxed text-[15px]">
                                TaşıBul, yük sahipleri ile taşıyıcıları bir araya getirerek kargo taşımacılığını kolaylaştırır. İlanlarınızı hızlıca yayınlayın, size uygun teklifleri görün ve güvenle anlaşın.
                            </p>
                            <ul class="why-us-list mt-8 space-y-4">
                                <li class="flex items-start gap-3">
                                    <span class="why-us-check" aria-hidden="true">
                                        <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                                    </span>
                                    <span class="text-gray-700 text-[15px] leading-relaxed">Doğrulanmış ilanlar ve kullanıcı profilleri ile güvenli işlem</span>
                                </li>
                                <li class="flex items-start gap-3">
                                    <span class="why-us-check" aria-hidden="true">
                                        <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                                    </span>
                                    <span class="text-gray-700 text-[15px] leading-relaxed">Nereden–nereye ve tarihe göre anında ilan eşleştirme</span>
                                </li>
                                <li class="flex items-start gap-3">
                                    <span class="why-us-check" aria-hidden="true">
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

        <!-- SSS -->
        <section id="faq" class="section-home py-20 md:py-28" aria-labelledby="faq-title">
            <Content>
                <div class="px-4 md:px-0">
                    <header class="section-header text-center mb-14">
                        <span class="section-badge">SSS</span>
                        <h2 id="faq-title" class="section-title mt-2">
                            Sıkça Sorulan Sorular
                        </h2>
                        <p class="section-subtitle mt-3 max-w-lg mx-auto">
                            Aklınıza takılan soruların yanıtları aşağıda.
                        </p>
                    </header>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                        <article
                            v-for="(item, index) in faqItems"
                            :key="index"
                            class="faq-card"
                            :class="{ 'faq-card--open': openFaqIndex === index }"
                        >
                            <button
                                type="button"
                                class="faq-card-header w-full flex items-center justify-between gap-3 text-left"
                                :aria-expanded="openFaqIndex === index"
                                :aria-controls="'faq-answer-' + index"
                                :id="'faq-question-' + index"
                                @click="toggleFaq(index)"
                            >
                                <h3 class="faq-card-title">{{ item.question }}</h3>
                                <span class="faq-card-chevron shrink-0" aria-hidden="true">
                                    <svg class="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            <div
                                :id="'faq-answer-' + index"
                                class="faq-card-body"
                                role="region"
                                :aria-labelledby="'faq-question-' + index"
                                :aria-hidden="openFaqIndex !== index"
                            >
                                <Transition name="faq-expand">
                                    <p v-show="openFaqIndex === index" class="faq-card-desc">
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
</template>

<style scoped>
/* Ana sayfa bölümleri */
.main-home {
    color: #1f2937;
}
.section-home {
    background: #f8f9fa;
}
.section-home--white {
    background: #fff;
}
.section-header {
    margin-bottom: 1rem;
}
.section-badge {
    display: inline-block;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--p-primary-500, #39838c);
}
.section-title {
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
    color: #111827;
}
@media (min-width: 768px) {
    .section-title {
        font-size: 2rem;
    }
}
.section-subtitle {
    font-size: 0.9375rem;
    color: #6b7280;
    max-width: 36rem;
    margin-left: auto;
    margin-right: auto;
}
@media (min-width: 768px) {
    .section-subtitle {
        font-size: 1.0625rem;
    }
}

/* Slogan CTA */
.slogan-cta-pattern {
    background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0);
    background-size: 28px 28px;
    color: #fff;
}
.slogan-title {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.3;
}
@media (min-width: 768px) {
    .slogan-title {
        font-size: 1.5rem;
    }
}
@media (min-width: 1024px) {
    .slogan-title {
        font-size: 1.75rem;
    }
}
.slogan-desc {
    font-size: 1rem;
    max-width: 42rem;
    margin-left: auto;
    margin-right: auto;
}
@media (min-width: 768px) {
    .slogan-desc {
        font-size: 1.125rem;
    }
}
.slogan-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 11.25rem;
    padding: 0.875rem 2rem;
    border-radius: 0.75rem;
    background: #fff;
    color: var(--p-primary-500, #39838c);
    font-size: 0.9375rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.slogan-btn:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.15);
}
.slogan-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--p-primary-500, #39838c);
}
.slogan-btn:active {
    transform: scale(0.98);
}

/* Neden biz */
.why-us-img {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}
.why-us-check {
    margin-top: 0.125rem;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    background: rgba(57, 131, 140, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

/* SSS (açılır kapanır) */
.faq-card {
    border-radius: 0.75rem;
    background: #fff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
@media (min-width: 768px) {
    .faq-card {
        padding: 0;
    }
}
.faq-card:hover {
    border-color: rgba(57, 131, 140, 0.2);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.faq-card-header {
    width: 100%;
    padding: 1.25rem 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    color: inherit;
    border-radius: 0.75rem;
    transition: background 0.2s;
}
@media (min-width: 768px) {
    .faq-card-header {
        padding: 1.5rem 1.75rem;
    }
}
.faq-card-header:hover {
    background: rgba(0, 0, 0, 0.02);
}
.faq-card--open .faq-card-chevron {
    transform: rotate(180deg);
}
.faq-card-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
}
.faq-card-body {
    overflow: hidden;
}
.faq-card-desc {
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
    padding: 0 1.5rem 1.25rem;
}
@media (min-width: 768px) {
    .faq-card-desc {
        padding: 0 1.75rem 1.5rem;
    }
}
.faq-expand-enter-active,
.faq-expand-leave-active {
    transition: opacity 0.2s ease;
}
.faq-expand-enter-from,
.faq-expand-leave-to {
    opacity: 0;
}
</style>
