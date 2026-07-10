<template>
  <Header />

  <div class="min-h-[calc(100vh-64px)]">
    <Content class="p-0!">
      <div class="flex flex-col md:flex-row gap-3 w-full h-auto">
        <CargoOwner />

        <div
          class="flex-1 md:mt-3 rounded-md flex flex-col gap-4 pb-32 md:pb-28 min-w-0"
        >
          <!-- 1. Ekran: Araç Seçimi -->
          <VehicleSelection v-if="page === 1" ref="vehicleSelectionRef" />

          <!-- 2. Ekran: İlan Tipi Seçimi -->
          <div v-else-if="page === 2" class="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Yük Tipi</h3>
            <h3 class="text-md font-medium text-gray-500 mb-4">Taşıtmak istediğiniz yükün tipini belirtiniz.</h3>
            <p v-if="postTypesLoading" class="text-sm text-gray-500">Yükleniyor...</p>
            <p v-else-if="postTypesError" class="text-sm text-red-600">{{ postTypesError }}</p>
            <div v-else class="flex flex-col gap-4">
              <div class="flex-wrap gap-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 grid-flow-row">
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
              <!-- KDV toggle -->
              <div class="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                  <p class="text-sm font-medium text-gray-800">KDV</p>
                  <p class="text-xs text-gray-500">Fiyat KDV dahil ise açın</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  :aria-checked="isKdv"
                  aria-label="KDV"
                  class="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                  :class="isKdv ? 'bg-primary' : 'bg-gray-300'"
                  @click="isKdv = !isKdv"
                >
                  <span
                    class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                    :class="isKdv ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>
              <!-- Parça yük toggle -->
              <div class="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                  <p class="text-sm font-medium text-gray-800">Parça Yük mü?</p>
                  <p class="text-xs text-gray-500">Kısmi / parça yük taşıması ise açın</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  :aria-checked="partLoad"
                  aria-label="Parça Yük mü?"
                  class="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                  :class="partLoad ? 'bg-primary' : 'bg-gray-300'"
                  @click="partLoad = !partLoad"
                >
                  <span
                    class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                    :class="partLoad ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>
              <!-- Ağırlık input + kg/ton toggle -->
              <div ref="weightSectionRef" class="flex items-stretch w-full">
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
              <div class="w-full rounded-xl border border-amber-100 bg-amber-50/40 p-3 sm:p-4">
                <div class="flex items-start gap-3 w-full">
                  <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-700  items-center justify-center shrink-0 mt-0.5 hidden md:flex">
                    <i class="pi pi-arrow-up-right" style="font-size: 13px;"></i>
                  </div>
                  <div class="w-full">
                    <label class="block text-sm font-semibold text-gray-800 mb-0.5">Yüklenecek Yer</label>
                    <p class="text-xs text-gray-500 mb-2">Yükün alınacağı şehir ve ilçe bilgisini seçin.</p>
                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] gap-2 items-center">
                      <select
                        v-model="yuklenecekYer.city"
                        class="h-12 px-4 rounded-xl border border-white bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        @change="onYuklenecekCityChange"
                      >
                        <option value="">Şehir seçin</option>
                        <option v-for="c in cities" :key="c.id" :value="c.name">{{ c.name }}</option>
                      </select>
                      <select
                        v-model="yuklenecekYer.district"
                        class="h-12 px-4 rounded-xl border border-white bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:opacity-60"
                        :disabled="!yuklenecekYer.city || yuklenecekDistrictsLoading"
                      >
                        <option value="">İlçe seçin</option>
                        <option v-for="d in yuklenecekDistricts" :key="d.id" :value="d.name">{{ d.name }}</option>
                      </select>
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
              <div class="w-full rounded-xl border border-green-100 bg-green-50/40 p-3 sm:p-4">
                <div class="flex items-start gap-3 w-full">
                  <div class="w-8 h-8 rounded-full bg-green-100 text-green-700 md:flex items-center justify-center shrink-0 mt-0.5 hidden">
                    <i class="pi pi-arrow-down-left" style="font-size: 13px;"></i>
                  </div>
                  <div class="w-full">
                    <label class="block text-sm font-semibold text-gray-800 mb-0.5">Boşaltılacak Yer</label>
                    <p class="text-xs text-gray-500 mb-2">Yükün bırakılacağı şehir ve ilçe bilgisini seçin.</p>
                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] gap-2 items-center">
                      <select
                        v-model="bosaltilanYer.city"
                        class="h-12 px-4 rounded-xl border border-white bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        @change="onBosaltilanCityChange"
                      >
                        <option value="">Şehir seçin</option>
                        <option v-for="c in cities" :key="'b-' + c.id" :value="c.name">{{ c.name }}</option>
                      </select>
                      <select
                        v-model="bosaltilanYer.district"
                        class="h-12 px-4 rounded-xl border border-white bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:opacity-60"
                        :disabled="!bosaltilanYer.city || bosaltilanDistrictsLoading"
                      >
                        <option value="">İlçe seçin</option>
                        <option v-for="d in bosaltilanDistricts" :key="d.id" :value="d.name">{{ d.name }}</option>
                      </select>
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

              <!-- Kalkış / Varış saati + Arama ile iletişime geçilebilir (md+ yan yana) -->
              <div class="flex flex-col md:flex-row gap-4 w-full items-stretch">
              <div class="w-full flex-1 min-w-0 rounded-xl border border-blue-100 bg-blue-50/40 p-4 sm:p-5">
                <div class="flex items-start gap-3 w-full">
                  <div class="w-9 h-9 rounded-full bg-blue-100 text-blue-700 items-center justify-center shrink-0 mt-0.5 hidden md:flex">
                    <i class="pi pi-clock" style="font-size: 15px;"></i>
                  </div>
                  <div class="w-full min-w-0">
                    <label class="block text-base font-semibold text-gray-800 mb-1">Kalkış ve Varış Saati</label>
                    <p class="text-sm text-gray-500 mb-3">Saatleri seçin, isterseniz kalkış tarihi de ekleyin.</p>
                    <div class="flex items-center justify-between w-full mb-3 rounded-xl border border-white bg-white px-3 py-2.5 shadow-sm gap-3">
                      <div class="flex flex-col gap-0.5 min-w-0">
                        <span class="text-base font-medium text-gray-800">Kalkış tarihi belirt</span>
                        <span class="text-sm text-gray-500">
                          {{ departureDateEnabled ? 'İlan tarihiniz bitiminde ilandan kaldırılır' : 'İlanınız 3 hafta açık kalır' }}
                        </span>
                      </div>
                    <button
                      type="button"
                      class="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      :class="departureDateEnabled ? 'bg-primary' : 'bg-gray-300'"
                      @click="onToggleDepartureDate"
                    >
                      <span
                        class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200"
                        :class="departureDateEnabled ? 'translate-x-6' : 'translate-x-1'"
                      />
                    </button>
                  </div>
                    <div class="flex-1 flex flex-col md:flex-row gap-2">
                      <DatePicker
                        class="w-full flex-1 h-12 px-4 py-3 rounded-xl border border-white bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base"
                        v-model="departure_time"
                        time-only
                        hour-format="24"
                        :manualInput="false"
                        placeholder="Kalkış saati"
                        :pt="{
                          root: { class: 'flex-1 !text-base' },
                          input: { class: 'h-12 px-4 !rounded-xl !border !border-gray-200 !focus:outline-none !focus:ring-2 !focus:ring-primary/20 focus:border-primary !text-base placeholder:text-base w-full !bg-white' },
                          panel: { class: '!bg-white !mt-2 !border !text-sm !border-gray-200 shadow-lg !rounded-lg' },
                          calendarContainer: { class: '!bg-white' },
                          timePicker: { class: '!bg-white' }
                        }"
                        fluid
                      />
                      <DatePicker
                        class="w-full flex-1 h-12 px-4 py-3 rounded-xl border border-white bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base"
                        v-model="time_arrival"
                        time-only
                        hour-format="24"
                        :manualInput="false"
                        placeholder="Varış saati"
                        :pt="{
                          root: { class: 'flex-1 !text-base' },
                          input: { class: 'h-12 px-4 !rounded-xl !border !border-gray-200 !focus:outline-none !focus:ring-2 !focus:ring-primary/20 focus:border-primary !text-base placeholder:text-base w-full !bg-white' },
                          panel: { class: '!bg-white !mt-2 !border !text-sm !border-gray-200 shadow-lg !rounded-lg' },
                          calendarContainer: { class: '!bg-white' },
                          timePicker: { class: '!bg-white' }
                        }"
                        fluid
                      />
                      <DatePicker
                        v-if="departureDateEnabled"
                        class="w-full flex-1 h-12 px-4 py-3 rounded-xl border border-white bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base"
                        v-model="shipment_date"
                        date-format="dd.mm.yy"
                        placeholder="Tarih seçin"
                        :pt="{
                          root: { class: 'flex-1 !text-base' },
                          input: {
                            class: [
                              'h-12 !p-4 !rounded-xl !border !border-gray-200 !focus:outline-none !focus:ring-2 !focus:ring-primary/20 focus:border-primary !text-base placeholder:text-base w-full',
                              shipment_date ? '!bg-primary/10 cursor-not-allowed' : '!bg-white'
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
                        :max-date="new Date(new Date().setDate(new Date().getDate() + 20))"
                        :manualInput="false"
                        fluid
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full flex-1 min-w-0 flex md:max-w-none">
                <div
                  class="rounded-2xl border border-red-200 bg-linear-to-br from-white to-red-50/70 px-5 py-4 sm:px-6 sm:py-5 w-full flex flex-col justify-center min-h-[132px]"
                >
                  <div class="flex items-center justify-between gap-4">
                    <div class="flex items-start gap-3 min-w-0">
                      <span class="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
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

              <!-- İlan açıklaması (isteğe bağlı) -->
              <div class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 mt-4">
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

              <!-- Mesafe ve süre (her iki yer seçildiğinde) -->
              <div
                v-if="routeInfo"
                ref="routeStatusRef"
                class="mt-4 pt-4 border-t border-gray-100 text-sm gap-4"
              >
                <div class="w-full rounded-2xl border border-indigo-100 bg-linear-to-br from-white to-indigo-50/50 p-4 sm:p-5 shadow-sm">
                  <div class="flex items-center gap-2 mb-4">
                    <span class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <i class="pi pi-map text-xs"></i>
                    </span>
                    <div class="flex flex-col">
                      <span class="text-sm font-semibold text-gray-800">Rota Özeti</span>
                      <span class="text-xs text-gray-500">Adreslere göre hesaplanan tahmini bilgiler</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                    <div class="rounded-xl border border-gray-100 bg-white px-3 py-2.5">
                      <div class="text-[11px] text-gray-500">Mesafe</div>
                      <div class="text-base font-semibold text-gray-800">{{ routeInfo.distance }} km</div>
                    </div>
                    <div class="rounded-xl border border-gray-100 bg-white px-3 py-2.5">
                      <div class="text-[11px] text-gray-500">Tahmini süre</div>
                      <div class="text-base font-semibold text-gray-800">{{ routeInfo.duration }}</div>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 flex-col w-full">
                    <h2 class="text-base font-semibold text-gray-800 mb-1">Fiyat Seçimi</h2>
                    <p class="text-xs text-gray-500 mb-2">Sabit fiyat seçebilir veya teklif toplayabilirsiniz.</p>
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
                          </div>
                          <div class="flex flex-col items-end gap-0.5">
                            <span class="text-lg font-bold text-primary">{{ routeInfo.distance > 30 ? formatPrice(calculateRoutePrice()) : postStore.selectedCar.price }} ₺</span>
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
                    </div>
                  </div>

                </div>
              </div>
              <div
                v-else-if="routeLoading"
                ref="routeStatusRef"
                class="mt-4 pt-4 border-t border-gray-100 flex flex-col items-center justify-center gap-3 py-6"
              >
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
            class="fixed bottom-0 left-0 right-0 w-full overflow-hidden flex justify-between items-center gap-2 px-4 sm:px-6 lg:px-10 bg-white/95 backdrop-blur border-t border-gray-200 py-4 z-20"
          >
            <button
              type="button"
              @click="() => usePostStore().prevPage()"
              class="flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg border-2 cursor-pointer border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all text-sm sm:text-base"
            >
              ← Önceki
            </button>
            <button
              @click="handlePublishOrNext"
              type="button"
              :disabled="!canGoNext || publishLoading"
              class="flex-1 sm:flex-none transition-all duration-200 text-sm sm:text-base"
              :class="publishActionButtonClass"
            >
              <span v-if="publishLoading" class="flex items-center justify-center gap-2">
                <i class="pi pi-spin pi-spinner text-sm"></i> Yayınlanıyor...
              </span>
              <span v-else>{{ page === limit ? 'Yayınla' : 'Sonraki →' }}</span>
            </button>
          </div>
         
        </div>
      </div>
    </Content>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import Header from "@/components/Header.vue";
import Content from "@/components/Content.vue";
import CargoOwner from "@/components/CargoOwner.vue";
import VehicleSelection from "@/components/VehicleSelection.vue";
import { DatePicker } from "primevue";
import api from "@/api";
import { postTypeImageUrl } from "@/lib/catalog-assets";
import { usePostStore } from "@/stores/post";
import { useShipmentsStore } from "@/stores/shipments";
import { useAuthStore } from "@/stores/auth";
import { useLocationStore } from "@/stores/location";
import { resolveCityNameForFilter, pickDistrict } from "@/lib/locations";
import { storeToRefs } from "pinia";

const loadingGifUrl = new URL("../assets/gifs/loading_gif.gif", import.meta.url).href;

const postStore = usePostStore();
const shipmentsStore = useShipmentsStore();
const authStore = useAuthStore();
const locationStore = useLocationStore();
const { page, limit } = storeToRefs(postStore);
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
const departureDateEnabled = ref(true);
const shipment_date = ref(todayStart);

function onToggleDepartureDate() {
  departureDateEnabled.value = !departureDateEnabled.value;
  if (!departureDateEnabled.value) {
    // Tarih belirtilmesin: formdan undefined/null gitsin
    shipment_date.value = null;
  } else {
    // Tekrar açınca varsayılanı doldur
    shipment_date.value = new Date(todayStart);
  }
}

/** Boşaltılacak yer: sadece şehir ve ilçe isimleri */
const bosaltilanYer = ref({ city: '', district: '' });
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

async function applyYuklenecekFromGeo(geoCity, geoDistrict) {
  if (yuklenecekYer.value.city?.trim()) return true;
  const cityName = resolveCityNameForFilter(geoCity, cities.value);
  if (!cityName) return false;

  yuklenecekYer.value.city = cityName;
  await onYuklenecekCityChange();

  if (geoDistrict && yuklenecekDistricts.value.length) {
    const picked = pickDistrict(yuklenecekDistricts.value, geoDistrict);
    if (picked?.name) yuklenecekYer.value.district = picked.name;
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
    const addr = data?.address;
    if (!addr) return { city: null, district: null };
    const isTurkey = (addr.country_code || data.country_code || '').toLowerCase() === 'tr';
    if (isTurkey) {
      return {
        city: addr.state || null,
        district: addr.state_district || addr.county || null,
      };
    }
    return {
      city: addr.state || addr.city || addr.town || addr.village || addr.municipality || null,
      district: addr.state_district || addr.county || null,
    };
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

watch([routeLoading, routeInfo], async ([loading, info]) => {
  if (loading || !info) return;
  await nextTick();
  routeStatusRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function getPostTypeImageUrl(image) {
  return postTypeImageUrl(image);
}

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

/** Son adımdaki «Yayınla» için belirgin dolu CTA; «Sonraki» eski çerçeveli stilde kalır. */
const publishActionButtonClass = computed(() => {
  const isPublish = page.value === limit.value;

  if (isPublish) {
    const base =
      'rounded-2xl border-0 font-semibold px-7 sm:min-w-[11rem] sm:px-12 py-3.5 text-base sm:text-lg tracking-tight';
    if (publishLoading.value) {
      return `${base} bg-primary text-white cursor-wait shadow-lg shadow-primary/30`;
    }
    if (!canGoNext.value) {
      return `${base} bg-gray-100 text-gray-400 cursor-not-allowed shadow-none ring-1 ring-inset ring-gray-200`;
    }
    return `${base} cursor-pointer bg-primary text-white shadow-[0_10px_32px_-8px] shadow-primary/45 hover:shadow-[0_14px_36px_-10px] hover:shadow-primary/55 hover:brightness-[1.03] active:scale-[0.985] ring-1 ring-white/20`;
  }

  if (!canGoNext.value || publishLoading.value) {
    return 'cursor-not-allowed rounded-lg border-2 border-gray-200 text-gray-400 opacity-60 px-4 sm:px-5 py-2';
  }
  return 'cursor-pointer rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white px-4 sm:px-5 py-2';
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
    is_kdv: isKdv.value,
    part_load: partLoad.value,
    /** Yüklenecek yer: sadece şehir ve ilçe isimleri */
    yuklenecekYer: { city: yuklenecekYer.value?.city ?? '', district: yuklenecekYer.value?.district ?? '' },
    /** Boşaltılacak yer: sadece şehir ve ilçe isimleri */
    bosaltilanYer: { city: bosaltilanYer.value?.city ?? '', district: bosaltilanYer.value?.district ?? '' },
    departure_time: formatTimeToHHMM(departure_time.value) ?? undefined,
    time_arrival: formatTimeToHHMM(time_arrival.value) ?? undefined,
    departure_date_enabled: departureDateEnabled.value,
    shipment_date: departureDateEnabled.value ? formatDateToYYYYMMDD(shipment_date.value) ?? undefined : undefined,
    routeInfo: routeInfo.value,
    selectedPriceType: selectedPriceType.value,
    calculatedPrice: price,
    call_verify: canContactByCall.value,
    explanation: explanation.value.trim() || undefined,
  };
}

async function handlePublishOrNext() {
  if (page.value === limit.value) {
    if (!canPublishListing.value) {
      authStore.showPremiumModal = true;
      return;
    }
    publishLoading.value = true;
    const formData = getShipmentFormData();
    await shipmentsStore.logShipmentFormData(formData);
    publishLoading.value = false;
  } else {
    postStore.nextPage();
  }
}

onMounted(() => {
  postStore.resetPage();
});

</script>
