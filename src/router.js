import { createMemoryHistory, createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useAdminStore } from "./stores/admin";
import Home from "./Home.vue";
import Layout from "./Layout.vue";
import HomePanel from "./panel/Home.vue";
import Help from "./Help.vue";
import Pricing from "./Pricing.vue";
import AboutPage from "./pages/AboutPage.vue";
import Account from "./Account.vue";
import AccountOrdersPage from "./pages/AccountOrdersPage.vue";
import AccountReviewsPage from "./pages/AccountReviewsPage.vue";
import AccountMessagesPage from "./pages/AccountMessagesPage.vue";
import AccountVehiclesPage from "./pages/AccountVehiclesPage.vue";
import AccountChangePasswordPage from "./pages/AccountChangePasswordPage.vue";
import VehicleOwnerSettingsPage from "./pages/VehicleOwnerSettingsPage.vue";
import AccountVerifyPage from "./pages/AccountVerifyPage.vue";
import CargoOwnerPage from "./pages/CargoOwnerPage.vue";
import CargoOwnerReviewsPage from "./pages/CargoOwnerReviewsPage.vue";
import CargoOwnerMessagesPage from "./pages/CargoOwnerMessagesPage.vue";
import CargoOwnerPostsPage from "./pages/CargoOwnerPostsPage.vue";
import CargoOwnerAddressesPage from "./pages/CargoOwnerAddressesPage.vue";
import CargoOwnerChangePasswordPage from "./pages/CargoOwnerChangePasswordPage.vue";
import CargoOwnerSettingsPage from "./pages/CargoOwnerSettingsPage.vue";
import CargoOwnerVerifyAccountPage from "./pages/CargoOwnerVerifyAccountPage.vue";
import PostDetail from "./posts/Detail.vue";
import ProductDetailPage from "./pages/ProductDetailPage.vue";
import NotFound from "./pages/NotFound.vue";
import CreatePostPage from "./pages/CreatePostPage.vue";
import BlogPage from "./pages/BlogPage.vue";
import BlogDetailPage from "./pages/BlogDetailPage.vue";
import MesafeliSatisSozlesmesiPage from "./pages/MesafeliSatisSozlesmesiPage.vue";
import GizlilikSozlesmesiPage from "./pages/GizlilikSozlesmesiPage.vue";
import UyelikSozlesmesiPage from "./pages/UyelikSozlesmesiPage.vue";
import KvkkPage from "./pages/KvkkPage.vue";
import IptalVeIadeKosullariPage from "./pages/IptalVeIadeKosullariPage.vue";
import PaytrPaymentOkPage from "./pages/PaytrPaymentOkPage.vue";
import PaytrPaymentFailPage from "./pages/PaytrPaymentFailPage.vue";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.vue";
import BeunAdminPage from "./panel/admin/Beun.vue";
import AdminLayout from "./panel/admin/AdminLayout.vue";
import BeunAdminMainPage from "./panel/admin/BeunMain.vue";
import AdminAddUserPage from "./panel/admin/AdminAddUser.vue";
import AdminAddListingPage from "./panel/admin/AdminAddListing.vue";
import AdminUserDocumentsPage from "./panel/admin/AdminUserDocuments.vue";
import AdminAllUsersPage from "./panel/admin/AdminAllUsers.vue";
import AdminAllListingsPage from "./panel/admin/AdminAllListings.vue";
import AdminSearchAnalysisPage from "./panel/admin/AdminSearchAnalysis.vue";
import AdminSettingsCarsPage from "./panel/admin/AdminSettingsCars.vue";
import AdminSettingsCitiesPage from "./panel/admin/AdminSettingsCities.vue";
import AdminSettingsPostTypesPage from "./panel/admin/AdminSettingsPostTypes.vue";

const routes = [
    {
        path: '/',
        component: Home,
        meta: {
            layout: Layout,
            title: 'Anasayfa'
        }
    },
    {
        path: '/panel',
        component: HomePanel,
        meta: {
            title: 'Araç Bul',
            requiresAuth: true
        }
    },
    {
        path: '/help',
        component: Help,
        meta: {
            layout: Layout,
            title: 'Yardım',
            requiresAuth: false
        }
    },
    {
        path: '/hakkimizda',
        component: AboutPage,
        meta: {
            layout: Layout,
            title: 'Hakkımızda',
            requiresAuth: false
        }
    },
    {
        path: '/fiyatlandirma',
        component: Pricing,
        meta: {
            layout: Layout,
            title: 'Fiyatlandırma',
            requiresAuth: false
        }
    },
    {
        path: '/mesafeli-satis-sozlesmesi',
        component: MesafeliSatisSozlesmesiPage,
        meta: {
            layout: Layout,
            title: 'Mesafeli Satış Sözleşmesi',
            requiresAuth: false
        }
    },
    {
        path: '/gizlilik-sozlesmesi',
        component: GizlilikSozlesmesiPage,
        meta: {
            layout: Layout,
            title: 'Gizlilik Sözleşmesi',
            requiresAuth: false
        }
    },
    {
        path: '/uyelik-sozlesmesi',
        component: UyelikSozlesmesiPage,
        meta: {
            layout: Layout,
            title: 'Üyelik Sözleşmesi',
            requiresAuth: false
        }
    },
    {
        path: '/kvkk',
        component: KvkkPage,
        meta: {
            layout: Layout,
            title: 'KVKK Aydınlatma Metni',
            requiresAuth: false
        }
    },
    {
        path: '/iptal-ve-iade-kosullari',
        component: IptalVeIadeKosullariPage,
        meta: {
            layout: Layout,
            title: 'İptal ve İade Koşulları',
            requiresAuth: false
        }
    },
    {
        path: '/vehicle-owner/orders',
        component: AccountOrdersPage,
        meta: {
            layout: Layout,
            title: 'Tüm İşlerim',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/reviews',
        component: AccountReviewsPage,
        meta: {
            layout: Layout,
            title: 'Değerlendirmelerim',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/messages',
        component: AccountMessagesPage,
        meta: {
            layout: Layout,
            title: 'Yük Sahibi Mesajları',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/messages/:id',
        component: AccountMessagesPage,
        meta: {
            layout: Layout,
            title: 'Mesaj Detayı',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/vehicles',
        component: AccountVehiclesPage,
        meta: {
            layout: Layout,
            title: 'Tüm Araçlarım',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/settings',
        component: VehicleOwnerSettingsPage,
        meta: {
            layout: Layout,
            title: 'Ayarlar',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/change-password',
        component: AccountChangePasswordPage,
        meta: {
            layout: Layout,
            title: 'Şifre Değiştir',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/verify',
        component: AccountVerifyPage,
        meta: {
            layout: Layout,
            title: 'Hesap Doğrula',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/cargo-owner',
        component: CargoOwnerPage,
        meta: {
            layout: Layout,
            title: 'Yük Sahibi',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/reviews',
        component: CargoOwnerReviewsPage,
        meta: {
            layout: Layout,
            title: 'Değerlendirmelerim',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/messages',
        component: CargoOwnerMessagesPage,
        meta: {
            layout: Layout,
            title: 'Araç Sahibi Mesajları',
            requiresAuth: true
        }
    },
    {
        path: '/cargo-owner/messages/:id',
        component: CargoOwnerMessagesPage,
        meta: {
            layout: Layout,
            title: 'Mesaj Detayı',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/posts',
        component: CargoOwnerPostsPage,
        meta: {
            layout: Layout,
            title: 'İlanlarım',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
        {
        path: '/cargo-owner/posts/create',
        component: CreatePostPage,
        meta: {
            layout: Layout,
            title: 'İlan Oluştur',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/addresses',
        component: CargoOwnerAddressesPage,
        meta: {
            layout: Layout,
            title: 'Adreslerim',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/settings',
        component: CargoOwnerSettingsPage,
        meta: {
            layout: Layout,
            title: 'Ayarlar',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/change-password',
        component: CargoOwnerChangePasswordPage,
        meta: {
            layout: Layout,
            title: 'Şifre Değiştir',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/verify',
        component: CargoOwnerVerifyAccountPage,
        meta: {
            layout: Layout,
            title: 'Hesap Doğrula',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/vehicle-owner',
        component: Account,
        meta: {
            layout: Layout,
            title: 'Hesabım',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        },
    },
    {
        path: '/posts/:slug',
        component: PostDetail,
        meta: {
            title: 'İlan Detayı',
            requiresAuth: true
        }
    },
    {
        path: '/product/:slug',
        component: ProductDetailPage,
        meta: {
            layout: Layout,
            title: 'İlan Detayı',
            requiresAuth: true
        }
    },
    {
        path: '/blog',
        component: BlogPage,
        meta: {
            layout: Layout,
            title: 'Blog',
            requiresAuth: false
        }
    },
    {
        path: '/blog/:slug',
        component: BlogDetailPage,
        meta: {
            layout: Layout,
            title: 'Blog',
            requiresAuth: false
        }
    },
    {
        path: '/odeme/basarili',
        component: PaytrPaymentOkPage,
        meta: {
            layout: Layout,
            title: 'Ödeme',
            requiresAuth: false
        }
    },
    {
        path: '/odeme/hata',
        component: PaytrPaymentFailPage,
        meta: {
            layout: Layout,
            title: 'Ödeme',
            requiresAuth: false
        }
    },
    {
        path: '/sifremi-unuttum',
        component: ForgotPasswordPage,
        meta: {
            title: 'Şifremi Unuttum',
            requiresAuth: false
        }
    },
    {
        path: '/panel/admin/beun',
        component: BeunAdminPage,
        meta: {
            title: 'Admin Giriş',
            requiresAuth: false,
            isAdminLogin: true,
        },
    },
    {
        path: '/panel/admin/beun',
        component: AdminLayout,
        meta: {
            requiresAdminAuth: true,
        },
        children: [
            {
                path: 'main',
                component: BeunAdminMainPage,
                meta: {
                    title: 'Admin Panel',
                    requiresAdminAuth: true,
                },
            },
            {
                path: 'kullanici-ekle',
                component: AdminAddUserPage,
                meta: {
                    title: 'Kullanıcı Ekle',
                    requiresAdminAuth: true,
                },
            },
            {
                path: 'ilan-ekle',
                component: AdminAddListingPage,
                meta: {
                    title: 'İlan Ekle',
                    requiresAdminAuth: true,
                },
            },
            {
                path: 'ilanlar',
                component: AdminAllListingsPage,
                meta: {
                    title: 'Tüm İlanlarım',
                    requiresAdminAuth: true,
                },
            },
            {
                path: 'arama-analizleri',
                component: AdminSearchAnalysisPage,
                meta: {
                    title: 'Arama Analizleri',
                    requiresAdminAuth: true,
                },
            },
            {
                path: 'evraklar',
                component: AdminUserDocumentsPage,
                meta: {
                    title: 'Kullanıcı Evrakları',
                    requiresAdminAuth: true,
                },
            },
            {
                path: 'kullanicilar',
                component: AdminAllUsersPage,
                meta: {
                    title: 'Kullanıcılarımız',
                    requiresAdminAuth: true,
                },
            },
            {
                path: 'ayarlar/araclar',
                component: AdminSettingsCarsPage,
                meta: {
                    title: 'Araçlar',
                    requiresAdminAuth: true,
                },
            },
            {
                path: 'ayarlar/sehirler',
                component: AdminSettingsCitiesPage,
                meta: {
                    title: 'Şehirler',
                    requiresAdminAuth: true,
                },
            },
            {
                path: 'ayarlar/yuk-tipleri',
                component: AdminSettingsPostTypesPage,
                meta: {
                    title: 'Yük Tipleri',
                    requiresAdminAuth: true,
                },
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound,
        name: 'not-found',
        meta: {
            layout: Layout,
            title: '404 - Sayfa Bulunamadı',
            requiresAuth: false
        }
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0, behavior: 'smooth' }
    }
})

// Router guard: Auth kontrolü ve yönlendirmeler
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const adminStore = useAdminStore()
    const userToken = localStorage.getItem('token')
    const adminToken = localStorage.getItem('admin_token')

    const requiresAdminAuth = to.matched.some((record) => record.meta.requiresAdminAuth)

    if (requiresAdminAuth) {
        if (!adminToken) {
            next('/panel/admin/beun')
            return
        }

        const isValidAdmin = await adminStore.checkToken()
        if (!isValidAdmin) {
            next('/panel/admin/beun')
            return
        }

        next()
        return
    }

    if (to.path === '/panel/admin/beun' || to.meta.isAdminLogin) {
        if (adminToken) {
            const isValidAdmin = await adminStore.checkToken()
            if (isValidAdmin) {
                next('/panel/admin/beun/main')
                return
            }
            adminStore.logout()
        }
        next()
        return
    }

    if (to.path.startsWith('/panel/admin')) {
        next()
        return
    }
    
    // Anasayfa hariç tüm route'lar için auth kontrolü
    if (to.path !== '/' && to.meta.requiresAuth !== false) {
        // Token yoksa anasayfaya yönlendir
        if (!userToken) {
            next({
                path: '/',
                query: {
                    ...to.query,
                    ...(to.query?.via === 'whatsapp' ? { via: 'whatsapp' } : {}),
                },
            })
            return
        }

        // Token varsa geçerliliğini kontrol et
        const isValid = await authStore.checkToken()
        if (!isValid) {
            // Token geçersiz, anasayfaya yönlendir
            next('/')
            return
        }
    }
    
    // Eğer kullanıcı authenticated ise giriş/kayıt sayfalarına gitmesin → /panel
    const guestOnlyPaths = ['/', '/sifremi-unuttum']
    if (userToken && guestOnlyPaths.includes(to.path)) {
        const isValid = await authStore.checkToken()
        if (isValid) {
            const pending = sessionStorage.getItem('pendingSearch')
            if (to.path === '/' && pending) {
                sessionStorage.removeItem('pendingSearch')
                next({ path: '/panel', query: JSON.parse(pending) })
            } else {
                next('/panel')
            }
            return
        }
    }

    if (userToken && to.meta.authorization && to.meta.authorization !== authStore.user?.type) {
        next('/')
        return
    }

    // İlan detayına giriş: payment_confirm 0/false ise /panel'e at ve Premium modalı göster
    if (
        userToken &&
        (to.path.startsWith('/posts/') || to.path.startsWith('/product/')) &&
        (authStore.user?.payment_confirm === 0 || authStore.user?.payment_confirm === false)
    ) {
        authStore.showPremiumModal = true
        next('/panel')
        return
    }

    next()
})