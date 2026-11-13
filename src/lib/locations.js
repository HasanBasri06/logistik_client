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

/** Türkiye sınırları (harita kısıtı ve kaba kontrol için) */
export const TURKEY_BOUNDS = [[35.8, 25.6], [42.15, 44.85]];

/**
 * Nominatim reverse yanıtını Türkiye il/ilçe bilgisine çevirir.
 * Türkiye'de il `province`, ilçe çoğunlukla `town`; merkez ilçeler `city` alanında gelir
 * ("Kırşehir Merkez"). `city_district`/`suburb` mahalle olduğu için kullanılmaz.
 */
export function parseNominatimTurkey(data) {
    const addr = data?.address ?? {};
    const countryCode = String(addr.country_code ?? '').toLowerCase();
    const iso = String(addr['ISO3166-2-lvl4'] ?? '');
    const plateMatch = iso.match(/^TR-(\d{2})$/);
    const province = addr.province || addr.state || null;
    const candidates = [addr.town, addr.county, addr.municipality, addr.district]
        .concat(addr.city && addr.city !== province ? [addr.city] : [])
        .filter((v, i, arr) => v && arr.indexOf(v) === i);
    return {
        inTurkey: countryCode === 'tr',
        plate: plateMatch ? parseInt(plateMatch[1], 10) : null,
        province,
        districtCandidates: candidates,
    };
}

/**
 * Harita adaylarını sistemdeki ilçe listesine eşler.
 * Sistem listesi büyükşehirlerde eski yapıda ("Tekirdağ Merkez"); Süleymanpaşa gibi
 * sonradan kurulan merkez ilçeler bulunamazsa ilin "Merkez" ilçesine düşülür (approximate).
 */
export function matchDistrictFromCandidates(districts, candidates, provinceName) {
    if (!Array.isArray(districts) || !districts.length || !candidates?.length) return null;
    for (const name of candidates) {
        const picked = pickDistrict(districts, name);
        if (picked) return { district: picked, approximate: false };
    }
    const province = String(provinceName ?? '').toLocaleLowerCase('tr-TR');
    const merkez =
        districts.find((d) => d.name.toLocaleLowerCase('tr-TR') === `${province} merkez`) ||
        districts.find((d) => /merkez/i.test(d.name));
    return merkez ? { district: merkez, approximate: true } : null;
}

/**
 * İlanla birlikte saklanacak detaylı konum (backend: shipments.f_where_location / t_where_location).
 * `district` haritadaki gerçek ilçe adıdır (sistem listesine eşlenen ad değil).
 */
export function buildExactLocation(data, lat, lng) {
    const a = data?.address ?? {};
    const geo = parseNominatimTurkey(data);
    return {
        lat,
        lng,
        display_name: data?.display_name ?? null,
        address: {
            province: geo.province,
            district: geo.districtCandidates[0] ?? null,
            neighbourhood: a.suburb || a.neighbourhood || a.quarter || a.village || null,
            road: a.road || null,
            house_number: a.house_number || null,
            postcode: a.postcode || null,
        },
    };
}
