<template>
    <div class="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <Content class="flex-1 py-8 md:py-12">
            <div class="max-w-3xl mx-auto px-2">
                <!-- Hero -->
                <div class="text-center mb-10 md:mb-14">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/10 text-primary">
                        <i class="pi pi-file-edit"></i>
                        Yasal
                    </span>
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mt-4 tracking-tight">
                        Mesafeli Satış Sözleşmesi
                    </h1>
                    <p class="text-gray-500 mt-3 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümlerine uygun olarak düzenlenmiştir.
                    </p>
                </div>

                <article class="space-y-6">
                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">1</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Taraflar</h2>
                            </div>
                            <p class="text-gray-700 leading-relaxed"><strong class="text-gray-900">1.1. Satıcı / Hizmet Sağlayıcı (İşletme):</strong></p>
                            <ul class="mt-2 space-y-1 text-gray-600 text-sm md:text-base pl-4 list-none">
                                <li><span class="text-gray-500">Unvan:</span> TaşıBul (platform işletmecisi)</li>
                                <li><span class="text-gray-500">E-posta:</span> destek@tasibul.com</li>
                            </ul>
                            <p class="mt-4 text-gray-700 leading-relaxed"><strong class="text-gray-900">1.2. Alıcı / Tüketici:</strong></p>
                            <p class="mt-1 text-gray-600 text-sm md:text-base pl-4">
                                Sözleşme konusu hizmeti platform üzerinden İlan veren veya üyelik oluşturan gerçek veya tüzel kişi. Alıcı, platforma kayıt sırasında ve İlan öncesi bildirdiği bilgilerle tanımlanır.
                            </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">2</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Sözleşmenin Konusu</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                    İşbu Mesafeli Satış Sözleşmesi’nin konusu, Alıcı’nın Satıcı’ya ait TaşıBul dijital platformunu (internet sitesi ve/veya mobil uygulama) kullanarak; yük taşımacılığı ilanı yayınlama, ilanlara teklif verme, taşıma hizmeti alıcı ve sunucuları eşleştirme gibi platform hizmetlerinden yararlanmasına ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir. Platform üzerinden gerçekleştirilen taşıma işinin kendisi, Alıcı ile taşıyıcı/araç sahibi arasında ayrıca kurulacak sözleşmeye tabidir; işbu sözleşme yalnızca platform kullanım hizmetini kapsar.
                                </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">3</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Hizmetin Tanımı ve Kapsamı</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                Satıcı, Alıcı’ya aşağıdaki hizmetleri sunar: (a) Platforma üyelik ve hesap yönetimi, (b) Yük/sevkiyat ilanı oluşturma ve yayınlama veya ilanlara teklif verme, (c) İlan ve teklif bilgilerinin platformda gösterilmesi,                                                                 (d) Mesajlaşma ve süreç takibi imkânı. Hizmetin niteliği, platform üzerinden ilan ve teklif eşleştirmesi yapılmasıdır; taşıma fiilinin ifası platform dışında gerçek kişi veya tüzel kişi taşıyıcılar tarafından yerine getirilir.
                            </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">4</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Ödeme ve Fiyatlandırma</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                Platform hizmeti kullanımına ilişkin ücretler, varsa abonelik veya komisyon tutarları, platformda ilan edilen güncel fiyatlar üzerinden geçerli olur. Ödeme, platformda belirtilen ödeme yöntemleri (kredi kartı, havale vb.) ile ve sözleşme/ilan akışında gösterilen tutar ve vadede yapılır. Tüm fiyatlar Türk Lirası (₺) cinsindendir; KDV dahil veya hariç bilgisi ilgili ekranda belirtilir. Alıcı, ödeme yükümlülüğünü kabul ettiğini platform üzerinden onaylayarak beyan eder.
                            </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">5</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Hizmetin İfası</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                Platform hizmeti, Alıcı’nın hesap oluşturması ve gerekli bilgileri vermesi ile erişilebilir hale gelir. İlan yayınlama veya teklif verme işlemleri anında platformda yansır. Satıcı, sistemin kesintisiz çalışması için makul çabayı gösterir; mükerrer sebeple oluşan aksaklıklarda yalnızca kusur oranında sorumludur.                                 Taşıma hizmetinin fiilen yerine getirilmesi, Alıcı ile taşıyıcı arasındaki ilişkiye tabidir.
                            </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">6</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Tarafların Yükümlülükleri</h2>
                            </div>
                            <div class="space-y-3 text-gray-600 text-sm md:text-base leading-relaxed">
                                <p><strong class="text-gray-800">6.1. Satıcı:</strong> Hizmeti, mevzuata ve sözleşmeye uygun şekilde sunar; genel bilgilendirme ve ön bilgilendirme formlarını sağlar; tüketici taleplerini değerlendirir ve şikâyetleri yanıtlar.</p>
                                <p><strong class="text-gray-800">6.2. Alıcı:</strong> Kayıt ve İlan sırasında verdiği bilgilerin doğru ve güncel olmasından sorumludur; platformu mevzuata ve kullanım koşullarına aykırı şekilde kullanmaz; şifre ve hesap güvenliğini sağlar.</p>
                            </div>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">7</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Kişisel Veriler ve Gizlilik</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                Taraflar, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamındaki yükümlülüklere uyarlar. Satıcı, Alıcı'nın kişisel verilerini yalnızca hizmetin sunulması, hukuki yükümlülük ve açık rıza çerçevesinde işler. Ayrıntılar için Gizlilik ve KVKK Aydınlatma Metni ile platformdaki ilgili sayfalar geçerlidir.
                            </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">8</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Yürürlük</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                İşbu Mesafeli Satış Sözleşmesi, Alıcı'nın platform üzerinden üyelik veya İlan onayı vermesi ile kurulur ve taraflarca elektronik ortamda kabul edilmiş sayılır. Sözleşmede yer almayan konularda 6502 sayılı Kanun, Mesafeli Sözleşmeler Yönetmeliği ve ilgili diğer mevzuat hükümleri uygulanır. Satıcı, yürürlükteki mevzuata uyum için sözleşme metninde güncelleme yapma hakkını saklı tutar; önemli değişiklikler kullanıcıya duyurulur.
                            </p>
                        </div>
                    </section>

                    <div class="rounded-2xl bg-gray-100/80 border border-gray-200/80 px-6 py-4 md:px-8 md:py-5 mt-8">
                        <p class="text-xs md:text-sm text-gray-500 leading-relaxed">
                            Son güncelleme: {{ currentYear }}. Bu metin bilgilendirme amaçlıdır; hukuki danışmanlık yerine geçmez.
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