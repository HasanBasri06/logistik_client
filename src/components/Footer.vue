<template>
    <footer class="footer-home w-full bg-[#111827] text-gray-300">
        <Content>
            <div class="px-4 md:px-0 py-12 md:py-14">
                <div class="flex flex-col lg:flex-row lg:items-start gap-10 md:gap-12 lg:gap-16">
                    <!-- Marka -->
                    <div class="footer-brand lg:max-w-[280px]">
                        <RouterLink to="/" class="inline-flex items-center gap-2 text-white font-bold text-lg tracking-tight hover:text-primary transition-colors">
                            TaşıBul
                        </RouterLink>
                        <p class="mt-2 text-sm text-gray-400">
                            Yük taşımacılığı ilan platformu. Yükünüzü güvenle taşıtın, aracınızla yük taşıyın.
                        </p>
                        <!-- Sosyal medya -->
                        <div class="footer-social mt-6 flex items-center gap-3" aria-label="Sosyal medya">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="Instagram">
                                <Instagram class="footer-icon" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="LinkedIn">
                                <Linkedin class="footer-icon" />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="Facebook">
                                <Facebook class="footer-icon" />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="YouTube">
                                <Youtube class="footer-icon" />
                            </a>
                            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="TikTok">
                                <svg class="footer-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                            </a>
                        </div>
                    </div>
                    <!-- Sitemap -->
                    <nav class="footer-sitemap grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-10 flex-1" aria-label="Site haritası">
                        <div>
                            <h3 class="footer-sitemap-title text-white font-semibold text-sm uppercase tracking-wider mb-4">Keşfet</h3>
                            <ul class="space-y-2.5">
                                <li><RouterLink to="/" class="footer-link">Anasayfa</RouterLink></li>
                                <li><RouterLink to="/panel" class="footer-link">Araç Bul</RouterLink></li>
                                <li><a href="/#how-it-works" class="footer-link">Nasıl Çalışır?</a></li>
                                <li><a href="/#why-us" class="footer-link">Neden Biz?</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="footer-sitemap-title text-white font-semibold text-sm uppercase tracking-wider mb-4">Destek</h3>
                            <ul class="space-y-2.5">
                                <li><RouterLink to="/help" class="footer-link">Yardım</RouterLink></li>
                                <li><a href="/#faq" class="footer-link">Sıkça Sorulan Sorular</a></li>
                                <li><a href="mailto:destek@tasibul.com" class="footer-link">İletişim</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="footer-sitemap-title text-white font-semibold text-sm uppercase tracking-wider mb-4">Yasal</h3>
                            <ul class="space-y-2.5">
                                <li><a href="#" class="footer-link">Gizlilik Politikası</a></li>
                                <li><a href="#" class="footer-link">Kullanım Koşulları</a></li>
                                <li><a href="#" class="footer-link">Çerezler</a></li>
                            </ul>
                        </div>
                    </nav>
                </div>
                <div class="mt-12 pt-8 border-t border-gray-700/60">
                    <p class="text-xs text-gray-500">
                        © {{ currentYear }} TaşıBul. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </Content>
    </footer>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import Content from '@/components/Content.vue';
import { Instagram, Linkedin, Facebook, Youtube } from 'lucide-vue-next';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer-home a.router-link-active {
    color: var(--p-primary-400, #4a9b9f);
}
.footer-link {
    font-size: 0.875rem;
    color: #9ca3af;
    transition: color 0.2s;
}
.footer-link:hover {
    color: #fff;
}
.footer-social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.06);
    color: #9ca3af;
    transition: color 0.2s, background 0.2s;
}
.footer-social-link:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.12);
}
.footer-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}
</style>
