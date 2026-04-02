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
    const baseMonthlyPrice = 299;
    const installmentRatePercent = 7.53;

    const rawPlans = [
        {
            id: 'monthly',
            months: 1,
            name: '1 Aylık',
            discountPercent: 0,
            description: 'Kısa süreli kullanım için ideal başlangıç paketi.',
            badge: null,
        },
        {
            id: 'quarterly',
            months: 3,
            name: '3 Aylık',
            totalPriceFixed: 750,
            description: 'Düzenli kullanım için dengeli fiyat ve süre avantajı.',
            badge: 'Önerilen',
        },
        {
            id: 'semiannual',
            months: 6,
            name: '6 Aylık',
            totalPriceFixed: 1320,
            description: 'Orta vadeli planlama yapanlar için ekonomik seçenek.',
            badge: null,
        },
        {
            id: 'annual',
            months: 12,
            name: '12 Aylık',
            totalPriceFixed: 2400,
            description: 'Uzun vadede en düşük aylık maliyet sağlayan paket.',
            badge: 'Popüler',
        },
    ];

    /** Sadece 3 / 6 / 12 aylık planlarda gösterilir */
    const installmentOptionPresets = [
        {
            id: 'equal',
            title: 'Eşit 2 taksit',
            subtitle: '50% · 50%',
            description: '%7,53 vade farkı uygulanır.',
            splits: [0.5, 0.5],
            labels: ['1. taksit', '2. taksit'],
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

            const showInstallments = plan.months >= 3;
            const installmentTotal = totalRounded * (1 + installmentRatePercent / 100);
            const installmentTotalRounded = roundCurrency(installmentTotal);
            const installmentOptions = showInstallments
                ? installmentOptionPresets.map((preset) => ({
                      ...preset,
                      payments: preset.splits.map((ratio, idx) => ({
                          label: preset.labels[idx] ?? `Taksit ${idx + 1}`,
                          amount: formatTl(roundCurrency(installmentTotalRounded * ratio)),
                          ratioPercent: Math.round(ratio * 100),
                      })),
                  }))
                : null;

            return {
                ...plan,
                durationLabel: `${plan.months} Ay`,
                totalNumeric: totalRounded,
                totalPrice: formatTl(totalRounded),
                monthlyCost: `${formatTl(roundCurrency(monthlyPrice))} / ay`,
                discountAmount: formatTl(roundCurrency(discount)),
                discountRate: formatRate(discountRate),
                showDiscount: discount > 0,
                showInstallments,
                installmentRate: formatRate(installmentRatePercent),
                installmentTotalPrice: formatTl(installmentTotalRounded),
                installmentOptions,
                ctaText: 'Paketi Seç',
            };
        })
    );

    return {
        plans,
        baseMonthlyPrice,
    };
});
