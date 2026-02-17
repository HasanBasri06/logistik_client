<template>
    <Header />
    <div class="min-h-screen bg-gray-50 py-12">
        <Content>
            <div class="max-w-4xl mx-auto">
                <h1 class="text-4xl font-bold text-gray-900 mb-8">Yardım Merkezi</h1>
                
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Genel Bilgiler</h2>
                    <div class="prose prose-gray max-w-none">
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                            totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        </p>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Sık Sorulan Sorular</h2>
                    <div class="space-y-6">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Nasıl ilan oluşturabilirim?</h3>
                            <p class="text-gray-700 leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                            </p>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Ödeme nasıl yapılır?</h3>
                            <p class="text-gray-700 leading-relaxed">
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                                Excepteur sint occaecat cupidatat non proident.
                            </p>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">İptal ve iade politikası nedir?</h3>
                            <p class="text-gray-700 leading-relaxed">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                                totam rem aperiam, eaque ipsa quae ab illo inventore.
                            </p>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Güvenlik ve gizlilik</h3>
                            <p class="text-gray-700 leading-relaxed">
                                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
                                sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">İletişim</h2>
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p class="text-gray-700 leading-relaxed mb-6">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <button
                        @click="showContactModal = true"
                        class="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Bize Ulaşın
                    </button>
                </div>
            </div>
        </Content>
    </div>

    <!-- İletişim Modalı -->
    <div
        v-if="showContactModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="showContactModal = false"
    >
        <div class="w-[90%] max-w-[600px] bg-white rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h3 class="text-2xl font-semibold text-gray-900">İletişim Formu</h3>
                    <p class="text-sm text-gray-500 mt-1">Sorularınız için bize ulaşın</p>
                </div>
                <button
                    type="button"
                    class="text-gray-400 hover:text-gray-600 text-2xl"
                    @click="showContactModal = false"
                >
                    ✕
                </button>
            </div>

            <form @submit.prevent="handleContactSubmit" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">İsim</label>
                    <input
                        type="text"
                        v-model="contactForm.firstName"
                        :class="['input', contactErrors.firstName ? 'border-red-400' : '']"
                        placeholder="İsminiz"
                    />
                    <span v-if="contactErrors.firstName" class="text-xs text-red-500 mt-0.5">
                        {{ contactErrors.firstName }}
                    </span>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Soyisim</label>
                    <input
                        type="text"
                        v-model="contactForm.lastName"
                        :class="['input', contactErrors.lastName ? 'border-red-400' : '']"
                        placeholder="Soyisminiz"
                    />
                    <span v-if="contactErrors.lastName" class="text-xs text-red-500 mt-0.5">
                        {{ contactErrors.lastName }}
                    </span>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Şirket İsmi</label>
                    <input
                        type="text"
                        v-model="contactForm.companyName"
                        :class="['input', contactErrors.companyName ? 'border-red-400' : '']"
                        placeholder="Şirket adınız"
                    />
                    <span v-if="contactErrors.companyName" class="text-xs text-red-500 mt-0.5">
                        {{ contactErrors.companyName }}
                    </span>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Mesaj</label>
                    <textarea
                        v-model="contactForm.message"
                        :class="['input min-h-[120px] resize-none', contactErrors.message ? 'border-red-400' : '']"
                        placeholder="Mesajınızı buraya yazın..."
                        rows="5"
                    ></textarea>
                    <span v-if="contactErrors.message" class="text-xs text-red-500 mt-0.5">
                        {{ contactErrors.message }}
                    </span>
                </div>

                <div class="flex gap-3 mt-2">
                    <button
                        type="button"
                        @click="showContactModal = false"
                        class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        class="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Gönder
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import * as yup from 'yup';
import Content from './components/Content.vue';
import Header from './components/Header.vue';

const showContactModal = ref(false);

const contactForm = ref({
    firstName: "",
    lastName: "",
    companyName: "",
    message: ""
});

const contactErrors = ref({
    firstName: "",
    lastName: "",
    companyName: "",
    message: ""
});

const contactSchema = yup.object({
    firstName: yup
        .string()
        .required("İsim zorunludur."),
    lastName: yup
        .string()
        .required("Soyisim zorunludur."),
    companyName: yup
        .string()
        .required("Şirket ismi zorunludur."),
    message: yup
        .string()
        .min(10, "Mesaj en az 10 karakter olmalıdır.")
        .required("Mesaj zorunludur.")
});

const handleContactSubmit = async () => {
    contactErrors.value = {
        firstName: "",
        lastName: "",
        companyName: "",
        message: ""
    };
    try {
        await contactSchema.validate(contactForm.value, { abortEarly: false });
        // TODO: Burada gerçek iletişim API çağrısını yapabilirsin.
        console.log('İletişim formu gönderildi:', contactForm.value);
        showContactModal.value = false;
        // Formu temizle
        contactForm.value = {
            firstName: "",
            lastName: "",
            companyName: "",
            message: ""
        };
    } catch (err) {
        if (err.inner) {
            err.inner.forEach((e) => {
                if (e.path && contactErrors.value[e.path] !== undefined) {
                    contactErrors.value[e.path] = e.message;
                }
            });
        }
    }
};
</script>

<style scoped>
</style>
