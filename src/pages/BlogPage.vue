<script setup>
import { RouterLink } from 'vue-router';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import Footer from '@/components/Footer.vue';

const posts = [
    {
        slug: 'lojistik-sektorunde-dijitallesme',
        title: 'Lojistik Sektöründe Dijitalleşme ve Geleceği',
        excerpt: 'Dijital dönüşümün lojistik sektörüne etkileri ve gelecekte bizi nelerin beklediğini inceliyoruz.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
        category: 'Sektör',
        date: '10 Mar 2026',
        readTime: '5 dk',
    },
    {
        slug: 'yuk-tasimaciligi-maliyetlerini-dusurme',
        title: 'Yük Taşımacılığı Maliyetlerinizi Düşürmenin 7 Yolu',
        excerpt: 'Nakliye giderlerinizi optimize etmek için uygulayabileceğiniz pratik yöntemleri paylaşıyoruz.',
        image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80',
        category: 'Rehber',
        date: '5 Mar 2026',
        readTime: '4 dk',
    },
    {
        slug: 'guvenlii-sevkiyat-icin-ipuclari',
        title: 'Güvenli Sevkiyat İçin 10 Altın İpucu',
        excerpt: 'Yüklerinizi hasarsız ve güvenli bir şekilde teslim etmek için dikkat etmeniz gereken noktalar.',
        image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=600&q=80',
        category: 'Güvenlik',
        date: '28 Şub 2026',
        readTime: '6 dk',
    },
    {
        slug: 'arac-sahipleri-icin-kazanc-rehberi',
        title: 'Araç Sahipleri İçin Kazanç Rehberi',
        excerpt: 'Platformumuzda araç sahibi olarak kazancınızı nasıl maksimize edebileceğinizi anlatıyoruz.',
        image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80',
        category: 'Rehber',
        date: '20 Şub 2026',
        readTime: '5 dk',
    },
    {
        slug: 'tasibul-yeni-ozellikler-2026',
        title: 'TaşıBul 2026 Yeni Özellikler ve Güncellemeler',
        excerpt: 'Bu yıl platformumuza eklediğimiz yeni özellikleri ve iyileştirmeleri keşfedin.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
        category: 'Duyuru',
        date: '15 Şub 2026',
        readTime: '3 dk',
    },
    {
        slug: 'turkiyede-lojistik-haritasi',
        title: 'Türkiye\'de Lojistik Haritası: En Yoğun Güzergahlar',
        excerpt: 'Türkiye\'nin en çok yük taşınan güzergahlarını ve bölgesel lojistik dinamiklerini inceliyoruz.',
        image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80',
        category: 'Sektör',
        date: '8 Şub 2026',
        readTime: '7 dk',
    },
    {
        slug: 'yuk-sigortasi-neden-onemli',
        title: 'Yük Sigortası Neden Önemli?',
        excerpt: 'Yük sigortasının önemi, türleri ve doğru sigorta seçimi hakkında bilmeniz gerekenler.',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80',
        category: 'Bilgi',
        date: '1 Şub 2026',
        readTime: '4 dk',
    },
    {
        slug: 'kucuk-isletmeler-icin-lojistik-cozumleri',
        title: 'Küçük İşletmeler İçin Lojistik Çözümleri',
        excerpt: 'Küçük ve orta ölçekli işletmelerin lojistik süreçlerini verimli hale getirmek için öneriler.',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80',
        category: 'Rehber',
        date: '25 Oca 2026',
        readTime: '5 dk',
    },
];
</script>

<template>
    <Header />
    <Content class="mt-10 min-h-screen">
        <div class="flex flex-col gap-10 py-10">

            <div class="flex flex-col gap-3">
                <h1 class="text-4xl font-bold tracking-tight">Blog</h1>
                <p class="text-gray-500 text-base">Lojistik dünyasından haberler, rehberler ve ipuçları.</p>
            </div>

            <div class="grid grid-cols-4 gap-6">
                <RouterLink
                    v-for="post in posts"
                    :key="post.slug"
                    :to="`/blog/${post.slug}`"
                    class="group flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1"
                >
                    <div class="w-full h-44 overflow-hidden">
                        <img
                            :src="post.image"
                            :alt="post.title"
                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div class="flex flex-col gap-3 p-5 flex-1">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{{ post.category }}</span>
                            <span class="text-xs text-gray-400">{{ post.readTime }}</span>
                        </div>
                        <h2 class="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {{ post.title }}
                        </h2>
                        <p class="text-xs text-gray-500 leading-relaxed line-clamp-2">{{ post.excerpt }}</p>
                        <span class="text-xs text-gray-400 mt-auto pt-2">{{ post.date }}</span>
                    </div>
                </RouterLink>
            </div>

        </div>
    </Content>
    <Footer />
</template>
