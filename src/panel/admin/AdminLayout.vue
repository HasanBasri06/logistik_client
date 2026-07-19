<template>
    <div class="min-h-screen bg-gray-50">
        <header class="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
            <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
                <div class="flex items-center gap-3 min-w-0">
                    <button
                        type="button"
                        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-colors hover:bg-gray-50"
                        aria-label="Menüyü aç"
                        @click="openDrawer"
                    >
                        <i class="pi pi-bars text-lg" />
                    </button>
                    <RouterLink
                        to="/panel/admin/beun/main"
                        class="shrink-0 text-lg font-bold text-gray-900 transition-colors hover:text-primary"
                    >
                        TaşıBul Admin
                    </RouterLink>
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

        <Teleport to="body">
            <Transition name="drawer-fade">
                <div
                    v-if="drawerOpen"
                    class="fixed inset-0 z-[9998] bg-black/50"
                    @click="closeDrawer"
                />
            </Transition>
            <Transition name="drawer-slide">
                <aside
                    v-if="drawerOpen"
                    class="fixed inset-y-0 left-0 z-[9999] flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl"
                >
                    <div class="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4">
                        <span class="text-lg font-bold text-gray-900">Menü</span>
                        <button
                            type="button"
                            class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                            aria-label="Menüyü kapat"
                            @click="closeDrawer"
                        >
                            <i class="pi pi-times" />
                        </button>
                    </div>

                    <nav class="flex-1 overflow-y-auto p-3">
                        <template v-for="item in navItems" :key="item.label">
                            <RouterLink
                                v-if="!item.children"
                                :to="item.to"
                                class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                                :class="isActive(item.to)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
                                @click="closeDrawer"
                            >
                                <i v-if="item.icon" :class="item.icon" class="text-base" />
                                {{ item.label }}
                            </RouterLink>

                            <div v-else class="mt-1">
                                <button
                                    type="button"
                                    class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                                    :class="isGroupActive(item)
                                        ? 'text-primary'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
                                    @click="toggleGroup(item.label)"
                                >
                                    <i v-if="item.icon" :class="item.icon" class="text-base" />
                                    <span class="flex-1 text-left">{{ item.label }}</span>
                                    <i
                                        class="pi pi-chevron-down text-xs transition-transform"
                                        :class="isGroupOpen(item.label) ? 'rotate-180' : ''"
                                    />
                                </button>

                                <div v-show="isGroupOpen(item.label)" class="mt-1 space-y-1 pl-4">
                                    <RouterLink
                                        v-for="child in item.children"
                                        :key="child.to"
                                        :to="child.to"
                                        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                                        :class="isActive(child.to)
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
                                        @click="closeDrawer"
                                    >
                                        <i v-if="child.icon" :class="child.icon" class="text-base" />
                                        {{ child.label }}
                                    </RouterLink>
                                </div>
                            </div>
                        </template>

                        <button
                            type="button"
                            class="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            @click="openSmsModal"
                        >
                            <i class="pi pi-comment text-base" />
                            SMS Gönder
                        </button>
                    </nav>
                </aside>
            </Transition>
        </Teleport>

        <AdminSmsModal v-model:open="smsModalOpen" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/admin';
import AdminSmsModal from '@/panel/admin/AdminSmsModal.vue';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();

const navItems = [
    { label: 'Ana Sayfa', to: '/panel/admin/beun/main', icon: 'pi pi-home' },
    { label: 'Kullanıcı Ekle', to: '/panel/admin/beun/kullanici-ekle', icon: 'pi pi-user-plus' },
    {
        label: 'Kullanıcı İşlemleri',
        icon: 'pi pi-users',
        children: [
            { label: 'Onay Bekleyen Kullanıcılar', to: '/panel/admin/beun/evraklar', icon: 'pi pi-clock' },
            { label: 'Hesap İşlemleri', to: '/panel/admin/beun/kullanici-merkezi', icon: 'pi pi-id-card' },
            { label: 'Kullanıcılarımız', to: '/panel/admin/beun/kullanicilar', icon: 'pi pi-id-card' },
        ],
    },
    {
        label: 'İlan İşlemleri',
        icon: 'pi pi-briefcase',
        children: [
            { label: 'İlan Ekle', to: '/panel/admin/beun/ilan-ekle', icon: 'pi pi-plus-circle' },
            { label: 'Tüm İlanlarım', to: '/panel/admin/beun/ilanlar', icon: 'pi pi-list' },
            { label: 'Arama Analizleri', to: '/panel/admin/beun/arama-analizleri', icon: 'pi pi-search' },
        ],
    },
    {
        label: 'Ayarlar',
        icon: 'pi pi-cog',
        children: [
            { label: 'Araçlar', to: '/panel/admin/beun/ayarlar/araclar', icon: 'pi pi-truck' },
            { label: 'Şehirler', to: '/panel/admin/beun/ayarlar/sehirler', icon: 'pi pi-map' },
            { label: 'Yük Tipleri', to: '/panel/admin/beun/ayarlar/yuk-tipleri', icon: 'pi pi-box' },
        ],
    },
];

const drawerOpen = ref(false);
const openGroups = ref([]);
const smsModalOpen = ref(false);

function openSmsModal() {
    drawerOpen.value = false;
    smsModalOpen.value = true;
}

function openDrawer() {
    drawerOpen.value = true;
    navItems.forEach((item) => {
        if (item.children && isGroupActive(item) && !openGroups.value.includes(item.label)) {
            openGroups.value.push(item.label);
        }
    });
}

function closeDrawer() {
    drawerOpen.value = false;
}

function toggleGroup(label) {
    if (openGroups.value.includes(label)) {
        openGroups.value = openGroups.value.filter((entry) => entry !== label);
    } else {
        openGroups.value.push(label);
    }
}

function isGroupOpen(label) {
    return openGroups.value.includes(label);
}

function isActive(path) {
    return route.path === path;
}

function isGroupActive(item) {
    return item.children?.some((child) => route.path === child.to) ?? false;
}

function handleLogout() {
    adminStore.logout();
    router.replace('/panel/admin/beun');
}

watch(() => route.path, () => {
    closeDrawer();
});
</script>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
    transition: opacity 0.2s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
    opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
    transition: transform 0.25s ease;
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
    transform: translateX(-100%);
}
</style>
