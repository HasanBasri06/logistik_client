import { isMobileWeb } from '@/utils/open-native-app';

const WEB_LOCATION_HELP_DISMISSED_KEY = 'tasibul_location_help_dismissed';

export function isWebDesktop() {
    return typeof window !== 'undefined' && !isMobileWeb();
}

export function isLocationHelpDismissed() {
    try {
        return sessionStorage.getItem(WEB_LOCATION_HELP_DISMISSED_KEY) === '1';
    } catch {
        return false;
    }
}

export function dismissLocationHelp() {
    try {
        sessionStorage.setItem(WEB_LOCATION_HELP_DISMISSED_KEY, '1');
    } catch {
        /* ignore */
    }
}

export function getWebLocationInstructions() {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

    if (/Edg\//.test(ua)) {
        return {
            browser: 'Microsoft Edge',
            steps: [
                'Adres çubuğunun solundaki kilit veya bilgi simgesine tıklayın.',
                '"Bu site için izinler" bölümünden Konum\'u bulun.',
                '"İzin ver" veya "Sor" seçeneğini seçin.',
                'Sayfayı yenileyin veya "Tekrar dene" butonuna basın.',
            ],
        };
    }

    if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) {
        return {
            browser: 'Google Chrome',
            steps: [
                'Adres çubuğunun solundaki kilit veya ayarlar simgesine tıklayın.',
                '"Konum" iznini bulun ve "İzin ver" seçin.',
                'Gerekirse "Site ayarları" üzerinden konumu açın.',
                'Sayfayı yenileyin veya "Tekrar dene" butonuna basın.',
            ],
        };
    }

    if (/Firefox\//.test(ua)) {
        return {
            browser: 'Mozilla Firefox',
            steps: [
                'Adres çubuğunun solundaki kilit simgesine tıklayın.',
                '"Bağlantı güvenli" panelinde "Daha fazla bilgi" veya izinleri açın.',
                'Konum iznini "İzin ver" olarak ayarlayın.',
                'Sayfayı yenileyin veya "Tekrar dene" butonuna basın.',
            ],
        };
    }

    if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) {
        return {
            browser: 'Safari',
            steps: [
                'Safari menüsünden Ayarlar > Web Siteleri > Konum bölümüne gidin.',
                'tasibul.com için izni "İzin ver" yapın.',
                'Alternatif olarak adres çubuğundaki "aA" simgesinden site ayarlarını açın.',
                'Sayfayı yenileyin veya "Tekrar dene" butonuna basın.',
            ],
        };
    }

    return {
        browser: 'Tarayıcınız',
        steps: [
            'Tarayıcı adres çubuğundaki kilit veya site bilgisi simgesine tıklayın.',
            'Site izinleri arasından Konum erişimini bulun.',
            'Konum iznini "İzin ver" olarak ayarlayın.',
            'Sayfayı yenileyin veya "Tekrar dene" butonuna basın.',
        ],
    };
}
