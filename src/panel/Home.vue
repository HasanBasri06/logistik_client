<template>
    <div class="h-screen overflow-hidden flex flex-col">
        <Header />
        <!-- Arama Alanı (responsive) -->
        <div class="w-full bg-white border-b border-gray-200 py-2 sm:py-2 flex flex-col items-center shrink-0 relative " ref="searchBarRef">
            <div class="w-full flex flex-col max-w-[1200px] mx-auto px-3 sm:px-4 relative">
                <!-- Mobil: tek input → tıklanınca filtre modalı açılır (vue3-tour: #tour-mobil-arama) -->
                <div
                    id="tour-mobil-arama"
                    class="sm:hidden flex items-center gap-2 w-full h-12 px-4 rounded-xl border bg-gray-50 cursor-pointer transition-colors"
                    :class="(fromCity || fromDistrict) && (toCity || toDistrict) ? 'border-2 border-primary' : 'border-gray-200'"
                    @click="mobileFilterOpen = true"
                >
                    <span class="text-gray-400 shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </span>
                    <span class="text-sm text-gray-600 truncate flex-1">{{ mobileSearchSummary }}</span>
                    <button
                        v-if="hasSearchLocations"
                        type="button"
                        class="flex items-center justify-center w-7 h-7 shrink-0 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                        aria-label="Aramayı temizle"
                        @click.stop="clearSearchLocations"
                    >
                        <i class="pi pi-times text-xs"></i>
                    </button>
                    <ChevronDown class="w-5 h-5 text-gray-400 shrink-0" />
                </div>

                <!-- Masaüstü: tüm arama alanları -->
                <div class="hidden sm:flex flex-wrap items-stretch gap-2 sm:gap-3 min-h-12 sm:h-14 py-2">
                    <!-- Nereden -->
                    <div
                        id="tour-nereden"
                        class="flex-1 min-w-0 sm:min-w-0 sm:w-[334px] bg-white border border-gray-200 px-3 rounded-lg cursor-pointer shrink-0 sm:shrink-0 flex items-center h-10 sm:h-full order-1"
                        @click="toDropdownOpen = false; fromDropdownOpen = !fromDropdownOpen; fromDropdownOpen && openFromDropdown()"
                    >
                        <span class="text-sm text-gray-600 truncate block">{{ fromLocationLabel }}</span>
                    </div>

                    <!-- Swap Butonu -->
                    <button
                        @click="swapCities"
                        class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-700 cursor-pointer transition-all duration-200 shrink-0 hover:border-primary hover:bg-primary/5 hover:text-primary active:scale-95 order-2"
                        type="button"
                    >
                        <ArrowLeftRight size="20" />
                    </button>

                    <!-- Nereye -->
                    <div
                        id="tour-nereye"
                        class="flex-1 min-w-0 sm:min-w-0 sm:w-[334px] bg-white border border-gray-200 px-3 rounded-lg cursor-pointer shrink-0 sm:shrink-0 flex items-center h-10 sm:h-full order-3"
                        @click="fromDropdownOpen = false; toDropdownOpen = !toDropdownOpen; toDropdownOpen && openToDropdown()"
                    >
                        <span class="text-sm text-gray-600 truncate block">{{ toLocationLabel }}</span>
                    </div>

                    <!-- Gidiş ve Dönüş Saati -->
                    <div id="tour-gidis-donus" class="flex gap-2 sm:gap-3 flex-1 min-w-0 order-4 sm:order-4 basis-full sm:basis-auto sm:flex-initial">
                        <div
                            class="flex-1 min-w-0 sm:w-[130px] bg-white px-2 sm:px-3 rounded-lg border border-gray-200 min-h-10 sm:min-h-0"
                            @click="fromDropdownOpen = false; toDropdownOpen = false"
                        >
                            <DatePicker
                                v-model="departureTime"
                                :pt="{
                                    root: { class: 'flex items-center h-full min-h-10 sm:min-h-0' },
                                    input: { class: 'py-2 text-sm' },
                                    panel: { class: '!bg-white !border !border-gray-100 shadow-lg !p-3 rounded-lg' },
                                    header: { class: '!bg-white' },
                                    tableHeaderCell: { class: '!bg-white' },
                                    tableBody: { class: '!bg-white' },
                                    tableBodyRow: { class: '!bg-white' }
                                }"
                                id="datepicker-departure"
                                placeholder="Gidiş"
                                fluid
                            />
                        </div>
                        <div
                            class="flex-1 min-w-0 sm:w-[130px] bg-white px-2 sm:px-3 rounded-lg border border-gray-200 min-h-10 sm:min-h-0"
                            @click="fromDropdownOpen = false; toDropdownOpen = false"
                        >
                            <DatePicker
                                v-model="returnTime"
                                :pt="{
                                    root: { class: 'flex items-center h-full min-h-10 sm:min-h-0' },
                                    input: { class: 'py-2 text-sm' },
                                    panel: { class: '!bg-white !border !border-gray-100 shadow-lg !p-3 rounded-lg' },
                                    header: { class: '!bg-white' },
                                    tableHeaderCell: { class: '!bg-white' },
                                    tableBody: { class: '!bg-white' },
                                    tableBodyRow: { class: '!bg-white' }
                                }"
                                id="datepicker-return"
                                placeholder="Dönüş"
                                fluid
                            />
                        </div>
                    </div>
                    <div class="w-full sm:w-auto shrink-0 order-5 min-h-10 sm:min-h-0 sm:self-stretch flex items-stretch gap-1.5">
                        
                        <button
                            @click="handleSearch"
                            class="flex-1 sm:max-w-[150px] px-6 h-full min-h-10 sm:min-h-0 bg-primary rounded-lg text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                        >
                            Ara
                        </button>

                        <button
                            v-if="hasSearchLocations"
                            type="button"
                            class="flex items-center justify-center w-10 h-full min-h-10 sm:min-h-0 shrink-0 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                            aria-label="Aramayı temizle"
                            @click="clearSearchLocations"
                        >
                            <i class="pi pi-times text-sm"></i>
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
                        class="absolute left-0 right-0 top-full mt-1 z-50 w-full h-[400px] rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden"
                    >
                        <div class="grid grid-cols-3 w-full h-full divide-x divide-gray-200">
                            <div class="flex flex-col overflow-hidden">
                                <h3 class="px-3 py-2.5 text-sm font-semibold text-gray-800 border-b border-gray-200 bg-gray-50/70">Şehirler</h3>
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
                                        :class="['w-full text-left px-2 py-1.5 rounded text-sm font-semibold', fromTempCity?.id === c.id ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100']"
                                    >
                                        {{ c.name }}
                                    </button>
                                </div>
                            </div>
                            <div class="flex flex-col overflow-hidden">
                                <h3 class="px-3 py-2.5 text-sm font-semibold text-gray-800 border-b border-gray-200 bg-gray-50/70">İlçeler</h3>
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
                                        :class="['w-full text-left px-2 py-1.5 rounded text-sm font-semibold', isFromDistrictSelected(d) ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100']"
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
                                    <template v-if="authStore.isAuthenticated">
                                        <button
                                            type="button"
                                            @click="selectFromLocationByMap"
                                            class="w-full mt-auto flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                                        >
                                            <MapPin class="w-4 h-4 shrink-0" />
                                            Konum ile seç
                                        </button>
                                        <p v-if="locationError && fromDropdownOpen" class="text-xs text-amber-600 mt-1">{{ locationError }}</p>
                                    </template>
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
                                <h3 class="px-3 py-2.5 text-sm font-semibold text-gray-800 border-b border-gray-200 bg-gray-50/70">Şehirler</h3>
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
                                        :class="['w-full text-left px-2 py-1.5 rounded text-sm font-semibold', toTempCity?.id === c.id ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100']"
                                    >
                                        {{ c.name }}
                                    </button>
                                </div>
                            </div>
                            <div class="flex flex-col overflow-hidden">
                                <h3 class="px-3 py-2.5 text-sm font-semibold text-gray-800 border-b border-gray-200 bg-gray-50/70">İlçeler</h3>
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
                                        :class="['w-full text-left px-2 py-1.5 rounded text-sm font-semibold', isToDistrictSelected(d) ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100']"
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
                                    <template v-if="authStore.isAuthenticated">
                                        <button
                                            type="button"
                                            @click="selectToLocationByMap"
                                            class="w-full mt-auto flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                                        >
                                            <MapPin class="w-4 h-4 shrink-0" />
                                            Konum ile seç
                                        </button>
                                        <p v-if="locationError && toDropdownOpen" class="text-xs text-amber-600 mt-1">{{ locationError }}</p>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <!-- Mobil: Filtreleme full modal (Nereden → Nereye) -->
        <Teleport to="body">
            <Transition name="modal">
                <div
                    v-if="mobileFilterOpen"
                    class="fixed inset-0 z-[100] flex flex-col bg-gradient-to-b from-gray-50 to-white sm:hidden"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="mobile-filter-title"
                >
                    <!-- Header -->
                    <div class="flex items-center justify-between shrink-0 px-4 py-4 pb-2">
                        <h2 id="mobile-filter-title" class="text-xl font-bold text-gray-900 tracking-tight">Arama</h2>
                        <button
                            type="button"
                            class="p-2.5 -mr-2 rounded-full text-gray-500 hover:bg-gray-200/80 hover:text-gray-800 transition-colors"
                            aria-label="Kapat"
                            @click="mobileFilterOpen = false; fromDropdownOpen = false; toDropdownOpen = false"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div class="flex-1 overflow-y-auto px-4 pb-4 space-y-5">
                        <!-- Nereden / Nereye kartları -->
                        <div class="space-y-3">
                            <div
                                class="w-full min-h-[56px] pl-4 pr-4 py-3 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-center cursor-pointer active:scale-[0.99] transition-transform hover:border-primary/30 hover:shadow-md"
                                @click="mobileLocationPickerFor = 'from'; openFromDropdown(); mobileLocationPickerOpen = true"
                            >
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0 mr-3">
                                    <MapPin class="w-4 h-4" />
                                </span>
                                <div class="flex-1 min-w-0">
                                    <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Nereden</p>
                                    <p class="text-sm font-semibold text-gray-800 truncate">{{ fromLocationLabel || 'Şehir veya ilçe seçin' }}</p>
                                </div>
                                <ChevronDown class="w-5 h-5 text-gray-400 shrink-0" />
                            </div>
                            <!-- Swap -->
                            <div class="flex justify-center -my-1">
                                <button
                                    type="button"
                                    @click="swapCities"
                                    class="flex items-center justify-center w-11 h-11 rounded-full bg-white border-2 border-gray-200 shadow-sm text-gray-600 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all active:scale-95"
                                >
                                    <ArrowLeftRight size="20" />
                                </button>
                            </div>
                            <div
                                class="w-full min-h-[56px] pl-4 pr-4 py-3 mt-3 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-center cursor-pointer active:scale-[0.99] transition-transform hover:border-primary/30 hover:shadow-md"
                                @click="mobileLocationPickerFor = 'to'; openToDropdown(); mobileLocationPickerOpen = true"
                            >
                                <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0 mr-3">
                                    <MapPin class="w-4 h-4" />
                                </span>
                                <div class="flex-1 min-w-0">
                                    <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Nereye</p>
                                    <p class="text-sm font-semibold text-gray-800 truncate">{{ toLocationLabel || 'Şehir veya ilçe seçin' }}</p>
                                </div>
                                <ChevronDown class="w-5 h-5 text-gray-400 shrink-0" />
                            </div>
                        </div>
                        <!-- Tarih alanları (vue3-tour mobil: #tour-mobil-gidis-donus) -->
                        <div id="tour-mobil-gidis-donus" class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 ml-0.5">Gidiş</label>
                                <div class="rounded-2xl border border-gray-200/80 p-3 bg-white shadow-sm overflow-hidden" @click="fromDropdownOpen = false; toDropdownOpen = false">
                                    <DatePicker
                                        v-model="departureTime"
                                        :pt="{ root: { class: 'w-full' }, input: { class: 'py-3 text-sm w-full rounded-2xl' }, panel: { class: '!bg-white !border !border-gray-100 shadow-lg !p-3 rounded-xl' } }"
                                        placeholder="Tarih seçin"
                                        fluid
                                    />
                                </div>
                            </div>
                            <div>
                                <label class="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 ml-0.5">Dönüş</label>
                                <div class="rounded-2xl border border-gray-200/80 p-3 bg-white shadow-sm overflow-hidden" @click="fromDropdownOpen = false; toDropdownOpen = false">
                                    <DatePicker
                                        v-model="returnTime"
                                        :pt="{ root: { class: 'w-full' }, input: { class: 'py-3 text-sm w-full rounded-2xl' }, panel: { class: '!bg-white !border !border-gray-100 shadow-lg !p-3 rounded-xl' } }"
                                        placeholder="Tarih seçin"
                                        fluid
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            class="w-full py-3.5 rounded-2xl border-2 border-dashed border-gray-200 text-gray-600 text-sm font-medium hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                            @click="clearMobileSearchLocations"
                        >
                            Seçilenleri Temizle
                        </button>
                    </div>
                    <div class="shrink-0 p-4 pt-3 bg-white/80 backdrop-blur-sm border-t border-gray-100">
                        <button
                            type="button"
                            @click="handleSearch(); mobileFilterOpen = false"
                            class="w-full h-14 bg-primary rounded-2xl text-base font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-[0.99] transition-all"
                        >
                            Ara
                        </button>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Mobil: Şehir/İlçe seçim full modal (Nereden veya Nereye - web ile aynı ekran) -->
        <Teleport to="body">
            <Transition name="modal">
                <div
                    v-if="mobileLocationPickerOpen"
                    class="fixed inset-0 z-[101] flex flex-col bg-white sm:hidden"
                    role="dialog"
                    aria-modal="true"
                    :aria-labelledby="mobileLocationPickerFor === 'from' ? 'mobile-location-from-title' : 'mobile-location-to-title'"
                >
                    <div class="flex items-center gap-3 shrink-0 px-4 py-3 border-b border-gray-200">
                        <button
                            type="button"
                            class="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
                            aria-label="Geri"
                            @click="mobileLocationPickerOpen = false"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h2 :id="mobileLocationPickerFor === 'from' ? 'mobile-location-from-title' : 'mobile-location-to-title'" class="text-lg font-semibold text-gray-900">
                            {{ mobileLocationPickerFor === 'from' ? 'Nereden' : 'Nereye' }} seçin
                        </h2>
                    </div>
                    <div class="mx-4 mb-3 flex items-center justify-between gap-3 px-3 py-3 rounded-2xl border border-gray-200 bg-slate-50 shrink-0">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-gray-900">Doğrulanmış profil görüntüle</p>
                            <p class="text-xs text-gray-500 mt-0.5">Yalnızca onaylı hesaplara ait ilanlar listelenir</p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            :aria-checked="isVerifiedProfileFilterEnabled"
                            aria-label="Doğrulanmış profil görüntüle"
                            class="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                            :class="isVerifiedProfileFilterEnabled ? 'bg-primary' : 'bg-gray-300'"
                            @click="onToggleVerifiedProfileFilter(!isVerifiedProfileFilterEnabled)"
                        >
                            <span
                                class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                                :class="isVerifiedProfileFilterEnabled ? 'translate-x-6' : 'translate-x-1'"
                            />
                        </button>
                    </div>
                    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <!-- Web ile aynı: 3 bölüm (Şehirler | İlçeler | Seçilen) -->
                        <div class="grid grid-cols-3 flex-1 divide-x divide-gray-200 min-h-0">
                            <!-- Şehirler -->
                            <div class="flex flex-col overflow-hidden">
                                <h3 class="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100 shrink-0">Şehirler</h3>
                                <div class="p-2 border-b border-gray-100 shrink-0">
                                    <input
                                        v-if="mobileLocationPickerFor === 'from'"
                                        v-model="fromCitySearch"
                                        type="text"
                                        placeholder="Şehir ara..."
                                        class="w-full h-9 px-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                    <input
                                        v-else
                                        v-model="toCitySearch"
                                        type="text"
                                        placeholder="Şehir ara..."
                                        class="w-full h-9 px-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <div class="flex-1 overflow-y-auto p-2">
                                    <p v-if="citiesLoading" class="text-xs text-gray-400 py-2">Yükleniyor...</p>
                                    <template v-else-if="mobileLocationPickerFor === 'from'">
                                        <button
                                            v-for="c in fromCitiesForList"
                                            :key="c.id"
                                            type="button"
                                            @click="selectFromCityTemp(c)"
                                            :class="['w-full text-left px-2 py-2.5 rounded text-sm font-semibold', fromTempCity?.id === c.id ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100']"
                                        >
                                            {{ c.name }}
                                        </button>
                                    </template>
                                    <template v-else>
                                        <button
                                            v-for="c in toCitiesForList"
                                            :key="c.id"
                                            type="button"
                                            @click="selectToCityTemp(c)"
                                            :class="['w-full text-left px-2 py-2.5 rounded text-sm font-semibold', toTempCity?.id === c.id ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100']"
                                        >
                                            {{ c.name }}
                                        </button>
                                    </template>
                                </div>
                            </div>
                            <!-- İlçeler -->
                            <div class="flex flex-col overflow-hidden">
                                <h3 class="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100 shrink-0">İlçeler</h3>
                                <div class="p-2 border-b border-gray-100 shrink-0">
                                    <input
                                        v-if="mobileLocationPickerFor === 'from'"
                                        v-model="fromDistrictSearch"
                                        type="text"
                                        placeholder="İlçe ara..."
                                        class="w-full h-9 px-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                        :disabled="mobileLocationPickerFor === 'from' ? !fromTempCity : !toTempCity"
                                    />
                                    <input
                                        v-else
                                        v-model="toDistrictSearch"
                                        type="text"
                                        placeholder="İlçe ara..."
                                        class="w-full h-9 px-2.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                        :disabled="!toTempCity"
                                    />
                                </div>
                                <div class="flex-1 overflow-y-auto p-2">
                                    <p v-if="mobileLocationPickerFor === 'from' && !fromTempCity" class="text-xs text-gray-400 py-2">Önce şehir seçin</p>
                                    <p v-else-if="mobileLocationPickerFor === 'to' && !toTempCity" class="text-xs text-gray-400 py-2">Önce şehir seçin</p>
                                    <p v-else-if="mobileLocationPickerFor === 'from' && fromDistrictsLoading" class="text-xs text-gray-400 py-2">Yükleniyor...</p>
                                    <p v-else-if="mobileLocationPickerFor === 'to' && toDistrictsLoading" class="text-xs text-gray-400 py-2">Yükleniyor...</p>
                                    <template v-else-if="mobileLocationPickerFor === 'from'">
                                        <button
                                            v-for="d in fromDistrictsForList"
                                            :key="d.id == null ? 'her-yer' : d.id"
                                            type="button"
                                            @click="applyFromLocationAndCloseMobilePicker(d)"
                                            :class="['w-full text-left px-2 py-2.5 rounded text-sm font-semibold', isFromDistrictSelected(d) ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100']"
                                        >
                                            {{ d.name }}
                                        </button>
                                    </template>
                                    <template v-else>
                                        <button
                                            v-for="d in toDistrictsForList"
                                            :key="d.id == null ? 'her-yer' : d.id"
                                            type="button"
                                            @click="applyToLocationAndCloseMobilePicker(d)"
                                            :class="['w-full text-left px-2 py-2.5 rounded text-sm font-semibold', isToDistrictSelected(d) ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100']"
                                        >
                                            {{ d.name }}
                                        </button>
                                    </template>
                                </div>
                            </div>
                            <!-- Seçilen -->
                            <div class="flex flex-col overflow-hidden p-3">
                                <h3 class="px-1 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100 shrink-0">Seçilen</h3>
                                <p class="text-sm text-gray-700 py-2 shrink-0">{{ mobileLocationPickerFor === 'from' ? (fromCity || fromDistrict ? fromLocationLabel : 'Henüz seçim yok') : (toCity || toDistrict ? toLocationLabel : 'Henüz seçim yok') }}</p>
                                <button
                                    type="button"
                                    class="w-full mt-2 px-3 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors"
                                    @click="clearMobileLocationPickerSelection"
                                >
                                    Seçilenleri Temizle
                                </button>
                                <template v-if="authStore.isAuthenticated">
                                    <button
                                        type="button"
                                        class="mt-auto flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5"
                                        @click="openMapFromLocationPicker"
                                    >
                                        <MapPin class="w-4 h-4 shrink-0" />
                                        Konum ile seç
                                    </button>
                                    <p v-if="locationError" class="text-xs text-amber-600 mt-2">{{ locationError }}</p>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Konum gerekli uyarısı: mobilde kompakt, masaüstünde geniş -->
        <Content v-if="authStore.isAuthenticated && showKonumBanner" class="my-2 sm:my-5 flex">
            <div class="w-full max-w-[1200px] mx-auto px-0 sm:px-4">
                <div class="flex flex-wrap items-center gap-2 sm:gap-4 rounded-lg sm:rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2.5 sm:px-5 sm:py-4">
                    <span class="flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-amber-100 text-amber-600 shrink-0">
                        <MapPin class="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs sm:text-sm font-semibold text-amber-800">Konum izni gerekli</p>
                        <p class="text-xs sm:text-sm text-amber-700/90 mt-0.5 line-clamp-2 sm:line-clamp-none">
                            {{ locationError || 'Arama sonuçlarını iyileştirmek için konum erişimine izin verin.' }}
                        </p>
                    </div>
                    <button
                        type="button"
                        :disabled="locationRequesting"
                        class="shrink-0 inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-amber-600 text-white text-xs sm:text-sm font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-70 transition-colors"
                        @click="() => requestUserLocation(true)"
                    >
                        <span v-if="locationRequesting" class="inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {{ locationRequesting ? 'Alınıyor...' : 'Konum izni ver' }}
                    </button>
                </div>
            </div>
        </Content>
        <Content class="mt-5 flex-1 min-h-0 overflow-hidden flex">
            <div class="flex flex-row gap-6 w-full h-full">
                <!-- Sol: Filtreleme -->
                <div class="md:w-[320px] md:flex md:flex-col md:gap-8 md:overflow-y-auto md:shrink-0 hidden">
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
                <div class="flex-1 flex flex-col gap-5  overflow-y-auto pb-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <p v-if="shipmentsError" class="text-sm text-red-600">{{ shipmentsError }}</p>
                    <template v-else-if="shipmentsLoading">
                        <div class="flex flex-col gap-3">
                            <div
                                v-for="n in 2"
                                :key="`shipment-skeleton-${n}`"
                                class="w-full min-h-fit rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm animate-pulse"
                            >
                                <div class="flex flex-row justify-between items-start gap-4 py-5 px-4 sm:py-6 sm:px-6 border-b border-gray-100">
                                    <div class="flex flex-row items-stretch gap-0 sm:gap-4 flex-1 min-w-0">
                                        <div class="flex flex-col justify-between gap-2 shrink-0 sm:hidden py-0.5 text-xs">
                                            <div class="h-5 w-14 rounded-full bg-gray-200"></div>
                                            <div class="h-5 w-14 rounded-full bg-gray-200"></div>
                                        </div>
                                        <div class="flex flex-col items-center shrink-0 w-5 sm:hidden">
                                            <div class="flex-1 min-h-5 flex justify-center">
                                                <div class="w-0.5 h-full rounded-full bg-gray-200"></div>
                                            </div>
                                            <div class="w-3.5 h-3.5 rounded bg-gray-200 -mt-2"></div>
                                        </div>
                                        <div class="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5 flex-1 min-w-0 relative min-h-0">
                                            <div class="flex flex-col gap-2 sm:gap-2.5 items-start w-auto min-w-0">
                                                <div class="h-4 w-32 sm:w-44 rounded bg-gray-200"></div>
                                                <div class="hidden sm:inline-flex h-6 w-24 rounded-full bg-gray-200"></div>
                                            </div>
                                            <div class="hidden sm:flex flex-col items-center justify-center gap-1 shrink-0 w-[100px] sm:w-[120px] self-center">
                                                <div class="w-full h-0.5 rounded-full bg-gray-200"></div>
                                                <div class="h-3 w-14 rounded bg-gray-200"></div>
                                                <div class="w-4 h-4 rounded bg-gray-200"></div>
                                            </div>
                                            <div class="flex flex-col gap-2 sm:gap-2.5 items-start min-w-0 sm:flex-1 relative">
                                                <div class="h-4 w-28 sm:w-40 rounded bg-gray-200"></div>
                                                <div class="hidden sm:inline-flex h-6 w-24 rounded-full bg-gray-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="inline-flex h-8 w-20 sm:w-24 rounded-full bg-gray-200 shrink-0"></div>
                                </div>
                                <div class="border-t border-gray-100 py-3 px-4 sm:px-6 sm:py-0 sm:h-20 min-h-0 sm:min-h-[72px] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                    <div class="hidden sm:flex flex-wrap items-center gap-x-4 gap-y-0 flex-1 min-w-0">
                                        <div class="flex items-center gap-2 min-w-0">
                                            <div class="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
                                            <div class="h-4 w-28 rounded bg-gray-200"></div>
                                        </div>
                                        <div class="w-px h-5 bg-gray-200 shrink-0"></div>
                                        <div class="h-4 w-10 rounded bg-gray-200"></div>
                                        <div class="w-px h-5 bg-gray-200 shrink-0"></div>
                                        <div class="h-4 w-16 rounded bg-gray-200"></div>
                                        <div class="w-px h-5 bg-gray-200 shrink-0"></div>
                                        <div class="h-4 w-20 rounded bg-gray-200"></div>
                                    </div>
                                    <div class="hidden sm:flex items-center min-w-0 shrink-0">
                                        <div class="h-4 w-24 rounded bg-gray-200"></div>
                                    </div>
                                    <div class="grid grid-cols-2 gap-x-3 gap-y-2 order-1 min-w-0 sm:hidden">
                                        <div class="h-4 w-20 rounded bg-gray-200"></div>
                                        <div class="h-7 w-20 rounded-full bg-gray-200 justify-self-end"></div>
                                        <div class="h-4 w-24 rounded bg-gray-200"></div>
                                        <div class="h-4 w-20 rounded bg-gray-200 justify-self-end"></div>
                                    </div>
                                    <div class="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-gray-50/80 border border-gray-100 order-2 sm:hidden">
                                        <div class="w-9 h-9 rounded-full bg-gray-200 shrink-0"></div>
                                        <div class="min-w-0 flex-1">
                                            <div class="h-3 w-20 rounded bg-gray-200"></div>
                                            <div class="h-4 w-24 rounded bg-gray-200 mt-2"></div>
                                        </div>
                                        <div class="h-4 w-8 rounded bg-gray-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div
                            v-if="shipmentsList.length === 0"
                            class="w-full flex items-center justify-center py-10 sm:py-16"
                        >
                            <div class="w-full max-w-md mx-auto flex flex-col items-center text-center px-4">
                                <p class="text-lg sm:text-xl font-semibold text-primary mb-1">
                                    Henüz ilan bulunamadı
                                </p>
                                <p class="text-sm sm:text-base text-gray-500 max-w-sm">
                                    Şu anda gösterilecek bir sevkiyat yok.
                                    <span class="text-primary font-medium"> Filtreleri güncelleyerek</span>
                                    veya daha sonra tekrar kontrol ederek yeni ilanları görebilirsin.
                                </p>
                            </div>
                        </div>
                        <template v-else>
                            <!-- Sevkiyat başlığı: araç sahibi → Sevkiyatlar; yük sahibi → bölüm başlıkları (Benim / Diğer) -->
                            <div class="flex items-center justify-between w-full md:justify-start gap-3">
                                <span v-if="!isCargoOwner" class="text-sm text-gray-500">Sevkiyatlar</span>
                                <span v-else class="flex-1 min-w-0 shrink" aria-hidden="true" />
                            </div>

                            <section v-if="myPostList.length" class="flex flex-col gap-3">
                                <h3 v-if="isCargoOwner" class="text-sm font-semibold text-gray-800">Benim sevkiyatlarım</h3>
                                <Product
                                    v-for="item in myPostList"
                                    :key="'my-' + item.id"
                                    :slug="item.slug"
                                    :shipment="item"
                                    @canceled="handleShipmentCanceled"
                                />

                                <div class="bg-gray-200 w-full h-px mt-1"></div>
                            </section>

                            <section v-if="otherPostList.length" class="flex flex-col gap-3">
                                <h3 v-if="isCargoOwner" class="text-sm font-semibold text-gray-800">Diğer sevkiyatlar</h3>
                                <div class="flex flex-col space-y-8">
                                    <Product
                                        v-for="item in otherPostList"
                                        :key="'other-' + item.id"
                                        :slug="item.slug"
                                        :shipment="item"
                                        @canceled="handleShipmentCanceled"
                                    />
                                </div>
                            </section>

                            <button
                                v-if="hasMore"
                                @click="loadMore"
                                :disabled="loadingMore"
                                class="flex items-center justify-center gap-2 w-full px-4 py-3.5 mt-2 rounded-lg border border-primary bg-primary text-white text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i v-if="loadingMore" class="pi pi-spin pi-spinner text-sm"></i>
                                <ChevronDown v-else size="20" />
                                <span>{{ loadingMore ? 'Yükleniyor...' : 'Daha Fazla Yükle' }}</span>
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

        <!-- İlk giriş yönlendirme turu (vue3-tour) -->
        <v-tour
            name="panelTour"
            :steps="panelTourSteps"
            :callbacks="panelTourCallbacks"
            :options="panelTourOptions"
        />

    </div>
    </template>


<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
import { useLocationStore } from '@/stores/location';
import { useAuthStore } from '@/stores/auth';

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
const herYerCityOption = { id: null, name: 'Her yer' };

// Arama çubukları (Nereden/Nereye dropdown)
const fromCitySearch = ref('');
const fromDistrictSearch = ref('');
const toCitySearch = ref('');
const toDistrictSearch = ref('');

const isFromHerYer = computed(() => fromDistrict.value?.name === 'Her yer' && fromDistrict.value?.id == null);
const isToHerYer = computed(() => toDistrict.value?.name === 'Her yer' && toDistrict.value?.id == null);
const isFromCityHerYer = computed(() => fromCity.value?.name === 'Her yer' && fromCity.value?.id == null);
const isToCityHerYer = computed(() => toCity.value?.name === 'Her yer' && toCity.value?.id == null);

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
    if (q) {
        list = list.filter(c => (c.name || '').toLowerCase().includes(q));
        if ('her yer'.includes(q)) {
            return [herYerCityOption, ...sortCitiesWithPriority([...list])];
        }
    }
    list = sortCitiesWithPriority([...list]);
    const sel = fromTempCity.value;
    if (sel?.id == null && sel?.name === 'Her yer') {
        return [herYerCityOption, ...list];
    }
    if (sel?.id) {
        const i = list.findIndex(c => c.id === sel.id);
        if (i > 0) {
            list = [...list];
            list.splice(i, 1);
            list.unshift(sel);
        }
    }
    return [herYerCityOption, ...list];
});
const toCitiesForList = computed(() => {
    let list = apiCities.value;
    const q = (toCitySearch.value || '').trim().toLowerCase();
    if (q) {
        list = list.filter(c => (c.name || '').toLowerCase().includes(q));
        if ('her yer'.includes(q)) {
            return [herYerCityOption, ...sortCitiesWithPriority([...list])];
        }
    }
    list = sortCitiesWithPriority([...list]);
    const sel = toTempCity.value;
    if (sel?.id == null && sel?.name === 'Her yer') {
        return [herYerCityOption, ...list];
    }
    if (sel?.id) {
        const i = list.findIndex(c => c.id === sel.id);
        if (i > 0) {
            list = [...list];
            list.splice(i, 1);
            list.unshift(sel);
        }
    }
    return [herYerCityOption, ...list];
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

const mobileSearchSummary = computed(() => {
    const from = fromLocationLabel.value === 'Nereden' ? 'Nereden' : fromLocationLabel.value;
    const to = toLocationLabel.value === 'Nereye' ? 'Nereye' : toLocationLabel.value;
    return `${from} → ${to}`;
});

const hasSearchLocations = computed(() => !!(
    fromCity.value || fromDistrict.value || toCity.value || toDistrict.value
    || fromLocationDisplayName.value || toLocationDisplayName.value
));

const departureTime = ref(null);
const returnTime = ref(null);
const fromCityDropdownOpen = ref(false);
const fromDropdownOpen = ref(false);
const toDropdownOpen = ref(false);
const searchBarRef = ref(null);
const mobileFilterOpen = ref(false);
const mobileLocationPickerOpen = ref(false);
const mobileLocationPickerFor = ref('from'); // 'from' | 'to'

/** Filtre seçenekleri: label (görünen metin), value (API'ye gönderilecek değer) */
const filterSections = [
    {
        label: 'Sırala',
        type: 'radio',
        name: 'order',
        modelKey: 'order',
        options: [
            { label: 'En erken kalkan', value: 'earliest' },
            // { label: 'En ucuz', value: 'cheapest' },
            // { label: 'Varış yeri en yakın', value: 'nearest' },
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

const isVerifiedProfileFilterEnabled = computed(() => filters.verified === 'verified');

const onToggleVerifiedProfileFilter = (enabled) => {
    filters.verified = enabled ? 'verified' : null;
    handleFilterChange('verified');
};

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

const route = useRoute();

const setDefaultLocations = () => {
    if (apiCities.value.length === 0) return;

    const qFrom = route.query.from;
    const qTo = route.query.to;

    if (!fromCity.value && qFrom) {
        fromCity.value = apiCities.value.find(c => c.name === qFrom) || null;
    }
    if (!toCity.value && qTo) {
        toCity.value = apiCities.value.find(c => c.name === qTo) || null;
    }
};

// Nereden dropdown açılınca
const openFromDropdown = async () => {
    locationStore.clearLocationError();
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
    if (city?.id == null && city?.name === 'Her yer') {
        fromDistricts.value = [];
        fromCity.value = herYerCityOption;
        fromDistrict.value = null;
        fromLocationDisplayName.value = null;
        fromDropdownOpen.value = false;
        if (mobileLocationPickerOpen.value && mobileLocationPickerFor.value === 'from') {
            mobileLocationPickerOpen.value = false;
        }
        return;
    }
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

const applyFromLocationAndCloseMobilePicker = (district) => {
    applyFromLocation(district);
    mobileLocationPickerOpen.value = false;
};

// Konum bilgisi tüm sayfalarda stores/location.js (useLocationStore) üzerinden alınır.

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

// Nominatim: Türkiye (TR) için şehir = state (il, örn. Ankara). city/town ilçe olabilir (Sincan) → kullanma.
function parseNominatimCityDistrict(addr, countryCode) {
    if (!addr) return { city: null, district: null };
    const isTurkey = (countryCode || '').toLowerCase() === 'tr';
    if (isTurkey) {
        return {
            city: addr.state || null,
            district: addr.state_district || addr.county || null
        };
    }
    const city = addr.state || addr.city || addr.town || addr.village || addr.municipality || null;
    const district = addr.state_district || addr.county || null;
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

const selectFromLocationByMap = () => {
    locationStore.clearLocationError();
    fromDropdownOpen.value = false;
    mapModalFor.value = 'from';
    mapModalOpen.value = true;
};

// Nereye dropdown açılınca
const openToDropdown = async () => {
    locationStore.clearLocationError();
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
    if (city?.id == null && city?.name === 'Her yer') {
        toDistricts.value = [];
        toCity.value = herYerCityOption;
        toDistrict.value = null;
        toLocationDisplayName.value = null;
        toDropdownOpen.value = false;
        if (mobileLocationPickerOpen.value && mobileLocationPickerFor.value === 'to') {
            mobileLocationPickerOpen.value = false;
        }
        return;
    }
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

const applyToLocationAndCloseMobilePicker = (district) => {
    applyToLocation(district);
    mobileLocationPickerOpen.value = false;
};

/** Mobil Nereden/Nereye modalında seçilenleri temizle; arama input değerlerini (ilgili tarafı) siler */
const clearMobileLocationPickerSelection = () => {
    if (mobileLocationPickerFor.value === 'from') {
        fromCity.value = null;
        fromDistrict.value = null;
        fromLocationDisplayName.value = null;
        fromTempCity.value = null;
    } else {
        toCity.value = null;
        toDistrict.value = null;
        toLocationDisplayName.value = null;
        toTempCity.value = null;
    }
};

/** Arama çubuğundaki şehir/ilçe ve tarih filtrelerini temizler, listeyi yeniler */
const clearSearchLocations = () => {
    fromCity.value = null;
    fromDistrict.value = null;
    fromLocationDisplayName.value = null;
    fromTempCity.value = null;
    toCity.value = null;
    toDistrict.value = null;
    toLocationDisplayName.value = null;
    toTempCity.value = null;
    fromCitySearch.value = '';
    fromDistrictSearch.value = '';
    toCitySearch.value = '';
    toDistrictSearch.value = '';
    departureTime.value = null;
    returnTime.value = null;
    fromDropdownOpen.value = false;
    toDropdownOpen.value = false;
    updatePageQuery(1);
    shipmentsStore.fetchShipments({
        f_where_city: null,
        f_where_district: null,
        t_where_city: null,
        t_where_district: null,
    });
};

/** Mobil arama modalında tüm nereden/nereye değerlerini temizler */
const clearMobileSearchLocations = () => {
    clearSearchLocations();
};

const selectToLocationByMap = () => {
    locationStore.clearLocationError();
    toDropdownOpen.value = false;
    mapModalFor.value = 'to';
    mapModalOpen.value = true;
};

const openMapFromLocationPicker = () => {
    mobileLocationPickerOpen.value = false;
    if (mobileLocationPickerFor.value === 'from') selectFromLocationByMap();
    else selectToLocationByMap();
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
const panelRouter = useRouter();
const authStore = useAuthStore();
const shipmentsStore = useShipmentsStore();
const { list: shipmentsList, myPostList, otherPostList, loading: shipmentsLoading, loadingMore, error: shipmentsError, hasMore } = storeToRefs(shipmentsStore);

/** Panel ilan başlıkları: yük sahibi → Benim / Diğer sevkiyatlar; araç sahibi → tek başlık Sevkiyatlar */
const isCargoOwner = computed(() => authStore.user?.type === 'cargo_owner');
const locationStore = useLocationStore();
const { locationError, userCoords, locationRequesting } = storeToRefs(locationStore);
const { requestUserLocation } = locationStore;

// İlk giriş panel turu (vue3-tour) – hesap bazlı, her hesap için bir kez
// Mobil: masaüstü hedefleri `hidden sm:flex` ile DOM'da gizli; Popper sağ üste düşer — ayrı mobil hedefler kullanılır.
const isSmUp = ref(typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches);

function updateTourBreakpoint() {
    if (typeof window === 'undefined') return;
    isSmUp.value = window.matchMedia('(min-width: 640px)').matches;
}

async function panelTourMobileBeforeStep2(type) {
    if (isSmUp.value) return;
    if (type === 'previous') {
        mobileFilterOpen.value = false;
        await nextTick();
    }
}

async function panelTourMobileBeforeStep3(type) {
    if (isSmUp.value) return;
    if (type === 'next' || type === 'previous') {
        mobileFilterOpen.value = true;
        await nextTick();
    }
}

async function panelTourMobileBeforeStep4(type) {
    if (isSmUp.value) return;
    if (type === 'next') {
        mobileFilterOpen.value = false;
        await nextTick();
    }
}

const panelTourSteps = computed(() => {
    if (isSmUp.value) {
        return [
            {
                target: '#tour-nereden',
                header: { title: 'Nereden' },
                content: 'Sevkiyatın başlayacağı şehir ve ilçeyi buradan seçebilirsiniz.',
                params: { placement: 'bottom' },
            },
            {
                target: '#tour-nereye',
                header: { title: 'Nereye' },
                content: 'Sevkiyatın varacağı şehir ve ilçeyi buradan seçin.',
                params: { placement: 'bottom' },
            },
            {
                target: '#tour-gidis-donus',
                header: { title: 'Gidiş ve Dönüş Saati' },
                content: 'Gidiş ve dönüş tarihlerini bu alanlardan seçerek ilanları filtreleyebilirsiniz.',
                params: { placement: 'bottom' },
            },
            {
                target: '#tour-hesap',
                header: { title: 'Hesap' },
                content: 'Hesabınıza, ilanlarınıza ve ayarlarınıza bu menüden ulaşabilirsiniz.',
                params: { placement: 'bottom' },
            },
        ];
    }
    return [
        {
            target: '#tour-mobil-arama',
            header: { title: 'Nereden' },
            content:
                'Nereden ve nereye seçimini bu alana dokunarak açın; açılan ekranda şehir ve ilçeyi belirleyebilirsiniz.',
            params: { placement: 'bottom' },
        },
        {
            target: '#tour-mobil-arama',
            header: { title: 'Nereye' },
            content: 'Aynı arama ekranında varış şehir ve ilçesini de seçebilirsiniz.',
            params: { placement: 'bottom' },
            before: panelTourMobileBeforeStep2,
        },
        {
            target: '#tour-mobil-gidis-donus',
            header: { title: 'Gidiş ve Dönüş Saati' },
            content: 'Gidiş ve dönüş tarihlerini bu alanlardan seçerek ilanları filtreleyebilirsiniz.',
            params: { placement: 'bottom' },
            before: panelTourMobileBeforeStep3,
        },
        {
            target: '#tour-hesap-mobil',
            header: { title: 'Hesap' },
            content: 'Hesabınıza, ilanlarınıza ve ayarlarınıza üst menüdeki simgeyi açarak ulaşabilirsiniz.',
            params: { placement: 'bottom' },
            before: panelTourMobileBeforeStep4,
        },
    ];
});

const markPanelTourCompleted = async () => {
    mobileFilterOpen.value = false;
    try {
        const res = await api.post('/auth/panel-tour-complete');
        const user = res?.data?.content?.user;
        if (user) authStore.setUser(user);
    } catch (_) {}
};
const panelTourCallbacks = {
    onFinish: markPanelTourCompleted,
    onSkip: markPanelTourCompleted,
    onStop: markPanelTourCompleted,
};
const panelTourOptions = {
    highlight: true,
    labels: {
        buttonSkip: 'Atla',
        buttonPrevious: 'Önceki',
        buttonNext: 'İleri',
        buttonStop: 'Bitir',
    },
};

const showKonumBanner = computed(() => {
    // Kullanıcı giriş yapmış ve henüz koordinat alınmamışsa banner göster
    return authStore.isAuthenticated && !userCoords.value;
});

const handleShipmentCanceled = (id) => {
    if (!id) return;
    if (myPostList.value?.length) {
        myPostList.value = myPostList.value.filter((s) => s.id !== id);
    }
    if (otherPostList.value?.length) {
        otherPostList.value = otherPostList.value.filter((s) => s.id !== id);
    }
};

const updatePageQuery = (page) => {
    const query = { ...route.query };
    if (page > 1) {
        query.page = String(page);
    } else {
        delete query.page;
    }
    panelRouter.replace({ query });
};

const handleFilterChange = (modelKey) => {
    updatePageQuery(1);
    shipmentsStore.fetchShipments({ filters: { [modelKey]: filters[modelKey] } });    
};

onMounted(async () => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', updateTourBreakpoint);
    updateTourBreakpoint();
    const initialPage = parseInt(route.query.page) || 1;
    shipmentsStore.fetchShipments({ initialPage });
    fetchCities().then(setDefaultLocations);
    if (!authStore.isAuthenticated) return;
    // Tur kararı her zaman backend'den: panele her girişte güncel kullanıcı alınıyor (localStorage'a güvenilmez)
    await authStore.checkToken();
    if (!userCoords.value) {
        // Her girişte panel sayfasında konum iste
        requestUserLocation();
    }
    // DB'de panel_tour_completed_at dolu değilse turu göster
    try {
        const tourDone = authStore.user?.panel_tour_completed === true;
        if (!tourDone && document.querySelector(isSmUp.value ? '#tour-nereden' : '#tour-mobil-arama')) {
            fromDropdownOpen.value = false;
            toDropdownOpen.value = false;
            // getCurrentInstance() nextTick içinde null dönebiliyor; önce referansı al, sonra start et.
            const instance = getCurrentInstance();
            await nextTick();
            // Child komponent (v-tour) mount sırası bazen denk gelmeyebiliyor; kısa retry yapıyoruz.
            for (let i = 0; i < 5; i++) {
                const tours = instance?.appContext?.config?.globalProperties?.$tours;
                if (tours?.panelTour?.start) {
                    tours.panelTour.start();
                    break;
                }
                await nextTick();
            }
        }
    } catch (_) {}
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('resize', updateTourBreakpoint);
});

function getSearchFormData() {
    const normalizedFromCity = isFromCityHerYer.value ? null : (fromCity.value?.name ?? null);
    const normalizedFromDistrict = (isFromCityHerYer.value || isFromHerYer.value) ? null : (fromDistrict.value?.name ?? null);
    const normalizedToCity = isToCityHerYer.value ? null : (toCity.value?.name ?? null);
    const normalizedToDistrict = (isToCityHerYer.value || isToHerYer.value) ? null : (toDistrict.value?.name ?? null);
    const f_where = fromCity.value && fromDistrict.value
        ? `${fromCity.value.name} / ${fromDistrict.value.name}`
        : fromCity.value?.name ?? null;
    const t_where = toCity.value && toDistrict.value
        ? `${toCity.value.name} / ${toDistrict.value.name}`
        : toCity.value?.name ?? null;
    return {
        f_where,
        t_where,
        f_where_city: normalizedFromCity,
        f_where_district: normalizedFromDistrict,
        t_where_city: normalizedToCity,
        t_where_district: normalizedToDistrict,
        departureTime: departureTime.value,
        returnTime: returnTime.value,
        filters: { ...filters },
    };
}

const handleSearch = () => {
    const searchData = getSearchFormData();
    updatePageQuery(1);
    shipmentsStore.fetchShipments({
        f_where_city: searchData.f_where_city,
        f_where_district: searchData.f_where_district,
        t_where_city: searchData.t_where_city,
        t_where_district: searchData.t_where_district,
        filters: searchData.filters,
    });
};

const loadMore = () => {
    shipmentsStore.fetchShipments({ append: true }).then(() => {
        updatePageQuery(shipmentsStore.currentPage);
    });
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