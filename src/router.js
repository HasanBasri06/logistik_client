import { createMemoryHistory, createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./stores/auth";
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
import AccountVerifyPage from "./pages/AccountVerifyPage.vue";
import CargoOwnerPage from "./pages/CargoOwnerPage.vue";
import CargoOwnerReviewsPage from "./pages/CargoOwnerReviewsPage.vue";
import CargoOwnerMessagesPage from "./pages/CargoOwnerMessagesPage.vue";
import CargoOwnerPostsPage from "./pages/CargoOwnerPostsPage.vue";
import CargoOwnerAddressesPage from "./pages/CargoOwnerAddressesPage.vue";
import CargoOwnerChangePasswordPage from "./pages/CargoOwnerChangePasswordPage.vue";
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

const routes = [
    {
        path: '/',
        component: Home,
        meta: {
            layout: Layout,
            title: 'TaşıBul | Anasayfa'
        }
    },
    {
        path: '/panel',
        component: HomePanel,
        meta: {
            title: 'Araç Bul | TaşıBul',
            requiresAuth: true
        }
    },
    {
        path: '/help',
        component: Help,
        meta: {
            layout: Layout,
            title: 'Yardım | TaşıBul',
            requiresAuth: false
        }
    },
    {
        path: '/hakkimizda',
        component: AboutPage,
        meta: {
            layout: Layout,
            title: 'Hakkımızda | TaşıBul',
            requiresAuth: false
        }
    },
    {
        path: '/fiyatlandirma',
        component: Pricing,
        meta: {
            layout: Layout,
            title: 'Fiyatlandırma | TaşıBul',
            requiresAuth: false
        }
    },
    {
        path: '/mesafeli-satis-sozlesmesi',
        component: MesafeliSatisSozlesmesiPage,
        meta: {
            layout: Layout,
            title: 'Mesafeli Satış Sözleşmesi | TaşıBul',
            requiresAuth: false
        }
    },
    {
        path: '/gizlilik-sozlesmesi',
        component: GizlilikSozlesmesiPage,
        meta: {
            layout: Layout,
            title: 'Gizlilik Sözleşmesi | TaşıBul',
            requiresAuth: false
        }
    },
    {
        path: '/uyelik-sozlesmesi',
        component: UyelikSozlesmesiPage,
        meta: {
            layout: Layout,
            title: 'Üyelik Sözleşmesi | TaşıBul',
            requiresAuth: false
        }
    },
    {
        path: '/kvkk',
        component: KvkkPage,
        meta: {
            layout: Layout,
            title: 'KVKK Aydınlatma Metni | TaşıBul',
            requiresAuth: false
        }
    },
    {
        path: '/iptal-ve-iade-kosullari',
        component: IptalVeIadeKosullariPage,
        meta: {
            layout: Layout,
            title: 'İptal ve İade Koşulları | TaşıBul',
            requiresAuth: false
        }
    },
    {
        path: '/vehicle-owner/orders',
        component: AccountOrdersPage,
        meta: {
            layout: Layout,
            title: 'Tüm Siparişlerim | TaşıBul',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/reviews',
        component: AccountReviewsPage,
        meta: {
            layout: Layout,
            title: 'Değerlendirmelerim | TaşıBul',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/messages',
        component: AccountMessagesPage,
        meta: {
            layout: Layout,
            title: 'Yük Sahibi Mesajları | TaşıBul',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/messages/:id',
        component: AccountMessagesPage,
        meta: {
            layout: Layout,
            title: 'Mesaj Detayı | TaşıBul',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/vehicles',
        component: AccountVehiclesPage,
        meta: {
            layout: Layout,
            title: 'Tüm Araçlarım | TaşıBul',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/change-password',
        component: AccountChangePasswordPage,
        meta: {
            layout: Layout,
            title: 'Şifre Değiştir | TaşıBul',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/verify',
        component: AccountVerifyPage,
        meta: {
            layout: Layout,
            title: 'Hesap Doğrula | TaşıBul',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/cargo-owner',
        component: CargoOwnerPage,
        meta: {
            layout: Layout,
            title: 'Yük Sahibi | TaşıBul',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/reviews',
        component: CargoOwnerReviewsPage,
        meta: {
            layout: Layout,
            title: 'Değerlendirmelerim | TaşıBul',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/messages',
        component: CargoOwnerMessagesPage,
        meta: {
            layout: Layout,
            title: 'Araç Sahibi Mesajları | TaşıBul',
            requiresAuth: true
        }
    },
    {
        path: '/cargo-owner/messages/:id',
        component: CargoOwnerMessagesPage,
        meta: {
            layout: Layout,
            title: 'Mesaj Detayı | TaşıBul',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/posts',
        component: CargoOwnerPostsPage,
        meta: {
            layout: Layout,
            title: 'İlanlarım | TaşıBul',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
        {
        path: '/cargo-owner/posts/create',
        component: CreatePostPage,
        meta: {
            layout: Layout,
            title: 'İlan Oluştur | TaşıBul',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/addresses',
        component: CargoOwnerAddressesPage,
        meta: {
            layout: Layout,
            title: 'Adreslerim | TaşıBul',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/change-password',
        component: CargoOwnerChangePasswordPage,
        meta: {
            layout: Layout,
            title: 'Şifre Değiştir | TaşıBul',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/verify',
        component: CargoOwnerVerifyAccountPage,
        meta: {
            layout: Layout,
            title: 'Hesap Doğrula | TaşıBul',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/vehicle-owner',
        component: Account,
        meta: {
            layout: Layout,
            title: 'Hesabım | TaşıBul',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        },
    },
    {
        path: '/posts/:slug',
        component: PostDetail,
        meta: {
            title: 'İlan Detayı | TaşıBul',
            requiresAuth: true
        }
    },
    {
        path: '/product/:slug',
        component: ProductDetailPage,
        meta: {
            layout: Layout,
            title: 'İlan Detayı | TaşıBul',
            requiresAuth: true
        }
    },
    {
        path: '/blog',
        component: BlogPage,
        meta: {
            layout: Layout,
            title: 'Blog | TaşıBul',
            requiresAuth: false
        }
    },
    {
        path: '/blog/:slug',
        component: BlogDetailPage,
        meta: {
            layout: Layout,
            title: 'Blog | TaşıBul',
            requiresAuth: false
        }
    },
    {
        path: '/odeme/basarili',
        component: PaytrPaymentOkPage,
        meta: {
            layout: Layout,
            title: 'Ödeme | TaşıBul',
            requiresAuth: false
        }
    },
    {
        path: '/odeme/hata',
        component: PaytrPaymentFailPage,
        meta: {
            layout: Layout,
            title: 'Ödeme | TaşıBul',
            requiresAuth: false
        }
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound,
        name: 'not-found',
        meta: {
            layout: Layout,
            title: '404 - Sayfa Bulunamadı | TaşıBul',
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
    const token = localStorage.getItem('token')
    
    // Anasayfa hariç tüm route'lar için auth kontrolü
    if (to.path !== '/' && to.meta.requiresAuth !== false) {
        // Token yoksa anasayfaya yönlendir
        if (!token) {
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
    
    // Eğer kullanıcı authenticated ise ve anasayfaya gitmeye çalışıyorsa /panel'e yönlendir
    if (token && to.path === '/') {
        const isValid = await authStore.checkToken()
        if (isValid) {
            const pending = sessionStorage.getItem('pendingSearch')
            if (pending) {
                sessionStorage.removeItem('pendingSearch')
                next({ path: '/panel', query: JSON.parse(pending) })
            } else {
                next('/panel')
            }
            return
        }
    }

    if (token && to.meta.authorization && to.meta.authorization !== authStore.user?.type) {
        next('/')
        return
    }

    // İlan detayına giriş: payment_confirm 0/false ise /panel'e at ve Premium modalı göster
    if (
        token &&
        (to.path.startsWith('/posts/') || to.path.startsWith('/product/')) &&
        (authStore.user?.payment_confirm === 0 || authStore.user?.payment_confirm === false)
    ) {
        authStore.showPremiumModal = true
        next('/panel')
        return
    }

    next()
})