import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { router } from '@/router'
import { usePostStore } from './post'

export const useShipmentsStore = defineStore('shipments', () => {
    const authStore = useAuthStore()
    const postStore = usePostStore()
    const list = ref([])
    const myPostList = ref([])
    const otherPostList = ref([])
    const loading = ref(false)
    const loadingMore = ref(false)
    const error = ref(null)
    const currentPage = ref(1)
    const perPage = 20
    const total = ref(0)
    const lastSearchParams = ref({})

    const postState = ref({
        f_where: null,
        t_where: null
    })

    async function fetchShipments(options = {}) {
        const { append = false, initialPage, type, filters = null, f_where_city, f_where_district, t_where_city, t_where_district } = options

        if (!append) {
            lastSearchParams.value = { type, filters, f_where_city, f_where_district, t_where_city, t_where_district }
            currentPage.value = initialPage ?? 1
        }

        const src = append ? lastSearchParams.value : options
        const { type: t, filters: f, f_where_city: fc, f_where_district: fd, t_where_city: tc, t_where_district: td } = src

        const buildParams = (extraParams = {}) => {
            const params = { ...extraParams }
            if (f) params.filters = f
            if (t) params.type = t
            if (fc) params.f_where_city = fc
            if (fd) params.f_where_district = fd
            if (tc) params.t_where_city = tc
            if (td) params.t_where_district = td
            return params
        }

        const token = authStore.token?.value ?? authStore.token
        const headers = {}
        if (token) headers.Authorization = `Bearer ${token}`

        try {
            if (append) {
                loadingMore.value = true
                error.value = null
                const nextPage = currentPage.value + 1
                const offset = currentPage.value * perPage
                const params = buildParams({ offset, limit: perPage })
                const res = await api.get('/shipments', { params, headers })
                const content = res.data?.content
                if (content) {
                    const newMy = content.my_post ?? []
                    const newOther = content.other_post ?? []
                    myPostList.value = [...myPostList.value, ...newMy]
                    otherPostList.value = [...otherPostList.value, ...newOther]
                    list.value = [...myPostList.value, ...otherPostList.value]
                    currentPage.value = nextPage
                }
            } else {
                loading.value = true
                error.value = null
                const limit = currentPage.value * perPage
                const params = buildParams({ limit })
                const res = await api.get('/shipments', { params, headers })
                const content = res.data?.content
                if (content) {
                    const my_post = content.my_post ?? []
                    const other_post = content.other_post ?? []
                    list.value = [...my_post, ...other_post]
                    myPostList.value = Array.isArray(my_post) ? my_post : []
                    otherPostList.value = Array.isArray(other_post) ? other_post : []
                    total.value = content.total ?? list.value.length
                }
            }
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'İlanlar yüklenirken bir hata oluştu'
            if (!append) {
                list.value = []
                myPostList.value = []
                otherPostList.value = []
            }
        } finally {
            loading.value = false
            loadingMore.value = false
        }
    }

    const hasMore = computed(() => list.value.length < total.value)

    function setPage(page) {
        currentPage.value = page
    }

    function clearError() {
        error.value = null
    }

    function setPost(name, value) {
        posts.value[name] = value
    }

    async function logShipmentFormData(formData) {
        try {
            const res = await api.post('/shipments/create', formData)
            toast.success('İlan başarıyla oluşturuldu', { duration: 5000 })
            postStore.selectResetStates()
            const slug = res?.data?.content?.shipment?.slug ?? res?.data?.shipment?.slug
            if (slug) {
                router.push(`/product/${slug}`)
            } else {
                router.push('/panel')
            }
        } catch (error) {
            console.log(error)
            toast.error('İlan oluşturulurken bir hata oluştu', { duration: 5000 })
        }
    }

    return {
        list,
        myPostList,
        otherPostList,
        loading,
        loadingMore,
        error,
        currentPage,
        hasMore,
        perPage,
        fetchShipments,
        setPage,
        clearError,
        total,
        setPost,
        postState,
        logShipmentFormData
    }
})
