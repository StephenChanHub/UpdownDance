<template>
    <view class="store-page">
        <view class="store-banner glass-island">
            <swiper class="banner-swiper" circular autoplay :interval="3200" :duration="500" indicator-dots
                indicator-color="rgba(255,255,255,0.45)" indicator-active-color="#ffffff">
                <swiper-item v-for="item in bannerSlides" :key="item.id">
                    <view class="banner-slide" :style="{ background: item.bg }">
                        <text class="banner-kicker">{{ item.kicker }}</text>
                        <text class="banner-title">{{ item.title }}</text>
                        <text class="banner-subtitle">{{ item.subtitle }}</text>
                    </view>
                </swiper-item>
            </swiper>
        </view>

        <view class="category-row">
            <view v-for="category in categories" :key="category" class="category-pill"
                :class="{ active: activeCategory === category }" @click="activeCategory = category">
                <text>{{ category }}</text>
            </view>
        </view>

        <scroll-view class="product-scroll" scroll-y>
            <view class="product-grid">
                <view v-for="product in filteredProducts" :key="product.id" class="product-card">
                    <view class="product-thumb">
                        <text class="thumb-text">{{ product.tag }}</text>
                    </view>
                    <text class="product-name">{{ product.name }}</text>
                    <view class="product-bottom">
                        <text class="product-price">${{ product.price }}</text>
                        <view class="buy-btn">
                            <text>Buy</text>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import { computed, ref } from 'vue';

const categories = ['All', 'Digital', 'Lifestyle', 'Accessory'];
const activeCategory = ref('All');

const bannerSlides = [
    {
        id: 1,
        kicker: 'FLASH DROP',
        title: 'Creator Kit 2026',
        subtitle: 'Limited accessories curated for mobile creators',
        bg: 'linear-gradient(135deg, #0f3460 0%, #1654c0 55%, #4cc9f0 100%)',
    },
    {
        id: 2,
        kicker: 'DIGITAL PICK',
        title: 'Preset Weekend Pack',
        subtitle: 'Cinematic LUTs and social-ready color styles',
        bg: 'linear-gradient(135deg, #3a0ca3 0%, #7209b7 45%, #f72585 100%)',
    },
    {
        id: 3,
        kicker: 'LIFESTYLE',
        title: 'Desk Upgrade Sale',
        subtitle: 'Lighting and workflow gear for your daily setup',
        bg: 'linear-gradient(135deg, #2b2d42 0%, #5f0f40 55%, #9a031e 100%)',
    },
];

const products = ref([
    { id: 1, name: 'Phone Lens Kit', price: 39, category: 'Accessory', tag: 'Lens' },
    { id: 2, name: 'Mini Tripod', price: 29, category: 'Accessory', tag: 'Tripod' },
    { id: 3, name: 'Focus Lamp', price: 59, category: 'Lifestyle', tag: 'Lamp' },
    { id: 4, name: 'Creator Desk Mat', price: 24, category: 'Lifestyle', tag: 'Desk' },
    { id: 5, name: 'Cloud Storage Pro', price: 12, category: 'Digital', tag: 'Cloud' },
    { id: 6, name: 'Preset Bundle', price: 19, category: 'Digital', tag: 'Preset' },
]);

const filteredProducts = computed(() => {
    if (activeCategory.value === 'All') return products.value;
    return products.value.filter((item) => item.category === activeCategory.value);
});
</script>

<style scoped>
.store-page {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: calc(env(safe-area-inset-top) + 190px) 14px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: hidden;
    position: relative;
}

.glass-island {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(24px) saturate(145%);
    -webkit-backdrop-filter: blur(24px) saturate(145%);
    border-radius: 24px;
    border: 0.5px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.store-banner {
    position: fixed;
    top: calc(10px + env(safe-area-inset-top));
    left: 14px;
    right: 14px;
    z-index: 100;
    height: 170px;
    overflow: hidden;
}

.banner-swiper {
    width: 100%;
    height: 100%;
}

.banner-slide {
    width: 100%;
    height: 100%;
    padding: 18px 18px 26px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    color: #fff;
}

.banner-kicker {
    font-size: 11px;
    letter-spacing: 0.14em;
    opacity: 0.78;
    font-weight: 700;
}

.banner-title {
    margin-top: 8px;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.1;
}

.banner-subtitle {
    margin-top: 8px;
    font-size: 13px;
    line-height: 1.35;
    opacity: 0.9;
    max-width: 85%;
}

.category-row {
    position: fixed;
    top: calc(env(safe-area-inset-top) + 188px);
    left: 14px;
    right: 14px;
    z-index: 120;
    display: flex;
    gap: 8px;
    overflow-x: auto;
    white-space: nowrap;
    padding: 8px 10px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(18px) saturate(150%);
    -webkit-backdrop-filter: blur(18px) saturate(150%);
    border: 1px solid rgba(255, 255, 255, 0.45);
    border-radius: 999px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.category-row::-webkit-scrollbar {
    display: none;
}

.category-pill {
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.5);
    color: #6d6d72;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.5);
}

.category-pill.active {
    color: #fff;
    background: #007aff;
    border-color: #007aff;
}

.product-scroll {
    flex: 1;
    min-height: 0;
    padding-top: 52px;
    box-sizing: border-box;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    padding-bottom: 12px;
}

.product-card {
    background: #fff;
    border-radius: 16px;
    padding: 10px;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
}

.product-thumb {
    height: 88px;
    border-radius: 12px;
    background: linear-gradient(135deg, #eef4ff, #dce9ff);
    display: flex;
    align-items: center;
    justify-content: center;
}

.thumb-text {
    font-size: 12px;
    color: #2f5ea8;
    font-weight: 700;
}

.product-name {
    margin-top: 8px;
    font-size: 13px;
    color: #1c1c1e;
    font-weight: 600;
}

.product-bottom {
    margin-top: auto;
    padding-top: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.product-price {
    font-size: 14px;
    font-weight: 700;
    color: #007aff;
}

.buy-btn {
    background: rgba(0, 122, 255, 0.12);
    color: #007aff;
    border-radius: 10px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 700;
}
</style>