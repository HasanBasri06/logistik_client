/** Google / Nominatim geocode → API `cities.name` ile uyumlu */
export function normalizeCityName(name) {
    if (name == null) return '';
    let s = String(name).trim();
    for (const suf of [' İli', ' İl', ' Province']) {
        if (s.endsWith(suf)) {
            s = s.slice(0, -suf.length).trim();
            break;
        }
    }
    return s;
}

/** Geocode / profil şehri → API şehir listesindeki resmi ad */
export function resolveCityNameForFilter(userCity, cities) {
    const n = normalizeCityName(userCity);
    if (!n || !Array.isArray(cities) || cities.length === 0) return undefined;
    const exact = cities.find(
        (c) => c.name.localeCompare(n, 'tr', { sensitivity: 'base' }) === 0
    );
    if (exact) return exact.name;
    const nLower = n.toLocaleLowerCase('tr-TR');
    const partial = cities.find((c) => {
        const cLower = c.name.toLocaleLowerCase('tr-TR');
        return nLower.includes(cLower) || cLower.includes(nLower);
    });
    return partial?.name ?? undefined;
}

export function pickDistrict(districts, preferredName) {
    if (!Array.isArray(districts) || districts.length === 0) return undefined;
    const pref = String(preferredName ?? '').trim();
    if (!pref) return undefined;
    const exact = districts.find(
        (d) => d.name.localeCompare(pref, 'tr', { sensitivity: 'base' }) === 0
    );
    if (exact) return exact;
    const prefLower = pref.toLocaleLowerCase('tr-TR');
    return districts.find((d) => {
        const dLower = d.name.toLocaleLowerCase('tr-TR');
        return prefLower.includes(dLower) || dLower.includes(prefLower);
    });
}
