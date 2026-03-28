<template>
    <view class="store-page">
        <view class="store-header glass-island">
            <text class="store-title">Store</text>
            <view class="search-box">
                <text class="search-icon">🔍</text>
                <text class="search-text">Search product</text>
            </view>
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
    padding: 78px 14px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: hidden;
}

.glass-island {
    background: rgba(255, 255, 255, 0.68);
    backdrop-filter: blur(24px) saturate(145%);
    -webkit-backdrop-filter: blur(24px) saturate(145%);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.store-header {
    padding: 12px;
}

.store-title {
    font-size: 22px;
    font-weight: 700;
    color: #1c1c1e;
}

.search-box {
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 14px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.search-icon {
    font-size: 14px;
}

.search-text {
    color: #8e8e93;
    font-size: 13px;
}

.category-row {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 2px;
}

.category-pill {
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.62);
    color: #6d6d72;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.56);
}

.category-pill.active {
    color: #fff;
    background: #007aff;
    border-color: #007aff;
}

.product-scroll {
    flex: 1;
    min-height: 0;
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