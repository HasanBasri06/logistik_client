<template>
    <div class="rounded-xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
        <div class="mb-4">
            <h2 class="text-sm font-semibold text-gray-900">Araç</h2>
            <p class="mt-1 text-xs text-gray-500">Yükün taşınacağı aracı seçin.</p>
        </div>

        <p v-if="carsError" class="text-xs text-red-500">{{ carsError }}</p>
        <div v-else-if="carsLoading" class="py-6 text-center text-sm text-gray-500">
            <i class="pi pi-spin pi-spinner mr-2"></i>
            Araçlar yükleniyor...
        </div>
        <div v-else-if="!cars.length" class="py-6 text-center text-sm text-gray-500">
            Araç bulunamadı.
        </div>
        <template v-else>
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="car in cars"
                    :key="car.id"
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
                    :class="selectedCar?.id === car.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'"
                    @click="selectCar(car)"
                >
                    {{ car.name }}
                </button>
            </div>

            <div
                v-if="selectedCar"
                class="mt-4 rounded-xl border border-white bg-white p-4"
            >
                <div class="flex items-center gap-4">
                    <img
                        :src="displayImage"
                        :alt="selectedCar.name"
                        class="h-16 w-24 object-contain"
                    />
                    <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900">{{ selectedCar.name }}</p>
                        <p v-if="selectedCar.price" class="text-xs text-gray-500 mt-0.5">
                            {{ selectedCar.price }} TL'den başlar
                        </p>
                    </div>
                </div>
            </div>

            <div
                v-if="selectedCar && selectedCar.details?.length"
                class="mt-4 space-y-4"
            >
                <div
                    v-for="(group, groupName) in detailsByType"
                    :key="groupName"
                    class="space-y-2"
                >
                    <p v-if="shouldShowGroupTitle(groupName)" class="text-xs font-semibold text-gray-700">
                        {{ groupName }}
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <label
                            v-for="item in group"
                            :key="item.id"
                            class="cursor-pointer"
                        >
                            <input
                                type="radio"
                                :name="`admin-car-${selectedCar.id}-${groupKey(group, groupName)}`"
                                class="peer sr-only"
                                :checked="isDetailSelected(item.id)"
                                @change="selectDetail(group, item)"
                            />
                            <span
                                class="inline-flex rounded-lg border px-3 py-2 text-sm font-medium transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white border-gray-200 text-gray-700 hover:border-primary/40"
                            >
                                {{ item.value }}
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import api from '@/api';

const props = defineProps({
    carId: {
        type: [Number, String, null],
        default: null,
    },
    carDetailId: {
        type: [Number, String, null],
        default: null,
    },
});

const emit = defineEmits(['update:carId', 'update:carDetailId']);

const cars = ref([]);
const carsLoading = ref(false);
const carsError = ref(null);
const selectedCar = ref(null);
const selectedDetails = ref([]);

function normalizeDetailGroupKey(raw) {
    const value = raw != null ? String(raw).trim() : '';
    if (!value || value.includes('{{') || value.toLowerCase() === 'type') return 'Varyant';
    return value;
}

const detailsByType = computed(() => {
    const details = selectedCar.value?.details ?? [];
    if (!details.length) return {};

    const groups = {};
    for (const item of details) {
        const type = normalizeDetailGroupKey(item.type);
        if (!groups[type]) groups[type] = [];
        groups[type].push(item);
    }
    return groups;
});

function shouldShowGroupTitle(groupName) {
    const keys = Object.keys(detailsByType.value);
    return !(keys.length === 1 && groupName === 'Varyant');
}

function groupKey(group, groupName) {
    const firstId = group?.[0]?.id;
    return `${groupName}-${firstId ?? 'g'}`;
}

function getCarImageUrl(image) {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    return new URL(`../../assets/images/vehicles/${image}`, import.meta.url).href;
}

const displayImage = computed(() => {
    if (!selectedCar.value) return '';

    for (const item of selectedCar.value.details ?? []) {
        if (selectedDetails.value.some((detail) => detail.id === item.id) && item.image) {
            return getCarImageUrl(item.image);
        }
    }

    return getCarImageUrl(selectedCar.value.image);
});

function autoSelectFirstDetails(car) {
    const details = car?.details ?? [];
    if (!details.length) return [];

    const groups = {};
    for (const item of details) {
        const type = normalizeDetailGroupKey(item.type);
        if (!groups[type]) groups[type] = item;
    }

    return Object.values(groups).map((item) => ({
        id: item.id,
        name: item.value != null && String(item.value).trim() !== '' ? String(item.value) : String(item.name ?? ''),
    }));
}

function emitSelection() {
    emit('update:carId', selectedCar.value?.id ?? null);
    emit('update:carDetailId', selectedDetails.value[0]?.id ?? null);
}

function selectCar(car) {
    selectedCar.value = car;
    selectedDetails.value = autoSelectFirstDetails(car);
    emitSelection();
}

function isDetailSelected(detailId) {
    return selectedDetails.value.some((detail) => detail.id === detailId);
}

function selectDetail(group, item) {
    const groupIds = group.map((entry) => entry.id);
    const rest = selectedDetails.value.filter((detail) => !groupIds.includes(detail.id));
    selectedDetails.value = [...rest, { id: item.id, name: item.value }];
    emitSelection();
}

async function fetchCars() {
    carsLoading.value = true;
    carsError.value = null;

    try {
        const res = await api.get('/cars');
        const content = res.data?.content;
        cars.value = content?.cars ?? [];

        if (props.carId) {
            const car = cars.value.find((entry) => entry.id === Number(props.carId));
            if (car) {
                selectedCar.value = car;
                if (props.carDetailId) {
                    const detail = car.details?.find((entry) => entry.id === Number(props.carDetailId));
                    selectedDetails.value = detail
                        ? [{ id: detail.id, name: detail.value }]
                        : autoSelectFirstDetails(car);
                } else {
                    selectedDetails.value = autoSelectFirstDetails(car);
                }
                return;
            }
        }

        if (cars.value.length === 1) {
            selectCar(cars.value[0]);
        }
    } catch (err) {
        carsError.value = err.response?.data?.message ?? err.message ?? 'Araçlar yüklenemedi.';
        cars.value = [];
    } finally {
        carsLoading.value = false;
    }
}

watch(
    () => [props.carId, props.carDetailId],
    () => {
        if (!props.carId) {
            selectedCar.value = null;
            selectedDetails.value = [];
            return;
        }

        if (!cars.value.length) return;
        const car = cars.value.find((entry) => entry.id === Number(props.carId));
        if (!car) return;
        selectedCar.value = car;
        if (props.carDetailId) {
            const detail = car.details?.find((entry) => entry.id === Number(props.carDetailId));
            selectedDetails.value = detail
                ? [{ id: detail.id, name: detail.value }]
                : autoSelectFirstDetails(car);
        }
    },
);

onMounted(fetchCars);
</script>
