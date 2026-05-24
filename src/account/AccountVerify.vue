<template>
    <div class="flex flex-col h-full overflow-y-auto">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Hesap Doğrula</h2>
        
        <div class="pr-3">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
                <div class="flex items-start gap-3">
                    <i class="pi pi-info-circle text-blue-600 mt-1" style="font-size: 20px;"></i>
                    <div>
                        <h3 class="text-base font-semibold text-blue-900 mb-2">Hesap Doğrulama Neden Önemli?</h3>
                        <p class="text-sm text-blue-800 leading-relaxed">
                            Hesabınızı doğrulayarak güvenliğinizi artırır ve platform üzerindeki tüm özelliklerden tam olarak yararlanabilirsiniz. 
                            Doğrulanmış hesaplar daha fazla güven kazanır ve daha iyi bir deneyim sunar.
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Doğrulama Durumu -->
            <div class="bg-white rounded-lg p-3 mb-6">
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-lg font-semibold text-gray-900">Doğrulama Durumu</h3>
                        <span class="text-sm font-medium text-gray-700">{{ overallProgress }}% Tamamlandı</span>
                    </div>
                    <!-- Genel Progress Bar -->
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div 
                            class="bg-primary h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                            :style="{ width: overallProgress + '%' }"
                        >
                            <span class="text-xs font-medium text-white">{{ overallProgress }}%</span>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">
                        {{ completedCount }} / {{ totalCount }} doğrulama tamamlandı
                    </p>
                </div>
                
                <div class="space-y-6">
                    <!-- E-posta Doğrulaması -->
                    <div class="">
                        <div class="flex items-center gap-3 mb-4">
                            <i 
                                :class="[
                                    'pi',
                                    verificationStatus.email ? 'pi-check-circle text-green-600' : 'pi-times-circle text-gray-400'
                                ]"
                                style="font-size: 24px;"
                            ></i>
                            <div>
                                <p class="text-sm font-medium text-gray-900">E-posta Doğrulaması</p>
                                <p :class="['text-xs', verificationStatus.email ? 'text-green-600 font-medium' : 'text-gray-500']">
                                    {{ verificationStatus.email ? 'Doğrulandı' : 'Doğrulanmadı' }}
                                </p>
                            </div>
                        </div>
                        <form
                            v-if="!verificationStatus.email"
                            class="flex flex-col gap-3"
                            @submit.prevent="verifyEmailCode"
                        >
                            <label class="text-sm font-medium text-gray-700">Doğrulama Kodu</label>
                            <div class="flex gap-2 flex-wrap">
                                <InputOtp
                                    v-model="emailVerificationCode"
                                    :length="6"
                                    :integerOnly="true"
                                    :unstyled="true"
                                    :pt="{
                                        root: { class: 'flex gap-2 flex-1 min-w-[200px]' },
                                        pcInputText: { root: { class: 'w-12 h-14 rounded-md text-lg text-center tracking-[0.4em] font-semibold border border-gray-200 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-primary/20' } }
                                    }"
                                />
                                <button
                                    type="submit"
                                    :disabled="verifyEmailLoading || !emailVerificationCode || emailVerificationCode.length !== 6"
                                    class="px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                                >
                                    <span v-if="verifyEmailLoading">Kontrol ediliyor...</span>
                                    <span v-else>Doğrula</span>
                                </button>
                            </div>
                            <p class="text-xs text-gray-500">
                                Kod almadınız mı?
                                <button
                                    type="button"
                                    :disabled="sendCodeLoading"
                                    @click="sendEmailVerificationCode"
                                    class="text-primary font-medium text-md hover:underline disabled:opacity-50"
                                >
                                    {{ sendCodeLoading ? 'Gönderiliyor...' : 'Doğrulama kodu gönder' }}
                                </button>
                            </p>
                        </form>
                    </div>
                    
                    <!-- Profil Fotoğrafı -->
                    <div class="">
                        <div class="flex items-center gap-3 mb-4">
                            <i 
                                :class="[
                                    'pi',
                                    verificationStatus.profilePhoto ? 'pi-check-circle text-green-600' : 'pi-times-circle text-gray-400'
                                ]"
                                style="font-size: 24px;"
                            ></i>
                            <div>
                                <p class="text-sm font-medium text-gray-900">Profil Fotoğrafı</p>
                                <p :class="['text-xs', verificationStatus.profilePhoto ? 'text-green-600 font-medium' : 'text-gray-500']">
                                    {{ verificationStatus.profilePhoto ? 'Doğrulandı' : 'Yüklenmedi' }}
                                </p>
                            </div>
                        </div>
                        <div v-if="!verificationStatus.profilePhoto" class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 mb-2">Profil fotoğrafınızı ekleyin</label>
                            <div v-if="profilePhotoProgress > 0 && profilePhotoProgress < 100" class="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                    class="bg-primary h-2 rounded-full transition-all duration-300"
                                    :style="{ width: profilePhotoProgress + '%' }"
                                ></div>
                            </div>
                            <div class="flex flex-col sm:flex-row items-center gap-4">
                                <div v-if="profilePhotoPreview" class="w-24 h-24 rounded-full overflow-hidden border-2 border-primary shrink-0">
                                    <img :src="profilePhotoPreview" alt="Profil önizleme" class="w-full h-full object-cover" />
                                </div>
                                <div class="relative flex-1 w-full">
                                    <input
                                        type="file"
                                        ref="profilePhotoFileInput"
                                        @change="handleProfilePhotoFile"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        class="hidden"
                                        id="profile-photo-file-input"
                                    />
                                    <label
                                        for="profile-photo-file-input"
                                        class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-primary transition-all duration-200"
                                    >
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <i class="pi pi-user text-4xl text-gray-400 mb-2"></i>
                                            <p class="mb-2 text-sm text-gray-500">
                                                <span class="font-semibold text-primary">Fotoğraf seçin</span> veya sürükleyip bırakın
                                            </p>
                                            <p class="text-xs text-gray-500">JPG, PNG, WEBP</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <p v-if="profilePhotoFileName" class="text-sm text-gray-600 flex items-center gap-2">
                                <i class="pi pi-image text-primary"></i>
                                <span>{{ profilePhotoFileName }}</span>
                            </p>
                        </div>
                    </div>
                    
                    <!-- Kimlik Doğrulaması -->
                    <div class="">
                        <div class="flex items-center gap-3 mb-4">
                            <i 
                                :class="[
                                    'pi',
                                    verificationStatus.identity ? 'pi-check-circle text-green-600' : 'pi-times-circle text-gray-400'
                                ]"
                                style="font-size: 24px;"
                            ></i>
                            <div>
                                <p class="text-sm font-medium text-gray-900">Kimlik Doğrulaması</p>
                                <p :class="['text-xs', verificationStatus.identity ? 'text-green-600 font-medium' : 'text-gray-500']">
                                    {{ verificationStatus.identity ? 'Doğrulandı' : 'Doğrulanmadı' }}
                                </p>
                            </div>
                        </div>
                        <div v-if="!verificationStatus.identity" class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 mb-2">Kimlik Belgesi Yükle</label>
                            <!-- Progress Bar -->
                            <div v-if="identityProgress > 0 && identityProgress < 100" class="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                    class="bg-primary h-2 rounded-full transition-all duration-300"
                                    :style="{ width: identityProgress + '%' }"
                                ></div>
                            </div>
                            <div class="relative">
                                <input
                                    type="file"
                                    ref="identityFileInput"
                                    @change="handleIdentityFile"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    class="hidden"
                                    id="identity-file-input"
                                />
                                <label
                                    for="identity-file-input"
                                    class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-primary transition-all duration-200"
                                >
                                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                        <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-2"></i>
                                        <p class="mb-2 text-sm text-gray-500">
                                            <span class="font-semibold text-primary">Dosya seçin</span> veya sürükleyip bırakın
                                        </p>
                                        <p class="text-xs text-gray-500">PDF, JPG, JPEG, PNG</p>
                                    </div>
                                </label>
                            </div>
                            <p v-if="identityFileName" class="text-sm text-gray-600 mt-2 flex items-center gap-2">
                                <i class="pi pi-file text-primary"></i>
                                <span>{{ identityFileName }}</span>
                            </p>
                        </div>
                    </div>
                    
                    <!-- SRC Doğrulaması -->
                    <div class="">
                        <div class="flex items-center gap-3 mb-4">
                            <i 
                                :class="[
                                    'pi',
                                    verificationStatus.src ? 'pi-check-circle text-green-600' : 'pi-times-circle text-gray-400'
                                ]"
                                style="font-size: 24px;"
                            ></i>
                            <div>
                                <p class="text-sm font-medium text-gray-900">SRC Doğrulaması</p>
                                <p :class="['text-xs', verificationStatus.src ? 'text-green-600 font-medium' : 'text-gray-500']">
                                    {{ verificationStatus.src ? 'Doğrulandı' : 'Doğrulanmadı' }}
                                </p>
                            </div>
                        </div>
                        <div v-if="!verificationStatus.src" class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 mb-2">SRC Belgesi Yükle</label>
                            <!-- Progress Bar -->
                            <div v-if="srcProgress > 0 && srcProgress < 100" class="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                    class="bg-primary h-2 rounded-full transition-all duration-300"
                                    :style="{ width: srcProgress + '%' }"
                                ></div>
                            </div>
                            <div class="relative">
                                <input
                                    type="file"
                                    ref="srcFileInput"
                                    @change="handleSrcFile"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    class="hidden"
                                    id="src-file-input"
                                />
                                <label
                                    for="src-file-input"
                                    class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-primary transition-all duration-200"
                                >
                                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                        <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-2"></i>
                                        <p class="mb-2 text-sm text-gray-500">
                                            <span class="font-semibold text-primary">Dosya seçin</span> veya sürükleyip bırakın
                                        </p>
                                        <p class="text-xs text-gray-500">PDF, JPG, JPEG, PNG</p>
                                    </div>
                                </label>
                            </div>
                            <p v-if="srcFileName" class="text-sm text-gray-600 mt-2 flex items-center gap-2">
                                <i class="pi pi-file text-primary"></i>
                                <span>{{ srcFileName }}</span>
                            </p>
                        </div>
                    </div>
                    
                    <!-- Psikoteknik Doğrulaması -->
                    <div class="">
                        <div class="flex items-center gap-3 mb-4">
                            <i 
                                :class="[
                                    'pi',
                                    verificationStatus.psychotechnical ? 'pi-check-circle text-green-600' : 'pi-times-circle text-gray-400'
                                ]"
                                style="font-size: 24px;"
                            ></i>
                            <div>
                                <p class="text-sm font-medium text-gray-900">Psikoteknik Doğrulaması</p>
                                <p :class="['text-xs', verificationStatus.psychotechnical ? 'text-green-600 font-medium' : 'text-gray-500']">
                                    {{ verificationStatus.psychotechnical ? 'Doğrulandı' : 'Doğrulanmadı' }}
                                </p>
                            </div>
                        </div>
                        <div v-if="!verificationStatus.psychotechnical" class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 mb-2">Psikoteknik Belgesi Yükle</label>
                            <!-- Progress Bar -->
                            <div v-if="psychotechnicalProgress > 0 && psychotechnicalProgress < 100" class="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                    class="bg-primary h-2 rounded-full transition-all duration-300"
                                    :style="{ width: psychotechnicalProgress + '%' }"
                                ></div>
                            </div>
                            <div class="relative">
                                <input
                                    type="file"
                                    ref="psychotechnicalFileInput"
                                    @change="handlePsychotechnicalFile"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    class="hidden"
                                    id="psychotechnical-file-input"
                                />
                                <label
                                    for="psychotechnical-file-input"
                                    class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-primary transition-all duration-200"
                                >
                                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                        <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-2"></i>
                                        <p class="mb-2 text-sm text-gray-500">
                                            <span class="font-semibold text-primary">Dosya seçin</span> veya sürükleyip bırakın
                                        </p>
                                        <p class="text-xs text-gray-500">PDF, JPG, JPEG, PNG</p>
                                    </div>
                                </label>
                            </div>
                            <p v-if="psychotechnicalFileName" class="text-sm text-gray-600 mt-2 flex items-center gap-2">
                                <i class="pi pi-file text-primary"></i>
                                <span>{{ psychotechnicalFileName }}</span>
                            </p>
                        </div>
                    </div>
                    
                    <!-- Ehliyet Bilgisi -->
                    <div class="">
                        <div class="flex items-center gap-3 mb-4">
                            <i 
                                :class="[
                                    'pi',
                                    verificationStatus.license ? 'pi-check-circle text-green-600' : 'pi-times-circle text-gray-400'
                                ]"
                                style="font-size: 24px;"
                            ></i>
                            <div>
                                <p class="text-sm font-medium text-gray-900">Ehliyet Bilgisi</p>
                                <p :class="['text-xs', verificationStatus.license ? 'text-green-600 font-medium' : 'text-gray-500']">
                                    {{ verificationStatus.license ? 'Doğrulandı' : 'Doğrulanmadı' }}
                                </p>
                            </div>
                        </div>
                        <div v-if="!verificationStatus.license" class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 mb-2">Ehliyet Belgesi Yükle</label>
                            <!-- Progress Bar -->
                            <div v-if="licenseProgress > 0 && licenseProgress < 100" class="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                    class="bg-primary h-2 rounded-full transition-all duration-300"
                                    :style="{ width: licenseProgress + '%' }"
                                ></div>
                            </div>
                            <div class="relative">
                                <input
                                    type="file"
                                    ref="licenseFileInput"
                                    @change="handleLicenseFile"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    class="hidden"
                                    id="license-file-input"
                                />
                                <label
                                    for="license-file-input"
                                    class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-primary transition-all duration-200"
                                >
                                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                        <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-2"></i>
                                        <p class="mb-2 text-sm text-gray-500">
                                            <span class="font-semibold text-primary">Dosya seçin</span> veya sürükleyip bırakın
                                        </p>
                                        <p class="text-xs text-gray-500">PDF, JPG, JPEG, PNG</p>
                                    </div>
                                </label>
                            </div>
                            <p v-if="licenseFileName" class="text-sm text-gray-600 mt-2 flex items-center gap-2">
                                <i class="pi pi-file text-primary"></i>
                                <span>{{ licenseFileName }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue-sonner';
import api from '@/api';
import { InputOtp } from 'primevue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const verificationStatus = ref({
    email: false,
    profilePhoto: false,
    identity: false,
    src: false,
    psychotechnical: false,
    license: false
});

const totalCount = 7;


async function fetchVerificationStatus() {
    try {
        const res = await api.get('/confirm-account/home');
        const data = res.data?.content;
        console.log(data);
        
        if (data?.verification) {
            verificationStatus.value = { ...verificationStatus.value, ...data.verification };
        }
    } catch (_) {
        // Oturum yoksa veya hata olursa mevcut state kalır
    }
}

onMounted(() => {
    fetchVerificationStatus();
});

const completedCount = computed(() => {
    return Object.values(verificationStatus.value).filter(status => status === true).length;
});

const overallProgress = computed(() => {
    return Math.round((completedCount.value / totalCount) * 100);
});

const profilePhotoPreview = ref('');
const profilePhotoFileName = ref('');
const profilePhotoProgress = ref(0);
const profilePhotoFileInput = ref(null);
const identityFileName = ref('');
const srcFileName = ref('');
const psychotechnicalFileName = ref('');
const licenseFileName = ref('');

const emailVerificationCode = ref('');
const sendCodeLoading = ref(false);
const verifyEmailLoading = ref(false);

const sendEmailVerificationCode = async () => {
    sendCodeLoading.value = true;
    try {
        const res = await api.post('/confirm-account/send-email-code');
        const msg = res.data?.message ?? 'Doğrulama kodu telefon numaranıza gönderildi.';
        toast.success(msg, { description: 'E-posta kutunuzu kontrol edin.', duration: 5000 });
    } catch (err) {
        const msg = err.response?.data?.message ?? err.message ?? 'Kod gönderilemedi.';
        toast.error('Hata', { description: msg, duration: 5000 });
    } finally {
        sendCodeLoading.value = false;
    }
};

const verifyEmailCode = async () => {
    if (!emailVerificationCode.value?.trim()) return;
    verifyEmailLoading.value = true;
    try {
        await api.post('/confirm-account/verify-email', { code: emailVerificationCode.value.trim() });
        await fetchVerificationStatus();
        emailVerificationCode.value = '';
        toast.success('E-posta adresiniz doğrulandı.', { duration: 5000 });
    } catch (err) {
        const msg = err.response?.data?.message ?? err.message ?? 'Doğrulama başarısız.';
        toast.error('Hata', { description: msg, duration: 5000 });
    } finally {
        verifyEmailLoading.value = false;
    }
};

const identityProgress = ref(0);
const srcProgress = ref(0);
const psychotechnicalProgress = ref(0);
const licenseProgress = ref(0);

const MAX_PROFILE_PHOTO_MB = 5;
const MAX_DOC_MB = 5;

/** Belge yükleme: API'ye gönderir, başarıda progress bar ilerler ve "Doğrulandı" gösterilir */
async function uploadDocument(type, file, progressRef) {
    if (!file) return;
    const form = new FormData();
    form.append('type', type);
    form.append('file', file);
    try {
        if (progressRef) progressRef.value = 20;
        const res = await api.post('/confirm-account/upload-document', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
                if (progressRef && e.total) progressRef.value = Math.min(99, Math.round((e.loaded / e.total) * 100));
            }
        });
        if (progressRef) progressRef.value = 100;
        if (res.data?.content?.verification) {
            Object.assign(verificationStatus.value, res.data.content.verification);
        }
        await fetchVerificationStatus();
        if (type === 'profile_image') {
            await authStore.refreshUser();
        }
        toast.success('Belge yüklendi.', { description: 'Doğrulama durumunuz güncellendi.', duration: 5000 });
    } catch (err) {
        const msg = err.response?.data?.message ?? err.message ?? 'Yükleme başarısız.';
        toast.error('Hata', { description: msg, duration: 5000 });
    } finally {
        if (progressRef) progressRef.value = 0;
    }
}

const handleProfilePhotoFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        toast.error('Geçersiz dosya türü. Sadece JPG, PNG veya WEBP yükleyebilirsiniz.', { duration: 5000 });
        return;
    }
    if (file.size > MAX_PROFILE_PHOTO_MB * 1024 * 1024) {
        toast.error(`Profil fotoğrafı en fazla ${MAX_PROFILE_PHOTO_MB}MB olabilir.`, { duration: 5000 });
        return;
    }
    profilePhotoFileName.value = file.name;
    profilePhotoPreview.value = URL.createObjectURL(file);
    await uploadDocument('profile_image', file, profilePhotoProgress);
    profilePhotoFileName.value = '';
    profilePhotoPreview.value = '';
};

const handleIdentityFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_DOC_MB * 1024 * 1024) {
        toast.error(`Dosya en fazla ${MAX_DOC_MB}MB olabilir.`, { duration: 5000 });
        return;
    }
    identityFileName.value = file.name;
    await uploadDocument('id_image', file, identityProgress);
    identityFileName.value = '';
};

const handleSrcFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_DOC_MB * 1024 * 1024) {
        toast.error(`Dosya en fazla ${MAX_DOC_MB}MB olabilir.`, { duration: 5000 });
        return;
    }
    srcFileName.value = file.name;
    await uploadDocument('src_doc', file, srcProgress);
    srcFileName.value = '';
};

const handlePsychotechnicalFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_DOC_MB * 1024 * 1024) {
        toast.error(`Dosya en fazla ${MAX_DOC_MB}MB olabilir.`, { duration: 5000 });
        return;
    }
    psychotechnicalFileName.value = file.name;
    await uploadDocument('psikoteknik_doc', file, psychotechnicalProgress);
    psychotechnicalFileName.value = '';
};

const handleLicenseFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_DOC_MB * 1024 * 1024) {
        toast.error(`Dosya en fazla ${MAX_DOC_MB}MB olabilir.`, { duration: 5000 });
        return;
    }
    licenseFileName.value = file.name;
    await uploadDocument('driving_licance_doc', file, licenseProgress);
    licenseFileName.value = '';
};
</script>
