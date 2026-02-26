<template>
    <div class="h-screen overflow-hidden">
        <Header />
        <!-- Arama Alanı (Navbar genişliğinde) -->
            <div class="w-full bg-white border-b border-gray-200 py-2 flex flex-col items-center shrink-0 relative" ref="searchBarRef">
                <div class="w-full flex flex-col max-w-[1200px] mx-auto px-4 relative">
                    <div class="flex gap-3 h-14 py-2">
                        <!-- Nereden -->
                        <div
                            class="w-[334px] bg-white border border-gray-200 px-3 rounded-lg cursor-pointer shrink-0 flex items-center h-full"
                            @click="toDropdownOpen = false; fromDropdownOpen = !fromDropdownOpen; fromDropdownOpen && openFromDropdown()"
                        >
                            <span class="text-sm text-gray-600 truncate">{{ fromLocationLabel }}</span>
                        </div>

                    
                    <!-- Swap Butonu -->
                    <button 
                        @click="swapCities"
                        class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-700 cursor-pointer transition-all duration-200 shrink-0 hover:border-primary hover:bg-primary/5 hover:text-primary active:scale-95"
                        type="button"
                    >
                        <ArrowLeftRight size="20" />
                    </button>
                    
                    <!-- Nereye -->
                    <div
                        class="w-[334px] bg-white border border-gray-200 px-3 rounded-lg cursor-pointer shrink-0 flex items-center h-full"
                        @click="fromDropdownOpen = false; toDropdownOpen = !toDropdownOpen; toDropdownOpen && openToDropdown()"
                    >
                        <span class="text-sm text-gray-600 truncate">{{ toLocationLabel }}</span>
                    </div>
                    
                    <!-- Gidiş ve Dönüş Saati -->
                    <div class="flex gap-3">
                        <div
                            class="w-[130px] bg-white px-3 rounded-lg border border-gray-200"
                            @click="fromDropdownOpen = false; toDropdownOpen = false"
                        >
                            <DatePicker
                                v-model="departureTime"
                                :pt="{
                                    root: { class: 'flex items-center h-full' },
                                    input: { class: 'py-2' },
                                    panel: { class: 'bg-white border border-gray-100 shadow-lg' }
                                }"
                                id="datepicker-departure"
                                placeholder="Gidiş"
                                showTime
                                hourFormat="24"
                                fluid
                            />
                        </div>
                        <div
                            class="w-[130px] bg-white px-3 rounded-lg border border-gray-200"
                            @click="fromDropdownOpen = false; toDropdownOpen = false"
                        >
                            <DatePicker
                                v-model="returnTime"
                                :pt="{
                                    root: { class: 'flex items-center h-full' },
                                    input: { class: 'py-2' },
                                    panel: { class: 'bg-white border border-gray-100 shadow-lg' }
                                }"
                                id="datepicker-return"
                                placeholder="Dönüş"
                                showTime
                                hourFormat="24"
                                fluid
                            />
                        </div>
                    </div>
                    <div class="w-[150px] shrink-0">
                        <button 
                            @click="handleSearch"
                            class="w-full h-full bg-primary rounded-lg text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                        >
                            Ara
                        </button>
                    </div>
                </div>
                    <!-- Nereden: 3 bölüm (Şehirler | İlçeler | Seçilen) -->
                    <Transition
                        enter-active-class="transition duration-200 ease-out"
                        enter-from-class="opacity-0 -translate-y-2"
                        enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition duration-200 ease-in"
                        leave-from-class="opacity-100 translate-y-0"
                        leave-to-class="opacity-0 -translate-y-2"
                    >
                        <div
                            v-show="fromDropdownOpen"
                            class="absolute left-0 right-0 top-full mt-1 z-50 w-full h-[200px] rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden"
                        >
                            <div class="grid grid-cols-3 w-full h-full divide-x divide-gray-200">
                                <div class="flex flex-col overflow-hidden">
                                    <h3 class="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">Şehirler</h3>
                                    <div class="p-2 border-b border-gray-100 shrink-0">
                                        <input
                                            v-model="fromCitySearch"
                                            type="text"
                                            placeholder="Şehir ara..."
                                            class="w-full h-8 px-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div class="flex-1 overflow-y-auto p-2">
                                        <p v-if="citiesLoading" class="text-xs text-gray-400">Yükleniyor...</p>
                                        <button
                                            v-else
                                            v-for="c in fromCitiesForList"
                                            :key="c.id"
                                            type="button"
                                            @click="selectFromCityTemp(c)"
                                            :class="['w-full text-left px-2 py-1.5 rounded text-sm', fromTempCity?.id === c.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-100']"
                                        >
                                            {{ c.name }}
                                        </button>
                                    </div>
                                </div>
                                <div class="flex flex-col overflow-hidden">
                                    <h3 class="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">İlçeler</h3>
                                    <div class="p-2 border-b border-gray-100 shrink-0">
                                        <input
                                            v-model="fromDistrictSearch"
                                            type="text"
                                            placeholder="İlçe ara..."
                                            class="w-full h-8 px-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                            :disabled="!fromTempCity"
                                        />
                                    </div>
                                    <div class="flex-1 overflow-y-auto p-2">
                                        <p v-if="!fromTempCity" class="text-xs text-gray-400">Önce şehir seçin</p>
                                        <p v-else-if="fromDistrictsLoading" class="text-xs text-gray-400">Yükleniyor...</p>
                                        <button
                                            v-else
                                            v-for="d in fromDistrictsForList"
                                            :key="d.id == null ? 'her-yer' : d.id"
                                            type="button"
                                            @click="applyFromLocation(d)"
                                            :class="['w-full text-left px-2 py-1.5 rounded text-sm', isFromDistrictSelected(d) ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-100']"
                                        >
                                            {{ d.name }}
                                        </button>
                                    </div>
                                </div>
                                <div class="flex flex-col overflow-hidden">
                                    <h3 class="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">Seçilen</h3>
                                    <div class="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
                                        <p v-if="!fromCity && !fromDistrict" class="text-xs text-gray-400">Henüz seçim yok</p>
                                        <p v-else class="text-sm font-medium text-gray-800">
                                            {{ fromCity?.name }}{{ fromDistrict ? ' / ' + fromDistrict.name : '' }}
                                        </p>
                                        <button
                                            type="button"
                                            @click="selectFromLocationByMap"
                                            class="w-full mt-auto flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                                        >
                                            <MapPin class="w-4 h-4 shrink-0" />
                                            Konum ile seç
                                        </button>
                                        <p v-if="locationError && fromDropdownOpen" class="text-xs text-amber-600 mt-1">{{ locationError }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                    <!-- Nereye: 3 bölüm (Şehirler | İlçeler | Seçilen) -->
                    <Transition
                        enter-active-class="transition duration-200 ease-out"
                        enter-from-class="opacity-0 -translate-y-2"
                        enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition duration-200 ease-in"
                        leave-from-class="opacity-100 translate-y-0"
                        leave-to-class="opacity-0 -translate-y-2"
                    >
                        <div
                            v-show="toDropdownOpen"
                            class="absolute left-0 right-0 top-full mt-1 z-50 w-full h-[200px] rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden"
                        >
                            <div class="grid grid-cols-3 w-full h-full divide-x divide-gray-200">
                                <div class="flex flex-col overflow-hidden">
                                    <h3 class="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">Şehirler</h3>
                                    <div class="p-2 border-b border-gray-100 shrink-0">
                                        <input
                                            v-model="toCitySearch"
                                            type="text"
                                            placeholder="Şehir ara..."
                                            class="w-full h-8 px-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div class="flex-1 overflow-y-auto p-2">
                                        <p v-if="citiesLoading" class="text-xs text-gray-400">Yükleniyor...</p>
                                        <button
                                            v-else
                                            v-for="c in toCitiesForList"
                                            :key="c.id"
                                            type="button"
                                            @click="selectToCityTemp(c)"
                                            :class="['w-full text-left px-2 py-1.5 rounded text-sm', toTempCity?.id === c.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-100']"
                                        >
                                            {{ c.name }}
                                        </button>
                                    </div>
                                </div>
                                <div class="flex flex-col overflow-hidden">
                                    <h3 class="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">İlçeler</h3>
                                    <div class="p-2 border-b border-gray-100 shrink-0">
                                        <input
                                            v-model="toDistrictSearch"
                                            type="text"
                                            placeholder="İlçe ara..."
                                            class="w-full h-8 px-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                            :disabled="!toTempCity"
                                        />
                                    </div>
                                    <div class="flex-1 overflow-y-auto p-2">
                                        <p v-if="!toTempCity" class="text-xs text-gray-400">Önce şehir seçin</p>
                                        <p v-else-if="toDistrictsLoading" class="text-xs text-gray-400">Yükleniyor...</p>
                                        <button
                                            v-else
                                            v-for="d in toDistrictsForList"
                                            :key="d.id == null ? 'her-yer' : d.id"
                                            type="button"
                                            @click="applyToLocation(d)"
                                            :class="['w-full text-left px-2 py-1.5 rounded text-sm', isToDistrictSelected(d) ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-100']"
                                        >
                                            {{ d.name }}
                                        </button>
                                    </div>
                                </div>
                                <div class="flex flex-col overflow-hidden">
                                    <h3 class="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">Seçilen</h3>
                                    <div class="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
                                        <p v-if="!toCity && !toDistrict" class="text-xs text-gray-400">Henüz seçim yok</p>
                                        <p v-else class="text-sm font-medium text-gray-800">
                                            {{ toCity?.name }}{{ toDistrict ? ' / ' + toDistrict.name : '' }}
                                        </p>
                                        <button
                                            type="button"
                                            @click="selectToLocationByMap"
                                            class="w-full mt-auto flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                                        >
                                            <MapPin class="w-4 h-4 shrink-0" />
                                            Konum ile seç
                                        </button>
                                        <p v-if="locationError && toDropdownOpen" class="text-xs text-amber-600 mt-1">{{ locationError }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        
        <Content class="mt-5 flex-1 overflow-hidden flex">
            <div class="flex flex-row gap-6 w-full h-full">
                <!-- Sol: Filtreleme -->
                <div class="w-[320px] flex flex-col gap-8 overflow-y-auto shrink-0">
                    <div
                        v-for="section in filterSections"
                        :key="section.modelKey"
                        class="flex flex-col gap-4"
                    >
                        <h2 class="text-lg font-semibold text-gray-900">{{ section.label }}</h2>
                        <div class="flex flex-col gap-2">
                            <label
                                v-for="opt in section.options"
                                :key="opt.value"
                                class="flex items-center px-4 py-3 rounded-lg border border-gray-200 cursor-pointer transition-all duration-200 gap-3 hover:border-primary/40 hover:bg-primary/5 has-checked:border-primary has-checked:bg-primary/10 group"
                            >
                                <input
                                    v-if="section.type === 'radio'"
                                    type="radio"
                                    :name="section.name"
                                    :value="opt.value"
                                    v-model="filters[section.modelKey]"
                                    class="w-4 h-4 accent-primary cursor-pointer focus:outline-2 focus:outline-primary focus:outline-offset-2"
                                    @change="handleFilterChange(section.modelKey, opt.value)"
                                />
                                <input
                                    v-else
                                    type="checkbox"
                                    v-model="filters[section.modelKey]"
                                    :true-value="opt.value"
                                    :false-value="null"
                                    class="w-4 h-4 accent-primary cursor-pointer focus:outline-2 focus:outline-primary focus:outline-offset-2"
                                    @change="handleFilterChange(section.modelKey)"
                                />
                                <span class="text-sm text-gray-700 font-medium flex-1 group-has-checked:text-primary group-has-checked:font-semibold">{{ opt.label }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Seçilenleri Temizle Butonu -->
                    <button 
                        @click="clearFilters"
                        :disabled="!hasActiveFiltersValue"
                        class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-700"
                    >
                        Seçilenleri Temizle
                    </button>
                </div>

                <!-- Sağ: İlanlar (Benim İlanlarım + Diğer İlanlar) -->
                <div class="flex-1 flex flex-col gap-5 py-4 overflow-y-auto pb-[500px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <p v-if="shipmentsError" class="text-sm text-red-600">{{ shipmentsError }}</p>
                    <template v-else-if="shipmentsLoading">
                        <p class="text-sm text-gray-500">Yükleniyor...</p>
                    </template>
                    <template v-else>
                        <div
                            v-if="shipmentsList.length === 0"
                            class="inline-flex items-center justify-center min-w-[280px] min-h-[72px] px-8 py-5 rounded-xl bg-gray-100 text-gray-600 text-base font-medium"
                        >
                            Henüz ilan verilmemiş
                        </div>
                        <template v-else>
                            <div class="text-sm text-gray-500">{{ shipmentsStore.total }} sevkiyat</div>

                            <section v-if="myPostList.length" class="flex flex-col gap-3">
                                <Product
                                    v-for="item in myPostList"
                                    :key="'my-' + item.id"
                                    :slug="item.slug"
                                    :shipment="item"
                                />

                                <div class="bg-gray-200 w-full h-px mt-1"></div>
                            </section>

                            <!-- Diğer İlanlar -->
                            <section v-if="otherPostList.length" class="flex flex-col gap-3">
                                <Product
                                    v-for="item in otherPostList"
                                    :key="'other-' + item.id"
                                    :slug="item.slug"
                                    :shipment="item"
                                />
                            </section>

                            <button
                                @click="loadMore"
                                class="flex items-center justify-center gap-2 w-full px-4 py-3.5 mt-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-semibold cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
                            >
                                <ChevronDown size="20" />
                                <span>Daha Fazla Yükle</span>
                            </button>
                        </template>
                    </template>
                </div>
            </div>
        </Content>

        <!-- Konum seçim modalı -->
        <Teleport to="body">
            <Transition name="modal">
                <div
                    v-show="mapModalOpen"
                    class="fixed inset-0 z-100 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="map-modal-title"
                >
                    <div class="absolute inset-0 bg-black/50" @click="mapModalOpen = false" />
                    <div
                        class="map-modal-box relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
                        @click.stop
                    >
                        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                            <h2 id="map-modal-title" class="text-lg font-semibold text-gray-900">
                                {{ mapModalFor === 'from' ? 'Nereden' : 'Nereye' }} — Haritadan konum seç
                            </h2>
                            <button
                                type="button"
                                class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                aria-label="Kapat"
                                @click="mapModalOpen = false"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="p-4 flex-1 overflow-auto flex flex-col gap-3">
                            <!-- Arama input -->
                            <div class="relative z-[9999]">
                                <input
                                    v-model="mapSearchQuery"
                                    type="text"
                                    placeholder="Konum ara (örn: Ankara, İstanbul Kadıköy...)"
                                    class="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                    @input="debouncedMapSearch"
                                    @blur="closeMapSearchResultsDelayed"
                                />
                                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <div
                                    v-if="mapSearchResults.length"
                                    class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[10000] max-h-48 overflow-y-auto"
                                >
                                    <button
                                        v-for="item in mapSearchResults"
                                        :key="item.place_id"
                                        type="button"
                                        class="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm border-b border-gray-100 last:border-0 flex items-start gap-2"
                                        @click="goToSearchResult(item)"
                                    >
                                        <MapPin class="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <span class="text-gray-700">{{ item.display_name }}</span>
                                    </button>
                                </div>
                                <div v-else-if="mapSearchLoading" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[10000] px-4 py-3 text-sm text-gray-500">
                                    Aranıyor...
                                </div>
                            </div>
                            <div ref="mapContainerRef" class="relative z-0 w-full h-[320px] rounded-lg overflow-hidden bg-gray-100 shrink-0" />
                            <p class="text-sm text-gray-700 font-medium">
                                Seçilen konum: <span class="text-primary">{{ selectedMapLocation?.name || 'Konum seçmek için haritaya tıklayın.' }}</span>
                            </p>
                            <div class="flex justify-end pt-2">
                                <button
                                    type="button"
                                    :disabled="!selectedMapLocation"
                                    class="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-primary/90 disabled:hover:bg-primary"
                                    @click="confirmMapLocation"
                                >
                                    Onayla
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
    </template>


<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import Content from '@/components/Content.vue';
import Header from '@/components/Header.vue';
import Product from '@/components/Product.vue';
import { DatePicker } from 'primevue';
import { ArrowLeftRight, ChevronDown, MapPin } from 'lucide-vue-next';
import api from '@/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useShipmentsStore } from '@/stores/shipments';

// Lokasyon: API'den şehir/ilçe
const apiCities = ref([]);
const fromCity = ref(null);
const fromDistrict = ref(null);
const toCity = ref(null);
const toDistrict = ref(null);
// Konum ile seçilen yerin input'ta gösterilen tam adı (Nominatim display_name)
const fromLocationDisplayName = ref(null);
const toLocationDisplayName = ref(null);
const fromTempCity = ref(null);
const toTempCity = ref(null);
const fromDistricts = ref([]);
const toDistricts = ref([]);
const citiesLoading = ref(false);
const fromDistrictsLoading = ref(false);
const toDistrictsLoading = ref(false);

// İlçe kısmında "Her yer" seçeneği (tüm ilçeler = arama kriteri yok)
const herYerOption = { id: null, name: 'Her yer' };

// Arama çubukları (Nereden/Nereye dropdown)
const fromCitySearch = ref('');
const fromDistrictSearch = ref('');
const toCitySearch = ref('');
const toDistrictSearch = ref('');

const isFromHerYer = computed(() => fromDistrict.value?.name === 'Her yer' && fromDistrict.value?.id == null);
const isToHerYer = computed(() => toDistrict.value?.name === 'Her yer' && toDistrict.value?.id == null);

// İlk üç: İstanbul, Ankara, İzmir (bu sıra); geri kalanı alfabetik
const cityPriorityLower = ['istanbul', 'ankara', 'izmir'];
function norm(s) {
    return (s || '').toLowerCase().replace(/ı/g, 'i').replace(/i̇/g, 'i').trim();
}
function sortCitiesWithPriority(list) {
    const priority = cityPriorityLower
        .map(pl => list.find(c => norm(c.name) === pl))
        .filter(Boolean);
    const rest = list.filter(c => !cityPriorityLower.includes(norm(c.name)));
    rest.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'tr'));
    return [...priority, ...rest];
}

// Şehirler: arama + sıra (İstanbul, Ankara, İzmir önce; geri kalan alfabetik) + seçili en üstte
const fromCitiesForList = computed(() => {
    let list = apiCities.value;
    const q = (fromCitySearch.value || '').trim().toLowerCase();
    if (q) list = list.filter(c => (c.name || '').toLowerCase().includes(q));
    list = sortCitiesWithPriority([...list]);
    const sel = fromTempCity.value;
    if (sel?.id) {
        const i = list.findIndex(c => c.id === sel.id);
        if (i > 0) {
            list = [...list];
            list.splice(i, 1);
            list.unshift(sel);
        }
    }
    return list;
});
const toCitiesForList = computed(() => {
    let list = apiCities.value;
    const q = (toCitySearch.value || '').trim().toLowerCase();
    if (q) list = list.filter(c => (c.name || '').toLowerCase().includes(q));
    list = sortCitiesWithPriority([...list]);
    const sel = toTempCity.value;
    if (sel?.id) {
        const i = list.findIndex(c => c.id === sel.id);
        if (i > 0) {
            list = [...list];
            list.splice(i, 1);
            list.unshift(sel);
        }
    }
    return list;
});

// İlçeler: arama + Her yer ve seçili en üstte
const fromDistrictsForList = computed(() => {
    let list = fromDistricts.value;
    const q = (fromDistrictSearch.value || '').trim().toLowerCase();
    if (q) list = list.filter(d => (d.name || '').toLowerCase().includes(q));
    const sel = fromDistrict.value;
    if (!sel) return [herYerOption, ...list];
    if (sel.id == null && sel.name === 'Her yer') return [herYerOption, ...list];
    const rest = list.filter(d => d.id !== sel.id);
    return [sel, herYerOption, ...rest];
});
const toDistrictsForList = computed(() => {
    let list = toDistricts.value;
    const q = (toDistrictSearch.value || '').trim().toLowerCase();
    if (q) list = list.filter(d => (d.name || '').toLowerCase().includes(q));
    const sel = toDistrict.value;
    if (!sel) return [herYerOption, ...list];
    if (sel.id == null && sel.name === 'Her yer') return [herYerOption, ...list];
    const rest = list.filter(d => d.id !== sel.id);
    return [sel, herYerOption, ...rest];
});

function isFromDistrictSelected(d) {
    if (d.id == null && d.name === 'Her yer') return isFromHerYer.value;
    return fromDistrict.value?.id === d.id;
}
function isToDistrictSelected(d) {
    if (d.id == null && d.name === 'Her yer') return isToHerYer.value;
    return toDistrict.value?.id === d.id;
}

// Input'ta gösterilen: Konum ile seçilense tam adı, listeden seçilense Şehir / İlçe
const fromLocationLabel = computed(() => {
    if (fromLocationDisplayName.value) return fromLocationDisplayName.value;
    if (fromCity.value && fromDistrict.value) return `${fromCity.value.name} / ${fromDistrict.value.name}`;
    if (fromCity.value) return fromCity.value.name;
    return 'Nereden';
});
const toLocationLabel = computed(() => {
    if (toLocationDisplayName.value) return toLocationDisplayName.value;
    if (toCity.value && toDistrict.value) return `${toCity.value.name} / ${toDistrict.value.name}`;
    if (toCity.value) return toCity.value.name;
    return 'Nereye';
});

const departureTime = ref(null);
const returnTime = ref(null);
const fromCityDropdownOpen = ref(false);
const fromDropdownOpen = ref(false);
const toDropdownOpen = ref(false);
const searchBarRef = ref(null);

/** Filtre seçenekleri: label (görünen metin), value (API'ye gönderilecek değer) */
const filterSections = [
    {
        label: 'Sırala',
        type: 'radio',
        name: 'order',
        modelKey: 'order',
        options: [
            { label: 'En erken kalkan', value: 'earliest' },
            { label: 'En ucuz', value: 'cheapest' },
            { label: 'Varış yeri en yakın', value: 'nearest' },
        ],
    },
    {
        label: 'Gidiş Saati',
        type: 'radio',
        name: 'departure-time',
        modelKey: 'departureTime',
        options: [
            { label: 'Sabah 06:00 - 12:00', value: 'morning' },
            { label: '12:00 - 18:00', value: 'afternoon' },
            { label: '18:00 - 06:00', value: 'evening' },
        ],
    },
    {
        label: 'Hesap',
        type: 'checkbox',
        modelKey: 'verified',
        options: [
            { label: 'Doğrulanmış profil', value: 'verified' },
        ],
    },
];

const filters = reactive({
    order: null,
    departureTime: null,
    verified: null,
});

const hasActiveFiltersValue = computed(() => {
    return filters.order !== null || filters.departureTime !== null || filters.verified !== null;
});

const clearFilters = () => {
    filters.order = null;
    filters.departureTime = null;
    filters.verified = null;
    shipmentsStore.fetchShipments();
};

const swapCities = () => {
    const fc = fromCity.value, fd = fromDistrict.value, fdName = fromLocationDisplayName.value;
    fromCity.value = toCity.value;
    fromDistrict.value = toDistrict.value;
    fromLocationDisplayName.value = toLocationDisplayName.value;
    toCity.value = fc;
    toDistrict.value = fd;
    toLocationDisplayName.value = fdName;
};

// Şehirler API
const fetchCities = async () => {
    if (apiCities.value.length) return;
    try {
        citiesLoading.value = true;
        const res = await api.get('/locations/cities');
        const content = res.data?.content;
        if (Array.isArray(content)) apiCities.value = content;
    } catch (err) {
        console.error('Şehirler yüklenemedi:', err);
    } finally {
        citiesLoading.value = false;
    }
};

// Varsayılan: Nereden Ankara, Nereye İstanbul
const setDefaultLocations = () => {
    if (apiCities.value.length === 0) return;
    if (!fromCity.value) {
        fromCity.value = apiCities.value.find(c => c.name === 'Ankara') ?? null;
    }
    if (!toCity.value) {
        toCity.value = apiCities.value.find(c => c.name === 'İstanbul') ?? null;
    }
};

// Nereden dropdown açılınca
const openFromDropdown = async () => {
    locationError.value = null;
    fromCitySearch.value = '';
    fromDistrictSearch.value = '';
    await fetchCities();
    setDefaultLocations();
    fromTempCity.value = fromCity.value ?? null;
    fromDistricts.value = [];
    if (fromTempCity.value) {
        try {
            fromDistrictsLoading.value = true;
            const res = await api.get(`/locations/cities/${fromTempCity.value.id}/districts`);
            const content = res.data?.content;
            fromDistricts.value = Array.isArray(content) ? content : [];
        } catch (err) {
            console.error('İlçeler yüklenemedi:', err);
        } finally {
            fromDistrictsLoading.value = false;
        }
    }
};

const selectFromCityTemp = async (city) => {
    fromTempCity.value = city;
    try {
        fromDistrictsLoading.value = true;
        const res = await api.get(`/locations/cities/${city.id}/districts`);
        const content = res.data?.content;
        fromDistricts.value = Array.isArray(content) ? content : [];
    } catch (err) {
        console.error('İlçeler yüklenemedi:', err);
        fromDistricts.value = [];
    } finally {
        fromDistrictsLoading.value = false;
    }
};

const applyFromLocation = (district) => {
    fromCity.value = fromTempCity.value;
    fromDistrict.value = district;
    fromLocationDisplayName.value = null; // Liste seçiminde tam ad yerine Şehir/İlçe kullan
    fromDropdownOpen.value = false;
};

const locationError = ref(null);

// Konum harita modalı: açık mı, hangi alan için (from / to)
const mapModalOpen = ref(false);
const mapModalFor = ref('from'); // 'from' | 'to'
const mapContainerRef = ref(null);
const selectedMapLocation = ref(null); // { lat, lng, name } | null
const mapSearchQuery = ref('');
const mapSearchResults = ref([]);
const mapSearchLoading = ref(false);
let mapSearchDebounceTimer = null;
let leafletMap = null;
let mapMarker = null;

// Leaflet varsayılan ikon yolu Vite'ta bozulabiliyor; düzeltiyoruz
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

function initMap() {
    if (!mapContainerRef.value) return;
    const turkeyCenter = [39, 35];
    const turkeyBounds = [[36, 26], [42, 45]];
    leafletMap = L.map(mapContainerRef.value).setView(turkeyCenter, 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(leafletMap);
    leafletMap.fitBounds(turkeyBounds);
    leafletMap.on('click', async (e) => {
        mapSearchResults.value = [];
        const { lat, lng } = e.latlng;
        if (mapMarker && leafletMap) leafletMap.removeLayer(mapMarker);
        mapMarker = L.marker([lat, lng]).addTo(leafletMap);
        selectedMapLocation.value = { lat, lng, name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, address: null };
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                { headers: { 'Accept-Language': 'tr' } }
            );
            const data = await res.json();
            const name = data.display_name || data.address?.city || data.address?.town || data.address?.village || selectedMapLocation.value.name;
            selectedMapLocation.value = { lat, lng, name, address: data.address };
        } catch (_) {}
    });
    nextTick(() => leafletMap?.invalidateSize());
}

async function searchMapLocations() {
    const q = mapSearchQuery.value?.trim();
    if (!q || q.length < 2) {
        mapSearchResults.value = [];
        return;
    }
    mapSearchLoading.value = true;
    mapSearchResults.value = [];
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=tr&addressdetails=1`,
            { headers: { 'Accept-Language': 'tr' } }
        );
        const data = await res.json();
        mapSearchResults.value = data;
    } catch (_) {
        mapSearchResults.value = [];
    } finally {
        mapSearchLoading.value = false;
    }
}

function debouncedMapSearch() {
    clearTimeout(mapSearchDebounceTimer);
    mapSearchDebounceTimer = setTimeout(searchMapLocations, 300);
}

function closeMapSearchResultsDelayed() {
    setTimeout(() => { mapSearchResults.value = []; }, 200);
}

function goToSearchResult(item) {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const name = item.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    selectedMapLocation.value = { lat, lng, name, address: item.address || null };
    mapSearchResults.value = [];
    mapSearchQuery.value = name;
    if (mapMarker && leafletMap) leafletMap.removeLayer(mapMarker);
    if (leafletMap) {
        mapMarker = L.marker([lat, lng]).addTo(leafletMap);
        leafletMap.flyTo([lat, lng], 15, { duration: 0.5 });
    }
}

function destroyMap() {
    if (mapMarker && leafletMap) {
        leafletMap.removeLayer(mapMarker);
        mapMarker = null;
    }
    if (leafletMap) {
        leafletMap.remove();
        leafletMap = null;
    }
}

watch(mapModalOpen, (open) => {
    if (open) {
        selectedMapLocation.value = null;
        mapSearchQuery.value = '';
        mapSearchResults.value = [];
        nextTick(() => {
            initMap();
            setTimeout(() => leafletMap?.invalidateSize(), 150);
        });
    } else {
        destroyMap();
    }
});

function parseNominatimCityDistrict(addr) {
    if (!addr) return { city: null, district: null };
    const city = addr.state || addr.city || addr.town || addr.village || addr.municipality || null;
    const district = addr.county || addr.suburb || addr.neighbourhood || addr.city_district || null;
    return { city, district };
}

function confirmMapLocation() {
    if (!selectedMapLocation.value) return;
    const { name, address } = selectedMapLocation.value;
    const { city: cityName, district: districtName } = parseNominatimCityDistrict(address);
    const stateValue = cityName && districtName ? `${cityName} / ${districtName}` : cityName || districtName || name;
    if (mapModalFor.value === 'from') {
        fromLocationDisplayName.value = name;
        fromCity.value = cityName ? { id: null, name: cityName } : null;
        fromDistrict.value = districtName ? { id: null, name: districtName } : null;
    } else {
        toLocationDisplayName.value = name;
        toCity.value = cityName ? { id: null, name: cityName } : null;
        toDistrict.value = districtName ? { id: null, name: districtName } : null;
    }
    mapModalOpen.value = false;
}

// Konum seçenekleri: enableHighAccuracy false = ağ konumu (daha az “konum kapalı” hatası)
const geolocationOptions = {
    enableHighAccuracy: false,
    timeout: 15000,
    maximumAge: 60000
};

function setLocationErrorMessage(err) {
    if (err.code === 1) {
        locationError.value = 'Konum kapalı görünüyor. Windows: Ayarlar > Gizlilik ve güvenlik > Konum > “Konum hizmeti”ni açın. Tarayıcıda adres çubuğundaki kilide tıklayıp Konum iznini “İzin ver” yapın.';
    } else if (err.code === 2) {
        locationError.value = 'Konum alınamadı. İnternet bağlantınızı ve Windows konum ayarlarını kontrol edin.';
    } else if (err.code === 3) {
        locationError.value = 'Konum isteği zaman aşımına uğradı. Tekrar deneyin.';
    } else {
        locationError.value = 'Konum kullanılamıyor. Windows Ayarlar > Gizlilik > Konum bölümünde konum hizmetinin açık olduğundan emin olun.';
    }
}

const selectFromLocationByMap = () => {
    locationError.value = null;
    fromDropdownOpen.value = false;
    mapModalFor.value = 'from';
    mapModalOpen.value = true;
};

// Nereye dropdown açılınca
const openToDropdown = async () => {
    locationError.value = null;
    toCitySearch.value = '';
    toDistrictSearch.value = '';
    await fetchCities();
    setDefaultLocations();
    toTempCity.value = toCity.value ?? null;
    toDistricts.value = [];
    if (toTempCity.value) {
        try {
            toDistrictsLoading.value = true;
            const res = await api.get(`/locations/cities/${toTempCity.value.id}/districts`);
            const content = res.data?.content;
            toDistricts.value = Array.isArray(content) ? content : [];
        } catch (err) {
            console.error('İlçeler yüklenemedi:', err);
        } finally {
            toDistrictsLoading.value = false;
        }
    }
};

const selectToCityTemp = async (city) => {
    toTempCity.value = city;
    try {
        toDistrictsLoading.value = true;
        const res = await api.get(`/locations/cities/${city.id}/districts`);
        const content = res.data?.content;
        toDistricts.value = Array.isArray(content) ? content : [];
    } catch (err) {
        console.error('İlçeler yüklenemedi:', err);
        toDistricts.value = [];
    } finally {
        toDistrictsLoading.value = false;
    }
};

const applyToLocation = (district) => {
    toCity.value = toTempCity.value;
    toDistrict.value = district;
    toLocationDisplayName.value = null;
    toDropdownOpen.value = false;
};

const selectToLocationByMap = () => {
    locationError.value = null;
    toDropdownOpen.value = false;
    mapModalFor.value = 'to';
    mapModalOpen.value = true;
};

// Click outside handler: Nereden panelini kapat
const handleClickOutside = (event) => {
    const target = event.target;
    const fromCityDropdown = document.querySelector('[data-from-city-dropdown]');
    if (fromCityDropdown && !fromCityDropdown.contains(target)) {
        fromCityDropdownOpen.value = false;
    }
    if (searchBarRef.value && !searchBarRef.value.contains(target)) {
        fromDropdownOpen.value = false;
        toDropdownOpen.value = false;
    }
};

// İlan listesi tek store'dan (shipments)
const shipmentsStore = useShipmentsStore();
const { list: shipmentsList, myPostList, otherPostList, loading: shipmentsLoading, error: shipmentsError } = storeToRefs(shipmentsStore);

const handleFilterChange = (modelKey) => {
    shipmentsStore.fetchShipments({ filters: { [modelKey]: filters[modelKey] } });    
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    shipmentsStore.fetchShipments();
    fetchCities().then(setDefaultLocations);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

function getSearchFormData() {
    const f_where = fromCity.value && fromDistrict.value
        ? `${fromCity.value.name} / ${fromDistrict.value.name}`
        : fromCity.value?.name ?? null;
    const t_where = toCity.value && toDistrict.value
        ? `${toCity.value.name} / ${toDistrict.value.name}`
        : toCity.value?.name ?? null;
    return {
        f_where,
        t_where,
        f_where_city: fromCity.value?.name ?? null,
        f_where_district: fromDistrict.value?.name ?? null,
        t_where_city: toCity.value?.name ?? null,
        t_where_district: toDistrict.value?.name ?? null,
        departureTime: departureTime.value,
        returnTime: returnTime.value,
        filters: { ...filters },
    };
}

const handleSearch = () => {
    const searchData = getSearchFormData();
    console.log('=== Panel Arama Verisi (API: Şehir / İlçe) ===', searchData);
    shipmentsStore.fetchShipments({
        f_where_city: searchData.f_where_city,
        f_where_district: searchData.f_where_district,
        t_where_city: searchData.t_where_city,
        t_where_district: searchData.t_where_district,
        filters: searchData.filters,
    });
};

const loadMore = () => {
    shipmentsStore.fetchShipments({ append: true });
};
</script>

<style scoped>
/* Modal: Vue Transition hook sınıfları (opacity + child scale – Tailwind ile child selector yok) */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
.modal-enter-active .map-modal-box,
.modal-leave-active .map-modal-box {
    transition: transform 0.2s ease;
}
.modal-enter-from .map-modal-box,
.modal-leave-to .map-modal-box {
    transform: scale(0.95);
}
</style>