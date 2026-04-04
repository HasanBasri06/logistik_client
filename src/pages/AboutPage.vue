<template>
    <div class="flex flex-col min-h-screen bg-gray-50/50">
        <Header />
        <Content class="flex-1 py-12 md:py-16">
            <div class="max-w-5xl mx-auto px-1">
                <div class="text-center mb-10 md:mb-12">
                    <span class="text-sm font-semibold text-primary tracking-wide uppercase">Hakkımızda</span>
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mt-2">TaşıBul</h1>
                    <p class="text-gray-500 mt-3 leading-relaxed max-w-2xl mx-auto">
                        TaşıBul; yük sahipleri ile araç sahiplerini güvenli, hızlı ve şeffaf bir şekilde buluşturan lojistik platformudur.
                        Amacımız, taşımacılık süreçlerini dijitalleştirerek doğru eşleşmeyi kolaylaştırmak ve iletişimi hızlandırmaktır.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                        <div class="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <i class="pi pi-bolt text-lg"></i>
                        </div>
                        <h2 class="text-lg font-semibold text-gray-900">Hızlı eşleşme</h2>
                        <p class="text-sm text-gray-600 mt-2 leading-relaxed">
                            İlanlar, teklifler ve mesajlaşma ile ihtiyaç duyduğunuz taşıma çözümüne hızlıca ulaşın.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                        <div class="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <i class="pi pi-shield text-lg"></i>
                        </div>
                        <h2 class="text-lg font-semibold text-gray-900">Güven & doğrulama</h2>
                        <p class="text-sm text-gray-600 mt-2 leading-relaxed">
                            Doğrulama adımları ve süreç takibi ile daha güvenli bir deneyim hedefleriz.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                        <div class="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <i class="pi pi-comments text-lg"></i>
                        </div>
                        <h2 class="text-lg font-semibold text-gray-900">İletişim kolaylığı</h2>
                        <p class="text-sm text-gray-600 mt-2 leading-relaxed">
                            Mesajlaşma ve teklif yönetimi ile tek yerden iletişim kurun, kararınızı hızlandırın.
                        </p>
                    </div>
                </div>

                <div class="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-7">
                        <h3 class="text-lg font-semibold text-gray-900">Nasıl çalışır?</h3>
                        <ol class="mt-4 space-y-3 text-sm text-gray-700">
                            <li class="flex gap-3">
                                <span class="mt-0.5 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">1</span>
                                <span><strong>Yük sahibi</strong> ilan oluşturur, taşıma detaylarını paylaşır.</span>
                            </li>
                            <li class="flex gap-3">
                                <span class="mt-0.5 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">2</span>
                                <span><strong>Araç sahipleri</strong> ilanlara teklif verir, mesajlaşma başlar.</span>
                            </li>
                            <li class="flex gap-3">
                                <span class="mt-0.5 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">3</span>
                                <span><strong>Teklifler</strong> karşılaştırılır, anlaşma ile süreç ilerler.</span>
                            </li>
                        </ol>
                    </div>

                    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-7">
                        <h3 class="text-lg font-semibold text-gray-900">Bize ulaşın</h3>
                        <p class="text-sm text-gray-600 mt-3 leading-relaxed">
                            Sorularınız veya iş birliği talepleriniz için bize yazabilirsiniz.
                        </p>
                        <div class="mt-5 flex flex-col sm:flex-row gap-3">
                            <RouterLink
                                to="/help"
                                class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                            >
                                <i class="pi pi-send"></i>
                                Destek Formu
                            </RouterLink>
                            <a
                                href="mailto:destek@tasibul.com"
                                class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                <i class="pi pi-envelope"></i>
                                destek@tasibul.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Content>
        <Footer />
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import Footer from '@/components/Footer.vue';
import { RouterLink } from 'vue-router';
</script>

