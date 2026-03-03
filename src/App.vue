<template>
  <component :is="layout">
      <RouterView></RouterView>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Layout from './Layout.vue';
import { useHead } from '@vueuse/head';

const route = useRoute();

const layout = computed(() => route.meta.layout || Layout);

const pageTitle = computed(() =>
    route.meta?.title ? `${route.meta.title} | TaşıBul` : 'TaşıBul - Taşıt Bulma Platformu'
);

const metaDescription = 'TaşıBul - Lojistik Platformu';

useHead({
    title: pageTitle,
    meta: [
        { name: 'description', content: metaDescription },
        { name: 'keywords', content: 'TaşıBul, Lojistik, Platformu' },
        { name: 'author', content: 'TaşıBul' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'bingbot', content: 'index, follow' },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: metaDescription },
        { property: 'og:image', content: 'https://tasibul.com/logo.png' },
        { property: 'og:url', content: 'https://tasibul.com' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: metaDescription },
        { name: 'twitter:image', content: 'https://tasibul.com/logo.png' },
        { name: 'twitter:url', content: 'https://tasibul.com' },
    ],
    link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://tasibul.com' },
    ],
});
</script>

<style scoped>

</style>