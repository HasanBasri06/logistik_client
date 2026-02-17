<template>
    <div class="h-screen overflow-hidden">
        <Header />
        <Content class="mt-5 flex-1 overflow-y-auto flex gap-4">
            <div class="w-[800px] flex flex-col gap-4 no_scrool pb-[300px]">
                <h2 class="text-2xl font-semibold text-gray-900 h-9">Taşıma Bilgileri</h2>
                <div class="bg-white h-[350px] rounded-md relative">
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
                <div v-if="distance" class="bg-white rounded-md p-4 border border-gray-200">
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
                        <span class="text-sm text-primary font-semibold">Fiyat görüşülecektir</span>
                    </div>
                </div>

                <!-- Bu ilanı paylaş -->
                <div class="bg-white rounded-md p-4 border border-gray-200">
                    <h3 class="text-sm font-semibold text-gray-900 mb-3">Bu ilanı paylaş</h3>
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
                <div class="bg-white rounded-md border border-gray-200 shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Yol Üzerindeki İlanlar</h3>
                    <p v-if="routeCities.length" class="text-sm text-gray-600">
                        <span class="font-medium text-gray-700">Yol üzerindeki şehirler:</span>
                        {{ routeCities.join(', ') }}
                    </p>
                    <p v-else-if="distance" class="text-sm text-gray-500">
                        Yol üzerindeki şehirler yükleniyor...
                    </p>
                    <p v-else class="text-sm text-gray-500">
                        Rota gösterildiğinde yol üzerindeki şehirler burada listelenecek.
                    </p>
                </div>

                <!-- İlan Açıklaması -->
                <div class="bg-white rounded-md p-6 border border-gray-200 shadow-sm">
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
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ vehicleType || 'Kamyon' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Kapasite</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ capacity || '20 Ton' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Yük Tipi</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ loadType || 'Genel Yük' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Özel İstekler</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ specialRequests || 'Yok' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Araç Tipi</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ vehicleType || 'Kamyon' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Kapasite</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ capacity || '20 Ton' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Yük Tipi</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ loadType || 'Genel Yük' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Özel İstekler</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ specialRequests || 'Yok' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Araç Tipi</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ vehicleType || 'Kamyon' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Kapasite</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ capacity || '20 Ton' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Yük Tipi</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ loadType || 'Genel Yük' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Özel İstekler</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ specialRequests || 'Yok' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Araç Tipi</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ vehicleType || 'Kamyon' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Kapasite</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ capacity || '20 Ton' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Yük Tipi</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ loadType || 'Genel Yük' }}</td>
                                </tr>
                                <tr class="border-b border-gray-100">
                                    <td class="px-4 py-3 text-sm text-gray-600">Özel İstekler</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ specialRequests || 'Yok' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="flex-1 flex flex-col gap-4">
                <h2 class="text-2xl font-semibold text-gray-900 h-9">Rota Bilgileri</h2>
                
                <!-- Kalkış ve Varış Yeni Tasarım -->
                <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
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
                                    <p class="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                        {{ originAddress || 'Adres bilgisi yükleniyor...' }}
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
                                    <p class="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                        {{ destinationAddress || 'Adres bilgisi yükleniyor...' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Teklif Ver Butonu -->
                    <div class="bg-gray-50 border-t border-gray-100 w-full flex">
                        <button
                            @click="handleOfferClick"
                            class="flex-1 h-12 bg-primary text-white font-semibold transition-all duration-200 text-base"
                        >
                            Teklif Ver
                        </button>

                        <button
                            @click="handleOfferClick"
                            class="flex-1 h-12 border-primary text-primary font-semibold transition-all duration-200 text-base"
                        >
                            Mesaj İle Teklif Ver
                        </button>
                    </div>
                </div>

                <!-- İlan Oluşturan Kişi Bilgileri -->
                <div class="bg-white rounded-md p-6 border border-gray-200 shadow-sm h-auto">
                    <div class="flex items-center gap-4">
                        <!-- Profil Resmi -->
                        <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img 
                                v-if="userInfo?.avatar" 
                                :src="userInfo.avatar" 
                                :alt="userInfo.name"
                                class="w-full h-full object-cover"
                            />
                            <div v-else class="w-full h-full bg-primary/20 flex items-center justify-center">
                                <span class="text-xl text-primary font-semibold">
                                    {{ userInfo?.name?.charAt(0)?.toUpperCase() || 'U' }}
                                </span>
                            </div>
                        </div>
                        <!-- İsim ve Puan -->
                        <div class="flex flex-col gap-2">
                            <h4 class="text-md font-semibold text-gray-900">
                                {{ userInfo?.name || 'Kullanıcı Adı' }}
                            </h4>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-600">Puan:</span>
                                <div class="flex items-center gap-1">
                                    <span class="text-md font-semibold text-gray-900">
                                        {{ userInfo?.rating || '0.0' }}
                                    </span>
                                    <span class="text-yellow-500">★</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';

const route = useRoute();
const mapContainer = ref(null);
const map = ref(null);
const directionsService = ref(null);
const directionsRenderer = ref(null);
const distance = ref(null);
const duration = ref(null);
const routeCities = ref([]);
const mapError = ref(null);
const originAddress = ref(null);
const destinationAddress = ref(null);
const originDateTime = ref(null);
const destinationDateTime = ref(null);
const geocoder = ref(null);
const selectedOrigin = ref(null);
const selectedDestination = ref(null);
const userInfo = ref({
    name: 'Ahmet Yılmaz',
    avatar: null,
    rating: 4.8
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

// İlan bilgileri
const postDescription = ref('Ankara\'dan İstanbul\'a güvenli ve hızlı taşımacılık hizmeti. Deneyimli sürücü ve modern araç filosu ile yükünüzü güvenle taşıyoruz. Özel yükler için özel çözümler sunuyoruz.');
const vehicleType = ref('Kamyon');
const capacity = ref('20 Ton');
const loadType = ref('Genel Yük');
const specialRequests = ref('Soğuk zincir gerektiren yükler için uygun değildir.');

// Şehir listesi
const cities = ref([
    { name: 'Ankara', code: 'ANK', lat: 39.9334, lng: 32.8597 },
    { name: 'İstanbul', code: 'IST', lat: 41.0082, lng: 28.9784 },
    { name: 'İzmir', code: 'IZM', lat: 38.4237, lng: 27.1428 },
    { name: 'Bursa', code: 'BUR', lat: 40.1826, lng: 29.0665 },
    { name: 'Antalya', code: 'ANT', lat: 36.8969, lng: 30.7133 },
    { name: 'Pendik', code: 'PEN', lat: 40.8764, lng: 29.2353 },
]);

// Örnek koordinatlar (Ankara - İzmir)
const origin = { lat: 39.9334, lng: 32.8597 }; // Ankara
const destination = { lat: 38.4237, lng: 27.1428 }; // İzmir

// İlk değerleri ayarla
selectedOrigin.value = cities.value.find(c => c.code === 'ANK');
selectedDestination.value = cities.value.find(c => c.code === 'IZM');

onMounted(async () => {
    // DOM'un tamamen render edilmesini bekle
    await nextTick();
    
    // Map container'ın var olduğundan emin ol
    if (!mapContainer.value) {
        console.error('Map container not found after nextTick');
        mapError.value = 'Harita container bulunamadı. Sayfayı yenileyin.';
        return;
    }
    
    // Global error handler (önce tanımla)
    window.gm_authFailure = () => {
        mapError.value = 'Google Maps API key geçersiz veya API\'ler etkinleştirilmemiş. Lütfen Google Cloud Console\'u kontrol edin.';
        console.error('Google Maps authentication failed');
    };
    
    // Google Maps API yüklenene kadar bekle (max 15 saniye)
    let attempts = 0;
    const maxAttempts = 150; // 15 saniye
    
    const checkGoogle = () => {
        attempts++;
        
        // Her seferinde container'ı kontrol et
        if (!mapContainer.value) {
            console.error('Map container lost during initialization');
            mapError.value = 'Harita container kayboldu. Sayfayı yenileyin.';
            return;
        }
        
        // Hem window.google hem de callback kontrolü
        if ((window.google && window.google.maps) || window.googleMapsLoaded) {
            console.log('Google Maps API loaded');
            // Biraz daha bekle ki tamamen yüklensin
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
            console.error('Google Maps API failed to load after', attempts, 'attempts');
        }
    };
    
    // İlk kontrol
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

        // Adres bilgilerini al
        getAddresses();

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
    
    // Rota boyunca örnek noktalar al (kalkış ve varış hariç, max 8 nokta)
    const sampleIndices = [];
    const n = steps.length;
    const midCount = n <= 2 ? 0 : n - 2;
    if (midCount === 0) {
        routeCities.value = [];
        return;
    }
    if (midCount <= 8) {
        for (let i = 1; i < n - 1; i++) sampleIndices.push(i);
    } else {
        for (let i = 0; i < 8; i++) {
            sampleIndices.push(1 + Math.floor((i * (midCount - 1)) / 7));
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
    });
};

const getAddresses = () => {
    if (!geocoder.value) return;

    // Kalkış noktası adresini al
    geocoder.value.geocode({ location: origin }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
            originAddress.value = results[0].formatted_address;
        }
    });

    // Dönüş noktası adresini al
    geocoder.value.geocode({ location: destination }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
            destinationAddress.value = results[0].formatted_address;
        }
    });
};

const onOriginChange = (city) => {
    if (city && city.lat && city.lng) {
        origin.lat = city.lat;
        origin.lng = city.lng;
        originAddress.value = null; // Yeni adres almak için temizle
        getAddresses();
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
        destinationAddress.value = null; // Yeni adres almak için temizle
        getAddresses();
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

    // Adresleri de değiştir
    const tempAddress = originAddress.value;
    originAddress.value = destinationAddress.value;
    destinationAddress.value = tempAddress;

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
    getAddresses();
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

const handleOfferClick = () => {
    // TODO: Teklif verme işlemi burada yapılacak
    console.log('Teklif ver butonuna tıklandı');
    // Örnek: Modal açılabilir veya sayfaya yönlendirme yapılabilir
};

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
