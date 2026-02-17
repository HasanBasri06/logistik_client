<template>
  <component :is="layout">
      <RouterView></RouterView>
  </component>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Layout from './Layout.vue';

const route = useRoute()

const layout = computed(() => {
    return route.meta.layout || Layout
})

// Route değiştiğinde title'ı güncelle
watch(
    () => route,
    (newRoute) => {
        if (newRoute.meta?.title) {
            document.title = newRoute.meta.title
        } else {
            document.title = 'TaşıBul'
        }
    },
    { immediate: true, deep: true }
)
</script>

<style scoped>

</style>