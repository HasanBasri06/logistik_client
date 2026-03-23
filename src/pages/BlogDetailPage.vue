<script setup>
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useHead } from '@vueuse/head';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import Footer from '@/components/Footer.vue';
import { blogPosts } from '@/data/blogPosts';

const route = useRoute();
const postsBySlug = Object.fromEntries(blogPosts.map((item) => [item.slug, item]));
const post = computed(() => postsBySlug[route.params.slug] || null);
const relatedPosts = computed(() =>
    blogPosts
        .filter((item) => item.slug !== route.params.slug)
        .slice(0, 3)
);
const siteUrl = 'https://tasibul.com';

const canonicalUrl = computed(() =>
    post.value ? `${siteUrl}/blog/${post.value.slug}` : `${siteUrl}/blog`
);
const pageTitle = computed(() =>
    post.value ? `${post.value.title} | TaşıBul Blog` : 'Yazı Bulunamadı | TaşıBul Blog'
);

const blogPostingSchema = computed(() => {
    if (!post.value) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.value.title,
        description: post.value.excerpt,
        image: [post.value.image],
        articleSection: post.value.category,
        author: {
            '@type': 'Organization',
            name: post.value.author
        },
        publisher: {
            '@type': 'Organization',
            name: 'TaşıBul'
        },
        mainEntityOfPage: canonicalUrl.value,
        url: canonicalUrl.value
    };
});
const breadcrumbSchema = computed(() => {
    if (!post.value) return null;
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Anasayfa',
                item: `${siteUrl}/`
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: `${siteUrl}/blog`
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: post.value.title,
                item: canonicalUrl.value
            }
        ]
    };
});
const relatedPostsSchema = computed(() => {
    if (!relatedPosts.value.length) return null;
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'İlgili Bloglar',
        itemListElement: relatedPosts.value.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.title,
            url: `${siteUrl}/blog/${item.slug}`
        }))
    };
});

const setLogisticsFallback = (event) => {
    const img = event?.target;
    if (!img || img.dataset.fallbackApplied === '1') return;
    img.dataset.fallbackApplied = '1';
    img.src = 'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1200';
};

useHead(() => {
    if (!post.value) {
        return {
            title: pageTitle.value,
            meta: [
                { name: 'robots', content: 'noindex, follow' }
            ],
            link: [{ rel: 'canonical', href: `${siteUrl}/blog` }]
        };
    }

    return {
        title: pageTitle.value,
        meta: [
            { name: 'description', content: post.value.excerpt },
            { name: 'keywords', content: `${post.value.category}, lojistik, taşımacılık, sevkiyat, TaşıBul blog` },
            { name: 'robots', content: 'index, follow, max-image-preview:large' },
            { property: 'og:title', content: pageTitle.value },
            { property: 'og:description', content: post.value.excerpt },
            { property: 'og:type', content: 'article' },
            { property: 'og:url', content: canonicalUrl.value },
            { property: 'og:image', content: post.value.image },
            { property: 'og:site_name', content: 'TaşıBul' },
            { property: 'article:section', content: post.value.category },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: pageTitle.value },
            { name: 'twitter:description', content: post.value.excerpt },
            { name: 'twitter:image', content: post.value.image }
        ],
        link: [
            { rel: 'canonical', href: canonicalUrl.value }
        ],
        script: [
            {
                key: 'blog-detail-jsonld',
                type: 'application/ld+json',
                children: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@graph': [
                        blogPostingSchema.value,
                        breadcrumbSchema.value,
                        relatedPostsSchema.value
                    ].filter(Boolean)
                })
            }
        ]
    };
});
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
                    <img :src="post.image" :alt="post.title" @error="setLogisticsFallback" class="w-full h-full object-cover" />
                </div>

                <article class="prose" v-html="post.content"></article>

                <section class="mt-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">İlgili Bloglar</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <RouterLink
                            v-for="item in relatedPosts"
                            :key="item.slug"
                            :to="`/blog/${item.slug}`"
                            class="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md hover:border-primary/30 transition-all"
                        >
                            <div class="w-full h-32 overflow-hidden">
                                <img :src="item.image" :alt="item.title" @error="setLogisticsFallback" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div class="p-3 flex flex-col gap-2">
                                <span class="text-[11px] text-primary bg-primary/10 rounded-full px-2 py-0.5 w-fit">{{ item.category }}</span>
                                <h3 class="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">{{ item.title }}</h3>
                                <p class="text-xs text-gray-500 line-clamp-2">{{ item.excerpt }}</p>
                            </div>
                        </RouterLink>
                    </div>
                </section>
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
