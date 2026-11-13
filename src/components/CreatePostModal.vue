<template>
  <Teleport to="body">
    <Transition name="create-post" appear>
      <div
        v-if="createModalOpen"
        class="fixed inset-0 z-90 flex items-stretch md:items-center justify-center md:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-post-title"
      >
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
        <div
          class="create-post-panel relative w-full md:max-w-5xl h-full md:h-[92vh] bg-gray-50 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-[max-width] duration-300 ease-out"
          :class="{ 'lg:max-w-7xl': showCart }"
        >
          <!-- Başlık + ilerleme -->
          <div class="shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 pt-4 pb-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h2 id="create-post-title" class="text-lg sm:text-xl font-bold text-gray-900">İlan Oluştur</h2>
                <p class="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Adım {{ page }} / {{ limit }} · {{ steps[page - 1]?.title }}
                </p>
              </div>
              <button
                type="button"
                class="p-2 -mr-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Kapat"
                @click="requestClose"
              >
                <i class="pi pi-times" style="font-size: 18px;"></i>
              </button>
            </div>
            <ol class="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              <li v-for="(step, i) in steps" :key="step.title" class="min-w-0">
                <div class="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500 ease-out"
                    :class="i + 1 < page ? 'bg-primary' : 'bg-secondary'"
                    :style="{ width: i + 1 <= page ? '100%' : '0%' }"
                  />
                </div>
                <div
                  class="mt-2 flex items-center gap-2 text-xs sm:text-sm"
                  :class="i + 1 === page ? 'text-gray-900 font-semibold' : i + 1 < page ? 'text-primary font-medium' : 'text-gray-400'"
                >
                  <span
                    class="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0"
                    :class="i + 1 < page ? 'bg-primary text-white' : i + 1 === page ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-500'"
                  >
                    <i v-if="i + 1 < page" class="pi pi-check" style="font-size: 10px;"></i>
                    <template v-else>{{ i + 1 }}</template>
                  </span>
                  <span class="truncate">{{ step.title }}</span>
                </div>
              </li>
            </ol>
          </div>

          <!-- Adım içeriği -->
          <div class="flex-1 min-h-0 flex">
          <div ref="stepBodyRef" class="flex-1 min-w-0 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
            <div class="flex flex-col gap-4 min-w-0">
          <!-- 1. Ekran: Araç Seçimi (çoklu) -->
          <VehicleSelection v-if="page === 1" />

          <div v-else-if="page === 2" class="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Yük Tipi</h3>
            <h3 class="text-md font-medium text-gray-500 mb-4">Taşıtmak istediğiniz yükün tipini belirtiniz.</h3>
            <p v-if="postTypesLoading" class="text-sm text-gray-500">Yükleniyor...</p>
            <p v-else-if="postTypesError" class="text-sm text-red-600">{{ postTypesError }}</p>
            <div v-else class="flex flex-col gap-4">
              <div data-tour="cp-post-types" class="flex-wrap gap-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 grid-flow-row">
                <button
                  v-for="pt in postTypes"
                  :key="pt.id"
                  type="button"
                  @click="onPostTypeSelect(pt)"
                  class="h-32 text-left border-2 rounded-lg p-4 transition-all relative duration-200 hover:border-primary/60 hover:bg-primary/5 overflow-hidden"
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
                    class="w-full h-full object-contain max-h-20 absolute -right-16 sm:-right-24 opacity-60 -bottom-3"
                  />
                </button>
              </div>
              <!-- KDV + Parça yük: kartın tamamı tıklanabilir anahtar; açıkken primary ile dolar -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  v-for="opt in [
                    { key: 'kdv', title: 'KDV', desc: 'Fiyat KDV dahil ise açın', icon: 'pi-percentage', on: isKdv },
                    { key: 'part', title: 'Parça Yük mü?', desc: 'Kısmi / parça yük taşıması ise açın', icon: 'pi-th-large', on: partLoad },
                  ]"
                  :key="opt.key"
                  type="button"
                  role="switch"
                  :aria-checked="opt.on"
                  :aria-label="opt.title"
                  class="group flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  :class="opt.on
                    ? 'border-primary bg-primary/10 shadow-md shadow-primary/15'
                    : 'border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/5'"
                  @click="opt.key === 'kdv' ? (isKdv = !isKdv) : (partLoad = !partLoad)"
                >
                  <span
                    class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200"
                    :class="opt.on ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-primary/10 text-primary group-hover:bg-primary/15'"
                  >
                    <i class="pi" :class="opt.icon" style="font-size: 18px;"></i>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="flex items-center gap-2">
                      <span class="text-sm font-semibold" :class="opt.on ? 'text-primary' : 'text-gray-800'">{{ opt.title }}</span>
                      <span
                        class="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md transition-colors"
                        :class="opt.on ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'"
                      >
                        {{ opt.on ? 'Evet' : 'Hayır' }}
                      </span>
                    </span>
                    <span class="block text-xs text-gray-500 mt-0.5">{{ opt.desc }}</span>
                  </span>
                  <span
                    class="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200"
                    :class="opt.on ? 'bg-primary' : 'bg-gray-300'"
                  >
                    <span
                      class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200"
                      :class="opt.on ? 'translate-x-6' : 'translate-x-1'"
                    />
                  </span>
                </button>
              </div>
              <!-- Ağırlık input + kg/ton toggle -->
              <div ref="weightSectionRef" data-tour="cp-weight" class="flex items-stretch w-full">
                <input
                  ref="weightInputRef"
                  :value="weightValue"
                  type="text"
                  :maxlength="weightUnit === 'kg' ? 6 : 2"
                  inputmode="decimal"
                  :placeholder="weightUnit === 'kg' ? '0 - 25.000 kg aralığında girin' : '0 - 25 ton aralığında girin'"
                  class="flex-1 h-12 py-3 px-4 rounded-l-lg rounded-r-none border border-gray-200 border-r-0 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  @keydown="onWeightKeydown($event)"
                  @input="onWeightInput($event)"
                  @blur="onWeightBlur"
                />
                <div class="flex rounded-r-lg border border-gray-200 overflow-hidden shrink-0">
                  <button
                    type="button"
                    @click="onWeightUnitChange('kg')"
                    class="px-4 py-3 text-sm font-medium transition-colors"
                    :class="weightUnit === 'kg'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'"
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    @click="onWeightUnitChange('ton')"
                    class="px-4 py-3 text-sm font-medium border-l border-gray-200 transition-colors"
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
          <div v-else-if="page === 3" class="w-full bg-white md:border md:border-gray-200 rounded-xl md:shadow-sm overflow-hidden p-4 sm:p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">İlan Detayları</h3>
            <div class="flex flex-col gap-4 w-full">
              <!-- Yüklenecek Yer: Şehir + İlçe + Adreslerim -->
              <div
                data-tour="cp-yuk"
                class="w-full rounded-xl border border-gray-200 bg-white p-3 sm:p-4"
              >
                <div class="flex items-start gap-3 w-full">
                  <div class="w-8 h-8 rounded-full bg-primary/10 text-primary items-center justify-center shrink-0 mt-0.5 hidden md:flex">
                    <i class="pi pi-arrow-up-right" style="font-size: 13px;"></i>
                  </div>
                  <div class="w-full">
                    <label class="block text-sm font-semibold text-gray-800 mb-0.5">Yüklenecek Yer</label>
                    <p class="text-xs text-gray-500 mb-2">Yükün alınacağı konumu haritadan seçin.</p>
                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] gap-2 items-center">
                      <button
                        type="button"
                        data-field="yuk"
                        class="h-12 px-4 rounded-xl border bg-gray-50/60 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm flex items-center justify-between gap-2 text-left transition-all"
                        :class="fieldStateClass('yuk')"
                        @click="openMapPicker('yuklenecek')"
                      >
                        <span class="truncate" :class="yuklenecekYer.city ? 'text-gray-900' : 'text-gray-500'">
                          {{ yuklenecekYer.city || 'Şehir seçin' }}
                        </span>
                        <i class="pi pi-map text-primary shrink-0" style="font-size: 15px;"></i>
                      </button>
                      <!-- Haritadan seçilen konumun il/ilçesi (ilçe seçimi yerine) -->
                      <div
                        class="h-12 px-4 rounded-xl text-sm items-center gap-2 min-w-0"
                        :class="yuklenecekYer.district ? 'flex border border-primary/25 bg-primary/5' : 'hidden sm:flex'"
                      >
                        <template v-if="yuklenecekYer.district">
                          <i class="pi pi-map-marker text-primary shrink-0" style="font-size: 14px;"></i>
                          <span class="truncate text-gray-800">
                            <span class="font-semibold">{{ yuklenecekYer.district }}</span>, {{ yuklenecekYer.city }}
                          </span>
                        </template>
                      </div>
                      <button
                        type="button"
                        class="h-12 px-4 rounded-xl border border-primary/30 bg-white text-primary font-medium text-sm whitespace-nowrap hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 shrink-0"
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
              <div
                data-tour="cp-bos"
                class="w-full rounded-xl border border-gray-200 bg-white p-3 sm:p-4"
              >
                <div class="flex items-start gap-3 w-full">
                  <div class="w-8 h-8 rounded-full bg-secondary/10 text-secondary md:flex items-center justify-center shrink-0 mt-0.5 hidden">
                    <i class="pi pi-arrow-down-left" style="font-size: 13px;"></i>
                  </div>
                  <div class="w-full">
                    <label class="block text-sm font-semibold text-gray-800 mb-0.5">Boşaltılacak Yer</label>
                    <p class="text-xs text-gray-500 mb-2">Yükün bırakılacağı konumu haritadan seçin.</p>
                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] gap-2 items-center">
                      <button
                        type="button"
                        data-field="bos"
                        class="h-12 px-4 rounded-xl border bg-gray-50/60 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm flex items-center justify-between gap-2 text-left transition-all"
                        :class="fieldStateClass('bos')"
                        @click="openMapPicker('bosaltilan')"
                      >
                        <span class="truncate" :class="bosaltilanYer.city ? 'text-gray-900' : 'text-gray-500'">
                          {{ bosaltilanYer.city || 'Şehir seçin' }}
                        </span>
                        <i class="pi pi-map text-primary shrink-0" style="font-size: 15px;"></i>
                      </button>
                      <!-- Haritadan seçilen konumun il/ilçesi (ilçe seçimi yerine) -->
                      <div
                        class="h-12 px-4 rounded-xl text-sm items-center gap-2 min-w-0"
                        :class="bosaltilanYer.district ? 'flex border border-primary/25 bg-primary/5' : 'hidden sm:flex'"
                      >
                        <template v-if="bosaltilanYer.district">
                          <i class="pi pi-map-marker text-primary shrink-0" style="font-size: 14px;"></i>
                          <span class="truncate text-gray-800">
                            <span class="font-semibold">{{ bosaltilanYer.district }}</span>, {{ bosaltilanYer.city }}
                          </span>
                        </template>
                      </div>
                      <button
                        type="button"
                        class="h-12 px-4 rounded-xl border border-primary/30 bg-white text-primary font-medium text-sm whitespace-nowrap hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 shrink-0"
                        @click="openAddressesModal('bosaltilan')"
                      >
                        <i class="pi pi-map-marker" style="font-size: 14px;"></i>
                        Adreslerim
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Rota Özeti: boşaltılacak yerin hemen altında (iki yer de seçilince) -->
              <div
                v-if="routeInfo"
                ref="routeStatusRef"
                class="w-full rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
              >
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <i class="pi pi-map text-xs"></i>
                  </span>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-gray-800">Rota Özeti</span>
                    <span class="text-xs text-gray-500">Adreslere göre hesaplanan tahmini bilgiler</span>
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div class="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                    <div class="text-[11px] text-gray-500">Mesafe</div>
                    <div class="text-base font-semibold text-gray-800">{{ routeInfo.distance }} km</div>
                  </div>
                  <div class="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                    <div class="text-[11px] text-gray-500">Tahmini süre</div>
                    <div class="text-base font-semibold text-gray-800">{{ routeInfo.duration }}</div>
                  </div>
                </div>
              </div>
              <div
                v-else-if="routeLoading"
                ref="routeStatusRef"
                class="w-full rounded-xl border border-gray-200 bg-white flex flex-col items-center justify-center gap-3 py-6"
              >
                <img
                  :src="loadingGifUrl"
                  alt=""
                  class="w-16 h-16 object-contain"
                />
                <p class="text-sm text-gray-600 text-center">Rota Hesaplanıyor</p>
              </div>

              <!-- Haritadan konum seçimi (yüklenecek / boşaltılacak yer) -->
              <MapLocationModal
                v-model="mapPickerOpen"
                :title="mapPickerFor === 'yuklenecek' ? 'Yüklenecek Yer' : 'Boşaltılacak Yer'"
                :initial="mapPickerInitial"
                :resolve-location="resolveMapLocation"
                @confirm="onMapLocationConfirm"
              />

              <!-- Adreslerim modalı: aktif adreslerden seç -->
              <Teleport to="body">
                <Transition name="modal">
                  <div
                    v-show="addressesModalOpen"
                    class="fixed inset-0 z-100 flex items-center justify-center p-4"
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

              <!-- Fiyat Seçimi: Rota Özeti'nin hemen altında -->
              <div
                v-if="routeInfo"
                class="w-full text-sm"
              >
                <div
                  data-tour="cp-price"
                  class="w-full rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
                >
                  <div class="flex items-start gap-2 flex-col w-full">
                    <h2 class="text-base font-semibold text-gray-800 mb-1">Fiyat Seçimi</h2>
                    <p class="text-xs text-gray-500 mb-2">Sabit fiyat seçebilir, teklif toplayabilir veya fiyatı kendiniz belirleyebilirsiniz.</p>
                    <div class="flex flex-col md:flex-wrap md:flex-row gap-3 w-full">
                      <button
                        type="button"
                        @click="selectedPriceType = 'sabit'"
                        class="flex-1 min-w-0 sm:min-w-[312px] text-left border rounded-xl p-4 transition-all duration-200"
                        :class="selectedPriceType === 'sabit'
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5'"
                      >
                        <div class="flex justify-between items-start">
                          <div class="flex flex-col gap-0.5">
                            <span class="text-base font-semibold text-gray-800">Sabit Fiyat</span>
                            <span class="text-sm text-gray-500">Düşünmeden fiyat ver</span>
                            <span v-if="selectedCars.length > 1" class="text-xs text-gray-400">Seçilen araçlar arasındaki en yüksek fiyat</span>
                          </div>
                          <div class="flex flex-col items-end gap-0.5">
                            <span class="text-lg font-bold text-primary">{{ formatPrice(fixedPrice) }} ₺</span>
                            <!-- <span class="text-sm text-gray-400 line-through">24.000 ₺</span>-->
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
                        class="flex-1 min-w-0 sm:min-w-[312px] text-left border rounded-xl p-4 transition-all duration-200"
                        :class="selectedPriceType === 'teklif'
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5'"
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
                      <!-- Mobil `create-post-wizard` «Kendi fiyatım» ile aynı -->
                      <div
                        role="button"
                        tabindex="0"
                        :aria-pressed="selectedPriceType === 'ozel'"
                        class="w-full text-left border rounded-xl p-4 transition-all duration-200 cursor-pointer"
                        :class="selectedPriceType === 'ozel'
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5'"
                        @click="selectCustomPrice"
                        @keydown.enter.self.prevent="selectCustomPrice"
                        @keydown.space.self.prevent="selectCustomPrice"
                      >
                        <div class="flex flex-col gap-0.5">
                          <span class="text-base font-semibold text-gray-800">Kendi fiyatım</span>
                          <span class="text-sm text-gray-500">Taşıma ücretini siz belirleyin</span>
                        </div>
                        <div v-if="selectedPriceType === 'ozel'" class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div class="flex items-center gap-1.5 text-primary text-sm font-medium">
                            <i class="pi pi-check-circle text-base"></i>
                            Seçildi
                          </div>
                          <label class="flex items-center gap-3" @click.stop>
                            <span class="text-sm font-medium text-gray-700">Ücret</span>
                            <span class="relative">
                              <input
                                ref="customPriceInputRef"
                                :value="customPriceValue"
                                type="text"
                                inputmode="decimal"
                                placeholder="15.000,00"
                                data-field="custom_price"
                                class="w-44 h-11 rounded-xl border bg-white pl-3 pr-8 text-right text-base font-semibold text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                :class="fieldStateClass('custom_price')"
                                @input="onCustomPriceInput"
                              />
                              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₺</span>
                            </span>
                          </label>
                        </div>
                        <p
                          v-if="selectedPriceType === 'ozel' && customPriceValue && !customPriceValid"
                          class="mt-2 text-xs text-red-600"
                        >
                          Geçerli bir tutar girin.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Kalkış / Varış saati + Arama ile iletişime geçilebilir (md+ yan yana).
                   Yüklenecek ve boşaltılacak yer seçilip Rota Özeti çıktığında görünür. -->
              <div v-if="routeInfo" class="flex flex-col md:flex-row gap-4 w-full items-stretch">
              <div
                class="w-full flex-1 min-w-0 rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
              >
                <div class="flex items-start gap-3 w-full">
                  <div class="w-9 h-9 rounded-full bg-primary/10 text-primary items-center justify-center shrink-0 mt-0.5 hidden md:flex">
                    <i class="pi pi-clock" style="font-size: 15px;"></i>
                  </div>
                  <div class="w-full min-w-0">
                    <label class="block text-base font-semibold text-gray-800 mb-1">
                      Kalkış ve Varış Saati <span class="text-secondary">*</span>
                    </label>
                    <p class="text-sm text-gray-500 mb-3">
                      Kalkış saati, varış saati ve kalkış tarihini seçin. İlanınız kalkış tarihi geçince yayından kaldırılır.
                    </p>
                    <div class="flex-1 flex flex-col md:flex-row gap-2">
                      <div class="flex-1 flex flex-col">
                      <DatePicker
                        class="w-full flex-1 h-12 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base"
                        v-model="departure_time"
                        data-field="departure_time"
                        time-only
                        hour-format="24"
                        :manualInput="false"
                        placeholder="Kalkış saati"
                        :pt="{
                          root: { class: 'flex-1 !text-base' },
                          input: { class: ['h-12 px-4 !rounded-xl !border !focus:outline-none !focus:ring-2 !focus:ring-primary/20 focus:border-primary !text-base placeholder:text-base w-full !bg-white', invalidFields.departure_time ? fieldStateClass('departure_time') : '!border-gray-200'] },
                          panel: { class: '!bg-white !mt-2 !border !text-sm !border-gray-200 shadow-lg !rounded-lg' },
                          calendarContainer: { class: '!bg-white' },
                          timePicker: { class: '!bg-white' }
                        }"
                        fluid
                      />
                        <p v-if="scheduleCheck.departureError" class="mt-1 text-xs font-semibold text-red-600">{{ scheduleCheck.departureError }}</p>
                      </div>
                      <div class="flex-1 flex flex-col">
                      <DatePicker
                        class="w-full flex-1 h-12 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base"
                        v-model="time_arrival"
                        data-field="time_arrival"
                        time-only
                        hour-format="24"
                        :manualInput="false"
                        placeholder="Varış saati"
                        :pt="{
                          root: { class: 'flex-1 !text-base' },
                          input: { class: ['h-12 px-4 !rounded-xl !border !focus:outline-none !focus:ring-2 !focus:ring-primary/20 focus:border-primary !text-base placeholder:text-base w-full !bg-white', invalidFields.time_arrival ? fieldStateClass('time_arrival') : '!border-gray-200'] },
                          panel: { class: '!bg-white !mt-2 !border !text-sm !border-gray-200 shadow-lg !rounded-lg' },
                          calendarContainer: { class: '!bg-white' },
                          timePicker: { class: '!bg-white' }
                        }"
                        fluid
                      />
                        <!-- Varış ertesi güne (ya da sonrasına) düşüyorsa tarihi küçük yazıyla -->
                        <p v-if="scheduleCheck.arrivalError" class="mt-1 text-xs font-semibold text-red-600">{{ scheduleCheck.arrivalError }}</p>
                        <p v-else-if="scheduleCheck.arrivalDateLabel" class="mt-1 text-xs font-semibold text-gray-500 text-center">{{ scheduleCheck.arrivalDateLabel }}</p>
                      </div>
                      <DatePicker
                        class="w-full flex-1 h-12 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base"
                        v-model="shipment_date"
                        data-field="shipment_date"
                        date-format="dd.mm.yy"
                        placeholder="Kalkış tarihi"
                        :pt="{
                          root: { class: 'flex-1 !text-base' },
                          input: {
                            class: [
                              'h-12 !p-4 !rounded-xl !border !focus:outline-none !focus:ring-2 !focus:ring-primary/20 focus:border-primary !text-base placeholder:text-base w-full',
                              shipment_date ? '!bg-primary/10 cursor-not-allowed' : '!bg-white',
                              invalidFields.shipment_date ? fieldStateClass('shipment_date') : '!border-gray-200'
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
                        :min-date="todayStart"
                        :max-date="departureMaxDate"
                        :manualInput="false"
                        fluid
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full flex-1 min-w-0 flex md:max-w-none">
                <div
                  class="rounded-xl border border-gray-200 bg-white px-5 py-4 sm:px-6 sm:py-5 w-full flex flex-col justify-center min-h-[132px]"
                >
                  <div class="flex items-center justify-between gap-4">
                    <div class="flex items-start gap-3 min-w-0">
                      <span class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <i class="pi pi-phone text-[1.05rem]"></i>
                      </span>
                      <div class="flex flex-col gap-1 min-w-0">
                        <span class="text-base font-semibold text-gray-800 leading-snug">Arama ile iletişime geçilebilir</span>
                        <span class="text-sm text-gray-500 leading-snug">
                          {{ canContactByCall ? 'Taşıyıcıların sizi telefonla aramasına izin verin.' : 'Taşıyıcılar size teklif gönderebilir' }}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 shrink-0"
                      :class="canContactByCall ? 'bg-primary' : 'bg-gray-300'"
                      @click="canContactByCall = !canContactByCall"
                    >
                      <span
                        class="inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200"
                        :class="canContactByCall ? 'translate-x-6' : 'translate-x-1'"
                      />
                    </button>
                  </div>
                </div>
              </div>
              </div>

              <!-- İlan açıklaması (isteğe bağlı) — Rota Özeti ile birlikte görünür -->
              <div
                v-if="routeInfo"
                class="w-full rounded-xl border border-gray-200 bg-white p-4 sm:p-5 mt-4"
              >
                <label class="block text-base font-semibold text-gray-800 mb-0.5">İlan Açıklaması</label>
                <p class="text-sm text-gray-500 mb-3">Taşıyıcılara iletmek istediğiniz ek notlar (isteğe bağlı)</p>
                <textarea
                  v-model="explanation"
                  rows="4"
                  maxlength="500"
                  placeholder="Örn: Yük paletli, forklift ile yüklenecek, teslimat saat 14:00–18:00 arası..."
                  class="w-full min-h-[110px] px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-800 resize-y"
                />
                <p class="text-xs text-gray-400 mt-1 text-right">{{ explanation.length }}/500</p>
              </div>
            </div>
          </div>
            </div>
          </div>

          <!-- Sepet: varyantlı araç seçildiğinde modal genişler ve sağda açılır (geniş ekran) -->
          <Transition name="cart-panel">
            <aside
              v-if="showCart"
              class="hidden lg:flex w-96 shrink-0 border-l border-gray-200 flex-col min-h-0"
              aria-label="Seçilen araçlar"
            >
              <VehicleCart class="flex-1" />
            </aside>
          </Transition>
          </div>

          <!-- Alt bar: Önceki / Sonraki -->
          <div class="shrink-0 flex justify-between items-center gap-2 px-4 sm:px-6 bg-white border-t border-gray-200 py-3 sm:py-4">
            <button
              type="button"
              @click="page === 1 ? requestClose() : postStore.prevPage()"
              class="flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg border-2 cursor-pointer border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all text-sm sm:text-base"
            >
              {{ page === 1 ? 'Vazgeç' : '← Önceki' }}
            </button>
            <button
              @click="handlePublishOrNext"
              type="button"
              data-tour="cp-next"
              :disabled="publishLoading || (page !== limit && !canGoNext)"
              class="flex-1 sm:flex-none transition-all duration-200 text-sm sm:text-base"
              :class="publishActionButtonClass"
            >
              <span v-if="publishLoading" class="flex items-center justify-center gap-2">
                <i class="pi pi-spin pi-spinner text-sm"></i> Yayınlanıyor...
              </span>
              <span v-else>{{ page === limit ? 'Yayınla' : 'Sonraki →' }}</span>
            </button>
          </div>

          <!-- İlk ilan rehber turu (paneldeki "İlanınızı oluşturun" kartından başlar) -->
          <CoachMark
            v-if="tourStep"
            :target="`[data-tour=&quot;${tourStep.target}&quot;]`"
            :step-key="tourStep.key"
            :step-label="`Adım ${tourStep.index + 1} / ${tourStep.total}`"
            :title="tourStep.title"
            :body="tourStep.body"
            :action-label="tourStep.ackLabel || ''"
            :action-disabled="!!tourStep.ackDisabled"
            @action="ackCreatePostTourStep(tourStep.key)"
            @skip="skipCreatePostTour"
          />

          <!-- Kapatma onayı (tarayıcı confirm yerine) -->
          <Transition name="confirm-close">
            <div
              v-if="confirmCloseOpen"
              class="absolute inset-0 z-10 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-[2px]"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-close-title"
              aria-describedby="confirm-close-desc"
              @click.self="confirmCloseOpen = false"
            >
              <div class="confirm-close-card w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 text-center">
                <span class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <i class="pi pi-exclamation-triangle" style="font-size: 24px;"></i>
                </span>
                <h3 id="confirm-close-title" class="text-lg font-bold text-gray-900">İlan kaydedilmeyecek</h3>
                <p id="confirm-close-desc" class="mt-2 text-sm text-gray-500 leading-relaxed">
                  Girdiğiniz bilgiler silinecek. Kapatmak istediğinize emin misiniz?
                </p>
                <div class="mt-6 flex flex-col-reverse sm:flex-row gap-2">
                  <button
                    ref="confirmStayRef"
                    type="button"
                    class="flex-1 h-11 rounded-xl border-2 border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
                    @click="confirmCloseOpen = false"
                  >
                    Devam et
                  </button>
                  <button
                    type="button"
                    class="flex-1 h-11 rounded-xl bg-secondary text-white text-sm font-semibold hover:bg-secondary-dark transition-colors"
                    @click="postStore.closeCreateModal()"
                  >
                    Evet, kapat
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import VehicleSelection from "@/components/VehicleSelection.vue";
import CoachMark from "@/components/CoachMark.vue";
import {
  ackCreatePostTourStep,
  createPostTour,
  markCreatePostTourDone,
  stopCreatePostTourWizard,
} from "@/lib/create-post-tour";
import VehicleCart from "@/components/VehicleCart.vue";
import MapLocationModal from "@/components/MapLocationModal.vue";
import { DatePicker } from "primevue";
import api from "@/api";
import { toast } from "vue-sonner";
import { postTypeImageUrl } from "@/lib/catalog-assets";
import { usePostStore } from "@/stores/post";
import { useShipmentsStore } from "@/stores/shipments";
import { useAuthStore } from "@/stores/auth";
import { useLocationStore } from "@/stores/location";
import {
  resolveCityNameForFilter,
  parseNominatimTurkey,
  matchDistrictFromCandidates,
} from "@/lib/locations";
import { storeToRefs } from "pinia";

const loadingGifUrl = new URL("../assets/gifs/loading_gif.gif", import.meta.url).href;

const postStore = usePostStore();
const shipmentsStore = useShipmentsStore();
const authStore = useAuthStore();
const locationStore = useLocationStore();
const { page, limit, createModalOpen, selectedCars } = storeToRefs(postStore);

const steps = [
  { title: 'Araçlar' },
  { title: 'Yük Bilgisi' },
  { title: 'Rota ve Fiyat' },
];
const stepBodyRef = ref(null);

/** Seçili araçlardan en az birinin varyantı varsa sağdaki sepet paneli açılır */
const showCart = computed(() =>
  page.value === 1 && selectedCars.value.some((s) => s.car.details?.length)
);
const { user: authUser, canPublishListing } = storeToRefs(authStore);
const yukGpsPrefillAttempted = ref(false);

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
/**
 * Yüklenecek yer: şehir ve ilçe isimleri (API'ye giden) + haritadan seçildiyse koordinat.
 * Koordinat sadece rota hesabı ve haritayı aynı noktadan açmak için tutulur.
 */
const yuklenecekYer = ref({ city: '', district: '', lat: null, lng: null, exactLocation: null });
/** Varsayılan kalkış saati: şu andan 1 saat sonrası (saniyesiz). Mobil ile aynı. */
function defaultDepartureTime() {
  const t = new Date(Date.now() + 60 * 60 * 1000);
  t.setSeconds(0, 0);
  return t;
}
/** PrimeVue timeOnly: Date (saat/dakika), formda HH:mm olarak gönderilir. Varsayılan: şimdi + 1 saat */
const departure_time = ref(defaultDepartureTime());
/** Otomatik atanan kalkış saati; kullanıcı seçici ile değiştirince yeni bir Date gelir ve artık otomatik güncellenmez */
let autoDepartureTime = departure_time.value;
/** PrimeVue timeOnly: Date (saat/dakika), formda HH:mm olarak gönderilir */
const time_arrival = ref(null);
/** PrimeVue dateOnly: Date, formda yyyy-MM-dd olarak gönderilir */
const todayStart = (() => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
})();
/** Kalkış tarihi en fazla bugünden 2 ay sonrası seçilebilir (ay sonu taşmaz: 31 Ara → 28/29 Şub). Mobil ve sunucu ile aynı. */
const MAX_DEPARTURE_MONTHS = 2;
const departureMaxDate = (() => {
  const t = new Date(todayStart);
  const day = t.getDate();
  t.setDate(1);
  t.setMonth(t.getMonth() + MAX_DEPARTURE_MONTHS);
  const lastDay = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  t.setDate(Math.min(day, lastDay));
  return t;
})();
/** Kalkış tarihi zorunlu; kullanıcı seçene kadar boş */
const shipment_date = ref(null);

/* ---------- Yayınla: geçersiz alan vurgusu ---------- */
/** Geçersiz alanlar: yuk, bos, departure_time, time_arrival, shipment_date, custom_price */
const invalidFields = ref({});
const shakeActive = ref(false);
let shakeTimer = null;

/** Son adımda eksik/geçersiz alanları bulur (sadece ekranda görünen alanlar) */
function collectPublishErrors() {
  const errors = {};
  if (!yuklenecekYer.value?.city?.trim() || !yuklenecekYer.value?.district?.trim()) errors.yuk = true;
  if (!bosaltilanYer.value?.city?.trim() || !bosaltilanYer.value?.district?.trim()) errors.bos = true;
  // Saat/tarih ve fiyat alanları Rota Özeti çıkınca görünür
  if (routeInfo.value) {
    if (!(departure_time.value instanceof Date) || scheduleCheck.value.departureError) errors.departure_time = true;
    if (!(time_arrival.value instanceof Date) || scheduleCheck.value.arrivalError) errors.time_arrival = true;
    if (!(shipment_date.value instanceof Date)) errors.shipment_date = true;
    if (selectedPriceType.value === 'ozel' && !customPriceValid.value) errors.custom_price = true;
  }
  return errors;
}

/** Eksik alanın uyarıda görünen adı */
const PUBLISH_FIELD_LABELS = {
  yuk: 'Yüklenecek yer',
  bos: 'Boşaltılacak yer',
  departure_time: 'Kalkış saati',
  time_arrival: 'Varış saati',
  shipment_date: 'Kalkış tarihi',
  custom_price: 'Fiyat',
};

/** Geçersizse kırmızı kenarlık + gölge (+ sallanma), değilse normal kenarlık */
function fieldStateClass(key, normalBorder = 'border-gray-200') {
  if (!invalidFields.value[key]) return normalBorder;
  return [
    '!border-red-500 ring-2 ring-red-500/20 shadow-lg shadow-red-500/20',
    shakeActive.value ? 'cp-shake' : '',
  ].join(' ');
}

function triggerShake() {
  clearTimeout(shakeTimer);
  shakeActive.value = false;
  // Sınıfı kaldırıp bir sonraki karede geri ekle: animasyon her tıklamada baştan oynar
  nextTick(() => {
    requestAnimationFrame(() => {
      shakeActive.value = true;
      shakeTimer = setTimeout(() => { shakeActive.value = false; }, 550);
    });
  });
}

/** Geçersiz alanları işaretler; hata yoksa true döner */
function validateBeforePublish() {
  const errors = collectPublishErrors();
  const keys = Object.keys(errors);
  if (!keys.length) {
    invalidFields.value = {};
    return true;
  }
  invalidFields.value = errors;
  triggerShake();
  const missing = keys.map((k) => PUBLISH_FIELD_LABELS[k]).filter(Boolean);
  toast.error('Lütfen eksik bilgileri doldurun', {
    id: 'create-post-missing-fields', // art arda tıklamada üst üste binmesin, güncellensin
    description: missing.length ? `Eksik: ${missing.join(', ')}` : undefined,
    duration: 4000,
  });
  nextTick(() => {
    document
      .querySelector(`[data-field="${keys[0]}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  return false;
}

/** Boşaltılacak yer: yüklenecek yer ile aynı yapı */
const bosaltilanYer = ref({ city: '', district: '', lat: null, lng: null, exactLocation: null });
const cities = ref([]);
const publishLoading = ref(false);
const citiesLoading = ref(false);
const yuklenecekDistricts = ref([]);
const bosaltilanDistricts = ref([]);
const yuklenecekDistrictsLoading = ref(false);
const bosaltilanDistrictsLoading = ref(false);
const routeInfo = ref(null); // { distance: '123 km', duration: '2 saat 15 dk' }
const routeLoading = ref(false);
const routeStatusRef = ref(null);
const selectedPriceType = ref('sabit');
/** «Kendi fiyatım» tutarı — TR biçiminde (15.000,50) */
const customPriceValue = ref('');
const customPriceInputRef = ref(null);

/** "15.000,50" → 15000.5; geçersizse null (mobil `parsePriceInput`) */
function parsePriceInput(str) {
  const s = String(str ?? '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  if (!s) return null;
  const n = parseFloat(s);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

/** Yazarken TR para biçimi: binlik `.`, ondalık `,` (mobil `formatCustomPriceAsTyping`) */
function formatCustomPriceAsTyping(input) {
  const cleaned = String(input ?? '').replace(/[^\d,]/g, '');
  if (!cleaned) return '';
  const commaPos = cleaned.indexOf(',');
  let intPart = commaPos === -1 ? cleaned : cleaned.slice(0, commaPos);
  const decPart = commaPos === -1 ? undefined : cleaned.slice(commaPos + 1).replace(/,/g, '').slice(0, 2);
  const trailingComma = commaPos !== -1 && commaPos === cleaned.length - 1;
  intPart = intPart.replace(/^0+(?=\d)/, '');
  const intFormatted = intPart === '' ? '' : parseInt(intPart, 10).toLocaleString('tr-TR', { maximumFractionDigits: 0 });
  if (trailingComma) return `${intFormatted},`;
  if (decPart !== undefined) return `${intFormatted},${decPart}`;
  return intFormatted;
}

const customPrice = computed(() => parsePriceInput(customPriceValue.value));
const customPriceValid = computed(() => customPrice.value !== null && customPrice.value > 0);

function onCustomPriceInput(e) {
  const formatted = formatCustomPriceAsTyping(e.target.value);
  customPriceValue.value = formatted;
  // Biçimlenen değer yazılandan farklıysa input'u da güncelle (v-model yerine bilinçli)
  if (e.target.value !== formatted) e.target.value = formatted;
}

function selectCustomPrice() {
  if (selectedPriceType.value === 'ozel') return;
  selectedPriceType.value = 'ozel';
  nextTick(() => customPriceInputRef.value?.focus());
}
const canContactByCall = ref(true);
const explanation = ref('');

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
const isKdv = ref(false);
const partLoad = ref(false);
const weightInputRef = ref(null);
const weightSectionRef = ref(null);

async function onPostTypeSelect(postType) {
  postStore.setSelectedPostType(postType);
  await nextTick();
  weightSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => {
    weightInputRef.value?.focus?.();
  }, 250);
}

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

function getWeightMax() {
  return weightUnit.value === 'ton' ? WEIGHT_MAX_TON : WEIGHT_MAX_KG;
}

function clampWeightToMax(num) {
  if (num === null || Number.isNaN(num)) return null;
  return Math.min(Math.max(0, num), getWeightMax());
}

function onWeightInput(event) {
  const raw = String(event.target?.value ?? '').replace(/\s/g, '').replace(/[^\d,.]/g, '');
  const endsWithSep = /[,.]$/.test(raw);
  let num = parseWeightInput(raw);
  if (num === null) {
    weightValue.value = raw;
    return;
  }
  // Ton cinsinde maksimum 25; 25'ten fazla yazıldığında direk 25'e sabitle
  num = clampWeightToMax(num);
  weightValue.value = formatWeightDisplay(num) + (endsWithSep ? ',' : '');
}

function onWeightBlur() {
  const num = parseWeightInput(weightValue.value);
  if (num === null) return;
  const clamped = clampWeightToMax(num);
  if (clamped !== num) weightValue.value = formatWeightDisplay(clamped);
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

/* ---------- Haritadan konum seçimi ---------- */
const mapPickerOpen = ref(false);
const mapPickerFor = ref('yuklenecek'); // 'yuklenecek' | 'bosaltilan'
const mapPickerInitial = computed(() => {
  const target = mapPickerFor.value === 'yuklenecek' ? yuklenecekYer.value : bosaltilanYer.value;
  return target?.lat != null && target?.lng != null ? { lat: target.lat, lng: target.lng } : null;
});

/** İlçe listeleri şehir başına bir kez çekilir (harita her tıklamada tekrar istemesin) */
const districtsCache = new Map();
async function getDistrictsForCity(cityId) {
  if (districtsCache.has(cityId)) return districtsCache.get(cityId);
  const res = await api.get(`/locations/cities/${cityId}/districts`);
  const content = res.data?.content;
  const list = Array.isArray(content) ? content : [];
  districtsCache.set(cityId, list);
  return list;
}

function openMapPicker(forSection) {
  mapPickerFor.value = forSection;
  mapPickerOpen.value = true;
  fetchCities();
}

/**
 * Haritadaki noktayı sistemdeki il/ilçe adlarına çevirir (ilanlar filtrelerde bu adlarla eşleşir).
 * İl: plaka kodu = şehir id'si. İlçe: harita adı listede yoksa ilin Merkez ilçesine düşülür.
 */
async function resolveMapLocation(geo) {
  if (!cities.value.length) await fetchCities();
  const city =
    cities.value.find((c) => c.id === geo.plate) ||
    cities.value.find((c) => c.name === resolveCityNameForFilter(geo.province, cities.value));
  if (!city) return { error: 'Bu nokta için il belirlenemedi. Lütfen başka bir nokta seçin.' };

  if (!geo.districtCandidates?.length) {
    return { error: 'Bu nokta için ilçe belirlenemedi. Lütfen bir yerleşim yerine daha yakın bir nokta seçin.' };
  }

  let districts;
  try {
    districts = await getDistrictsForCity(city.id);
  } catch (_) {
    return { error: 'İlçe listesi alınamadı. Lütfen tekrar deneyin.' };
  }
  const match = matchDistrictFromCandidates(districts, geo.districtCandidates, city.name);
  if (!match) return { error: 'Bu nokta için ilçe belirlenemedi. Lütfen başka bir nokta seçin.' };

  return {
    city: city.name,
    district: match.district.name,
    note: match.approximate ? `Haritadaki ilçe: ${geo.districtCandidates[0]}` : null,
  };
}

function onMapLocationConfirm(loc) {
  const target = mapPickerFor.value === 'yuklenecek' ? yuklenecekYer : bosaltilanYer;
  target.value = {
    city: loc.city,
    district: loc.district,
    lat: loc.lat,
    lng: loc.lng,
    exactLocation: loc.exactLocation ?? null,
  };
}

async function applyYuklenecekFromGeo(geoCity, geoDistrict) {
  if (yuklenecekYer.value.city?.trim()) return true;
  const cityName = resolveCityNameForFilter(geoCity, cities.value);
  if (!cityName) return false;

  yuklenecekYer.value.city = cityName;
  yuklenecekYer.value.lat = null;
  yuklenecekYer.value.lng = null;
  yuklenecekYer.value.exactLocation = null;
  await onYuklenecekCityChange();

  if (geoDistrict && yuklenecekDistricts.value.length) {
    const picked = matchDistrictFromCandidates(yuklenecekDistricts.value, [geoDistrict], cityName);
    if (picked?.district?.name) yuklenecekYer.value.district = picked.district.name;
  }
  return Boolean(yuklenecekYer.value.city?.trim());
}

async function reverseGeocodeCityDistrict(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`,
      { headers: { 'Accept-Language': 'tr' } }
    );
    const data = await res.json();
    if (!data?.address) return { city: null, district: null };
    // Türkiye'de il `province`, ilçe `town` (merkez ilçelerde `city`) alanında gelir
    const geo = parseNominatimTurkey(data);
    if (!geo.inTurkey) return { city: null, district: null };
    return { city: geo.province, district: geo.districtCandidates[0] ?? null };
  } catch (_) {
    return { city: null, district: null };
  }
}

async function prefillYuklenecekFromLocation() {
  if (yuklenecekYer.value.city?.trim()) return;
  if (!cities.value.length) await fetchCities();
  if (!cities.value.length) return;

  if (locationStore.userCity || locationStore.userDistrict) {
    if (await applyYuklenecekFromGeo(locationStore.userCity, locationStore.userDistrict)) return;
  }

  const profileCity = authUser.value?.user_city;
  const profileDistrict = authUser.value?.user_district;
  if (profileCity || profileDistrict) {
    if (await applyYuklenecekFromGeo(profileCity, profileDistrict)) return;
  }

  if (yukGpsPrefillAttempted.value || !navigator.geolocation) return;
  yukGpsPrefillAttempted.value = true;

  await new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { city, district } = await reverseGeocodeCityDistrict(
          position.coords.latitude,
          position.coords.longitude
        );
        await applyYuklenecekFromGeo(city, district);
        resolve();
      },
      () => resolve(),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
    );
  });
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
    // Kayıtlı adreste koordinat yok: rota il/ilçe merkezinden hesaplanır
    yuklenecekYer.value = { city: cityName, district: districtName, lat: null, lng: null, exactLocation: null };
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
    bosaltilanYer.value = { city: cityName, district: districtName, lat: null, lng: null, exactLocation: null };
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
    // Haritadan seçildiyse tam nokta, değilse il/ilçe merkezi kullanılır
    const fromCoords = from.lat != null && from.lng != null
      ? { lat: from.lat, lng: from.lng }
      : await geocodePlace(from.city, from.district);
    const toCoords = to.lat != null && to.lng != null
      ? { lat: to.lat, lng: to.lng }
      : await geocodePlace(to.city, to.district);
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
      routeInfo.value = { distance: `${distKm}`, duration: durationStr, durationSec: durSec };
    }
  } catch (_) {
    routeInfo.value = null;
  } finally {
    routeLoading.value = false;
  }
}

/* ---------- Kalkış / varış saati ---------- */
/** Tarih → "14.11.2026" */
function formatDmy(d) {
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}
/**
 * Kalkış / varış saati kuralları (mobil `checkSchedule` ile aynı):
 * - Kalkış bugünse saati şu andan önce olamaz.
 * - Varış en erken kalkış + rota özetindeki tahmini süredir; varış saati o anın gününe göre yorumlanır,
 *   ondan önceyse hata. Varış kalkıştan sonraki bir güne düşüyorsa tarihi (gg.aa.yyyy) gösterilir.
 */
const scheduleCheck = computed(() => {
  const out = { departureError: null, arrivalError: null, arrivalDateLabel: null };
  const dep = departure_time.value;
  if (!(dep instanceof Date)) return out;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Tarih seçilmediyse bugün varsayılır
  const day = shipment_date.value instanceof Date ? new Date(shipment_date.value) : new Date(today);
  day.setHours(0, 0, 0, 0);
  const departure = new Date(day);
  departure.setHours(dep.getHours(), dep.getMinutes(), 0, 0);
  if (day.getTime() === today.getTime() && departure.getTime() < Date.now() - 60_000) {
    out.departureError = 'Kalkış saati şu anki saatten önce olamaz.';
  }
  const arr = time_arrival.value;
  if (!(arr instanceof Date)) return out;
  const durationSec = routeInfo.value?.durationSec ?? 0;
  const minArrival = new Date(departure.getTime() + Math.round(durationSec / 60) * 60_000);
  const arrival = new Date(minArrival);
  arrival.setHours(arr.getHours(), arr.getMinutes(), 0, 0);
  if (durationSec > 0) {
    if (arrival.getTime() < minArrival.getTime()) {
      const hhmm = `${String(minArrival.getHours()).padStart(2, '0')}:${String(minArrival.getMinutes()).padStart(2, '0')}`;
      const dateSuffix = minArrival.toDateString() !== day.toDateString() ? `, ${formatDmy(minArrival)}` : '';
      out.arrivalError = `Varış saati tahmini sürenin altında olamaz (en erken ${hhmm}${dateSuffix}).`;
      return out;
    }
  } else if (arrival.getTime() <= departure.getTime()) {
    // Süre bilinmiyorsa kalkıştan önceki saat ertesi gün sayılır
    arrival.setDate(arrival.getDate() + 1);
  }
  if (arrival.toDateString() !== day.toDateString()) out.arrivalDateLabel = formatDmy(arrival);
  return out;
});

// Rota adımına gelince kalkış saati elle seçilmediyse güncel "şimdi + 1 saat" olsun (form uzun süre açık kalmış olabilir)
watch(page, (p) => {
  if (p === limit.value && departure_time.value === autoDepartureTime) {
    autoDepartureTime = defaultDepartureTime();
    departure_time.value = autoDepartureTime;
  }
});

// Varış saati = kalkış saati + rota özetindeki tahmini süre (kalkış ya da rota değişince yeniden hesaplanır; elle de değiştirilebilir)
watch(
  () => [departure_time.value, routeInfo.value?.durationSec],
  ([dep, sec]) => {
    if (!(dep instanceof Date) || !sec || sec <= 0) return;
    const arrival = new Date(dep.getTime() + Math.round(sec / 60) * 60 * 1000);
    arrival.setSeconds(0, 0);
    time_arrival.value = arrival;
  }
);

let routeFetchDebounceTimer = null;
watch(
  () => [
    yuklenecekYer.value?.city, yuklenecekYer.value?.district, yuklenecekYer.value?.lat, yuklenecekYer.value?.lng,
    bosaltilanYer.value?.city, bosaltilanYer.value?.district, bosaltilanYer.value?.lat, bosaltilanYer.value?.lng,
  ],
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

watch([routeLoading, routeInfo], async ([loading, info]) => {
  if (loading || !info) return;
  await nextTick();
  routeStatusRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function getPostTypeImageUrl(image) {
  return postTypeImageUrl(image);
}

/** Tek araç için sabit fiyat: 30 km üstünde km başı ücret, altında aracın başlangıç fiyatı */
function carFixedPrice(car) {
  const dist = parseFloat(String(routeInfo.value?.distance ?? '').replace(',', '.')) || 0;
  if (dist > 30 && car?.cost_per_km) return car.cost_per_km * dist;
  return Number(car?.price) || 0;
}

/** Birden fazla araç seçildiyse hepsinin kabul edebileceği fiyat: en yüksek olanı */
const fixedPrice = computed(() =>
  selectedCars.value.reduce((max, s) => Math.max(max, carFixedPrice(s.car)), 0)
);

function formatPrice(value) {
  if (value == null || isNaN(value)) return '0';
  const num = Number(value);
  return num.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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
  async (p) => {
    if (p === 2) fetchPostTypes();
    if (p === 3) {
      await fetchCities();
      await prefillYuklenecekFromLocation();
    }
  },
  { immediate: true }
);

watch(
  () => [
    locationStore.userCity,
    locationStore.userDistrict,
    authUser.value?.user_city,
    authUser.value?.user_district,
  ],
  () => {
    if (page.value === 3) prefillYuklenecekFromLocation();
  }
);

const canGoNext = computed(() => {
  if (page.value === 1) {
    return selectedCars.value.length > 0;
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
      // Kalkış/varış saati ve kalkış tarihi zorunlu
      departure_time.value instanceof Date &&
      time_arrival.value instanceof Date &&
      !scheduleCheck.value.departureError &&
      !scheduleCheck.value.arrivalError &&
      shipment_date.value instanceof Date &&
      !routeLoading.value &&
      !!routeInfo.value &&
      (selectedPriceType.value !== 'ozel' || customPriceValid.value)
    );
  }
  return true;
});

/** Son adımdaki «Yayınla» için belirgin dolu CTA; «Sonraki» eski çerçeveli stilde kalır. */
const publishActionButtonClass = computed(() => {
  const isPublish = page.value === limit.value;

  if (isPublish) {
    const base =
      'rounded-2xl border-0 font-semibold px-7 sm:min-w-[11rem] sm:px-12 py-3.5 text-base sm:text-lg tracking-tight';
    if (publishLoading.value) {
      return `${base} bg-primary text-white cursor-wait shadow-lg shadow-primary/30`;
    }
    // Eksik alan olsa da tıklanabilir: tıklanınca geçersiz alanlar vurgulanır
    return `${base} cursor-pointer bg-primary text-white shadow-[0_10px_32px_-8px] shadow-primary/45 hover:shadow-[0_14px_36px_-10px] hover:shadow-primary/55 hover:brightness-[1.03] active:scale-[0.985] ring-1 ring-white/20`;
  }

  if (!canGoNext.value || publishLoading.value) {
    return 'cursor-not-allowed rounded-lg border-2 border-gray-200 text-gray-400 opacity-60 px-4 sm:px-5 py-2';
  }
  return 'cursor-pointer rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white px-4 sm:px-5 py-2';
});

/** Varyant listesini API'nin beklediği "id1,id2" / "ad1,ad2" biçimine çevirir */
function joinDetails(details) {
  if (!details?.length) return {};
  return {
    id: details.map((d) => d.id).join(','),
    name: details.map((d) => d.name).join(','),
  };
}

function getShipmentFormData() {
  const first = selectedCars.value[0];
  return {
    user: authUser.value ? { ...authUser.value } : null,
    /** Tüm seçili araçlar; ilk eleman ilanın ana aracıdır */
    selectedCars: selectedCars.value.map((s) => {
      const d = joinDetails(s.details);
      return { id: s.car.id, name: s.car.name, detail_id: d.id, detail_name: d.name };
    }),
    selectedCar: first?.car ?? null,
    selectedDetailValues: joinDetails(first?.details),
    selectedPostType: postStore.selectedPostType,
    /** Ağırlık: değer + birim (kg/ton) */
    weight: parseWeightToRaw(weightValue.value) || undefined,
    weight_unit: weightUnit.value,
    is_kdv: isKdv.value,
    part_load: partLoad.value,
    /** Yüklenecek yer: şehir/ilçe (filtre için) + haritadan seçildiyse detaylı konum */
    yuklenecekYer: {
      city: yuklenecekYer.value?.city ?? '',
      district: yuklenecekYer.value?.district ?? '',
      exact_location: yuklenecekYer.value?.exactLocation ?? undefined,
    },
    /** Boşaltılacak yer: yüklenecek yer ile aynı yapı */
    bosaltilanYer: {
      city: bosaltilanYer.value?.city ?? '',
      district: bosaltilanYer.value?.district ?? '',
      exact_location: bosaltilanYer.value?.exactLocation ?? undefined,
    },
    departure_time: formatTimeToHHMM(departure_time.value) ?? undefined,
    time_arrival: formatTimeToHHMM(time_arrival.value) ?? undefined,
    departure_date_enabled: true,
    shipment_date: formatDateToYYYYMMDD(shipment_date.value) ?? undefined,
    routeInfo: routeInfo.value,
    selectedPriceType: selectedPriceType.value,
    calculatedPrice: selectedPriceType.value === 'ozel' ? (customPrice.value ?? 0) : fixedPrice.value,
    call_verify: canContactByCall.value,
    explanation: explanation.value.trim() || undefined,
  };
}

/** Kullanıcı bir alanı düzelttikçe o alanın hata vurgusu kalkar (yeni hata eklenmez) */
watch(
  () => [
    yuklenecekYer.value?.city, yuklenecekYer.value?.district,
    bosaltilanYer.value?.city, bosaltilanYer.value?.district,
    departure_time.value, time_arrival.value, shipment_date.value,
    selectedPriceType.value, customPriceValue.value, routeInfo.value,
  ],
  () => {
    const current = Object.keys(invalidFields.value);
    if (!current.length) return;
    const errors = collectPublishErrors();
    const next = {};
    for (const key of current) if (errors[key]) next[key] = true;
    invalidFields.value = next;
  }
);

async function handlePublishOrNext() {
  if (page.value === limit.value) {
    if (!validateBeforePublish()) return;
    // Yerler seçili ama rota henüz yok: hesaplanıyorsa bekle, hata aldıysa tekrar dene
    if (routeLoading.value) return;
    if (!routeInfo.value) {
      fetchRouteInfo();
      return;
    }
    if (!canGoNext.value) return;
    if (!canPublishListing.value) {
      authStore.showPremiumModal = true;
      return;
    }
    publishLoading.value = true;
    const fromTour = createPostTour.stage === 'wizard';
    const formData = getShipmentFormData();
    const ok = await shipmentsStore.logShipmentFormData(formData);
    publishLoading.value = false;
    if (ok) {
      // İlk ilan yayınlandı: rehber tur bir daha gösterilmez; turla geldiyse tebrik penceresi açılır
      markCreatePostTourDone(authStore.user?.id);
      if (fromTour) createPostTour.successOpen = true;
      postStore.closeCreateModal();
    }
  } else {
    postStore.nextPage();
  }
}

const confirmCloseOpen = ref(false);
const confirmStayRef = ref(null);

/* ---------- İlk ilan rehber turu ---------- */
const TOUR_STEPS = [
  {
    key: 'p1-cars',
    page: 1,
    target: 'cp-cars',
    title: 'Araç tipini seçin',
    body: 'Yükünüzü taşıyabilecek araç tipine tıklayın. Birden fazla araç tipi seçebilirsiniz.',
    done: () => selectedCars.value.length > 0,
  },
  {
    key: 'p1-next',
    page: 1,
    target: 'cp-next',
    title: 'Sonraki adıma geçin',
    body: 'Araç seçimi tamam. Devam etmek için "Sonraki"ye tıklayın.',
    done: () => page.value > 1,
  },
  {
    key: 'p2-type',
    page: 2,
    target: 'cp-post-types',
    title: 'Yük tipini seçin',
    body: 'Taşıtacağınız yükün tipine tıklayın.',
    done: () => !!postStore.selectedPostType,
  },
  {
    key: 'p2-weight',
    page: 2,
    target: 'cp-weight',
    title: 'Ağırlığı girin',
    body: 'Yükün yaklaşık ağırlığını yazın; kg veya ton seçebilirsiniz. Yazdıktan sonra "Tamam"a tıklayın.',
    done: () => !!createPostTour.acked['p2-weight'],
    ackLabel: 'Tamam',
    ackDisabled: () => !canGoNext.value,
  },
  {
    key: 'p2-next',
    page: 2,
    target: 'cp-next',
    title: 'Sonraki adıma geçin',
    body: 'KDV ve parça yük seçenekleri isteğe bağlıdır. Devam etmek için "Sonraki"ye tıklayın.',
    done: () => page.value > 2,
  },
  {
    key: 'p3-yuk',
    page: 3,
    target: 'cp-yuk',
    title: 'Yükleneceği yer',
    body: '"Şehir seçin"e tıklayıp yükün alınacağı konumu haritadan seçin. Kayıtlı adresiniz varsa "Adreslerim"den de seçebilirsiniz.',
    done: () => !!(yuklenecekYer.value?.city && yuklenecekYer.value?.district),
  },
  {
    key: 'p3-bos',
    page: 3,
    target: 'cp-bos',
    title: 'Boşaltılacağı yer',
    body: '"Şehir seçin"e tıklayıp yükün bırakılacağı konumu haritadan seçin. Rota ve fiyat buna göre hesaplanır.',
    done: () => !!(bosaltilanYer.value?.city && bosaltilanYer.value?.district),
  },
  {
    key: 'p3-price',
    page: 3,
    target: 'cp-price',
    title: 'Fiyatı belirleyin',
    body: 'Sabit fiyatı seçebilir, taşıyıcılardan teklif bekleyebilir ya da kendi fiyatınızı girebilirsiniz. Seçince "Tamam"a tıklayın.',
    done: () => !!createPostTour.acked['p3-price'],
    ackLabel: 'Tamam',
    ackDisabled: () => !canGoNext.value,
  },
  {
    key: 'p3-publish',
    page: 3,
    target: 'cp-next',
    title: 'İlanınızı yayınlayın',
    body: 'Her şey hazır. İlanınızı taşıyıcılara göstermek için "Yayınla"ya tıklayın.',
    done: () => false,
  },
];

const tourStep = computed(() => {
  if (createPostTour.stage !== 'wizard') return null;
  // Üstte açılan pencereler varken tur bekler (karartma onların üstüne binmesin)
  if (addressesModalOpen.value || confirmCloseOpen.value || authStore.showPremiumModal || publishLoading.value) return null;
  const index = TOUR_STEPS.findIndex((s) => s.page === page.value && !s.done());
  if (index < 0) return null;
  const s = TOUR_STEPS[index];
  return {
    key: s.key,
    target: s.target,
    title: s.title,
    body: s.body,
    ackLabel: s.ackLabel,
    ackDisabled: s.ackDisabled ? s.ackDisabled() : false,
    index,
    total: TOUR_STEPS.length,
  };
});

function skipCreatePostTour() {
  markCreatePostTourDone(authStore.user?.id);
}

// Modal yayınlamadan kapatılırsa tur panelde karttan yeniden başlar
onBeforeUnmount(() => {
  if (createPostTour.stage === 'wizard') stopCreatePostTourWizard();
});

/** Seçim yapıldıysa yanlışlıkla kapatmaya karşı onay iste */
async function requestClose() {
  if (publishLoading.value) return;
  const hasProgress = selectedCars.value.length > 0 || page.value > 1;
  if (!hasProgress) {
    postStore.closeCreateModal();
    return;
  }
  confirmCloseOpen.value = true;
  await nextTick();
  confirmStayRef.value?.focus();
}

function onKeydown(event) {
  if (event.key !== 'Escape' || addressesModalOpen.value) return;
  if (confirmCloseOpen.value) confirmCloseOpen.value = false;
  else requestClose();
}

watch(page, async () => {
  await nextTick();
  stepBodyRef.value?.scrollTo({ top: 0 });
});

let previousBodyOverflow = '';
onMounted(() => {
  postStore.resetPage();
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  document.body.style.overflow = previousBodyOverflow;
  window.removeEventListener('keydown', onKeydown);
});

</script>

<style scoped>
.create-post-enter-active,
.create-post-leave-active {
  transition: opacity 0.2s ease;
}
.create-post-enter-active .create-post-panel,
.create-post-leave-active .create-post-panel {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.create-post-enter-from,
.create-post-leave-to {
  opacity: 0;
}
.confirm-close-enter-active,
.confirm-close-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-close-enter-active .confirm-close-card,
.confirm-close-leave-active .confirm-close-card {
  transition: transform 0.2s ease;
}
.confirm-close-enter-from,
.confirm-close-leave-to {
  opacity: 0;
}
.confirm-close-enter-from .confirm-close-card,
.confirm-close-leave-to .confirm-close-card {
  transform: scale(0.95);
}
.cart-panel-enter-active,
.cart-panel-leave-active {
  transition: opacity 0.25s ease, transform 0.3s ease;
}
.cart-panel-enter-from,
.cart-panel-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
.create-post-enter-from .create-post-panel,
.create-post-leave-to .create-post-panel {
  transform: translateY(16px) scale(0.98);
  opacity: 0;
}
</style>
