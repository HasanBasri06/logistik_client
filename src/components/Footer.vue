<template>
    <footer class="w-full bg-[#111827] text-gray-300 ">
        <Content>
                <div class="py-10 md:py-14">
                <div class="flex flex-col items-center gap-10 text-center md:grid md:grid-cols-3 md:items-stretch md:gap-10 lg:grid-cols-5 md:text-left">

                    <div class="flex flex-col items-center gap-4 md:col-span-3 lg:col-span-1 md:items-start">
                        <RouterLink to="/" class="text-white font-bold text-lg tracking-tight hover:text-primary transition-colors">
                            TaşıBul
                        </RouterLink>
                        <p class="text-sm text-gray-400 leading-relaxed">
                            Yük taşımacılığı ilan platformu. Yükünüzü güvenle taşıtın, aracınızla yük taşıyın.
                        </p>
                        <a href="mailto:destek@tasibul.com" class="footer-link flex items-center justify-center gap-2 mt-2 md:justify-start">
                            <i class="pi pi-envelope text-xs"></i>
                            destek@tasibul.com
                        </a>
                    </div>

                    <div class="w-full md:w-auto">
                        <h3 class="text-white font-semibold text-sm uppercase tracking-wider mb-5">Yasal Yükümlülük</h3>
                        <ul class="space-y-3 flex flex-col items-center md:items-stretch">
                            <li><RouterLink to="/mesafeli-satis-sozlesmesi" class="footer-link">Mesafeli Satış Sözleşmesi</RouterLink></li>
                            <li><RouterLink to="/gizlilik-sozlesmesi" class="footer-link">Gizlilik Sözleşmesi</RouterLink></li>
                            <li><RouterLink to="/uyelik-sozlesmesi" class="footer-link">Üyelik Sözleşmesi</RouterLink></li>
                            <li><RouterLink to="/iptal-ve-iade-kosullari" class="footer-link">İptal ve İade Koşulları</RouterLink></li>
                            <li><RouterLink to="/kvkk" class="footer-link">KVKK</RouterLink></li>
                        </ul>
                    </div>

                    <div class="w-full md:w-auto">
                        <h3 class="text-white font-semibold text-sm uppercase tracking-wider mb-5">Sosyal Medya</h3>
                        <ul class="space-y-3 flex flex-col items-center md:items-stretch">
                            <li>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="footer-link flex items-center gap-2">
                                    <Instagram :size="16" /> Instagram
                                </a>
                            </li>
                            <li>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="footer-link flex items-center gap-2">
                                    <Linkedin :size="16" /> LinkedIn
                                </a>
                            </li>
                            <li>
                                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="footer-link flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                                    TikTok
                                </a>
                            </li>
                            <li>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="footer-link flex items-center gap-2">
                                    <Facebook :size="16" /> Facebook
                                </a>
                            </li>
                            <li>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="footer-link flex items-center gap-2">
                                    <Twitter :size="16" /> Twitter
                                </a>
                            </li>
                            <li>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="footer-link flex items-center gap-2">
                                    <Youtube :size="16" /> YouTube
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="w-full md:w-auto">
                        <h3 class="text-white font-semibold text-sm uppercase tracking-wider mb-5">Mobil</h3>
                        <p class="text-sm text-gray-400 leading-relaxed">Yakın zamanda eklenecektir.</p>
                        <div class="flex flex-col items-center gap-3 mt-4 md:items-stretch">
                            <div class="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3 opacity-50">
                                <i class="pi pi-apple text-lg text-white"></i>
                                <div>
                                    <p class="text-[10px] text-gray-400 leading-none">Çok yakında</p>
                                    <p class="text-sm text-white font-medium">App Store</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3 opacity-50">
                                <i class="pi pi-android text-lg text-white"></i>
                                <div>
                                    <p class="text-[10px] text-gray-400 leading-none">Çok yakında</p>
                                    <p class="text-sm text-white font-medium">Google Play</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="w-full md:w-auto">
                        <h3 class="text-white font-semibold text-sm uppercase tracking-wider mb-5">Blog</h3>
                        <p class="text-sm text-gray-400 leading-relaxed">Lojistik sektöründeki gelişmeleri ve platformumuzdaki yenilikleri blogumuzdan takip edin.</p>
                        <RouterLink to="/blog" class="inline-flex items-center justify-center gap-1.5 text-sm text-primary hover:text-white transition-colors mt-4 md:justify-start">
                            Blogu Keşfet <i class="pi pi-arrow-right text-xs"></i>
                        </RouterLink>
                    </div>

                </div>

                <div class="mt-10 md:mt-12 pt-8 border-t border-gray-700/60 flex flex-col items-center text-center md:flex-row md:justify-between md:items-center gap-3">
                    <p class="text-xs text-gray-500">
                        © {{ currentYear }} TaşıBul. Tüm hakları saklıdır.
                    </p>
                    <img src="@/assets/images/visa_master.png" alt="Visa ve Mastercard" class="h-6 md:h-7 object-contain opacity-90" />
                </div>
            </div>
        </Content>
    </footer>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import Content from '@/components/Content.vue';
import { Instagram, Linkedin, Facebook, Youtube, Twitter } from 'lucide-vue-next';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer-link {
    font-size: 0.875rem;
    color: #9ca3af;
    transition: color 0.2s;
}
.footer-link:hover {
    color: #fff;
}
</style>
