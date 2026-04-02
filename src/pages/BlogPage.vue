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
    <Content class="mt-6 min-h-screen sm:mt-10">
        <div class="flex flex-col gap-6 py-6 sm:gap-10 sm:py-10">

            <div class="flex flex-col gap-2 sm:gap-3">
                <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
                <p class="text-sm text-gray-500 sm:text-base">Lojistik dünyasından haberler, rehberler ve ipuçları.</p>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                <RouterLink
                    v-for="post in posts"
                    :key="post.slug"
                    :to="`/blog/${post.slug}`"
                    class="group flex min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
                >
                    <div class="aspect-16/10 w-full shrink-0 overflow-hidden sm:aspect-5/3">
                        <img
                            :src="post.image"
                            :alt="post.title"
                            @error="setLogisticsFallback"
                            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div class="flex min-h-0 flex-1 flex-col gap-2 p-4 sm:gap-3 sm:p-5">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{{ post.category }}</span>
                            <span class="text-xs text-gray-400">{{ post.readTime }}</span>
                        </div>
                        <h2
                            class="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-primary sm:text-base"
                        >
                            {{ post.title }}
                        </h2>
                        <p class="line-clamp-2 text-xs leading-relaxed text-gray-500 sm:text-sm">{{ post.excerpt }}</p>
                        <span class="mt-auto pt-2 text-xs text-gray-400">{{ post.date }}</span>
                    </div>
                </RouterLink>
            </div>

        </div>
    </Content>
    <Footer />
</template>
