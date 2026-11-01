<template>
    <div class="flex flex-col gap-4 overflow-y-auto p-1">
        <div class="flex items-start justify-between gap-3">
            <div>
                <h1 class="text-lg font-semibold text-gray-900">Yük Alarmı</h1>
                <p class="text-sm text-gray-500 mt-0.5">
                    Rotanızda aracınıza uygun bir ilan açıldığında telefonunuza (TaşıBul mobil uygulaması) bildirim gönderilir.
                </p>
            </div>
        </div>

        <div v-if="loading" class="flex items-center gap-2 py-10 justify-center text-sm text-gray-500">
            <i class="pi pi-spin pi-spinner text-primary"></i>
            Yükleniyor...
        </div>

        <div v-else-if="loadError" class="flex flex-col items-center gap-3 py-10 text-gray-500">
            <i class="pi pi-cloud text-3xl text-gray-300"></i>
            <p class="text-sm font-medium">Alarmlar yüklenemedi</p>
            <button
                type="button"
                class="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/15"
                @click="load"
            >
                Tekrar dene
            </button>
        </div>

        <template v-else>
            <RouterLink
                v-if="!hasCars"
                to="/vehicle-owner/vehicles"
                class="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 hover:bg-amber-100/70"
            >
                <i class="pi pi-exclamation-circle mt-0.5"></i>
                <span>
                    Bildirimler, Araçlarım'daki araçlarınıza uygun ilanlar için gönderilir. Henüz araç eklemediniz —
                    eklemek için tıklayın.
                </span>
            </RouterLink>

            <!-- Hiç alarm yoksa: noktalı oluşturma kutusu -->
            <RouterLink
                v-if="!alarms.length"
                to="/vehicle-owner/load-alarms/create"
                class="group w-full sm:max-w-sm flex flex-col items-center justify-center text-center gap-2 rounded-2xl border-2 border-dotted border-primary/50 bg-white px-6 py-10 transition-colors hover:border-primary hover:bg-primary/5"
            >
                <span class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <i class="pi pi-bell" style="font-size: 20px;"></i>
                </span>
                <span class="text-base font-semibold text-gray-900">Yük alarmı oluşturun</span>
                <span class="text-sm text-gray-500">Rotanızda aracınıza uygun bir ilan açıldığında size bildirim gönderelim.</span>
            </RouterLink>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                <div
                    v-for="alarm in alarms"
                    :key="alarm.id"
                    class="rounded-2xl border p-4 transition-colors"
                    :class="alarm.is_active ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50'"
                >
                    <div class="flex items-start gap-3">
                        <span
                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                            :class="alarm.is_active ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'"
                        >
                            <i class="pi pi-directions" style="font-size: 16px;"></i>
                        </span>
                        <div class="min-w-0 flex-1">
                            <p class="text-[11px] font-semibold uppercase text-gray-400">Nereden</p>
                            <p class="text-sm font-semibold text-gray-900 truncate">{{ loadAlarmPlaceLabel(alarm.f_city, alarm.f_district) }}</p>
                            <p class="mt-1.5 text-[11px] font-semibold uppercase text-gray-400">Nereye</p>
                            <p class="text-sm font-semibold text-gray-900 truncate">{{ loadAlarmPlaceLabel(alarm.t_city, alarm.t_district) }}</p>
                        </div>
                        <ToggleSwitch
                            :model-value="alarm.is_active"
                            :label="alarm.is_active ? 'Alarmı pasif yap' : 'Alarmı aktif yap'"
                            @update:model-value="(v) => toggleActive(alarm, v)"
                        />
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span
                            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
                            :class="alarm.is_active ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-500'"
                        >
                            <span class="h-1.5 w-1.5 rounded-full" :class="alarm.is_active ? 'bg-secondary' : 'bg-gray-400'"></span>
                            {{ alarm.is_active ? 'Aktif' : 'Pasif' }}
                        </span>
                        <button
                            type="button"
                            class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            :disabled="busyId === alarm.id"
                            aria-label="Alarmı sil"
                            @click="removeAlarm(alarm)"
                        >
                            <i :class="busyId === alarm.id ? 'pi pi-spin pi-spinner' : 'pi pi-trash'" style="font-size: 13px;"></i>
                        </button>
                    </div>
                </div>

                <RouterLink
                    v-if="alarms.length < LOAD_ALARM_LIMIT"
                    to="/vehicle-owner/load-alarms/create"
                    class="flex min-h-[148px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dotted border-primary/50 bg-white text-primary transition-colors hover:border-primary hover:bg-primary/5"
                >
                    <i class="pi pi-plus-circle" style="font-size: 20px;"></i>
                    <span class="text-sm font-semibold">Yeni alarm ekle</span>
                </RouterLink>
            </div>
        </template>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import api from '@/api';
import ToggleSwitch from '@/components/ToggleSwitch.vue';
import {
    LOAD_ALARM_LIMIT,
    deleteLoadAlarm,
    fetchLoadAlarms,
    loadAlarmErrorMessage,
    loadAlarmPlaceLabel,
    setLoadAlarmActive,
} from '@/lib/load-alarms';

const alarms = ref([]);
const loading = ref(true);
const loadError = ref(false);
const hasCars = ref(true);
const busyId = ref(null);

async function load() {
    loading.value = true;
    try {
        const [list, cars] = await Promise.all([
            fetchLoadAlarms(),
            api.get('/cars/my').then((r) => r.data?.content).catch(() => null),
        ]);
        alarms.value = list;
        const carList = Array.isArray(cars) ? cars : cars?.cars;
        if (Array.isArray(carList)) hasCars.value = carList.length > 0;
        loadError.value = false;
    } catch {
        loadError.value = true;
    } finally {
        loading.value = false;
    }
}

async function toggleActive(alarm, next) {
    alarm.is_active = next;
    try {
        await setLoadAlarmActive(alarm.id, next);
    } catch (err) {
        alarm.is_active = !next;
        toast.error('Alarm güncellenemedi', { description: loadAlarmErrorMessage(err, 'Lütfen tekrar deneyin.') });
    }
}

async function removeAlarm(alarm) {
    if (!window.confirm(`${alarm.f_city} → ${alarm.t_city || 'Her yer'} alarmı silinsin mi?`)) return;
    busyId.value = alarm.id;
    try {
        await deleteLoadAlarm(alarm.id);
        alarms.value = alarms.value.filter((a) => a.id !== alarm.id);
    } catch (err) {
        toast.error('Alarm silinemedi', { description: loadAlarmErrorMessage(err, 'Lütfen tekrar deneyin.') });
    } finally {
        busyId.value = null;
    }
}

onMounted(load);
</script>
