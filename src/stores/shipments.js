import { defineStore } from 'pinia'
import { ref } from 'vue'
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
    const error = ref(null)
    const currentPage = ref(1)
    const currentLimit = ref(20)
    const total = ref(0)
    const lastSearchParams = ref({})

    const postState = ref({
        f_where: null,
        t_where: null
    })

    async function fetchShipments(options = {}) {
        const { limit: reqLimit, append = false, type, filters = null, f_where_city, f_where_district, t_where_city, t_where_district } = options
        if (!append) {
            lastSearchParams.value = { type, filters, f_where_city, f_where_district, t_where_city, t_where_district }
            currentLimit.value = 20
        }
        const limit = append ? (currentLimit.value + 20) : (reqLimit ?? 20)
        if (append) currentLimit.value = limit
        const src = append ? lastSearchParams.value : options
        const { type: t, filters: f, f_where_city: fc, f_where_district: fd, t_where_city: tc, t_where_district: td } = src
        try {
            loading.value = true
            error.value = null
            const params = { limit }
            if (f) params.filters = f
            if (t) params.type = t
            if (fc) params.f_where_city = fc
            if (fd) params.f_where_district = fd
            if (tc) params.t_where_city = tc
            if (td) params.t_where_district = td
            const token = authStore.token?.value ?? authStore.token
            const headers = {}
            if (token) headers.Authorization = `Bearer ${token}`
            const res = await api.get('/shipments', { params, headers })
            const content = res.data?.content
            if (content) {
                const my_post = content.my_post ?? []
                const other_post = content.other_post ?? []
                const data = Array.isArray(my_post) && Array.isArray(other_post)
                    ? [...my_post, ...other_post]
                    : (Array.isArray(content) ? content : (content.data ?? content) ?? [])
                list.value = data
                myPostList.value = Array.isArray(my_post) ? my_post : []
                otherPostList.value = Array.isArray(other_post) ? other_post : []
                total.value = content.total ?? data.length
                if (content.current_page != null) currentPage.value = content.current_page
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
        }
    }

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
            await api.post('/shipments/create', formData)
            toast.success('İlan başarıyla oluşturuldu')
            postStore.selectResetStates()
            router.push('/panel')
        } catch (error) {
            console.log(error)
            toast.error('İlan oluşturulurken bir hata oluştu')
        }
    }

    return {
        list,
        myPostList,
        otherPostList,
        loading,
        error,
        currentPage,
        fetchShipments,
        setPage,
        clearError,
        total,
        setPost,
        postState,
        logShipmentFormData
    }
})
