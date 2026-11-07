import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import api from '@/api';

function formatTl(value) {
    return `${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(value)} TL`;
}

function roundCurrency(value) {
    return Math.round(Number(value) || 0);
}

function formatRate(value) {
    return `%${value.toFixed(2).replace('.', ',')}`;
}

export const usePricingPlansStore = defineStore('pricingPlans', () => {
    const baseMonthlyPrice = 399;

    const rawPlans = [
        {
            id: 'monthly',
            months: 1,
            name: '1 Aylık',
            discountPercent: 0,
            description: 'Kısa süreli kullanım için ideal başlangıç paketi.',
            badge: null,
            price: 399,
        },
        {
            id: 'quarterly',
            months: 3,
            name: '3 Aylık',
            totalPriceFixed: 999,
            description: 'Düzenli kullanım için dengeli fiyat ve süre avantajı.',
            badge: 'Önerilen',
            price: 999,
        },
        {
            id: 'semiannual',
            months: 6,
            name: '6 Aylık',
            totalPriceFixed: 1749,
            description: 'Orta vadeli planlama yapanlar için ekonomik seçenek.',
            badge: null,
            price: 1749,
        },
        {
            id: 'annual',
            months: 12,
            name: '12 Aylık',
            totalPriceFixed: 3199,
            description: 'Uzun vadede en düşük aylık maliyet sağlayan paket.',
            badge: 'Popüler',
            price: 3199,
        },
    ];

    const plans = computed(() =>
        rawPlans.map((plan) => {
            const normalTotal = baseMonthlyPrice * plan.months;
            const total = plan.totalPriceFixed ?? normalTotal * (1 - (plan.discountPercent ?? 0) / 100);
            const totalRounded = roundCurrency(total);
            const monthlyPrice = total / plan.months;
            const discount = normalTotal - total;
            const discountRate = normalTotal > 0 ? (discount / normalTotal) * 100 : 0;

            return {
                ...plan,
                durationLabel: `${plan.months} Ay`,
                totalNumeric: totalRounded,
                totalPrice: formatTl(totalRounded),
                monthlyCost: `${formatTl(roundCurrency(monthlyPrice))} / ay`,
                discountAmount: formatTl(roundCurrency(discount)),
                discountRate: formatRate(discountRate),
                showDiscount: discount > 0,
                ctaText: 'Paketi Seç',
            };
        })
    );

    /**
     * Paketler (`GET /payment/packages`): Bireysel (iki hesap türü) + araç sahibine Küçük / Orta / Büyük İşletme.
     * Her paketin içinde 1 / 3 / 6 / 12 ay seçenekleri; tutar ödeme sırasında sunucudaki katalogdan alınır.
     */
    const DURATION_TEXT = {
        1: { description: 'Kısa süreli kullanım için ideal başlangıç.', badge: null },
        3: { description: 'Düzenli kullanım için dengeli fiyat ve süre avantajı.', badge: 'Önerilen' },
        6: { description: 'Orta vadeli planlama yapanlar için ekonomik seçenek.', badge: null },
        12: { description: 'Uzun vadede en düşük aylık maliyet.', badge: 'Popüler' },
    };

    function toPackage(p) {
        return {
            id: p.id,
            name: p.name,
            description: p.description || '',
            vehicleLimit: Number(p.vehicle_limit || 1),
            features: Array.isArray(p.features) ? p.features : [],
            plans: (p.durations || []).map((d) => {
                const text = DURATION_TEXT[d.months] || { description: '', badge: null };
                const total = roundCurrency(d.total);
                return {
                    id: `${p.id}_${d.months}`,
                    tier: p.id,
                    months: d.months,
                    name: `${d.months} Aylık`,
                    description: text.description,
                    badge: text.badge,
                    price: total,
                    durationLabel: `${d.months} Ay`,
                    totalNumeric: total,
                    totalPrice: formatTl(total),
                    monthlyCost: `${formatTl(roundCurrency(d.monthly))} / ay`,
                    discountAmount: formatTl(roundCurrency(d.discount)),
                    discountRate: formatRate(Number(d.discount_rate) || 0),
                    showDiscount: d.discount > 0,
                    ctaText: 'Paketi Seç',
                };
            }),
        };
    }

    /** Sunucuya ulaşılamazsa yalnızca Bireysel (yerel fiyatlar) */
    function fallbackPackages() {
        return [
            {
                id: 'individual',
                name: 'Bireysel',
                description: 'Tek araçla çalışan sürücüler ve bireysel yük sahipleri için.',
                vehicleLimit: 1,
                features: [],
                plans: plans.value.map((p) => ({ ...p, tier: 'individual' })),
            },
        ];
    }

    const packages = ref(fallbackPackages());
    const packagesLoading = ref(false);

    /** Hesap türüne göre paketler (oturum varsa sunucu kullanıcının türünü kullanır) */
    async function loadPackages(accountType = null) {
        packagesLoading.value = true;
        try {
            const res = await api.get('/payment/packages', { params: accountType ? { account_type: accountType } : {} });
            const list = (res.data?.content?.packages || []).map(toPackage).filter((p) => p.plans.length);
            packages.value = list.length ? list : fallbackPackages();
        } catch (_) {
            packages.value = fallbackPackages();
        } finally {
            packagesLoading.value = false;
        }
        return packages.value;
    }

    return {
        plans,
        baseMonthlyPrice,
        packages,
        packagesLoading,
        loadPackages,
    };
});
