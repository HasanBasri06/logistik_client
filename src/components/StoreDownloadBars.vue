<template>
    <div
        v-if="useBadges"
        class="flex justify-center items-center"
        :class="layout === 'row' ? 'flex-row gap-3 sm:gap-4' : 'flex-col gap-2'"
    >
        <a
            :href="MOBILE_APP.appStoreUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="store-link"
            aria-label="App Store'dan indirin"
        >
            <img
                :src="appleBadge"
                alt="App Store'dan indirin"
                class="store-badge"
                :class="layout === 'row' ? 'store-badge--row' : 'store-badge--stacked'"
                loading="lazy"
            />
        </a>
        <a
            :href="MOBILE_APP.playStoreUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="store-link"
            aria-label="Google Play'den indirin"
        >
            <img
                :src="googleBadge"
                alt="Google Play'den indirin"
                class="store-badge"
                :class="layout === 'row' ? 'store-badge--row' : 'store-badge--stacked'"
                loading="lazy"
            />
        </a>
    </div>

    <div v-else class="flex flex-col gap-2">
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
import { computed } from 'vue';
import { MOBILE_APP } from '@/config/mobile-app';
import appleBadge from '@/assets/images/apple_ile_indir.png';
import googleBadge from '@/assets/images/google_ile_indir.png';

const props = defineProps({
    /** light/dark: metin+ikon (footer); brand: görsel rozet (hero) */
    variant: {
        type: String,
        default: 'light',
        validator: (v) => ['light', 'dark', 'brand'].includes(v),
    },
    /** stacked: vertical (footer); row: side by side (hero) */
    layout: {
        type: String,
        default: 'stacked',
        validator: (v) => ['stacked', 'row'].includes(v),
    },
});

const useBadges = computed(() => props.variant === 'brand');
</script>

<style scoped>
.store-link {
    display: block;
    text-decoration: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.store-link:hover {
    opacity: 0.92;
    transform: translateY(-1px);
}

.store-badge {
    display: block;
    height: auto;
    object-fit: contain;
}

.store-badge--row {
    width: 9.5rem;
}

.store-badge--stacked {
    width: 11rem;
}

@media (min-width: 640px) {
    .store-badge--row {
        width: 11rem;
    }
}

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
