<template>
    <Header />
    <nav 
        class="w-full h-screen -mt-16 relative" 
        :style="{ backgroundImage: `url(${lojistikWallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }"
    >
        <Content class="relative pt-16 flex flex-col justify-center">
            <!-- Slogan -->
            <div class="pt-12 pb-8 h-28 overflow-hidden">
                <Transition name="fade" mode="out-in">
                    <h2 
                        :key="currentSloganIndex"
                        class="nav-slogan text-3xl md:text-4xl font-semibold text-stone-50"
                    >
                        {{ slogans[currentSloganIndex] }}
                    </h2>
                </Transition>
            </div>
            <div class="nav-form w-full flex flex-col bg-white rounded-3xl border border-gray-200 absolute p-7">
                <!-- Arama Satırı -->
                <div class="flex gap-4 h-16">
                  <div 
                      data-from-city-dropdown
                      class="relative w-[334px] bg-primary/10 px-[10px] rounded-2xl"
                  >
                      <div 
                          @click="fromCityDropdownOpen = !fromCityDropdownOpen"
                          class="flex items-center justify-between h-16 cursor-pointer"
                      >
                          <span class="nav-text">
                              {{ fromCity ? fromCity.name : 'Nereden' }}
                          </span>
                          <svg 
                              :class="{ 'rotate-180': fromCityDropdownOpen }"
                              class="transition-transform duration-300 w-5 h-5 text-gray-600"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                          >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                      </div>
                      <div 
                          v-if="fromCityDropdownOpen"
                          class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
                      >
                          <p v-if="citiesLoading" class="nav-text nav-text--muted px-4 py-3">Yükleniyor...</p>
                          <div
                              v-else
                              v-for="city in cities"
                              :key="city.id"
                              @click="selectFromCity(city)"
                              class="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                              :class="{ 'bg-primary/10': fromCity?.id === city.id }"
                          >
                              <span class="nav-text nav-text--dark">{{ city.name }}</span>
                          </div>
                      </div>
                  </div>
                  <div class="w-[334px]  bg-primary/10 px-[10px] rounded-2xl">
                    <Select
                      v-model="toCity"
                      :pt="{
                        root: { class: 'flex items-center h-16 nav-select-root' },
                        label: { class: 'flex items-center py-2 nav-text' },
                        overlay: { class: 'bg-white border border-gray-100 shadow-lg' },
                        list: { class: 'bg-white' }
                      }"
                      name="to.city"
                      dropdownIcon=" "
                      :options="cities"
                      optionLabel="name"
                      placeholder="Nereye"
                      fluid
                    />
                  </div>
                  <div class="w-[274px]  bg-primary/10 rounded-2xl px-[10px]">
                    <DatePicker
                      v-model="departureTime"
                      :pt="{
                        root: { class: 'flex items-center h-16 nav-select-root' },
                        input: { class: 'py-[10px] nav-text' },
                        panel: { class: 'bg-white border border-gray-100 shadow-lg' }
                      }"
                      id="datepicker-departure"
                      placeholder="Gidiş"
                      showTime
                      hourFormat="24"
                      fluid
                    />
                  </div>
                  <div class="w-[274px]  bg-primary/10 rounded-2xl px-[10px]">
                    <DatePicker
                      v-model="returnTime"
                      :pt="{
                        root: { class: 'flex items-center h-16 nav-select-root' },
                        input: { class: 'py-[10px] nav-text' },
                        panel: { class: 'bg-white border border-gray-100 shadow-lg' }
                      }"
                      id="datepicker-return"
                      placeholder="Dönüş"
                      showTime
                      hourFormat="24"
                      fluid
                    />
                  </div>
                  <!-- Soğukluk Derecesi (Sadece Frigo seçildiğinde) -->
                  <div v-if="selectedVehicle === 'frigo' || selectedSubCategory === 'frigo'" class="w-[180px]  bg-primary/10 px-[10px] rounded-2xl">
                    <Select
                      v-model="temperatureDegree"
                      :pt="{
                        root: { class: 'flex items-center h-16 nav-select-root' },
                        label: { class: 'flex items-center py-2 nav-text' },
                        overlay: { class: 'bg-white border border-gray-100 shadow-lg' },
                        list: { class: 'bg-white' }
                      }"
                      name="temperature.degree"
                      dropdownIcon=" "
                      :options="temperatureOptions"
                      optionLabel="label"
                      placeholder="Soğukluk Derecesi"
                      fluid
                    />
                  </div>
                  <div class="w-[150px]">
                    <button type="button" class="nav-btn w-full h-full bg-green-400 rounded-full text-white">
                      {{ searchButtonText }}
                    </button>
                  </div>
                </div>
                <!-- Taşıt Türü Seçimi (Alt Satır) -->
                <div class="mt-6 flex items-center justify-between gap-4">
                  <p class="nav-text nav-text--muted">
                    Ne tür bir taşıt aramıştınız?
                  </p>
                  <div class="flex items-center gap-4">
                    <!-- Alt Kategori Butonları (Panelvan için) -->
                    <div v-if="hasSubCategories(selectedVehicle)" class="flex items-center gap-2">
                      <button
                        v-for="subCat in getSubCategories(selectedVehicle)"
                        :key="subCat.value"
                        type="button"
                        @click="selectedSubCategory = subCat.value"
                        :class="[
                          'nav-text nav-text-btn rounded-full border px-4 py-2 transition-colors cursor-pointer whitespace-nowrap',
                          selectedSubCategory === subCat.value
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-primary/60'
                        ]"
                      >
                        {{ subCat.label }}
                      </button>
                    </div>
                    <!-- Ana Taşıt Türü Seçimi -->
                    <div class="border border-gray-200 px-[8px] rounded-2xl">
                      <Select
                        v-model="selectedVehicle"
                        :pt="{
                          root: { class: 'flex items-center h-14 nav-select-root' },
                          label: { class: 'flex items-center py-2 nav-text' },
                          overlay: { class: 'bg-white border border-gray-100 shadow-lg' },
                          list: { class: 'bg-white' }
                        }"
                        name="vehicle.type"
                        dropdownIcon=" "
                        :options="vehicleTypes"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Taşıt Türü"
                        fluid
                      >
                        <template #option="slotProps">
                          <div class="flex items-center gap-2">
                            <i :class="slotProps.option.icon" class="text-primary"></i>
                            <span class="nav-text">{{ slotProps.option.label }}</span>
                          </div>
                        </template>
                        <template #value="slotProps">
                          <div v-if="slotProps.value" class="flex items-center gap-2">
                            <i :class="getVehicleIcon(slotProps.value)" class="text-primary"></i>
                            <span class="nav-text">{{ getVehicleLabel(slotProps.value) }}</span>
                          </div>
                          <span v-else class="nav-text">{{ slotProps.placeholder }}</span>
                        </template>
                      </Select>
                    </div>
                  </div>
                </div>
            </div>
        </Content>
    </nav>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import Content from '../components/Content.vue'
import Header from '../components/Header.vue'
import { DatePicker, Select } from "primevue";
import lojistikWallpaper from '@/assets/images/lojistik_wallpaper.jpg';
import { useAuthStore } from "@/stores/auth";
import api from '@/api';

const authStore = useAuthStore();

// Şehirler veritabanından (API) çekiliyor
const cities = ref([]);
const citiesLoading = ref(false);

const fetchCities = async () => {
    try {
        citiesLoading.value = true;
        const res = await api.get('/locations/cities');
        const content = res.data?.content;
        if (Array.isArray(content)) {
            cities.value = content;
        }
    } catch (err) {
        console.error('Şehirler yüklenemedi:', err);
    } finally {
        citiesLoading.value = false;
    }
};

// Slogan carousel
const slogans = [
    'Yükünüzü Güvenle, Doğru Araçla Buluşturun',
    'Türkiye\'nin En Güvenilir Lojistik Platformu',
    'Hızlı, Güvenli ve Ekonomik Taşımacılık',
    'Binlerce Araç, Tek Tıkla Erişim'
];

const currentSloganIndex = ref(0);
let sloganInterval = null;

onMounted(() => {
    sloganInterval = setInterval(() => {
        currentSloganIndex.value = (currentSloganIndex.value + 1) % slogans.length;
    }, 4000); // Her 4 saniyede bir değişir
});

onBeforeUnmount(() => {
    if (sloganInterval) {
        clearInterval(sloganInterval);
    }
});

const fromCity = ref(null);
const toCity = ref(null);
const fromCityDropdownOpen = ref(false);

const departureTime = ref(null);
const returnTime = ref(null);

const temperatureDegree = ref(null);

const temperatureOptions = ref([
    { label: '-18°C', value: '-18' },
    { label: '-20°C', value: '-20' },
    { label: '-25°C', value: '-25' },
    { label: '-30°C', value: '-30' },
    { label: '0°C', value: '0' },
    { label: '+2°C', value: '+2' },
    { label: '+4°C', value: '+4' }
]);

const vehicleTypes = ref([
    { label: 'Motor', value: 'motor', icon: 'pi pi-bike' },
    { label: 'Minivan', value: 'minivan', icon: 'pi pi-car' },
    { label: 'Panelvan', value: 'panelvan', icon: 'pi pi-car' },
    { label: 'Kamyon', value: 'kamyon', icon: 'pi pi-truck' },
    { label: 'Tır', value: 'tir', icon: 'pi pi-truck' },
]);

const getVehicleIcon = (value) => {
    const vehicle = vehicleTypes.value.find(type => type.value === value);
    return vehicle ? vehicle.icon : '';
};

const getVehicleLabel = (value) => {
    const vehicle = vehicleTypes.value.find(type => type.value === value);
    return vehicle ? vehicle.label : '';
};

const selectedVehicle = ref('motor');
const selectedSubCategory = ref(null);

// Alt kategori verileri
const subCategories = ref({
    panelvan: [
        { label: 'Orta Panelvan', value: 'orta-panelvan', icon: 'pi pi-car' },
        { label: 'Uzun Panelvan', value: 'uzun-panelvan', icon: 'pi pi-car' },
        { label: 'Ekstra Uzun Panelvan', value: 'ekstra-uzun-panelvan', icon: 'pi pi-car' },
        { label: 'Frigo', value: 'frigo', icon: 'pi pi-snowflake' },
    ],
    kamyon: [
        { label: '6 Teker', value: '6-teker' },
        { label: '8 Teker', value: '8-teker' },
        { label: '10 Teker', value: '10-teker' },
        { label: 'Kırkyak', value: 'kirkyak' },
        { label: 'Frigo', value: 'frigo' },
    ],
    tir: [
        { label: 'Kapalı', value: 'kapali' },
        { label: 'Tenteli', value: 'tenteli' },
        { label: 'Lowbed', value: 'lowbed' },
        { label: 'Frigo', value: 'frigo' },
    ]
});

// Alt kategori olup olmadığını kontrol et
const hasSubCategories = (vehicleValue) => {
    return vehicleValue && subCategories.value[vehicleValue] !== undefined;
};

// Alt kategorileri getir
const getSubCategories = (vehicleValue) => {
    if (vehicleValue && subCategories.value[vehicleValue]) {
        return subCategories.value[vehicleValue];
    }
    return [];
};

// Alt kategori icon'unu getir
const getSubCategoryIcon = (value) => {
    for (const categoryList of Object.values(subCategories.value)) {
        const category = categoryList.find(cat => cat.value === value);
        if (category) {
            return category.icon;
        }
    }
    return '';
};

// Alt kategori label'ını getir
const getSubCategoryLabel = (value) => {
    for (const categoryList of Object.values(subCategories.value)) {
        const category = categoryList.find(cat => cat.value === value);
        if (category) {
            return category.label;
        }
    }
    return '';
};

// Ana taşıt türü değiştiğinde alt kategoriyi sıfırla
watch(selectedVehicle, () => {
    selectedSubCategory.value = null;
});

const searchButtonText = computed(() => {
    const selectedType = vehicleTypes.value.find(type => type.value === selectedVehicle.value);
    return selectedType ? `${selectedType.label} Ara` : 'Taşıt Ara';
});

const selectFromCity = (city) => {
    fromCity.value = city;
    fromCityDropdownOpen.value = false;
};

// Click outside handler
const handleClickOutside = (event) => {
    const target = event.target;
    const fromCityDropdown = document.querySelector('[data-from-city-dropdown]');
    if (fromCityDropdown && !fromCityDropdown.contains(target)) {
        fromCityDropdownOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    fetchCities();
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

</script>

<style scoped>
/* Navbar yazı stili: tüm metinler aynı font */
.nav-slogan {
    font-family: inherit;
    font-weight: 600;
    letter-spacing: -0.01em;
}
.nav-form .nav-text,
.nav-form .nav-text--dark,
.nav-form .nav-text--muted {
    font-size: 0.875rem;
    font-weight: 600;
    font-family: inherit;
    letter-spacing: -0.01em;
}
.nav-form .nav-text {
    color: #374151;
}
.nav-form .nav-text--dark {
    color: #111827;
}
.nav-form .nav-text--muted {
    color: #6b7280;
}
.nav-btn {
    font-size: 0.875rem;
    font-weight: 600;
    font-family: inherit;
    letter-spacing: -0.01em;
}
.nav-text-btn {
    font-size: 0.875rem;
    font-weight: 600;
    font-family: inherit;
    letter-spacing: -0.01em;
}
.nav-select-root :deep(.p-select-label),
.nav-select-root :deep(.p-inputtext),
.nav-select-root :deep(.p-placeholder) {
    font-size: 0.875rem !important;
    font-weight: 600 !important;
    font-family: inherit !important;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>