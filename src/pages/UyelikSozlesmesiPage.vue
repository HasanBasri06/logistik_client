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
                        Üyelik Sözleşmesi
                    </h1>
                    <p class="text-gray-500 mt-3 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                        TaşıBul platformuna üyelik ve platform kullanımına ilişkin hak ve yükümlülüklerinizi düzenleyen sözleşmedir.
                    </p>
                </div>

                <article class="space-y-6">
                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">1</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Taraflar</h2>
                            </div>
                            <p class="text-gray-700 leading-relaxed mb-2"><strong class="text-gray-900">1.1. Platform / İşletme:</strong></p>
                            <ul class="space-y-1 text-gray-600 text-sm md:text-base pl-4 list-none mb-4">
                                <li><span class="text-gray-500">Unvan:</span> TaşıBul (platform işletmecisi)</li>
                                <li><span class="text-gray-500">E-posta:</span> destek@tasibul.com</li>
                            </ul>
                            <p class="text-gray-700 leading-relaxed"><strong class="text-gray-900">1.2. Üye:</strong> Platforma kayıt olan, bu sözleşmeyi elektronik ortamda kabul eden gerçek veya tüzel kişi. Üye, kayıt sırasında bildirdiği bilgilerle tanımlanır.</p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">2</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Sözleşmenin Konusu ve Kapsamı</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                İşbu Üyelik Sözleşmesi’nin konusu, Üye’nin TaşıBul dijital platformunu (internet sitesi ve/veya mobil uygulama) kullanarak yük taşımacılığı ilanı yayınlama, ilanlara teklif verme ve platform hizmetlerinden yararlanmasına ilişkin tarafların hak ve yükümlülükleridir. Platform üzerinden gerçekleştirilen taşıma işinin kendisi, ilan veren ile taşıyıcı/araç sahibi arasında ayrıca kurulacak sözleşmeye tabidir; işbu sözleşme yalnızca platforma üyelik ve platform kullanımına ilişkindir. Tüketici iseniz Mesafeli Satış Sözleşmesi ve ilgili mevzuat hükümleri de uygulanır.
                            </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">3</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Üyelik Koşulları ve Kayıt</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                                Platforma üye olmak için 18 yaşını doldurmuş olmak veya yasal temsilci onayı ile hareket etmek, gerçek ve güncel bilgi vermek gereklidir. Kayıt sırasında e-posta, şifre ve sözleşme metinlerinin kabulü ile üyelik kurulur. Platform, üyeliği onaylama veya reddetme hakkını saklı tutar; sahte veya yanıltıcı bilgi tespitinde üyelik iptal edilebilir.
                            </p>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                Tek bir kişi veya tüzel kişi adına yalnızca bir üyelik açılabilir. Hesap güvenliği Üye’nin sorumluluğundadır; şifrenin üçüncü kişilerce kullanılmasından Platform, kusuru olmadığı sürece sorumlu tutulamaz.
                            </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">4</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Üyenin Yükümlülükleri</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                                Üye aşağıdaki hususlara uymakla yükümlüdür:
                            </p>
                            <ul class="space-y-2 text-gray-600 text-sm md:text-base list-none">
                                <li>Kayıt ve ilan/teklif sırasında verilen bilgilerin doğru, güncel ve eksiksiz olması; değişikliklerin geciktirilmeden güncellenmesi.</li>
                                <li>Platformu yalnızca meşru amaçlarla, 6098 sayılı Türk Borçlar Kanunu, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve ilgili mevzuata uygun şekilde kullanması.</li>
                                <li>Üçüncü kişilerin haklarına (fikri mülkiyet, kişilik hakları, gizlilik) saygı göstermesi; platform üzerinden hakaret, tehdit, dolandırıcılık veya yanıltıcı ilan/teklif yayınlamaması.</li>
                                <li>Şifre ve hesap bilgilerinin gizli tutulması; yetkisiz kullanım şüphesinde Platform’a derhâl bildirimde bulunması.</li>
                                <li>Platformun işleyişini bozacak (otomatik bot, kazıma, DDoS vb.) müdahalelerde bulunmaması.</li>
                            </ul>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed mt-4">
                                Bu yükümlülüklere aykırılık, üyeliğin askıya alınması veya feshi ile sonuçlanabilir; hukuki ve cezai sorumluluk Üye’ye aittir.
                            </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">5</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Platformun Yükümlülükleri</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                Platform, hizmeti mevzuata ve sözleşmelere uygun şekilde sunmak, genel kullanım koşullarını ve gizlilik/gizlilik politikasını erişilebilir kılmak, teknik altyapıyı makul ölçüde kesintisiz tutmak ve kullanıcı taleplerini değerlendirmekle yükümlüdür. Platform, üyeler arasında veya üye ile taşıyıcı arasında doğan uyuşmazlıklarda aracı konumundadır; taşıma sözleşmesinin tarafları ilan veren ile taşıyıcıdır. Platform, aracılık hizmeti dışında taşıma işinin ifasından sorumlu değildir.
                            </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">6</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Fikri Mülkiyet ve Lisans</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                Platforma ait marka, logo, arayüz, yazılım ve içerikler (5846 sayılı Fikir ve Sanat Eserleri Kanunu ve 556 sayılı KHK kapsamında) Platform veya lisans verenlerine aittir. Üye, yalnızca platformu kullanım hakkına sahiptir; kopyalama, çoğaltma, ticari kullanım veya tersine mühendislik yapılamaz. Üye’nin platforma yüklediği içerikler için Platform’a, hizmetin sunulması için gerekli, dünya çapında, devredilebilir, alt lisanslanabilir, süresiz ve telif ücretsiz lisans verilmiş sayılır.
                            </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">7</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Sorumluluk Sınırı</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                Platform, yalnızca kendi kusurundan kaynaklanan zararlardan ve doğrudan öngörülebilir zararlar ölçüsünde sorumludur. Üyeler arası veya üye ile taşıyıcı arası anlaşmazlık, gecikme, mal kaybı/hasarı veya ödeme uyuşmazlıklarından Platform, aracı olması nedeniyle kusuru bulunmadıkça sorumlu tutulamaz. Zorunlu sebep (mücbir sebep), sistem arızaları veya üçüncü taraf davranışlarından doğan kesintilerde Platform’un sorumluluğu, kusuru oranıyla sınırlıdır. Tüketici iseniz 6502 sayılı Kanun kapsamındaki haklarınız saklıdır.
                            </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">8</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Üyeliğin Feshi ve Askıya Alınması</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                                Üye, üyeliğini her zaman hesap ayarları veya destek@tasibul.com üzerinden sonlandırabilir. Platform, sözleşme ihlali, sahte bilgi, dolandırıcılık şüphesi, yasal zorunluluk veya hizmet güvenliği gerekçesiyle üyeliği askıya alabilir veya feshedebilir; gerekirse önceden bildirim yapılmaksızın işlem yapılabilir.
                            </p>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                Fesih veya askıya alma sonrasında devam eden ödeme yükümlülükleri ve yasal saklama yükümlülükleri saklı kalır. Kişisel verileriniz, Gizlilik Sözleşmesi ve 6698 sayılı KVKK kapsamında belirtilen süreler boyunca saklanabilir.
                            </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">9</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Uyuşmazlık Çözümü ve Uygulanacak Hukuk</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                                İşbu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti kanunları uygulanır. Tüketici niteliğindeki üyeler için 6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir; diğer üyeler için İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.
                            </p>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                Tüketici şikâyetleri için <a href="https://tuketicihakemleri.ticaret.gov.tr" target="_blank" rel="noopener noreferrer" class="text-primary font-medium hover:underline">Tüketici Hakem Heyetleri</a> ve Ticaret Bakanlığı’nın ilgili sayfalarından bilgi alınabilir.
                            </p>
                        </div>
                    </section>

                    <section class="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        <div class="p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm">10</span>
                                <h2 class="text-lg md:text-xl font-bold text-gray-900">Değişiklikler ve Yürürlük</h2>
                            </div>
                            <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                                Platform, işbu Üyelik Sözleşmesi’ni yürürlükteki mevzuata uyum veya hizmet koşullarının güncellenmesi amacıyla değiştirebilir. Önemli değişiklikler platform üzerinden veya e-posta ile duyurulur; değişiklikler yayımlandığı tarihte yürürlüğe girer. Değişiklik sonrasında platformu kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir. Sorularınız için <strong class="text-gray-800">destek@tasibul.com</strong> adresi ile iletişime geçebilirsiniz.
                            </p>
                        </div>
                    </section>

                    <div class="rounded-2xl bg-gray-100/80 border border-gray-200/80 px-6 py-4 md:px-8 md:py-5 mt-8">
                        <p class="text-xs md:text-sm text-gray-500 leading-relaxed">
                            Son güncelleme: {{ currentYear }}. Bu metin bilgilendirme amaçlıdır; hukuki danışmanlık yerine geçmez. Şirket unvanı ve adres bilgileri işletme tarafından güncellenecektir.
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
