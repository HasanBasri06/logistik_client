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
                                <p class="text-xs text-gray-500">{{ verificationStatus.email ? 'Doğrulandı' : 'Doğrulanmadı' }}</p>
                            </div>
                        </div>
                        <div v-if="!verificationStatus.email" class="flex flex-col gap-3">
                            <label class="text-sm font-medium text-gray-700">Doğrulama Kodu</label>
                            <div class="flex gap-2 flex-wrap">
                                <input
                                    v-model="emailVerificationCode"
                                    type="text"
                                    placeholder="E-postanıza gelen doğrulama kodunu girin"
                                    maxlength="6"
                                    class="input flex-1 min-w-[200px]"
                                />
                                <button
                                    type="button"
                                    :disabled="verifyEmailLoading"
                                    @click="verifyEmailCode"
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
                                    class="text-primary font-medium hover:underline disabled:opacity-50"
                                >
                                    {{ sendCodeLoading ? 'Gönderiliyor...' : 'Tekrar kod gönder' }}
                                </button>
                            </p>
                        </div>
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
                                <p class="text-xs text-gray-500">{{ verificationStatus.profilePhoto ? 'Yüklendi' : 'Yüklenmedi' }}</p>
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
                                            <p class="text-xs text-gray-500">JPG, PNG, WEBP (MAX. 5MB)</p>
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
                                <p class="text-xs text-gray-500">{{ verificationStatus.identity ? 'Doğrulandı' : 'Doğrulanmadı' }}</p>
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
                                        <p class="text-xs text-gray-500">PDF, JPG, JPEG, PNG (MAX. 10MB)</p>
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
                                <p class="text-xs text-gray-500">{{ verificationStatus.src ? 'Doğrulandı' : 'Doğrulanmadı' }}</p>
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
                                        <p class="text-xs text-gray-500">PDF, JPG, JPEG, PNG (MAX. 10MB)</p>
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
                                <p class="text-xs text-gray-500">{{ verificationStatus.psychotechnical ? 'Doğrulandı' : 'Doğrulanmadı' }}</p>
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
                                        <p class="text-xs text-gray-500">PDF, JPG, JPEG, PNG (MAX. 10MB)</p>
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
                                <p class="text-xs text-gray-500">{{ verificationStatus.license ? 'Doğrulandı' : 'Doğrulanmadı' }}</p>
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
                                        <p class="text-xs text-gray-500">PDF, JPG, JPEG, PNG (MAX. 10MB)</p>
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
import { ref, computed } from 'vue';

const verificationStatus = ref({
    email: false,
    profilePhoto: false,
    identity: false,
    src: false,
    psychotechnical: false,
    license: false
});

const totalCount = 6;

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

const sendEmailVerificationCode = () => {
    sendCodeLoading.value = true;
    // TODO: API - e-posta doğrulama kodu gönder
    setTimeout(() => {
        sendCodeLoading.value = false;
    }, 1000);
};

const verifyEmailCode = () => {
    if (!emailVerificationCode.value?.trim()) return;
    verifyEmailLoading.value = true;
    // TODO: API - kodu doğrula
    setTimeout(() => {
        verificationStatus.value.email = true;
        verifyEmailLoading.value = false;
        emailVerificationCode.value = '';
    }, 800);
};

const identityProgress = ref(0);
const srcProgress = ref(0);
const psychotechnicalProgress = ref(0);
const licenseProgress = ref(0);

const MAX_PROFILE_PHOTO_MB = 5;

const handleProfilePhotoFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        return;
    }
    if (file.size > MAX_PROFILE_PHOTO_MB * 1024 * 1024) {
        return;
    }
    profilePhotoFileName.value = file.name;
    profilePhotoPreview.value = URL.createObjectURL(file);
    profilePhotoProgress.value = 0;

    const interval = setInterval(() => {
        profilePhotoProgress.value += 10;
        if (profilePhotoProgress.value >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                verificationStatus.value.profilePhoto = true;
                profilePhotoProgress.value = 0;
            }, 500);
        }
    }, 200);

    // TODO: API'ye profil fotoğrafı yükleme
};

const handleIdentityFile = (event) => {
    const file = event.target.files[0];
    if (file) {
        identityFileName.value = file.name;
        identityProgress.value = 0;
        
        // Simüle edilmiş progress
        const interval = setInterval(() => {
            identityProgress.value += 10;
            if (identityProgress.value >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    verificationStatus.value.identity = true;
                    identityProgress.value = 0;
                }, 500);
            }
        }, 200);
        
        console.log('Kimlik belgesi yüklendi:', file.name);
        // TODO: API'ye dosya yükleme
    }
};

const handleSrcFile = (event) => {
    const file = event.target.files[0];
    if (file) {
        srcFileName.value = file.name;
        srcProgress.value = 0;
        
        // Simüle edilmiş progress
        const interval = setInterval(() => {
            srcProgress.value += 10;
            if (srcProgress.value >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    verificationStatus.value.src = true;
                    srcProgress.value = 0;
                }, 500);
            }
        }, 200);
        
        console.log('SRC belgesi yüklendi:', file.name);
        // TODO: API'ye dosya yükleme
    }
};

const handlePsychotechnicalFile = (event) => {
    const file = event.target.files[0];
    if (file) {
        psychotechnicalFileName.value = file.name;
        psychotechnicalProgress.value = 0;
        
        // Simüle edilmiş progress
        const interval = setInterval(() => {
            psychotechnicalProgress.value += 10;
            if (psychotechnicalProgress.value >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    verificationStatus.value.psychotechnical = true;
                    psychotechnicalProgress.value = 0;
                }, 500);
            }
        }, 200);
        
        console.log('Psikoteknik belgesi yüklendi:', file.name);
        // TODO: API'ye dosya yükleme
    }
};

const handleLicenseFile = (event) => {
    const file = event.target.files[0];
    if (file) {
        licenseFileName.value = file.name;
        licenseProgress.value = 0;
        
        // Simüle edilmiş progress
        const interval = setInterval(() => {
            licenseProgress.value += 10;
            if (licenseProgress.value >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    verificationStatus.value.license = true;
                    licenseProgress.value = 0;
                }, 500);
            }
        }, 200);
        
        console.log('Ehliyet belgesi yüklendi:', file.name);
        // TODO: API'ye dosya yükleme
    }
};
</script>
