function normalizeCityName(name) {
    if (name == null) return '';
    return String(name)
        .trim()
        .replace(/\s*İlçesi$/i, '')
        .replace(/\s*ili$/i, '')
        .replace(/\s+/g, ' ');
}

export function isSuitablePostingsEnabled(value) {
    return value === 'yes';
}

/** Teklif modalı ile aynı araç eşleşme kuralı */
export function shipmentMatchesUserCar(shipment, userCar) {
    if (!shipment || !userCar) return false;
    const ilanCarId = shipment.car_id ?? shipment.car?.id;
    const ilanDetailId =
        shipment.car_detail_id ?? shipment.get_car_detail?.id ?? shipment.getCarDetail?.id;
    const selCarId = userCar.car_id ?? userCar.id;
    const selDetailId = userCar.car_detail_id ?? userCar.carDetail?.id ?? userCar.car_detail?.id;
    if (ilanCarId != null && Number(selCarId) !== Number(ilanCarId)) return false;
    if (ilanDetailId != null && selDetailId != null && Number(selDetailId) !== Number(ilanDetailId)) {
        return false;
    }
    return true;
}

export function shipmentMatchesAnyUserCar(shipment, userCars) {
    if (!Array.isArray(userCars) || !userCars.length) return false;
    return userCars.some((uc) => shipmentMatchesUserCar(shipment, uc));
}

function cityMatchPriority(city, target) {
    if (!target) return 1;
    const normalized = normalizeCityName(city).toLocaleLowerCase('tr-TR');
    return normalized === target.toLocaleLowerCase('tr-TR') ? 0 : 1;
}

/** Önce araç uyumu, sonra şehir uyumu, sonra id (yüksek önce). */
export function sortShipmentsForSuitablePostings(list, city, userCars) {
    const target = (city ?? '').trim();
    return [...list].sort((a, b) => {
        const aCar = shipmentMatchesAnyUserCar(a, userCars) ? 0 : 1;
        const bCar = shipmentMatchesAnyUserCar(b, userCars) ? 0 : 1;
        if (aCar !== bCar) return aCar - bCar;

        const aCity = cityMatchPriority(a.f_where_city, target);
        const bCity = cityMatchPriority(b.f_where_city, target);
        if (aCity !== bCity) return aCity - bCity;

        return (b.id ?? 0) - (a.id ?? 0);
    });
}

export function resolveSuitablePriorityCity(user, resolvedCityName) {
    if (!user || user.type !== 'vehicle_owner' || !isSuitablePostingsEnabled(user.suitable_postings)) {
        return null;
    }
    const city = (resolvedCityName ?? normalizeCityName(user.user_city)).trim();
    return city || null;
}
