<template>
  <Header />

  <div class="h-[calc(100vh-64px)]">
    <Content>
      <div class="flex flex-row gap-3 w-full h-auto">
        <CargoOwner />

        <div
          class="flex-1 mt-3 rounded-md flex flex-col overflow-y-scroll no_scrool pb-4 gap-4"
        >
          <!-- 1. Ekran: Araç Seçimi -->
          <VehicleSelection v-if="page === 1" ref="vehicleSelectionRef" />

          <!-- 2. Ekran: İlan Tipi Seçimi -->
          <div v-else-if="page === 2" class="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Yük Tipi</h3>
            <h3 class="text-md font-medium text-gray-500 mb-4">Taşıtmak istediğiniz yükün tipini belirtiniz.</h3>
            <p v-if="postTypesLoading" class="text-sm text-gray-500">Yükleniyor...</p>
            <p v-else-if="postTypesError" class="text-sm text-red-600">{{ postTypesError }}</p>
            <div v-else class="flex flex-col gap-4">
              <div class="flex-wrap gap-3 grid grid-cols-3 grid-flow-row">
                <button
                  v-for="pt in postTypes"
                  :key="pt.id"
                  type="button"
                  @click="postStore.setSelectedPostType(pt)"
                  class="h-32 text-left border-2 rounded-lg p-4 transition-all reltive duration-200 hover:border-primary/60 hover:bg-primary/5 overflow-hidden"
                  :class="postStore.selectedPostType?.id === pt.id
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30 relative overflow-hidden'
                    : 'border-gray-200 bg-white relative overflow-hidden'"
                >
                  <span class="text-base font-semibold text-gray-800">{{ pt.value }}</span>
                  <div v-if="postStore.selectedPostType?.id === pt.id" class="mt-2 flex items-center gap-1.5 text-primary text-sm font-medium">
                    <i class="pi pi-check-circle text-base"></i>
                    Seçildi
                  </div>
                  <img
                    v-if="pt.image"
                    :src="getPostTypeImageUrl(pt.image)"
                    :alt="pt.value"
                    :class="{'opacity-100': postStore.selectedPostType?.id === pt.id}"
                    class="w-full h-full object-contain max-h-20 absolute -right-24 opacity-60 -bottom-3"
                  />
                </button>
              </div>
              <!-- Ağırlık input + kg/ton toggle -->
              <div class="flex items-center gap-2 w-full">
                <input
                  :value="weightValue"
                  type="text"
                  inputmode="decimal"
                  :placeholder="weightUnit === 'kg' ? '0 - 25.000 kg aralığında girin' : '0 - 25 ton aralığında girin'"
                  class="flex-1 h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  @keydown="onWeightKeydown($event)"
                  @input="onWeightInput($event)"
                />
                <div class="flex rounded-lg border border-gray-200 overflow-hidden shrink-0">
                  <button
                    type="button"
                    @click="onWeightUnitChange('kg')"
                    class="px-4 py-2.5 text-sm font-medium transition-colors"
                    :class="weightUnit === 'kg'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'"
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    @click="onWeightUnitChange('ton')"
                    class="px-4 py-2.5 text-sm font-medium border-l border-gray-200 transition-colors"
                    :class="weightUnit === 'ton'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'"
                  >
                    ton
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Ekran: İlan Detayları (Yüklenecek/Boşaltılan Yer, Fiyatlar) -->
          <div v-else-if="page === 3" class="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">İlan Detayları</h3>
            <div class="flex flex-col gap-4 w-full">
              <!-- Yüklenecek Yer: Şehir + İlçe + Adreslerim -->
              <div class="flex items-center gap-2 w-full">
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2 pl-6">Yüklenecek Yer</label>
                  <div class="flex items-center gap-2 w-full">
                    <div class="w-4 h-4 rounded-full bg-amber-200 inline-block shrink-0"></div>
                    <div class="flex-1 grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                      <select
                        v-model="yuklenecekYer.city"
                        class="h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        @change="onYuklenecekCityChange"
                      >
                        <option value="">Şehir seçin</option>
                        <option v-for="c in cities" :key="c.id" :value="c.name">{{ c.name }}</option>
                      </select>
                      <select
                        v-model="yuklenecekYer.district"
                        class="h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:opacity-60"
                        :disabled="!yuklenecekYer.city || yuklenecekDistrictsLoading"
                      >
                        <option value="">İlçe seçin</option>
                        <option v-for="d in yuklenecekDistricts" :key="d.id" :value="d.name">{{ d.name }}</option>
                      </select>
                      <button
                        type="button"
                        class="h-12 px-4 rounded-lg border border-primary text-primary font-medium text-sm whitespace-nowrap hover:bg-primary/5 transition-colors flex items-center gap-2 shrink-0"
                        @click="openAddressesModal('yuklenecek')"
                      >
                        <i class="pi pi-map-marker" style="font-size: 14px;"></i>
                        Adreslerim
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Boşaltılacak Yer: Şehir + İlçe + Adreslerim -->
              <div class="flex items-center gap-2 w-full">
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2 pl-6">Boşaltılacak Yer</label>
                  <div class="flex items-center gap-2 w-full">
                    <div class="w-4 h-4 rounded-full bg-green-200 inline-block shrink-0"></div>
                    <div class="flex-1 grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                      <select
                        v-model="bosaltilanYer.city"
                        class="h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        @change="onBosaltilanCityChange"
                      >
                        <option value="">Şehir seçin</option>
                        <option v-for="c in cities" :key="'b-' + c.id" :value="c.name">{{ c.name }}</option>
                      </select>
                      <select
                        v-model="bosaltilanYer.district"
                        class="h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:opacity-60"
                        :disabled="!bosaltilanYer.city || bosaltilanDistrictsLoading"
                      >
                        <option value="">İlçe seçin</option>
                        <option v-for="d in bosaltilanDistricts" :key="d.id" :value="d.name">{{ d.name }}</option>
                      </select>
                      <button
                        type="button"
                        class="h-12 px-4 rounded-lg border border-primary text-primary font-medium text-sm whitespace-nowrap hover:bg-primary/5 transition-colors flex items-center gap-2 shrink-0"
                        @click="openAddressesModal('bosaltilan')"
                      >
                        <i class="pi pi-map-marker" style="font-size: 14px;"></i>
                        Adreslerim
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Adreslerim modalı: aktif adreslerden seç -->
              <Teleport to="body">
                <Transition name="modal">
                  <div
                    v-show="addressesModalOpen"
                    class="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="addresses-modal-title"
                  >
                    <div class="absolute inset-0 bg-black/50" @click="closeAddressesModal" />
                    <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-5 max-h-[85vh] flex flex-col">
                      <div class="flex items-center justify-between mb-4 shrink-0">
                        <h2 id="addresses-modal-title" class="text-lg font-semibold text-gray-900">
                          Adreslerimden Seç
                        </h2>
                        <button
                          type="button"
                          class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          aria-label="Kapat"
                          @click="closeAddressesModal"
                        >
                          <i class="pi pi-times" style="font-size: 18px;"></i>
                        </button>
                      </div>
                      <template v-if="userAddressesLoading">
                        <div class="flex flex-col items-center justify-center py-8">
                          <span class="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin block mb-3" />
                          <p class="text-gray-500 text-sm">Adresler yükleniyor...</p>
                        </div>
                      </template>
                      <template v-else-if="activeAddresses.length === 0">
                        <p class="text-gray-500 text-sm py-6 text-center">Aktif adresiniz bulunmuyor. Hesap ayarlarından adres ekleyebilirsiniz.</p>
                      </template>
                      <ul v-else class="overflow-y-auto space-y-2 pr-1">
                        <li
                          v-for="addr in activeAddresses"
                          :key="addr.id"
                          class="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                          :class="{ 'border-primary bg-primary/10': selectedAddressId === addr.id }"
                          @click="selectAddressFromModal(addr)"
                        >
                          <div class="font-medium text-gray-900">{{ addr.name }}</div>
                          <div class="text-sm text-gray-600">{{ addr.city }} / {{ addr.district }}</div>
                          <div v-if="addr.description" class="text-xs text-gray-500 mt-1 line-clamp-2">{{ addr.description }}</div>
                        </li>
                      </ul>
                      <div class="mt-4 pt-3 border-t border-gray-100 shrink-0">
                        <button
                          type="button"
                          class="w-full py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium text-sm transition-colors"
                          @click="closeAddressesModal"
                        >
                          İptal
                        </button>
                      </div>
                    </div>
                  </div>
                </Transition>
              </Teleport>

              <!-- Kalkış / Varış saati + Tarih (3 grid, PrimeVue) -->
              <div class="flex items-center gap-2 w-full">
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2 pl-6">Kalkış, Varış Saati ve Tarihi</label>
                  <div class="flex items-center gap-2 w-full">
                    <div class="w-4 h-4 rounded-full bg-blue-200 inline-block shrink-0"></div>
                    <div class="flex-1 flex gap-2">
                      <DatePicker
                        class="w-full flex-1 h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        v-model="departure_time"
                        time-only
                        hour-format="24"
                        placeholder="Kalkış saati"
                        :pt="{
                          root: { class: 'flex-1 !text-sm' },
                          input: { class: 'h-12 px-4 !rounded-lg !border !border-gray-200 !focus:outline-none !focus:ring-2 !focus:ring-primary/20 focus:border-primary !text-sm placeholder:text-sm w-full' },
                          panel: { class: '!bg-white !mt-2 !border !text-sm !border-gray-200 shadow-lg !rounded-lg' },
                          calendarContainer: { class: '!bg-white' },
                          timePicker: { class: '!bg-white' }
                        }"
                        fluid
                      />
                      <DatePicker
                        class="w-full flex-1 h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        v-model="time_arrival"
                        time-only
                        hour-format="24"
                        placeholder="Varış saati"
                        :pt="{
                          root: { class: 'flex-1 !text-sm' },
                          input: { class: 'h-12 px-4 !rounded-lg !border !border-gray-200 !focus:outline-none !focus:ring-2 !focus:ring-primary/20 focus:border-primary !text-sm placeholder:text-sm w-full' },
                          panel: { class: '!bg-white !mt-2 !border !text-sm !border-gray-200 shadow-lg !rounded-lg' },
                          calendarContainer: { class: '!bg-white' },
                          timePicker: { class: '!bg-white' }
                        }"
                        fluid
                      />
                      <DatePicker
                        class="w-full flex-1 h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        v-model="shipment_date"
                        date-format="dd.mm.yy"
                        placeholder="Tarih seçin"
                        :pt="{
                          root: { class: 'flex-1 !text-sm' },
                          input: {
                            class: [
                              'h-12 !p-4 !rounded-lg !border !border-gray-200 !focus:outline-none !focus:ring-2 !focus:ring-primary/20 focus:border-primary !text-sm placeholder:text-sm w-full',
                              shipment_date ? '!bg-primary/10 cursor-not-allowed' : '!bg-gray-100'
                            ]
                          },
                          panel: { class: '!bg-white !mt-2 !border !text-sm !border-gray-200 !text-gray-800 shadow-lg !rounded-lg !p-4' },
                          calendarContainer: { class: '!bg-white !text-gray-800' },
                          calendar: { class: '!text-gray-800' },
                          header: { class: '!text-gray-800' },
                          title: { class: '!text-gray-800' },
                          selectYear: { class: '!text-gray-800' },
                          selectMonth: { class: '!text-gray-800' },
                          weekDay: { class: '!text-gray-800' },
                          tableHeader: { class: '!text-gray-800' },
                          tableHeaderCell: { class: '!text-gray-800' },
                          timePicker: { class: '!bg-white' },
                          day: (arg) => {
                            const ctx = arg?.context ?? arg ?? {};
                            const dateMeta = ctx.date;
                            const selected = ctx.selected;
                            const selectable = dateMeta ? (ctx.disabled === false || dateMeta.selectable) : false;
                            if (!dateMeta) {
                              return { class: '!bg-white !text-gray-800' };
                            }
                            const d = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
                            const todayStart = new Date();
                            todayStart.setHours(0, 0, 0, 0);
                            d.setHours(0, 0, 0, 0);
                            const isPast = d < todayStart;
                            if (selected) {
                              return { class: '!bg-primary !text-white !font-bold !rounded-md' };
                            }
                            if (isPast) {
                              return { class: '!bg-gray-100 !text-gray-400 !opacity-60 cursor-not-allowed' };
                            }
                            if (selectable) {
                              return { class: '!bg-white !text-gray-800 hover:!bg-primary/10 hover:!text-primary' };
                            }
                            return { class: '!bg-gray-100 !text-gray-400 !opacity-50 cursor-not-allowed' };
                          }
                        }"
                        :min-date="new Date()"
                        :max-date="new Date(new Date().setDate(new Date().getDate() + 14))"
                        :manualInput="false"
                        fluid
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mesafe ve süre (her iki yer seçildiğinde) -->
              <div
                v-if="routeInfo"
                class="mt-4 pt-4 border-t border-gray-100 flex gap-6 text-sm"
              >
                <div class="flex flex-col gap-4">
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500">Mesafe:</span>
                    <span class="font-semibold text-gray-800">{{ routeInfo.distance }} km</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500">Tahmini süre:</span>
                    <span class="font-semibold text-gray-800">{{ routeInfo.duration }}</span>
                  </div>

                  <div class="flex items-start gap-2 mt-5 flex-col w-full">
                    <h2 class="text-base font-semibold text-gray-800 mb-2">Fiyatlar</h2>
                    <div class="flex flex-wrap gap-3 w-full max-w-[780px]">
                      <button
                        type="button"
                        @click="selectedPriceType = 'sabit'"
                        class="flex-1 min-w-[312px] text-left border-2 rounded-lg p-4 transition-all duration-200 hover:border-primary/60 hover:bg-primary/5"
                        :class="selectedPriceType === 'sabit'
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                          : 'border-gray-200 bg-white'"
                      >
                        <div class="flex justify-between items-start">
                          <div class="flex flex-col gap-0.5">
                            <span class="text-base font-semibold text-gray-800">Sabit Fiyat</span>
                            <span class="text-sm text-gray-500">Düşünmeden fiyat ver</span>
                          </div>
                          <div class="flex flex-col items-end gap-0.5">
                            <span class="text-lg font-bold text-primary">{{ routeInfo.distance > 30 ? formatPrice(calculateRoutePrice()) : postStore.selectedCar.price }} ₺</span>
                            <span class="text-sm text-gray-400 line-through">24.000 ₺</span>
                          </div>
                        </div>
                        <div v-if="selectedPriceType === 'sabit'" class="mt-3 flex items-center gap-1.5 text-primary text-sm font-medium">
                          <i class="pi pi-check-circle text-base"></i>
                          Seçildi
                        </div>
                      </button>
                      <button
                        type="button"
                        @click="selectedPriceType = 'teklif'"
                        class="flex-1 min-w-[312px] text-left border-2 rounded-lg p-4 transition-all duration-200 hover:ring-2 hover:ring-primary/30 hover:border-primary/60 hover:bg-primary/5"
                        :class="selectedPriceType === 'teklif'
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                          : 'border-gray-200 bg-white'"
                      >
                        <div class="flex justify-between items-start">
                          <div class="flex flex-col gap-0.5">
                            <span class="text-base font-semibold text-gray-800">Sürücü ile görüş</span>
                            <span class="text-sm text-gray-500">Taşıyıcılardan teklif bekle</span>
                          </div>
                        </div>
                        <div v-if="selectedPriceType === 'teklif'" class="mt-3 flex items-center gap-1.5 text-primary text-sm font-medium">
                          <i class="pi pi-check-circle text-base"></i>
                          Seçildi
                        </div>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
              <div v-else-if="routeLoading" class="mt-4 pt-4 border-t border-gray-100 flex flex-col items-center justify-center gap-3 py-6">
                <img
                  :src="loadingGifUrl"
                  alt=""
                  class="w-16 h-16 object-contain"
                />
                <p class="text-sm text-gray-600 text-center">Rota Hesaplanıyor</p>
              </div>
            </div>
          </div>

          <!-- Pagination: Sol Sonraki / Sağ Önceki -->
          <div
            class="w-full  overflow-hidden flex justify-between items-center"
          >
            <button
              type="button"
              @click="() => usePostStore().prevPage()"
              class="px-5 py-2 rounded-lg border-2 cursor-pointer border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all"
            >
              ← Önceki
            </button>
            <button
              @click="handlePublishOrNext"
              type="button"
              :disabled="!canGoNext"
              class="px-5 py-2 rounded-lg border-2 transition-all"
              :class="canGoNext
                ? 'cursor-pointer border-primary text-primary font-medium hover:bg-primary hover:text-white'
                : 'cursor-not-allowed border-gray-200 text-gray-400 opacity-60'"
            >
              {{ page === limit ? 'Yayınla' : 'Sonraki →' }}
            </button>
          </div>
         
        </div>
      </div>
    </Content>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Header from "@/components/Header.vue";
import Content from "@/components/Content.vue";
import CargoOwner from "@/components/CargoOwner.vue";
import VehicleSelection from "@/components/VehicleSelection.vue";
import { DatePicker } from "primevue";
import api from "@/api";
import { usePostStore } from "@/stores/post";
import { useShipmentsStore } from "@/stores/shipments";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

const loadingGifUrl = new URL("../assets/gifs/loading_gif.gif", import.meta.url).href;

const postStore = usePostStore();
const shipmentsStore = useShipmentsStore();
const authStore = useAuthStore();
const { page, limit } = storeToRefs(postStore);
const { user: authUser } = storeToRefs(authStore);

/** Sadece aktif adresler (modal listesi) */
const activeAddresses = computed(() => {
  const list = userAddresses.value ?? [];
  return list.filter((a) => a.status === 'active');
});

/** Modalda hangi adresin seçili görüneceği: mevcut şehir/ilçe ile eşleşen */
const selectedAddressId = computed(() => {
  if (!addressesModalOpen.value) return null;
  const target = addressesModalFor.value === 'yuklenecek' ? yuklenecekYer.value : bosaltilanYer.value;
  const addr = activeAddresses.value.find(
    (a) => a.city === target?.city && a.district === target?.district
  );
  return addr?.id ?? null;
});
const vehicleSelectionRef = ref(null);
/** Yüklenecek yer: sadece şehir ve ilçe isimleri */
const yuklenecekYer = ref({ city: '', district: '' });
/** PrimeVue timeOnly: Date (saat/dakika), formda HH:mm olarak gönderilir */
const departure_time = ref(null);
/** PrimeVue timeOnly: Date (saat/dakika), formda HH:mm olarak gönderilir */
const time_arrival = ref(null);
/** PrimeVue dateOnly: Date, formda yyyy-MM-dd olarak gönderilir */
const todayStart = (() => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
})();
const shipment_date = ref(todayStart);
/** Boşaltılacak yer: sadece şehir ve ilçe isimleri */
const bosaltilanYer = ref({ city: '', district: '' });
const cities = ref([]);
const citiesLoading = ref(false);
const yuklenecekDistricts = ref([]);
const bosaltilanDistricts = ref([]);
const yuklenecekDistrictsLoading = ref(false);
const bosaltilanDistrictsLoading = ref(false);
const routeInfo = ref(null); // { distance: '123 km', duration: '2 saat 15 dk' }
const routeLoading = ref(false);
const selectedPriceType = ref('sabit');

/** Adreslerim modalı: yüklenecek/boşaltılacak yer için aktif adreslerden seçim */
const addressesModalOpen = ref(false);
const addressesModalFor = ref('yuklenecek'); // 'yuklenecek' | 'bosaltilan'
const userAddresses = ref([]);
const userAddressesLoading = ref(false);
const postTypes = ref([]);
const postTypesLoading = ref(false);
const postTypesError = ref(null);
/** Ağırlık (Yük Tipi sayfası): değer + birim (kg default) */
const weightValue = ref('');
const weightUnit = ref('kg');

function onWeightUnitChange(unit) {
  weightUnit.value = unit;
  weightValue.value = '';
}

/** Kullanıcı girdisini sayıya çevirir (sadece rakam + virgül/nokta ondalık) */
function parseWeightInput(str) {
  const s = String(str ?? '').replace(/\s/g, '');
  if (s === '') return null;
  const normalized = s.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(normalized);
  return Number.isNaN(num) ? null : num;
}

/** Sayıyı Türkçe ondalık formatında gösterir (1.234,50) */
function formatWeightDisplay(num) {
  if (num === null || num === undefined || Number.isNaN(num)) return '';
  const n = Number(num);
  return n.toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/** API için: formatlı string → ham sayı string */
function parseWeightToRaw(formattedStr) {
  const num = parseWeightInput(formattedStr);
  if (num === null) return '';
  return num % 1 === 0 ? String(num) : String(num);
}

/** Sadece rakam, virgül ve noktaya izin ver; harf ve diğer karakterleri engelle */
function onWeightKeydown(event) {
  const key = event.key;
  if (key.length === 1 && !/[\d,.]/.test(key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
  }
}

const WEIGHT_MAX_KG = 25000;
const WEIGHT_MAX_TON = 25;

function onWeightInput(event) {
  const raw = String(event.target?.value ?? '').replace(/\s/g, '').replace(/[^\d,.]/g, '');
  const endsWithSep = /[,.]$/.test(raw);
  let num = parseWeightInput(raw);
  if (num === null) {
    weightValue.value = raw;
    return;
  }
  const max = weightUnit.value === 'ton' ? WEIGHT_MAX_TON : WEIGHT_MAX_KG;
  num = Math.min(Math.max(0, num), max);
  weightValue.value = formatWeightDisplay(num) + (endsWithSep ? ',' : '');
}

async function fetchCities() {
  if (cities.value.length) return;
  citiesLoading.value = true;
  try {
    const res = await api.get('/locations/cities');
    const content = res.data?.content;
    cities.value = Array.isArray(content) ? content : [];
  } catch (_) {
    cities.value = [];
  } finally {
    citiesLoading.value = false;
  }
}

async function onYuklenecekCityChange() {
  yuklenecekYer.value.district = '';
  yuklenecekDistricts.value = [];
  const city = cities.value.find((c) => c.name === yuklenecekYer.value.city);
  if (!city?.id) return;
  yuklenecekDistrictsLoading.value = true;
  try {
    const res = await api.get(`/locations/cities/${city.id}/districts`);
    const content = res.data?.content;
    yuklenecekDistricts.value = Array.isArray(content) ? content : [];
  } catch (_) {
    yuklenecekDistricts.value = [];
  } finally {
    yuklenecekDistrictsLoading.value = false;
  }
}

async function onBosaltilanCityChange() {
  bosaltilanYer.value.district = '';
  bosaltilanDistricts.value = [];
  const city = cities.value.find((c) => c.name === bosaltilanYer.value.city);
  if (!city?.id) return;
  bosaltilanDistrictsLoading.value = true;
  try {
    const res = await api.get(`/locations/cities/${city.id}/districts`);
    const content = res.data?.content;
    bosaltilanDistricts.value = Array.isArray(content) ? content : [];
  } catch (_) {
    bosaltilanDistricts.value = [];
  } finally {
    bosaltilanDistrictsLoading.value = false;
  }
}

async function fetchUserAddresses() {
  userAddressesLoading.value = true;
  userAddresses.value = [];
  try {
    const res = await api.get('/addresses');
    const content = res.data?.content;
    const list = content?.addresses ?? [];
    userAddresses.value = Array.isArray(list) ? list : [];
  } catch (_) {
    userAddresses.value = [];
  } finally {
    userAddressesLoading.value = false;
  }
}

function openAddressesModal(forSection) {
  addressesModalFor.value = forSection;
  addressesModalOpen.value = true;
  fetchUserAddresses();
}

function closeAddressesModal() {
  addressesModalOpen.value = false;
}

/** Seçilen adresi ilgili yere (yüklenecek/boşaltılacak) yazar ve ilçe listesini yükler */
async function selectAddressFromModal(addr) {
  const cityName = addr.city ?? '';
  const districtName = addr.district ?? '';
  if (!cityName) return;
  if (addressesModalFor.value === 'yuklenecek') {
    yuklenecekYer.value.city = cityName;
    yuklenecekYer.value.district = districtName;
    const city = cities.value.find((c) => c.name === cityName);
    if (city?.id) {
      yuklenecekDistricts.value = [];
      yuklenecekDistrictsLoading.value = true;
      try {
        const res = await api.get(`/locations/cities/${city.id}/districts`);
        const content = res.data?.content;
        yuklenecekDistricts.value = Array.isArray(content) ? content : [];
      } catch (_) {
        yuklenecekDistricts.value = [];
      } finally {
        yuklenecekDistrictsLoading.value = false;
      }
    }
  } else {
    bosaltilanYer.value.city = cityName;
    bosaltilanYer.value.district = districtName;
    const city = cities.value.find((c) => c.name === cityName);
    if (city?.id) {
      bosaltilanDistricts.value = [];
      bosaltilanDistrictsLoading.value = true;
      try {
        const res = await api.get(`/locations/cities/${city.id}/districts`);
        const content = res.data?.content;
        bosaltilanDistricts.value = Array.isArray(content) ? content : [];
      } catch (_) {
        bosaltilanDistricts.value = [];
      } finally {
        bosaltilanDistrictsLoading.value = false;
      }
    }
  }
  closeAddressesModal();
}

async function geocodePlace(cityName, districtName) {
  const queries = [
    [cityName, districtName, 'Türkiye'].filter(Boolean).join(', '),
    [cityName, 'Türkiye'].filter(Boolean).join(', ')
  ].filter((q, i, arr) => q && (i === 0 || q !== arr[0]));
  for (const q of queries) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=tr`,
        { headers: { 'Accept-Language': 'tr' } }
      );
      const data = await res.json();
      const item = data?.[0];
      if (item?.lat != null && item?.lon != null) return { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
    } catch (_) {}
  }
  return null;
}

async function fetchRouteInfo() {
  const from = yuklenecekYer.value;
  const to = bosaltilanYer.value;
  if (!from?.city || !from?.district || !to?.city || !to?.district) {
    routeInfo.value = null;
    routeLoading.value = false;
    return;
  }
  routeLoading.value = true;
  try {
    const fromCoords = await geocodePlace(from.city, from.district);
    const toCoords = await geocodePlace(to.city, to.district);
    if (!fromCoords || !toCoords) {
      routeLoading.value = false;
      return;
    }
    const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords.lng},${fromCoords.lat};${toCoords.lng},${toCoords.lat}?overview=false`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === 'Ok' && data.routes?.[0]) {
      const route = data.routes[0];
      const distKm = (route.distance / 1000).toFixed(1);
      const durSec = route.duration;
      const hours = Math.floor(durSec / 3600);
      const mins = Math.round((durSec % 3600) / 60);
      const durationStr = hours > 0
        ? `${hours} saat ${mins > 0 ? mins + ' dk' : ''}`.trim()
        : `${mins} dk`;
      routeInfo.value = { distance: `${distKm}`, duration: durationStr };
    }
  } catch (_) {
    routeInfo.value = null;
  } finally {
    routeLoading.value = false;
  }
}

let routeFetchDebounceTimer = null;
watch(
  () => [yuklenecekYer.value?.city, yuklenecekYer.value?.district, bosaltilanYer.value?.city, bosaltilanYer.value?.district],
  () => {
    const from = yuklenecekYer.value;
    const to = bosaltilanYer.value;
    const hasAll = from?.city && from?.district && to?.city && to?.district;
    if (!hasAll) {
      routeInfo.value = null;
      if (routeFetchDebounceTimer) clearTimeout(routeFetchDebounceTimer);
      routeFetchDebounceTimer = null;
      return;
    }
    if (routeFetchDebounceTimer) clearTimeout(routeFetchDebounceTimer);
    routeFetchDebounceTimer = setTimeout(() => {
      routeFetchDebounceTimer = null;
      fetchRouteInfo();
    }, 400);
  },
  { deep: true }
);

const postTypeImages = import.meta.glob('../assets/images/post_types/*', { eager: true, import: 'default' });

function calculateRoutePrice() {
  const car = postStore.selectedCar;
  if (!car?.cost_per_km || !routeInfo.value?.distance) return 0;
  const dist = parseFloat(String(routeInfo.value.distance).replace(',', '.')) || 0;
  return car.cost_per_km * dist;
}

function formatPrice(value) {
  if (value == null || isNaN(value)) return '0';
  const num = Number(value);
  return num.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getPostTypeImageUrl(image) {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  const filename = image.includes('.') ? image : image + '.png';
  const key = Object.keys(postTypeImages).find((k) => k.endsWith(filename));
  return key ? postTypeImages[key] : '';
}

/** PrimeVue timeOnly Date → "HH:mm" */
function formatTimeToHHMM(date) {
  if (!date || !(date instanceof Date)) return undefined;
  const h = date.getHours();
  const m = date.getMinutes();
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** PrimeVue date Date → "yyyy-MM-dd" */
function formatDateToYYYYMMDD(date) {
  if (!date || !(date instanceof Date)) return undefined;
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

async function fetchPostTypes() {
  if (postTypes.value.length) return;
  postTypesLoading.value = true;
  postTypesError.value = null;
  try {
    const res = await api.get('/post-types');
    const content = res.data?.content;
    postTypes.value = content?.post_types ?? [];
  } catch (err) {
    postTypesError.value = err.response?.data?.message ?? err.message ?? 'İlan tipleri yüklenemedi';
    postTypes.value = [];
  } finally {
    postTypesLoading.value = false;
  }
}

watch(
  page,
  (p) => {
    if (p === 2) fetchPostTypes();
    if (p === 3) fetchCities();
  },
  { immediate: true }
);

const canGoNext = computed(() => {
  if (page.value === 1) {
    return !!postStore.selectedCar;
  }
  if (page.value === 2) {
    const w = String(weightValue.value ?? '').trim();
    if (!postStore.selectedPostType || w === '') return false;
    const num = parseWeightInput(w);
    if (num === null || num < 0) return false;
    const max = weightUnit.value === 'ton' ? 25 : 25000;
    return num <= max;
  }
  if (page.value === 3) {
    return !!(
      yuklenecekYer.value?.city?.trim() &&
      yuklenecekYer.value?.district?.trim() &&
      bosaltilanYer.value?.city?.trim() &&
      bosaltilanYer.value?.district?.trim() &&
      !routeLoading.value &&
      !!routeInfo.value
    );
  }
  return true;
});

function getShipmentFormData() {
  const car = postStore.selectedCar;
  const dist = routeInfo.value?.distance ? parseFloat(String(routeInfo.value.distance).replace(',', '.')) : 0;
  const price = car?.cost_per_km && dist ? car.cost_per_km * dist : car?.price ?? 0;
  return {
    user: authUser.value ? { ...authUser.value } : null,
    selectedCar: car,
    selectedDetailValues: { ...postStore.selectedDetailValues },
    selectedPostType: postStore.selectedPostType,
    /** Ağırlık: değer + birim (kg/ton) */
    weight: parseWeightToRaw(weightValue.value) || undefined,
    weight_unit: weightUnit.value,
    /** Yüklenecek yer: sadece şehir ve ilçe isimleri */
    yuklenecekYer: { city: yuklenecekYer.value?.city ?? '', district: yuklenecekYer.value?.district ?? '' },
    /** Boşaltılacak yer: sadece şehir ve ilçe isimleri */
    bosaltilanYer: { city: bosaltilanYer.value?.city ?? '', district: bosaltilanYer.value?.district ?? '' },
    departure_time: formatTimeToHHMM(departure_time.value) ?? undefined,
    time_arrival: formatTimeToHHMM(time_arrival.value) ?? undefined,
    shipment_date: formatDateToYYYYMMDD(shipment_date.value) ?? undefined,
    routeInfo: routeInfo.value,
    selectedPriceType: selectedPriceType.value,
    calculatedPrice: price,
  };
}

function handlePublishOrNext() {
  if (page.value === limit.value) {
    const formData = getShipmentFormData();
    shipmentsStore.logShipmentFormData(formData);
  } else {
    postStore.nextPage();
  }
}

onMounted(() => {
  postStore.resetPage();
});

</script>
