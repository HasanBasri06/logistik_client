<template>
    <div class="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <Content class="flex-1 py-8 md:py-12">
            <div class="max-w-3xl mx-auto px-2">
                <div class="text-center mb-10 md:mb-14">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/10 text-primary">
                        <i class="pi pi-file-edit"></i>
                        Yasal
                    </span>
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mt-4 tracking-tight">
                        İptal ve İade Koşulları
                    </h1>
                    <p class="text-gray-500 mt-3 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                        6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında kısa bilgilendirme.
                    </p>
                </div>

                <article class="space-y-6">
                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">1</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Hizmet İptali</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                TaşıBul olarak hizmeti biz iptal etmiyoruz. Platform tarafından sunulan hizmet (üyelik, ilan/teklif eşleştirmesi) taraflarca sonlandırılmadıkça devam eder. Üyeliğinizi yalnızca siz kapatabilirsiniz; bu durumda da abonelik bedeli iade edilmez.
                            </p>
                        </div>
                    </section>

                    <div class="rounded-2xl bg-gray-100/80 border border-gray-200/80 px-6 py-4 md:px-8 md:py-5 mt-8">
                        <p class="text-xs md:text-sm text-gray-500 leading-relaxed">
                            Sorularınız için destek@tasibul.com. Tüketici şikâyetleri: <a href="https://tuketicihakemleri.ticaret.gov.tr" target="_blank" rel="noopener noreferrer" class="text-primary font-medium hover:underline">tuketicihakemleri.ticaret.gov.tr</a>. Son güncelleme: {{ currentYear }}.
                        </p>
                    </div>
                </article>

                <div class="mt-8 flex justify-center">
                    <RouterLink
                        to="/"
                        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-primary bg-primary/10 hover:bg-primary/15 border border-primary/20 transition-colors"
                    >
                        <i class="pi pi-arrow-left"></i>
                        Ana sayfaya dön
                    </RouterLink>
                </div>
            </div>
        </Content>
        <Footer />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import Footer from '@/components/Footer.vue';

const currentYear = computed(() => new Date().getFullYear());
</script>
