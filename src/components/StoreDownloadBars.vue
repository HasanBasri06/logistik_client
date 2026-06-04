<template>
    <div class="flex flex-col gap-2">
        <a
            :href="MOBILE_APP.appStoreUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="store-bar"
            :class="variant === 'dark' ? 'store-bar--dark' : 'store-bar--light'"
            aria-label="iOS ile indirin"
        >
            <i class="pi pi-apple text-lg shrink-0" :class="variant === 'dark' ? 'text-white' : 'text-gray-800'" />
            <div class="min-w-0">
                <p class="text-sm font-medium" :class="variant === 'dark' ? 'text-white' : 'text-gray-900'">App Store</p>
                <p class="text-[10px] leading-none" :class="variant === 'dark' ? 'text-gray-400' : 'text-gray-500'">iOS ile indirin</p>
            </div>
        </a>
        <a
            :href="MOBILE_APP.playStoreUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="store-bar"
            :class="variant === 'dark' ? 'store-bar--dark' : 'store-bar--light'"
            aria-label="Google Play ile indirin"
        >
            <i class="pi pi-android text-lg shrink-0" :class="variant === 'dark' ? 'text-white' : 'text-gray-800'" />
            <div class="min-w-0">
                <p class="text-sm font-medium" :class="variant === 'dark' ? 'text-white' : 'text-gray-900'">Google Play</p>
                <p class="text-[10px] leading-none" :class="variant === 'dark' ? 'text-gray-400' : 'text-gray-500'">Google Play ile indirin</p>
            </div>
        </a>
    </div>
</template>

<script setup>
import { MOBILE_APP } from '@/config/mobile-app';

defineProps({
    /** light: panel sidebar; dark: footer */
    variant: {
        type: String,
        default: 'light',
    },
});
</script>

<style scoped>
.store-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
}

.store-bar--light {
    border: 1px solid #e5e7eb;
    background-color: #f9fafb;
}

.store-bar--light:hover {
    border-color: rgba(57, 131, 140, 0.45);
    background-color: rgba(57, 131, 140, 0.06);
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}

.store-bar--dark {
    border: 1px solid transparent;
    background-color: rgba(255, 255, 255, 0.05);
}

.store-bar--dark:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>
