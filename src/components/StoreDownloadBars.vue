<template>
    <div
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
</template>

<script setup>
import { MOBILE_APP } from '@/config/mobile-app';
import appleBadge from '@/assets/images/apple_ile_indir.png';
import googleBadge from '@/assets/images/google_ile_indir.png';

defineProps({
    /** @deprecated Görsel rozetler kullanıldığı için artık stil değiştirmiyor; geriye dönük uyumluluk için korunuyor */
    variant: {
        type: String,
        default: 'light',
    },
    /** stacked: vertical (footer); row: side by side (hero) */
    layout: {
        type: String,
        default: 'stacked',
        validator: (v) => ['stacked', 'row'].includes(v),
    },
});
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
</style>
