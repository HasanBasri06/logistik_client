export function isShipmentKdvEnabled(shipment) {
    const value = shipment?.is_kdv;
    return value === true || value === 1 || value === '1';
}

export function shipmentHasListedPrice(price) {
    if (price == null || price === '') return false;
    return !String(price).toLowerCase().includes('görüş');
}

export function shouldShowKdvLabel(shipment) {
    return isShipmentKdvEnabled(shipment) && shipmentHasListedPrice(shipment?.price);
}
