<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">İlan Ekle</h1>
        <p class="mt-2 text-sm text-gray-500">Ekleyen kullanıcı, araç ve yük türü zorunludur. Diğer alanlar isteğe bağlıdır.</p>

        <form class="mt-8 flex max-w-2xl flex-col gap-5" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-2">
                <AdminUserSearch :key="`user-${formKey}`" v-model="form.createrId" />
                <span v-if="errors.createrId" class="text-xs text-red-500">{{ errors.createrId }}</span>
            </div>

            <div class="flex flex-col gap-2">
                <AdminVehiclePicker
                    :key="`car-${formKey}`"
                    v-model:car-id="form.carId"
                    v-model:car-detail-id="form.carDetailId"
                />
                <span v-if="errors.carId" class="text-xs text-red-500">{{ errors.carId }}</span>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700" for="postTypeId">Taşınacak Yükün Türü <span class="text-red-500">*</span></label>
                <select
                    id="postTypeId"
                    v-model="form.postTypeId"
                    :disabled="postTypesLoading"
                    :class="inputClass('postTypeId')"
                >
                    <option value="">Yük tipi seçin</option>
                    <option v-for="postType in postTypes" :key="postType.id" :value="postType.id">
                        {{ postType.value }}
                    </option>
                </select>
                <span v-if="errors.postTypeId" class="text-xs text-red-500">{{ errors.postTypeId }}</span>
            </div>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="fromCity">Yüklenecek Şehir</label>
                    <select
                        id="fromCity"
                        v-model="form.fromCity"
                        :disabled="citiesLoading"
                        :class="inputClass('fromCity')"
                        @change="onFromCityChange"
                    >
                        <option value="">Şehir seçin</option>
                        <option v-for="city in cities" :key="city.id" :value="city.name">
                            {{ city.name }}
                        </option>
                    </select>
                    <span v-if="errors.fromCity" class="text-xs text-red-500">{{ errors.fromCity }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="fromDistrict">Yüklenecek İlçe</label>
                    <select
                        id="fromDistrict"
                        v-model="form.fromDistrict"
                        :disabled="!form.fromCity || fromDistrictsLoading"
                        :class="inputClass('fromDistrict')"
                    >
                        <option value="">İlçe seçin</option>
                        <option v-for="district in fromDistricts" :key="district.id" :value="district.name">
                            {{ district.name }}
                        </option>
                    </select>
                    <span v-if="errors.fromDistrict" class="text-xs text-red-500">{{ errors.fromDistrict }}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="toCity">Boşaltılacak Şehir</label>
                    <select
                        id="toCity"
                        v-model="form.toCity"
                        :disabled="citiesLoading"
                        :class="inputClass('toCity')"
                        @change="onToCityChange"
                    >
                        <option value="">Şehir seçin</option>
                        <option v-for="city in cities" :key="`to-${city.id}`" :value="city.name">
                            {{ city.name }}
                        </option>
                    </select>
                    <span v-if="errors.toCity" class="text-xs text-red-500">{{ errors.toCity }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="toDistrict">Boşaltılacak İlçe</label>
                    <select
                        id="toDistrict"
                        v-model="form.toDistrict"
                        :disabled="!form.toCity || toDistrictsLoading"
                        :class="inputClass('toDistrict')"
                    >
                        <option value="">İlçe seçin</option>
                        <option v-for="district in toDistricts" :key="district.id" :value="district.name">
                            {{ district.name }}
                        </option>
                    </select>
                    <span v-if="errors.toDistrict" class="text-xs text-red-500">{{ errors.toDistrict }}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="weight">Ağırlık (kg)</label>
                    <input
                        id="weight"
                        v-model="form.weight"
                        type="number"
                        min="0"
                        placeholder="Örn. 1500"
                        :class="inputClass('weight')"
                    />
                    <span v-if="errors.weight" class="text-xs text-red-500">{{ errors.weight }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="price">Fiyat (₺)</label>
                    <input
                        id="price"
                        v-model="form.price"
                        type="number"
                        min="0"
                        placeholder="Örn. 5000"
                        :class="inputClass('price')"
                    />
                    <span v-if="errors.price" class="text-xs text-red-500">{{ errors.price }}</span>
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700" for="callAccess">Arama İzni (call_access)</label>
                <select
                    id="callAccess"
                    v-model="form.callAccess"
                    :class="inputClass('callAccess')"
                >
                    <option value="">Seçiniz</option>
                    <option value="1">Açık (1)</option>
                    <option value="0">Kapalı (0)</option>
                </select>
                <span v-if="errors.callAccess" class="text-xs text-red-500">{{ errors.callAccess }}</span>
            </div>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="departureTime">Kalkış Saati</label>
                    <input
                        id="departureTime"
                        v-model="form.departureTime"
                        type="time"
                        :class="inputClass('departureTime')"
                    />
                    <span v-if="errors.departureTime" class="text-xs text-red-500">{{ errors.departureTime }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700" for="timeArrival">İniş Saati</label>
                    <input
                        id="timeArrival"
                        v-model="form.timeArrival"
                        type="time"
                        :class="inputClass('timeArrival')"
                    />
                    <span v-if="errors.timeArrival" class="text-xs text-red-500">{{ errors.timeArrival }}</span>
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700" for="departureDate">Yükleme Tarihi</label>
                <input
                    id="departureDate"
                    v-model="form.departureDate"
                    type="date"
                    :class="inputClass('departureDate')"
                />
                <span v-if="errors.departureDate" class="text-xs text-red-500">{{ errors.departureDate }}</span>
            </div>

            <button
                type="submit"
                :disabled="submitting"
                :class="[
                    'h-11 w-full max-w-xs rounded-lg text-sm font-semibold text-white transition-colors',
                    submitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90',
                ]"
            >
                <span v-if="submitting" class="inline-flex items-center justify-center gap-2">
                    <i class="pi pi-spin pi-spinner"></i>
                    Kaydediliyor...
                </span>
                <span v-else>İlan Ekle</span>
            </button>
        </form>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as yup from 'yup';
import { toast } from 'vue-sonner';
import api from '@/api';
import { useAdminStore } from '@/stores/admin';
import AdminVehiclePicker from '@/panel/admin/AdminVehiclePicker.vue';
import AdminUserSearch from '@/panel/admin/AdminUserSearch.vue';

const adminStore = useAdminStore();
const submitting = ref(false);
const formKey = ref(0);

function createInitialFormState() {
    return {
        createrId: null,
        carId: null,
        carDetailId: null,
        postTypeId: '',
        fromCity: '',
        fromDistrict: '',
        toCity: '',
        toDistrict: '',
        weight: '',
        price: '',
        callAccess: '',
        departureTime: '',
        timeArrival: '',
        departureDate: '',
    };
}

function createInitialErrors() {
    return {
        createrId: '',
        carId: '',
        carDetailId: '',
        postTypeId: '',
        fromCity: '',
        fromDistrict: '',
        toCity: '',
        toDistrict: '',
        weight: '',
        price: '',
        callAccess: '',
        departureTime: '',
        timeArrival: '',
        departureDate: '',
    };
}

const cities = ref([]);
const fromDistricts = ref([]);
const toDistricts = ref([]);
const citiesLoading = ref(false);
const fromDistrictsLoading = ref(false);
const toDistrictsLoading = ref(false);
const postTypes = ref([]);
const postTypesLoading = ref(false);

const form = ref(createInitialFormState());

const errors = ref(createInitialErrors());

const optionalNumber = (label) =>
    yup
        .number()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' || originalValue == null ? null : value))
        .typeError(`Geçerli bir ${label} girin.`)
        .positive(`${label} 0'dan büyük olmalıdır.`);

const listingSchema = yup.object({
    createrId: yup
        .number()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' || originalValue == null ? null : value))
        .required('Ekleyen kullanıcı seçilmelidir.'),
    carId: yup
        .number()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' || originalValue == null ? null : value))
        .required('Araç seçilmelidir.'),
    carDetailId: yup.number().nullable().optional(),
    postTypeId: yup
        .number()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' || originalValue == null ? null : value))
        .required('Taşınacak yükün türü seçilmelidir.'),
    fromCity: yup.string().nullable().optional(),
    fromDistrict: yup.string().nullable().optional(),
    toCity: yup.string().nullable().optional(),
    toDistrict: yup.string().nullable().optional(),
    weight: optionalNumber('ağırlık').optional().nullable(),
    price: yup
        .number()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' || originalValue == null ? null : value))
        .typeError('Geçerli bir fiyat girin.')
        .optional()
        .nullable(),
    callAccess: yup
        .string()
        .nullable()
        .optional()
        .oneOf(['', '0', '1'], 'Arama izni 0 veya 1 olmalıdır.'),
    departureTime: yup.string().nullable().optional(),
    timeArrival: yup.string().nullable().optional(),
    departureDate: yup.string().nullable().optional(),
});

function inputClass(field) {
    return [
        'h-11 w-full rounded-lg border px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed',
        errors.value[field]
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-200 focus:border-primary focus:ring-primary/20',
    ];
}

async function fetchPostTypes() {
    postTypesLoading.value = true;
    try {
        const res = await api.get('/post-types');
        const content = res.data?.content;
        postTypes.value = content?.post_types ?? [];
    } catch {
        postTypes.value = [];
    } finally {
        postTypesLoading.value = false;
    }
}

async function fetchCities() {
    citiesLoading.value = true;
    try {
        const res = await api.get('/locations/cities');
        const content = res.data?.content;
        cities.value = Array.isArray(content) ? content : [];
    } catch {
        cities.value = [];
    } finally {
        citiesLoading.value = false;
    }
}

async function loadDistricts(cityName, type) {
    const isFrom = type === 'from';
    const districtsRef = isFrom ? fromDistricts : toDistricts;
    const loadingRef = isFrom ? fromDistrictsLoading : toDistrictsLoading;
    const districtField = isFrom ? 'fromDistrict' : 'toDistrict';

    districtsRef.value = [];
    form.value[districtField] = '';

    const city = cities.value.find((item) => item.name === cityName);
    if (!city?.id) {
        return;
    }

    loadingRef.value = true;
    try {
        const res = await api.get(`/locations/cities/${city.id}/districts`);
        const content = res.data?.content;
        districtsRef.value = Array.isArray(content) ? content : [];
    } catch {
        districtsRef.value = [];
    } finally {
        loadingRef.value = false;
    }
}

function onFromCityChange() {
    loadDistricts(form.value.fromCity, 'from');
}

function onToCityChange() {
    loadDistricts(form.value.toCity, 'to');
}

function resetFormAfterSuccess() {
    form.value.postTypeId = '';
    form.value.weight = '';
    form.value.price = '';
    form.value.callAccess = '';
    form.value.departureTime = '';
    form.value.timeArrival = '';
    form.value.departureDate = '';
    errors.value = createInitialErrors();
}

function applyServerErrors(errorDetails) {
    if (!errorDetails || typeof errorDetails !== 'object') return;

    const fieldMap = {
        car_id: 'carId',
        car_detail_id: 'carDetailId',
        creater_id: 'createrId',
        post_type_id: 'postTypeId',
        from_city: 'fromCity',
        from_district: 'fromDistrict',
        to_city: 'toCity',
        to_district: 'toDistrict',
        call_access: 'callAccess',
        departure_time: 'departureTime',
        time_arrival: 'timeArrival',
        departure_date: 'departureDate',
    };

    Object.keys(errorDetails).forEach((key) => {
        const formKey = fieldMap[key] || key;
        if (errors.value[formKey] !== undefined) {
            const errorValue = errorDetails[key];
            errors.value[formKey] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        }
    });
}

async function handleSubmit() {
    errors.value = createInitialErrors();

    try {
        await listingSchema.validate(
            {
                ...form.value,
                createrId: form.value.createrId === '' || form.value.createrId == null ? null : Number(form.value.createrId),
                carId: form.value.carId === '' || form.value.carId == null ? null : Number(form.value.carId),
                carDetailId: form.value.carDetailId === '' || form.value.carDetailId == null ? null : Number(form.value.carDetailId),
                postTypeId: form.value.postTypeId === '' ? null : Number(form.value.postTypeId),
                weight: form.value.weight === '' ? null : Number(form.value.weight),
                price: form.value.price === '' ? null : Number(form.value.price),
            },
            { abortEarly: false },
        );
    } catch (err) {
        err.inner?.forEach((e) => {
            if (e.path && errors.value[e.path] !== undefined) {
                errors.value[e.path] = e.message;
            }
        });
        return;
    }

    submitting.value = true;
    try {
        const result = await adminStore.createShipment({
            creater_id: form.value.createrId,
            car_id: form.value.carId,
            car_detail_id: form.value.carDetailId || null,
            post_type_id: Number(form.value.postTypeId),
            from_city: form.value.fromCity || null,
            from_district: form.value.fromDistrict || null,
            to_city: form.value.toCity || null,
            to_district: form.value.toDistrict || null,
            weight: form.value.weight === '' ? null : Number(form.value.weight),
            price: form.value.price === '' ? null : Number(form.value.price),
            call_access: form.value.callAccess === '' ? null : Number(form.value.callAccess),
            departure_time: form.value.departureTime || null,
            time_arrival: form.value.timeArrival || null,
            departure_date: form.value.departureDate || null,
        });

        if (result.success) {
            toast.success(result.data?.message || 'İlan başarıyla oluşturuldu.', { duration: 5000 });
            resetFormAfterSuccess();
            return;
        }

        let errorMessage = result.error || 'İlan oluşturulamadı.';

        if (result.errorDetails && typeof result.errorDetails === 'object') {
            const firstError = Object.values(result.errorDetails)[0];
            if (Array.isArray(firstError)) {
                errorMessage = firstError[0];
            } else if (typeof firstError === 'string') {
                errorMessage = firstError;
            }
            applyServerErrors(result.errorDetails);
        }

        toast.error(errorMessage, {
            description: 'Kayıt Hatası',
            duration: 5000,
        });
    } finally {
        submitting.value = false;
    }
}

onMounted(() => {
    fetchCities();
    fetchPostTypes();
});
</script>
