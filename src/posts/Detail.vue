<template>
    <div class="h-screen overflow-hidden">
        <Header />
        <Content class="mt-5 flex-1 overflow-y-auto flex gap-4 relative">
            <!-- Sol kolon: aynı divler, loading'de gri + pulse -->
            <div
                class="w-[800px] flex flex-col gap-4 no_scrool pb-[300px] transition-all duration-200"
                :class="shipmentLoading ? 'opacity-60 pointer-events-none' : ''"
            >
                <h2 class="text-2xl font-semibold text-gray-900 h-9">Taşıma Bilgileri</h2>
                <div
                    class="bg-white h-[350px] rounded-md relative transition-colors duration-200"
                    :class="shipmentLoading ? 'bg-gray-200 animate-pulse' : ''"
                >
                    <div v-if="mapError" class="w-full h-[350px] flex items-center justify-center bg-red-50 border border-red-200 rounded-md">
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
                    <div v-else ref="mapContainer" id="map" class="w-full h-[350px] rounded-md"></div>
                    <!-- Rotayı Göster Butonu -->
                    <button
                        v-if="!mapError && map"
                        @click="showRoute"
                        class="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl border border-gray-200 hover:border-primary transition-all duration-200 font-medium text-sm"
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
                    <div class="flex items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <div>
                                <span class="text-sm text-gray-500">Mesafe:</span>
                                <span class="ml-2 text-lg font-semibold text-gray-900">{{ distance }}</span>
                            </div>
                            <div>
                                <span class="text-sm text-gray-500">Süre:</span>
                                <span class="ml-2 text-lg font-semibold text-gray-900">{{ duration }}</span>
                            </div>
                        </div>
                        <span class="text-sm text-primary font-semibold">{{ shipment?.price }}</span>
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
                    class="rounded-md border border-gray-200 shadow-sm p-6 transition-colors duration-200"
                    :class="shipmentLoading ? 'bg-gray-200 animate-pulse' : 'bg-white'"
                >
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Yol Üzerindeki İlanlar</h3>
                    <p v-if="routeCities.length" class="text-sm text-gray-500 mb-4">
                        <span class="font-medium text-gray-700">Yol üzerindeki şehirler:</span>
                        {{ routeCities.join(', ') }}
                    </p>
                    <div class="grid gap-3">
                        <RouterLink
                            v-for="(listing, idx) in routeListings"
                            :key="listing.slug || idx"
                            :to="listing.slug ? { path: `/posts/${listing.slug}` } : {}"
                            class="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50/80 p-3 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                        >
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-semibold text-gray-900 truncate">
                                    {{ listing.from }} → {{ listing.to }}
                                </p>
                                <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-600">
                                    <span class="flex items-center gap-1">
                                        <i class="pi pi-clock text-primary" style="font-size: 0.7rem"></i>
                                        {{ listing.time }}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <i class="pi pi-box text-primary" style="font-size: 0.7rem"></i>
                                        {{ listing.loadAmount }}
                                    </span>
                                </div>
                            </div>
                            <span class="text-xs font-medium text-primary shrink-0">İlana git</span>
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
                    class="rounded-md p-6 border border-gray-200 shadow-sm transition-colors duration-200"
                    :class="shipmentLoading ? 'bg-gray-200 animate-pulse' : 'bg-white'"
                >
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">İlan Açıklaması</h3>
                    
                    <!-- Açıklama Metni -->
                    <div class="mb-6">
                        <p class="text-sm text-gray-700 leading-relaxed">
                            {{ postDescription || 'İlan açıklaması buraya gelecek. Taşımacılık detayları, özel istekler ve diğer önemli bilgiler bu bölümde yer alacak.' }}
                        </p>
                    </div>

                    <!-- Tablo -->
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr class="bg-gray-50">
                                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Özellik</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Değer</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Araç Tipi</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ ilanAracTipi }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Kapasite</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ ilanKapasite }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Yük Tipi</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ ilanYukTipi }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Özel İstek</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ ilanOzelIstek }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div
                class="flex-1 flex flex-col gap-4 transition-all duration-200"
                :class="shipmentLoading ? 'opacity-60 pointer-events-none' : ''"
            >
                <h2 class="text-2xl font-semibold text-gray-900 h-9">Rota Bilgileri</h2>
                
                <!-- Kalkış ve Varış Yeni Tasarım -->
                <div
                    class="rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-colors duration-200"
                    :class="shipmentLoading ? 'bg-gray-200 animate-pulse' : 'bg-white'"
                >
                    <div class="p-5">
                        <div class="flex items-start gap-4">
                            <!-- Sol: Yuvarlaklar ve Çizgi -->
                            <div class="flex flex-col items-center">
                                <!-- Üst Yuvarlak (Kalkış) -->
                                <div class="w-[5px] h-[5px] rounded-full bg-primary"></div>
                                <!-- Çizgi -->
                                <div class="w-px h-28 bg-gradient-to-b from-primary to-primary/30 my-2"></div>
                                <!-- Alt Yuvarlak (Varış) -->
                                <div class="w-[5px] h-[5px] rounded-full bg-primary"></div>
                            </div>
                            
                            <!-- Sağ: İçerik -->
                            <div class="flex-1 flex flex-col gap-6">
                                <!-- Kalkış -->
                                <div>
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="text-xs font-semibold text-primary uppercase tracking-wide">Kalkış</span>
                                        <span v-if="originDateTime" class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {{ formatDateTime(originDateTime) }}
                                        </span>
                                    </div>
                                    <h3 class="text-base font-semibold text-gray-900 mb-1 leading-tight">
                                        {{ selectedOrigin?.name || 'Ankara' }}
                                    </h3>
                                    <p class="text-sm text-gray-600"> 
                                        {{ shipment?.departure_time }}
                                    </p>
                                </div>
                                
                                <!-- Varış -->
                                <div>
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="text-xs font-semibold text-primary uppercase tracking-wide">Varış</span>
                                        <span v-if="destinationDateTime" class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {{ formatDateTime(destinationDateTime) }}
                                        </span>
                                    </div>
                                    <h3 class="text-base font-semibold text-gray-900 mb-1 leading-tight">
                                        {{ selectedDestination?.name || 'İzmir' }}
                                    </h3>
                                    <p class="text-sm text-gray-600">
                                        {{ shipment?.time_arrival }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="!is_me" class="bg-gray-50 border-t border-gray-100 w-full flex">
                        <button
                            @click="handleOfferClick"
                            class="flex-1 h-12 bg-primary text-white font-semibold transition-all duration-200 text-base"
                        >
                            Teklif Ver
                        </button>

                        <button
                            @click="openMessageOfferPanel"
                            class="flex-1 h-12 border-primary text-primary font-semibold transition-all duration-200 text-base"
                        >
                            Mesaj İle Teklif Ver
                        </button>
                    </div>
                    <div v-else class="bg-gray-50 border-t border-gray-100 w-full flex">
                        <button
                            class="flex-1 h-12 border-primary text-primary font-semibold transition-all duration-200 text-base"
                        >
                            İlanım
                        </button>
                    </div>
                </div>

                <!-- İlan Oluşturan Kişi Bilgileri -->
                <div
                    class="rounded-md p-6 border border-gray-200 shadow-sm h-auto transition-colors duration-200"
                    :class="shipmentLoading ? 'bg-gray-200 animate-pulse' : 'bg-white'"
                >
                    <div class="flex items-center gap-4">
                        <!-- Profil Resmi -->
                        <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <div class="w-full h-full bg-primary/20 flex items-center justify-center">
                                <span class="text-xl text-primary font-semibold">
                                    {{ shipment?.creator?.full_name?.charAt(0)?.toUpperCase() || 'U' }}
                                </span>
                            </div>
                        </div>
                        <!-- İsim ve Puan -->
                        <div class="flex flex-col gap-2">
                            <h4 class="text-md font-semibold text-gray-900">
                                {{ shipment?.creator?.full_name }}
                            </h4>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-600">Puan:</span>
                                <div class="flex items-center gap-1">
                                    <span class="text-md font-semibold text-gray-900">
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
                <!-- Mesaj ile Teklif Ver – sağdan kayan panel -->
                <div
                    v-if="showMessageOfferPanel"
                    class="relative h-screen w-96 bg-white border-l border-gray-200 shadow-xl flex flex-col transition-transform duration-300 ease-out z-10 ml-auto"
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
                                :class="msg.type !== 'preview' && msg.isMe ? 'flex justify-end' : msg.type !== 'preview' ? 'flex justify-start' : ''"
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
                                    v-else-if="msg.type === 'teklif'"
                                    class="max-w-[85%] w-full"
                                >
                                    <div class="rounded-lg border-2 border-primary/30 bg-white p-3 shadow-sm min-w-[200px] max-w-full">
                                        <p class="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Verilen Teklif</p>
                                        <p v-if="msg.carName" class="text-sm font-medium text-gray-900 mb-1">{{ msg.carName }}</p>
                                        <p class="text-sm font-semibold text-primary mb-1">{{ msg.price }}</p>
                                        <p v-if="msg.message" class="text-sm text-gray-600 mt-2 border-t border-gray-100 pt-2">{{ msg.message }}</p>
                                        <span class="text-xs text-gray-500 mt-2 block">{{ msg.time }}</span>
                                        <button
                                            v-if="isShipmentOwner && msg.status !== 'accepted'"
                                            type="button"
                                            class="mt-3 w-full py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                            :disabled="teklifAcceptLoading === msg.id"
                                            @click="acceptTeklif(msg.id)"
                                        >
                                            {{ teklifAcceptLoading === msg.id ? 'İşleniyor...' : 'Teklifi Kabul Et' }}
                                        </button>
                                        <p v-else-if="isShipmentOwner && msg.status === 'accepted'" class="mt-2 text-sm font-medium text-green-600">Kabul edildi</p>
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
                        <div class="w-full shrink-0 border-t border-gray-200 p-3 bg-white">
                            <button
                                type="button"
                                class="w-full py-2.5 px-3 rounded-lg border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors"
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
                                    placeholder="Mesajınızı yazın..."
                                    class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                />
                                <button
                                    type="submit"
                                    class="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                                    aria-label="Gönder"
                                >
                                    <i class="pi pi-send text-sm"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>

</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import ProgressSpinner from 'primevue/progressspinner';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import api from '@/api';
import { router } from '@/router';
import { useMessageStore, formatMessageTime } from '@/stores/message';
import { useAuthStore } from '@/stores/auth';
import TeklifVerModal from '@/components/TeklifVerModal.vue';

const route = useRoute();
const authStore = useAuthStore()
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

const is_me = ref(false);

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
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = 'Bu ilana göz at';
    return {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
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
        return;
    }
    
    // Rota boyunca örnek noktalar al (kalkış ve varış hariç, max 30 nokta – tüm şehirler için)
    const maxSamples = 30;
    const sampleIndices = [];
    const n = steps.length;
    const midCount = n <= 2 ? 0 : n - 2;
    if (midCount === 0) {
        routeCities.value = [];
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
        const originName = (selectedOrigin.value?.name || '').toLowerCase();
        const destName = (selectedDestination.value?.name || '').toLowerCase();
        cities.filter(Boolean).forEach((c) => {
            const cityLower = c.toLowerCase();
            if (cityLower !== originName && cityLower !== destName) citySet.add(c);
        });
        routeCities.value = [...citySet];
        fetchRouteListings();
    });
};

async function fetchRouteListings() {
    const s = shipment.value;
    const originCity = s?.f_where_city || selectedOrigin.value?.name?.split(' / ')[0]?.trim();
    const destCity = s?.t_where_city || selectedDestination.value?.name?.split(' / ')[0]?.trim();
    const cities = [originCity, ...routeCities.value, destCity].filter(Boolean);
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

function buildOfferPanelMessages(messages, requests, currentUserId) {
    const preview = { type: 'preview' };
    const teklifItems = (requests || [])
        .filter((r) => Number(r.user_id) === Number(currentUserId))
        .map((r) => ({
            type: 'teklif',
            id: r.id,
            isMe: true,
            carName: r.car?.name ?? '',
            price: r.price ?? '—',
            message: r.message ?? '',
            time: formatMessageTime(r.created_at_raw ?? r.created_at),
            created_at: r.created_at_raw ?? r.created_at,
            status: r.status ?? 'pending',
        }));
    const withDate = [...(messages || []), ...teklifItems].filter((m) => m.created_at);
    withDate.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return [preview, ...withDate];
}

async function openMessageOfferPanel() {
    const receiverId = shipment.value?.creater_id ?? shipment.value?.creator?.id;
    const slug = route.params?.slug;
    const currentUserId = authStore.user?.id;

    const [msgResult, requestsRes] = await Promise.all([
        messageStore.getBySenderAndReceiver(receiverId),
        slug ? api.get(`/shipments/${slug}/requests`).catch(() => ({ data: {} })) : Promise.resolve({ data: {} }),
    ]);

    const messages = msgResult.success && Array.isArray(msgResult.data) ? msgResult.data : [];
    const content = requestsRes.data?.content ?? requestsRes.data?.data ?? requestsRes.data ?? {};
    const requests = content?.shipment?.requests ?? [];

    offerPanelMessages.value = buildOfferPanelMessages(messages, requests, currentUserId);

    showMessageOfferPanel.value = true;
    nextTick(() => {
        messageOfferPanelVisible.value = true;
        nextTick(() => {
            setTimeout(() => {
                const el = offerMessagesContainer.value;
                if (el) el.scrollTop = el.scrollHeight;
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

const isShipmentOwner = computed(() => {
    const createrId = shipment.value?.creater_id ?? shipment.value?.creator?.id;
    return createrId != null && Number(createrId) === Number(authStore.user?.id);
});

const teklifAcceptLoading = ref(null);

async function acceptTeklif(requestId) {
    const slug = route.params?.slug;
    if (!slug) return;
    teklifAcceptLoading.value = requestId;
    try {
        await api.post(`/shipments/${slug}/requests/${requestId}/accept`);
        await refreshOfferPanelMessages();
        nextTick(() => {
            setTimeout(() => {
                const el = offerMessagesContainer.value;
                if (el) el.scrollTop = el.scrollHeight;
            }, 50);
        });
    } catch (err) {
        console.warn('Teklif kabul edilemedi:', err?.response?.data?.message ?? err?.message);
    } finally {
        teklifAcceptLoading.value = null;
    }
}

async function sendOfferMessage() {
    const text = newOfferMessageText.value?.trim();
    if (!text) return;

    const shipmentId = shipment.value?.id;
    const receiverId = shipment.value?.creater_id ?? shipment.value?.creator?.id;

    const result = await messageStore.createMessage({
        shipment_id: shipmentId,
        receiver_id: receiverId,
        message: text,
    });

    if (!result.success) {
        console.warn('Mesaj gönderilemedi:', result.error);
        return;
    }

    newOfferMessageText.value = '';
    await refreshOfferPanelMessages();
    nextTick(() => {
        setTimeout(() => {
            const el = offerMessagesContainer.value;
            if (el) el.scrollTop = el.scrollHeight;
        }, 50);
    });
}

async function refreshOfferPanelMessages() {
    const receiverId = shipment.value?.creater_id ?? shipment.value?.creator?.id;
    const slug = route.params?.slug;
    const currentUserId = authStore.user?.id;
    if (!receiverId) return;

    const [msgResult, requestsRes] = await Promise.all([
        messageStore.getBySenderAndReceiver(receiverId),
        slug ? api.get(`/shipments/${slug}/requests`).catch(() => ({ data: {} })) : Promise.resolve({ data: {} }),
    ]);
    const messages = msgResult.success && Array.isArray(msgResult.data) ? msgResult.data : [];
    const content = requestsRes.data?.content ?? requestsRes.data?.data ?? requestsRes.data ?? {};
    const requests = content?.shipment?.requests ?? [];
    offerPanelMessages.value = buildOfferPanelMessages(messages, requests, currentUserId);
}

const showTeklifModal = ref(false);
const handleOfferClick = () => {
    showTeklifModal.value = true;
};


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
