<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import { useHead } from '@vueuse/head';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import Footer from '@/components/Footer.vue';
import { blogPosts as posts } from '@/data/blogPosts';

const siteUrl = 'https://tasibul.com';
const canonicalUrl = `${siteUrl}/blog`;
const listSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'TaşıBul Blog Yazıları',
    itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/blog/${post.slug}`,
        name: post.title
    }))
}));

const setLogisticsFallback = (event) => {
    const img = event?.target;
    if (!img || img.dataset.fallbackApplied === '1') return;
    img.dataset.fallbackApplied = '1';
    img.src = 'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1200';
};

useHead({
    title: 'Lojistik Blog Yazıları | TaşıBul',
    meta: [
        {
            name: 'description',
            content: 'TaşıBul blogunda lojistik, taşımacılık, maliyet optimizasyonu ve güvenli sevkiyat konularında güncel içerikleri keşfedin.'
        },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'Lojistik Blog Yazıları | TaşıBul' },
        { property: 'og:description', content: 'Lojistik dünyasından haberler, rehberler ve ipuçları.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: canonicalUrl }
    ],
    link: [
        { rel: 'canonical', href: canonicalUrl }
    ],
    script: [
        {
            key: 'blog-list-jsonld',
            type: 'application/ld+json',
            children: JSON.stringify(listSchema.value)
        }
    ]
});
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
                            @error="setLogisticsFallback"
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
