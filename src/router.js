import { createMemoryHistory, createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./stores/auth";
import Home from "./Home.vue";
import Layout from "./Layout.vue";
import HomePanel from "./panel/Home.vue";
import Help from "./Help.vue";
import Account from "./Account.vue";
import AccountOrdersPage from "./pages/AccountOrdersPage.vue";
import AccountReviewsPage from "./pages/AccountReviewsPage.vue";
import AccountMessagesPage from "./pages/AccountMessagesPage.vue";
import AccountVehiclesPage from "./pages/AccountVehiclesPage.vue";
import AccountChangePasswordPage from "./pages/AccountChangePasswordPage.vue";
import AccountVerifyPage from "./pages/AccountVerifyPage.vue";
import AccountCardsPage from "./pages/AccountCardsPage.vue";
import AccountAddressesPage from "./pages/AccountAddressesPage.vue";
import CargoOwnerPage from "./pages/CargoOwnerPage.vue";
import CargoOwnerReviewsPage from "./pages/CargoOwnerReviewsPage.vue";
import CargoOwnerMessagesPage from "./pages/CargoOwnerMessagesPage.vue";
import CargoOwnerPostsPage from "./pages/CargoOwnerPostsPage.vue";
import CargoOwnerAddressesPage from "./pages/CargoOwnerAddressesPage.vue";
import CargoOwnerChangePasswordPage from "./pages/CargoOwnerChangePasswordPage.vue";
import CargoOwnerVerifyPage from "./pages/CargoOwnerVerifyPage.vue";
import CargoOwnerCardsPage from "./pages/CargoOwnerCardsPage.vue";
import PostDetail from "./posts/Detail.vue";
import NotFound from "./pages/NotFound.vue";
import CreatePostPage from "./pages/CreatePostPage.vue";

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
            requiresAuth: true
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
        path: '/vehicle-owner/cards',
        component: AccountCardsPage,
        meta: {
            layout: Layout,
            title: 'Kayıtlı Kartlarım | TaşıBul',
            requiresAuth: true,
            authorization: 'vehicle_owner'
        }
    },
    {
        path: '/vehicle-owner/addresses',
        component: AccountAddressesPage,
        meta: {
            layout: Layout,
            title: 'Adreslerim | TaşıBul',
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
        component: CargoOwnerVerifyPage,
        meta: {
            layout: Layout,
            title: 'Hesap Doğrula | TaşıBul',
            requiresAuth: true,
            authorization: 'cargo_owner'
        }
    },
    {
        path: '/cargo-owner/cards',
        component: CargoOwnerCardsPage,
        meta: {
            layout: Layout,
            title: 'Kayıtlı Kartlarım | TaşıBul',
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
        path: '/:pathMatch(.*)*',
        component: NotFound,
        meta: {
            layout: Layout,
            title: '404 - Sayfa Bulunamadı | TaşıBul',
            requiresAuth: false
        }
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

// Router guard: Auth kontrolü ve yönlendirmeler
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const token = localStorage.getItem('token')
    
    // Anasayfa hariç tüm route'lar için auth kontrolü
    if (to.path !== '/' && to.meta.requiresAuth !== false) {
        // Token yoksa anasayfaya yönlendir
        if (!token) {
            next('/')
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
            next('/panel')
            return
        }
    }

    if (token && to.meta.authorization && to.meta.authorization !== authStore.user.type) {
        next('/')
        return
    }
    
    next()
})