<template>
    <div>
        <header class="w-full h-16 fixed top-0 z-40 transition-colors duration-300"
            :class="scrolled ? 'bg-white shadow-sm' : 'bg-transparent'">
            <Content class="flex items-center justify-between h-full">
                <!-- Logo (Sol) -->
                <RouterLink to="/" class="flex items-center gap-2">
                    <img src="@/assets/images/logo.png" alt="TaşıBul Logo" class="h-7 w-auto object-contain" />
                    <span class="text-primary font-bold text-2xl">TaşıBul</span>
                </RouterLink>

                <!-- Sağ taraf: mobilde hamburger, masaüstünde menü -->
                <ul class="flex items-center gap-6 text-sm font-medium">
                    <!-- Mobil: hamburger (vue3-tour: giriş yapılmışken #tour-hesap-mobil) -->
                    <li class="md:hidden" :id="authStore.isAuthenticated ? 'tour-hesap-mobil' : undefined">
                        <button type="button"
                            class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            aria-label="Menüyü aç" @click="mobileMenuOpen = true">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </li>
                    <!-- Masaüstü: linkler ve dropdown -->
                    <li class="hidden md:block" v-if="!authStore.isAuthenticated">
                        <router-link to="/help" class="hover:text-primary transition-colors">Yardım</router-link>
                    </li>
                    <li class="hidden md:block" v-if="!authStore.isAuthenticated">
                        <router-link to="/hakkimizda" class="hover:text-primary transition-colors">Hakkımızda</router-link>
                    </li>
                    <li class="hidden md:block" v-if="!authStore.isAuthenticated">
                        <router-link to="/fiyatlandirma" class="hover:text-primary transition-colors">Fiyatlandırma</router-link>
                    </li>
                    <li
                        v-if="authStore.isAuthenticated"
                        class="hidden md:flex items-center gap-4"
                    >
                        <router-link
                            to="/panel"
                            :class="[
                                'inline-flex items-center gap-1.5 transition-colors',
                                route.path === '/panel' ? 'text-primary font-semibold' : 'hover:text-primary'
                            ]"
                        >
                            <i class="pi pi-search text-sm opacity-90" aria-hidden="true"></i>
                            İlanlar
                        </router-link>
                        <router-link
                            v-if="user?.type === 'cargo_owner'"
                            to="/cargo-owner/posts/create"
                            :class="[
                                'inline-flex items-center gap-1.5 transition-colors',
                                route.path === '/cargo-owner/posts/create' ? 'text-primary font-semibold' : 'hover:text-primary'
                            ]"
                        >
                            <i class="pi pi-plus-circle text-sm opacity-90" aria-hidden="true"></i>
                            İlan Oluştur
                        </router-link>
                    </li>
                    <li class="hidden md:block" v-if="!authStore.isAuthenticated">
                        <button type="button" @click="handleLoginClick"
                            class="flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary group cursor-pointer hover:text-primary transition-colors">
                            <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    class="h-4 w-4 text-primary group-hover:text-primary" fill="none"
                                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
                                    <path d="M4 20a8 8 0 0 1 16 0" />
                                </svg>
                            </span>
                            <span>Giriş Yap</span>
                        </button>
                    </li>
                    <li id="tour-hesap" class="hidden md:block relative" v-else data-account-dropdown>
                        <button type="button" @click.stop="accountDropdownOpen = !accountDropdownOpen"
                            class="flex items-center gap-2 rounded-full border cursor-pointer border-gray-200 px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
                            <span>{{ user.full_name }}</span>
                            <span v-if="hasUnreadMessages" class="w-2 h-2 rounded-full bg-red-400 shrink-0"
                                aria-hidden="true" />
                            <svg :class="{ 'rotate-180': accountDropdownOpen }"
                                class="transition-transform duration-300 w-4 h-4 text-gray-600" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div v-if="accountDropdownOpen"
                            class="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                            <div class="px-4 py-3 text-sm font-medium bg-primary text-white">{{ userType }}</div>
                            <button @click="handleGotoAccountClick"
                                class="block px-4 py-3 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 w-full transition-colors text-left">
                                <div class="flex items-center gap-2"><i class="pi pi-user"
                                        style="font-size: 14px;"></i><span>Hesaba Git</span></div>
                            </button>
                            <div v-if="user.type == 'cargo_owner'" class="flex flex-col border-b border-gray-100">
                                <RouterLink
                                    to="/cargo-owner/posts"
                                    class="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 w-full transition-colors"
                                >
                                    <div class="flex items-center gap-2">
                                        <i class="pi pi-car" style="font-size: 14px;"></i>
                                        <span>İlanlarım</span>
                                    </div>
                                </RouterLink>
                                <RouterLink
                                    to="/cargo-owner/posts/create"
                                    class="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 w-full transition-colors"
                                >
                                    <div class="flex items-center gap-2">
                                        <i class="pi pi-plus-circle" style="font-size: 14px;"></i>
                                        <span>İlan Oluştur</span>
                                    </div>
                                </RouterLink>
                                <RouterLink
                                    to="/cargo-owner/messages"
                                    class="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 w-full transition-colors"
                                >
                                    <div class="flex items-center gap-2">
                                        <i class="pi pi-envelope" style="font-size: 14px;"></i>
                                        <span>Mesajlarım</span>
                                        <span
                                            v-if="hasUnreadMessages"
                                            class="w-2 h-2 rounded-full bg-red-400 shrink-0"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </RouterLink>
                            </div>
                            <div v-else class="flex flex-col gap-2">
                                <RouterLink to="/vehicle-owner/orders"
                                    class="block px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 w-full transition-colors">
                                    <div class="flex items-center gap-2"><i class="pi pi-shopping-bag"
                                            style="font-size: 14px;"></i><span>İlanlarım</span></div>
                                </RouterLink>
                                <RouterLink to="/vehicle-owner/vehicles"
                                    class="block px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 w-full transition-colors">
                                    <div class="flex items-center gap-2"><i class="pi pi-car"
                                            style="font-size: 14px;"></i><span>Araçlarım</span></div>
                                </RouterLink>
                                <RouterLink to="/vehicle-owner/load-alarms"
                                    class="block px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 w-full transition-colors">
                                    <div class="flex items-center gap-2"><i class="pi pi-bell"
                                            style="font-size: 14px;"></i><span>Yük Alarmı</span></div>
                                </RouterLink>
                                <RouterLink to="/vehicle-owner/messages"
                                    class="block px-4 py-1 pb-3 text-sm font-medium text-gray-700 hover:bg-gray-100 w-full transition-colors">
                                    <div class="flex items-center gap-2"><i class="pi pi-envelope"
                                            style="font-size: 14px;"></i><span>Mesajlarım</span><span
                                            v-if="hasUnreadMessages" class="w-2 h-2 rounded-full bg-red-400 shrink-0"
                                            aria-hidden="true" /></div>
                                </RouterLink>
                            </div>
                            <div class="border-t border-gray-200"></div>
                            <button type="button" @click="handleLogout"
                                class="w-full text-left px-4 py-4 text-sm font-medium text-red-600 cursor-pointer hover:bg-red-50 transition-colors">
                                <div class="flex items-center gap-2"><svg class="w-4 h-4" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg><span>Güvenli Çıkış Yap</span></div>
                            </button>
                        </div>
                    </li>
                </ul>
            </Content>
        </header>
        <div class="h-16"></div>
        <div v-if="showAccountBreadcrumb" class="w-full">
            <Content class="py-2">
                <AccountBreadcrumb />
            </Content>
        </div>

        <!-- Mobil: soldan kayan menü -->
        <Teleport to="body">
            <Transition name="drawer-overlay">
                <div v-if="mobileMenuOpen" class="fixed inset-0 bg-black/50 z-40 md:hidden" aria-hidden="true"
                    @click="mobileMenuOpen = false" />
            </Transition>
            <Transition name="drawer-slide">
                <aside v-if="mobileMenuOpen"
                    class="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white shadow-xl z-50 flex flex-col md:hidden">
                    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 shrink-0">
                        <span class="font-semibold text-gray-900">{{ user?.full_name }}</span>
                        <button type="button" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            aria-label="Kapat" @click="mobileMenuOpen = false">
                            <i class="pi pi-times text-xl"></i>
                        </button>
                    </div>
                    <nav class="flex-1 overflow-y-auto py-4">
                        <ul class="flex flex-col">
                            <template v-if="!authStore.isAuthenticated">
                                <li>
                                    <RouterLink to="/help"
                                        class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                        @click="mobileMenuOpen = false">Yardım</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/hakkimizda"
                                        class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                        @click="mobileMenuOpen = false">Hakkımızda</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/fiyatlandirma"
                                        class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                        @click="mobileMenuOpen = false">Fiyatlandırma</RouterLink>
                                </li>
                                <li class="mt-2 px-4">
                                    <button type="button" @click="mobileMenuOpen = false; handleLoginClick()"
                                        class="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors">Giriş
                                        Yap</button>
                                </li>
                            </template>
                            <template v-else>
                                <li>
                                    <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        {{ userType }}</div>
                                </li>
                                <li>
                                    <RouterLink to="/panel"
                                        :class="[
                                            'flex items-center gap-3 px-4 py-3 transition-colors',
                                            route.path === '/panel'
                                                ? 'text-primary bg-primary/10 font-semibold'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                                        ]"
                                        @click="mobileMenuOpen = false"><i
                                        class="pi pi-search text-base"></i><span>İlanlar</span></RouterLink>
                                </li>
                                <li>
                                    <button type="button" @click="mobileMenuOpen = false; handleGotoAccountClick()"
                                        class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"><i
                                            class="pi pi-user text-base"></i><span>Hesaba Git</span></button>
                                </li>
                                <template v-if="user.type == 'cargo_owner'">
                                    <li>
                                        <RouterLink
                                            to="/cargo-owner/posts"
                                            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                            @click="mobileMenuOpen = false"
                                        >
                                            <i class="pi pi-car text-base"></i>
                                            <span>İlanlarım</span>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink
                                            to="/cargo-owner/posts/create"
                                            :class="[
                                                'flex items-center gap-3 px-4 py-3 transition-colors',
                                                route.path === '/cargo-owner/posts/create'
                                                    ? 'text-primary bg-primary/10 font-semibold'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                                            ]"
                                            @click="mobileMenuOpen = false"
                                        >
                                            <i class="pi pi-plus-circle text-base"></i>
                                            <span>İlan Oluştur</span>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink
                                            to="/cargo-owner/messages"
                                            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                            @click="mobileMenuOpen = false"
                                        >
                                            <i class="pi pi-envelope"></i>
                                            <span>Mesajlarım</span>
                                            <span
                                                v-if="hasUnreadMessages"
                                                class="w-2 h-2 rounded-full bg-red-400 shrink-0"
                                            />
                                        </RouterLink>
                                    </li>
                                </template>
                                <template v-else>
                                    <li>
                                        <RouterLink to="/vehicle-owner/orders"
                                            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                            @click="mobileMenuOpen = false"><i
                                                class="pi pi-shopping-bag"></i><span>İlanlarım</span></RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/vehicle-owner/vehicles"
                                            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                            @click="mobileMenuOpen = false"><i
                                                class="pi pi-car"></i><span>Araçlarım</span></RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/vehicle-owner/load-alarms"
                                            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                            @click="mobileMenuOpen = false"><i
                                                class="pi pi-bell"></i><span>Yük Alarmı</span></RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/vehicle-owner/messages"
                                            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                            @click="mobileMenuOpen = false"><i
                                                class="pi pi-envelope"></i><span>Mesajlarım</span><span
                                                v-if="hasUnreadMessages"
                                                class="w-2 h-2 rounded-full bg-red-400 shrink-0" /></RouterLink>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            class="w-[90%] mx-auto mt-5 flex items-center gap-3 px-4 py-3 text-left text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors font-semibold"
                                            @click="mobileMenuOpen = false; ekibineSorOpen = true"
                                        >
                                            <i class="pi pi-question-circle text-primary text-base"></i>
                                            <span>TaşıBul Ekibine Sor</span>
                                            <svg
                                                class="w-4 h-4 ml-auto text-primary"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M17 8l4 4m0 0l-4 4m4-4H7" />
                                            </svg>
                                        </button>
                                    </li>
                                </template>
                                <li class="border-t border-gray-200 mt-2 pt-2 absolute bottom-0 left-0 right-0"><button type="button"
                                        @click="mobileMenuOpen = false; handleLogout()"
                                        class="flex items-center gap-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"><svg
                                            class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg><span>Güvenli Çıkış Yap</span></button></li>
                            </template>
                        </ul>
                    </nav>
                </aside>
            </Transition>
        </Teleport>

        <EkibineSorModal v-model:open="ekibineSorOpen" />
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import Content from './Content.vue';
import EkibineSorModal from './EkibineSorModal.vue';
import AccountBreadcrumb from './AccountBreadcrumb.vue';
import { storeToRefs } from 'pinia';
import api from '@/api';
import { Router } from 'lucide-vue-next';
import { useInboxUnreadStore } from '@/stores/inbox-unread';
import { useGlobalInboxUnread } from '@/composables/useGlobalInboxUnread';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const { user, requestShowLoginModal } = storeToRefs(authStore);
const showAccountBreadcrumb = computed(() =>
    route.path.startsWith('/vehicle-owner') || route.path.startsWith('/cargo-owner')
);

const scrolled = ref(false);
const onScroll = () => { scrolled.value = window.scrollY > 10; };
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); });
onUnmounted(() => { window.removeEventListener('scroll', onScroll); });

const accountDropdownOpen = ref(false);
const mobileMenuOpen = ref(false);
const ekibineSorOpen = ref(false);
useGlobalInboxUnread();
const inboxUnread = useInboxUnreadStore();
const { hasUnread: hasUnreadMessages } = storeToRefs(inboxUnread);

const userType = computed(() => {
    if (user.value.type === 'cargo_owner') {
        return 'Yük Sahibi';
    }

    return 'Araç Sahibi';
});

const handleLoginClick = () => {
    openLogin();
};

/** Giriş / kayıt artık ayrı sayfalar (`/giris`, `/kayit-ol`) */
const openLogin = () => {
    router.push(authStore.isAuthenticated ? '/panel' : '/giris');
};

const openRegister = () => {
    router.push(authStore.isAuthenticated ? '/panel' : '/kayit-ol');
};

watch(requestShowLoginModal, (v) => {
    if (v) {
        requestShowLoginModal.value = false;
        openLogin();
    }
});

watch(
    () => route.query?.via,
    (via) => {
        if (via !== 'whatsapp') return;
        const nextQuery = { ...route.query };
        delete nextQuery.via;
        if (!authStore.isAuthenticated) {
            router.replace({ path: '/giris', query: nextQuery });
            return;
        }
        router.replace({ path: route.path, query: nextQuery });
    },
    { immediate: true }
);

const handleLogout = () => {
    accountDropdownOpen.value = false;
    authStore.logout();
    toast.success('Güvenli bir şekilde çıkış yaptınız.', { description: 'Çıkış Yapıldı', duration: 5000 });
};

// Click outside handler for dropdown
const handleClickOutside = (event) => {
    if (accountDropdownOpen.value && !event.target.closest('[data-account-dropdown]')) {
        accountDropdownOpen.value = false;
    }
};

const handleOpenLoginEvent = () => openLogin();

watch(accountDropdownOpen, (open) => {
    if (open && authStore.isAuthenticated) void inboxUnread.fetchHasUnread();
});

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('open-login', handleOpenLoginEvent);
    if (authStore.isAuthenticated) void inboxUnread.fetchHasUnread();
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('open-login', handleOpenLoginEvent);
    document.body.style.overflow = 'auto';
});

const handleGotoAccountClick = () => {
    accountDropdownOpen.value = false
    if (authStore.user.type === 'cargo_owner') {
        router.push('/cargo-owner');
    } else {
        router.push('/vehicle-owner');
    }
};
</script>

<style>
.drawer-overlay-enter-active,
.drawer-overlay-leave-active {
    transition: opacity 0.25s ease;
}

.drawer-overlay-enter-from,
.drawer-overlay-leave-to {
    opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
    transition: transform 0.3s ease;
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
    transform: translateX(-100%);
}
</style>
