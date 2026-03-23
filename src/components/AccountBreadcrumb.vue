<template>
    <nav aria-label="Breadcrumb">
        <ol class="flex items-center flex-wrap gap-2 text-sm text-gray-500">
            <li v-for="(item, index) in crumbs" :key="item.to + item.label" class="inline-flex items-center gap-2">
                <template v-if="index !== crumbs.length - 1">
                    <router-link :to="item.to" class="hover:text-primary transition-colors">
                        {{ item.label }}
                    </router-link>
                    <span aria-hidden="true" class="text-gray-300">/</span>
                </template>
                <span v-else aria-current="page" class="text-gray-900 font-medium">{{ item.label }}</span>
            </li>
        </ol>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';

const route = useRoute();
const siteUrl = 'https://tasibul.com';

const accountRoot = computed(() => {
    const isCargoOwner = route.path.startsWith('/cargo-owner');
    return {
        path: isCargoOwner ? '/cargo-owner' : '/vehicle-owner',
        label: 'Hesabım'
    };
});

const currentLabel = computed(() => {
    if (route.path === accountRoot.value.path) {
        return 'Hesabım';
    }

    const metaTitle = typeof route.meta?.title === 'string' ? route.meta.title : '';
    const parsedTitle = metaTitle.split('|')[0]?.trim();
    if (parsedTitle) {
        return parsedTitle;
    }

    const fallbackSegment = route.path.split('/').filter(Boolean).pop() || 'Detay';
    return fallbackSegment.replace(/-/g, ' ');
});

const crumbs = computed(() => {
    const items = [
        { label: 'Anasayfa', to: '/' },
        { label: accountRoot.value.label, to: accountRoot.value.path }
    ];

    if (route.path !== accountRoot.value.path) {
        items.push({ label: currentLabel.value, to: route.path });
    }

    return items;
});

const breadcrumbSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.value.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: `${siteUrl}${item.to}`
    }))
}));

useHead(() => ({
    link: [
        { key: 'account-canonical', rel: 'canonical', href: `${siteUrl}${route.path}` }
    ],
    script: [
        {
            key: 'account-breadcrumb-jsonld',
            type: 'application/ld+json',
            children: JSON.stringify(breadcrumbSchema.value)
        }
    ]
}));
</script>
