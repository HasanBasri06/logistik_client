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

/** Slug’a göre deterministik sayı (aynı yazıda SEO/JSON-LD ile uyumlu, yazılar arası farklı üçlü) */
function hashSlug(s) {
    let h = 5381;
    const str = String(s ?? '');
    for (let i = 0; i < str.length; i++) {
        h = (h * 33) ^ str.charCodeAt(i);
    }
    return Math.abs(h) >>> 0;
}

/** İlgili yazılar: sabit ilk 3 değil; her makale için slug’a özgü (deterministik) karışık 3 öneri */
function seededShuffle(items, seed) {
    const a = [...items];
    let s = seed >>> 0;
    const next = () => {
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        return s / 4294967296;
    };
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickRelatedPosts(currentSlug, all, count = 3) {
    const others = all.filter((item) => item.slug !== currentSlug);
    if (others.length <= count) return others;
    return seededShuffle(others, hashSlug(currentSlug)).slice(0, count);
}

const relatedPosts = computed(() => pickRelatedPosts(route.params.slug, blogPosts, 3));
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
    <Content class="mt-6 min-h-screen sm:mt-10">
        <div v-if="post" class="mx-auto w-full max-w-3xl py-6 sm:py-10">
            <RouterLink
                to="/blog"
                class="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-primary sm:mb-8"
            >
                <i class="pi pi-arrow-left text-xs"></i> Tüm Yazılar
            </RouterLink>

            <div class="flex flex-col gap-5 sm:gap-6">
                <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span class="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{{ post.category }}</span>
                    <span class="text-xs text-gray-400">{{ post.date }}</span>
                    <span class="text-xs text-gray-400">{{ post.readTime }} okuma</span>
                </div>

                <h1 class="text-2xl font-bold leading-tight tracking-tight wrap-break-word text-gray-900 sm:text-3xl md:text-4xl">
                    {{ post.title }}
                </h1>

                <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">TE</div>
                    <span class="text-sm text-gray-600">{{ post.author }}</span>
                </div>

                <div class="aspect-16/10 w-full overflow-hidden rounded-xl sm:aspect-21/9 sm:rounded-2xl">
                    <img
                        :src="post.image"
                        :alt="post.title"
                        @error="setLogisticsFallback"
                        class="h-full w-full object-cover"
                    />
                </div>

                <article class="prose w-full min-w-0 max-w-full" v-html="post.content"></article>

                <section class="mt-4 sm:mt-6">
                    <h2 class="mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">İlgili Bloglar</h2>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
                        <RouterLink
                            v-for="item in relatedPosts"
                            :key="item.slug"
                            :to="`/blog/${item.slug}`"
                            class="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-primary/30 hover:shadow-md"
                        >
                            <div class="aspect-16/10 w-full overflow-hidden sm:aspect-auto sm:h-32">
                                <img
                                    :src="item.image"
                                    :alt="item.title"
                                    @error="setLogisticsFallback"
                                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div class="flex flex-col gap-2 p-3 sm:p-3.5">
                                <span class="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">{{ item.category }}</span>
                                <h3 class="line-clamp-2 text-sm font-semibold text-gray-800 transition-colors group-hover:text-primary">
                                    {{ item.title }}
                                </h3>
                                <p class="line-clamp-2 text-xs text-gray-500">{{ item.excerpt }}</p>
                            </div>
                        </RouterLink>
                    </div>
                </section>
            </div>
        </div>

        <div v-else class="flex flex-col items-center gap-4 px-4 py-16 text-center sm:py-20">
            <i class="pi pi-file-edit text-4xl text-gray-300 sm:text-5xl"></i>
            <h2 class="text-lg font-semibold text-gray-700 sm:text-xl">Yazı Bulunamadı</h2>
            <p class="max-w-md text-sm text-gray-500">Aradığınız blog yazısı mevcut değil veya kaldırılmış olabilir.</p>
            <RouterLink to="/blog" class="mt-1 text-sm text-primary hover:underline">Bloğa Dön</RouterLink>
        </div>
    </Content>
    <Footer />
</template>

<style scoped>
.prose {
    font-size: 0.9375rem;
    line-height: 1.75;
    color: #374151;
}
@media (min-width: 640px) {
    .prose {
        font-size: 1rem;
        line-height: 1.8;
    }
}
.prose :deep(h2) {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
}
@media (min-width: 640px) {
    .prose :deep(h2) {
        font-size: 1.25rem;
        margin-top: 2rem;
    }
}
.prose :deep(p) {
    margin-bottom: 1rem;
}
.prose :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.75rem;
}
.prose :deep(a) {
    word-break: break-word;
}
.prose :deep(pre),
.prose :deep(table) {
    max-width: 100%;
    overflow-x: auto;
}
.prose :deep(ul),
.prose :deep(ol) {
    padding-left: 1.25rem;
}
</style>
