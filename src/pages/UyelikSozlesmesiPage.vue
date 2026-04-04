<template>
    <div class="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <Content class="flex-1 py-8 md:py-12">
            <UyelikSozlesmesiArticle />
        </Content>
        <Footer />
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import Footer from '@/components/Footer.vue';
import UyelikSozlesmesiArticle from '@/components/legal/UyelikSozlesmesiArticle.vue';
</script>
