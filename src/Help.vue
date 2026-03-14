<template>
    <div class="flex flex-col min-h-screen bg-gray-50/50">
        <Header />
        <Content class="flex-1 py-12 md:py-16">
            <div class="max-w-2xl mx-auto">
                <div class="text-center mb-10 md:mb-12">
                    <span class="text-sm font-semibold text-primary tracking-wide uppercase">Yardım</span>
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Bize Ulaşın</h1>
                    <p class="text-gray-500 mt-2 leading-relaxed">
                        Sorularınız veya destek talebiniz için formu doldurup gönderin. En kısa sürede size dönüş yapacağız.
                    </p>
                </div>

                <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div class="p-6 md:p-8">
                        <form @submit.prevent="handleSubmit" class="space-y-6">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">E-posta</label>
                                <input
                                    v-model="form.email"
                                    type="email"
                                    placeholder="ornek@email.com"
                                    :disabled="loading"
                                    :class="[
                                        'w-full h-12 px-4 rounded-xl border-2 bg-gray-50/50 focus:bg-white transition-colors placeholder:text-gray-400',
                                        errors.email ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                                    ]"
                                />
                                <p v-if="errors.email" class="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                    <i class="pi pi-exclamation-circle text-xs"></i>
                                    {{ errors.email }}
                                </p>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Konu</label>
                                <input
                                    v-model="form.konu"
                                    type="text"
                                    placeholder="Örn: Fiyat bilgisi, Teknik destek"
                                    :disabled="loading"
                                    :class="[
                                        'w-full h-12 px-4 rounded-xl border-2 bg-gray-50/50 focus:bg-white transition-colors placeholder:text-gray-400',
                                        errors.konu ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                                    ]"
                                />
                                <p v-if="errors.konu" class="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                    <i class="pi pi-exclamation-circle text-xs"></i>
                                    {{ errors.konu }}
                                </p>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">İçerik</label>
                                <textarea
                                    v-model="form.icerik"
                                    rows="5"
                                    placeholder="Mesajınızı detaylı şekilde yazın..."
                                    :disabled="loading"
                                    :class="[
                                        'w-full px-4 py-3 rounded-xl border-2 bg-gray-50/50 focus:bg-white transition-colors placeholder:text-gray-400 resize-none',
                                        errors.icerik ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                                    ]"
                                />
                                <p v-if="errors.icerik" class="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                    <i class="pi pi-exclamation-circle text-xs"></i>
                                    {{ errors.icerik }}
                                </p>
                            </div>

                            <div class="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="submit"
                                    :disabled="loading"
                                    :class="[
                                        'flex-1 h-12 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2',
                                        loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5'
                                    ]"
                                >
                                    <i v-if="loading" class="pi pi-spin pi-spinner"></i>
                                    <span>{{ loading ? 'Gönderiliyor...' : 'Gönder' }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <p class="mt-6 text-center text-sm text-gray-500">
                    E-posta: <a href="mailto:info@tasibul.com" class="text-primary font-medium hover:underline">info@tasibul.com</a>
                </p>
            </div>
        </Content>
        <Footer />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Content from './components/Content.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import api from '@/api';
import { toast } from 'vue-sonner';

const form = ref({ email: '', konu: '', icerik: '' });
const errors = ref({ email: '', konu: '', icerik: '' });
const loading = ref(false);

function handleSubmit() {
    errors.value = { email: '', konu: '', icerik: '' };
    const email = (form.value.email || '').trim();
    const konu = (form.value.konu || '').trim();
    const icerik = (form.value.icerik || '').trim();

    if (!email) errors.value.email = 'E-posta zorunludur.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.value.email = 'Geçerli bir e-posta adresi girin.';
    if (!konu) errors.value.konu = 'Konu zorunludur.';
    if (!icerik) errors.value.icerik = 'İçerik zorunludur.';
    if (errors.value.email || errors.value.konu || errors.value.icerik) return;

    loading.value = true;
    api.post('/contact', { email, konu, icerik })
        .then(() => {
            toast.success('Mesajınız gönderildi.', { description: 'En kısa sürede size dönüş yapacağız.' });
            form.value = { email: '', konu: '', icerik: '' };
        })
        .catch((err) => {
            const msg = err.response?.data?.message || err.response?.data?.error || 'Gönderilemedi.';
            toast.error('Hata', { description: msg });
            const errs = err.response?.data?.errors || err.response?.data?.content?.errors;
            if (errs) {
                if (errs.email) errors.value.email = Array.isArray(errs.email) ? errs.email[0] : errs.email;
                if (errs.konu) errors.value.konu = Array.isArray(errs.konu) ? errs.konu[0] : errs.konu;
                if (errs.icerik) errors.value.icerik = Array.isArray(errs.icerik) ? errs.icerik[0] : errs.icerik;
            }
        })
        .finally(() => {
            loading.value = false;
        });
}
</script>
