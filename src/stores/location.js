import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api';
import { isMobileWeb } from '@/utils/open-native-app';

const geolocationOptions = {
    enableHighAccuracy: false,
    timeout: 15000,
    maximumAge: 60000
};

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

function googleReverseGeocode(lat, lng) {
    return new Promise((resolve) => {
        if (!window.google?.maps?.Geocoder) {
            resolve({ city: null, district: null, formattedAddress: null });
            return;
        }
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
            { location: { lat, lng } },
            (results, status) => {
                if (status !== 'OK' || !results?.[0]) {
                    resolve({ city: null, district: null, formattedAddress: null });
                    return;
                }
                const addr = results[0];
                const components = addr.address_components || [];
                let city = null;
                let district = null;
                for (const c of components) {
                    if (c.types.includes('administrative_area_level_1')) city = c.long_name;
                    if (c.types.includes('administrative_area_level_2')) district = c.long_name;
                }
                resolve({
                    city,
                    district,
                    formattedAddress: addr.formatted_address || null
                });
            }
        );
    });
}

export const useLocationStore = defineStore('location', () => {
    const userCoords = ref(null);
    const userOpenAddress = ref(null);
    const userCity = ref(null);
    const userDistrict = ref(null);
    const locationError = ref(null);
    const locationErrorCode = ref(null);
    const locationDeniedModalOpen = ref(false);
    const locationRequesting = ref(false);

    function setLocationErrorMessage(err) {
        locationErrorCode.value = err?.code ?? null;
        if (err.code === 1) {
            locationError.value = 'Konum izni kapalı.';
        } else if (err.code === 2) {
            locationError.value = 'Konum alınamadı. İnternet bağlantınızı ve Windows konum ayarlarını kontrol edin.';
        } else if (err.code === 3) {
            locationError.value = 'Konum isteği zaman aşımına uğradı. Tekrar deneyin.';
        } else {
            locationError.value = 'Konum kullanılamıyor. Windows Ayarlar > Gizlilik > Konum bölümünde konum hizmetinin açık olduğundan emin olun.';
        }
    }

    function requestUserLocation(showModalOnError = false) {
        if (!navigator.geolocation) {
            locationError.value = 'Tarayıcınız konum bilgisini desteklemiyor.';
            locationErrorCode.value = null;
            if (showModalOnError && isMobileWeb()) {
                locationDeniedModalOpen.value = true;
            }
            return;
        }
        locationRequesting.value = true;
        locationError.value = null;
        locationErrorCode.value = null;
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                locationRequesting.value = false;
                const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
                userCoords.value = coords;
                locationDeniedModalOpen.value = false;
                let city = null;
                let district = null;
                let openAddress = null;
                const googleResult = await googleReverseGeocode(coords.lat, coords.lng);
                city = googleResult.city;
                district = googleResult.district;
                userCity.value = city;
                userDistrict.value = district;
                if (googleResult.formattedAddress) {
                    openAddress = googleResult.formattedAddress;
                    userOpenAddress.value = openAddress;
                }
                if (!openAddress || (city == null && district == null)) {
                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json&addressdetails=1&zoom=${openAddress ? 5 : 18}`,
                            { headers: { 'Accept-Language': 'tr' } }
                        );
                        const data = await res.json();
                        if (!openAddress) {
                            openAddress = data.display_name || null;
                            userOpenAddress.value = openAddress;
                        }
                        if (city == null || district == null) {
                            const countryCode = data.address?.country_code || data.country_code;
                            const parsed = parseNominatimCityDistrict(data.address, countryCode);
                            if (city == null) {
                                city = parsed.city;
                                userCity.value = city;
                            }
                            if (district == null) {
                                district = parsed.district;
                                userDistrict.value = district;
                            }
                        }
                    } catch (_) {}
                }
                if (localStorage.getItem('token') && (city != null || district != null)) {
                    try {
                        await api.put('/auth/user-location', {
                            user_city: city ?? null,
                            user_district: district ?? null,
                            lat: coords.lat,
                            lng: coords.lng,
                        });
                    } catch (_) {}
                }
            },
            (err) => {
                locationRequesting.value = false;
                setLocationErrorMessage(err);
                if (showModalOnError && err.code === 1 && isMobileWeb()) {
                    locationDeniedModalOpen.value = true;
                }
            },
            geolocationOptions
        );
    }

    function shouldAutoRequestLocation() {
        return isMobileWeb();
    }

    function closeLocationModal() {
        locationDeniedModalOpen.value = false;
    }

    /** Ayarlardan dönünce konumu tekrar dene */
    function retryLocationAfterSettings() {
        requestUserLocation(false);
    }

    function clearLocationError() {
        locationError.value = null;
    }

    return {
        userCoords,
        userOpenAddress,
        userCity,
        userDistrict,
        locationError,
        locationErrorCode,
        locationDeniedModalOpen,
        locationRequesting,
        requestUserLocation,
        shouldAutoRequestLocation,
        closeLocationModal,
        retryLocationAfterSettings,
        clearLocationError
    };
});
