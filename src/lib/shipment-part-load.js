export function isShipmentPartLoad(shipment) {
    const value = shipment?.part_load;
    return value === true || value === 1 || value === '1';
}
