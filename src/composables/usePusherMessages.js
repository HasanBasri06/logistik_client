import { watch, onMounted, onBeforeUnmount, ref } from 'vue';
import { getEcho } from '@/echo';

const CHANNEL_PREFIX = 'user';

/**
 * Cargo-owner ve vehicle-owner Mesajlar sayfasında aynı Pusher/WebSocket
 * kanalını kullanarak anlık mesajlaşma. user.{userId} private channel'a
 * abone olur; .message.sent ve .offer.sent dinler.
 * Her iki rol de aynı channel yapısını kullanır (user.{kendi_id}).
 *
 * @param {import('vue').Ref<number|string|null|undefined>} userIdRef - Mevcut kullanıcı id (authStore.user?.id)
 * @param {Object} callbacks
 * @param {(e: object) => void} [callbacks.onMessageSent]
 * @param {(e: object) => void} [callbacks.onOfferSent]
 */
export function usePusherMessages(userIdRef, callbacks = {}) {
    const { onMessageSent, onOfferSent } = callbacks;
    let channel = null;
    const isConnected = ref(false);

    function disconnect() {
        if (channel) {
            try {
                channel.stopListening('.message.sent');
                channel.stopListening('.offer.sent');
            } catch (_) {}
            channel = null;
            isConnected.value = false;
        }
    }

    function connect() {
        const userId = userIdRef?.value ?? userIdRef;
        if (userId == null || userId === '') return;

        const echo = getEcho();
        if (!echo) return;

        disconnect();

        try {
            channel = echo.private(`${CHANNEL_PREFIX}.${userId}`);

            if (typeof onMessageSent === 'function') {
                channel.listen('.message.sent', (payload) => {
                    onMessageSent(payload);
                });
            }
            if (typeof onOfferSent === 'function') {
                channel.listen('.offer.sent', (payload) => {
                    onOfferSent(payload);
                });
            }
            isConnected.value = true;
        } catch (err) {
            console.warn('[usePusherMessages] connect error:', err);
            channel = null;
        }
    }

    if (userIdRef && typeof userIdRef === 'object' && 'value' in userIdRef) {
        watch(
            userIdRef,
            (id) => {
                if (id != null && id !== '') {
                    connect();
                } else {
                    disconnect();
                }
            },
            { immediate: true }
        );
    } else if (userIdRef != null && userIdRef !== '') {
        connect();
    }

    onMounted(() => {
        const userId = userIdRef?.value ?? userIdRef;
        if (userId != null && userId !== '' && !channel) {
            connect();
        }
    });

    onBeforeUnmount(() => {
        disconnect();
    });

    return { connect, disconnect, isConnected };
}
