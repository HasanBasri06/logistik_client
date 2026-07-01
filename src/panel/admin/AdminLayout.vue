<template>
    <div class="min-h-screen bg-gray-50">
        <header class="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
            <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
                <div class="flex items-center gap-6 min-w-0">
                    <span class="shrink-0 text-lg font-bold text-gray-900">TaşıBul Admin</span>
                    <nav class="flex items-center gap-1 overflow-x-auto">
                        <RouterLink
                            v-for="item in navItems"
                            :key="item.to"
                            :to="item.to"
                            class="shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                            :class="isActive(item.to)
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
                        >
                            {{ item.label }}
                        </RouterLink>
                    </nav>
                </div>

                <div class="flex items-center gap-3 shrink-0">
                    <span v-if="adminStore.admin" class="hidden sm:inline text-sm text-gray-500">
                        {{ adminStore.admin.name }}
                    </span>
                    <button
                        type="button"
                        class="h-9 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        @click="handleLogout"
                    >
                        Çıkış Yap
                    </button>
                </div>
            </div>
        </header>

        <main class="mx-auto max-w-6xl px-4 py-8">
            <router-view />
        </main>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/admin';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();

const navItems = [
    { label: 'Ana Sayfa', to: '/panel/admin/beun/main' },
    { label: 'Kullanıcı Ekle', to: '/panel/admin/beun/kullanici-ekle' },
    { label: 'İlan Ekle', to: '/panel/admin/beun/ilan-ekle' },
    { label: 'Kullanıcı İşlemleri', to: '/panel/admin/beun/evraklar' },
];

function isActive(path) {
    return route.path === path;
}

function handleLogout() {
    adminStore.logout();
    router.replace('/panel/admin/beun');
}
</script>
