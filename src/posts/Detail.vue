
<template>
    <div class="min-h-screen flex flex-col">
        <Header />
        <Content class="mt-4 sm:mt-5 flex-1 overflow-y-auto px-3 sm:px-4 flex flex-col md:flex-row md:gap-4 gap-6 relative pb-24 md:pb-8">
            <!-- Sol kolon: mobilde tam genişlik, masaüstünde sabit genişlik -->
            <div
                class="w-full md:w-[800px] md:max-w-[800px] md:shrink-0 flex flex-col gap-4 no_scrool transition-all duration-200"
                :class="shipmentLoading ? 'opacity-60 pointer-events-none' : ''"
            >
                <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 h-9 hidden md:block">Taşıma Bilgileri</h2>
                <div
                    class="bg-white h-[240px] sm:h-[320px] md:h-[350px] rounded-md relative transition-colors duration-200"
                    :class="shipmentLoading ? 'bg-gray-200 animate-pulse' : ''"
                >
                    <div v-if="mapError" class="w-full h-[240px] sm:h-[320px] md:h-[350px] flex items-center justify-center bg-red-50 border border-red-200 rounded-md">
                        <div class="text-center p-4">
                            <p class="text-red-600 font-semibold mb-2">Harita Yüklenemedi</p>
                            <p class="text-sm text-red-500">{{ mapError }}</p>
                            <button 
                                @click="retryMap" 
                                class="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Tekrar Dene
                            </button>
                        </div>
                    </div>
                    <div v-else ref="mapContainer" id="map" class="w-full h-[240px] sm:h-[320px] md:h-[350px] rounded-md"></div>
                    <!-- Rotayı Göster Butonu -->
                    <button
                        v-if="!mapError && map"
                        @click="showRoute"
                        class="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl border border-gray-200 hover:border-primary transition-all duration-200 font-medium text-xs sm:text-sm"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Rotayı Göster
                    </button>
                </div>
                <div
                    v-if="distance"
                    class="rounded-md p-4 border border-gray-200 transition-colors duration-200"
                    :class="shipmentLoading ? 'bg-gray-200 animate-pulse' : 'bg-white'"
                >
                    <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                        <div class="flex flex-wrap items-center gap-3 sm:gap-4">
                            <div>
                                <span class="text-xs sm:text-sm text-gray-500">Mesafe:</span>
                                <span class="ml-1 sm:ml-2 text-base sm:text-lg font-semibold text-gray-900">{{ distance }}</span>
                            </div>
                            <div>
                                <span class="text-xs sm:text-sm text-gray-500">Süre:</span>
                                <span class="ml-1 sm:ml-2 text-base sm:text-lg font-semibold text-gray-900">{{ duration }}</span>
                            </div>
                        </div>
                        <span class="text-sm text-primary font-semibold shrink-0">{{ shipment?.price }}</span>
                    </div>
                </div>

                <!-- Bu ilanı paylaş -->
                <div
                    class="rounded-md p-4 border border-gray-200 transition-colors duration-200"
                    :class="shipmentLoading ? 'bg-gray-200 animate-pulse' : 'bg-white'"
                >
                    <h3 class="text-sm font-semibold text-gray-900 mb-3">Bu ilanı paylaş</h3>
                    <p v-if="shipmentLoadError" class="text-sm text-red-600">{{ shipmentLoadError }}</p>
                    <div class="flex items-center gap-3">
                        <a
                            :href="shareUrls.facebook"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
                            aria-label="Facebook'ta paylaş"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        <a
                            :href="shareUrls.whatsapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white hover:opacity-90 transition-opacity"
                            aria-label="WhatsApp'ta paylaş"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Yol Üzerindeki İlanlar -->
                <div
                    class="rounded-md border border-gray-200 shadow-sm p-4 sm:p-6 transition-colors duration-200"
                    :class="shipmentLoading ? 'bg-gray-200 animate-pulse' : 'bg-white'"
                >
                    <h3 class="text-base sm:text-lg font-semibold text-primary mb-3">Yol Üzerindeki İlanlar</h3>
                    <p v-if="routeCities.length" class="text-sm text-gray-500 mb-4">
                        <span class="font-medium text-gray-700">Yol üzerindeki şehirler:</span>
                        {{ routeCities.join(', ') }}
                    </p>
                    <div class="grid gap-3">
                        <RouterLink
                            v-for="(listing, idx) in routeListings"
                            :key="listing.slug || idx"
                            :to="listing.slug ? { path: `/posts/${listing.slug}` } : {}"
                            class="group rounded-xl border border-gray-200 bg-white p-3 sm:p-3.5 hover:border-primary/35 hover:bg-primary/[0.03] hover:shadow-sm transition-all"
                        >
                            <div class="flex items-start gap-2.5 sm:gap-3">
                                <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                                    <i class="pi pi-map text-primary" style="font-size: 0.9rem"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-[13px] sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-2 sm:line-clamp-1">
                                        {{ listing.from }} → {{ listing.to }}
                                    </p>
                                    <div class="mt-2 flex flex-wrap items-center gap-1">
                                        <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] sm:text-[11px] font-medium text-gray-700">
                                            <i class="pi pi-clock text-primary" style="font-size: 0.65rem"></i>
                                            {{ listing.time }}
                                        </span>
                                        <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] sm:text-[11px] font-medium text-gray-700">
                                            <i class="pi pi-box text-primary" style="font-size: 0.65rem"></i>
                                            {{ listing.loadAmount }}
                                        </span>
                                        <span v-if="listing.postType" class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] sm:text-[11px] font-medium text-gray-700">
                                            <i class="pi pi-tag text-primary" style="font-size: 0.65rem"></i>
                                            {{ listing.postType }}
                                        </span>
                                        <span v-if="listing.vehicle" class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] sm:text-[11px] font-medium text-gray-700">
                                            <i class="pi pi-car text-primary" style="font-size: 0.65rem"></i>
                                            {{ listing.vehicle }}
                                        </span>
                                    </div>
                                    <div class="mt-2 flex items-end justify-between gap-2">
                                        <p class="text-sm font-semibold text-primary truncate">{{ listing.price || 'Fiyat belirtilmemiş' }}</p>
                                    </div>
                                </div>
                                <span class="text-[11px] sm:text-xs font-semibold text-primary shrink-0 self-end sm:self-center group-hover:translate-x-0.5 transition-transform">İlana git</span>
                            </div>
                        </RouterLink>
                    </div>
                    <p v-if="routeListingsLoading" class="text-sm text-gray-500 py-2">
                        Yol üzerindeki ilanlar yükleniyor...
                    </p>
                    <p v-else-if="!routeListings.length && !shipmentLoading" class="text-sm text-gray-500 py-2">
                        Bu rota üzerinde şu an listelenen ilan yok.
                    </p>
                    <p v-else-if="!routeListings.length && distance" class="text-sm text-gray-500 py-2">
                        Yol üzerindeki ilanlar yükleniyor...
                    </p>
                </div>

                <!-- İlan Açıklaması -->
                <div
                    class="relative overflow-hidden rounded-3xl border border-gray-200/80 shadow-[0_12px_34px_rgba(15,23,42,0.08)] transition-colors duration-200"
                    :class="shipmentLoading ? 'bg-gray-200 animate-pulse' : 'bg-white'"
                >
                    <div class="absolute -top-20 -right-14 w-52 h-52 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
                    <div class="relative px-4 sm:px-6 pt-5 pb-4 border-b border-gray-100 bg-gradient-to-r from-primary/[0.08] via-white to-white">
                        <div class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-[11px] font-semibold text-primary tracking-wide uppercase">
                            <i class="pi pi-file-edit"></i>
                            İlan Detayı
                        </div>
                        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mt-2">İlan Açıklaması</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">Taşıma detayları, kapasite bilgileri ve özel notlar</p>
                    </div>
                    
                    <!-- Açıklama Metni -->
                    <div class="relative p-4 sm:p-6 pb-4">
                        <p class="text-sm text-gray-700 leading-relaxed rounded-2xl bg-gray-50/90 border border-gray-100 px-4 py-3.5">
                            {{ postDescription || 'İlan açıklaması yok.' }}
                        </p>
                    </div>

                    <!-- Özellik kartları -->
                    <div class="px-4 sm:px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="rounded-xl border border-gray-100 bg-white p-3.5">
                            <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Araç Tipi</p>
                            <p class="text-sm font-semibold text-gray-900 mt-1">{{ ilanAracTipi }}</p>
                        </div>
                        <div class="rounded-xl border border-gray-100 bg-white p-3.5">
                            <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Kapasite</p>
                            <p class="text-sm font-semibold text-gray-900 mt-1">{{ ilanKapasite }}</p>
                        </div>
                        <div class="rounded-xl border border-gray-100 bg-white p-3.5">
                            <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Yük Tipi</p>
                            <p class="text-sm font-semibold text-gray-900 mt-1">{{ ilanYukTipi }}</p>
                        </div>
                        <div class="rounded-xl border border-gray-100 bg-white p-3.5">
                            <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Özel İstek</p>
                            <p class="text-sm font-semibold text-gray-900 mt-1">{{ ilanOzelIstek }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="w-full md:flex-1 flex flex-col gap-4 transition-all duration-200 min-w-0"
                :class="shipmentLoading ? 'opacity-60 pointer-events-none' : ''"
            >
                <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 h-9">Rota Bilgileri</h2>
                
                <!-- Kalkış ve Varış -->
                <div
                    class="rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-colors duration-200"
                    :class="shipmentLoading ? 'bg-gray-200 animate-pulse' : 'bg-white'"
                >
                    <div class="p-4 sm:p-5">
                        <div class="flex items-start gap-4">
                            <!-- Sol: Yuvarlaklar ve Çizgi -->
                            <div class="flex flex-col items-center shrink-0">
                                <div class="w-[5px] h-[5px] rounded-full bg-primary"></div>
                                <div class="w-px h-16 sm:h-28 bg-gradient-to-b from-primary to-primary/30 my-1.5 sm:my-2"></div>
                                <div class="w-[5px] h-[5px] rounded-full bg-primary"></div>
                            </div>
                            
                            <!-- Sağ: İçerik -->
                            <div class="flex-1 flex flex-col gap-4 sm:gap-6 min-w-0">
                                <!-- Kalkış -->
                                <div class="min-w-0">
                                    <div class="flex flex-wrap items-center gap-2 mb-1">
                                        <span class="text-xs font-semibold text-primary uppercase tracking-wide">Kalkış</span>
                                        <span v-if="originDateTime" class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {{ formatDateTime(originDateTime) }}
                                        </span>
                                    </div>
                                    <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-1 leading-tight truncate">{{ selectedOrigin?.name || 'Ankara' }}</h3>
                                    <p class="text-xs sm:text-sm text-gray-600">{{ shipment?.departure_time ?? 'belirlenecek' }}</p>
                                </div>
                                <!-- Varış -->
                                <div class="min-w-0">
                                    <div class="flex flex-wrap items-center gap-2 mb-1">
                                        <span class="text-xs font-semibold text-primary uppercase tracking-wide">Varış</span>
                                        <span v-if="destinationDateTime" class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {{ formatDateTime(destinationDateTime) }}
                                        </span>
                                    </div>
                                    <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-1 leading-tight truncate">{{ selectedDestination?.name || 'İzmir' }}</h3>
                                    <p class="text-xs sm:text-sm text-gray-600">{{ shipment?.time_arrival ?? 'belirlenecek' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Teklif / İlanım butonları: sadece masaüstünde (mobilde altta fixed bar kullanılıyor) -->
                    <div
                        v-if="!is_me"
                        class="hidden md:flex bg-gray-50 border-t border-gray-100 w-full px-4 py-3 gap-3"
                    >
                        <button
                            v-if="isCargoOwnerViewer"
                            type="button"
                            class="flex-1 h-11 sm:h-12 rounded-xl border-2 border-primary text-primary bg-white font-semibold transition-all duration-200 text-sm sm:text-base"
                        >
                            Önizleme
                        </button>
                        <button
                            v-else-if="shipment?.call_access !== 1"
                            @click="handleOfferClick"
                            class="flex-1 h-11 sm:h-12 rounded-xl bg-primary text-white font-semibold transition-all duration-200 text-sm sm:text-base shadow-sm hover:bg-primary/90 hover:shadow-md"
                        >
                            Teklif Ver
                        </button>
                        <button
                            @click="openMessageOfferPanel"
                            class="flex-1 h-11 sm:h-12 rounded-xl border-2 border-primary text-primary bg-white font-semibold transition-all duration-200 text-sm sm:text-base hover:bg-primary/5"
                        >
                            Mesaj ile Teklif
                        </button>
                        <button
                            v-if="!isCargoOwnerViewer && shipment?.call_access == 1"
                            type="button"
                            @click="openCallModal"
                            class="h-11 sm:h-12 px-5 flex-1 rounded-xl border-2 bg-primary text-white font-semibold transition-all duration-200 text-sm sm:text-base  shrink-0 items-center"
                        >
                            <i class="pi pi-phone text-xl mr-3"></i>
                            <span>Ara</span>
                        </button>
                    </div>
                    <div v-else class="hidden md:flex bg-gray-50 border-t border-gray-100 w-full">
                        <button
                            class="flex-1 h-11 sm:h-12 border border-primary text-primary font-semibold transition-all duration-200 text-sm sm:text-base py-2.5"
                        >
                            İlanım
                        </button>
                    </div>
                </div>

                <!-- İlan Oluşturan Kişi Bilgileri -->
                <div
                    class="rounded-md p-4 sm:p-6 border border-gray-200 shadow-sm h-auto transition-colors duration-200"
                    :class="shipmentLoading ? 'bg-gray-200 animate-pulse' : 'bg-white'"
                >
                    <div class="flex items-center gap-3 sm:gap-4">
                        <!-- Profil Resmi -->
                        <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <div class="w-full h-full bg-primary/20 flex items-center justify-center">
                                <span class="text-xl text-primary font-semibold">
                                    {{ shipment?.creator?.full_name?.charAt(0)?.toUpperCase() || 'U' }}
                                </span>
                            </div>
                        </div>
                        <!-- İsim ve Puan -->
                        <div class="flex flex-col gap-1 sm:gap-2 min-w-0">
                            <h4 class="text-sm sm:text-base font-semibold text-gray-900 truncate">
                                {{ shipment?.creator?.full_name }}
                            </h4>
                            <div class="flex items-center gap-2">
                                <span class="text-xs sm:text-sm text-gray-600">Puan:</span>
                                <div class="flex items-center gap-1">
                                    <span class="text-sm sm:text-base font-semibold text-gray-900">
                                        {{ creatorScoreText }}
                                    </span>
                                    <span class="text-yellow-500">★</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading overlay: PrimeVue ProgressSpinner -->
            <div
                v-if="shipmentLoading"
                class="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded-lg"
            >
                <ProgressSpinner
                    style="width: 48px; height: 48px"
                    strokeWidth="4"
                    aria-label="Yükleniyor"
                />
            </div>
        </Content>

        <!-- Mobil: sabit alt bar (Teklif Ver / Mesaj ile Teklif / Ara) -->
        <div
            v-if="!shipmentLoading && !is_me"
            class="fixed bottom-0 left-0 right-0 z-40 flex md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-8px_28px_rgba(15,23,42,0.12)] pb-[env(safe-area-inset-bottom)]"
        >
            <button
                v-if="isCargoOwnerViewer"
                type="button"
                class="flex-1 h-14 py-3 px-3 border-t border-primary text-primary font-semibold text-sm bg-white"
            >
                Önizleme
            </button>
            <button
                v-else-if="shipment?.call_access !== 1"
                @click="handleOfferClick"
                class="flex-1 h-14 py-3 px-3 bg-primary text-white font-semibold text-sm"
            >
                Teklif Ver
            </button>
            <button
                v-if="!isCargoOwnerViewer && shipment?.call_access !== 1"
                @click="openMessageOfferPanel"
                class="flex-1 h-14 py-3 px-3 border-t border-l border-gray-200 text-primary font-semibold text-sm bg-white"
            >
                Mesaj ile Teklif
            </button>
            <button
                v-if="!isCargoOwnerViewer && shipment?.call_access == 1"
                type="button"
                @click="openCallModal"
                class="group flex-1 h-16 py-3 px-4 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary via-[#2f7f88] to-[#266a72] text-white font-semibold text-sm flex items-center justify-between gap-3 shadow-[0_10px_24px_rgba(57,131,140,0.28)] active:scale-[0.99] transition-all"
            >
                <span class="flex items-center gap-2.5 min-w-0">
                    <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
                        <i class="pi pi-phone text-md"></i>
                    </span>
                    <span class="truncate text-md" v-text="shipment?.call_access == 1 ? shipment?.creator?.phoneFormatted : ''"></span>
                </span>
                <span class="inline-flex items-center justify-center rounded-full bg-white px-5 py-1 text-md font-bold tracking-wide text-primary shadow-sm">Ara</span>
            </button>
        </div>
        <div
            v-else-if="!shipmentLoading && is_me"
            class="fixed bottom-0 left-0 right-0 z-40 flex md:hidden bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]"
        >
            <button
                class="flex-1 h-14 py-3 px-3 border-t border-primary text-primary font-semibold text-sm"
            >
                İlanım
            </button>
        </div>

        <!-- Ortak overlay + Mesaj paneli + Teklif modal (overlay tıklanınca ikisi de kapanır) -->
        <Teleport to="body">
            <div
                v-if="showMessageOfferPanel || showTeklifModal"
                class="fixed inset-0 z-50 flex"
            >
                <!-- Tek overlay – tıklanınca hem teklif modalı hem mesaj paneli kapanır -->
                <div
                    class="absolute inset-0 bg-black/30 transition-opacity"
                    @click="closeAllPanels"
                />
                <!-- Teklif Ver modal (ortak component) -->
                <TeklifVerModal
                    v-if="showTeklifModal && shipment?.slug"
                    :slug="shipment.slug"
                    :shipment="shipment"
                    @close="showTeklifModal = false"
                    @success="onTeklifModalSuccess"
                />
                <!-- Mesaj ile Teklif Ver – mobilde tam ekran, masaüstünde sağdan kayan panel -->
                <div
                    v-if="showMessageOfferPanel"
                    class="relative h-screen w-full sm:w-96 sm:max-w-none bg-white sm:border-l border-gray-200 shadow-xl flex flex-col transition-transform duration-300 ease-out z-10 sm:ml-auto"
                    :class="messageOfferPanelVisible ? 'translate-x-0' : 'translate-x-full'"
                    aria-hidden="true"
                >
                    <div class="flex items-center justify-between p-3 border-b border-gray-200">
                        <span class="text-sm font-semibold text-gray-900">Mesaj ile Teklif</span>
                        <button
                            type="button"
                            class="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                            aria-label="Kapat"
                            @click="closeAllPanels"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="flex-1 flex flex-col min-h-0">
                        <!-- Mesajlar listesi -->
                        <div
                            ref="offerMessagesContainer"
                            class="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-3 bg-gray-50 scroll-container"
                        >
                            <!-- İlan önizlemesi kartı (ilk mesaj) -->
                            <div
                                v-for="(msg, index) in offerPanelMessages"
                                :key="msg.type === 'preview' ? 'preview' : `${msg.type}-${msg.id ?? index}`"
                                :class="
                                    msg.type === 'preview'
                                        ? ''
                                        : msg.type === 'system' || msg.type === 'request'
                                          ? 'flex justify-center'
                                          : msg.isMe
                                            ? 'flex justify-end'
                                            : 'flex justify-start'
                                "
                            >
                                <div
                                    v-if="msg.type === 'preview'"
                                    class="w-full rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                                >
                                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">İlan önizlemesi</p>
                                    <p class="text-sm font-medium text-gray-900 mb-1">
                                        {{ selectedOrigin?.name || '—' }} → {{ selectedDestination?.name || '—' }}
                                    </p>
                                    <p class="text-sm text-gray-600">{{ vehicleType }} · {{ capacity }}</p>
                                    <p class="text-sm font-semibold text-primary mt-2">{{ displayPrice }}</p>
                                </div>
                                <div
                                    v-else-if="msg.type === 'request'"
                                    class="w-full flex justify-center px-2"
                                >
                                    <div
                                        class="rounded-full border border-pink-200 bg-pink-50/95 px-3 py-2 text-center max-w-[95%] shadow-sm"
                                    >
                                        <p class="text-xs font-medium text-pink-900 m-0 leading-snug">{{ msg.text }}</p>
                                        <span class="text-[10px] text-pink-600 mt-1 block">{{ msg.time }}</span>
                                    </div>
                                </div>
                                <div
                                    v-else-if="msg.type === 'system'"
                                    class="w-full flex justify-center px-2"
                                >
                                    <div
                                        class="rounded-full border border-slate-200 bg-slate-100/90 px-3 py-2 text-center max-w-[95%] shadow-sm"
                                    >
                                        <p class="text-xs font-medium text-slate-700 m-0 leading-snug">{{ msg.text }}</p>
                                        <span class="text-[10px] text-slate-500 mt-1 block">{{ msg.time }}</span>
                                    </div>
                                </div>
                                <div
                                    v-else
                                    :class="[
                                        'max-w-[85%] px-3 py-2 rounded-lg flex flex-col gap-0.5',
                                        msg.isMe
                                            ? 'bg-primary text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                    ]"
                                >
                                    <p class="text-sm leading-snug">{{ msg.text }}</p>
                                    <span class="text-xs opacity-80">{{ msg.time }}</span>
                                </div>
                            </div>
                            <p
                                v-if="!offerPanelMessages.length"
                                class="text-sm text-gray-500 text-center py-4"
                            >
                                Henüz mesaj yok. Aşağıdan mesaj göndererek başlayın.
                            </p>
                        </div>
                        <!-- Özel teklif gönder (mesaj inputunun üstünde) -->
                        <div
                            v-if="!canSendOfferMessage"
                            class="w-full shrink-0 border-t border-amber-200 bg-amber-50 p-3"
                        >
                            <p class="text-sm text-amber-900">Mesaj veya teklif göndermek için önce bir araç eklemelisiniz.</p>
                            <button
                                type="button"
                                class="mt-2 inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                                @click="router.push('/vehicle-owner/vehicles')"
                            >
                                <i class="pi pi-car" aria-hidden="true"></i>
                                Araç Ekle
                            </button>
                        </div>
                        <div class="w-full shrink-0 border-t border-gray-200 p-3 bg-white">
                            <button
                                type="button"
                                class="w-full py-2.5 px-3 rounded-lg border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                :disabled="!canSendOfferMessage"
                                @click="showTeklifModal = true"
                            >
                                Özel teklif gönder
                            </button>
                        </div>
                        <!-- Alt alan: mesaj yazma -->
                        <div class="w-full flex-shrink-0 border-t border-gray-200 p-2 bg-white">
                            <form @submit.prevent="sendOfferMessage" class="flex items-center gap-2">
                                <input
                                    v-model="newOfferMessageText"
                                    type="text"
                                    ref="message_input"
                                    :placeholder="canSendOfferMessage ? 'Mesajınızı yazın...' : 'Mesaj için önce araç ekleyin.'"
                                    class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    :disabled="!canSendOfferMessage"
                                />
                                <button
                                    type="submit"
                                    class="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                                    aria-label="Gönder"
                                    :disabled="!canSendOfferMessage"
                                >
                                    <i class="pi pi-send text-sm"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Ara modalı: İlan sahibini arıyorsunuz + önizleme + Ara / Vazgeç -->
        <Teleport to="body">
            <Transition name="modal">
                <div
                    v-if="showCallModal"
                    class="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="call-modal-title"
                >
                    <div class="absolute inset-0 bg-black/50" @click="showCallModal = false" />
                    <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h2 id="call-modal-title" class="text-lg font-semibold text-gray-900 mb-2">
                            İlan sahibini arıyorsunuz
                        </h2>
                        <p class="text-sm text-gray-600 mb-4">
                            Aşağıdaki ilan için iletişime geçmek üzeresiniz. Masaüstünde WhatsApp ile, mobilde arama ile yönlendirileceksiniz.
                        </p>
                        <!-- Önizleme -->
                        <div class="rounded-xl border border-gray-200 bg-gray-50/80 p-4 mb-5">
                            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">İlan önizlemesi</p>
                            <p class="text-sm font-medium text-gray-900 mb-1">
                                {{ selectedOrigin?.name || '—' }} → {{ selectedDestination?.name || '—' }}
                            </p>
                            <p class="text-sm text-gray-600">{{ ilanAracTipi }} · {{ ilanKapasite }}</p>
                            <p class="text-sm font-semibold text-primary mt-2">{{ displayPrice }}</p>
                        </div>
                        <div class="flex gap-3">
                            <button
                                type="button"
                                class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                                @click="showCallModal = false"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="button"
                                class="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-[#2f7f88] text-white font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                                :disabled="!creatorPhone"
                                @click="confirmCall"
                            >
                                Ara
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>

</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import ProgressSpinner from 'primevue/progressspinner';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import api from '@/api';
import { router } from '@/router';
import { useMessageStore } from '@/stores/message';
import { useAuthStore } from '@/stores/auth';
import { usePusherMessages } from '@/composables/usePusherMessages';
import {
    conversationEventMatchesThread,
    mapConversationMessageFromEvent,
} from '@/lib/message-helpers';
import TeklifVerModal from '@/components/TeklifVerModal.vue';
import { useHead } from '@vueuse/head';
import { storeToRefs } from 'pinia';

useHead({
    title: 'İlan Detayı | TaşıBul',
    meta: [
        { name: 'description', content: 'Bu ilanın detayını görüyorsunuz.' },
        { name: 'keywords', content: 'TaşıBul, İlan Detayı, İlan' },
        { name: 'author', content: 'TaşıBul' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'bingbot', content: 'index, follow' },
        { property: 'og:title', content: 'İlan Detayı | TaşıBul' },
        { property: 'og:description', content: 'Bu ilanın detayını görüyorsunuz.' },
        { property: 'og:image', content: 'https://www.tasibul.com/assets/yuk_arac-DpOYK3pA.png' }
    ]
});

const route = useRoute();
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const messageStore = useMessageStore();
const mapContainer = ref(null);
const map = ref(null);
const directionsService = ref(null);
const directionsRenderer = ref(null);
const distance = ref(null);
const duration = ref(null);
const routeCities = ref([]);
// Yol üzerindeki ilanlar: API'den doldurulur (routeCities ile istek atılır)
const routeListings = ref([]);
const routeListingsLoading = ref(false);
const mapError = ref(null);
const originDateTime = ref(null);
const destinationDateTime = ref(null);
const geocoder = ref(null);
const selectedOrigin = ref(null);
const selectedDestination = ref(null);
const message_input = useTemplateRef('message_input');

const is_me = ref(false);
const isCargoOwnerViewer = computed(() => !is_me.value && authStore.user?.type === 'cargo_owner');

const post = ref(null);
const shipment = ref(null);
const shipmentLoadError = ref(null);
const shipmentLoading = ref(true);

const checkIsMe = () => {  
    if (shipment.value.creator.id == authStore.user?.id) {
        is_me.value = true;
    }
};

async function geocodePlace(cityName, districtName) {
    const q = [cityName, districtName, 'Türkiye'].filter(Boolean).join(', ');
    if (!q) return null;
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=tr`,
            { headers: { 'Accept-Language': 'tr' } }
        );
        const data = await res.json();
        const item = data?.[0];
        if (item?.lat != null && item?.lon != null) {
            return { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
        }
    } catch (_) {}
    return null;
}

// Backend getPrice: 0 ise "Fiyat görüşülecektir", değilse Türkçe formatlı fiyat
const displayPrice = computed(() => {
    const p = shipment.value?.price;
    if (p == null) return 'Fiyat görüşülecektir';
    if (typeof p === 'string') return p;
    if (Number(p) === 0) return 'Fiyat görüşülecektir';
    return Number(p).toLocaleString('tr-TR') + " ₺";
});

// Paylaşım linkleri (Bu ilanı paylaş)
const shareUrls = computed(() => {
    let whatsappTarget = '';
    let genericUrl = '';
    if (typeof window !== 'undefined') {
        const current = new URL(window.location.href);
        genericUrl = current.toString();
        current.searchParams.set('via', 'whatsapp');
        whatsappTarget = current.toString();
    }
    const url = encodeURIComponent(genericUrl);
    const text = encodeURIComponent('TaşıBul üzerinden bu ilanı buldum:');

    return {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
        whatsapp: `https://wa.me/?text=${text}%20${encodeURIComponent(whatsappTarget)}`
    };
});

const creatorScoreText = computed(() => {
  const score = shipment.value?.creator?.comments_avg_score;
  if (score == null || score === '') return '0';
  const num = Number(score);
  if (Number.isNaN(num)) return '—';
  return num.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
});

// İlan bilgileri (tablo: shipment'tan)
const ilanAracTipi = computed(() => {
    const s = shipment.value;
    if (!s) return '—';
    const name = s.car?.name ?? '';
    const detail = s.get_car_detail?.value ?? s.car?.details?.[0]?.value ?? '';
    const d = String(detail).trim();
    if (!name && !d) return '—';
    return d ? `${name} / ${d.charAt(0).toUpperCase() + d.slice(1)}` : name;
});
const ilanKapasite = computed(() => {
    const cap = shipment.value?.capacity_ton ?? shipment.value?.capacity ?? 20;
    const n = typeof cap === 'number' ? cap : parseInt(cap, 10);
    return (Number.isNaN(n) ? 20 : n) + ' Ton';
});

const ilanYukTipi = computed(() => {
    const pt = shipment.value?.post_type ?? shipment.value?.postType;
    const val = pt?.value ?? pt?.name ?? '';
    return String(val).trim() || 'Genel Yük';
});
const ilanOzelIstek = computed(() => {
    const o = shipment.value?.special_requests ?? shipment.value?.ozel_istek ?? shipment.value?.notes ?? '';
    return String(o).trim() || 'Yok';
});
const postDescription = ref('');



const origin = { lat: 39.9334, lng: 32.8597 };
const destination = { lat: 38.4237, lng: 27.1428 };

async function loadShipmentAndSetLocations() {
    shipmentLoadError.value = null;
    shipmentLoading.value = true;
    const slug = route.params?.slug;
    if (!slug) {
        if (!selectedOrigin.value) selectedOrigin.value = { name: 'Ankara' };
        if (!selectedDestination.value) selectedDestination.value = { name: 'İzmir' };
        shipmentLoading.value = false;
        return;
    }
    try {
        const response = await api.get(`/shipments/${slug}`);
        const data = response.data;
        if (!data) {
            if (!selectedOrigin.value) selectedOrigin.value = { name: 'Ankara' };
            if (!selectedDestination.value) selectedDestination.value = { name: 'İzmir' };
            shipmentLoading.value = false;
            return;
        }
        const content = data.content ?? data.data ?? data;
        const s =
            content?.shipment
            ?? (content && (content.slug != null || content.f_where_city != null) ? content : null);
        if (s && typeof s === 'object') {
            shipment.value = s;
            const fCity = s.f_where_city;
            const fDistrict = s.f_where_district;
            const tCity = s.t_where_city;
            const tDistrict = s.t_where_district;
            selectedOrigin.value = { name: [fCity, fDistrict].filter(Boolean).join(' / ') || 'Kalkış' };
            selectedDestination.value = { name: [tCity, tDistrict].filter(Boolean).join(' / ') || 'Varış' };
            if (fCity || tCity) {
                const fromCoords = await geocodePlace(fCity, fDistrict);
                const toCoords = await geocodePlace(tCity, tDistrict);
                if (fromCoords) {
                    origin.lat = fromCoords.lat;
                    origin.lng = fromCoords.lng;
                }
                if (toCoords) {
                    destination.lat = toCoords.lat;
                    destination.lng = toCoords.lng;
                }
            }
            checkIsMe();
        }
    } catch (err) {
        console.log(err);
        
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || err?.message || 'İlan yüklenemedi';
        shipmentLoadError.value = status === 404 ? 'İlan bulunamadı.' : msg;
        console.error('Shipment yüklenemedi:', status, err?.response?.data ?? err?.message);
    }
    if (!selectedOrigin.value) selectedOrigin.value = { name: 'Ankara' };
    if (!selectedDestination.value) selectedDestination.value = { name: 'İzmir' };
    shipmentLoading.value = false;
}

// Slug değişince (farklı ilana tıklanınca) ilanı ve haritayı güncelle (ilk mount'ta onMounted halleder)
watch(
    () => route.params?.slug,
    async (newSlug, oldSlug) => {
        if (!newSlug || oldSlug === undefined || newSlug === oldSlug) return;
        distance.value = null;
        duration.value = null;
        routeCities.value = [];
        routeListings.value = [];
        await loadShipmentAndSetLocations();
        if (directionsService.value && directionsRenderer.value && map.value) {
            nextTick(() => calculateRoute());
        }
    }
);

onMounted(async () => {
    await nextTick();
    await loadShipmentAndSetLocations();

    if (!mapContainer.value) {
        mapError.value = 'Harita container bulunamadı. Sayfayı yenileyin.';
        return;
    }

    window.gm_authFailure = () => {
        mapError.value = 'Google Maps API key geçersiz veya API\'ler etkinleştirilmemiş. Lütfen Google Cloud Console\'u kontrol edin.';
        console.error('Google Maps authentication failed');
    };

    let attempts = 0;
    const maxAttempts = 150;

    const checkGoogle = () => {
        attempts++;
        if (!mapContainer.value) {
            mapError.value = 'Harita container kayboldu. Sayfayı yenileyin.';
            return;
        }
        if ((window.google && window.google.maps) || window.googleMapsLoaded) {
            setTimeout(() => {
                if (window.google && window.google.maps) {
                    initializeMap();
                } else {
                    mapError.value = 'Google Maps API yüklendi ancak kullanılamıyor. API key\'inizi kontrol edin.';
                }
            }, 200);
        } else if (attempts < maxAttempts) {
            setTimeout(checkGoogle, 100);
        } else {
            mapError.value = 'Google Maps API yüklenemedi. Lütfen API key\'inizi ve API\'lerin etkin olduğunu kontrol edin.';
        }
    };

    if ((window.google && window.google.maps) || window.googleMapsLoaded) {
        setTimeout(() => initializeMap(), 200);
    } else {
        checkGoogle();
    }
});

const initializeMap = () => {
    // Container'ı tekrar kontrol et
    if (!mapContainer.value) {
        mapError.value = 'Harita container bulunamadı';
        console.error('Map container not found in initializeMap');
        return;
    }

    // Container'ın DOM'da olduğundan emin ol
    if (!document.contains(mapContainer.value)) {
        mapError.value = 'Harita container DOM\'da bulunamadı';
        console.error('Map container not in DOM');
        return;
    }

    try {
        // Haritayı oluştur
        map.value = new window.google.maps.Map(mapContainer.value, {
            zoom: 7,
            center: { lat: (origin.lat + destination.lat) / 2, lng: (origin.lng + destination.lng) / 2 },
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true
        });

        console.log('Map initialized successfully');

        // Directions Service ve Renderer oluştur
        directionsService.value = new window.google.maps.DirectionsService();
        directionsRenderer.value = new window.google.maps.DirectionsRenderer({
            map: map.value,
            suppressMarkers: false,
            polylineOptions: {
                strokeColor: '#39838C',
                strokeWeight: 5
            }
        });

        // Geocoder oluştur
        geocoder.value = new window.google.maps.Geocoder();

        // Rota hesapla
        calculateRoute();
        mapError.value = null; // Başarılı olduysa hatayı temizle
    } catch (error) {
        mapError.value = 'Harita başlatılamadı: ' + error.message;
        console.error('Error initializing map:', error);
    }
};

const retryMap = () => {
    mapError.value = null;
    if (window.google && window.google.maps) {
        initializeMap();
    } else {
        // Sayfayı yeniden yükle
        window.location.reload();
    }
};

const calculateRoute = () => {
    if (!directionsService.value || !directionsRenderer.value) {
        console.error('Directions service or renderer not initialized');
        return;
    }

    console.log('Calculating route...');

    directionsService.value.route(
        {
            origin: origin,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true
        },
        (result, status) => {
            if (status === 'OK' && result) {
                console.log('Route calculated successfully');
                directionsRenderer.value.setDirections(result);
                
                // Mesafe ve süre bilgilerini al
                const route = result.routes[0];
                if (route && route.legs && route.legs.length > 0) {
                    const leg = route.legs[0];
                    distance.value = leg.distance.text;
                    duration.value = leg.duration.text;
                }
                // Yol üzerindeki şehirleri haritadan çıkar
                extractCitiesFromRoute(result);
            } else {
                let errorMsg = 'Rota hesaplanamadı: ' + status;
                if (status === 'REQUEST_DENIED') {
                    errorMsg = 'API key geçersiz veya Directions API etkinleştirilmemiş. Lütfen Google Cloud Console\'u kontrol edin.';
                } else if (status === 'OVER_QUERY_LIMIT') {
                    errorMsg = 'API kullanım limiti aşıldı. Lütfen daha sonra tekrar deneyin.';
                } else if (status === 'ZERO_RESULTS') {
                    errorMsg = 'Bu iki nokta arasında rota bulunamadı.';
                }
                mapError.value = errorMsg;
                console.error('Directions request failed due to ' + status);
            }
        }
    );
};

/** Google Geocoder'dan gelen şehir adını DB ile uyumlu forma getirir (İli, Province vb. kaldırır) */
function normalizeCityName(name) {
    if (!name || typeof name !== 'string') return '';
    let s = name.trim();
    const suffixes = [' İli', ' İl', ' Province'];
    for (const suf of suffixes) {
        if (s.endsWith(suf)) {
            s = s.slice(0, -suf.length).trim();
            break;
        }
    }
    return s;
}

const extractCitiesFromRoute = (directionsResult) => {
    if (!geocoder.value || !directionsResult?.routes?.[0]) return;
    
    const citySet = new Set();
    const steps = [];
    
    for (const leg of directionsResult.routes[0].legs || []) {
        for (const step of leg.steps || []) {
            if (step.start_location) steps.push(step.start_location);
        }
    }
    
    if (steps.length === 0) {
        routeCities.value = [];
        fetchRouteListings();
        return;
    }
    
    // Rota boyunca örnek noktalar al (kalkış ve varış hariç, max 30 nokta – tüm şehirler için)
    const maxSamples = 30;
    const sampleIndices = [];
    const n = steps.length;
    const midCount = n <= 2 ? 0 : n - 2;
    if (midCount === 0) {
        routeCities.value = [];
        fetchRouteListings();
        return;
    }
    if (midCount <= maxSamples) {
        for (let i = 1; i < n - 1; i++) sampleIndices.push(i);
    } else {
        for (let i = 0; i < maxSamples; i++) {
            sampleIndices.push(1 + Math.floor((i * (midCount - 1)) / (maxSamples - 1)));
        }
    }
    
    const geocodePromises = sampleIndices.map((idx) => {
        const loc = steps[idx];
        const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
        const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
        const latLng = { lat, lng };
        return new Promise((resolve) => {
            geocoder.value.geocode({ location: latLng }, (results, status) => {
                if (status === 'OK' && results?.[0]) {
                    const comp = results[0].address_components;
                    const city = comp.find((c) =>
                        c.types.includes('administrative_area_level_1') || c.types.includes('locality')
                    );
                    resolve(city?.long_name || null);
                } else {
                    resolve(null);
                }
            });
        });
    });
    
    Promise.all(geocodePromises).then((cities) => {
        const originCityPart = (selectedOrigin.value?.name || '').split(' / ')[0]?.trim().toLowerCase() || '';
        const destCityPart = (selectedDestination.value?.name || '').split(' / ')[0]?.trim().toLowerCase() || '';
        cities.filter(Boolean).forEach((c) => {
            const normalized = normalizeCityName(c);
            if (!normalized) return;
            const cityLower = normalized.toLowerCase();
            if (cityLower !== originCityPart && cityLower !== destCityPart) citySet.add(normalized);
        });
        routeCities.value = [...citySet];
        fetchRouteListings();
    });
};

async function fetchRouteListings() {
    const s = shipment.value;
    const originCity = normalizeCityName(s?.f_where_city || selectedOrigin.value?.name?.split(' / ')[0]?.trim() || '');
    const destCity = normalizeCityName(s?.t_where_city || selectedDestination.value?.name?.split(' / ')[0]?.trim() || '');
    const middle = routeCities.value.map((c) => normalizeCityName(c)).filter(Boolean);
    const citiesOrdered = [originCity, ...middle, destCity].filter(Boolean);
    const cities = [...new Set(citiesOrdered)];
    if (!cities.length) {
        routeListings.value = [];
        return;
    }
    routeListingsLoading.value = true;
    try {
        const { data } = await api.post('/shipments/intercity', { cities });
        const raw = data?.content?.shipments ?? data?.shipments ?? data?.data?.shipments ?? [];
        const list = Array.isArray(raw) ? raw : [];
        const currentSlug = s?.slug;
        routeListings.value = currentSlug ? list.filter((item) => item.slug !== currentSlug) : list;
    } catch (err) {
        console.warn('Yol üzerindeki ilanlar yüklenemedi:', err?.response?.data ?? err?.message);
        routeListings.value = [];
    }
    routeListingsLoading.value = false;
}

const onOriginChange = (city) => {
    if (city && city.lat && city.lng) {
        origin.lat = city.lat;
        origin.lng = city.lng;
        if (map.value) {
            map.value.setCenter({
                lat: (origin.lat + destination.lat) / 2,
                lng: (origin.lng + destination.lng) / 2
            });
        }
        calculateRoute();
    }
};

const onDestinationChange = (city) => {
    if (city && city.lat && city.lng) {
        destination.lat = city.lat;
        destination.lng = city.lng;
        if (map.value) {
            map.value.setCenter({
                lat: (origin.lat + destination.lat) / 2,
                lng: (origin.lng + destination.lng) / 2
            });
        }
        calculateRoute();
    }
};

const swapLocations = () => {
    // Seçili şehirleri değiştir
    const tempCity = selectedOrigin.value;
    selectedOrigin.value = selectedDestination.value;
    selectedDestination.value = tempCity;

    // Noktaları değiştir
    const tempLat = origin.lat;
    const tempLng = origin.lng;
    origin.lat = destination.lat;
    origin.lng = destination.lng;
    destination.lat = tempLat;
    destination.lng = tempLng;

    // Tarih/saat bilgilerini de değiştir
    const tempDateTime = originDateTime.value;
    originDateTime.value = destinationDateTime.value;
    destinationDateTime.value = tempDateTime;

    // Haritayı güncelle
    if (map.value) {
        map.value.setCenter({
            lat: (origin.lat + destination.lat) / 2,
            lng: (origin.lng + destination.lng) / 2
        });
    }

    // Rotayı yeniden hesapla
    calculateRoute();
};

const recalculateRoute = () => {
    calculateRoute();
};

const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const showMessageOfferPanel = ref(false);
const messageOfferPanelVisible = ref(false);
const offerMessagesContainer = ref(null);

const offerPanelMessages = ref([]);
const newOfferMessageText = ref('');
const hasVehicleForOfferPanel = ref(true);
const isVehicleOwnerViewer = computed(() => authStore.user?.type === 'vehicle_owner');
const canSendOfferMessage = computed(() => !isVehicleOwnerViewer.value || hasVehicleForOfferPanel.value);

usePusherMessages(computed(() => authStore.user?.id), {
    onMessageSent(e) {
        const userId = authStore.user?.id;
        if (!userId || !showMessageOfferPanel.value) return;
        const receiverId = shipment.value?.creater_id ?? shipment.value?.creator?.id;
        if (!receiverId) return;
        const sid = shipment.value?.id;
        if (sid != null && e.shipment_id != null && Number(e.shipment_id) !== Number(sid)) return;
        if (!conversationEventMatchesThread(e, userId, Number(receiverId))) return;
        const row = mapConversationMessageFromEvent(e, userId);
        const preview = offerPanelMessages.value.find((m) => m.type === 'preview');
        const rest = offerPanelMessages.value.filter((m) => m.type !== 'preview');
        rest.push(row);
        rest.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
        offerPanelMessages.value = preview ? [preview, ...rest] : rest;
        if (Number(e.receiver_id) === Number(userId) && e.id) {
            void messageStore.markAsRead([e.id]);
        }
        nextTick(() => {
            const el = offerMessagesContainer.value;
            if (el) el.scrollTop = el.scrollHeight;
        });
    },
    onOfferSent(e) {
        if (!showMessageOfferPanel.value || !shipment.value?.slug) return;
        if (e.shipment_slug !== shipment.value.slug) return;
        refreshOfferPanelMessages();
        nextTick(() => {
            setTimeout(() => {
                const el = offerMessagesContainer.value;
                if (el) el.scrollTop = el.scrollHeight;
            }, 50);
        });
    },
    onOfferAccepted(e) {
        if (!showMessageOfferPanel.value || !shipment.value?.slug) return;
        if (e.shipment_slug != null && e.shipment_slug !== shipment.value.slug) return;
        refreshOfferPanelMessages();
    },
});

function buildOfferPanelMessages(messages) {
    const preview = {
        type: 'preview',
        created_at: '1970-01-01T00:00:00.000Z',
    };
    const withDate = (messages || []).filter((m) => m.created_at && m.type !== 'teklif');
    withDate.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return [preview, ...withDate];
}

async function openMessageOfferPanel() {
    await checkVehicleForOfferPanel();
    const receiverId = shipment.value?.creater_id ?? shipment.value?.creator?.id;
    const shipmentId = shipment.value?.id ?? null;
    const msgResult = await messageStore.getBySenderAndReceiver(receiverId, shipmentId);
    const messages = msgResult.success && Array.isArray(msgResult.data) ? msgResult.data : [];
    offerPanelMessages.value = buildOfferPanelMessages(messages);
    const idsToMark = messages.filter((m) => m.id && !m.isMe).map((m) => m.id);
    if (idsToMark.length) await messageStore.markAsRead(idsToMark);

    showMessageOfferPanel.value = true;
    nextTick(() => {
        messageOfferPanelVisible.value = true;
        nextTick(() => {
            setTimeout(() => {
                const el = offerMessagesContainer.value;
                if (el) el.scrollTop = el.scrollHeight;
                message_input.value?.focus();
            }, 50);
        });
    });
}

function closeMessageOfferPanel() {
    messageOfferPanelVisible.value = false;
    setTimeout(() => {
        showMessageOfferPanel.value = false;
    }, 300);
}

function closeAllPanels() {
    showTeklifModal.value = false;
    closeMessageOfferPanel();
}

async function onTeklifModalSuccess() {
    if (showMessageOfferPanel.value) await refreshOfferPanelMessages();
}

async function sendOfferMessage() {
    if (!canSendOfferMessage.value) return;
    const text = newOfferMessageText.value?.trim();
    if (!text) return;

    const receiverId = shipment.value?.creater_id ?? shipment.value?.creator?.id;
    const currentUserId = authStore.user?.id;
    if (!receiverId || !currentUserId) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = { type: 'message', id: tempId, text, time: 'Şimdi', isMe: true, created_at: new Date().toISOString() };
    const preview = offerPanelMessages.value[0];
    const rest = offerPanelMessages.value.slice(1).filter((m) => m.type !== 'preview');
    rest.push(optimisticMsg);
    rest.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
    offerPanelMessages.value = preview ? [preview, ...rest] : rest;
    newOfferMessageText.value = '';
    nextTick(() => {
        const el = offerMessagesContainer.value;
        if (el) el.scrollTop = el.scrollHeight;
    });

    const result = await messageStore.createMessage({
        shipment_id: shipment.value?.id,
        receiver_id: receiverId,
        message: text,
    });

    if (!result.success) {
        offerPanelMessages.value = offerPanelMessages.value.filter((m) => m.id !== tempId);
        console.warn('Mesaj gönderilemedi:', result.error);
        return;
    }

    await refreshOfferPanelMessages();
    nextTick(() => {
        setTimeout(() => {
            const el = offerMessagesContainer.value;
            if (el) el.scrollTop = el.scrollHeight;
        }, 50);
    });
}

async function checkVehicleForOfferPanel() {
    if (!isVehicleOwnerViewer.value) {
        hasVehicleForOfferPanel.value = true;
        return;
    }
    try {
        const res = await api.get('/cars/my');
        const cars = res.data?.content?.cars;
        hasVehicleForOfferPanel.value = Array.isArray(cars) && cars.length > 0;
    } catch {
        hasVehicleForOfferPanel.value = false;
    }
}

async function refreshOfferPanelMessages() {
    const receiverId = shipment.value?.creater_id ?? shipment.value?.creator?.id;
    const shipmentId = shipment.value?.id ?? null;
    if (!receiverId) return;
    const msgResult = await messageStore.getBySenderAndReceiver(receiverId, shipmentId);
    const messages = msgResult.success && Array.isArray(msgResult.data) ? msgResult.data : [];
    offerPanelMessages.value = buildOfferPanelMessages(messages);
}

const showTeklifModal = ref(false);
const handleOfferClick = () => {
    showTeklifModal.value = true;
};

const showCallModal = ref(false);
const creatorPhone = computed(() => {
    const phone = shipment.value?.creator?.phone;
    if (!phone || typeof phone !== 'string') return '';
    return phone.replace(/\s/g, '');
});

/** Türkiye telefon gösterimi: 0XXX XXX XX XX */
function formatPhoneTR(phone) {
    if (!phone || typeof phone !== 'string') return '';
    let d = phone.replace(/\D/g, '');
    if (d.startsWith('90') && d.length >= 12) d = '0' + d.slice(2);
    else if (d.length === 10 && !d.startsWith('0')) d = '0' + d;
    if (d.length !== 11 || d[0] !== '0') return phone.trim();
    return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 9)} ${d.slice(9, 11)}`;
}
function openCallModal() {
    showCallModal.value = true;
}
function confirmCall() {
    const phone = creatorPhone.value;
    if (!phone) return;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.matchMedia('(max-width: 768px)').matches;
    showCallModal.value = false;
    if (isMobile) {
        const digits = phone.replace(/\D/g, '');
        const tel = digits.startsWith('90') ? '+' + digits : (digits.startsWith('0') ? '+90' + digits.slice(1) : '+90' + digits);
        window.location.href = 'tel:' + tel;
    } else {
        const from = selectedOrigin.value?.name || '—';
        const to = selectedDestination.value?.name || '—';
        const text = encodeURIComponent(`Merhaba, ${from} - ${to} ilanınız hakkında iletişime geçmek istiyorum.`);
        const num = phone.replace(/\D/g, '').replace(/^0/, '90');
        const waNum = num.startsWith('90') ? num : '90' + num;
        window.open(`https://wa.me/${waNum}?text=${text}`, '_blank');
    }
}

// Carousel’daki seçili araç: "Araç ismi" + varsa " detay ismi"
const showRoute = () => {
    if (!map.value || !directionsRenderer.value) {
        return;
    }
    
    // Haritayı orijinal rotaya geri döndür
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend(destination);
    
    map.value.fitBounds(bounds);
    
    // Rotayı yeniden göster
    if (directionsRenderer.value) {
        calculateRoute();
    }
};

onBeforeUnmount(() => {
    if (directionsRenderer.value) {
        directionsRenderer.value.setMap(null);
    }
});

onMounted(() => {
    console.log("shipment:", shipment.value);
});
</script>

<style scoped>
#map {
    width: 100%;
    height: 100%;
    min-height: 300px;
}

/* Map container için ek stil */
.map-container {
    width: 100%;
    height: 100%;
    min-height: 300px;
}

.no_scrool {
    scrollbar-width: none;
    -ms-overflow-style: none;
    overflow-y: scroll;
}

.no_scrool::-webkit-scrollbar {
    display: none;
}

</style>
