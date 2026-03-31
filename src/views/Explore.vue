<template>
    <view class="explore-page">
        <view class="search">
            <SearchIsland v-model="keyword" />
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

            <view v-if="feedSections.length" class="feed-container">
                <template v-for="(section, si) in feedSections" :key="si">
                    <view v-if="section.type === 'wide'" class="feed-wide">
                        <MainPostCard :post="section.post" @open="openPost" />
                    </view>

                    <view v-else class="feed-masonry">
                        <view class="feed-column">
                            <view v-for="post in section.left" :key="post.id" class="feed-item">
                                <MainPostCard :post="post" @open="openPost" />
                            </view>
                        </view>
                        <view class="feed-column">
                            <view v-for="post in section.right" :key="post.id" class="feed-item">
                                <MainPostCard :post="post" @open="openPost" />
                            </view>
                        </view>
                    </view>
                </template>
            </view>

            <view v-else class="empty-state">
                <text class="empty-title">No postcards yet</text>
            </view>

            <AddButton class="add" @click="openCreate" />
        </view>
    </view>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import MainPostCard from '../components/MainPostCard.vue';
import AddButton from '../components/AddButton.vue';
import SearchIsland from '../components/SearchIsland.vue';
import { usePostStore } from '../stores/postStore';
import { useAppViewStore } from '../stores/appViewStore';

const activeTab = ref('Explore');

const { posts, selectPost, fetchPosts } = usePostStore();
const { openPostCreate, openPostDetail } = useAppViewStore();
const keyword = ref('');

const tabPosts = computed(() => {
    if (activeTab.value === 'Followed') {
        return posts.value.filter((_, i) => i % 2 === 0);
    }
    if (activeTab.value === 'Popular') {
        return [...posts.value].sort((a, b) => {
            const aScore = (a.images?.length || 1) + (a.content?.length || 0);
            const bScore = (b.images?.length || 1) + (b.content?.length || 0);
            return bScore - aScore;
        });
    }
    if (activeTab.value === 'Local') {
        return posts.value.filter((p) => {
            const name = (p.username || '').toLowerCase();
            return name.includes('local') || name.includes('cn') || name.includes('city');
        });
    }
    return posts.value;
});

// Build feed sections: wide cards stay full-width; other cards use 2-column masonry
const feedSections = computed(() => {
    const sections = [];
    let currentMasonry = [];

    const flushMasonry = () => {
        if (!currentMasonry.length) return;

        const left = [];
        const right = [];
        let leftHeight = 0;
        let rightHeight = 0;

        const getWeight = (post) => {
            const ratio = post.ratio || '9:16';
            if (ratio === '1:1') return 1;
            if (ratio === '16:9') return 0.56;
            return 1.78;
        };

        for (const post of currentMasonry) {
            if (leftHeight <= rightHeight) {
                left.push(post);
                leftHeight += getWeight(post);
            } else {
                right.push(post);
                rightHeight += getWeight(post);
            }
        }

        sections.push({ type: 'masonry', left, right });
        currentMasonry = [];
    };

    for (const post of tabPosts.value) {
        if ((post.ratio || '9:16') === '16:9') {
            flushMasonry();
            sections.push({ type: 'wide', post });
        } else {
            currentMasonry.push(post);
        }
    }

    flushMasonry();
    return sections;
});

const openCreate = () => openPostCreate();

const openPost = (id) => {
    selectPost(id);
    openPostDetail();
};

watch(keyword, (value) => {
    fetchPosts({ keyword: value || undefined }).catch((error) => {
        uni.showToast({ title: error.message || 'Load failed', icon: 'none' });
    });
});

onMounted(() => {
    fetchPosts().catch((error) => {
        uni.showToast({ title: error.message || 'Load failed', icon: 'none' });
    });
});
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

.feed-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    padding: 0 12px 80px;
    box-sizing: border-box;
}

.feed-wide {
    width: 100%;
}

.feed-masonry {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
    align-items: start;
}

.feed-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.feed-item {
    width: 100%;
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
    .feed-container {
        gap: 10px;
        padding: 0 8px 80px;
    }

    .feed-masonry {
        gap: 10px;
    }

    .feed-column {
        gap: 10px;
    }
}
</style>
