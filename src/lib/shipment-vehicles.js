import { vehicleImageUrl } from './catalog-assets'

function capitalize(str) {
    const s = String(str ?? '').trim()
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}

/**
 * İlanın taşınabileceği tüm araçlar: [{ id, name, detail, label, image }]
 * Yeni ilanlar `shipment_cars` ile gelir; eski ilanlarda tek `car` + `get_car_detail` kullanılır.
 */
export function shipmentVehicles(shipment) {
    if (!shipment) return []

    const rows = shipment.shipment_cars ?? shipment.shipmentCars ?? []
    const items = rows.length
        ? rows.map((row) => ({ car: row.car, detail: row.car_detail ?? row.carDetail }))
        : [{ car: shipment.car, detail: shipment.get_car_detail ?? shipment.getCarDetail }]

    return items
        .filter((i) => i.car?.name || i.detail?.value)
        .map(({ car, detail }) => {
            const name = car?.name ?? ''
            const detailText = capitalize(detail?.value)
            return {
                id: car?.id ?? detail?.id,
                name,
                detail: detailText,
                label: name && detailText ? `${name} / ${detailText}` : name || detailText,
                image: vehicleImageUrl(detail?.image ?? car?.image),
            }
        })
}

/** İlan oluştururken seçili varyantın görseli varsa onu, yoksa aracın görselini döner */
export function carVariantImage(car, selectedDetails = []) {
    for (const item of car?.details ?? []) {
        if (item.image && selectedDetails.some((d) => d.id === item.id)) {
            return vehicleImageUrl(item.image)
        }
    }
    return vehicleImageUrl(car?.image)
}

/** Tüm araçları tek satırda: "Tır / Tenteli, Panelvan" */
export function shipmentVehiclesLabel(shipment) {
    return shipmentVehicles(shipment).map((v) => v.label).join(', ')
}
