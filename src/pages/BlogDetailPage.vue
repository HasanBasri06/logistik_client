<script setup>
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();

const posts = {
    'lojistik-sektorunde-dijitallesme': {
        title: 'Lojistik Sektöründe Dijitalleşme ve Geleceği',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
        category: 'Sektör',
        date: '10 Mart 2026',
        readTime: '5 dk',
        author: 'TaşıBul Editör',
        content: `
            <p>Lojistik sektörü, dijital dönüşümün en hızlı yaşandığı alanlardan biri haline geldi. Geleneksel yöntemlerle yürütülen süreçler yerini akıllı platformlara, yapay zeka destekli rotalama sistemlerine ve gerçek zamanlı takip çözümlerine bırakıyor.</p>

            <h2>Dijitalleşmenin Lojistiğe Etkileri</h2>
            <p>Dijital platformlar sayesinde yük sahipleri ve araç sahipleri artık birbirlerini kolayca bulabiliyor. Bu durum hem maliyetleri düşürüyor hem de taşımacılık süreçlerini hızlandırıyor. TaşıBul gibi platformlar, bu dönüşümün öncüsü konumunda.</p>

            <h2>Gelecekte Bizi Neler Bekliyor?</h2>
            <p>Otonom araçlar, drone ile teslimat ve blockchain tabanlı tedarik zinciri yönetimi gibi teknolojiler önümüzdeki yıllarda lojistik sektörünü köklü bir şekilde değiştirecek. Bu gelişmelere hazırlıklı olmak, rekabet avantajı sağlamanın anahtarı olacaktır.</p>

            <h2>Sonuç</h2>
            <p>Dijitalleşme, lojistik sektöründe kaçınılmaz bir gerçek. Erken adapte olan işletmeler, hem maliyet avantajı hem de operasyonel verimlilik açısından bir adım önde olacaktır.</p>
        `,
    },
    'yuk-tasimaciligi-maliyetlerini-dusurme': {
        title: 'Yük Taşımacılığı Maliyetlerinizi Düşürmenin 7 Yolu',
        image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80',
        category: 'Rehber',
        date: '5 Mart 2026',
        readTime: '4 dk',
        author: 'TaşıBul Editör',
        content: `
            <p>Nakliye maliyetleri, işletmelerin en büyük gider kalemlerinden biridir. Doğru stratejilerle bu maliyetleri önemli ölçüde azaltmak mümkündür.</p>

            <h2>1. Dijital Platformları Kullanın</h2>
            <p>TaşıBul gibi platformlar üzerinden teklif karşılaştırması yaparak en uygun fiyatı bulabilirsiniz.</p>

            <h2>2. Güzergah Optimizasyonu Yapın</h2>
            <p>En kısa ve en verimli rotayı seçmek yakıt maliyetlerini ciddi oranda düşürür.</p>

            <h2>3. Boş Dönüş Seferlerinden Kaçının</h2>
            <p>Araç sahipleri dönüş güzergahlarında yük alarak maliyetlerini paylaşabilir.</p>

            <h2>4. Toplu Gönderim Planlayın</h2>
            <p>Küçük gönderileri birleştirerek birim başına taşıma maliyetini düşürebilirsiniz.</p>

            <h2>5. Uzun Vadeli Anlaşmalar Yapın</h2>
            <p>Düzenli taşımacılık ihtiyaçlarınız için taşıyıcılarla uzun vadeli anlaşmalar yaparak indirimli fiyatlar elde edebilirsiniz.</p>

            <h2>6. Yük Sigortası Yaptırın</h2>
            <p>Olası hasarlardan korunarak beklenmedik maliyetlerin önüne geçebilirsiniz.</p>

            <h2>7. Zamanlamayı Doğru Yapın</h2>
            <p>Yoğun dönemlerden kaçınarak daha uygun fiyatlarla taşımacılık yaptırabilirsiniz.</p>
        `,
    },
};

const post = computed(() => posts[route.params.slug] || null);
</script>

<template>
    <Header />
    <Content class="mt-10 min-h-screen">
        <div v-if="post" class="py-10 max-w-3xl mx-auto">

            <RouterLink to="/blog" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-8">
                <i class="pi pi-arrow-left text-xs"></i> Tüm Yazılar
            </RouterLink>

            <div class="flex flex-col gap-6">
                <div class="flex items-center gap-3">
                    <span class="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{{ post.category }}</span>
                    <span class="text-xs text-gray-400">{{ post.date }}</span>
                    <span class="text-xs text-gray-400">{{ post.readTime }} okuma</span>
                </div>

                <h1 class="text-3xl font-bold tracking-tight leading-tight">{{ post.title }}</h1>

                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">TE</div>
                    <span class="text-sm text-gray-600">{{ post.author }}</span>
                </div>

                <div class="w-full h-80 rounded-2xl overflow-hidden">
                    <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" />
                </div>

                <article class="prose" v-html="post.content"></article>
            </div>

        </div>

        <div v-else class="py-20 flex flex-col items-center gap-4 text-center">
            <i class="pi pi-file-edit text-5xl text-gray-300"></i>
            <h2 class="text-xl font-semibold text-gray-700">Yazı Bulunamadı</h2>
            <p class="text-sm text-gray-500">Aradığınız blog yazısı mevcut değil veya kaldırılmış olabilir.</p>
            <RouterLink to="/blog" class="text-sm text-primary hover:underline mt-2">Bloğa Dön</RouterLink>
        </div>
    </Content>
    <Footer />
</template>

<style scoped>
.prose {
    font-size: 0.9375rem;
    line-height: 1.8;
    color: #374151;
}
.prose :deep(h2) {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
}
.prose :deep(p) {
    margin-bottom: 1rem;
}
</style>
