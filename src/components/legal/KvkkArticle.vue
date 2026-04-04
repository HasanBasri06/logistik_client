<template>
    <div class="max-w-3xl mx-auto px-2">
        <div v-if="!hideHero" class="text-center mb-10 md:mb-14">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/10 text-primary">
                <i class="pi pi-shield"></i>
                KVKK
            </span>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mt-4 tracking-tight">
                KVKK Aydınlatma Metni
            </h1>
            <p class="text-gray-500 mt-3 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                6698 sayılı Kişisel Verilerin Korunması Kanunu’nun 10. maddesi uyarınca kişisel verilerinizin işlenmesine ilişkin sizi bilgilendirmek amacıyla hazırlanmıştır.
            </p>
        </div>

        <article class="space-y-6">
            <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                <div class="p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">1</span>
                        <h2 class="text-lg md:text-xl font-bold text-gray-900">Veri Sorumlusu</h2>
                    </div>
                    <p class="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                        6698 sayılı Kişisel Verilerin Korunması Kanunu (“Kanun”) uyarınca, kişisel verileriniz; veri sorumlusu sıfatıyla TaşıBul platformu (web sitesi ve/veya mobil uygulama) işletmecisi tarafından aşağıda açıklanan kapsamda işlenecektir.
                    </p>
                    <ul class="space-y-1 text-gray-600 text-sm md:text-base pl-4 list-none">
                        <li><span class="text-gray-500">Unvan:</span> TaşıBul (platform işletmecisi)</li>
                        <li><span class="text-gray-500">E-posta:</span> destek@tasibul.com</li>
                    </ul>
                </div>
            </section>

            <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                <div class="p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">2</span>
                        <h2 class="text-lg md:text-xl font-bold text-gray-900">Kişisel Verilerin İşlenme Amaçları</h2>
                    </div>
                    <p class="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                        Toplanan kişisel verileriniz; platform hizmetlerinin sunulması, üyelik ve hesap yönetimi, taşıma ilanı ve teklif süreçlerinin yürütülmesi, ödeme işlemlerinin gerçekleştirilmesi, sözleşme ve yasal yükümlülüklerin ifası, iletişim ve bilgilendirme, güvenlik ve dolandırıcılık önleme, talep ve şikâyetlerin değerlendirilmesi, hizmet kalitesinin artırılması ve Kanun’da öngörülen diğer amaçlarla işlenmektedir.
                    </p>
                    <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                        İşleme amaçları, Kanun’un 5. ve 6. maddelerinde belirtilen “açık rıza”, “sözleşmenin kurulması veya ifası”, “hukuki yükümlülük”, “meşru menfaat” ve yasal diğer şartlara dayanmaktadır.
                    </p>
                </div>
            </section>

            <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                <div class="p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">3</span>
                        <h2 class="text-lg md:text-xl font-bold text-gray-900">İşlenen Kişisel Veri Kategorileri ve Hukuki Sebepleri</h2>
                    </div>
                    <p class="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                        Kanun’un 4. maddesi kapsamında, aşağıdaki kişisel veri kategorileri belirtilen hukuki sebeplere dayanılarak işlenmektedir:
                    </p>
                    <ul class="space-y-3 text-gray-600 text-sm md:text-base list-none">
                        <li><strong class="text-gray-800">Kimlik bilgileri</strong> (ad, soyad): Sözleşmenin kurulması/ifası, hukuki yükümlülük.</li>
                        <li><strong class="text-gray-800">İletişim bilgileri</strong> (e-posta, telefon, adres): Sözleşmenin kurulması/ifası, açık rıza, meşru menfaat.</li>
                        <li><strong class="text-gray-800">Finansal bilgiler</strong> (ödeme araçlarına ilişkin bilgiler, işlem geçmişi): Sözleşmenin ifası, hukuki yükümlülük.</li>
                        <li><strong class="text-gray-800">İşlem ve güvenlik bilgileri</strong> (IP adresi, oturum bilgileri, cihaz bilgisi, log kayıtları): Meşru menfaat (güvenlik), hukuki yükümlülük.</li>
                        <li><strong class="text-gray-800">Çerez verileri</strong>: Açık rıza, meşru menfaat (site işleyişi, analiz).</li>
                    </ul>
                    <p class="text-gray-600 text-sm md:text-base leading-relaxed mt-4">
                        Özel nitelikli kişisel veriler (Kanun md. 6 – sağlık, biyometrik vb.) platform hizmeti kapsamında toplanmamaktadır; ileride toplanması hâlinde açık rızanız alınacak ve ayrıca aydınlatılacaksınız.
                    </p>
                </div>
            </section>

            <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                <div class="p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">4</span>
                        <h2 class="text-lg md:text-xl font-bold text-gray-900">Kişisel Verilerin Toplanma Yöntemi</h2>
                    </div>
                    <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                        Kişisel verileriniz; web sitesi ve mobil uygulama üzerinden üyelik/ilan/teklif formları, iletişim formu, e-posta ve çağrı merkezi, çerezler ve benzeri teknolojiler ile teknik loglar aracılığıyla otomatik veya otomatik olmayan yollarla, sözlü, yazılı veya elektronik ortamda toplanmaktadır.
                    </p>
                </div>
            </section>

            <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                <div class="p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">5</span>
                        <h2 class="text-lg md:text-xl font-bold text-gray-900">Kişisel Verilerin Aktarılması</h2>
                    </div>
                    <p class="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                        Kişisel verileriniz; hizmetin sunulması (ödeme kuruluşları, iş ortakları, taşıma hizmeti sağlayıcıları), hukuki zorunluluk (yetkili kamu kurum ve kuruluşları, mahkeme ve icra daireleri) ve Kanun’un 8. ve 9. maddelerinde öngörülen şartlara uygun olarak yurt içinde veya yurt dışında ilgili alıcı gruplarına aktarılabilmektedir.
                    </p>
                    <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                        Yurt dışına aktarımda Kanun’un 9. maddesi uyarınca; yabancı ülkenin yeterli korumaya sahip olması veya yeterli korumanın bulunmaması hâlinde Türkiye’deki ve ilgili yabancı ülkedeki veri sorumlularının yeterli korumayı yazılı olarak taahhüt etmeleri ve Kurul’un izninin bulunması şartlarına uyulmaktadır.
                    </p>
                </div>
            </section>

            <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                <div class="p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">6</span>
                        <h2 class="text-lg md:text-xl font-bold text-gray-900">Kişisel Verilerin Saklanma Süresi</h2>
                    </div>
                    <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                        Kişisel verileriniz, işleme amacının gerektirdiği süre ve 6102 sayılı Türk Ticaret Kanunu, 6098 sayılı Türk Borçlar Kanunu ile vergi ve diğer mevzuattan doğan saklama süreleri boyunca saklanmaktadır. Amaç ortadan kalktığında veya yasal süreler sona erdiğinde verileriniz silinmekte, yok edilmekte veya anonim hale getirilmektedir. Kanun’un 7. maddesi kapsamındaki silme ve yok etme talepleriniz değerlendirilmektedir.
                    </p>
                </div>
            </section>

            <div class="rounded-2xl bg-gray-100/80 border border-gray-200/80 px-6 py-4 md:px-8 md:py-5 mt-8">
                <p class="text-xs md:text-sm text-gray-500 leading-relaxed">
                    Son güncelleme: {{ currentYear }}. Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun 10. maddesi kapsamında aydınlatma yükümlülüğünün yerine getirilmesi amacıyla hazırlanmıştır. Şirket unvanı ve adres bilgileri işletme tarafından güncellenecektir.
                </p>
            </div>
        </article>

        <div v-if="!hideBackLink" class="mt-8 flex justify-center">
            <RouterLink
                to="/"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-primary bg-primary/10 hover:bg-primary/15 border border-primary/20 transition-colors"
            >
                <i class="pi pi-arrow-left"></i>
                Ana sayfaya dön
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

defineProps({
    hideHero: Boolean,
    hideBackLink: Boolean,
});

const currentYear = computed(() => new Date().getFullYear());
</script>
