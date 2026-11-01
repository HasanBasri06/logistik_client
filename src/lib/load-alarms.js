import api from '@/api'

/** Kullanıcı başına en fazla alarm — sunucudaki `LoadAlarmController::MAX_ALARMS` ile aynı */
export const LOAD_ALARM_LIMIT = 10

/** Araç sahibinin yük alarmları (`/load-alarms`) — mobil `lib/load-alarms-api.ts` ile aynı */
export async function fetchLoadAlarms() {
    const res = await api.get('/load-alarms')
    const alarms = res.data?.content?.alarms
    return Array.isArray(alarms) ? alarms : []
}

export async function createLoadAlarm(input) {
    const res = await api.post('/load-alarms', input)
    return res.data?.content?.alarm
}

export async function setLoadAlarmActive(id, isActive) {
    const res = await api.put(`/load-alarms/${id}`, { is_active: isActive })
    return res.data?.content?.alarm
}

export async function deleteLoadAlarm(id) {
    await api.delete(`/load-alarms/${id}`)
}

/** "Ankara / Çankaya", ilçe yoksa "Ankara (tüm ilçeler)", şehir yoksa "Her yer" */
export function loadAlarmPlaceLabel(city, district) {
    if (!String(city ?? '').trim()) return 'Her yer'
    const d = String(district ?? '').trim()
    return d ? `${city} / ${d}` : `${city} (tüm ilçeler)`
}

export function loadAlarmErrorMessage(err, fallback) {
    const msg = err?.response?.data?.message
    return typeof msg === 'string' && msg.trim() ? msg : fallback
}
