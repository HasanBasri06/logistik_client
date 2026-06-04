/** Expo `mobil/lib/message-helpers.ts` ile uyumlu */

export function formatListTime(createdAt) {
    if (!createdAt) return '—'
    const d = new Date(createdAt)
    const now = new Date()
    const diffMs = now - d
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 60) return `${diffMins} dakika önce`
    if (diffHours < 24) return `${diffHours} saat önce`
    if (diffDays < 7) return `${diffDays} gün önce`
    return d.toLocaleDateString('tr-TR')
}

export function formatMessageTime(createdAt) {
    if (!createdAt) return '—'
    const d = new Date(createdAt)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${day}.${month}.${year} ${hours}:${minutes}`
}

export function isSystemMessageType(t) {
    return String(t ?? '').trim().toLowerCase() === 'system'
}

export function isRequestMessageType(t) {
    return String(t ?? '').trim().toLowerCase() === 'request'
}

/** Sohbet / liste önizlemesi metni */
export function pickMessageText(m, currentUserId) {
    const isSender = Number(m.sender_id) === Number(currentUserId)
    if (isSystemMessageType(m.type) || isRequestMessageType(m.type)) {
        return isSender
            ? (m.sender_message ?? m.message ?? '')
            : (m.receiver_message ?? m.message ?? '')
    }
    return m.message ?? m.text ?? ''
}

export function pickMessageTextFromEvent(e, currentUserId) {
    const isSender = Number(e?.sender_id) === Number(currentUserId)
    if (isSystemMessageType(e?.type) || isRequestMessageType(e?.type)) {
        return isSender
            ? (e?.sender_message ?? e?.message ?? '')
            : (e?.receiver_message ?? e?.message ?? '')
    }
    return e?.message ?? ''
}

export function threadRowIsRead(lastMessage, currentUserId) {
    if (Number(lastMessage.sender_id) === Number(currentUserId)) return true
    return !!lastMessage.is_read
}

export function buildShipmentRouteLabel(shipment) {
    if (!shipment) return null
    const fromCity = shipment.f_where_city ?? ''
    const fromDistrict = shipment.f_where_district ?? ''
    const toCity = shipment.t_where_city ?? ''
    const toDistrict = shipment.t_where_district ?? ''
    if (!fromCity || !toCity) return null
    const from = fromDistrict ? `${fromCity} / ${fromDistrict}` : fromCity
    const to = toDistrict ? `${toCity} / ${toDistrict}` : toCity
    return `${from} -> ${to}`
}

export function buildUserAvatarUrl(user) {
    const profileImage = String(user?.profile_image ?? '').trim()
    if (profileImage) {
        if (/^https?:\/\//i.test(profileImage)) return profileImage
        const base = (import.meta.env.VITE_APP_SERVER_URL || '').replace(/\/$/, '')
        if (profileImage.startsWith('/')) return `${base}${profileImage}`
        return `${base}/storage/${profileImage}`
    }
    const image = String(user?.image ?? '').trim()
    if (image) {
        if (/^https?:\/\//i.test(image)) return image
        const base = (import.meta.env.VITE_APP_SERVER_URL || '').replace(/\/$/, '')
        if (image.startsWith('/')) return `${base}${image}`
        return `${base}/storage/${image}`
    }
    return null
}

export function conversationShipmentHasListingPanel(shipment) {
    if (!shipment) return false
    const from = formatConversationShipmentEndpoint(shipment.f_where_city, shipment.f_where_district)
    const to = formatConversationShipmentEndpoint(shipment.t_where_city, shipment.t_where_district)
    const dep = String(shipment.departure_time ?? '').trim()
    const arr = String(shipment.time_arrival ?? '').trim()
    return Boolean(from || to || dep || arr)
}

export function formatConversationShipmentEndpoint(cityRaw, districtRaw) {
    const city = String(cityRaw ?? '').trim()
    const district = String(districtRaw ?? '').trim()
    if (city && district) return `${city} / ${district}`
    return city || district
}

/** Web mesaj listesi — `otherUser + shipment_id` gruplama (Expo `buildThreadList`) */
export function buildInboxMessagesList(rawMessages, currentUserId) {
    if (!currentUserId || !rawMessages?.length) return []
    const byOtherAndShipment = new Map()
    for (const m of rawMessages) {
        const otherId = Number(m.sender_id) === Number(currentUserId) ? m.receiver_id : m.sender_id
        const shipmentId = m.shipment_id ?? 'none'
        const key = `${otherId}-${shipmentId}`
        const existing = byOtherAndShipment.get(key)
        if (!existing || new Date(m.created_at) > new Date(existing.created_at)) {
            byOtherAndShipment.set(key, { ...m, otherId })
        }
    }
    return Array.from(byOtherAndShipment.values())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((m) => {
            const isCurrentUserSender = Number(m.sender_id) === Number(currentUserId)
            const otherUser = isCurrentUserSender ? m.receiver : m.sender
            const otherName = otherUser?.full_name
            const shipmentId = m.shipment_id ?? null
            return {
                id: m.otherId,
                rowKey: `${m.otherId}-${shipmentId ?? 'none'}`,
                shipmentId,
                shipmentRoute: buildShipmentRouteLabel(m.shipment),
                avatarUrl: buildUserAvatarUrl(otherUser),
                name: otherName || `Kullanıcı #${m.otherId}`,
                time: formatListTime(m.created_at),
                lastMessage: pickMessageText(m, currentUserId) || 'Mesaj yok',
                isRead: threadRowIsRead(m, currentUserId),
            }
        })
}

/** Pusher: bu sohbet kanalına ait mi? */
export function conversationEventMatchesThread(e, meId, otherUserId) {
    const isSystem = isSystemMessageType(e.type)
    const isRequest = isRequestMessageType(e.type)
    const forMe =
        Number(e.receiver_id) === Number(meId) ||
        ((isSystem || isRequest) && Number(e.sender_id) === Number(meId))
    if (!forMe) return false
    const a = Number(e.sender_id)
    const b = Number(e.receiver_id)
    return a === Number(otherUserId) || b === Number(otherUserId)
}

export function mapConversationMessageFromEvent(e, currentUserId) {
    const isSystem = isSystemMessageType(e.type)
    const isRequest = isRequestMessageType(e.type)
    const isSender = Number(e.sender_id) === Number(currentUserId)
    return {
        id: e.id,
        text: pickMessageTextFromEvent(e, currentUserId),
        time: formatMessageTime(e.created_at),
        isMe: isSystem || isRequest ? false : isSender,
        type: isRequest ? 'request' : isSystem ? 'system' : 'message',
        shipment_id: e.shipment_id ?? null,
        created_at: e.created_at ?? new Date().toISOString(),
    }
}
