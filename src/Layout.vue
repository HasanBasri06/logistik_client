<template>
    <div class="w-full h-screen">
        <router-view></router-view>
    </div>
    <Toaster richColors theme="light" position="bottom-right" :toast-options="{ duration: 5000 }" />
</template>

<script setup>
import { Toaster } from 'vue-sonner';

</script>

<style lang="scss" scoped>

</style>