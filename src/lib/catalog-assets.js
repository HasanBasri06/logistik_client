function serverOrigin() {
    const base = import.meta.env.VITE_APP_SERVER_URL
    if (!base) {
        return typeof window !== 'undefined' ? window.location.origin : ''
    }
    return String(base).replace(/\/$/, '').replace(/\/api$/, '')
}

function catalogAssetUrl(folder, image) {
    if (!image) return ''
    const raw = String(image).trim()
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
        return raw
    }
    const filename = raw.split(/[/\\]/).pop()
    if (!filename) return ''
    return `${serverOrigin()}/assets/${folder}/${filename}`
}

export function vehicleImageUrl(image) {
    return catalogAssetUrl('vehicles', image)
}

export function postTypeImageUrl(image) {
    return catalogAssetUrl('post_types', image)
}
