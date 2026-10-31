/** Sunucudaki `type` alanı bazen literal "{{name}}" geliyor; grup başlığı için kullanma. */
export function normalizeDetailGroupKey(raw) {
    const s = raw != null ? String(raw).trim() : ''
    if (!s || s.includes('{{') || s.toLowerCase() === 'type') return 'Varyant'
    return s
}

/** Araç varyantlarını türüne göre gruplar: { 'Kasa Tipi': [...], ... } */
export function detailsByType(car) {
    const groups = {}
    for (const item of car?.details ?? []) {
        const type = normalizeDetailGroupKey(item.type)
        if (!groups[type]) groups[type] = []
        groups[type].push(item)
    }
    return groups
}

/** Tek ve isimsiz grup varsa başlık göstermeye gerek yok */
export function shouldShowDetailGroupTitle(car, groupName) {
    const keys = Object.keys(detailsByType(car))
    return !(keys.length === 1 && groupName === 'Varyant')
}

/** Araç seçilince her gruptan ilk varyantı varsayılan olarak seçer */
export function autoSelectFirstDetails(car) {
    return Object.values(detailsByType(car)).map((group) => {
        const item = group[0]
        return {
            id: item.id,
            name: item.value != null && String(item.value).trim() !== '' ? String(item.value) : String(item.name ?? ''),
        }
    })
}
