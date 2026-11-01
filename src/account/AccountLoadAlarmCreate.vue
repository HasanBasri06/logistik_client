<template>
    <div class="flex flex-col gap-4 overflow-y-auto p-1">
        <div class="flex items-center gap-3">
            <RouterLink
                to="/vehicle-owner/load-alarms"
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-primary hover:text-primary"
                aria-label="Yük alarmlarına dön"
            >
                <i class="pi pi-arrow-left" style="font-size: 13px;"></i>
            </RouterLink>
            <div>
                <h1 class="text-lg font-semibold text-gray-900">Yeni Yük Alarmı</h1>
                <p class="text-sm text-gray-500 mt-0.5">
                    Nereden seçimi yeterli; isterseniz ilçe ve varış noktası da ekleyin. Bu rotada aracınıza uygun bir ilan yayınlandığında telefonunuza bildirim gönderelim.
                </p>
            </div>
        </div>

        <form class="w-full max-w-xl flex flex-col gap-3" @submit.prevent="save">
            <div v-for="which in ['from', 'to']" :key="which" class="contents">
                <section class="rounded-2xl border border-gray-200 bg-white p-4">
                    <div class="mb-3 flex items-center gap-2">
                        <span class="h-2.5 w-2.5 rounded-full" :class="which === 'from' ? 'bg-primary' : 'bg-secondary'"></span>
                        <h2 class="text-sm font-semibold text-gray-900">{{ which === 'from' ? 'Nereden' : 'Nereye' }}</h2>
                        <span v-if="which === 'to'" class="ml-auto text-xs text-gray-400">İsteğe bağlı</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label class="flex flex-col gap-1">
                            <span class="text-xs font-medium text-gray-500">Şehir</span>
                            <select
                                v-model="places[which].cityId"
                                class="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                :disabled="citiesLoading"
                                @change="onCityChange(which)"
                            >
                                <option :value="null" :disabled="which === 'from'">
                                    {{ citiesLoading ? 'Yükleniyor...' : which === 'from' ? 'Şehir seçin' : 'Her yer (varış fark etmez)' }}
                                </option>
                                <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name }}</option>
                            </select>
                        </label>
                        <label class="flex flex-col gap-1">
                            <span class="text-xs font-medium text-gray-500">İlçe</span>
                            <select
                                v-model="places[which].district"
                                class="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                                :disabled="!places[which].cityId || places[which].districtsLoading"
                            >
                                <option value="">{{ places[which].districtsLoading ? 'Yükleniyor...' : 'Tüm ilçeler' }}</option>
                                <option v-for="d in places[which].districts" :key="d.id" :value="d.name">{{ d.name }}</option>
                            </select>
                        </label>
                    </div>
                </section>
                <div v-if="which === 'from'" class="-my-5 flex justify-center relative z-10">
                    <button
                        type="button"
                        class="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-primary shadow-xs hover:border-primary"
                        aria-label="Nereden ve nereyeyi değiştir"
                        @click="swap"
                    >
                        <i class="pi pi-sort-alt" style="font-size: 13px;"></i>
                    </button>
                </div>
            </div>

            <div class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-900">Alarm {{ isActive ? 'aktif' : 'pasif' }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">
                        {{ isActive ? 'Uygun ilanlarda bildirim alırsınız.' : 'Kaydedilir ama bildirim gönderilmez.' }}
                    </p>
                </div>
                <ToggleSwitch v-model="isActive" label="Alarm aktif" />
            </div>

            <button
                type="submit"
                class="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-white text-sm font-semibold transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:pointer-events-none"
                :disabled="!canSave"
            >
                <i :class="saving ? 'pi pi-spin pi-spinner' : 'pi pi-bell'"></i>
                Alarmı Kaydet
            </button>
        </form>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import api from '@/api';
import ToggleSwitch from '@/components/ToggleSwitch.vue';
import { LOAD_ALARM_LIMIT, createLoadAlarm, fetchLoadAlarms, loadAlarmErrorMessage } from '@/lib/load-alarms';

const router = useRouter();
const cities = ref([]);
const citiesLoading = ref(true);
const isActive = ref(true);
const saving = ref(false);
/** Limit dolduysa kayıt kapalı (kullanıcıya metin gösterilmez, listeye dönülür) */
const limitReached = ref(false);

const emptyPlace = () => ({ cityId: null, district: '', districts: [], districtsLoading: false });
const places = reactive({ from: emptyPlace(), to: emptyPlace() });

const cityName = (id) => cities.value.find((c) => c.id === id)?.name ?? '';
/** Sadece nereden şehri zorunlu; nereye boşsa o şehirden çıkan her ilan */
const canSave = computed(() => !!places.from.cityId && !saving.value && !limitReached.value);

async function loadDistricts(which) {
    const place = places[which];
    place.districts = [];
    if (!place.cityId) return;
    place.districtsLoading = true;
    try {
        const res = await api.get(`/locations/cities/${place.cityId}/districts`);
        place.districts = Array.isArray(res.data?.content) ? res.data.content : [];
    } catch {
        place.districts = [];
    } finally {
        place.districtsLoading = false;
    }
}

function onCityChange(which) {
    places[which].district = '';
    loadDistricts(which);
}

function swap() {
    const from = { ...places.from };
    Object.assign(places.from, places.to);
    Object.assign(places.to, from);
}

async function save() {
    if (!canSave.value) return;
    saving.value = true;
    try {
        await createLoadAlarm({
            f_city: cityName(places.from.cityId),
            f_district: places.from.district || null,
            t_city: places.to.cityId ? cityName(places.to.cityId) : null,
            t_district: places.to.cityId ? places.to.district || null : null,
            is_active: isActive.value,
        });
        toast.success('Yük alarmı oluşturuldu');
        router.push('/vehicle-owner/load-alarms');
    } catch (err) {
        // 422: alarm limiti doldu — metin göstermeden listeye dön
        if (err?.response?.status === 422) {
            router.replace('/vehicle-owner/load-alarms');
            return;
        }
        toast.error('Alarm oluşturulamadı', { description: loadAlarmErrorMessage(err, 'Lütfen tekrar deneyin.') });
    } finally {
        saving.value = false;
    }
}

onMounted(async () => {
    fetchLoadAlarms()
        .then((list) => {
            if (list.length >= LOAD_ALARM_LIMIT) {
                limitReached.value = true;
                router.replace('/vehicle-owner/load-alarms');
            }
        })
        .catch(() => {});
    try {
        const res = await api.get('/locations/cities');
        cities.value = Array.isArray(res.data?.content) ? res.data.content : [];
    } catch {
        toast.error('Şehirler yüklenemedi');
    } finally {
        citiesLoading.value = false;
    }
});
</script>
