<template>
    <Header />
    <div class="h-[calc(100vh-64px)]">
        <Content>
            <div class="flex flex-row gap-3 w-full h-[calc(100vh-64px)]">
                <CargoOwner />
                <div class="bg-white flex-1 mt-3 border border-gray-200 p-3 rounded-md flex flex-col overflow-hidden">
                    <!-- Kısayol Kartları -->
                    <div class="grid grid-cols-3 gap-4 mb-4">
                        <!-- Ücret Kartı -->
                        <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
                            <div class="flex items-center justify-between mb-2">
                                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                    <i class="pi pi-money-bill text-white" style="font-size: 24px;"></i>
                                </div>
                            </div>
                            <h3 class="text-sm font-medium text-gray-600 mb-1">Toplam Ücret</h3>
                            <p class="text-2xl font-bold text-gray-900">{{ totalEarnings.toLocaleString('tr-TR') }} ₺</p>
                        </div>
                        <!-- Bekleyen İşler Kartı -->
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
                            <div class="flex items-center justify-between mb-2">
                                <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <i class="pi pi-clock text-white" style="font-size: 24px;"></i>
                                </div>
                            </div>
                            <h3 class="text-sm font-medium text-gray-600 mb-1">Bekleyen İşler</h3>
                            <p class="text-2xl font-bold text-gray-900">{{ pendingJobs }}</p>
                        </div>
                        <!-- Araç Sayısı Kartı -->
                        <div class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
                            <div class="flex items-center justify-between mb-2">
                                <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <i class="pi pi-car text-white" style="font-size: 24px;"></i>
                                </div>
                            </div>
                            <h3 class="text-sm font-medium text-gray-600 mb-1">Araç Sayısı</h3>
                            <p class="text-2xl font-bold text-gray-900">{{ vehicleCount }}</p>
                        </div>
                    </div>
                    <!-- Ayırıcı Çizgi -->
                    <div class="border-b border-gray-200 mb-4"></div>
                    <!-- Analiz Chart'ı -->
                    <div class="flex-1 overflow-y-auto">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">Analiz</h2>
                        <div class="bg-white border border-gray-200 rounded-lg p-6">
                            <canvas ref="chartCanvas" id="analizChart" class="h-[400px]"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Chart, registerables } from 'chart.js';
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import CargoOwner from '@/components/CargoOwner.vue';

Chart.register(...registerables);

const totalEarnings = ref(125000);
const pendingJobs = ref(8);
const vehicleCount = ref(3);

const chartCanvas = ref(null);
let chartInstance = null;

onMounted(() => {
    if (chartCanvas.value) {
        const ctx = chartCanvas.value.getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                datasets: [{
                    label: 'Aylık Gelir (₺)',
                    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
                    borderColor: '#39838C',
                    backgroundColor: 'rgba(57, 131, 140, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => value.toLocaleString('tr-TR') + ' ₺'
                        }
                    }
                }
            }
        });
    }
});

onBeforeUnmount(() => {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
});
</script>
