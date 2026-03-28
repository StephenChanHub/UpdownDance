<template>
    <view class="explore-page">

        <!-- Top floating reusable modules (same position as index before) -->
        <view class="top-floating-layer">
            <UserIsland />
            <SearchIsland />
        </view>

        <view class="explore-scroll-wrapper">
            <!-- Glass Hero Header -->
            <view class="explore-glass-header">
                <text class="explore-hero-title">EXPLORE</text>
            </view>

            <view class="view-header">
            </view>

            <view class="waterfall-container">
                <view class="waterfall-column">
                    <MainPostCard v-for="post in leftColumnPosts" :key="post.id" class="waterfall-item" />
                </view>

                <view class="waterfall-column">
                    <MainPostCard v-for="post in rightColumnPosts" :key="post.id" class="waterfall-item" />
                </view>
            </view>

            <AddButton />
        </view>
    </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import MainPostCard from '../components/MainPostCard.vue';
import AddButton from '../components/AddButton.vue';
import UserIsland from '../components/UserIsland.vue';
import SearchIsland from '../components/SearchIsland.vue';

const posts = ref([
    { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 },
    { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 },
    { id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }
]);

const leftColumnPosts = computed(() => posts.value.filter((_, i) => i % 2 === 0));
const rightColumnPosts = computed(() => posts.value.filter((_, i) => i % 2 !== 0));
</script>

<style scoped>
/* ── Outer page wrapper ── */
.explore-page {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

/* ── Root scroll wrapper ── */
.explore-scroll-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 0;
    box-sizing: border-box;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Top floating layer (reuse index positioning) */
.top-floating-layer {
    position: fixed;
    top: calc(40px + env(safe-area-inset-top));
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 1000;
    display: flex;
    align-items: center;
    pointer-events: none;
}

.explore-scroll-wrapper::-webkit-scrollbar {
    display: none;
}

/* ── Glass Hero Header ── */
.explore-glass-header {
    /* Stick to top of the scroll wrapper */
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;

    width: 100%;
    height: 50px;

    display: flex;
    align-items: center;
    justify-content: center;

    /* Fully transparent frosted glass */
    background: rgba(255, 255, 255, 0.0);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);

    /* Barely-there bottom rule — pure transition-layer aesthetic */
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);

    /* Don't block taps on content sliding underneath */
    pointer-events: none;
}

.explore-hero-title {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #1c1c1e;
}

/* ── View header placeholder ── */
.view-header {
    margin-bottom: 16px;
    padding-left: 10px;
}

/* ── Waterfall layout ── */
.waterfall-container {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 12px 80px;
    box-sizing: border-box;
}

.waterfall-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.waterfall-item {
    width: 100% !important;
    margin: 0 !important;
}

@media (max-width: 600px) {
    .waterfall-container {
        gap: 10px;
        padding: 0 8px 80px;
    }

    .waterfall-column {
        gap: 10px;
    }
}
</style>
