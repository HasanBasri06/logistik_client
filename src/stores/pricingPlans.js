import { computed } from 'vue';
import { defineStore } from 'pinia';

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
    const baseMonthlyPrice = 1;

    const rawPlans = [
        {
            id: 'monthly',
            months: 1,
            name: '1 Aylık',
            discountPercent: 0,
            description: 'Kısa süreli kullanım için ideal başlangıç paketi.',
            badge: null,
            price: 1,
        },
        {
            id: 'quarterly',
            months: 3,
            name: '3 Aylık',
            totalPriceFixed: 750,
            description: 'Düzenli kullanım için dengeli fiyat ve süre avantajı.',
            badge: 'Önerilen',
            price: 750,
        },
        {
            id: 'semiannual',
            months: 6,
            name: '6 Aylık',
            totalPriceFixed: 1320,
            description: 'Orta vadeli planlama yapanlar için ekonomik seçenek.',
            badge: null,
            price: 1320,
        },
        {
            id: 'annual',
            months: 12,
            name: '12 Aylık',
            totalPriceFixed: 2400,
            description: 'Uzun vadede en düşük aylık maliyet sağlayan paket.',
            badge: 'Popüler',
            price: 2400,
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

    return {
        plans,
        baseMonthlyPrice,
    };
});
