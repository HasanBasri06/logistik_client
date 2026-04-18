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
                                            style="font-size: 14px;"></i><span>Siparişlerim</span></div>
                                </RouterLink>
                                <RouterLink to="/vehicle-owner/vehicles"
                                    class="block px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 w-full transition-colors">
                                    <div class="flex items-center gap-2"><i class="pi pi-car"
                                            style="font-size: 14px;"></i><span>Araçlarım</span></div>
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
                                                class="pi pi-shopping-bag"></i><span>Siparişlerim</span></RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/vehicle-owner/vehicles"
                                            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                            @click="mobileMenuOpen = false"><i
                                                class="pi pi-car"></i><span>Araçlarım</span></RouterLink>
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

        <!-- Giriş / Kayıt Modal (Custom Overlay) -->
        <div v-if="showLogin"
            class="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-[1px]"
            @click.self="showLogin = false">
            <div class="w-full md:w-[90%] max-w-[1300px] md:h-[80vh] h-full bg-white shadow-2xl rounded-md p-4 overflow-hidden">
                <div class="flex flex-col md:flex-row h-full">
                    <!-- Sol: Wallpaper -->
                    <div class="hidden md:block md:w-[50%] bg-white relative overflow-hidden p-16">
                        <div class="w-full h-full flex items-center justify-center">
                            <img :src="loginWallpaper" alt="Login Wallpaper"
                                class="w-full object-cover object-center" />

                        </div>
                    </div>

                    <!-- Sağ: Form -->
                    <div class="w-full md:w-[50%] px-2 py-9 md:p-12 overflow-y-auto md:bg-linear-to-br md:from-gray-50 md:to-white">
                        <div class="flex items-center justify-between mb-8">
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                                    TaşıBul Hesabın
                                </p>
                                <h3
                                    :class="[
                                        'font-bold text-gray-900',
                                        registerOtpSent ? 'text-2xl md:text-3xl' : isRegister ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl',
                                    ]"
                                >
                                    {{ registerOtpSent ? 'Telefon Doğrulama' : (isRegister ? 'Kayıt Ol' : 'Giriş Yap')
                                    }}
                                </h3>
                                <p class="text-sm text-gray-500 mt-2">
                                    {{ isRegister ? 'Hesabını oluştur ve hemen başla' : 'Hesabına giriş yap' }}
                                </p>
                            </div>
                            <button type="button"
                                class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200"
                                @click="showLogin = false">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form class="flex flex-col gap-5" @submit.prevent="handleAuthModalSubmit">
                            <template v-if="!isRegister">
                                <div class="relative flex flex-col gap-6 w-full">
                                    <div v-if="loginLoading"
                                        class="absolute inset-0 z-10 flex items-center justify-center bg-white/80 rounded-lg">
                                        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label
                                            class="text-sm font-semibold text-gray-700 flex items-center justify-start gap-2">
                                            Telefon Numarası
                                            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </label>
                                        <div class="relative">

                                            <InputMask type="tel" mask="999 999 99 99" placeholder="5XX XXX XX XX"
                                                v-model="loginForm.phone" id="phone" :class="[
                                                    'w-full h-12 px-4 pl-12 text-left border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200',
                                                    loginErrors.phone
                                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                        : 'border-gray-200 focus:border-primary'
                                                ]"
                                                :pt="{ pcInputText: { root: { inputmode: 'text', enterkeyhint: 'done' } } }"
                                            />
                                            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span v-if="loginErrors.phone"
                                            class="text-xs text-red-500 font-medium flex items-center justify-start gap-1">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            {{ loginErrors.phone }}
                                        </span>
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label
                                            class="text-sm font-semibold text-gray-700 flex items-center justify-start gap-2">
                                            Şifre
                                            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </label>
                                        <div class="relative">
                                            <input :type="showLoginPassword ? 'text' : 'password'"
                                                v-model="loginForm.password" :class="[
                                                    'w-full h-12 px-4 pl-12 pr-12 text-left border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200',
                                                    loginErrors.password
                                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                        : 'border-gray-200 focus:border-primary'
                                                ]" placeholder="Şifrenizi girin"
                                                inputmode="text"
                                                enterkeyhint="done"
                                            />
                                            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <button type="button" @click="showLoginPassword = !showLoginPassword"
                                                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                                <i :class="showLoginPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                                                    style="font-size: 18px;"></i>
                                            </button>
                                        </div>
                                        <span v-if="loginErrors.password"
                                            class="text-xs text-red-500 font-medium flex items-center justify-start gap-1">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            {{ loginErrors.password }}
                                        </span>
                                    </div>
                                    <div class="flex justify-start -mt-2">
                                        <button type="button"
                                            class="text-sm text-gray-600 hover:text-primary font-medium transition-colors">
                                            Şifremi Unuttum
                                        </button>
                                    </div>

                                    <div class="flex flex-wrap items-center gap-3">
                                        <button
                                            type="submit"
                                            :disabled="loginLoading"
                                            :class="[
                                            'h-12 px-6 font-semibold rounded-lg transition-all duration-200 shadow-lg text-base shrink-0',
                                            loginLoading
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-primary text-white hover:bg-primary/90 hover:shadow-xl transform hover:-translate-y-0.5'
                                        ]">
                                            <span v-if="loginLoading" class="flex items-center justify-center gap-2">
                                                <i class="pi pi-spin pi-spinner text-sm"></i> Giriş yapılıyor...
                                            </span>
                                            <span v-else>Giriş Yap</span>
                                        </button>
                                        <p class="text-sm text-gray-600 flex items-center gap-1.5 flex-wrap">
                                            Hesabın yok mu?
                                            <span
                                                class="text-primary text-base md:text-lg font-semibold hover:bg-primary/5 transition-colors cursor-pointer"
                                                @click="openRegister">
                                                Kayıt ol
                                            </span>
                                        </p>
                                    </div>
                                    <!--
                                        <div class="flex items-center gap-3 my-2">
                                            <div class="flex-1 h-px bg-gray-200"></div>
                                            <span class="text-xs text-gray-500 font-medium">veya</span>
                                            <div class="flex-1 h-px bg-gray-200"></div>
                                        </div>
                                    -->
                                    <div class="flex items-center justify-center gap-4">
                                        <!--
                                            <button type="button" @click="handleGoogleLogin"
                                                class="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                                                title="Google ile Giriş Yap">
                                                <svg class="w-6 h-6" viewBox="0 0 24 24">
                                                    <path fill="#4285F4"
                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853"
                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05"
                                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="#EA4335"
                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                            </button>
                                        -->
                                        <!--
                                        <button type="button" @click="handleFacebookLogin"
                                            class="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                                            title="Facebook ile Giriş Yap">
                                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
                                                <path
                                                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </button>
                                        -->
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="registerOtpSent">
                                <div class="flex flex-col gap-4">
                                    <p class="text-sm text-gray-600">
                                        <span class="flex flex-wrap items-center gap-x-2 gap-y-1">
                                            <span class="font-semibold text-gray-800">{{
                                                '+90 ' + formatPhoneDisplay(pendingRegisterEmail)
                                            }}</span>
                                            <button
                                                type="button"
                                                class="inline-flex items-center justify-center rounded-md p-1 text-primary hover:bg-primary/10"
                                                title="Telefon numarasını değiştir"
                                                @click="openLoginOtpChangePhoneModal"
                                            >
                                                <i class="pi pi-pencil" style="font-size: 14px;"></i>
                                            </button>
                                        </span>
                                        <span class="mt-1 block">numarasına kod önce <strong class="font-semibold text-gray-800">SMS</strong> ile gönderilir; hesabınızda e-posta kayıtlıysa aynı kod ardından <strong class="font-semibold text-gray-800">e-posta</strong> ile de iletilir.</span>
                                    </p>
                                    <div class="flex flex-col gap-1">
                                        <label class="text-sm font-medium text-gray-700">Doğrulama Kodu</label>
                                        <InputOtp
                                            ref="registerOtpInputRef"
                                            v-model="otpCode"
                                            :length="6"
                                            :integerOnly="true"
                                            :unstyled="true"
                                            :pt="{
                                                root: { class: 'flex gap-2' },
                                                pcInputText: { root: { class: 'w-12 h-14 rounded-md text-lg text-center tracking-[0.4em] font-semibold border border-gray-200 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-primary/20', inputmode: 'text', enterkeyhint: 'done' } }
                                            }"
                                        />
                                        <span v-if="otpError" class="text-xs text-red-500">{{ otpError }}</span>
                                    </div>
                                    <button
                                        type="submit"
                                        :disabled="(!otpCode || otpCode.length !== 6) || otpVerifyLoading" :class="[
                                            'w-full h-11 font-semibold rounded-md transition-all text-sm',
                                            otpVerifyLoading
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                                        ]">
                                        <span v-if="otpVerifyLoading" class="flex items-center justify-center gap-2">
                                            <i class="pi pi-spin pi-spinner text-sm"></i> Doğrulanıyor...
                                        </span>
                                        <span v-else>Doğrula</span>
                                    </button>
                                    <button
                                        type="button"
                                        @click="handleResendOtp"
                                        :disabled="resendOtpLoading"
                                        class="text-sm text-primary font-medium hover:underline disabled:opacity-50 text-left"
                                    >
                                        <span v-if="resendOtpLoading" class="inline-flex items-center gap-1">
                                            <i class="pi pi-spin pi-spinner text-xs"></i> Gönderiliyor...
                                        </span>
                                        <span v-else>Kodu tekrar gönder</span>
                                    </button>
                                    <button type="button" @click="handleOtpBack"
                                        class="text-sm text-gray-500 hover:text-gray-700">
                                        ← Geri
                                    </button>
                                </div>
                            </template>

                            <template v-else>
                                <!-- Kullanıcı Türü Seçimi -->
                                <div class="flex flex-col gap-1">
                                    <label class="text-sm font-medium text-gray-700 mb-2">Kullanıcı Türü</label>
                                    <div class="flex gap-3">
                                        <button type="button" @click="registerForm.userType = 'cargo_owner'" :class="[
                                            'flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium text-sm',
                                            registerForm.userType === 'cargo_owner'
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'
                                        ]">
                                            Yük Sahibi
                                        </button>
                                        <button type="button" @click="registerForm.userType = 'vehicle_owner'" :class="[
                                            'flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium text-sm',
                                            registerForm.userType === 'vehicle_owner'
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'
                                        ]">
                                            Araç Sahibi
                                        </button>
                                    </div>
                                    <span v-if="registerErrors.userType" class="text-xs text-red-500 mt-0.5">
                                        {{ registerErrors.userType }}
                                    </span>
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <div class="flex flex-col gap-1">
                                        <label class="text-sm font-medium text-gray-700">İsim</label>
                                        <input type="text" v-model="registerForm.firstName"
                                            :class="['input', registerErrors.firstName ? 'border-red-400' : '']"
                                            placeholder="İsminiz"
                                            inputmode="text"
                                            enterkeyhint="done"
                                        />
                                        <span v-if="registerErrors.firstName" class="text-xs text-red-500 mt-0.5">
                                            {{ registerErrors.firstName }}
                                        </span>
                                    </div>
                                    <div class="flex flex-col gap-1">
                                        <label class="text-sm font-medium text-gray-700">Soyisim</label>
                                        <input type="text" v-model="registerForm.lastName"
                                            :class="['input', registerErrors.lastName ? 'border-red-400' : '']"
                                            placeholder="Soyisminiz"
                                            inputmode="text"
                                            enterkeyhint="done"
                                        />
                                        <span v-if="registerErrors.lastName" class="text-xs text-red-500 mt-0.5">
                                            {{ registerErrors.lastName }}
                                        </span>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <label class="text-sm font-medium text-gray-700">E-posta</label>
                                    <input type="email" v-model="registerForm.email"
                                        :class="['input', registerErrors.email ? 'border-red-400' : '']"
                                        placeholder="ornek@mail.com"
                                        inputmode="text"
                                        enterkeyhint="done"
                                    />
                                    <span v-if="registerErrors.email" class="text-xs text-red-500 mt-0.5">
                                        {{ registerErrors.email }}
                                    </span>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <label class="text-sm font-medium text-gray-700">Telefon Numarası</label>


                                    <InputMask type="tel" mask="999 999 99 99" placeholder="5XX XXX XX XX"
                                        v-model="registerForm.phone" id="phone2" :class="[
                                            'w-full h-12 px-4 pl-12 text-left border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200',
                                            loginErrors.phone
                                                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-primary'
                                        ]"
                                        :pt="{ pcInputText: { root: { inputmode: 'text', enterkeyhint: 'done' } } }"
                                    />
                                    <span v-if="registerErrors.phone" class="text-xs text-red-500 mt-0.5">
                                        {{ registerErrors.phone }}
                                    </span>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <label class="text-sm font-medium text-gray-700">Şifre</label>
                                    <div class="relative">
                                        <input :type="showRegisterPassword ? 'text' : 'password'"
                                            v-model="registerForm.password"
                                            :class="['input pr-24', registerErrors.password ? 'border-red-400' : '']"
                                            placeholder="Şifrenizi oluşturun"
                                            autocomplete="new-password"
                                            inputmode="text"
                                            enterkeyhint="done"
                                        />
                                        <div
                                            class="absolute inset-y-0 right-2 z-10 flex items-center gap-0.5"
                                            role="presentation"
                                        >
                                            <button
                                                type="button"
                                                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                                aria-label="Şifreyi göster veya gizle"
                                                @click="showRegisterPassword = !showRegisterPassword"
                                            >
                                                <i
                                                    :class="showRegisterPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                                                    class="text-lg"
                                                ></i>
                                            </button>
                                            <button
                                                type="button"
                                                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10"
                                                aria-label="Rastgele güçlü şifre oluştur"
                                                title="Rastgele güçlü şifre"
                                                @click="rollRegisterPassword"
                                            >
                                                <i class="pi pi-lightbulb text-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <span v-if="registerErrors.password" class="text-xs text-red-500 mt-0.5">
                                        {{ registerErrors.password }}
                                    </span>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <label class="text-sm font-medium text-gray-700">Şifre Tekrar</label>
                                    <div class="relative">
                                        <input :type="showRegisterConfirmPassword ? 'text' : 'password'"
                                            v-model="registerForm.confirmPassword"
                                            :class="['input pr-12', registerErrors.confirmPassword ? 'border-red-400' : '']"
                                            placeholder="Şifrenizi tekrar girin"
                                            inputmode="text"
                                            enterkeyhint="done"
                                        />
                                        <button type="button"
                                            @click="showRegisterConfirmPassword = !showRegisterConfirmPassword"
                                            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                            <i :class="showRegisterConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                                                style="font-size: 18px;"></i>
                                        </button>
                                    </div>
                                    <span v-if="registerErrors.confirmPassword" class="text-xs text-red-500 mt-0.5">
                                        {{ registerErrors.confirmPassword }}
                                    </span>
                                </div>
                                <div class="flex flex-col gap-2.5 text-sm text-gray-600 mt-1">
                                    <label class="flex items-start gap-2.5 cursor-pointer select-none">
                                        <input
                                            v-model="registerAcceptUyelik"
                                            type="checkbox"
                                            class="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span class="leading-snug">
                                            <button
                                                type="button"
                                                class="font-semibold text-primary hover:underline inline p-0 border-0 bg-transparent cursor-pointer text-left"
                                                @click.stop="openLegalTextModal('uyelik', false)"
                                            >Üyelik Sözleşmesi</button>'ni okudum ve kabul ediyorum.
                                        </span>
                                    </label>
                                    <label class="flex items-start gap-2.5 cursor-pointer select-none">
                                        <input
                                            v-model="registerAcceptKvkk"
                                            type="checkbox"
                                            class="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span class="leading-snug">
                                            <button
                                                type="button"
                                                class="font-semibold text-primary hover:underline inline p-0 border-0 bg-transparent cursor-pointer text-left"
                                                @click.stop="openLegalTextModal('kvkk', false)"
                                            >KVKK Aydınlatma Metni</button>'ni okudum ve onaylıyorum.
                                        </span>
                                    </label>
                                </div>
                                <div class="flex flex-wrap items-center gap-3 mt-2">
                                    <button
                                        type="submit"
                                        :disabled="registerLoading || !registerAcceptUyelik || !registerAcceptKvkk"
                                        :class="[
                                        'h-12 px-6 font-semibold rounded-md transition-all text-base md:text-lg shrink-0',
                                        registerLoading || !registerAcceptUyelik || !registerAcceptKvkk
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-primary text-white hover:opacity-90'
                                    ]">
                                        <span v-if="registerLoading" class="flex items-center justify-center gap-2">
                                            <i class="pi pi-spin pi-spinner text-sm"></i> Kayıt yapılıyor...
                                        </span>
                                        <span v-else>Kayıt Ol</span>
                                    </button>
                                    <p class="text-sm text-gray-500 flex items-center gap-1.5">
                                        Zaten hesabın var mı?
                                        <button type="button"
                                            class="text-primary cursor-pointer font-semibold hover:bg-primary/5 transition-colors"
                                            @click="openLogin">
                                            Giriş yap
                                        </button>
                                    </p>
                                </div>
                            </template>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <div
                v-show="loginOtpChangePhoneModalOpen"
                class="fixed inset-0 z-[100] flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
            >
                <div class="absolute inset-0 bg-black/50" @click="closeLoginOtpChangePhoneModal" />
                <div
                    class="relative w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-xl"
                    @click.stop
                >
                    <h3 class="mb-1 text-lg font-semibold text-gray-900">Telefon numarasını güncelle</h3>
                    <p class="mb-4 text-sm text-gray-500">
                        Yeni numaraya doğrulama kodu SMS ile gönderilir. Numara başka bir hesapta kayıtlı olamaz.
                    </p>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Yeni telefon</label>
                    <div class="relative mb-3">
                        <InputMask
                            v-model="loginOtpNewPhone"
                            type="tel"
                            mask="999 999 99 99"
                            placeholder="5XX XXX XX XX"
                            autocomplete="tel"
                            @keydown.enter.prevent="submitLoginOtpChangePhone"
                            :class="[
                                'w-full h-12 !border !rounded-lg !pl-12 pr-4 text-left text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20',
                                '!border-gray-200 focus:border-primary',
                                'placeholder:text-gray-300',
                            ]"
                            :pt="{ pcInputText: { root: { inputmode: 'text', enterkeyhint: 'done' } } }"
                        />
                        <div class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                        </div>
                    </div>
                    <p v-if="loginOtpChangePhoneError" class="mb-3 text-xs text-red-600">
                        {{ loginOtpChangePhoneError }}
                    </p>
                    <div class="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                            :disabled="loginOtpChangePhoneLoading"
                            @click="closeLoginOtpChangePhoneModal"
                        >
                            Vazgeç
                        </button>
                        <button
                            type="button"
                            class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                            :disabled="
                                loginOtpChangePhoneLoading ||
                                String(loginOtpNewPhone ?? '').replace(/\s/g, '').length !== 10
                            "
                            @click="submitLoginOtpChangePhone"
                        >
                            {{
                                loginOtpChangePhoneLoading ? 'Kaydediliyor...' : 'Kaydet ve kod gönder'
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <EkibineSorModal v-model:open="ekibineSorOpen" />

        <LegalTextModal
            v-model="legalTextModal"
            :is-login="legalModalIsLogin"
            @confirm="onLegalTextModalConfirm"
        />
    </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import Content from './Content.vue';
import EkibineSorModal from './EkibineSorModal.vue';
import LegalTextModal from '@/components/legal/LegalTextModal.vue';
import AccountBreadcrumb from './AccountBreadcrumb.vue';
import loginWallpaper from '@/assets/images/login_wallpaper.gif';
import { InputMask } from 'primevue';
import { InputOtp } from 'primevue';
import { storeToRefs } from 'pinia';
import api from '@/api';
import { Router } from 'lucide-vue-next';

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

const showLogin = ref(false);
const isRegister = ref(false);
const accountDropdownOpen = ref(false);
const mobileMenuOpen = ref(false);
const ekibineSorOpen = ref(false);
/** null | 'uyelik' | 'kvkk' — giriş/kayıt üzerinde yasal metin önizlemesi */
const legalTextModal = ref(null);
/** Modal hangi formdan açıldı (onay butonu ilgili checkbox’a yazar) */
const legalModalIsLogin = ref(true);

function openLegalTextModal(doc, isLogin) {
    legalTextModal.value = doc;
    legalModalIsLogin.value = !!isLogin;
}

/** Okunmamış mesaj var mı (Header dropdown Mesajlarım yanında kırmızı nokta) */
const hasUnreadMessages = ref(false);

const userType = computed(() => {
    if (user.value.type === 'cargo_owner') {
        return 'Yük Sahibi';
    }

    return 'Araç Sahibi';
});

const loginForm = ref({
    phone: "",
    password: ""
});

const loginErrors = ref({
    phone: "",
    password: ""
});

const showLoginPassword = ref(false);
const loginLoading = ref(false);

const loginAcceptUyelik = ref(false);
const loginAcceptKvkk = ref(false);
const registerAcceptUyelik = ref(false);
const registerAcceptKvkk = ref(false);

function onLegalTextModalConfirm({ doc, isLogin }) {
    if (doc === 'uyelik') {
        if (isLogin) loginAcceptUyelik.value = true;
        else registerAcceptUyelik.value = true;
    } else if (doc === 'kvkk') {
        if (isLogin) loginAcceptKvkk.value = true;
        else registerAcceptKvkk.value = true;
    }
}

const registerForm = ref({
    userType: "cargo_owner",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
});

const registerErrors = ref({
    userType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
});

const showRegisterPassword = ref(false);
const showRegisterConfirmPassword = ref(false);
const registerOtpSent = ref(false);
const pendingRegisterEmail = ref("");
const otpCode = ref("");
const otpError = ref("");
const otpOpenedFromLogin = ref(false);
const registerLoading = ref(false);
const resendOtpLoading = ref(false);
const otpVerifyLoading = ref(false);
const registerOtpInputRef = ref(null);

const loginOtpChangePhoneModalOpen = ref(false);
const loginOtpNewPhone = ref('');
const loginOtpChangePhoneLoading = ref(false);
const loginOtpChangePhoneError = ref('');

/** OTP üst satırı: girişteki InputMask (`999 999 99 99`) ile aynı gruplama — örn. 555 123 45 67 */
function formatPhoneDisplay(phone) {
    if (!phone || typeof phone !== 'string') return '';
    const d = String(phone).replace(/\D/g, '');
    let ten = '';
    if (d.length === 11 && d.startsWith('0')) {
        ten = d.slice(1);
    } else if (d.length === 10 && d.startsWith('5')) {
        ten = d;
    } else if (d.length >= 10) {
        ten = d.slice(-10);
    } else {
        return phone.trim();
    }
    if (ten.length !== 10) {
        return phone.trim();
    }
    return `${ten.slice(0, 3)} ${ten.slice(3, 6)} ${ten.slice(6, 8)} ${ten.slice(8, 10)}`;
}

/** Girişteki InputMask (10 hane, 5XX…) ile uyumlu string */
function phoneForInputMask(stored) {
    if (!stored) return '';
    const d = String(stored).replace(/\D/g, '');
    if (d.length === 11 && d.startsWith('0')) {
        return d.slice(1);
    }
    if (d.length === 10 && d.startsWith('5')) {
        return d;
    }
    if (d.length >= 10) {
        return d.slice(-10);
    }
    return d;
}

function openLoginOtpChangePhoneModal() {
    loginOtpChangePhoneError.value = '';
    loginOtpNewPhone.value = phoneForInputMask(pendingRegisterEmail.value || '');
    loginOtpChangePhoneModalOpen.value = true;
}

function closeLoginOtpChangePhoneModal() {
    if (loginOtpChangePhoneLoading.value) return;
    loginOtpChangePhoneModalOpen.value = false;
    loginOtpChangePhoneError.value = '';
}

async function submitLoginOtpChangePhone() {
    const newPhone = String(loginOtpNewPhone.value ?? '').replace(/\s/g, '');
    const current = pendingRegisterEmail.value;
    if (!current || newPhone.length !== 10) {
        loginOtpChangePhoneError.value =
            newPhone.length !== 10 ? 'Geçerli bir 10 haneli cep numarası girin.' : 'Oturum bilgisi eksik.';
        return;
    }
    loginOtpChangePhoneError.value = '';
    loginOtpChangePhoneLoading.value = true;
    const result = await authStore.changePhonePending(current, newPhone);
    loginOtpChangePhoneLoading.value = false;
    if (result.success && result.phone) {
        pendingRegisterEmail.value = result.phone;
        otpCode.value = '';
        otpError.value = '';
        loginOtpChangePhoneModalOpen.value = false;
        const masked = phoneForInputMask(result.phone);
        if (otpOpenedFromLogin.value) {
            loginForm.value.phone = masked;
        } else {
            registerForm.value.phone = masked;
        }
        toast.success('Telefon güncellendi', {
            description: 'Yeni kod önce SMS, ardından e-posta ile gönderildi.',
            duration: 5000,
        });
    } else {
        loginOtpChangePhoneError.value = result.error || 'İşlem başarısız.';
        toast.error(loginOtpChangePhoneError.value, { duration: 5000 });
    }
}

function focusRegisterOtpFirstInput() {
    const inst = registerOtpInputRef.value;
    const root = inst?.$el;
    if (!root?.querySelector) return;
    const first = root.querySelector('input');
    first?.focus?.();
}

const loginSchema = yup.object({
    phone: yup
        .string()
        .required("Telefon numarası zorunludur."),
    password: yup
        .string()
        .required("Şifre zorunludur.")
});

const registerSchema = yup.object({
    userType: yup
        .string()
        .oneOf(['cargo_owner', 'vehicle_owner'], "Kullanıcı türü seçilmelidir.")
        .required("Kullanıcı türü zorunludur."),
    firstName: yup
        .string()
        .required("İsim zorunludur."),
    lastName: yup
        .string()
        .required("Soyisim zorunludur."),
    email: yup
        .string()
        .email("Geçerli bir e-posta girin.")
        .required("E-posta zorunludur."),
    phone: yup
        .string()
        .required("Telefon numarası zorunludur."),
    password: yup
        .string()
        .min(6, "Şifre en az 6 karakter olmalıdır.")
        .required("Şifre zorunludur."),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Şifreler eşleşmiyor.")
        .required("Şifre tekrar zorunludur.")
});

const handleLoginClick = () => {
    openLogin();
};

const openLogin = () => {
    isRegister.value = false;
    showLogin.value = true;
};

const openRegister = () => {
    isRegister.value = true;
    showLogin.value = true;
};

watch(requestShowLoginModal, (v) => {
    if (v) {
        openLogin();
        requestShowLoginModal.value = false;
    }
});

watch(
    () => route.query?.via,
    (via) => {
        if (via !== 'whatsapp') return;
        if (!authStore.isAuthenticated) {
            openLogin();
        }
        const nextQuery = { ...route.query };
        delete nextQuery.via;
        router.replace({ path: route.path, query: nextQuery });
    },
    { immediate: true }
);

watch(showLogin, (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    if (isOpen) {
        loginAcceptUyelik.value = false;
        loginAcceptKvkk.value = false;
        registerAcceptUyelik.value = false;
        registerAcceptKvkk.value = false;
    }
});

watch(
    registerOtpSent,
    async (sent) => {
        if (!sent || !showLogin.value) return;
        await nextTick();
        focusRegisterOtpFirstInput();
    },
    { flush: 'post' }
);

const handleLogout = () => {
    accountDropdownOpen.value = false;
    authStore.logout();
    toast.success('Güvenli bir şekilde çıkış yaptınız.', { description: 'Çıkış Yapıldı', duration: 5000 });
};

const handleGoogleLogin = () => {
    const base = import.meta.env.VITE_APP_SERVER_URL || 'http://localhost:8000/api';
    const origin = base.replace(/\/api\/?$/, '').replace(/\/+$/, '');
    window.location.href = `${origin}/api/auth/google/redirect`;
};

const handleFacebookLogin = () => {
    // Facebook ile giriş yapma işlemi buraya eklenecek
    console.log('Facebook ile giriş yapılıyor...');
    toast.info('Facebook ile giriş özelliği yakında eklenecek.', { description: 'Facebook Girişi', duration: 5000 });
};

// Click outside handler for dropdown
const handleClickOutside = (event) => {
    if (accountDropdownOpen.value && !event.target.closest('[data-account-dropdown]')) {
        accountDropdownOpen.value = false;
    }
};

const handleOpenLoginEvent = () => openLogin();

async function fetchHasUnreadMessages() {
    if (!authStore.isAuthenticated) return;
    try {
        const res = await api.get('/messages/has-unread');
        hasUnreadMessages.value = res.data?.content?.has_unread === true;
    } catch (_) {
        hasUnreadMessages.value = false;
    }
}

watch(accountDropdownOpen, (open) => {
    if (open && authStore.isAuthenticated) fetchHasUnreadMessages();
});

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('open-login', handleOpenLoginEvent);
    fetchHasUnreadMessages();
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

const redirectAfterLogin = () => {
    const pending = sessionStorage.getItem('pendingSearch');
    if (pending) {
        sessionStorage.removeItem('pendingSearch');
        router.push({ path: '/panel', query: JSON.parse(pending) });
    } else {
        router.push('/panel');
    }
};

/** Enter ile form gönderiminde hangi ekran görünüyorsa ona göre doğru işlemi tetikler. */
const handleAuthModalSubmit = () => {
    if (registerOtpSent.value) {
        handleVerifyOtp();
    } else if (isRegister.value) {
        handleRegisterSubmit();
    } else {
        handleLoginSubmit();
    }
};

const handleLoginSubmit = async () => {
    loginErrors.value = { phone: "", password: "" };
    loginLoading.value = true;
    try {
        await loginSchema.validate(loginForm.value, { abortEarly: false });

        const result = await authStore.login({
            phone: loginForm.value.phone.replace(/\s/g, ''),
            password: loginForm.value.password
        });

        if (result.success) {
            toast.success('Giriş başarılı!', { description: 'Başarılı', duration: 5000 });
            showLogin.value = false;
            loginForm.value = { phone: "", password: "" };
            loginAcceptUyelik.value = false;
            loginAcceptKvkk.value = false;
            redirectAfterLogin();
        } else if (result.needOtp && result.email) {
            otpOpenedFromLogin.value = true;
            isRegister.value = true;
            registerOtpSent.value = true;
            pendingRegisterEmail.value = result.email;
            otpCode.value = "";
            otpError.value = "";
            toast.info(result.error || 'Telefon doğrulaması gerekli.', {
                description: 'Doğrulama kodu',
                duration: 5000
            });
        } else {
            // Server'dan dönen hata mesajını toast ile göster
            let errorMessage = result.error || 'Giriş başarısız!';

            // Validation hataları varsa, ilk hatayı göster
            if (result.errorDetails && typeof result.errorDetails === 'object') {
                const firstError = Object.values(result.errorDetails)[0];
                if (Array.isArray(firstError)) {
                    errorMessage = firstError[0];
                } else if (typeof firstError === 'string') {
                    errorMessage = firstError;
                }
            }

            toast.error(errorMessage, {
                description: 'Giriş Hatası',
                duration: 5000
            });

            // Validation hatalarını form alanlarına da ekle
            if (result.errorDetails && typeof result.errorDetails === 'object') {
                Object.keys(result.errorDetails).forEach((key) => {
                    if (loginErrors.value[key] !== undefined) {
                        const errorValue = result.errorDetails[key];
                        loginErrors.value[key] = Array.isArray(errorValue)
                            ? errorValue[0]
                            : errorValue;
                    }
                });
            }
        }
    } catch (err) {
        // Yup validation hataları

        if (err.inner) {
            err.inner.forEach((e) => {
                if (e.path && loginErrors.value[e.path] !== undefined) {
                    loginErrors.value[e.path] = e.message;
                }
            });
            // İlk validation hatasını toast ile göster
            if (err.inner.length > 0) {
                toast.error(err.inner[0]?.message || 'Validation hatası', {
                    description: 'Validation Hatası',
                    duration: 5000
                });
            }
        }
        // Axios hataları (store'dan geçmeyen durumlar)
        else if (err.response && err.response.data) {
            const errorMessage = err.response?.data?.message || 'Bir hata oluştu';
            const errorDetails = err.response?.data?.error || err.response?.data?.errors;

            toast.error(errorMessage, {
                description: 'Hata',
                duration: 5000
            });

            // Validation hatalarını form alanlarına ekle
            if (errorDetails && typeof errorDetails === 'object') {
                Object.keys(errorDetails).forEach((key) => {
                    if (loginErrors.value[key] !== undefined) {
                        const errorValue = errorDetails[key];
                        loginErrors.value[key] = Array.isArray(errorValue)
                            ? errorValue[0]
                            : errorValue;
                    }
                });
            }
        } else {
            toast.error(err?.message || 'Giriş işlemi sırasında bir hata oluştu', {
                description: 'Hata',
                duration: 5000
            });
        }
    } finally {
        loginLoading.value = false;
    }
};

const handleRegisterSubmit = async () => {
    if (!registerAcceptUyelik.value || !registerAcceptKvkk.value) {
        toast.error('Kayıt için üyelik sözleşmesi ve KVKK metnini onaylamalısınız.', { duration: 4000 });
        return;
    }
    registerErrors.value = {
        userType: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    };
    try {
        await registerSchema.validate(registerForm.value, { abortEarly: false });

        registerLoading.value = true;
        const result = await authStore.register({
            first_name: registerForm.value.firstName,
            last_name: registerForm.value.lastName,
            email: registerForm.value.email,
            phone: registerForm.value.phone.replace(/\s/g, ''),
            password: registerForm.value.password,
            password_confirm: registerForm.value.confirmPassword,
            type: registerForm.value.userType
        });

        if (result.success && result.needOtp) {
            otpOpenedFromLogin.value = false;
            registerOtpSent.value = true;
            pendingRegisterEmail.value = result.email ?? registerForm.value.email;
            otpCode.value = "";
            otpError.value = "";
            toast.success('Doğrulama kodu önce SMS ile, ardından e-posta adresinize gönderildi.', {
                description: 'Kodu girin',
                duration: 5000
            });
        } else if (result.success) {
            toast.success('Başarılı bir şekilde kayıt oldunuz', {
                description: 'Başarılı',
                duration: 5000
            });
            showLogin.value = false;
            registerForm.value = {
                userType: "cargo_owner",
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: ""
            };
            registerAcceptUyelik.value = false;
            registerAcceptKvkk.value = false;
            redirectAfterLogin();
        } else {
            // Server'dan dönen hata mesajını toast ile göster
            let errorMessage = result.error || 'Kayıt işlemi başarısız!';

            // Validation hataları varsa, ilk hatayı göster
            if (result.errorDetails && typeof result.errorDetails === 'object') {
                const firstError = Object.values(result.errorDetails)[0];
                if (Array.isArray(firstError)) {
                    errorMessage = firstError[0];
                } else if (typeof firstError === 'string') {
                    errorMessage = firstError;
                }
            }

            toast.error(errorMessage, {
                description: 'Kayıt Hatası',
                duration: 5000
            });

            // Validation hatalarını form alanlarına da ekle
            if (result.errorDetails && typeof result.errorDetails === 'object') {
                Object.keys(result.errorDetails).forEach((key) => {
                    const fieldMap = {
                        'first_name': 'firstName',
                        'last_name': 'lastName',
                        'password_confirm': 'confirmPassword'
                    };
                    const mappedKey = fieldMap[key] || key;
                    if (registerErrors.value[mappedKey] !== undefined) {
                        const errorValue = result.errorDetails[key];
                        registerErrors.value[mappedKey] = Array.isArray(errorValue)
                            ? errorValue[0]
                            : errorValue;
                    }
                });
            }
        }
        registerLoading.value = false;
    } catch (err) {
        registerLoading.value = false;
        if (err.inner) {
            err.inner.forEach((e) => {
                if (e.path && registerErrors.value[e.path] !== undefined) {
                    registerErrors.value[e.path] = e.message;
                }
            });
            // İlk validation hatasını toast ile göster
            if (err.inner.length > 0) {
                toast.error(err.inner[0]?.message || 'Validation hatası', {
                    description: 'Validation Hatası',
                    duration: 5000
                });
            }
        }
        // Axios hataları (store'dan geçmeyen durumlar)
        else if (err.response && err.response.data) {
            const errorMessage = err.response?.data?.message || 'Bir hata oluştu';
            const errorDetails = err.response?.data?.error || err.response?.data?.errors;

            toast.error(errorMessage, {
                description: 'Kayıt Hatası',
                duration: 5000
            });

            // Validation hatalarını form alanlarına ekle
            if (errorDetails && typeof errorDetails === 'object') {
                Object.keys(errorDetails).forEach((key) => {
                    const fieldMap = {
                        'first_name': 'firstName',
                        'last_name': 'lastName',
                        'password_confirm': 'confirmPassword'
                    };
                    const mappedKey = fieldMap[key] || key;
                    if (registerErrors.value[mappedKey] !== undefined) {
                        const errorValue = errorDetails[key];
                        registerErrors.value[mappedKey] = Array.isArray(errorValue)
                            ? errorValue[0]
                            : errorValue;
                    }
                });
            }
        } else {
            toast.error(err?.message || 'Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.', {
                description: 'Hata',
                duration: 5000
            });
        }
    }
};

function generateStrongPassword() {
    const lower = 'abcdefghjkmnpqrstuvwxyz';
    const upper = 'ABCDEFGHJKMNPQRSTUVWXYZ';
    const numbers = '23456789';
    const symbols = '!@#$%&*';
    const all = lower + upper + numbers + symbols;
    let pwd = '';
    pwd += lower[Math.floor(Math.random() * lower.length)];
    pwd += upper[Math.floor(Math.random() * upper.length)];
    pwd += numbers[Math.floor(Math.random() * numbers.length)];
    pwd += symbols[Math.floor(Math.random() * symbols.length)];
    for (let i = 0; i < 8; i++) {
        pwd += all[Math.floor(Math.random() * all.length)];
    }
    return pwd.split('').sort(() => Math.random() - 0.5).join('');
}

/** Zar: yeni güçlü şifre üretir, alanlara yazar ve şifreyi gösterir (toast ile de gösterilir). */
function rollRegisterPassword() {
    const pwd = generateStrongPassword();
    registerForm.value.password = pwd;
    registerForm.value.confirmPassword = pwd;
    showRegisterPassword.value = true;
    toast.success('Yeni şifre oluşturuldu', {
        description: pwd,
        duration: 12000,
    });
}

const handleOtpBack = () => {
    registerOtpSent.value = false;
    otpCode.value = '';
    otpError.value = '';
    if (otpOpenedFromLogin.value) {
        isRegister.value = false;
        otpOpenedFromLogin.value = false;
    }
};

const handleResendOtp = async () => {
    if (!pendingRegisterEmail.value) return;
    resendOtpLoading.value = true;
    otpError.value = '';
    const result = await authStore.resendOtp(pendingRegisterEmail.value);
    resendOtpLoading.value = false;
    if (result.success) {
        toast.success(result.message || 'Kod gönderildi.', {
            description: 'SMS ve e-postanızı kontrol edin.',
            duration: 5000,
        });
        otpCode.value = '';
    } else {
        toast.error(result.error || 'Kod gönderilemedi.', { duration: 5000 });
    }
};

const handleVerifyOtp = async () => {
    otpError.value = '';
    const code = String(otpCode.value ?? '').trim();
    if (code.length !== 6) {
        otpError.value = 'Lütfen 6 haneli kodu girin.';
        return;
    }
    otpVerifyLoading.value = true;
    const result = await authStore.verifyOtp(pendingRegisterEmail.value, code);
    otpVerifyLoading.value = false;
    if (result.success) {
        toast.success(otpOpenedFromLogin.value ? 'Giriş başarılı!' : 'Kayıt tamamlandı.', {
            description: 'Başarılı',
            duration: 5000,
        });
        showLogin.value = false;
        registerOtpSent.value = false;
        otpOpenedFromLogin.value = false;
        pendingRegisterEmail.value = '';
        otpCode.value = '';
        redirectAfterLogin();
    } else {
        otpError.value = result.error || 'Kod hatalı.';
        toast.error(result.error || 'Doğrulama başarısız.', { description: 'Hata', duration: 5000 });
    }
};
</script>

<style scoped>
#phone {
    border-radius: 0.5rem;
    border: 1px solid #e0e0e0;
    padding: 0.5rem;
    padding-left: 3rem;
    font-size: 1rem;
    font-weight: 400;
    color: #333;
    background-color: transparent;
    width: 100%;
    height: 3rem;
}

#phone::placeholder {
    color: #999;
}

#phone2 {
    border-radius: 0.5rem;
    border: 1px solid #e0e0e0;
    padding: 0.5rem;
    padding-left: 1rem;
    font-size: 0.9rem;
    font-weight: 400;
    color: #333;
    background-color: white;
    width: 100%;
    height: 3rem;
}

#phone2::placeholder {
    color: #999;
}
</style>

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
