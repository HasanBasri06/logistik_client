/** Sohbet mesajı üst sınırı (web + API ile uyumlu). */
export const MESSAGE_MAX_LENGTH = 155

export function normalizeOutboundMessage(text) {
    return String(text ?? '').slice(0, MESSAGE_MAX_LENGTH).trim()
}
