<template>
    <view class="explore-page">
        <view class="search">
            <SearchIsland />
        </view>

        <view class="explore-scroll-wrapper">
            <view class="explore-glass-header">
                <view class="explore-tabs">
                    <text class="explore-tab" :class="{ active: activeTab === 'Explore' }"
                        @click="activeTab = 'Explore'">
                        Explore
                    </text>
                    <text class="explore-tab" :class="{ active: activeTab === 'Followed' }"
                        @click="activeTab = 'Followed'">
                        Followed
                    </text>
                    <text class="explore-tab" :class="{ active: activeTab === 'Popular' }"
                        @click="activeTab = 'Popular'">
                        Popular
                    </text>
                    <text class="explore-tab" :class="{ active: activeTab === 'Local' }" @click="activeTab = 'Local'">
                        Local
                    </text>
                </view>
            </view>

            <view class="view-header"></view>

            <view v-if="posts.length" class="waterfall-container">
                <view class="waterfall-column">
                    <MainPostCard v-for="post in leftColumnPosts" :key="post.id" :post="post" class="waterfall-item"
                        @open="openPost" />
                </view>

                <view class="waterfall-column">
                    <MainPostCard v-for="post in rightColumnPosts" :key="post.id" :post="post" class="waterfall-item"
                        @open="openPost" />
                </view>
            </view>

            <view v-else class="empty-state">

                <text class="empty-title">No postcards yet</text>

            </view>

            <AddButton class="add" @click="openCreate" />
        </view>
    </view>
</template>

<script setup>
import { computed, ref } from 'vue';
import MainPostCard from '../components/MainPostCard.vue';
import AddButton from '../components/AddButton.vue';
import SearchIsland from '../components/SearchIsland.vue';
import { usePostStore } from '../stores/postStore';
import { useAppViewStore } from '../stores/appViewStore';

const activeTab = ref('Explore');

const { posts, selectPost } = usePostStore();
const { openPostCreate, openPostDetail } = useAppViewStore();

const leftColumnPosts = computed(() => posts.value.filter((_, i) => i % 2 === 0));
const rightColumnPosts = computed(() => posts.value.filter((_, i) => i % 2 !== 0));

const openCreate = () => {
    openPostCreate();
};

const openPost = (id) => {
    selectPost(id);
    openPostDetail();
};
</script>

<style scoped>
.explore-page {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.add {
    top: 70%;
}

.explore-scroll-wrapper {
    top: 0;
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: calc(env(safe-area-inset-top) + 58px) 0 0;
    box-sizing: border-box;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.search {
    position: fixed;
    top: calc(5% + env(safe-area-inset-top));
    left: 0;
    width: 100%;
    height: 50px;
    z-index: 1000;
    display: flex;
    align-items: center;
    pointer-events: none;
}

.explore-scroll-wrapper::-webkit-scrollbar {
    display: none;
}

.explore-glass-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    width: 100%;
    height: calc(env(safe-area-inset-top) + 50px);
    padding-top: env(safe-area-inset-top);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 8px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    pointer-events: none;
    touch-action: none;
}

.explore-tabs {
    display: flex;
    margin-right: 0%;
    gap: 20px;
    pointer-events: auto;
}

.explore-tab {
    font-size: 24px;
    font-weight: 500;
    color: #c7c7cc;
    transition: color 0.25s ease, font-weight 0.25s ease, transform 0.25s ease;
}

.explore-tab.active {
    color: #1c1c1e;
    font-weight: 700;
}

.view-header {
    margin-bottom: 16px;
    padding-left: 10px;
}

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

.empty-state {
    min-height: calc(100% - 80px);
    padding: 84px 24px 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}



.empty-title {
    margin-top: 18px;
    font-size: 22px;
    font-weight: 700;
    color: #1c1c1e;
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
