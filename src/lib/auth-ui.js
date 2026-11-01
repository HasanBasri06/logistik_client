/** "5551234567" → "555 123 45 67" (yazarken; mobil `formatTrPhoneInput` ile aynı) */
export function formatTrPhoneInput(value) {
    let d = String(value ?? '').replace(/\D/g, '')
    if (d.length === 11 && d.startsWith('0')) d = d.slice(1)
    d = d.slice(0, 10)
    const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean)
    return parts.join(' ')
}

export function phoneDigits(value) {
    return String(value ?? '').replace(/\D/g, '')
}

/** Giriş sonrası: bekleyen arama varsa onunla, yoksa panele */
export function redirectAfterLogin(router) {
    const pending = sessionStorage.getItem('pendingSearch')
    if (pending) {
        sessionStorage.removeItem('pendingSearch')
        router.replace({ path: '/panel', query: JSON.parse(pending) })
    } else {
        router.replace('/panel')
    }
}

/** Store `{ error, errorDetails }` → ilk anlamlı mesaj */
export function firstApiError(result, fallback) {
    const details = result?.errorDetails
    if (details && typeof details === 'object') {
        const first = Object.values(details)[0]
        if (Array.isArray(first) && first[0]) return first[0]
        if (typeof first === 'string') return first
    }
    return result?.error || fallback
}
