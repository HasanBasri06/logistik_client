<template>
    <header class="w-full h-16 bg-white shadow-sm relative z-10">
        <Content class="flex items-center justify-between h-full">
            <!-- Logo (Sol) -->
            <RouterLink to="/" class="flex items-center gap-2">
                <img
                    src="@/assets/images/logo.png"
                    alt="TaşıBul Logo"
                    class="h-7 w-auto object-contain"
                />
            </RouterLink>

            <!-- Sağ taraf: dil / yardım / user -->
            <ul class="flex items-center gap-6 text-sm font-medium">
                <li class="hidden md:block">
                    TRY
                </li>
                <li class="hidden md:block">
                    <router-link to="/help" class="hover:text-primary transition-colors">
                        Yardım
                    </router-link>
                </li>
                <li v-if="!authStore.isAuthenticated">
                    <button
                        type="button"
                        @click="handleLoginClick"
                        class="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
                    >
                        <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                            <!-- Basit user icon (SVG) -->
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                class="h-4 w-4 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.8"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
                                <path d="M4 20a8 8 0 0 1 16 0" />
                            </svg>
                        </span>
                        <span>Giriş Yap</span>
                    </button>
                </li>
                <li v-else class="relative" data-account-dropdown>
                    <button
                        type="button"
                        @click.stop="accountDropdownOpen = !accountDropdownOpen"
                        class="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
                    >
                        <span>Hesabım</span>
                        <svg 
                            :class="{ 'rotate-180': accountDropdownOpen }"
                            class="transition-transform duration-300 w-4 h-4 text-gray-600"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <!-- Dropdown Menu -->
                    <div 
                        v-if="accountDropdownOpen"
                        class="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
                    >
                        <button
                            @click="handleGotoAccountClick"
                            class="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 w-full transition-colors"
                        >
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Hesaba Git</span>
                            </div>
                        </button>
                        <div class="border-t border-gray-200"></div>
                        <button
                            type="button"
                            @click="handleLogout"
                            class="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Güvenli Çıkış Yap</span>
                            </div>
                        </button>
                    </div>
                </li>
            </ul>
        </Content>
    </header>

    <!-- Giriş / Kayıt Modal (Custom Overlay) -->
    <div
        v-if="showLogin"
        class="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-[1px]"
        @click.self="showLogin = false"
    >
        <div class="w-[90%] max-w-[1300px] h-[80vh] bg-white shadow-2xl rounded-md p-4 overflow-hidden">
            <div class="flex flex-col md:flex-row h-full">
                <!-- Sol: Wallpaper -->
                <div class="hidden md:block md:w-[50%] bg-white relative overflow-hidden p-16">
                    <div class="w-full h-full flex items-center justify-center">
                        <img 
                            :src="loginWallpaper" 
                            alt="Login Wallpaper"
                            class="w-full object-cover object-center"
                        />

                    </div>
                </div>

                <!-- Sağ: Form -->
                <div class="w-full md:w-[50%] p-8 md:p-12 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                                TaşıBul Hesabın
                            </p>
                            <h3 class="text-2xl md:text-3xl font-bold text-gray-900">
                                {{ isRegister ? 'Kayıt Ol' : 'Giriş Yap' }}
                            </h3>
                            <p class="text-sm text-gray-500 mt-2">
                                {{ isRegister ? 'Hesabını oluştur ve hemen başla' : 'Hesabına giriş yap' }}
                            </p>
                        </div>
                        <button
                            type="button"
                            class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200"
                            @click="showLogin = false"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form class="flex flex-col gap-5" @submit.prevent="isRegister ? handleRegisterSubmit() : handleLoginSubmit()">
                        <template v-if="!isRegister">
                            <div class="relative flex flex-col gap-6 w-full">
                                <div
                                    v-if="loginLoading"
                                    class="absolute inset-0 z-10 flex items-center justify-center bg-white/80 rounded-lg"
                                >
                                    <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label class="text-sm font-semibold text-gray-700 flex items-center justify-start gap-2">
                                        Telefon Numarası
                                        <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </label>
                                    <div class="relative">
                                        
                                        <InputMask 
                                            mask="999 999 99 99" 
                                            placeholder="5XX XXX XX XX"
                                            v-model="loginForm.phone"
                                            id="phone"
                                            :class="[
                                                'w-full h-12 px-4 pl-12 text-left border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200',
                                                loginErrors.phone 
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                                                    : 'border-gray-200 focus:border-primary'
                                            ]" />
                                        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span v-if="loginErrors.phone" class="text-xs text-red-500 font-medium flex items-center justify-start gap-1">
                                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                        </svg>
                                        {{ loginErrors.phone }}
                                    </span>
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label class="text-sm font-semibold text-gray-700 flex items-center justify-start gap-2">
                                        Şifre
                                        <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </label>
                                    <div class="relative">
                                        <input
                                            :type="showLoginPassword ? 'text' : 'password'"
                                            v-model="loginForm.password"
                                            :class="[
                                                'w-full h-12 px-4 pl-12 pr-12 text-left border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200',
                                                loginErrors.password 
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                                                    : 'border-gray-200 focus:border-primary'
                                            ]"
                                            placeholder="Şifrenizi girin"
                                        />
                                        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <button
                                            type="button"
                                            @click="showLoginPassword = !showLoginPassword"
                                            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <i :class="showLoginPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" style="font-size: 18px;"></i>
                                        </button>
                                    </div>
                                    <span v-if="loginErrors.password" class="text-xs text-red-500 font-medium flex items-center justify-start gap-1">
                                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                        </svg>
                                        {{ loginErrors.password }}
                                    </span>
                                </div>
                                <div class="flex justify-start -mt-2">
                                    <button type="button" class="text-sm text-gray-600 hover:text-primary font-medium transition-colors">
                                        Şifremi Unuttum
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    :disabled="loginLoading"
                                    :class="[
                                        'w-full h-12 font-semibold rounded-lg transition-all duration-200 shadow-lg text-base',
                                        loginLoading
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary/90 hover:shadow-xl transform hover:-translate-y-0.5'
                                    ]"
                                >
                                    <span v-if="loginLoading">Giriş yapılıyor...</span>
                                    <span v-else>Giriş Yap</span>
                                </button>
                                <div class="flex items-center gap-3 my-2">
                                    <div class="flex-1 h-px bg-gray-200"></div>
                                    <span class="text-xs text-gray-500 font-medium">veya</span>
                                    <div class="flex-1 h-px bg-gray-200"></div>
                                </div>
                                <div class="flex items-center justify-center gap-4">
                                    <button
                                        type="button"
                                        @click="handleGoogleLogin"
                                        class="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                                        title="Google ile Giriş Yap"
                                    >
                                        <svg class="w-6 h-6" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        @click="handleFacebookLogin"
                                        class="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                                        title="Facebook ile Giriş Yap"
                                    >
                                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </button>
                                </div>
                                <p class="text-sm text-center text-gray-600">
                                    Hesabın yok mu?
                                    <button
                                        type="button"
                                        class="text-primary font-semibold hover:underline ml-1"
                                        @click="openRegister"
                                    >
                                        Kayıt ol
                                    </button>
                                </p>
                            </div>
                        </template>

                        <template v-else>
                            <!-- Kullanıcı Türü Seçimi -->
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium text-gray-700 mb-2">Kullanıcı Türü</label>
                                <div class="flex gap-3">
                                    <button
                                        type="button"
                                        @click="registerForm.userType = 'cargo_owner'"
                                        :class="[
                                            'flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium text-sm',
                                            registerForm.userType === 'cargo_owner'
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'
                                        ]"
                                    >
                                        Yük Sahibi
                                    </button>
                                    <button
                                        type="button"
                                        @click="registerForm.userType = 'vehicle_owner'"
                                        :class="[
                                            'flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium text-sm',
                                            registerForm.userType === 'vehicle_owner'
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'
                                        ]"
                                    >
                                        Araç Sahibi
                                    </button>
                                </div>
                                <span v-if="registerErrors.userType" class="text-xs text-red-500 mt-0.5">
                                    {{ registerErrors.userType }}
                                </span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium text-gray-700">İsim</label>
                                <input
                                    type="text"
                                    v-model="registerForm.firstName"
                                    :class="['input', registerErrors.firstName ? 'border-red-400' : '']"
                                    placeholder="İsminiz"
                                />
                                <span v-if="registerErrors.firstName" class="text-xs text-red-500 mt-0.5">
                                    {{ registerErrors.firstName }}
                                </span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium text-gray-700">Soyisim</label>
                                <input
                                    type="text"
                                    v-model="registerForm.lastName"
                                    :class="['input', registerErrors.lastName ? 'border-red-400' : '']"
                                    placeholder="Soyisminiz"
                                />
                                <span v-if="registerErrors.lastName" class="text-xs text-red-500 mt-0.5">
                                    {{ registerErrors.lastName }}
                                </span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium text-gray-700">E-posta</label>
                                <input
                                    type="email"
                                    v-model="registerForm.email"
                                    :class="['input', registerErrors.email ? 'border-red-400' : '']"
                                    placeholder="ornek@mail.com"
                                />
                                <span v-if="registerErrors.email" class="text-xs text-red-500 mt-0.5">
                                    {{ registerErrors.email }}
                                </span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium text-gray-700">Telefon Numarası</label>
                                

                                <InputMask 
                                            mask="999 999 99 99" 
                                            placeholder="5XX XXX XX XX"
                                            v-model="registerForm.phone"
                                            id="phone2"
                                            :class="[
                                                'w-full h-12 px-4 pl-12 text-left border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200',
                                                loginErrors.phone 
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                                                    : 'border-gray-200 focus:border-primary'
                                            ]" />
                                <span v-if="registerErrors.phone" class="text-xs text-red-500 mt-0.5">
                                    {{ registerErrors.phone }}
                                </span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium text-gray-700">Şifre</label>
                                <div class="relative">
                                    <input
                                        :type="showRegisterPassword ? 'text' : 'password'"
                                        v-model="registerForm.password"
                                        :class="['input pr-12', registerErrors.password ? 'border-red-400' : '']"
                                        placeholder="Şifrenizi oluşturun"
                                    />
                                    <button
                                        type="button"
                                        @click="showRegisterPassword = !showRegisterPassword"
                                        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <i :class="showRegisterPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" style="font-size: 18px;"></i>
                                    </button>
                                </div>
                                <span v-if="registerErrors.password" class="text-xs text-red-500 mt-0.5">
                                    {{ registerErrors.password }}
                                </span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium text-gray-700">Şifre Tekrar</label>
                                <div class="relative">
                                    <input
                                        :type="showRegisterConfirmPassword ? 'text' : 'password'"
                                        v-model="registerForm.confirmPassword"
                                        :class="['input pr-12', registerErrors.confirmPassword ? 'border-red-400' : '']"
                                        placeholder="Şifrenizi tekrar girin"
                                    />
                                    <button
                                        type="button"
                                        @click="showRegisterConfirmPassword = !showRegisterConfirmPassword"
                                        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <i :class="showRegisterConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" style="font-size: 18px;"></i>
                                    </button>
                                </div>
                                <span v-if="registerErrors.confirmPassword" class="text-xs text-red-500 mt-0.5">
                                    {{ registerErrors.confirmPassword }}
                                </span>
                            </div>
                            <button
                                type="submit"
                                class="w-full h-11 bg-primary text-white font-semibold rounded-md hover:opacity-90 transition-opacity text-sm mt-2"
                            >
                                Kayıt Ol
                            </button>
                            <p class="text-xs text-center text-gray-500">
                                Zaten hesabın var mı?
                                <button
                                    type="button"
                                    class="text-primary font-medium cursor-pointer"
                                    @click="openLogin"
                                >
                                    Giriş yap
                                </button>
                            </p>
                        </template>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';
import Content from './Content.vue';
import loginWallpaper from '@/assets/images/login_wallpaper.gif';
import { InputMask } from 'primevue';

const authStore = useAuthStore();
const router = useRouter();

const showLogin = ref(false);
const isRegister = ref(false);
const accountDropdownOpen = ref(false);

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

const handleLogout = () => {
    accountDropdownOpen.value = false;
    authStore.logout();
    toast.success('Güvenli bir şekilde çıkış yaptınız.', { description: 'Çıkış Yapıldı', duration: 3000 });
};

const handleGoogleLogin = () => {
    // Google ile giriş yapma işlemi buraya eklenecek
    console.log('Google ile giriş yapılıyor...');
    toast.info('Google ile giriş özelliği yakında eklenecek.', { description: 'Google Girişi', duration: 3000 });
};

const handleFacebookLogin = () => {
    // Facebook ile giriş yapma işlemi buraya eklenecek
    console.log('Facebook ile giriş yapılıyor...');
    toast.info('Facebook ile giriş özelliği yakında eklenecek.', { description: 'Facebook Girişi', duration: 3000 });
};

// Click outside handler for dropdown
const handleClickOutside = (event) => {
    if (accountDropdownOpen.value && !event.target.closest('[data-account-dropdown]')) {
        accountDropdownOpen.value = false;
    }
};

const handleOpenLoginEvent = () => openLogin();

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('open-login', handleOpenLoginEvent);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('open-login', handleOpenLoginEvent);
});

const handleGotoAccountClick = () => {
    accountDropdownOpen.value = false
        if (authStore.user.type === 'cargo_owner') {
        router.push('/cargo-owner');
    } else {
        router.push('/vehicle-owner');
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
            toast.success('Giriş başarılı!', { description: 'Başarılı', duration: 3000 });
            showLogin.value = false;
            loginForm.value = { phone: "", password: "" };
            router.push('/panel');
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
                duration: 4000 
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
                    duration: 3000 
                });
            }
        } 
        // Axios hataları (store'dan geçmeyen durumlar)
        else if (err.response && err.response.data) {
            const errorMessage = err.response?.data?.message || 'Bir hata oluştu';
            const errorDetails = err.response?.data?.error || err.response?.data?.errors;
            
            toast.error(errorMessage, { 
                description: 'Hata', 
                duration: 4000 
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
                duration: 3000 
            });
        }
    } finally {
        loginLoading.value = false;
    }
};

const handleRegisterSubmit = async () => {
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
        
        const result = await authStore.register({
            first_name: registerForm.value.firstName,
            last_name: registerForm.value.lastName,
            email: registerForm.value.email,
            phone: registerForm.value.phone.replace(/\s/g, ''),
            password: registerForm.value.password,
            password_confirm: registerForm.value.confirmPassword,
            type: registerForm.value.userType
        });
        
        if (result.success) {
            toast.success('Başarılı bir şekilde kayıt oldunuz', { 
                description: 'Başarılı', 
                duration: 3000 
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
            router.push('/panel');
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
                duration: 4000 
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
    } catch (err) {
        // Yup validation hataları
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
                    duration: 3000 
                });
            }
        } 
        // Axios hataları (store'dan geçmeyen durumlar)
        else if (err.response && err.response.data) {
            const errorMessage = err.response?.data?.message || 'Bir hata oluştu';
            const errorDetails = err.response?.data?.error || err.response?.data?.errors;
            
            toast.error(errorMessage, { 
                description: 'Kayıt Hatası', 
                duration: 4000 
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
                duration: 3000 
            });
        }
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
