import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

const apiBase = import.meta.env.VITE_APP_SERVER_URL || 'http://localhost:8000/api'

export function createEcho() {
    const key = import.meta.env.VITE_PUSHER_APP_KEY
    const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER || 'eu'
    if (!key) {
        console.warn('VITE_PUSHER_APP_KEY is not set; real-time messages disabled.')
        return null
    }
    return new Echo({
        broadcaster: 'pusher',
        key,
        cluster,
        forceTLS: true,
        authEndpoint: apiBase.replace(/\/api\/?$/, '') + '/api/broadcasting/auth',
        auth: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                Accept: 'application/json',
            },
        },
    })
}

let echoInstance = null

export function getEcho() {
    if (!echoInstance) {
        echoInstance = createEcho()
    }
    return echoInstance
}

export function disconnectEcho() {
    if (echoInstance) {
        echoInstance.disconnect()
        echoInstance = null
    }
}
