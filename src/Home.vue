<script setup>
import Header from './components/Header.vue';
import HeroSection from './components/HeroSection.vue';
import OrnekIlanlar from './components/OrnekIlanlar.vue';
import HeroSectionGrid from './components/HeroSectionGrid.vue';
import HowItWorks from './components/HowItWorks.vue';
import VehicleShowcase from './components/VehicleShowcase.vue';
import NearbyDrivers from './components/NearbyDrivers.vue';
import WhyChooseUs from './components/WhyChooseUs.vue';
import Testimonials from './components/Testimonials.vue';
import Footer from './components/Footer.vue';
import Content from './components/Content.vue';
</script>

<template>
    <Header />
    <HeroSection />
    <OrnekIlanlar />
    <Content>
        <div class="w-full px-4 md:px-6 lg:px-0 py-2 mt-5">
            <div class="h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        </div>
    </Content>
    <HeroSectionGrid />
    <HowItWorks />
    <VehicleShowcase />
    <NearbyDrivers />
    <WhyChooseUs />
    <Testimonials />
    <Footer />
</template>