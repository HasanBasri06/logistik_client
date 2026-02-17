<template>
    <div class="w-full h-screen bg-gray-50">
        <router-view></router-view>
    </div>
    <Toaster richColors theme="light" position="bottom-right" />
</template>

<script setup>
import { Toaster } from 'vue-sonner';

</script>

<style lang="scss" scoped>

</style>