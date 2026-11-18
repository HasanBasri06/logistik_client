<template>
    <!-- Dashboard sol menüsü: sol kenara yapışık, tam yükseklik; mobilde gizli (mobil menü ayrı) -->
    <aside class="hidden md:flex md:w-[260px] md:shrink-0 md:flex-col md:bg-white md:border-r md:border-gray-200 md:overflow-y-auto">
        <!-- Kullanıcı -->
        <div class="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
            <span
                class="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0"
            >{{ initials }}</span>
            <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ fullName }}</p>
                <span class="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                    {{ roleLabel }}
                </span>
            </div>
        </div>

        <!-- Menü -->
        <nav class="flex-1 px-3 py-4 flex flex-col gap-5" aria-label="Panel menüsü">
            <div v-for="group in groups" :key="group.title">
                <p class="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{{ group.title }}</p>
                <ul class="flex flex-col gap-0.5">
                    <li v-for="item in group.items" :key="item.to">
                        <RouterLink
                            :to="item.to"
                            :class="[
                                'relative h-10 flex items-center gap-3 px-3 rounded-lg text-sm transition-colors',
                                isActive(item)
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            ]"
                            :aria-current="isActive(item) ? 'page' : undefined"
                        >
                            <span
                                v-if="isActive(item)"
                                class="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"
                                aria-hidden="true"
                            />
                            <i :class="['pi', item.icon, 'text-[15px]', isActive(item) ? 'text-primary' : 'text-gray-400']" />
                            <span class="truncate">{{ item.label }}</span>
                            <span
                                v-if="item.badge"
                                class="ml-auto w-2 h-2 rounded-full bg-red-400 shrink-0"
                                aria-label="Okunmamış mesaj var"
                            />
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </nav>

        <!-- Yardım: menünün en altında -->
        <div class="p-3 border-t border-gray-100">
            <button
                type="button"
                class="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left cursor-pointer"
                @click="ekibineSorOpen = true"
            >
                <i class="pi pi-question-circle text-primary text-lg" />
                <span>
                    <span class="block text-sm font-semibold text-primary">TaşıBul Ekibine Sor</span>
                    <span class="block text-xs text-gray-500">Sorunu yaz, hemen dönelim</span>
                </span>
            </button>
        </div>
        <EkibineSorModal v-model:open="ekibineSorOpen" />
    </aside>
</template>

<script setup>
/**
 * Araç sahibi ve yük sahibi hesap panelinin ortak dashboard menüsü.
 * groups: [{ title, items: [{ label, to, icon, match?: (path) => bool, badge?: bool }] }]
 */
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import EkibineSorModal from './EkibineSorModal.vue';

defineProps({
    groups: { type: Array, required: true },
});

const route = useRoute();
const { user } = storeToRefs(useAuthStore());
const ekibineSorOpen = ref(false);

const fullName = computed(() => user.value?.full_name || [user.value?.first_name, user.value?.last_name].filter(Boolean).join(' ') || 'Hesabım');
const initials = computed(
    () =>
        fullName.value
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0]?.toLocaleUpperCase('tr-TR'))
            .join('') || '?'
);
const roleLabel = computed(() => (user.value?.type === 'cargo_owner' ? 'Yük Sahibi' : user.value?.type === 'driver' ? 'Sürücü' : 'Araç Sahibi'));

function isActive(item) {
    return item.match ? item.match(route.path) : route.path === item.to;
}
</script>
