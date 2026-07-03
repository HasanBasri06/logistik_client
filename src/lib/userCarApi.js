import api from '@/api';

/**
 * Araç sahibi garajına araç ekler. İsteğe bağlı iki fotoğraf multipart ile gönderilir.
 */
export async function createUserCar(payload, vehicleImages = [null, null]) {
    const jsonPayload = {
        car_id: payload.car_id,
        car_detail_id: payload.car_detail_id ?? null,
        plaka: String(payload.plaka ?? '').trim(),
    };
    const hasImages = vehicleImages.some(Boolean);
    if (hasImages) {
        const fd = new FormData();
        fd.append('payload', JSON.stringify(jsonPayload));
        if (vehicleImages[0]) fd.append('image_one', vehicleImages[0]);
        if (vehicleImages[1]) fd.append('image_two', vehicleImages[1]);
        return api.post('/auth/create-car-by-user', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
    return api.post('/auth/create-car-by-user', jsonPayload);
}

/**
 * Araç günceller (plaka + isteğe bağlı fotoğraf yükleme/kaldırma).
 */
export async function updateUserCar(userCarId, plaka, options = {}) {
    const vehicleImages = options.vehicleImages ?? [null, null];
    const removeImages = options.removeImages ?? [false, false];
    const jsonPayload = {
        plaka: String(plaka ?? '').trim(),
        remove_image_one: Boolean(removeImages[0]),
        remove_image_two: Boolean(removeImages[1]),
    };
    const hasNewImages = vehicleImages.some(Boolean);
    const hasRemovals = removeImages.some(Boolean);
    if (hasNewImages || hasRemovals) {
        const fd = new FormData();
        fd.append('payload', JSON.stringify(jsonPayload));
        if (vehicleImages[0]) fd.append('image_one', vehicleImages[0]);
        if (vehicleImages[1]) fd.append('image_two', vehicleImages[1]);
        return api.post(`/cars/my/${userCarId}?_method=PUT`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
    return api.put(`/cars/my/${userCarId}`, { plaka: jsonPayload.plaka });
}

export function userCarPrimaryImageUrl(userCar) {
    const one = userCar?.image_one;
    if (one && typeof one === 'string' && one.startsWith('http')) return one;
    return null;
}

export function userCarImageUrl(userCar, slot) {
    const key = slot === 1 ? 'image_one' : 'image_two';
    const val = userCar?.[key];
    if (val && typeof val === 'string' && val.startsWith('http')) return val;
    return null;
}
