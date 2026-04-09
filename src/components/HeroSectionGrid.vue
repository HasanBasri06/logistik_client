<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Content from './Content.vue';

const avatarColors = ['bg-primary', 'bg-teal-700', 'bg-teal-500', 'bg-emerald-600'];
const avatarInitials = ['AK', 'BY', 'MC', 'SL'];

/** Ana başlıklar: 0'dan hedefe (sayfa görünür olunca) */
const statActiveDrivers = ref(0);
const statActiveOverflow = ref(0);
const statVerifiedAccounts = ref(0);
const statUserRating = ref(0);

let statsAnimActive = false;
let statsRafId = 0;
let statsStarted = false;
const gridSectionRef = ref(null);

function easeOutCubic(t) {
    return 1 - (1 - t) ** 3;
}

function startGridStatsAnimation() {
    statsAnimActive = true;
    const durationMs = 2200;
    const targets = {
        active: 999,
        overflow: 995,
        verified: 499,
        rating: 4.8
    };
    const start = performance.now();

    function frame(now) {
        if (!statsAnimActive) return;
        const t = Math.min(1, (now - start) / durationMs);
        const e = easeOutCubic(t);
        statActiveDrivers.value = Math.round(targets.active * e);
        statActiveOverflow.value = Math.round(targets.overflow * e);
        statVerifiedAccounts.value = Math.round(targets.verified * e);
        statUserRating.value = Math.round(targets.rating * e * 10) / 10;
        if (t < 1) {
            statsRafId = requestAnimationFrame(frame);
        } else {
            statActiveDrivers.value = targets.active;
            statActiveOverflow.value = targets.overflow;
            statVerifiedAccounts.value = targets.verified;
            statUserRating.value = targets.rating;
            statsAnimActive = false;
        }
    }
    statsRafId = requestAnimationFrame(frame);
}

function stopGridStatsAnimation() {
    statsAnimActive = false;
    if (statsRafId) cancelAnimationFrame(statsRafId);
    statsRafId = 0;
}

let intersectionObserver = null;

onMounted(() => {
    const el = gridSectionRef.value;
    if (!el || typeof IntersectionObserver === 'undefined') {
        startGridStatsAnimation();
        return;
    }
    intersectionObserver = new IntersectionObserver(
        (entries) => {
            const hit = entries.some((e) => e.isIntersecting);
            if (!hit || statsStarted) return;
            statsStarted = true;
            startGridStatsAnimation();
            intersectionObserver?.disconnect();
            intersectionObserver = null;
        },
        { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.15 }
    );
    intersectionObserver.observe(el);
});

onUnmounted(() => {
    intersectionObserver?.disconnect();
    intersectionObserver = null;
    stopGridStatsAnimation();
});
</script>

<template>
    <Content class="mt-8">
        <div ref="gridSectionRef" class="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white overflow-hidden">

            <div class="group flex flex-col gap-4 p-8 border-b md:border-b-0 md:border-r border-gray-100 transition-colors hover:bg-gray-50/60">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <i class="pi pi-users text-lg"></i>
                    </div>
                    <h2 class="text-2xl font-bold tracking-tight tabular-nums">{{ statActiveDrivers }}<span class="text-primary">+</span></h2>
                </div>
                <p class="text-sm font-medium text-gray-800">Aktif Sürücü</p>
                <div class="flex flex-row -space-x-3 mt-1">
                    <div
                        v-for="(color, i) in avatarColors"
                        :key="i"
                        :class="color"
                        class="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold shadow-sm transition-transform group-hover:-translate-y-0.5"
                        :style="{ transitionDelay: `${i * 50}ms` }"
                    >
                        {{ avatarInitials[i] }}
                    </div>
                    <div class="w-9 h-9 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-500 text-[10px] font-semibold shadow-sm tabular-nums leading-tight text-center px-0.5">
                        +{{ statActiveOverflow }}
                    </div>
                </div>
                <p class="text-sm text-gray-500 leading-relaxed">Ülke genelinde güvenilir araç sahipleri ile yolculuğa hazır.</p>
            </div>

            <div class="group flex flex-col gap-4 p-8 border-b md:border-b-0 md:border-r border-gray-100 transition-colors hover:bg-gray-50/60">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <i class="pi pi-verified text-lg"></i>
                    </div>
                    <h2 class="text-2xl font-bold tracking-tight tabular-nums">{{ statVerifiedAccounts }}<span class="text-primary">+</span></h2>
                </div>
                <p class="text-sm font-medium text-gray-800">Onaylı Hesap</p>
                <div class="flex items-center gap-2 mt-1">
                    <div class="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5">
                        <i class="pi pi-check-circle text-green-600 text-xs"></i>
                        <span class="text-xs font-medium text-green-700">Kimlik Doğrulanmış</span>
                    </div>
                </div>
                <p class="text-sm text-gray-500 leading-relaxed">Tüm hesaplar kimlik doğrulama sürecinden geçirilir ve güvenliğiniz ön planda tutulur.</p>
            </div>

            <div class="group flex flex-col gap-4 p-8 transition-colors hover:bg-gray-50/60">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <i class="pi pi-star-fill text-lg"></i>
                    </div>
                    <h2 class="text-2xl font-bold tracking-tight tabular-nums">{{ statUserRating.toFixed(1) }}<span class="text-primary">/5</span></h2>
                </div>
                <p class="text-sm font-medium text-gray-800">Kullanıcı Puanı</p>
                <div class="flex items-center gap-1 mt-1">
                    <i v-for="n in 5" :key="n" class="pi text-sm" :class="n <= 4 ? 'pi-star-fill text-amber-400' : 'pi-star-fill text-amber-300'"></i>
                    <span class="text-xs text-gray-400 ml-1.5 font-medium">(2.4K+ değerlendirme)</span>
                </div>
                <p class="text-sm text-gray-500 leading-relaxed">Kullanıcı deneyimine verdiğimiz önem ile yüksek memnuniyet oranı sağlıyoruz.</p>
            </div>

        </div>
    </Content>
</template>
